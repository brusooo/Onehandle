/**
 * Privacy-First Tab Links — Type Definitions
 *
 * All user data is stored locally in the browser using chrome.storage.local.
 * No data is sent to any server.
 * No tracking, analytics, or telemetry is used.
 */

/** Represents an open browser tab with parsed metadata */
export interface TabInfo {
  id: number;
  windowId: number;
  title: string;
  url: string;
  domain: string;
  favicon: string;
  lastAccessed: number;
  pinned: boolean;
}

/** Represents a favorite tab stored in chrome.storage.local */
export interface FavoriteTab {
  url: string;
  title: string;
  favicon: string;
  domain: string;
  addedAt: number;
}

/** Grouped tabs by window */
export interface WindowGroup {
  windowId: number;
  tabs: TabInfo[];
  focused: boolean;
}
