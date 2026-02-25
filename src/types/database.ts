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
      events: {
        Row: {
          id: string;
          name: string;
          slug: string;
          date: string;
          location: string;
          description: string | null;
          max_participants_5km: number | null;
          max_participants_10km: number | null;
          max_participants_kids: number | null;
          registration_open: boolean;
          early_bird_deadline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          date: string;
          location: string;
          description?: string | null;
          max_participants_5km?: number | null;
          max_participants_10km?: number | null;
          max_participants_kids?: number | null;
          registration_open?: boolean;
          early_bird_deadline?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      participants: {
        Row: {
          id: string;
          event_id: string;
          first_name: string;
          last_name: string;
          email: string;
          birth_date: string;
          gender: "M" | "W" | "D";
          distance: "5km" | "10km" | "kids";
          club: string | null;
          tshirt_size: string;
          emergency_contact_name: string;
          emergency_contact_phone: string;
          photo_consent: boolean;
          privacy_accepted: boolean;
          bib_number: number | null;
          startgebuehr_paid: boolean;
          stripe_session_id: string | null;
          price_cents: number;
          price_tier: "early_bird" | "normal" | "nachmeldung";
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          first_name: string;
          last_name: string;
          email: string;
          birth_date: string;
          gender: "M" | "W" | "D";
          distance: "5km" | "10km" | "kids";
          club?: string | null;
          tshirt_size: string;
          emergency_contact_name: string;
          emergency_contact_phone: string;
          photo_consent?: boolean;
          privacy_accepted: boolean;
          bib_number?: number | null;
          startgebuehr_paid?: boolean;
          stripe_session_id?: string | null;
          price_cents: number;
          price_tier: "early_bird" | "normal" | "nachmeldung";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["participants"]["Insert"]>;
      };
      results: {
        Row: {
          id: string;
          event_id: string;
          participant_id: string;
          finish_time: string;
          rank: number | null;
          category_rank: number | null;
          distance: "5km" | "10km" | "kids";
          age_class: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          participant_id: string;
          finish_time: string;
          rank?: number | null;
          category_rank?: number | null;
          distance: "5km" | "10km" | "kids";
          age_class?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["results"]["Insert"]>;
      };
      gallery_images: {
        Row: {
          id: string;
          event_id: string;
          url: string;
          thumbnail_url: string | null;
          caption: string | null;
          photographer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          url: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          photographer?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_images"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      distance_type: "5km" | "10km" | "kids";
      gender_type: "M" | "W" | "D";
      price_tier_type: "early_bird" | "normal" | "nachmeldung";
    };
  };
}
