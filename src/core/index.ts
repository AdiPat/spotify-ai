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
    .option("--get-playlists", "Get all Spotify playlists.")
    .option(
      "--get-playlist-details <playlistId>",
      "Get details for a single Spotify playlist by playlist ID."
    )
    .helpOption("-h, --help", "Display help for command")
    .parse(process.argv);

  const opts = program.opts();

  const { trackId, N, name, playlistId, help } = opts;

  console.log("Options: ", opts);

  await printSearchResults();

  process.exit(0);
}

export { run };
