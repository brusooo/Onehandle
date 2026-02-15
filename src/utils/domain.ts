/**
 * Domain parsing utilities
 *
 * All processing happens locally — no external requests.
 */

/**
 * Extracts the domain from a full URL.
 * Returns "Unknown" for invalid or chrome-internal URLs.
 */
export function parseDomain(url: string): string {
  try {
    if (
      !url ||
      url.startsWith("chrome://") ||
      url.startsWith("chrome-extension://")
    ) {
      return "browser";
    }
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

/**
 * Creates a fallback favicon URL using Google's S2 service.
 * This is a local-only URL the browser resolves internally.
 */
export function getFaviconFallback(url: string): string {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
  } catch {
    return "";
  }
}
