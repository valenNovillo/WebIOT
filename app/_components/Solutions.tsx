"use client";
import { useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";
import PdfModal from "./PdfModal";
import IotScene from "./IotScene";

interface PdfTarget { pdf: string; solucion: string; categoria: string; }

export default function Solutions() {
  const { t } = useLang();
  const ref = useReveal();
  const cats = t.solutions.categories;
  const [active, setActive] = useState(cats[0].id);
  const cur = cats.find((c) => c.id === active)!;
  const [pdfTarget, setPdfTarget] = useState<PdfTarget | null>(null);;

  return (
    <section id="solutions" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">{t.solutions.eyebrow}</span>
            <h2 className="section-title">{t.solutions.title}</h2>
          </div>
          <p className="section-sub">{t.solutions.sub}</p>
        </div>

        <div className="reveal sol-layout-responsive" style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 28,
          alignItems: "start",
        }}>
          {/* Sidebar */}
          <aside style={{
            position: "sticky", top: 92,
            background: "var(--bg-card)",
            border: "1px solid var(--line)",
            borderRadius: 20,
            padding: "24px 20px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--ink-faint)", marginBottom: 6,
            }}>
              {t.solutions.side_h.toUpperCase()}
            </div>
            <h3 style={{
              fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em",
              margin: "0 0 18px", color: "var(--brand-blue-deep)", lineHeight: 1.1,
            }}>
              <em style={{ fontStyle: "normal", color: "var(--brand-blue-deep)", fontWeight: 600 }}>{t.solutions.side_b}</em>
            </h3>
            <div style={{ height: 1, background: "var(--line)", marginBottom: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  style={{
                    textAlign: "left",
                    padding: "14px 18px",
                    border: `1px solid ${active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 24%, var(--bg-card))" : "var(--line)"}`,
                    borderRadius: 12,
                    background: active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 6%, var(--bg-card))" : "transparent",
                    color: active === c.id ? "var(--brand-blue-deep)" : "var(--ink)",
                    fontSize: 14.5, fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.25s var(--ease-smooth)",
                    cursor: "pointer",
                  }}
                >
                  <span>{c.t}</span>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: active === c.id ? "var(--brand-blue-deep)" : "var(--bg-soft)",
                    color: active === c.id ? "white" : "var(--brand-blue-deep)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11,
                    transition: "all 0.25s var(--ease-smooth)",
                  }}>›</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Detail */}
          <div key={active} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Header */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--line)",
              borderRadius: 18, padding: "18px 24px",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{
                width: 40, height: 40, borderRadius: 10,
                background: "color-mix(in oklab, var(--brand-blue-deep) 10%, var(--bg-card))",
                color: "var(--brand-blue-deep)",
                fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>{cur.short}</span>
              <div>
                <span style={{
                  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--ink-faint)", display: "block", marginBottom: 4,
                }}>{t.solutions.selectedLabel}</span>
                <span style={{
                  fontSize: 22, fontWeight: 600, color: "var(--brand-blue-deep)",
                  letterSpacing: "-0.015em", lineHeight: 1.15,
                }}>{cur.t}</span>
              </div>
            </div>

            {/* Items */}
            {cur.items.map((item, i) => (
              <article key={item.id} style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 240px" : "240px 1fr",
                gap: 32,
                background: "var(--bg-card)",
                border: "1px solid var(--line)",
                borderRadius: 18,
                padding: "28px 28px 24px",
                alignItems: "center",
                transition: "all 0.25s var(--ease-smooth)",
              }}>
                <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                  <h4 style={{
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "var(--brand-blue-deep)", margin: "0 0 14px", fontWeight: 900,
                    WebkitTextStroke: "0.4px var(--brand-blue-deep)",
                  }}>{item.t}</h4>
                  <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 18px" }}>
                    {item.d}
                  </p>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 18,
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                  }}>
                    <a href="#contact" style={{ color: "var(--brand-blue-deep)", fontWeight: 900, WebkitTextStroke: "0.4px var(--brand-blue-deep)" }}>
                      {t.solutions.moreInfo}
                    </a>
                    {item.pdf && (
                      <button
                        onClick={() => setPdfTarget({ pdf: item.pdf!, solucion: item.t, categoria: cur.t })}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--brand-orange)", fontWeight: 900, textDecoration: "underline", textUnderlineOffset: 4, WebkitTextStroke: "0.4px var(--brand-orange)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                        {t.solutions.downloadPdf}
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                  <IotScene code={item.id} ratio="4 / 3" radius={14} />
                </div>
              </article>
            ))}

            {/* Other solutions */}
            {cur.other && cur.other.length > 0 && (
              <div style={{
                background: "var(--bg-card)",
                border: "1px dashed var(--line-strong)",
                borderRadius: 18, padding: "26px 28px",
              }}>
                <h4 style={{
                  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--brand-blue-deep)", margin: "0 0 14px", fontWeight: 600,
                }}>{t.solutions.otherTitle}</h4>
                <ul style={{
                  listStyle: "none", padding: 0, margin: 0,
                  display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 24px",
                }}>
                  {cur.other.map((o, i) => (
                    <li key={i} style={{ fontSize: 14, color: "var(--ink-soft)", paddingLeft: 18, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--brand-orange)" }}>—</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {pdfTarget && (
        <PdfModal
          pdf={pdfTarget.pdf}
          solucion={pdfTarget.solucion}
          categoria={pdfTarget.categoria}
          onClose={() => setPdfTarget(null)}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 880px) {
          .sol-layout-responsive { grid-template-columns: 1fr !important; }
          .sol-layout-responsive aside { position: static !important; }
        }
        @media (max-width: 720px) {
          .sol-layout-responsive article { grid-template-columns: 1fr !important; }
          .sol-layout-responsive article > div { order: unset !important; }
        }
      ` }} />
    </section>
  );
}
