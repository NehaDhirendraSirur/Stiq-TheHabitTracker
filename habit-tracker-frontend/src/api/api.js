import axios from "axios";

const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("stiq_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("stiq_token");
      localStorage.removeItem("stiq_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (data) => api.post("/api/auth/login", data),
  register: (data) => api.post("/api/auth/register", data),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  get: () => api.get("/api/dashboard"),
};

// ── Habits ────────────────────────────────────────────────────────────────────
export const habitsApi = {
  getActive:  ()          => api.get("/api/habits/active"),
  getAll:     ()          => api.get("/api/habits"),
  getById:    (id)        => api.get(`/api/habits/${id}`),
  create:     (data)      => api.post("/api/habits", data),
  update:     (id, data)  => api.put(`/api/habits/${id}`, data),
  deactivate: (id)        => api.patch(`/api/habits/${id}/deactivate`),
  reactivate: (id)        => api.patch(`/api/habits/${id}/reactivate`),
};

// ── Habit Completion ──────────────────────────────────────────────────────────
export const completionApi = {
  complete:           (habitId, date)                   => api.post(`/api/habits/${habitId}/complete`, { date }),
  fail:               (habitId, date, useFreeze = false) => api.post(`/api/habits/${habitId}/fail`, { date, useFreeze }),
  getEntriesForHabit: (habitId)                         => api.get(`/api/habits/${habitId}/entries`),
  getEntriesForDate:  (date)                            => api.get(`/api/habits/entries`, { params: { date } }),
};

// ── Streaks ───────────────────────────────────────────────────────────────────
export const streakApi = {
  getOverall:       ()        => api.get("/api/streaks/overall"),
  getAllHabitStreaks:()        => api.get("/api/streaks/habits"),
  getHabitStreak:   (habitId) => api.get(`/api/streaks/habits/${habitId}`),
};

// ── Day Summary ───────────────────────────────────────────────────────────────
export const summaryApi = {
  getToday: ()                  => api.get("/api/summary/today"),
  getByDate:(date)              => api.get("/api/summary", { params: { date } }),
  getRange: (start, end)        => api.get("/api/summary/range", { params: { start, end } }),
};

// ── Growth ────────────────────────────────────────────────────────────────────
export const growthApi = {
  get:  () => api.get("/api/growth"),
  sync: () => api.post("/api/growth/sync"),
};

// ── Freezes ───────────────────────────────────────────────────────────────────
export const freezeApi = {
  getWallet:  ()     => api.get("/api/freezes/wallet"),
  getHistory: ()     => api.get("/api/freezes/history"),
  useFreeze:  (date) => api.post("/api/freezes/use", { date }),
};

// ── Points ────────────────────────────────────────────────────────────────────
export const pointsApi = {
  getTotal:   () => api.get("/api/points/total"),
  getHistory: () => api.get("/api/points/history"),
};

export default api;