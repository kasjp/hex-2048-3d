import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), legacy()],
  resolve: {
    alias: {
      "@Helpers": path.resolve(__dirname, "./src/shared/Helpers"),
      "@shared": path.resolve(__dirname, "./src/game/shared"),
      "@engine": path.resolve(__dirname, "./src/game/engine"),
      "@game": path.resolve(__dirname, "./src/game"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // test: {
  //   globals: true,
  //   environment: "jsdom",
  // },
});
