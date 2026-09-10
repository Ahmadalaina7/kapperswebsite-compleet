'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Scissors } from 'lucide-react';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPrice(cents: string | null): string {
  if (!cents) return '';
  const n = Number(cents);
  if (Number.isNaN(n)) return '';
  return `€${(n / 100).toFixed(2).replace('.', ',')}`;
}

export function ConfirmationDetails() {
  const sp = useSearchParams();
  const service = sp.get('service');
  const date = sp.get('date');
  const time = sp.get('time');
  const price = sp.get('price');

  const rows: { label: string; value: string }[] = [];
  if (service) rows.push({ label: 'Behandeling', value: service });
  if (date) {
    const formatted = formatDate(date);
    rows.push({ label: 'Datum', value: formatted || date });
  }
  if (time) rows.push({ label: 'Tijdstip', value: time });
  if (price) {
    const p = formatPrice(price);
    if (p) rows.push({ label: 'Prijs', value: p });
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-8 text-center shadow-xl shadow-slate-900/5 md:p-12">
          <div className="mx-auto mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-100 bg-green-50 text-green-500">
            <CheckCircle className="h-12 w-12" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Afspraak bevestigd!</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Bedankt voor het boeken. We hebben je afspraak ingepland en sturen een bevestiging naar je e-mail.
          </p>

          {rows.length > 0 && (
            <dl className="mx-auto mt-10 max-w-md space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-slate-500">{r.label}</dt>
                  <dd className="font-semibold text-slate-900">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/" className="btn-secondary h-14 px-8 text-base">
              Terug naar home
            </Link>
            <Link href="/boeken/" className="btn-primary h-14 px-8 text-base">
              Nog een afspraak
            </Link>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Scissors className="h-4 w-4" /> Kom 5 minuten van tevoren, zo lopen we nooit uit.
          </p>
        </div>
      </div>
    </div>
  );
}
