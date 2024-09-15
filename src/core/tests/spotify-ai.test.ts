import { SpotifyAI } from "../spotify-ai";

describe("Spotify AI", () => {
  describe("generateGenreSeeds", () => {
    let spotifyAI: SpotifyAI;

    beforeAll(() => {
      spotifyAI = new SpotifyAI({ verbose: true });
    });

    test("should return a list of genre seeds", async () => {
      const description = "A track with a lot of bass and drums.";
      const genreSeeds = await spotifyAI.generateGenreSeeds(description);
      expect(genreSeeds.length).toBeGreaterThan(0);
    });
  });
});
