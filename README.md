# 🎨 INTRAMS ERM 2026 — FRONTEND APPLICATIONS

Monorepo containing the **User (Club) Portal** and **Admin Portal** for **INTRAMS ERM 2026**.

Built with **React**, **Vite**, **Tailwind CSS / Glassmorphism UI**, **Lucide Icons**, and **React Router DOM**.

---

## 💻 Portal Overview

### 1. User Portal (`EmsFormsUser_Frontend`) — Port `5173` / `3000`
- **Proposal Wizard**: Multi-step event proposal wizard (Basic Info, Logistics, Schedule & Venue, Contact Persons, Rounds & Rules, Item Requests).
- **Contact Persons Form**: Dedicated inputs for **Secretary** (name, roll no, mobile), **Convenor** (name, roll no, mobile), and **Faculty Advisor** (name, dept, mobile).
- **Edit Access Flow**: Pre-fills existing proposal data and contacts when editing approved edit requests.
- **Supporting Annexures**: Built-in modal to view, upload, and delete document attachments per proposal.
- **Deep Linking & Proposal Views**: Full fallback fetch using `useParams()` + `userAPI.getEventById(id)` for page refreshes and direct links.
- **100% Pure JWT Authentication**: Managed state via `AuthContext` with Bearer header injection across all API requests.

### 2. Admin Portal (`admin`) — Port `5174`
- **Dashboard & Event Cards**: Monitor proposals across clubs, review statuses, and inspect deep details.
- **Procurement Requisitions Viewer (`/procurements`)**: Dedicated view displaying automatically logged inventory shortage purchase requests.
- **Association / Club Management (`/add`)**: Create and update clubs with complete payload validation, email inputs, and username search.
- **Master Items & Stocks (`/items`, `/stocks`)**: Catalog management with auto-generated item codes and quantity updates.
- **Item Granting & History (`/grant-items`, `/grant-logs`)**: Allocate items to events with automatic stock deduction and transaction logging.
- **Role-Based Authorization**: Protected routes with strict role checks (`admin`, `member`, `procurement`).
- **Performance & Code-Splitting**: Route-level lazy loading (`React.lazy` + `Suspense`) eliminating bundle warnings.

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Local Development

#### 1. User Portal
```bash
cd EmsFormsUser_Frontend
npm install
npm run dev
```

#### 2. Admin Portal
```bash
cd admin
npm install
npm run dev
```

---

## 📦 Production Builds

```bash
# User Portal Build
cd EmsFormsUser_Frontend
npm run build

# Admin Portal Build
cd admin
npm run build
```

---

## 🌐 Configurable Environment Variables

Set in `.env` or `vite.config.js`:
- `VITE_API_BASE_URL`: Base backend API URL (e.g. `http://localhost:5000/api`)
