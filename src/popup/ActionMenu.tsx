import { useState, useRef, useEffect } from "react";
import { MoreVertical, Copy, Download } from "lucide-react";

interface ActionMenuProps {
  onCopyAll: () => void;
  onDownloadAll: () => void;
}

export default function ActionMenu({
  onCopyAll,
  onDownloadAll,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="action-menu-container" ref={menuRef}>
      <button
        className="action-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More options"
        title="More options"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="action-menu-dropdown">
          <button
            className="action-menu-item"
            onClick={() => {
              onCopyAll();
              setIsOpen(false);
            }}
          >
            <Copy size={14} />
            <span>Copy all</span>
          </button>
          <button
            className="action-menu-item"
            onClick={() => {
              onDownloadAll();
              setIsOpen(false);
            }}
          >
            <Download size={14} />
            <span>Download all</span>
          </button>
        </div>
      )}
    </div>
  );
}
