import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import { AppError } from "./errors/AppError";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_: Request, res: Response) => {
  res.status(200).json(swaggerSpec);
});
app.use(router);

app.use((error: Error, _: Request, res: Response, __: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT! || 3333;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
