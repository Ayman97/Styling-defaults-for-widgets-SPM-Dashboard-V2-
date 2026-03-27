import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as echarts from 'echarts';
import * as topojson from 'topojson-client';
// @ts-ignore – world-atlas ships plain JSON without type declarations
import worldTopo from 'world-atlas/countries-110m.json';

const FONT = 'Plus Jakarta Sans, sans-serif';

// ─── Style constants ────────────────────────────────────────────────────────
const AREA_OPACITY    = 100;
const FILLED_PALETTE  = 'Monochrome';

const BUBBLE_MAX_SIZE = 50;
const BUBBLE_OPACITY  = 100;
const BUBBLE_PALETTE  = 'Monochrome';

const ALLOW_PAN_ZOOM  = true;
const SHOW_ZOOM_CTRL  = true;
const SHOW_FULLSCREEN = true;

const LABEL_ON      = true;
const LABEL_POS     = 'Below';
const LABEL_BG      = '#FFFFFF';
const LABEL_BG_OPC  = 90;
const LABEL_FONT    = 'Auto';
const LABEL_BOLD    = false;
const LABEL_COLOR   = '#374151';
const LABEL_SIZE    = 14;

// Monochromatic palette — low → high
const FILL_COLORS = [
  '#F5FAFE', '#EAF4FB', '#D6E8F5', '#B2D2EA', '#8FBBDC',
  '#6CA3CF', '#4A88BC', '#2B6CA3', '#154E84', '#0B3A67',
];

const AREA_COLOR   = '#0B3A67';
const BUBBLE_COLOR = '#0B3A67';

// ─── ISO 3166-1 numeric → country name ───────────────────────────────────────
const ISO_NAME: Record<string, string> = {
  '4':   'Afghanistan',      '8':   'Albania',          '12':  'Algeria',
  '24':  'Angola',           '32':  'Argentina',        '36':  'Australia',
  '40':  'Austria',          '50':  'Bangladesh',       '56':  'Belgium',
  '64':  'Bhutan',           '68':  'Bolivia',          '76':  'Brazil',
  '100': 'Bulgaria',         '104': 'Myanmar',          '116': 'Cambodia',
  '120': 'Cameroon',         '124': 'Canada',           '140': 'Central African Rep.',
  '144': 'Sri Lanka',        '152': 'Chile',            '156': 'China',
  '170': 'Colombia',         '174': 'Comoros',          '178': 'Congo',
  '180': 'Dem. Rep. Congo',  '188': 'Costa Rica',       '191': 'Croatia',
  '192': 'Cuba',             '203': 'Czech Rep.',       '208': 'Denmark',
  '218': 'Ecuador',          '818': 'Egypt',            '222': 'El Salvador',
  '232': 'Eritrea',          '231': 'Ethiopia',         '238': 'Falkland Is.',
  '246': 'Finland',          '250': 'France',           '266': 'Gabon',
  '276': 'Germany',          '288': 'Ghana',            '300': 'Greece',
  '320': 'Guatemala',        '324': 'Guinea',           '332': 'Haiti',
  '340': 'Honduras',         '348': 'Hungary',          '356': 'India',
  '360': 'Indonesia',        '364': 'Iran',             '368': 'Iraq',
  '372': 'Ireland',          '376': 'Israel',           '380': 'Italy',
  '388': 'Jamaica',          '392': 'Japan',            '400': 'Jordan',
  '398': 'Kazakhstan',       '404': 'Kenya',            '408': 'North Korea',
  '410': 'South Korea',      '414': 'Kuwait',           '418': 'Laos',
  '422': 'Lebanon',          '426': 'Lesotho',          '430': 'Liberia',
  '434': 'Libya',            '450': 'Madagascar',       '454': 'Malawi',
  '458': 'Malaysia',         '466': 'Mali',             '478': 'Mauritania',
  '484': 'Mexico',           '496': 'Mongolia',         '504': 'Morocco',
  '508': 'Mozambique',       '516': 'Namibia',          '524': 'Nepal',
  '528': 'Netherlands',      '554': 'New Zealand',      '558': 'Nicaragua',
  '562': 'Niger',            '566': 'Nigeria',          '578': 'Norway',
  '512': 'Oman',             '586': 'Pakistan',         '275': 'Palestine',
  '591': 'Panama',           '598': 'Papua New Guinea', '604': 'Peru',
  '608': 'Philippines',      '616': 'Poland',           '620': 'Portugal',
  '634': 'Qatar',            '642': 'Romania',          '643': 'Russia',
  '682': 'Saudi Arabia',     '686': 'Senegal',          '694': 'Sierra Leone',
  '703': 'Slovakia',         '706': 'Somalia',          '710': 'South Africa',
  '724': 'Spain',            '729': 'Sudan',            '728': 'S. Sudan',
  '752': 'Sweden',           '756': 'Switzerland',      '760': 'Syria',
  '762': 'Tajikistan',       '764': 'Thailand',         '834': 'Tanzania',
  '788': 'Tunisia',          '792': 'Turkey',           '800': 'Uganda',
  '804': 'Ukraine',          '784': 'United Arab Emirates',
  '826': 'United Kingdom',   '840': 'United States of America',
  '858': 'Uruguay',          '860': 'Uzbekistan',       '862': 'Venezuela',
  '704': 'Vietnam',          '887': 'Yemen',            '894': 'Zambia',
  '716': 'Zimbabwe',         '48':  'Bahrain',          '112': 'Belarus',
  '262': 'Djibouti',         '148': 'Chad',             '196': 'Cyprus',
  '233': 'Estonia',          '268': 'Georgia',          '440': 'Lithuania',
  '442': 'Luxembourg',       '688': 'Serbia',           '807': 'Macedonia',
  '498': 'Moldova',          '499': 'Montenegro',       '417': 'Kyrgyzstan',
  '795': 'Turkmenistan',
};

// ─── Build & register world map ──────────────────────────────────────────────
function buildAndRegisterWorldMap() {
  if ((echarts as any).getMap?.('world')) return;
  const fc = topojson.feature(
    worldTopo as any,
    (worldTopo as any).objects.countries,
  ) as GeoJSON.FeatureCollection;
  fc.features.forEach(f => {
    const id   = String(f.id ?? '');
    const name = ISO_NAME[id] ?? `region_${id}`;
    f.properties = { ...(f.properties ?? {}), name };
  });
  echarts.registerMap('world', fc as any);
}
buildAndRegisterWorldMap();

// ─── Country data ────────────────────────────────────────────────────────────
interface CountryDatum { name: string; value: number; coords: [number, number]; }

const COUNTRIES: CountryDatum[] = [
  { name: 'Saudi Arabia',         value: 700, coords: [45.1, 23.9] },
  { name: 'United Arab Emirates', value: 567, coords: [53.8, 23.4] },
  { name: 'Iraq',                 value: 543, coords: [43.7, 33.2] },
  { name: 'Kuwait',               value: 459, coords: [47.5, 29.3] },
  { name: 'Egypt',                value: 456, coords: [30.8, 26.8] },
  { name: 'Qatar',                value: 421, coords: [51.2, 25.3] },
  { name: 'Oman',                 value: 398, coords: [56.7, 22.0] },
  { name: 'Jordan',               value: 354, coords: [36.2, 30.6] },
  { name: 'Bahrain',              value: 313, coords: [50.6, 26.0] },
  { name: 'Sudan',                value: 267, coords: [29.9, 15.6] },
  { name: 'Libya',                value: 234, coords: [17.2, 26.3] },
  { name: 'Yemen',                value: 176, coords: [47.6, 15.6] },
];

const MIN_VAL = Math.min(...COUNTRIES.map(c => c.value));
const MAX_VAL = Math.max(...COUNTRIES.map(c => c.value));

const MAP_CENTER: [number, number] = [44, 26];
const MAP_ZOOM   = 3.8;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtVal(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}M` : `${v}K`;
}

function bubbleDiameter(val: number) {
  const ratio = (val - MIN_VAL) / (MAX_VAL - MIN_VAL);
  return Math.round(8 + ratio * (BUBBLE_MAX_SIZE - 8));
}

// Map a value to its monochromatic color
function valueToColor(val: number): string {
  const idx = Math.round(((val - MIN_VAL) / (MAX_VAL - MIN_VAL)) * (FILL_COLORS.length - 1));
  return FILL_COLORS[Math.max(0, Math.min(idx, FILL_COLORS.length - 1))];
}

// ─── ECharts options ─────────────────────────────────────────────────────────
function getFilledOption(): echarts.EChartsCoreOption {
  return {
    backgroundColor: '#FFFFFF',
    animation: false,
    tooltip: {
      formatter: (p: any) => {
        const v = p.data?.value;
        return `<span style="font-family:${FONT}"><b>${p.name}</b>${v != null ? `<br/>Budget: <b>${fmtVal(v)}</b>` : ''}</span>`;
      },
      textStyle: { fontFamily: FONT },
    },
    visualMap: {
      min:     MIN_VAL,
      max:     MAX_VAL,
      show:    false,
      inRange: { color: FILL_COLORS },
    },
    series: [{
      type:   'map',
      map:    'world',
      roam:   ALLOW_PAN_ZOOM,
      zoom:   MAP_ZOOM,
      center: MAP_CENTER,
      data: COUNTRIES.map(c => ({
        name:  c.name,
        value: c.value,
        label: { show: LABEL_ON },
      })),
      nameProperty: 'name',
      itemStyle: {
        areaColor:   '#F3F4F6',
        borderColor: '#FFFFFF',
        borderWidth: 0.8,
        opacity:     AREA_OPACITY / 100,
      },
      emphasis: {
        itemStyle: { areaColor: '#8FBBDC', borderColor: '#FFFFFF', borderWidth: 1 },
        label:     { show: false },
      },
      select: { disabled: true },
      label: {
        show:            false,
        color:           LABEL_COLOR,
        fontSize:        LABEL_SIZE,
        fontWeight:      LABEL_BOLD ? 'bold' : 'normal',
        fontFamily:      FONT,
        position:        'inside',
        backgroundColor: `rgba(255,255,255,${LABEL_BG_OPC / 100})`,
        padding:         [2, 5],
        borderRadius:    4,
        formatter:       (p: any) => p.name,
      },
    }],
  };
}

function getBubbleOption(): echarts.EChartsCoreOption {
  return {
    backgroundColor: '#FFFFFF',
    animation: false,
    tooltip: {
      formatter: (p: any) => {
        const val = (p.data.value as number[])[2];
        return `<span style="font-family:${FONT}"><b>${p.name}</b><br/>Budget: <b>${fmtVal(val)}</b></span>`;
      },
      textStyle: { fontFamily: FONT },
    },
    // visualMap drives bubble color from value[2] using the monochromatic palette
    visualMap: {
      min:        MIN_VAL,
      max:        MAX_VAL,
      show:       false,
      dimension:  2,          // index into each data point's value array
      seriesIndex: 0,
      inRange:    { color: FILL_COLORS },
    },
    geo: {
      map:    'world',
      roam:   ALLOW_PAN_ZOOM,
      zoom:   MAP_ZOOM,
      center: MAP_CENTER,
      nameProperty: 'name',
      itemStyle: {
        areaColor:   '#F3F4F6',
        borderColor: '#FFFFFF',
        borderWidth: 0.8,
      },
      emphasis: {
        itemStyle: { areaColor: '#E5E7EB' },
        label:     { show: false },
      },
      label: { show: false },
    },
    series: [{
      type:             'scatter',
      coordinateSystem: 'geo',
      data: COUNTRIES.map(c => ({
        name:  c.name,
        value: [c.coords[0], c.coords[1], c.value],
      })),
      symbolSize: (val: number[]) => bubbleDiameter(val[2]),
      // Base color overridden per-point by visualMap; opacity applies on top
      itemStyle: { opacity: BUBBLE_OPACITY / 100 },
      emphasis: {
        itemStyle: { opacity: 0.75, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' },
      },
      label: {
        show:            LABEL_ON,
        position:        'bottom',
        distance:        6,
        color:           LABEL_COLOR,
        fontSize:        LABEL_SIZE,
        fontWeight:      LABEL_BOLD ? 'bold' : 'normal',
        fontFamily:      FONT,
        backgroundColor: `rgba(255,255,255,${LABEL_BG_OPC / 100})`,
        padding:         [2, 6],
        borderRadius:    4,
        formatter:       (p: any) => p.name,
      },
    }],
  };
}

// ─── Color Scale Legend (both variants) ─────────────────────────────────────
function ColorScaleLegend() {
  return (
    <div
      style={{
        position:      'absolute',
        bottom:        16,
        left:          16,
        background:    'rgba(255,255,255,0.92)',
        borderRadius:  8,
        padding:       '8px 12px',
        boxShadow:     '0 1px 6px rgba(0,0,0,0.12)',
        fontFamily:    FONT,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 5 }}>Budget</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, color: '#6B7280' }}>{MIN_VAL}K</span>
        <div
          style={{
            width:        110,
            height:       10,
            borderRadius: 5,
            background:   `linear-gradient(to right, ${FILL_COLORS[0]}, ${FILL_COLORS[FILL_COLORS.length - 1]})`,
            border:       '1px solid #E5E7EB',
          }}
        />
        <span style={{ fontSize: 10, color: '#6B7280' }}>{MAX_VAL}K</span>
      </div>
    </div>
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

// ─── Map Controls Overlay (bottom-right) ────────────────────────────────────
function MapControls({
  onZoomIn,
  onZoomOut,
  onFitScreen,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
}) {
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
    <div
      style={{
        position:      'absolute',
        bottom:        12,
        right:         12,
        display:       'flex',
        flexDirection: 'row',
        alignItems:    'center',
        background:    '#fefefe',
        border:        '1px solid #eee',
        borderRadius:  8,
        boxShadow:     '0 0 2px 1px rgba(0,0,0,0.08)',
        overflow:      'hidden',
        zIndex:        10,
      }}
    >
      <button
        style={{ ...btnStyle, borderLeft: 'none' }}
        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onZoomIn(); }}
        title="Zoom in"
      >
        <IconZoomIn />
      </button>
      <Divider />
      <button
        style={btnStyle}
        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onZoomOut(); }}
        title="Zoom out"
      >
        <IconZoomOut />
      </button>
      <Divider />
      <button
        style={btnStyle}
        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onFitScreen(); }}
        title="Fit screen"
      >
        <IconFitView />
      </button>
    </div>
  );
}

// ─── Chart component ───────────────────────────────────────────────────��─────
type Variant = 'filled' | 'bubble';

function MapChart({ variant }: { variant: Variant }) {
  const canvasRef  = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef   = useRef<echarts.ECharts | null>(null);
  const variantRef = useRef<Variant>(variant);
  // Absolute zoom — start at initial zoom level
  const zoomRef    = useRef<number>(MAP_ZOOM);
  // Current geographic center — updated whenever user pans or we zoom
  const centerRef  = useRef<[number, number]>([...MAP_CENTER] as [number, number]);
  // Flag to suppress georoam tracking when we trigger setOption programmatically
  const programmingRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => { variantRef.current = variant; }, [variant]);

  // Reads the lon/lat under the canvas midpoint and stores it in centerRef
  const syncCenter = useCallback((chart: echarts.ECharts) => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.clientWidth;
    const h = canvasRef.current.clientHeight;
    const finder = variantRef.current === 'filled' ? { seriesIndex: 0 } : { geoIndex: 0 };
    const coord = chart.convertFromPixel(finder as any, [w / 2, h / 2]);
    if (coord && !isNaN(coord[0]) && !isNaN(coord[1])) {
      centerRef.current = [coord[0], coord[1]];
    }
  }, []);

  // Applies zoom via setOption — works for BOTH filled (map series) and bubble (geo)
  const applyZoom = useCallback((factor: number) => {
    const chart = chartRef.current;
    if (!chart) return;

    syncCenter(chart);                        // read current pan position first
    const newZoom = zoomRef.current * factor;
    zoomRef.current = newZoom;

    programmingRef.current = true;            // suppress georoam tracking
    if (variantRef.current === 'filled') {
      chart.setOption({ series: [{ zoom: newZoom, center: centerRef.current }] });
    } else {
      chart.setOption({ geo: { zoom: newZoom, center: centerRef.current } });
    }
    // Give ECharts a tick to finish, then release the flag
    requestAnimationFrame(() => { programmingRef.current = false; });
  }, [syncCenter]);

  // Init chart (key={variant} in parent guarantees fresh mount on variant switch)
  useEffect(() => {
    if (!canvasRef.current) return;
    zoomRef.current   = MAP_ZOOM;
    centerRef.current = [...MAP_CENTER] as [number, number];

    const chart = echarts.init(canvasRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;
    chart.setOption(variant === 'filled' ? getFilledOption() : getBubbleOption());

    // Track user-driven zoom/pan so our refs stay in sync
    chart.on('georoam', (e: any) => {
      if (programmingRef.current) return;  // skip events we triggered ourselves
      if (e.zoom != null && !isNaN(e.zoom)) {
        zoomRef.current *= e.zoom;
      }
      syncCenter(chart);
    });

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(canvasRef.current!);
    return () => { ro.disconnect(); chart.dispose(); chartRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fullscreen tracking
  useEffect(() => {
    const onFsChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      // Delay resize until after the browser has finished the transition
      setTimeout(() => chartRef.current?.resize(), 300);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleZoomIn  = useCallback(() => applyZoom(1.3),     [applyZoom]);
  const handleZoomOut = useCallback(() => applyZoom(1 / 1.3), [applyZoom]);

  // Fit screen — reset to initial zoom & center (same as React Flow's fitView)
  const handleFitScreen = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;
    zoomRef.current   = MAP_ZOOM;
    centerRef.current = [...MAP_CENTER] as [number, number];
    programmingRef.current = true;
    if (variantRef.current === 'filled') {
      chart.setOption({ series: [{ zoom: MAP_ZOOM, center: MAP_CENTER }] });
    } else {
      chart.setOption({ geo: { zoom: MAP_ZOOM, center: MAP_CENTER } });
    }
    requestAnimationFrame(() => { programmingRef.current = false; });
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ width: '100%', height: '100%', position: 'relative', background: '#fff' }}
    >
      <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />

      {/* Color gradient scale — bottom left (both variants) */}
      <ColorScaleLegend />

      {/* Zoom + fit screen — bottom right */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitScreen={handleFitScreen}
      />
    </div>
  );
}

// ─── Style panel ─────────────────────────────────────────────────────────────
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
            <td className="p-2 border border-gray-300 text-gray-700">{style}</td>
            <td className="p-2 border border-gray-300 font-medium">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Section({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h4>
      <StyleTable rows={rows} />
    </div>
  );
}

function StylePanel({ variant }: { variant: Variant }) {
  const isFilled = variant === 'filled';
  return (
    <div
      className="w-[320px] shrink-0 border-l border-gray-200 overflow-y-auto p-5 bg-gray-50"
      style={{ fontFamily: FONT }}
    >
      <h2 className="text-base font-bold mb-5">Style Configuration</h2>

      <div className="mb-6">
        <h3
          className="text-sm font-semibold mb-4 px-3 py-2 rounded"
          style={{ background: '#FEF3C7', color: '#92400E' }}
        >
          Basic styles
        </h3>

        {isFilled ? (
          <Section
            title="Filled Areas"
            rows={[
              ['Area color',    AREA_COLOR],
              ['Area opacity',  `${AREA_OPACITY}%`],
              ['Used palette',  FILLED_PALETTE],
            ]}
          />
        ) : (
          <Section
            title="Bubbles"
            rows={[
              ['Bubble size',    `${BUBBLE_MAX_SIZE}`],
              ['Bubble color',   BUBBLE_COLOR],
              ['Bubble opacity', `${BUBBLE_OPACITY}%`],
              ['Used palette',   BUBBLE_PALETTE],
            ]}
          />
        )}
      </div>

      <div className="mb-6">
        <h3
          className="text-sm font-semibold mb-4 px-3 py-2 rounded"
          style={{ background: '#EDE9FE', color: '#5B21B6' }}
        >
          Advanced styles
        </h3>

        <Section
          title="Map Controls"
          rows={[
            ['Allow pan and zoom', ALLOW_PAN_ZOOM  ? 'Enabled' : 'Disabled'],
            ['Show zoom control',  SHOW_ZOOM_CTRL  ? 'Enabled' : 'Disabled'],
            ['Show full screen',   SHOW_FULLSCREEN ? 'Enabled' : 'Disabled'],
          ]}
        />

        <Section
          title="Category Labels"
          rows={[
            ['Category labels',    LABEL_ON   ? 'Enabled' : 'Disabled'],
            ['Position',           LABEL_POS],
            ['Background color',   LABEL_BG],
            ['Background opacity', `${LABEL_BG_OPC}%`],
            ['Font family',        LABEL_FONT],
            ['Bold',               LABEL_BOLD ? 'Enabled' : 'Disabled'],
            ['Text color',         LABEL_COLOR],
            ['Text size',          `${LABEL_SIZE}`],
          ]}
        />
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function MapView() {
  const [variant, setVariant] = useState<Variant>('filled');

  const tabs: { key: Variant; label: string }[] = [
    { key: 'filled', label: 'Filled Map' },
    { key: 'bubble', label: 'Bubble Map' },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-4 shrink-0">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setVariant(t.key)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  variant === t.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
                }`}
                style={{ fontFamily: FONT }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-white">
          <MapChart key={variant} variant={variant} />
        </div>
      </div>

      <StylePanel variant={variant} />
    </div>
  );
}