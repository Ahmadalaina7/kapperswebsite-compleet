import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Alle afspraken</h1>
        <p className="text-slate-600">Beheer en bekijk alle boekingen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Afsprakenoverzicht
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-600">
          <p>
            Live afspraken zijn beschikbaar zodra de site op Node.js/Vercel met Supabase draait.
          </p>
          <Link href="/boeken/" className="btn-primary inline-flex">
            Boekingspagina openen
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
