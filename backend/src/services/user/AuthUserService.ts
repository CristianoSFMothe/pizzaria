import { compare } from "bcryptjs";
import prismaClient from "../../prisma/index";
import { sign } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";

interface AuthUserServiceProps {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthUserServiceProps) {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRETE as string,
      {
        subject: user.id,
        expiresIn: "30d",
      },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }
}

export { AuthUserService };
