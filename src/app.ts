import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";
import { UserRouter, AuthRouter, FileRouter } from "./routes";

export const app = express();


app.disable("x-powered-by");
app.use(json());
app.use(cors());
app.use(cookieParser());

app.use("/api/users", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/files", FileRouter);


