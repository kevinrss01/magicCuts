import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

// Custom plugin to filter out sourcemap warnings
const filterSourcemapWarnings = (): Plugin => {
  const originalConsoleWarn = console.warn;

  return {
    name: "filter-sourcemap-warnings",
    apply: "build",
    configResolved() {
      console.warn = function (message, ...args) {
        if (
          typeof message === "string" &&
          (message.includes(
            "Error when using sourcemap for reporting an error",
          ) ||
            message.includes("Source maps are enabled in production"))
        ) {
          return; // Suppress sourcemap warnings
        }
        originalConsoleWarn.call(console, message, ...args);
      };
    },
    buildEnd() {
      // Restore original console.warn
      console.warn = originalConsoleWarn;
    },
  };
};

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
    filterSourcemapWarnings(),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        sourcemapExcludeSources: false,
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  logLevel: "warn", // Suppress info-level logs
});
