import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const FONT = 'Plus Jakarta Sans, sans-serif';

type LineVariant = 'line' | 'area';

const SUB_TABS: Array<{ key: LineVariant; label: string }> = [
  { key: 'line', label: 'Line' },
  { key: 'area', label: 'Area' },
];

// ─── Style constants ──────────────────────────────────────────────────────────
const LINE_SMOOTH           = false;
const LINE_CUMULATIVE       = false;
const LINE_STEPPED          = false;
const LINE_MARKERS          = true;
const LINE_MARKER_SHAPE     = 'Circle';
const LINE_MARKER_SIZE      = 8;
const LINE_MARKER_COLOR     = '#0B3A67';
const LINE_LABEL_SIZE       = 16;
const LINE_STYLE            = 'Solid';
const LINE_COLOR            = '#0B3A67';
const LINE_WIDTH            = 2;
const LINE_PALETTE          = 'Monochrome';
const LINE_CUSTOMIZE        = false;

const AREA_FILL_COLOR       = '#0B3A67';
const AREA_FILL_OPACITY_PCT = '20%';

const AXES_ENABLED          = true;
const AXES_AS_PCT           = false;
const AXIS_LINE_STYLE       = 'Solid';
const AXIS_LINE_COLOR       = '#E5E7EB';
const AXIS_LINE_WIDTH       = 1;

const Y_SHOW_TITLE          = false;
const Y_SHOW_LINE           = false;
const Y_SHOW_LABELS         = true;
const Y_FONT_FAM            = 'Auto';
const Y_BOLD                = false;
const Y_COLOR               = '#6B7280';
const Y_SIZE                = 12;
const Y_ROTATION            = '0°';

const X_SHOW_TITLE          = false;
const X_SHOW_LINE           = false;
const X_SHOW_LABELS         = true;
const X_FONT_FAM            = 'Auto';
const X_BOLD                = false;
const X_COLOR               = '#6B7280';
const X_SIZE                = 12;
const X_ROTATION            = '0°';

const GL_VERTICAL           = false;
const GL_HORIZONTAL         = true;
const GL_H_STYLE            = 'Solid';
const GL_H_COLOR            = '#E5E7EB';
const GL_H_WIDTH            = 1;

const DL_ENABLED            = true;
const DL_POSITION           = 'Above';
const DL_BG_COLOR           = 'Transparent';
const DL_BG_OPACITY         = '0%';
const DL_FONT_FAM           = 'Auto';
const DL_BOLD               = true;
const DL_COLOR              = '#111827';
const DL_SIZE               = 12;
const DL_CORNERS            = 8;
const DL_MISSING            = '–';
const DL_DECIMALS           = 1;
const DL_SHORT_NUM          = true;

const REF_LINE_ENABLED      = false;
const REF_SHOW_LABEL        = true;
const REF_LABEL_POS         = 'Above';
const REF_LABEL_FONT        = 'Auto';
const REF_LABEL_BOLD        = false;
const REF_LABEL_COLOR       = '#374151';
const REF_LABEL_SIZE        = 12;
const REF_LINE_STYLE        = 'Dashed';
const REF_LINE_COLOR        = '#94A3B8';
const REF_LINE_WIDTH        = 1;
const REF_LABEL_BG_COLOR    = '#FFFFFF';
const REF_LABEL_BG_OPACITY  = 0;
const REF_LABEL_CORNERS     = 4;

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontFamily: FONT,
  fontSize: 13,
  color: '#374151',
};

const LineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i}>
          {p.name ?? 'Value'}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const chartData = [
  { month: 'Jan', value: 65.5 },
  { month: 'Feb', value: 78.2 },
  { month: 'Mar', value: 92.8 },
  { month: 'Apr', value: 85.3 },
  { month: 'May', value: 105.7 },
  { month: 'Jun', value: 118.4 },
];

// ─── Custom label ─────────────────────────────────────────────────────────────
function CustomLabel(props: { x?: number; y?: number; value?: number }) {
  const { x = 0, y = 0, value = 0 } = props;
  return (
    <g>
      <rect x={x - 20} y={y - 24} width={40} height={20} fill="transparent" rx={DL_CORNERS} />
      <text
        x={x}
        y={y - 10}
        fill={DL_COLOR}
        textAnchor="middle"
        fontWeight={DL_BOLD ? 'bold' : 'normal'}
        fontSize={DL_SIZE}
        fontFamily={FONT}
      >
        {Number(value).toFixed(DL_DECIMALS)}
      </text>
    </g>
  );
}

// ─── Style panel ──────────────────────────────────────────────────────────────
interface StyleSection {
  title: string;
  headerBg: string;
  rows: Array<[string, string]>;
}

function StylePanel({ variant, sections }: { variant: string; sections: StyleSection[] }) {
  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: FONT }}>Style Configuration</h2>
      <p className="text-xs text-gray-400 mb-5" style={{ fontFamily: FONT }}>Variant: {variant}</p>
      {sections.map((sec) => (
        <div key={sec.title} className="mb-8">
          <h3
            className="text-base font-semibold mb-3 px-3 py-2 rounded"
            style={{ backgroundColor: sec.headerBg, fontFamily: FONT }}
          >
            {sec.title}
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#B8D4E8]">
                <th className="text-left p-2 border border-gray-300" style={{ fontFamily: FONT }}>Style</th>
                <th className="text-left p-2 border border-gray-300" style={{ fontFamily: FONT }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {sec.rows.map(([k, v], i) => (
                <tr key={i}>
                  <td className="p-2 border border-gray-300" style={{ fontFamily: FONT }}>{k}</td>
                  <td className="p-2 border border-gray-300" style={{ fontFamily: FONT }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ─── Sections data ────────────────────────────────────────────────────────────
const sharedAxesSections: StyleSection[] = [
  {
    title: 'Advanced styles – Axes',
    headerBg: '#E8E1F5',
    rows: [
      ['Enabled',                  AXES_ENABLED ? 'Yes' : 'No'],
      ['Shared measure axis as %', AXES_AS_PCT  ? 'Yes' : 'No'],
      ['Axis line style',          AXIS_LINE_STYLE],
      ['Axis line color',          AXIS_LINE_COLOR],
      ['Axis line width',          String(AXIS_LINE_WIDTH)],
    ],
  },
  {
    title: 'Y-Axis',
    headerBg: '#F9FAFB',
    rows: [
      ['Show axis title',  Y_SHOW_TITLE  ? 'Yes' : 'No'],
      ['Show axis line',   Y_SHOW_LINE   ? 'Yes' : 'No'],
      ['Show axis labels', Y_SHOW_LABELS ? 'Yes' : 'No'],
      ['Font family',      Y_FONT_FAM],
      ['Bold',             Y_BOLD ? 'Yes' : 'No'],
      ['Color',            Y_COLOR],
      ['Size',             String(Y_SIZE)],
      ['Label rotation',   Y_ROTATION],
    ],
  },
  {
    title: 'X-Axis',
    headerBg: '#F9FAFB',
    rows: [
      ['Show axis title',  X_SHOW_TITLE  ? 'Yes' : 'No'],
      ['Show axis line',   X_SHOW_LINE   ? 'Yes' : 'No'],
      ['Show axis labels', X_SHOW_LABELS ? 'Yes' : 'No'],
      ['Font family',      X_FONT_FAM],
      ['Bold',             X_BOLD ? 'Yes' : 'No'],
      ['Color',            X_COLOR],
      ['Size',             String(X_SIZE)],
      ['Label rotation',   X_ROTATION],
    ],
  },
  {
    title: 'Gridlines',
    headerBg: '#F9FAFB',
    rows: [
      ['Show vertical gridlines',   GL_VERTICAL   ? 'Yes' : 'No'],
      ['Show horizontal gridlines', GL_HORIZONTAL ? 'Yes' : 'No'],
      ['Horizontal gridline style', GL_H_STYLE],
      ['Horizontal gridline color', GL_H_COLOR],
      ['Horizontal gridline width', String(GL_H_WIDTH)],
    ],
  },
  {
    title: 'Advanced styles – Reference line',
    headerBg: '#E8E1F5',
    rows: [
      ['Enabled',                    REF_LINE_ENABLED     ? 'Yes' : 'No'],
      ['Show label',                 REF_SHOW_LABEL       ? 'Yes' : 'No'],
      ['Label position',             REF_LABEL_POS],
      ['Label font family',          REF_LABEL_FONT],
      ['Label bold',                 REF_LABEL_BOLD       ? 'Yes' : 'No'],
      ['Label color',                REF_LABEL_COLOR],
      ['Label size',                 String(REF_LABEL_SIZE)],
      ['Line style',                 REF_LINE_STYLE],
      ['Line color',                 REF_LINE_COLOR],
      ['Line width',                 String(REF_LINE_WIDTH)],
      ['Label background color',     REF_LABEL_BG_COLOR],
      ['Label background opacity',   String(REF_LABEL_BG_OPACITY)],
      ['Label corners',              String(REF_LABEL_CORNERS)],
    ],
  },
  {
    title: 'Data labels',
    headerBg: '#F9FAFB',
    rows: [
      ['Enabled',                    DL_ENABLED ? 'Yes' : 'No'],
      ['Position',                   DL_POSITION],
      ['Background color',           DL_BG_COLOR],
      ['Background opacity',         DL_BG_OPACITY],
      ['Font family',                DL_FONT_FAM],
      ['Bold',                       DL_BOLD ? 'Yes' : 'No'],
      ['Color',                      DL_COLOR],
      ['Size',                       String(DL_SIZE)],
      ['Label corners',              String(DL_CORNERS)],
      ['Display missing value as',   DL_MISSING],
      ['Decimals',                   String(DL_DECIMALS)],
      ['Short number',               DL_SHORT_NUM ? 'Yes' : 'No'],
      ['Customize for each line',    'No'],
    ],
  },
  {
    title: 'Customize for each line — eg: Line 1 (if "Customize for each line" is enabled)',
    headerBg: '#F9FAFB',
    rows: [
      ['Position',                 DL_POSITION],
      ['Background color',         DL_BG_COLOR],
      ['Background opacity',       DL_BG_OPACITY],
      ['Font family',              DL_FONT_FAM],
      ['Bold',                     DL_BOLD ? 'Yes' : 'No'],
      ['Color',                    DL_COLOR],
      ['Size',                     String(DL_SIZE)],
      ['Label corners',            String(DL_CORNERS)],
      ['Display missing value as', DL_MISSING],
      ['Decimals',                 String(DL_DECIMALS)],
      ['Short number',             DL_SHORT_NUM ? 'Yes' : 'No'],
    ],
  },
];

const lineBasicSection: StyleSection = {
  title: 'Basic styles – Lines',
  headerBg: '#F5E6D3',
  rows: [
    ['Smooth',              LINE_SMOOTH     ? 'Yes' : 'No'],
    ['Cumulative',          LINE_CUMULATIVE ? 'Yes' : 'No'],
    ['Stepped lines',       LINE_STEPPED    ? 'Yes' : 'No'],
    ['Markers',             LINE_MARKERS    ? 'Yes' : 'No'],
    ['Marker shape',        LINE_MARKER_SHAPE],
    ['Marker size',         String(LINE_MARKER_SIZE)],
    ['Marker color',        LINE_MARKER_COLOR],
    ['Marker label size',   String(LINE_LABEL_SIZE)],
    ['Line style',          LINE_STYLE],
    ['Line color',          LINE_COLOR],
    ['Line width',          String(LINE_WIDTH)],
    ['Used palette',        LINE_PALETTE],
    ['Customize each line', LINE_CUSTOMIZE ? 'Yes' : 'No'],
  ],
};

const areaBasicSection: StyleSection = {
  title: 'Basic styles – Area',
  headerBg: '#F5E6D3',
  rows: [
    ['Smooth',              LINE_SMOOTH     ? 'Yes' : 'No'],
    ['Cumulative',          LINE_CUMULATIVE ? 'Yes' : 'No'],
    ['Stepped lines',       LINE_STEPPED    ? 'Yes' : 'No'],
    ['Markers',             LINE_MARKERS    ? 'Yes' : 'No'],
    ['Marker shape',        LINE_MARKER_SHAPE],
    ['Marker size',         String(LINE_MARKER_SIZE)],
    ['Marker color',        LINE_MARKER_COLOR],
    ['Marker label size',   String(LINE_LABEL_SIZE)],
    ['Line style',          LINE_STYLE],
    ['Line color',          LINE_COLOR],
    ['Line width',          String(LINE_WIDTH)],
    ['Fill color',          AREA_FILL_COLOR],
    ['Fill opacity',        AREA_FILL_OPACITY_PCT],
    ['Used palette',        LINE_PALETTE],
    ['Customize each line', LINE_CUSTOMIZE ? 'Yes' : 'No'],
  ],
};

// ── Customize Each Line — shown right after the basic table ──────────────────
// (if "Customize each line" is enabled)
const customizeEachLineSection: StyleSection = {
  title: 'Customize each line — eg: Line 1 default (if "Customize each line" is enabled)',
  headerBg: '#F5E6D3',
  rows: [
    ['Smooth',            LINE_SMOOTH     ? 'Yes' : 'No'],
    ['Cumulative',        LINE_CUMULATIVE ? 'Yes' : 'No'],
    ['Stepped lines',     LINE_STEPPED    ? 'Yes' : 'No'],
    ['Markers',           LINE_MARKERS    ? 'Yes' : 'No'],
    ['Marker shape',      LINE_MARKER_SHAPE],
    ['Marker size',       String(LINE_MARKER_SIZE)],
    ['Marker color',      LINE_MARKER_COLOR],
    ['Marker label size', String(LINE_LABEL_SIZE)],
    ['Line style',        LINE_STYLE],
    ['Line color',        LINE_COLOR],
    ['Line width',        String(LINE_WIDTH)],
  ],
};

const lineSections: StyleSection[] = [lineBasicSection, customizeEachLineSection, ...sharedAxesSections];
const areaSections: StyleSection[] = [areaBasicSection, customizeEachLineSection, ...sharedAxesSections];

// ─── Chart components ─────────────────────────────────────────────────────────
function LineVariantChart() {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke={GL_H_COLOR}
            strokeWidth={GL_H_WIDTH}
            vertical={GL_VERTICAL}
            horizontal={GL_HORIZONTAL}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: X_COLOR, fontSize: X_SIZE, fontFamily: FONT }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: Y_COLOR, fontSize: Y_SIZE, fontFamily: FONT }}
          />
          <Tooltip content={<LineTooltip />} />
          <Line
            type="linear"
            dataKey="value"
            stroke={LINE_COLOR}
            strokeWidth={LINE_WIDTH}
            dot={{ fill: LINE_MARKER_COLOR, r: LINE_MARKER_SIZE / 2, strokeWidth: 0 }}
            label={{ content: CustomLabel }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AreaVariantChart() {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={AREA_FILL_COLOR} stopOpacity={0.4} />
              <stop offset="95%" stopColor={AREA_FILL_COLOR} stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="0"
            stroke={GL_H_COLOR}
            strokeWidth={GL_H_WIDTH}
            vertical={GL_VERTICAL}
            horizontal={GL_HORIZONTAL}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: X_COLOR, fontSize: X_SIZE, fontFamily: FONT }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: Y_COLOR, fontSize: Y_SIZE, fontFamily: FONT }}
          />
          <Tooltip content={<LineTooltip />} />
          <Area
            type="linear"
            dataKey="value"
            stroke={LINE_COLOR}
            strokeWidth={LINE_WIDTH}
            fill="url(#areaGradient)"
            dot={{ fill: LINE_MARKER_COLOR, r: LINE_MARKER_SIZE / 2, strokeWidth: 0 }}
            label={{ content: CustomLabel }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function LineChartView() {
  const [variant, setVariant] = useState<LineVariant>('line');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-tabs */}
      <div style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', flexShrink: 0, display: 'flex', paddingLeft: 16 }}>
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setVariant(t.key)}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontFamily: FONT,
              fontWeight: variant === t.key ? 600 : 500,
              color: variant === t.key ? '#2563EB' : '#6B7280',
              background: 'none',
              border: 'none',
              borderBottom: variant === t.key ? '2px solid #2563EB' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
          {variant === 'line' ? <LineVariantChart /> : <AreaVariantChart />}
        </div>
        <StylePanel
          variant={variant === 'line' ? 'Line' : 'Area'}
          sections={variant === 'line' ? lineSections : areaSections}
        />
      </div>
    </div>
  );
}