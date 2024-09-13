export interface RecommendationsParams {
  // Required Parameters
  seed_artists?: string; // Comma-separated list of Spotify artist IDs, max 5
  seed_genres?: string; // Comma-separated list of genres, max 5
  seed_tracks?: string; // Comma-separated list of Spotify track IDs, max 5

  // Optional Parameters
  limit?: number; // The target size of the list of recommended tracks (Default: 20, Range: 1-100)
  market?: string; // An ISO 3166-1 alpha-2 country code (Optional)

  // Acousticness attributes
  min_acousticness?: number; // Minimum value for acousticness (Range: 0-1)
  max_acousticness?: number; // Maximum value for acousticness (Range: 0-1)
  target_acousticness?: number; // Target value for acousticness (Range: 0-1)

  // Danceability attributes
  min_danceability?: number; // Minimum value for danceability (Range: 0-1)
  max_danceability?: number; // Maximum value for danceability (Range: 0-1)
  target_danceability?: number; // Target value for danceability (Range: 0-1)

  // Duration attributes
  min_duration_ms?: number; // Minimum track duration (in ms)
  max_duration_ms?: number; // Maximum track duration (in ms)
  target_duration_ms?: number; // Target track duration (in ms)

  // Energy attributes
  min_energy?: number; // Minimum value for energy (Range: 0-1)
  max_energy?: number; // Maximum value for energy (Range: 0-1)
  target_energy?: number; // Target value for energy (Range: 0-1)

  // Instrumentalness attributes
  min_instrumentalness?: number; // Minimum value for instrumentalness (Range: 0-1)
  max_instrumentalness?: number; // Maximum value for instrumentalness (Range: 0-1)
  target_instrumentalness?: number; // Target value for instrumentalness (Range: 0-1)

  // Key attributes
  min_key?: number; // Minimum key (Range: 0-11)
  max_key?: number; // Maximum key (Range: 0-11)
  target_key?: number; // Target key (Range: 0-11)

  // Liveness attributes
  min_liveness?: number; // Minimum value for liveness (Range: 0-1)
  max_liveness?: number; // Maximum value for liveness (Range: 0-1)
  target_liveness?: number; // Target value for liveness (Range: 0-1)

  // Loudness attributes
  min_loudness?: number; // Minimum value for loudness
  max_loudness?: number; // Maximum value for loudness
  target_loudness?: number; // Target value for loudness

  // Mode attributes
  min_mode?: number; // Minimum mode (Range: 0-1)
  max_mode?: number; // Maximum mode (Range: 0-1)
  target_mode?: number; // Target mode (Range: 0-1)

  // Popularity attributes
  min_popularity?: number; // Minimum value for popularity (Range: 0-100)
  max_popularity?: number; // Maximum value for popularity (Range: 0-100)
  target_popularity?: number; // Target value for popularity (Range: 0-100)

  // Speechiness attributes
  min_speechiness?: number; // Minimum value for speechiness (Range: 0-1)
  max_speechiness?: number; // Maximum value for speechiness (Range: 0-1)
  target_speechiness?: number; // Target value for speechiness (Range: 0-1)

  // Tempo attributes
  min_tempo?: number; // Minimum tempo (BPM)
  max_tempo?: number; // Maximum tempo (BPM)
  target_tempo?: number; // Target tempo (BPM)

  // Valence attributes
  min_valence?: number; // Minimum value for valence (Range: 0-1)
  max_valence?: number; // Maximum value for valence (Range: 0-1)
  target_valence?: number; // Target value for valence (Range: 0-1)
}
