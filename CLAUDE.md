# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SpendWise — a personal finance SPA (React 19, TypeScript 6, Vite 8, Tailwind 4, React Router 7, Recharts, Axios). UI text is in Spanish (`es-AR` locale). This repo is the frontend only; it talks to a separate Express + Prisma REST backend, checked out next to this repo as `../expense-tracker-backend` (read its controllers/routes when you need an endpoint's real request/response shape).

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

- `src/services/*` — one object per domain (e.g. `expensesService`), thin Axios calls returning `response.data.data` of an `ApiResponseInterface<T>`. All go through the shared instance in `services/api.ts`, whose interceptors attach `Bearer <localStorage token>` and an `X-Timezone` header (the browser's timezone; the backend runs in UTC and uses it to decide what "the current month" is, e.g. which installments are overdue) and, on a 401 while a token exists, clear `token`/`user` and hard-redirect to the login route.
- `src/hooks/*` — one hook per domain (`useExpenses`, `useCards`, `useBudgets`, …) owning `loading`/`error`/data state and the CRUD callbacks. Pages typically refetch the list and the monthly report after a mutation, since a change affects both.
- **Error convention:** a hook's `error` is for failing to *load* the data, and is what tables render. A failed create/update/delete must not set it: let the error propagate so the modal that triggered it shows it inline (`ExpenseModal` shows `err.message`, `DeleteModal` shows its own message). Otherwise the table shows the error after the modal is closed. Services should surface the backend's `message` (see `rethrowWithApiMessage` in `helpers/utils.ts`) because business errors such as insufficient funds only exist there.
- `src/pages/*` — route-level components, lazy-loaded in `App.tsx`. `ProtectedRoute` gates everything except login/register on `state.isAuthenticated`.
- `src/components/*` — shared UI, re-exported via `components/index.ts`. Create/edit forms are modals in `components/Modal/` that take an `onSubmit` returning a promise and show thrown errors inline.

**Auth and active account:** `contexts/authContext.tsx` (reducer) + `authProvider.tsx` hold the user, token and `activeAccountId`; the token/user are mirrored in `localStorage` and restored in `AppContent` on load. After login, `AppContent` auto-selects the first account as active. Almost every data request is scoped by `accountId` from the active account, and currency formatting follows the account's currency.

**Domain model:** a user has accounts; an account has expenses, incomes, cards, per-category budgets and an optional wallet. Expenses can have `installments` (credit cards only). Reports (`useReports`, `useMonthlyReports`, `reportServices`) are computed server-side and consumed as-is.

**Money:** the backend stores amounts as `Decimal(12,2)` (max `9999999999.99`) and serializes them as **strings** in JSON. Display-only values can be converted with `Number()` in the service (as `walletServices.ts` does), but amounts the user types should be validated against `REGEXP.AMOUNT_REGEX` and sent as strings so the backend parses them as exact decimals, never through a float. The older forms (`ExpenseModal`, `IncomeModal`, …) still use `parseFloat`.

**Wallet:** one per account, created explicitly (`POST /wallets/account/:accountId` rejects a request without `balance`, so send `'0'`). Every wallet endpoint returns the same summary (`WalletSummaryInterface`: `hasWallet`, `walletBalance`, `debitBalance`, `totalBalance`); an account without a wallet is `hasWallet: false`, not a 404. The total is calculated by the backend (wallet + active debit cards), so refetch the wallet after anything that changes card balances. `CASH`/`TRANSFER`/`OTHER` expenses take money from the wallet (only if the account has one) and `DEBIT` ones from the card; when funds are short the backend answers 400 with `INSUFFICIENT_FUNDS` / `INSUFFICIENT_CARD_FUNDS` and a message saying how much is missing.

**Month closing:** "Cerrar Balance de Mes" (reports page) closes the month selected in the MonthSelector, and its button is disabled until that month is over (`hasMonthEnded()` in `helpers/utils.ts`; October's button is disabled until November starts) or once it is closed. The backend (`/month-closings`) only allows it when, in this order: the month has ended, it isn't before the month the wallet was activated, the month before it is already closed (except the activation month) and every installment with that payment month is paid; it also needs a wallet. The preview returns a `firstFailure` code and the Spanish text for each one lives in `CLOSING_BLOCK_MESSAGES`. Closing is irreversible, stores the savings (incomes − non-credit expenses − credit installments of the month), never touches the wallet, and afterwards the backend rejects creating/editing/deleting expenses and incomes of that month (409 `MONTH_CLOSED`), so surface the backend message for those writes.

## Payment methods

`ExpenseInterface.paymentMethod` is the `PaymentMethod` union (`'CASH' | 'TRANSFER' | 'DEBIT' | 'CREDIT' | 'OTHER'`), mirroring the backend enum. `CREDIT`/`DEBIT` expenses require a `cardId` of the matching card type, and only `CREDIT` supports installments (`totalInstallments` is sent in the create payload but is not part of `ExpenseInterface`). Labels and icons for these values are duplicated in `expensesPage.tsx`, `ExpenseTable.tsx`, `ExpenseModal.tsx` and `helpers/utils.ts`, so update them together if the enum changes.
