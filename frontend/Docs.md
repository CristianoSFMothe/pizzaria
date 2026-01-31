# Documentação detalhada do front-end - Sistema de Pizzaria

## 1) Visão geral

Frontend administrativo em Next.js (App Router) focado na operação diária da
pizzaria. Permite autenticação de usuários, gestão de pedidos em produção,
categorias, produtos e usuários (apenas MASTER). A experiência é enriquecida
com animações via Framer Motion e feedbacks com Sonner.

## 2) Stack principal

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui**
- **Framer Motion** (animações)
- **Zod** (validação de formulários)
- **Sonner** (toasts)
- **Lucide React** (ícones)
- **next-themes** (tema do toaster)

## 3) Arquitetura e fluxo

### App Router
- Rotas em `src/app`.
- Server Components por padrão.
- Client Components onde há interatividade (tabelas, formulários, toasts,
  animações, atualização sem recarregar).

### Camadas principais
- **Pages/Layouts**: definem as rotas e guardas de acesso.
- **Components**: UI e interações (modal, tabela, cards).
- **Actions** (`src/actions`): Server Actions para mutações com
  `revalidatePath`.
- **Lib** (`src/lib`): auth, api client, tipos, utilidades e validações.

### Guardas de acesso
- `src/app/dashboard/layout.tsx` usa `requiredAdmin()`.
- `src/app/dashboard/users/page.tsx` usa `requiredMaster()`.
- Redireciona para `/login` ou `/access-denied` quando necessário.

## 4) Estrutura de pastas

```
src/
├── actions/                 # server actions (auth, categories, products, orders, users)
├── app/                     # rotas (App Router)
│   ├── dashboard/
│   │   ├── page.tsx         # pedidos
│   │   ├── products/        # produtos
│   │   ├── categories/      # categorias
│   │   └── users/           # usuários (MASTER)
│   └── login, register, access-denied
├── components/
│   ├── dashboard/           # cards, tabelas, modais e forms
│   └── ui/                  # shadcn/ui + Sonner
└── lib/                     # auth, api, types, format, validations
```

## 5) Rotas e permissões

| Rota                  | Acesso       | Descrição                    |
| --------------------- | ------------ | ---------------------------- |
| /login                | Público      | Login de usuários            |
| /register             | Público      | Cadastro de usuários         |
| /dashboard            | ADMIN/MASTER | Pedidos em produção          |
| /dashboard/categories | ADMIN/MASTER | Gestão de categorias         |
| /dashboard/products   | ADMIN/MASTER | Gestão de produtos           |
| /dashboard/users      | MASTER       | Gestão de usuários           |
| /access-denied        | Público      | Aviso de acesso negado       |

## 6) Autenticação e sessão

- Token armazenado em cookie httpOnly `token_pizzaria`.
- `loginAction` faz login e chama `setToken`.
- `logoutAction` remove o cookie.
- `requiredAdmin` e `requiredMaster` garantem acesso no server.

## 7) Integração com a API

### Cliente HTTP
- `src/lib/api.ts` encapsula `fetch` e injeta `Authorization` quando há token.
- Aceita `cache: "no-store"` para evitar dados antigos.

### Endpoints usados
- Auth/usuário: `POST /users`, `POST /session`, `GET /me`, `PUT /users/role`
- Pedidos: `GET /orders?draft=false`, `GET /order/detail`, `PUT /order/finish`
- Categorias: `GET /category`, `POST /category`, `PUT /category/update`,
  `DELETE /category/remove`
- Produtos: `GET /product`, `POST /product`, `PUT /product/update`,
  `DELETE /product`

### Upload de imagem
- Criação/edição de produtos usa `multipart/form-data`.
- O frontend valida tamanho e tipo antes do envio.

## 8) Validações e formulários

- `src/lib/validations/auth.ts` (login/registro)
- `src/lib/validations/category.ts` (categorias)
- `src/lib/validations/product.ts` (produtos)
  - tamanho máximo: **5MB**
  - tipos aceitos: **jpg, jpeg, png**

## 9) UI, feedback e animações

- **Tailwind + shadcn/ui** para estrutura visual e componentes base.
- **Sonner** para feedback de sucesso/erro.
- **Framer Motion** para animações:
  - Usuários: títulos e colunas da tabela entram em sequência.
  - Categorias, Produtos e Pedidos: cards surgem da esquerda para a direita.
  - Respeita `prefers-reduced-motion`.

## 10) Fluxos principais

### Login
1. Usuário envia credenciais.
2. `loginAction` autentica e salva cookie.
3. Redireciona para `/dashboard`.

### Categorias
1. Criação via `createCategoryAction`.
2. `revalidatePath("/dashboard/categories")`.
3. `router.refresh()` atualiza a lista.

### Produtos
1. Formulário monta `FormData` com imagem.
2. `createProductAction` ou `updateProductAction` envia.
3. `revalidatePath("/dashboard/products")` atualiza listagem.

### Pedidos
1. Lista em `/dashboard` é carregada no client.
2. Botão de refresh busca novamente.
3. Modal carrega detalhe (`/order/detail`) e finaliza (`/order/finish`).

## 11) Configuração e execução

### Variáveis de ambiente
Crie `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Também é aceito `API_URL`.

### Comandos
```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## 12) Observações importantes

- Preços são tratados em centavos e formatados com `formatPrice`.
- Para dados sempre atuais, algumas requisições usam `cache: "no-store"`.
- As animações podem ser desligadas automaticamente via
  `prefers-reduced-motion`.

---

**Última atualização:** 31/01/2026
