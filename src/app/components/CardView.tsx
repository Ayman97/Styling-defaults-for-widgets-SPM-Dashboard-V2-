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
    <div style={TOOLTIP_STYLE}>
      {tip.title && <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{tip.title}</div>}
      {tip.rows.map(({k, v}, i) => <div key={i}>{k}: <strong>{v}</strong></div>)}
    </div>
  ) : null;
  return { show, move, hide, TipEl };
}

// ─── Style constants ──────────────────────────────────────────────────────────

// Basic styles — Card Items (mirrors List Items)
const ITEM_GAP     = 8;
const ITEM_CORNERS = 16;

// Advanced styles — Card Header
const HDR_ENABLED       = true;
const HDR_SHOW_ICON     = true;
const HDR_ICON_SIZE     = 24;
const HDR_ICON_COLOR    = '#44546F';
const HDR_TITLE_BOLD    = true;
const HDR_TITLE_COLOR   = '#111827';
const HDR_TITLE_SIZE    = 14;
const HDR_BG_COLOR      = '#FFFFFF';
const HDR_BG_OPACITY    = 100;
const HDR_PT            = 12;
const HDR_PR            = 12;
const HDR_PB            = 12;
const HDR_PL            = 12;
const HDR_BORDER_STYLE  = 'Solid';
const HDR_BORDER_COLOR  = '#E5E7EB';
const HDR_BORDER_WIDTH  = 1;
const HDR_BORDER_DIR    = 'Bottom';

// Advanced styles — Colored Indicator
const IND_ENABLED    = false;
const IND_SHOW_TITLE = false;
const IND_POSITION   = 'Left';
const IND_WIDTH      = 4;
const IND_COLOR      = '#0B3A67';
const IND_PALETTE    = 'Monochrome';

// Advanced styles — Attributes
const ATTR_LAYOUT         = 'List';
const ATTR_GRID_COLS      = 2;
const ATTR_ROW_GAP        = 8;
const ATTR_COL_GAP        = 12;
const ATTR_SECTION_GAP    = 16;
const ATTR_PT             = 8;
const ATTR_PR             = 12;
const ATTR_PB             = 8;
const ATTR_PL             = 12;
const ATTR_BORDER_COLOR   = '#E5E7EB';
const ATTR_BORDER_WIDTH   = 1;
const ATTR_DECIMALS       = 1;
const ATTR_SHORT_NUM      = true;
const ATTR_CUSTOMIZE_EACH = false;

// Attribute Default Styles
const ATTR_FONT  = 'Auto';
const ATTR_BOLD  = false;
const ATTR_COLOR = '#374151';
const ATTR_SIZE  = 14;

function fmt(val: number): string {
  if (!ATTR_SHORT_NUM) return val.toFixed(ATTR_DECIMALS);
  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(ATTR_DECIMALS)}M`;
  if (Math.abs(val) >= 1_000)     return `${(val / 1_000).toFixed(ATTR_DECIMALS)}K`;
  return val.toFixed(ATTR_DECIMALS);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Minimal donut ring used as a visualization placeholder inside grid cells */
function DonutRing({ percent = 75, size = 88, color = '#0B3A67' }: { percent?: number; size?: number; color?: string }) {
  const r  = 34;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="56" textAnchor="middle" fontSize="20" fontWeight="700" fill="#111827"
        style={{ fontFamily: FONT }}>
        {percent}%
      </text>
    </svg>
  );
}

/** Card header row: icon + title + action button */
function CardHeader({ title }: { title: string }) {
  if (!HDR_ENABLED) return null;
  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        backgroundColor: HDR_BG_COLOR,
        opacity:         HDR_BG_OPACITY / 100,
        paddingTop:      `${HDR_PT}px`,
        paddingRight:    `${HDR_PR}px`,
        paddingBottom:   `${HDR_PB}px`,
        paddingLeft:     `${HDR_PL}px`,
        borderBottom:    HDR_BORDER_DIR === 'Bottom' || HDR_BORDER_DIR === 'All'
          ? `${HDR_BORDER_WIDTH}px ${HDR_BORDER_STYLE.toLowerCase()} ${HDR_BORDER_COLOR}`
          : 'none',
        gap: '10px',
      }}
    >
      {HDR_SHOW_ICON && (
        <Clipboard size={HDR_ICON_SIZE} color={HDR_ICON_COLOR} strokeWidth={1.5} />
      )}
      <span style={{ fontFamily: FONT, fontSize: `${HDR_TITLE_SIZE}px`, fontWeight: HDR_TITLE_BOLD ? 600 : 400, color: HDR_TITLE_COLOR, flex: 1 }}>
        {title}
      </span>
      {/* Action button — not a style property, rendered for visual completeness */}
      <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${ATTR_BORDER_COLOR}`, borderRadius: '6px', overflow: 'hidden', height: '32px' }}>
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
          <Zap size={16} color="#334155" strokeWidth={1.5} />
        </button>
        <div style={{ width: '1px', backgroundColor: ATTR_BORDER_COLOR, height: '18px' }} />
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
          <ChevronDown size={16} color="#334155" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

/** A single attribute row in List layout */
function AttrRow({ label, value, isLast = false, onMouseEnter, onMouseMove, onMouseLeave }: { label: string; value: string | number; isLast?: boolean; onMouseEnter?: (e: React.MouseEvent) => void; onMouseMove?: (e: React.MouseEvent) => void; onMouseLeave?: () => void }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'default',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        paddingTop:    `${ATTR_PT}px`,
        paddingRight:  `${ATTR_PR}px`,
        paddingBottom: `${ATTR_PB}px`,
        paddingLeft:   `${ATTR_PL}px`,
        borderBottom:  isLast ? 'none' : `${ATTR_BORDER_WIDTH}px solid ${ATTR_BORDER_COLOR}`,
      }}
    >
      <span style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 500, color: '#64748B' }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT, fontSize: `${ATTR_SIZE}px`, fontWeight: ATTR_BOLD ? 600 : 400, color: ATTR_COLOR }}>
        {typeof value === 'number' ? fmt(value) : value}
      </span>
    </div>
  );
}

/** Wrapper giving each example a blue title label */
function ExampleLabel({ n, subtitle }: { n: number; subtitle: string }) {
  return (
    <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#2563EB', marginBottom: '8px' }}>
      {n}. Example {n} – {subtitle}
    </p>
  );
}

/** Card shell with border + rounded corners */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: `${ITEM_CORNERS}px`,
        border:       `${ATTR_BORDER_WIDTH}px solid ${ATTR_BORDER_COLOR}`,
        overflow:     'hidden',
        background:   '#FFFFFF',
      }}
    >
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CardView() {
  const { show, move, hide, TipEl } = useTip();
  const listAttrs = [
    { label: 'Label', value: 'Value' },
    { label: 'Label', value: 'Value' },
    { label: 'Label', value: 'Value' },
    { label: 'Label', value: 'Value' },
  ];

  return (
    <div className="flex h-full">
      {TipEl}
      {/* ── Left — Examples ────────────────────────────────────────────────── */}
      <div className="w-2/3 p-8 overflow-auto">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '520px' }}>

          {/* ── Example 1: List layout ──────────────────────────────────── */}
          <div>
            <ExampleLabel n={1} subtitle="1 section (Metadata list)" />
            <Card>
              <CardHeader title="Title" />
              <div>
                {listAttrs.map((a, i) => (
                  <AttrRow key={i} label={a.label} value={a.value} isLast={i === listAttrs.length - 1}
                    onMouseEnter={e => show(e, a.label, [{ k: a.label, v: typeof a.value === 'number' ? a.value.toFixed(1) : String(a.value) }])}
                    onMouseMove={move}
                    onMouseLeave={hide}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* ── Example 2: Grid layout with donut ───────────────────────── */}
          <div>
            <ExampleLabel n={2} subtitle="1 section (Metadata grid)" />
            <Card>
              <CardHeader title="Title" />
              {/* Grid section — 2 columns: donut | text content */}
              <div
                style={{
                  display:             'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap:                 `${ATTR_ROW_GAP}px ${ATTR_COL_GAP}px`,
                  padding:             `${ATTR_PT}px ${ATTR_PR}px ${ATTR_PB}px ${ATTR_PL}px`,
                  alignItems:          'center',
                }}
              >
                {/* Cell 1: Donut visualization */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <DonutRing percent={75} size={96} />
                </div>
                {/* Cell 2: Title + sub-grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: `${ATTR_ROW_GAP}px` }}>
                  <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    Title example without label
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
                    <span style={{ fontFamily: FONT, fontSize: `${ATTR_SIZE}px`, color: ATTR_COLOR }}>Cumulative</span>
                    <span style={{ fontFamily: FONT, fontSize: `${ATTR_SIZE}px`, color: ATTR_COLOR }}>Not active</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Example 3: Mixed — grid section + list section ──────────── */}
          <div>
            <ExampleLabel n={3} subtitle="2 sections (mixed grid + list)" />
            <Card>
              <CardHeader title="Title" />
              {/* Section 1 — Grid */}
              <div
                style={{
                  display:             'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap:                 `${ATTR_ROW_GAP}px ${ATTR_COL_GAP}px`,
                  padding:             `${ATTR_PT}px ${ATTR_PR}px ${ATTR_PB}px ${ATTR_PL}px`,
                  borderBottom:        `${ATTR_BORDER_WIDTH}px solid ${ATTR_BORDER_COLOR}`,
                  alignItems:          'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <DonutRing percent={75} size={96} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: `${ATTR_ROW_GAP}px` }}>
                  <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    Title example without label
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
                    <span style={{ fontFamily: FONT, fontSize: `${ATTR_SIZE}px`, color: ATTR_COLOR }}>Cumulative</span>
                    <span style={{ fontFamily: FONT, fontSize: `${ATTR_SIZE}px`, color: ATTR_COLOR }}>Not active</span>
                  </div>
                </div>
              </div>
              {/* Section gap */}
              <div style={{ height: `${ATTR_SECTION_GAP}px` }} />
              {/* Section 2 — List */}
              <div>
                {listAttrs.map((a, i) => (
                  <AttrRow key={i} label={a.label} value={a.value} isLast={i === listAttrs.length - 1}
                    onMouseEnter={e => show(e, a.label, [{ k: a.label, v: typeof a.value === 'number' ? a.value.toFixed(1) : String(a.value) }])}
                    onMouseMove={move}
                    onMouseLeave={hide}
                  />
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* ── Right — Style Configuration ────────────────────────────────────── */}
      <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
        <h2 className="text-xl font-bold mb-6" style={{ fontFamily: FONT }}>Style Configuration</h2>

        {/* Basic styles */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded" style={{ fontFamily: FONT }}>
            Basic styles
          </h3>
          <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>Card Items</h4>
          <StyleTable rows={[
            ['Layout (default)', 'Horizontal'],
            ['Gap between items', String(ITEM_GAP)],
            ['Item corners',      String(ITEM_CORNERS)],
          ]} />
        </div>

        {/* Advanced styles */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3 bg-[#E8E1F5] px-3 py-2 rounded" style={{ fontFamily: FONT }}>
            Advanced styles
          </h3>
        </div>

        {/* Card Header */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>Card Header</h4>
          <StyleTable rows={[
            ['Enabled',            HDR_ENABLED    ? 'Yes' : 'No'],
            ['Show icon',          HDR_SHOW_ICON  ? 'Yes' : 'No'],
            ['Icon size',          String(HDR_ICON_SIZE)],
            ['Icon color',         HDR_ICON_COLOR],
            ['Title font family',  'Auto'],
            ['Title bold',         HDR_TITLE_BOLD ? 'Yes' : 'No'],
            ['Title text color',   HDR_TITLE_COLOR],
            ['Title size',         String(HDR_TITLE_SIZE)],
            ['Background color',   HDR_BG_COLOR],
            ['Background opacity', `${HDR_BG_OPACITY}%`],
            ['Padding top',        String(HDR_PT)],
            ['Padding right',      String(HDR_PR)],
            ['Padding bottom',     String(HDR_PB)],
            ['Padding left',       String(HDR_PL)],
            ['Border style',       HDR_BORDER_STYLE],
            ['Border color',       HDR_BORDER_COLOR],
            ['Border width',       String(HDR_BORDER_WIDTH)],
            ['Border directions',  HDR_BORDER_DIR],
          ]} />
        </div>

        {/* Colored Indicator */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>Colored Indicator</h4>
          <StyleTable rows={[
            ['Enabled',            IND_ENABLED    ? 'Yes' : 'No'],
            ['Show title',         IND_SHOW_TITLE ? 'Yes' : 'No'],
            ['Indicator position', IND_POSITION],
            ['Indicator width',    String(IND_WIDTH)],
            ['Indicator color',    IND_COLOR],
            ['Used palette',       IND_PALETTE],
          ]} />
        </div>

        {/* Attributes */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>Attributes</h4>
          <StyleTable rows={[
            ['Layout',                      ATTR_LAYOUT],
            ['Grid columns',                String(ATTR_GRID_COLS)],
            ['Row gap',                     String(ATTR_ROW_GAP)],
            ['Column gap',                  String(ATTR_COL_GAP)],
            ['Section gap',                 String(ATTR_SECTION_GAP)],
            ['Section padding top',         String(ATTR_PT)],
            ['Section padding right',       String(ATTR_PR)],
            ['Section padding bottom',      String(ATTR_PB)],
            ['Section padding left',        String(ATTR_PL)],
            ['Attribute border style',      'Solid'],
            ['Attribute border color',      ATTR_BORDER_COLOR],
            ['Attribute border width',      String(ATTR_BORDER_WIDTH)],
            ['Attribute border directions', 'Bottom'],
            ['Display missing value as',    '–'],
            ['Decimals',                    String(ATTR_DECIMALS)],
            ['Short number',                ATTR_SHORT_NUM ? 'Yes' : 'No'],
            ['Customize each attribute',    ATTR_CUSTOMIZE_EACH ? 'Yes' : 'No'],
          ]} />
        </div>

        {/* Attribute Default Styles */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>Attribute Default Styles</h4>
          <StyleTable rows={[
            ['Layout',                   ATTR_LAYOUT],
            ['Grid columns',             String(ATTR_GRID_COLS)],
            ['Row gap',                  String(ATTR_ROW_GAP)],
            ['Column gap',               String(ATTR_COL_GAP)],
            ['Font family',              ATTR_FONT],
            ['Bold',                     ATTR_BOLD ? 'Yes' : 'No'],
            ['Color',                    ATTR_COLOR],
            ['Size',                     String(ATTR_SIZE)],
            ['Border style',             'Solid'],
            ['Border color',             ATTR_BORDER_COLOR],
            ['Border width',             String(ATTR_BORDER_WIDTH)],
            ['Border directions',        'Bottom'],
            ['Padding top',              String(ATTR_PT)],
            ['Padding right',            String(ATTR_PR)],
            ['Padding bottom',           String(ATTR_PB)],
            ['Padding left',             String(ATTR_PL)],
            ['Display missing value as', '–'],
            ['Decimals',                 String(ATTR_DECIMALS)],
            ['Short number',             ATTR_SHORT_NUM ? 'Yes' : 'No'],
          ]} />
        </div>
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
