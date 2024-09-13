import { Command } from "commander";
import { SpotifyAI } from "./spotify-ai";

async function run() {
  const program = new Command();

  program
    .option(
      "--get-similar --trackId <trackId> <N>",
      "Get N similar songs for a given Spotify track ID."
    )
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
    .option("--get-playlists", "Get all Spotify playlists.")
    .option(
      "--get-playlist-details <playlistId>",
      "Get details for a single Spotify playlist by playlist ID."
    )
    .helpOption("-h, --help", "Display help for command")
    .parse(process.argv);

  const opts = program.opts();

  console.log("Options: ", opts);

  const { trackId, N, name, playlistId, naturalSearch, description, help } =
    opts;

  if (naturalSearch && !description) {
    console.error(
      "Error: Description is required for natural search. Pass it with --description. "
    );
    process.exit(1);
  }

  if (naturalSearch && description) {
    const spotifyAI = new SpotifyAI();
    console.log("Natural search with description: ", description);

    const nlsOptions = {
      limit: N || 5,
      printResults: true,
    };

    await spotifyAI.naturalLanguageSearch(description, nlsOptions);

    process.exit(0);
  }

  process.exit(0);
}

export { run };
