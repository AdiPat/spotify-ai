import dotenv from "dotenv";

dotenv.config();

import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { Utils } from "../common";
import {
  NaturalLanguageSearchOptions,
  RecommendationsParams,
  SpotifyAIOptions,
} from "../models";
import { z } from "zod";

export class SpotifyAI {
  private api: SpotifyApi;

  private static DEFAULT_LIMIT = 5;

  constructor(options?: SpotifyAIOptions) {
    options = options || {};

    if (!options.clientId || !options.clientSecret) {
      console.error(
        "SpotifyAI: Client ID and Client Secret not provided. Using environment variables."
      );

      this.api = SpotifyApi.withClientCredentials(
        process.env.SPOTIFY_CLIENT_ID,
        process.env.SPOTIFY_CLIENT_SECRET
      );
    } else {
      this.api = SpotifyApi.withClientCredentials(
        options.clientId,
        options.clientSecret
      );
    }

    console.log("SpotifyAI: Initialized.");
  }

  /**
   * Generate recommendation parameters for a given natural language description of track.
   *
   * @param description Natural language description of track.
   * @returns Recommendations parameters and null if generation failed.
   *
   */
  private async generateRecommendationParams(
    description: string
  ): Promise<RecommendationsParams> {
    try {
      const { object: recommendationsParams } =
        await Utils.generateObject<RecommendationsParams>({
          schema: z.object({
            seed_genres: z.string(),
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

  public async naturalLanguageSearch(
    description: string,
    options?: NaturalLanguageSearchOptions
  ): Promise<Track[]> {
    options = options || { limit: SpotifyAI.DEFAULT_LIMIT, printResults: true };

    const recommendationsParams = await this.generateRecommendationParams(
      description
    );

    recommendationsParams.limit = options.limit;

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

    const recommendations = await this.api.recommendations.get(
      recommendationsParams
    );

    if (options.printResults) {
      const printableTracks = recommendations.tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => artist.name).join(", "),
        url: track.external_urls.spotify,
      }));

      console.table(printableTracks);
    }

    return recommendations.tracks;
  }
}
