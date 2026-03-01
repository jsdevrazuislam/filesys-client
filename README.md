# SaaS File Management System — Frontend

A premium, production-grade frontend for a **SaaS File Management System** built with **Next.js 16**, **React 19**, and **TypeScript**. The application provides a fully role-separated dashboard for end users and administrators, with subscription-gated file and folder management, Stripe payment integration, and a rich component library.

**Live Demo:** [https://filesys-client.vercel.app](https://filesys-client.vercel.app)

---

## ✨ Features

### User Dashboard
- 📁 **File & Folder Management** — Browse, upload, and organize files within nested folder structures
- 📦 **Subscription Management** — View active subscription plan, usage quotas, and upgrade options
- 🧾 **Stripe Payment Flow** — Seamlessly subscribe to or change packages via Stripe checkout
- 🔐 **Secure Authentication** — JWT-based login with cookie-managed sessions, email verification, forgot/reset password flows

### Admin Dashboard
- 👥 **User Management** — View all registered users, inspect individual profiles and subscription status
- 📦 **Package Management** — Create, update, and delete subscription packages with granular storage and file-type controls
- 📊 **Activity Logs** — Track system-wide user activity across the platform
- 📈 **Admin Dashboard Overview** — Key metrics and live platform statistics

### Platform-Wide
- 🌗 **Dark / Light Mode** — Persistent theme switching via `next-themes`
- ♿ **Accessible UI** — Radix UI primitives via Shadcn UI components
- 📱 **Responsive Design** — Fully adaptive layout from mobile to desktop

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Library** | React 19 |
| **Language** | TypeScript 5 (Strict Mode) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) 5 |
| **Server State / Fetching** | [TanStack Query](https://tanstack.com/query/latest) (React Query) 5 |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) (Radix UI), Base UI |
| **Icons** | [Lucide React](https://lucide.dev/) + [Remix Icon](https://remixicon.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Date Handling** | [date-fns](https://date-fns.org/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/admin/            # Admin-only route group
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── users/                # User management pages
│   │   ├── packages/             # Subscription package management
│   │   └── activity-logs/        # Activity log viewer
│   ├── (user)/user/              # Authenticated user route group
│   │   ├── page.tsx              # User dashboard
│   │   ├── files/                # File & folder management
│   │   └── subscription/         # Subscription & billing
│   ├── forgot-password/          # Forgot password flow
│   ├── reset-password/           # Password reset flow
│   ├── register/                 # Registration page
│   ├── verify-email/             # Email verification
│   └── verify-notice/            # Post-registration notice
├── components/
│   ├── auth/                     # Authentication form components
│   ├── files/                    # File/folder UI components
│   ├── layouts/                  # Shell and sidebar layouts
│   ├── modal/                    # Reusable modal dialogs
│   ├── shared/                   # Shared utility components
│   ├── theme/                    # Theme toggle
│   └── ui/                       # Shadcn UI component library
├── features/
│   ├── auth/                     # Auth API queries & mutations
│   ├── dashboard/                # Dashboard data hooks
│   └── packages/                 # Package API hooks
├── hooks/
│   ├── api/                      # API-specific data fetching hooks
│   ├── use-auth-state.ts         # Auth state hook
│   └── use-mobile.ts             # Responsive breakpoint hook
├── lib/                          # Utilities (axios instance, cn helper, etc.)
├── providers/                    # React context providers (QueryClient, Theme)
├── store/
│   ├── auth-store.ts             # Zustand auth store
│   └── ui-store.ts               # Zustand UI/sidebar store
└── types/                        # Shared TypeScript type definitions
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** v20+
- **npm** or **pnpm** (recommended)

### 2. Clone the Repository
```bash
git clone https://github.com/jsdevrazuislam/filesys-client
cd filesys-client
```

### 3. Environment Variables
Create a `.env.local` file in the `client/` root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 5. Run Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server with hot reload |
| `pnpm build` | Creates an optimized production build |
| `pnpm start` | Starts the production server |
| `pnpm lint` | Runs ESLint checks across the codebase |
| `pnpm lint:fix` | Auto-fixes ESLint and Prettier violations |
| `npx tsc --noEmit` | Runs TypeScript type checking without emitting files |

---

## 🛡 Code Quality Standards

- **Strict TypeScript** — No `any` types. `noImplicitAny`, `strictNullChecks`, and related flags are enforced.
- **ESLint** — Extends `next/core-web-vitals` with `eslint-plugin-prettier`, `eslint-plugin-simple-import-sort`, and `eslint-plugin-eslint-comments`. No `eslint-disable` directives are permitted.
- **Prettier** — Consistent code formatting enforced via the ESLint Prettier plugin.
- **Import Sorting** — Automated import ordering using `eslint-plugin-simple-import-sort`.
- **Pre-commit Hooks** — Husky + lint-staged run ESLint and Prettier automatically on staged files before every commit.
- **Conventional Commits** — Commit messages are enforced using `commitlint` with the conventional commit spec.

---

## 🔄 CI/CD Pipeline

Automated via **GitHub Actions** on every push and pull request to `main`, `master`, and `develop` branches.

**Pipeline steps (Node.js 20.x & 22.x matrix):**
1. Checkout code
2. Install dependencies (`npm install`)
3. Type check (`npx tsc --noEmit`)
4. Lint (`pnpm lint`)
5. Build (`pnpm build`)

---

## 🚀 Deployment

The frontend is deployed on **[Vercel](https://vercel.com/)**.

- **Live URL:** [https://filesys-client.vercel.app](https://filesys-client.vercel.app)
- Set the `NEXT_PUBLIC_API_URL` environment variable in your Vercel project settings to point to the production backend URL.
- Vercel automatically runs `pnpm build` on every push to the connected branch.
