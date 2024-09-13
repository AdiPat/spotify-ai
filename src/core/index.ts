import { Command } from "commander";
import { printSearchResults } from "./spotify";

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

  const { trackId, N, name, playlistId, naturalSearch, description, help } =
    opts;

  if (naturalSearch && !description) {
    console.error(
      "Error: Description is required for natural search. Pass it with --description. "
    );
    process.exit(1);
  }

  if (naturalSearch && description) {
    console.log("Natural search with description: ", description);
    process.exit(0);
  }

  console.log("Options: ", opts);

  await printSearchResults();

  process.exit(0);
}

export { run };
