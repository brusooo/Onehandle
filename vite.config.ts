import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    // Chrome extension needs all assets in the root
    outDir: "dist",
    // Don't hash filenames — Chrome extension needs predictable paths
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
        manualChunks: {
          react: ["react", "react-dom"],
          lucide: ["lucide-react"],
          pdf: ["jspdf"],
          excel: ["xlsx"],
          zip: ["jszip"],
        },
      },
    },
  },
});
