import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_TARGET = "2027-05-08T08:30:00.000Z";
const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2JyBmaWxsPScjMGEwYTBhJy8+PC9zdmc+";

export interface CountdownSettings {
  targetTimestamp: string;
  label: string | null;
}

export interface ResultEntry {
  id: string;
  rank: number;
  bibNumber: string;
  name: string;
  team: string | null;
  distance: string;
  timeSeconds: number;
}

export interface GalleryEntry {
  id: string;
  title: string;
  caption: string | null;
  imageUrl: string;
  width: number;
  height: number;
  blurDataUrl: string;
}

const fallbackResults: ResultEntry[] = [
  {
    id: "demo-1",
    rank: 1,
    bibNumber: "114",
    name: "Lena Baum",
    team: "TSV Obermögersheim",
    distance: "10km",
    timeSeconds: 2292,
  },
  {
    id: "demo-2",
    rank: 2,
    bibNumber: "052",
    name: "Jonas Fuchs",
    team: "Trail Crew",
    distance: "10km",
    timeSeconds: 2347,
  },
  {
    id: "demo-3",
    rank: 1,
    bibNumber: "079",
    name: "Emil Winter",
    team: "Laufclub Altmühl",
    distance: "5km",
    timeSeconds: 1188,
  },
  {
    id: "demo-4",
    rank: 2,
    bibNumber: "165",
    name: "Mia Haas",
    team: "Forest Pace",
    distance: "5km",
    timeSeconds: 1250,
  },
];

const fallbackGallery: GalleryEntry[] = [
  {
    id: "gallery-demo-1",
    title: "Startschuss im Morgendunst",
    caption: "Volle Energie auf den ersten Metern.",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
    width: 900,
    height: 1200,
    blurDataUrl: DEFAULT_BLUR_DATA_URL,
  },
  {
    id: "gallery-demo-2",
    title: "Trail im Forst",
    caption: "Kurven, Wurzeln, Geschwindigkeit.",
    imageUrl: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=900&q=80",
    width: 900,
    height: 1200,
    blurDataUrl: DEFAULT_BLUR_DATA_URL,
  },
  {
    id: "gallery-demo-3",
    title: "Zielsprint",
    caption: "Die letzten Meter zählen doppelt.",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    width: 900,
    height: 1200,
    blurDataUrl: DEFAULT_BLUR_DATA_URL,
  },
  {
    id: "gallery-demo-4",
    title: "Community Vibes",
    caption: "Support entlang der Strecke.",
    imageUrl: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=80",
    width: 900,
    height: 1200,
    blurDataUrl: DEFAULT_BLUR_DATA_URL,
  },
  {
    id: "gallery-demo-5",
    title: "Kids Run",
    caption: "Die Zukunft des Koderlaufs.",
    imageUrl: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=900&q=80",
    width: 900,
    height: 1200,
    blurDataUrl: DEFAULT_BLUR_DATA_URL,
  },
];

function resolveStorageReference(storagePath: string) {
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return { bucket: null, path: storagePath };
  }

  if (storagePath.includes("::")) {
    const [bucket, ...pathParts] = storagePath.split("::");
    return { bucket: bucket || "gallery", path: pathParts.join("::") };
  }

  const [first, ...rest] = storagePath.split("/");
  if (rest.length > 0 && ["gallery", "koderlauf-gallery", "media"].includes(first)) {
    return { bucket: first, path: rest.join("/") };
  }

  return { bucket: "gallery", path: storagePath };
}

export async function getCountdownSettings(eventKey = "koderlauf-2027"): Promise<CountdownSettings> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("countdown_settings")
      .select("target_timestamp,label")
      .eq("event_key", eventKey)
      .maybeSingle();

    return {
      targetTimestamp: data?.target_timestamp ?? DEFAULT_TARGET,
      label: data?.label ?? "Bis zum Start",
    };
  } catch {
    return {
      targetTimestamp: DEFAULT_TARGET,
      label: "Bis zum Start",
    };
  }
}

export async function getResults2026(): Promise<ResultEntry[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("results_2026")
      .select("id,rank,bib_number,name,team,distance,time_seconds")
      .order("distance", { ascending: true })
      .order("rank", { ascending: true });

    if (error || !data || data.length === 0) return fallbackResults;

    return data.map((row) => ({
      id: row.id,
      rank: row.rank,
      bibNumber: row.bib_number,
      name: row.name,
      team: row.team,
      distance: row.distance,
      timeSeconds: row.time_seconds,
    }));
  } catch {
    return fallbackResults;
  }
}

export async function getGalleryEntries(): Promise<GalleryEntry[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("gallery_media")
      .select("id,title,caption,storage_path,width,height")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return fallbackGallery;

    return data.map((row) => {
      const resolved = resolveStorageReference(row.storage_path);
      const imageUrl = resolved.bucket
        ? supabase.storage.from(resolved.bucket).getPublicUrl(resolved.path).data.publicUrl
        : resolved.path;

      return {
        id: row.id,
        title: row.title,
        caption: row.caption,
        imageUrl,
        width: row.width ?? 900,
        height: row.height ?? 1200,
        blurDataUrl: DEFAULT_BLUR_DATA_URL,
      };
    });
  } catch {
    return fallbackGallery;
  }
}
