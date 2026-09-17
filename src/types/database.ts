export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Hinweis zum Schema:
 * Die Init-Migration (`supabase/migrations/20260225_init_schema.sql`) beschreibt
 * events / participants / results / gallery_images in einem älteren Entwurf.
 * Die TypeScript-Typen und die Data-Layer-Queries nutzen abweichende Spalten
 * (vorname/nachname, gallery_photos, results.jahr). Live laufen Anmeldung und
 * Teilnehmerlisten über Race Result, nicht über diese Tabellen.
 *
 * `sponsors` (Migration 20260917) ist die geplante Orga-Stammdaten-Tabelle;
 * das PDF fällt auf Code-Daten zurück, solange die Tabelle leer ist oder fehlt.
 */
export interface Database {
  public: {
    Tables: {
      sponsors: {
        Row: {
          id: string;
          year: number;
          firma: string;
          ort: string | null;
          adresse: string | null;
          ansprechpartner: string | null;
          email: string | null;
          telefon: string | null;
          social_media: string | null;
          website: string | null;
          links: string[] | null;
          logo_path: string | null;
          hauptsponsor: boolean;
          invert_in_light_mode: boolean;
          sort_order: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          firma: string;
          ort?: string | null;
          adresse?: string | null;
          ansprechpartner?: string | null;
          email?: string | null;
          telefon?: string | null;
          social_media?: string | null;
          website?: string | null;
          links?: string[] | null;
          logo_path?: string | null;
          hauptsponsor?: boolean;
          invert_in_light_mode?: boolean;
          sort_order?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sponsors"]["Insert"]>;
      };
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
