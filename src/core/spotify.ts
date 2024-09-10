import dotenv from "dotenv";

dotenv.config();

import { SpotifyApi } from "@spotify/web-api-ts-sdk";

console.log("Searching Spotify for The Beatles...");

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error(
    "Please provide SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your environment."
  );
  process.exit(1);
}

const api = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET
);

export async function printSearchResults() {
  const items = await api.search("The Beatles", ["artist"]);

  console.table(
    items.artists.items.map((item) => ({
      name: item.name,
      followers: item.followers.total,
      popularity: item.popularity,
    }))
  );
}
