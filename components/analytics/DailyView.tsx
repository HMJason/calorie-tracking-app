'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import { mockDailyLog, mockUser } from '@/lib/mockData';

const MACRO_COLORS = {
  protein: '#06b6d4',
  carbs:   '#10b981',
  fat:     '#f59e0b',
};

const MEAL_EMOJI: Record<string, string> = {
  breakfast: '🌅',
  lunch:     '☀️',
  dinner:    '🌙',
  snack:     '🍎',
};

/* Custom tooltip */
function MacroTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
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
      <div style={{ fontWeight: 700, textTransform: 'capitalize', marginBottom: 4 }}>{name}</div>
      <div style={{ color: 'var(--text-secondary)' }}>{value}g</div>
    </div>
  );
}

export default function DailyView() {
  const log    = mockDailyLog;
  const macros = log.totalMacros;
  const goals  = mockUser.macroGoals;

  // Calorie contribution from each macro
  const pieData = [
    { name: 'Protein', value: macros.protein, color: MACRO_COLORS.protein },
    { name: 'Carbs',   value: macros.carbs,   color: MACRO_COLORS.carbs   },
    { name: 'Fat',     value: macros.fat,      color: MACRO_COLORS.fat     },
  ];

  const radialData = [
    {
      name:    'Fat',
      value:   Math.round((macros.fat / goals.fat) * 100),
      fill:    MACRO_COLORS.fat,
    },
    {
      name:    'Carbs',
      value:   Math.round((macros.carbs / goals.carbs) * 100),
      fill:    MACRO_COLORS.carbs,
    },
    {
      name:    'Protein',
      value:   Math.round((macros.protein / goals.protein) * 100),
      fill:    MACRO_COLORS.protein,
    },
    {
      name:    'Calories',
      value:   Math.round((log.totalCalories / log.calorieGoal) * 100),
      fill:    '#7c3aed',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      {/* ── Charts row ─────────────────────────── */}
      <div className="chart-grid">

        {/* Macro distribution donut */}
        <div className="panel animate-fade-in-up">
          <div className="panel-title">
            <div className="panel-title-dot" />
            Macro Distribution
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<MacroTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Goal completion radial */}
        <div className="panel animate-fade-in-up delay-1">
          <div className="panel-title">
            <div className="panel-title-dot" />
            Goal Completion (%)
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={90}
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{v}</span>
                )}
              />
              <Tooltip
                formatter={(val: number) => [`${val}%`, 'Goal']}
                contentStyle={{
                  background: 'rgba(15,12,41,0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Macro stat cards ─────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-4)',
        }}
      >
        {[
          { label: 'Calories', current: log.totalCalories, goal: log.calorieGoal, unit: 'kcal', color: '#7c3aed' },
          { label: 'Protein',  current: macros.protein,    goal: goals.protein,   unit: 'g',    color: MACRO_COLORS.protein },
          { label: 'Carbs',    current: macros.carbs,      goal: goals.carbs,     unit: 'g',    color: MACRO_COLORS.carbs   },
          { label: 'Fat',      current: macros.fat,        goal: goals.fat,       unit: 'g',    color: MACRO_COLORS.fat     },
        ].map(({ label, current, goal, unit, color }) => (
          <div
            key={label}
            className="panel animate-fade-in-up"
            style={{ textAlign: 'center', padding: 'var(--space-5)' }}
          >
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color,
                marginBottom: 4,
              }}
            >
              {current}
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{unit}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              {label} · goal {goal}{unit}
            </div>
            <div className="stat-progress-bar">
              <div
                className="stat-progress-fill"
                style={{
                  width: `${Math.min((current / goal) * 100, 100)}%`,
                  background: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Meal breakdown ───────────────────── */}
      <div className="panel animate-fade-in-up delay-2">
        <div className="panel-title">
          <div className="panel-title-dot" />
          Meal Breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {log.meals.map((meal) => (
            <div
              key={meal.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--glass-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{MEAL_EMOJI[meal.mealType] ?? '🍽️'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {meal.name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  P {meal.macros.protein}g · C {meal.macros.carbs}g · F {meal.macros.fat}g
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)', whiteSpace: 'nowrap' }}>
                {meal.calories} kcal
              </div>
              {/* Inline progress bar */}
              <div style={{ width: 60 }}>
                <div className="stat-progress-bar">
                  <div
                    className="stat-progress-fill"
                    style={{
                      width: `${Math.round((meal.calories / log.totalCalories) * 100)}%`,
                      background: 'var(--gradient-primary)',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>
                  {Math.round((meal.calories / log.totalCalories) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
