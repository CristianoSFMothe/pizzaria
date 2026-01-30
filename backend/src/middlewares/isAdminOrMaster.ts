import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma/index";

export const isAdminOrMaster = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Usuário não ter permissão" });

    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    res.status(401).json({ error: "Usuário não ter permissão" });

    return;
  }

  if (user.role !== "ADMIN" && user.role !== "MASTER") {
    res.status(401).json({ error: "Usuário não ter permissão" });

    return;
  }

  next();
};
