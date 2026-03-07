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
      participants: {
        Row: {
          id: string;
          user_id: string | null;
          vorname: string;
          nachname: string;
          email: string;
          geburtstag: string | null;
          verein: string | null;
          tshirt_size: string | null;
          distanz: string;
          startnummer: number | null;
          startgebuehr_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          vorname: string;
          nachname: string;
          email: string;
          geburtstag?: string | null;
          verein?: string | null;
          tshirt_size?: string | null;
          distanz: string;
          startnummer?: number | null;
          startgebuehr_paid?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["participants"]["Insert"]>;
      };
      results: {
        Row: {
          id: string;
          startnummer: number | null;
          zeit: string | null;
          platz_gesamt: number | null;
          platz_ak: number | null;
          distanz: string | null;
          jahr: number;
        };
        Insert: {
          id?: string;
          startnummer?: number | null;
          zeit?: string | null;
          platz_gesamt?: number | null;
          platz_ak?: number | null;
          distanz?: string | null;
          jahr?: number;
        };
        Update: Partial<Database["public"]["Tables"]["results"]["Insert"]>;
      };
      gallery_photos: {
        Row: {
          id: string;
          storage_path: string;
          uploader_id: string | null;
          distanz: string | null;
          beschreibung: string | null;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          storage_path: string;
          uploader_id?: string | null;
          distanz?: string | null;
          beschreibung?: string | null;
          approved?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_photos"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
