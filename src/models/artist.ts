import { ExternalUrl } from "./misc";

export interface Artist {
  externalUrls: ExternalUrl;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}
