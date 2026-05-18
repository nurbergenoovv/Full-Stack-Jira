# Jira — Project Management Platform

A full-stack Jira/Trello-like project management application built with the MERN stack.  
Features Kanban boards, real-time collaboration, file uploads, and team management.

---

## Live Links

| Service  | URL |
|----------|-----|
| Frontend | _Coming soon (Vercel)_ |
| Backend  | _Coming soon (Render)_ |

---

## Tech Stack

**Frontend:** Next.js 15 (App Router) · JavaScript · CSS Modules · Zustand · UploadThing  
**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · ws (WebSocket)  
**Testing:** Jest · Supertest · React Testing Library  
**DevOps:** Docker · Docker Compose

---

## Features

- **Authentication** — Register, login, logout with JWT. Persistent sessions.
- **Workspaces** — Create projects, invite members, upload cover images.
- **Kanban Board** — Drag-and-drop tasks across 5 columns: Backlog → Todo → In Progress → Review → Done.
- **Tasks** — Create, edit, delete tasks. Set priority, due date, assignee, attachments.
- **Comments** — Real-time comments on tasks. Edit/delete your own.
- **Notifications** — Real-time notifications for assignments, comments, project invites.
- **Online Users** — See who is active in each project workspace (WebSocket).
- **Search & Filter** — Filter tasks by title, status, priority, assignee.
- **File Uploads** — UploadThing for avatars, task attachments, and project covers.
- **Responsive** — Works on mobile, tablet, and desktop.

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- UploadThing account (for file uploads)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Install all dependencies (root + backend + frontend) in one command
npm run install:all
```

### 2. Environment Variables

```bash
# Copy the example files and fill in your values
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env
```

**`backend/.env`:**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_here        # openssl rand -base64 32
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
UPLOADTHING_TOKEN=                     # from uploadthing.com/dashboard
UPLOADTHING_SECRET=
```

**`frontend/.env`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

> Each app reads its own env file. Never commit `.env` or `.env.local` — they are in `.gitignore`.

### 3. Run (from the root)

```bash
# Development — starts backend + frontend simultaneously
npm run dev

# Backend:  http://localhost:5000
# Frontend: http://localhost:3000
```

Output is color-coded: **cyan** = backend, **magenta** = frontend.

### Run with Docker (alternative)

```bash
docker compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## Available Scripts (root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend in development mode |
| `npm start` | Start backend + frontend in production mode |
| `npm run build` | Build frontend for production |
| `npm test` | Run backend + frontend tests simultaneously |
| `npm run test:backend` | Backend tests only |
| `npm run test:frontend` | Frontend tests only |
| `npm run install:all` | Install dependencies for root + backend + frontend |

---

## Running Tests

### All tests at once

```bash
npm test
```

### Backend only (Jest + Supertest) — 41 tests

```bash
npm run test:backend
```

Covers:
- Mongoose model validation (User, Task, Comment)
- JWT utility functions
- Auth controller unit tests (mocked service)
- Auth, Projects, and Tasks API integration tests (Supertest)

### Frontend only (Jest + React Testing Library) — 6 tests

```bash
npm run test:frontend
```

Covers:
- Button component rendering, click handling, disabled/loading states

---

## Project Structure

```
taskflow/
├── package.json           # Root — runs both apps via concurrently
├── docker-compose.yml
├── README.md
├── backend/
│   ├── modules/
│   │   ├── auth/          # Register, login, JWT
│   │   ├── users/         # Profile, avatar
│   │   ├── projects/      # CRUD, membership
│   │   ├── tasks/         # CRUD, status, attachments
│   │   ├── comments/      # CRUD, realtime
│   │   └── notifications/ # Realtime notifications
│   ├── websocket/         # ws server, events, online users
│   ├── middleware/        # Auth, validation, errors
│   ├── utils/             # JWT, UploadThing
│   ├── tests/             # Jest test suites
│   └── server.js
│
└── frontend/
    ├── app/               # Next.js App Router pages
    ├── components/        # UI, layout, kanban, tasks, etc.
    ├── stores/            # Zustand state management
    ├── styles/            # CSS Modules
    ├── lib/               # API client, UploadThing
    └── __tests__/         # React Testing Library tests
```

---

## Database Models

| Model        | Key Fields |
|-------------|-----------|
| User         | fullName, email, password, avatar, role, projects |
| Project      | title, description, coverImage, owner, members, status |
| Task         | title, description, status, priority, dueDate, assignee, project, attachments, createdBy |
| Comment      | message, author, task, edited |
| Notification | user, type, text, isRead, relatedTask |

**Relationships:**
- One-to-many: Project → Tasks, Task → Comments
- Many-to-many: Users ↔ Projects

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Current user (protected) |
| GET  | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create project |
| GET  | `/api/projects/:id` | Get project (members only) |
| PATCH | `/api/projects/:id` | Update project (owner only) |
| DELETE | `/api/projects/:id` | Delete project (owner only) |
| POST | `/api/projects/:id/invite` | Invite member |
| GET  | `/api/tasks/project/:id` | List tasks (with search/filter) |
| POST | `/api/tasks/project/:id` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Move task (Kanban drag) |
| DELETE | `/api/tasks/:id` | Delete task |
| GET  | `/api/comments/task/:id` | Get comments |
| POST | `/api/comments/task/:id` | Add comment |
| PATCH | `/api/comments/:id` | Edit own comment |
| DELETE | `/api/comments/:id` | Delete own comment |
| GET  | `/api/notifications` | Get notifications |
| PATCH | `/api/notifications/:id/read` | Mark as read |

---

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join:project` | Client → Server | Join project room |
| `leave:project` | Client → Server | Leave project room |
| `task:created` | Server → Client | New task |
| `task:updated` | Server → Client | Task updated |
| `task:deleted` | Server → Client | Task deleted |
| `task:moved` | Server → Client | Task status changed |
| `comment:added` | Server → Client | New comment |
| `comment:updated` | Server → Client | Comment edited |
| `comment:deleted` | Server → Client | Comment deleted |
| `notification:new` | Server → Client | New notification |
| `online:users` | Server → Client | Current online user list |
| `user:online` | Server → Client | User joined |
| `user:offline` | Server → Client | User left |
