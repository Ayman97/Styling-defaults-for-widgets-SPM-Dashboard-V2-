import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { GaugeChart } from './GaugeChart';

const FONT = 'Plus Jakarta Sans, sans-serif';

type MetricVariant = 'default' | 'comparison' | 'sparkline' | 'progress' | 'gauge';

const SUB_TABS: { key: MetricVariant; label: string }[] = [
  { key: 'default',    label: 'Percentage'        },
  { key: 'comparison', label: 'With Comparison'   },
  { key: 'sparkline',  label: 'With Sparkline'    },
  { key: 'progress',   label: 'Circular Progress' },
  { key: 'gauge',      label: 'Gauge'             },
];

// ─── Style Constants per variant ──────────────────────────────────────────────

// ── Shared across variants 1, 2, 3 ──
const SHARED_VALUE_SIZE   = 48;          // unified value size for default / comparison / sparkline
const DEF_VALUE_COLOR     = '#0F172A';
const DEF_LABEL_COLOR     = '#6B7280';   // grey — shared with comparison label
const DEF_LABEL_SIZE      = 14;
const DEF_LAYOUT          = 'Vertical';
const DEF_LABEL_VALUE_GAP = '8';
const DEF_TRACK_COLOR     = '#D6E8F5';
const DEF_PROGRESS_COLOR  = '#0B3A67';
const DEF_DL_COLOR        = '#0F172A';
const DEF_DL_SIZE         = 16;
const DEF_CMP_ENABLED     = 'No';
const DEF_CMP_LABEL_COLOR = '#6B7280';
const DEF_CMP_VAL_COLOR   = '#679558';
const DEF_CMP_VAL_SIZE    = 18;

// ── Comparison ──
const CMP_VALUE_GAP       = 24;
const CMP_DL_COLOR        = '#6B7280';
const CMP_DL_SIZE         = 12;
const CMP_LABEL_COLOR     = '#6B7280';
const CMP_VAL_COLOR       = '#679558';
const CMP_VAL_SIZE        = 18;

// ── Sparkline ──
const SPK_DL_COLOR        = '#6B7280';
const SPK_DL_SIZE         = 12;
const SPK_TRACK_COLOR     = '#D6E8F5';
const SPK_PROGRESS_COLOR  = '#0B3A67';

// ── Circular Progress ──
const PRG_VALUE_SIZE      = 32;
const PRG_VALUE_COLOR     = '#0F172A';
const PRG_TRACK_COLOR     = '#D6E8F5';   // palette[7] — light tint for track ring
const PRG_PROGRESS_COLOR  = '#0B3A67';   // palette[0] — base color for progress arc

// ── Gauge ──
const GAU_VALUE_SIZE      = 20;
const GAU_VALUE_COLOR     = '#0F172A';
const GAU_DL_COLOR        = '#0E293B';
const GAU_DL_SIZE         = 12;
const GAU_CMP_VAL_COLOR   = '#0F172A';
const GAU_CMP_VAL_SIZE    = 18;
// Threshold band colors
const GAU_BANDS: [number, string][] = [
  [0.80, '#B7352D'],  // Red: 0% – 80% (20s – 44s)
  [0.90, '#E8983E'],  // Orange: 80% – 90% (44s – 47s)
  [1.0,  '#2D7D32'],  // Green: 90% – 100% (47s – 50s)
];

// Gauge data range
const GAU_MIN = 20;
const GAU_MAX = 50;
const GAU_THRESHOLDS = [20, 44, 47, 50]; // boundary labels

// ── Icon (decorative icon shown on metric card) ──
const DEF_ICON_COLOR    = '#44546F';   // consistent with HDR_ICON_COLOR in CardView
const DEF_ICON_OPACITY  = '100%';
const DEF_ICON_POSITION = 'Center left';

// ── Widget container (Visual section) ──
const DEF_WIDGET_BG_COLOR   = '#FFFFFF';
const DEF_WIDGET_BG_OPACITY = '100%';
const DEF_WIDGET_PT         = 8;
const DEF_WIDGET_PR         = 12;
const DEF_WIDGET_PB         = 8;
const DEF_WIDGET_PL         = 12;
const DEF_WIDGET_CORNERS    = 16;        // consistent with ITEM_CORNERS in List/Card

// ─── Chart Components ─────────────────────────────────────────────────────────

// Thick filled up arrow (wide head + solid stem)
const ThickUpArrow: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = CMP_VAL_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 3, flexShrink: 0 }}>
    {/* Wide arrowhead */}
    <polygon points="8,1 15,8 11,8 11,15 5,15 5,8 1,8" />
  </svg>
);

type IconPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

// Decorative icon — shown on the metric card when enabled (no background)
const MetricIcon: React.FC = () => (
  <Activity size={24} color={DEF_ICON_COLOR} strokeWidth={1.5} style={{ flexShrink: 0 }} />
);

// ── Icon position helpers ──
const ICON_POSITION_GRID: (IconPosition | null)[][] = [
  ['top-left',    'top-center',    'top-right'],
  ['center-left',  null,           'center-right'],
  ['bottom-left', 'bottom-center', 'bottom-right'],
];

const getIconJustify = (pos: IconPosition): string => {
  if (pos.endsWith('-left'))   return 'flex-start';
  if (pos.endsWith('-center')) return 'center';
  return 'flex-end';
};

/** Wraps metric content and renders the icon at the chosen position */
const MetricIconLayout: React.FC<{
  showIcon: boolean;
  iconPosition: IconPosition;
  children: React.ReactNode;
}> = ({ showIcon, iconPosition, children }) => {
  if (!showIcon) return <>{children}</>;

  const isTop    = iconPosition.startsWith('top');
  const isCenter = iconPosition.startsWith('center');
  const isBottom = iconPosition.startsWith('bottom');
  const justify  = getIconJustify(iconPosition);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
      {isTop && (
        <div style={{ display: 'flex', justifyContent: justify }}>
          <MetricIcon />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {isCenter && iconPosition === 'center-left' && <MetricIcon />}
        {children}
        {isCenter && iconPosition === 'center-right' && <MetricIcon />}
      </div>
      {isBottom && (
        <div style={{ display: 'flex', justifyContent: justify }}>
          <MetricIcon />
        </div>
      )}
    </div>
  );
};

const DefaultMetric: React.FC<{ showIcon: boolean; iconPosition: IconPosition }> = ({ showIcon, iconPosition }) => (
  <MetricIconLayout showIcon={showIcon} iconPosition={iconPosition}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: DEF_LABEL_VALUE_GAP + 'px' }}>
      <div style={{ fontSize: DEF_LABEL_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: DEF_LABEL_COLOR, fontFamily: FONT }}>
        Metric label
      </div>
      <div style={{ fontSize: SHARED_VALUE_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: DEF_VALUE_COLOR, fontFamily: FONT }}>
        75%
      </div>
    </div>
  </MetricIconLayout>
);

const ComparisonMetric: React.FC<{ showIcon: boolean; iconPosition: IconPosition }> = ({ showIcon, iconPosition }) => (
  <MetricIconLayout showIcon={showIcon} iconPosition={iconPosition}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
      {/* Metric label — grey */}
      <div style={{ fontSize: DEF_LABEL_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: DEF_LABEL_COLOR, fontFamily: FONT }}>
        Metric label
      </div>
      {/* Row: main value | 24px gap | comparison block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: CMP_VALUE_GAP + 'px' }}>
        <div style={{ fontSize: SHARED_VALUE_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: DEF_VALUE_COLOR, fontFamily: FONT }}>
          75%
        </div>
        {/* Comparison block: label on top, value below */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: CMP_DL_SIZE + 'px', lineHeight: 1, color: CMP_LABEL_COLOR, fontFamily: FONT }}>
            Comparison label
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: CMP_VAL_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: CMP_VAL_COLOR, fontFamily: FONT }}>
            <ThickUpArrow /> 12%
          </span>
        </div>
      </div>
    </div>
  </MetricIconLayout>
);

const SparklineMetric: React.FC<{ showIcon: boolean; iconPosition: IconPosition }> = ({ showIcon, iconPosition }) => {
  const points = [22, 38, 28, 50, 35, 55, 42, 60, 48, 65];
  const w = 90; const h = 44;
  const max = Math.max(...points); const min = Math.min(...points);
  const range = max - min || 1;
  const d = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <MetricIconLayout showIcon={showIcon} iconPosition={iconPosition}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        {/* Metric label — grey */}
        <div style={{ fontSize: DEF_LABEL_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: DEF_LABEL_COLOR, fontFamily: FONT }}>
          Metric label
        </div>
        {/* Row: main value | 24px gap | [comparison label, comparison value, sparkline] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: CMP_VALUE_GAP + 'px' }}>
          <div style={{ fontSize: SHARED_VALUE_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: DEF_VALUE_COLOR, fontFamily: FONT }}>
            75%
          </div>
          {/* Comparison block: label → value → sparkline (top to bottom) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: SPK_DL_SIZE + 'px', lineHeight: 1, color: CMP_LABEL_COLOR, fontFamily: FONT }}>
              Comparison label
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: CMP_VAL_SIZE + 'px', lineHeight: 1, fontWeight: 'bold', color: CMP_VAL_COLOR, fontFamily: FONT }}>
              <ThickUpArrow /> 12%
            </span>
            {/* Sparkline below comparison value */}
            <svg width={w} height={h} style={{ flexShrink: 0 }}>
              <path d={d} fill="none" stroke={SPK_PROGRESS_COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={SPK_TRACK_COLOR} opacity="0.35" />
            </svg>
          </div>
        </div>
      </div>
    </MetricIconLayout>
  );
};

const ProgressMetric: React.FC<{ showIcon: boolean; iconPosition: IconPosition }> = ({ showIcon, iconPosition }) => {
  const pct = 75;
  const R = 65; const sw = 18;
  const circ = 2 * Math.PI * R;
  const offset = circ - (pct / 100) * circ;
  const sz = R * 2 + sw;

  return (
    <MetricIconLayout showIcon={showIcon} iconPosition={iconPosition}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: DEF_LABEL_SIZE + 'px', fontWeight: 'bold', color: DEF_LABEL_COLOR, fontFamily: FONT }}>
          Metric label
        </div>
        <div style={{ position: 'relative', width: sz + 'px', height: sz + 'px' }}>
          <svg width={sz} height={sz} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={sz / 2} cy={sz / 2} r={R} fill="none" stroke={PRG_TRACK_COLOR} strokeWidth={sw} strokeLinecap="round" />
            <circle cx={sz / 2} cy={sz / 2} r={R} fill="none" stroke={PRG_PROGRESS_COLOR} strokeWidth={sw}
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            fontSize: PRG_VALUE_SIZE + 'px', fontWeight: 'bold', color: PRG_VALUE_COLOR, fontFamily: FONT,
          }}>
            {pct}%
          </div>
        </div>
      </div>
    </MetricIconLayout>
  );
};

// ── SVG Gauge
// Replaced by the standalone GaugeChart component (GaugeChart.tsx)

// ─── Config Panels ───────────────────────────────────────────────────

interface SectionRow { label: string; value: string; }
interface SectionDef { title: string; headerBg: string; rows: SectionRow[]; }

const StylePanel: React.FC<{ variant: string; sections: SectionDef[] }> = ({ variant, sections }) => (
  <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
    <h2 className="text-xl font-bold mb-2" style={{ fontFamily: FONT }}>Style Configuration</h2>
    <p className="text-xs text-gray-500 mb-6" style={{ fontFamily: FONT }}>Variant: {variant}</p>
    {sections.map((sec) => (
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
            {sec.rows.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-gray-300" style={{ fontFamily: FONT }}>{row.label}</td>
                <td className="p-2 border border-gray-300" style={{ fontFamily: FONT }}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);

// ── Label section rows ──
const labelRows = (paddingBottom = '4'): SectionRow[] => [
  { label: 'Enabled',            value: 'Yes'           },
  { label: 'Label position',     value: 'Above value'   },
  { label: 'Width',              value: 'Auto'          },
  { label: 'Height',             value: 'Auto'          },
  { label: 'Background color',   value: 'Transparent'   },
  { label: 'Background opacity', value: '0%'            },
  { label: 'Font family',        value: 'Auto'          },
  { label: 'Bold',               value: 'Yes'           },
  { label: 'Color',              value: DEF_LABEL_COLOR },
  { label: 'Size',               value: String(DEF_LABEL_SIZE) },
  { label: 'Corners',            value: '0'             },
  { label: 'Padding top',        value: '0'             },
  { label: 'Padding right',      value: '0'             },
  { label: 'Padding bottom',     value: paddingBottom   },
  { label: 'Padding left',       value: '0'             },
];

// ── Visual section rows ──
const visualRows = (thresholds = 'No'): SectionRow[] => [
  { label: 'Layout',               value: DEF_LAYOUT              },
  { label: 'Label & value gap',    value: DEF_LABEL_VALUE_GAP     },
  { label: 'Icon color',           value: DEF_ICON_COLOR          },
  { label: 'Icon color opacity',   value: DEF_ICON_OPACITY        },
  { label: 'Icon position',        value: DEF_ICON_POSITION       },
  { label: 'Track color',          value: DEF_TRACK_COLOR         },
  { label: 'Track opacity',        value: '100%'                  },
  { label: 'Progress color',       value: DEF_PROGRESS_COLOR      },
  { label: 'Progress opacity',     value: '100%'                  },
  { label: 'Used palette',         value: 'Monochrome'            },
  { label: 'Thresholds',           value: thresholds              },
  { label: 'Background color',     value: DEF_WIDGET_BG_COLOR     },
  { label: 'Background opacity',   value: DEF_WIDGET_BG_OPACITY   },
  { label: 'Padding top',          value: String(DEF_WIDGET_PT)   },
  { label: 'Padding right',        value: String(DEF_WIDGET_PR)   },
  { label: 'Padding bottom',       value: String(DEF_WIDGET_PB)   },
  { label: 'Padding left',         value: String(DEF_WIDGET_PL)   },
  { label: 'Corners',              value: String(DEF_WIDGET_CORNERS) },
];

// ── Visual data labels rows — identical across all variants, only Enabled differs ──
const visualDataLabelRows = (enabled: boolean): SectionRow[] => [
  { label: 'Enabled',                  value: enabled ? 'Yes' : 'No' },
  { label: 'Position',                 value: 'Outside'              },
  { label: 'Background color',         value: 'Transparent'          },
  { label: 'Background opacity',       value: '0%'                   },
  { label: 'Font family',              value: 'Auto'                 },
  { label: 'Bold',                     value: 'No'                   },
  { label: 'Color',                    value: '#111827'              },
  { label: 'Size',                     value: '12'                   },
  { label: 'Display missing value as', value: '–'                    },
  { label: 'Decimals',                 value: '1'                    },
  { label: 'Short number',             value: 'Yes'                  },
];

// ── Comparison rows — identical across all variants, only Enabled differs ──
// Enabled: Yes only for variants 1 (default, No) and 2 (comparison, Yes); all others No
const comparisonRows = (enabled: boolean): SectionRow[] => [
  { label: 'Enabled',                   value: enabled ? 'Yes' : 'No' },
  { label: 'Label & value layout',      value: 'Vertical'              },
  { label: 'Label & value gap',         value: '4'                     },
  { label: 'Background color',          value: 'Transparent'           },
  { label: 'Background opacity',        value: '0%'                    },
  { label: 'Show label',                value: 'Yes'                   },
  { label: 'Label position',            value: 'Above value'           },
  { label: 'Label font family',         value: 'Auto'                  },
  { label: 'Label color',               value: DEF_CMP_LABEL_COLOR     },
  { label: 'Label size',                value: '12'                    },
  { label: 'Value font family',         value: 'Auto'                  },
  { label: 'Value color',               value: DEF_CMP_VAL_COLOR       },
  { label: 'Value size',                value: String(DEF_CMP_VAL_SIZE) },
  { label: 'Sparkline position',        value: 'Below comparison value' },
  { label: 'Display missing value as',  value: '–'                     },
  { label: 'Decimals',                  value: '1'                     },
  { label: 'Short number',              value: 'Yes'                   },
];

// ─── Sections per variant ─────────────────────────────────────────────────────

const defaultSections: SectionDef[] = [
  { title: 'Label', headerBg: '#FEF7E6', rows: labelRows('4') },
  {
    title: 'Value', headerBg: '#E7F4FB',
    rows: [
      { label: 'Enabled',            value: 'Yes'                  },
      { label: 'Width',              value: 'Auto'                 },
      { label: 'Height',             value: 'Auto'                 },
      { label: 'Background color',   value: 'Transparent'          },
      { label: 'Background opacity', value: '0%'                   },
      { label: 'Font family',        value: 'Auto'                 },
      { label: 'Bold',               value: 'Yes'                  },
      { label: 'Color',              value: DEF_VALUE_COLOR        },
      { label: 'Size',               value: String(SHARED_VALUE_SIZE) },
      { label: 'Corners',            value: '0'                    },
      { label: 'Padding top',        value: '0'                    },
      { label: 'Padding right',      value: '0'                    },
      { label: 'Padding bottom',     value: '0'                    },
      { label: 'Padding left',       value: '0'                    },
    ],
  },
  { title: 'Visual', headerBg: '#F4F0FA', rows: visualRows('No') },
  { title: 'Visual data labels', headerBg: '#F4F0FA', rows: visualDataLabelRows(false) },
  { title: 'Comparison', headerBg: '#E7F4FB', rows: comparisonRows(false) },
];

const comparisonSections: SectionDef[] = [
  { title: 'Label', headerBg: '#FEF7E6', rows: labelRows('4') },
  {
    title: 'Value', headerBg: '#E7F4FB',
    rows: [
      { label: 'Enabled',            value: 'Yes'                       },
      { label: 'Width',              value: 'Auto'                      },
      { label: 'Height',             value: 'Auto'                      },
      { label: 'Background color',   value: 'Transparent'               },
      { label: 'Background opacity', value: '0%'                        },
      { label: 'Font family',        value: 'Auto'                      },
      { label: 'Bold',               value: 'Yes'                       },
      { label: 'Color',              value: DEF_VALUE_COLOR             },
      { label: 'Size',               value: String(SHARED_VALUE_SIZE)      },
      { label: 'Corners',            value: '0'                         },
      { label: 'Padding top',        value: '0'                         },
      { label: 'Padding right',      value: String(CMP_VALUE_GAP)       },
      { label: 'Padding bottom',     value: '0'                         },
      { label: 'Padding left',       value: '0'                         },
    ],
  },
  { title: 'Visual', headerBg: '#F4F0FA', rows: visualRows('No') },
  { title: 'Visual data labels', headerBg: '#F4F0FA', rows: visualDataLabelRows(false) },
  { title: 'Comparison', headerBg: '#E7F4FB', rows: comparisonRows(true) },
];

const sparklineSections: SectionDef[] = [
  { title: 'Label', headerBg: '#FEF7E6', rows: labelRows('4') },
  {
    title: 'Value', headerBg: '#E7F4FB',
    rows: [
      { label: 'Enabled',            value: 'Yes'                       },
      { label: 'Width',              value: 'Auto'                      },
      { label: 'Height',             value: 'Auto'                      },
      { label: 'Background color',   value: 'Transparent'               },
      { label: 'Background opacity', value: '0%'                        },
      { label: 'Font family',        value: 'Auto'                      },
      { label: 'Bold',               value: 'Yes'                       },
      { label: 'Color',              value: DEF_VALUE_COLOR             },
      { label: 'Size',               value: String(SHARED_VALUE_SIZE)      },
      { label: 'Corners',            value: '0'                         },
      { label: 'Padding top',        value: '0'                         },
      { label: 'Padding right',      value: String(CMP_VALUE_GAP)       },
      { label: 'Padding bottom',     value: '0'                         },
      { label: 'Padding left',       value: '0'                         },
    ],
  },
  {
    title: 'Visual', headerBg: '#F4F0FA',
    rows: [
      { label: 'Layout',               value: DEF_LAYOUT              },
      { label: 'Label & value gap',    value: DEF_LABEL_VALUE_GAP     },
      { label: 'Icon color',           value: DEF_ICON_COLOR          },
      { label: 'Icon color opacity',   value: DEF_ICON_OPACITY        },
      { label: 'Icon position',        value: DEF_ICON_POSITION       },
      { label: 'Track color',          value: SPK_TRACK_COLOR         },
      { label: 'Track opacity',        value: '100%'                  },
      { label: 'Progress color',       value: SPK_PROGRESS_COLOR      },
      { label: 'Progress opacity',     value: '100%'                  },
      { label: 'Used palette',         value: 'Monochrome'            },
      { label: 'Thresholds',           value: 'No'                    },
      { label: 'Background color',     value: DEF_WIDGET_BG_COLOR     },
      { label: 'Background opacity',   value: DEF_WIDGET_BG_OPACITY   },
      { label: 'Padding top',          value: String(DEF_WIDGET_PT)   },
      { label: 'Padding right',        value: String(DEF_WIDGET_PR)   },
      { label: 'Padding bottom',       value: String(DEF_WIDGET_PB)   },
      { label: 'Padding left',         value: String(DEF_WIDGET_PL)   },
      { label: 'Corners',              value: String(DEF_WIDGET_CORNERS) },
    ],
  },
  { title: 'Visual data labels', headerBg: '#F4F0FA', rows: visualDataLabelRows(false) },
  { title: 'Comparison', headerBg: '#E7F4FB', rows: comparisonRows(false) },
];

const progressSections: SectionDef[] = [
  { title: 'Label', headerBg: '#FEF7E6', rows: labelRows('4') },
  {
    title: 'Value', headerBg: '#E7F4FB',
    rows: [
      { label: 'Enabled',            value: 'Yes'                  },
      { label: 'Width',              value: 'Auto'                 },
      { label: 'Height',             value: 'Auto'                 },
      { label: 'Background color',   value: 'Transparent'          },
      { label: 'Background opacity', value: '0%'                   },
      { label: 'Font family',        value: 'Auto'                 },
      { label: 'Bold',               value: 'Yes'                  },
      { label: 'Color',              value: PRG_VALUE_COLOR        },
      { label: 'Size',               value: String(PRG_VALUE_SIZE) },
      { label: 'Corners',            value: '0'                    },
      { label: 'Padding top',        value: '0'                    },
      { label: 'Padding right',      value: '0'                    },
      { label: 'Padding bottom',     value: '0'                    },
      { label: 'Padding left',       value: '0'                    },
    ],
  },
  {
    title: 'Visual', headerBg: '#F4F0FA',
    rows: [
      { label: 'Layout',               value: DEF_LAYOUT              },
      { label: 'Label & value gap',    value: DEF_LABEL_VALUE_GAP     },
      { label: 'Icon color',           value: DEF_ICON_COLOR          },
      { label: 'Icon color opacity',   value: DEF_ICON_OPACITY        },
      { label: 'Icon position',        value: DEF_ICON_POSITION       },
      { label: 'Track color',          value: PRG_TRACK_COLOR         },
      { label: 'Track opacity',        value: '100%'                  },
      { label: 'Progress color',       value: PRG_PROGRESS_COLOR      },
      { label: 'Progress opacity',     value: '100%'                  },
      { label: 'Used palette',         value: 'Monochrome'            },
      { label: 'Thresholds',           value: 'No'                    },
      { label: 'Background color',     value: DEF_WIDGET_BG_COLOR     },
      { label: 'Background opacity',   value: DEF_WIDGET_BG_OPACITY   },
      { label: 'Padding top',          value: String(DEF_WIDGET_PT)   },
      { label: 'Padding right',        value: String(DEF_WIDGET_PR)   },
      { label: 'Padding bottom',       value: String(DEF_WIDGET_PB)   },
      { label: 'Padding left',         value: String(DEF_WIDGET_PL)   },
      { label: 'Corners',              value: String(DEF_WIDGET_CORNERS) },
    ],
  },
  { title: 'Visual data labels', headerBg: '#F4F0FA', rows: visualDataLabelRows(false) },
  { title: 'Comparison', headerBg: '#E7F4FB', rows: comparisonRows(false) },
];

const gaugeSections: SectionDef[] = [
  { title: 'Label', headerBg: '#FEF7E6', rows: labelRows('4') },
  {
    title: 'Value', headerBg: '#E7F4FB',
    rows: [
      { label: 'Enabled',            value: 'Yes'                  },
      { label: 'Width',              value: 'Auto'                 },
      { label: 'Height',             value: 'Auto'                 },
      { label: 'Background color',   value: 'Transparent'          },
      { label: 'Background opacity', value: '0%'                   },
      { label: 'Font family',        value: 'Auto'                 },
      { label: 'Bold',               value: 'Yes'                  },
      { label: 'Color',              value: GAU_VALUE_COLOR        },
      { label: 'Size',               value: String(GAU_VALUE_SIZE) },
      { label: 'Corners',            value: '0'                    },
      { label: 'Padding top',        value: '0'                    },
      { label: 'Padding right',      value: '0'                    },
      { label: 'Padding bottom',     value: '0'                    },
      { label: 'Padding left',       value: '0'                    },
    ],
  },
  {
    title: 'Visual', headerBg: '#F4F0FA',
    rows: [
      { label: 'Layout',               value: DEF_LAYOUT              },
      { label: 'Label & value gap',    value: DEF_LABEL_VALUE_GAP     },
      { label: 'Icon color',           value: DEF_ICON_COLOR          },
      { label: 'Icon color opacity',   value: DEF_ICON_OPACITY        },
      { label: 'Icon position',        value: DEF_ICON_POSITION       },
      { label: 'Track color',          value: DEF_TRACK_COLOR         },
      { label: 'Track opacity',        value: '100%'                  },
      { label: 'Progress color',       value: DEF_PROGRESS_COLOR      },
      { label: 'Progress opacity',     value: '100%'                  },
      { label: 'Used palette',         value: 'Monochrome'            },
      { label: 'Thresholds',           value: 'Yes'                   },
      { label: 'Background color',     value: DEF_WIDGET_BG_COLOR     },
      { label: 'Background opacity',   value: DEF_WIDGET_BG_OPACITY   },
      { label: 'Padding top',          value: String(DEF_WIDGET_PT)   },
      { label: 'Padding right',        value: String(DEF_WIDGET_PR)   },
      { label: 'Padding bottom',       value: String(DEF_WIDGET_PB)   },
      { label: 'Padding left',         value: String(DEF_WIDGET_PL)   },
      { label: 'Corners',              value: String(DEF_WIDGET_CORNERS) },
    ],
  },
  {
    title: 'Threshold bands', headerBg: '#E8E8E8',
    rows: [
      { label: '0% – 80% (20s – 44s)',  value: '#B7352D (Red)'    },
      { label: '80% – 90% (44s – 47s)', value: '#E8983E (Orange)' },
      { label: '90% – 100% (47s – 50s)',value: '#2D7D32 (Green)'  },
    ],
  },
  { title: 'Visual data labels', headerBg: '#F4F0FA', rows: visualDataLabelRows(true) },
  { title: 'Comparison', headerBg: '#E7F4FB', rows: comparisonRows(false) },
];

// ─── Config map ───────────────────────────────────────────────────────────────
const VARIANT_CONFIG: Record<MetricVariant, { label: string; sections: SectionDef[] }> = {
  default:    { label: 'Percentage',        sections: defaultSections    },
  comparison: { label: 'With Comparison',   sections: comparisonSections },
  sparkline:  { label: 'With Sparkline',    sections: sparklineSections  },
  progress:   { label: 'Circular Progress', sections: progressSections   },
  gauge:      { label: 'Gauge',             sections: gaugeSections      },
};

// ─── Main Export ─────────────────────────────────────────────────────────────
export const MetricView: React.FC = () => {
  const [activeVariant, setActiveVariant] = useState<MetricVariant>('default');
  const [showIcon,       setShowIcon]      = useState(false);
  const [iconPosition,   setIconPosition]  = useState<IconPosition>('center-left');
  const cfg = VARIANT_CONFIG[activeVariant];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: FONT }}>
      {/* Sub-tabs */}
      <div style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', flexShrink: 0 }}>
        <div style={{ display: 'flex', paddingLeft: '16px' }}>
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveVariant(tab.key)}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: activeVariant === tab.key ? '600' : '500',
                color: activeVariant === tab.key ? '#2563EB' : '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeVariant === tab.key ? '2px solid #2563EB' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: FONT,
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chart + icon toggle */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Icon visibility toggle — lives in the preview area, not the style panel */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 24px',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '13px', color: '#374151', fontFamily: FONT, userSelect: 'none' }}>
              Show icon
            </span>
            <button
              onClick={() => setShowIcon(v => !v)}
              aria-label="Toggle icon visibility"
              style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                backgroundColor: showIcon ? '#0B3A67' : '#D1D5DB',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: 0,
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                left: showIcon ? 18 : 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
            {/* Icon position control — only visible when icon is shown */}
            {showIcon && (
              <>
                <div style={{ width: 1, height: 16, backgroundColor: '#D1D5DB', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#374151', fontFamily: FONT, userSelect: 'none' }}>
                  Icon position
                </span>
                {/* 3×3 grid position picker */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 16px)',
                  gridTemplateRows: 'repeat(3, 16px)',
                  gap: '3px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '4px',
                  backgroundColor: '#FFFFFF',
                }}>
                  {ICON_POSITION_GRID.flat().map((pos, i) => (
                    pos ? (
                      <button
                        key={pos}
                        onClick={() => setIconPosition(pos)}
                        title={pos.replace('-', ' ')}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: iconPosition === pos ? '2px solid #0B3A67' : '2px solid #D1D5DB',
                          backgroundColor: iconPosition === pos ? '#0B3A67' : 'transparent',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.15s',
                        }}
                      />
                    ) : (
                      <div key={`empty-${i}`} style={{ width: 16, height: 16 }} />
                    )
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Preview area */}
          <div className="flex-1 flex items-center justify-center p-8">
            {activeVariant === 'default'    && <DefaultMetric    showIcon={showIcon} iconPosition={iconPosition} />}
            {activeVariant === 'comparison' && <ComparisonMetric showIcon={showIcon} iconPosition={iconPosition} />}
            {activeVariant === 'sparkline'  && <SparklineMetric  showIcon={showIcon} iconPosition={iconPosition} />}
            {activeVariant === 'progress'   && <ProgressMetric   showIcon={showIcon} iconPosition={iconPosition} />}
            {activeVariant === 'gauge'      && (
              <div style={{
                maxWidth: 520,
                textAlign: 'center',
                padding: '40px 32px',
                color: '#6B7280',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 15,
                lineHeight: 1.7,
                border: '1px dashed #D1D5DB',
                borderRadius: 12,
                backgroundColor: '#F9FAFB',
              }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 16, opacity: 0.4 }}>
                  <path d="M8 36C8 22.7 15.2 12 24 12C32.8 12 40 22.7 40 36" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M24 36L32 22" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="24" cy="36" r="2.5" fill="#6B7280"/>
                </svg>
                <p style={{ margin: 0, color: '#374151' }}>
                  Gauge isn't shown due to issues related to AI with design, Please use the same gauge meter design that we use in the system and see how it looks in different ways in dashboard v2 wireframes too
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Style Panel */}
        <StylePanel variant={cfg.label} sections={cfg.sections} />
      </div>
    </div>
  );
};
