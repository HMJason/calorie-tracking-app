import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'CaloriAI — Smart Calorie Tracker',
  description: 'Track your nutrition effortlessly with AI-powered food image analysis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
