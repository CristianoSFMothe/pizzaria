# Sistema de Pizzaria - Backend

![Node.js](https://img.shields.io/badge/node-20_LTS-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/express-5.x-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/prisma-7.x-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169E1?logo=postgresql&logoColor=white)

Backend REST em Node.js/TypeScript baseado em Express 5, com arquitetura em
camadas (Rotas -> Middlewares -> Controllers -> Services -> Prisma). A API
implementa autenticacao JWT, autorizacao por role (MASTER/ADMIN/STAFF) e validacao de
entrada via Zod. Os dados sao persistidos em PostgreSQL com Prisma ORM, incluindo
relacionamentos entre Order, Item e Product. O modulo de upload utiliza Multer
em memoria e integracao com Cloudinary para imagens de produtos.

Roles disponiveis: MASTER, ADMIN e STAFF. O MASTER herda todos os privilegios
do ADMIN e possui rotas exclusivas (ex: atualizar role de usuario).

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express 5
- Prisma ORM
- Zod
- JWT
- bcryptjs
- Multer
- Cloudinary
- tsx / nodemon

## Banco de dados utilizado

- PostgreSQL

## Versao do Node

- Recomendado: Node.js 20 LTS

## Mapeamento das rotas (resumo)

| Metodo | Rota              | Descricao                         |
| ------ | ----------------- | --------------------------------- |
| POST   | /users            | Cria usuario                      |
| POST   | /session          | Autentica usuario                 |
| GET    | /me               | Detalhe do usuario                |
| GET    | /users            | Lista usuarios                    |
| PUT    | /users/role       | Atualiza role do usuario          |
| GET    | /category         | Lista categorias                  |
| POST   | /category         | Cria categoria                    |
| DELETE | /category/remove  | Desativa categoria                |
| PUT    | /category/update  | Atualiza nome da categoria        |
| GET    | /category/product | Lista produtos por categoria      |
| POST   | /order            | Cria pedido                       |
| GET    | /orders           | Lista pedidos (filtra por draft)  |
| POST   | /order/add        | Adiciona item ao pedido           |
| DELETE | /order/remove     | Remove item do pedido             |
| GET    | /order/detail     | Detalha pedido                    |
| PUT    | /order/send       | Envia pedido (draft=false)        |
| PUT    | /order/finish     | Finaliza pedido                   |
| DELETE | /order            | Deleta pedido                     |
| POST   | /product          | Cria produto                      |
| GET    | /product          | Lista produtos                    |
| DELETE | /product          | Desativa produto                  |
| PUT    | /product/update   | Atualiza produto                  |
| GET    | /docs             | Swagger UI                        |
| GET    | /docs.json        | OpenAPI JSON                      |

## Comando para instalar versoes

```bash
npm install
```

## Comando para executar

```bash
npm run dev
```

## Seed do usuario MASTER

Cria o usuario MASTER (caso nao exista) para controlar o sistema.

```bash
npm run seed
```

Variaveis usadas no seed: `MASTER_EMAIL`, `MASTER_PASSWORD` e `MASTER_NAME`
(opcional).

## Variaveis de ambiente

Copie `.example.env` para `.env` e ajuste os valores.

- PORT
- JWT_SECRETE
- DATABASE_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_URL
- MASTER_EMAIL
- MASTER_PASSWORD
- MASTER_NAME

## Testes

```bash
npm test
npm run test:watch
npm run test:user
npm run test:user-service
npm run test:user-controller
npm run test:product
npm run test:product-serve
npm run test:product-controller
npm run test:category
npm run test:category-service
npm run test:category-controller
npm run test:order
npm run test:order-service
npm run test:order-controller
```

## Documentacao da API (Swagger)

- Swagger UI: http://localhost:3333/docs
- OpenAPI JSON: http://localhost:3333/docs.json
- Arquivo fonte: docs/openapi.yaml

## Documentacao extra

- endpoints: `endpoints.md`
- documentacao detalhada: `Docs.md`

## Como clonar o projeto e colaborar

1. Faca um fork do repositorio.
2. Clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
```

3. Crie uma branch:

```bash
git checkout -b feat/minha-alteracao
```

4. Envie suas alteracoes e abra um Pull Request.

## Autor

- Cristiano da Silva Ferreira
- GitHub: https://github.com/CristianoSFMothe
- Portfolio: https://portfolio-qa-cristiano.vercel.app/
- LinkedIn: https://www.linkedin.com/in/cristiano-da-silva-ferreira/
