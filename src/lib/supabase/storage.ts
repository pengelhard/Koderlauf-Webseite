import { SUPABASE_PROJECT_URL, supabaseUrl } from "@/lib/supabase/env";

function baseUrl(): string {
  return supabaseUrl() || SUPABASE_PROJECT_URL;
}

export function getAssetUrl(path: string): string {
  return `${baseUrl()}/storage/v1/object/public/assets/${path}`;
}

export function getGalleryUrl(path: string): string {
  return `${baseUrl()}/storage/v1/object/public/gallery/${path}`;
}
