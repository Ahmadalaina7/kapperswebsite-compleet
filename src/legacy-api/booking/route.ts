import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseStatus } from '@/lib/supabase-status';
import { bookingSchema } from '@/lib/validations/booking';
import { z } from 'zod';

type ServiceRow = { id: string; name: string; duration_min: number; price_cents: number };
type BarberRow = { id: string; name: string };

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  // Demo-modus: zonder database accepteren we de boeking met een soepelere
  // validatie (demo-id's zijn geen UUID's) en sturen we de gebruiker naar de
  // bevestigingspagina (geen e-mail, geen opslag).
  if (supabaseStatus().demo) {
    const demoParsed = bookingSchema
      .extend({
        service_id: z.string().min(1, 'Kies een geldige dienst'),
      })
      .safeParse(body);
    if (!demoParsed.success) {
      return NextResponse.json(
        { error: demoParsed.error.errors[0]?.message ?? 'Ongeldige gegevens' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, demo: true });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Ongeldige gegevens' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const d = parsed.data;

  // Service ophalen voor duur en naam.
  const { data: service } = await supabase
    .from('services')
    .select('id, name, duration_min, price_cents')
    .eq('id', d.service_id)
    .eq('active', true)
    .maybeSingle<ServiceRow>();

  if (!service) {
    return NextResponse.json({ error: 'Deze dienst bestaat niet (meer).' }, { status: 400 });
  }

  // Eenmanszaak: de enige actieve kapper is Fikri.
  const { data: barber } = await supabase
    .from('barbers')
    .select('id, name')
    .eq('active', true)
    .limit(1)
    .maybeSingle<BarberRow>();

  if (!barber) {
    return NextResponse.json({ error: 'Deze kapper is niet (meer) beschikbaar.' }, { status: 400 });
  }

  const start = new Date(d.start_time);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: 'Ongeldige starttijd.' }, { status: 400 });
  }

  const end = new Date(start.getTime() + service.duration_min * 60_000);

  // Harde overlap-check vlak voor het inserten (tegen race conditions).
  const { data: overlapping } = await supabase
    .from('appointments')
    .select('id')
    .eq('barber_id', barber.id)
    .in('status', ['pending', 'confirmed'])
    .lt('start_time', end.toISOString())
    .gt('end_time', start.toISOString())
    .limit(1);

  if (overlapping && overlapping.length > 0) {
    return NextResponse.json(
      { error: 'Dit tijdslot is net bezet geraakt. Kies een ander moment.' },
      { status: 409 }
    );
  }

  const { error: insertError } = await supabase.from('appointments').insert({
    barber_id: barber.id,
    service_id: d.service_id,
    client_name: d.client_name,
    client_email: d.client_email,
    client_phone: d.client_phone || null,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    status: 'confirmed',
    notes: d.notes || null,
  });

  if (insertError) {
    console.error('Boeking mislukt:', insertError);
    return NextResponse.json(
      { error: 'Boeking mislukt. Probeer het opnieuw.' },
      { status: 500 }
    );
  }

  // Bevestigingsmail (faalt stil, boeking staat al vast).
  try {
    const { sendBookingConfirmationEmail } = await import('@/lib/email');
    await sendBookingConfirmationEmail({
      to: d.client_email,
      barberName: barber.name,
      serviceName: service.name,
      start: start.toISOString(),
      end: end.toISOString(),
      clientName: d.client_name,
    });
  } catch (err) {
    console.error('E-mail verzenden mislukt:', err);
  }

  return NextResponse.json({ success: true });
}
