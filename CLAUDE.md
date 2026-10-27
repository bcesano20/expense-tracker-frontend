# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SpendWise — a personal finance SPA (React 19, TypeScript 6, Vite 8, Tailwind 4, React Router 7, Recharts, Axios). UI text is in Spanish (`es-AR` locale). This repo is the frontend only; it talks to a separate REST backend.

## Commands

```bash
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # tsc -b && vite build
npm run lint         # eslint .
npm run lint:fix
npm run format       # prettier --write "src/**/*.{ts,tsx,css}"
```

There is no test runner configured. CI (`.github/workflows/lint.yml`, Node 22) runs, in order: `npm run lint`, `npx tsc --noEmit`, `npx prettier --check "src/**/*.{ts,tsx,css}"`, `npm run build`. Run all four before opening a PR.

Lint rules that bite: `no-console` is a warning (use `// eslint-disable-next-line no-console` where logging is intentional), `consistent-type-imports` is an error (use `import type`), and unused args must be prefixed with `_`. Prettier: no semicolons, single quotes, 100 cols, `arrowParens: avoid`.

## Configuration

The API base URL comes from `VITE_API_URL` (see `.env`), falling back to `http://localhost:3001/api` (`src/services/api.ts`). Endpoint paths and `ROUTES` live in `src/helpers/constants.ts`, along with `ERROR_MESSAGES` and `MONTHS`. App name, URLs and brand colors are in `src/config/branding.ts`.

## Architecture

Layering is strictly **page → hook → service → axios instance**, with all shared types in `src/types/index.ts`:

- `src/services/*` — one object per domain (e.g. `expensesService`), thin Axios calls returning `response.data.data` of an `ApiResponseInterface<T>`. All go through the shared instance in `services/api.ts`, whose interceptors attach `Bearer <localStorage token>` and, on a 401 while a token exists, clear `token`/`user` and hard-redirect to the login route.
- `src/hooks/*` — one hook per domain (`useExpenses`, `useCards`, `useBudgets`, …) owning `loading`/`error`/data state and the CRUD callbacks. Mutations update local state optimistically and rethrow errors so the calling modal can display them. Pages typically refetch the list and the monthly report after a mutation, since a change affects both.
- `src/pages/*` — route-level components, lazy-loaded in `App.tsx`. `ProtectedRoute` gates everything except login/register on `state.isAuthenticated`.
- `src/components/*` — shared UI, re-exported via `components/index.ts`. Create/edit forms are modals in `components/Modal/` that take an `onSubmit` returning a promise and show thrown errors inline.

**Auth and active account:** `contexts/authContext.tsx` (reducer) + `authProvider.tsx` hold the user, token and `activeAccountId`; the token/user are mirrored in `localStorage` and restored in `AppContent` on load. After login, `AppContent` auto-selects the first account as active. Almost every data request is scoped by `accountId` from the active account, and currency formatting follows the account's currency.

**Domain model:** a user has accounts; an account has expenses, incomes, cards and per-category budgets. Expenses can have `installments` (credit cards only). Reports (`useReports`, `useMonthlyReports`, `reportServices`) are computed server-side and consumed as-is.

## Payment methods

`ExpenseInterface.paymentMethod` is the `PaymentMethod` union (`'CASH' | 'TRANSFER' | 'DEBIT' | 'CREDIT' | 'OTHER'`), mirroring the backend enum. `CREDIT`/`DEBIT` expenses require a `cardId` of the matching card type, and only `CREDIT` supports installments (`totalInstallments` is sent in the create payload but is not part of `ExpenseInterface`). Labels and icons for these values are duplicated in `expensesPage.tsx`, `ExpenseTable.tsx`, `ExpenseModal.tsx` and `helpers/utils.ts`, so update them together if the enum changes.
