import { createClient } from "@/lib/supabase/client";
import { DEMO_GALLERY } from "./demo-data";

export type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  photographer: string | null;
};

export async function getGalleryImages(
  eventSlug: string = "koderlauf-2026"
): Promise<GalleryImage[]> {
  try {
    const supabase = createClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", eventSlug)
      .single();

    if (eventError || !event) return DEMO_GALLERY;

    const eventId = (event as { id: string }).id;

    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, url, caption, photographer")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return DEMO_GALLERY;
    return data as GalleryImage[];
  } catch {
    return DEMO_GALLERY;
  }
}
