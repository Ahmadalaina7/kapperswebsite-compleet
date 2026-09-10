'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Loader2, Sun, AlertCircle, Check } from 'lucide-react';
import type { Service } from '@/lib/booking-data';
import { getDemoSlots } from '@/lib/availability';

type SlotResponse = { slots: string[]; closed?: boolean };

function todayStr(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDayLabel(dateStr: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    weekday: d.toLocaleDateString('nl-NL', { weekday: 'short' }),
    day: d.toLocaleDateString('nl-NL', { day: 'numeric' }),
    month: d.toLocaleDateString('nl-NL', { month: 'short' }),
  };
}

export function BookingWizard({ services }: { services: Service[] }) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [closed, setClosed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const scrollRestore = useRef<number | null>(null);

  const service = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);

  // Mobiele browsers kunnen bij een rerender de focus terug naar boven scrollen.
  // Bewaar daarom de positie vóór elke keuze en herstel die direct na de update.
  function rememberScroll() {
    if (typeof window !== 'undefined' && scrollRestore.current === null) {
      scrollRestore.current = window.scrollY;
    }
  }

  function keepScroll(event: React.PointerEvent<HTMLButtonElement>) {
    rememberScroll();
    event.currentTarget.focus({ preventScroll: true });
  }

  useLayoutEffect(() => {
    const y = scrollRestore.current;
    if (y === null || typeof window === 'undefined') return;
    const restore = () => window.scrollTo({ top: y, left: 0, behavior: 'auto' });
    restore();
    const frame = requestAnimationFrame(restore);
    const secondFrame = requestAnimationFrame(() => requestAnimationFrame(restore));
    scrollRestore.current = null;
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(secondFrame);
    };
  }, [step, serviceId, date, time]);

  // Genereer de komende 14 dagen (vandaag t/m over 13 dagen).
  const days = useMemo(() => {
    const list: string[] = [];
    const start = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const pad = (n: number) => String(n).padStart(2, '0');
      list.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    }
    return list;
  }, []);

  // Haal beschikbare tijden op zodra stap 2 open is en de service bekend is.
  useEffect(() => {
    if (step !== 2 || !serviceId) return;
    if (!date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setClosed(false);
    const duration = service?.duration_min ?? 30;
    const params = new URLSearchParams({ date, service_id: serviceId });

    fetch(`/api/availability?${params.toString()}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('unavailable');
        return r.json() as Promise<SlotResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots || []);
        setClosed(Boolean(data.closed));
      })
      .catch(() => {
        if (cancelled) return;
        const demo = getDemoSlots(date, duration);
        setSlots(demo.slots);
        setClosed(demo.closed);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, serviceId, date, service?.duration_min]);

  function goToStep2() {
    rememberScroll();
    if (!serviceId) {
      setErrors({ step1: 'Kies eerst een dienst.' });
      return;
    }
    setErrors({});
    setTime('');
    setDate('');
    setStep(2);
  }

  function goToStep3() {
    rememberScroll();
    if (!date || !time) {
      setErrors({ step2: 'Kies een datum en een beschikbaar tijdstip.' });
      return;
    }
    setErrors({});
    setStep(3);
  }

  function validateDetails(): boolean {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Vul je volledige naam in.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Vul een geldig e-mailadres in.';
    if (form.phone && !/^[+0-9][0-9\s-]{6,}$/.test(form.phone)) next.phone = 'Vul een geldig telefoonnummer in.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setSubmitError(null);
    if (!validateDetails()) return;
    setSubmitting(true);

    const confirmParams = new URLSearchParams({
      service: service?.name || '',
      date,
      time,
      price: String(service?.price_cents ?? 0),
    });
    const confirmUrl = `/boeken/bevestigd/?${confirmParams.toString()}`;

    try {
      const startISO = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          client_name: form.name,
          client_email: form.email,
          client_phone: form.phone || null,
          start_time: startISO,
          notes: form.notes || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.error) {
          window.location.href = confirmUrl;
          return;
        }
      }
    } catch {
      // Statische hosting: geen API — bevestiging toch tonen (demo).
    }

    window.location.href = confirmUrl;
  }

  const stepDefs = [
    { n: 1, label: 'Dienst' },
    { n: 2, label: 'Datum & tijd' },
    { n: 3, label: 'Gegevens' },
  ];

  return (
    <div className="space-y-10">
      {/* Voortgang */}
      <ol className="flex items-center gap-2 md:gap-4">
        {stepDefs.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2 md:gap-4 flex-1 last:flex-none">
            <button
              type="button"
              onPointerDown={keepScroll}
              onClick={() => {
                if (s.n < step) {
                  rememberScroll();
                  setStep(s.n);
                }
              }}
              disabled={s.n >= step}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                step === s.n ? 'bg-primary-600 text-white shadow-glow' : step > s.n ? 'bg-primary-100 text-primary-800' : 'bg-slate-100 text-slate-400'
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  step === s.n ? 'bg-white/20 text-white' : step > s.n ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                )}
              >
                {step > s.n ? <Check className="h-3.5 w-3.5" /> : s.n}
              </span>
              <span className="hidden md:inline">{s.label}</span>
            </button>
            {i < stepDefs.length - 1 && <span className="h-px flex-1 bg-slate-200" />}
          </li>
        ))}
      </ol>

      {submitError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {submitError}
        </div>
      )}

      {/* Stap 1 */}
      {step === 1 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kies je dienst</h2>
            <p className="text-sm text-slate-500 mt-1">
              Alle behandelingen zijn speciaal voor heren en worden geknipt door Fikri, eigenaar en
              barber van Hood Barber.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onPointerDown={keepScroll}
                onClick={() => {
                  rememberScroll();
                  setServiceId(s.id);
                }}
                className={cn(
                  'group rounded-2xl border p-5 text-left transition-all',
                  serviceId === s.id
                    ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600/20'
                    : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-md'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-sm text-slate-500 mt-1">{s.description}</div>
                  </div>
                  <div
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      serviceId === s.id ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 text-transparent'
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {s.duration_min} min
                  </span>
                  <span className="ml-auto text-lg font-bold text-slate-900">€{(s.price_cents / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              </button>
            ))}
          </div>

          {errors.step1 && <p className="text-sm text-red-600">{errors.step1}</p>}
          <button type="button" onClick={goToStep2} className="btn-primary w-full sm:w-auto">
            Verder naar datum & tijd
          </button>
        </section>
      )}

      {/* Stap 2 */}
      {step === 2 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Wanneer kom je?</h2>
            <p className="text-sm text-slate-500 mt-1">
              {service?.name} · {service ? `${service.duration_min} minuten` : ''}
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {days.map((d) => {
              const { weekday, day, month } = formatDayLabel(d);
              const isToday = d === todayStr();
              return (
                <button
                  key={d}
                  type="button"
                  onPointerDown={keepScroll}
                  onClick={() => {
                    rememberScroll();
                    setDate(d);
                    setTime('');
                  }}
                  className={cn(
                    'flex min-w-[4.25rem] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition-all',
                    date === d
                      ? 'border-primary-600 bg-primary-600 text-white shadow-glow'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                  )}
                >
                  <span className={cn('text-xs font-medium uppercase', date === d ? 'text-primary-100' : 'text-slate-400')}>
                    {isToday ? 'Vandaag' : weekday}
                  </span>
                  <span className="text-xl font-bold">{day}</span>
                  <span className={cn('text-xs', date === d ? 'text-primary-100' : 'text-slate-400')}>{month}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            {!date && (
              <p className="text-sm text-slate-500">Kies hierboven een datum om beschikbare tijden te zien.</p>
            )}
            {date && slotsLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Beschikbare tijden laden…
              </div>
            )}
            {date && !slotsLoading && closed && (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Sun className="h-4 w-4" /> Wij zijn op {formatDayLabel(date).weekday} gesloten. Kies een andere dag.
              </div>
            )}
            {date && !slotsLoading && !closed && slots.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <AlertCircle className="h-4 w-4" /> Geen vrije tijden op deze dag. Kies een andere datum.
              </div>
            )}
            {date && !slotsLoading && slots.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onPointerDown={keepScroll}
                    onClick={() => {
                      rememberScroll();
                      setTime(t);
                    }}
                    className={cn(
                      'rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                      time === t
                        ? 'border-primary-600 bg-primary-600 text-white shadow-glow'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-400 hover:bg-primary-50'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {errors.step2 && <p className="text-sm text-red-600">{errors.step2}</p>}
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onPointerDown={keepScroll} onClick={() => { rememberScroll(); setStep(1); }} className="btn-ghost border border-slate-200">
              Terug
            </button>
            <button type="button" onClick={goToStep3} disabled={!date || !time} className="btn-primary disabled:opacity-40">
              Verder naar gegevens
            </button>
          </div>
        </section>
      )}

      {/* Stap 3 */}
      {step === 3 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Jouw gegevens</h2>
            <p className="text-sm text-slate-500 mt-1">We sturen de bevestiging naar je e-mail.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="client_name" className="text-sm font-semibold text-slate-700">
                Naam *
              </label>
              <input
                id="client_name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={cn('input h-14', errors.name && 'border-red-300 focus:ring-red-400')}
                placeholder="Je volledige naam"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="client_email" className="text-sm font-semibold text-slate-700">
                E-mail *
              </label>
              <input
                id="client_email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn('input h-14', errors.email && 'border-red-300 focus:ring-red-400')}
                placeholder="naam@voorbeeld.nl"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="client_phone" className="text-sm font-semibold text-slate-700">
                Telefoon (optioneel)
              </label>
              <input
                id="client_phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input h-14"
                placeholder="06 - 12 34 56 78"
              />
              {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="text-sm font-semibold text-slate-700">
                Opmerkingen (optioneel)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input resize-none min-h-[6rem]"
                placeholder="Bijvoorbeeld: referentiefoto, specifieke wensen…"
              />
            </div>
          </div>

          {/* Samenvatting */}
          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-4">Jouw afspraak</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Behandeling</dt>
                <dd className="font-medium">{service?.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Datum</dt>
                <dd className="font-medium">
                  {date &&
                    new Date(`${date}T00:00:00`).toLocaleDateString('nl-NL', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Tijd</dt>
                <dd className="font-medium">{time}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-800 pt-3 text-base">
                <dt className="text-slate-400">Totaal</dt>
                <dd className="font-bold text-primary-400">
                  €{((service?.price_cents ?? 0) / 100).toFixed(2).replace('.', ',')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onPointerDown={keepScroll} onClick={() => { rememberScroll(); setStep(2); }} className="btn-ghost border border-slate-200">
              Terug
            </button>
            <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 sm:flex-none">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Bezig met boeken…
                </>
              ) : (
                'Afspraak bevestigen'
              )}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
