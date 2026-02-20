'use client';

import { useState } from 'react';
import { Save, User, Target, Bell } from 'lucide-react';
import { mockUser } from '@/lib/mockData';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const [name,   setName]   = useState(mockUser.name);
  const [goal,   setGoal]   = useState(String(mockUser.dailyCalorieGoal));
  const [protein, setProtein] = useState(String(mockUser.macroGoals.protein));
  const [carbs,   setCarbs]   = useState(String(mockUser.macroGoals.carbs));
  const [fat,     setFat]     = useState(String(mockUser.macroGoals.fat));
  const [saved,   setSaved]   = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 8,
  };

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <p className="page-header-eyebrow">Preferences</p>
        <h1>Settings</h1>
        <p>Personalise your goals and profile.</p>
      </div>

      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

        {/* Profile */}
        <div className="panel animate-fade-in-up delay-1">
          <div className="panel-title">
            <User size={16} color="var(--accent-cyan)" />
            Profile
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={labelStyle}>Display Name</label>
              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--accent-purple)'; }}
                onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)';  }}
              />
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="panel animate-fade-in-up delay-2">
          <div className="panel-title">
            <Target size={16} color="var(--accent-cyan)" />
            Daily Goals
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-4)',
            }}
          >
            {[
              { label: 'Calories (kcal)',  value: goal,    setter: setGoal    },
              { label: 'Protein (g)',      value: protein, setter: setProtein },
              { label: 'Carbohydrates (g)',value: carbs,   setter: setCarbs   },
              { label: 'Fat (g)',          value: fat,     setter: setFat     },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--accent-purple)'; }}
                  onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)';  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Backend note */}
        <div
          className="panel animate-fade-in-up delay-3"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(236,72,153,0.08))',
            borderColor: 'rgba(245,158,11,0.25)',
          }}
        >
          <div className="panel-title">
            <Bell size={16} color="var(--accent-amber)" />
            Backend Integration Pending
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Settings changes are not persisted yet — connect the backend API
            (<code style={{ color: 'var(--accent-cyan)' }}>lib/api.ts</code>) to enable full
            profile management, notifications, and cloud sync.
          </p>
        </div>

        {/* Save button */}
        <Button
          variant="primary"
          size="lg"
          icon={saved ? undefined : <Save size={16} />}
          onClick={handleSave}
          style={{ alignSelf: 'flex-start' }}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </>
  );
}
