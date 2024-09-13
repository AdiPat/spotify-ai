import { Artist } from "./artist";
import { ExternalUrl, Image } from "./misc";

export interface Album {
  albumType: string;
  artists: Artist[];
  availableMarkets: string[];
  externalUrls: ExternalUrl;
  href: string;
  id: string;
  images: Image[];
  name: string;
  releaseDate: string;
  releaseDatePrecision: string;
  totalTracks: number;
  type: "album";
  uri: string;
}
