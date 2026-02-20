'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Flame } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import AppLayout from './Layout';

function LoadingScreen() {
  return (
    <div className="auth-loading-screen">
      <div className="auth-loading-logo">
        <div className="sidebar-logo-icon" style={{ width: 56, height: 56, borderRadius: 16 }}>
          <Flame size={28} color="#fff" />
        </div>
        <span className="sidebar-logo-text" style={{ fontSize: '1.6rem' }}>CaloriAI</span>
      </div>
      <div className="loader" style={{ width: 32, height: 32, marginTop: 32 }} />
    </div>
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login';

  const firebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  useEffect(() => {
    if (loading) return;
    if (!firebaseConfigured) return; // demo mode — no auth redirects
    if (!user && !isAuthPage) router.replace('/login');
    if (user && isAuthPage)  router.replace('/');
  }, [user, loading, isAuthPage, router, firebaseConfigured]);

  if (loading) return <LoadingScreen />;

  // Demo mode — skip auth entirely
  if (!firebaseConfigured) return <AppLayout>{children}</AppLayout>;

  // Login page — no sidebar, no redirect needed while authed check runs
  if (isAuthPage) return <>{children}</>;

  // Not yet authed — stay blank while redirect fires
  if (!user) return <LoadingScreen />;

  return <AppLayout>{children}</AppLayout>;
}
