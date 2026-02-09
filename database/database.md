# 📦 Database Design – Habit Tracking System

This document describes the relational database schema used for the Habit Tracking application. The system is designed around **daily habit execution, streak mechanics, point auditing, and gamified growth visualization**.

---

## 🧠 Core Design Principles

* **Separation of responsibilities** (daily data, streaks, points, growth)
* **Pre-aggregated daily summaries** for performance
* **Auditability of points** via ledger pattern
* **Gamification layer decoupled from logic layer**

---

## 🗺️ Entity Relationship Diagram (Textual)

```
User 1 ─── N Habit
Habit 1 ─── N DailyEntry
User 1 ─── N DailyEntry
User 1 ─── N DaySummary
User 1 ─── 1 StreakState
Habit 1 ─── 1 HabitStreak
User 1 ─── N PointsLedger
User 1 ─── 1 GrowthState
```

---

## 🧑 User

Stores account and identity data.

| Column          | Type     | Notes                      |
| --------------- | -------- | -------------------------- |
| `user_id`       | PK       | Unique user identifier     |
| `email`         | string   | Unique login email         |
| `password_hash` | string   | Secure password storage    |
| `display_name`  | string   | Name shown in UI           |
| `timezone`      | string   | Used for daily rollovers   |
| `created_at`    | datetime | Account creation timestamp |

---

## 🎯 Habit

Represents a trackable behavior owned by a user.

| Column          | Type      | Notes                      |
| --------------- | --------- | -------------------------- |
| `habit_id`      | PK        | Habit identifier           |
| `user_id`       | FK → User | Owner                      |
| `name`          | string    | Habit name                 |
| `type`          | enum      | `BINARY` or `QUANTITATIVE` |
| `daily_target`  | number    | Target value per day       |
| `min_threshold` | number    | Minimum for success        |
| `is_active`     | boolean   | Soft enable/disable        |
| `created_at`    | datetime  | Creation timestamp         |

---

## 📅 DailyEntry

Raw daily log for each habit.

| Column         | Type       | Notes                      |
| -------------- | ---------- | -------------------------- |
| `entry_id`     | PK         | Entry ID                   |
| `user_id`      | FK → User  | Owner                      |
| `habit_id`     | FK → Habit | Related habit              |
| `date`         | date       | Entry date (user timezone) |
| `value`        | number     | Measured value             |
| `is_completed` | boolean    | Derived success state      |
| `created_at`   | datetime   | Log timestamp              |

---

## 📊 DaySummary

Pre-computed daily performance summary (performance optimization).

| Column                     | Type      | Notes                   |
| -------------------------- | --------- | ----------------------- |
| `day_id`                   | PK        | Summary ID              |
| `user_id`                  | FK → User | Owner                   |
| `date`                     | date      | Day represented         |
| `completed_habits`         | int       | Number completed        |
| `active_habits`            | int       | Habits active that day  |
| `success_ratio`            | float     | completed / active      |
| `is_success_day`           | boolean   | Threshold-based success |
| `overall_streak_after_day` | int       | Snapshot of streak      |

**Why this exists:** prevents recalculating daily success repeatedly.

---

## 🔥 StreakState (User-Level)

Tracks overall user consistency.

| Column                   | Type      | Notes               |
| ------------------------ | --------- | ------------------- |
| `streak_id`              | PK        | Identifier          |
| `user_id`                | FK → User | Owner               |
| `current_overall_streak` | int       | Ongoing streak      |
| `longest_overall_streak` | int       | Historical best     |
| `last_success_date`      | date      | Most recent success |

---

## 🔁 HabitStreak (Per Habit)

Independent streak tracking per habit.

| Column                | Type       | Notes           |
| --------------------- | ---------- | --------------- |
| `habit_streak_id`     | PK         | ID              |
| `habit_id`            | FK → Habit | Habit           |
| `current_streak`      | int        | Ongoing         |
| `longest_streak`      | int        | Historical best |
| `last_completed_date` | date       | Last success    |

**Design rationale:** Keeps habit streak logic separate from user-level streak logic (single responsibility).

---

## 💰 PointsLedger

Immutable audit log for points.

| Column          | Type      | Notes                             |
| --------------- | --------- | --------------------------------- |
| `ledger_id`     | PK        | Ledger entry                      |
| `user_id`       | FK → User | Owner                             |
| `source`        | enum      | `HABIT`, `DAY`, `STREAK`, `BONUS` |
| `source_ref_id` | ID        | Related entity reference          |
| `points`        | int       | Points gained                     |
| `created_at`    | datetime  | Timestamp                         |

**Purpose:** Transparency, debugging, anti-cheat integrity.

---

## 🌱 GrowthState

Gamification state independent of points logic.

| Column         | Type      | Notes                   |
| -------------- | --------- | ----------------------- |
| `growth_id`    | PK        | ID                      |
| `user_id`      | FK → User | Owner                   |
| `theme`        | enum      | `TREE`, `PET`, `WORLD`  |
| `level`        | int       | Current level           |
| `total_points` | int       | Cached points           |
| `visual_stage` | int       | UI evolution stage      |
| `custom_name`  | string    | User-assigned name      |
| `last_updated` | datetime  | Last progression update |

**Design rationale:** Growth visuals are decoupled from the ledger and streak systems.

---

## 🔗 Relationship Summary

| Relationship        | Type  |
| ------------------- | ----- |
| User → Habit        | 1 : N |
| Habit → DailyEntry  | 1 : N |
| User → DailyEntry   | 1 : N |
| User → DaySummary   | 1 : N |
| User → StreakState  | 1 : 1 |
| Habit → HabitStreak | 1 : 1 |
| User → PointsLedger | 1 : N |
| User → GrowthState  | 1 : 1 |

---

## ⚙️ Architectural Highlights

| Feature                           | Benefit                     |
| --------------------------------- | --------------------------- |
| **DaySummary table**              | Avoids repeated aggregation |
| **PointsLedger (ledger pattern)** | Trust + debugging           |
| **Separate streak tables**        | Clean logic boundaries      |
| **GrowthState isolation**         | Easy future theme expansion |
| **Timezone stored per user**      | Accurate day boundaries     |

---

This schema supports:

* High-performance analytics
* Gamification extensibility
* Transparent reward system
* Scalable habit tracking logic

---
