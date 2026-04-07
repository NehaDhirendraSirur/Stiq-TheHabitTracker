import { useState, useEffect } from "react";
import { Flame, Snowflake, Leaf, CheckCircle2, Circle, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { dashboardApi, completionApi } from "../api/api";

const THEME_EMOJIS = {
  TREE:   ["🌱","🌿","🪴","🌳","🌲"],
  PET:    ["🥚","🐣","🐥","🐦","🦅"],
  WORLD:  ["🪨","🏔️","🌋","🌍","🌌"],
  NATURE: ["💧","🌊","⛲","🏞️","🌈"],
};

const todayStr = () => new Date().toISOString().split("T")[0];

const dateLabel = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-amber-100 animate-pulse ${className}`} />;
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-[#FFFDF8] rounded-2xl border border-amber-100 p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-700/50 mb-3">{children}</p>;
}

function Topbar({ user, currentStreak }) {
  return (
    <div className="flex items-center justify-between mb-7">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700/40">{dateLabel()}</p>
        <h1 className="text-3xl font-black text-stone-800 leading-tight mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
          Hey, {user?.displayName ?? "there"} 👋
        </h1>
      </div>
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
        <Flame size={18} className="text-orange-400" />
        <span className="text-lg font-black text-amber-600" style={{ fontFamily: "'Fraunces', serif" }}>
          {currentStreak ?? 0}
        </span>
      </div>
    </div>
  );
}

function StreakCard({ streakState, freezeWallet, loading }) {
  if (loading) return <Card><Skeleton className="h-28" /></Card>;
  return (
    <Card>
      <SectionLabel>🔥 Current Streak</SectionLabel>
      <div className="flex items-end gap-2 mb-4">
        <span className="text-6xl font-black text-amber-500 leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
          {streakState?.currentOverallStreak ?? 0}
        </span>
        <span className="text-base font-bold text-stone-400 pb-2">days</span>
      </div>
      <div className="flex gap-2.5">
        <div className="flex-1 bg-amber-50 rounded-xl px-3.5 py-2.5 border border-amber-100">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Longest</p>
          <p className="text-xl font-black text-amber-500" style={{ fontFamily: "'Fraunces', serif" }}>
            {streakState?.longestOverallStreak ?? 0}d
          </p>
        </div>
        <div className="flex-1 bg-blue-50 rounded-xl px-3.5 py-2.5 border border-blue-100">
          <div className="flex items-center gap-1 mb-0.5">
            <Snowflake size={10} className="text-blue-400" />
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Freezes</p>
          </div>
          <p className="text-xl font-black text-blue-500" style={{ fontFamily: "'Fraunces', serif" }}>
            {freezeWallet?.availableFreezes ?? 0}
          </p>
        </div>
      </div>
    </Card>
  );
}

function PointsCard({ growthState, loading }) {
  if (loading) return <Card><Skeleton className="h-28" /></Card>;
  const level         = growthState?.level ?? 1;
  const totalPoints   = growthState?.totalPoints ?? 0;
  const pointsInLevel = totalPoints % 1000;
  const xpToNext      = 1000 - pointsInLevel;
  const pct           = Math.round((pointsInLevel / 1000) * 100);
  return (
    <Card>
      <SectionLabel>⭐ Points & XP</SectionLabel>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-4xl font-black text-stone-800 leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
            {totalPoints.toLocaleString()}
          </p>
          <p className="text-xs font-semibold text-stone-400 mt-0.5">total points</p>
        </div>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: `conic-gradient(#4A7FA5 ${pct * 3.6}deg, #EAF2FA 0deg)` }}
        >
          <div className="w-10 h-10 rounded-full bg-[#FFFDF8] flex items-center justify-center">
            <span className="text-xs font-black text-blue-600" style={{ fontFamily: "'Fraunces', serif" }}>Lv{level}</span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">XP to Level {level + 1}</span>
          <span className="text-[10px] font-extrabold text-blue-500">{xpToNext} left</span>
        </div>
        <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Card>
  );
}

function GrowthCard({ growthState, loading }) {
  if (loading) return <Card><Skeleton className="h-40" /></Card>;
  const theme       = growthState?.theme ?? "TREE";
  const stage       = growthState?.visualStage ?? 1;
  const stageName   = growthState?.customName ?? "Seed";
  const emojis      = THEME_EMOJIS[theme] ?? THEME_EMOJIS.TREE;
  const stageEmoji  = emojis[Math.min(stage - 1, 4)];
  const totalPoints = growthState?.totalPoints ?? 0;
  const progressPct = Math.min(((totalPoints % 500) / 500) * 100, 100);
  return (
    <Card>
      <SectionLabel>🌱 Growth Journey</SectionLabel>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">
          {stageEmoji}
        </div>
        <div className="flex-1">
          <p className="text-xl font-black text-stone-800" style={{ fontFamily: "'Fraunces', serif" }}>{stageName}</p>
          <p className="text-xs font-semibold text-stone-400">Next: {emojis[Math.min(stage, 4)]} Stage {stage + 1}</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Stage Progress</span>
          <span className="text-[10px] font-extrabold text-purple-500">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {emojis.map((e, i) => (
          <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all
            ${i < stage ? "bg-purple-50 border border-purple-300" : "bg-stone-50 border border-stone-200 opacity-30"}`}>
            {e}
          </div>
        ))}
      </div>
    </Card>
  );
}

function HabitItem({ entry, onToggle, toggling }) {
  const done = entry.isCompleted;
  return (
    <div
      onClick={() => !toggling && onToggle(entry)}
      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border cursor-pointer transition-all duration-200 mb-2.5 select-none
        ${done ? "bg-green-50 border-green-200" : "bg-[#FFFDF8] border-amber-100 hover:border-amber-300 hover:bg-amber-50"}
        ${toggling ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {done
        ? <CheckCircle2 size={22} className="text-green-500 shrink-0" />
        : <Circle       size={22} className="text-amber-200 shrink-0" />
      }
      <span className={`flex-1 text-sm font-bold ${done ? "line-through text-green-500 opacity-70" : "text-stone-700"}`}>
        {entry.habitName}
      </span>
      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border
        ${done ? "bg-green-50 border-green-200 text-green-600" : "bg-amber-50 border-amber-100 text-amber-600"}`}>
        {done ? "Done ✓" : "Pending"}
      </span>
    </div>
  );
}

function HabitsCard({ todaySummary, entries, onToggle, togglingId, loading }) {
  if (loading) return <Card><Skeleton className="h-48" /></Card>;
  const done    = todaySummary?.completedHabitsCount ?? 0;
  const total   = todaySummary?.activeHabits ?? entries.length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = done === total && total > 0;
  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <SectionLabel>📋 Today's Habits</SectionLabel>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-lg border mb-3
          ${allDone ? "bg-green-50 border-green-200 text-green-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
          {done}/{total} done
        </span>
      </div>
      <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden mb-5">
        <div className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {entries.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <Leaf size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold">No habits for today yet.</p>
          <p className="text-xs mt-1">Add some habits to get started! 🎯</p>
        </div>
      ) : (
        entries.map(entry => (
          <HabitItem key={entry.entryId} entry={entry} onToggle={onToggle} toggling={togglingId === entry.habitId} />
        ))
      )}
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard,  setDashboard]  = useState(null);
  const [entries,    setEntries]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, entriesRes] = await Promise.all([
        dashboardApi.get(),
        completionApi.getEntriesForDate(todayStr()),
      ]);
      setDashboard(dashRes.data.data);
      setEntries(entriesRes.data.data ?? []);
    } catch {
      setError("Failed to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (entry) => {
    setTogglingId(entry.habitId);
    try {
      if (entry.isCompleted) {
        await completionApi.fail(entry.habitId, todayStr(), false);
      } else {
        await completionApi.complete(entry.habitId, todayStr());
      }
      await fetchData();
    } catch (err) {
      console.error("Toggle failed:", err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      <Topbar user={user} currentStreak={dashboard?.streakState?.currentOverallStreak} />

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm font-bold text-red-500">
          <AlertCircle size={16} /> {error}
          <button onClick={fetchData} className="ml-auto flex items-center gap-1.5 hover:text-red-600 transition-colors">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        <StreakCard streakState={dashboard?.streakState} freezeWallet={dashboard?.freezeWallet} loading={loading} />
        <PointsCard growthState={dashboard?.growthState} loading={loading} />
        <GrowthCard growthState={dashboard?.growthState} loading={loading} />
      </div>

      <HabitsCard
        todaySummary={dashboard?.todaySummary}
        entries={entries}
        onToggle={handleToggle}
        togglingId={togglingId}
        loading={loading}
      />

      <p className="text-center mt-7 text-xs font-semibold text-stone-400">Keep going — every habit counts. 🌱</p>
    </div>
  );
}