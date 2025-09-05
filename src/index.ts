import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import connectDB from "./db/db";
import config from "./config/config";

const app: Express = express();
connectDB();

app.use(cors());
app.use(express.json());

const PORT = config.get('server').port || 6000;
app.listen(PORT, () => console.log(`Server is now listening to port ${PORT}`));
