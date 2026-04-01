import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, ClipboardList, BarChart2, Trophy, Settings, LogOut,
  Snowflake, RefreshCw, AlertCircle, Zap, Plus, Minus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { growthApi, freezeApi } from "../api/api";

const THEME_EMOJIS = {
  TREE:   ["🌱","🌿","🪴","🌳","🌲"],
  PET:    ["🥚","🐣","🐥","🐦","🦅"],
  WORLD:  ["🪨","🏔️","🌋","🌍","🌌"],
  NATURE: ["💧","🌊","⛲","🏞️","🌈"],
};

const FREEZE_SOURCE_LABEL = {
  STREAK:    { label: "Streak Milestone", color: "text-orange-500 bg-orange-50 border-orange-100" },
  MILESTONE: { label: "Milestone",        color: "text-purple-500 bg-purple-50 border-purple-100" },
  MANUAL:    { label: "Manual",           color: "text-blue-500   bg-blue-50   border-blue-100"   },
  AUTO:      { label: "Auto",             color: "text-teal-500   bg-teal-50   border-teal-100"   },
  ADMIN:     { label: "Admin",            color: "text-rose-500   bg-rose-50   border-rose-100"   },
  SYSTEM:    { label: "System",           color: "text-stone-500  bg-stone-50  border-stone-100"  },
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

// ── Growth card ───────────────────────────────────────────────────────────────
function GrowthCard({ data, loading, onSync, syncing }) {
  const [activeStage, setActiveStage] = useState(null);

  useEffect(() => {
    if (data) setActiveStage(data.visualStage - 1);
  }, [data]);

  if (loading) return <Card className="md:col-span-2"><Skeleton className="h-64" /></Card>;

  const theme    = data?.theme ?? "TREE";
  const stage    = data?.visualStage ?? 1;
  const emojis   = THEME_EMOJIS[theme] ?? THEME_EMOJIS.TREE;
  const display  = activeStage !== null ? activeStage : stage - 1;
  const totalPts = data?.totalPoints ?? 0;
  const level    = data?.level ?? 1;
  const progress = Math.min(((totalPts % 500) / 500) * 100, 100);

  return (
    <Card className="md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>🌱 Growth State</SectionLabel>
        <button
          onClick={onSync}
          disabled={syncing}
          className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-all disabled:opacity-50"
        >
          <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing..." : "Sync"}
        </button>
      </div>

      {/* Big display */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 bg-purple-50 border-2 border-purple-100 rounded-3xl flex items-center justify-center text-5xl shrink-0">
          {emojis[display]}
        </div>
        <div className="flex-1">
          <p className="text-2xl font-black text-stone-800 mb-0.5" style={{ fontFamily: "'Fraunces', serif" }}>
            {data?.customName ?? "Seed"}
          </p>
          <p className="text-xs font-semibold text-stone-400 mb-3">
            {theme} theme · Stage {stage}/5 · Level {level}
          </p>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Stage Progress</span>
              <span className="text-[10px] font-extrabold text-purple-500">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stage selector */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-2">All Stages</p>
        <div className="flex gap-2">
          {emojis.map((e, i) => (
            <button
              key={i}
              onClick={() => setActiveStage(i)}
              className={`flex-1 h-12 rounded-xl border-2 text-xl flex items-center justify-center transition-all duration-200
                ${display === i
                  ? "bg-purple-50 border-purple-300 scale-110 shadow-md"
                  : i < stage ? "bg-white border-stone-200 hover:border-purple-200 opacity-80" : "bg-stone-50 border-stone-100 opacity-30 cursor-not-allowed"}`}
              disabled={i >= stage}
              title={`Stage ${i + 1}`}
            >{e}</button>
          ))}
        </div>
        <p className="text-[10px] text-stone-400 font-semibold mt-2 text-center">
          You've reached Stage {stage}. {stage < 5 ? `Keep going to unlock Stage ${stage + 1}!` : "Max stage reached! 🎉"}
        </p>
      </div>

      {/* Points */}
      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          <span className="text-sm font-extrabold text-stone-700">Total Points</span>
        </div>
        <span className="text-xl font-black text-amber-600" style={{ fontFamily: "'Fraunces', serif" }}>
          {totalPts.toLocaleString()}
        </span>
      </div>
    </Card>
  );
}

// ── Freeze wallet card ────────────────────────────────────────────────────────
function FreezeWalletCard({ data, loading }) {
  if (loading) return <Card><Skeleton className="h-48" /></Card>;
  return (
    <Card>
      <SectionLabel>❄️ Freeze Wallet</SectionLabel>
      <div className="text-center mb-5">
        <div className="w-20 h-20 bg-blue-50 border-2 border-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Snowflake size={32} className="text-blue-400" />
        </div>
        <p className="text-5xl font-black text-blue-500 leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
          {data?.availableFreezes ?? 0}
        </p>
        <p className="text-xs font-bold text-stone-400 mt-1">freezes available</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Plus size={11} className="text-green-500" />
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Earned</p>
          </div>
          <p className="text-xl font-black text-green-500" style={{ fontFamily: "'Fraunces', serif" }}>{data?.totalEarned ?? 0}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Minus size={11} className="text-red-400" />
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Used</p>
          </div>
          <p className="text-xl font-black text-red-400" style={{ fontFamily: "'Fraunces', serif" }}>{data?.totalUsed ?? 0}</p>
        </div>
      </div>
    </Card>
  );
}

// ── Freeze history ────────────────────────────────────────────────────────────
function FreezeHistoryCard({ data, loading }) {
  if (loading) return <Card className="md:col-span-3"><Skeleton className="h-40" /></Card>;
  return (
    <Card className="md:col-span-3">
      <SectionLabel>📜 Freeze History</SectionLabel>
      {!data || data.length === 0 ? (
        <p className="text-sm text-stone-400 font-semibold text-center py-6">No freeze history yet.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {data.map(f => {
            const isEarned = f.type === "EARNED";
            const src = FREEZE_SOURCE_LABEL[f.source] ?? FREEZE_SOURCE_LABEL.SYSTEM;
            return (
              <div key={f.freezeId} className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isEarned ? "bg-green-50" : "bg-red-50"}`}>
                  {isEarned
                    ? <Plus size={14} className="text-green-500" />
                    : <Minus size={14} className="text-red-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-extrabold text-stone-700">{isEarned ? "Freeze Earned" : "Freeze Used"}</p>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${src.color}`}>{src.label}</span>
                  </div>
                  <p className="text-xs text-stone-400 font-semibold">
                    {f.date} · {new Date(f.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Snowflake size={14} className={isEarned ? "text-green-400" : "text-red-300"} />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function GrowthPage() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [growth,    setGrowth]    = useState(null);
  const [wallet,    setWallet]    = useState(null);
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [syncing,   setSyncing]   = useState(false);
  const [error,     setError]     = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [growthRes, walletRes, historyRes] = await Promise.all([
        growthApi.get(),
        freezeApi.getWallet(),
        freezeApi.getHistory(),
      ]);
      setGrowth(growthRes.data.data);
      setWallet(walletRes.data.data);
      setHistory(historyRes.data.data ?? []);
    } catch {
      setError("Failed to load growth data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await growthApi.sync();
      setGrowth(res.data.data);
    } catch {
      setError("Sync failed.");
    } finally {
      setSyncing(false);
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
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700/40">Your Journey</p>
          <h1 className="text-3xl font-black text-stone-800 leading-tight mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
            Growth & Freezes 🌱
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <GrowthCard    data={growth} loading={loading} onSync={handleSync} syncing={syncing} />
          <FreezeWalletCard data={wallet} loading={loading} />
        </div>

        <FreezeHistoryCard data={history} loading={loading} />
      </main>
    </div>
  );
}