import express, {Request, Response} from "express";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello Wrd!");
});

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("This is an API");
})

app.get("/rim-world", (req: Request, res: Response) => {
  res.status(200).send("This is a rim planet");
})

app.get("/healthcheck", (req, res) => {
  const mongooseState = mongoose.connection.readyState;

  if (mongooseState === 1) {
    res.status(200).send("Alive");
  }
});

export default app
