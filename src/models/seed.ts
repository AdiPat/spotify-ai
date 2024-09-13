export interface Seed {
  initialPoolSize: number;
  afterFilteringSize: number;
  afterRelinkingSize: number;
  id: string;
  type: "artist" | "track" | "genre";
  href: string;
}
