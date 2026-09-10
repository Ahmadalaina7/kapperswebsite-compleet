import Link from 'next/link';
import { Scissors, LayoutDashboard, Calendar } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <span className="text-lg font-semibold">Dashboard</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard/" className="flex items-center gap-2 hover:text-slate-600">
              <LayoutDashboard className="h-4 w-4" />
              Overzicht
            </Link>
            <Link href="/dashboard/afspraken/" className="flex items-center gap-2 hover:text-slate-600">
              <Calendar className="h-4 w-4" />
              Afspraken
            </Link>
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              Terug naar site
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
