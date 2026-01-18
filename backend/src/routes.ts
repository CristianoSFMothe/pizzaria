import { Router, Request, Response } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailsUserController } from "./controllers/user/DetailsUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";

const router = Router();

router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);

router.post(
  "/session",
  validateSchema(authUserSchema),
  new AuthUserController().handle,
);

router.get("/me", isAuthenticated, new DetailsUserController().handle);

router.post(
  "/category",
  isAuthenticated,
  new CreateCategoryController().handle,
);

export { router };
