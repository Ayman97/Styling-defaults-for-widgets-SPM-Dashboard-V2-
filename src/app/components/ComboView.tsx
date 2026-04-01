import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as echarts from 'echarts';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants (extracted exactly from style panel images) ───────────────

// Basic styles — Bars
const BAR_WIDTH_PCT    = '80%';   // bar category width usage
const CORNERS          = 8;
const BAR_COLOR_FIELD  = '#0B3A67'; // Used palette: Monochrome
const BAR_OPACITY      = 100;       // %
const USED_PALETTE     = 'Monochrome';
const CUSTOMIZE_SERIES = false;

// Monochrome palette — auto-assigned to bar series
const MONO_COLORS = ['#0B3A67', '#2B6CA3'];

// Basic styles — Line
const SMOOTH            = false;
const CUMULATIVE        = false;
const STEPPED_LINES     = false;
const MARKERS           = true;
const MARKER_SHAPE      = 'Circle';
const MARKER_SIZE       = 8;
const MARKER_COLOR      = '#0B3A67';
const MARKER_LABEL_SIZE = 12;
const LINE_STYLE_VAL    = 'Solid';
const LINE_COLOR        = '#0B3A67';
const LINE_WIDTH        = 2;

// Advanced — Reference line (disabled)
const REF_ENABLED     = false;
const REF_SHOW_LABEL  = true;
const REF_POSITION    = 'Below';
const REF_LABEL_FONT  = 'Auto';
const REF_LABEL_BOLD  = false;
const REF_LABEL_COLOR = '#374151';
const REF_LABEL_SIZE  = 12;
const REF_LINE_STYLE  = 'Dashed';
const REF_LINE_COLOR  = '#6B7280';
const REF_LINE_WIDTH  = 2;
const REF_BG_COLOR    = '#FFFFFF';
const REF_BG_OPC      = 100;
const REF_CORNERS     = 4;

// Advanced — Axes
const AXES_ENABLED      = true;
const AXIS_CROSSOVER    = true;
const AXIS_AS_PCT       = false;
const AXIS_LINE_STYLE_V = 'Solid';
const AXIS_LINE_COLOR   = '#E5E7EB';
const AXIS_LINE_WIDTH   = 1;

// Advanced — Y-Axis
const Y_TITLE   = false;
const Y_LINE    = false;
const Y_LABELS  = true;
const Y_FONT    = 'Auto';
const Y_BOLD    = false;
const Y_COLOR   = '#6B7280';
const Y_SIZE    = 12;
const Y_ROTATE  = 0;

// Advanced — X-Axis
const X_TITLE   = false;
const X_LINE    = false;
const X_LABELS  = true;
const X_FONT    = 'Auto';
const X_BOLD    = false;
const X_COLOR   = '#6B7280';
const X_SIZE    = 12;
const X_ROTATE  = 0;

// Advanced — Gridlines
const GRID_VERTICAL   = false;
const GRID_HORIZONTAL = true;
const GRID_TECHNICAL  = true;
const GRID_H_STYLE_V  = 'Solid';
const GRID_H_COLOR    = '#E5E7EB';
const GRID_H_WIDTH    = 1;

// Advanced — Data labels (position differs per variant)
const DL_ENABLED   = false;
const DL_POS_CLUST = 'Outside';
const DL_POS_STACK = 'Inside';
const DL_BG        = 'Transparent';
const DL_BG_OPC    = 0;
const DL_FONT      = 'Auto';
const DL_BOLD      = false;
const DL_COLOR     = '#374151';
const DL_SIZE      = 12;
const DL_CORNERS   = 4;
const DL_MISSING   = '–';
const DL_DECIMALS  = 1;
const DL_SHORT     = true;

// ─── Data ─────────────────────────────────────────────────────────────────────
const MONTHS   = ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26'];
const SERIES_A = [350, 450, 300, 100, 500, 250, 500]; // K — bar axis
const SERIES_B = [130,  90,  80,  60, 180, 100, 150]; // K — bar axis
const LINE_D   = [80,  100,  60,  20, 100,  80, 100]; // % — line axis

type Variant = 'clustered' | 'stacked';

// ─── ECharts option factory ───────────────────────────────────────────────────
function getOption(variant: Variant, showRefLine: boolean): echarts.EChartsCoreOption {
  const isStacked = variant === 'stacked';
  const stack     = isStacked ? 'bars' : undefined;

  // Stacked: A = bottom (rounded bottom corners only), B = top (rounded top corners only)
  // Clustered: both bars get rounded top corners
  const radiusA: number | number[] = isStacked ? [0, 0, CORNERS, CORNERS] : [CORNERS, CORNERS, 0, 0];
  const radiusB: number | number[] = [CORNERS, CORNERS, 0, 0];

  return {
    backgroundColor: '#FFFFFF',
    animation: false,
    color: MONO_COLORS,

    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: [8, 12],
      extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);',
            trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params: any) {
        let html = `<div style="font-family:${FONT};font-size:14px"><b>${params[0]?.axisValue}</b><br/>`;
        for (const p of params) {
          const isLine = p.seriesIndex === 2;
          const val    = isLine ? `${p.value}%` : `${p.value}K`;
          html += `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${p.color};margin-right:5px;vertical-align:middle"></span>${p.seriesName}: <b>${val}</b><br/>`;
        }
        return html + '</div>';
      },
      textStyle: { fontFamily: FONT },
    },

    grid: { left: 56, right: 56, top: 28, bottom: 38, containLabel: false },

    xAxis: {
      type:      'category',
      data:      MONTHS,
      axisLine:  { show: X_LINE, lineStyle: { color: AXIS_LINE_COLOR, width: AXIS_LINE_WIDTH } },
      axisTick:  { show: false },
      splitLine: { show: GRID_VERTICAL },
      axisLabel: {
        show:       X_LABELS,
        color:      X_COLOR,
        fontSize:   X_SIZE,
        fontFamily: FONT,
        fontWeight: X_BOLD ? 'bold' : 'normal',
        rotate:     X_ROTATE,
      },
    },

    yAxis: [
      {
        // Left — Bar axis (0K … 600K)
        type:     'value',
        min:      0,
        max:      600,
        interval: 100,
        axisLine: { show: Y_LINE, lineStyle: { color: AXIS_LINE_COLOR, width: AXIS_LINE_WIDTH } },
        axisTick: { show: false },
        splitLine: {
          show:      GRID_HORIZONTAL,
          lineStyle: { type: GRID_H_STYLE_V.toLowerCase() as any, color: GRID_H_COLOR, width: GRID_H_WIDTH },
        },
        axisLabel: {
          show:       Y_LABELS,
          color:      Y_COLOR,
          fontSize:   Y_SIZE,
          fontFamily: FONT,
          fontWeight: Y_BOLD ? 'bold' : 'normal',
          formatter:  (v: number) => `${v}K`,
        },
      },
      {
        // Right — Line axis (0% … 120%)
        type:     'value',
        min:      0,
        max:      120,
        interval: 20,
        axisLine: { show: Y_LINE, lineStyle: { color: AXIS_LINE_COLOR, width: AXIS_LINE_WIDTH } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show:       Y_LABELS,
          color:      Y_COLOR,
          fontSize:   Y_SIZE,
          fontFamily: FONT,
          fontWeight: Y_BOLD ? 'bold' : 'normal',
          formatter:  (v: number) => `${v}%`,
        },
      },
    ],

    series: [
      {
        name:           'Series A',
        type:           'bar',
        yAxisIndex:     0,
        stack,
        barCategoryGap: '20%',
        barGap:         '5%',
        data:           SERIES_A,
        itemStyle: {
          borderRadius: radiusA,
          opacity:      BAR_OPACITY / 100,
        },
        label: { show: DL_ENABLED },
      },
      {
        name:           'Series B',
        type:           'bar',
        yAxisIndex:     0,
        stack,
        barCategoryGap: '20%',
        barGap:         '5%',
        data:           SERIES_B,
        itemStyle: {
          borderRadius: radiusB,
          opacity:      BAR_OPACITY / 100,
        },
        label: { show: DL_ENABLED },
      },
      {
        name:       'Trend',
        type:       'line',
        yAxisIndex: 1,
        smooth:     SMOOTH,
        step:       STEPPED_LINES ? ('middle' as any) : false,
        data:       LINE_D,
        lineStyle: {
          type:   LINE_STYLE_VAL.toLowerCase() as any,
          color:  LINE_COLOR,
          width:  LINE_WIDTH,
        },
        itemStyle:  { color: MARKER_COLOR },
        symbol:     MARKERS ? 'circle' : 'none',
        symbolSize: MARKER_SIZE,
        label:      { show: DL_ENABLED },
        ...(showRefLine ? {
          markLine: {
            silent: true,
            data: [{ type: 'average', name: 'Average' }],
            lineStyle: { type: 'dashed' as const, color: REF_LINE_COLOR, width: REF_LINE_WIDTH },
            symbol: ['none', 'none'],
            label: {
              show: REF_SHOW_LABEL,
              position: REF_POSITION === 'Above' ? 'insideEndTop' : 'insideEndBottom',
              formatter: 'Average',
              fontSize: REF_LABEL_SIZE,
              color: REF_LABEL_COLOR,
              backgroundColor: REF_BG_COLOR,
              padding: [3, 6],
              borderRadius: REF_CORNERS,
              borderColor: REF_LINE_COLOR,
              borderWidth: 0.5,
            },
          },
        } : {}),
      },
    ],
  };
}

// ─── Chart component ──────────────────────────────────────────────────────────
function ComboChart({ variant, showRefLine }: { variant: Variant; showRefLine: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<echarts.ECharts | null>(null);

  const buildOption = useCallback((v: Variant) => getOption(v, showRefLine), [showRefLine]);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;
    chart.setOption(buildOption(variant));

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(containerRef.current!);
    return () => { ro.disconnect(); chart.dispose(); chartRef.current = null; };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(buildOption(variant), true);
  }, [variant, buildOption]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
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
      <h4 className="text-xs font-semibold tracking-wide text-gray-500 mb-2">{title}</h4>
      <StyleTable rows={rows} />
    </div>
  );
}

function StylePanel({ variant, showRefLine, onToggleRefLine }: { variant: Variant; showRefLine: boolean; onToggleRefLine: () => void }) {
  const dlPos = variant === 'clustered' ? DL_POS_CLUST : DL_POS_STACK;

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
          title="Bars"
          rows={[
            ['Bar width',           BAR_WIDTH_PCT],
            ['Corners',             `${CORNERS}`],
            ['Bar color',           BAR_COLOR_FIELD],
            ['Bar opacity',         `${BAR_OPACITY}%`],
            ['Used palette',        USED_PALETTE],
            ['Customize each series', 'No'],
          ]}
        />

        <div className="mb-5">
          <h4 className="text-xs font-semibold tracking-wide text-gray-500 mb-2">Bars / Series customization default</h4>
          <table className="w-full text-sm border-collapse" style={{ fontFamily: FONT }}>
            <thead>
              <tr style={{ background: '#B8D4E8' }}>
                <th className="text-left p-2 border border-gray-300">Series</th>
                <th className="text-left p-2 border border-gray-300">Color</th>
                <th className="text-left p-2 border border-gray-300">Opacity</th>
                <th className="text-left p-2 border border-gray-300">Corners</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((n) => (
                <tr key={n} style={{ background: '#fff' }}>
                  <td className="p-2 border border-gray-300 text-gray-700">Series {n}</td>
                  <td className="p-2 border border-gray-300 font-medium">{BAR_COLOR_FIELD}</td>
                  <td className="p-2 border border-gray-300 font-medium">{BAR_OPACITY}%</td>
                  <td className="p-2 border border-gray-300 font-medium">{CORNERS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Section
          title="Line"
          rows={[
            ['Smooth',           SMOOTH         ? 'Yes' : 'No'],
            ['Cumulative',       CUMULATIVE     ? 'Yes' : 'No'],
            ['Stepped lines',    STEPPED_LINES  ? 'Yes' : 'No'],
            ['Markers',          MARKERS        ? 'Yes' : 'No'],
            ['Marker shape',     MARKER_SHAPE],
            ['Marker size',      `${MARKER_SIZE}`],
            ['Marker color',     MARKER_COLOR],
            ['Marker label size',`${MARKER_LABEL_SIZE}`],
            ['Line style',       LINE_STYLE_VAL],
            ['Line color',       LINE_COLOR],
            ['Line width',       `${LINE_WIDTH}`],
            ['Customize each line', 'No'],
          ]}
        />

        <div className="mb-5">
          <h4 className="text-xs font-semibold tracking-wide text-gray-500 mb-2">Line / Line customization default</h4>
          <table className="w-full text-sm border-collapse" style={{ fontFamily: FONT }}>
            <thead>
              <tr style={{ background: '#B8D4E8' }}>
                <th className="text-left p-2 border border-gray-300">Line</th>
                <th className="text-left p-2 border border-gray-300">Smooth</th>
                <th className="text-left p-2 border border-gray-300">Stepped</th>
                <th className="text-left p-2 border border-gray-300">Markers</th>
                <th className="text-left p-2 border border-gray-300">Line style</th>
                <th className="text-left p-2 border border-gray-300">Line color</th>
                <th className="text-left p-2 border border-gray-300">Line width</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((n) => (
                <tr key={n} style={{ background: '#fff' }}>
                  <td className="p-2 border border-gray-300 text-gray-700">Line {n}</td>
                  <td className="p-2 border border-gray-300 font-medium">{SMOOTH ? 'Yes' : 'No'}</td>
                  <td className="p-2 border border-gray-300 font-medium">{STEPPED_LINES ? 'Yes' : 'No'}</td>
                  <td className="p-2 border border-gray-300 font-medium">{MARKERS ? 'Yes' : 'No'}</td>
                  <td className="p-2 border border-gray-300 font-medium">{LINE_STYLE_VAL}</td>
                  <td className="p-2 border border-gray-300 font-medium">{LINE_COLOR}</td>
                  <td className="p-2 border border-gray-300 font-medium">{LINE_WIDTH}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold tracking-wide text-gray-500">Reference line</h4>
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
            ['Enabled',                     showRefLine ? 'Yes' : 'No'],
            ['Show label',              REF_SHOW_LABEL ? 'Yes' : 'No'],
            ['Label position',          REF_POSITION],
            ['Label font family',       REF_LABEL_FONT],
            ['Label bold',              REF_LABEL_BOLD ? 'Yes' : 'No'],
            ['Label color',             REF_LABEL_COLOR],
            ['Label size',              `${REF_LABEL_SIZE}`],
            ['Line style',              REF_LINE_STYLE],
            ['Line color',              REF_LINE_COLOR],
            ['Line width',              `${REF_LINE_WIDTH}`],
            ['Label background color',  REF_BG_COLOR],
            ['Label background opacity',`${REF_BG_OPC}%`],
            ['Label corners',           `${REF_CORNERS}`],
          ]}
        />

        <div className="mt-5">
          <Section
            title="Axes"
            rows={[
              ['Enabled',                     AXES_ENABLED   ? 'Yes' : 'No'],
              ['Shared measure axis as %',    AXIS_AS_PCT    ? 'Yes' : 'No'],
              ['Axis line style',             AXIS_LINE_STYLE_V],
              ['Axis line color',             AXIS_LINE_COLOR],
              ['Axis line width',             `${AXIS_LINE_WIDTH}`],
            ]}
          />
        </div>

        <Section
          title="Y-Axis"
          rows={[
            ['Show axis title',  Y_TITLE  ? 'Yes' : 'No'],
            ['Show axis line',   Y_LINE   ? 'Yes' : 'No'],
            ['Show axis labels', Y_LABELS ? 'Yes' : 'No'],
            ['Font family',      Y_FONT],
            ['Bold',             Y_BOLD   ? 'Yes' : 'No'],
            ['Color',            Y_COLOR],
            ['Size',             `${Y_SIZE}`],
            ['Label rotation',   `${Y_ROTATE}°`],
          ]}
        />

        <Section
          title="X-Axis"
          rows={[
            ['Show axis title',  X_TITLE  ? 'Yes' : 'No'],
            ['Show axis line',   X_LINE   ? 'Yes' : 'No'],
            ['Show axis labels', X_LABELS ? 'Yes' : 'No'],
            ['Font family',      X_FONT],
            ['Bold',             X_BOLD   ? 'Yes' : 'No'],
            ['Color',            X_COLOR],
            ['Size',             `${X_SIZE}`],
            ['Label rotation',   `${X_ROTATE}°`],
          ]}
        />

        <Section
          title="Gridlines"
          rows={[
            ['Show vertical gridlines',    GRID_VERTICAL   ? 'Yes' : 'No'],
            ['Show horizontal gridlines',  GRID_HORIZONTAL ? 'Yes' : 'No'],
            ['Horizontal gridline style',  GRID_H_STYLE_V],
            ['Horizontal gridline color',  GRID_H_COLOR],
            ['Horizontal gridline width',  `${GRID_H_WIDTH}`],
          ]}
        />

        <Section
          title="Data labels"
          rows={[
            ['Enabled',                DL_ENABLED ? 'Yes' : 'No'],
            ['Position',               dlPos],
            ['Background color',       DL_BG],
            ['Background opacity',     `${DL_BG_OPC}%`],
            ['Font family',            DL_FONT],
            ['Bold',                   DL_BOLD    ? 'Yes' : 'No'],
            ['Color',                  DL_COLOR],
            ['Size',                   `${DL_SIZE}`],
            ['Label corners',          `${DL_CORNERS}`],
            ['Display missing value as', DL_MISSING],
            ['Decimals',               `${DL_DECIMALS}`],
            ['Short number',           DL_SHORT   ? 'Yes' : 'No'],
            ['Customize for each line', 'No'],
          ]}
        />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ComboView() {
  const [variant, setVariant] = useState<Variant>('clustered');
  const [showRefLine, setShowRefLine] = useState(false);

  const tabs: { key: Variant; label: string }[] = [
    { key: 'clustered', label: 'Clustered' },
    { key: 'stacked',   label: 'Stacked'   },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left — chart */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Sub-tabs */}
        <div className="border-b border-gray-200 bg-white px-4 shrink-0">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setVariant(t.key)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  variant === t.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
                }`}
                style={{ fontFamily: FONT }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-hidden bg-white p-4">
          <ComboChart key={variant} variant={variant} showRefLine={showRefLine} />
        </div>
      </div>

      {/* Right — style panel */}
      <StylePanel variant={variant} showRefLine={showRefLine} onToggleRefLine={() => setShowRefLine(v => !v)} />
    </div>
  );
}