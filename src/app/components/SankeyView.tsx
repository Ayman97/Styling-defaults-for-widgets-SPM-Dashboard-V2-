import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// ─── Style constants (extracted from style panel image) ──────────────────────
const FONT = 'Plus Jakarta Sans, sans-serif';

// Basic styles > Visual
const LEVELS_LINKS_GAP = 12;
const COLOR = '#0B3A67';
const COLOR_OPACITY = 1.0;
const USED_PALETTE = 'Monochrome';

// Advanced styles > Link
const LINKS_SPACING = 1;
const LINK_COLOR_METHOD = 'Source level color';
const LINK_BG_COLOR = '#0B3A67';
const LINK_BG_OPACITY = 0.6;

// Advanced styles > Level
const LEVEL_WIDTH = 14;
const LEVELS_SPACING = 24;

// Advanced styles > Labels
const CATEGORY_LABELS_ENABLED = true;
const LEVEL_LABELS_ENABLED = true;
const DATA_LABELS_ENABLED = true;
const LABEL_POSITION = 'Outside';
const LABEL_BG_COLOR = '#FFFFFF';
const LABEL_BG_OPACITY = 1.0;
const LABEL_FONT_FAMILY = 'Auto';
const LABEL_BOLD = true;
const LABEL_TEXT_COLOR = '#111827';
const LABEL_TEXT_SIZE = 14;
const DISPLAY_MISSING_VALUE_AS = '–';
const LABEL_DECIMALS = 1;
const SHORT_NUMBER = true;
const DATA_LABELS_AS_TOTAL_PCT = false;
const LABEL_CORNERS = 4;

// ─── Monochrome palette shades ───────────────────────────────────────────────
// Different intensity shades of the base color for each level
const LEVEL_COLORS = [
  '#0B3A67', // Level 0 — Objective (darkest — palette[0])
  '#2B6CA3', // Level 1 — Portfolio (mid — palette[2])
  '#6CA3CF', // Level 2 — Project Status (lightest — palette[4])
];

// ─── Sankey Data ─────────────────────────────────────────────────────────────
// Structure from the reference image:
// Level 0 (Objective) → Level 1 (Portfolio) → Level 2 (Project Status)

const categoryLabels = ['Objective', 'Portfolio', 'Project Status'];

interface SankeyNode {
  name: string;
  depth: number;
  value: number;
  itemStyle: { color: string; opacity: number };
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  lineStyle: {
    color: string;
    opacity: number;
  };
}

const nodes: SankeyNode[] = [
  // Level 0 — Objective
  {
    name: 'Revenue Growth',
    depth: 0,
    value: 16,
    itemStyle: { color: LEVEL_COLORS[0], opacity: COLOR_OPACITY },
  },
  {
    name: 'Operational Efficiency',
    depth: 0,
    value: 15,
    itemStyle: { color: LEVEL_COLORS[0], opacity: COLOR_OPACITY },
  },
  {
    name: 'Innovation Leadership',
    depth: 0,
    value: 15,
    itemStyle: { color: LEVEL_COLORS[0], opacity: COLOR_OPACITY },
  },

  // Level 1 — Portfolio
  {
    name: 'Growth Initiatives',
    depth: 1,
    value: 15,
    itemStyle: { color: LEVEL_COLORS[1], opacity: COLOR_OPACITY },
  },
  {
    name: 'Digital Transformation',
    depth: 1,
    value: 12,
    itemStyle: { color: LEVEL_COLORS[1], opacity: COLOR_OPACITY },
  },
  {
    name: 'Operations Excellence',
    depth: 1,
    value: 7,
    itemStyle: { color: LEVEL_COLORS[1], opacity: COLOR_OPACITY },
  },
  {
    name: 'Infrastructure',
    depth: 1,
    value: 8,
    itemStyle: { color: LEVEL_COLORS[1], opacity: COLOR_OPACITY },
  },
  {
    name: 'Innovation',
    depth: 1,
    value: 4,
    itemStyle: { color: LEVEL_COLORS[1], opacity: COLOR_OPACITY },
  },

  // Level 2 — Project Status
  {
    name: 'On Track',
    depth: 2,
    value: 24,
    itemStyle: { color: LEVEL_COLORS[2], opacity: COLOR_OPACITY },
  },
  {
    name: 'At Risk',
    depth: 2,
    value: 14,
    itemStyle: { color: LEVEL_COLORS[2], opacity: COLOR_OPACITY },
  },
  {
    name: 'Off Track',
    depth: 2,
    value: 8,
    itemStyle: { color: LEVEL_COLORS[2], opacity: COLOR_OPACITY },
  },
];

// Links: Objective → Portfolio
const links: SankeyLink[] = [
  // Revenue Growth (16) → Growth Initiatives (10), Digital Transformation (6)
  { source: 'Revenue Growth', target: 'Growth Initiatives', value: 10, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },
  { source: 'Revenue Growth', target: 'Digital Transformation', value: 6, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },

  // Operational Efficiency (15) → Operations Excellence (7), Digital Transformation (4), Infrastructure (4)
  { source: 'Operational Efficiency', target: 'Operations Excellence', value: 7, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },
  { source: 'Operational Efficiency', target: 'Digital Transformation', value: 4, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },
  { source: 'Operational Efficiency', target: 'Infrastructure', value: 4, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },

  // Innovation Leadership (15) → Growth Initiatives (5), Infrastructure (4), Innovation (4), Digital Transformation (2)
  { source: 'Innovation Leadership', target: 'Growth Initiatives', value: 5, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },
  { source: 'Innovation Leadership', target: 'Infrastructure', value: 4, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },
  { source: 'Innovation Leadership', target: 'Innovation', value: 4, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },
  { source: 'Innovation Leadership', target: 'Digital Transformation', value: 2, lineStyle: { color: LEVEL_COLORS[0], opacity: LINK_BG_OPACITY } },

  // Portfolio  Project Status
  // Growth Initiatives (15) → On Track (10), At Risk (3), Off Track (2)
  { source: 'Growth Initiatives', target: 'On Track', value: 10, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Growth Initiatives', target: 'At Risk', value: 3, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Growth Initiatives', target: 'Off Track', value: 2, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },

  // Digital Transformation (12) → On Track (6), At Risk (4), Off Track (2)
  { source: 'Digital Transformation', target: 'On Track', value: 6, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Digital Transformation', target: 'At Risk', value: 4, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Digital Transformation', target: 'Off Track', value: 2, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },

  // Operations Excellence (7) → On Track (4), At Risk (2), Off Track (1)
  { source: 'Operations Excellence', target: 'On Track', value: 4, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Operations Excellence', target: 'At Risk', value: 2, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Operations Excellence', target: 'Off Track', value: 1, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },

  // Infrastructure (8) → On Track (3), At Risk (4), Off Track (1)
  { source: 'Infrastructure', target: 'On Track', value: 3, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Infrastructure', target: 'At Risk', value: 4, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Infrastructure', target: 'Off Track', value: 1, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },

  // Innovation (4) → On Track (1), At Risk (1), Off Track (2)
  { source: 'Innovation', target: 'On Track', value: 1, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Innovation', target: 'At Risk', value: 1, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
  { source: 'Innovation', target: 'Off Track', value: 2, lineStyle: { color: LEVEL_COLORS[1], opacity: LINK_BG_OPACITY } },
];

// ─── ECharts option ──────────────────────────────────────────────────────────
function getSankeyOption(): echarts.EChartsCoreOption {
  return {
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: [8, 12],
      extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);',
            trigger: 'item',
      triggerOn: 'mousemove',
      textStyle: {
        fontFamily: FONT,
      },
    },
    series: [
      {
        type: 'sankey',
        left: 120,
        right: 120,
        top: 50,
        bottom: 30,
        nodeWidth: LEVEL_WIDTH,
        nodeGap: LEVELS_LINKS_GAP,
        layoutIterations: 32,
        orient: 'horizontal',
        draggable: false,
        label: {
          show: DATA_LABELS_ENABLED,
          position: 'right' as const,
          align: 'left' as const,
          fontFamily: FONT,
          fontWeight: LABEL_BOLD ? 700 : 400,
          fontSize: LABEL_TEXT_SIZE,
          color: LABEL_TEXT_COLOR,
          backgroundColor: LABEL_BG_COLOR,
          borderRadius: LABEL_CORNERS,
          padding: [4, 6],
          formatter: (params: any) => {
            const val = params.value;
            return `{name|${params.name}}\n{count|${val} projects}`;
          },
          rich: {
            name: {
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: LABEL_TEXT_SIZE,
              color: LABEL_TEXT_COLOR,
              lineHeight: 20,
            },
            count: {
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: LABEL_TEXT_SIZE,
              color: '#9CA3AF',
              lineHeight: 20,
            },
          },
        },
        emphasis: {
          focus: 'adjacency',
        },
        lineStyle: {
          curveness: 0.5,
        },
        data: nodes,
        links: links,
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: LEVEL_COLORS[0],
              opacity: COLOR_OPACITY,
            },
            lineStyle: {
              color: 'source',
              opacity: LINK_BG_OPACITY,
            },
          },
          {
            depth: 1,
            itemStyle: {
              color: LEVEL_COLORS[1],
              opacity: COLOR_OPACITY,
            },
            lineStyle: {
              color: 'source',
              opacity: LINK_BG_OPACITY,
            },
          },
          {
            depth: 2,
            itemStyle: {
              color: LEVEL_COLORS[2],
              opacity: COLOR_OPACITY,
            },
            lineStyle: {
              color: 'source',
              opacity: LINK_BG_OPACITY,
            },
          },
        ],
      },
    ],
  };
}

// ─── Sankey Chart Component ──────────────────────────────────────────────────
function SankeyChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;
    chart.setOption(getSankeyOption());

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, []);

  // Draw category labels above each level column
  const labelPositions = [
    { label: 'Objective', left: '8%' },
    { label: 'Portfolio', left: '47%' },
    { label: 'Project Status', left: '85%' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Category labels */}
      {CATEGORY_LABELS_ENABLED &&
        labelPositions.map((pos) => (
          <span
            key={pos.label}
            style={{
              position: 'absolute',
              top: 12,
              left: pos.left,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 12,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            {pos.label}
          </span>
        ))}
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// ─── Style Configuration Panel ───────────────────────────────────────────────
function StyleConfiguration() {
  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: FONT }}>
        Style Configuration
      </h2>

      {/* Basic styles — Visual */}
      <div className="mb-8">
        <h3
          className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded"
          style={{ fontFamily: FONT }}
        >
          Basic styles
        </h3>
        <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>
          Visual
        </h4>
        <StyleTable
          rows={[
            ['Levels & links gap', String(LEVELS_LINKS_GAP)],
            ['Node color', COLOR],
            ['Color opacity', `${COLOR_OPACITY * 100}%`],
            ['Used palette', USED_PALETTE],
          ]}
        />
      </div>

      {/* Advanced styles */}
      <div className="mb-8">
        <h3
          className="text-lg font-semibold mb-3 bg-[#E8E1F5] px-3 py-2 rounded"
          style={{ fontFamily: FONT }}
        >
          Advanced styles
        </h3>

        {/* Link */}
        <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>
          Link
        </h4>
        <StyleTable
          rows={[
            ['Links spacing', String(LINKS_SPACING)],
            ['Color method', LINK_COLOR_METHOD],
            ['Background color', LINK_BG_COLOR],
            ['Background opacity', `${LINK_BG_OPACITY * 100}%`],
          ]}
        />

        {/* Level */}
        <h4 className="font-semibold mb-2 mt-6" style={{ fontFamily: FONT }}>
          Level
        </h4>
        <StyleTable
          rows={[
            ['Level width', String(LEVEL_WIDTH)],
            ['Levels spacing', String(LEVELS_SPACING)],
          ]}
        />

        {/* Category labels */}
        <h4 className="font-semibold mb-2 mt-6" style={{ fontFamily: FONT }}>
          Category labels
        </h4>
        <StyleTable
          rows={[
            ['Enabled', CATEGORY_LABELS_ENABLED ? 'Yes' : 'No'],
            ['Position', LABEL_POSITION],
            ['Background color', LABEL_BG_COLOR],
            ['Background opacity', `${LABEL_BG_OPACITY * 100}%`],
            ['Font family', LABEL_FONT_FAMILY],
            ['Bold', LABEL_BOLD ? 'Yes' : 'No'],
            ['Color', LABEL_TEXT_COLOR],
            ['Size', String(LABEL_TEXT_SIZE)],
          ]}
        />

        {/* Level labels */}
        <h4 className="font-semibold mb-2 mt-6" style={{ fontFamily: FONT }}>
          Level labels
        </h4>
        <StyleTable
          rows={[
            ['Enabled', LEVEL_LABELS_ENABLED ? 'Yes' : 'No'],
            ['Position', LABEL_POSITION],
            ['Background color', LABEL_BG_COLOR],
            ['Background opacity', `${LABEL_BG_OPACITY * 100}%`],
            ['Font family', LABEL_FONT_FAMILY],
            ['Bold', LABEL_BOLD ? 'Yes' : 'No'],
            ['Color', LABEL_TEXT_COLOR],
            ['Size', String(LABEL_TEXT_SIZE)],
          ]}
        />

        {/* Data labels */}
        <h4 className="font-semibold mb-2 mt-6" style={{ fontFamily: FONT }}>
          Data labels
        </h4>
        <StyleTable
          rows={[
            ['Enabled', DATA_LABELS_ENABLED ? 'Yes' : 'No'],
            ['Position', LABEL_POSITION],
            ['Background color', LABEL_BG_COLOR],
            ['Background opacity', `${LABEL_BG_OPACITY * 100}%`],
            ['Font family', LABEL_FONT_FAMILY],
            ['Bold', LABEL_BOLD ? 'Yes' : 'No'],
            ['Color', LABEL_TEXT_COLOR],
            ['Size', String(LABEL_TEXT_SIZE)],
            ['Label corners', String(LABEL_CORNERS)],
            ['Display missing value as', DISPLAY_MISSING_VALUE_AS],
            ['Decimals', String(LABEL_DECIMALS)],
            ['Short number', SHORT_NUMBER ? 'Yes' : 'No'],
            ['Data labels as total %', DATA_LABELS_AS_TOTAL_PCT ? 'Yes' : 'No'],
          ]}
        />
      </div>
    </div>
  );
}

function StyleTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-sm border-collapse" style={{ fontFamily: FONT }}>
      <thead>
        <tr className="bg-[#B8D4E8]">
          <th className="text-left p-2 border border-gray-300">Style</th>
          <th className="text-left p-2 border border-gray-300">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([style, value], i) => (
          <tr key={`${style}-${i}`}>
            <td className="p-2 border border-gray-300">{style}</td>
            <td className="p-2 border border-gray-300">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function SankeyView() {
  return (
    <div className="h-full flex">
      {/* Left side — Sankey visualization */}
      <div className="w-2/3 p-4" style={{ minHeight: 500 }}>
        <SankeyChart />
      </div>

      {/* Right side — Style Configuration */}
      <StyleConfiguration />
    </div>
  );
}