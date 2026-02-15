import { useState } from "react";
import { Copy, Star, Globe } from "lucide-react";
import type { TabInfo } from "../types/tab";

interface TabItemProps {
  tab: TabInfo;
  isFavorite: boolean;
  onCopy: (url: string) => void;
  onToggleFavorite: (tab: TabInfo) => void;
}

/**
 * Individual tab card component.
 * Shows favicon, title, domain, and action icons (copy + favorite).
 */
export default function TabItem({
  tab,
  isFavorite,
  onCopy,
  onToggleFavorite,
}: TabItemProps) {
  const [imgError, setImgError] = useState(false);

  const handleFaviconError = () => {
    setImgError(true);
  };

  /** Renders a fallback icon when favicon is missing or fails to load */
  const renderFavicon = () => {
    if (imgError || !tab.favicon) {
      return (
        <div className="favicon-fallback" aria-hidden="true">
          <Globe size={18} strokeWidth={1.5} />
        </div>
      );
    }

    return (
      <img
        className="tab-favicon"
        src={tab.favicon}
        alt=""
        width={20}
        height={20}
        onError={handleFaviconError}
        loading="lazy"
      />
    );
  };

  return (
    <div
      className="tab-item"
      id={`tab-${tab.id}`}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // Focus the tab when Enter is pressed
          chrome.tabs.update(tab.id, { active: true });
          chrome.windows.update(tab.windowId, { focused: true });
        }
      }}
    >
      <div className="tab-favicon-wrap">{renderFavicon()}</div>

      <div className="tab-info">
        <span className="tab-title" title={tab.title}>
          {tab.title}
        </span>
        <span className="tab-domain">{tab.domain}</span>
      </div>

      <div className="tab-actions">
        {/* Copy link button */}
        <button
          className="tab-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(tab.url);
          }}
          title="Copy link"
          aria-label={`Copy link for ${tab.title}`}
          id={`copy-btn-${tab.id}`}
        >
          <Copy size={16} strokeWidth={1.5} />
        </button>

        {/* Favorite toggle button */}
        <button
          className={`tab-action-btn favorite-btn ${isFavorite ? "is-favorite" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tab);
          }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={
            isFavorite
              ? `Remove ${tab.title} from favorites`
              : `Add ${tab.title} to favorites`
          }
          id={`fav-btn-${tab.id}`}
        >
          <Star
            size={16}
            strokeWidth={1.5}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  );
}
