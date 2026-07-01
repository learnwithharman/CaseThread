# CaseThread: Premium Full-Stack Task Manager with Persona Themed UI

CaseThread is a premium productivity tool and task manager designed around a custom **Persona and Theming Engine**. Instead of simple light/dark modes, users choose from distinct character personalities (such as Dexter, Patrick Jane, Sherlock Holmes, etc.) which adapt the visual layout (colors, glassmorphism, fonts) and terminology (e.g., "Tasks" become "Cases" or "Investigations", "Completed" becomes "Blood Slides" or "Closed Cases") dynamically on the client-side.

---

## 🛠️ Tech Stack Architecture

### Frontend (Single Page Application)
- **Framework:** React + TypeScript (scaffolded via Vite)
- **Styling:** Tailwind CSS + Shadcn UI (premium design tokens, custom font mappings, Apple- & Linear.app-inspired aesthetics)
- **State Management & Caching:** TanStack Query (formerly React Query) + React Context (`ThemeContext`, `AuthContext`)
- **Navigation:** React Router
- **Form Handling:** React Hook Form + Zod (typesafe schemas)
- **Core Integrations:** Framer Motion (micro-animations), React DnD (Kanban Drag and Drop boards), React Hot Toast (responsive toasts)

### Backend (RESTful API Server)
- **Runtime & Web App Framework:** Node.js + Express + TypeScript
- **Database ORM:** Prisma ORM (Object Relational Mapping)
- **Database:** PostgreSQL
- **Security:** Helmet headers protection, CORS rules validation, Rate-limiters
- **Authentication:** Stateless JSON Web Tokens (JWT) access + refresh tokens, bcrypt password hashing

---

## 🗄️ Database Models Schema

```prisma
model User {
  id              Int            @id @default(autoincrement())
  name            String
  email           String         @unique
  passwordHash    String
  role            String         @default("user")
  profilePicUrl   String?
  settings        Json?          // Stores chosen persona theme, shortcuts, etc.
  tasks           Task[]
  categories      Category[]
  activities      Activity[]
  notes           Note[]
  refreshTokens   RefreshToken[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model Task {
  id            Int         @id @default(autoincrement())
  userId        Int
  categoryId    Int?
  title         String
  description   String?
  status        String      @default("todo") // todo, in-progress, completed
  priority      String      @default("low")  // low, medium, high
  dueDate       DateTime?
  reminder      DateTime?
  estimatedTime Int?        // in minutes
  actualTime    Int?        // in minutes
  isFavorite    Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?   // Soft-delete support
  user          User        @relation(fields: [userId], references: [id])
  category      Category?   @relation(fields: [categoryId], references: [id])
  subtasks      SubTask[]
  tags          Tag[]       @relation("TagsOnTasks")
}

model SubTask {
  id        Int      @id @default(autoincrement())
  taskId    Int
  title     String
  done      Boolean  @default(false)
  task      Task     @relation(fields: [taskId], references: [id])
}

model Category {
  id        Int      @id @default(autoincrement())
  userId    Int
  name      String
  user      User     @relation(fields: [userId], references: [id])
  tasks     Task[]
}

model Tag {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  tasks     Task[]   @relation("TagsOnTasks")
}

model Note {
  id        Int      @id @default(autoincrement())
  userId    Int
  content   String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Activity {
  id        Int      @id @default(autoincrement())
  userId    Int
  type      String   // e.g. created, updated, completed, archived, deleted
  details   String?
  timestamp DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  userId    Int
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 📅 30-Day Step-by-Step Roadmap

### Phase 1: Foundations, Database Schema & Authentication (Days 1–7)

*   **Day 1 (Completed): Scaffold Project Root & Base Server**
    - Setup directory structures: `backend/` and `frontend/`.
    - Configure backend `package.json`, TypeScript definitions, and compiler strict rules.
    - Write Express base server with CORS, Helmet headers, Rate Limiting, and `/api/health` status checks.
*   **Day 2 (Completed): Database Layer Configuration (PostgreSQL & Prisma)**
    - Compose Prisma Schema schema based on the relational DB models.
    - Configure PostgreSQL docker configurations or client connections.
    - Validate prisma client compilations.
*   **Day 3 (Completed): Seed Scripts & Centralized Error Middleware**
    - Create a custom data-seeding file `prisma/seed.ts` containing starter mockup information.
    - Setup express global error handler intercepting runtime violations.
    - Create structural payload validation utilities leveraging Zod schemas.
*   **Day 4 (Completed): Authentication Core: Register & Login Backend**
    - Create models hashing with bcrypt.
    - Implement JWT signature systems (access tokens & refresh tokens).
    - Expose endpoints: `/api/auth/register`, `/api/auth/login`.
*   **Day 5 (Completed): Authentication Core: Token Rotation & Middleware**
    - Expose `/api/auth/refresh-token` and `/api/auth/logout`.
    - Build `authMiddleware` decoding and checking bearer JWT authorization tokens on private routers.
*   **Day 6 (Completed): Client Side Framework Scaffolding**
    - Initialize frontend folder via Vite + React + TS workspace.
    - Integrate Tailwind CSS. Verify global styles, fonts, and baseline setups.
*   **Day 7 (Completed): Client-Side Routing & Session Providers**
    - Set up React Router (unprotected and protected client routes).
    - Build customized Axios request client interceptors automatically passing JWT bearer tags.
    - Create global `AuthContext` to hold current sessions.

---

### Phase 2: Core Task Engines & Persona Theming (Days 8–15)

*   **Day 8: Persona Engine Setup & Context Integration**
    - Implement React Context (`ThemeContext`) to manage current personas (Dexter, Patrick Jane, Sherlock, standard).
    - Map translation dictionaries per persona containing localized naming tokens (`Task` to `Case`, `Completed` to `Blood Slides`, etc.).
    - Update CSS variables on `:root` dynamically when switching themes.
*   **Day 9: Premium CSS Base UI Styling**
    - Build glassmorphism components, layout container wrappers, responsive sidebar, navbar.
    - Configure design typography rules like Outfit / Inter.
*   **Day 10: Task CRUD REST API Endpoints**
    - Build CRUD handlers: `GET /api/tasks` (with pagination, filters, and searches), `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`, `POST /api/tasks/bulk-action`.
    - Include auto-suggest priority comparison algorithm (due date vs today/tomorrow comparison).
*   **Day 11: Task Frontend Query Integration**
    - Setup TanStack Query API hooks: `useTasks()`, `useCreateTask()`, `useUpdateTask()`, `useDeleteTask()`.
*   **Day 12: Task Card & List Component Designs**
    - Create responsive task list views and individual glassmorphic Task Cards containing priority indicators and status checkboxes.
*   **Day 13: Subtasks Module Integration**
    - Expose nested endpoint routers: `POST /api/tasks/:taskId/subtasks`, `PUT /api/tasks/:taskId/subtasks/:subtaskId`.
    - Create interactive inline subtask checklist overlays.
*   **Day 14: Categories and Tags Managers**
    - Build tagging endpoints and front-end selector interfaces.
*   **Day 15: Kanban Drag-and-Drop Board**
    - Wrap task boards inside React DnD `DndProvider`.
    - Support columns (Todo, In-Progress, Review, Completed) mapping drop triggers directly to database tasks status updates.

---

### Phase 3: Productivity Widgets & Streaks Engine (Days 16–23)

*   **Day 16: Daily Focus Mode Panel**
    - Allow users to pin up to 3 tasks as their active focus set.
    - Create CSS filters dimming other elements inside list views.
*   **Day 17: Pomodoro Session Timer**
    - Build custom countdown timer hooks (25-min focus / 5-min rest cycles).
    - Attach active timer controls to cards and auto-increment session counters upon interval completion.
*   **Day 18: Streaks Calculations & Analytics Backend**
    - Update schema fields: `lastStreakDate` and `currentStreakCount` on User models.
    - Expose `/api/analytics/overview` calculating completion rates and calendar heatmap datasets.
*   **Day 19: Analytics Dashboard View**
    - Build graphical visualization screens using Recharts (representing completions over time and streak counts).
*   **Day 20: Audit Log Activity Timeline**
    - Enable DB Activity logging triggers within Task create/update controllers.
    - Render activity feed timelines showing chronological updates.
*   **Day 21: Trash Bin (Soft-Delete Handler)**
    - Setup soft delete filters (filtering out items containing populated `deletedAt` timestamps from standard lists).
    - Design Trash recovery screens with "Restore" actions.
*   **Day 22: Quick Notes Dashboard Widget & Favorites**
    - Build Quick Sticky Notes widget saving drafts to database `Note` model.
    - Implement `isFavorite` star toggling.
*   **Day 23: Search Command Palette (Ctrl+K)**
    - Implement keyboard-listening handlers opening search overlay dialogs querying categories, tags, and titles.

---

### Phase 4: Production Deployment & Polishing (Days 24–30)

*   **Day 24: Global Keyboard Shortcuts**
    - Register hotkey hooks: `N` for new task prompt, `F` for search focus, `D` for dark/light mode persona menu, and `?` for keyboard shortcuts cheat-sheet panel.
*   **Day 25: App Security and API Optimization**
    - Enable CORS whitelists, Helmet headers, express-rate-limit bounds, and error logs formatting.
*   **Day 26: App Containerization (Dockerfiles)**
    - Build multi-stage configurations for both backend API server and static client web app.
*   **Day 27: Multi-container Orchestration (Docker Compose)**
    - Write `docker-compose.yml` linking Postgres database service, backend Node.js api, and frontend Vite server together.
*   **Day 28: End-to-End User Journeys Verification**
    - Complete workflow validation testing user creation, persona themes swapping, Kanban card moving, Pomodoro timing, and Focus mode.
*   **Day 29: Performance Optimization and SEO Elements**
    - Configure code-splitting routes, image load optimizations, metadata titles, and descriptive elements.
*   **Day 30: Project Documentation & Wrap Up**
    - Finalize README detailing setups, architecture overview, schema drawings, and design screenshots.
