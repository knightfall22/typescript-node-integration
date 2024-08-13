import app from "./app.js"

import mongoose from "mongoose";
import http from "http"

const server = http.createServer(app);
const port = process.env.PORT || 3000

mongoose
  .connect("mongodb://mongo:27017/")
  .then(() => {
    console.log("Connected to MongoDB");

    server.listen(port, () => {
      console.log(`App listening on ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//Process management
process.on('SIGINT', function onSigint() {
    console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
    shutdown();
  });
  
  // quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
    console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
    shutdown();
  })
  

function shutdown() {
    server.close(err => {
       if (err) {
        process.exit(1)
       }  
    })
    mongoose.disconnect().then(res => {
      console.log("Process disconnected from mongoose");
    }).catch(error => {
      console.log("error has occured");
      process.exit(1)
    })
  }

