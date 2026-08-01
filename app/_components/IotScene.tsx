import React from "react";

/**
 * Sistema de ilustraciones vectoriales para las cards de Proyectos y Soluciones.
 * Reemplaza las fotos de stock de baja calidad por mini-escenas técnicas
 * (dispositivo + telemetría) construidas en SVG: nítidas a cualquier tamaño,
 * mismo lenguaje visual entre sí, y editables desde la paleta de marca.
 *
 * Paleta: trazo teal (--brand-teal), acento naranja con cuentagotas
 * (--brand-orange), sobre el marco azul profundo con grilla.
 */

const TEAL_FILL_SOFT = "rgba(130,194,201,0.06)";
const TEAL_FILL = "rgba(130,194,201,0.12)";
const ORANGE_FILL = "rgba(227,76,44,0.16)";
const MONO = "var(--font-geist-mono, ui-monospace, monospace)";

const readoutStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontWeight: 600,
};

/* ----------------------------- Escenas ----------------------------- */

// Tránsito — contador de vehículos con poste sensor y lectura en vivo.
function traffic() {
  return (
    <>
      <path d="M44 212 H216" strokeWidth={1.5} opacity={0.55} />
      <path d="M70 212 h14 M120 212 h14 M170 212 h14" strokeWidth={2} opacity={0.35} />
      <rect x={92} y={190} width={34} height={20} rx={5} fill={TEAL_FILL} />
      <path d="M182 210 L182 96" />
      <path d="M182 100 H156" />
      <rect x={128} y={90} width={26} height={18} rx={3} fill={TEAL_FILL} />
      <path d="M118 92 a13 13 0 00-13 8" opacity={0.7} />
      <path d="M112 84 a23 23 0 00-23 14" opacity={0.4} />
      <rect x={186} y={150} width={66} height={30} rx={6} fill={TEAL_FILL_SOFT} strokeWidth={1.1} />
      <path d="M194 165 h8 M198 160.5 v9" stroke="var(--brand-orange)" strokeWidth={1.6} />
      <text x={228} y={169} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={10.5} style={readoutStyle}>1,284/h</text>
    </>
  );
}

// Nivel hídrico — tanque con agua clipeada dentro y regla lateral.
function water(code: string) {
  const clip = `tank-${code}`;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <path d="M78 80 h104 v130 a52 14 0 01-104 0 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <path d="M70 150 q14 -9 28 0 t28 0 t28 0 t28 0 V230 H70 Z" fill="rgba(130,194,201,0.20)" stroke="none" />
        <path d="M70 150 q14 -9 28 0 t28 0 t28 0 t28 0" stroke="var(--brand-teal)" strokeWidth={1.5} />
      </g>
      <ellipse cx={130} cy={80} rx={52} ry={14} />
      <path d="M78 80 V210 a52 14 0 00104 0 V80" />
      <rect x={115} y={50} width={30} height={16} rx={3} fill={TEAL_FILL} />
      <path d="M120 66 h20" strokeWidth={2.2} />
      <path d="M130 66 L130 146" strokeDasharray="4 5" opacity={0.5} />
      <path d="M206 96 L206 202" />
      <path d="M206 108 h7 M206 132 h5 M206 150 h7 M206 174 h5 M206 194 h7" />
      <circle cx={206} cy={150} r={4.5} fill="var(--brand-orange)" stroke="none" />
    </>
  );
}

// Cardíaco — monitor con ECG, corazón y BPM.
function cardiac() {
  return (
    <>
      <rect x={62} y={98} width={136} height={86} rx={10} fill="rgba(130,194,201,0.05)" />
      <path d="M76 142 h26 l8 -20 l12 40 l10 -28 l7 8 h33" stroke="var(--brand-teal)" strokeWidth={2.2} />
      <path d="M168 96 c0 -11 16 -11 16 2 c0 8 -16 18 -16 18 c0 0 -16 -10 -16 -18 c0 -13 16 -13 16 -2 z" fill={ORANGE_FILL} stroke="var(--brand-orange)" strokeWidth={1.3} />
      <text x={130} y={212} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={15} style={readoutStyle}>72 BPM</text>
    </>
  );
}

// Energía — panel con gauge de consumo.
function energy() {
  return (
    <>
      <rect x={64} y={88} width={132} height={100} rx={10} fill="rgba(130,194,201,0.05)" />
      <path d="M96 152 a34 34 0 0168 0" strokeWidth={2} />
      <path d="M96 152 a34 34 0 017 -20" stroke="var(--brand-orange)" strokeWidth={3} />
      <path d="M130 152 L151 128" stroke="var(--brand-orange)" strokeWidth={2} />
      <circle cx={130} cy={152} r={4} fill="var(--brand-teal)" stroke="none" />
      <text x={130} y={178} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={13} style={readoutStyle}>kWh</text>
    </>
  );
}

// Ambiental — termómetro + humedad, control de precisión.
function env() {
  return (
    <>
      <rect x={96} y={72} width={16} height={78} rx={8} fill="rgba(130,194,201,0.06)" />
      <circle cx={104} cy={158} r={14} fill={ORANGE_FILL} stroke="var(--brand-orange)" strokeWidth={1.6} />
      <path d="M104 152 V92" stroke="var(--brand-orange)" strokeWidth={4} />
      <path d="M116 84 h8 M116 100 h6 M116 116 h8 M116 132 h6" strokeWidth={1.4} opacity={0.6} />
      <path d="M158 92 c-11 15 -15 21 -15 29 a15 15 0 0030 0 c0 -8 -4 -14 -15 -29 z" fill={TEAL_FILL} />
      <path d="M158 116 a8 8 0 01-6 6" strokeWidth={1.4} opacity={0.7} />
      <text x={130} y={202} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={12} style={readoutStyle}>22°C · 55%</text>
    </>
  );
}

// Medición eléctrica — medidor digital SCADA con display y fases.
function meter() {
  return (
    <>
      <rect x={70} y={70} width={120} height={124} rx={12} fill="rgba(130,194,201,0.05)" />
      <rect x={86} y={86} width={88} height={30} rx={4} fill={TEAL_FILL} />
      <text x={130} y={107} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={15} letterSpacing="3" style={readoutStyle}>02458</text>
      <path d="M124 128 l-11 22 h9 l-7 18 20 -26 h-9 l6 -14 z" fill={ORANGE_FILL} stroke="var(--brand-orange)" strokeWidth={1.2} />
      <path d="M146 150 h26 M146 164 h26 M146 178 h26" strokeWidth={3} opacity={0.45} />
    </>
  );
}

// Cámaras — CCTV con cono de visión y REC.
function camera() {
  return (
    <>
      <path d="M74 84 h10" />
      <rect x={84} y={78} width={42} height={22} rx={5} fill={TEAL_FILL} />
      <circle cx={116} cy={89} r={5} />
      <path d="M126 82 l10 -4" />
      <path d="M118 100 L188 152 M120 104 L142 170" strokeDasharray="4 6" opacity={0.45} />
      <path d="M150 178 l24 -18 24 18" />
      <rect x={158} y={178} width={32} height={30} fill="rgba(130,194,201,0.05)" />
      <rect x={170} y={190} width={8} height={18} />
      <circle cx={92} cy={112} r={4} fill="var(--brand-orange)" stroke="none" />
      <text x={104} y={116} fill="var(--brand-teal)" stroke="none" fontSize={11} style={readoutStyle}>REC</text>
    </>
  );
}

// Alerta comunitaria — botón de pánico con ondas de alerta.
function alarm() {
  return (
    <>
      <path d="M160 108 a44 44 0 010 62" opacity={0.4} />
      <path d="M174 96 a60 60 0 010 86" opacity={0.25} />
      <circle cx={118} cy={140} r={34} fill="rgba(130,194,201,0.05)" />
      <circle cx={118} cy={140} r={20} fill={ORANGE_FILL} stroke="var(--brand-orange)" strokeWidth={1.8} />
      <path d="M118 130 v12" stroke="var(--brand-orange)" strokeWidth={2.6} />
      <path d="M118 149 v0.5" stroke="var(--brand-orange)" strokeWidth={2.6} />
      <text x={118} y={204} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={12} style={readoutStyle}>ALERTA</text>
    </>
  );
}

// Red LoRaWAN — gateway central con nodos conectados.
function lorawan() {
  return (
    <>
      <path d="M130 132 L82 92 M130 132 L188 94 M130 132 L80 182 M130 132 L190 180" opacity={0.35} />
      <circle cx={82} cy={92} r={7} fill={TEAL_FILL} />
      <circle cx={188} cy={94} r={7} fill={TEAL_FILL} />
      <circle cx={80} cy={182} r={7} fill={TEAL_FILL} />
      <circle cx={190} cy={180} r={7} fill={TEAL_FILL} />
      <rect x={112} y={120} width={36} height={26} rx={5} fill="rgba(130,194,201,0.15)" />
      <path d="M130 120 V104" />
      <circle cx={130} cy={100} r={3.5} fill="var(--brand-orange)" stroke="none" />
      <path d="M139 100 a13 13 0 016 9" opacity={0.6} />
      <path d="M121 100 a13 13 0 00-6 9" opacity={0.6} />
      <text x={130} y={182} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={11} style={readoutStyle}>30K NODES</text>
    </>
  );
}

// Estacionamiento — plaza con sensor de ocupación.
function parking() {
  return (
    <>
      <rect x={80} y={92} width={100} height={78} rx={6} fill="rgba(130,194,201,0.05)" strokeDasharray="6 6" opacity={0.85} />
      <rect x={104} y={106} width={52} height={40} rx={9} fill={TEAL_FILL} />
      <rect x={112} y={114} width={36} height={11} rx={3} opacity={0.5} />
      <circle cx={130} cy={162} r={4} fill="var(--brand-orange)" stroke="none" />
      <text x={130} y={200} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={12} style={readoutStyle}>P · OCUPADO</text>
    </>
  );
}

// Estación meteorológica — anemómetro, sol y lectura.
function climate() {
  return (
    <>
      <path d="M130 202 V122" />
      <path d="M108 122 h44" />
      <circle cx={108} cy={122} r={5} fill={TEAL_FILL} />
      <circle cx={152} cy={122} r={5} fill={TEAL_FILL} />
      <circle cx={130} cy={122} r={3} fill="var(--brand-teal)" stroke="none" />
      <circle cx={104} cy={82} r={12} fill={ORANGE_FILL} stroke="var(--brand-orange)" strokeWidth={1.4} />
      <path d="M104 62 v6 M104 96 v6 M84 82 h-6 M124 82 h6 M90 68 l4 4 M118 96 l-4 -4 M90 96 l4 -4 M118 68 l-4 4" stroke="var(--brand-orange)" strokeWidth={1.3} opacity={0.8} />
      <path d="M150 96 a12 12 0 0122 5 8 8 0 01-2 15 h-20 a10 10 0 010 -20 z" fill={TEAL_FILL} />
      <text x={130} y={224} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={12} style={readoutStyle}>22°C</text>
    </>
  );
}

// Gases — sensor de monóxido/metano con moléculas y PPM.
function gas() {
  return (
    <>
      <circle cx={110} cy={64} r={3} opacity={0.6} />
      <circle cx={132} cy={54} r={3} opacity={0.5} />
      <circle cx={152} cy={66} r={3} opacity={0.6} />
      <rect x={92} y={84} width={76} height={92} rx={10} fill="rgba(130,194,201,0.06)" />
      <path d="M104 100 h52 M104 110 h52 M104 120 h52" opacity={0.45} />
      <circle cx={130} cy={148} r={13} />
      <circle cx={130} cy={148} r={4} fill="var(--brand-orange)" stroke="none" />
      <text x={130} y={200} fill="var(--brand-teal)" stroke="none" textAnchor="middle" fontSize={12} style={readoutStyle}>340 PPM</text>
    </>
  );
}

/* --------------------------- Registro ------------------------------ */

type SceneFn = (code: string) => React.ReactNode;

const SCENES: Record<string, SceneFn> = {
  traffic, water, cardiac, energy, env, meter,
  camera, alarm, lorawan, parking, climate, gas,
};

// code (proyecto o solución) -> { alert, scene }
const CODE_MAP: Record<string, { alert: string; scene: string }> = {
  // Proyectos
  "tigre-trafico": { alert: "TRÁFICO · LIVE", scene: "traffic" },
  "tigre-hidrico": { alert: "NIVEL · 4.2M", scene: "water" },
  "omint-codeblue": { alert: "CODE BLUE", scene: "cardiac" },
  "omint-env": { alert: "TEMP · OK", scene: "env" },
  renault: { alert: "SUB-METER", scene: "meter" },
  bromteck: { alert: "ENERGÍA", scene: "energy" },
  "lomas-escuelas": { alert: "ESCUELAS", scene: "camera" },
  ituzaingo: { alert: "COMUNIDAD", scene: "alarm" },
  // Soluciones
  lorawan: { alert: "30K NODES", scene: "lorawan" },
  traffic: { alert: "TRÁFICO", scene: "traffic" },
  levels: { alert: "NIVEL", scene: "water" },
  parking: { alert: "PARK · LIVE", scene: "parking" },
  climate: { alert: "CLIMA", scene: "climate" },
  gas: { alert: "GAS · PPM", scene: "gas" },
  cardiac: { alert: "CODE BLUE", scene: "cardiac" },
  optimize: { alert: "ENERGÍA", scene: "energy" },
  "gas-sec": { alert: "CCTV", scene: "camera" },
};

/* ---------------------------- Componente --------------------------- */

export default function IotScene({
  code,
  ratio = "1 / 1.05",
  radius = 16,
}: {
  code: string;
  ratio?: string;
  radius?: number;
}) {
  const entry = CODE_MAP[code];
  const alert = entry?.alert ?? code.toUpperCase();
  const scene = SCENES[entry?.scene ?? ""] ?? energy;

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        borderRadius: radius,
        overflow: "hidden",
        background: "linear-gradient(140deg, var(--brand-blue-deep), oklch(0.25 0.05 280))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(130,194,201,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(130,194,201,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          zIndex: 2,
          background: "var(--brand-orange)",
          color: "white",
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.14em",
          padding: "5px 9px",
          borderRadius: 6,
          textTransform: "uppercase",
        }}
      >
        {alert}
      </span>
      <svg
        viewBox="0 0 260 273"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        fill="none"
        stroke="var(--brand-teal)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {scene(code)}
      </svg>
      <span
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          zIndex: 2,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
        }}
      >
        {code.toUpperCase()}
      </span>
    </div>
  );
}
