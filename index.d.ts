// Type definitions for hn-api 2.X
// Project: hn-api
// Definitions by: Kristofer Baxter <kristofer@kristoferbaxter.com>

export type UUID = string;
export type NumberToFeedItemId = {
  [key: number]: FeedItem['id'];
};
export type NumberToFeedItem = {
  [key: number]: FeedItem;
};

interface Lists {
  top: any;
  new: any;
  show: any;
  ask: any;
  job: any;
}
export type LIST_TYPES = keyof Lists;

export interface FeedItem {
  id: number;
  title: string;
  points?: number | null;
  user?: string | null;
  time: number;
  time_ago: string;
  comments_count: number;
  type: string;
  url?: string;
  domain?: string;
}

export interface Details extends FeedItem {
  content: string;
  deleted?: boolean;
  dead?: boolean;
  comments: Details[]; // Comments are details too
  level: number;
}

export interface ListRange {
  from: number;
  to: number;
}
export interface ListPage {
  page: number;
}
export interface List {
  uuid: UUID;
  items: NumberToFeedItemId;
  type: LIST_TYPES;
  max: number;
  $entities: NumberToFeedItem;
}

export const enum BackgroundUpdate {
  FeedsRetrieved,
  RetrieveFeeds,
  FeedItemRetieved,
  RetrieveFeedItem,
}

export type FeedCollection = {
  [P in LIST_TYPES]: NumberToFeedItemId
};

interface ThreadMessage {
  type: BackgroundUpdate;
}
export interface FeedsRetrievedMessage extends ThreadMessage {
  feeds: FeedCollection;
  deletionCandidates: FeedItem['id'][];
}
export interface RetrieveFeedsMessage extends ThreadMessage {
  lastUpdate: FeedCollection | null;
}
export interface FeedItemRetievedMessage extends ThreadMessage {
  item: FeedItem;
}
export interface RetrieveFeedItemMessage extends ThreadMessage {
  id: FeedItem['id'];
}
