import { createClient } from "@/lib/supabase/client";
import { getGalleryUrl } from "@/lib/supabase/storage";
import { DEMO_GALLERY } from "./demo-data";

export type GalleryImage = {
  id: string;
  url: string;
  beschreibung: string | null;
  distanz: string | null;
};

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("gallery_photos")
      .select("id, storage_path, beschreibung, distanz")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return DEMO_GALLERY;

    return (data as { id: string; storage_path: string; beschreibung: string | null; distanz: string | null }[]).map((img) => ({
      id: img.id,
      url: getGalleryUrl(img.storage_path),
      beschreibung: img.beschreibung,
      distanz: img.distanz,
    }));
  } catch {
    return DEMO_GALLERY;
  }
}
