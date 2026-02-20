'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { mockWeeklyData, mockUser } from '@/lib/mockData';

/* Custom tooltip */
function WeekTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(15,12,41,0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        padding: '10px 16px',
        fontSize: '0.85rem',
        minWidth: 140,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: 'var(--text-secondary)' }}>
          <span style={{ textTransform: 'capitalize' }}>{p.dataKey}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            {p.dataKey === 'calories' ? ' kcal' : 'g'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function WeeklyView() {
  const data         = mockWeeklyData;
  const goal         = mockUser.dailyCalorieGoal;
  const totalWeek    = data.reduce((s, d) => s + d.calories, 0);
  const avgCalories  = Math.round(totalWeek / data.length);
  const daysOverGoal = data.filter((d) => d.calories > goal).length;

  // Use today's label (last bar = today)
  const todayLabel = data[data.length - 1].label;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      {/* ── Summary stat row ─────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
        }}
      >
        {[
          { label: 'Weekly Total',   value: totalWeek.toLocaleString(), unit: 'kcal', color: '#7c3aed' },
          { label: 'Daily Average',  value: avgCalories.toLocaleString(), unit: 'kcal', color: '#06b6d4' },
          { label: 'Days Over Goal', value: String(daysOverGoal), unit: `/ ${data.length}`,  color: daysOverGoal > 3 ? '#ef4444' : '#10b981' },
        ].map(({ label, value, unit, color }) => (
          <div
            key={label}
            className="panel animate-fade-in-up"
            style={{ textAlign: 'center', padding: 'var(--space-5)' }}
          >
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{unit}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Calorie bar chart ────────────────── */}
      <div className="panel animate-fade-in-up delay-1">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Daily Calories — This Week
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barGradToday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<WeekTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <ReferenceLine
              y={goal}
              stroke="rgba(245,158,11,0.6)"
              strokeDasharray="5 4"
              label={{
                value: `Goal ${goal.toLocaleString()}`,
                fill: 'rgba(245,158,11,0.8)',
                fontSize: 11,
                position: 'insideTopRight',
              }}
            />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={entry.label === todayLabel ? 'url(#barGradToday)' : 'url(#barGrad)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Macro stacked chart ──────────────── */}
      <div className="panel animate-fade-in-up delay-2">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Macro Breakdown — This Week
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<WeekTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="protein" stackId="m" fill="#06b6d4" name="Protein" radius={[0,0,0,0]} maxBarSize={52} />
            <Bar dataKey="carbs"   stackId="m" fill="#10b981" name="Carbs"   maxBarSize={52} />
            <Bar dataKey="fat"     stackId="m" fill="#f59e0b" name="Fat"     radius={[6,6,0,0]} maxBarSize={52} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
