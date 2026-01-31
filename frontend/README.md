# Sistema de Pizzaria - Frontend

![Next.js](https://img.shields.io/badge/next.js-16.x-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=000000)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4.x-38B2AC?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI-111827?logo=shadcnui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/framer--motion-animations-ff008c?logo=framer&logoColor=white)

Frontend em Next.js (App Router) com React e TypeScript. A aplicação consome a
API do sistema de pizzaria, autentica usuários via cookie httpOnly e permite
gerenciar pedidos, categorias, produtos e usuários (MASTER). A UI utiliza
Tailwind CSS, shadcn/ui, Sonner e animações com Framer Motion.

## Tecnologias utilizadas

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- Framer Motion (animações)
- Zod (validações de formulários)
- Sonner (toasts)
- Lucide React (ícones)
- next-themes (tema do toaster)
- ESLint / Prettier

## Versão do Node

- Recomendado: Node.js 20 LTS

## Principais páginas e permissões

| Rota                  | Acesso           | Descrição                          |
| --------------------- | ---------------- | ---------------------------------- |
| /login                | Público          | Login de usuários                  |
| /register             | Público          | Cadastro de usuários               |
| /dashboard            | ADMIN/MASTER     | Pedidos em produção                |
| /dashboard/categories | ADMIN/MASTER     | Gestão de categorias               |
| /dashboard/products   | ADMIN/MASTER     | Gestão de produtos                 |
| /dashboard/users      | MASTER           | Gestão de usuários                 |
| /access-denied        | Público          | Aviso de acesso negado             |

## Integração com a API

A aplicação consome o backend via `NEXT_PUBLIC_API_URL` (ou `API_URL`) e utiliza
os endpoints:

- POST /users (cadastro)
- POST /session (login)
- GET /me (dados do usuário)
- PUT /users/role (troca de cargo)
- GET /orders?draft=false (pedidos em produção)
- GET /order/detail (detalhe do pedido)
- PUT /order/finish (finalizar pedido)
- GET /category (listar categorias)
- POST /category (criar categoria)
- PUT /category/update (atualizar categoria)
- DELETE /category/remove (excluir categoria)
- GET /product (listar produtos)
- POST /product (criar produto)
- PUT /product/update (atualizar produto)
- DELETE /product (desativar produto)

Observação: criação/atualização de produto usa `multipart/form-data` com imagem.

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Observação: também é aceito `API_URL`, mas o recomendado no frontend é
`NEXT_PUBLIC_API_URL`.

## Comandos

```bash
npm install
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servidor de produção
npm run lint    # lint
```

## Testes

- Não há suíte de testes configurada no momento.

## Como clonar o projeto e colaborar

1. Faça um fork do repositório.
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
