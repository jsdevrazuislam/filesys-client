# SaaS File Management System - Frontend

A premium, production-grade frontend for a SaaS File Management System built with Next.js, React, and TypeScript.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **State Management**: Zustand
- **Form Management**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI + Lucide React
- **Icons**: Remix Icon

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v20+)
- pnpm (recommended) or npm

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Installation
```bash
pnpm install
```

### 4. Development
```bash
pnpm dev
```

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts development server |
| `pnpm build` | Creates optimized production build |
| `pnpm start` | Starts production server |
| `pnpm lint` | Runs ESLint and Prettier checks |
| `pnpm lint:fix` | Automatically fixes lint errors and formatting |

## 🛡 Code Quality Standards

- **Strict Type Enforcement**: No `any` types. Configuration includes `noImplicitAny`, `strictNullChecks`, etc.
- **ESLint & Prettier**: Enforced via pre-commit hooks. No `eslint-disable` allowed.
- **Import Sorting**: Automated import sorting using `eslint-plugin-simple-import-sort`.
- **CI/CD**: Automated GitHub Actions pipeline for every Push and PR (Type Check, Lint, Build).

## 🚀 Development Workflow

1. **Local Dev**: `pnpm dev`
2. **Commit Hooks**: Automatically runs ESLint, Prettier, and Build checks on every commit using Husky and lint-staged.
3. **Linting**: Manual check: `pnpm lint`
4. **Type Checking**: Manual check: `npx tsc --noEmit`
5. **Production Build**: `pnpm build`

## 📦 Build & Deployment

- To build for production: `pnpm build`
- To run production build locally: `pnpm start`

