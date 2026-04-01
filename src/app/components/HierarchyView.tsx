import React, { useMemo } from 'react';
import {
  ReactFlow,
  Panel,
  ControlButton,
  Background,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
  useReactFlow,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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

// ─── Style constants extracted from style panel ───────────────────────────────

// Basic styles > Node
const NODE_WIDTH       = 160;
const NODE_HEIGHT      = 44;
const NODE_BG_COLOR    = '#FFFFFF';
const NODE_BG_OPACITY  = 1.0;
const NODE_PALETTE     = 'Monochrome';
const NODE_FONT_FAMILY = 'Auto';
const NODE_TEXT_BOLD   = true;
const NODE_TEXT_COLOR  = '#111827';
const NODE_TEXT_SIZE   = 14;
const NODE_BORDER_STYLE = 'None';
const NODE_BORDER_COLOR = '#E2E8F0';
const NODE_BORDER_WIDTH = 1;
const NODE_CORNERS     = 12;

// Advanced styles > Link
const LINK_TYPE   = 'Angled';
const LINK_STYLE  = 'Solid';
const LINK_COLOR  = '#4A88BC';  // palette[3] — mid-tone blue for connectors
const LINK_WIDTH  = 2;
const LINK_START  = 'None';
const LINK_END    = 'Line arrow';

// ─── Layout constants ─────────────────────────────────────────────────────────
const H_GAP = 28; // horizontal gap between sibling subtrees
const V_GAP = 80; // vertical gap between levels

// ─── Raw tree definition ──────────────────────────────────────────────────────
interface RawNode {
  id: string;
  name: string;
  children?: RawNode[];
}

const RAW_TREE: RawNode = {
  id: 'root',
  name: 'Portfolios',
  children: [
    {
      id: 'p1',
      name: 'Portfolio 1',
      children: [
        {
          id: 'p1-sp1',
          name: 'Sub Portfolio 1',
          children: [
            {
              id: 'p1-sp1-pg1',
              name: 'Program 1',
              children: [
                { id: 'p1-sp1-pg1-pr1', name: 'Project 1' },
                { id: 'p1-sp1-pg1-pr2', name: 'Project 2' },
              ],
            },
            { id: 'p1-sp1-pr1', name: 'Project 1' },
          ],
        },
        {
          id: 'p1-sp2',
          name: 'Sub Portfolio 2',
          children: [
            { id: 'p1-sp2-pg1', name: 'Program 1' },
            { id: 'p1-sp2-pr1', name: 'Project 1' },
          ],
        },
      ],
    },
    {
      id: 'p2',
      name: 'Portfolio 2',
      children: [
        {
          id: 'p2-sp1',
          name: 'Sub Portfolio 1',
          children: [
            { id: 'p2-sp1-pg1', name: 'Program 1' },
            { id: 'p2-sp1-pr1', name: 'Project 1' },
          ],
        },
        {
          id: 'p2-sp2',
          name: 'Sub Portfolio 2',
          children: [
            { id: 'p2-sp2-pg2', name: 'Programs 2' },
            { id: 'p2-sp2-pr2', name: 'Project 2' },
          ],
        },
      ],
    },
  ],
};

// ─── Layout algorithm ─────────────────────────────────────────────────────────
interface PositionedNode extends RawNode {
  cx: number;      // center x
  y: number;       // top y
  children?: PositionedNode[];
}

function buildLayout(raw: RawNode): PositionedNode {
  // Deep clone
  const root = JSON.parse(JSON.stringify(raw)) as PositionedNode;

  // Pass 1: assign cx to leaves sequentially, internal nodes centred over children
  let leafIndex = 0;
  function assignCX(node: PositionedNode): void {
    if (!node.children || node.children.length === 0) {
      node.cx = leafIndex * (NODE_WIDTH + H_GAP) + NODE_WIDTH / 2;
      leafIndex++;
      return;
    }
    for (const child of node.children) assignCX(child);
    const first = node.children[0];
    const last  = node.children[node.children.length - 1];
    node.cx = (first.cx + last.cx) / 2;
  }

  // Pass 2: assign y by depth
  function assignY(node: PositionedNode, depth: number): void {
    node.y = depth * (NODE_HEIGHT + V_GAP);
    if (node.children) {
      for (const child of node.children) assignY(child, depth + 1);
    }
  }

  assignCX(root);
  assignY(root, 0);
  return root;
}

// Flatten positioned tree into React Flow nodes + edges
function flattenTree(root: PositionedNode): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function walk(node: PositionedNode): void {
    nodes.push({
      id: node.id,
      type: 'hierarchyNode',
      position: { x: node.cx - NODE_WIDTH / 2, y: node.y },
      data: { label: node.name },
      draggable: false,
    });

    if (node.children) {
      for (const child of node.children) {
        edges.push({
          id: `${node.id}→${child.id}`,
          source: node.id,
          target: child.id,
          type: 'step',
          style: {
            stroke: LINK_COLOR,
            strokeWidth: LINK_WIDTH,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: LINK_COLOR,
            width: 14,
            height: 14,
          },
        });
        walk(child);
      }
    }
  }

  walk(root);
  return { nodes, edges };
}

// ─── Custom node component ─────────────────────────────────────────────────────
function HierarchyNode({ data }: { data: { label: string } }) {
  const { show, move, hide, TipEl } = useTip();
  return (
    <>
      {TipEl}
      <div
        onMouseEnter={e => show(e, data.label, [{ k: 'Node', v: data.label }])}
        onMouseMove={move}
        onMouseLeave={hide}
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        background: NODE_BG_COLOR,
        opacity: NODE_BG_OPACITY,
        border: `1px solid ${LINK_COLOR}`,
        borderRadius: NODE_CORNERS,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: NODE_TEXT_BOLD ? 700 : 400,
        fontSize: NODE_TEXT_SIZE,
        color: NODE_TEXT_COLOR,
        padding: '0 10px',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        userSelect: 'none',
      }}
    >
      {/* Invisible handles for edges */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, width: 1, height: 1, minWidth: 1, minHeight: 1, border: 'none', background: 'transparent' }}
      />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {data.label}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, width: 1, height: 1, minWidth: 1, minHeight: 1, border: 'none', background: 'transparent' }}
      />
    </div>
    </>
  );
}

const NODE_TYPES: NodeTypes = { hierarchyNode: HierarchyNode };

// ─── Hierarchy chart ──────────────────────────────────────────────────────────
function HierarchyChart() {
  const { nodes, edges } = useMemo(() => {
    const positioned = buildLayout(RAW_TREE);
    return flattenTree(positioned);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.3}
      maxZoom={1.5}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll
      zoomOnPinch
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#E5E7EB"
      />
      <FlowControls />
    </ReactFlow>
  );
}

// ─── Shared React Flow SVG icons (exact paths from @xyflow/react) ─────────────
const IconZoomIn = () => (
  <svg viewBox="0 0 32 32" style={{ width: 12, height: 12, fill: 'currentColor' }}>
    <path d="M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" />
  </svg>
);
const IconZoomOut = () => (
  <svg viewBox="0 0 32 5" style={{ width: 12, height: 12, fill: 'currentColor' }}>
    <path d="M0 0h32v4.2H0z" />
  </svg>
);
const IconFitView = () => (
  <svg viewBox="0 0 32 30" style={{ width: 12, height: 12, fill: 'currentColor' }}>
    <path d="M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" />
  </svg>
);

// ─── Custom horizontal controls with dividers ─────────────────────────────────
function FlowControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const btnStyle: React.CSSProperties = {
    height:          26,
    width:           26,
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    background:      '#fefefe',
    border:          'none',
    borderLeft:      '1px solid #eee',
    cursor:          'pointer',
    color:           'inherit',
    padding:         0,
    boxSizing:       'border-box',
  };

  const Divider = () => (
    <div style={{ width: 1, height: 16, background: '#eee', flexShrink: 0 }} />
  );

  return (
    <Panel
      position="bottom-right"
      style={{
        display:      'flex',
        flexDirection:'row',
        alignItems:   'center',
        background:   '#fefefe',
        border:       '1px solid #eee',
        borderRadius: 8,
        boxShadow:    '0 0 2px 1px rgba(0,0,0,0.08)',
        overflow:     'hidden',
        padding:      0,
        margin:       12,
      }}
    >
      <button style={{ ...btnStyle, borderLeft: 'none' }} onClick={() => zoomIn()} title="Zoom in">
        <IconZoomIn />
      </button>
      <Divider />
      <button style={btnStyle} onClick={() => zoomOut()} title="Zoom out">
        <IconZoomOut />
      </button>
      <Divider />
      <button style={btnStyle} onClick={() => fitView({ padding: 0.15 })} title="Fit screen">
        <IconFitView />
      </button>
    </Panel>
  );
}

// ─── Style Panel ──────────────────────────────────────────────────────────────
function StyleTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-sm border-collapse" style={{ fontFamily: FONT }}>
      <thead>
        <tr style={{ background: '#B8D4E8' }}>
          <th className="text-left p-2 border border-gray-300">Style</th>
          <th className="text-left p-2 border border-gray-300">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([style, value], i) => (
          <tr key={`${style}-${i}`} style={{ background: '#fff' }}>
            <td className="p-2 border border-gray-300">{style}</td>
            <td className="p-2 border border-gray-300">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StylePanel() {
  return (
    <div
      className="w-[320px] shrink-0 border-l border-gray-200 overflow-y-auto p-5 bg-gray-50"
      style={{ fontFamily: FONT }}
    >
      <h2 className="text-base font-bold mb-5">Style Configuration</h2>

      {/* Basic styles */}
      <div className="mb-7">
        <h3
          className="text-sm font-semibold mb-3 px-3 py-2 rounded"
          style={{ background: '#FEF3C7' }}
        >
          Basic styles
        </h3>
        <h4 className="text-sm font-semibold mb-2 mt-4">Node</h4>
        <StyleTable
          rows={[
            ['Width',              String(NODE_WIDTH)],
            ['Height',             String(NODE_HEIGHT)],
            ['Background color',   NODE_BG_COLOR],
            ['Background opacity', `${NODE_BG_OPACITY * 100}%`],
            ['Used palette',       NODE_PALETTE],
            ['Font family',        NODE_FONT_FAMILY],
            ['Bold',               NODE_TEXT_BOLD ? 'Yes' : 'No'],
            ['Color',              NODE_TEXT_COLOR],
            ['Size',               String(NODE_TEXT_SIZE)],
            ['Corners',            String(NODE_CORNERS)],
            ['Border style',       NODE_BORDER_STYLE],
            ['Border color',       NODE_BORDER_COLOR],
            ['Border width',       String(NODE_BORDER_WIDTH)],
            ['Customize each level', 'No'],
          ]}
        />
      </div>

      {/* Advanced styles */}
      <div className="mb-7">
        <h3
          className="text-sm font-semibold mb-3 px-3 py-2 rounded"
          style={{ background: '#EDE9FE' }}
        >
          Advanced styles
        </h3>
        <h4 className="text-sm font-semibold mb-2 mt-4">Link</h4>
        <StyleTable
          rows={[
            ['Line type',  LINK_TYPE],
            ['Line style', LINK_STYLE],
            ['Line color', LINK_COLOR],
            ['Line width', String(LINK_WIDTH)],
            ['Line start', LINK_START],
            ['Line end',   LINK_END],
          ]}
        />
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function HierarchyView() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left — React Flow chart */}
      <div className="flex-1 min-w-0" style={{ height: '100%' }}>
        <HierarchyChart />
      </div>

      {/* Right — style panel */}
      <StylePanel />
    </div>
  );
}