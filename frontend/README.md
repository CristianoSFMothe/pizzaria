# Sistema de Pizzaria - Frontend

![Next.js](https://img.shields.io/badge/next.js-16.x-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=000000)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4.x-38B2AC?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI-111827?logo=shadcnui&logoColor=white)

Frontend em Next.js (App Router) com React e TypeScript. A aplicação consome a
API do sistema de pizzaria, oferece autenticação via cookie httpOnly e permite
gerenciar pedidos, categorias e produtos. A camada de UI utiliza Tailwind CSS,
componentes shadcn/ui.

## Tecnologias utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod (validações de formulários)
- Lucide React (ícones)
- ESLint / Prettier

## Versão do Node

- Recomendado: Node.js 20 LTS

## Principais paginas e fluxos

| Rota                  | Descricao                        |
| --------------------- | -------------------------------- |
| /login                | Login de usuários                |
| /register             | Cadastro de usuários             |
| /dashboard            | Lista e gestão de pedidos        |
| /dashboard/categories | Listagem e criação de categorias |
| /dashboard/products   | Listagem e criação de produtos   |
| /access-denied        | Aviso de acesso negado           |

## Integração com a API

A aplicação consome o backend via `NEXT_PUBLIC_API_URL` e utiliza os endpoints:

- POST /users (cadastro)
- POST /session (login)
- GET /me (dados do usuário)
- GET /orders?draft=false (pedidos em produção)
- PUT /order/finish (finalizar pedido)
- GET /category (listar categorias)
- POST /category (criar categoria)
- POST /product (criar produto)
- DELETE /product (desativar produto)

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Observação: também e aceito `API_URL`, mas o recomendado no frontend e
`NEXT_PUBLIC_API_URL`.

## Comando para instalar dependências

```bash
npm install
```

## Comandos para executar

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servidor de produção
npm run lint    # lint
```

## Testes

- Nao ha suite de testes configurada no momento.

## Como clonar o projeto e colaborar

1. Faca um fork do repositório.
2. Clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
```

3. Crie uma branch:

```bash
git checkout -b feat/minha-alteracao
```

4. Envie suas alterações e abra um Pull Request.

## Autor

- Cristiano da Silva Ferreira
- GitHub: https://github.com/CristianoSFMothe
- Portfolio: https://portfolio-qa-cristiano.vercel.app/
- LinkedIn: https://www.linkedin.com/in/cristiano-da-silva-ferreira/
