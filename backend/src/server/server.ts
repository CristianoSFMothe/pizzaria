import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT! || 33333;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
