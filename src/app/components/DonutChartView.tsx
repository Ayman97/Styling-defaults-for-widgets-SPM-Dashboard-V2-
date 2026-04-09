import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip } from 'recharts';

const TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontSize: 13,
  color: '#374151',
};

const total = [35, 25, 20, 15, 5].reduce((a, b) => a + b, 0);

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0]?.payload ?? {};
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{name}</div>
      <div>Value: <strong>{value}</strong></div>
      <div>Share: <strong>{pct}%</strong></div>
    </div>
  );
};

const data = [
  { name: 'Category A', value: 35 },
  { name: 'Category B', value: 25 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 15 },
  { name: 'Category E', value: 5 },
];

// Unified monochrome palette — sequential assignment
const COLORS = ['#0B3A67', '#154E84', '#2B6CA3', '#4A88BC', '#6CA3CF'];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#111827"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      fontFamily="Plus Jakarta Sans, sans-serif"
    >
      {value.toFixed(1)}
    </text>
  );
};

export function DonutChartView() {
  const [subTab, setSubTab] = useState<'donut' | 'pie'>('donut');
  
  const innerRadius = subTab === 'donut' ? '30%' : '0%';
  const sliceCorners = subTab === 'donut' ? 8 : 4;
  const showCenterValue = subTab === 'donut';

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex h-full flex-col">
      {/* Sub-tabs */}
      <div className="border-b border-gray-300 bg-white">
        <div className="flex gap-1 px-4">
          <button
            onClick={() => setSubTab('donut')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              subTab === 'donut'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Donut
          </button>
          <button
            onClick={() => setSubTab('pie')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              subTab === 'pie'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Chart (Fixed) */}
        <div className="w-2/3 p-8 flex items-center justify-center">
          <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<PieTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius="60%"
                  fill="#0D3A57"
                  dataKey="value"
                  paddingAngle={2}
                  cornerRadius={sliceCorners}
                  label={<CustomLabel />}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {showCenterValue && (
                    <>
                      <Label
                        value="Total"
                        position="center"
                        fill="#6B7280"
                        fontSize={12}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                        dy={-10}
                      />
                      <Label
                        value={totalValue.toString()}
                        position="center"
                        fill="#111827"
                        fontSize={32}
                        fontWeight="bold"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                        dy={15}
                      />
                    </>
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right side - Style Tables (Scrollable) */}
        <div className="w-1/3 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
          <h2 className="text-xl font-bold mb-6">Style Configuration</h2>

          {/* Basic styles - Slices */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 bg-[#F5E6D3] px-3 py-2 rounded">Basic styles</h3>
            <h4 className="font-semibold mb-2">Slices</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#B8D4E8]">
                  <th className="text-left p-2 border border-gray-300">Style</th>
                  <th className="text-left p-2 border border-gray-300">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border border-gray-300">Inner radius</td><td className="p-2 border border-gray-300"><Val v={subTab === 'donut' ? '30%' : '0%'} /></td></tr>
                <tr><td className="p-2 border border-gray-300">Slice spacing</td><td className="p-2 border border-gray-300"><Val v="2" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Slice corners</td><td className="p-2 border border-gray-300"><Val v={String(sliceCorners)} /></td></tr>
                <tr><td className="p-2 border border-gray-300">Slice color</td><td className="p-2 border border-gray-300"><Val v="#0B3A67" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Slice opacity</td><td className="p-2 border border-gray-300"><Val v="100%" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Used palette</td><td className="p-2 border border-gray-300"><Val v="Monochrome" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Customize each slice</td><td className="p-2 border border-gray-300"><Val v="No" /></td></tr>
              </tbody>
            </table>
          </div>

          {/* Slice customization defaults */}
          <div className="mb-8">
            <h4 className="font-semibold mb-2">Slice customization defaults</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#B8D4E8]">
                  <th className="text-left p-2 border border-gray-300">Slice</th>
                  <th className="text-left p-2 border border-gray-300">Color</th>
                  <th className="text-left p-2 border border-gray-300">Opacity</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Category A', color: '#0B3A67' },
                  { label: 'Category B', color: '#154E84' },
                  { label: 'Category C', color: '#2B6CA3' },
                  { label: 'Category D', color: '#4A88BC' },
                  { label: 'Category E', color: '#6CA3CF' },
                ].map((slice, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-gray-300">{slice.label}</td>
                    <td className="p-2 border border-gray-300"><Val v={slice.color} /></td>
                    <td className="p-2 border border-gray-300">100%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advanced styles */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 bg-[#E8E1F5] px-3 py-2 rounded">Advanced styles</h3>
          </div>

          {/* Center value */}
          <div className="mb-8">
            <h4 className="font-semibold mb-2">Center value</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#B8D4E8]">
                  <th className="text-left p-2 border border-gray-300">Style</th>
                  <th className="text-left p-2 border border-gray-300">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border border-gray-300">Center value enabled</td><td className="p-2 border border-gray-300"><Val v={showCenterValue ? 'Yes' : 'No'} /></td></tr>
                <tr><td className="p-2 border border-gray-300">Show label</td><td className="p-2 border border-gray-300"><Val v="Yes" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Background color</td><td className="p-2 border border-gray-300"><Val v="Transparent" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Background opacity</td><td className="p-2 border border-gray-300"><Val v="0%" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Label position</td><td className="p-2 border border-gray-300"><Val v="Above value" /></td></tr>
              </tbody>
            </table>
          </div>

          {/* Center Label Text */}
          <div className="mb-8">
            <h4 className="font-semibold mb-2">Center Label Text</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#B8D4E8]">
                  <th className="text-left p-2 border border-gray-300">Style</th>
                  <th className="text-left p-2 border border-gray-300">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border border-gray-300">Font family</td><td className="p-2 border border-gray-300"><Val v="Auto" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Bold</td><td className="p-2 border border-gray-300"><Val v="No" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Color</td><td className="p-2 border border-gray-300"><Val v="#6B7280" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Size</td><td className="p-2 border border-gray-300"><Val v="12" /></td></tr>
              </tbody>
            </table>
          </div>

          {/* Center Value Text */}
          <div className="mb-8">
            <h4 className="font-semibold mb-2">Center Value Text</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#B8D4E8]">
                  <th className="text-left p-2 border border-gray-300">Style</th>
                  <th className="text-left p-2 border border-gray-300">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border border-gray-300">Font family</td><td className="p-2 border border-gray-300"><Val v="Auto" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Bold</td><td className="p-2 border border-gray-300"><Val v="Yes" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Color</td><td className="p-2 border border-gray-300"><Val v="#111827" /></td></tr>
                <tr><td className="p-2 border border-gray-300">Size</td><td className="p-2 border border-gray-300"><Val v="32" /></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: renders a color swatch + hex text for color values, plain text otherwise
function Val({ v }: { v: string }) {
  if (/^#[0-9A-Fa-f]{3,6}$/.test(v)) {
    return (
      <span className="flex items-center gap-2">
        <span
          className="inline-block rounded-sm flex-shrink-0"
          style={{ width: 14, height: 14, backgroundColor: v, border: '1px solid rgba(0,0,0,0.12)' }}
        />
        <span>{v}</span>
      </span>
    );
  }
  return <>{v}</>;
}