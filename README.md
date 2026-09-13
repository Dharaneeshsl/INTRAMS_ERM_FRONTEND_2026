# INTRAMS ERM 2026 — Frontend

The official frontend application for **INTRAMS ERM 2026**, developed for the **Students' Union, PSG College of Technology**.

The system provides dedicated interfaces for **Convenors and Administrators** to manage events, ERM submissions, item requirements, inventory, allocations, approvals, and document generation.

## Overview

INTRAMS ERM is designed to digitize the process of collecting event requirements from associations/clubs and managing the allocation of available Students' Union resources.

The frontend communicates with the centralized Express.js backend through REST APIs.

## Tech Stack

- **React** — UI development
- **Vite** — Development and build tooling
- **JavaScript** — Application logic
- **Tailwind CSS** — Styling
- **React Router** — Client-side routing
- **Axios** — API communication
- **Lucide React** — Icons
- **Recharts** — Dashboard visualizations
- **Leaflet** — Map-based features

## Portals

### Convenor Portal

The Convenor Portal allows association/club representatives to:

- Login securely
- Manage events
- Submit ERM forms
- Request required items
- View submission status
- View event information
- Request editing access
- Track submitted requirements

### Admin Portal

The Admin Portal provides administrative control over the complete ERM workflow:

- Dashboard and statistics
- Association / Club management
- Event management
- Master item management
- Inventory / stock management
- Item allocation
- Grant history
- Procurement management
- Edit access approval
- Lab confirmation
- Role-based PDF generation
- Event PDF generation
- Procurement PDF generation

**Winner Export is intentionally excluded from the Admin Portal.**

## Project Structure

```text
INTRAMS_ERM_FRONTEND_2026/
│
├── EmsFormsUser_Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── admin/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
Environment Configuration

The frontend uses environment variables for backend configuration.

Example:

VITE_API_BASE_URL=http://localhost:5000/api

For production, configure the production backend URL through the deployment platform.

Important

Do not commit:

.env
.env.local
.env.production

Only commit the example configuration:

.env.example
Installation
Convenor Portal
cd EmsFormsUser_Frontend
npm install
npm run dev
Admin Portal
cd admin
npm install
npm run dev
Production Build

Convenor Portal:

cd EmsFormsUser_Frontend
npm run build

Admin Portal:

cd admin
npm run build

A successful build should complete without compilation errors.

Backend Integration

Both portals communicate with the same centralized backend.

Production API:

https://intrams-erm-backend-2026.onrender.com/api

The API URL can be changed through VITE_API_BASE_URL.

Deployment

The frontend is designed for deployment using Vercel.

The repository is connected to the production deployment, allowing new changes pushed to the configured main branch to trigger a new deployment.

Development Workflow

Pull the latest changes:

git pull --rebase origin main

Install dependencies:

npm install

Run locally:

npm run dev

Before pushing changes:

npm run build
git status
git add .
git commit -m "your commit message"
git push origin main
Security

The frontend follows protected-route and authentication mechanisms provided by the backend.

Sensitive credentials and environment variables must never be stored directly in the source code or committed to GitHub.

Production Backend

The frontend currently communicates with:

https://intrams-erm-backend-2026.onrender.com
