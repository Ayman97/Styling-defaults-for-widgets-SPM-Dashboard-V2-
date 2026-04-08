import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChartView } from './components/LineChartView';
import { DonutChartView } from './components/DonutChartView';
import { TableView } from './components/TableView';
import { ListView } from './components/ListView';
import { RadarView } from './components/RadarView';
import { BarView } from './components/BarView';
import { TimelineView } from './components/TimelineView';
import { SankeyView } from './components/SankeyView';
import { ScatterView } from './components/ScatterView';
import { HierarchyView } from './components/HierarchyView';
import { TreemapView } from './components/TreemapView';
import { HeatmapView } from './components/HeatmapView';
import { RagMatrixView } from './components/RagMatrixView';
import { MapView } from './components/MapView';
import { ComboView } from './components/ComboView';
import { NetworkView } from './components/NetworkView';
import { MetricView } from './components/MetricView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SummaryTableView } from './components/SummaryTableView';
import { CardView } from './components/CardView';
import { StageBarView } from './components/StageBarView';

type TabKey =
  | 'line' | 'donut' | 'bar' | 'combo' | 'table' | 'list' | 'radar'
  | 'timeline' | 'card' | 'sankey' | 'scatter' | 'hierarchy' | 'network' | 'treemap'
  | 'heatmap' | 'ragmatrix' | 'map' | 'metric'
  | 'comparison-table' | 'summary-table' | 'stagebar';

const TABS: { key: TabKey; label: string }[] = [
  // ── Popover order (first 10) ──────────────────────────────────────────────
  { key: 'metric',           label: 'Metric (aka: Value Card)' },
  { key: 'bar',              label: 'Bar Chart'        },
  { key: 'donut',            label: 'Donut Chart'      },
  { key: 'line',             label: 'Line Chart'       },
  { key: 'combo',            label: 'Combo Chart'      },
  { key: 'table',            label: 'Table'            },
  { key: 'comparison-table', label: 'Comparison Table' },
  { key: 'summary-table',    label: 'Summary Table'    },
  { key: 'list',             label: 'List'             },
  { key: 'timeline',         label: 'Timeline'         },
  { key: 'card',             label: 'Card Grid'        },
  { key: 'stagebar',         label: 'Stage Bar'        },
  // ── Remaining — grouped by type ───────────────────────────────────────────
  { key: 'scatter',          label: 'Scatter'          },
  { key: 'treemap',          label: 'Treemap'          },
  { key: 'heatmap',          label: 'Heatmap'          },
  { key: 'radar',            label: 'Radar'            },
  { key: 'sankey',           label: 'Sankey'           },
  { key: 'hierarchy',        label: 'Hierarchy'        },
  { key: 'network',          label: 'Network'          },
  { key: 'ragmatrix',        label: 'RAG Matrix'       },
  { key: 'map',              label: 'Map'              },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('metric');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows);
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect(); };
  }, []);

  const goTo = (dir: 'prev' | 'next') => {
    const idx  = TABS.findIndex(t => t.key === activeTab);
    const next = dir === 'prev' ? idx - 1 : idx + 1;
    if (next >= 0 && next < TABS.length) {
      setActiveTab(TABS[next].key);
      setTimeout(() => {
        const el  = scrollRef.current;
        if (!el) return;
        const btn = el.querySelector(`[data-tab="${TABS[next].key}"]`) as HTMLElement;
        btn?.scrollIntoView({ inline: 'nearest', behavior: 'smooth' });
      }, 0);
    }
  };

  const activeIdx = TABS.findIndex(t => t.key === activeTab);

  return (
    <div className="h-screen bg-white flex flex-col" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Main Tabs */}
      <div className="border-b border-gray-300 bg-white flex items-end shrink-0">
        {/* Prev button */}
        <button
          onClick={() => goTo('prev')}
          disabled={activeIdx === 0}
          className="shrink-0 flex items-center justify-center w-8 h-10 mb-[1px] text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous tab"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scrollable tab strip */}
        <div
          ref={scrollRef}
          className="flex-1 flex overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {TABS.map(t => (
            <button
              key={t.key}
              data-tab={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`shrink-0 whitespace-nowrap px-5 py-3 font-medium text-sm transition-colors ${
                activeTab === t.key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => goTo('next')}
          disabled={activeIdx === TABS.length - 1}
          className="shrink-0 flex items-center justify-center w-8 h-10 mb-[1px] text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next tab"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'line'      && <LineChartView />}
        {activeTab === 'donut'     && <DonutChartView />}
        {activeTab === 'bar'       && <BarView />}
        {activeTab === 'combo'     && <ComboView />}
        {activeTab === 'table'     && <TableView />}
        {activeTab === 'list'      && <ListView />}
        {activeTab === 'radar'     && <RadarView />}
        {activeTab === 'timeline'  && <TimelineView />}
        {activeTab === 'card'      && <CardView />}
        {activeTab === 'sankey'    && <SankeyView />}
        {activeTab === 'scatter'   && <ScatterView />}
        {activeTab === 'hierarchy' && <HierarchyView />}
        {activeTab === 'network'   && <NetworkView />}
        {activeTab === 'treemap'   && <TreemapView />}
        {activeTab === 'heatmap'   && <HeatmapView />}
        {activeTab === 'ragmatrix' && <RagMatrixView />}
        {activeTab === 'map'       && <MapView />}
        {activeTab === 'metric'    && <MetricView />}
        {activeTab === 'comparison-table' && <ComparisonTableView />}
        {activeTab === 'summary-table'    && <SummaryTableView />}
        {activeTab === 'stagebar'         && <StageBarView />}
      </div>
    </div>
  );
}