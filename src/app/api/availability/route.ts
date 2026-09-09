import { NextRequest, NextResponse } from 'next/server';
import { createServerReadClient } from '@/lib/supabase/server-client';
import { supabaseStatus } from '@/lib/supabase-status';
import {
  OPENING_HOURS,
  SLOT_STEP_MINUTES,
  MIN_LEAD_MINUTES,
  MAX_DAYS_AHEAD,
  minutesFromHHMM,
  hhmmFromMinutes,
} from '@/lib/availability';

const TIMEZONE = 'Europe/Amsterdam';

/**
 * Berekent de offset (in ms) van een tijdzone t.o.v. UTC op een specifiek moment.
 * Nodig omdat de server zelf in een willekeurige tijdzone kan draaien.
 */
function tzOffsetMs(instant: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(instant);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second)
  );
  return asUTC - instant.getTime();
}

/**
 * Zet een kalenderdatum + aantal minuten sinds middernacht om naar een
 * UTC-tijdstip, alsof die klokminute in Europe/Amsterdam geldt.
 * (Twee passen voorCorrecte DST-afhandeling.)
 */
function wallClockToUtc(dateStr: string, minutes: number): Date {
  const guess = new Date(Date.parse(`${dateStr}T00:00:00Z`) + minutes * 60_000);
  const offset1 = tzOffsetMs(guess, TIMEZONE);
  const corrected = new Date(guess.getTime() - offset1);
  const offset2 = tzOffsetMs(corrected, TIMEZONE);
  if (offset2 !== offset1) {
    return new Date(guess.getTime() - offset2);
  }
  return corrected;
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

function weekdayOf(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function todayInTz(tz: string): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return parts; // en-CA geeft YYYY-MM-DD
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('service_id');
  const dateParam = searchParams.get('date');

  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return NextResponse.json(
      { error: 'date (YYYY-MM-DD) is verplicht' },
      { status: 400 }
    );
  }

  // Demo-modus: geen database. Genereer realistische sloten op basis van
  // openingstijden, met een paar deterministische 'bezet'-blokken.
  if (supabaseStatus().demo) {
    const todayDemo = todayInTz(TIMEZONE);
    const maxDemo = addDays(todayDemo, MAX_DAYS_AHEAD);
    if (dateParam < todayDemo || dateParam > maxDemo) {
      return NextResponse.json({ slots: [] });
    }
    const dayDemo = OPENING_HOURS[weekdayOf(dateParam)];
    if (!dayDemo?.open || !dayDemo?.close) {
      return NextResponse.json({ slots: [], closed: true });
    }

    const earliestDemo = Date.now() + MIN_LEAD_MINUTES * 60_000;
    const durDemo = 30; // demo: gemiddelde behandeling
    const seed = Number(dateParam.replaceAll('-', ''));
    const out: string[] = [];
    for (let m = minutesFromHHMM(dayDemo.open); m + durDemo <= minutesFromHHMM(dayDemo.close); m += SLOT_STEP_MINUTES) {
      const startDemo = wallClockToUtc(dateParam, m);
      if (startDemo.getTime() < earliestDemo) continue;
      // elke 5e of 7e slot 'bezet', deterministisch per dag
      if ((m / SLOT_STEP_MINUTES + seed) % 5 === 0) continue;
      if ((m / SLOT_STEP_MINUTES + seed) % 7 === 0) continue;
      out.push(hhmmFromMinutes(m));
    }
    return NextResponse.json({ slots: out, closed: false });
  }

  const supabase = await createServerReadClient();

  // Duur van de gekozen service (of standaard 30 min).
  let durationMin = 30;
  if (serviceId) {
    const { data: service } = await supabase
      .from('services')
      .select('duration_min')
      .eq('id', serviceId)
      .maybeSingle();
    if (service?.duration_min) durationMin = service.duration_min;
  }

  // De enige actieve kapper in de database (eenmanszaak).
  const { data: barber } = await supabase
    .from('barbers')
    .select('id, active')
    .eq('active', true)
    .limit(1)
    .maybeSingle();
  if (!barber?.active) {
    return NextResponse.json({ slots: [], closed: true });
  }
  const barberId = barber.id;

  // Buiten het boekbare bereik?
  const today = todayInTz(TIMEZONE);
  const maxDate = addDays(today, MAX_DAYS_AHEAD);
  if (dateParam < today || dateParam > maxDate) {
    return NextResponse.json({ slots: [] });
  }

  // Openingstijden voor deze weekdag.
  const day = OPENING_HOURS[weekdayOf(dateParam)];
  if (!day?.open || !day?.close) {
    return NextResponse.json({ slots: [], closed: true });
  }
  const openMin = minutesFromHHMM(day.open);
  const closeMin = minutesFromHHMM(day.close);

  // Bezet: alle actieve afspraken die overlappen met [dagstart, dagstart+24h).
  const dayStartISO = wallClockToUtc(dateParam, 0).toISOString();
  const dayEndISO = wallClockToUtc(addDays(dateParam, 1), 0).toISOString();
  const { data: bookedRows, error: bookedError } = await supabase
    .from('appointments')
    .select('start_time, end_time')
    .eq('barber_id', barberId)
    .in('status', ['pending', 'confirmed'])
    .lt('start_time', dayEndISO)
    .gt('end_time', dayStartISO);

  if (bookedError) {
    return NextResponse.json({ error: 'Kon beschikbaarheid niet laden' }, { status: 500 });
  }

  const busy = (bookedRows ?? []).map((a) => ({
    start: new Date(a.start_time).getTime(),
    end: new Date(a.end_time).getTime(),
  }));

  const earliest = Date.now() + MIN_LEAD_MINUTES * 60_000;
  const slots: string[] = [];

  for (let m = openMin; m + durationMin <= closeMin; m += SLOT_STEP_MINUTES) {
    const start = wallClockToUtc(dateParam, m);
    const end = new Date(start.getTime() + durationMin * 60_000);

    if (start.getTime() < earliest) continue;
    if (busy.some((b) => start.getTime() < b.end && end.getTime() > b.start)) continue;

    slots.push(hhmmFromMinutes(m));
  }

  return NextResponse.json({ slots, closed: false });
}
