import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine, LabelList,
} from 'recharts'
import type { BuffettRatio } from '../../types'

const THRESHOLD_MAP: Record<string, number> = {
  'Gross Margin': 40,
  'SG&A Margin': 30,
  'R&D Margin': 30,
  'Depreciation Margin': 10,
  'Interest Expense Margin': 15,
  'Net Profit Margin': 20,
  'CapEx Margin': 25,
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-xl px-3.5 py-2.5 shadow-2xl text-xs"
      style={{ background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.12)' }}>
      <p className="font-semibold mb-1" style={{ color: '#F5F5F7' }}>{label}</p>
      <p className="font-mono font-bold"
        style={{ color: d.passes === true ? '#30D158' : d.passes === false ? '#FF453A' : 'rgba(235,235,245,0.4)' }}>
        {d.value}%
      </p>
      {d.threshold !== null && (
        <p className="mt-0.5" style={{ color: 'rgba(235,235,245,0.4)' }}>Threshold: {d.threshold}%</p>
      )}
      <p className="mt-1 font-medium"
        style={{ color: d.passes === true ? '#30D158' : d.passes === false ? '#FF453A' : 'rgba(235,235,245,0.4)' }}>
        {d.passes === true ? 'PASS' : d.passes === false ? 'FAIL' : 'N/A'}
      </p>
    </div>
  )
}

export default function RatioChart({ ratios }: { ratios: BuffettRatio[] }) {
  const data = ratios
    .filter(r => r.value !== null)
    .map(r => ({
      name: r.name
        .replace(' Margin', '').replace(' Rate', '')
        .replace(' Growth (YoY)', ' Growth').replace('Interest Expense', 'Interest'),
      value: parseFloat(((r.value ?? 0) * 100).toFixed(1)),
      threshold: THRESHOLD_MAP[r.name] ?? null,
      passes: r.passes,
    }))

  const thresholds = [...new Set(data.map(d => d.threshold).filter(t => t !== null))] as number[]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs" style={{ color: 'rgba(235,235,245,0.35)' }}>
          Values shown as percentages
        </p>
        <div className="flex items-center gap-4 text-[11px]">
          {[
            { label: 'Pass', color: '#30D158' },
            { label: 'Fail', color: '#FF453A' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5" style={{ color: 'rgba(235,235,245,0.4)' }}>
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5" style={{ color: 'rgba(235,235,245,0.4)' }}>
            <span className="w-4 inline-block border-t border-dashed" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            Threshold
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 20, right: 16, left: -8, bottom: 60 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: 'rgba(235,235,245,0.35)', fontSize: 10 }}
            angle={-38}
            textAnchor="end"
            interval={0}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(235,235,245,0.2)', fontSize: 10 }}
            tickFormatter={v => `${v}%`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />

          {thresholds.map(t => (
            <ReferenceLine
              key={t}
              y={t}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="4 3"
              strokeWidth={1}
            />
          ))}

          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={32}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: number) => `${v}%`}
              style={{ fill: 'rgba(235,235,245,0.3)', fontSize: 9 }}
            />
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.passes === true ? '#30D158' : entry.passes === false ? '#FF453A' : 'rgba(255,255,255,0.12)'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
