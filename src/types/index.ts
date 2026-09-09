export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      barbers: {
        Row: { id: string; name: string; slug: string; active: boolean; specialty: string | null; experience_years: number | null; created_at: string };
        Insert: { id?: string; name: string; slug: string; active?: boolean; specialty?: string | null; experience_years?: number | null; created_at?: string };
        Update: { id?: string; name?: string; slug?: string; active?: boolean; specialty?: string | null; experience_years?: number | null; created_at?: string };
      };
      services: {
        Row: { id: string; name: string; description: string | null; duration_min: number; price_cents: number; active: boolean; created_at: string };
        Insert: { id?: string; name: string; description?: string | null; duration_min: number; price_cents: number; active?: boolean; created_at?: string };
        Update: { id?: string; name?: string; description?: string | null; duration_min?: number; price_cents?: number; active?: boolean; created_at?: string };
      };
      barber_services: {
        Row: { barber_id: string; service_id: string };
        Insert: { barber_id: string; service_id: string };
        Update: { barber_id?: string; service_id?: string };
      };
      appointments: {
        Row: {
          id: string;
          barber_id: string;
          service_id: string;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          start_time: string;
          end_time: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          service_id: string;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          start_time: string;
          end_time: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          service_id?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          start_time?: string;
          end_time?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}
