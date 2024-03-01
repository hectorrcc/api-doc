import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/postgresDB";
import "dotenv/config";


const app = express();
const port = process.env.PORT;

app.use(json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server start in de port ${port}`);
  connectDB();
});
