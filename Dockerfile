FROM node:20.16.0-slim as base

ENV PORT 80
EXPOSE 80

ENV NODE_ENV=production

RUN apt-get update -qq && apt-get install -qy \ 
    tini \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update -qq && apt-get install -qy \ 
    ca-certificates \
    bzip2 \
    curl \
    libfontconfig \
    --no-install-recommends

WORKDIR /app
COPY package*.json ./ 


RUN npm config list && npm ci && npm cache clean --force



# COPY . .

ENV PATH /app/node_modules/.bin:$PATH
ENTRYPOINT ["/usr/bin/tini", "--"]


FROM base as dev

ENV NODE_ENV=development

RUN npm config list && npm install -- && npm cache clean --force

CMD ["ts-node-dev", "--respawn", "--transpile-only",  "server.ts"]

FROM dev as dev_test 

CMD ["npm", "run","con_test"]

FROM dev_test as test
COPY . .
RUN npm run test

FROM test as pre-prod
RUN rm -rf __tests__ && rm -rf ./node_modules

FROM base as prod
COPY --from=pre-prod /app /app
RUN npx tsc
HEALTHCHECK CMD curl http://127.0.0.1/healthcheck || exit 1
USER node
CMD ["node", "dist/server.js"]
