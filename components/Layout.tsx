'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Camera,
  Settings,
  Flame,
  LogOut,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';

const NAV_ITEMS = [
  { href: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/analytics',  label: 'Analytics',  icon: BarChart3       },
  { href: '/log',        label: 'Log Food',   icon: Camera          },
  { href: '/settings',   label: 'Settings',   icon: Settings        },
];

const MEAL_EMOJI: Record<string, string> = {
  breakfast: '🌅',
  lunch:     '☀️',
  dinner:    '🌙',
  snack:     '🍎',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user } = useAuth();

  async function handleSignOut() {
    if (auth) await signOut(auth);
    router.replace('/login');
  }

  const email    = user?.email ?? '';
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="app-layout">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Flame size={22} color="#fff" />
          </div>
          <span className="sidebar-logo-text">CaloriAI</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Menu</span>

          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" size={20} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile + Sign Out */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-email" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {email}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="btn-ghost"
            title="Sign out"
            style={{ padding: 4, color: 'var(--text-muted)', flexShrink: 0 }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="main-content">{children}</main>
    </div>
  );
}

export { MEAL_EMOJI };
