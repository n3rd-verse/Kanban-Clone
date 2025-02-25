import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({
            autoCodeSplitting: true,
            // // Add route tree optimization
            // routeFileIgnorePattern: /\.test\.|\.spec\./,
            // Add parallel route generation
            parallel: true
        }),
        react(),
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
            filename: "dist/stats.html"
        })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React chunk
                    "react-vendor": ["react", "react-dom"],

                    // TanStack libraries chunk
                    "tanstack-vendor": [
                        "@tanstack/react-query",
                        "@tanstack/react-router"
                    ],

                    // UI libraries chunk
                    "ui-vendor": [
                        "class-variance-authority",
                        "clsx",
                        "tailwind-merge"
                    ],

                    // Date handling chunk
                    "date-vendor": ["date-fns"],

                    // i18n chunk
                    "i18n-vendor": ["i18next", "react-i18next"]
                }
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
});
