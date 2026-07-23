# SplitLedger

**SplitLedger** is a focused web application designed for fragrance decant and split hosts to accurately and fairly divide bottle costs, shipping expenses, and participant volume allocations (in ml) among multiple buyers. For a complete list of planned features, validation rules, and future scope, refer to the reference specification in [`SplitLedger_FRD_reference.txt`](./SplitLedger_FRD_reference.txt).

---

## Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Code Quality**: ESLint (`next/core-web-vitals`), Prettier (`.prettierrc`), and TypeScript compiler

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

### 4. Run Linter

```bash
npm run lint
```

### 5. Format Code

```bash
npm run format
```

---

## Folder Structure & Conventions

To maintain separation of concerns and a modular architecture, follow these directory conventions for all future contributions:

```
splitledger/
├── app/                      # Next.js App Router routes, layouts, and global styles ONLY
├── components/
│   ├── ui/                   # Reusable, presentation-only primitives (Button, Input, Card, Badge)
│   └── layout/                # Structural layout components (Header, Footer, Container)
├── lib/                      # Pure framework-agnostic business logic, calculations, & utilities
├── hooks/                    # Custom React hooks
├── types/                    # Shared TypeScript interfaces & types
├── constants/                # App constants, defaults, & configuration values
├── styles/                   # Non-Tailwind global styles (if needed)
├── public/                   # Static assets (images, icons)
├── SplitLedger_FRD_reference.txt   # Context reference document (not consumed by code)
├── .env.example              # Environment variables template
├── .eslintrc.json            # ESLint rules
├── .prettierrc               # Prettier code formatting rules
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration & path aliases
└── package.json              # Dependencies and scripts
```

### Architectural Guidelines

- **Business Logic**: Keep pure calculations and domain rules inside `lib/` (never directly inside component bodies).
- **UI Components**: Place generic, stateless controls in `components/ui/`. Components must accept explicit TypeScript `props` interfaces.
- **Path Aliases**: Use `@/components/*`, `@/lib/*`, `@/types/*`, `@/hooks/*`, `@/constants/*` for imports instead of relative paths like `../../../`.
- **Exports**: Use named exports for components and utilities (default exports reserved for Next.js special pages/layouts).
