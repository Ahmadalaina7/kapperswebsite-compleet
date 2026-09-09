import { updateAppointmentStatus, deleteAppointment } from '@/lib/actions/admin-actions';
import type { Database } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  barbers: { name: string } | null;
  services: { name: string; duration_min: number; price_cents: number } | null;
};

export async function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Datum/tijd</th>
            <th className="px-4 py-3 text-left font-medium">Klant</th>
            <th className="px-4 py-3 text-left font-medium">Kapper</th>
            <th className="px-4 py-3 text-left font-medium">Service</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Acties</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-t hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium">{new Date(a.start_time).toLocaleDateString('nl-NL')}</div>
                <div className="text-xs text-slate-500">{new Date(a.start_time).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{a.client_name}</div>
                <div className="text-xs text-slate-500">{a.client_email}</div>
              </td>
              <td className="px-4 py-3">{a.barbers?.name || '-'}</td>
              <td className="px-4 py-3">{a.services?.name || '-'}</td>
              <td className="px-4 py-3">
                <Badge variant={
                  a.status === 'confirmed' ? 'success' :
                  a.status === 'completed' ? 'info' :
                  a.status === 'cancelled' ? 'danger' : 'warning'
                }>
                  {a.status === 'confirmed' ? 'Bevestigd' :
                   a.status === 'completed' ? 'Voltooid' :
                   a.status === 'cancelled' ? 'Geannuleerd' : 'In afwachting'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <form action={updateAppointmentStatus.bind(null, a.id, a.status === 'confirmed' ? 'completed' : 'confirmed')}>
                    <Button type="submit" variant="secondary" size="sm">
                      {a.status === 'confirmed' ? 'Voltooi' : 'Bevestig'}
                    </Button>
                  </form>
                  <form action={updateAppointmentStatus.bind(null, a.id, 'cancelled')}>
                    <Button type="submit" variant="ghost" size="sm">Annuleer</Button>
                  </form>
                  <form action={deleteAppointment.bind(null, a.id)}>
                    <Button type="submit" variant="danger" size="sm">Verwijder</Button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                Geen afspraken gevonden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
