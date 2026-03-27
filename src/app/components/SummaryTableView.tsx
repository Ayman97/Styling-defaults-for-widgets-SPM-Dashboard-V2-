import React from 'react';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style Constants (exactly matching Comparison table) ───────────────────────

// Basic styles – Table borders
const TB_BORDER_STYLE  = 'Solid';
const TB_BORDER_COLOR  = '#E5E7EB';
const TB_BORDER_WIDTH  = 1;
const TB_BORDERS       = 'All';

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
const RH_BG_COLOR      = '#F3F4F6';
const RH_BG_OPACITY    = 100;
const RH_FONT_FAM      = 'Auto';
const RH_BOLD          = true;
const RH_TEXT_COLOR    = '#111827';
const RH_SIZE          = 14;
const RH_ALIGNMENT     = 'Left';
const RH_BORDER_VIS    = 'Bottom';
const RH_BORDER_STYLE  = 'Solid';
const RH_BORDER_COLOR  = '#E5E7EB';
const RH_BORDER_WIDTH  = 1;

// Advanced styles – Column values
const CV_BG_COLOR      = '#FFFFFF';
const CV_BG_OPACITY    = 100;
const CV_ALT_COLOR     = '#FFFFFF';
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
const PC_ALT_COLOR     = '#FFFFFF';
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
const COLUMNS = ['Value A', 'Value B'];
const ROWS: { label: string; values: string[] }[] = [
  { label: 'Item 1', values: ['Value', 'Value'] },
  { label: 'Item 2', values: ['Value', 'Value'] },
  { label: 'Item 3', values: ['Value', 'Value'] },
];

// ─── Table Visualization ──────────────────────────────────────────────────────
const TableViz: React.FC = () => (
  <table style={{ borderCollapse: 'collapse', tableLayout: 'auto' }}>
    <thead>
      <tr>
        {COLUMNS.map((col) => (
          <th key={col} colSpan={2} style={{
            backgroundColor: CH_BG_COLOR,
            height: CH_HEIGHT + 'px',
            borderBottom: `${CH_BORDER_WIDTH}px ${CH_BORDER_STYLE.toLowerCase()} ${CH_BORDER_COLOR}`,
            borderRight: `${CH_BORDER_WIDTH}px ${CH_BORDER_STYLE.toLowerCase()} ${CH_BORDER_COLOR}`,
            fontFamily: FONT,
            fontWeight: CH_BOLD ? 'bold' : 'normal',
            color: CH_TEXT_COLOR,
            fontSize: CH_SIZE + 'px',
            textAlign: CH_ALIGNMENT.toLowerCase() as 'left',
            padding: `0 ${CV_PAD_RIGHT}px 0 ${CV_PAD_LEFT}px`,
            whiteSpace: 'nowrap',
          }}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {ROWS.map((row, rowIdx) => (
        <tr key={row.label}>
          {COLUMNS.map((_, colIdx) => (
            <React.Fragment key={colIdx}>
              {/* Key cell — row header style */}
              <td style={{
                backgroundColor: RH_BG_COLOR,
                height: RH_HEIGHT + 'px',
                borderBottom: `${RH_BORDER_WIDTH}px ${RH_BORDER_STYLE.toLowerCase()} ${RH_BORDER_COLOR}`,
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
              {/* Value cell — column value style */}
              <td style={{
                backgroundColor: rowIdx % 2 === 0 ? CV_BG_COLOR : CV_ALT_COLOR,
                height: RH_HEIGHT + 'px',
                borderBottom: `${CV_BORDER_WIDTH}px ${CV_BORDER_STYLE.toLowerCase()} ${CV_BORDER_COLOR}`,
                borderRight: colIdx < COLUMNS.length - 1 ? `${CH_BORDER_WIDTH}px ${CH_BORDER_STYLE.toLowerCase()} ${CH_BORDER_COLOR}` : undefined,
                padding: `${CV_PAD_TOP}px ${CV_PAD_RIGHT}px ${CV_PAD_BOTTOM}px ${CV_PAD_LEFT}px`,
                fontFamily: FONT,
                fontWeight: CV_BOLD ? 'bold' : 'normal',
                color: CV_TEXT_COLOR,
                fontSize: CV_SIZE + 'px',
                minWidth: 120,
              }}>
                {row.values[colIdx]}
              </td>
            </React.Fragment>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// ─── Style Panel ──────────────────────────────────────────────────────────────
type StyleRow = [string, string];
interface Section { title: string; headerBg: string; rows: StyleRow[]; }

const SECTIONS: Section[] = [
  {
    title: 'Table borders',
    headerBg: '#FEF7E6',
    rows: [
      ['Border style',      TB_BORDER_STYLE],
      ['Border color',      TB_BORDER_COLOR],
      ['Border width',      String(TB_BORDER_WIDTH)],
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
      ['Text color',          CH_TEXT_COLOR],
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
      ['Text color',          RH_TEXT_COLOR],
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
      ['Text color',              CV_TEXT_COLOR],
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
      ['Alternating color',       PC_ALT_COLOR],
      ['Alternating opacity',     PC_ALT_OPACITY + '%'],
      ['Font family',             PC_FONT_FAM],
      ['Bold',                    PC_BOLD ? 'Yes' : 'No'],
      ['Text color',              PC_TEXT_COLOR],
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

// ─── Main Export ──────────────────────────────────────────────────────────────
export function SummaryTableView() {
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