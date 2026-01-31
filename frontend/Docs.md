# Documentação detalhada do back-end - Sistema de Pizzaria

## 1) Visão geral
Backend REST em Node.js/TypeScript com Express 5. A aplicação segue arquitetura em camadas (Rotas -> Middlewares -> Controllers -> Services -> Prisma) e utiliza PostgreSQL via Prisma ORM. A API fornece autenticação JWT, autorização por roles (MASTER/ADMIN/STAFF) e validação de entrada com Zod. Upload de imagens é feito via Multer (memoryStorage) com envio para Cloudinary.

## 2) Stack principal
- **Node.js 20 LTS**
- **TypeScript**
- **Express 5**
- **Prisma ORM** + **PostgreSQL**
- **Zod** (validação)
- **JWT** (auth)
- **bcryptjs** (hash de senha)
- **Multer** (upload multipart)
- **Cloudinary** (armazenamento de imagens)
- **Jest + ts-jest** (testes)
- **Swagger UI/OpenAPI**

## 3) Arquitetura e fluxo de requisição

Fluxo padrão:

```
HTTP -> Rotas -> Middlewares -> Controller -> Service -> Prisma -> Banco
                                    -> Controller -> Resposta
```

Responsabilidades:
- **Rotas**: definem endpoints e encadeiam middlewares.
- **Middlewares**: autenticação, autorização e validação.
- **Controllers**: extraem dados da requisição e chamam Services.
- **Services**: regras de negócio e persistência.
- **Prisma**: acesso ao banco PostgreSQL.

## 4) Autenticação e autorização

### JWT
- Header esperado: `Authorization: Bearer <token>`
- Token inclui `sub = user.id`.
- Expira em 30 dias.
- Secret: `JWT_SECRETE`.

### Roles
- **STAFF**: acesso básico às rotas autenticadas.
- **ADMIN**: acesso administrativo (produtos e categorias).
- **MASTER**: acesso total e rotas exclusivas (ex: alterar role).

### Middlewares
- `isAuthenticated`: valida JWT e injeta `req.userId`.
- `isAdminOrMaster`: exige role `ADMIN` ou `MASTER`.
- `isMaster`: exige role `MASTER`.

## 5) Validação de entrada (Zod)

As rotas usam `validateSchema` para validar `body`, `query` e `params`.

Resposta padrão para validação:

```json
{
  "error": "Erro de validação",
  "details": [
    { "field": "body.name", "message": "Mensagem de erro" }
  ]
}
```

## 6) Banco de dados (Prisma)

### Entidades principais
- **User** (`users`)
  - `id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`
- **Category** (`categories`)
  - `id`, `name`, `active`, `createdAt`, `updatedAt`
- **Product** (`products`)
  - `id`, `name`, `price`, `description`, `banner`, `disabled`, `categoryId`
- **Order** (`orders`)
  - `id`, `table`, `name`, `status`, `draft`, `createdAt`, `updatedAt`
- **Item** (`items`)
  - `id`, `amount`, `orderId`, `productId`

### Relacionamentos
```
Category (1) --< Product (N) --< Item (N) >-- Order (1)
```

### Regras importantes
- **Soft delete**:
  - Category: `active = false`
  - Product: `disabled = true`
- **Cascata**:
  - Category -> Product
  - Product -> Item
  - Order -> Item

## 7) Upload de imagens

- `multer` com `memoryStorage`.
- Limite de arquivo: **4MB**.
- Tipos permitidos: **jpg, jpeg, png**.
- Upload no Cloudinary (`cloudinary.uploader.upload_stream`).

## 8) Endpoints e contratos

A lista completa e exemplos estão em:
- `endpoints.md`
- Swagger UI: `http://localhost:3333/docs`
- OpenAPI JSON: `http://localhost:3333/docs.json`

Resumo rápido:
- **Users**: `/users`, `/session`, `/me`, `/users/role`
- **Categories**: `/category`, `/category/remove`, `/category/update`
- **Products**: `/product`, `/product/update`, `/category/product`
- **Orders**: `/order`, `/orders`, `/order/add`, `/order/remove`, `/order/detail`, `/order/send`, `/order/finish`

## 9) Erros e tratamento

- Erros de domínio usam `AppError` (com `statusCode`).
- Erros inesperados retornam 500:

```json
{ "status": "error", "message": "Internal server error" }
```

## 10) Configuração e execução

### Instalar dependências
```bash
npm install
```

### Variáveis de ambiente (exemplo em `.example.env`)
- `PORT`
- `JWT_SECRETE`
- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_URL`
- `MASTER_EMAIL`
- `MASTER_PASSWORD`
- `MASTER_NAME`

### Rodar em desenvolvimento
```bash
npm run dev
```

### Seed do usuário MASTER (opcional)
```bash
npm run seed
```

Requer:
- `MASTER_EMAIL`
- `MASTER_PASSWORD`
- `MASTER_NAME` (opcional)

## 11) Testes

### Rodar todos
```bash
npm test
```

### Watch
```bash
npm run test:watch
```

### Por domínio
```bash
npm run test:user
npm run test:user-service
npm run test:user-controller

npm run test:category
npm run test:category-service
npm run test:category-controller

npm run test:product
npm run test:product-serve
npm run test:product-controller

npm run test:order
npm run test:order-service
npm run test:order-controller
```

## 12) Observações importantes

- **Preço** é armazenado como inteiro no banco.
- **IDs** são UUIDs gerados pelo Prisma.
- **JWT** usa `JWT_SECRETE` e expira em 30 dias.
- **Categorias desativadas** não aparecem em listagens.
- **Produtos desativados** são filtrados por padrão.

---

**Última atualização:** 31/01/2026
