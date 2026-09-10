import { BookingWizard } from '@/components/booking/booking-wizard';
import { CalendarDays } from 'lucide-react';

export const metadata = {
  title: 'Afspraak boeken | Hood Barber',
  description: 'Boek in 3 stappen je knipbeurt bij Hood Barber. Kies je dienst en tijdstip.',
};

const FALLBACK_SERVICES = [
  { id: 'fallback-contouren', name: 'Contouren', description: 'Haarlijn strak zetten', duration_min: 20, price_cents: 500, active: true },
  { id: 'fallback-knippen', name: 'Haar knippen', description: 'Complete knipbeurt, gewassen en gestyled', duration_min: 30, price_cents: 1500, active: true },
  { id: 'fallback-haarbaard', name: 'Haar + baard', description: 'Knipbeurt plus baard trimmen en vormgeven', duration_min: 45, price_cents: 1800, active: true },
];

export default function BookingPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-800">
            <CalendarDays className="h-4 w-4" /> 24/7 online boekbaar
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Afspraak boeken</h1>
          <p className="mt-3 text-lg text-slate-600">
            Kies je dienst en tijdstip. Fikri helpt je persoonlijk en je krijgt direct een bevestiging per e-mail.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-10">
          <BookingWizard services={FALLBACK_SERVICES} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Liever bellen? Bel ons op{' '}
          <a href="tel:+31413123456" className="font-medium text-primary-700 hover:underline">
            0413 - 12 34 56
          </a>
        </p>
      </div>
    </div>
  );
}
