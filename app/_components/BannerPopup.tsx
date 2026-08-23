"use client";
import { useEffect, useRef, useState } from "react";

const ENABLED = true;
const STORAGE_KEY = "iot.popup.expomedical2026";
const LINK = "https://www.linkedin.com/company/iot-in-motion/posts/?feedView=all";
const IMG = "/expomedical-2026.jpeg";
const ALT = "IOT in Motion en ExpoMedical 2026 — 23, 24 y 25 de septiembre, BA Ferial. Visitanos en el stand B14.";

export default function BannerPopup() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ENABLED) return;
    // Una vez por sesión: sessionStorage se limpia al cerrar el navegador.
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{
        position: "relative", width: "100%", maxWidth: 760,
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        animation: "popupIn 0.28s ease-out",
      }}>
        {/* Close */}
        <button
          onClick={close}
          aria-label="Cerrar"
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 2,
            width: 34, height: 34, borderRadius: "50%",
            border: "none", background: "rgba(0,0,0,0.55)",
            color: "white", fontSize: 20, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >×</button>

        {/* Banner clickeable → LinkedIn */}
        <a href={LINK} target="_blank" rel="noopener noreferrer" onClick={close} style={{ display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG} alt={ALT} style={{ display: "block", width: "100%", height: "auto" }} />
        </a>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
