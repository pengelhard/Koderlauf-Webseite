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
          date: string;
          location: string;
          description: string | null;
          max_participants: number | null;
          registration_open: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          date: string;
          location: string;
          description?: string | null;
          max_participants?: number | null;
          registration_open?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          date?: string;
          location?: string;
          description?: string | null;
          max_participants?: number | null;
          registration_open?: boolean;
          created_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          event_id: string;
          first_name: string;
          last_name: string;
          email: string;
          bib_number: number | null;
          category: string;
          paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          first_name: string;
          last_name: string;
          email: string;
          bib_number?: number | null;
          category?: string;
          paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          bib_number?: number | null;
          category?: string;
          paid?: boolean;
          created_at?: string;
        };
      };
      results: {
        Row: {
          id: string;
          event_id: string;
          participant_id: string;
          finish_time: string;
          rank: number | null;
          category_rank: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          participant_id: string;
          finish_time: string;
          rank?: number | null;
          category_rank?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          participant_id?: string;
          finish_time?: string;
          rank?: number | null;
          category_rank?: number | null;
          created_at?: string;
        };
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
        Update: {
          id?: string;
          event_id?: string;
          url?: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          photographer?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
