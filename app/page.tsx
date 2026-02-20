'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Plus,
  Camera,
  TrendingUp,
  Clock,
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { mockDailyLog, mockUser } from '@/lib/mockData';

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
const MEAL_EMOJI: Record<string, string> = {
  breakfast: '🌅',
  lunch:     '☀️',
  dinner:    '🌙',
  snack:     '🍎',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function CalorieRing({ consumed, goal }: { consumed: number; goal: number }) {
  const pct    = Math.min(consumed / goal, 1);
  const r      = 70;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="calorie-ring-wrapper">
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        <svg
          className="calorie-ring-svg"
          width="180"
          height="180"
          viewBox="0 0 180 180"
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            className="calorie-ring-track"
            cx="90" cy="90" r={r}
            strokeWidth="14"
          />
          {/* Fill */}
          <circle
            className="calorie-ring-fill"
            cx="90" cy="90" r={r}
            strokeWidth="14"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 90 90)"
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="calorie-ring-number">{consumed.toLocaleString()}</div>
          <div className="calorie-ring-label">/ {goal.toLocaleString()} kcal</div>
          <div
            className="badge badge-purple"
            style={{ marginTop: 6, fontSize: '0.7rem' }}
          >
            {Math.round(pct * 100)}%
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {goal - consumed > 0
            ? `${(goal - consumed).toLocaleString()} kcal remaining`
            : 'Goal reached 🎉'}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Macro bar row
────────────────────────────────────────────── */
interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  unit?: string;
  color: string;
}

function MacroBar({ label, current, goal, unit = 'g', color }: MacroBarProps) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div className="macro-item">
      <div className="macro-header">
        <span className="macro-name">{label}</span>
        <span className="macro-values">
          {current}{unit} / {goal}{unit}
        </span>
      </div>
      <div className="macro-bar-track">
        <div
          className="macro-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Dashboard Page
────────────────────────────────────────────── */
export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false);
  const log    = mockDailyLog;
  const user   = mockUser;
  const macros = log.totalMacros;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const stats = [
    {
      label: 'Calories',
      value: log.totalCalories.toLocaleString(),
      sub: `/ ${log.calorieGoal.toLocaleString()} goal`,
      icon: <Flame size={22} />,
      iconClass: 'icon-purple',
      cardClass: 'stat-card-purple',
      barColor: 'var(--gradient-primary)',
      pct: log.totalCalories / log.calorieGoal,
    },
    {
      label: 'Protein',
      value: `${macros.protein}g`,
      sub: `/ ${user.macroGoals.protein}g goal`,
      icon: <Beef size={22} />,
      iconClass: 'icon-cyan',
      cardClass: 'stat-card-cyan',
      barColor: 'var(--accent-cyan)',
      pct: macros.protein / user.macroGoals.protein,
    },
    {
      label: 'Carbs',
      value: `${macros.carbs}g`,
      sub: `/ ${user.macroGoals.carbs}g goal`,
      icon: <Wheat size={22} />,
      iconClass: 'icon-green',
      cardClass: 'stat-card-green',
      barColor: 'var(--accent-green)',
      pct: macros.carbs / user.macroGoals.carbs,
    },
    {
      label: 'Fat',
      value: `${macros.fat}g`,
      sub: `/ ${user.macroGoals.fat}g goal`,
      icon: <Droplets size={22} />,
      iconClass: 'icon-amber',
      cardClass: 'stat-card-amber',
      barColor: 'var(--accent-amber)',
      pct: macros.fat / user.macroGoals.fat,
    },
  ];

  return (
    <>
      {/* ── Page Header ──────────────────────────── */}
      <div className="page-header animate-fade-in-up">
        <p className="page-header-eyebrow">{today}</p>
        <h1>
          Good{' '}
          {new Date().getHours() < 12
            ? 'morning'
            : new Date().getHours() < 18
            ? 'afternoon'
            : 'evening'}
          , {user.name} 👋
        </h1>
        <p>Here&apos;s your nutrition overview for today.</p>
      </div>

      {/* ── Quick Actions ─────────────────────────── */}
      <div className="quick-actions animate-fade-in-up delay-1">
        <button
          className="btn btn-primary"
          onClick={() => setShowUpload((v) => !v)}
        >
          <Camera size={16} />
          {showUpload ? 'Close Upload' : 'Snap & Log Food'}
        </button>
        <Link href="/analytics" className="btn btn-secondary">
          <TrendingUp size={16} />
          View Analytics
        </Link>
      </div>

      {/* ── Image Upload (collapsible) ────────────── */}
      {showUpload && (
        <div
          className="panel animate-scale-in"
          style={{ marginBottom: 'var(--space-6)' }}
        >
          <div className="panel-title">
            <div className="panel-title-dot" />
            AI Food Analysis
          </div>
          <ImageUpload />
        </div>
      )}

      {/* ── Stats Grid ───────────────────────────── */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`stat-card ${s.cardClass} animate-fade-in-up delay-${i + 1}`}
          >
            <div className={`stat-card-icon ${s.iconClass}`}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            <div className="stat-progress-bar">
              <div
                className="stat-progress-fill"
                style={{
                  width: `${Math.min(s.pct * 100, 100)}%`,
                  background: s.barColor,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Content Grid ─────────────────────────── */}
      <div className="content-grid">
        {/* Left: Recent Meals */}
        <div className="panel animate-fade-in-up delay-2">
          <div className="panel-title">
            <div className="panel-title-dot" />
            Today&apos;s Meals
            <span
              className="badge badge-purple"
              style={{ marginLeft: 'auto' }}
            >
              {log.meals.length} logged
            </span>
          </div>

          <div className="meal-list">
            {log.meals.map((meal) => (
              <div key={meal.id} className="meal-item">
                <div
                  className="meal-type-badge"
                  style={{ background: 'var(--glass-bg)', fontSize: '1.3rem' }}
                >
                  {MEAL_EMOJI[meal.mealType] ?? '🍽️'}
                </div>
                <div className="meal-info">
                  <div className="meal-name">{meal.name}</div>
                  <div className="meal-meta">
                    <span style={{ textTransform: 'capitalize' }}>{meal.mealType}</span>
                    &nbsp;·&nbsp;
                    <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    &nbsp;{formatTime(meal.timestamp)}
                    &nbsp;·&nbsp;P {meal.macros.protein}g · C {meal.macros.carbs}g · F {meal.macros.fat}g
                  </div>
                </div>
                <div className="meal-calories">{meal.calories} kcal</div>
              </div>
            ))}
          </div>

          {/* Add meal button */}
          <button
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 'var(--space-4)' }}
            onClick={() => setShowUpload(true)}
          >
            <Plus size={16} />
            Add a Meal
          </button>
        </div>

        {/* Right: Calorie Ring + Macro Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Calorie Ring */}
          <div className="panel animate-fade-in-up delay-3">
            <div className="panel-title">
              <div className="panel-title-dot" />
              Daily Progress
            </div>
            <CalorieRing
              consumed={log.totalCalories}
              goal={log.calorieGoal}
            />
          </div>

          {/* Macro breakdown */}
          <div className="panel animate-fade-in-up delay-4">
            <div className="panel-title">
              <div className="panel-title-dot" />
              Macros
            </div>
            <div className="macro-list">
              <MacroBar
                label="Protein"
                current={macros.protein}
                goal={user.macroGoals.protein}
                color="var(--accent-cyan)"
              />
              <MacroBar
                label="Carbohydrates"
                current={macros.carbs}
                goal={user.macroGoals.carbs}
                color="var(--accent-green)"
              />
              <MacroBar
                label="Fat"
                current={macros.fat}
                goal={user.macroGoals.fat}
                color="var(--accent-amber)"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
