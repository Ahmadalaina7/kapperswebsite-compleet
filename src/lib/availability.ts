// Openingstijden (0 = zondag ... 6 = zaterdag), lokale tijd Europe/Amsterdam.
export const OPENING_HOURS: Record<number, { open: string | null; close: string | null }> = {
  0: { open: null, close: null },        // zondag: gesloten
  1: { open: '09:00', close: '17:30' },  // maandag
  2: { open: '09:00', close: '17:30' },  // dinsdag
  3: { open: '09:00', close: '17:30' },  // woensdag
  4: { open: '09:00', close: '17:30' },  // donderdag
  5: { open: '09:00', close: '17:30' },  // vrijdag
  6: { open: '09:00', close: '16:30' },  // zaterdag
};

export const SLOT_STEP_MINUTES = 30;
export const MIN_LEAD_MINUTES = 60;   // minimaal 1 uur vooruit boeken
export const MAX_DAYS_AHEAD = 30;

export function minutesFromHHMM(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function hhmmFromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
