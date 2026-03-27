import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants extracted from style panel image ─────────────────────────

// Basic styles > Bubbles
const BUBBLE_SIZE = 8;
const BUBBLE_COLOR = '#0B3A67';
const BUBBLE_OPACITY = 1.0;
const USED_PALETTE = 'Monochrome';

// Advanced styles > Reference line
const REF_LINE_SHOW_LABEL = true;
const REF_LINE_LABEL_POSITION = 'Right';
const REF_LINE_LABEL_FONT_FAMILY = 'Auto';
const REF_LINE_LABEL_BOLD = false;
const REF_LINE_LABEL_COLOR = '#374151';
const REF_LINE_LABEL_SIZE = 12;
const REF_LINE_STYLE = 'Dashed';
const REF_LINE_COLOR = '#6B7280';
const REF_LINE_WIDTH = 2;
const REF_LINE_LABEL_BG = '#FFFFFF';
const REF_LINE_LABEL_OPACITY = 1.0;

// Advanced styles > Axes (general)
const AXES_ENABLED = true;
const AXIS_SHARED_AS_PCT = false;
const AXIS_LINE_STYLE = 'Solid';
const AXIS_LINE_COLOR = '#E5E7EB';
const AXIS_LINE_WIDTH = 1;

// Advanced styles > Axes / Y-Axis
const Y_SHOW_TITLE = false;
const Y_SHOW_LINE = false;
const Y_SHOW_LABELS = true;
const Y_FONT_FAMILY = 'Auto';
const Y_TEXT_BOLD = false;
const Y_COLOR = '#6B7280';
const Y_SIZE = 12;
const Y_ROTATION = 0;

// Advanced styles > Axes / X-Axis
const X_SHOW_TITLE = false;
const X_SHOW_LINE = false;
const X_SHOW_LABELS = true;
const X_FONT_FAMILY = 'Auto';
const X_TEXT_BOLD = false;
const X_COLOR = '#6B7280';
const X_SIZE = 12;
const X_ROTATION = 0;

// Advanced styles > Gridlines
const GRID_SHOW_VERTICAL = true;
const GRID_SHOW_HORIZONTAL = true;
const GRID_STYLE = 'Solid';
const GRID_COLOR = '#E5E7EB';
const GRID_WIDTH = 1;

// Advanced styles > Category labels
const CAT_LABEL_POSITION = 'Below';
const CAT_LABEL_BG = '#FFFFFF';
const CAT_LABEL_BG_OPACITY = 1.0;
const CAT_LABEL_FONT_FAMILY = 'Auto';
const CAT_LABEL_BOLD = false;
const CAT_LABEL_COLOR = '#374151';
const CAT_LABEL_SIZE = 12;

// ─── Monochrome palette — unified sequential assignment ───────────────────────
const PALETTE = ['#0B3A67', '#154E84', '#2B6CA3', '#4A88BC'];

// ─── Series data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Digital', color: PALETTE[0] },
  { name: 'Operations', color: PALETTE[1] },
  { name: 'Innovation', color: PALETTE[2] },
  { name: 'Infrastructure', color: PALETTE[3] },
];

// Scatter data — fixed dot size
const scatterSeriesData = [
  {
    name: 'Digital', color: PALETTE[0],
    data: [{ x: 20, y: 70 }, { x: 45, y: 85 }, { x: 60, y: 55 }, { x: 30, y: 90 }, { x: 75, y: 40 }],
  },
  {
    name: 'Operations', color: PALETTE[1],
    data: [{ x: 50, y: 60 }, { x: 80, y: 75 }, { x: 35, y: 30 }, { x: 65, y: 50 }, { x: 90, y: 20 }],
  },
  {
    name: 'Innovation', color: PALETTE[2],
    data: [{ x: 15, y: 45 }, { x: 55, y: 80 }, { x: 70, y: 65 }, { x: 40, y: 25 }, { x: 85, y: 90 }],
  },
  {
    name: 'Infrastructure', color: PALETTE[3],
    data: [{ x: 25, y: 35 }, { x: 60, y: 45 }, { x: 45, y: 70 }, { x: 75, y: 55 }, { x: 10, y: 80 }],
  },
];

// Bubble data — variable size via z dimension
const bubbleSeriesData = [
  {
    name: 'Digital', color: PALETTE[0],
    data: [
      { x: 20, y: 70, z: 800 }, { x: 45, y: 85, z: 1500 }, { x: 60, y: 55, z: 600 },
      { x: 30, y: 90, z: 2000 }, { x: 75, y: 40, z: 400 },
    ],
  },
  {
    name: 'Operations', color: PALETTE[1],
    data: [
      { x: 50, y: 60, z: 1200 }, { x: 80, y: 75, z: 900 }, { x: 35, y: 30, z: 1800 },
      { x: 65, y: 50, z: 700 }, { x: 90, y: 20, z: 500 },
    ],
  },
  {
    name: 'Innovation', color: PALETTE[2],
    data: [
      { x: 15, y: 45, z: 1100 }, { x: 55, y: 80, z: 1600 }, { x: 70, y: 65, z: 800 },
      { x: 40, y: 25, z: 2200 }, { x: 85, y: 90, z: 300 },
    ],
  },
  {
    name: 'Infrastructure', color: PALETTE[3],
    data: [
      { x: 25, y: 35, z: 1400 }, { x: 60, y: 45, z: 1000 }, { x: 45, y: 70, z: 1700 },
      { x: 75, y: 55, z: 600 }, { x: 10, y: 80, z: 900 },
    ],
  },
];

// ─── Custom components ────────────────────────────────────────────────────────

/** Fixed-size dot for scatter chart */
const ScatterDot = (props: any) => {
  const { cx, cy, fill } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={BUBBLE_SIZE}
      fill={fill}
      fillOpacity={BUBBLE_OPACITY}
      stroke="none"
    />
  );
};

/** Reference line label with white background – positioned to the right of the line */
const RefLineLabel = (props: any) => {
  const { viewBox } = props;
  if (!viewBox) return null;
  const { x, y, width, height } = viewBox;
  const text = 'Average';
  const labelW = 78;
  const labelH = 22;
  const lx = x + width - labelW - 8; // right-aligned within chart area
  const ly = y - labelH / 2;         // "Right" = label centred on the reference line
  return (
    <g>
      <rect
        x={lx}
        y={ly}
        width={labelW}
        height={labelH}
        rx={3}
        fill={REF_LINE_LABEL_BG}
        fillOpacity={REF_LINE_LABEL_OPACITY}
        stroke={REF_LINE_COLOR}
        strokeWidth={0.5}
      />
      <text
        x={lx + labelW / 2}
        y={ly + 15}
        textAnchor="middle"
        fill={REF_LINE_LABEL_COLOR}
        fontSize={12}
        fontWeight={REF_LINE_LABEL_BOLD ? 700 : 400}
        fontFamily={FONT}
      >
        {text}
      </text>
    </g>
  );
};

/** Custom tooltip */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 6,
        padding: '8px 12px',
        fontFamily: FONT,
        fontSize: 14,
        color: '#374151',
      }}
    >
      <div>x: {d?.x}%</div>
      <div>y: {d?.y}%</div>
      {d?.z != null && <div>size: {d.z}</div>}
    </div>
  );
};

// ─── Shared axis / grid props ─────────────────────────────────────────────────
const gridProps = {
  strokeDasharray: '0',
  stroke: GRID_COLOR,
  strokeWidth: GRID_WIDTH,
  horizontal: GRID_SHOW_HORIZONTAL,
  vertical: GRID_SHOW_VERTICAL,
};

const xAxisProps = {
  type: 'number' as const,
  dataKey: 'x',
  domain: [0, 100] as [number, number],
  tickCount: 6,
  tick: {
    fill: X_COLOR,
    fontSize: X_SIZE,
    fontWeight: X_TEXT_BOLD ? 700 : 400,
    fontFamily: FONT,
  },
  axisLine: Y_SHOW_LINE ? { stroke: AXIS_LINE_COLOR, strokeWidth: AXIS_LINE_WIDTH } : false,
  tickLine: false,
  tickFormatter: (v: number) => `${v}%`,
};

const yAxisProps = {
  type: 'number' as const,
  dataKey: 'y',
  domain: [0, 100] as [number, number],
  tickCount: 6,
  tick: {
    fill: Y_COLOR,
    fontSize: Y_SIZE,
    fontWeight: Y_TEXT_BOLD ? 700 : 400,
    fontFamily: FONT,
  },
  axisLine: Y_SHOW_LINE ? { stroke: AXIS_LINE_COLOR, strokeWidth: AXIS_LINE_WIDTH } : false,
  tickLine: false,
  tickFormatter: (v: number) => `${v}%`,
};

// ─── Category Legend ──────────────────────────────────────────────────────────
function CategoryLegend() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        marginTop: 12,
        fontFamily: FONT,
        fontSize: CAT_LABEL_SIZE,
        fontWeight: CAT_LABEL_BOLD ? 700 : 400,
        color: CAT_LABEL_COLOR,
        background: CAT_LABEL_BG,
      }}
    >
      {CATEGORIES.map((cat) => (
        <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: cat.color,
            }}
          />
          {cat.name}
        </div>
      ))}
    </div>
  );
}

// ─── Scatter Chart Variant ────────────────────────────────────────────────────
function ScatterVariant({ showRefLine }: { showRefLine: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 30 }}>
          <CartesianGrid {...gridProps} />
          <XAxis {...xAxisProps}>
            {X_SHOW_TITLE && (
              <Label
                value="Effort"
                position="insideBottom"
                offset={-30}
                fill={X_COLOR}
                fontSize={X_SIZE}
                fontWeight={X_TEXT_BOLD ? 700 : 400}
                fontFamily={FONT}
              />
            )}
          </XAxis>
          <YAxis {...yAxisProps}>
            {Y_SHOW_TITLE && (
              <Label
                value="Impact"
                angle={-90}
                position="insideLeft"
                offset={20}
                fill={Y_COLOR}
                fontSize={Y_SIZE}
                fontWeight={Y_TEXT_BOLD ? 700 : 400}
                fontFamily={FONT}
              />
            )}
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          {showRefLine && (
            <ReferenceLine
              y={50}
              stroke={REF_LINE_COLOR}
              strokeWidth={REF_LINE_WIDTH}
              strokeDasharray="6 4"
              label={<RefLineLabel />}
            />
          )}
          {scatterSeriesData.map((series) => (
            <Scatter
              key={series.name}
              name={series.name}
              data={series.data}
              fill={series.color}
              shape={<ScatterDot />}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <CategoryLegend />
    </div>
  );
}

// ─── Bubble Chart Variant ─────────────────────────────────────────────────────
function BubbleVariant({ showRefLine }: { showRefLine: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 30 }}>
          <CartesianGrid {...gridProps} />
          <XAxis {...xAxisProps}>
            {X_SHOW_TITLE && (
              <Label
                value="Effort"
                position="insideBottom"
                offset={-30}
                fill={X_COLOR}
                fontSize={X_SIZE}
                fontWeight={X_TEXT_BOLD ? 700 : 400}
                fontFamily={FONT}
              />
            )}
          </XAxis>
          <YAxis {...yAxisProps}>
            {Y_SHOW_TITLE && (
              <Label
                value="Impact"
                angle={-90}
                position="insideLeft"
                offset={20}
                fill={Y_COLOR}
                fontSize={Y_SIZE}
                fontWeight={Y_TEXT_BOLD ? 700 : 400}
                fontFamily={FONT}
              />
            )}
          </YAxis>
          <ZAxis dataKey="z" range={[150, 2800]} name="Revenue" />
          <Tooltip content={<CustomTooltip />} />
          {showRefLine && (
            <ReferenceLine
              y={50}
              stroke={REF_LINE_COLOR}
              strokeWidth={REF_LINE_WIDTH}
              strokeDasharray="6 4"
              label={<RefLineLabel />}
            />
          )}
          {bubbleSeriesData.map((series) => (
            <Scatter
              key={series.name}
              name={series.name}
              data={series.data}
              fill={series.color}
              fillOpacity={BUBBLE_OPACITY}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <CategoryLegend />
    </div>
  );
}

// ─── Style Panel ──────────────────────────────────────────────────────────────
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
            <td className="p-2 border border-gray-300">{style}</td>
            <td className="p-2 border border-gray-300">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <h3
      className="text-sm font-semibold mb-3 px-3 py-2 rounded"
      style={{ fontFamily: FONT, background: color }}
    >
      {title}
    </h3>
  );
}

function SubHeader({ title }: { title: string }) {
  return (
    <h4 className="font-semibold mb-2 mt-5 text-sm" style={{ fontFamily: FONT }}>
      {title}
    </h4>
  );
}

function StylePanel({ showRefLine, onToggleRefLine }: { showRefLine: boolean; onToggleRefLine: () => void }) {
  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-5 bg-gray-50">
      <h2 className="text-base font-bold mb-5" style={{ fontFamily: FONT }}>
        Style Configuration
      </h2>

      {/* Basic styles */}
      <div className="mb-6">
        <SectionHeader title="Basic styles" color="#FEF3C7" />
        <SubHeader title="Bubbles" />
        <StyleTable
          rows={[
            ['Bubble size', String(BUBBLE_SIZE)],
            ['Bubble color', BUBBLE_COLOR],
            ['Bubble opacity', `${BUBBLE_OPACITY * 100}%`],
            ['Used palette', USED_PALETTE],
          ]}
        />
      </div>

      {/* Advanced styles */}
      <div className="mb-6">
        <SectionHeader title="Advanced styles" color="#E0E7FF" />

        <div className="flex items-center justify-between mb-2 mt-5">
          <h4 className="font-semibold text-sm" style={{ fontFamily: FONT }}>Reference line</h4>
          <button
            onClick={onToggleRefLine}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${showRefLine ? 'bg-blue-600' : 'bg-gray-300'}`}
            title={showRefLine ? 'Hide reference line' : 'Show reference line'}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${showRefLine ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <StyleTable
          rows={[
            ['Enabled', showRefLine ? 'Yes' : 'No'],
            ['Show label', REF_LINE_SHOW_LABEL ? 'Yes' : 'No'],
            ['Label position', REF_LINE_LABEL_POSITION],
            ['Label font family', REF_LINE_LABEL_FONT_FAMILY],
            ['Label bold', REF_LINE_LABEL_BOLD ? 'Yes' : 'No'],
            ['Label color', REF_LINE_LABEL_COLOR],
            ['Label size', String(REF_LINE_LABEL_SIZE)],
            ['Line style', REF_LINE_STYLE],
            ['Line color', REF_LINE_COLOR],
            ['Line width', String(REF_LINE_WIDTH)],
            ['Label background color', REF_LINE_LABEL_BG],
            ['Label background opacity', `${REF_LINE_LABEL_OPACITY * 100}%`],
            ['Label corners', '4'],
          ]}
        />

        <SubHeader title="Axes" />
        <StyleTable
          rows={[
            ['Enabled', AXES_ENABLED ? 'Enabled' : 'Disabled'],
            ['Shared measure axis as %', AXIS_SHARED_AS_PCT ? 'Enabled' : 'Disabled'],
            ['Axis line style', AXIS_LINE_STYLE],
            ['Axis line color', AXIS_LINE_COLOR],
            ['Axis line width', String(AXIS_LINE_WIDTH)],
          ]}
        />

        <SubHeader title="Axes / Y-Axis" />
        <StyleTable
          rows={[
            ['Show axis title', Y_SHOW_TITLE ? 'Enabled' : 'Disabled'],
            ['Show axis line', Y_SHOW_LINE ? 'Enabled' : 'Disabled'],
            ['Show axis labels', Y_SHOW_LABELS ? 'Enabled' : 'Disabled'],
            ['Font family', Y_FONT_FAMILY],
            ['Text bold', Y_TEXT_BOLD ? 'Enabled' : 'Disabled'],
            ['Color', Y_COLOR],
            ['Size', String(Y_SIZE)],
            ['Rotation', `${Y_ROTATION}°`],
          ]}
        />

        <SubHeader title="Axes / X-Axis" />
        <StyleTable
          rows={[
            ['Show axis title', X_SHOW_TITLE ? 'Enabled' : 'Disabled'],
            ['Show axis line', X_SHOW_LINE ? 'Enabled' : 'Disabled'],
            ['Show axis labels', X_SHOW_LABELS ? 'Enabled' : 'Disabled'],
            ['Font family', X_FONT_FAMILY],
            ['Text bold', X_TEXT_BOLD ? 'Enabled' : 'Disabled'],
            ['Color', X_COLOR],
            ['Size', String(X_SIZE)],
            ['Rotation', `${X_ROTATION}°`],
          ]}
        />

        <SubHeader title="Gridlines" />
        <StyleTable
          rows={[
            ['Show vertical gridlines', GRID_SHOW_VERTICAL ? 'Enabled' : 'Disabled'],
            ['Show horizontal gridlines', GRID_SHOW_HORIZONTAL ? 'Enabled' : 'Disabled'],
            ['Gridline style', GRID_STYLE],
            ['Line color', GRID_COLOR],
            ['Line width', String(GRID_WIDTH)],
          ]}
        />

        <SubHeader title="Category labels" />
        <StyleTable
          rows={[
            ['Position', CAT_LABEL_POSITION],
            ['Background color', CAT_LABEL_BG],
            ['Background opacity', `${CAT_LABEL_BG_OPACITY * 100}%`],
            ['Font family', CAT_LABEL_FONT_FAMILY],
            ['Bold', CAT_LABEL_BOLD ? 'Enabled' : 'Disabled'],
            ['Text color', CAT_LABEL_COLOR],
            ['Text size', String(CAT_LABEL_SIZE)],
          ]}
        />
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function ScatterView() {
  const [activeVariant, setActiveVariant] = useState<'scatter' | 'bubble'>('scatter');
  const [showRefLine, setShowRefLine] = useState(false);

  return (
    <div className="h-full flex">
      {/* Left — chart */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sub-tabs */}
        <div className="border-b border-gray-200 bg-white px-4">
          <div className="flex gap-1">
            {(['scatter', 'bubble'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveVariant(v)}
                className={`px-5 py-2 text-sm font-medium transition-colors capitalize ${
                  activeVariant === v
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                style={{ fontFamily: FONT }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 p-6 overflow-hidden">
          {activeVariant === 'scatter'
            ? <ScatterVariant showRefLine={showRefLine} />
            : <BubbleVariant showRefLine={showRefLine} />
          }
        </div>
      </div>

      {/* Right — style panel */}
      <StylePanel showRefLine={showRefLine} onToggleRefLine={() => setShowRefLine(v => !v)} />
    </div>
  );
}