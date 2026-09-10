# INTRAMS ERM FRONTEND

Monorepo containing the user and admin frontend applications for the **INTRAMS ERM** platform.

## Applications

- **[EmsFormsUser_Frontend](./EmsFormsUser_Frontend)**: User-facing portal for creating, editing, reviewing, and submitting event proposals. Runs on port `3000`.
- **[admin](./admin)**: Admin portal for managing users/clubs, stock inventory, item granting, edit access requests, role-wise PDF generation, and event monitoring. Runs on port `5173`.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Development

#### 1. User Frontend
```bash
cd EmsFormsUser_Frontend
npm install
npm run dev
```

#### 2. Admin Frontend
```bash
cd admin
npm install
npm run dev
```

## Production Build

```bash
# Build User Frontend
cd EmsFormsUser_Frontend
npm run build

# Build Admin Frontend
cd admin
npm run build
```
