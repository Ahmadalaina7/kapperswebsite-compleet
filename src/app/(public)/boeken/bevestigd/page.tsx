import { Suspense } from 'react';
import { ConfirmationDetails } from '@/components/booking/confirmation-details';

export const metadata = { title: 'Afspraak bevestigd | Hood Barber' };

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-slate-50 py-24 text-center text-slate-500">Bevestiging laden…</div>
      }
    >
      <ConfirmationDetails />
    </Suspense>
  );
}
