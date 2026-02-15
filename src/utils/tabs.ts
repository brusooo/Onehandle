/**
 * Chrome Tabs API utilities
 *
 * Fetches tab data from all windows using chrome.tabs.query.
 * All processing happens locally — no external requests.
 */

import type { TabInfo, WindowGroup } from "../types/tab";
import { parseDomain, getFaviconFallback } from "./domain";

/**
 * Fetches all open tabs across all windows and
 * transforms them into our TabInfo format.
 */
export async function getAllTabs(): Promise<TabInfo[]> {
  try {
    const tabs = await chrome.tabs.query({});

    return tabs
      .filter(
        (tab) =>
          tab.id !== undefined &&
          tab.url !== "chrome://newtab/" &&
          tab.url !== "about:blank",
      )
      .map((tab) => ({
        id: tab.id!,
        windowId: tab.windowId,
        title: tab.title || "Untitled",
        url: tab.url || "",
        domain: parseDomain(tab.url || ""),
        favicon: tab.favIconUrl || getFaviconFallback(tab.url || ""),
        lastAccessed: tab.lastAccessed || 0,
        pinned: tab.pinned || false,
      }))
      .sort((a, b) => b.lastAccessed - a.lastAccessed);
  } catch (error) {
    console.error("Failed to fetch tabs:", error);
    return [];
  }
}

/**
 * Groups tabs by their window ID.
 * Optionally marks which window is currently focused.
 */
export async function getTabsGroupedByWindow(): Promise<WindowGroup[]> {
  try {
    const tabs = await getAllTabs();
    const currentWindow = await chrome.windows.getCurrent();
    const groups = new Map<number, TabInfo[]>();

    for (const tab of tabs) {
      const existing = groups.get(tab.windowId) || [];
      existing.push(tab);
      groups.set(tab.windowId, existing);
    }

    return Array.from(groups.entries()).map(([windowId, windowTabs]) => ({
      windowId,
      tabs: windowTabs,
      focused: windowId === currentWindow.id,
    }));
  } catch (error) {
    console.error("Failed to group tabs by window:", error);
    return [];
  }
}

/**
 * Copies text to clipboard using the Clipboard API
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
