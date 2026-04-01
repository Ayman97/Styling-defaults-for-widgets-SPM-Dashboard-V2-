import React from 'react';

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

// ─── Style Constants (extracted exactly from style panel image) ────────────────

// Basic styles – Table borders
const TB_BORDER_STYLE  = 'Solid';
const TB_BORDER_COLOR  = '#E5E7EB';
const TB_BORDER_WIDTH  = 1;
const TB_BORDERS       = 'Inners only';

// Advanced styles – Column headers
const CH_SHOW_ICONS    = false;
const CH_WIDTH         = 'Auto';
const CH_HEIGHT        = 48;
const CH_BG_COLOR      = '#F3F4F6';
const CH_BG_OPACITY    = 100;
const CH_FONT_FAM      = 'Auto';
const CH_BOLD          = true;
const CH_TEXT_COLOR    = '#111827';
const CH_SIZE          = 14;
const CH_ALIGNMENT     = 'Left';
const CH_BORDER_VIS    = 'Bottom';
const CH_BORDER_STYLE  = 'Solid';
const CH_BORDER_COLOR  = '#E5E7EB';
const CH_BORDER_WIDTH  = 1;

// Advanced styles – Row headers
const RH_WIDTH         = 'Auto';
const RH_HEIGHT        = 48;
const RH_BG_COLOR      = '#F9FAFB';
const RH_BG_OPACITY    = 100;
const RH_FONT_FAM      = 'Auto';
const RH_BOLD          = true;
const RH_TEXT_COLOR    = '#111827';
const RH_SIZE          = 14;
const RH_ALIGNMENT     = 'Left';
const RH_BORDER_VIS    = 'Right';
const RH_BORDER_STYLE  = 'Solid';
const RH_BORDER_COLOR  = '#E5E7EB';
const RH_BORDER_WIDTH  = 1;

// Advanced styles – Column values
const CV_BG_COLOR      = '#FFFFFF';
const CV_BG_OPACITY    = 100;
const CV_ALT_COLOR     = '#FFFFFF';   // same as base — no stripe
const CV_ALT_OPACITY   = 100;
const CV_FONT_FAM      = 'Auto';
const CV_BOLD          = false;
const CV_TEXT_COLOR    = '#374151';
const CV_SIZE          = 14;
const CV_BORDER_VIS    = 'Bottom';
const CV_BORDER_STYLE  = 'Solid';
const CV_BORDER_COLOR  = '#E5E7EB';
const CV_BORDER_WIDTH  = 1;
const CV_PAD_TOP       = 8;
const CV_PAD_RIGHT     = 12;
const CV_PAD_BOTTOM    = 8;
const CV_PAD_LEFT      = 12;
const CV_MISSING       = '–';
const CV_DECIMALS      = 1;
const CV_SHORT_NUM     = true;
const CV_CUSTOMIZE     = false;

// Column values / Column Customization (Per Column)
const PC_SHOW_ICONS    = true;
const PC_BASE_BG       = '#FFFFFF';
const PC_BASE_OPACITY  = 100;
const PC_ALT_COLOR     = '#FFFFFF';   // same as base — no stripe
const PC_ALT_OPACITY   = 100;
const PC_FONT_FAM      = 'Auto';
const PC_BOLD          = false;
const PC_TEXT_COLOR    = '#111827';
const PC_SIZE          = 14;
const PC_BORDER_VIS    = 'Bottom';
const PC_BORDER_STYLE  = 'Solid';
const PC_BORDER_COLOR  = '#E5E7EB';
const PC_BORDER_WIDTH  = 1;
const PC_PAD_TOP       = 8;
const PC_PAD_RIGHT     = 12;
const PC_PAD_BOTTOM    = 8;
const PC_PAD_LEFT      = 12;
const PC_MISSING       = '–';
const PC_DECIMALS      = 1;
const PC_SHORT_NUM     = true;

// ─── Data ─────────────────────────────────────────────────────────────────────
const COLUMNS = ['Project 1', 'Project 2'];

type RowType = 'progress' | 'badge' | 'number';
const ROWS: { label: string; type: RowType; values: (number | string)[] }[] = [
  { label: 'Progress', type: 'progress', values: [80, 60] },
  { label: 'Status',   type: 'badge',    values: ['Active', 'Active'] },
  { label: 'Tasks',    type: 'number',   values: [10, 25] },
];

// ─── Cell Renderers ───────────────────────────────────────────────────────────
const MiniProgress: React.FC<{ value: number }> = ({ value }) => {
  const R = 9; const sw = 2.5;
  const circ = 2 * Math.PI * R;
  const offset = circ - (value / 100) * circ;
  const sz = (R + sw) * 2 + 2;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <svg width={sz} height={sz} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle cx={sz / 2} cy={sz / 2} r={R} fill="none" stroke="#DBEAFE" strokeWidth={sw} />
        <circle cx={sz / 2} cy={sz / 2} r={R} fill="none" stroke="#3B82F6" strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: CV_SIZE, fontFamily: FONT, color: CV_TEXT_COLOR }}>
        {value}%
      </span>
    </div>
  );
};

const StatusBadge: React.FC<{ label: string }> = ({ label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 20,
    border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5',
    fontSize: 12, fontFamily: FONT, color: '#065F46',
  }}>
    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0 }} />
    {label}
  </span>
);

function renderCell(type: RowType, value: number | string) {
  if (type === 'progress') return <MiniProgress value={value as number} />;
  if (type === 'badge') return <StatusBadge label={value as string} />;
  return <span style={{ fontSize: CV_SIZE, fontFamily: FONT, color: CV_TEXT_COLOR }}>{value}</span>;
}

// ─── Table Visualization ──────────────────────────────────────────────────────
function TableViz() {
  const { show, move, hide, TipEl } = useTip();
  return (
    <>
      {TipEl}
      <table style={{ borderCollapse: 'collapse', tableLayout: 'auto' }}>
    <thead>
      <tr>
        {/* empty corner cell */}
        <th style={{
          backgroundColor: CH_BG_COLOR,
          height: CH_HEIGHT + 'px',
          borderBottom: `${CH_BORDER_WIDTH}px ${CH_BORDER_STYLE.toLowerCase()} ${CH_BORDER_COLOR}`,
          borderRight: `${RH_BORDER_WIDTH}px ${RH_BORDER_STYLE.toLowerCase()} ${RH_BORDER_COLOR}`,
          minWidth: 130,
          padding: `0 ${CV_PAD_RIGHT}px`,
        }} />
        {COLUMNS.map((col) => (
          <th key={col} style={{
            backgroundColor: CH_BG_COLOR,
            height: CH_HEIGHT + 'px',
            borderBottom: `${CH_BORDER_WIDTH}px ${CH_BORDER_STYLE.toLowerCase()} ${CH_BORDER_COLOR}`,
            fontFamily: FONT,
            fontWeight: CH_BOLD ? 'bold' : 'normal',
            color: CH_TEXT_COLOR,
            fontSize: CH_SIZE + 'px',
            textAlign: CH_ALIGNMENT.toLowerCase() as 'left',
            padding: `0 ${CV_PAD_RIGHT}px 0 ${CV_PAD_LEFT}px`,
            minWidth: 170,
            whiteSpace: 'nowrap',
          }}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {ROWS.map((row, rowIdx) => (
        <tr
          key={row.label}
          style={{ cursor: 'default' }}
          onMouseEnter={e => show(e, row.label, COLUMNS.map((col, i) => ({ k: col, v: String(row.values[i]) })))}
          onMouseMove={move}
          onMouseLeave={hide}
        >
          <td style={{
            backgroundColor: RH_BG_COLOR,
            height: RH_HEIGHT + 'px',
            borderBottom: `${RH_BORDER_WIDTH}px ${RH_BORDER_STYLE.toLowerCase()} ${RH_BORDER_COLOR}`,
            borderRight: `${RH_BORDER_WIDTH}px ${RH_BORDER_STYLE.toLowerCase()} ${RH_BORDER_COLOR}`,
            fontFamily: FONT,
            fontWeight: RH_BOLD ? 'bold' : 'normal',
            color: RH_TEXT_COLOR,
            fontSize: RH_SIZE + 'px',
            textAlign: RH_ALIGNMENT.toLowerCase() as 'left',
            padding: `0 ${CV_PAD_RIGHT}px 0 ${CV_PAD_LEFT}px`,
            whiteSpace: 'nowrap',
          }}>
            {row.label}
          </td>
          {row.values.map((val, colIdx) => (
            <td key={colIdx} style={{
              backgroundColor: rowIdx % 2 === 0 ? CV_BG_COLOR : CV_ALT_COLOR,
              borderBottom: `${CV_BORDER_WIDTH}px ${CV_BORDER_STYLE.toLowerCase()} ${CV_BORDER_COLOR}`,
              padding: `${CV_PAD_TOP}px ${CV_PAD_RIGHT}px ${CV_PAD_BOTTOM}px ${CV_PAD_LEFT}px`,
            }}>
              {renderCell(row.type, val)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
    </>
  );
}


// ─── Style Panel ──────────────────────────────────────────────────────────────
type StyleRow = [string, string];

interface Section { title: string; headerBg: string; rows: StyleRow[]; }

const SECTIONS: Section[] = [
  {
    title: 'Table borders',
    headerBg: '#FEF7E6',
    rows: [
      ['Border style',  TB_BORDER_STYLE],
      ['Border color',  TB_BORDER_COLOR],
      ['Border width',  String(TB_BORDER_WIDTH)],
      ['Border visibility', TB_BORDERS],
    ],
  },
  {
    title: 'Column headers',
    headerBg: '#E7F4FB',
    rows: [
      ['Show icons',          CH_SHOW_ICONS ? 'Yes' : 'No'],
      ['Width',               CH_WIDTH],
      ['Height',              String(CH_HEIGHT)],
      ['Background color',    CH_BG_COLOR],
      ['Background opacity',  CH_BG_OPACITY + '%'],
      ['Font family',         CH_FONT_FAM],
      ['Bold',                CH_BOLD ? 'Yes' : 'No'],
      ['Color',               CH_TEXT_COLOR],
      ['Size',                String(CH_SIZE)],
      ['Text alignment',      CH_ALIGNMENT],
      ['Border style',        CH_BORDER_STYLE],
      ['Border color',        CH_BORDER_COLOR],
      ['Border width',        String(CH_BORDER_WIDTH)],
      ['Border visibility',   CH_BORDER_VIS],
    ],
  },
  {
    title: 'Row headers',
    headerBg: '#E7F4FB',
    rows: [
      ['Width',               RH_WIDTH],
      ['Height',              String(RH_HEIGHT)],
      ['Background color',    RH_BG_COLOR],
      ['Background opacity',  RH_BG_OPACITY + '%'],
      ['Font family',         RH_FONT_FAM],
      ['Bold',                RH_BOLD ? 'Yes' : 'No'],
      ['Color',               RH_TEXT_COLOR],
      ['Size',                String(RH_SIZE)],
      ['Text alignment',      RH_ALIGNMENT],
      ['Border style',        RH_BORDER_STYLE],
      ['Border color',        RH_BORDER_COLOR],
      ['Border width',        String(RH_BORDER_WIDTH)],
      ['Border visibility',   RH_BORDER_VIS],
    ],
  },
  {
    title: 'Column values',
    headerBg: '#F4F0FA',
    rows: [
      ['Background color',        CV_BG_COLOR],
      ['Background opacity',      CV_BG_OPACITY + '%'],
      ['Alternating row color',   CV_ALT_COLOR],
      ['Alternating row opacity', CV_ALT_OPACITY + '%'],
      ['Font family',             CV_FONT_FAM],
      ['Bold',                    CV_BOLD ? 'Yes' : 'No'],
      ['Color',                   CV_TEXT_COLOR],
      ['Size',                    String(CV_SIZE)],
      ['Border style',            CV_BORDER_STYLE],
      ['Border color',            CV_BORDER_COLOR],
      ['Border width',            String(CV_BORDER_WIDTH)],
      ['Border visibility',       CV_BORDER_VIS],
      ['Padding top',             String(CV_PAD_TOP)],
      ['Padding right',           String(CV_PAD_RIGHT)],
      ['Padding bottom',          String(CV_PAD_BOTTOM)],
      ['Padding left',            String(CV_PAD_LEFT)],
      ['Display missing value as', CV_MISSING],
      ['Decimals',                String(CV_DECIMALS)],
      ['Short number',            CV_SHORT_NUM ? 'Yes' : 'No'],
      ['Customize each column',   CV_CUSTOMIZE ? 'Yes' : 'No'],
    ],
  },
  {
    title: 'Column values / Customization default',
    headerBg: '#E8F5E9',
    rows: [
      ['Show icons',              PC_SHOW_ICONS ? 'Yes' : 'No'],
      ['Base background color',   PC_BASE_BG],
      ['Base opacity',            PC_BASE_OPACITY + '%'],
      ['Alternating row color',   PC_ALT_COLOR],
      ['Alternating opacity',     PC_ALT_OPACITY + '%'],
      ['Font family',             PC_FONT_FAM],
      ['Bold',                    PC_BOLD ? 'Yes' : 'No'],
      ['Color',                   PC_TEXT_COLOR],
      ['Size',                    String(PC_SIZE)],
      ['Border style',            PC_BORDER_STYLE],
      ['Border color',            PC_BORDER_COLOR],
      ['Border width',            String(PC_BORDER_WIDTH)],
      ['Border visibility',       PC_BORDER_VIS],
      ['Padding top',             String(PC_PAD_TOP)],
      ['Padding right',           String(PC_PAD_RIGHT)],
      ['Padding bottom',          String(PC_PAD_BOTTOM)],
      ['Padding left',            String(PC_PAD_LEFT)],
      ['Display missing value as', PC_MISSING],
      ['Decimals',                String(PC_DECIMALS)],
      ['Short number',            PC_SHORT_NUM ? 'Yes' : 'No'],
    ],
  },
];

function StylePanel() {
  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: FONT }}>Style Configuration</h2>
      {SECTIONS.map((sec) => (
        <div key={sec.title} className="mb-8">
          <h3
            className="text-lg font-semibold mb-3 px-3 py-2 rounded"
            style={{ backgroundColor: sec.headerBg, fontFamily: FONT }}
          >
            {sec.title}
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#B8D4E8]">
                <th className="text-left p-2 border border-gray-300" style={{ fontFamily: FONT }}>Style</th>
                <th className="text-left p-2 border border-gray-300" style={{ fontFamily: FONT }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {sec.rows.map(([k, v], i) => (
                <tr key={i}>
                  <td className="p-2 border border-gray-300" style={{ fontFamily: FONT }}>{k}</td>
                  <td className="p-2 border border-gray-300" style={{ fontFamily: FONT }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function ComparisonTableView() {
  return (
    <div className="flex h-full">
      {/* Left: Table visualization */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-auto">
        <TableViz />
      </div>
      {/* Right: Style panel */}
      <StylePanel />
    </div>
  );
}