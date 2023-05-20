import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    reactRefresh(),
    copy({
      targets: [
        { src: "src/manifest.json", dest: "dist" },
        { src: "src/background.js", dest: "dist" },
      ],
      hook: "writeBundle", // important
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
