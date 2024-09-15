import { Command } from "commander";
import { SpotifyAI } from "./spotify-ai";

async function run() {
  const program = new Command();

  program
    .option(
      "--get-similar",
      "Get N similar songs for a given Spotify track ID."
    )
    .option("--track-id <trackId>", "Spotify track ID.")
    .option(
      "--search-track <name> <N>",
      "Search for a Spotify track by name and get N results."
    )
    .option(
      "-ns, --natural-search",
      "Search for a Spotify track by description and get N results."
    )
    .option(
      "--description <description>",
      "Search for a Spotify track by description."
    )
    .option("--N <N>", "Number of results to return. Default is 5.")
    .option("--verbose", "Print verbose output.")
    .option("--get-playlists", "Get all Spotify playlists.")
    .option(
      "--get-playlist-details <playlistId>",
      "Get details for a single Spotify playlist by playlist ID."
    )
    .helpOption("-h, --help", "Display help for command")
    .parse(process.argv);

  const opts = program.opts();

  const verbose = Boolean(opts.verbose);

  if (verbose) {
    console.log("Options: ", opts);
  }

  const {
    getSimilar,
    trackId,
    N,
    name,
    playlistId,
    naturalSearch,
    description,
    help,
  } = opts;

  if (N !== undefined && isNaN(N)) {
    console.error("Error: N must be a number.");
    process.exit(1);
  }

  if (getSimilar && !trackId) {
    console.error("Error: Track ID is required for getting similar tracks.");
    process.exit(1);
  }

  if (getSimilar && trackId) {
    if (verbose) {
      console.log("Getting similar tracks for track ID: ", trackId);
    }

    const spotifyAI = new SpotifyAI({ verbose });

    const similarOptions = {
      limit: parseInt(N) || 5,
      printResults: true,
    };

    await spotifyAI.getSimilarTracks(trackId, similarOptions);

    process.exit(0);
  }

  if (naturalSearch && !description) {
    console.error(
      "Error: Description is required for natural search. Pass it with --description. "
    );
    process.exit(1);
  }

  if (naturalSearch && description) {
    const spotifyAI = new SpotifyAI({ verbose });
    console.log("Natural search with description: ", description);

    const nlsOptions = {
      limit: parseInt(N) || 5,
      printResults: true,
    };

    await spotifyAI.naturalLanguageSearch(description, nlsOptions);

    process.exit(0);
  }

  process.exit(0);
}

export { run };
