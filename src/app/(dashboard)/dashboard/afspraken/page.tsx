import { createClient } from '@/lib/supabase/server';
import { AppointmentsTable } from '@/components/dashboard/appointments-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default async function AppointmentsPage(props: {
  searchParams: Promise<{ status?: string; barber_id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('appointments')
    .select('*, barbers(name), services(name, duration_min, price_cents)')
    .order('start_time', { ascending: false });

  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams.barber_id) {
    query = query.eq('barber_id', searchParams.barber_id);
  }

  const { data } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alle afspraken</h1>
        <p className="text-slate-600">Beheer en bekijk alle boekingen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Afsprakenoverzicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsTable appointments={(data as any) || []} />
        </CardContent>
      </Card>
    </div>
  );
}
