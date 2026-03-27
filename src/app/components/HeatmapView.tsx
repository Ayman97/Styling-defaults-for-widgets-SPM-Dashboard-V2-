import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants (extracted exactly from style panel) ─────────────────────
// Basic styles — Squares
const CELL_W         = 140;
const CELL_H         = 48;
const CELL_GAP       = 4;
const SQUARE_COLOR   = '#0B3A67';   // darkest shade (highest value)
const SQUARE_OPACITY = 100;         // %
const USED_PALETTE   = 'Monochrome';
const LABEL_FONT     = 'Auto';
const LABEL_BOLD     = false;       // disabled
const LABEL_COLOR    = '#FFFFFF';
const LABEL_SIZE     = 12;
const BORDER_ON      = false;       // disabled
const BORDER_STYLE   = 'Solid';
const BORDER_COLOR   = '#E2E8F0';
const BORDER_WIDTH   = 0;
const CORNERS        = 8;

// Advanced styles — Axes (enabled)
const AXES_ON              = true;
const AXES_AS_PCT          = false;
const AXIS_LINE_STYLE_VAL  = 'Solid';
const AXIS_LINE_COLOR      = '#E5E7EB';
const AXIS_LINE_WIDTH_VAL  = 1;

// Advanced styles — Y-Axis
const Y_TITLE   = true;
const Y_LINE    = false;
const Y_LABELS  = true;
const Y_BOLD    = false;
const Y_COLOR   = '#334155';
const Y_SIZE    = 14;
const Y_ROTATE  = 0;

// Advanced styles — X-Axis
const X_TITLE   = true;
const X_LINE    = false;
const X_LABELS  = true;
const X_BOLD    = false;
const X_COLOR   = '#334155';
const X_SIZE    = 14;
const X_ROTATE  = 0;

// Advanced styles — Data Labels (disabled)
const DL_ON       = false;
const DL_BG       = '#0F172A';
const DL_BG_OPC   = 72;             // %
const DL_BOLD_V   = true;
const DL_COLOR    = '#FFFFFF';
const DL_SIZE     = 12;
const DL_MISSING  = '–';
const DL_DECIMALS = 1;
const DL_SHORT    = true;
const DL_AS_PCT   = false;

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

const MATRIX: number[][] = [
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

const HEATMAP_DATA = MATRIX.flatMap((row, yi) =>
  row.map((val, xi) => [xi, yi, val])
);

const ALL_VALS = MATRIX.flat();
const MIN_VAL  = Math.min(...ALL_VALS);
const MAX_VAL  = Math.max(...ALL_VALS);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtK(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(DL_DECIMALS)}M`;
  return `${val}K`;
}

/**
 * Truncate an axis label so it never overflows its cell slot.
 * Approximate: 6.5px per character at 12px Plus Jakarta Sans.
 */
const LABEL_SLOT_PX  = CELL_W - CELL_GAP * 2;      // usable px per slot
const CHAR_PX        = 6.8;                          // avg char width @12px
const MAX_CHARS      = Math.floor(LABEL_SLOT_PX / CHAR_PX); // ~19 chars

function truncate(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  return text.slice(0, MAX_CHARS - 1) + '…';
}

// ─── Fixed chart canvas dimensions ────────────────────────────────────────────
const N_COLS  = PORTFOLIOS.length;   // 5
const N_ROWS  = REGIONS.length;      // 11
const GRID_W  = N_COLS * CELL_W;     // 700
const GRID_H  = N_ROWS * CELL_H;    // 528

const ML = 168;   // left  — Region title + labels
const MR = 24;    // right
const MT = 100;   // top   — Portfolio title + labels
const MB = 20;    // bottom

const CHART_W = ML + GRID_W + MR;   // 892
const CHART_H = MT + GRID_H + MB;   // 648

// ─── ECharts option ───────────────────────────────────────────────────────────
function getOption(): echarts.EChartsCoreOption {
  return {
    backgroundColor: '#FFFFFF',
    animation: false,
    tooltip: {
      formatter: (p: any) => {
        const [xi, yi, val] = p.data as [number, number, number];
        return `<span style="font-family:${FONT}"><b>${REGIONS[yi]}</b><br/>${PORTFOLIOS[xi]}: <b>${fmtK(val)}</b></span>`;
      },
      textStyle: { fontFamily: FONT, fontSize: 14 },
    },
    grid: {
      left:         ML,
      right:        MR,
      top:          MT,
      bottom:       MB,
      containLabel: false,
    },

    // ── X-Axis (top) ──────────────────────────────────────────────────────────
    xAxis: {
      type:         'category',
      data:         PORTFOLIOS,
      position:     'top',
      name:         'Portfolio',
      nameLocation: 'middle',
      nameGap:      58,           // gap from axis to name, pushes title above labels
      nameTextStyle: {
        color:      X_COLOR,
        fontSize:   X_SIZE,
        fontFamily: FONT,
        fontWeight: X_BOLD ? 'bold' : 'normal',
        padding:    [0, 0, 8, 0],
      },
      axisLine: {
        show:      X_LINE,
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
        // Width + overflow for native ECharts truncation
        width:      CELL_W - CELL_GAP,
        overflow:   'truncate',
        ellipsis:   '…',
        // Also apply JS truncation as a reliable fallback
        formatter:  (v: string) => truncate(v),
      },
    },

    // ── Y-Axis (left) ─────────────────────────────────────────────────────────
    yAxis: {
      type:         'category',
      data:         REGIONS,
      inverse:      true,          // Riyadh at top
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
        show:      Y_LINE,
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

    // ── Visual map — Monochrome BLUE, light → SQUARE_COLOR ────────────────────
    visualMap: {
      min:   MIN_VAL,
      max:   MAX_VAL,
      show:  false,
      inRange: {
        // Unified monochrome palette — lightest (#F5FAFE) at low → #0B3A67 at high
        color: [
          '#F5FAFE',  // palette[9] — lowest value
          '#EAF4FB',  // palette[8]
          '#D6E8F5',  // palette[7]
          '#B2D2EA',  // palette[6]
          '#8FBBDC',  // palette[5]
          '#6CA3CF',  // palette[4]
          '#4A88BC',  // palette[3]
          '#2B6CA3',  // palette[2]
          '#154E84',  // palette[1]
          SQUARE_COLOR, // palette[0] #0B3A67 — highest value
        ],
      },
    },

    // ── Heatmap series ────────────────────────────────────────────────────────
    series: [{
      type: 'heatmap',
      data: HEATMAP_DATA,

      // Cell value label — always visible inside every cell
      label: {
        show:       true,
        color:      LABEL_COLOR,
        fontSize:   LABEL_SIZE,
        fontWeight: LABEL_BOLD ? 700 : 400,
        fontFamily: FONT,
        // Subtle shadow so white text stays legible on light cells
        textBorderColor:  'rgba(0,0,0,0.25)',
        textBorderWidth:  1.5,
        formatter: (p: any) => fmtK((p.data as [number, number, number])[2]),
      },

      // Cell appearance: rounded corners + white gaps via border
      itemStyle: {
        borderRadius: CORNERS,
        // White border = visual gap between cells
        borderColor:  '#FFFFFF',
        borderWidth:  CELL_GAP / 2,   // 2px each side → 4px apparent gap
      },
      emphasis: {
        itemStyle: {
          shadowBlur:  12,
          shadowColor: 'rgba(0,0,0,0.3)',
          opacity:     0.85,
        },
      },
    }],
  };
}

// ─── Chart component ──────────────────────────────────────────────────────────
function HeatmapChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;
    chart.setOption(getOption());
    return () => { chart.dispose(); chartRef.current = null; };
  }, []);

  // Fixed canvas size — the outer wrapper scrolls
  return (
    <div ref={containerRef} style={{ width: CHART_W, height: CHART_H, flexShrink: 0 }} />
  );
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
            ['Square color',   SQUARE_COLOR],
            ['Square opacity', `${SQUARE_OPACITY}%`],
            ['Used palette',   USED_PALETTE],
            ['Font family',    LABEL_FONT],
            ['Bold',           LABEL_BOLD ? 'Yes' : 'No'],
            ['Text color',     LABEL_COLOR],
            ['Text size',      `${LABEL_SIZE}`],
            ['Border style',   BORDER_STYLE],
            ['Border color',   BORDER_COLOR],
            ['Border width',   `${BORDER_WIDTH}`],
            ['Corners',        `${CORNERS}`],
          ]}
        />
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
            ['Enabled',                  AXES_ON ? 'Yes' : 'No'],
            ['Shared measure axis as %', AXES_AS_PCT ? 'Yes' : 'No'],
            ['Axis line style',          AXIS_LINE_STYLE_VAL],
            ['Axis line color',          AXIS_LINE_COLOR],
            ['Axis line width',          `${AXIS_LINE_WIDTH_VAL}`],
          ]}
        />

        <Section
          title="Axes / Y-Axis"
          rows={[
            ['Show axis title',  Y_TITLE   ? 'Yes' : 'No'],
            ['Show axis line',   Y_LINE    ? 'Yes' : 'No'],
            ['Show axis labels', Y_LABELS  ? 'Yes' : 'No'],
            ['Font family',      'Auto'],
            ['Text bold',        Y_BOLD    ? 'Yes' : 'No'],
            ['Color',            Y_COLOR],
            ['Size',             `${Y_SIZE}`],
            ['Rotation',         `${Y_ROTATE}°`],
          ]}
        />

        <Section
          title="Axes / X-Axis"
          rows={[
            ['Show axis title',  X_TITLE   ? 'Yes' : 'No'],
            ['Show axis line',   X_LINE    ? 'Yes' : 'No'],
            ['Show axis labels', X_LABELS  ? 'Yes' : 'No'],
            ['Font family',      'Auto'],
            ['Text bold',        X_BOLD    ? 'Yes' : 'No'],
            ['Color',            X_COLOR],
            ['Size',             `${X_SIZE}`],
            ['Rotation',         `${X_ROTATE}°`],
          ]}
        />

        <Section
          title="Data Labels"
          rows={[
            ['Enabled',                 DL_ON     ? 'Yes' : 'No'],
            ['Background color',        DL_BG],
            ['Background opacity',      `${DL_BG_OPC}%`],
            ['Font family',             'Auto'],
            ['Bold',                    DL_BOLD_V ? 'Yes' : 'No'],
            ['Color',                   DL_COLOR],
            ['Size',                    `${DL_SIZE}`],
            ['Display missing value as', DL_MISSING],
            ['Decimals',                `${DL_DECIMALS}`],
            ['Short number',            DL_SHORT  ? 'Yes' : 'No'],
            ['Data labels as total %',  DL_AS_PCT ? 'Yes' : 'No'],
          ]}
        />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function HeatmapView() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left — chart area, scrollable for fixed-size canvas */}
      <div className="flex-1 min-w-0 overflow-auto bg-white p-6 flex items-start justify-center">
        <HeatmapChart />
      </div>

      {/* Right — scrollable style panel */}
      <StylePanel />
    </div>
  );
}