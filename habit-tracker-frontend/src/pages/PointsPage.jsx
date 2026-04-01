import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, ClipboardList, BarChart2, Trophy, Settings, LogOut,
  Star, Zap, Award, TrendingUp, AlertCircle, RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { pointsApi } from "../api/api";

const SOURCE_CONFIG = {
  HABIT:  { label: "Habit",   icon: "✅", color: "text-green-600  bg-green-50  border-green-100"  },
  DAY:    { label: "Day",     icon: "📅", color: "text-blue-600   bg-blue-50   border-blue-100"   },
  STREAK: { label: "Streak",  icon: "🔥", color: "text-orange-600 bg-orange-50 border-orange-100" },
  BONUS:  { label: "Bonus",   icon: "🎁", color: "text-purple-600 bg-purple-50 border-purple-100" },
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: Home,          label: "Home",     path: "/dashboard" },
  { icon: ClipboardList, label: "Habits",   path: "/habits"    },
  { icon: BarChart2,     label: "Stats",    path: "/stats"     },
  { icon: Trophy,        label: "Rewards",  path: "/rewards"   },
  { icon: Settings,      label: "Settings", path: "/settings"  },
];

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const current  = window.location.pathname;
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[72px] bg-[#FFFDF8] border-r border-amber-100 flex flex-col items-center py-6 gap-1.5 z-20">
      <div onClick={() => navigate("/")} className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[0_4px_12px_rgba(217,119,6,0.3)] cursor-pointer">🎯</div>
      {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
        <button key={label} onClick={() => navigate(path)} title={label}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
            ${current === path ? "bg-amber-100 text-amber-700 ring-2 ring-amber-300/50" : "text-amber-400 hover:bg-amber-50 hover:text-amber-600"}`}>
          <Icon size={20} />
        </button>
      ))}
      <button onClick={onLogout} title="Logout" className="mt-auto w-12 h-12 rounded-xl flex items-center justify-center text-amber-300 hover:bg-red-50 hover:text-red-400 transition-all">
        <LogOut size={18} />
      </button>
    </aside>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-[#FFFDF8] rounded-2xl border border-amber-100 p-6 shadow-sm ${className}`}>{children}</div>;
}
function SectionLabel({ children }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-700/50 mb-3">{children}</p>;
}
function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 animate-pulse ${className}`} />;
}

// ── Stats cards ───────────────────────────────────────────────────────────────
function StatsRow({ total, history, loading }) {
  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
    </div>
  );

  const level         = Math.floor((total ?? 0) / 1000) + 1;
  const pointsInLevel = (total ?? 0) % 1000;
  const xpToNext      = 1000 - pointsInLevel;
  const pct           = Math.round((pointsInLevel / 1000) * 100);

  // Points by source
  const bySource = {};
  (history ?? []).forEach(p => {
    bySource[p.source] = (bySource[p.source] ?? 0) + p.points;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {/* Total points */}
      <Card className="md:col-span-2">
        <SectionLabel>⭐ Total Points</SectionLabel>
        <p className="text-5xl font-black text-amber-500 leading-none mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
          {(total ?? 0).toLocaleString()}
        </p>
        <p className="text-xs font-bold text-stone-400 mb-4">lifetime points earned</p>
        {/* XP bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Level {level} → {level + 1}</span>
            <span className="text-[10px] font-extrabold text-blue-500">{xpToNext} XP left</span>
          </div>
          <div className="h-2.5 bg-blue-50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </Card>

      {/* Level */}
      <Card className="text-center">
        <SectionLabel>🏆 Level</SectionLabel>
        <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl font-black text-amber-600" style={{ fontFamily: "'Fraunces', serif" }}>{level}</span>
        </div>
        <p className="text-xs font-bold text-stone-400">{pct}% to next</p>
      </Card>

      {/* Entries count */}
      <Card className="text-center">
        <SectionLabel>📊 Transactions</SectionLabel>
        <p className="text-4xl font-black text-purple-500 leading-none mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
          {(history ?? []).length}
        </p>
        <p className="text-xs font-bold text-stone-400">total entries</p>
      </Card>
    </div>
  );
}

// ── Source breakdown ──────────────────────────────────────────────────────────
function SourceBreakdown({ history, loading }) {
  if (loading) return <Card><Skeleton className="h-32" /></Card>;

  const bySource = {};
  const total = (history ?? []).reduce((sum, p) => {
    bySource[p.source] = (bySource[p.source] ?? 0) + p.points;
    return sum + p.points;
  }, 0);

  return (
    <Card>
      <SectionLabel>📈 Points by Source</SectionLabel>
      <div className="flex flex-col gap-2.5">
        {Object.entries(SOURCE_CONFIG).map(([key, cfg]) => {
          const pts = bySource[key] ?? 0;
          const pct = total > 0 ? Math.round((pts / total) * 100) : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cfg.icon}</span>
                  <span className="text-xs font-extrabold text-stone-600">{cfg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-stone-700">{pts.toLocaleString()} pts</span>
                  <span className="text-[10px] font-bold text-stone-400">{pct}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    key === "HABIT"  ? "bg-green-400"  :
                    key === "DAY"    ? "bg-blue-400"   :
                    key === "STREAK" ? "bg-orange-400" : "bg-purple-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Points history list ───────────────────────────────────────────────────────
function PointsHistory({ history, loading }) {
  if (loading) return <Card className="md:col-span-2"><Skeleton className="h-64" /></Card>;

  const sorted = [...(history ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Card className="md:col-span-2">
      <SectionLabel>📜 Points History</SectionLabel>
      {sorted.length === 0 ? (
        <p className="text-sm text-stone-400 font-semibold text-center py-6">No points earned yet. Complete habits to start!</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {sorted.map(p => {
            const cfg = SOURCE_CONFIG[p.source] ?? SOURCE_CONFIG.BONUS;
            const date = new Date(p.createdAt);
            return (
              <div key={p.ledgerId} className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-stone-700">{cfg.label} Points</p>
                  <p className="text-xs text-stone-400 font-semibold">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {" · "}
                    {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={13} className="text-amber-400" />
                  <span className="text-base font-black text-amber-600" style={{ fontFamily: "'Fraunces', serif" }}>
                    +{p.points}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PointsPage() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [total,   setTotal]   = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [totalRes, historyRes] = await Promise.all([
        pointsApi.getTotal(),
        pointsApi.getHistory(),
      ]);
      setTotal(totalRes.data.data);
      setHistory(historyRes.data.data ?? []);
    } catch {
      setError("Failed to load points data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex min-h-screen bg-[#F9F5EE]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fraunces:wght@700;900&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 ml-[72px] px-10 py-9 max-w-5xl" style={{ animation: "fadeUp 0.45s ease both" }}>
        <div className="mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700/40">Gamification</p>
          <h1 className="text-3xl font-black text-stone-800 leading-tight mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
            Points & Rewards ⭐
          </h1>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm font-bold text-red-500">
            <AlertCircle size={16} /> {error}
            <button onClick={fetchData} className="ml-auto flex items-center gap-1.5 hover:text-red-600">
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        <StatsRow total={total} history={history} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SourceBreakdown history={history} loading={loading} />
          <PointsHistory   history={history} loading={loading} />
        </div>
      </main>
    </div>
  );
}