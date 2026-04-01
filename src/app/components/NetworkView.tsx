import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants (extracted from style panel image) ───────────────────────

// Basic styles — Node
const NODE_SIZE        = 80;   // diameter (circle) — base/reference size
const NODE_BG          = '#FFFFFF';
const NODE_BG_OPC      = 100;
const NODE_PALETTE     = 'Monochrome';
const NODE_CORNERS     = 4;
const NODE_FONT_FAM    = 'Auto';
const NODE_BOLD        = false;
const TEXT_COLOR       = '#111827';
const TEXT_SIZE        = 14;
const NODE_BORDER_STYLE = 'None';
const NODE_BORDER_COLOR = '#E2E8F0';
const NODE_BORDER_WIDTH = 1;

// Advanced styles — Link
const LINE_TYPE     = 'Straight';
const LINE_STYLE    = 'Solid';
const LINE_COLOR    = '#E2E2E2';
const LINE_WIDTH    = 2;
const LINE_START    = 'None';
const LINE_END      = 'None';

// ─── Data (flat graph: nodes + edges) ────────────────────────────────────────

const NODES = [
  { id: 'digital',    name: 'Digital Portfolio',  amount: '$2.2M', value: 2200, fx: 0,    fy: 0    },
  { id: 'growth',     name: 'Growth Portfolio',   amount: '$800K', value: 800,  fx: -340, fy: -160 },
  { id: 'innov_por',  name: 'Innovation Por...',  amount: '$500K', value: 500,  fx: -120, fy: -220 },
  { id: 'tech',       name: 'Tech Ideas',         amount: '$400K', value: 400,  fx: 120,  fy: -220 },
  { id: 'market_co',  name: 'Market Co...',       amount: '$500K', value: 500,  fx: -220, fy: -60  },
  { id: 'innov_init', name: 'Innovatio...',       amount: '$600K', value: 600,  fx: 220,  fy: -60  },
  { id: 'mobile',     name: 'Mobil...',           amount: '$600K', value: 600,  fx: 340,  fy: -160 },
  { id: 'market_ex',  name: 'Market Exp...',      amount: '$300K', value: 300,  fx: -440, fy: -300 },
  { id: 'customer',   name: 'Customer...',        amount: '$300K', value: 300,  fx: 0,    fy: -320 },
  { id: 'ksa',        name: 'KSA L...',           amount: '$300K', value: 300,  fx: 60,   fy: -440 },
  { id: 'comm',       name: 'Comm...',            amount: '$200K', value: 200,  fx: -300, fy: -320 },
  { id: 'data_200a',  name: 'Data...',            amount: '$200K', value: 200,  fx: 180,  fy: -360 },
  { id: 'research',   name: 'Research...',        amount: '$100K', value: 100,  fx: -200, fy: -360 },
  { id: 'ai',         name: 'AI En...',           amount: '$100K', value: 100,  fx: 240,  fy: -340 },
  { id: 'crm',        name: 'CRM U...',           amount: '$50K',  value: 50,   fx: -80,  fy: -400 },
  { id: 'data_50',    name: 'Data...',            amount: '$50K',  value: 50,   fx: -40,  fy: -460 },
];

// Scale node diameter by sqrt of value (area ∝ budget)
const MIN_VAL = 50, MAX_VAL = 2200;
const MIN_SIZE = 40, MAX_SIZE = 160;
function nodeSize(value: number): number {
  const t = (Math.sqrt(value) - Math.sqrt(MIN_VAL)) / (Math.sqrt(MAX_VAL) - Math.sqrt(MIN_VAL));
  return Math.round(MIN_SIZE + t * (MAX_SIZE - MIN_SIZE));
}

const EDGES: { source: string; target: string }[] = [
  { source: 'digital',   target: 'growth'     },
  { source: 'digital',   target: 'innov_por'  },
  { source: 'digital',   target: 'tech'       },
  { source: 'digital',   target: 'market_co'  },
  { source: 'digital',   target: 'innov_init' },
  { source: 'digital',   target: 'customer'   },
  { source: 'digital',   target: 'mobile'     },
  { source: 'growth',    target: 'market_ex'  },
  { source: 'growth',    target: 'market_co'  },
  { source: 'growth',    target: 'comm'       },
  { source: 'innov_por', target: 'research'   },
  { source: 'innov_por', target: 'crm'        },
  { source: 'innov_por', target: 'data_50'    },
  { source: 'tech',      target: 'ai'         },
  { source: 'tech',      target: 'data_200a'  },
  { source: 'customer',  target: 'ksa'        },
];

// ─── ECharts option ───────────────────────────────────────────────────────────
function getOption(): echarts.EChartsCoreOption {
  return {
    backgroundColor: '#FAFAFA',
    animation: true,
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: [8, 12],
      extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);',
            trigger: 'item',
      formatter: (p: any) => {
        if (p.dataType !== 'node') return '';
        return `<div style="font-family:${FONT};font-size:14px;line-height:1.6">
          <b>${p.data.fullName ?? p.data.name}</b><br/>
          ${p.data.amount}
        </div>`;
      },
      textStyle: { fontFamily: FONT },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        force: {
          repulsion: 2800,
          gravity: 0.12,
          edgeLength: [120, 280],
          friction: 0.3,
          layoutAnimation: true,
        },
        // Circle nodes
        symbol: 'circle',
        // symbolSize is set per-node based on budget value
        itemStyle: {
          color: NODE_BG,
          opacity: NODE_BG_OPC / 100,
          borderColor: NODE_BORDER_COLOR,
          borderWidth: NODE_BORDER_STYLE === 'None' ? 0 : NODE_BORDER_WIDTH,
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (p: any) =>
            `{n|${p.data.name}}\n{a|${p.data.amount}}`,
          rich: {
            n: {
              fontSize: 11,
              color: TEXT_COLOR,
              fontFamily: FONT,
              fontWeight: NODE_BOLD ? 'bold' : 'normal',
              lineHeight: 15,
              align: 'center',
            },
            a: {
              fontSize: 10,
              color: '#6B7280',
              fontFamily: FONT,
              lineHeight: 13,
              align: 'center',
            },
          },
        },
        edgeSymbol: [LINE_START === 'None' ? 'none' : 'arrow', LINE_END === 'None' ? 'none' : 'arrow'],
        lineStyle: {
          type: LINE_STYLE.toLowerCase() as any,
          color: LINE_COLOR,
          width: LINE_WIDTH,
          curveness: 0,
        },
        emphasis: {
          focus: 'adjacency',
          itemStyle: {
            borderColor: '#9CA3AF',
            borderWidth: 2,
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.12)',
          },
          lineStyle: {
            color: '#9CA3AF',
            width: LINE_WIDTH + 1,
          },
        },
        data: NODES.map(n => ({
          id: n.id,
          name: n.name,
          fullName: n.name,
          amount: n.amount,
          symbolSize: nodeSize(n.value),
          // fixed initial positions to produce a stable hub layout
          x: n.fx,
          y: n.fy,
        })),
        links: EDGES,
      },
    ],
  };
}

// ─── Chart component ──────────────────────────────────────────────────────────
function NetworkChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const raf = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
      chartRef.current = chart;
      chart.setOption(getOption());

      const ro = new ResizeObserver(() => chart.resize());
      ro.observe(containerRef.current!);
    });

    return () => {
      cancelAnimationFrame(raf);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// ─── Style panel helpers ──────────────────────────────────────────────────────
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

function Section({ title, rows, note }: { title: string; rows: [string, string][]; note?: string }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h4>
      <StyleTable rows={rows} />
      {note && (
        <p className="mt-2 text-xs text-gray-500 italic px-1" style={{ fontFamily: FONT }}>{note}</p>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function NetworkView() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left — ECharts graph chart */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <NetworkChart />
      </div>

      {/* Right — scrollable style panel */}
      <div
        className="w-[320px] shrink-0 border-l border-gray-200 overflow-y-auto p-5 bg-gray-50"
        style={{ fontFamily: FONT }}
      >
        <h2 className="text-base font-bold mb-5">Style Configuration</h2>

        {/* Basic styles */}
        <div className="mb-6">
          <h3
            className="text-sm font-semibold mb-4 px-3 py-2 rounded"
            style={{ background: '#FEF3C7', color: '#92400E' }}
          >
            Basic styles
          </h3>
          <Section
            title="Node"
            rows={[
              ['Size',               'Auto'],
              ['Background color',   NODE_BG],
              ['Background opacity', `${NODE_BG_OPC}%`],
              ['Used palette',       NODE_PALETTE],
              ['Corners',            String(NODE_CORNERS)],
              ['Font family',        NODE_FONT_FAM],
              ['Bold',               NODE_BOLD ? 'Yes' : 'No'],
              ['Color',              TEXT_COLOR],
              ['Size',               `${TEXT_SIZE}`],
              ['Border style',       NODE_BORDER_STYLE],
              ['Border color',       NODE_BORDER_COLOR],
              ['Border width',       `${NODE_BORDER_WIDTH}`],
              ['Customize each node type', 'No'],
            ]}
            note="Default fixed size when not based on a measure: 140"
          />
        </div>

        {/* Advanced styles */}
        <div className="mb-6">
          <h3
            className="text-sm font-semibold mb-4 px-3 py-2 rounded"
            style={{ background: '#EDE9FE', color: '#5B21B6' }}
          >
            Advanced styles
          </h3>
          <Section
            title="Link"
            rows={[
              ['Line type',  LINE_TYPE],
              ['Line style', LINE_STYLE],
              ['Line color', LINE_COLOR],
              ['Line width', `${LINE_WIDTH}`],
              ['Line start', LINE_START],
              ['Line end',   LINE_END],
            ]}
          />
        </div>
      </div>
    </div>
  );
}