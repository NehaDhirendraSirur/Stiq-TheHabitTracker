import { useState, useEffect } from "react";
import { Flame, Snowflake, CheckCircle2, XCircle, MinusCircle, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { streakApi, summaryApi } from "../api/api";

function Card({ children, className = "" }) {
  return <div className={`bg-[#FFFDF8] rounded-2xl border border-amber-100 p-6 shadow-sm ${className}`}>{children}</div>;
}
function SectionLabel({ children }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-700/50 mb-3">{children}</p>;
}
function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-amber-100 animate-pulse ${className}`} />;
}

function OverallStreakCard({ data, loading }) {
  if (loading) return <Card><Skeleton className="h-32" /></Card>;
  return (
    <Card>
      <SectionLabel>🔥 Overall Streak</SectionLabel>
      <div className="flex items-end gap-2 mb-5">
        <span className="text-7xl font-black text-amber-500 leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
          {data?.currentOverallStreak ?? 0}
        </span>
        <span className="text-lg font-bold text-stone-400 pb-3">days</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-0.5">Longest Ever</p>
          <p className="text-2xl font-black text-amber-500" style={{ fontFamily: "'Fraunces', serif" }}>
            {data?.longestOverallStreak ?? 0}<span className="text-sm font-bold text-stone-400 ml-1">days</span>
          </p>
        </div>
        <div className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-0.5">Last Success</p>
          <p className="text-sm font-extrabold text-stone-600">
            {data?.lastSuccessDate
              ? new Date(data.lastSuccessDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "—"}
          </p>
        </div>
      </div>
    </Card>
  );
}

function HabitStreaksCard({ data, loading }) {
  if (loading) return <Card className="md:col-span-2"><Skeleton className="h-48" /></Card>;
  return (
    <Card className="md:col-span-2">
      <SectionLabel>📋 Per-Habit Streaks</SectionLabel>
      {!data || data.length === 0 ? (
        <p className="text-sm text-stone-400 font-semibold text-center py-6">No habit streaks yet. Complete some habits first!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.map(h => {
            const pct = h.longestStreak > 0 ? Math.round((h.currentStreak / h.longestStreak) * 100) : 0;
            return (
              <div key={h.habitId} className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-extrabold text-stone-700 truncate flex-1">{h.habitName}</p>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <Flame size={13} className="text-orange-400" />
                    <span className="text-sm font-black text-amber-600" style={{ fontFamily: "'Fraunces', serif" }}>{h.currentStreak}d</span>
                  </div>
                </div>
                <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-stone-400">Best: {h.longestStreak}d</span>
                  {h.lastCompletedDate && (
                    <span className="text-[10px] font-bold text-stone-400">
                      Last: {new Date(h.lastCompletedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function CalendarHistory() {
  const now = new Date();
  const [year,      setYear]      = useState(now.getFullYear());
  const [month,     setMonth]     = useState(now.getMonth());
  const [summaries, setSummaries] = useState([]);
  const [calLoad,   setCalLoad]   = useState(false);
  const [error,     setError]     = useState(null);

  const fetchMonth = async (y, m) => {
    setCalLoad(true);
    setError(null);
    try {
      const start   = `${y}-${String(m + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(y, m + 1, 0).getDate();
      const end     = `${y}-${String(m + 1).padStart(2, "0")}-${lastDay}`;
      const res     = await summaryApi.getRange(start, end);
      setSummaries(res.data.data ?? []);
    } catch {
      setError("Could not load history.");
      setSummaries([]);
    } finally {
      setCalLoad(false);
    }
  };

  useEffect(() => { fetchMonth(year, month); }, [year, month]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const summaryMap = {};
  summaries.forEach(s => { summaryMap[s.date] = s; });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName   = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayStr    = now.toISOString().split("T")[0];

  const renderDay = (day) => {
    const dateStr  = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const s        = summaryMap[dateStr];
    const isToday  = dateStr === todayStr;
    const isFuture = dateStr > todayStr;

    let bg   = "bg-stone-50 border-stone-100 text-stone-300";
    let icon = null;

    if (!isFuture && s) {
      if (s.isSuccessDay) {
        bg   = "bg-green-50 border-green-200 text-green-700";
        icon = <CheckCircle2 size={10} className="text-green-500 mx-auto mt-0.5" />;
      } else if (s.freezeUsed) {
        bg   = "bg-blue-50 border-blue-200 text-blue-600";
        icon = <Snowflake size={10} className="text-blue-400 mx-auto mt-0.5" />;
      } else {
        bg   = "bg-red-50 border-red-100 text-red-400";
        icon = <XCircle size={10} className="text-red-400 mx-auto mt-0.5" />;
      }
    } else if (!isFuture && !s) {
      bg   = "bg-stone-100 border-stone-200 text-stone-400";
      icon = <MinusCircle size={10} className="text-stone-300 mx-auto mt-0.5" />;
    }

    return (
      <div key={day} className={`border rounded-xl p-1.5 text-center ${bg} ${isToday ? "ring-2 ring-amber-400" : ""}`}>
        <p className="text-[10px] font-extrabold">{day}</p>
        {icon}
        {s && <p className="text-[8px] font-bold mt-0.5 opacity-70">{s.completedHabitsCount}/{s.activeHabits}</p>}
      </div>
    );
  };

  return (
    <Card className="md:col-span-3">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>📅 History</SectionLabel>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-600 transition-all">
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs font-extrabold text-stone-600 min-w-[120px] text-center">{monthName}</span>
          <button onClick={nextMonth} disabled={isCurrentMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <p key={d} className="text-center text-[10px] font-extrabold text-stone-400 py-1">{d}</p>
        ))}
      </div>

      {calLoad ? (
        <Skeleton className="h-40" />
      ) : error ? (
        <p className="text-sm text-red-400 font-semibold text-center py-4">{error}</p>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} />)}
          {[...Array(daysInMonth)].map((_, i) => renderDay(i + 1))}
        </div>
      )}

      <div className="flex gap-4 mt-4 flex-wrap">
        {[
          { icon: <CheckCircle2 size={12} className="text-green-500" />, label: "Success day" },
          { icon: <Snowflake    size={12} className="text-blue-400"  />, label: "Freeze used" },
          { icon: <XCircle      size={12} className="text-red-400"   />, label: "Missed"      },
          { icon: <MinusCircle  size={12} className="text-stone-300" />, label: "No data"     },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">{icon}<span className="text-[10px] font-bold text-stone-400">{label}</span></div>
        ))}
      </div>
    </Card>
  );
}

export default function StreakPage() {
  const [overall,      setOverall]      = useState(null);
  const [habitStreaks, setHabitStreaks] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overallRes, habitsRes] = await Promise.all([
        streakApi.getOverall(),
        streakApi.getAllHabitStreaks(),
      ]);
      setOverall(overallRes.data.data);
      setHabitStreaks(habitsRes.data.data ?? []);
    } catch {
      setError("Failed to load streak data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700/40">Track</p>
          <h1 className="text-3xl font-black text-stone-800 leading-tight mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
            Streaks & History 🔥
          </h1>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm font-bold text-red-500">
          <AlertCircle size={16} /> {error}
          <button onClick={fetchData} className="ml-auto flex items-center gap-1.5 hover:text-red-600"><RefreshCw size={13} /> Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <OverallStreakCard data={overall} loading={loading} />
        <HabitStreaksCard  data={habitStreaks} loading={loading} />
      </div>

      <CalendarHistory />
    </div>
  );
}