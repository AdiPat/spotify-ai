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
import { Data } from "../data";

export class SpotifyAI {
  private api: SpotifyApi;
  private verbose: boolean;

  private static DEFAULT_LIMIT = 5;

  constructor(options?: SpotifyAIOptions) {
    options = options || {};

    this.verbose = options.verbose == undefined ? false : options.verbose;

    if (!options.clientId || !options.clientSecret) {
      if (this.verbose) {
        console.error(
          "SpotifyAI: Client ID and Client Secret not provided. Using environment variables."
        );
      }

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

    if (this.verbose) {
      console.log("SpotifyAI: Initialized.");
    }
  }

  /**
   * Generate genre seeds from a natural language description.
   *
   * @param description Natural language description of track.
   * @returns Genre seeds and empty list if generation failed.
   *
   */
  public async generateGenreSeeds(description: string): Promise<string[]> {
    try {
      const detectedGenreSeeds = [];

      const { object } = await Utils.generateObject<{
        detectedGenreSeeds: string[];
      }>({
        schema: z.object({
          detectedGenreSeeds: z.array(z.string()),
        }),
        schemaName: "DetectedGenreSeeds",
        prompt: `Generate genre seeds for the description "${description}"`,
        system: `You are a Spotify AI agent that does advanced music analysis. You have access to all the data on Spotify. 
          You are given the list of genres and descriptions that are available on Spotify.
          You need to generate genre seeds from the given list based on the description.
          Genres: ${JSON.stringify(Data.GenreMetadata)}`,
      });

      if (this.verbose) {
        console.log(
          "generateGenreSeeds: Detected genre seeds: ",
          object.detectedGenreSeeds
        );
      }

      if (!object.detectedGenreSeeds) {
        if (this.verbose) {
          console.error("generateGenreSeeds: Failed to generate genre seeds.");
        }
        return [];
      }

      const genresAvailable = Data.GenreSeeds;

      for (const genreSeed of object.detectedGenreSeeds) {
        if (genresAvailable.includes(genreSeed)) {
          detectedGenreSeeds.push(genreSeed);
        } else {
          if (this.verbose) {
            console.error(
              `generateGenreSeeds: Genre seed "${genreSeed}" not available.`
            );
          }
        }
      }

      return detectedGenreSeeds;
    } catch (error) {
      if (this.verbose) {
        console.error(
          "generateGenreSeeds: Failed to generate genre seeds.",
          error
        );
      }

      return [];
    }
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
            seed_genres: z.array(z.string()),
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
      if (this.verbose) {
        console.log(
          "generateRecommendationParams: generation of object failed",
          error
        );
      }

      return null;
    }
  }

  /**
   *
   * Natural language search for tracks matching the description.
   *
   * @param description Natural language description of track.
   * @param options Options for natural language search.
   * @returns Tracks matching the description or null if failed.
   */
  public async naturalLanguageSearch(
    description: string,
    options?: NaturalLanguageSearchOptions
  ): Promise<Track[]> {
    options = options || { limit: SpotifyAI.DEFAULT_LIMIT, printResults: true };

    if (!options.limit) {
      options.limit = SpotifyAI.DEFAULT_LIMIT;
    }

    let recommendationsParams = await this.generateRecommendationParams(
      description
    );

    recommendationsParams.limit = options.limit;

    if (!recommendationsParams) {
      if (this.verbose) {
        console.error(
          "naturalLanguageSearch: Failed to generate recommendations params."
        );
      }
      return;
    }

    if (this.verbose) {
      console.log(
        "naturalLanguageSearch: Recommendations Params: ",
        recommendationsParams
      );
    }

    let recommendations = await this.api.recommendations
      .get(recommendationsParams)
      .catch((error) => {
        if (this.verbose) {
          console.error(
            "naturalLanguageSearch: Error getting recommendations",
            error
          );
        }
        return null;
      });

    if (!recommendations) {
      console.error("naturalLanguageSearch: Failed to get recommendations.");
      return [];
    }

    if (this.verbose) {
      console.log(
        "naturalLanguageSearch: Recommendations count: ",
        recommendations.tracks.length,
        " | Options.limit:",
        options.limit
      );
    }

    while (recommendations.tracks.length < options.limit) {
      if (this.verbose) {
        console.log(
          "naturalLanguageSearch: Getting more recommendations to reach limit."
        );
        console.log(
          "naturalLanguageSearch: Current recommendations count: ",
          recommendations.tracks.length
        );
      }

      recommendationsParams = await this.generateRecommendationParams(
        description
      );

      const moreRecommendations = await this.api.recommendations.get(
        recommendationsParams
      );

      recommendations.tracks = recommendations.tracks.concat(
        moreRecommendations.tracks
      );
    }

    if (options.printResults) {
      const printableTracks = recommendations.tracks.map((track: Track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => artist.name).join(", "),
        url: track.external_urls.spotify,
      }));

      const uniquePrintableTracks = printableTracks.filter(
        (track: any, index: number, self: any) =>
          index ===
          self.findIndex((t: any) => t.id === track.id && t.name === track.name)
      );

      console.table(uniquePrintableTracks);
    }

    return recommendations.tracks;
  }
}
