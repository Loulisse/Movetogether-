import { useState, useEffect, useRef, useCallback } from “react”;

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const STORAGE_KEY = “moving_app_data_v1”;

const defaultData = {
currentHome: {
tasks: [],
unboundItems: [],
},
futureHome: {
tasks: [],
unboundItems: [],
},
};

function loadData() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) return JSON.parse(raw);
} catch {}
return defaultData;
}

function saveData(data) {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
} catch {}
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
Home: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
</svg>
),
Star: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>
),
Plus: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
</svg>
),
Check: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
<polyline points="20 6 9 17 4 12"/>
</svg>
),
Edit: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
</svg>
),
Trash: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
</svg>
),
Camera: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
</svg>
),
Cart: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
</svg>
),
List: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
</svg>
),
Calendar: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
</svg>
),
Close: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
</svg>
),
ChevronDown: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
<polyline points="6 9 12 15 18 9"/>
</svg>
),
Share: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
</svg>
),
Package: () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
</svg>
),
};

// ─── URGENCY COLORS ───────────────────────────────────────────────────────────
function urgencyColor(level) {
if (level <= 3) return “#22c55e”;
if (level <= 6) return “#f59e0b”;
if (level <= 8) return “#f97316”;
return “#ef4444”;
}

function urgencyLabel(level) {
if (level <= 3) return “Faible”;
if (level <= 6) return “Modérée”;
if (level <= 8) return “Haute”;
return “Critique”;
}

// ─── UNIQUE ID ────────────────────────────────────────────────────────────────
let _id = Date.now();
function uid() { return (++_id).toString(36); }

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, wide }) {
useEffect(() => {
if (open) document.body.style.overflow = “hidden”;
else document.body.style.overflow = “”;
return () => { document.body.style.overflow = “”; };
}, [open]);

if (!open) return null;
return (
<div style={{
position: “fixed”, inset: 0, zIndex: 1000,
background: “rgba(10,10,20,0.75)”, backdropFilter: “blur(6px)”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
padding: “16px”,
}} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
<div style={{
background: “#0f1117”, border: “1px solid rgba(255,255,255,0.1)”,
borderRadius: “20px”, padding: “28px”,
width: “100%”, maxWidth: wide ? 640 : 480,
maxHeight: “90vh”, overflowY: “auto”,
boxShadow: “0 0 60px rgba(99,102,241,0.2)”,
animation: “modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)”,
}}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 24 }}>
<h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: “#fff”, fontFamily: “‘Clash Display’, sans-serif” }}>{title}</h2>
<button onClick={onClose} style={{ background: “rgba(255,255,255,0.08)”, border: “none”, borderRadius: 10, padding: 8, cursor: “pointer”, color: “#aaa”, display: “flex” }}>
<Icon.Close />
</button>
</div>
{children}
</div>
</div>
);
}

// ─── INPUT COMPONENTS ─────────────────────────────────────────────────────────
function Field({ label, children }) {
return (
<div style={{ marginBottom: 16 }}>
<label style={{ display: “block”, fontSize: 12, fontWeight: 600, color: “#888”, textTransform: “uppercase”, letterSpacing: “0.08em”, marginBottom: 6 }}>{label}</label>
{children}
</div>
);
}

const inputStyle = {
width: “100%”, boxSizing: “border-box”,
background: “rgba(255,255,255,0.06)”, border: “1px solid rgba(255,255,255,0.1)”,
borderRadius: 12, padding: “10px 14px”, color: “#fff”, fontSize: 15,
outline: “none”, fontFamily: “inherit”,
};

// ─── PHOTO UPLOADER ───────────────────────────────────────────────────────────
function PhotoUploader({ photos = [], onChange, label }) {
const inputRef = useRef();

function handleFiles(files) {
Array.from(files).forEach(file => {
if (!file.type.startsWith(“image/”)) return;
const reader = new FileReader();
reader.onload = e => {
onChange([…photos, { id: uid(), src: e.target.result, name: file.name, date: new Date().toLocaleDateString(“fr-CH”) }]);
};
reader.readAsDataURL(file);
});
}

return (
<div>
<div style={{ display: “flex”, gap: 8, flexWrap: “wrap”, marginBottom: photos.length ? 10 : 0 }}>
{photos.map(p => (
<div key={p.id} style={{ position: “relative”, width: 70, height: 70 }}>
<img src={p.src} alt={p.name} style={{ width: 70, height: 70, objectFit: “cover”, borderRadius: 10, border: “1px solid rgba(255,255,255,0.1)” }} />
<button onClick={() => onChange(photos.filter(x => x.id !== p.id))}
style={{ position: “absolute”, top: -4, right: -4, background: “#ef4444”, border: “none”, borderRadius: “50%”, width: 18, height: 18, cursor: “pointer”, color: “#fff”, fontSize: 10, display: “flex”, alignItems: “center”, justifyContent: “center” }}>✕</button>
</div>
))}
<button onClick={() => inputRef.current.click()}
style={{ width: 70, height: 70, background: “rgba(99,102,241,0.15)”, border: “2px dashed rgba(99,102,241,0.4)”, borderRadius: 10, cursor: “pointer”, color: “#818cf8”, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, gap: 4, fontSize: 10 }}>
<Icon.Camera />{label || “Photo”}
</button>
</div>
<input ref={inputRef} type=“file” accept=“image/*” multiple style={{ display: “none” }} onChange={e => handleFiles(e.target.files)} />
</div>
);
}

// ─── ITEM ROW (shopping list) ─────────────────────────────────────────────────
function ItemRow({ item, onToggle, onDelete }) {
return (
<div style={{
display: “flex”, alignItems: “center”, gap: 10, padding: “10px 14px”,
background: item.done ? “rgba(34,197,94,0.06)” : “rgba(255,255,255,0.04)”,
borderRadius: 12, marginBottom: 6,
border: `1px solid ${item.done ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`,
transition: “all 0.2s”,
}}>
<button onClick={() => onToggle(item.id)} style={{
width: 22, height: 22, borderRadius: 6, border: `2px solid ${item.done ? "#22c55e" : "rgba(255,255,255,0.2)"}`,
background: item.done ? “#22c55e” : “transparent”, cursor: “pointer”,
display: “flex”, alignItems: “center”, justifyContent: “center”, color: “#fff”, flexShrink: 0,
}}>{item.done && <Icon.Check />}</button>
<span style={{ flex: 1, color: item.done ? “#666” : “#ddd”, textDecoration: item.done ? “line-through” : “none”, fontSize: 14 }}>{item.name}</span>
{item.price && <span style={{ color: “#818cf8”, fontSize: 13, fontWeight: 600 }}>{item.price} CHF</span>}
<button onClick={() => onDelete(item.id)} style={{ background: “none”, border: “none”, cursor: “pointer”, color: “#555”, padding: 2, display: “flex” }}>
<Icon.Trash />
</button>
</div>
);
}

// ─── TASK FORM ────────────────────────────────────────────────────────────────
function TaskForm({ initial, onSave, onClose }) {
const [form, setForm] = useState(initial || {
id: uid(), title: “”, room: “”, deadline: “”, urgency: 5,
description: “”, items: [], photosBefore: [], photosInspiration: [], done: false,
});
const [newItemName, setNewItemName] = useState(””);
const [newItemPrice, setNewItemPrice] = useState(””);

function set(key, val) { setForm(f => ({ …f, [key]: val })); }

function addItem() {
if (!newItemName.trim()) return;
set(“items”, […form.items, { id: uid(), name: newItemName.trim(), price: newItemPrice.trim(), done: false }]);
setNewItemName(””); setNewItemPrice(””);
}

function removeItem(id) { set(“items”, form.items.filter(i => i.id !== id)); }

return (
<div>
<Field label="Titre de la tâche">
<input style={inputStyle} value={form.title} onChange={e => set(“title”, e.target.value)} placeholder=“Ex: Installation machine à laver” />
</Field>
<Field label="Pièce / Zone">
<input style={inputStyle} value={form.room} onChange={e => set(“room”, e.target.value)} placeholder=“Ex: Cuisine, Salle de bain…” />
</Field>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 12 }}>
<Field label="Deadline">
<input type=“date” style={inputStyle} value={form.deadline} onChange={e => set(“deadline”, e.target.value)} />
</Field>
<Field label={`Urgence: ${form.urgency}/10 — ${urgencyLabel(form.urgency)}`}>
<div style={{ display: “flex”, alignItems: “center”, gap: 8, paddingTop: 8 }}>
<input type=“range” min=“1” max=“10” value={form.urgency} onChange={e => set(“urgency”, +e.target.value)}
style={{ flex: 1, accentColor: urgencyColor(form.urgency) }} />
<span style={{ color: urgencyColor(form.urgency), fontWeight: 700, fontSize: 15, minWidth: 20 }}>{form.urgency}</span>
</div>
</Field>
</div>
<Field label="Description">
<textarea style={{ …inputStyle, minHeight: 72, resize: “vertical” }} value={form.description} onChange={e => set(“description”, e.target.value)} placeholder=“Notes, détails…” />
</Field>

```
  <Field label="Articles à acheter">
    <div style={{ marginBottom: 8 }}>
      {form.items.map(item => (
        <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 10, marginBottom: 4 }}>
          <span style={{ flex: 1, color: "#ddd", fontSize: 14 }}>{item.name}</span>
          {item.price && <span style={{ color: "#818cf8", fontSize: 13 }}>{item.price} CHF</span>}
          <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }}><Icon.Trash /></button>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <input style={{ ...inputStyle, flex: 2 }} value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Article" onKeyDown={e => e.key === "Enter" && addItem()} />
      <input style={{ ...inputStyle, flex: 1 }} value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="CHF" type="number" />
      <button onClick={addItem} style={{ background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 10, padding: "0 14px", cursor: "pointer", color: "#818cf8", display: "flex", alignItems: "center" }}><Icon.Plus /></button>
    </div>
  </Field>

  <Field label="Photos — État actuel / Avant">
    <PhotoUploader photos={form.photosBefore} onChange={v => set("photosBefore", v)} label="Avant" />
  </Field>
  <Field label="Photos — Inspiration / Après">
    <PhotoUploader photos={form.photosInspiration} onChange={v => set("photosInspiration", v)} label="Inspi" />
  </Field>

  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
    <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#aaa", cursor: "pointer", fontSize: 14 }}>Annuler</button>
    <button onClick={() => { if (form.title.trim()) { onSave(form); onClose(); } }}
      style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
      {initial ? "Enregistrer" : "Créer la tâche"}
    </button>
  </div>
</div>
```

);
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, onEdit, onDelete, onToggleDone, onToggleItem }) {
const [expanded, setExpanded] = useState(false);
const totalPrice = task.items.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
const doneItems = task.items.filter(i => i.done).length;
const allPhotos = […(task.photosBefore || []), …(task.photosInspiration || [])];

return (
<div style={{
background: task.done ? “rgba(34,197,94,0.05)” : “rgba(255,255,255,0.04)”,
border: `1px solid ${task.done ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)"}`,
borderRadius: 16, overflow: “hidden”, marginBottom: 10,
transition: “all 0.2s”,
}}>
{/* Header */}
<div style={{ padding: “14px 16px”, display: “flex”, gap: 12, alignItems: “flex-start”, cursor: “pointer” }} onClick={() => setExpanded(e => !e)}>
<button onClick={e => { e.stopPropagation(); onToggleDone(task.id); }}
style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${task.done ? "#22c55e" : "rgba(255,255,255,0.2)"}`, background: task.done ? “#22c55e” : “transparent”, cursor: “pointer”, display: “flex”, alignItems: “center”, justifyContent: “center”, color: “#fff”, flexShrink: 0, marginTop: 1 }}>
{task.done && <Icon.Check />}
</button>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 8, flexWrap: “wrap” }}>
<span style={{ color: task.done ? “#666” : “#fff”, fontWeight: 700, fontSize: 15, textDecoration: task.done ? “line-through” : “none” }}>{task.title}</span>
{task.room && <span style={{ background: “rgba(99,102,241,0.2)”, color: “#818cf8”, fontSize: 11, padding: “2px 8px”, borderRadius: 20, fontWeight: 600 }}>{task.room}</span>}
</div>
<div style={{ display: “flex”, gap: 12, marginTop: 4, flexWrap: “wrap” }}>
{task.deadline && <span style={{ color: “#888”, fontSize: 12 }}>📅 {new Date(task.deadline).toLocaleDateString(“fr-CH”)}</span>}
{totalPrice > 0 && <span style={{ color: “#818cf8”, fontSize: 12, fontWeight: 600 }}>💰 ~{totalPrice.toFixed(0)} CHF</span>}
{task.items.length > 0 && <span style={{ color: “#888”, fontSize: 12 }}>{doneItems}/{task.items.length} articles</span>}
{allPhotos.length > 0 && <span style={{ color: “#888”, fontSize: 12 }}>🖼 {allPhotos.length}</span>}
</div>
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
<div style={{
width: 32, height: 32, borderRadius: 10,
background: `${urgencyColor(task.urgency)}22`,
border: `2px solid ${urgencyColor(task.urgency)}`,
display: “flex”, alignItems: “center”, justifyContent: “center”,
color: urgencyColor(task.urgency), fontSize: 12, fontWeight: 800,
}}>{task.urgency}</div>
<span style={{ color: “#555”, transform: expanded ? “rotate(180deg)” : “rotate(0)”, transition: “0.2s”, display: “flex” }}><Icon.ChevronDown /></span>
</div>
</div>

```
  {/* Expanded */}
  {expanded && (
    <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {task.description && <p style={{ color: "#aaa", fontSize: 14, marginTop: 12, marginBottom: 12, lineHeight: 1.5 }}>{task.description}</p>}

      {task.items.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, marginTop: 8 }}>Articles à acheter</div>
          {task.items.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: 4 }}>
              <button onClick={() => onToggleItem(task.id, item.id)}
                style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${item.done ? "#22c55e" : "rgba(255,255,255,0.2)"}`, background: item.done ? "#22c55e" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                {item.done && <Icon.Check />}
              </button>
              <span style={{ flex: 1, color: item.done ? "#555" : "#ddd", fontSize: 14, textDecoration: item.done ? "line-through" : "none" }}>{item.name}</span>
              {item.price && <span style={{ color: "#818cf8", fontSize: 13 }}>{item.price} CHF</span>}
            </div>
          ))}
        </div>
      )}

      {(task.photosBefore?.length > 0 || task.photosInspiration?.length > 0) && (
        <div style={{ marginBottom: 12 }}>
          {task.photosBefore?.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>État actuel</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {task.photosBefore.map(p => <img key={p.id} src={p.src} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />)}
              </div>
            </>
          )}
          {task.photosInspiration?.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Inspiration</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {task.photosInspiration.map(p => <img key={p.id} src={p.src} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />)}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => onEdit(task)} style={{ display: "flex", gap: 6, alignItems: "center", padding: "8px 14px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "#818cf8", cursor: "pointer", fontSize: 13 }}>
          <Icon.Edit /> Modifier
        </button>
        <button onClick={() => onDelete(task.id)} style={{ display: "flex", gap: 6, alignItems: "center", padding: "8px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, color: "#f87171", cursor: "pointer", fontSize: 13 }}>
          <Icon.Trash /> Supprimer
        </button>
      </div>
    </div>
  )}
</div>
```

);
}

// ─── SUMMARY VIEW ─────────────────────────────────────────────────────────────
function SummaryView({ tasks, onEdit, onDelete, onToggleDone, onToggleItem }) {
const sorted = […tasks].sort((a, b) => b.urgency - a.urgency);
const done = tasks.filter(t => t.done).length;
const totalBudget = tasks.reduce((s, t) => s + t.items.reduce((ss, i) => ss + (parseFloat(i.price) || 0), 0), 0);

return (
<div>
{/* Stats */}
<div style={{ display: “grid”, gridTemplateColumns: “repeat(3, 1fr)”, gap: 10, marginBottom: 20 }}>
{[
{ label: “Tâches”, value: `${done}/${tasks.length}`, sub: “complétées”, color: “#22c55e” },
{ label: “Budget”, value: `~${totalBudget.toFixed(0)}`, sub: “CHF estimé”, color: “#818cf8” },
{ label: “Urgentes”, value: tasks.filter(t => t.urgency >= 8 && !t.done).length, sub: “prioritaires”, color: “#ef4444” },
].map(s => (
<div key={s.label} style={{ background: “rgba(255,255,255,0.04)”, border: “1px solid rgba(255,255,255,0.08)”, borderRadius: 14, padding: “14px 12px”, textAlign: “center” }}>
<div style={{ color: s.color, fontSize: 22, fontWeight: 800, fontFamily: “‘Clash Display’, sans-serif” }}>{s.value}</div>
<div style={{ color: “#888”, fontSize: 11, marginTop: 2 }}>{s.sub}</div>
</div>
))}
</div>

```
  {tasks.length === 0 ? (
    <div style={{ textAlign: "center", color: "#444", padding: "40px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
      <div>Aucune tâche pour le moment</div>
    </div>
  ) : (
    sorted.map(t => <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onToggleDone={onToggleDone} onToggleItem={onToggleItem} />)
  )}
</div>
```

);
}

// ─── SHOPPING VIEW ────────────────────────────────────────────────────────────
function ShoppingView({ tasks, unboundItems, onUpdateUnbound }) {
const [newName, setNewName] = useState(””);
const [newPrice, setNewPrice] = useState(””);

function addUnbound() {
if (!newName.trim()) return;
onUpdateUnbound([…unboundItems, { id: uid(), name: newName.trim(), price: newPrice.trim(), done: false }]);
setNewName(””); setNewPrice(””);
}

function toggleUnbound(id) {
onUpdateUnbound(unboundItems.map(i => i.id === id ? { …i, done: !i.done } : i));
}
function deleteUnbound(id) {
onUpdateUnbound(unboundItems.filter(i => i.id !== id));
}

const taskItems = tasks.flatMap(t => t.items.map(i => ({ …i, taskTitle: t.title, taskId: t.id })));
const totalDone = […taskItems, …unboundItems].filter(i => i.done).length;
const totalAll = taskItems.length + unboundItems.length;
const totalCost = […taskItems, …unboundItems].reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
const totalDoneCost = […taskItems, …unboundItems].filter(i => i.done).reduce((s, i) => s + (parseFloat(i.price) || 0), 0);

return (
<div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 10, marginBottom: 20 }}>
<div style={{ background: “rgba(255,255,255,0.04)”, border: “1px solid rgba(255,255,255,0.08)”, borderRadius: 14, padding: 14, textAlign: “center” }}>
<div style={{ color: “#22c55e”, fontSize: 20, fontWeight: 800 }}>{totalDone}/{totalAll}</div>
<div style={{ color: “#888”, fontSize: 11 }}>articles achetés</div>
</div>
<div style={{ background: “rgba(255,255,255,0.04)”, border: “1px solid rgba(255,255,255,0.08)”, borderRadius: 14, padding: 14, textAlign: “center” }}>
<div style={{ color: “#818cf8”, fontSize: 20, fontWeight: 800 }}>{totalDoneCost.toFixed(0)}/{totalCost.toFixed(0)}</div>
<div style={{ color: “#888”, fontSize: 11 }}>CHF dépensés/total</div>
</div>
</div>

```
  {taskItems.length > 0 && (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ color: "#888", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Liés à une tâche</h3>
      {taskItems.map(item => (
        <div key={`${item.taskId}-${item.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 6, border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${item.done ? "#22c55e" : "rgba(255,255,255,0.2)"}`, background: item.done ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
            {item.done && <Icon.Check />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: item.done ? "#555" : "#ddd", fontSize: 14, textDecoration: item.done ? "line-through" : "none" }}>{item.name}</div>
            <div style={{ color: "#555", fontSize: 11 }}>📌 {item.taskTitle}</div>
          </div>
          {item.price && <span style={{ color: "#818cf8", fontSize: 13, fontWeight: 600 }}>{item.price} CHF</span>}
        </div>
      ))}
    </div>
  )}

  <div>
    <h3 style={{ color: "#888", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Articles divers</h3>
    {unboundItems.map(item => (
      <ItemRow key={item.id} item={item} onToggle={toggleUnbound} onDelete={deleteUnbound} />
    ))}
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      <input style={{ ...inputStyle, flex: 2 }} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nouvel article…" onKeyDown={e => e.key === "Enter" && addUnbound()} />
      <input style={{ ...inputStyle, flex: 1 }} value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="CHF" type="number" />
      <button onClick={addUnbound} style={{ background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 10, padding: "0 14px", cursor: "pointer", color: "#818cf8", display: "flex", alignItems: "center" }}>
        <Icon.Plus />
      </button>
    </div>
  </div>
</div>
```

);
}

// ─── CALENDAR VIEW ────────────────────────────────────────────────────────────
function CalendarView({ tasks }) {
const withDeadline = tasks.filter(t => t.deadline).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
const now = new Date();

function daysLeft(deadline) {
const d = new Date(deadline);
const diff = Math.ceil((d - now) / 86400000);
return diff;
}

return (
<div>
{withDeadline.length === 0 ? (
<div style={{ textAlign: “center”, color: “#444”, padding: “40px 0” }}>
<div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
<div>Aucune tâche avec deadline</div>
</div>
) : (
withDeadline.map(t => {
const dl = daysLeft(t.deadline);
const past = dl < 0;
const soon = dl >= 0 && dl <= 7;
const color = past ? “#ef4444” : soon ? “#f59e0b” : “#22c55e”;
return (
<div key={t.id} style={{ display: “flex”, gap: 14, padding: “14px 16px”, background: “rgba(255,255,255,0.04)”, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 14, marginBottom: 10, alignItems: “center” }}>
<div style={{ minWidth: 52, textAlign: “center” }}>
<div style={{ color, fontSize: 20, fontWeight: 800, fontFamily: “‘Clash Display’, sans-serif” }}>{past ? “−” : “+”}{Math.abs(dl)}</div>
<div style={{ color: “#666”, fontSize: 10 }}>jours</div>
</div>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ color: t.done ? “#555” : “#fff”, fontWeight: 700, fontSize: 14, textDecoration: t.done ? “line-through” : “none” }}>{t.title}</div>
<div style={{ color: “#888”, fontSize: 12, marginTop: 2 }}>
{new Date(t.deadline).toLocaleDateString(“fr-CH”, { day: “numeric”, month: “long” })}
{t.room && ` · ${t.room}`}
</div>
</div>
<div style={{ width: 30, height: 30, borderRadius: 8, background: `${urgencyColor(t.urgency)}22`, border: `2px solid ${urgencyColor(t.urgency)}`, display: “flex”, alignItems: “center”, justifyContent: “center”, color: urgencyColor(t.urgency), fontSize: 11, fontWeight: 800 }}>{t.urgency}</div>
</div>
);
})
)}
</div>
);
}

// ─── SHARE MODAL ──────────────────────────────────────────────────────────────
function ShareModal({ open, onClose }) {
const [copied, setCopied] = useState(false);
const url = window.location.href;

function copy() {
navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
}

return (
<Modal open={open} onClose={onClose} title="Partager avec ta copine">
<p style={{ color: “#aaa”, fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
Toutes les données sont sauvegardées localement dans ce navigateur. Pour partager avec ta copine, vous pouvez utiliser le même appareil ou exporter/importer les données ci-dessous.
</p>
<Field label="URL de l'application">
<div style={{ display: “flex”, gap: 8 }}>
<input style={{ …inputStyle, flex: 1, color: “#666”, fontSize: 12 }} value={url} readOnly />
<button onClick={copy} style={{ background: copied ? “rgba(34,197,94,0.3)” : “rgba(99,102,241,0.3)”, border: “1px solid rgba(99,102,241,0.4)”, borderRadius: 10, padding: “0 14px”, cursor: “pointer”, color: copied ? “#22c55e” : “#818cf8”, fontSize: 13, whiteSpace: “nowrap” }}>
{copied ? “✓ Copié” : “Copier”}
</button>
</div>
</Field>
<div style={{ background: “rgba(245,158,11,0.1)”, border: “1px solid rgba(245,158,11,0.2)”, borderRadius: 12, padding: 14, marginTop: 4 }}>
<p style={{ color: “#fbbf24”, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
💡 <strong>Conseil :</strong> Pour une vraie synchronisation entre deux téléphones, déployez cette app sur un service comme Vercel ou Netlify avec un backend partagé.
</p>
</div>
</Modal>
);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
const [data, setData] = useState(() => loadData());
const [house, setHouse] = useState(“current”); // “current” | “future”
const [tab, setTab] = useState(“summary”); // “summary” | “shopping” | “calendar”
const [taskModal, setTaskModal] = useState(false);
const [editingTask, setEditingTask] = useState(null);
const [shareModal, setShareModal] = useState(false);

useEffect(() => { saveData(data); }, [data]);

const houseKey = house === “current” ? “currentHome” : “futureHome”;
const houseData = data[houseKey];

function updateHouse(updater) {
setData(d => ({ …d, [houseKey]: updater(d[houseKey]) }));
}

function saveTask(task) {
updateHouse(h => {
const exists = h.tasks.find(t => t.id === task.id);
return { …h, tasks: exists ? h.tasks.map(t => t.id === task.id ? task : t) : […h.tasks, task] };
});
}

function deleteTask(id) {
updateHouse(h => ({ …h, tasks: h.tasks.filter(t => t.id !== id) }));
}

function toggleDone(id) {
updateHouse(h => ({ …h, tasks: h.tasks.map(t => t.id === id ? { …t, done: !t.done } : t) }));
}

function toggleItem(taskId, itemId) {
updateHouse(h => ({
…h,
tasks: h.tasks.map(t => t.id === taskId ? { …t, items: t.items.map(i => i.id === itemId ? { …i, done: !i.done } : i) } : t)
}));
}

const tabs = [
{ id: “summary”, label: “Résumé”, Icon: Icon.List },
{ id: “shopping”, label: “Achats”, Icon: Icon.Cart },
{ id: “calendar”, label: “Calendrier”, Icon: Icon.Calendar },
];

const houseLabel = house === “current” ? “Maison actuelle” : “Nouvelle maison”;
const houseEmoji = house === “current” ? “🏠” : “✨”;

return (
<div style={{
minHeight: “100vh”, background: “#080a0f”,
fontFamily: “‘DM Sans’, ‘Segoe UI’, sans-serif”,
color: “#fff”,
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); @keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } } * { -webkit-tap-highlight-color: transparent; } input[type=range] { -webkit-appearance: none; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; outline: none; } input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; } ::placeholder { color: #444 !important; } input, textarea, select { color-scheme: dark; }`}</style>

```
  {/* Top Bar */}
  <div style={{
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(8,10,15,0.9)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "12px 16px",
  }}>
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* App title + share */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            MoveTogether
          </span>
          <span style={{ color: "#444", fontSize: 12, marginLeft: 8 }}>🏡</span>
        </div>
        <button onClick={() => setShareModal(true)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "6px 12px", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <Icon.Share /> Partager
        </button>
      </div>

      {/* House selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { id: "current", label: "Maison actuelle", emoji: "🏠" },
          { id: "future", label: "Nouvelle maison", emoji: "✨" },
        ].map(h => (
          <button key={h.id} onClick={() => setHouse(h.id)} style={{
            padding: "10px 12px", borderRadius: 12, cursor: "pointer",
            background: house === h.id ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))" : "rgba(255,255,255,0.04)",
            border: `2px solid ${house === h.id ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.06)"}`,
            color: house === h.id ? "#a5b4fc" : "#666",
            fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
            transition: "all 0.2s",
          }}>
            <span>{h.emoji}</span>{h.label}
          </button>
        ))}
      </div>

      {/* Tab nav */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 0", borderRadius: 10, cursor: "pointer",
            background: tab === t.id ? "rgba(99,102,241,0.25)" : "transparent",
            border: `1px solid ${tab === t.id ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
            color: tab === t.id ? "#818cf8" : "#555",
            fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, justifyContent: "center",
            transition: "all 0.2s",
          }}>
            <t.Icon />{t.label}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Content */}
  <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 100px" }}>
    {/* Section header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>
        {houseEmoji} {houseLabel} — {tabs.find(t => t.id === tab)?.label}
      </h2>
      {tab !== "calendar" && (
        <button onClick={() => { setEditingTask(null); setTaskModal(true); }} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none",
          borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>
          <Icon.Plus /> Nouvelle tâche
        </button>
      )}
    </div>

    {tab === "summary" && (
      <SummaryView
        tasks={houseData.tasks}
        onEdit={t => { setEditingTask(t); setTaskModal(true); }}
        onDelete={deleteTask}
        onToggleDone={toggleDone}
        onToggleItem={toggleItem}
      />
    )}
    {tab === "shopping" && (
      <ShoppingView
        tasks={houseData.tasks}
        unboundItems={houseData.unboundItems}
        onUpdateUnbound={items => updateHouse(h => ({ ...h, unboundItems: items }))}
      />
    )}
    {tab === "calendar" && <CalendarView tasks={houseData.tasks} />}
  </div>

  {/* Task Modal */}
  <Modal open={taskModal} onClose={() => setTaskModal(false)} title={editingTask ? "Modifier la tâche" : "Nouvelle tâche"} wide>
    <TaskForm
      initial={editingTask}
      onSave={saveTask}
      onClose={() => setTaskModal(false)}
    />
  </Modal>

  {/* Share Modal */}
  <ShareModal open={shareModal} onClose={() => setShareModal(false)} />
</div>
```

);
}