# SpendWise — Frontend

SpendWise is a personal finance app to track expenses and incomes across multiple accounts. It supports expense categorization, optional notes, credit/debit card management with installment tracking, budget definition per category, and full monthly reporting with charts.

Key features:
- Multi-account support with per-account currency (ARS, USD, EUR)
- Expense and income management with month/year filtering and pagination
- Credit card installment tracking with per-card payment summaries
- Budget status per category (fixed amount or range)
- Monthly reports: category pie chart, payment method bar chart, month-over-month comparison, and income/expense ratio
- Confirmation modal for all delete operations with inline error handling
- Locale-aware number formatting (`es-AR`)

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** — dev server and bundler
- **Tailwind CSS 4** — styling
- **React Router 7** — client-side routing
- **Recharts** — charts and data visualization
- **Axios** — HTTP client
- **ESLint** + **Prettier** — linting and formatting

## Project Structure

```
src/
├── components/     # Reusable UI components (Navbar, Footer, Table, Charts, Modals)
├── config/         # App-wide configuration (branding)
├── contexts/       # React context providers (auth)
├── helpers/        # Constants and utility functions
├── hooks/          # Custom hooks (useExpenses, useAccounts, useMonthlyReports…)
├── pages/          # Route-level page components
├── services/       # Axios API calls per domain (expenses, reports, auth…)
└── types/          # Shared TypeScript interfaces
```

## Run Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## CI Checks

The CI pipeline runs on every push and pull request to `main` via GitHub Actions (`.github/workflows/lint.yml`). It runs the following checks in order:

| Step | Command |
|---|---|
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` |
| Format check | `npx prettier --check "src/**/*.{ts,tsx,css}"` |
| Build | `npm run build` |

Run them locally before opening a PR:

```bash
npm run lint
npx tsc --noEmit
npx prettier --check "src/**/*.{ts,tsx,css}"
npm run build
```

To auto-fix lint and formatting issues:

```bash
npm run lint:fix
npm run format
```
