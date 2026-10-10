export type CategoryId =
  | "poop"
  | "fart"
  | "toilet"
  | "diarrhea"
  | "wiping"
  | "flush"
  | "stink"
  | "diaper"
  | "constipation";

export type EntryStatus =
  /** Bar transcribed, timestamp checked, ready to show. */
  | "verified"
  /** Song is on the list but nobody has transcribed the bar/timestamp yet. */
  | "needs_bar"
  /** Submitted by a visitor, awaiting review. */
  | "pending";

export interface Song {
  /** URL slug, unique. */
  slug: string;
  title: string;
  /** Primary/credited artist as displayed. */
  artist: string;
  /** Featured artists, if the poop bar is theirs or they're on the track. */
  features?: string[];
  /** Who actually says the bar (defaults to artist). */
  rapper?: string;
  album?: string;
  year?: number;
  /** The excerpt: one or two lines max. Keep it short — this is commentary, not a lyrics site. */
  bar: string;
  /** mm:ss where the bar lands in the track. */
  timestamp?: string;
  categories: CategoryId[];
  /** The annotation: why it's funny, context, what's going on. Markdown-free plain text, paragraphs split by \n\n. */
  annotation: string;
  /** Editorial notes, e.g. a non-lyrical description of the reference while the bar is still blank. */
  note?: string;
  /** Hall-of-fame score. Static for now; becomes votes later. */
  score: number;
  status: EntryStatus;
  links?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
  };
  /** Where this entry came from (an article, a tip, a reddit thread). */
  source?: string;
  coverUrl?: string;
}

export interface Submission {
  id: string;
  receivedAt: string;
  artist: string;
  title: string;
  bar: string;
  timestamp?: string;
  categories: CategoryId[];
  whyItsFunny?: string;
  submitterName?: string;
  submitterEmail?: string;
  status: "pending";
}
