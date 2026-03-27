import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants (extracted exactly from style panel image) ───────────────
// Basic styles — Squares
const CELL_W          = 140;
const CELL_H          = 48;
const CELL_GAP        = 8;
const SQUARE_COLOR    = '#CBD5E1';   // neutral / disabled default color
const SQUARE_OPACITY  = 100;         // %
const USED_PALETTE    = 'Status';
const LABEL_FONT      = 'Auto';
const LABEL_BOLD      = true;
const LABEL_COLOR     = '#FFFFFF';
const LABEL_SIZE      = 12;
const BORDER_ON       = false;       // Disabled
const BORDER_COLOR    = '#E2E8F0';
const BORDER_WIDTH    = 0;
const CORNERS         = 8;

// RAG status colors (from style panel — RAG status colors table)
const RAG_RED     = '#DC2626';
const RAG_AMBER   = '#F59E0B';
const RAG_GREEN   = '#16A34A';
const RAG_NEUTRAL = '#CBD5E1';   // Neutral / No data

// Advanced styles — Axes (enabled)
const AXES_ON             = true;
const AXES_AS_PCT         = false;
const AXIS_LINE_STYLE_VAL = 'Solid';
const AXIS_LINE_COLOR     = '#E5E7EB';
const AXIS_LINE_WIDTH_VAL = 1;

// Axes / Y-Axis
const Y_TITLE   = true;
const Y_LINE    = false;
const Y_LABELS  = true;
const Y_BOLD    = false;
const Y_COLOR   = '#334155';
const Y_SIZE    = 14;
const Y_ROTATE  = 0;

// Axes / X-Axis
const X_TITLE   = true;
const X_LINE    = false;
const X_LABELS  = true;
const X_BOLD    = false;
const X_COLOR   = '#334155';
const X_SIZE    = 14;
const X_ROTATE  = 0;

// Data Labels (enabled)
const DL_ON       = true;
const DL_BG       = 'Transparent';
const DL_BG_OPC   = 0;               // %
const DL_BOLD_V   = true;
const DL_COLOR    = '#FFFFFF';
const DL_SIZE     = 12;
const DL_MISSING  = '–';
const DL_DECIMALS = 1;
const DL_SHORT    = true;
const DL_AS_PCT   = false;

// ─── RAG thresholds ───────────────────────────────────────────────────────────
// Assign RAG status based on budget value (in K):
//   Red    = < 250K  (below target)
//   Amber  = 250–499K (approaching target)
//   Green  = ≥ 500K  (on/above target)
//   Neutral = no data → #CBD5E1
const T_RED_MAX   = 249;   // < 250  → Red
const T_AMBER_MAX = 499;   // 250–499 → Amber
//                           ≥ 500  → Green

function getRagColor(val: number | null): string {
  if (val === null) return RAG_NEUTRAL;
  if (val <= T_RED_MAX)   return RAG_RED;
  if (val <= T_AMBER_MAX) return RAG_AMBER;
  return RAG_GREEN;
}

function getRagLabel(val: number | null): string {
  if (val === null) return 'Neutral';
  if (val <= T_RED_MAX)   return 'Red';
  if (val <= T_AMBER_MAX) return 'Amber';
  return 'Green';
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PORTFOLIOS = [
  'Digital Transformation',
  'Operations Excellence',
  'Growth Initiatives',
  'Innovation',
  'Infrastructure',
];

const REGIONS = [
  'Riyadh',
  'Eastern Province',
  'Makkah',
  'Madinah',
  'Asir',
  'Qassim',
  'Tabuk',
  'Jazan',
  'Najran',
  'Hail',
  'Al Bahah',
];

const MATRIX: (number | null)[][] = [
  [567, 398, 313, 354, 543],
  [700, 567, 459, 398, 700],
  [444, 568, 344, 421, 100],
  [345, 167, 234, 543, 234],
  [123, 234, 123, 678, 654],
  [176, 129, 568, 645, 678],
  [456, 554, 587, 679, 345],
  [432, 678, 644, 349, 245],
  [432, 456, 432, 100, 124],
  [267, 345, 344, 118, 112],
  [387, 700, 387, 127, 100],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtK(val: number | null): string {
  if (val === null) return DL_MISSING;
  if (val >= 1000) return `${(val / 1000).toFixed(DL_DECIMALS)}M`;
  return `${val}K`;
}

const LABEL_SLOT_PX = CELL_W - CELL_GAP * 2;
const CHAR_PX       = 6.8;
const MAX_CHARS     = Math.floor(LABEL_SLOT_PX / CHAR_PX);

function truncate(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  return text.slice(0, MAX_CHARS - 1) + '…';
}

// Build flat heatmap data with per-item RAG colors
// Use a numeric "status index" as the heatmap value (for visualMap),
// but override each cell's color via itemStyle.color
const HEATMAP_DATA = MATRIX.flatMap((row, yi) =>
  row.map((val, xi) => ({
    value: [xi, yi, val ?? -1],
    itemStyle: { color: getRagColor(val) },
  }))
);

// ─── Fixed canvas dimensions ──────────────────────────────────────────────────
const N_COLS  = PORTFOLIOS.length;   // 5
const N_ROWS  = REGIONS.length;      // 11
const GRID_W  = N_COLS * CELL_W;     // 700
const GRID_H  = N_ROWS * CELL_H;    // 528

const ML = 168;
const MR = 24;
const MT = 100;
const MB = 20;

const CHART_W = ML + GRID_W + MR;   // 892
const CHART_H = MT + GRID_H + MB;   // 648

// ─── ECharts option ───────────────────────────────────────────────────────────
function getOption(): echarts.EChartsCoreOption {
  return {
    backgroundColor: '#FFFFFF',
    animation: false,
    tooltip: {
      formatter: (p: any) => {
        const [xi, yi, rawVal] = p.data.value as [number, number, number];
        const val   = rawVal === -1 ? null : rawVal;
        const color = getRagColor(val);
        const label = getRagLabel(val);
        return [
          `<span style="font-family:${FONT}">`,
          `<b>${REGIONS[yi]}</b> · ${PORTFOLIOS[xi]}<br/>`,
          `Budget: <b>${fmtK(val)}</b><br/>`,
          `Status: <span style="color:${color};font-weight:700">${label}</span>`,
          `</span>`,
        ].join('');
      },
      textStyle: { fontFamily: FONT, fontSize: 14 },
    },
    grid: {
      left: ML, right: MR, top: MT, bottom: MB,
      containLabel: false,
    },

    // ── X-Axis (top) ──────────────────────────────────────────────────────────
    xAxis: {
      type:         'category',
      data:         PORTFOLIOS,
      position:     'top',
      name:         'Portfolio',
      nameLocation: 'middle',
      nameGap:      58,
      nameTextStyle: {
        color:      X_COLOR,
        fontSize:   X_SIZE,
        fontFamily: FONT,
        fontWeight: X_BOLD ? 'bold' : 'normal',
        padding:    [0, 0, 8, 0],
      },
      axisLine: {
        show: X_LINE,
        lineStyle: { color: AXIS_LINE_COLOR, width: AXIS_LINE_WIDTH_VAL },
      },
      axisTick:  { show: false },
      splitLine: { show: false },
      axisLabel: {
        show:       X_LABELS,
        color:      X_COLOR,
        fontSize:   12,
        fontFamily: FONT,
        fontWeight: X_BOLD ? 'bold' : 'normal',
        interval:   0,
        width:      CELL_W - CELL_GAP,
        overflow:   'truncate',
        ellipsis:   '…',
        formatter:  (v: string) => truncate(v),
      },
    },

    // ── Y-Axis (left) ─────────────────────────────────────────────────────────
    yAxis: {
      type:         'category',
      data:         REGIONS,
      inverse:      true,
      name:         'Region',
      nameLocation: 'middle',
      nameGap:      118,
      nameRotate:   90,
      nameTextStyle: {
        color:      Y_COLOR,
        fontSize:   Y_SIZE,
        fontFamily: FONT,
        fontWeight: Y_BOLD ? 'bold' : 'normal',
      },
      axisLine: {
        show: Y_LINE,
        lineStyle: { color: AXIS_LINE_COLOR, width: AXIS_LINE_WIDTH_VAL },
      },
      axisTick:  { show: false },
      splitLine: { show: false },
      axisLabel: {
        show:       Y_LABELS,
        color:      Y_COLOR,
        fontSize:   12,
        fontFamily: FONT,
        fontWeight: Y_BOLD ? 'bold' : 'normal',
        align:      'right',
      },
    },

    // Dummy visualMap — cell colors come from per-item itemStyle.color
    visualMap: {
      show:  false,
      min:   -1,
      max:   700,
      inRange: { color: [RAG_NEUTRAL, RAG_GREEN] },
    },

    // ── Heatmap series ────────────────────────────────────────────────────────
    series: [{
      type: 'heatmap',
      data: HEATMAP_DATA,

      // Cell value label (Data Labels: enabled, bold, white, size 12)
      label: {
        show:       DL_ON,
        color:      DL_COLOR,
        fontSize:   DL_SIZE,
        fontWeight: DL_BOLD_V ? 700 : 400,
        fontFamily: FONT,
        formatter:  (p: any) => {
          const rawVal = (p.data.value as [number, number, number])[2];
          return fmtK(rawVal === -1 ? null : rawVal);
        },
      },

      // Cell appearance: rounded corners + white gaps
      itemStyle: {
        borderRadius: CORNERS,
        borderColor:  '#FFFFFF',
        borderWidth:  CELL_GAP / 2,   // white border creates visible gap
      },
      emphasis: {
        itemStyle: {
          opacity:     0.85,
          shadowBlur:  10,
          shadowColor: 'rgba(0,0,0,0.3)',
        },
      },
    }],
  };
}

// ─── Chart component ──────────────────────────────────────────────────────────
function RagChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    chart.setOption(getOption());
    return () => chart.dispose();
  }, []);

  return <div ref={containerRef} style={{ width: CHART_W, height: CHART_H, flexShrink: 0 }} />;
}

// ─── Style panel helpers ───────────────────────────────────────────────────────
function StyleTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-sm border-collapse" style={{ fontFamily: FONT }}>
      <thead>
        <tr style={{ background: '#B8D4E8' }}>
          <th className="text-left p-2 border border-gray-300">Style</th>
          <th className="text-left p-2 border border-gray-300">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([style, value], i) => (
          <tr key={`${style}-${i}`} style={{ background: '#fff' }}>
            <td className="p-2 border border-gray-300 text-gray-700">{style}</td>
            <td className="p-2 border border-gray-300 font-medium">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RagColorTable() {
  const rows: { status: string; color: string; swatch: string }[] = [
    { status: 'Red',            color: RAG_RED,     swatch: RAG_RED },
    { status: 'Amber',          color: RAG_AMBER,   swatch: RAG_AMBER },
    { status: 'Green',          color: RAG_GREEN,   swatch: RAG_GREEN },
    { status: 'Neutral / No data', color: RAG_NEUTRAL, swatch: RAG_NEUTRAL },
  ];
  return (
    <table className="w-full text-sm border-collapse" style={{ fontFamily: FONT }}>
      <thead>
        <tr style={{ background: '#B8D4E8' }}>
          <th className="text-left p-2 border border-gray-300">Status</th>
          <th className="text-left p-2 border border-gray-300">Color</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ status, color, swatch }, i) => (
          <tr key={status} style={{ background: '#fff' }}>
            <td className="p-2 border border-gray-300 text-gray-700">{status}</td>
            <td className="p-2 border border-gray-300">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded"
                  style={{ width: 14, height: 14, background: swatch, border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }}
                />
                <span className="font-medium">{color}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Section({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h4>
      <StyleTable rows={rows} />
    </div>
  );
}

// ─── Style panel ──────────────────────────────────────────────────────────────
function StylePanel() {
  return (
    <div
      className="w-[320px] shrink-0 border-l border-gray-200 overflow-y-auto p-5 bg-gray-50"
      style={{ fontFamily: FONT }}
    >
      <h2 className="text-base font-bold mb-5">Style Configuration</h2>

      {/* ── Basic styles ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h3
          className="text-sm font-semibold mb-4 px-3 py-2 rounded"
          style={{ background: '#FEF3C7', color: '#92400E' }}
        >
          Basic styles
        </h3>

        <Section
          title="Squares"
          rows={[
            ['Size (W)',        `${CELL_W}`],
            ['Size (H)',        `${CELL_H}`],
            ['Squares gap',    `${CELL_GAP}`],
            ['Square color',   `${SQUARE_COLOR} (Disabled)`],
            ['Square opacity', `${SQUARE_OPACITY}%`],
            ['Used palette',   USED_PALETTE],
            ['Font family',    LABEL_FONT],
            ['Bold',           LABEL_BOLD ? 'Yes' : 'No'],
            ['Text color',     LABEL_COLOR],
            ['Text size',      `${LABEL_SIZE}`],
            ['Border',         BORDER_ON ? 'Yes' : 'Disabled'],
            ['Border color',   BORDER_COLOR],
            ['Border width',   `${BORDER_WIDTH}`],
            ['Corners',        `${CORNERS}`],
          ]}
        />

        {/* RAG status colors sub-table */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            RAG status colors
          </h4>
          <RagColorTable />
        </div>
      </div>

      {/* ── Advanced styles ───────────────────────────────────────────────── */}
      <div className="mb-6">
        <h3
          className="text-sm font-semibold mb-4 px-3 py-2 rounded"
          style={{ background: '#EDE9FE', color: '#5B21B6' }}
        >
          Advanced styles
        </h3>

        <Section
          title="Axes"
          rows={[
            ['Enabled',                  AXES_ON   ? 'Yes' : 'No'],
            ['Shared measure axis as %', AXES_AS_PCT ? 'Yes' : 'No'],
            ['Axis line style',          AXIS_LINE_STYLE_VAL],
            ['Axis line color',          AXIS_LINE_COLOR],
            ['Axis line width',          `${AXIS_LINE_WIDTH_VAL}`],
          ]}
        />

        <Section
          title="Axes / Y-Axis"
          rows={[
            ['Show axis title',  Y_TITLE  ? 'Yes' : 'No'],
            ['Show axis line',   Y_LINE   ? 'Yes' : 'No'],
            ['Show axis labels', Y_LABELS ? 'Yes' : 'No'],
            ['Font family',      'Auto'],
            ['Bold',             Y_BOLD   ? 'Yes' : 'No'],
            ['Color',            Y_COLOR],
            ['Size',             `${Y_SIZE}`],
            ['Rotation',         `${Y_ROTATE}°`],
          ]}
        />

        <Section
          title="Axes / X-Axis"
          rows={[
            ['Show axis title',  X_TITLE  ? 'Yes' : 'No'],
            ['Show axis line',   X_LINE   ? 'Yes' : 'No'],
            ['Show axis labels', X_LABELS ? 'Yes' : 'No'],
            ['Font family',      'Auto'],
            ['Bold',             X_BOLD   ? 'Yes' : 'No'],
            ['Color',            X_COLOR],
            ['Size',             `${X_SIZE}`],
            ['Rotation',         `${X_ROTATE}°`],
          ]}
        />

        <Section
          title="Data Labels"
          rows={[
            ['Data labels',              DL_ON     ? 'Yes' : 'No'],
            ['Background color',         DL_BG],
            ['Background opacity',       `${DL_BG_OPC}%`],
            ['Font family',              'Auto'],
            ['Bold',                     DL_BOLD_V ? 'Yes' : 'No'],
            ['Color',                    DL_COLOR],
            ['Size',                     `${DL_SIZE}`],
            ['Display missing value as', DL_MISSING],
            ['Decimals',                 `${DL_DECIMALS}`],
            ['Short number',             DL_SHORT  ? 'Yes' : 'No'],
            ['Data labels as total %',   DL_AS_PCT ? 'Yes' : 'No'],
          ]}
        />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function RagMatrixView() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left — chart (scrollable) */}
      <div className="flex-1 min-w-0 overflow-auto bg-white p-6 flex items-start justify-center">
        <RagChart />
      </div>

      {/* Right — style panel */}
      <StylePanel />
    </div>
  );
}