import React, { useState } from 'react';

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

type TableVariant = 'table' | 'pivot';

const SUB_TABS: Array<{ key: TableVariant; label: string }> = [
  { key: 'table', label: 'Table' },
  { key: 'pivot', label: 'Pivot Table' },
];

// ─── Style constants – Regular Table ──────────────────────────────────────────
const TB_BORDER_STYLE           = 'Solid';
const TB_BORDER_COLOR           = '#E5E7EB';
const TB_BORDER_WIDTH           = 1;
const TB_BORDERS                = 'Inners only';

const CH_SHOW_ICONS             = false;
const CH_WIDTH                  = 'Auto';
const CH_HEIGHT                 = 48;
const CH_BG_COLOR               = '#F3F4F6';
const CH_BG_OPACITY             = 100;
const CH_FONT_FAM               = 'Auto';
const CH_BOLD                   = true;
const CH_TEXT_COLOR             = '#111827';
const CH_SIZE                   = 14;
const CH_ALIGNMENT              = 'Left';
const CH_BORDER_STYLE           = 'Solid';
const CH_BORDER_COLOR           = '#E5E7EB';
const CH_BORDER_WIDTH           = 1;
const CH_BORDER_VIS             = 'Bottom';

const CV_BASE_BG                = '#FFFFFF';
const CV_BASE_OPACITY           = 100;
const CV_ALT_COLOR              = '#FFFFFF';   // same as base — no stripe
const CV_ALT_OPACITY            = 100;
const CV_FONT_FAM               = 'Auto';
const CV_BOLD                   = false;
const CV_TEXT_COLOR             = '#374151';
const CV_SIZE                   = 14;
const CV_BORDER_STYLE           = 'Solid';
const CV_BORDER_COLOR           = '#E5E7EB';
const CV_BORDER_WIDTH           = 1;
const CV_BORDER_VIS             = 'Bottom';
const CV_PAD_TOP                = 8;
const CV_PAD_RIGHT              = 12;
const CV_PAD_BOTTOM             = 8;
const CV_PAD_LEFT               = 12;
const CV_MISSING                = '–';
const CV_DECIMALS               = 1;
const CV_SHORT_NUM              = true;
const CV_CUSTOMIZE              = false;

// ─── Style constants – Pivot Table ────────────────────────────────────────────
const PT_BORDER_STYLE           = 'Solid';
const PT_BORDER_COLOR           = '#E5E7EB';
const PT_BORDER_WIDTH           = 1;
const PT_BORDERS                = 'Inners only';

const PCT_SHOW_ICONS            = false;
const PCT_WIDTH                 = 'Auto';
const PCT_HEIGHT                = 48;
const PCT_BG_COLOR              = '#F3F4F6';
const PCT_BG_OPACITY            = 100;
const PCT_FONT_FAM              = 'Auto';
const PCT_BOLD                  = true;
const PCT_TEXT_COLOR            = '#111827';
const PCT_SIZE                  = 14;
const PCT_ALIGNMENT             = 'Left';
const PCT_BORDER_VIS            = 'Bottom';
const PCT_BORDER_STYLE          = 'Solid';
const PCT_BORDER_COLOR          = '#E5E7EB';
const PCT_BORDER_WIDTH          = 1;

const PRH_WIDTH                 = 'Auto';
const PRH_HEIGHT                = 48;
const PRH_BG_COLOR              = '#F9FAFB';
const PRH_BG_OPACITY            = 100;
const PRH_FONT_FAM              = 'Auto';
const PRH_BOLD                  = true;
const PRH_TEXT_COLOR            = '#111827';
const PRH_SIZE                  = 14;
const PRH_ALIGNMENT             = 'Left';
const PRH_BORDER_VIS            = 'Right';
const PRH_BORDER_STYLE          = 'Solid';
const PRH_BORDER_COLOR          = '#E5E7EB';
const PRH_BORDER_WIDTH          = 1;
const PRH_PAD_TOP               = 8;
const PRH_PAD_RIGHT             = 12;
const PRH_PAD_BOTTOM            = 8;
const PRH_PAD_LEFT              = 12;

const PCV_BG_COLOR              = '#FFFFFF';
const PCV_ALT_COLOR             = '#FFFFFF';   // same as base — no stripe
const PCV_BG_OPACITY            = 100;
const PCV_ALT_OPACITY           = 100;
const PCV_FONT_FAM              = 'Auto';
const PCV_BOLD                  = false;
const PCV_TEXT_COLOR            = '#374151';
const PCV_SIZE                  = 14;
const PCV_BORDER_VIS            = 'Bottom';
const PCV_BORDER_STYLE          = 'Solid';
const PCV_BORDER_COLOR          = '#E5E7EB';
const PCV_BORDER_WIDTH          = 1;
const PCV_PAD_TOP               = 8;
const PCV_PAD_RIGHT             = 12;
const PCV_PAD_BOTTOM            = 8;
const PCV_PAD_LEFT              = 12;
const PCV_MISSING               = '–';
const PCV_DECIMALS              = 1;
const PCV_SHORT_NUM             = true;
const PCV_CUSTOMIZE             = false;

// ─── Style constants – Pivot Table Totals ─────────────────────────────────────
const PTH_ENABLED               = true;
const PTH_LABEL                 = 'Total';
const PTH_WIDTH                 = 'Auto';
const PTH_HEIGHT                = 48;
const PTH_BG_COLOR              = '#EFF6FF';
const PTH_BG_OPACITY            = 100;
const PTH_FONT                  = 'Auto';
const PTH_BOLD                  = true;
const PTH_COLOR                 = '#0B3A67';
const PTH_SIZE                  = 14;
const PTH_ALIGN                 = 'Left';
const PTH_BORDER_STYLE          = 'Solid';
const PTH_BORDER_COLOR          = '#E5E7EB';
const PTH_BORDER_WIDTH          = 1;
const PTH_BORDER_VIS            = 'Bottom';

const PTV_BG_COLOR              = '#F0F9FF';
const PTV_BG_OPACITY            = 100;
const PTV_FONT                  = 'Auto';
const PTV_BOLD                  = true;
const PTV_COLOR                 = '#0F172A';
const PTV_SIZE                  = 14;
const PTV_BORDER_STYLE          = 'Solid';
const PTV_BORDER_COLOR          = '#E5E7EB';
const PTV_BORDER_WIDTH          = 1;
const PTV_BORDER_VIS            = 'Bottom';
const PTV_PT                    = 8;
const PTV_PR                    = 12;
const PTV_PB                    = 8;
const PTV_PL                    = 12;
const PTV_MISSING               = '–';
const PTV_DECIMALS              = 1;
const PTV_SHORT_NUM             = true;

const TPRH_ENABLED              = true;
const TPRH_LABEL                = 'Total';
const TPRH_WIDTH                = 'Auto';
const TPRH_HEIGHT               = 48;
const TPRH_BG_COLOR             = '#EFF6FF';
const TPRH_BG_OPACITY           = 100;
const TPRH_FONT                 = 'Auto';
const TPRH_BOLD                 = true;
const TPRH_COLOR                = '#0B3A67';
const TPRH_SIZE                 = 14;
const TPRH_ALIGN                = 'Left';
const TPRH_BORDER_STYLE         = 'Solid';
const TPRH_BORDER_COLOR         = '#E5E7EB';
const TPRH_BORDER_WIDTH         = 1;
const TPRH_BORDER_VIS           = 'Top';

const PRV_BG_COLOR              = '#F0F9FF';
const PRV_BG_OPACITY            = 100;
const PRV_FONT                  = 'Auto';
const PRV_BOLD                  = true;
const PRV_COLOR                 = '#0F172A';
const PRV_SIZE                  = 14;
const PRV_BORDER_STYLE          = 'Solid';
const PRV_BORDER_COLOR          = '#E5E7EB';
const PRV_BORDER_WIDTH          = 1;
const PRV_BORDER_VIS            = 'Top';
const PRV_PT                    = 8;
const PRV_PR                    = 12;
const PRV_PB                    = 8;
const PRV_PL                    = 12;
const PRV_MISSING               = '–';
const PRV_DECIMALS              = 1;
const PRV_SHORT_NUM             = true;

const GTC_BG_COLOR              = '#DBEAFE';
const GTC_BG_OPACITY            = 100;
const GTC_FONT                  = 'Auto';
const GTC_BOLD                  = true;
const GTC_COLOR                 = '#0B3A67';
const GTC_SIZE                  = 14;

// ─── Data – Regular Table ─────────────────────────────────────────────────────
interface TableRow {
  id: number;
  product: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

const tableData: TableRow[] = [
  { id: 1, product: 'Laptop Pro 15',  category: 'Electronics', price: 1299.5, stock: 45,  status: 'In Stock'     },
  { id: 2, product: 'Wireless Mouse', category: 'Accessories', price: 29.99,  stock: 120, status: 'In Stock'     },
  { id: 3, product: 'USB-C Cable',    category: 'Accessories', price: 12.50,  stock: 200, status: 'In Stock'     },
  { id: 4, product: 'Monitor 27in',   category: 'Electronics', price: 349.0,  stock: 18,  status: 'Low Stock'    },
  { id: 5, product: 'Keyboard RGB',   category: 'Accessories', price: 89.99,  stock: 67,  status: 'In Stock'     },
  { id: 6, product: 'Webcam HD',      category: 'Electronics', price: 79.5,   stock: 0,   status: 'Out of Stock' },
  { id: 7, product: 'Headphones',     category: 'Audio',       price: 149.0,  stock: 34,  status: 'In Stock'     },
  { id: 8, product: 'Desk Lamp',      category: 'Furniture',   price: 45.99,  stock: 89,  status: 'In Stock'     },
];

// ─── Data – Pivot Table (nested) ──────────────────────────────────────────────
interface PivotChild {
  label: string;
  inProgress: number;
  completed: number;
}
interface PivotCategory {
  key: string;
  label: string;
  children: PivotChild[];
}

const PIVOT_DATA: PivotCategory[] = [
  {
    key: 'IT', label: 'IT',
    children: [
      { label: 'Alpha', inProgress: 1, completed: 4 },
      { label: 'Beta',  inProgress: 2, completed: 3 },
      { label: 'Gamma', inProgress: 4, completed: 5 },
    ],
  },
  {
    key: 'HR', label: 'HR',
    children: [
      { label: 'Alpha', inProgress: 1, completed: 2 },
      { label: 'Beta',  inProgress: 2, completed: 1 },
      { label: 'Gamma', inProgress: 3, completed: 2 },
    ],
  },
  {
    key: 'Finance', label: 'Finance',
    children: [
      { label: 'Alpha', inProgress: 2, completed: 3 },
      { label: 'Beta',  inProgress: 1, completed: 2 },
      { label: 'Gamma', inProgress: 2, completed: 4 },
    ],
  },
];

// Compute category totals
function getCatTotals(cat: PivotCategory) {
  const inProgress = cat.children.reduce((s, c) => s + c.inProgress, 0);
  const completed  = cat.children.reduce((s, c) => s + c.completed, 0);
  return { inProgress, completed, total: inProgress + completed };
}

// Grand totals
const GRAND_IN_PROGRESS = PIVOT_DATA.reduce((s, c) => s + getCatTotals(c).inProgress, 0);
const GRAND_COMPLETED   = PIVOT_DATA.reduce((s, c) => s + getCatTotals(c).completed,  0);
const GRAND_TOTAL       = GRAND_IN_PROGRESS + GRAND_COMPLETED;

// ─── Style panel ──────────────────────────────────────────────────────────────
interface StyleSection {
  title: string;
  headerBg: string;
  rows: Array<[string, string]>;
}

function StylePanel({ variant, sections }: { variant: string; sections: StyleSection[] }) {
  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: FONT }}>Style Configuration</h2>
      <p className="text-xs text-gray-400 mb-5" style={{ fontFamily: FONT }}>Variant: {variant}</p>
      {sections.map((sec) => (
        <div key={sec.title} className="mb-8">
          <h3
            className="text-base font-semibold mb-3 px-3 py-2 rounded"
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

// ─── Style sections ───────────────────────────────────────────────────────────
const tableSections: StyleSection[] = [
  {
    title: 'Basic styles – Table borders',
    headerBg: '#F5E6D3',
    rows: [
      ['Border style', TB_BORDER_STYLE],
      ['Border color', TB_BORDER_COLOR],
      ['Border width', String(TB_BORDER_WIDTH)],
      ['Border visibility', TB_BORDERS],
    ],
  },
  {
    title: 'Advanced styles – Column headers',
    headerBg: '#E8E1F5',
    rows: [
      ['Show icons',         CH_SHOW_ICONS ? 'Yes' : 'No'],
      ['Width',              CH_WIDTH],
      ['Height',             String(CH_HEIGHT)],
      ['Background color',   CH_BG_COLOR],
      ['Background opacity', CH_BG_OPACITY + '%'],
      ['Font family',        CH_FONT_FAM],
      ['Bold',               CH_BOLD ? 'Yes' : 'No'],
      ['Color',              CH_TEXT_COLOR],
      ['Size',               String(CH_SIZE)],
      ['Text alignment',     CH_ALIGNMENT],
      ['Border style',       CH_BORDER_STYLE],
      ['Border color',       CH_BORDER_COLOR],
      ['Border width',       String(CH_BORDER_WIDTH)],
      ['Border visibility',  CH_BORDER_VIS],
    ],
  },
  {
    title: 'Advanced styles – Column values',
    headerBg: '#E8E1F5',
    rows: [
      ['Base background color',    CV_BASE_BG],
      ['Base background opacity',  CV_BASE_OPACITY + '%'],
      ['Alternating row color',    CV_ALT_COLOR],
      ['Alternating opacity',      CV_ALT_OPACITY + '%'],
      ['Font family',              CV_FONT_FAM],
      ['Bold',                     CV_BOLD ? 'Yes' : 'No'],
      ['Color',                    CV_TEXT_COLOR],
      ['Size',                     String(CV_SIZE)],
      ['Border style',             CV_BORDER_STYLE],
      ['Border color',             CV_BORDER_COLOR],
      ['Border width',             String(CV_BORDER_WIDTH)],
      ['Border visibility',        CV_BORDER_VIS],
      ['Padding top',              String(CV_PAD_TOP)],
      ['Padding right',            String(CV_PAD_RIGHT)],
      ['Padding bottom',           String(CV_PAD_BOTTOM)],
      ['Padding left',             String(CV_PAD_LEFT)],
      ['Display missing value as', CV_MISSING],
      ['Decimals',                 String(CV_DECIMALS)],
      ['Short number',             CV_SHORT_NUM ? 'Yes' : 'No'],
      ['Customize each column',    CV_CUSTOMIZE ? 'Yes' : 'No'],
    ],
  },
  {
    title: 'Advanced styles – Column values / Customization default',
    headerBg: '#E8E1F5',
    rows: [
      ['Show icons',               'No'],
      ['Base background color',    CV_BASE_BG],
      ['Base background opacity',  CV_BASE_OPACITY + '%'],
      ['Alternating row color',    CV_ALT_COLOR],
      ['Alternating opacity',      CV_ALT_OPACITY + '%'],
      ['Font family',              CV_FONT_FAM],
      ['Bold',                     CV_BOLD ? 'Yes' : 'No'],
      ['Color',                    CV_TEXT_COLOR],
      ['Size',                     String(CV_SIZE)],
      ['Border style',             CV_BORDER_STYLE],
      ['Border color',             CV_BORDER_COLOR],
      ['Border width',             String(CV_BORDER_WIDTH)],
      ['Border visibility',        CV_BORDER_VIS],
      ['Padding top',              String(CV_PAD_TOP)],
      ['Padding right',            String(CV_PAD_RIGHT)],
      ['Padding bottom',           String(CV_PAD_BOTTOM)],
      ['Padding left',             String(CV_PAD_LEFT)],
      ['Display missing value as', CV_MISSING],
      ['Decimals',                 String(CV_DECIMALS)],
      ['Short number',             CV_SHORT_NUM ? 'Yes' : 'No'],
    ],
  },
];

const pivotSections: StyleSection[] = [
  {
    title: 'Basic styles – Table borders',
    headerBg: '#FEF7E6',
    rows: [
      ['Border style', PT_BORDER_STYLE],
      ['Border color', PT_BORDER_COLOR],
      ['Border width', String(PT_BORDER_WIDTH)],
      ['Border visibility', PT_BORDERS],
    ],
  },
  {
    title: 'Advanced styles – Column headers',
    headerBg: '#E7F4FB',
    rows: [
      ['Show icons',         PCT_SHOW_ICONS ? 'Yes' : 'No'],
      ['Width',              PCT_WIDTH],
      ['Height',             String(PCT_HEIGHT)],
      ['Background color',   PCT_BG_COLOR],
      ['Background opacity', PCT_BG_OPACITY + '%'],
      ['Font family',        PCT_FONT_FAM],
      ['Bold',               PCT_BOLD ? 'Yes' : 'No'],
      ['Color',              PCT_TEXT_COLOR],
      ['Size',               String(PCT_SIZE)],
      ['Text alignment',     PCT_ALIGNMENT],
      ['Border style',       PCT_BORDER_STYLE],
      ['Border color',       PCT_BORDER_COLOR],
      ['Border width',       String(PCT_BORDER_WIDTH)],
      ['Border visibility',  PCT_BORDER_VIS],
    ],
  },
  {
    title: 'Advanced styles – Row headers',
    headerBg: '#E7F4FB',
    rows: [
      ['Width',              PRH_WIDTH],
      ['Height',             String(PRH_HEIGHT)],
      ['Background color',   PRH_BG_COLOR],
      ['Background opacity', PRH_BG_OPACITY + '%'],
      ['Font family',        PRH_FONT_FAM],
      ['Bold',               PRH_BOLD ? 'Yes' : 'No'],
      ['Color',              PRH_TEXT_COLOR],
      ['Size',               String(PRH_SIZE)],
      ['Text alignment',     PRH_ALIGNMENT],
      ['Border style',       PRH_BORDER_STYLE],
      ['Border color',       PRH_BORDER_COLOR],
      ['Border width',       String(PRH_BORDER_WIDTH)],
      ['Border visibility',  PRH_BORDER_VIS],
    ],
  },
  {
    title: 'Advanced styles – Column values',
    headerBg: '#F4F0FA',
    rows: [
      ['Background color',        PCV_BG_COLOR],
      ['Background opacity',      PCV_BG_OPACITY + '%'],
      ['Alternating row color',   PCV_ALT_COLOR],
      ['Alternating row opacity', PCV_ALT_OPACITY + '%'],
      ['Font family',             PCV_FONT_FAM],
      ['Bold',                    PCV_BOLD ? 'Yes' : 'No'],
      ['Color',                   PCV_TEXT_COLOR],
      ['Size',                    String(PCV_SIZE)],
      ['Border style',            PCV_BORDER_STYLE],
      ['Border color',            PCV_BORDER_COLOR],
      ['Border width',            String(PCV_BORDER_WIDTH)],
      ['Border visibility',       PCV_BORDER_VIS],
      ['Padding top',             String(PCV_PAD_TOP)],
      ['Padding right',           String(PCV_PAD_RIGHT)],
      ['Padding bottom',          String(PCV_PAD_BOTTOM)],
      ['Padding left',            String(PCV_PAD_LEFT)],
      ['Display missing value as',PCV_MISSING],
      ['Decimals',                String(PCV_DECIMALS)],
      ['Short number',            PCV_SHORT_NUM ? 'Yes' : 'No'],
      ['Customize each column',   PCV_CUSTOMIZE ? 'Yes' : 'No'],
    ],
  },
  {
    title: 'Advanced styles – Column values / Customization default',
    headerBg: '#F4F0FA',
    rows: [
      ['Show icons',              'No'],
      ['Background color',        PCV_BG_COLOR],
      ['Background opacity',      PCV_BG_OPACITY + '%'],
      ['Alternating row color',   PCV_ALT_COLOR],
      ['Alternating row opacity', PCV_ALT_OPACITY + '%'],
      ['Font family',             PCV_FONT_FAM],
      ['Bold',                    PCV_BOLD ? 'Yes' : 'No'],
      ['Color',                   PCV_TEXT_COLOR],
      ['Size',                    String(PCV_SIZE)],
      ['Border style',            PCV_BORDER_STYLE],
      ['Border color',            PCV_BORDER_COLOR],
      ['Border width',            String(PCV_BORDER_WIDTH)],
      ['Border visibility',       PCV_BORDER_VIS],
      ['Padding top',             String(PCV_PAD_TOP)],
      ['Padding right',           String(PCV_PAD_RIGHT)],
      ['Padding bottom',          String(PCV_PAD_BOTTOM)],
      ['Padding left',            String(PCV_PAD_LEFT)],
      ['Display missing value as',PCV_MISSING],
      ['Decimals',                String(PCV_DECIMALS)],
      ['Short number',            PCV_SHORT_NUM ? 'Yes' : 'No'],
    ],
  },
  {
    title: 'Advanced styles – Total column headers',
    headerBg: '#E7F4FB',
    rows: [
      ['Enabled',            PTH_ENABLED ? 'Yes' : 'No'],
      ['Label',              PTH_LABEL],
      ['Width',              PTH_WIDTH],
      ['Height',             String(PTH_HEIGHT)],
      ['Background color',   PTH_BG_COLOR],
      ['Background opacity', PTH_BG_OPACITY + '%'],
      ['Font family',        PTH_FONT],
      ['Bold',               PTH_BOLD ? 'Yes' : 'No'],
      ['Color',              PTH_COLOR],
      ['Size',               String(PTH_SIZE)],
      ['Text alignment',     PTH_ALIGN],
      ['Border style',       PTH_BORDER_STYLE],
      ['Border color',       PTH_BORDER_COLOR],
      ['Border width',       String(PTH_BORDER_WIDTH)],
      ['Border visibility',  PTH_BORDER_VIS],
    ],
  },
  {
    title: 'Advanced styles – Total column values',
    headerBg: '#F4F0FA',
    rows: [
      ['Background color',        PTV_BG_COLOR],
      ['Background opacity',      PTV_BG_OPACITY + '%'],
      ['Font family',             PTV_FONT],
      ['Bold',                    PTV_BOLD ? 'Yes' : 'No'],
      ['Color',                   PTV_COLOR],
      ['Size',                    String(PTV_SIZE)],
      ['Border style',            PTV_BORDER_STYLE],
      ['Border color',            PTV_BORDER_COLOR],
      ['Border width',            String(PTV_BORDER_WIDTH)],
      ['Border visibility',       PTV_BORDER_VIS],
      ['Padding top',             String(PTV_PT)],
      ['Padding right',           String(PTV_PR)],
      ['Padding bottom',          String(PTV_PB)],
      ['Padding left',            String(PTV_PL)],
      ['Display missing value as',PTV_MISSING],
      ['Decimals',                String(PTV_DECIMALS)],
      ['Short number',            PTV_SHORT_NUM ? 'Yes' : 'No'],
    ],
  },
  {
    title: 'Advanced styles – Total row headers',
    headerBg: '#E7F4FB',
    rows: [
      ['Enabled',            TPRH_ENABLED ? 'Yes' : 'No'],
      ['Label',              TPRH_LABEL],
      ['Width',              TPRH_WIDTH],
      ['Height',             String(TPRH_HEIGHT)],
      ['Background color',   TPRH_BG_COLOR],
      ['Background opacity', TPRH_BG_OPACITY + '%'],
      ['Font family',        TPRH_FONT],
      ['Bold',               TPRH_BOLD ? 'Yes' : 'No'],
      ['Color',              TPRH_COLOR],
      ['Size',               String(TPRH_SIZE)],
      ['Text alignment',     TPRH_ALIGN],
      ['Border style',       TPRH_BORDER_STYLE],
      ['Border color',       TPRH_BORDER_COLOR],
      ['Border width',       String(TPRH_BORDER_WIDTH)],
      ['Border visibility',  TPRH_BORDER_VIS],
    ],
  },
  {
    title: 'Advanced styles – Total row values',
    headerBg: '#F4F0FA',
    rows: [
      ['Background color',        PRV_BG_COLOR],
      ['Background opacity',      PRV_BG_OPACITY + '%'],
      ['Font family',             PRV_FONT],
      ['Bold',                    PRV_BOLD ? 'Yes' : 'No'],
      ['Color',                   PRV_COLOR],
      ['Size',                    String(PRV_SIZE)],
      ['Border style',            PRV_BORDER_STYLE],
      ['Border color',            PRV_BORDER_COLOR],
      ['Border width',            String(PRV_BORDER_WIDTH)],
      ['Border visibility',       PRV_BORDER_VIS],
      ['Padding top',             String(PRV_PT)],
      ['Padding right',           String(PRV_PR)],
      ['Padding bottom',          String(PRV_PB)],
      ['Padding left',            String(PRV_PL)],
      ['Display missing value as',PRV_MISSING],
      ['Decimals',                String(PRV_DECIMALS)],
      ['Short number',            PRV_SHORT_NUM ? 'Yes' : 'No'],
    ],
  },
  {
    title: 'Advanced styles – Grand total cell',
    headerBg: '#FEF7E6',
    rows: [
      ['Background color',   GTC_BG_COLOR],
      ['Background opacity', GTC_BG_OPACITY + '%'],
      ['Font family',        GTC_FONT],
      ['Bold',               GTC_BOLD ? 'Yes' : 'No'],
      ['Color',              GTC_COLOR],
      ['Size',               String(GTC_SIZE)],
    ],
  },
];

// ─── Visualizations ───────────────────────────────────────────────────────────
function RegularTable() {
  const { show, move, hide, TipEl } = useTip();
  const borderBottom = CV_BORDER_WIDTH + 'px solid ' + CV_BORDER_COLOR;
  return (
    <>
      {TipEl}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
      <thead>
        <tr style={{ backgroundColor: CH_BG_COLOR, height: CH_HEIGHT + 'px' }}>
          {['ID', 'Product', 'Category', 'Price', 'Stock', 'Status'].map((col) => (
            <th
              key={col}
              style={{
                textAlign: 'left',
                color: CH_TEXT_COLOR,
                fontSize: CH_SIZE + 'px',
                fontWeight: CH_BOLD ? 'bold' : 'normal',
                borderBottom: CH_BORDER_WIDTH + 'px solid ' + CH_BORDER_COLOR,
                padding: '12px ' + CV_PAD_RIGHT + 'px',
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr
            key={row.id}
            style={{ backgroundColor: CV_BASE_BG, cursor: 'default' }}
            onMouseEnter={e => show(e, row.product, [
              { k: 'ID', v: String(row.id) },
              { k: 'Category', v: row.category },
              { k: 'Price', v: '$' + row.price.toFixed(1) },
              { k: 'Stock', v: String(row.stock) },
              { k: 'Status', v: row.status },
            ])}
            onMouseMove={move}
            onMouseLeave={hide}
          >
            <td style={{ color: CV_TEXT_COLOR, fontSize: CV_SIZE + 'px', borderBottom, padding: CV_PAD_TOP + 'px ' + CV_PAD_RIGHT + 'px ' + CV_PAD_BOTTOM + 'px ' + CV_PAD_LEFT + 'px' }}>{row.id}</td>
            <td style={{ color: CV_TEXT_COLOR, fontSize: CV_SIZE + 'px', borderBottom, padding: CV_PAD_TOP + 'px ' + CV_PAD_RIGHT + 'px ' + CV_PAD_BOTTOM + 'px ' + CV_PAD_LEFT + 'px' }}>{row.product}</td>
            <td style={{ color: CV_TEXT_COLOR, fontSize: CV_SIZE + 'px', borderBottom, padding: CV_PAD_TOP + 'px ' + CV_PAD_RIGHT + 'px ' + CV_PAD_BOTTOM + 'px ' + CV_PAD_LEFT + 'px' }}>{row.category}</td>
            <td style={{ color: CV_TEXT_COLOR, fontSize: CV_SIZE + 'px', borderBottom, padding: CV_PAD_TOP + 'px ' + CV_PAD_RIGHT + 'px ' + CV_PAD_BOTTOM + 'px ' + CV_PAD_LEFT + 'px' }}>{'$' + row.price.toFixed(1)}</td>
            <td style={{ color: CV_TEXT_COLOR, fontSize: CV_SIZE + 'px', borderBottom, padding: CV_PAD_TOP + 'px ' + CV_PAD_RIGHT + 'px ' + CV_PAD_BOTTOM + 'px ' + CV_PAD_LEFT + 'px' }}>{row.stock}</td>
            <td style={{ color: CV_TEXT_COLOR, fontSize: CV_SIZE + 'px', borderBottom, padding: CV_PAD_TOP + 'px ' + CV_PAD_RIGHT + 'px ' + CV_PAD_BOTTOM + 'px ' + CV_PAD_LEFT + 'px' }}>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────
function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{
        display: 'inline-block',
        flexShrink: 0,
        transition: 'transform 0.18s',
        transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
      }}
    >
      <path d="M3 5L7 9L11 5" stroke={PRH_TEXT_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Pivot Table ──────────────────────────────────────────────────────────────
function PivotTable() {
  const { show, move, hide, TipEl } = useTip();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(PIVOT_DATA.map((c) => [c.key, true]))
  );

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const colHdrBorder  = PCT_BORDER_WIDTH + 'px solid ' + PCT_BORDER_COLOR;
  const cellBorder    = PCV_BORDER_WIDTH + 'px solid ' + PCV_BORDER_COLOR;
  const cellPad       = PCV_PAD_TOP + 'px ' + PCV_PAD_RIGHT + 'px ' + PCV_PAD_BOTTOM + 'px ' + PCV_PAD_LEFT + 'px';
  const rhPad         = PRH_PAD_TOP + 'px ' + PRH_PAD_RIGHT + 'px ' + PRH_PAD_BOTTOM + 'px ' + PRH_PAD_LEFT + 'px';

  // shared column header style
  const colHdrBase: React.CSSProperties = {
    backgroundColor: PCT_BG_COLOR,
    height: PCT_HEIGHT + 'px',
    fontWeight: PCT_BOLD ? 'bold' : 'normal',
    color: PCT_TEXT_COLOR,
    fontSize: PCT_SIZE + 'px',
    textAlign: 'left',
    borderBottom: colHdrBorder,
    padding: cellPad,
    minWidth: 130,
    whiteSpace: 'nowrap',
  };

  // category (parent) row header cell
  const catLabelCell: React.CSSProperties = {
    backgroundColor: PRH_BG_COLOR,
    height: PRH_HEIGHT + 'px',
    fontWeight: 'bold',
    color: PRH_TEXT_COLOR,
    fontSize: PRH_SIZE + 'px',
    textAlign: 'left',
    borderBottom: cellBorder,
    padding: rhPad,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  };

  // child (sub-row) row header cell
  const childLabelCell: React.CSSProperties = {
    backgroundColor: PCV_BG_COLOR,
    height: PRH_HEIGHT + 'px',
    fontWeight: 'normal',
    color: PCV_TEXT_COLOR,
    fontSize: PCV_SIZE + 'px',
    textAlign: 'left',
    borderBottom: cellBorder,
    paddingTop: PCV_PAD_TOP,
    paddingBottom: PCV_PAD_BOTTOM,
    paddingRight: PCV_PAD_RIGHT,
    paddingLeft: PCV_PAD_LEFT + 28,  // indent
    whiteSpace: 'nowrap',
  };

  // regular data cell (non-total)
  const dataCell = (bold = false): React.CSSProperties => ({
    backgroundColor: PCV_BG_COLOR,
    color: PCV_TEXT_COLOR,
    fontSize: PCV_SIZE + 'px',
    fontWeight: bold ? 'bold' : 'normal',
    borderBottom: cellBorder,
    padding: cellPad,
    textAlign: 'left',
  });

  // total column cell (always bold, white bg)
  const totalDataCell: React.CSSProperties = {
    backgroundColor: PCV_BG_COLOR,
    color: PCV_TEXT_COLOR,
    fontSize: PCV_SIZE + 'px',
    fontWeight: 'bold',
    borderBottom: cellBorder,
    borderLeft: PT_BORDER_WIDTH + 'px solid ' + PT_BORDER_COLOR,
    padding: cellPad,
    textAlign: 'left',
  };

  // category summary total column cell (bold, header bg)
  const catTotalCell: React.CSSProperties = {
    backgroundColor: PRH_BG_COLOR,
    color: PRH_TEXT_COLOR,
    fontSize: PCV_SIZE + 'px',
    fontWeight: 'bold',
    borderBottom: cellBorder,
    borderLeft: PT_BORDER_WIDTH + 'px solid ' + PT_BORDER_COLOR,
    padding: cellPad,
    textAlign: 'left',
  };

  // grand total row cells
  const grandTotalRowCell: React.CSSProperties = {
    backgroundColor: PCT_BG_COLOR,
    color: PCT_TEXT_COLOR,
    fontSize: PCV_SIZE + 'px',
    fontWeight: 'bold',
    borderTop: PT_BORDER_WIDTH + 'px solid ' + PT_BORDER_COLOR,
    padding: cellPad,
    textAlign: 'left',
  };

  const grandTotalRowCellTotal: React.CSSProperties = {
    ...grandTotalRowCell,
    borderLeft: PT_BORDER_WIDTH + 'px solid ' + PT_BORDER_COLOR,
  };

  return (
    <>
      {TipEl}
      <table style={{ borderCollapse: 'collapse', fontFamily: FONT, width: '100%' }}>
      <thead>
        <tr>
          {/* Project column header */}
          <th style={{ ...colHdrBase, minWidth: 160 }}>Project</th>
          <th style={colHdrBase}>In Progress</th>
          <th style={colHdrBase}>Completed</th>
          {/* Total column header */}
          <th style={{
            ...colHdrBase,
            fontWeight: 'bold',
            borderLeft: PT_BORDER_WIDTH + 'px solid ' + PT_BORDER_COLOR,
          }}>
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {PIVOT_DATA.map((cat) => {
          const totals = getCatTotals(cat);
          const isOpen = expanded[cat.key];
          return (
            <React.Fragment key={cat.key}>
              {/* Category row */}
              <tr onClick={() => toggle(cat.key)} style={{ cursor: 'pointer' }}>
                <td style={catLabelCell}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Chevron expanded={isOpen} />
                    {cat.label}
                  </span>
                </td>
                <td style={{ ...dataCell(true), backgroundColor: PRH_BG_COLOR }}>{totals.inProgress}</td>
                <td style={{ ...dataCell(true), backgroundColor: PRH_BG_COLOR }}>{totals.completed}</td>
                <td style={catTotalCell}>{totals.total}</td>
              </tr>

              {/* Child rows */}
              {isOpen && cat.children.map((child) => (
                <tr
                  key={child.label}
                  onMouseEnter={e => show(e, `${cat.label} — ${child.label}`, [
                    { k: 'In Progress', v: String(child.inProgress) },
                    { k: 'Completed', v: String(child.completed) },
                    { k: 'Total', v: String(child.inProgress + child.completed) },
                  ])}
                  onMouseMove={move}
                  onMouseLeave={hide}
                >
                  <td style={childLabelCell}>{child.label}</td>
                  <td style={dataCell(false)}>{child.inProgress}</td>
                  <td style={dataCell(false)}>{child.completed}</td>
                  <td style={totalDataCell}>{child.inProgress + child.completed}</td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}

        {/* Grand total row */}
        <tr>
          <td style={{
            ...grandTotalRowCell,
            textAlign: 'left',
            padding: rhPad,
          }}>
            Total
          </td>
          <td style={grandTotalRowCell}>{GRAND_IN_PROGRESS}</td>
          <td style={grandTotalRowCell}>{GRAND_COMPLETED}</td>
          <td style={grandTotalRowCellTotal}>{GRAND_TOTAL}</td>
        </tr>
      </tbody>
    </table>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function TableView() {
  const [variant, setVariant] = useState<TableVariant>('table');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-tabs */}
      <div style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', flexShrink: 0, display: 'flex', paddingLeft: 16 }}>
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setVariant(t.key)}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontFamily: FONT,
              fontWeight: variant === t.key ? 600 : 500,
              color: variant === t.key ? '#2563EB' : '#6B7280',
              background: 'none',
              border: 'none',
              borderBottom: variant === t.key ? '2px solid #2563EB' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
          {variant === 'table' ? <RegularTable /> : <PivotTable />}
        </div>
        <StylePanel
          variant={variant === 'table' ? 'Table' : 'Pivot Table'}
          sections={variant === 'table' ? tableSections : pivotSections}
        />
      </div>
    </div>
  );
}