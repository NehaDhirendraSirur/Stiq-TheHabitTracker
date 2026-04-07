import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, ClipboardList, Flame, Leaf, Star, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ── Nav items — maps label to route ──────────────────────────────────────────
const NAV_ITEMS = [
  { icon: Home,          label: "Dashboard", path: "/dashboard" },
  { icon: ClipboardList, label: "Habits",    path: "/habits"    },
  { icon: Flame,         label: "Streaks",   path: "/stats"     },
  { icon: Leaf,          label: "Growth",    path: "/rewards"   },
  { icon: Star,          label: "Points",    path: "/points"    },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[72px] bg-[#FFFDF8] border-r border-amber-100 flex flex-col items-center py-6 gap-1.5 z-20 shadow-sm">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[0_4px_12px_rgba(217,119,6,0.3)] cursor-pointer hover:scale-105 transition-transform"
        title="Home"
      >
        🎯
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            title={label}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative group
              ${isActive
                ? "bg-amber-100 text-amber-700 ring-2 ring-amber-300/50"
                : "text-amber-400 hover:bg-amber-50 hover:text-amber-600"
              }`}
          >
            <Icon size={20} />

            {/* Tooltip */}
            <span className="absolute left-14 bg-stone-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-lg">
              {label}
            </span>

            {/* Active dot */}
            {isActive && (
              <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </button>
        );
      })}

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="mt-auto w-12 h-12 rounded-xl flex items-center justify-center text-amber-300 hover:bg-red-50 hover:text-red-400 transition-all duration-200 group relative"
      >
        <LogOut size={18} />
        <span className="absolute left-14 bg-stone-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-lg">
          Logout
        </span>
      </button>
    </aside>
  );
}

// ── Layout — wraps all protected pages ───────────────────────────────────────
export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F9F5EE]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fraunces:wght@700;900&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F9F5EE; }
        ::-webkit-scrollbar-thumb { background: #E8DCC8; border-radius: 99px; }
      `}</style>

      <Sidebar />

      <main
        className="flex-1 ml-[72px] px-10 py-9"
        style={{ animation: "fadeUp 0.4s ease both" }}
      >
        {children}
      </main>
    </div>
  );
}