"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── types ─────────────────────────────────────────────── */
interface Cliente {
  _id: string;
  nombre: string;
  logoId: string | null;
  orden: number;
}

interface NewsItem {
  _id: string;
  titulo: { es: string; en: string };
  descripcion: { es: string; en: string };
  fecha: string | null;
  categoria: { es: string; en: string };
  catKey: string;
  imagenId: string | null;
  link: string | null;
}

interface NewsForm {
  _id?: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  category_es: string;
  category_en: string;
  date: string;
  imagenId: string | null;
  link: string;
}

/* ─── translations ───────────────────────────────────────── */
const uiText = {
  es: {
    backToSite: "← Volver al sitio",
    signOut: "Cerrar sesión",
    clients: "Clientes",
    news: "Novedades",
    addClient: "Agregar cliente",
    name: "Nombre",
    logo: "Logo",
    uploadLogo: "Subir logo",
    logoHint: "PNG transparente, horizontal (~400×225px, 16:9)",
    change: "Cambiar",
    uploading: "Subiendo…",
    dragHint: "Arrastrá las tarjetas para reordenar",
    delete: "Eliminar",
    newItem: "+ Nueva novedad",
    editItem: "Editar novedad",
    createItem: "Nueva novedad",
    title: "Título",
    summary: "Resumen",
    category: "Categoría",
    date: "Fecha",
    link: "Enlace",
    image: "Imagen",
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    uploadImage: "Subir imagen",
    imageHint: "Recomendado: 1280×800px (16:10)",
    noLogo: "Sin logo",
    noImg: "Sin imagen",
    deleteClientConfirm: "¿Eliminar este cliente?",
    deleteNewsConfirm: "¿Eliminar esta novedad?",
    emptyClients: "Todavía no hay clientes. Agregá el primero con el formulario de arriba.",
    emptyNews: "Todavía no hay novedades. Creá la primera con el botón de arriba.",
  },
  en: {
    backToSite: "← Back to site",
    signOut: "Sign out",
    clients: "Clients",
    news: "News",
    addClient: "Add client",
    name: "Name",
    logo: "Logo",
    uploadLogo: "Upload logo",
    logoHint: "Transparent PNG, landscape (~400×225px, 16:9)",
    change: "Change",
    uploading: "Uploading…",
    dragHint: "Drag cards to reorder",
    delete: "Delete",
    newItem: "+ New item",
    editItem: "Edit item",
    createItem: "New item",
    title: "Title",
    summary: "Summary",
    category: "Category",
    date: "Date",
    link: "Link",
    image: "Image",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    uploadImage: "Upload image",
    imageHint: "Recommended: 1280×800px (16:10)",
    noLogo: "No logo",
    noImg: "No img",
    deleteClientConfirm: "Delete this client?",
    deleteNewsConfirm: "Delete this news item?",
    emptyClients: "No clients yet. Add your first one with the form above.",
    emptyNews: "No news yet. Create the first one with the button above.",
  },
} as const;
type Lang = keyof typeof uiText;

/* ─── helpers ────────────────────────────────────────────── */
function adminFetch(url: string, opts: RequestInit = {}) {
  const pw = sessionStorage.getItem("admin_pw") || "";
  return fetch(url, {
    ...opts,
    headers: { "x-admin-key": pw, "Content-Type": "application/json", ...opts.headers },
  });
}

/* ─── confirm modal ──────────────────────────────────────── */
function ConfirmModal({ message, confirmLabel, cancelLabel, onConfirm, onCancel }: {
  message: string; confirmLabel: string; cancelLabel: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--line)",
          padding: "28px 32px", maxWidth: 360, width: "100%",
          display: "flex", flexDirection: "column", gap: 20,
        }}
      >
        <p style={{ margin: 0, fontSize: 15, color: "var(--ink)", fontWeight: 500, lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={secondaryBtn}>{cancelLabel}</button>
          <button onClick={onConfirm} style={{ ...primaryBtn, background: DANGER, borderColor: DANGER }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function useConfirm(ui: { delete: string; cancel: string }) {
  const [state, setState] = useState<{
    message: string; onConfirm: () => void; onCancel: () => void;
  } | null>(null);

  function prompt(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      setState({
        message,
        onConfirm: () => { resolve(true); setState(null); },
        onCancel: () => { resolve(false); setState(null); },
      });
    });
  }

  const modal = state ? (
    <ConfirmModal
      message={state.message}
      confirmLabel={ui.delete}
      cancelLabel={ui.cancel}
      onConfirm={state.onConfirm}
      onCancel={state.onCancel}
    />
  ) : null;

  return { prompt, modal };
}

/* ─── sub-components ─────────────────────────────────────── */
function ClientsTab({ pw, lang }: { pw: string; lang: Lang }) {
  const ui = uiText[lang];
  const { prompt: askConfirm, modal: confirmModal } = useConfirm(ui);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingLogoId, setPendingLogoId] = useState<string | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }
  useEffect(load, []);

  async function uploadLogo(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-key": pw },
      body: fd,
    });
    const data = await res.json();
    setPendingLogoId(data.id);
    setPendingPreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function addClient() {
    if (!nombre.trim()) return;
    await adminFetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({ nombre: nombre.trim(), logoId: pendingLogoId, orden: clients.length }),
    });
    setNombre("");
    setPendingLogoId(null);
    setPendingPreview(null);
    load();
  }

  async function deleteClient(id: string) {
    const ok = await askConfirm(ui.deleteClientConfirm);
    if (!ok) return;
    await adminFetch(`/api/clients/${id}`, { method: "DELETE" });
    load();
  }

  async function saveOrder(ordered: Cliente[]) {
    await Promise.all(
      ordered.map((c, i) =>
        adminFetch(`/api/clients/${c._id}`, { method: "PUT", body: JSON.stringify({ orden: i }) })
      )
    );
  }

  function onDragStart(i: number) {
    dragIndex.current = i;
  }

  function onDragEnter(i: number) {
    setDragOver(i);
  }

  function onDragEnd() {
    const from = dragIndex.current;
    const to = dragOver;
    setDragOver(null);
    dragIndex.current = null;
    if (from === null || to === null || from === to) return;
    const reordered = [...clients];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setClients(reordered);
    saveOrder(reordered);
  }

  return (
    <div>
      {/* Add form */}
      <div style={formBox}>
        <h3 style={formTitle}>{ui.addClient}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, alignItems: "start" }}>
          <div style={fieldCol}>
            <label style={labelStyle}>{ui.name}</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={ui.name}
              style={inputStyle}
            />
          </div>
          <div style={fieldCol}>
            <label style={labelStyle}>{ui.logo}</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => fileRef.current?.click()} style={secondaryBtn}>
                {uploading ? ui.uploading : pendingPreview ? ui.change : ui.uploadLogo}
              </button>
              {pendingPreview && (
                <div style={{ width: 48, height: 30, position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid var(--line)", background: "var(--bg-soft)", flexShrink: 0 }}>
                  <Image src={pendingPreview} alt="" fill style={{ objectFit: "contain" }} />
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
              />
            </div>
            <span style={hintStyle}>{ui.logoHint}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
          <button onClick={addClient} style={{ ...primaryBtn, opacity: nombre.trim() ? 1 : 0.5, cursor: nombre.trim() ? "pointer" : "not-allowed" }} disabled={!nombre.trim()}>
            {ui.addClient}
          </button>
        </div>
      </div>

      {/* Drag hint pill */}
      {clients.length > 1 && (
        <div style={{ margin: "24px 0 14px" }}>
          <div style={dragPill}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              {[0, 4, 8].map((y) => [0, 4, 8].map((x) => (
                <circle key={`${x}-${y}`} cx={3 + x} cy={3 + y} r="1.1" fill="currentColor" />
              )))}
            </svg>
            {ui.dragHint}
          </div>
        </div>
      )}

      {/* Grid */}
      {clients.length === 0 && <div style={emptyState}>{ui.emptyClients}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        {clients.map((c, i) => (
          <div
            key={c._id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragEnter={() => onDragEnter(i)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={onDragEnd}
            style={{
              ...cardStyle,
              cursor: "grab",
              outline: dragOver === i ? "2px solid var(--brand-teal)" : "none",
              outlineOffset: 2,
              opacity: dragIndex.current === i ? 0.4 : 1,
              transition: "opacity 0.15s, outline 0.15s",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--bg-soft)", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
              {c.logoId ? (
                <Image src={`/api/images/${c.logoId}`} alt={c.nombre} fill style={{ objectFit: "contain", padding: 10 }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 11, color: "var(--ink-faint)" }}>
                  {ui.noLogo}
                </div>
              )}
            </div>
            <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13.5, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nombre}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--ink-faint)", flexShrink: 0 }} aria-hidden="true">
                {[0, 5, 10].map((y) => [0, 5, 10].map((x) => (
                  <circle key={`${x}-${y}`} cx={3 + x} cy={3 + y} r="1.2" fill="currentColor" />
                )))}
              </svg>
              <button onClick={() => deleteClient(c._id)} style={smallDangerBtn}>{ui.delete}</button>
            </div>
          </div>
        ))}
      </div>
      {confirmModal}
    </div>
  );
}

function NewsTab({ pw, lang }: { pw: string; lang: Lang }) {
  const ui = uiText[lang];
  const { prompt: askConfirm, modal: confirmModal } = useConfirm(ui);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsForm | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/news").then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  async function saveOrder(ordered: NewsItem[]) {
    await Promise.all(
      ordered.map((n, i) =>
        adminFetch(`/api/news/${n._id}`, { method: "PUT", body: JSON.stringify({ order: i }) })
      )
    );
  }

  function onDragStart(i: number) {
    dragIndex.current = i;
  }

  function onDragEnter(i: number) {
    setDragOver(i);
  }

  function onDragEnd() {
    const from = dragIndex.current;
    const to = dragOver;
    setDragOver(null);
    dragIndex.current = null;
    if (from === null || to === null || from === to) return;
    const reordered = [...items];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setItems(reordered);
    saveOrder(reordered);
  }

  function blankForm(): NewsForm {
    return {
      title_es: "", title_en: "",
      summary_es: "", summary_en: "",
      category_es: "Eventos", category_en: "Events",
      date: new Date().toISOString().split("T")[0],
      imagenId: null, link: "",
    };
  }

  function openEdit(n: NewsItem) {
    setForm({
      _id: n._id,
      title_es: n.titulo.es, title_en: n.titulo.en,
      summary_es: n.descripcion.es, summary_en: n.descripcion.en,
      category_es: n.categoria.es, category_en: n.categoria.en,
      date: n.fecha ? n.fecha.split("T")[0] : "",
      imagenId: n.imagenId,
      link: n.link || "",
    });
    setPreview(null);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-key": pw },
      body: fd,
    });
    const data = await res.json();
    setForm((f) => f ? { ...f, imagenId: data.id } : f);
    setPreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function save() {
    if (!form) return;
    const payload = { ...form };
    if (form._id) {
      await adminFetch(`/api/news/${form._id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await adminFetch("/api/news", { method: "POST", body: JSON.stringify(payload) });
    }
    setForm(null);
    setPreview(null);
    load();
  }

  async function del(id: string) {
    const ok = await askConfirm(ui.deleteNewsConfirm);
    if (!ok) return;
    await adminFetch(`/api/news/${id}`, { method: "DELETE" });
    load();
  }

  function patch(key: keyof NewsForm, val: string) {
    setForm((f) => f ? { ...f, [key]: val } : f);
  }

  return (
    <div>
      <button onClick={() => { setForm(blankForm()); setPreview(null); }} style={{ ...primaryBtn, marginBottom: 24 }}>
        {ui.newItem}
      </button>

      {/* Editor */}
      {form && (
        <div style={{ ...formBox, marginBottom: 24 }}>
          <h3 style={formTitle}>{form._id ? ui.editItem : ui.createItem}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {(["es", "en"] as const).map((l) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <span style={{
                  alignSelf: "flex-start",
                  padding: "3px 10px", borderRadius: 999,
                  fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
                  color: "var(--brand-blue-deep)", textTransform: "uppercase",
                  background: "var(--bg-soft)", border: "1px solid var(--line-strong)",
                }}>{l.toUpperCase()}</span>
                <div style={fieldCol}>
                  <label style={labelStyle}>{ui.title}</label>
                  <input value={l === "es" ? form.title_es : form.title_en} onChange={(e) => patch(l === "es" ? "title_es" : "title_en", e.target.value)} style={inputStyle} />
                </div>
                <div style={fieldCol}>
                  <label style={labelStyle}>{ui.summary}</label>
                  <textarea value={l === "es" ? form.summary_es : form.summary_en} onChange={(e) => patch(l === "es" ? "summary_es" : "summary_en", e.target.value)} style={{ ...inputStyle, height: 84, resize: "vertical" as const, lineHeight: 1.5 }} />
                </div>
                <div style={fieldCol}>
                  <label style={labelStyle}>{ui.category}</label>
                  <input value={l === "es" ? form.category_es : form.category_en} onChange={(e) => patch(l === "es" ? "category_es" : "category_en", e.target.value)} style={inputStyle} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginTop: 22, paddingTop: 20, borderTop: "1px solid var(--line)", alignItems: "start" }}>
            <div style={fieldCol}>
              <label style={labelStyle}>{ui.date}</label>
              <input type="date" value={form.date} onChange={(e) => patch("date", e.target.value)} style={inputStyle} />
            </div>
            <div style={fieldCol}>
              <label style={labelStyle}>{ui.link}</label>
              <input value={form.link} onChange={(e) => patch("link", e.target.value)} placeholder="https://..." style={inputStyle} />
            </div>
            <div style={fieldCol}>
              <label style={labelStyle}>{ui.image}</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => fileRef.current?.click()} style={secondaryBtn}>
                  {uploading ? ui.uploading : preview || form.imagenId ? ui.change : ui.uploadImage}
                </button>
                {(preview || form.imagenId) && (
                  <div style={{ width: 60, height: 38, position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid var(--line)", background: "var(--bg-soft)", flexShrink: 0 }}>
                    <Image src={preview || `/api/images/${form.imagenId}`} alt="" fill style={{ objectFit: "cover" }} />
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
              </div>
              <span style={hintStyle}>{ui.imageHint}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <button onClick={save} style={primaryBtn}>{ui.save}</button>
            <button onClick={() => { setForm(null); setPreview(null); }} style={secondaryBtn}>{ui.cancel}</button>
            {form._id && (
              <button onClick={async () => { await del(form._id!); setForm(null); setPreview(null); }} style={{ ...dangerBtn, marginLeft: "auto" }}>
                {ui.delete}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Drag hint pill — only when not editing and there's something to sort */}
      {!form && items.length > 1 && (
        <div style={{ margin: "0 0 14px" }}>
          <div style={dragPill}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              {[0, 4, 8].map((y) => [0, 4, 8].map((x) => (
                <circle key={`${x}-${y}`} cx={3 + x} cy={3 + y} r="1.1" fill="currentColor" />
              )))}
            </svg>
            {ui.dragHint}
          </div>
        </div>
      )}

      {/* List */}
      {!form && items.length === 0 && <div style={emptyState}>{ui.emptyNews}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((n, i) => {
          if (n._id === form?._id) return null;
          const draggable = !form;
          return (
            <div
              key={n._id}
              draggable={draggable}
              onDragStart={draggable ? () => onDragStart(i) : undefined}
              onDragEnter={draggable ? () => onDragEnter(i) : undefined}
              onDragOver={draggable ? (e) => e.preventDefault() : undefined}
              onDragEnd={draggable ? onDragEnd : undefined}
              style={{
                ...cardStyle,
                display: "flex", gap: 14, alignItems: "center",
                cursor: draggable ? "grab" : "default",
                outline: dragOver === i ? "2px solid var(--brand-teal)" : "none",
                outlineOffset: 2,
                opacity: dragIndex.current === i ? 0.4 : 1,
                transition: "opacity 0.15s, outline 0.15s",
              }}
            >
              {draggable && (
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ color: "var(--ink-faint)", flexShrink: 0 }} aria-hidden="true">
                  {[0, 5, 10, 15].map((y) => [0, 6].map((x) => (
                    <circle key={`${x}-${y}`} cx={3 + x} cy={3 + y} r="1.3" fill="currentColor" />
                  )))}
                </svg>
              )}
              <div style={{ width: 80, height: 50, position: "relative", borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "var(--bg-soft)" }}>
                {n.imagenId
                  ? <Image src={`/api/images/${n.imagenId}`} alt="" fill style={{ objectFit: "cover" }} />
                  : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 10, color: "var(--ink-faint)" }}>{ui.noImg}</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {n.titulo[lang]}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--ink-faint)" }}>
                  {n.categoria[lang]} · {n.fecha ? new Date(n.fecha).toLocaleDateString(lang === "es" ? "es-AR" : "en-US") : "—"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => openEdit(n)} style={smallBtn}>{ui.edit}</button>
                <button onClick={() => del(n._id)} style={smallDangerBtn}>{ui.delete}</button>
              </div>
            </div>
          );
        })}
      </div>
      {confirmModal}
    </div>
  );
}

/* ─── shared styles ──────────────────────────────────────── */
const DANGER = "#c0392b";

const formBox: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: "24px 28px",
};
const formTitle: React.CSSProperties = {
  margin: "0 0 20px",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  color: "var(--ink)",
};
const fieldCol: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};
const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};
const hintStyle: React.CSSProperties = {
  fontSize: 11.5,
  color: "var(--ink-faint)",
  marginTop: 2,
  lineHeight: 1.4,
};
const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid var(--line-strong)",
  background: "var(--bg-soft)",
  fontSize: 14,
  color: "var(--ink)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  background: "var(--brand-blue-deep)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 13,
  lineHeight: 1.2,
  border: "1px solid var(--brand-blue-deep)",
  cursor: "pointer",
  transition: "opacity 0.15s var(--ease-smooth)",
};
const secondaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  background: "var(--bg-card)",
  color: "var(--ink)",
  fontWeight: 600,
  fontSize: 13,
  lineHeight: 1.2,
  border: "1px solid var(--line-strong)",
  cursor: "pointer",
  transition: "background 0.15s var(--ease-smooth), border-color 0.15s var(--ease-smooth)",
};
const dangerBtn: React.CSSProperties = {
  ...secondaryBtn,
  color: DANGER,
  borderColor: "color-mix(in oklab, #c0392b 30%, var(--line-strong))",
};
const smallBtn: React.CSSProperties = {
  ...secondaryBtn,
  padding: "7px 12px",
  fontSize: 12,
};
const smallDangerBtn: React.CSSProperties = {
  ...smallBtn,
  color: DANGER,
  borderColor: "color-mix(in oklab, #c0392b 30%, var(--line-strong))",
};
const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: 14,
};
const emptyState: React.CSSProperties = {
  padding: "40px 24px",
  textAlign: "center",
  borderRadius: 14,
  border: "1px dashed var(--line-strong)",
  background: "var(--bg-card)",
  fontSize: 13.5,
  color: "var(--ink-faint)",
  lineHeight: 1.5,
};
const dragPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 13px 6px 10px",
  borderRadius: 999,
  background: "var(--bg-card)",
  border: "1px solid var(--line-strong)",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--ink-soft)",
  letterSpacing: "0.02em",
};

/* ─── main page ──────────────────────────────────────────── */
export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"clients" | "news">("clients");
  const [lang, setLang] = useState<Lang>("es");
  const ui = uiText[lang];

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_pw");
    if (stored) setPw(stored);
  }, []);

  async function login() {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin_pw", input);
      setPw(input);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!pw) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-soft)",
      }}>
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--line)",
          borderRadius: 20, padding: "40px 40px 36px", width: 380, maxWidth: "100%",
          display: "flex", flexDirection: "column", gap: 8,
          boxShadow: "0 24px 50px -30px color-mix(in oklab, var(--brand-blue-deep) 35%, transparent)",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--brand-orange)",
          }}>IOT in Motion</span>
          <h1 style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            Admin Panel
          </h1>
          <p style={{ margin: "6px 0 20px", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
            Sign in to manage clients and news.
          </p>
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ ...inputStyle, padding: "11px 14px" }}
          />
          {error && <p style={{ margin: "8px 0 0", fontSize: 13, color: DANGER }}>Incorrect password</p>}
          <button onClick={login} style={{ ...primaryBtn, width: "100%", padding: "12px 20px", marginTop: 8 }}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-soft)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, marginBottom: 28,
        }}>
          <div>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--brand-orange)",
            }}>IOT in Motion</span>
            <h1 style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)" }}>Admin Panel</h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Language toggle */}
            <div style={{
              display: "flex", borderRadius: 8, overflow: "hidden",
              border: "1px solid var(--line-strong)",
            }}>
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: "9px 14px", border: "none", cursor: "pointer",
                    background: lang === l ? "var(--brand-blue-deep)" : "var(--bg-card)",
                    color: lang === l ? "#fff" : "var(--ink-soft)",
                    fontWeight: 700, fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >{l}</button>
              ))}
            </div>
            <span style={{ width: 1, alignSelf: "stretch", background: "var(--line)", margin: "2px 2px" }} aria-hidden="true" />
            <a href="/" style={{ ...secondaryBtn, textDecoration: "none" }}>{ui.backToSite}</a>
            <button onClick={() => { sessionStorage.removeItem("admin_pw"); setPw(""); }} style={secondaryBtn}>
              {ui.signOut}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 28, marginBottom: 28, borderBottom: "1px solid var(--line)" }}>
          {(["clients", "news"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "0 2px 12px", background: "none", border: "none",
                borderBottom: tab === t ? "2px solid var(--brand-teal)" : "2px solid transparent",
                marginBottom: -1,
                color: tab === t ? "var(--ink)" : "var(--ink-faint)",
                fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >{t === "clients" ? ui.clients : ui.news}</button>
          ))}
        </div>

        {tab === "clients" ? <ClientsTab pw={pw} lang={lang} /> : <NewsTab pw={pw} lang={lang} />}
      </div>
    </div>
  );
}
