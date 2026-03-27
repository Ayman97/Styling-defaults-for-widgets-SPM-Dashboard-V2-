import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ── Data domain ──────────────────────────────────────────────────────────────
const GAU_MIN = 20;
const GAU_MAX = 50;

const BANDS: { end: number; color: string }[] = [
  { end: 44, color: '#B7352D' }, // Red   20s–44s  (0 – 80%)
  { end: 47, color: '#E8983E' }, // Orange 44s–47s (80 – 90%)
  { end: 50, color: '#2D7D32' }, // Green  47s–50s (90 – 100%)
];

const THRESHOLDS = [20, 44, 47, 50];

// ── SVG geometry ─────────────────────────────────────────────────────────────
const W = 460;
const H = 260;
const CX = W / 2;        // horizontal centre
const CY = H - 24;       // pivot centre (near bottom)

const OUTER_R = 172;     // outer thin-arc radius
const OUTER_W = 11;      // outer arc stroke width
const INNER_R = 128;     // inner thick-arc radius
const INNER_W = 54;      // inner arc stroke width
const LABEL_R = OUTER_R + 26; // label placement radius
const NEEDLE_LEN = 114;  // needle shaft length from pivot
const GAP_FRAC = 1.6 / 180; // tiny gap between outer segments (fraction)

// ── Pure math helpers ─────────────────────────────────────────────────────────

/** Normalise a raw value into [0, 1] */
const valToFrac = (v: number): number =>
  Math.max(0, Math.min(1, (v - GAU_MIN) / (GAU_MAX - GAU_MIN)));

/** Fraction → radian: 0 maps to π (left), 1 maps to 0 (right) */
const fracToRad = (f: number): number => Math.PI * (1 - f);

/** Polar → Cartesian in SVG screen space (y axis inverted) */
const ptFromRad = (r: number, rad: number): { x: number; y: number } => ({
  x: CX + r * Math.cos(rad),
  y: CY - r * Math.sin(rad),
});

/**
 * Build an SVG arc path (stroke-based) along a circle of radius `r`,
 * spanning from fraction f1 to fraction f2 (both in [0, 1]).
 *
 * Arc command: A rx ry x-rot large-arc sweep-flag ex ey
 *   sweep-flag = 0 → counter-clockwise in SVG screen space
 *               (traces the top half of the circle ✓)
 *   large-arc  = 1 when span > half-circle
 */
const arcPath = (r: number, f1: number, f2: number): string => {
  const a1 = fracToRad(f1);
  const a2 = fracToRad(f2);
  const p1 = ptFromRad(r, a1);
  const p2 = ptFromRad(r, a2);
  const largeArc = f2 - f1 > 0.5 ? 1 : 0;
  return (
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ` +
    `A ${r} ${r} 0 ${largeArc} 0 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  );
};

/** Pick the band colour for a given normalised fraction */
const getBandColor = (frac: number): string => {
  for (const band of BANDS) {
    if (frac <= valToFrac(band.end) + 0.001) return band.color;
  }
  return BANDS[BANDS.length - 1].color;
};

// ── Pre-compute outer arc segments (with tiny inter-segment gaps) ──────────
const outerSegments = BANDS.map((band, i) => {
  const prevFrac = i === 0 ? 0 : valToFrac(BANDS[i - 1].end);
  const thisFrac = valToFrac(band.end);
  return {
    startFrac: prevFrac + (i > 0 ? GAP_FRAC : 0),
    endFrac: thisFrac - (i < BANDS.length - 1 ? GAP_FRAC : 0),
    color: band.color,
  };
});

// ── Component ─────────────────────────────────────────────────────────────────
interface GaugeChartProps {
  initialValue?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ initialValue = 48 }) => {
  const [sliderVal, setSliderVal] = useState<number>(initialValue);

  const frac = valToFrac(sliderVal);
  const bandColor = getBandColor(frac);

  // ── Needle rotation via spring ──
  // frac=0 → -90° (pointing left), frac=0.5 → 0° (pointing up), frac=1 → 90° (pointing right)
  const targetRot = (frac - 0.5) * 180;
  const needleRot = useSpring(targetRot, {
    stiffness: 88,
    damping: 18,
    mass: 1.05,
  });

  useEffect(() => {
    needleRot.set(targetRot);
  }, [targetRot, needleRot]);

  // ── Gradient IDs (static; re-render provides new stopColor) ──
  const gradId = 'gaugeProg';
  const sheenId = 'gaugeSheen';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: FONT,
        userSelect: 'none',
      }}
    >
      {/* ─────────────────────── SVG Canvas ─────────────────────────────── */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/*
           * Linear gradient along the gauge sweep direction (left → right).
           * Creates the "fade-in from transparent" look on the progress fill.
           */}
          <linearGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            x1={CX - INNER_R}
            y1={CY}
            x2={CX + INNER_R}
            y2={CY}
          >
            <stop offset="0%"   stopColor={bandColor} stopOpacity="0.06" />
            <stop offset="42%"  stopColor={bandColor} stopOpacity="0.52" />
            <stop offset="80%"  stopColor={bandColor} stopOpacity="0.78" />
            <stop offset="100%" stopColor={bandColor} stopOpacity="0.90" />
          </linearGradient>

          {/*
           * Radial sheen: a white highlight centred at the top of the inner arc,
           * giving the glossy / luminous centre look.
           */}
          <radialGradient
            id={sheenId}
            gradientUnits="userSpaceOnUse"
            cx={CX}
            cy={CY - INNER_R * 0.65}
            r={INNER_R * 1.05}
          >
            <stop offset="0%"   stopColor="white" stopOpacity="0.52" />
            <stop offset="55%"  stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── 1. Inner thick arc — light grey background track ── */}
        <path
          d={arcPath(INNER_R, 0, 1)}
          fill="none"
          stroke="#ECEDEE"
          strokeWidth={INNER_W}
          strokeLinecap="butt"
        />

        {/* ── 2. Inner thick arc — gradient progress fill ── */}
        {frac > 0.004 && (
          <path
            d={arcPath(INNER_R, 0, frac)}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={INNER_W}
            strokeLinecap="butt"
          />
        )}

        {/* ── 3. Inner thick arc — white sheen overlay ── */}
        {frac > 0.004 && (
          <path
            d={arcPath(INNER_R, 0, frac)}
            fill="none"
            stroke={`url(#${sheenId})`}
            strokeWidth={INNER_W}
            strokeLinecap="butt"
          />
        )}

        {/* ── 4. Outer thin arc — coloured threshold segments ── */}
        {outerSegments.map((seg, i) => (
          <path
            key={i}
            d={arcPath(OUTER_R, seg.startFrac, seg.endFrac)}
            fill="none"
            stroke={seg.color}
            strokeWidth={OUTER_W}
            strokeLinecap="butt"
          />
        ))}

        {/* ── 5. Boundary labels ── */}
        {THRESHOLDS.map((val) => {
          const f = valToFrac(val);
          const angle = fracToRad(f);
          const lp = ptFromRad(LABEL_R, angle);

          /*
           * Tangent rotation: text baseline follows the arc tangent so labels
           * read naturally along the gauge curve.
           * tangentDeg = 180·f − 90
           *   f=0  → −90° (vertical, reads bottom-to-top at left end)
           *   f=1  → +90° (vertical, reads top-to-bottom at right end)
           *   f=0.8→ +54° (slightly diagonal at upper-right)
           */
          const tangentDeg = 180 * f - 90;
          const isLeftEnd = f <= 0.02;
          const isRightEnd = f >= 0.98;
          const isEndLabel = isLeftEnd || isRightEnd;

          // Positioning tweaks
          let dx = 0;
          let dy = 0;
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';

          if (isLeftEnd) {
            dx = 5;
            dy = 7;
            textAnchor = 'middle';
          } else if (isRightEnd) {
            dx = -5;
            dy = 7;
            textAnchor = 'middle';
          } else if (f < 0.5) {
            // 44s — upper quadrant, left side (but actually upper-right of arc)
            textAnchor = 'end';
            dx = -3;
            dy = -6;
          } else {
            // 47s — upper quadrant, right side
            textAnchor = 'start';
            dx = 3;
            dy = -6;
          }

          const lx = lp.x + dx;
          const ly = lp.y + dy;

          return (
            <text
              key={val}
              x={lx.toFixed(2)}
              y={ly.toFixed(2)}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fontSize={12.5}
              fill="#A0AEC0"
              fontFamily={FONT}
              fontWeight="700"
              transform={
                isEndLabel
                  ? `rotate(${tangentDeg.toFixed(1)}, ${lx.toFixed(1)}, ${ly.toFixed(1)})`
                  : undefined
              }
            >
              {val}s
            </text>
          );
        })}

        {/* ── 6. Needle — animated with Framer Motion spring ── */}
        {/*
         * The needle group is drawn pointing straight up (negative-y direction).
         * We rotate the whole group around the pivot centre (CX, CY).
         * useSpring drives the rotation so it springs smoothly to each new value.
         */}
        <motion.g
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            rotate: needleRot,
          }}
        >
          {/* Needle shaft */}
          <line
            x1={CX}
            y1={CY + 11}      // tiny tail below pivot
            x2={CX}
            y2={CY - NEEDLE_LEN}
            stroke="#111827"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ── 7. Pivot hub (rendered on top of the needle base) ── */}
        <circle
          cx={CX}
          cy={CY}
          r={9.5}
          fill="#374151"
          stroke="white"
          strokeWidth="2.5"
        />
        {/* Inner dot — slightly lighter centre circle */}
        <circle cx={CX} cy={CY} r={4} fill="#9CA3AF" />
      </svg>

      {/* ── Value readout ── */}
      <div
        style={{
          fontSize: '27px',
          fontWeight: '700',
          color: '#4E4749',
          fontFamily: FONT,
          marginTop: '-6px',
          letterSpacing: '-0.5px',
        }}
      >
        {sliderVal.toFixed(1)}s
      </div>

      {/* ── Series label ── */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#9CA3AF',
          fontFamily: FONT,
          marginTop: '2px',
        }}
      >
        Series A
      </div>

      {/* ── Interactive slider ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '16px',
        }}
      >
        <span style={{ fontSize: '11px', color: '#CBD5E0', fontFamily: FONT, minWidth: 28, textAlign: 'right' }}>
          {GAU_MIN}s
        </span>
        <div style={{ position: 'relative', width: 240 }}>
          <input
            type="range"
            min={GAU_MIN}
            max={GAU_MAX}
            step="0.5"
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
              accentColor: bandColor,
              height: '4px',
            }}
          />
        </div>
        <span style={{ fontSize: '11px', color: '#CBD5E0', fontFamily: FONT, minWidth: 28 }}>
          {GAU_MAX}s
        </span>
      </div>

      {/* ── Current band indicator ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '8px',
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: bandColor,
            transition: 'background-color 0.3s ease',
          }}
        />
        <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: FONT }}>
          {bandColor === '#B7352D' ? 'Below threshold' : bandColor === '#E8983E' ? 'Near threshold' : 'Within target'}
        </span>
      </div>
    </div>
  );
};