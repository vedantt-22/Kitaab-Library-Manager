# 📚 Cyber-Library Manager — Angular 18 Capstone

A production-grade Library Management System built with **Angular 18+** using a **Standalone Component** architecture. This project manages complex borrowing workflows, fine calculations, and real-time administrative analytics through a high-tech "Cyber-Glass" interface.

---

## 🚀 Quick Start

### 1. Prerequisites

* **Node.js:** LTS version
* **Angular CLI:** `npm install -g @angular/cli`

### 2. API Server Setup

1. Navigate to the `/server` directory.
2. Install dependencies: `npm install`
3. Start the backend: `npm start`
4. The API is hosted at: `http://localhost:3001`

### 3. Frontend Setup

1. Navigate to the `/library-manager` directory.
2. Install dependencies: `npm install`
3. Launch the app: `ng serve`
4. Open your browser to: `http://localhost:4200`

---

## 🛠 Features Implemented

### **Librarian Module (Admin)**

* **Inventory Heat Map:** A visual analytics tool that calculates "Collection Utilization" percentages and maps them to HSL color gradients (Cyan for cold/available, Purple/Pink for hot/borrowed).
* **Librarian Dashboard:** Real-time stats pulling from `/api/stats/dashboard` and an automated Overdue Report.
* **Book Management:** Full CRUD capabilities using **Reactive Forms** with `patchValue` support for editing.
* **User Management:** Administrative control to activate/deactivate user accounts.

### **User Module**

* **Public Catalogue:** Advanced search with `debounceTime` and `distinctUntilChanged`, plus a dedicated **Category Filter**.
* **Borrowing Logic:** Real-time tracking of `issued`, `overdue`, and `returned` statuses.
* **Personal Portal:** View active loans, renewal counts (capped at 2), and integrated fine payment workflow.

### **Technical Core**

* **Reactive Streams:** Extensive use of RxJS `combineLatest` to sync search queries and category filters.
* **Security:** `AuthInterceptor` for JWT injection and `AuthGuard`/`LibrarianGuard` for route protection.
* **Lazy Loading:** 100% of feature modules load on-demand via `loadChildren` and `loadComponent`.

---

## 🏗 Project Structure

The project follows the mandatory standalone modular structure:

* `src/app/auth`: Login (Template-driven), Register, and Security Guards.
* `src/app/books`: Catalogue, Detail views, and Search/Filter services.
* `src/app/my-books`: Personalized loan tracking and Fine services.
* `src/app/librarian`: Admin dashboards and the **Inventory Heat Map**.
* `src/app/shared`: Reusable Loading Spinners, Confirm Dialogs, and Custom Directives.
* `src/app/models`: Strictly typed TypeScript interfaces (no `any` types).

---

## 🧪 Advanced Concepts Utilized

| Concept | Implementation |
| --- | --- |
| **Change Detection** | `OnPush` strategy on `book-card` and `loading-spinner` for maximum performance. |
| **Custom Directives** | `[appHighlight]` (Attribute) for hover effects and `*appRole` (Structural) for UI permissioning. |
| **Custom Pipes** | `daysUntil` (relative dates), `overdueStatus` (badge logic), and `truncate` (text formatting). |
| **Component Comm.** | `ViewChild` for auto-focusing search, `ng-content` for flexible dialogs, and `@Input/@Output`. |
| **Memory Management** | `Subject + takeUntil` pattern implemented in all manual subscriptions to prevent leaks. |

---

## 🎨 UI/UX Design Principles

* **Cyber-Glass Theme:** A custom CSS framework using glass-morphism, backdrop filters, and neon glow effects.
* **Dynamic UX:** Results update in real-time using the `async` pipe, reducing manual subscription overhead.
* **Stateful Navigation:** Active routes are visually highlighted using `routerLinkActive`.

---

## 🔑 Test Credentials

* **Librarian:** `admin` / `admin123`
* **Regular User:** `user1` / `user123`

---

## 📝 Developer Notes

* **API Usage:** Exclusively utilizes `/api/` V2 endpoints as per documentation.
* **Status Mapping:** Strict adherence to the `'issued' | 'overdue' | 'returned'` status model.
* **Filtering Logic:** Implemented a combined Server-side (Search) and Client-side (Category) filtering approach for optimal speed.

---
