const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function getAssetUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/assets/${path}`;
}

export function getGalleryUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/gallery/${path}`;
}
