/**
 * Temporärer Datenbank-Contract.
 * Ersetzt die via Supabase CLI generierten Typen, bis Projektzugang für
 * `supabase gen types` verfügbar ist.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      countdown_settings: {
        Row: {
          id: string;
          event_key: string;
          target_timestamp: string;
          label: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_key: string;
          target_timestamp: string;
          label?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_key?: string;
          target_timestamp?: string;
          label?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          starts_at: string;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          starts_at: string;
          location?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          starts_at?: string;
          location?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_media: {
        Row: {
          id: string;
          title: string;
          caption: string | null;
          storage_path: string;
          width: number | null;
          height: number | null;
          taken_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          caption?: string | null;
          storage_path: string;
          width?: number | null;
          height?: number | null;
          taken_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          caption?: string | null;
          storage_path?: string;
          width?: number | null;
          height?: number | null;
          taken_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      registrations: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          birth_year: number | null;
          distance: "5km" | "10km" | "15km" | "kids";
          start_block: "A" | "B" | "C" | null;
          shirt_size: "XS" | "S" | "M" | "L" | "XL" | null;
          emergency_contact: string | null;
          emergency_phone: string | null;
          message: string | null;
          privacy_consent: boolean;
          photo_consent: boolean;
          terms_consent: boolean;
          payment_status: "pending" | "paid" | "cancelled";
          stripe_checkout_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          birth_year?: number | null;
          distance: "5km" | "10km" | "15km" | "kids";
          start_block?: "A" | "B" | "C" | null;
          shirt_size?: "XS" | "S" | "M" | "L" | "XL" | null;
          emergency_contact?: string | null;
          emergency_phone?: string | null;
          message?: string | null;
          privacy_consent: boolean;
          photo_consent: boolean;
          terms_consent: boolean;
          payment_status?: "pending" | "paid" | "cancelled";
          stripe_checkout_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          birth_year?: number | null;
          distance?: "5km" | "10km" | "15km" | "kids";
          start_block?: "A" | "B" | "C" | null;
          shirt_size?: "XS" | "S" | "M" | "L" | "XL" | null;
          emergency_contact?: string | null;
          emergency_phone?: string | null;
          message?: string | null;
          privacy_consent?: boolean;
          photo_consent?: boolean;
          terms_consent?: boolean;
          payment_status?: "pending" | "paid" | "cancelled";
          stripe_checkout_session_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      results_2026: {
        Row: {
          id: string;
          rank: number;
          bib_number: string;
          name: string;
          team: string | null;
          distance: string;
          time_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          rank: number;
          bib_number: string;
          name: string;
          team?: string | null;
          distance: string;
          time_seconds: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          rank?: number;
          bib_number?: string;
          name?: string;
          team?: string | null;
          distance?: string;
          time_seconds?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type SupabaseTables = Database["public"]["Tables"];
export type SupabaseTableName = keyof SupabaseTables;
