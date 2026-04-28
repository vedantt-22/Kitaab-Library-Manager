# 📚 Kitaab-Library Manager

> A production-grade **Library Management System** built with **Angular 21** using a fully **Standalone Component** architecture. It features complex borrowing workflows, automated fine calculations, role-based access control, and a high-tech **Cyber-Glass** UI.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (Standalone Components) |
| Language | TypeScript 5.9 |
| State / Async | RxJS 7.8 (`combineLatest`, `takeUntil`, `debounceTime`) |
| Forms | Reactive Forms & Template-Driven Forms |
| Styling | Custom CSS (Glass-morphism / Cyber-Glass theme) |
| Auth | JWT via `HttpInterceptor` |
| Testing | Vitest + jsdom |
| Linting / Format | Prettier |
| Backend | Node.js / Express (bundled in `server.zip`) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** — LTS version recommended
- **Angular CLI** — `npm install -g @angular/cli`

### 1 · Start the Backend

```bash
# Extract server.zip, then:
cd server
npm install
npm start
# API available at http://localhost:3001
```

### 2 · Start the Frontend

```bash
cd library          # root of the Angular project
npm install
ng serve
# App available at http://localhost:4200
```

---

## 🔑 Test Credentials

| Role | Username | Password |
|---|---|---|
| **Librarian (Admin)** | `admin` | `admin123` |
| **Regular User** | `user1` | `user123` |

---

## 🗂 Project Structure

```
src/app/
├── auth/
│   ├── login/               # Template-driven login form
│   ├── register/            # Registration form
│   ├── guards/
│   │   ├── auth.guard.ts    # Protects authenticated routes
│   │   └── librarian.guard.ts  # Restricts admin routes
│   ├── interceptors/
│   │   ├── auth.interceptor.ts   # JWT injection
│   │   └── error.interceptor.ts  # Global HTTP error handling
│   └── auth.service.ts
│
├── books/
│   ├── book-list/           # Public catalogue with search + category filter
│   ├── book-card/           # OnPush card component
│   ├── book-detail/         # Detailed book view
│   ├── book.service.ts
│   └── books.routes.ts
│
├── my-books/
│   ├── my-books.ts          # User's active loans portal
│   ├── issue.service.ts     # Borrow / renew / return logic
│   └── fine.service.ts      # Fine retrieval and payment
│
├── librarian/
│   ├── dashboard/           # Real-time stats + overdue report
│   ├── manage-books/
│   │   ├── book-form/       # Reactive CRUD form (add / edit)
│   │   └── book-list-admin/ # Admin book table
│   ├── manage-users/
│   │   └── user-list/       # Activate / deactivate accounts
│   ├── stats-service/       # Dashboard analytics service
│   └── users-service/       # User management service
│
├── shared/
│   ├── borrow-action/       # Shared borrow / return action component
│   ├── confirm-dialog/      # Reusable modal (ng-content projection)
│   ├── loading-spinner/     # OnPush spinner
│   ├── profile-component/   # User profile view
│   ├── days-until.pipe.ts   # Relative-date pipe
│   ├── overdue-status.pipe.ts  # Badge-logic pipe
│   ├── truncate.pipe.ts     # Text truncation pipe
│   ├── highlight-directive.ts  # [appHighlight] attribute directive
│   └── role-directive.ts    # *appRole structural directive
│
└── models/
    ├── book.model.ts
    ├── user.model.ts
    ├── issue.model.ts
    └── fine.model.ts        # Fine, FinesResponse, FinePreview
```

---

## ✨ Features

### Librarian (Admin) Module

- **Inventory Heat Map** — Calculates "Collection Utilisation" percentages and maps them to HSL colour gradients (Cyan → cool/available, Purple/Pink → hot/borrowed).
- **Dashboard** — Real-time stats from `/api/stats/dashboard` plus an automated Overdue Report.
- **Book Management** — Full CRUD via Reactive Forms with `patchValue` for pre-populating edits.
- **User Management** — Activate or deactivate user accounts from an admin table.

### User Module

- **Public Catalogue** — Advanced search with `debounceTime` + `distinctUntilChanged`, plus a live Category Filter driven by `combineLatest`.
- **Borrowing & Renewals** — Real-time `issued` / `overdue` / `returned` tracking; renewals capped at **2 per book**.
- **Personal Portal** — View active loans, days remaining, and pending fines with an integrated payment workflow.

---

## 🔬 Advanced Concepts

| Concept | Where |
|---|---|
| **`OnPush` Change Detection** | `BookCardComponent`, `LoadingSpinnerComponent` |
| **Attribute Directive** | `[appHighlight]` — hover glow effect |
| **Structural Directive** | `*appRole` — conditionally renders UI by role |
| **Custom Pipes** | `daysUntil`, `overdueStatus`, `truncate` |
| **`ViewChild`** | Auto-focus on the search input |
| **`ng-content`** | Flexible slot projection in `ConfirmDialogComponent` |
| **`takeUntil` pattern** | All manual subscriptions — prevents memory leaks |
| **Lazy Loading** | 100 % of feature routes use `loadChildren` / `loadComponent` |
| **JWT Interceptor** | `AuthInterceptor` silently attaches Bearer tokens |

---

## 📐 Data Models (TypeScript Interfaces)

### `Book`
`id · title · author · isbn · publisher · publishedYear · category · totalCopies · availableCopies · issuedCopies · position`

### `User`
`id · username · email · fullName · role ('user' | 'librarian') · maxBooksAllowed · currentBooksCount · totalFines · paidFines · isActive`

### `Issue`
`id · bookId · userId · issueDate · dueDate · returnDate · status ('active' | 'returned' | 'overdue') · renewCount · fineAmount · finePaid`

### `Fine` / `FinesResponse` / `FinePreview`
Full fine lifecycle: per-day rate, grace period, `calculatedFine`, `maxFinePerBook`, `finePaid`.

---

## 🎨 UI / UX

- **Cyber-Glass Theme** — glass-morphism panels with `backdrop-filter`, neon glow borders, and HSL-driven colour variables.
- **`async` pipe everywhere** — reactive templates with no manual subscriptions in components.
- **`routerLinkActive`** — nav items reflect the current route at a glance.

---

## 🧪 Testing

```bash
ng test          # Runs Vitest in watch mode (jsdom environment)
```

Key spec files: `app.spec.ts`, `stats.service.spec.ts`, `users.service.spec.ts`.

---

## 📝 Developer Notes

- All HTTP calls target `/api/` V2 endpoints exclusively.
- Issue status strictly follows the `'issued' | 'overdue' | 'returned'` union — no magic strings elsewhere.
- Filtering is split: **server-side** for text search (reduces payload), **client-side** for category filtering (instant UX).
- No `any` types in model interfaces — strict TypeScript throughout.
