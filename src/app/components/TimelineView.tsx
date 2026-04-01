import React, { useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────
const phases = [
  { number: 1, name: 'Phase name', date: '4 Jan 2026' },
  { number: 2, name: 'Phase name', date: '11 Jan 2026' },
  { number: 3, name: 'Phase name', date: '18 Jan 2026' },
  { number: 4, name: 'Phase name', date: '25 Jan 2026' },
];

// Active phase index per variant (matching structure reference)
const ACTIVE_INDEX_HORIZONTAL = 2; // Phase 3
const ACTIVE_INDEX_VERTICAL = 1;   // Phase 2
const PHASE_COUNT = phases.length;

// ─── Style constants (from style reference image) ────────────────────────────
const PHASE_SIZE = 40;
const PHASE_BG = '#FFFFFF';
const PHASE_BORDER_COLOR = '#E5E7EB';
const PHASE_BORDER_WIDTH = 2;
const PHASE_NUMBER_COLOR = '#334155';
const PHASE_NUMBER_SIZE = 14;
const PHASE_DATE_COLOR = '#64748B';
const PHASE_DATE_SIZE = 14;
const PHASE_NAME_COLOR = '#111827';
const PHASE_NAME_SIZE = 14;
const TIMELINE_LINE_COLOR = '#E5E7EB';
const TIMELINE_LINE_WIDTH = 2;
const TODAY_LINE_COLOR = '#0B3A67';
const TODAY_LINE_WIDTH = 2;
const TODAY_TEXT_COLOR = '#0B3A67';
const TODAY_TEXT_SIZE = 14;
const PHASE_COLOR   = '#0B3A67';
const PHASE_PALETTE = 'Monochrome';

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

// ─── Layout tokens ───────────────────────────────────────────────────────────
const HALF = PHASE_SIZE / 2;                     // 20
const NAME_LINE_HEIGHT = 20;
const NAME_MARGIN_BOTTOM = 10;
const DATE_MARGIN_TOP = 10;
const LABEL_TOP_BLOCK = NAME_LINE_HEIGHT + NAME_MARGIN_BOTTOM; // 30 — height from milestone top to circle top
const SPINE_TOP = LABEL_TOP_BLOCK + HALF;        // 50 — Y of circle center from milestone top

// Horizontal: with flex-1 cells, each cell is (100/N)% wide.
// Circle center sits at (100 / 2N)% from left edge; spine inset = same from each side.
const SPINE_INSET_PCT = `${100 / (2 * PHASE_COUNT)}%`; // 12.5% for 4 items

// Vertical layout tokens
const V_LABEL_WIDTH = 110;
const V_LABEL_GAP = 14;
const V_MILESTONE_GAP = 56;  // vertical space between milestone rows (generous for clear today line placement)
const V_SPINE_LEFT = V_LABEL_WIDTH + V_LABEL_GAP + HALF; // X of circle center

type TimelineSubTab = 'horizontal' | 'vertical';

// ─── Main View ───────────────────────────────────────────────────────────────
export function TimelineView() {
  const [activeSubTab, setActiveSubTab] = useState<TimelineSubTab>('horizontal');

  return (
    <div className="h-full flex flex-col">
      {/* Sub Tabs */}
      <div className="border-b border-gray-300 bg-gray-50">
        <div className="flex gap-1 px-4">
          {([
            ['horizontal', 'Horizontal'],
            ['vertical', 'Vertical'],
          ] as [TimelineSubTab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSubTab(key)}
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

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left side — Timeline visualization */}
        <div className="w-2/3 p-8 flex items-center justify-center">
          {activeSubTab === 'horizontal' ? <HorizontalTimeline /> : <VerticalTimeline />}
        </div>

        {/* Right side — Style Configuration */}
        <StyleConfiguration variant={activeSubTab} />
      </div>
    </div>
  );
}

// ── Milestone Circle ────────────────────────────────────────────────────────
function MilestoneCircle({ number, isActive }: { number: number; isActive: boolean }) {
  return (
    <div
      style={{
        width: PHASE_SIZE,
        height: PHASE_SIZE,
        borderRadius: '50%',
        backgroundColor: isActive ? TODAY_LINE_COLOR : PHASE_BG,
        border: `${PHASE_BORDER_WIDTH}px solid ${isActive ? TODAY_LINE_COLOR : PHASE_BORDER_COLOR}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: PHASE_NUMBER_SIZE,
        color: isActive ? '#FFFFFF' : PHASE_NUMBER_COLOR,
        position: 'relative',
        zIndex: 2,
        flexShrink: 0,
      }}
    >
      {number}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HORIZONTAL TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════
// Structure:
//   ┌──────────────────────────────────────────────────────────────┐
//   │  [name]        [name]        [name]        [name]           │  ← label above
//   │    ●──────────────●──────────────●──────────────●           │  ← spine through circles
//   │  [date]        [date]        [date]        [date]           │  ← label below
//   │                                 ┆                           │
//   │                               Today                        │  ← today indicator (active only)
//   └──────────────────────────────────────────────────────────────┘
//
// Each milestone cell is flex-1 so circles are evenly distributed.
// The connector spine is an absolute line from center of first circle to center of last.

function HorizontalTimeline() {
  const { show, move, hide, TipEl } = useTip();
  // Today dashed line: positioned vertically centered between the active phase and the next phase.
  // With flex-1 cells, each cell = 100/N % wide. Cell centers are at (2i+1)/(2N) * 100%.
  // Active = index 2, next = index 3. Midpoint X = average of their centers.
  const activeCenterPct = (2 * ACTIVE_INDEX_HORIZONTAL + 1) / (2 * PHASE_COUNT) * 100;
  const nextCenterPct = (2 * (ACTIVE_INDEX_HORIZONTAL + 1) + 1) / (2 * PHASE_COUNT) * 100;
  const todayLinePct = `${(activeCenterPct + nextCenterPct) / 2}%`; // midpoint between active & next

  // The dashed line spans from slightly above the name area down through the date area
  const TODAY_LINE_TOP = 4; // just above name labels
  const TODAY_LINE_BOTTOM_Y = LABEL_TOP_BLOCK + PHASE_SIZE + DATE_MARGIN_TOP + NAME_LINE_HEIGHT; // bottom of date label
  const TODAY_LINE_HEIGHT = TODAY_LINE_BOTTOM_Y - TODAY_LINE_TOP;

  return (
    <div className="w-full" style={{ maxWidth: 700, position: 'relative' }}>
      {TipEl}
      {/* ── Connector Spine ── */}
      <div
        style={{
          position: 'absolute',
          left: SPINE_INSET_PCT,
          right: SPINE_INSET_PCT,
          top: SPINE_TOP,
          height: 0,
          borderTop: `${TIMELINE_LINE_WIDTH}px solid ${TIMELINE_LINE_COLOR}`,
          zIndex: 1,
        }}
      />

      {/* ── Today Indicator ──
          Vertical dashed line centered between active phase and next phase,
          spanning the full height of the timeline area, with "Today" text below. */}
      <div
        style={{
          position: 'absolute',
          left: todayLinePct,
          top: TODAY_LINE_TOP,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: 0,
            height: TODAY_LINE_HEIGHT,
            borderLeft: `${TODAY_LINE_WIDTH}px dashed ${TODAY_LINE_COLOR}`,
          }}
        />
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: TODAY_TEXT_SIZE,
            color: TODAY_TEXT_COLOR,
            marginTop: 4,
          }}
        >
          Today
        </span>
      </div>

      {/* ── Milestone Row ── */}
      <div style={{ display: 'flex', position: 'relative', zIndex: 2 }}>
        {phases.map((phase, i) => {
          const isActive = i === ACTIVE_INDEX_HORIZONTAL;

          return (
            <div
              key={phase.number}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'default' }}
              onMouseEnter={e => show(e, phase.name, [{ k: 'Phase', v: String(phase.number) }, { k: 'Date', v: phase.date }])}
              onMouseMove={move}
              onMouseLeave={hide}
            >
              {/* Phase name (above circle) */}
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: PHASE_NAME_SIZE,
                  color: PHASE_NAME_COLOR,
                  whiteSpace: 'nowrap',
                  lineHeight: `${NAME_LINE_HEIGHT}px`,
                  marginBottom: NAME_MARGIN_BOTTOM,
                  textAlign: 'center',
                }}
              >
                {phase.name}
              </span>

              {/* Milestone Circle — sits on the spine */}
              <MilestoneCircle number={phase.number} isActive={isActive} />

              {/* Phase date (below circle) */}
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: PHASE_DATE_SIZE,
                  color: PHASE_DATE_COLOR,
                  whiteSpace: 'nowrap',
                  lineHeight: `${NAME_LINE_HEIGHT}px`,
                  marginTop: DATE_MARGIN_TOP,
                  textAlign: 'center',
                }}
              >
                {phase.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERTICAL TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════
// Structure:
//   ┌───────────────────────────────────────┐
//   │   Phase name   ●                      │
//   │   4 Jan 2026   │                      │
//   │                 │                      │
//   │   Phase name   ●── ┄┄ Today           │  ← today indicator (active)
//   │   11 Jan 2026  │                      │
//   │                 │                      │
//   │   Phase name   ●                      │
//   │   18 Jan 2026  │                      │
//   │                 │                      │
//   │   Phase name   ●                      │
//   │   25 Jan 2026                         │
//   └───────────────────────────────────────┘
//
// Label block is right-aligned to the left of the spine.
// The connector spine is a vertical line from center of first circle to center of last.

function VerticalTimeline() {
  const { show, move, hide, TipEl } = useTip();
  // Each milestone row height is driven by the taller of the label block or the circle.
  // Label block = name (20px lineHeight) + 2px marginTop on date + date (20px lineHeight) = 42px.
  // Circle = PHASE_SIZE = 40px.  Row height = 42.
  const LABEL_BLOCK_HEIGHT = NAME_LINE_HEIGHT + 2 + NAME_LINE_HEIGHT; // 42
  const ROW_HEIGHT = Math.max(LABEL_BLOCK_HEIGHT, PHASE_SIZE);
  const ROW_STRIDE = ROW_HEIGHT + V_MILESTONE_GAP; // distance between tops of consecutive rows

  // Today dashed line: vertically centered between the circle center of the previous
  // milestone and the circle center of the active milestone.
  // Circle center Y of phase i = i * ROW_STRIDE + ROW_HEIGHT / 2
  const prevCenterY = (ACTIVE_INDEX_VERTICAL - 1) * ROW_STRIDE + ROW_HEIGHT / 2;
  const activeCenterY = ACTIVE_INDEX_VERTICAL * ROW_STRIDE + ROW_HEIGHT / 2;
  const todayY = (prevCenterY + activeCenterY) / 2;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column' }}>
      {TipEl}
      {/* ── Connector Spine ──
          Runs from center of first circle to center of last circle */}
      <div
        style={{
          position: 'absolute',
          left: V_SPINE_LEFT - TIMELINE_LINE_WIDTH / 2,
          top: ROW_HEIGHT / 2,
          bottom: ROW_HEIGHT / 2,
          width: 0,
          borderLeft: `${TIMELINE_LINE_WIDTH}px solid ${TIMELINE_LINE_COLOR}`,
          zIndex: 1,
        }}
      />

      {/* ── Today Indicator ──
          Horizontal dashed line at the exact vertical midpoint between the previous
          milestone circle center and the active milestone circle center. */}
      <div
        style={{
          position: 'absolute',
          left: V_SPINE_LEFT,
          top: todayY,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: 36,
            height: 0,
            marginLeft: -18,
            borderTop: `${TODAY_LINE_WIDTH}px dashed ${TODAY_LINE_COLOR}`,
          }}
        />
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: TODAY_TEXT_SIZE,
            color: TODAY_TEXT_COLOR,
            marginLeft: 6,
            whiteSpace: 'nowrap',
          }}
        >
          Today
        </span>
      </div>

      {/* ── Milestone Stack ── */}
      {phases.map((phase, i) => {
        const isActive = i === ACTIVE_INDEX_VERTICAL;
        const isLast = i === phases.length - 1;

        return (
          <div
            key={phase.number}
            onMouseEnter={e => show(e, phase.name, [{ k: 'Phase', v: String(phase.number) }, { k: 'Date', v: phase.date }])}
            onMouseMove={move}
            onMouseLeave={hide}
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              cursor: 'default',
              marginBottom: isLast ? 0 : V_MILESTONE_GAP,
            }}
          >
            {/* Label Block — right-aligned, left of spine */}
            <div
              style={{
                width: V_LABEL_WIDTH,
                marginRight: V_LABEL_GAP,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: PHASE_NAME_SIZE,
                  color: PHASE_NAME_COLOR,
                  lineHeight: `${NAME_LINE_HEIGHT}px`,
                }}
              >
                {phase.name}
              </span>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: PHASE_DATE_SIZE,
                  color: PHASE_DATE_COLOR,
                  marginTop: 2,
                  lineHeight: `${NAME_LINE_HEIGHT}px`,
                }}
              >
                {phase.date}
              </span>
            </div>

            {/* Milestone Circle — centered on spine */}
            <MilestoneCircle number={phase.number} isActive={isActive} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Style Configuration Panel ───────────────────────────────────────────────
function StyleConfiguration({ variant }: { variant: TimelineSubTab }) {
  const variantLabel = variant === 'horizontal' ? 'Horizontal' : 'Vertical';
  const isHorizontal = variant === 'horizontal';

  // In horizontal: name is above circle, date is below circle
  // In vertical: name is above date (both in a label block to the left of circle)
  const phaseDatesPosition = isHorizontal ? 'Below phase' : 'Below name';
  const phaseNamesPosition = isHorizontal ? 'Above phase' : 'Above date';

  return (
    <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: FONT }}>Style Configuration</h2>
      <p className="text-xs text-gray-500 mb-6" style={{ fontFamily: FONT }}>Variant: {variantLabel}</p>

      {/* Basic styles — Phases */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded" style={{ fontFamily: FONT }}>Basic styles</h3>
        <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>Phases</h4>
        <StyleTable rows={[
          ['Show phase number', 'Yes'],
          ['Phase size', '40'],
          ['Background color', '#FFFFFF'],
          ['Background opacity', '100%'],
          ['Active background color', '#0B3A67'],
          ['Active number color', '#FFFFFF'],
          ['Phase color', PHASE_COLOR],
          ['Used palette', PHASE_PALETTE],
          ['Border directions', 'All'],
          ['Border style', 'Solid'],
          ['Border color', '#E5E7EB'],
          ['Border width', '2'],
          ['Phase number font family', 'Auto'],
          ['Phase number bold', 'Yes'],
          ['Phase number color', '#334155'],
          ['Phase number size', '14'],
          ['Show phase dates', 'Yes'],
          ['Phase dates font family', 'Auto'],
          ['Phase dates bold', 'No'],
          ['Phase dates color', '#64748B'],
          ['Phase dates size', '14'],
          ['Phase dates position', phaseDatesPosition],
          ['Show phase names', 'Yes'],
          ['Phase names font family', 'Auto'],
          ['Phase names bold', 'Yes'],
          ['Phase names color', '#111827'],
          ['Phase names size', '14'],
          ['Phase names position', phaseNamesPosition],
          ['Customize each phase', 'No'],
        ]} />
      </div>

      {/* Advanced styles — Lines */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 bg-[#E8E1F5] px-3 py-2 rounded" style={{ fontFamily: FONT }}>Advanced styles</h3>
        <h4 className="font-semibold mb-2" style={{ fontFamily: FONT }}>Lines</h4>
        <StyleTable rows={[
          ['Timeline line style', 'Solid'],
          ['Timeline line color', '#E5E7EB'],
          ['Timeline line width', '2'],
          ['Today line style', 'Dashed'],
          ['Today line color', '#0B3A67'],
          ['Today line width', '2'],
          ['Today text font family', 'Auto'],
          ['Today text bold', 'Yes'],
          ['Today text color', '#0B3A67'],
          ['Today text size', '14'],
        ]} />
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