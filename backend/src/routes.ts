import { Router, Request, Response } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchema";
import {
  authUserSchema,
  createUserSchema,
  updateUserRoleSchema,
} from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailsUserController } from "./controllers/user/DetailsUserController";
import { UpdateUserRoleController } from "./controllers/user/UpdateUserRoleController";
import { ListUsersController } from "./controllers/user/ListUsersController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { isAdminOrMaster } from "./middlewares/isAdminOrMaster";
import { isMaster } from "./middlewares/isMaster";
import {
  createCategorySchema,
  removeCategorySchema,
} from "./schemas/categorySchema";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { RemoveCategoryController } from "./controllers/category/RemoveCategoryController";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListProductController } from "./controllers/product/ListProductController";
import { ListProductByCategoryController } from "./controllers/product/ListProductByCategoryController";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import {
  createProductSchema,
  listProductByCategorySchema,
  listProductSchema,
} from "./schemas/productSchema";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import {
  addItemSchema,
  createOrderSchema,
  deleteOrderSchema,
  detailOrderSchema,
  finishOrderSchema,
  removeItemSchema,
  sendOrderSchema,
} from "./schemas/orderSchema";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { AddItemController } from "./controllers/order/AddItemOrderController";
import { RemoveItemOrderController } from "./controllers/order/RemoveItemOrderController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController";

const router = Router();
const upload = multer(uploadConfig);

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

router.get(
  "/users",
  isAuthenticated,
  isAdminOrMaster,
  new ListUsersController().handle,
);

router.put(
  "/users/role",
  isAuthenticated,
  isMaster,
  validateSchema(updateUserRoleSchema),
  new UpdateUserRoleController().handle,
);

// Category routes
router.get("/category", isAuthenticated, new ListCategoryController().handle);

router.post(
  "/category",
  isAuthenticated,
  isAdminOrMaster,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

router.delete(
  "/category/remove",
  isAuthenticated,
  isAdminOrMaster,
  validateSchema(removeCategorySchema),
  new RemoveCategoryController().handle,
);

// Product by Category route
router.get(
  "/category/product",
  isAuthenticated,
  validateSchema(listProductByCategorySchema),
  new ListProductByCategoryController().handle,
);

// Order routes
router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);

router.get("/orders", isAuthenticated, new ListOrdersController().handle);

router.post(
  "/order/add",
  isAuthenticated,
  validateSchema(addItemSchema),
  new AddItemController().handle,
);

router.delete(
  "/order/remove",
  isAuthenticated,
  validateSchema(removeItemSchema),
  new RemoveItemOrderController().handle,
);

router.get(
  "/order/detail",
  isAuthenticated,
  validateSchema(detailOrderSchema),
  new DetailOrderController().handle,
);

router.put(
  "/order/send",
  isAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle,
);

router.put(
  "/order/finish",
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle,
);

router.delete(
  "/order",
  isAuthenticated,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle,
);

// Product routes
router.post(
  "/product",
  isAuthenticated,
  isAdminOrMaster,
  upload.single("file"),
  validateSchema(createProductSchema),
  new CreateProductController().handle,
);

router.get(
  "/product",
  isAuthenticated,
  validateSchema(listProductSchema),
  new ListProductController().handle,
);

router.delete(
  "/product",
  isAuthenticated,
  isAdminOrMaster,
  new DeleteProductController().handle,
);

export { router };
