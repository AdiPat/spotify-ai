import { Seed } from "./seed";
import { Track } from "./track";

// Interface for recommendation response
export interface RecommendationsResponse {
  seeds: Seed[];
  tracks: Track[];
}
