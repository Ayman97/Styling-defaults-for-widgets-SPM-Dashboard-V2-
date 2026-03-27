import React, { useState, useRef, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart as EBarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([EBarChart, GridComponent, TooltipComponent, LegendComponent, MarkLineComponent, CanvasRenderer]);

// Data: Tasks by Status across Departments (variable totals per category)
const barData = [
  { category: 'Engineering', Completed: 145, InProgress: 38, Blocked: 22 },
  { category: 'Product', Completed: 98, InProgress: 52, Blocked: 15 },
  { category: 'Marketing', Completed: 74, InProgress: 45, Blocked: 30 },
  { category: 'Sales', Completed: 120, InProgress: 35, Blocked: 8 },
  { category: 'Support', Completed: 55, InProgress: 60, Blocked: 42 },
];

const categories = barData.map(d => d.category);
const completedValues = barData.map(d => d.Completed);
const inProgressValues = barData.map(d => d.InProgress);
const blockedValues = barData.map(d => d.Blocked);

// 100% normalized
const percentageData = barData.map(d => {
  const total = d.Completed + d.InProgress + d.Blocked;
  return {
    Completed: (d.Completed / total) * 100,
    InProgress: (d.InProgress / total) * 100,
    Blocked: (d.Blocked / total) * 100,
  };
});
const completedPct = percentageData.map(d => d.Completed);
const inProgressPct = percentageData.map(d => d.InProgress);
const blockedPct = percentageData.map(d => d.Blocked);

// Style constants
const BASE_COLOR = '#0B3A67';
// Unified monochrome palette — sequential assignment per series
const MONO_PALETTE = [
  '#0B3A67',  // Series 1
  '#2B6CA3',  // Series 2
  '#6CA3CF',  // Series 3
];

// Keep rgba helper for tooltip dot rendering only
function getRgbaColor(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
const SERIES_RGBA = MONO_PALETTE; // direct palette colors, no opacity reduction

const AXIS_LABEL_STYLE = { color: '#6B7280', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400 };
const GRID_LINE_COLOR = '#E5E7EB';
const BAR_CORNER_RADIUS = 8;

type BarSubTab = 'clustered-vertical' | 'clustered-horizontal' | 'stacked-vertical' | 'stacked-horizontal' | '100-stacked-vertical' | '100-stacked-horizontal';
type LabelPos = 'outside' | 'top' | 'middle' | 'bottom' | 'left' | 'right';

// Position options available per variant
function getPosOptions(variant: BarSubTab): LabelPos[] {
  if (variant === 'clustered-vertical') return ['outside', 'top', 'middle', 'bottom'];
  if (variant === 'clustered-horizontal') return ['outside', 'left', 'middle', 'right'];
  if (variant === 'stacked-vertical' || variant === '100-stacked-vertical') return ['top', 'middle', 'bottom'];
  return ['left', 'middle', 'right']; // stacked-horizontal, 100-stacked-horizontal
}

function getDefaultPos(variant: BarSubTab): LabelPos {
  return variant.includes('clustered') ? 'outside' : 'middle';
}

function getPosLabel(pos: LabelPos): string {
  return pos.charAt(0).toUpperCase() + pos.slice(1);
}

export function BarView() {
  const [activeSubTab, setActiveSubTab] = useState<BarSubTab>('clustered-vertical');
  const [showRefLine, setShowRefLine] = useState(false);
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [labelPos, setLabelPos] = useState<LabelPos>('outside');

  // Reset position to a valid default when variant changes
  const handleTabChange = (tab: BarSubTab) => {
    setActiveSubTab(tab);
    const options = getPosOptions(tab);
    setLabelPos(prev => options.includes(prev) ? prev : getDefaultPos(tab));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sub Tabs */}
      <div className="border-b border-gray-300 bg-gray-50">
        <div className="flex gap-1 px-4">
          {([
            ['clustered-vertical', 'Clustered Vertical'],
            ['clustered-horizontal', 'Clustered Horizontal'],
            ['stacked-vertical', 'Stacked Vertical'],
            ['stacked-horizontal', 'Stacked Horizontal'],
            ['100-stacked-vertical', '100% Stacked Vertical'],
            ['100-stacked-horizontal', '100% Stacked Horizontal'],
          ] as [BarSubTab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeSubTab === key
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left side - Chart */}
        <div className="w-2/3 p-8 flex items-center justify-center">
          <BarChartECharts variant={activeSubTab} showRefLine={showRefLine} showDataLabels={showDataLabels} labelPos={labelPos} />
        </div>

        {/* Right side - Style Configuration */}
        <StyleConfiguration variant={activeSubTab} showRefLine={showRefLine} onToggleRefLine={() => setShowRefLine(v => !v)} showDataLabels={showDataLabels} onToggleDataLabels={() => setShowDataLabels(v => !v)} labelPos={labelPos} onChangeLabelPos={setLabelPos} />
      </div>
    </div>
  );
}

function BarChartECharts({ variant, showRefLine, showDataLabels, labelPos }: { variant: BarSubTab; showRefLine: boolean; showDataLabels: boolean; labelPos: LabelPos }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  const isHorizontal = variant.includes('horizontal');
  const isStacked = variant.includes('stacked') && !variant.includes('clustered');
  const isClustered = variant.includes('clustered');
  const isPercent = variant.includes('100-stacked');
  // Stacked but not 100% stacked
  const isStackedCumulative = isStacked && !isPercent;

  const dataCompleted = isPercent ? completedPct : completedValues;
  const dataInProgress = isPercent ? inProgressPct : inProgressValues;
  const dataBlocked = isPercent ? blockedPct : blockedValues;

  const stackValue = isStacked ? 'total' : undefined;

  const getBarRadius = (seriesIdx: number, isLastInStack: boolean): number | number[] => {
    if (isClustered) {
      if (isHorizontal) {
        return [0, BAR_CORNER_RADIUS, BAR_CORNER_RADIUS, 0];
      }
      return [BAR_CORNER_RADIUS, BAR_CORNER_RADIUS, 0, 0];
    }
    if (isLastInStack) {
      if (isHorizontal) {
        return [0, BAR_CORNER_RADIUS, BAR_CORNER_RADIUS, 0];
      }
      return [BAR_CORNER_RADIUS, BAR_CORNER_RADIUS, 0, 0];
    }
    return 0;
  };

  const barWidth = isClustered ? '15%' : '68%';

  const makeBarSeries = (
    name: string,
    data: number[],
    seriesIdx: number,
    isLast: boolean
  ) => {
    // Map labelPos to ECharts position string
    const echartsPos = (() => {
      if (labelPos === 'outside') return isHorizontal ? 'right' : 'top';
      if (labelPos === 'top') return 'insideTop';
      if (labelPos === 'bottom') return 'insideBottom';
      if (labelPos === 'left') return 'insideLeft';
      if (labelPos === 'right') return 'insideRight';
      return 'inside'; // middle
    })();

    const echartsAlign = (() => {
      if (labelPos === 'left') return 'left';
      if (labelPos === 'right') return 'right';
      return 'center';
    })();

    const isOutside = labelPos === 'outside';

    return {
      name,
      type: 'bar' as const,
      stack: stackValue,
      data,
      barWidth,
      barGap: '20%',
      itemStyle: {
        color: SERIES_RGBA[seriesIdx],
        borderRadius: getBarRadius(seriesIdx, isLast),
      },
      label: {
        show: showDataLabels,
        position: echartsPos as any,
        align: echartsAlign,
        distance: (isOutside && isHorizontal) ? 16 : 0,
        fontSize: 12,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        color: isOutside ? '#111827' : '#FFFFFF',
        fontWeight: 'bold' as const,
        backgroundColor: 'transparent',
        padding: [3, 6] as [number, number],
        borderRadius: 8,
        formatter: isPercent ? (p: any) => `${Number(p.value).toFixed(1)}%` : '{c}',
      },
    };
  };

  const series = [
    makeBarSeries('Completed', dataCompleted, 0, false),
    makeBarSeries('In Progress', dataInProgress, 1, false),
    makeBarSeries('Blocked', dataBlocked, 2, true),
  ];

  if (showRefLine) {
    (series[0] as any).markLine = {
      silent: true,
      data: [{ type: 'average', name: 'Average' }],
      lineStyle: { type: 'dashed', color: '#6B7280', width: 2 },
      symbol: ['none', 'none'],
      label: {
        show: true,
        position: 'insideEndTop',
        formatter: 'Average',
        fontSize: 11,
        color: '#334155',
        backgroundColor: '#FFFFFF',
        padding: [3, 6],
        borderRadius: 3,
        borderColor: '#6B7280',
        borderWidth: 0.5,
      },
    };
  }

  const tooltipFormatter = (params: any) => {
    const items = Array.isArray(params) ? params : [params];
    let result = `<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:12px"><strong>${items[0].axisValueLabel}</strong>`;
    items.forEach((p: any) => {
      const color = SERIES_RGBA[p.seriesIndex];
      const val = isPercent ? `${Number(p.value).toFixed(1)}%` : p.value;
      result += `<br/><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${color};margin-right:6px;"></span>${p.seriesName}: ${val}`;
    });
    result += '</div>';
    return result;
  };

  const categoryAxisConfig: any = {
    type: 'category',
    data: categories,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { ...AXIS_LABEL_STYLE, rotate: 0 },
    splitLine: { show: false },
  };

  // Determine value axis max
  // - 100% stacked: 0-100
  // - Others: auto
  const getValueAxisExtras = () => {
    if (isPercent) return { min: 0, max: 100 };
    return {};
  };

  const valueAxisConfig: any = {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      ...AXIS_LABEL_STYLE,
      rotate: 0,
      formatter: isPercent ? '{value}%' : '{value}',
    },
    splitLine: {
      show: true,
      lineStyle: { color: GRID_LINE_COLOR, width: 1, type: 'solid' as const },
    },
    ...getValueAxisExtras(),
  };

  const option: any = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: tooltipFormatter,
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: '#334155' },
      itemStyle: { borderWidth: 0 },
    },
    grid: {
      left: 60,
      right: 30,
      top: 20,
      bottom: 50,
      containLabel: true,
    },
    series,
  };

  if (isHorizontal) {
    option.yAxis = { ...categoryAxisConfig };
    option.xAxis = { ...valueAxisConfig };
  } else {
    option.xAxis = { ...categoryAxisConfig };
    option.yAxis = { ...valueAxisConfig };
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 300 }}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ width: dimensions.width, height: dimensions.height }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}

// ─── Style Configuration (right-side scrollable panel, matching other charts) ─
function StyleConfiguration({ variant, showRefLine, onToggleRefLine, showDataLabels, onToggleDataLabels, labelPos, onChangeLabelPos }: {
  variant: BarSubTab;
  showRefLine: boolean;
  onToggleRefLine: () => void;
  showDataLabels: boolean;
  onToggleDataLabels: () => void;
  labelPos: LabelPos;
  onChangeLabelPos: (p: LabelPos) => void;
}) {
  const isPercent = variant.includes('100-stacked');
  const isClustered = variant.includes('clustered');
  const isHorizontal = variant.includes('horizontal');
  const isStacked = !isClustered;

  const posOptions = getPosOptions(variant);
  const isOutside = labelPos === 'outside';

  const variantLabel = (() => {
    if (variant === 'clustered-vertical') return 'Clustered Vertical';
    if (variant === 'clustered-horizontal') return 'Clustered Horizontal';
    if (variant === 'stacked-vertical') return 'Stacked Vertical';
    if (variant === 'stacked-horizontal') return 'Stacked Horizontal';
    if (variant === '100-stacked-vertical') return '100% Stacked Vertical';
    return '100% Stacked Horizontal';
  })();

  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Style Configuration</h2>
      <p className="text-xs text-gray-500 mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Variant: {variantLabel}</p>

      {/* Basic styles - Bars */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Basic styles</h3>
        <h4 className="font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Bars</h4>
        <StyleTable rows={[
          ['Bar width', isClustered ? '60%' : '68%'],
          ['Bar corners', '8'],
          ['Bar color', BASE_COLOR],
          ['Bar opacity', '100%'],
          ['Used palette', 'Monochrome'],
        ]} />
      </div>

      {/* Advanced styles - Reference line */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 bg-[#E8E1F5] px-3 py-2 rounded" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Advanced styles</h3>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Reference line</h4>
          <button
            onClick={onToggleRefLine}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${showRefLine ? 'bg-blue-600' : 'bg-gray-300'}`}
            title={showRefLine ? 'Hide reference line' : 'Show reference line'}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${showRefLine ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <StyleTable rows={[
          ['Enabled', showRefLine ? 'Yes' : 'No'],
          ['Show label', 'Yes'],
          ['Label position', isHorizontal ? 'Right' : 'Below'],
          ['Label font family', 'Auto'],
          ['Label bold', 'No'],
          ['Label color', '#374151'],
          ['Label size', '12'],
          ['Line style', 'Dashed'],
          ['Line color', '#6B7280'],
          ['Line width', '2'],
          ['Label background color', '#FFFFFF'],
          ['Label background opacity', '100%'],
          ['Label corners', '4'],
        ]} />
      </div>

      {/* Data labels */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Data labels</h4>
          <button
            onClick={onToggleDataLabels}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${showDataLabels ? 'bg-blue-600' : 'bg-gray-300'}`}
            title={showDataLabels ? 'Hide data labels' : 'Show data labels'}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${showDataLabels ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <StyleTable rows={[
          ['Enabled', showDataLabels ? 'Yes' : 'No'],
          ['Position', getPosLabel(labelPos)],
          ['Background color', 'Transparent'],
          ['Background opacity', '0%'],
          ['Font family', 'Auto'],
          ['Bold', 'Yes'],
          ['Color', isOutside ? '#111827' : '#FFFFFF'],
          ['Size', '12'],
          ['Label corners', '8'],
          ['Display missing value as', '–'],
          ['Decimals', '1'],
          ['Short number', 'Yes'],
        ]} />
        <div className="mt-2 flex gap-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {posOptions.map(pos => (
            <button
              key={pos}
              onClick={() => onChangeLabelPos(pos)}
              className={`flex-1 py-1 text-xs rounded border transition-colors ${
                labelPos === pos
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {getPosLabel(pos)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {isOutside
            ? 'Note: Labels are placed outside the bar. Text color is #111827 for readability on light backgrounds.'
            : 'Note: Labels are placed inside the bar segment. Text color is #FFFFFF for readability on dark bar fills.'}
        </p>
      </div>

      {/* Axes */}
      <div className="mb-8">
        <h4 className="font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Axes</h4>
        <StyleTable rows={[
          ['Enabled', 'Yes'],
          ['Shared measure axis as %', isPercent ? 'Yes' : 'No'],
          ['Axis line style', 'Solid'],
          ['Axis line color', '#E5E7EB'],
          ['Axis line width', '1'],
        ]} />

        <h4 className="font-semibold mb-2 mt-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {isHorizontal ? 'Y-Axis (Categories)' : 'Y-Axis (Values)'}
        </h4>
        <StyleTable rows={[
          ['Show axis title', 'No'],
          ['Show axis line', 'No'],
          ['Show axis labels', 'Yes'],
          ['Font family', 'Auto'],
          ['Text bold', 'No'],
          ['Text color', '#6B7280'],
          ['Text size', '12'],
          ['Rotation', '0°'],
        ]} />

        <h4 className="font-semibold mb-2 mt-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {isHorizontal ? 'X-Axis (Values)' : 'X-Axis (Categories)'}
        </h4>
        <StyleTable rows={[
          ['Show axis title', 'No'],
          ['Show axis line', 'No'],
          ['Show axis labels', 'Yes'],
          ['Font family', 'Auto'],
          ['Text bold', 'No'],
          ['Text color', '#6B7280'],
          ['Text size', '12'],
          ['Rotation', '0°'],
        ]} />
      </div>

      {/* Gridlines */}
      <div className="mb-8">
        <h4 className="font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Gridlines</h4>
        <StyleTable rows={[
          ['Show vertical gridlines', isHorizontal ? 'Yes' : 'No'],
          ['Show horizontal gridlines', isHorizontal ? 'No' : 'Yes'],
          [isHorizontal ? 'Vertical gridline style' : 'Horizontal gridline style', 'Solid'],
          [isHorizontal ? 'Vertical gridline color' : 'Horizontal gridline color', '#E5E7EB'],
          [isHorizontal ? 'Vertical gridline width' : 'Horizontal gridline width', '1'],
        ]} />
      </div>
    </div>
  );
}

function StyleTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-sm border-collapse" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
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