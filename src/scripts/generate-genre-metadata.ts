import dotenv from "dotenv";

dotenv.config();

import { Utils } from "../common";
import { Data } from "../data";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { GenreMetadata } from "../models";

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadGenreMetadata(): Promise<GenreMetadata[]> {
  try {
    const genreMetadata = require("../genre-metadata.json");
    return genreMetadata;
  } catch (error) {
    console.error("Error loading genre metadata from file", error);
    return [];
  }
}

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
  console.log(
    "generateGenreMetadata(): Starting script. Generating genre metadata..."
  );
  const genres = Data.GenreSeeds;

  const existingMetadata = await loadGenreMetadata();

  const genreMetadata = [];

  for (let i = 0; i < genres.length; i++) {
    const currentGenre = genres[i];

    console.log(`Generating metadata for genre: ${currentGenre}`);

    const genreMetadataFound = existingMetadata.find(
      (metadata) => metadata.genre === currentGenre
    );

    if (genreMetadataFound) {
      genreMetadata.push(genreMetadataFound);
      continue;
    }

    const newGenreMetadata = await generateOneGenreMetadata(currentGenre);

    delay(1000); // Delay to avoid rate limiting

    if (newGenreMetadata) {
      genreMetadata.push(newGenreMetadata);
    } else {
      console.error(`Error generating metadata for genre: ${currentGenre}`);
    }
  }

  const jsonContent = JSON.stringify(genreMetadata, null, 2);

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
