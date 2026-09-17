export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Live-Schema (neues Projekt `rrhcoelbplyiwczzkrjl`):
 * `sponsors` + `fassjagd_state`. Anmeldung/Teilnehmer bleiben bei Race Result.
 * Die alten Tabellen-Typen (participants/results/gallery_photos) sind nur noch
 * für Demo-Fallbacks im Data-Layer – sie werden auf dem neuen Projekt nicht angelegt.
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
      fassjagd_state: {
        Row: {
          id: number;
          overrides: Json;
          updated_at: string;
        };
        Insert: {
          id?: number;
          overrides?: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fassjagd_state"]["Insert"]>;
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
