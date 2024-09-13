import { Utils } from "../common";
import { Data } from "../data";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { GenreMetadata } from "../models";

async function generateOneGenreMetadata(
  genre: string
): Promise<GenreMetadata | null> {
  try {
    const { object: genreMetadata } = await Utils.generateObject<GenreMetadata>(
      {
        schema: z.object({
          genre: z.string(),
          description: z.string(),
          subgenres: z.array(z.string()),
          instruments: z.array(z.string()),
          rhythms: z.array(z.string()),
          lyricThemes: z.array(z.string()),
          timePeriods: z.string(),
          regions: z.array(z.string()),
          mood: z.string(),
          popularity: z.number(),
        }),
        schemaName: "GenreMetadata",
        prompt: `Generate metadata for the genre "${genre}"`,
        system:
          "You are a Spotify AI agent that does advanced music analysis. You have access to all the data on Spotify.",
      }
    );

    return genreMetadata;
  } catch (error) {
    console.log("generateOneGenreMetadata: generation of object failed", error);
    return null;
  }
}

async function generateGenreMetadata() {
  const genres = Data.GenreSeeds;

  const genreMetadata: GenreMetadata[] = await Promise.all(
    genres.map(async (genre) => generateOneGenreMetadata(genre))
  );

  const filteredMetadata = genreMetadata.filter(Boolean); // Remove null values
  const jsonContent = JSON.stringify(filteredMetadata, null, 2);

  try {
    await writeFile("./genre-metadata.json", jsonContent);
    console.log("Genre metadata written to genre-metadata.json");
  } catch (error) {
    console.error("Error writing genre metadata to file", error);
  }
}

generateGenreMetadata()
  .then(() => {
    console.log("Genre metadata generation complete.");
  })
  .catch((error) => {
    console.error("Error generating genre metadata.", error);
  });
