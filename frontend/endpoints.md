# 📚 API Documentation - Sistema de Pizzaria (Backend)

## 📋 Índice

1. [Base URL e Autenticação](#-base-url-e-autenticação)
2. [Padrões de Erro e Validação](#-padrões-de-erro-e-validação)
3. [Usuários](#-usuários)
4. [Categorias](#-categorias)
5. [Produtos](#-produtos)
6. [Pedidos (Orders)](#-pedidos-orders)
7. [Resumo de Endpoints](#-resumo-de-endpoints)

---

## 🌐 Base URL e Autenticação

**Base URL (local):** `http://localhost:3333`

A API utiliza **JWT**. Para rotas autenticadas, envie:

```
Authorization: Bearer SEU_TOKEN_JWT
```

Permissões:
- `STAFF`: acesso padrão às rotas autenticadas.
- `ADMIN`: inclui rotas administrativas.
- `MASTER`: inclui todas as rotas, além de operações exclusivas (ex: alterar role).

---

## ⚠️ Padrões de Erro e Validação

### Erro de validação (Zod)
Resposta padrão para dados inválidos:

```json
{
  "error": "Erro de validação",
  "details": [
    { "field": "body.name", "message": "Mensagem de erro" }
  ]
}
```

### Autenticação/Autorização
- **401** sem token: `"Usuário não autenticado"`
- **401** token inválido: `"Token inválido"`
- **401** sem permissão: `"Usuário não ter permissão"`

---

## 👤 Usuários

### 1) Criar Usuário
**POST** `/users` (público)

Body:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta 201:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### 2) Autenticar Usuário
**POST** `/session` (público)

Body:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta 200:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "token": "jwt"
}
```

### 3) Detalhes do Usuário Autenticado
**GET** `/me` (autenticado)

Resposta 200:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### 4) Listar Usuários
**GET** `/users` (ADMIN ou MASTER)

Resposta 200:
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "STAFF",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### 5) Atualizar Role do Usuário
**PUT** `/users/role` (apenas MASTER)

Body:
```json
{
  "userId": "uuid"
}
```

Resposta 200:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "ADMIN",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

Observação:
- Alterna apenas entre `STAFF` e `ADMIN`. Role `MASTER` não é alterada por esta rota.

---

## 📂 Categorias

### 1) Criar Categoria
**POST** `/category` (ADMIN ou MASTER)

Body:
```json
{ "name": "Pizzas Doces" }
```

Resposta 201:
```json
{
  "id": "uuid",
  "name": "Pizzas Doces",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### 2) Listar Categorias (ativas)
**GET** `/category` (autenticado)

Resposta 200:
```json
[
  {
    "id": "uuid",
    "name": "Pizzas Doces",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### 3) Desativar Categoria
**DELETE** `/category/remove` (ADMIN ou MASTER)

Query:
```
categoryId=uuid
```

Resposta 200:
```json
{ "message": "Categoria desativada com sucesso" }
```

### 4) Atualizar Categoria
**PUT** `/category/update` (ADMIN ou MASTER)

Query:
```
categoryId=uuid
```

Body:
```json
{ "name": "Pizzas Especiais" }
```

Resposta 200:
```json
{
  "id": "uuid",
  "name": "Pizzas Especiais",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 🍕 Produtos

### 1) Criar Produto
**POST** `/product` (ADMIN ou MASTER)

Headers:
```
Content-Type: multipart/form-data
```

Body (form-data):
```
name: Pizza Calabresa
price: 35
description: Pizza com calabresa e cebola
categoryId: uuid
file: (imagem jpg/png)
```

Resposta 201:
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

Observações:
- `price` é armazenado como **inteiro** no banco.
- Upload é feito via **Cloudinary**.

### 2) Listar Produtos
**GET** `/product` (autenticado)

Query (opcional):
```
disabled=true|false
```

Resposta 200:
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

### 3) Desativar Produto
**DELETE** `/product` (ADMIN ou MASTER)

Query:
```
productId=uuid
```

Resposta 200:
```json
{ "message": "Produto deletado com sucesso" }
```

### 4) Atualizar Produto
**PUT** `/product/update` (ADMIN ou MASTER)

Headers:
```
Content-Type: multipart/form-data
```

Query:
```
productId=uuid
```

Body (form-data):
```
name: Pizza Calabresa
price: 40
description: Nova descrição
file: (imagem jpg/png, opcional)
```

Resposta 200:
```json
{
  "id": "uuid",
  "name": "Pizza Calabresa",
  "description": "Nova descrição",
  "price": 40,
  "categoryId": "uuid",
  "banner": "https://...",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### 5) Listar Produtos por Categoria
**GET** `/category/product` (autenticado)

Query:
```
categoryId=uuid
```

Resposta 200:
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

---

## 🛒 Pedidos (Orders)

### 1) Criar Pedido
**POST** `/order` (autenticado)

Body:
```json
{
  "table": 12,
  "name": "Mesa 12"
}
```

Resposta 201:
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

### 2) Listar Pedidos
**GET** `/orders` (autenticado)

Query (opcional):
```
draft=true|false
```

Resposta 200:
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

### 3) Adicionar Item ao Pedido
**POST** `/order/add` (autenticado)

Body:
```json
{
  "orderId": "uuid",
  "productId": "uuid",
  "amount": 2
}
```

Resposta 201:
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

### 4) Remover Item do Pedido
**DELETE** `/order/remove` (autenticado)

Query:
```
itemId=uuid
```

Resposta 200:
```json
{ "message": "Item removido com sucesso" }
```

### 5) Detalhar Pedido
**GET** `/order/detail` (autenticado)

Query:
```
orderId=uuid
```

Resposta 200:
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

### 6) Enviar Pedido
**PUT** `/order/send` (autenticado)

Body:
```json
{
  "orderId": "uuid",
  "name": "Mesa 12"
}
```

Resposta 200:
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

### 7) Finalizar Pedido
**PUT** `/order/finish` (autenticado)

Body:
```json
{ "orderId": "uuid" }
```

Resposta 200:
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

### 8) Deletar Pedido
**DELETE** `/order` (autenticado)

Query:
```
orderId=uuid
```

Resposta 200:
```json
{ "message": "Pedido deletado com sucesso!" }
```

---

## 📌 Resumo de Endpoints

| Método | Rota              | Auth | Permissão            | Descrição                           |
| ------ | ----------------- | ---- | -------------------- | ----------------------------------- |
| POST   | /users            | ❌   | Pública              | Criar usuário                       |
| POST   | /session          | ❌   | Pública              | Autenticar usuário                  |
| GET    | /me               | ✅   | STAFF/ADMIN/MASTER   | Detalhes do usuário                 |
| GET    | /users            | ✅   | ADMIN/MASTER         | Listar usuários                     |
| PUT    | /users/role       | ✅   | MASTER               | Alternar role do usuário            |
| GET    | /category         | ✅   | STAFF/ADMIN/MASTER   | Listar categorias ativas            |
| POST   | /category         | ✅   | ADMIN/MASTER         | Criar categoria                     |
| DELETE | /category/remove  | ✅   | ADMIN/MASTER         | Desativar categoria                 |
| PUT    | /category/update  | ✅   | ADMIN/MASTER         | Atualizar categoria                 |
| GET    | /category/product | ✅   | STAFF/ADMIN/MASTER   | Listar produtos por categoria       |
| POST   | /product          | ✅   | ADMIN/MASTER         | Criar produto (com imagem)          |
| GET    | /product          | ✅   | STAFF/ADMIN/MASTER   | Listar produtos                     |
| DELETE | /product          | ✅   | ADMIN/MASTER         | Desativar produto                   |
| PUT    | /product/update   | ✅   | ADMIN/MASTER         | Atualizar produto                   |
| POST   | /order            | ✅   | STAFF/ADMIN/MASTER   | Criar pedido                        |
| GET    | /orders           | ✅   | STAFF/ADMIN/MASTER   | Listar pedidos (filtro draft)       |
| POST   | /order/add        | ✅   | STAFF/ADMIN/MASTER   | Adicionar item ao pedido            |
| DELETE | /order/remove     | ✅   | STAFF/ADMIN/MASTER   | Remover item do pedido              |
| GET    | /order/detail     | ✅   | STAFF/ADMIN/MASTER   | Detalhar pedido                     |
| PUT    | /order/send       | ✅   | STAFF/ADMIN/MASTER   | Enviar pedido (draft=false)         |
| PUT    | /order/finish     | ✅   | STAFF/ADMIN/MASTER   | Finalizar pedido (draft=true)       |
| DELETE | /order            | ✅   | STAFF/ADMIN/MASTER   | Deletar pedido                      |
| GET    | /docs             | ❌   | Pública              | Swagger UI                          |
| GET    | /docs.json        | ❌   | Pública              | OpenAPI JSON                        |

---

**Última atualização:** 31/01/2026
