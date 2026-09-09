import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types';

/**
 * Supabase client voor server componenten die dezelfde anon-rechten
 * hebben als de browser. Cookies worden hier alleen gelezen (niet
 * geschreven), dus dit is veilig zonder een route- of response-context.
 */
export async function createServerReadClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component: cookies mogen hier niet gezet worden.
            // De browser client zet ze zodra de pagina gehydrateerd is.
          }
        },
      },
    }
  );
}
