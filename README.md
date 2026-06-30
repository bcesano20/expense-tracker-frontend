# SpendWise — Frontend

A personal expense tracker that lets you record expenses, categorize them, track credit/debit card installments, and analyze spending through monthly reports and charts.

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
