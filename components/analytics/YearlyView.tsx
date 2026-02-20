'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { mockYearlyData, mockUser } from '@/lib/mockData';

function YearTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(15,12,41,0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        padding: '10px 16px',
        fontSize: '0.85rem',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ textTransform: 'capitalize' }}>
            {p.dataKey === 'averageCalories' ? 'Daily Avg' : 'Monthly Total'}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value} kcal
          </span>
        </div>
      ))}
    </div>
  );
}

/* Contribution-style annual summary grid */
function ContributionGrid({ data }: { data: { month: string; averageCalories: number }[] }) {
  const goal = mockUser.dailyCalorieGoal;

  function barColor(avg: number) {
    const r = avg / goal;
    if (r >= 1.10) return '#ef4444';
    if (r >= 0.95) return '#10b981';
    if (r >= 0.80) return '#06b6d4';
    return '#7c3aed';
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 6,
        alignItems: 'end',
      }}
    >
      {data.map(({ month, averageCalories }) => {
        const height = Math.round(20 + (averageCalories / (goal * 1.2)) * 60);
        return (
          <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: '100%',
                height,
                borderRadius: 6,
                background: barColor(averageCalories),
                opacity: 0.85,
                transition: 'opacity 0.2s',
                cursor: 'pointer',
              }}
              title={`${month}: avg ${averageCalories.toLocaleString()} kcal/day`}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function YearlyView() {
  const data     = mockYearlyData;
  const goal     = mockUser.dailyCalorieGoal;
  const yearAvg  = Math.round(data.reduce((s, m) => s + m.averageCalories, 0) / data.length);
  const yearTotal = data.reduce((s, m) => s + m.totalCalories, 0);
  const bestMonth = data.reduce((best, m) =>
    Math.abs(m.averageCalories - goal) < Math.abs(best.averageCalories - goal) ? m : best,
    data[0],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      {/* ── Summary stats ────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
        }}
      >
        {[
          { label: 'Yearly Total',   value: `${(yearTotal / 1000).toFixed(0)}k`, unit: 'kcal', color: '#7c3aed' },
          { label: 'Yearly Avg/Day', value: yearAvg.toLocaleString(),            unit: 'kcal', color: '#06b6d4' },
          { label: 'Best Month',     value: bestMonth.month,                      unit: `${bestMonth.averageCalories.toLocaleString()} kcal/day`, color: '#10b981' },
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

      {/* ── Monthly average bar chart ────────── */}
      <div className="panel animate-fade-in-up delay-1">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Monthly Average Calories — {new Date().getFullYear()}
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {data.map((m, i) => {
                const ratio = m.averageCalories / goal;
                const c1 = ratio >= 1.10 ? '#ef4444' : ratio >= 0.95 ? '#10b981' : '#7c3aed';
                const c2 = ratio >= 1.10 ? '#f97316' : ratio >= 0.95 ? '#06b6d4' : '#06b6d4';
                return (
                  <linearGradient key={m.month} id={`yGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={c1} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={c2} stopOpacity={0.7} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
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
            <Tooltip content={<YearTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <ReferenceLine
              y={goal}
              stroke="rgba(245,158,11,0.6)"
              strokeDasharray="5 4"
              label={{ value: 'Daily Goal', fill: 'rgba(245,158,11,0.8)', fontSize: 11, position: 'insideTopRight' }}
            />
            <Bar dataKey="averageCalories" radius={[8, 8, 0, 0]} maxBarSize={40}>
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#yGrad${i})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Trend line ───────────────────────── */}
      <div className="panel animate-fade-in-up delay-2">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Calorie Trend — Year Overview
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<YearTooltip />} />
            <ReferenceLine y={goal} stroke="rgba(245,158,11,0.5)" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="averageCalories"
              stroke="#7c3aed"
              strokeWidth={2.5}
              dot={{ fill: '#7c3aed', r: 4, stroke: '#fff', strokeWidth: 1.5 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Contribution grid ────────────────── */}
      <div className="panel animate-fade-in-up delay-3">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Monthly Comparison Grid
        </div>
        <ContributionGrid data={data} />
      </div>
    </div>
  );
}
