'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { mockMonthlyData, mockUser } from '@/lib/mockData';

/* Custom tooltip */
function MonthTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
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
          <span style={{ textTransform: 'capitalize' }}>{p.dataKey}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value} kcal
          </span>
        </div>
      ))}
    </div>
  );
}

/* Simple calendar heatmap */
function CalendarHeatmap({ data }: { data: { calories: number }[] }) {
  const maxCal = Math.max(...data.map((d) => d.calories));
  const goal   = mockUser.dailyCalorieGoal;

  function cellColor(cal: number) {
    const ratio = cal / goal;
    if (ratio >= 1.10) return '#ef4444'; // over goal
    if (ratio >= 0.90) return '#10b981'; // on target
    if (ratio >= 0.70) return '#06b6d4'; // moderate
    return '#7c3aed';                    // under
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
        }}
      >
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              paddingBottom: 4,
            }}
          >
            {d}
          </div>
        ))}

        {data.map((d, i) => (
          <div
            key={i}
            title={`Day ${i + 1}: ${d.calories.toLocaleString()} kcal`}
            style={{
              height: 28,
              borderRadius: 6,
              background: cellColor(d.calories),
              opacity: 0.55 + (d.calories / maxCal) * 0.45,
              cursor: 'pointer',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'; (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.opacity = String(0.55 + (d.calories / maxCal) * 0.45); }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
        {[
          { color: '#7c3aed', label: 'Under' },
          { color: '#06b6d4', label: 'Moderate' },
          { color: '#10b981', label: 'On target' },
          { color: '#ef4444', label: 'Over goal' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MonthlyView() {
  const data       = mockMonthlyData;
  const goal       = mockUser.dailyCalorieGoal;
  const totalCal   = data.reduce((s, d) => s + d.calories, 0);
  const avgCal     = Math.round(totalCal / data.length);
  const bestDay    = data.reduce((best, d) => (Math.abs(d.calories - goal) < Math.abs(best.calories - goal) ? d : best), data[0]);
  const bestDayIdx = data.indexOf(bestDay) + 1;

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
          { label: 'Monthly Total',  value: totalCal.toLocaleString(), unit: 'kcal', color: '#7c3aed' },
          { label: 'Daily Average',  value: avgCal.toLocaleString(),   unit: 'kcal', color: '#06b6d4' },
          { label: 'Best Day',       value: `Day ${bestDayIdx}`,       unit: `${bestDay.calories} kcal`, color: '#10b981' },
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

      {/* ── Area line chart ─────────────────── */}
      <div className="panel animate-fade-in-up delay-1">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Calorie Trend — This Month
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<MonthTooltip />} />
            <ReferenceLine
              y={goal}
              stroke="rgba(245,158,11,0.6)"
              strokeDasharray="5 4"
              label={{ value: 'Goal', fill: 'rgba(245,158,11,0.8)', fontSize: 11, position: 'insideTopRight' }}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#7c3aed"
              strokeWidth={2.5}
              fill="url(#areaGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Calendar heatmap ────────────────── */}
      <div className="panel animate-fade-in-up delay-2">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Logging Consistency
        </div>
        <CalendarHeatmap data={data} />
      </div>
    </div>
  );
}
