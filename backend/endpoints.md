# 📚 API Documentation - Sistema de Pizzaria

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Usuários](#usuários)
3. [Categorias](#categorias)
4. [Produtos](#produtos)
5. [Pedidos (Orders)](#pedidos-orders)
6. [Tabela Resumo](#tabela-resumo)

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Após fazer login, você receberá um token que deve ser incluído em todas as requisições autenticadas.

### Como usar o Token

```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

---

## 👤 Usuários

### 1. Criar Usuário

Cria um novo usuário no sistema.

**Endpoint:** `POST /users`

**Autenticação:** ❌ Não requerida

**Permissão:** Pública

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**

- `name`: Mínimo 3 caracteres (obrigatório)
- `email`: Email válido (obrigatório)
- `password`: Mínimo 6 caracteres (obrigatório)

**Resposta de Sucesso (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 409 - E-mail já cadastrado
{
  "error": "E-mail já cadastrado"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no minimo 3 letras" },
    { "message": "Precisa ser um email valido" }
  ]
}
```

**Observações:**

- Senha é criptografada com bcrypt (salt: 10 rounds)
- Role padrão é `STAFF`
- Senha não é retornada na resposta

---

### 2. Autenticar Usuário (Login)

Autentica um usuário e retorna um token JWT.

**Endpoint:** `POST /session`

**Autenticação:** ❌ Não requerida

**Permissão:** Pública

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**

- `email`: Email válido (obrigatório)
- `password`: String não vazia (obrigatório)

**Resposta de Sucesso (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE2MzU0MjM0MDB9.xxx"
}
```

**Respostas de Erro:**

```json
// 401 - Credenciais inválidas
{
  "error": "E-mail ou senha inválidos"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "Precisa ser um email valido" }
  ]
}
```

**Observações:**

- Token JWT contém o `id` do usuário no campo `sub`
- Token deve ser usado nas próximas requisições autenticadas
- Validade do token é configurada via variável de ambiente

---

### 3. Detalhes do Usuário Autenticado

Retorna informações do usuário logado.

**Endpoint:** `GET /me`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta de Sucesso (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 401 - Token inválido ou não fornecido
{
  "error": "Token inválido ou não fornecido"
}
```

---

## 📂 Categorias

### 1. Criar Categoria

Cria uma nova categoria de produtos.

**Endpoint:** `POST /category`

**Autenticação:** ✅ Requerida

**Permissão:** Apenas ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Pizzas Doces"
}
```

**Validações:**

- `name`: Mínimo 3 caracteres (obrigatório)

**Resposta de Sucesso (201):**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Pizzas Doces",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 401 - Não autenticado
{
  "error": "Token inválido ou não fornecido"
}

// 401 - Sem permissão
{
  "error": "Usuário sem permissão"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "Nome de categoria precisa ter 2 caracteres" }
  ]
}
```

---

### 2. Listar Categorias

Lista todas as categorias cadastradas.

**Endpoint:** `GET /category`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzas Salgadas",
    "createdAt": "2025-11-12T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "name": "Pizzas Doces",
    "createdAt": "2025-11-12T10:35:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "name": "Bebidas",
    "createdAt": "2025-11-12T10:40:00.000Z"
  }
]
```

**Observações:**

- Retorna apenas categorias ativas (`active: true`)
- Ordena por `name` em ordem decrescente
- Retorna apenas: `id`, `name` e `createdAt`

---

### 3. Desativar Categoria

Desativa uma categoria (soft delete).

**Endpoint:** `DELETE /category/remove`

**Autenticação:** ✅ Requerida

**Permissão:** Apenas ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
categoryId: "660e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```
DELETE /category/remove?categoryId=660e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Categoria desativada com sucesso"
}
```

**Respostas de Erro:**

```json
// 404 - Categoria não encontrada
{
  "error": "Categoria nao encontrada"
}

// 400 - Categoria já desativada
{
  "error": "Categoria ja desativada"
}
```

**Observações:**

- Define `active` como `false`

---

## 🍕 Produtos

### 1. Criar Produto

Cria um novo produto com upload de imagem.

**Endpoint:** `POST /product`

**Autenticação:** ✅ Requerida

**Permissão:** Apenas ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: multipart/form-data
```

**Body (FormData):**

```
name: "Pizza Margherita"
price: "3500"
description: "Molho de tomate, mussarela e manjericão"
categoryId: "660e8400-e29b-41d4-a716-446655440001"
file: [arquivo de imagem]
```

**Validações:**

- `name`: Mínimo 1 caractere (obrigatório)
- `price`: String não vazia (obrigatório) - Valor em centavos
- `description`: Mínimo 1 caractere (obrigatório)
- `categoryId`: UUID válido (obrigatório)
- `file`: Imagem obrigatória (JPEG, JPG, PNG - máx 4MB)

**Resposta de Sucesso (201):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Molho de tomate, mussarela e manjericão",
  "banner": "https://res.cloudinary.com/seu-cloud/image/upload/v1699792800/products/1699792800-margherita.jpg",
  "categoryId": "660e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Imagem não fornecida
{
  "error": "Imagem do produto é obrigatória"
}

// 400 - Formato inválido
{
  "error": "Formato de arquivo invalido, use apenas JPG, JPEG, PNG."
}

// 404 - Categoria não existe
{
  "error": "Categoria não existe"
}

// 400 - Categoria desativada
{
  "error": "Categoria desativada"
}

// 500 - Erro no upload
{
  "error": "Erro ao enviar imagem do produto"
}

// 401 - Sem permissão
{
  "error": "Usuário sem permissão"
}
```

**Observações:**

- Preço é em centavos (ex: 3500 = R$ 35,00)
- Imagem é enviada para Cloudinary
- Campo `disabled` é criado como `false` por padrão

---

### 2. Listar Produtos

Lista todos os produtos com filtro de status.

**Endpoint:** `GET /product`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
disabled: "true" | "false" (opcional, padrão: "false")
```

**Exemplos de Uso:**

```
GET /product                    → Retorna produtos ativos (disabled=false)
GET /product?disabled=false     → Retorna produtos ativos
GET /product?disabled=true      → Retorna produtos desativados
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg",
    "disabled": false,
    "categoryId": "660e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-11-12T10:30:00.000Z",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    }
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Pizza Calabresa",
    "price": 4000,
    "description": "Calabresa, cebola e mussarela",
    "banner": "https://res.cloudinary.com/.../products/calabresa.jpg",
    "disabled": false,
    "categoryId": "660e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-11-12T10:35:00.000Z",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Observações:**

- Ordena por `name` em ordem decrescente
- Inclui dados da categoria relacionada
- Se `disabled` não for enviado, o padrão é `false`

---

### 3. Deletar/Desativar Produto

Desativa um produto (soft delete).

**Endpoint:** `DELETE /product`

**Autenticação:** ✅ Requerida

**Permissão:** Apenas ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
productId: "770e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```
DELETE /product?productId=770e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Produto deletado com sucesso"
}
```

**Respostas de Erro:**

```json
// 500 - Falha ao deletar
{
  "error": "Erro ao deletar produto"
}

// 401 - Sem permissão
{
  "error": "Usuário sem permissão"
}
```

**Observações:**

- Produto não é deletado do banco, apenas o campo `disabled` é alterado para `true`
- Soft delete mantém histórico e integridade referencial

---

### 4. Listar Produtos por Categoria

Lista produtos de uma categoria específica (apenas ativos).

**Endpoint:** `GET /category/product`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
categoryId: "660e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```
GET /category/product?categoryId=660e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg",
    "disabled": false,
    "categoryId": "660e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-11-12T10:30:00.000Z",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    }
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Pizza Calabresa",
    "price": 4000,
    "description": "Calabresa, cebola e mussarela",
    "banner": "https://res.cloudinary.com/.../products/calabresa.jpg",
    "disabled": false,
    "categoryId": "660e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-11-12T10:35:00.000Z",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Respostas de Erro:**

```json
// 404 - Categoria não existe
{
  "error": "Categoria nao existe"
}

// 400 - Categoria desativada
{
  "error": "Categoria desativada"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O ID da categoria é obrigatório" }
  ]
}
```

**Observações:**

- Retorna apenas produtos com `disabled: false`
- Ordena por `name` em ordem decrescente
- Inclui dados da categoria

---

## 🛒 Pedidos (Orders)

### 1. Criar Pedido

Cria um novo pedido (inicialmente como rascunho).

**Endpoint:** `POST /order`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "table": 5,
  "name": "Mesa do João"
}
```

**Validações:**

- `table`: Número inteiro positivo (obrigatório)
- `name`: String (opcional)

**Resposta de Sucesso (201):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "Mesa do João",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao criar
{
  "error": "Falha ao criar pedido"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O número da mesa é obrigatório" },
    { "message": "O número da mesa deve ser um número positivo" }
  ]
}
```

**Observações:**

- Pedido é criado como rascunho (`draft: true`)
- Status inicial é `false` (pedido não finalizado)
- Campo `name` é opcional, se não fornecido será string vazia

---

### 2. Adicionar Item ao Pedido

Adiciona um produto a um pedido existente.

**Endpoint:** `POST /order/add`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "orderId": "880e8400-e29b-41d4-a716-446655440001",
  "productId": "770e8400-e29b-41d4-a716-446655440001",
  "amount": 2
}
```

**Validações:**

- `orderId`: String não vazia (obrigatório)
- `productId`: String não vazia (obrigatório)
- `amount`: Número inteiro positivo (obrigatório)

**Resposta de Sucesso (201):**

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440001",
  "amount": 2,
  "orderId": "880e8400-e29b-41d4-a716-446655440001",
  "productId": "770e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2025-11-12T10:35:00.000Z",
  "product": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
  }
}
```

**Respostas de Erro:**

```json
// 404 - Pedido não encontrado
{
  "error": "Pedido não encontrado"
}

// 404 - Produto não encontrado ou desativado
{
  "error": "Produto não encontrado"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "Quantidade deve ser um numero positivo" }
  ]
}
```

**Observações:**

- Valida se o pedido existe
- Valida se o produto existe e está ativo (`disabled: false`)
- Retorna os dados do item criado com informações do produto

---

### 3. Remover Item do Pedido

Remove um item específico de um pedido.

**Endpoint:** `DELETE /order/remove`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
itemId: "990e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```
DELETE /order/remove?itemId=990e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Item removido com sucesso"
}
```

**Respostas de Erro:**

```json
// 500 - Falha ao remover
{
  "error": "Erro ao remover item do pedido"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O ID do item e obrigatório" }
  ]
}
```

**Observações:**

- Deleta permanentemente o item do banco de dados
- Não afeta o pedido principal

---

### 4. Enviar Pedido (Confirmar)

Envia o pedido para a cozinha (sai do modo rascunho).

**Endpoint:** `PUT /order/send`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "orderId": "880e8400-e29b-41d4-a716-446655440001",
  "name": "Mesa 5 - João"
}
```

**Validações:**

- `orderId`: String não vazia (obrigatório)
- `name`: String não vazia (obrigatório)

**Resposta de Sucesso (200):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 500 - Falha ao enviar pedido
{
  "error": "Falha ao enviar pedido"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ser um texto" }
  ]
}
```

**Observações:**

- Altera `draft` de `true` para `false`
- Atualiza o campo `name` do pedido
- Pedido passa a ser visível na cozinha

---

### 5. Finalizar Pedido

Marca um pedido como finalizado.

**Endpoint:** `PUT /order/finish`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "orderId": "880e8400-e29b-41d4-a716-446655440001"
}
```

**Validações:**

- `orderId`: String não vazia (obrigatório)

**Resposta de Sucesso (200):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": true,
  "status": false,
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 500 - Falha ao finalizar pedido
{
  "error": "Falha ao finalizar pedido"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "ID do pedido precisa ser uma string" }
  ]
}
```

**Observações:**

- Atualiza `draft` para `true`
- `status` permanece inalterado

---

### 6. Listar Pedidos

Lista pedidos com filtro de rascunho.

**Endpoint:** `GET /orders`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
draft: "true" | "false" (opcional, padrão: "false")
```

**Exemplos de Uso:**

```
GET /orders                → Retorna pedidos confirmados (draft=false)
GET /orders?draft=false    → Retorna pedidos confirmados
GET /orders?draft=true     → Retorna pedidos em rascunho
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440001",
    "table": 5,
    "name": "Mesa 5 - João",
    "draft": false,
    "status": false,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "items": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440001",
        "amount": 2,
        "product": {
          "id": "770e8400-e29b-41d4-a716-446655440001",
          "name": "Pizza Margherita",
          "price": 3500,
          "description": "Molho de tomate, mussarela e manjericão",
          "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
        }
      },
      {
        "id": "990e8400-e29b-41d4-a716-446655440002",
        "amount": 1,
        "product": {
          "id": "770e8400-e29b-41d4-a716-446655440002",
          "name": "Pizza Calabresa",
          "price": 4000,
          "description": "Calabresa, cebola e mussarela",
          "banner": "https://res.cloudinary.com/.../products/calabresa.jpg"
        }
      }
    ]
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440002",
    "table": 3,
    "name": "Mesa 3 - Maria",
    "draft": false,
    "status": false,
    "createdAt": "2025-11-12T11:00:00.000Z",
    "items": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440003",
        "amount": 1,
        "product": {
          "id": "770e8400-e29b-41d4-a716-446655440003",
          "name": "Pizza Portuguesa",
          "price": 4500,
          "description": "Presunto, ovos, cebola e mussarela",
          "banner": "https://res.cloudinary.com/.../products/portuguesa.jpg"
        }
      }
    ]
  }
]
```

**Observações:**

- Inclui todos os itens de cada pedido com detalhes dos produtos
- Útil para visualizar pedidos na cozinha ou rascunhos na área de atendimento

---

### 7. Detalhes do Pedido

Busca informações completas de um pedido específico.

**Endpoint:** `GET /order/detail`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
orderId: "880e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```
GET /order/detail?orderId=880e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-12T10:30:00.000Z",
  "updatedAt": "2025-11-12T10:35:00.000Z",
  "items": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "amount": 2,
      "createdAt": "2025-11-12T10:35:00.000Z",
      "product": {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "name": "Pizza Margherita",
        "price": 3500,
        "description": "Molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
      }
    },
    {
      "id": "990e8400-e29b-41d4-a716-446655440002",
      "amount": 1,
      "createdAt": "2025-11-12T10:36:00.000Z",
      "product": {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "name": "Pizza Calabresa",
        "price": 4000,
        "description": "Calabresa, cebola e mussarela",
        "banner": "https://res.cloudinary.com/.../products/calabresa.jpg"
      }
    }
  ]
}
```

**Respostas de Erro:**

```json
// 500 - Falha ao buscar detalhes da ordem
{
  "error": "Falha ao buscar detalhes da ordem"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O orderId é obrigatório" }
  ]
}
```

**Observações:**

- Retorna informações completas do pedido incluindo timestamps
- Inclui todos os itens com detalhes dos produtos
- Útil para visualizar um pedido específico

---

### 8. Deletar Pedido

Deleta permanentemente um pedido e todos seus itens.

**Endpoint:** `DELETE /order`

**Autenticação:** ✅ Requerida

**Permissão:** STAFF ou ADMIN

**Headers:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```
orderId: "880e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```
DELETE /order?orderId=880e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Pedido deletado com sucesso!"
}
```

**Respostas de Erro:**

```json
// 500 - Falha ao deletar pedido
{
  "error": "Falha ao deletar pedido"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "ID do pedido precisa ser uma string" }
  ]
}
```

**Observações:**

- Deleta permanentemente o pedido
- Todos os itens relacionados são deletados automaticamente (cascade)
- Operação não pode ser revertida

---

## 📊 Tabela Resumo

### Todos os Endpoints

| Método | Rota              | Autenticação | Permissão   | Descrição                           |
| ------ | ----------------- | ------------ | ----------- | ----------------------------------- |
| POST   | /users            | ❌           | Pública     | Criar novo usuário                  |
| POST   | /session          | ❌           | Pública     | Autenticar usuário (login)          |
| GET    | /me               | ✅           | STAFF/ADMIN | Obter dados do usuário logado       |
| POST   | /category         | ✅           | ADMIN       | Criar nova categoria                |
| GET    | /category         | ✅           | STAFF/ADMIN | Listar todas as categorias          |
| DELETE | /category/remove  | ✅           | ADMIN       | Desativar categoria                 |
| POST   | /product          | ✅           | ADMIN       | Criar novo produto (com imagem)     |
| GET    | /product          | ✅           | STAFF/ADMIN | Listar produtos (filtro por status) |
| DELETE | /product          | ✅           | ADMIN       | Desativar produto (soft delete)     |
| GET    | /category/product | ✅           | STAFF/ADMIN | Listar produtos de uma categoria    |
| POST   | /order            | ✅           | STAFF/ADMIN | Criar novo pedido                   |
| POST   | /order/add        | ✅           | STAFF/ADMIN | Adicionar item ao pedido            |
| DELETE | /order/remove     | ✅           | STAFF/ADMIN | Remover item do pedido              |
| PUT    | /order/send       | ✅           | STAFF/ADMIN | Enviar pedido (confirmar)           |
| PUT    | /order/finish     | ✅           | STAFF/ADMIN | Finalizar pedido                    |
| GET    | /orders           | ✅           | STAFF/ADMIN | Listar pedidos (filtro por draft)   |
| GET    | /order/detail     | ✅           | STAFF/ADMIN | Detalhes de um pedido específico    |
| DELETE | /order            | ✅           | STAFF/ADMIN | Deletar pedido                      |

---

## 🔑 Códigos de Status HTTP

| Código | Significado    | Quando Usar                                |
| ------ | -------------- | ------------------------------------------ |
| 200    | OK             | Requisição bem-sucedida (GET, PUT, DELETE) |
| 201    | Created        | Recurso criado com sucesso (POST)          |
| 400    | Bad Request    | Erro de validação ou lógica de negócio     |
| 401    | Unauthorized   | Token inválido ou sem permissão            |
| 404    | Not Found      | Recurso não encontrado                     |
| 409    | Conflict       | Conflito de dados (ex: duplicidade)        |
| 500    | Internal Error | Erro interno do servidor                   |

---

## 📝 Observações Importantes

### Preços

- Todos os preços são armazenados e retornados em **centavos** (inteiro)
- Exemplo: `3500` = R$ 35,00
- Evita problemas com aritmética de ponto flutuante

### IDs

- Todos os IDs são **UUIDs v4** gerados automaticamente
- Formato: `550e8400-e29b-41d4-a716-446655440000`

### Timestamps

- `createdAt`: Data de criação (gerado automaticamente)
- `updatedAt`: Data de atualização (atualizado automaticamente)
- Formato: ISO 8601 (`2025-11-12T10:30:00.000Z`)

### Soft Delete

- Produtos: Campo `disabled` (`true` = desativado, `false` = ativo)
- Categorias: Campo `active` (`true` = ativo, `false` = desativado)
- Mantém integridade referencial e histórico

### Status dos Pedidos

- `draft`: `true` = rascunho, `false` = confirmado/enviado
- `status`: `false` = em andamento, `true` = finalizado

### Upload de Imagens

- Formato aceito: JPEG, JPG, PNG
- Tamanho máximo: 4MB
- Armazenamento: Cloudinary (CDN)
- Processamento: Multer (memoryStorage)

### Validação

- Todas as rotas têm validação de dados via Zod
- Mensagens de erro são descritivas e em português
- Erros de validação retornam código 400

---

**Documento criado em**: 12/11/2025  
**Versão da API**: 2.0.0  
**Última atualização**: 30/01/2026
