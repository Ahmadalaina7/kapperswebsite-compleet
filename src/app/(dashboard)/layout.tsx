import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Scissors, LayoutDashboard, Calendar, LogOut } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = (user?.app_metadata as any)?.role ?? (user?.user_metadata as any)?.role;
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <span className="font-semibold text-lg">Dashboard</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-slate-600">
              <LayoutDashboard className="h-4 w-4" />
              Overzicht
            </Link>
            <Link href="/dashboard/afspraken" className="flex items-center gap-2 hover:text-slate-600">
              <Calendar className="h-4 w-4" />
              Afspraken
            </Link>
            <a href="/api/auth/signout" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <LogOut className="h-4 w-4" />
              Uitloggen
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
