"use client";
import { useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";
import IotScene from "./IotScene";

function boldify(text: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  const re = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={m.index} style={{ color: "var(--brand-blue-deep)", fontWeight: 600 }}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function Projects() {
  const { t } = useLang();
  const ref = useReveal();
  const cats = t.projects.categories;
  const [active, setActive] = useState(cats[0].id);
  const cur = cats.find((c) => c.id === active)!;

  return (
    <section id="projects" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">{t.projects.eyebrow}</span>
            <h2 className="section-title">{t.projects.title}</h2>
          </div>
          <p className="section-sub">{t.projects.sub}</p>
        </div>

        <div className="reveal sol-layout-responsive" style={{
          display: "grid", gridTemplateColumns: "280px 1fr", gap: 28, alignItems: "start",
        }}>
          {/* Sidebar */}
          <aside style={{
            position: "sticky", top: 92,
            background: "var(--bg-card)", border: "1px solid var(--line)",
            borderRadius: 20, padding: "24px 20px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--ink-faint)", marginBottom: 6,
            }}>
              {t.projects.side_h.toUpperCase()}
            </div>
            <h3 style={{
              fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em",
              margin: "0 0 18px", color: "var(--brand-blue-deep)", lineHeight: 1.1,
            }}>
              <em style={{ fontStyle: "normal", color: "var(--brand-blue-deep)", fontWeight: 600 }}>{t.projects.side_b}</em>
            </h3>
            <div style={{ height: 1, background: "var(--line)", marginBottom: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cats.map((c) => (
                <button key={c.id} onClick={() => setActive(c.id)} style={{
                  textAlign: "left", padding: "14px 18px",
                  border: `1px solid ${active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 24%, var(--bg-card))" : "var(--line)"}`,
                  borderRadius: 12,
                  background: active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 6%, var(--bg-card))" : "transparent",
                  color: active === c.id ? "var(--brand-blue-deep)" : "var(--ink)",
                  fontSize: 14.5, fontWeight: 500,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "all 0.25s var(--ease-smooth)", cursor: "pointer",
                }}>
                  <span>{c.t}</span>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: active === c.id ? "var(--brand-blue-deep)" : "var(--bg-soft)",
                    color: active === c.id ? "white" : "var(--brand-blue-deep)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                    transition: "all 0.25s var(--ease-smooth)",
                  }}>›</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Cases */}
          <div key={active} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{cur.t.slice(0, 2).toUpperCase()}</span>
              <div>
                <span style={{
                  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--ink-faint)", display: "block", marginBottom: 4,
                }}>{t.projects.selectedLabel}</span>
                <span style={{ fontSize: 22, fontWeight: 600, color: "var(--brand-blue-deep)", letterSpacing: "-0.015em" }}>
                  {cur.t}
                </span>
              </div>
            </div>

            {cur.cases.map((cs) => (
              <article key={cs.code} style={{
                background: "var(--bg-card)", border: "1px solid var(--line)",
                borderRadius: 20, padding: "32px 36px",
                display: "grid", gridTemplateColumns: "1fr 300px",
                gap: 36, alignItems: "center",
                transition: "border-color 0.25s var(--ease-smooth)",
              }}>
                <div>
                  <span style={{
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "var(--brand-blue-deep)", fontWeight: 900,
                    WebkitTextStroke: "0.4px var(--brand-blue-deep)",
                    marginBottom: 14, display: "block",
                  }}>{cs.h}</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    background: "var(--bg-soft)", border: "1px solid var(--line)",
                    borderRadius: 999, padding: "6px 14px", fontSize: 13, marginBottom: 18,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                      fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "var(--ink-faint)",
                    }}>{t.projects.caseLabel}</span>
                    <span style={{ fontWeight: 600, color: "var(--ink)" }}>{cs.c}</span>
                  </span>
                  <div>
                    {cs.body.map((b, i) => (
                      <p key={i} style={{
                        fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7,
                        margin: "0 0 14px",
                      }}>
                        {boldify(b.text)}
                      </p>
                    ))}
                  </div>
                </div>
                <IotScene code={cs.code} ratio="1 / 1.05" />
              </article>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 880px) {
          .sol-layout-responsive { grid-template-columns: 1fr !important; }
          .sol-layout-responsive aside { position: static !important; }
          article { grid-template-columns: 1fr !important; padding: 24px !important; }
        }
      ` }} />
    </section>
  );
}
