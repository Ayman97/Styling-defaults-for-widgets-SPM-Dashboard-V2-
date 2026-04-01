import React, { useRef, useCallback, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const radarData = [
  { category: 'Stage 1', value: 350000 },
  { category: 'Stage 2', value: 220000 },
  { category: 'Stage 3', value: 100000 },
  { category: 'Stage 4', value: 50000 },
  { category: 'Stage 5', value: 150000 },
  { category: 'Stage 6', value: 180000 },
];

const MAX_VAL = 500000;
const SPLIT_NUMBER = 5;
const SPLIT_STEP = MAX_VAL / SPLIT_NUMBER; // 100 000

const formatLabel = (v: number) => `${v / 1000}K`;
const formatMetricValue = (v: number) => formatLabel(v);

// Polygon line styling (B5)
const POLYGON_LINE_STYLE   = 'Solid';
const POLYGON_LINE_COLOR   = '#0B3A67';
const POLYGON_LINE_WIDTH   = 1;

// Category label background (B6)
const CAT_LABEL_BG_COLOR    = '#FFFFFF';
const CAT_LABEL_BG_OPACITY  = 0;

// Gridlines (B4)
const GRIDLINES_SHOW        = true;
const GRIDLINE_STYLE        = 'Solid';
const GRIDLINE_COLOR        = '#E2E8F0';
const GRIDLINE_WIDTH        = 1;

// Data labels (B3)
const DL_ENABLED      = false;
const DL_POSITION     = 'Above';
const DL_BG_COLOR     = '#FFFFFF';
const DL_BG_OPACITY   = 0;
const DL_FONT         = 'Auto';
const DL_BOLD         = false;
const DL_COLOR        = '#374151';
const DL_SIZE         = 12;
const DL_CORNERS      = 4;
const DL_MISSING      = '–';
const DL_DECIMALS     = 1;
const DL_SHORT_NUM    = true;

// Draw axis-scale labels only along the Stage 1 spoke (pointing straight up at 90°)
function addStage1AxisLabels(chart: any) {
  const width = chart.getWidth();
  const height = chart.getHeight();
  const cx = width / 2;
  const cy = height / 2;

  // ECharts radar radius '58%' is relative to min(width, height) / 2
  const radius = 0.58 * Math.min(width, height) / 2;

  // Stage 1 is the first indicator; default startAngle = 90° (pointing up)
  const angleRad = (90 * Math.PI) / 180;
  const dx = Math.cos(angleRad); // ≈ 0
  const dy = -Math.sin(angleRad); // = -1  (up in screen coords)

  const graphicElements: any[] = [];

  for (let i = 1; i <= SPLIT_NUMBER; i++) {
    const val = SPLIT_STEP * i;
    const ratio = val / MAX_VAL;
    const x = cx + dx * radius * ratio + 4; // +4px nudge right so label clears the spoke
    const y = cy + dy * radius * ratio;

    graphicElements.push({
      type: 'text',
      x,
      y,
      style: {
        text: formatLabel(val),
        fill: '#6B7280',
        fontSize: 12,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        textAlign: 'left',
        textVerticalAlign: 'middle',
      },
      silent: true,
    });
  }

  chart.setOption({ graphic: graphicElements });
}

const option = {
  tooltip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: [8, 12],
    extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);',
    trigger: 'item',
    textStyle: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, color: '#374151' },
    formatter: (p: any) => {
      if (!p.data) return '';
      const values = Array.isArray(p.data?.value)
        ? p.data.value
        : Array.isArray(p.value)
          ? p.value
          : radarData.map(d => d.value);
      return `<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:13px">${radarData
        .map((d, i) => `${d.category}: <b>${values[i] != null ? formatMetricValue(values[i]) : DL_MISSING}</b>`)
        .join('<br/>')}</div>`;
    },
  },
    radar: {
    indicator: radarData.map(d => ({ name: d.category, max: MAX_VAL })),
    radius: '58%',
    shape: 'polygon',
    axisLine: { lineStyle: { color: '#E5E7EB' } },
    splitLine: { lineStyle: { color: '#E5E7EB' } },
    splitArea: { show: false },
    axisName: {
      color: '#111827',
      fontSize: 16,
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 'bold',
      nameGap: 12,
    },
    // Hide the built-in labels on every axis; we'll draw them manually on Stage 1 only
    axisLabel: { show: false },
    splitNumber: SPLIT_NUMBER,
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: radarData.map(d => d.value),
          name: 'metrics',
        },
      ],
      lineStyle: { color: '#0B3A67', width: 2 },
      areaStyle: { color: '#0B3A67', opacity: 0.3 },
      symbol: 'none',
    },
  ],
};

export function RadarView() {
  const chartRef = useRef<ReactECharts>(null);

  const handleChartReady = useCallback((chart: any) => {
    addStage1AxisLabels(chart);
  }, []);

  // Re-draw labels after window resize so positions stay correct
  useEffect(() => {
    const handleResize = () => {
      const chart = (chartRef.current as any)?.getEchartsInstance?.();
      if (chart) addStage1AxisLabels(chart);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-full">
      {/* Left side - Radar Chart (Fixed) */}
      <div className="w-2/3 p-8 flex items-center justify-center">
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'svg' }}
          onChartReady={handleChartReady}
        />
      </div>

      {/* Right side - Style Tables (Scrollable) */}
      <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
        <h2 className="text-xl font-bold mb-6">Style Configuration</h2>

        {/* Basic styles - Polygons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded">Basic styles</h3>
          <h4 className="font-semibold mb-2">Polygons</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#B8D4E8]">
                <th className="text-left p-2 border border-gray-300">Style</th>
                <th className="text-left p-2 border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-gray-300">Area fill</td><td className="p-2 border border-gray-300">Enabled</td></tr>
              <tr><td className="p-2 border border-gray-300">Area color</td><td className="p-2 border border-gray-300">#0B3A67</td></tr>
              <tr><td className="p-2 border border-gray-300">Area opacity</td><td className="p-2 border border-gray-300">30%</td></tr>
              <tr><td className="p-2 border border-gray-300">Used palette</td><td className="p-2 border border-gray-300">Monochrome</td></tr>
              <tr><td className="p-2 border border-gray-300">Markers</td><td className="p-2 border border-gray-300">Enabled</td></tr>
              <tr><td className="p-2 border border-gray-300">Marker shape</td><td className="p-2 border border-gray-300">Circle</td></tr>
              <tr><td className="p-2 border border-gray-300">Marker size</td><td className="p-2 border border-gray-300">6</td></tr>
              <tr><td className="p-2 border border-gray-300">Marker color</td><td className="p-2 border border-gray-300">#FFFFFF</td></tr>
              <tr><td className="p-2 border border-gray-300">Marker border size</td><td className="p-2 border border-gray-300">2</td></tr>
              <tr><td className="p-2 border border-gray-300">Line style</td><td className="p-2 border border-gray-300">{POLYGON_LINE_STYLE}</td></tr>
              <tr><td className="p-2 border border-gray-300">Line color</td><td className="p-2 border border-gray-300">{POLYGON_LINE_COLOR}</td></tr>
              <tr><td className="p-2 border border-gray-300">Line width</td><td className="p-2 border border-gray-300">{POLYGON_LINE_WIDTH}</td></tr>
              <tr><td className="p-2 border border-gray-300">Customize each polygon</td><td className="p-2 border border-gray-300">Disabled</td></tr>
            </tbody>
          </table>
        </div>

        {/* Advanced styles */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-[#E8E1F5] px-3 py-2 rounded">Advanced styles</h3>

          {/* Category labels */}
          <h4 className="font-semibold mb-2">Category labels</h4>
          <table className="w-full text-sm border-collapse mb-6">
            <thead>
              <tr className="bg-[#B8D4E8]">
                <th className="text-left p-2 border border-gray-300">Style</th>
                <th className="text-left p-2 border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-gray-300">Background color</td><td className="p-2 border border-gray-300">{CAT_LABEL_BG_COLOR}</td></tr>
              <tr><td className="p-2 border border-gray-300">Background opacity</td><td className="p-2 border border-gray-300">{CAT_LABEL_BG_OPACITY}%</td></tr>
              <tr><td className="p-2 border border-gray-300">Font family</td><td className="p-2 border border-gray-300">Auto</td></tr>
              <tr><td className="p-2 border border-gray-300">Bold</td><td className="p-2 border border-gray-300">Yes</td></tr>
              <tr><td className="p-2 border border-gray-300">Color</td><td className="p-2 border border-gray-300">#111827</td></tr>
              <tr><td className="p-2 border border-gray-300">Size</td><td className="p-2 border border-gray-300">16</td></tr>
            </tbody>
          </table>

          {/* Gridlines */}
          <h4 className="font-semibold mb-2">Gridlines</h4>
          <table className="w-full text-sm border-collapse mb-6">
            <thead>
              <tr className="bg-[#B8D4E8]">
                <th className="text-left p-2 border border-gray-300">Style</th>
                <th className="text-left p-2 border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-gray-300">Show gridlines</td><td className="p-2 border border-gray-300">{GRIDLINES_SHOW ? 'Yes' : 'No'}</td></tr>
              <tr><td className="p-2 border border-gray-300">Gridline style</td><td className="p-2 border border-gray-300">{GRIDLINE_STYLE}</td></tr>
              <tr><td className="p-2 border border-gray-300">Gridline color</td><td className="p-2 border border-gray-300">{GRIDLINE_COLOR}</td></tr>
              <tr><td className="p-2 border border-gray-300">Gridline width</td><td className="p-2 border border-gray-300">{GRIDLINE_WIDTH}</td></tr>
            </tbody>
          </table>

          {/* Data labels */}
          <h4 className="font-semibold mb-2">Data labels</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#B8D4E8]">
                <th className="text-left p-2 border border-gray-300">Style</th>
                <th className="text-left p-2 border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-gray-300">Enabled</td><td className="p-2 border border-gray-300">{DL_ENABLED ? 'Yes' : 'No'}</td></tr>
              <tr><td className="p-2 border border-gray-300">Position</td><td className="p-2 border border-gray-300">{DL_POSITION}</td></tr>
              <tr><td className="p-2 border border-gray-300">Background color</td><td className="p-2 border border-gray-300">{DL_BG_COLOR}</td></tr>
              <tr><td className="p-2 border border-gray-300">Background opacity</td><td className="p-2 border border-gray-300">{DL_BG_OPACITY}%</td></tr>
              <tr><td className="p-2 border border-gray-300">Font family</td><td className="p-2 border border-gray-300">{DL_FONT}</td></tr>
              <tr><td className="p-2 border border-gray-300">Bold</td><td className="p-2 border border-gray-300">{DL_BOLD ? 'Yes' : 'No'}</td></tr>
              <tr><td className="p-2 border border-gray-300">Color</td><td className="p-2 border border-gray-300">{DL_COLOR}</td></tr>
              <tr><td className="p-2 border border-gray-300">Size</td><td className="p-2 border border-gray-300">{DL_SIZE}</td></tr>
              <tr><td className="p-2 border border-gray-300">Label corners</td><td className="p-2 border border-gray-300">{DL_CORNERS}</td></tr>
              <tr><td className="p-2 border border-gray-300">Display missing value as</td><td className="p-2 border border-gray-300">{DL_MISSING}</td></tr>
              <tr><td className="p-2 border border-gray-300">Decimals</td><td className="p-2 border border-gray-300">{DL_DECIMALS}</td></tr>
              <tr><td className="p-2 border border-gray-300">Short number</td><td className="p-2 border border-gray-300">{DL_SHORT_NUM ? 'Yes' : 'No'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
