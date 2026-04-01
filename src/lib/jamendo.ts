const CLIENT_ID = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID || "";
const BASE_URL = "https://api.jamendo.com/v3.0";

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  duration: number;
  audio: string;
  image: string;
}

const GENRE_TAGS: Record<string, string> = {
  lofi: "lofi+chillhop",
  electronic: "electronic+chillout",
  piano: "piano+instrumental",
  ambient: "ambient+relaxing",
  nature: "nature+meditation",
};

const cache: Record<string, JamendoTrack[]> = {};

export async function fetchTracksByGenre(
  genre: string,
  limit = 10
): Promise<JamendoTrack[]> {
  const cacheKey = genre === "all" ? "all" : genre;
  if (cache[cacheKey]?.length) return cache[cacheKey];

  const tags = genre === "all" ? "chillout+relaxing" : GENRE_TAGS[genre] || genre;
  const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${tags}&order=popularity_total&audioformat=mp31`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const tracks: JamendoTrack[] = (data.results || []).map(
      (t: Record<string, unknown>) => ({
        id: String(t.id),
        name: String(t.name),
        artist_name: String(t.artist_name),
        duration: Number(t.duration),
        audio: String(t.audio),
        image: String(t.image),
      })
    );
    cache[cacheKey] = tracks;
    return tracks;
  } catch {
    return [];
  }
}

export function getRandomTrack(tracks: JamendoTrack[]): JamendoTrack | null {
  if (!tracks.length) return null;
  return tracks[Math.floor(Math.random() * tracks.length)];
}
