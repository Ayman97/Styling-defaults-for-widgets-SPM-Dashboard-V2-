import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants ──────────────────────────────────────────────────────────
const BORDER_COLOR    = '#ffffff';
const LABEL_COLOR     = '#FFFFFF';
const LABEL_FONT_SIZE = 12;
const LABEL_BOLD      = false;          // image: Bold = No
const LABEL_BG        = 'Transparent';
const LABEL_BG_OPACITY = 0;             // 0%
const CAT_LABELS_ENABLED  = true;
const DATA_LABELS_ENABLED = true;
const DECIMALS        = 1;
const SHORT_NUMBER    = true;
const USED_PALETTE    = 'Monochrome';
const GAP_OUTER       = 4;
const GAP_INNER       = 2;
const SQUARE_COLOR    = '#0B3A67';
const SQUARE_OPACITY  = 100;
const SQUARE_CORNERS  = 4;

// Monochrome palette — 10 shades from dark to light, same system-wide palette
const MONO = [
  '#0B3A67',
  '#154E84',
  '#2B6CA3',
  '#4A88BC',
  '#6CA3CF',
  '#8FBBDC',
  '#B2D2EA',
  '#D6E8F5',
];

// ─── Formatter ────────────────────────────────────────────────────────────────
function fmt(val: number): string {
  if (!SHORT_NUMBER) return `$${val.toFixed(DECIMALS)}M`;
  if (val >= 1000)  return `$${(val / 1000).toFixed(DECIMALS)}B`;
  return `$${val.toFixed(DECIMALS)}M`;
}

// ─── Shared category definitions (used by both variants) ─────────────────────
// Each category gets its own monochrome color (same index in both variants)
const CATS = [
  { name: 'Digital Transformation', value: 16.5, color: MONO[0] },
  { name: 'Growth Initiatives',     value: 15.9, color: MONO[1] },
  { name: 'Operations Excellence',  value: 12.6, color: MONO[2] },
  { name: 'Infrastructure',         value:  9.8, color: MONO[3] },
  { name: 'Innovation',             value:  7.4, color: MONO[4] },
  { name: 'Marketing',              value:  6.2, color: MONO[5] },
  { name: 'Research',               value:  5.1, color: MONO[6] },
  { name: 'Compliance',             value:  3.8, color: MONO[7] },
];

// Variant 1 — flat, each category = its own monochrome shade
const DATA_FLAT = CATS.map(c => ({
  name:      c.name,
  value:     c.value,
  itemStyle: { color: c.color },
}));

// Sub-categories per parent (split ratios)
const SUBCATS: Record<string, { name: string; ratio: number }[]> = {
  'Digital Transformation': [
    { name: 'Cloud Migration',    ratio: 0.28 },
    { name: 'Data Platform',      ratio: 0.21 },
    { name: 'API Gateway',        ratio: 0.17 },
    { name: 'DevOps Pipeline',    ratio: 0.15 },
    { name: 'Security Ops',       ratio: 0.11 },
    { name: 'AI/ML Platform',     ratio: 0.08 },
  ],
  'Growth Initiatives': [
    { name: 'APAC Expansion',     ratio: 0.30 },
    { name: 'Product Launch',     ratio: 0.25 },
    { name: 'Partner Program',    ratio: 0.20 },
    { name: 'Demand Gen',         ratio: 0.15 },
    { name: 'SEO & Content',      ratio: 0.10 },
  ],
  'Operations Excellence': [
    { name: 'Process Automation', ratio: 0.32 },
    { name: 'Supply Chain',       ratio: 0.25 },
    { name: 'Quality Control',    ratio: 0.20 },
    { name: 'Vendor Mgmt',        ratio: 0.14 },
    { name: 'Facilities',         ratio: 0.09 },
  ],
  'Infrastructure': [
    { name: 'Data Center',        ratio: 0.35 },
    { name: 'Network Upgrade',    ratio: 0.27 },
    { name: 'Hardware Refresh',   ratio: 0.22 },
    { name: 'Edge Computing',     ratio: 0.16 },
  ],
  'Innovation': [
    { name: 'R&D Lab',            ratio: 0.38 },
    { name: 'Prototype Sprints',  ratio: 0.30 },
    { name: 'IP Portfolio',       ratio: 0.20 },
    { name: 'Hackathons',         ratio: 0.12 },
  ],
  'Marketing': [
    { name: 'Brand Refresh',      ratio: 0.35 },
    { name: 'Digital Ads',        ratio: 0.30 },
    { name: 'Social Media',       ratio: 0.22 },
    { name: 'CRM Platform',       ratio: 0.13 },
  ],
  'Research': [
    { name: 'Market Research',    ratio: 0.40 },
    { name: 'User Studies',       ratio: 0.35 },
    { name: 'Competitive Intel',  ratio: 0.25 },
  ],
  'Compliance': [
    { name: 'GDPR Programs',      ratio: 0.40 },
    { name: 'SOC 2 Audit',        ratio: 0.35 },
    { name: 'Policy Updates',     ratio: 0.25 },
  ],
};

// Variant 2 — 2-level, parent gets monochrome shade, children = same shade
// (white gaps create the subdivision — exactly like variant 1 but split)
const DATA_2L = CATS.map(cat => ({
  name:      cat.name,
  itemStyle: { color: cat.color },
  children:  (SUBCATS[cat.name] || []).map(sub => ({
    name:      sub.name,
    value:     parseFloat((cat.value * sub.ratio).toFixed(DECIMALS)),
    itemStyle: { color: cat.color }, // exact same shade — white gaps do the subdivision
  })),
}));

// ─── ECharts options ──────────────────────────────────────────────────────────

/** Variant 1 — flat, monochrome per category */
function getCategoryOption(): echarts.EChartsCoreOption {
  return {
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: [8, 12],
      extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);',
            formatter: (p: any) => `<b>${p.name}</b><br/>Budget: ${fmt(p.value)}`,
      textStyle: { fontFamily: FONT, fontSize: 14 },
    },
    series: [{
      type:       'treemap',
      data:       DATA_FLAT,
      top: 0, left: 0, right: 0, bottom: 0,
      roam:       false,
      nodeClick:  false as const,
      breadcrumb: { show: false },
      upperLabel: { show: false },
      label: {
        show:          true,
        position:      'insideTopLeft' as const,
        align:         'left' as const,
        verticalAlign: 'top' as const,
        padding:       [8, 10] as [number, number],
        color:         LABEL_COLOR,
        fontWeight:    LABEL_BOLD ? 700 : 400,
        fontSize:      LABEL_FONT_SIZE,
        fontFamily:    FONT,
        lineHeight:    18,
        formatter:     (p: any) => `${p.name}\n${fmt(p.value)}`,
      },
      itemStyle: { borderWidth: 0, gapWidth: 0, opacity: SQUARE_OPACITY / 100 },
      levels: [
        {
          // depth-0: virtual root — gapWidth here = gap between category tiles
          upperLabel: { show: false },
          itemStyle:  { borderWidth: 0, gapWidth: GAP_OUTER },
        },
        {
          // depth-1: category tiles (flat — no children)
          itemStyle: { borderWidth: 0, gapWidth: 0, borderRadius: SQUARE_CORNERS },
        },
      ],
      emphasis: {
        itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.35)' },
      },
    }],
  };
}

/** Variant 2 — same monochrome shades, children = same color, white gaps subdivide */
function getSubCatOption(): echarts.EChartsCoreOption {
  return {
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: [8, 12],
      extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);',
            formatter: (p: any) => {
        const path = (p.treePathInfo || []).map((n: any) => n.name).slice(1).join(' › ');
        return `<b>${path || p.name}</b><br/>Budget: ${fmt(p.value)}`;
      },
      textStyle: { fontFamily: FONT, fontSize: 14 },
    },
    series: [{
      type:       'treemap',
      data:       DATA_2L,
      top: 0, left: 0, right: 0, bottom: 0,
      roam:       false,
      nodeClick:  false as const,
      breadcrumb: { show: false },
      visibleMin: 80,
      label: {
        show:          true,
        position:      'insideTopLeft' as const,
        align:         'left' as const,
        verticalAlign: 'top' as const,
        padding:       [6, 8] as [number, number],
        color:         LABEL_COLOR,
        fontWeight:    LABEL_BOLD ? 700 : 400,
        fontSize:      LABEL_FONT_SIZE - 1,
        fontFamily:    FONT,
        lineHeight:    16,
        formatter:     (p: any) => `${p.name}\n${fmt(p.value)}`,
        overflow:      'truncate' as const,
      },
      upperLabel: { show: false },
      itemStyle: { borderWidth: 0, gapWidth: 0, opacity: SQUARE_OPACITY / 100 },
      levels: [
        {
          // depth-0: virtual root — gapWidth here = gap between category groups
          upperLabel: { show: false },
          itemStyle:  { borderWidth: 0, gapWidth: GAP_OUTER },
        },
        {
          // depth-1: category groups — gapWidth here = gap between sub-cat leaves
          upperLabel: { show: false },
          itemStyle:  { borderWidth: 0, gapWidth: GAP_INNER },
        },
        {
          // depth-2: leaf tiles
          itemStyle: { borderWidth: 0, gapWidth: 0, borderRadius: SQUARE_CORNERS },
        },
      ],
      emphasis: {
        itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.25)' },
      },
    }],
  };
}

// ─── Chart component ────────────��─────────────────────────────────────────────
type Variant = 'category' | 'subcat';

function TreemapChart({ variant }: { variant: Variant }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<echarts.ECharts | null>(null);

  const buildOption = useCallback(
    (v: Variant) => (v === 'category' ? getCategoryOption() : getSubCatOption()),
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;
    chart.setOption(buildOption(variant), true);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.dispose(); chartRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chartRef.current) chartRef.current.setOption(buildOption(variant), true);
  }, [variant, buildOption]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// ─── Style panel ──────────────────────────────────────────────────────────────
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

function StylePanel() {
  return (
    <div
      className="w-[320px] shrink-0 border-l border-gray-200 overflow-y-auto p-5 bg-gray-50"
      style={{ fontFamily: FONT }}
    >
      <h2 className="text-base font-bold mb-5">Style Configuration</h2>

      <div className="mb-7">
        <h3 className="text-sm font-semibold mb-3 px-3 py-2 rounded" style={{ background: '#FEF3C7' }}>
          Basic styles
        </h3>
        <h4 className="text-sm font-semibold mb-2 mt-3">Squares</h4>
        <StyleTable rows={[
          ['Category spacing',        String(GAP_OUTER)],
          ['Square color',            SQUARE_COLOR],
          ['Square opacity',          `${SQUARE_OPACITY}%`],
          ['Used palette',            USED_PALETTE],
          ['Corners',                 String(SQUARE_CORNERS)],
          ['Customize each category', 'No'],
        ]} />
      </div>

      <div className="mb-7">
        <h3 className="text-sm font-semibold mb-3 px-3 py-2 rounded" style={{ background: '#EDE9FE' }}>
          Advanced styles
        </h3>
        <h4 className="text-sm font-semibold mb-2 mt-3">Category labels</h4>
        <StyleTable rows={[
          ['Enabled',            CAT_LABELS_ENABLED ? 'Enabled' : 'Disabled'],
          ['Background color',   LABEL_BG],
          ['Background opacity', `${LABEL_BG_OPACITY}%`],
          ['Font family',        'Auto'],
          ['Bold',               LABEL_BOLD ? 'Yes' : 'No'],
          ['Color',              LABEL_COLOR],
          ['Size',               String(LABEL_FONT_SIZE)],
        ]} />
        <h4 className="text-sm font-semibold mb-2 mt-3">Data labels</h4>
        <StyleTable rows={[
          ['Enabled',                  DATA_LABELS_ENABLED ? 'Enabled' : 'Disabled'],
          ['Background color',         LABEL_BG],
          ['Background opacity',       `${LABEL_BG_OPACITY}%`],
          ['Font family',              'Auto'],
          ['Bold',                     LABEL_BOLD ? 'Yes' : 'No'],
          ['Color',                    LABEL_COLOR],
          ['Size',                     String(LABEL_FONT_SIZE)],
          ['Display missing value as', '–'],
          ['Decimals',                 String(DECIMALS)],
          ['Short number',             SHORT_NUMBER ? 'Yes' : 'No'],
        ]} />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function TreemapView() {
  const [variant, setVariant] = useState<Variant>('category');

  const tabs: { key: Variant; label: string }[] = [
    { key: 'category', label: 'Category' },
    { key: 'subcat',   label: 'Category + Sub Categories' },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left — chart */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-4 shrink-0">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setVariant(t.key)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  variant === t.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                style={{ fontFamily: FONT }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <TreemapChart key={variant} variant={variant} />
        </div>
      </div>

      {/* Right — style panel */}
      <StylePanel />
    </div>
  );
}