import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const floatingEmojis = ["🔥", "⭐", "💪", "🎯", "✅", "🏆", "🚀", "💎"];

function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// ── Floating emoji (decorative) ───────────────────────────────────────────────
function FloatingEmoji({ emoji, className }) {
  return (
    <span className={`absolute text-3xl opacity-15 pointer-events-none select-none animate-[float_6s_ease-in-out_infinite] ${className}`}>
      {emoji}
    </span>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────
function InputField({ label, type, value, onChange, placeholder, icon, onKeyDown }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-xs font-extrabold text-neutral-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className={`flex items-center rounded-2xl px-4 border-2 transition-all duration-200
        ${focused
          ? "bg-amber-50 border-orange-400 shadow-[0_0_0_4px_rgba(251,146,60,0.15)]"
          : "bg-neutral-100 border-neutral-200"
        }`}>
        <span className="text-xl mr-3">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent py-3.5 text-sm font-semibold text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}

// ── Auth card ─────────────────────────────────────────────────────────────────
function AuthCard({ mode, onSwitch }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus]           = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg]       = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async () => {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password, displayName, timezone: getBrowserTimezone() });
      }
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again."
      );
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="relative w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_4px_20px_rgba(251,146,60,0.12)] overflow-hidden">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />

      {/* Header */}
      <div className="mb-6">
        <h2 className="font-['Fredoka_One'] text-3xl text-neutral-900 mb-1">
          {isLogin ? "Welcome back! 👋" : "Join the streak! 🔥"}
        </h2>
        <p className="text-sm text-neutral-400 font-semibold">
          {isLogin ? "Pick up where you left off" : "Start building habits that stick"}
        </p>
      </div>

      {/* Fields */}
      {!isLogin && (
        <InputField
          label="Display Name" type="text"
          value={displayName} onChange={e => setDisplayName(e.target.value)}
          placeholder="Your hero name" icon="🧑"
          onKeyDown={handleKeyDown}
        />
      )}
      <InputField
        label="Email" type="email"
        value={email} onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com" icon="✉️"
        onKeyDown={handleKeyDown}
      />
      <InputField
        label="Password" type="password"
        value={password} onChange={e => setPassword(e.target.value)}
        placeholder={isLogin ? "Your secret key" : "Min. 8 characters"}
        icon="🔑" onKeyDown={handleKeyDown}
      />

      {/* Timezone note */}
      {!isLogin && (
        <p className="text-xs text-neutral-400 font-semibold -mt-2 mb-4">
          🌍 Timezone auto-detected: <span className="text-neutral-500 font-bold">{getBrowserTimezone()}</span>
        </p>
      )}

      {/* Forgot password */}
      {isLogin && (
        <div className="flex justify-end -mt-2 mb-4">
          <button className="text-xs font-bold text-orange-400 hover:text-orange-500 transition-colors">
            Forgot password?
          </button>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4 text-sm font-bold text-red-500">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className={`w-full py-4 rounded-2xl text-white text-base font-extrabold tracking-wide transition-all duration-300 mb-5 shadow-lg
          ${status === "success"
            ? "bg-green-500 shadow-green-200"
            : status === "loading"
            ? "bg-orange-300 cursor-not-allowed"
            : "bg-gradient-to-br from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 hover:scale-[1.01] active:scale-[0.99] shadow-orange-200"
          }`}
      >
        {status === "success"
          ? "✅ Let's go!"
          : status === "loading"
          ? "✨ Loading..."
          : isLogin ? "🚀 Log In" : "🎯 Create Account"}
      </button>

      {/* Divider */}
      <div className="flex items-center mb-5">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="px-3 text-xs text-neutral-400">or</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      {/* Google */}
      <button className="w-full py-3.5 flex items-center justify-center gap-3 bg-neutral-100 border-2 border-neutral-200 rounded-2xl text-sm font-bold text-neutral-700 hover:bg-neutral-200 transition-colors mb-6">
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      {/* Switch mode */}
      <p className="text-center text-sm text-neutral-400 font-semibold">
        {isLogin ? "New to Stiq? " : "Already have an account? "}
        <button onClick={onSwitch} className="text-orange-400 font-extrabold underline hover:text-orange-500 transition-colors">
          {isLogin ? "Sign up free" : "Log in"}
        </button>
      </p>
    </div>
  );
}

// ── Main Login Page ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex font-['Nunito',sans-serif] bg-orange-50 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          33%      { transform: translateY(-18px) rotate(5deg); }
          66%      { transform: translateY(-8px) rotate(-4deg); }
        }
        @keyframes pulse-ring {
          0%   { transform:scale(.95); box-shadow:0 0 0 0 rgba(251,146,60,.5); }
          70%  { transform:scale(1);   box-shadow:0 0 0 14px rgba(251,146,60,0); }
          100% { transform:scale(.95); box-shadow:0 0 0 0 rgba(251,146,60,0); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* ── Left — Brand panel ───────────────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col justify-center items-center px-12 py-16 overflow-hidden bg-gradient-to-br from-orange-400 via-red-400 to-red-600">
        {/* Floating emojis */}
        {floatingEmojis.map((emoji, i) => (
          <FloatingEmoji
            key={i} emoji={emoji}
            className=""
            style={{ top: `${10 + (i * 11) % 80}%`, left: `${5 + (i * 17) % 85}%`, animationDelay: `${i * 0.8}s` }}
          />
        ))}

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-white/8" />

        {/* Logo */}
        <div className="flex items-center gap-4 mb-10" style={{ animation: "slideUp 0.6s ease both" }}>
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-xl"
            style={{ animation: "pulse-ring 2.5s ease infinite" }}>
            🎯
          </div>
          <div>
            <h1 className="font-['Fredoka_One'] text-5xl text-white leading-none tracking-wide">Stiq</h1>
            <p className="text-white/70 text-xs font-bold tracking-[0.12em] uppercase">The Habit Tracker</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mb-10" style={{ animation: "slideUp 0.6s ease 0.15s both" }}>
          <h2 className="font-['Fredoka_One'] text-3xl text-white leading-snug mb-3">
            Build habits.<br />Earn rewards.<br />Level up your life. 🚀
          </h2>
          <p className="text-white/75 text-base font-semibold leading-relaxed max-w-xs">
            Turn your daily routines into an epic adventure. Every streak counts.
          </p>
        </div>

        {/* Stats badges */}
        <div className="flex gap-3" style={{ animation: "slideUp 0.6s ease 0.3s both" }}>
          {[["21🔥", "Day Streak"], ["5⭐", "Habits Done"], ["Lv.4🏆", "Your Level"]].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl px-5 py-3">
              <span className="text-2xl font-extrabold text-yellow-300">{val}</span>
              <span className="text-xs text-white/80 font-semibold tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right — Auth panel ───────────────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col justify-center items-center px-12 py-16 bg-orange-50">
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #FCD34D33 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative w-full max-w-md" style={{ animation: "slideUp 0.6s ease 0.1s both" }}>
          <AuthCard mode={mode} onSwitch={() => setMode(mode === "login" ? "signup" : "login")} />
        </div>

        <p className="mt-7 text-xs text-neutral-400 font-semibold text-center">
          By signing up, you agree to our Terms & Privacy Policy.<br />
          No spam. No nonsense. Just good habits. ✌️
        </p>
      </div>
    </div>
  );
}