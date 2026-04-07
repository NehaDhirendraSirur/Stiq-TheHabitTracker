# 🎯 Stiq — The Habit Tracker

> Streak-Based Habit Tracker Web Application with Gamification
> Build habits. Earn rewards. Level up your life.

Stiq is a full-stack gamified habit tracking application. Complete daily habits to grow your streak, earn points, level up, and evolve your growth companion. Miss a day? Use a streak freeze to protect your progress.

## ⚙️ Tech Stack

### Backend
| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Spring Boot 3.x                     |
| Language    | Java 17+                            |
| Security    | Spring Security + JWT (JJWT)        |
| Database    | PostgreSQL (configurable)           |
| ORM         | Spring Data JPA / Hibernate         |
| Build tool  | Maven                               |
| API Docs    | SpringDoc OpenAPI (Swagger UI)      |

### Frontend
| Layer        | Technology                         |
|--------------|------------------------------------|
| Framework    | React 19 + Vite 7                  |
| Styling      | Tailwind CSS v4                    |
| Routing      | React Router DOM v7                |
| HTTP Client  | Axios                              |
| Icons        | Lucide React                       |
| UI Primitives| shadcn/ui + Radix UI               |
| Fonts        | Fraunces (display) + Nunito (body) |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL

---

### Backend Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/Stiq-TheHabitTracker.git
   cd Stiq-TheHabitTracker/habit-tracker-backend
   ```

2. **Configure `application.yml`**

3. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend starts at `http://localhost:8080`
   Swagger UI available at `http://localhost:8080/swagger-ui/index.html`

---

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../habit-tracker-frontend
   npm install
   ```

2. **Set backend URL** in `src/api/api.js`
   ```js
   const BASE_URL = "http://localhost:8080"; // change if deployed
   ```

3. **Run the frontend**
   ```bash
   npm run dev
   ```
   Frontend starts at `http://localhost:5173`

---

## 🔐 Authentication

- JWT-based stateless authentication
- Token stored in `localStorage` as `stiq_token`
- User info stored as `stiq_user`
- All routes except `/api/auth/**` require `Authorization: Bearer <token>`
- 401 responses automatically clear session and redirect to `/login`
- Session restored on page reload via `AuthContext`

**Endpoints:**
```
POST /api/auth/register   { email, password, displayName, timezone }
POST /api/auth/login      { email, password }
```

---

## 📡 API Reference

### Dashboard
```
GET  /api/dashboard
```
Returns: today's summary, overall streak state, growth state, freeze wallet.

---

### Habits
```
GET    /api/habits                       → All habits (active + inactive)
GET    /api/habits/active                → Active habits only
GET    /api/habits/{habitId}             → Single habit
POST   /api/habits                       → Create habit
PUT    /api/habits/{habitId}             → Update habit
PATCH  /api/habits/{habitId}/deactivate  → Deactivate habit
PATCH  /api/habits/{habitId}/reactivate  → Reactivate habit
```

**Habit Types:**
- `BINARY` — done or not done
- `QUANTITATIVE` — requires `dailyTarget` and optional `minThreshold`

---

### Habit Completion
```
POST  /api/habits/{habitId}/complete     { date }
POST  /api/habits/{habitId}/fail         { date, useFreeze: boolean }
GET   /api/habits/{habitId}/entries      → History for a habit
GET   /api/habits/entries?date=YYYY-MM-DD → All entries for a date
```

---

### Streaks
```
GET  /api/streaks/overall                → Overall streak state
GET  /api/streaks/habits                 → Per-habit streak list
GET  /api/streaks/habits/{habitId}       → Streak for specific habit
```

---

### Day Summary
```
GET  /api/summary/today                  → Today's summary
GET  /api/summary?date=YYYY-MM-DD        → Summary for a specific date
GET  /api/summary/range?start=&end=      → Range of summaries (for calendar)
```

---

### Growth
```
GET   /api/growth       → Current growth state
POST  /api/growth/sync  → Sync growth state with latest points
```

**Growth Themes:** `TREE` | `PET` | `WORLD` | `NATURE`
Each theme has 5 visual stages that unlock as you accumulate points.

---

### Freezes
```
GET   /api/freezes/wallet    → Available, earned, used freeze counts
GET   /api/freezes/history   → Full freeze ledger
POST  /api/freezes/use       { date }
```

**Freeze Sources:** `STREAK` | `MILESTONE` | `MANUAL` | `AUTO` | `ADMIN` | `SYSTEM`

---

### Points
```
GET  /api/points/total    → Total points (integer)
GET  /api/points/history  → Full points ledger
```

**Points Sources:** `HABIT` | `DAY` | `STREAK` | `BONUS`

---

## 🎮 Gamification System

### Streaks
- Your **overall streak** increments when you complete **all** active habits in a day
- Each habit also has its own **individual streak**
- A streak **freeze** can protect your overall streak on a missed day
- Freezes are earned automatically at streak milestones

### Points & Levels
- Points are awarded for completing habits, full success days, streak milestones, and bonuses
- Every **1000 points** = 1 level up
- Points are tracked in a full ledger by source

### Growth Companion
- Choose a theme: **Tree** 🌱, **Pet** 🥚, **World** 🪨, or **Nature** 💧
- Your companion has **5 visual stages** that evolve as your `visualStage` increases
- Sync your growth state with `POST /api/growth/sync` to recalculate after changes

---

## 🖥️ Frontend Pages

| Route        | Page           | Description                                              |
|--------------|----------------|----------------------------------------------------------|
| `/`          | HomePage       | Public landing page with features, how it works, growth themes, testimonials |
| `/login`     | LoginPage      | Login + Register with timezone auto-detection           |
| `/dashboard` | Dashboard      | Today's habits, streak, XP, growth — all in one view    |
| `/habits`    | HabitsPage     | Create, edit, deactivate, reactivate habits              |
| `/stats`     | StreakPage     | Overall streak, per-habit streaks, monthly calendar      |
| `/rewards`   | GrowthPage     | Growth companion, freeze wallet, freeze history          |
| `/points`    | PointsPage     | Total points, level, XP bar, points history by source   |

---

## 🗂️ Key Design Decisions

- **Stateless auth** — no sessions, JWT only
- **ApiResponse wrapper** — all backend responses follow `{ data, message, success }` shape
- **Engines** — business logic (streak calculation, points, growth, freezes) is isolated in dedicated engine classes separate from services
- **Layout component** — shared sidebar + routing lives in one place; pages render only their content
- **Protected routes** — `ProtectedRoute` in `App.jsx` wraps all auth-required pages with `Layout` automatically

---

## 📌 Environment Notes

- Timezone is auto-detected from the browser on registration (`Intl.DateTimeFormat().resolvedOptions().timeZone`)
- All dates sent to the API are in `YYYY-MM-DD` format (ISO local date)
- The frontend reads `res.data.data` to unwrap the `ApiResponse` envelope from the backend

---

## 📜 License

MIT — feel free to fork, build on, and make it your own.

---

*Made with 🔥 streaks and ☕ coffee.*