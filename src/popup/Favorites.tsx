import { useState } from "react";
import { Copy, Trash2, Globe } from "lucide-react";
import type { FavoriteTab } from "../types/tab";

interface FavoritesProps {
  favorites: FavoriteTab[];
  onRemove: (url: string) => void;
  onCopy: (url: string) => void;
}

/**
 * Dedicated favorites section pinned to the top.
 * Shows all saved favorites with remove and copy actions.
 */
export default function Favorites({
  favorites,
  onRemove,
  onCopy,
}: FavoritesProps) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="favorites-section" id="favorites-section">
      <div role="list">
        {favorites.map((fav) => (
          <FavoriteItem
            key={fav.url}
            favorite={fav}
            onRemove={onRemove}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  );
}

/** Individual favorite card */
function FavoriteItem({
  favorite,
  onRemove,
  onCopy,
}: {
  favorite: FavoriteTab;
  onRemove: (url: string) => void;
  onCopy: (url: string) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="tab-item"
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // Open the favorite URL in a new tab
          chrome.tabs.create({ url: favorite.url });
        }
      }}
    >
      <div className="tab-favicon-wrap">
        {imgError || !favorite.favicon ? (
          <div className="favicon-fallback" aria-hidden="true">
            <Globe size={18} strokeWidth={1.5} />
          </div>
        ) : (
          <img
            className="tab-favicon"
            src={favorite.favicon}
            alt=""
            width={20}
            height={20}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </div>

      <div className="tab-info">
        <span className="tab-title" title={favorite.title}>
          {favorite.title}
        </span>
        <span className="tab-domain">{favorite.domain}</span>
      </div>

      <div className="tab-actions">
        <button
          className="tab-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(favorite.url);
          }}
          title="Copy link"
          aria-label={`Copy link for ${favorite.title}`}
        >
          <Copy size={16} strokeWidth={1.5} />
        </button>

        <button
          className="tab-action-btn remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(favorite.url);
          }}
          title="Remove from favorites"
          aria-label={`Remove ${favorite.title} from favorites`}
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
