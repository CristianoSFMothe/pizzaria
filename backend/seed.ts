import "dotenv/config";
import { hash } from "bcryptjs";
import prismaClient from "./src/prisma";
import { AppError } from "./src/errors/AppError";

const masterName = process.env.MASTER_NAME ?? "Master";
const masterEmail = process.env.MASTER_EMAIL;
const masterPassword = process.env.MASTER_PASSWORD;

async function ensureMasterUser(): Promise<void> {
  if (!masterEmail || !masterPassword) {
    throw new AppError(
      "Defina as variáveis MASTER_EMAIL e MASTER_PASSWORD no .env",
      500,
    );
  }

  const existingMaster = await prismaClient.user.findFirst({
    where: {
      role: "MASTER",
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (existingMaster) {
    console.log(
      `Usuário master já existe (${existingMaster.email}). Nenhuma ação necessária.`,
    );
    return;
  }

  const emailInUse = await prismaClient.user.findFirst({
    where: {
      email: masterEmail,
    },
    select: {
      id: true,
    },
  });

  if (emailInUse) {
    throw new AppError("E-mail já cadastrado para outro usuário", 409);
  }

  const passwordHash = await hash(masterPassword, 10);

  const user = await prismaClient.user.create({
    data: {
      name: masterName,
      email: masterEmail,
      password: passwordHash,
      role: "MASTER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  console.log("Usuário master criado com sucesso:", user);
}

ensureMasterUser()
  .catch((error) => {
    if (error instanceof AppError) {
      console.error(error.message);
      process.exitCode = 1;
      return;
    }

    console.error("Erro ao criar usuário master:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
