import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Popup from "./popup/Popup";

/**
 * Entry point for the onehandle Chrome Extension popup.
 *
 * Privacy: All data stored locally. No tracking, analytics, or telemetry.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
