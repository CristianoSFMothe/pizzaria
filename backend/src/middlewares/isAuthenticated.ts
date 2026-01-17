import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      error: "Usuário não autenticado",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(
      token!,
      process.env.JWT_SECRETE as string,
    ) as Payload;

    req.userId = sub;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }
};
