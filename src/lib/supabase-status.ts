/**
 * Detecteert of Supabase echt geconfigureerd is.
 * Het project template bevat placeholder waarden (YOUR_PROJECT...);
 * in dat geval draait de site in demo-modus met lokale data.
 */
export function supabaseStatus(): { configured: boolean; demo: boolean } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const placeholder = /YOUR_PROJECT|YOUR_/i.test(url) || /YOUR_/i.test(key);
  const configured = Boolean(url && key) && !placeholder;
  return { configured, demo: !configured };
}

export const DEMO_BARBER = {
  id: 'demo-fikri',
  name: 'Fikri',
  slug: 'fikri',
  active: true,
  specialty: 'Eigenaar & barber',
  experience_years: 12,
};
