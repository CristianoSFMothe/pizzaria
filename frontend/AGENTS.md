# Documentacao de contexto do projeto - Sistema de Pizzaria (backend)

## Indice

1. [Visao geral](#visao-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e versoes](#tecnologias-e-versoes)
4. [Estrutura de pastas](#estrutura-de-pastas)
5. [Modelagem do banco de dados](#modelagem-do-banco-de-dados)
6. [Middlewares](#middlewares)
7. [Validacao com schemas](#validacao-com-schemas)
8. [Endpoints](#endpoints)
9. [Fluxo de requisicao](#fluxo-de-requisicao)
10. [Configuracoes do projeto](#configuracoes-do-projeto)
11. [Seguranca](#seguranca)
12. [Observacoes importantes](#observacoes-importantes)
13. [Como iniciar o projeto](#como-iniciar-o-projeto)

---

## Visao geral

- Backend em Node.js com TypeScript e Express 5.
- Prisma ORM com PostgreSQL.
- Validacao de entrada com Zod.
- Autenticacao via JWT e senhas com bcryptjs.
- Camadas: Rotas -> Controller -> Service -> Prisma -> Banco.

---

## Arquitetura

Padrao: MVC + Service Layer (sem camada de view).

Fluxo geral:

```text
Requisicao HTTP -> Rotas -> Middlewares -> Controller -> Service -> Prisma -> Banco
                                         -> Controller -> Resposta HTTP
```

Camadas:

1. Rotas: definem endpoints e encadeiam middlewares.
2. Middlewares: autenticacao, autorizacao e validacao.
3. Controllers: extraem dados e delegam para services.
4. Services: regra de negocio e persistencia via Prisma.
5. Prisma Client: acesso ao PostgreSQL.

---

## Tecnologias e versoes

### Dependencias de runtime

| Tecnologia         | Versao  | Uso                   |
| ------------------ | ------- | --------------------- |
| express            | ^5.1.0  | API HTTP              |
| cors               | ^2.8.5  | CORS                  |
| dotenv             | ^17.2.3 | Variaveis de ambiente |
| jsonwebtoken       | ^9.0.3  | JWT                   |
| bcryptjs           | ^3.0.3  | Hash de senha         |
| cloudinary         | ^2.9.0  | Upload de imagens     |
| zod                | ^4.1.12 | Validacao             |
| @prisma/client     | ^7.2.0  | ORM                   |
| @prisma/adapter-pg | ^7.2.0  | Adapter Postgres      |
| multer             | ^2.0.2  | Upload multipart      |
| pg                 | ^8.17.1 | Driver Postgres       |
| tsx                | ^4.20.6 | Execucao TS           |

### Dependencias de desenvolvimento

| Tecnologia          | Versao   | Uso             |
| ------------------- | -------- | --------------- |
| typescript          | ^5.9.3   | Tipagem e build |
| prisma              | ^7.2.0   | CLI Prisma      |
| nodemon             | ^3.1.4   | Watcher         |
| @types/express      | ^5.0.5   | Tipos Express   |
| @types/node         | ^24.10.8 | Tipos Node      |
| @types/cors         | ^2.8.17  | Tipos CORS      |
| @types/jsonwebtoken | ^9.0.10  | Tipos JWT       |
| @types/multer       | ^2.0.2   | Tipos Multer    |
| @types/pg           | ^8.16.0  | Tipos PG        |

---

## Estrutura de pastas

```text
backend/
├── prisma/
│   ├── migrations/
│   │   └── 20260115101822_create_tables/
│   │       └── migration.sql
│   ├── migration_lock.toml
│   └── schema.prisma
├── src/
│   ├── @types/express/index.d.ts
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── multer.ts
│   ├── controllers/
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoryController.ts
│   │   ├── order/
│   │   │   ├── AddItemOrderController.ts
│   │   │   ├── CreateOrderController.ts
│   │   │   ├── DeleteOrderController.ts
│   │   │   ├── DetailOrderController.ts
│   │   │   ├── FinishOrderController.ts
│   │   │   ├── ListOrdersController.ts
│   │   │   ├── RemoveItemOrderController.ts
│   │   │   └── SendOrderController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── DeleteProductController.ts
│   │   │   ├── ListProductByCategoryController.ts
│   │   │   └── ListProductController.ts
│   │   └── user/
│   │       ├── AuthUserController.ts
│   │       ├── CreateUserController.ts
│   │       └── DetailsUserController.ts
│   ├── errors/AppError.ts
│   ├── generated/prisma/        # gerado pelo Prisma
│   ├── middlewares/
│   │   ├── isAdmin.ts
│   │   ├── isAuthenticated.ts
│   │   └── validateSchema.ts
│   ├── prisma/index.ts
│   ├── schemas/
│   │   ├── categorySchema.ts
│   │   ├── orderSchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   ├── services/
│   │   ├── category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   └── ListCategoryService.ts
│   │   ├── order/
│   │   │   ├── AddItemOrderService.ts
│   │   │   ├── CreateOrderService.ts
│   │   │   ├── DeleteOrderService.ts
│   │   │   ├── DetailOrderService.ts
│   │   │   ├── FinishOrderService.ts
│   │   │   ├── ListOrdersService.ts
│   │   │   ├── RemoveItemOrderService.ts
│   │   │   └── SendOrderService.ts
│   │   ├── product/
│   │   │   ├── CreateProductService.ts
│   │   │   ├── DeleteProductService.ts
│   │   │   ├── ListProductByCategoryService.ts
│   │   │   └── ListProductService.ts
│   │   └── user/
│   │       ├── AuthUserService.ts
│   │       ├── CreateUserService.ts
│   │       └── DetailsUserService.ts
│   ├── routes.ts
│   └── server.ts
├── package.json
├── package-lock.json
├── prisma.config.ts
└── tsconfig.json
```

Observacao: `src/generated/prisma` e gerado via `prisma generate`.

---

## Modelagem do banco de dados

### Relacionamentos

```text
User (1)
  role: STAFF | ADMIN

Category (1) --< Product (N) --< Item (N) >-- Order (1)
```

### Entidades e atributos

**User** (`users`)

- id: String (uuid, PK)
- name: String
- email: String (unique)
- password: String
- role: Role (STAFF | ADMIN)
- createdAt: DateTime
- updatedAt: DateTime

**Category** (`categories`)

- id: String (uuid, PK)
- name: String
- createdAt: DateTime
- updatedAt: DateTime
- products: Product[]

**Product** (`products`)

- id: String (uuid, PK)
- name: String
- price: Int
- description: String
- banner: String
- disabled: Boolean (default false)
- categoryId: String (FK -> categories.id, cascade)
- createdAt: DateTime
- updatedAt: DateTime
- items: Item[]

**Order** (`orders`)

- id: String (uuid, PK)
- table: Int
- name: String (nullable)
- status: Boolean (default false)
- draft: Boolean (default true)
- createdAt: DateTime
- updatedAt: DateTime
- items: Item[]

**Item** (`items`)

- id: String (uuid, PK)
- amount: Int
- orderId: String (FK -> orders.id, cascade)
- productId: String (FK -> products.id, cascade)
- createdAt: DateTime
- updatedAt: DateTime

### Regras de delecao (cascade)

- Category -> Products
- Product -> Items
- Order -> Items

---

## Middlewares

### isAuthenticated (`src/middlewares/isAuthenticated.ts`)

- Le header `Authorization: Bearer <token>`.
- Valida JWT com `JWT_SECRETE`.
- Injeta `req.userId` com `sub` do token.
- Retorna 401 em ausencia ou token invalido.

### isAdmin (`src/middlewares/isAdmin.ts`)

- Requer `req.userId` (isAuthenticated antes).
- Busca usuario no banco e verifica `role === "ADMIN"`.
- Retorna 401 se nao autorizado.

### validateSchema (`src/middlewares/validateSchema.ts`)

- Valida `body`, `query` e `params` com Zod.
- Retorna 400 com lista de campos invalidos quando ha ZodError.
- Retorna 500 para erros inesperados.

Exemplo de resposta de validacao:

```json
{
  "error": "Erro de validacao",
  "details": [{ "field": "body.name", "message": "Mensagem de erro" }]
}
```

---

## Validacao com schemas

### User (`src/schemas/userSchema.ts`)

- createUserSchema
  - name: string, min 3, max 100
  - email: email valido
  - password: string, min 6, max 100
- authUserSchema
  - email: email valido (min 1)
  - password: string obrigatoria (min 1)

### Category (`src/schemas/categorySchema.ts`)

- createCategorySchema
  - name: string, min 3

### Product (`src/schemas/productSchema.ts`)

- createProductSchema
  - name: string obrigatoria
  - price: string obrigatoria, apenas numeros
  - description: string obrigatoria
  - categoryId: string obrigatoria
- listProductSchema
  - disabled: string opcional ("true" ou "false")
- listProductByCategorySchema
  - categoryId: string obrigatoria (query)

### Order (`src/schemas/orderSchema.ts`)

- createOrderSchema
  - table: number inteiro positivo
  - name: string opcional
- addItemSchema
  - orderId: string obrigatoria
  - productId: string obrigatoria
  - amount: number inteiro positivo
- removeItemSchema
  - itemId: string obrigatoria (query)
- detailOrderSchema
  - orderId: string obrigatoria (query)
- sendOrderSchema
  - orderId: string obrigatoria
  - name: string obrigatoria
- finishOrderSchema
  - orderId: string obrigatoria
- deleteOrderSchema
  - orderId: string obrigatoria (query)

---

## Endpoints

Resumo:
| Metodo | Rota | Middlewares | Descricao |
| --- | --- | --- | --- |
| POST | /users | validateSchema(createUserSchema) | Cria usuario |
| POST | /session | validateSchema(authUserSchema) | Autentica usuario |
| GET | /me | isAuthenticated | Detalhe do usuario |
| GET | /category | isAuthenticated | Lista categorias |
| POST | /category | isAuthenticated, isAdmin, validateSchema(createCategorySchema) | Cria categoria |
| GET | /category/product | isAuthenticated, validateSchema(listProductByCategorySchema) | Lista produtos por categoria |
| POST | /order | isAuthenticated, validateSchema(createOrderSchema) | Cria pedido |
| GET | /orders | isAuthenticated | Lista pedidos (filtra por draft) |
| POST | /order/add | isAuthenticated, validateSchema(addItemSchema) | Adiciona item ao pedido |
| DELETE | /order/remove | isAuthenticated, validateSchema(removeItemSchema) | Remove item do pedido |
| GET | /order/detail | isAuthenticated, validateSchema(detailOrderSchema) | Detalha pedido |
| PUT | /order/send | isAuthenticated, validateSchema(sendOrderSchema) | Envia pedido (draft=false) |
| PUT | /order/finish | isAuthenticated, validateSchema(finishOrderSchema) | Finaliza pedido |
| DELETE | /order | isAuthenticated, validateSchema(deleteOrderSchema) | Deleta pedido |
| POST | /product | isAuthenticated, isAdmin, upload.single("file"), validateSchema(createProductSchema) | Cria produto |
| GET | /product | isAuthenticated, validateSchema(listProductSchema) | Lista produtos |
| DELETE | /product | isAuthenticated, isAdmin | Desativa produto |

### POST /users

Middlewares: `validateSchema(createUserSchema)`

Body:

```json
{
  "name": "Joao Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta (201):

```json
{
  "id": "uuid",
  "name": "Joao Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### POST /session

Middlewares: `validateSchema(authUserSchema)`

Body:

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta (200):

```json
{
  "id": "uuid",
  "name": "Joao Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "token": "jwt"
}
```

### GET /me

Middlewares: `isAuthenticated`

Headers:

```text
Authorization: Bearer <token>
```

Resposta (200):

```json
{
  "id": "uuid",
  "name": "Joao Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### GET /category

Middlewares: `isAuthenticated`

Headers:

```text
Authorization: Bearer <token>
```

Resposta (200):

```json
[
  {
    "id": "uuid",
    "name": "Pizzas Doces",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### POST /category

Middlewares: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`

Headers:

```text
Authorization: Bearer <token>
```

Body:

```json
{
  "name": "Pizzas Doces"
}
```

Resposta (201):

```json
{
  "id": "uuid",
  "name": "Pizzas Doces",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### GET /category/product

Middlewares: `isAuthenticated`, `validateSchema(listProductByCategorySchema)`

Query:

```text
categoryId=uuid
```

Resposta (200):

```json
[
  {
    "id": "uuid",
    "name": "Pizza Calabresa",
    "description": "Pizza com calabresa e cebola",
    "price": 35,
    "categoryId": "uuid",
    "banner": "https://...",
    "disabled": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "category": {
      "id": "uuid",
      "name": "Pizzas Salgadas"
    }
  }
]
```

### POST /order

Middlewares: `isAuthenticated`, `validateSchema(createOrderSchema)`

Body:

```json
{
  "table": 12,
  "name": "Mesa 12"
}
```

Resposta (201):

```json
{
  "id": "uuid",
  "table": 12,
  "name": "Mesa 12",
  "status": false,
  "draft": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### GET /orders

Middlewares: `isAuthenticated`

Query (opcional):

```text
draft=true
```

Resposta (200):

```json
[
  {
    "id": "uuid",
    "table": 12,
    "name": "Mesa 12",
    "status": false,
    "draft": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "items": [
      {
        "id": "uuid",
        "amount": 2,
        "product": {
          "id": "uuid",
          "name": "Pizza Calabresa",
          "price": 35,
          "description": "Pizza com calabresa e cebola",
          "banner": "https://..."
        }
      }
    ]
  }
]
```

### POST /order/add

Middlewares: `isAuthenticated`, `validateSchema(addItemSchema)`

Body:

```json
{
  "orderId": "uuid",
  "productId": "uuid",
  "amount": 2
}
```

Resposta (201):

```json
{
  "id": "uuid",
  "amount": 2,
  "orderId": "uuid",
  "productId": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "product": {
    "id": "uuid",
    "name": "Pizza Calabresa",
    "price": 35,
    "description": "Pizza com calabresa e cebola",
    "banner": "https://..."
  }
}
```

### DELETE /order/remove

Middlewares: `isAuthenticated`, `validateSchema(removeItemSchema)`

Query:

```text
itemId=uuid
```

Resposta (200):

```json
{
  "message": "Item removido com sucesso"
}
```

### GET /order/detail

Middlewares: `isAuthenticated`, `validateSchema(detailOrderSchema)`

Query:

```text
orderId=uuid
```

Resposta (200):

```json
{
  "id": "uuid",
  "table": 12,
  "name": "Mesa 12",
  "draft": true,
  "status": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "items": [
    {
      "id": "uuid",
      "amount": 2,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "product": {
        "id": "uuid",
        "name": "Pizza Calabresa",
        "price": 35,
        "description": "Pizza com calabresa e cebola",
        "banner": "https://..."
      }
    }
  ]
}
```

### PUT /order/send

Middlewares: `isAuthenticated`, `validateSchema(sendOrderSchema)`

Body:

```json
{
  "orderId": "uuid",
  "name": "Mesa 12"
}
```

Resposta (200):

```json
{
  "id": "uuid",
  "table": 12,
  "name": "Mesa 12",
  "draft": false,
  "status": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### PUT /order/finish

Middlewares: `isAuthenticated`, `validateSchema(finishOrderSchema)`

Body:

```json
{
  "orderId": "uuid"
}
```

Resposta (200):

```json
{
  "id": "uuid",
  "table": 12,
  "name": "Mesa 12",
  "draft": true,
  "status": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### DELETE /order

Middlewares: `isAuthenticated`, `validateSchema(deleteOrderSchema)`

Query:

```text
orderId=uuid
```

Resposta (200):

```json
{
  "message": "Pedido deletado com sucesso!"
}
```

### POST /product

Middlewares: `isAuthenticated`, `isAdmin`, `upload.single("file")`, `validateSchema(createProductSchema)`

Headers:

```text
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Body (multipart/form-data):

```text
name: Pizza Calabresa
price: 35
description: Pizza com calabresa e cebola
categoryId: uuid
file: (imagem jpg/png)
```

Resposta (201):

```json
{
  "id": "uuid",
  "name": "Pizza Calabresa",
  "description": "Pizza com calabresa e cebola",
  "price": 35,
  "categoryId": "uuid",
  "banner": "https://...",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### GET /product

Middlewares: `isAuthenticated`, `validateSchema(listProductSchema)`

Query (opcional):

```text
disabled=true
```

Resposta (200):

```json
[
  {
    "id": "uuid",
    "name": "Pizza Calabresa",
    "description": "Pizza com calabresa e cebola",
    "price": 35,
    "categoryId": "uuid",
    "banner": "https://...",
    "disabled": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "category": {
      "id": "uuid",
      "name": "Pizzas Salgadas"
    }
  }
]
```

### DELETE /product

Middlewares: `isAuthenticated`, `isAdmin`

Query:

```text
productId=uuid
```

Resposta (200):

```json
{
  "message": "Produto deletado com sucesso"
}
```

---

## Fluxo de requisicao

### Criacao de usuario

1. POST /users.
2. validateSchema(createUserSchema) valida dados.
3. CreateUserController chama CreateUserService.
4. Service verifica email, gera hash (bcryptjs, 10 rounds), cria usuario.
5. Controller retorna 201 com dados sem senha.

### Criacao de categoria (admin)

1. POST /category.
2. isAuthenticated valida token e popula req.userId.
3. isAdmin valida role ADMIN no banco.
4. validateSchema(createCategorySchema) valida dados.
5. CreateCategoryService cria a categoria.
6. Controller retorna 201.

### Listagem de categorias

1. GET /category.
2. isAuthenticated valida token e popula req.userId.
3. ListCategoryController chama ListCategoryService.
4. Service lista categorias e retorna 200.

### Criacao de produto (admin)

1. POST /product.
2. isAuthenticated valida token e popula req.userId.
3. isAdmin valida role ADMIN no banco.
4. upload.single("file") carrega imagem na memoria.
5. validateSchema(createProductSchema) valida dados.
6. CreateProductService valida categoria, envia imagem ao Cloudinary e cria produto.
7. Controller retorna 201.

### Criacao de pedido

1. POST /order.
2. isAuthenticated valida token e popula req.userId.
3. validateSchema(createOrderSchema) valida dados.
4. CreateOrderController chama CreateOrderService.
5. Service cria o pedido.
6. Controller retorna 201.

### Adicao de item no pedido

1. POST /order/add.
2. isAuthenticated valida token e popula req.userId.
3. validateSchema(addItemSchema) valida dados.
4. AddItemOrderService valida pedido e produto.
5. Service cria o item.
6. Controller retorna 201.

### Detalhe de pedido

1. GET /order/detail?orderId=uuid.
2. isAuthenticated valida token e popula req.userId.
3. validateSchema(detailOrderSchema) valida dados.
4. DetailOrderService busca pedido com itens e produtos.
5. Controller retorna 200.

### Envio de pedido

1. PUT /order/send.
2. isAuthenticated valida token e popula req.userId.
3. validateSchema(sendOrderSchema) valida dados.
4. SendOrderService atualiza draft para false e nome do pedido.
5. Controller retorna 200.

### Finalizacao de pedido

1. PUT /order/finish.
2. isAuthenticated valida token e popula req.userId.
3. validateSchema(finishOrderSchema) valida dados.
4. FinishOrderService atualiza draft para true.
5. Controller retorna 200.

### Remocao de item do pedido

1. DELETE /order/remove?itemId=uuid.
2. isAuthenticated valida token e popula req.userId.
3. validateSchema(removeItemSchema) valida dados.
4. RemoveItemOrderService verifica item e remove.
5. Controller retorna 200.

### Exclusao de pedido

1. DELETE /order?orderId=uuid.
2. isAuthenticated valida token e popula req.userId.
3. validateSchema(deleteOrderSchema) valida dados.
4. DeleteOrderService verifica pedido e remove.
5. Controller retorna 200.

### Listagem de pedidos

1. GET /orders?draft=true.
2. isAuthenticated valida token e popula req.userId.
3. ListOrdersService lista pedidos e itens.
4. Controller retorna 200.

---

## Configuracoes do projeto

### package.json

- type: commonjs
- version: 1.0.0
- script dev: `nodemon --watch 'src/**/*.ts' --exec 'tsx' src/server.ts`

### tsconfig.json (principais)

- target: ES2020
- module: commonjs
- strict: true
- rootDir: ./src
- outDir: ./dist
- sourceMap: true
- removeComments: true

### Prisma

**schema** (`prisma/schema.prisma`)

- provider: postgresql
- generator output: `src/generated/prisma`

**config** (`prisma.config.ts`)

- schema: `prisma/schema.prisma`
- migrations: `prisma/migrations`
- datasource url: `DATABASE_URL`

**client** (`src/prisma/index.ts`)

- usa `@prisma/adapter-pg` com `DATABASE_URL`

### Upload e imagens

**multer** (`src/config/multer.ts`)

- storage: memoria (buffer)
- limite: 4MB
- tipos permitidos: jpg, jpeg, png

**cloudinary** (`src/config/cloudinary.ts`)

- usa `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Express server (`src/server.ts`)

- middlewares globais: `express.json()`, `cors()`, `router`
- handler de erro:
  - AppError -> statusCode e `{ "error": message }`
  - outros erros -> 500 com `{ "status": "error", "message": "Internal server error" }`
- porta: `PORT` (default 3333)

### Tipos customizados

- `src/@types/express/index.d.ts` adiciona `userId` ao `Request`.

---

## Seguranca

- JWT com `sub = user.id` e expira em 30d.
- Secret vem de `JWT_SECRETE`.
- Payload do token inclui `name` e `email`.
- Senha armazenada com bcryptjs (hash com 10 rounds).
- Acesso admin protegido por `isAdmin`.
- Validacao de entrada antes dos controllers com Zod.

---

## Observacoes importantes

- IDs sao UUIDs (`uuid()` no Prisma).
- `createdAt` e `updatedAt` sao gerenciados pelo Prisma.
- O nome da variavel de ambiente do JWT no codigo e `JWT_SECRETE`.
- Erros de dominio usam `AppError` com status configuravel.

---

## Como iniciar o projeto

1. Instalar dependencias:
   - `npm install`
2. Definir variaveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRETE`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PORT` (opcional, default 3333)
3. Gerar Prisma Client (se necessario):
   - `npx prisma generate`
4. Rodar em desenvolvimento:
   - `npm run dev`
