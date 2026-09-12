# INTRAMS ERM 2026 — Frontend

Frontend application for the **INTRAMS Event Requirement Management (ERM) Portal 2026**, developed for the **Students' Union, PSG College of Technology**.

The repository contains two frontend applications:

- **User (Club) Portal** — Event proposal creation, editing and submission.
- **Admin Portal** — Event monitoring, club, inventory, procurement and item management.

---

## Applications

| Portal | Directory | Port | Purpose |
|---|---|---:|---|
| User Portal | `EmsFormsUser_Frontend` | `5173` | Event proposal and requirement management |
| Admin Portal | `admin` | `5174` | Event, club, inventory and procurement management |

---

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- JWT Authentication
- REST API
- Docker

---

## Main Features

### User Portal

- Multi-step event proposal wizard
- Basic event information
- Logistics and requirements
- Schedule and venue details
- Secretary, Convenor and Faculty Advisor details
- Rounds and rules
- Item requirements
- Supporting annexure uploads
- Proposal editing
- Proposal submission
- JWT-based authentication
- Event details and deep linking

### Admin Portal

- Event dashboard and monitoring
- Proposal status management
- Club management
- User search
- Master item management
- Stock management
- Item granting
- Grant history and logs
- Procurement requisitions
- Edit access management
- Role-based authorization

Supported roles:

```text
admin
member
procurement
Project Structure
INTRAMS_ERM_FRONTEND_2026/
│
├── EmsFormsUser_Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── admin/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
└── .gitignore
Local Development
Prerequisites

Install:

Node.js 18+
npm
Git

Check versions:

node --version
npm --version
git --version
Clone Repository
git clone https://github.com/Students-Union-PSGTech/INTRAMS_ERM_FRONTEND_2026.git
cd INTRAMS_ERM_FRONTEND_2026
Run User Portal
cd EmsFormsUser_Frontend
npm install
npm run dev

Open:

http://localhost:5173
Run Admin Portal

Open a second terminal:

cd INTRAMS_ERM_FRONTEND_2026/admin
npm install
npm run dev

Open:

http://localhost:5174

The actual port is controlled by the Vite configuration.

Environment Variables

Create a .env file in the required frontend application directory:

VITE_API_BASE_URL=http://localhost:5000/api
Variable	Description	Example
VITE_API_BASE_URL	Backend API base URL	http://localhost:5000/api

Restart the development server after changing .env.

Important

Do not commit:

.env
.env.local
.env.production

Frontend environment variables are exposed to the browser after the application is built. Never store backend secrets or database credentials in frontend environment files.

Docker

Docker can be used to run the frontend applications in containers instead of installing Node dependencies directly on the host machine.

Docker Architecture
                 Docker Compose
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   User Frontend             Admin Frontend
      :5173                     :5174
          │                       │
          └───────────┬───────────┘
                      │
                      │ REST API
                      ▼
               Backend API
                  :5000
                      │
                      ▼
                  Database

The frontend containers communicate with the backend through the configured API URL.

Docker Prerequisites

Install:

Docker
Docker Compose

Verify:

docker --version
docker compose version
Run with Docker Compose

From the frontend repository root:

docker compose up --build

After the containers start:

User Portal:
http://localhost:5173

Admin Portal:
http://localhost:5174

Backend:
http://localhost:5000

The backend must be running and accessible at the configured API URL.

Stop Docker Containers
docker compose down
Run Docker in Background
docker compose up --build -d

View running containers:

docker compose ps

View logs:

docker compose logs

View logs for a specific service:

docker compose logs -f user-frontend
docker compose logs -f admin-frontend
Rebuild After Changes

If dependencies or Docker configuration are changed:

docker compose down
docker compose up --build
Frontend–Backend Architecture
┌────────────────────────────┐
│       USER PORTAL          │
│       React + Vite         │
│          :5173             │
└─────────────┬──────────────┘
              │
              │ REST API + JWT
              │
              ▼
┌────────────────────────────┐
│       BACKEND API          │
│      Node + Express        │
│          :5000             │
└─────────────┬──────────────┘
              │
              ▼
           Database


┌────────────────────────────┐
│       ADMIN PORTAL         │
│       React + Vite         │
│          :5174             │
└─────────────┬──────────────┘
              │
              │ REST API + JWT
              └──────────────► Backend

The frontend applications do not directly access the database.

All application data is accessed through the backend API.

Authentication

The applications use JWT-based authentication.

Authenticated API requests use:

Authorization: Bearer <JWT_TOKEN>

The backend is responsible for:

Authentication
JWT validation
Authorization
Role verification
Business logic
Database operations
API Communication
React Component
      │
      ▼
API / Service Layer
      │
      ▼
HTTP Request
      │
      ▼
Backend Endpoint
      │
      ▼
Controller / Service
      │
      ▼
Database

Frontend and backend must maintain the same:

Endpoint URLs
HTTP methods
Request fields
Response fields
Authentication requirements
Error formats

Do not change API contracts without coordinating with the backend team.

Production Build

For either application:

npm run build

Preview the production build:

npm run preview
Git Workflow

Check changes:

git status
git diff

Stage:

git add .

Commit:

git commit -m "describe your change"

Push:

git push

Never commit:

node_modules/
.env
.env.local
dist/
