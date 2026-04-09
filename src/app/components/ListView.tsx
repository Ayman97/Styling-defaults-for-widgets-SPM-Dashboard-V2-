import React from 'react';
import { Clipboard, Zap, ChevronDown } from 'lucide-react';
const FONT = 'Plus Jakarta Sans, sans-serif';

const TOOLTIP_STYLE: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontFamily: FONT,
  fontSize: 13,
  color: '#374151',
  zIndex: 9999,
};

interface TipState { visible: boolean; x: number; y: number; title: string; rows: {k:string;v:string}[]; }
const HIDDEN_TIP: TipState = { visible: false, x: 0, y: 0, title: '', rows: [] };

function useTip() {
  const [tip, setTip] = React.useState<TipState>(HIDDEN_TIP);
  const show = (e: React.MouseEvent, title: string, rows: {k:string;v:string}[]) =>
    setTip({ visible: true, x: e.clientX + 14, y: e.clientY + 14, title, rows });
  const move = (e: React.MouseEvent) =>
    setTip(t => t.visible ? { ...t, x: e.clientX + 14, y: e.clientY + 14 } : t);
  const hide = () => setTip(t => ({ ...t, visible: false }));
  const TipEl = tip.visible ? (
    <div style={{ ...TOOLTIP_STYLE, left: tip.x, top: tip.y }}>
      {tip.title && <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{tip.title}</div>}
      {tip.rows.map(({k, v}, i) => <div key={i}>{k}: <strong>{v}</strong></div>)}
    </div>
  ) : null;
  return { show, move, hide, TipEl };
}

// ─── Style constants (match right-panel tables) ────────────────────────────────
const INDICATOR_COLOR  = '#0B3A67'; // monochrome base
const INDICATOR_WIDTH  = 4;         // px
const ITEM_CORNERS     = 16;        // px
const ITEM_GAP         = 8;         // px (gap-2)

// Attribute cell padding
const ATTR_PT = 8;   // padding-top
const ATTR_PR = 12;  // padding-right
const ATTR_PB = 8;   // padding-bottom
const ATTR_PL = 12;  // padding-left

const ATTR_BORDER_COLOR = '#E5E7EB';
const ATTR_BORDER_WIDTH = 1;

const ATTR_FONT      = 'Auto';
const ATTR_BOLD      = false;
const ATTR_COLOR     = '#374151';
const ATTR_SIZE      = 14;

const DECIMALS     = 1;
const SHORT_NUMBER = true;

// Item shadow
const ITEM_SHADOW         = 'Small';    // None | Small | Large
const ITEM_SHADOW_COLOR   = '#000000';
const ITEM_SHADOW_OPACITY = '8%';

function fmt(val: number): string {
  if (!SHORT_NUMBER) return val.toFixed(DECIMALS);
  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(DECIMALS)}M`;
  if (Math.abs(val) >= 1_000)     return `${(val / 1_000).toFixed(DECIMALS)}K`;
  return val.toFixed(DECIMALS);
}

// Sample data for the list
const listData = [
  {
    id: 1,
    title: 'Project Alpha',
    attributes: [
      { label: 'Status',   value: 'Active' },
      { label: 'Priority', value: 'High' },
      { label: 'Progress', value: 75.5 },
    ],
  },
  {
    id: 2,
    title: 'Campaign Beta',
    attributes: [
      { label: 'Status', value: 'Pending' },
      { label: 'Budget', value: 15000.0 },
      { label: 'Reach',  value: 12500.3 },
    ],
  },
  {
    id: 3,
    title: 'Initiative Gamma',
    attributes: [
      { label: 'Type',       value: 'Research' },
      { label: 'Team Size',  value: 8 },
      { label: 'Completion', value: 42.8 },
    ],
  },
  {
    id: 4,
    title: 'Event Delta',
    attributes: [
      { label: 'Date',      value: 'Mar 15' },
      { label: 'Attendees', value: 250 },
      { label: 'Venue',     value: 'Hall A' },
    ],
  },
];

export function ListView() {
  const { show, move, hide, TipEl } = useTip();
  return (
    <div className="flex h-full">
      {TipEl}
      {/* Left side - List (Fixed) */}
      <div className="w-2/3 p-8 overflow-auto">
        <div className="flex flex-col overflow-x-auto" style={{ gap: `${ITEM_GAP}px` }}>
          {listData.map((item) => (
            <div
              key={item.id}
              className="flex items-stretch bg-white"
              onMouseEnter={e => show(e, item.title, item.attributes.map(a => ({ k: a.label, v: typeof a.value === 'number' ? fmt(a.value) : String(a.value) })))}
              onMouseMove={move}
              onMouseLeave={hide}
              style={{
                borderRadius: `${ITEM_CORNERS}px`,
                border: `1px solid ${ATTR_BORDER_COLOR}`,
                overflow: 'hidden',
                minHeight: '80px',
                minWidth: 'fit-content',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {/* Colored Indicator - Left */}
              <div
                style={{
                  width: `${INDICATOR_WIDTH}px`,
                  backgroundColor: INDICATOR_COLOR,
                  flexShrink: 0,
                }}
              />

              {/* Icon and Title Section */}
              <div
                className="flex items-center gap-3"
                style={{
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  width: '200px',
                  flexShrink: 0,
                  borderRight: `${ATTR_BORDER_WIDTH}px solid ${ATTR_BORDER_COLOR}`,
                }}
              >
                <Clipboard size={24} color="#334155" strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                  }}
                >
                  {item.title}
                </span>
              </div>

              {/* Attributes Grid - 3 columns */}
              <div className="flex flex-1 items-stretch">
                {item.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center flex-1"
                    style={{
                      paddingTop:    `${ATTR_PT}px`,
                      paddingRight:  `${ATTR_PR}px`,
                      paddingBottom: `${ATTR_PB}px`,
                      paddingLeft:   `${ATTR_PL}px`,
                      minWidth: '150px',
                      // Right border between attributes (not on last)
                      borderRight: index < item.attributes.length - 1
                        ? `${ATTR_BORDER_WIDTH}px solid ${ATTR_BORDER_COLOR}`
                        : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748B',
                        marginBottom: '4px',
                      }}
                    >
                      {attr.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#111827',
                      }}
                    >
                      {typeof attr.value === 'number' ? fmt(attr.value) : attr.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Split Action Button */}
              <div
                className="flex items-center"
                style={{
                  paddingRight: '16px',
                  paddingLeft: '16px',
                  flexShrink: 0,
                  borderLeft: `${ATTR_BORDER_WIDTH}px solid ${ATTR_BORDER_COLOR}`,
                }}
              >
                <div className="flex items-center" style={{ border: `1px solid ${ATTR_BORDER_COLOR}`, borderRadius: '6px', overflow: 'hidden', height: '40px' }}>
                  <button
                    className="hover:bg-gray-100 transition-colors flex items-center justify-center"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 12px', height: '100%' }}
                  >
                    <Zap size={20} color="#334155" strokeWidth={1.5} />
                  </button>
                  <div style={{ width: '1px', backgroundColor: ATTR_BORDER_COLOR, height: '24px' }} />
                  <button
                    className="hover:bg-gray-100 transition-colors flex items-center justify-center"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 12px', height: '100%' }}
                  >
                    <ChevronDown size={20} color="#334155" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Style Tables (Scrollable) */}
      <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
        <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Style Configuration</h2>

        {/* Basic styles */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Basic styles</h3>
          <h4 className="font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>List Items</h4>
          <StyleTable rows={[
            ['Layout (default)',    'Horizontal'],
            ['Gap between items',   String(ITEM_GAP)],
            ['Item corners',        String(ITEM_CORNERS)],
            ['Shadow',              ITEM_SHADOW],
            ['Shadow color',        ITEM_SHADOW_COLOR],
            ['Shadow color opacity', ITEM_SHADOW_OPACITY],
          ]} />
        </div>

        {/* Advanced styles */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3 bg-[#E8E1F5] px-3 py-2 rounded" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Advanced styles</h3>
        </div>

        {/* Colored Indicator */}
        <div className="mb-8">
          <h4 className="font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Colored Indicator</h4>
          <StyleTable rows={[
            ['Show title',         'No'],
            ['Indicator position', 'Left'],
            ['Indicator width',    String(INDICATOR_WIDTH)],
            ['Indicator color',    INDICATOR_COLOR],
            ['Used palette',       'Monochrome'],
          ]} />
        </div>

        {/* Attributes Section */}
        <div className="mb-8">
          <h4 className="font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Attributes Section</h4>
          <StyleTable rows={[
            ['Section padding top',          String(ATTR_PT)],
            ['Section padding right',         String(ATTR_PR)],
            ['Section padding bottom',        String(ATTR_PB)],
            ['Section padding left',          String(ATTR_PL)],
            ['Attribute border style',        'Solid'],
            ['Attribute border color',        ATTR_BORDER_COLOR],
            ['Attribute border width',        String(ATTR_BORDER_WIDTH)],
            ['Attribute border directions',   'Right'],
            ['Display missing value as',      '–'],
            ['Decimals',                      String(DECIMALS)],
            ['Short number',                  SHORT_NUMBER ? 'Yes' : 'No'],
            ['Customize each attribute',      'No'],
          ]} />
        </div>

        {/* Attribute Default Styles */}
        <div className="mb-8">
          <h4 className="font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Attribute Default Styles</h4>
          <StyleTable rows={[
            ['Font family',              ATTR_FONT],
            ['Bold',                     ATTR_BOLD ? 'Yes' : 'No'],
            ['Color',                    ATTR_COLOR],
            ['Size',                     String(ATTR_SIZE)],
            ['Border style',             'Solid'],
            ['Border color',             ATTR_BORDER_COLOR],
            ['Border width',             String(ATTR_BORDER_WIDTH)],
            ['Border directions',        'Right'],
            ['Padding top',              String(ATTR_PT)],
            ['Padding right',            String(ATTR_PR)],
            ['Padding bottom',           String(ATTR_PB)],
            ['Padding left',             String(ATTR_PL)],
            ['Display missing value as', '–'],
            ['Decimals',                 String(DECIMALS)],
            ['Short number',             SHORT_NUMBER ? 'Yes' : 'No'],
          ]} />
        </div>
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