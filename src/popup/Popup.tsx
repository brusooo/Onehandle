import { useState, useEffect, useMemo, useCallback } from "react";
import { Shield, AppWindow } from "lucide-react";
import type { TabInfo, FavoriteTab, WindowGroup } from "../types/tab";
import { getTabsGroupedByWindow, copyToClipboard } from "../utils/tabs";
import { getFavorites, addFavorite, removeFavorite } from "../utils/storage";
import { copyAllUrls, downloadAllTabs } from "../utils/export";
import SearchBar from "./SearchBar";
import Favorites from "./Favorites";
import TabList from "./TabList";
import ActionMenu from "./ActionMenu";
import Toast from "./Toast";
import logoImg from "../assets/logo.png";
import "./popup.css";

type TabView = "active" | "favorites";

/**
 * Main Popup Component
 *
 * Privacy: All user data is stored locally in the browser using chrome.storage.local.
 * No data is sent to any server. No tracking, analytics, or telemetry is used.
 */
export default function Popup() {
  const [windowGroups, setWindowGroups] = useState<WindowGroup[]>([]);
  const [favorites, setFavorites] = useState<FavoriteTab[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>("active");

  // Separate search state for each view
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [favoriteSearchQuery, setFavoriteSearchQuery] = useState("");

  // Debounced query state for deferred filtering
  const [debouncedActiveQuery, setDebouncedActiveQuery] = useState("");
  const [debouncedFavoriteQuery, setDebouncedFavoriteQuery] = useState("");

  // Debounce Active Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedActiveQuery(activeSearchQuery);
    }, 300); // reduced to 300ms for better UX
    return () => clearTimeout(timer);
  }, [activeSearchQuery]);

  // Debounce Favorite Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFavoriteQuery(favoriteSearchQuery);
    }, 300); // reduced to 300ms for better UX
    return () => clearTimeout(timer);
  }, [favoriteSearchQuery]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [groups, favs] = await Promise.all([
        getTabsGroupedByWindow(),
        getFavorites(),
      ]);
      setWindowGroups(groups);
      setFavorites(favs);
      setIsLoading(false);
    }

    loadData();

    // System dark mode preference listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute(
        "data-theme",
        e.matches ? "dark" : "light",
      );
    };

    // Set initial theme
    document.documentElement.setAttribute(
      "data-theme",
      mediaQuery.matches ? "dark" : "light",
    );

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Set of favorite URLs for O(1) lookup
  const favoriteUrls = useMemo(
    () => new Set(favorites.map((f) => f.url)),
    [favorites],
  );

  // Filter tabs by debounced active query
  const filteredGroups = useMemo(() => {
    if (!debouncedActiveQuery.trim()) return windowGroups;

    const query = debouncedActiveQuery.toLowerCase().trim();
    return windowGroups
      .map((group) => ({
        ...group,
        tabs: group.tabs.filter(
          (tab) =>
            tab.title.toLowerCase().includes(query) ||
            tab.domain.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.tabs.length > 0);
  }, [windowGroups, debouncedActiveQuery]);

  // Filter favorites by debounced favorite search query
  const filteredFavorites = useMemo(() => {
    if (!debouncedFavoriteQuery.trim()) return favorites;

    const query = debouncedFavoriteQuery.toLowerCase().trim();
    return favorites.filter(
      (fav) =>
        fav.title.toLowerCase().includes(query) ||
        fav.domain.toLowerCase().includes(query),
    );
  }, [favorites, debouncedFavoriteQuery]);

  // Copy handler
  const handleCopy = useCallback(async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setToastMessage("Copied!");
    } else {
      setToastMessage("Failed to copy");
    }
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    async (tab: TabInfo) => {
      if (favoriteUrls.has(tab.url)) {
        const updated = await removeFavorite(tab.url);
        setFavorites(updated);
      } else {
        const updated = await addFavorite({
          url: tab.url,
          title: tab.title,
          favicon: tab.favicon,
          domain: tab.domain,
        });
        setFavorites(updated);
      }
    },
    [favoriteUrls],
  );

  // Remove from favorites
  const handleRemoveFavorite = useCallback(async (url: string) => {
    const updated = await removeFavorite(url);
    setFavorites(updated);
  }, []);

  // Bulk actions
  const handleCopyAll = useCallback(async () => {
    const success = await copyAllUrls(filteredGroups);
    if (success) {
      setToastMessage("All copied!");
    } else {
      setToastMessage("Failed to copy");
    }
  }, [filteredGroups]);

  const handleDownloadAll = useCallback(async () => {
    try {
      await downloadAllTabs(filteredGroups);
      setToastMessage("Download started!");
    } catch (error) {
      console.error(error);
      setToastMessage("Download failed");
    }
  }, [filteredGroups]);

  return (
    <div className="popup-container" id="popup-container">
      {/* Header with Segmented Control */}
      <header className="popup-header" id="popup-header">
        <div className="segmented-control" style={{ margin: 0 }}>
          <button
            className={`segment-btn ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active ({windowGroups.reduce((acc, g) => acc + g.tabs.length, 0)})
          </button>
          <button
            className={`segment-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        <div className="logo" aria-hidden="true" title="onehandle">
          <img
            src={logoImg}
            alt="onehandle"
            width="24"
            height="24"
            style={{ objectFit: "contain", borderRadius: "50%" }}
          />
        </div>
      </header>

      {/* Content */}
      <div className="popup-content" id="popup-content">
        {isLoading ? (
          <div className="loading-state" id="loading-state">
            <div className="loading-spinner" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "active" ? (
              <>
                <div className="search-container">
                  <SearchBar
                    value={activeSearchQuery}
                    onChange={setActiveSearchQuery}
                    placeholder="Search open tabs..."
                  />
                  <ActionMenu
                    onCopyAll={handleCopyAll}
                    onDownloadAll={handleDownloadAll}
                  />
                </div>
                <TabList
                  windowGroups={filteredGroups}
                  favoriteUrls={favoriteUrls}
                  onCopy={handleCopy}
                  onToggleFavorite={handleToggleFavorite}
                />
                {activeSearchQuery && filteredGroups.length === 0 && (
                  <EmptyState
                    title="No results found"
                    subtitle="Try a different search term"
                  />
                )}
              </>
            ) : (
              <>
                <div className="search-container">
                  <SearchBar
                    value={favoriteSearchQuery}
                    onChange={setFavoriteSearchQuery}
                    placeholder="Search favorites..."
                  />
                </div>
                <Favorites
                  favorites={filteredFavorites}
                  onRemove={handleRemoveFavorite}
                  onCopy={handleCopy}
                />
                {favoriteSearchQuery && filteredFavorites.length === 0 && (
                  <EmptyState
                    title="No results found"
                    subtitle="Try a different search term"
                  />
                )}
                {!favoriteSearchQuery && favorites.length === 0 && (
                  <EmptyState
                    title="No favorites yet"
                    subtitle="Star some tabs to see them here."
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Privacy footer */}
      <footer className="popup-footer" id="popup-footer">
        <Shield size={12} strokeWidth={1.5} />
        <span>All data stored locally · No tracking</span>
      </footer>

      {/* Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="empty-state">
      <AppWindow size={40} strokeWidth={1.5} className="empty-icon" />
      <p className="empty-title">{title}</p>
      <p className="empty-subtitle">{subtitle}</p>
    </div>
  );
}
