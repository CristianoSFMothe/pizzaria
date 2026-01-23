import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Sistema de Pizzaria API",
    version: "1.0.0",
    description:
      "API REST para gestao de usuarios, categorias, produtos e pedidos.",
  },
  servers: [
    {
      url: "http://localhost:3333",
      description: "Local",
    },
  ],
  tags: [
    { name: "Auth", description: "Autenticacao e usuarios" },
    { name: "Category", description: "Categorias" },
    { name: "Product", description: "Produtos" },
    { name: "Order", description: "Pedidos" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Erro interno do servidor" },
        },
      },
      ValidationErrorItem: {
        type: "object",
        properties: {
          field: { type: "string", example: "body.email" },
          message: { type: "string", example: "Email invalido" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Erro de validacao" },
          details: {
            type: "array",
            items: { $ref: "#/components/schemas/ValidationErrorItem" },
          },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Joao Silva" },
          email: { type: "string", example: "joao@example.com" },
          password: { type: "string", example: "senha123" },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "Joao Silva" },
          email: { type: "string", example: "joao@example.com" },
          role: { type: "string", enum: ["STAFF", "ADMIN"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "joao@example.com" },
          password: { type: "string", example: "senha123" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "Joao Silva" },
          email: { type: "string", example: "joao@example.com" },
          role: { type: "string", enum: ["STAFF", "ADMIN"] },
          token: { type: "string", example: "jwt" },
        },
      },
      CreateCategoryRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Pizzas Doces" },
        },
      },
      CategoryResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "Pizzas Doces" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ProductBase: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "Pizza Calabresa" },
          description: {
            type: "string",
            example: "Pizza com calabresa e cebola",
          },
          price: { type: "integer", example: 35 },
          categoryId: { type: "string", example: "uuid" },
          banner: { type: "string", example: "https://..." },
          disabled: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ProductWithCategory: {
        allOf: [
          { $ref: "#/components/schemas/ProductBase" },
          {
            type: "object",
            properties: {
              category: {
                type: "object",
                properties: {
                  id: { type: "string", example: "uuid" },
                  name: { type: "string", example: "Pizzas Salgadas" },
                },
              },
            },
          },
        ],
      },
      CreateOrderRequest: {
        type: "object",
        required: ["table"],
        properties: {
          table: { type: "integer", example: 12 },
          name: { type: "string", example: "Mesa 12" },
        },
      },
      OrderResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          table: { type: "integer", example: 12 },
          name: { type: "string", example: "Mesa 12" },
          status: { type: "boolean", example: false },
          draft: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      OrderItemProduct: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "Pizza Calabresa" },
          price: { type: "integer", example: 35 },
          description: {
            type: "string",
            example: "Pizza com calabresa e cebola",
          },
          banner: { type: "string", example: "https://..." },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          amount: { type: "integer", example: 2 },
          createdAt: { type: "string", format: "date-time" },
          product: { $ref: "#/components/schemas/OrderItemProduct" },
        },
      },
      OrderDetailResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          table: { type: "integer", example: 12 },
          name: { type: "string", example: "Mesa 12" },
          draft: { type: "boolean", example: true },
          status: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
        },
      },
      AddItemRequest: {
        type: "object",
        required: ["orderId", "productId", "amount"],
        properties: {
          orderId: { type: "string", example: "uuid" },
          productId: { type: "string", example: "uuid" },
          amount: { type: "integer", example: 2 },
        },
      },
      AddItemResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          amount: { type: "integer", example: 2 },
          orderId: { type: "string", example: "uuid" },
          productId: { type: "string", example: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          product: { $ref: "#/components/schemas/OrderItemProduct" },
        },
      },
      SendOrderRequest: {
        type: "object",
        required: ["orderId", "name"],
        properties: {
          orderId: { type: "string", example: "uuid" },
          name: { type: "string", example: "Mesa 12" },
        },
      },
      FinishOrderRequest: {
        type: "object",
        required: ["orderId"],
        properties: {
          orderId: { type: "string", example: "uuid" },
        },
      },
      DeleteResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operacao realizada com sucesso" },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [path.join(process.cwd(), "src/routes.ts")],
});

export { swaggerSpec };
