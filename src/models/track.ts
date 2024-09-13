import { Album } from "./album";
import { Artist } from "./artist";
import { ExternalId, ExternalUrl } from "./misc";

export interface Track {
  album: Album;
  artists: Artist[];
  availableMarkets: string[];
  discNumber: number;
  durationMs: number;
  explicit: boolean;
  externalIds: ExternalId;
  externalUrls: ExternalUrl;
  href: string;
  id: string;
  isLocal: boolean;
  name: string;
  popularity: number;
  previewUrl: string | null;
  trackNumber: number;
  type: "track";
  uri: string;
}
