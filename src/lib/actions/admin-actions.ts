'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled' | 'completed') {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/afspraken');
  revalidatePath('/dashboard');
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/afspraken');
  revalidatePath('/dashboard');
}
