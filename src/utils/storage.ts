/**
 * Chrome Storage utilities for favorites persistence
 *
 * All user data is stored locally in the browser using chrome.storage.local.
 * No data is sent to any server.
 * No tracking, analytics, or telemetry is used.
 */

import type { FavoriteTab } from "../types/tab";

const FAVORITES_KEY = "onehandle_favorites";

/**
 * Retrieves all favorites from chrome.storage.local
 */
export async function getFavorites(): Promise<FavoriteTab[]> {
  try {
    const result = await chrome.storage.local.get(FAVORITES_KEY);
    return (result[FAVORITES_KEY] as FavoriteTab[] | undefined) || [];
  } catch (error) {
    console.error("Failed to retrieve favorites:", error);
    return [];
  }
}

/**
 * Saves the entire favorites array to chrome.storage.local
 */
export async function saveFavorites(favorites: FavoriteTab[]): Promise<void> {
  try {
    await chrome.storage.local.set({ [FAVORITES_KEY]: favorites });
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

/**
 * Adds a tab to favorites. Prevents duplicates by URL.
 */
export async function addFavorite(
  tab: Omit<FavoriteTab, "addedAt">,
): Promise<FavoriteTab[]> {
  const favorites = await getFavorites();
  const exists = favorites.some((f) => f.url === tab.url);

  if (exists) {
    return favorites;
  }

  const newFavorite: FavoriteTab = {
    ...tab,
    addedAt: Date.now(),
  };

  const updated = [newFavorite, ...favorites];
  await saveFavorites(updated);
  return updated;
}

/**
 * Removes a tab from favorites by URL.
 */
export async function removeFavorite(url: string): Promise<FavoriteTab[]> {
  const favorites = await getFavorites();
  const updated = favorites.filter((f) => f.url !== url);
  await saveFavorites(updated);
  return updated;
}

/**
 * Checks if a URL is in the favorites list
 */
export async function isFavorite(url: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((f) => f.url === url);
}
