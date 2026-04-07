import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, PowerOff, Power, X, Check, Target, AlertCircle, RefreshCw, ChevronDown } from "lucide-react";
import { habitsApi } from "../api/api";

function TypeBadge({ type }) {
  return type === "BINARY"
    ? <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-green-50 border border-green-200 text-green-600 rounded-lg">Binary</span>
    : <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-600 rounded-lg">Quantitative</span>;
}

function HabitCard({ habit, onEdit, onDeactivate, onReactivate }) {
  const isActive = habit.isActive;
  return (
    <div className={`bg-[#FFFDF8] rounded-2xl border p-5 transition-all duration-200 hover:shadow-md
      ${isActive ? "border-amber-100" : "border-stone-100 opacity-60"}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className={`font-extrabold text-base ${isActive ? "text-stone-800" : "text-stone-400 line-through"}`}>
              {habit.name}
            </h3>
            <TypeBadge type={habit.type} />
            {!isActive && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-400 rounded-lg">Inactive</span>
            )}
          </div>
          {habit.type === "QUANTITATIVE" && (
            <div className="flex gap-3 text-xs font-bold text-stone-400">
              {habit.dailyTarget  && <span className="flex items-center gap-1"><Target size={11} className="text-purple-400" />Target: {habit.dailyTarget}</span>}
              {habit.minThreshold && <span className="flex items-center gap-1"><Check  size={11} className="text-green-400"  />Min: {habit.minThreshold}</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isActive && (
            <button onClick={() => onEdit(habit)} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-600 transition-all" title="Edit">
              <Pencil size={14} />
            </button>
          )}
          <button
            onClick={() => isActive ? onDeactivate(habit) : onReactivate(habit)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
              ${isActive ? "text-stone-300 hover:bg-red-50 hover:text-red-400" : "text-stone-300 hover:bg-green-50 hover:text-green-500"}`}
            title={isActive ? "Deactivate" : "Reactivate"}
          >
            {isActive ? <PowerOff size={14} /> : <Power size={14} />}
          </button>
        </div>
      </div>
      <p className="text-xs font-bold text-stone-400">
        Created {new Date(habit.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md">{children}</div>
    </div>
  );
}

function HabitForm({ initial, onSave, onClose, loading }) {
  const isEdit = !!initial;
  const [name,         setName]         = useState(initial?.name         ?? "");
  const [type,         setType]         = useState(initial?.type         ?? "BINARY");
  const [dailyTarget,  setDailyTarget]  = useState(initial?.dailyTarget  ?? "");
  const [minThreshold, setMinThreshold] = useState(initial?.minThreshold ?? "");
  const [error,        setError]        = useState("");

  const inputCls = "w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 outline-none focus:border-amber-400 focus:bg-amber-50 transition-all placeholder:text-stone-300";

  const handleSubmit = () => {
    if (!name.trim()) { setError("Habit name is required."); return; }
    if (type === "QUANTITATIVE" && !dailyTarget) { setError("Daily target is required for quantitative habits."); return; }
    setError("");
    const payload = { name: name.trim(), type };
    if (type === "QUANTITATIVE") {
      payload.dailyTarget  = parseFloat(dailyTarget);
      payload.minThreshold = minThreshold ? parseFloat(minThreshold) : parseFloat(dailyTarget);
    }
    onSave(payload);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-amber-100">
        <h2 className="font-['Fredoka_One'] text-2xl text-stone-800">{isEdit ? "Edit Habit ✏️" : "New Habit 🎯"}</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-100 transition-all"><X size={16} /></button>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-1.5">Habit Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morning Run, Read 30 mins..." className={inputCls} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        {!isEdit && (
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-1.5">Habit Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["BINARY", "QUANTITATIVE"].map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`py-3 rounded-xl border-2 text-sm font-extrabold transition-all duration-200
                    ${type === t
                      ? t === "BINARY" ? "bg-green-50 border-green-400 text-green-700" : "bg-purple-50 border-purple-400 text-purple-700"
                      : "bg-stone-50 border-stone-200 text-stone-400 hover:border-stone-300"}`}>
                  {t === "BINARY" ? "✅ Binary" : "📊 Quantitative"}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 font-semibold mt-1.5">
              {type === "BINARY" ? "Done or not done — simple checkbox." : "Track a number, e.g. km run, pages read."}
            </p>
          </div>
        )}
        {type === "QUANTITATIVE" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-1.5">Daily Target <span className="text-red-400">*</span></label>
              <input type="number" min="0" step="any" value={dailyTarget} onChange={e => setDailyTarget(e.target.value)} placeholder="e.g. 5" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-1.5">Min Threshold</label>
              <input type="number" min="0" step="any" value={minThreshold} onChange={e => setMinThreshold(e.target.value)} placeholder="Defaults to target" className={inputCls} />
            </div>
            <p className="col-span-2 text-xs text-stone-400 font-semibold -mt-1">Minimum value to count as completed.</p>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
      <div className="px-6 py-4 border-t border-amber-100 flex gap-2.5">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-stone-200 text-sm font-bold text-stone-500 hover:bg-stone-50 transition-all">Cancel</button>
        <button onClick={handleSubmit} disabled={loading}
          className={`flex-1 py-3 rounded-xl text-sm font-extrabold text-white transition-all
            ${loading ? "bg-amber-300 cursor-not-allowed" : "bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-[1.01] shadow-md shadow-amber-200"}`}>
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Habit 🎯"}
        </button>
      </div>
    </div>
  );
}

function ConfirmDialog({ habit, onConfirm, onClose, loading }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-amber-100 flex items-center justify-between">
        <h2 className="font-['Fredoka_One'] text-2xl text-stone-800">Deactivate Habit</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-100"><X size={16} /></button>
      </div>
      <div className="px-6 py-5">
        <p className="text-sm font-semibold text-stone-500 leading-relaxed">
          Are you sure you want to deactivate <span className="font-extrabold text-stone-800">"{habit.name}"</span>?
          It won't count toward your daily summary, but you can reactivate it anytime.
        </p>
      </div>
      <div className="px-6 py-4 border-t border-amber-100 flex gap-2.5">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-stone-200 text-sm font-bold text-stone-500 hover:bg-stone-50 transition-all">Cancel</button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-3 rounded-xl text-sm font-extrabold text-white bg-red-400 hover:bg-red-500 transition-all shadow-md disabled:opacity-50">
          {loading ? "Deactivating..." : "Yes, deactivate"}
        </button>
      </div>
    </div>
  );
}

export default function HabitsPage() {
  const navigate = useNavigate();
  const [habits,       setHabits]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [actionLoad,   setActionLoad]   = useState(false);
  const [error,        setError]        = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [modal,        setModal]        = useState(null);
  const [selected,     setSelected]     = useState(null);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await habitsApi.getAll();
      setHabits(res.data.data ?? []);
    } catch {
      setError("Failed to load habits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHabits(); }, []);

  const active   = habits.filter(h => h.isActive);
  const inactive = habits.filter(h => !h.isActive);

  const closeModal = () => { setModal(null); setSelected(null); };

  const handleCreate = async (payload) => {
    setActionLoad(true);
    try { await habitsApi.create(payload); await fetchHabits(); closeModal(); }
    catch (err) { console.error(err); }
    finally { setActionLoad(false); }
  };

  const handleEdit = async (payload) => {
    setActionLoad(true);
    try { await habitsApi.update(selected.habitId, payload); await fetchHabits(); closeModal(); }
    catch (err) { console.error(err); }
    finally { setActionLoad(false); }
  };

  const handleDeactivate = async () => {
    setActionLoad(true);
    try { await habitsApi.deactivate(selected.habitId); await fetchHabits(); closeModal(); }
    catch (err) { console.error(err); }
    finally { setActionLoad(false); }
  };

  const handleReactivate = async (habit) => {
    try { await habitsApi.reactivate(habit.habitId); await fetchHabits(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700/40">Manage</p>
          <h1 className="text-3xl font-black text-stone-800 leading-tight mt-1" style={{ fontFamily: "'Fraunces', serif" }}>Your Habits 📋</h1>
        </div>
        <button onClick={() => setModal("create")}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-extrabold rounded-2xl shadow-md shadow-amber-200 hover:scale-105 active:scale-95 transition-all duration-200">
          <Plus size={16} /> New Habit
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm font-bold text-red-500">
          <AlertCircle size={16} /> {error}
          <button onClick={fetchHabits} className="ml-auto flex items-center gap-1.5 hover:text-red-600"><RefreshCw size={13} /> Retry</button>
        </div>
      )}

      {/* Stats strip */}
      {!loading && (
        <div className="flex gap-3 mb-6">
          {[
            { label: "Active",   value: active.length,   color: "bg-green-50 border-green-100 text-green-600"  },
            { label: "Inactive", value: inactive.length, color: "bg-stone-50 border-stone-200 text-stone-400"  },
            { label: "Total",    value: habits.length,   color: "bg-amber-50 border-amber-100 text-amber-600"  },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} border rounded-xl px-4 py-2.5 flex items-center gap-2`}>
              <span className="text-xl font-black" style={{ fontFamily: "'Fraunces', serif" }}>{value}</span>
              <span className="text-xs font-extrabold uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-amber-100 animate-pulse" />)}
        </div>
      )}

      {/* Active habits */}
      {!loading && (
        <>
          {active.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-amber-100">
              <p className="text-5xl mb-3">🌱</p>
              <p className="font-['Fredoka_One'] text-2xl text-stone-600 mb-1">No habits yet!</p>
              <p className="text-sm text-stone-400 font-semibold mb-5">Add your first habit to start building your streak.</p>
              <button onClick={() => setModal("create")}
                className="px-6 py-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-extrabold rounded-xl shadow-md hover:scale-105 transition-all">
                <Plus size={14} className="inline mr-1.5" /> Add first habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {active.map(habit => (
                <HabitCard key={habit.habitId} habit={habit}
                  onEdit={h => { setSelected(h); setModal("edit"); }}
                  onDeactivate={h => { setSelected(h); setModal("deactivate"); }}
                  onReactivate={handleReactivate}
                />
              ))}
            </div>
          )}

          {inactive.length > 0 && (
            <div>
              <button onClick={() => setShowInactive(s => !s)}
                className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors mb-3">
                <ChevronDown size={14} className={`transition-transform ${showInactive ? "rotate-180" : ""}`} />
                Inactive habits ({inactive.length})
              </button>
              {showInactive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inactive.map(habit => (
                    <HabitCard key={habit.habitId} habit={habit}
                      onEdit={() => {}} onDeactivate={() => {}} onReactivate={handleReactivate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {modal === "create" && (
        <Modal onClose={closeModal}><HabitForm onSave={handleCreate} onClose={closeModal} loading={actionLoad} /></Modal>
      )}
      {modal === "edit" && selected && (
        <Modal onClose={closeModal}><HabitForm initial={selected} onSave={handleEdit} onClose={closeModal} loading={actionLoad} /></Modal>
      )}
      {modal === "deactivate" && selected && (
        <Modal onClose={closeModal}><ConfirmDialog habit={selected} onConfirm={handleDeactivate} onClose={closeModal} loading={actionLoad} /></Modal>
      )}
    </div>
  );
}