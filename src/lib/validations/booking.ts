import { z } from 'zod';

export const bookingSchema = z.object({
  service_id: z.string().uuid('Kies een geldige dienst'),
  client_name: z.string().trim().min(2, 'Vul je volledige naam in'),
  client_email: z.string().trim().email('Vul een geldig e-mailadres in'),
  client_phone: z.string().trim().optional().nullable(),
  start_time: z
    .string()
    .refine((val) => !Number.isNaN(new Date(val).getTime()), 'Ongeldige starttijd')
    .refine(
      (val) => new Date(val).getTime() > Date.now() + 30 * 60 * 1000,
      'Kies een starttijd die minimaal 30 minuten in de toekomst ligt'
    ),
  notes: z.string().max(500, 'Maximaal 500 tekens').optional().nullable(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
