import dotenv from "dotenv";

dotenv.config();

import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Utils } from "../common";
import { RecommendationsParams } from "../models";
import { z } from "zod";

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

async function generateRecommendationParams(
  description: string
): Promise<RecommendationsParams> {
  try {
    const { object: recommendationsParams } =
      await Utils.generateObject<RecommendationsParams>({
        schema: z.object({
          seed_artists: z.string(),
          seed_genres: z.string(),
          seed_tracks: z.string(),

          limit: z.number(),
          market: z.string(),

          min_acousticness: z.number(),
          max_acousticness: z.number(),
          target_acousticness: z.number(),

          min_danceability: z.number(),
          max_danceability: z.number(),
          target_danceability: z.number(),

          min_duration_ms: z.number(),
          max_duration_ms: z.number(),
          target_duration_ms: z.number(),

          min_energy: z.number(),
          max_energy: z.number(),
          target_energy: z.number(),

          min_instrumentalness: z.number(),
          max_instrumentalness: z.number(),
          target_instrumentalness: z.number(),

          min_key: z.number(),
          max_key: z.number(),
          target_key: z.number(),

          min_liveness: z.number(),
          max_liveness: z.number(),
          target_liveness: z.number(),

          min_loudness: z.number(),
          max_loudness: z.number(),
          target_loudness: z.number(),

          min_mode: z.number(),
          max_mode: z.number(),
          target_mode: z.number(),

          min_popularity: z.number(),
          max_popularity: z.number(),
          target_popularity: z.number(),

          min_speechiness: z.number(),
          max_speechiness: z.number(),
          target_speechiness: z.number(),

          min_tempo: z.number(),
          max_tempo: z.number(),
          target_tempo: z.number(),

          min_valence: z.number(),
          max_valence: z.number(),
          target_valence: z.number(),
        }),
        schemaName: "RecommendationsParams",
        prompt: `Generate recommendation parameters for the description "${description}"`,
        system:
          "You are a Spotify AI agent that does advanced music analysis. You have access to all the data on Spotify.",
      });

    return recommendationsParams;
  } catch (error) {
    console.log(
      "generateRecommendationParams: generation of object failed",
      error
    );
    return null;
  }
}

export async function naturalLanguageSearch(
  description: string
): Promise<void> {
  const recommendationsParams = await generateRecommendationParams(description);

  if (!recommendationsParams) {
    console.error(
      "naturalLanguageSearch: Failed to generate recommendations params."
    );
    return;
  }

  console.log(
    "naturalLanguageSearch: Recommendations Params: ",
    recommendationsParams
  );

  const recommendations = await api.recommendations.get(recommendationsParams);

  const tracks = recommendations.tracks.map((track) => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
  }));

  console.table(tracks);
}
