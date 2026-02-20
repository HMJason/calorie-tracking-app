'use client';

import { useState } from 'react';
import { BarChart3, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import DailyView   from '@/components/analytics/DailyView';
import WeeklyView  from '@/components/analytics/WeeklyView';
import MonthlyView from '@/components/analytics/MonthlyView';
import YearlyView  from '@/components/analytics/YearlyView';

type Tab = 'daily' | 'weekly' | 'monthly' | 'yearly';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'daily',   label: 'Daily',   icon: <BarChart3     size={15} /> },
  { id: 'weekly',  label: 'Weekly',  icon: <Calendar      size={15} /> },
  { id: 'monthly', label: 'Monthly', icon: <CalendarDays  size={15} /> },
  { id: 'yearly',  label: 'Yearly',  icon: <CalendarRange size={15} /> },
];

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  daily:   "Detailed breakdown of today's nutrition and macro goals.",
  weekly:  'Compare your calorie intake day-by-day over the past 7 days.',
  monthly: 'Spot trends and consistency patterns for the current month.',
  yearly:  'High-level overview of your annual nutrition journey.',
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  return (
    <>
      {/* ── Page Header ──────────────────────────── */}
      <div className="page-header animate-fade-in-up">
        <p className="page-header-eyebrow">Insights</p>
        <h1>Analytics</h1>
        <p>{TAB_DESCRIPTIONS[activeTab]}</p>
      </div>

      {/* ── Tab Bar ──────────────────────────────── */}
      <div className="tab-bar animate-fade-in-up delay-1">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ── View Content ─────────────────────────── */}
      <div key={activeTab} className="animate-fade-in-up">
        {activeTab === 'daily'   && <DailyView   />}
        {activeTab === 'weekly'  && <WeeklyView  />}
        {activeTab === 'monthly' && <MonthlyView />}
        {activeTab === 'yearly'  && <YearlyView  />}
      </div>
    </>
  );
}
