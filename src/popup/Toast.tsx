import { useState, useEffect, useCallback } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

/**
 * Toast notification component
 * Shows a brief success message that auto-dismisses
 */
export default function Toast({
  message,
  duration = 2000,
  onDismiss,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(onDismiss, 250);
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  return (
    <div
      className={`toast ${isExiting ? "toast-exit" : "toast-enter"}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
