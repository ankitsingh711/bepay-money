# bepay — Merchant App

A responsive merchant payment experience for **bepay**, a non-custodial crypto payments super app. Merchants can review payment metrics, search and inspect transactions, create payment links, and manage payment-link detail pages.

Built as a take-home assignment. No real blockchain, wallet, or settlement functionality — all payment data is mocked and the app is designed as though it integrates with a real backend API.

> **🔗 Live demo:** **https://bepay-money.vercel.app**
> **📦 Source:** https://github.com/ankitsingh711/bepay-money
>
> The live demo seeds itself with mock data on first load. To enter the app directly, sign in from `/login` (any credentials work) or complete the onboarding flow — the session is mocked client-side.

---

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + React 19** | File-based routing, RSC-ready, great DX, easy deploy |
| Language | **TypeScript** (strict) | Type-safe domain model end-to-end |
| Styling | **Tailwind CSS v4** | Design tokens via `@theme`, fast iteration, matches the Figma system |
| Components | **Hand-built kit on Radix UI primitives** | Accessible dialogs/drawers/selects/switches without inheriting an off-brand look |
| Data fetching | **TanStack Query** | Caching, loading/error states, request dedupe, `placeholderData` for smooth pagination |
| Forms | **React Hook Form + Zod** | Declarative validation, minimal re-renders, schema reused for types |
| Mock API | **MSW (Mock Service Worker)** | Intercepts real `fetch` calls — closest thing to a real backend |
| Money | **BigInt minor-units utility** | No floating-point errors in currency math |
| Misc | `qrcode.react`, `sonner` (toasts), `date-fns`, `lucide-react` | QR codes, feedback, dates, icons |
| Testing | **Vitest + Testing Library** | Fast unit/component tests |

---

## Getting started

**Prerequisites:** Node ≥ 18 and [pnpm](https://pnpm.io) (or npm).

```bash
pnpm install
pnpm dev
```

Open **http://localhost:3000**.

> On first load the app waits briefly while the MSW service worker registers, then all data is served by the in-browser mock API.

### Scripts

```bash
pnpm dev         # start dev server
pnpm build       # production build
pnpm start       # serve the production build
pnpm test        # run unit/component tests once
pnpm test:watch  # watch mode
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit
```

---

## Architecture

```
src/
  app/
    (app)/                     # authenticated shell (sidebar + topbar)
      page.tsx                 # Dashboard
      payments/                # Payment history + transaction detail page
      payment-links/           # List, /new (create), /[id] (detail)
      settings/                # stub
    layout.tsx, providers.tsx  # fonts, MSW bootstrap, React Query, toasts
  components/
    ui/                        # design-system primitives (button, card, dialog, sheet, table…)
    layout/                    # sidebar, topbar, app shell, brand, nav config
    dashboard/ payments/ payment-links/ charts/ common/   # feature components
  hooks/                       # React Query hooks + query keys, useDebounce
  lib/
    api/                       # client (fetch wrapper) + services (one fn per endpoint)
    mocks/                     # MSW handlers + in-memory store + seed data
    types.ts money.ts format.ts validation.ts csv.ts utils.ts
  test/                        # vitest setup
```

### Data flow / separation of concerns

```
Component → React Query hook → service fn → fetch (apiClient) → MSW handler → in-memory store
```

- **Components never call `fetch` or build URLs.** They use hooks (`useTransactions`, `useCreatePaymentLink`, …).
- **Services** (`lib/api/services.ts`) are the single typed interface to the backend — one function per endpoint in the suggested contract. Swapping MSW for a real API means changing only the base URL / handlers; the rest of the app is untouched.
- **The mock store** (`lib/mocks/store.ts`) owns all filter/search/paginate/create logic, keeping handlers thin and realistic.

### Mocked API (matches the suggested contract)

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/dashboard/summary` | totals, deltas, recent transactions |
| GET | `/api/transactions` | `status`, `search`, `network`, `from`, `to`, `page`, `limit` |
| GET | `/api/transactions/:id` | 404 when missing |
| GET | `/api/payment-links` | `status`, `search`, `page`, `limit` |
| POST | `/api/payment-links` | validates, returns the created link (201) |
| GET | `/api/payment-links/:id` | includes the associated transaction once paid |
| GET | `/api/wallet` | balance, address, and per-token holdings |

All handlers add artificial latency so loading states are visible; error responses are returned for missing resources so error states are exercised.

### Money handling

Currency amounts are stored as **decimal strings** and all arithmetic goes through **BigInt minor units** (`lib/money.ts`) — `0.1 + 0.2` is exactly `0.30`, never `0.30000000000000004`. Display precision is per-token (stablecoins 2dp, ETH 4dp). See `money.test.ts`.

---

## Features implemented

### A. Dashboard
Built to match the provided Figma dashboard: a dark app shell (collapsible sidebar with profile, dark topbar with white **Withdraw**) wrapping a white content panel containing —
- **Premium card**, **Payouts** & **Turnover** stat cards.
- **My Account Info**: live wallet balance (from `GET /api/wallet`, hide toggle) + **Send / Receive / Pay Link / Swap** actions.
- **Total Monthly Turnover** panel: Week/Month/Year/Custom tabs + bar chart (with highlighted month tooltip) + **Plan for May** progress donut.
- **Payments** market table and **Total Monthly Tokens** donut + holdings list.
- Loyalty promo cards.

> Product note: the brief lists four KPI cards (total received / successful / pending / failed-expired). The provided design instead shows Payouts/Turnover/Monthly-Turnover, so the dashboard follows the design. The pending/confirmed/failed/expired breakdown is fully available on **Payment History** via its status filters.

### B. Payment history
- Table with status, customer, network, amount, date.
- **Search** (debounced) by ID / title / reference; **status** segmented filter; **advanced filters** drawer (network + date range, server-side).
- **Pagination** with page metadata ("Showing 1–10 of 43").
- **Transaction detail** as a drawer on the list **and** a deep-linkable page (`/payments/:id`).
- **CSV / JSON export** of the filtered set (optional enhancement).

### C. Payment links (list + create)
- **Invoice-style table**: Invoice ID, Order ID, currency, copyable invoice URL, status pills (**Completed / In progress / Failed**), created/updated date & time, with zebra striping, search, an **Apply Filters** drawer (payment status, fixed rate, fee-paid-by, payin address, hash, outcome currency) and pagination.
- **Create Payment Tools** modal: pay currency, price, "link for?", collapsible **Additional Settings** (partial payments, reference ID, expiry, internal notes), optional **Customer Details** → success screen with the generated link, copy, and "Share via other apps".
- **Customize payment page** editor (`/payment-links/customize`): logo upload, theme colour, text size & brightness, tagline/description with a **live preview** that drives the public pay page.

### D. Payment-link detail & public page
- Detail view: title + status, amount/token/network, created & expiry, payment URL + copy, QR, distinct **active / paid / expired** presentation, and an **associated transaction** card once a payment exists.
- **Public payment page** (`/pay/[id]`): the customer-facing, unauthenticated page — branded split layout, multi-step deposit flow (choose asset → send → success).

### E. Authentication & onboarding (mocked — optional enhancement)
- **Login** and a full **multi-step onboarding journey**: Create Account → verify email (OTP) → create password → create business account → registered → create shop → shop address (map placeholder) → reward / done.
- Shared **split auth layout** (rotating onboarding carousel + form) matching the Figma.
- **Mocked session** persisted in `localStorage` via `useSyncExternalStore`; a **route guard** redirects unauthenticated users to `/login`, "Log out" clears the session, and onboarding draft state is carried across steps in `sessionStorage`.
- No real backend/credentials — any input works (e.g. the OTP accepts any 6 digits).

### F. Wallet & money movement (mocked)
- Dashboard **"My Account Info" wallet card**: balance (with hide toggle), address, and **Send / Receive / Pay Link / Swap** quick actions.
- **Send** and **Swap** are full right-side **slide-over flows** (token picker with chain filters, address book / contacts, amount, confirmation, security passcode, slippage settings, history) matching the Figma; **Receive** (address + QR) and **Withdraw** (wallet → amount → provider → preview → price alert → OTP, opened from the topbar) are multi-step flows with validation and mocked confirmations. Backed by `GET /api/wallet`.
- **Create wallet** onboarding (`/wallet/new`): select network → seed-phrase wallet → passcode → confirm → biometrics → notifications → backup (manual seed-phrase + confirm quiz, or iCloud name + encryption password).

### G. Public payment page (`/pay/[id]`)
- The customer-facing page a payment link resolves to — outside the app shell and unauthenticated.
- Branded hero (tagline + business name from Appearance settings), amount/token/network, QR, one-tap **Pay** (mocked) → success, plus **paid / expired** states. Reachable via "Preview payment page" on the link detail.

### H. Account & settings
- Settings shell with sub-nav: **My Profile** (basic info, avatar picker, change phone via OTP), **Wallet Security** (manage wallets, create-wallet flow with seed-phrase backup, reveal recovery phrase), **Appearance** (business name, tagline, brand color with a **live preview** that drives the public pay page).

### Cross-cutting
- Loading **skeletons**, **empty** states, **error** states with retry, validation feedback, toasts.
- **Responsive** (desktop sidebar → mobile drawer nav; tables scroll horizontally on small screens).
- **Accessibility**: semantic landmarks, labelled controls, keyboard-operable rows (Enter/Space), focus rings, `aria-current`, Radix focus trapping in dialogs/drawers.

---

## Prioritisation, assumptions & trade-offs

**What I prioritised first and why**
1. **Data/state architecture** (types, money util, service layer, MSW, React Query) before any UI — it's the backbone and the rubric weights it heavily.
2. The **four required flows** end-to-end (dashboard → payments → create link → link detail) over breadth.
3. **States** (loading/empty/error/validation) throughout, since "feel coherent" matters more than extra screens.

**Assumptions (design was provided as Figma frames / screenshots)**
- Beyond the four required merchant flows, the provided designs also covered onboarding/login, wallet money-movement (send/receive/swap/withdraw), create-wallet, and the public pay/customize pages — these were built to match the screenshots as faithful, fully-mocked UI.
- Where exact hex/copy weren't legible, design **tokens** were extracted to match the system (dark sidebar, light canvas, white cards, black pill buttons, green/amber/red/slate status colours) and centralised in `globals.css` — trivially tunable to pixel-match a high-res frame. Supplied raster assets (card art, button icons, illustrations) are used directly from `public/`.
- Dashboard headline totals are shown in a single display currency (USDC) for the demo; a real API would FX-convert per token.

**Intentionally simplified / excluded**
- Charts are lightweight hand-rolled SVG (no charting library) to keep the bundle small and the look on-brand.
- Auth/onboarding is a fully-mocked UI shell (no real backend, credentials, or email/SMS); it persists a fake session client-side. Settings is a stub.
- Component kit covers what the app needs rather than a full design system.

**What I'd do next for production**
- Real API + auth (the service layer is already the seam for this).
- URL-synced filters/pagination (shareable, back-button friendly).
- Optimistic create + server-driven sorting; virtualised tables for large datasets.
- E2E tests (Playwright), Storybook for the UI kit, and i18n/number-locale formatting.

---

## Testing

```bash
pnpm test
```

24 tests covering the highest-risk logic:
- **`money`** — minor-unit conversion, round-tripping, float-drift safety, formatting/precision.
- **`validation`** — the create-payment-link Zod schema (amounts, expiry-in-future, enums).
- **`mocks/store`** — pagination metadata, status filter, search, page clamping, link creation, summary coherence.
- **`StatusBadge`** — status → label mapping (component render test).

`pnpm typecheck`, `pnpm lint`, and `pnpm build` all pass clean.
