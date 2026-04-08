import React, { useState } from 'react';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants (from style reference image) ────────────────────────────

// Stages — shared defaults
const STAGE_BG_COLOR      = '#E9EBEF';
const STAGE_BG_OPACITY    = '100%';
const STAGE_TITLE_FONT    = 'Auto';
const STAGE_TITLE_BOLD    = true;
const STAGE_TITLE_COLOR   = '#0B3A67';
const STAGE_TITLE_SIZE    = 14;
const STAGE_VALUE_FONT    = 'Auto';
const STAGE_VALUE_BOLD    = true;
const STAGE_VALUE_COLOR   = '#0B3A67';
const STAGE_VALUE_SIZE    = 14;
const CUSTOMIZE_EACH      = false;

// Per-stage overrides (when Customize each stage = Yes)
const STAGE_NAMES   = ['Stage name', 'Stage name', 'Stage name', 'Stage name', 'Stage name', 'Stage name'];
const STAGE_VALUES  = ['20', '12', '4', '8', '16', '15'];

// Per-stage style overrides
const PER_STAGE_DEFAULTS = STAGE_NAMES.map(() => ({
  bgColor:     STAGE_BG_COLOR,
  bgOpacity:   '100%',
  titleFont:   'Auto',
  titleBold:   true,
  titleColor:  STAGE_TITLE_COLOR,
  titleSize:   14,
  valueFont:   'Auto',
  valueBold:   true,
  valueColor:  STAGE_VALUE_COLOR,
  valueSize:   14,
}));

// ─── Tooltip ──────────────────────────────────────────────────────────────────

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

interface TipState { visible: boolean; x: number; y: number; title: string; rows: { k: string; v: string }[]; }
const HIDDEN_TIP: TipState = { visible: false, x: 0, y: 0, title: '', rows: [] };

function useTip() {
  const [tip, setTip] = React.useState<TipState>(HIDDEN_TIP);
  const show = (e: React.MouseEvent, title: string, rows: { k: string; v: string }[]) =>
    setTip({ visible: true, x: e.clientX + 14, y: e.clientY + 14, title, rows });
  const move = (e: React.MouseEvent) =>
    setTip(t => t.visible ? { ...t, x: e.clientX + 14, y: e.clientY + 14 } : t);
  const hide = () => setTip(t => ({ ...t, visible: false }));
  const TipEl = tip.visible ? (
    <div style={{ ...TOOLTIP_STYLE, left: tip.x, top: tip.y }}>
      {tip.title && <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{tip.title}</div>}
      {tip.rows.map(({ k, v }, i) => <div key={i}>{k}: <strong>{v}</strong></div>)}
    </div>
  ) : null;
  return { show, move, hide, TipEl };
}

// ─── Main View ───────────────────────────────────────────────────────────────

export function StageBarView() {
  return (
    <div className="h-full flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left side — Stage Bar visualization */}
        <div className="w-2/3 p-8 flex items-center justify-center">
          <StageBarChart />
        </div>

        {/* Right side — Style Configuration */}
        <StyleConfiguration />
      </div>
    </div>
  );
}

// ─── Stage Bar Chart ─────────────────────────────────────────────────────────

function StageBarChart() {
  const { show, move, hide, TipEl } = useTip();
  const SEGMENT_HEIGHT = 58;

  return (
    <div style={{ width: '100%', maxWidth: 980 }}>
      {TipEl}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          aria-label="Previous stage"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
            cursor: 'default',
          }}
        >
          ‹
        </button>

        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0, gap: 3 }}>
          {STAGE_NAMES.map((name, i) => {
            const stg = PER_STAGE_DEFAULTS[i];
            const isFirst = i === 0;
            const isLast = i === STAGE_NAMES.length - 1;
            const segmentPath = isFirst
              ? 'M 10 0 H 184 L 200 29 L 184 58 H 10 Q 0 58 0 48 V 10 Q 0 0 10 0 Z'
              : isLast
                ? 'M 16 0 H 190 Q 200 0 200 10 V 48 Q 200 58 190 58 H 16 L 0 29 Z'
                : 'M 16 0 H 184 L 200 29 L 184 58 H 16 L 0 29 Z';

            return (
              <div
                key={i}
                onMouseEnter={e => show(e, name, [{ k: 'Value', v: STAGE_VALUES[i] }])}
                onMouseMove={move}
                onMouseLeave={hide}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: SEGMENT_HEIGHT,
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <svg
                  viewBox="0 0 200 58"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <path d={segmentPath} fill={stg.bgColor} />
                </svg>
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    paddingLeft: isFirst ? 16 : 20,
                    paddingRight: isLast ? 16 : 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontWeight: stg.titleBold ? 700 : 400,
                      fontSize: stg.titleSize,
                      color: stg.titleColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontWeight: stg.valueBold ? 700 : 400,
                      fontSize: stg.valueSize,
                      color: stg.valueColor,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {STAGE_VALUES[i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next stage"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
            cursor: 'default',
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Collapsible Section ─────────────────────────────────────────────────────

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 8, backgroundColor: '#FFFFFF' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 12px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 14,
          color: '#111827',
        }}
      >
        <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        {title}
      </button>
      {open && <div style={{ padding: '0 12px 12px' }}>{children}</div>}
    </div>
  );
}

// ─── Style Configuration Panel ───────────────────────────────────────────────

function StyleConfiguration() {
  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: FONT }}>Style Configuration</h2>
      <p className="text-xs text-gray-500 mb-6" style={{ fontFamily: FONT }}>Widget: Stage Bar</p>

      {/* Stages section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded" style={{ fontFamily: FONT }}>Stages</h3>

        <StyleTable rows={[
          ['Stage background color', STAGE_BG_COLOR],
          ['Stage background opacity', STAGE_BG_OPACITY],
        ]} />

        {/* Stage title */}
        <h4 className="font-semibold mt-4 mb-2" style={{ fontFamily: FONT }}>Stage title</h4>
        <StyleTable rows={[
          ['Font family', STAGE_TITLE_FONT],
          ['Bold', STAGE_TITLE_BOLD ? 'Yes' : 'No'],
          ['Color', STAGE_TITLE_COLOR],
          ['Size', String(STAGE_TITLE_SIZE)],
        ]} />

        {/* Stage value */}
        <h4 className="font-semibold mt-4 mb-2" style={{ fontFamily: FONT }}>Stage value</h4>
        <StyleTable rows={[
          ['Font family', STAGE_VALUE_FONT],
          ['Bold', STAGE_VALUE_BOLD ? 'Yes' : 'No'],
          ['Color', STAGE_VALUE_COLOR],
          ['Size', String(STAGE_VALUE_SIZE)],
        ]} />

        {/* Customize each stage */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 12 }}>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: '#111827' }}>Customize each stage</span>
          <div
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              backgroundColor: CUSTOMIZE_EACH ? '#0B3A67' : '#D1D5DB',
              position: 'relative',
              cursor: 'default',
              transition: 'background-color 0.2s',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                top: 2,
                left: CUSTOMIZE_EACH ? 22 : 2,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>

        {/* Per-stage overrides */}
        {CUSTOMIZE_EACH && STAGE_NAMES.map((name, i) => (
          <CollapsibleSection key={i} title={name} defaultOpen={i === 0}>
            <StyleTable rows={[
              ['Stage background color', PER_STAGE_DEFAULTS[i].bgColor],
              ['Stage background opacity', PER_STAGE_DEFAULTS[i].bgOpacity],
            ]} />

            <h5 className="font-semibold mt-3 mb-1" style={{ fontFamily: FONT, fontSize: 13 }}>Stage title</h5>
            <StyleTable rows={[
              ['Font family', PER_STAGE_DEFAULTS[i].titleFont],
              ['Bold', PER_STAGE_DEFAULTS[i].titleBold ? 'Yes' : 'No'],
              ['Color', PER_STAGE_DEFAULTS[i].titleColor],
              ['Size', String(PER_STAGE_DEFAULTS[i].titleSize)],
            ]} />

            <h5 className="font-semibold mt-3 mb-1" style={{ fontFamily: FONT, fontSize: 13 }}>Stage value</h5>
            <StyleTable rows={[
              ['Font family', PER_STAGE_DEFAULTS[i].valueFont],
              ['Bold', PER_STAGE_DEFAULTS[i].valueBold ? 'Yes' : 'No'],
              ['Color', PER_STAGE_DEFAULTS[i].valueColor],
              ['Size', String(PER_STAGE_DEFAULTS[i].valueSize)],
            ]} />
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
}

// ─── Reusable Style Table ────────────────────────────────────────────────────

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
