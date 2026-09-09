import type { Database } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  barbers: { name: string } | null;
  services: { name: string; duration_min: number; price_cents: number } | null;
};

export function StatsCards({ today, upcoming }: { today: Appointment[]; upcoming: Appointment[] }) {
  const revenueToday = today.reduce((sum, a) => sum + (a.services?.price_cents ?? 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Afspraken vandaag</CardTitle>
          <Calendar className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{today.length}</div>
          <p className="text-xs text-slate-500 mt-1">Geboekte sessies</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Komende afspraken</CardTitle>
          <Clock className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcoming.length}</div>
          <p className="text-xs text-slate-500 mt-1">Volgende 7 dagen</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Omzet vandaag</CardTitle>
          <TrendingUp className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{(revenueToday / 100).toFixed(2)}</div>
          <p className="text-xs text-slate-500 mt-1">Verwachte inkomsten</p>
        </CardContent>
      </Card>
    </div>
  );
}
