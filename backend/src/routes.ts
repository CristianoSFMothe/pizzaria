import { Router, Request, Response } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailsUserController } from "./controllers/user/DetailsUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { isAdmin } from "./middlewares/isAdmin";
import { createCategorySchema } from "./schemas/categorySchema";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
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

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Cria usuario
 *     description: Cria um usuario com role STAFF por padrao.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       "201":
 *         description: Usuario criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "409":
 *         description: Email ja cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);

/**
 * @openapi
 * /session:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Autentica usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       "200":
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Credenciais invalidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/session",
  validateSchema(authUserSchema),
  new AuthUserController().handle,
);

/**
 * @openapi
 * /me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Detalha o usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Dados do usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me", isAuthenticated, new DetailsUserController().handle);

// Category routes
/**
 * @openapi
 * /category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Lista categorias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/category", isAuthenticated, new ListCategoryController().handle);

/**
 * @openapi
 * /category:
 *   post:
 *     tags:
 *       - Category
 *     summary: Cria categoria
 *     description: Requer usuario com role ADMIN.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       "201":
 *         description: Categoria criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

// Product by Category route
/**
 * @openapi
 * /category/product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Lista produtos por categoria
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Lista de produtos por categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductWithCategory'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: Categoria nao encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/category/product",
  isAuthenticated,
  validateSchema(listProductByCategorySchema),
  new ListProductByCategoryController().handle,
);

// Order routes
/**
 * @openapi
 * /order:
 *   post:
 *     tags:
 *       - Order
 *     summary: Cria pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       "201":
 *         description: Pedido criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Lista pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: draft
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       "200":
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderDetailResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/orders", isAuthenticated, new ListOrdersController().handle);

/**
 * @openapi
 * /order/add:
 *   post:
 *     tags:
 *       - Order
 *     summary: Adiciona item ao pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemRequest'
 *     responses:
 *       "201":
 *         description: Item criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddItemResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: Pedido ou produto nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/order/add",
  isAuthenticated,
  validateSchema(addItemSchema),
  new AddItemController().handle,
);

/**
 * @openapi
 * /order/remove:
 *   delete:
 *     tags:
 *       - Order
 *     summary: Remove item do pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Item removido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: Item nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/order/remove",
  isAuthenticated,
  validateSchema(removeItemSchema),
  new RemoveItemOrderController().handle,
);

/**
 * @openapi
 * /order/detail:
 *   get:
 *     tags:
 *       - Order
 *     summary: Detalha pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Detalhes do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetailResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: Pedido nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/order/detail",
  isAuthenticated,
  validateSchema(detailOrderSchema),
  new DetailOrderController().handle,
);

/**
 * @openapi
 * /order/send:
 *   put:
 *     tags:
 *       - Order
 *     summary: Envia pedido
 *     description: Atualiza draft para false e define o nome do pedido.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOrderRequest'
 *     responses:
 *       "200":
 *         description: Pedido enviado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: Pedido nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/order/send",
  isAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle,
);

/**
 * @openapi
 * /order/finish:
 *   put:
 *     tags:
 *       - Order
 *     summary: Finaliza pedido
 *     description: Atualiza draft para true.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinishOrderRequest'
 *     responses:
 *       "200":
 *         description: Pedido finalizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: Pedido nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/order/finish",
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle,
);

/**
 * @openapi
 * /order:
 *   delete:
 *     tags:
 *       - Order
 *     summary: Deleta pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Pedido deletado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "404":
 *         description: Pedido nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/order",
  isAuthenticated,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle,
);

// Product routes
/**
 * @openapi
 * /product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Cria produto
 *     description: Requer usuario com role ADMIN. Envia imagem via multipart.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, description, categoryId, file]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *                 description: Apenas numeros
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBase'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  validateSchema(createProductSchema),
  new CreateProductController().handle,
);

/**
 * @openapi
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Lista produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: disabled
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       "200":
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductWithCategory'
 *       "400":
 *         description: Erro de validacao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/product",
  isAuthenticated,
  validateSchema(listProductSchema),
  new ListProductController().handle,
);

/**
 * @openapi
 * /product:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Desativa produto
 *     description: Requer usuario com role ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Produto desativado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       "401":
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/product",
  isAuthenticated,
  isAdmin,
  new DeleteProductController().handle,
);

export { router };
