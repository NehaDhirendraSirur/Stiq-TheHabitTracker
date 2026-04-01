import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Snowflake, Star, Leaf, Zap, Shield, TrendingUp, CheckCircle, ArrowRight, Menu, X } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-100",
    title: "Track Daily Habits",
    desc: "Mark habits complete or failed with a single tap. Both BINARY and QUANTITATIVE habits supported.",
  },
  {
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    title: "Build Streaks",
    desc: "Your overall streak grows every day you complete all habits. Miss a day? Use a streak freeze to protect it.",
  },
  {
    icon: Snowflake,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "Streak Freezes",
    desc: "Life happens. Earn freeze tokens by consistency and use them on tough days so your streak never breaks.",
  },
  {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Earn Points",
    desc: "Every completed habit earns you points. Watch your score climb and unlock new levels.",
  },
  {
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    title: "Level Up",
    desc: "Accumulate XP and level up your profile. Your growth reflects your real-world consistency.",
  },
  {
    icon: Leaf,
    color: "text-teal-500",
    bg: "bg-teal-50",
    border: "border-teal-100",
    title: "Grow Your World",
    desc: "Choose a growth theme — Tree, Pet, World, or Nature — and watch it evolve as you build habits.",
  },
];

const GROWTH_THEMES = [
  { name: "Tree",   emojis: ["🌱","🌿","🪴","🌳","🌲"], color: "bg-green-50  border-green-200",  active: "bg-green-500"  },
  { name: "Pet",    emojis: ["🥚","🐣","🐥","🐦","🦅"], color: "bg-yellow-50 border-yellow-200", active: "bg-yellow-500" },
  { name: "World",  emojis: ["🪨","🏔️","🌋","🌍","🌌"], color: "bg-blue-50   border-blue-200",   active: "bg-blue-500"   },
  { name: "Nature", emojis: ["💧","🌊","⛲","🏞️","🌈"], color: "bg-teal-50   border-teal-200",   active: "bg-teal-500"   },
];

const TESTIMONIALS = [
  { name: "Priya S.",    role: "Software Engineer",    avatar: "👩‍💻", text: "I've tried 6 habit apps. Stiq is the only one where I actually look forward to opening it every morning. The streak system is addictive in the best way.", streak: 47 },
  { name: "Rohan M.",    role: "Fitness Coach",         avatar: "💪",  text: "My clients use Stiq to track workout habits. The gamification keeps them motivated way better than anything else I've recommended.", streak: 92 },
  { name: "Ananya K.",   role: "Student",               avatar: "📚",  text: "I hit a 30-day streak studying for my exams. The growth tree going from a tiny seed to a big tree literally made me emotional.", streak: 30 },
  { name: "Dev T.",      role: "Product Manager",       avatar: "🧑‍💼", text: "Clean, fast, and actually fun. Stiq doesn't feel like productivity software — it feels like a game you happen to win at life.", streak: 61 },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Add your habits",       desc: "Create habits — daily runs, reading, hydration. Set them as binary or with a target.",         emoji: "✍️" },
  { step: "02", title: "Check them off daily",  desc: "Each morning, open Stiq and complete your habits. Takes 10 seconds.",                           emoji: "✅" },
  { step: "03", title: "Watch your streak grow",desc: "Complete all habits in a day to extend your streak. Miss one? Use a freeze token.",             emoji: "🔥" },
  { step: "04", title: "Level up & evolve",     desc: "Earn points, level up, and watch your growth companion evolve as you become consistent.",       emoji: "🚀" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? "bg-[#FFFDF8]/95 backdrop-blur-md shadow-sm border-b border-amber-100" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-lg shadow-md">🎯</div>
          <span className="font-['Fredoka_One'] text-2xl text-stone-800 tracking-wide">Stiq</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-stone-500">
          <a href="#features" className="hover:text-amber-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-amber-600 transition-colors">How it works</a>
          <a href="#growth" className="hover:text-amber-600 transition-colors">Growth</a>
          <a href="#testimonials" className="hover:text-amber-600 transition-colors">Stories</a>
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-5 py-2 text-sm font-bold text-stone-600 hover:text-amber-600 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onSignup}
            className="px-5 py-2 text-sm font-extrabold text-white bg-gradient-to-br from-orange-400 to-red-400 rounded-xl shadow-md hover:from-orange-500 hover:to-red-500 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Start free →
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-stone-600" onClick={() => setMenuOpen(m => !m)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FFFDF8] border-t border-amber-100 px-6 py-5 flex flex-col gap-4">
          {["Features","How it works","Growth","Stories"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-bold text-stone-500 hover:text-amber-600"
              onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={onLogin} className="flex-1 py-2.5 text-sm font-bold border-2 border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50">Log in</button>
            <button onClick={onSignup} className="flex-1 py-2.5 text-sm font-extrabold text-white bg-gradient-to-br from-orange-400 to-red-400 rounded-xl">Sign up</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onLogin, onSignup }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden bg-[#F9F5EE]">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(circle, #D97706 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-1.5 mb-6"
        style={{ animation: "fadeUp 0.5s ease both" }}>
        <Zap size={13} className="text-amber-600" />
        <span className="text-xs font-extrabold text-amber-700 tracking-wide uppercase">Gamified Habit Tracking</span>
      </div>

      {/* Headline */}
      <h1
        className="relative font-['Fredoka_One'] text-6xl md:text-8xl text-stone-900 leading-[1.05] mb-6 max-w-4xl"
        style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
      >
        Make habits
        <span className="relative inline-block mx-3">
          <span className="relative z-10 text-orange-500">stick.</span>
          <span className="absolute bottom-1 left-0 right-0 h-3 bg-yellow-300/60 rounded-sm -z-0" />
        </span>
        <br />
        Make life
        <span className="text-green-500 ml-3">epic.</span>
      </h1>

      {/* Subheading */}
      <p
        className="relative text-lg md:text-xl text-stone-500 font-semibold max-w-xl leading-relaxed mb-10"
        style={{ animation: "fadeUp 0.5s ease 0.2s both" }}
      >
        Stiq turns your daily habits into an adventure — with streaks, points, levels, and a living world that grows as you do.
      </p>

      {/* CTA buttons */}
      <div className="relative flex flex-col sm:flex-row gap-3 mb-14" style={{ animation: "fadeUp 0.5s ease 0.3s both" }}>
        <button
          onClick={onSignup}
          className="flex items-center justify-center gap-2 px-8 py-4 text-base font-extrabold text-white bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Start for free <ArrowRight size={18} />
        </button>
        <button
          onClick={onLogin}
          className="flex items-center justify-center gap-2 px-8 py-4 text-base font-extrabold text-stone-600 bg-white border-2 border-stone-200 rounded-2xl hover:border-amber-300 hover:text-amber-700 transition-all duration-200 shadow-sm"
        >
          Log in
        </button>
      </div>

      {/* Social proof strip */}
      <div
        className="relative flex flex-wrap justify-center gap-6 text-sm font-bold text-stone-400"
        style={{ animation: "fadeUp 0.5s ease 0.4s both" }}
      >
        {[["🔥", "Streak system"], ["⭐", "Points & XP"], ["🌱", "Growth themes"], ["❄️", "Streak freezes"]].map(([icon, label]) => (
          <span key={label} className="flex items-center gap-1.5">{icon} {label}</span>
        ))}
      </div>

      {/* Hero card preview */}
      <div
        className="relative mt-16 grid grid-cols-3 gap-3 max-w-2xl w-full"
        style={{ animation: "fadeUp 0.6s ease 0.5s both" }}
      >
        {[
          { label: "Current Streak", value: "21🔥", sub: "days", bg: "bg-amber-50 border-amber-200" },
          { label: "Total Points",   value: "2,340⭐", sub: "Lv. 7", bg: "bg-blue-50 border-blue-200"  },
          { label: "Growth Stage",   value: "🌳",     sub: "Young Tree", bg: "bg-green-50 border-green-200" },
        ].map(({ label, value, sub, bg }) => (
          <div key={label} className={`${bg} border-2 rounded-2xl px-5 py-4 text-center`}>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-1">{label}</p>
            <p className="text-2xl font-black text-stone-800" style={{ fontFamily: "'Fraunces', serif" }}>{value}</p>
            <p className="text-xs text-stone-400 font-semibold mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <RevealSection className="text-center mb-16">
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-500 mb-3">Everything you need</p>
          <h2 className="font-['Fredoka_One'] text-5xl text-stone-900 mb-4">Built to keep you going</h2>
          <p className="text-stone-400 font-semibold text-lg max-w-md mx-auto">Not just a checklist. A full gamified system that rewards your consistency.</p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, bg, border, title, desc }, i) => (
            <RevealSection key={title} delay={i * 80}>
              <div className={`${bg} border ${border} rounded-2xl p-6 h-full hover:scale-[1.02] transition-transform duration-200`}>
                <div className={`w-11 h-11 ${bg} border ${border} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-['Fredoka_One'] text-xl text-stone-800 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 font-semibold leading-relaxed">{desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#F9F5EE]">
      <div className="max-w-5xl mx-auto">
        <RevealSection className="text-center mb-16">
          <p className="text-xs font-extrabold uppercase tracking-widest text-orange-400 mb-3">Simple by design</p>
          <h2 className="font-['Fredoka_One'] text-5xl text-stone-900 mb-4">How Stiq works</h2>
          <p className="text-stone-400 font-semibold text-lg max-w-sm mx-auto">Four steps. That's all it takes to transform your daily life.</p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HOW_IT_WORKS.map(({ step, title, desc, emoji }, i) => (
            <RevealSection key={step} delay={i * 100}>
              <div className="flex gap-5 bg-white rounded-2xl border border-amber-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="shrink-0">
                  <div className="w-14 h-14 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center text-2xl">
                    {emoji}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-1">Step {step}</p>
                  <h3 className="font-['Fredoka_One'] text-xl text-stone-800 mb-1.5">{title}</h3>
                  <p className="text-sm text-stone-500 font-semibold leading-relaxed">{desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Growth themes ─────────────────────────────────────────────────────────────
function GrowthSection() {
  const [activeTheme, setActiveTheme] = useState(0);
  const [activeStage, setActiveStage] = useState(2);
  const theme = GROWTH_THEMES[activeTheme];

  return (
    <section id="growth" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <RevealSection className="text-center mb-16">
          <p className="text-xs font-extrabold uppercase tracking-widest text-green-500 mb-3">Your living companion</p>
          <h2 className="font-['Fredoka_One'] text-5xl text-stone-900 mb-4">Choose your growth theme</h2>
          <p className="text-stone-400 font-semibold text-lg max-w-md mx-auto">
            Pick a theme that resonates with you. Complete habits to evolve your companion through 5 stages.
          </p>
        </RevealSection>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Theme selector */}
          <div className="flex flex-col gap-3 w-full lg:w-48 shrink-0">
            {GROWTH_THEMES.map((t, i) => (
              <button
                key={t.name}
                onClick={() => { setActiveTheme(i); setActiveStage(2); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200
                  ${activeTheme === i
                    ? "bg-amber-50 border-amber-400 text-amber-700 scale-[1.02]"
                    : "bg-white border-stone-200 text-stone-500 hover:border-amber-200"}`}
              >
                <span className="text-xl">{t.emojis[2]}</span>
                {t.name}
              </button>
            ))}
          </div>

          {/* Stage display */}
          <div className="flex-1 bg-[#F9F5EE] rounded-3xl border border-amber-100 p-8 text-center">
            {/* Big stage emoji */}
            <div className="text-8xl mb-4 transition-all duration-300">
              {theme.emojis[activeStage]}
            </div>
            <p className="font-['Fredoka_One'] text-2xl text-stone-800 mb-1">Stage {activeStage + 1} of 5</p>
            <p className="text-sm text-stone-400 font-semibold mb-8">Click a stage to preview</p>

            {/* Stage dots */}
            <div className="flex justify-center gap-3">
              {theme.emojis.map((e, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStage(i)}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all duration-200
                    ${activeStage === i
                      ? "bg-white border-amber-400 scale-110 shadow-md"
                      : "bg-white/60 border-stone-200 hover:border-amber-200 hover:scale-105 opacity-60"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Stats preview */}
          <div className="flex flex-col gap-3 w-full lg:w-44 shrink-0">
            {[
              { label: "Habits Done", value: "127", icon: "✅" },
              { label: "Day Streak",  value: "21",  icon: "🔥" },
              { label: "Freezes",     value: "3",   icon: "❄️" },
              { label: "Level",       value: "7",   icon: "⭐" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-xl border border-amber-100 px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">{label}</p>
                  <p className="text-lg font-black text-stone-800" style={{ fontFamily: "'Fraunces', serif" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-[#F9F5EE]">
      <div className="max-w-6xl mx-auto">
        <RevealSection className="text-center mb-16">
          <p className="text-xs font-extrabold uppercase tracking-widest text-purple-500 mb-3">Real people, real streaks</p>
          <h2 className="font-['Fredoka_One'] text-5xl text-stone-900 mb-4">They made it stick 🔥</h2>
          <p className="text-stone-400 font-semibold text-lg max-w-sm mx-auto">Join thousands who turned intentions into habits.</p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map(({ name, role, avatar, text, streak }, i) => (
            <RevealSection key={name} delay={i * 80}>
              <div className="bg-white rounded-2xl border border-amber-100 p-6 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                <p className="text-sm text-stone-600 font-semibold leading-relaxed flex-1 mb-5">"{text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center text-xl">
                      {avatar}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-stone-800">{name}</p>
                      <p className="text-xs text-stone-400 font-semibold">{role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5">
                    <Flame size={13} className="text-orange-400" />
                    <span className="text-sm font-black text-orange-500" style={{ fontFamily: "'Fraunces', serif" }}>{streak}d</span>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner({ onSignup, onLogin }) {
  return (
    <section className="py-20 px-6">
      <RevealSection>
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-orange-400 via-red-400 to-red-500 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />

          <p className="relative text-white/80 text-sm font-extrabold uppercase tracking-widest mb-4">Ready to level up?</p>
          <h2 className="relative font-['Fredoka_One'] text-5xl text-white mb-4 leading-tight">
            Your streak starts<br />today. 🔥
          </h2>
          <p className="relative text-white/80 font-semibold text-base mb-8 max-w-sm mx-auto">
            Free forever. No credit card needed. Just habits, streaks, and growth.
          </p>
          <div className="relative flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={onSignup}
              className="px-8 py-4 bg-white text-orange-500 font-extrabold text-base rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl"
            >
              Create free account →
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white/20 text-white font-extrabold text-base rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
            >
              Already have an account
            </button>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-amber-100 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-base">🎯</div>
          <span className="font-['Fredoka_One'] text-xl text-stone-700">Stiq</span>
          <span className="text-stone-300 text-sm ml-1">· The Habit Tracker</span>
        </div>
        <div className="flex gap-6 text-sm font-bold text-stone-400">
          <a href="#features"      className="hover:text-amber-500 transition-colors">Features</a>
          <a href="#how-it-works"  className="hover:text-amber-500 transition-colors">How it works</a>
          <a href="#growth"        className="hover:text-amber-500 transition-colors">Growth</a>
          <a href="#testimonials"  className="hover:text-amber-500 transition-colors">Stories</a>
        </div>
        <p className="text-xs text-stone-400 font-semibold">© 2026 Stiq. Make every day count. 🌱</p>
      </div>
    </footer>
  );
}

// ── Main Home Page ────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();

  const goLogin  = () => navigate("/login");
  const goSignup = () => navigate("/login?mode=signup");

  return (
    <div className="font-['Nunito',sans-serif] bg-[#F9F5EE]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fraunces:wght@700;900&family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
      `}</style>

      <Navbar onLogin={goLogin} onSignup={goSignup} />
      <Hero    onLogin={goLogin} onSignup={goSignup} />
      <Features />
      <HowItWorks />
      <GrowthSection />
      <Testimonials />
      <CTABanner onLogin={goLogin} onSignup={goSignup} />
      <Footer />
    </div>
  );
}