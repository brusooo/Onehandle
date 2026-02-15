import type { TabInfo } from "../types/tab";
import type { WindowGroup } from "../types/tab";
import TabItem from "./TabItem";
import { AppWindow } from "lucide-react";

interface TabListProps {
  windowGroups: WindowGroup[];
  favoriteUrls: Set<string>;
  onCopy: (url: string) => void;
  onToggleFavorite: (tab: TabInfo) => void;
}

/**
 * Renders all open tabs, grouped by window.
 * Each window group has a subtle header.
 */
export default function TabList({
  windowGroups,
  favoriteUrls,
  onCopy,
  onToggleFavorite,
}: TabListProps) {
  const showWindowHeaders = windowGroups.length > 1;

  return (
    <div className="tab-list" role="list" id="tab-list">
      {windowGroups.map((group) => (
        <div key={group.windowId} className="window-group">
          {showWindowHeaders && (
            <div className="window-header">
              <AppWindow size={14} strokeWidth={1.5} />
              <span>
                Window {group.focused ? "(Current)" : ""} · {group.tabs.length}{" "}
                tab{group.tabs.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {group.tabs.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isFavorite={favoriteUrls.has(tab.url)}
              onCopy={onCopy}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
