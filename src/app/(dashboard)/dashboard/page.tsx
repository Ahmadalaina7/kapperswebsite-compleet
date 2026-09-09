import { createClient } from '@/lib/supabase/server';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AppointmentsTable } from '@/components/dashboard/appointments-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Users } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  try {
    const [{ data: today }, { data: upcoming }] = await Promise.all([
      supabase
        .from('appointments')
        .select('*, barbers(name), services(name, duration_min, price_cents)')
        .gte('start_time', new Date().toISOString().split('T')[0])
        .lt('start_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
        .order('start_time'),
      supabase
        .from('appointments')
        .select('*, barbers(name), services(name, duration_min, price_cents)')
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(10),
    ]);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-600">Overzicht van je afspraken en statistieken</p>
        </div>

        <StatsCards today={(today as any) || []} upcoming={(upcoming as any) || []} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Komende afspraken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsTable appointments={(upcoming as any) || []} />
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Kon afspraken niet laden. Probeer opnieuw.
      </div>
    );
  }
}
