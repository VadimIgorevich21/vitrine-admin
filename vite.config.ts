import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0", // Разрешает доступ из локальной сети
    port: 3000, // Укажите нужный порт
    strictPort: true, // Если порт занят, не переключаться на другой
    open: false, // Не открывать браузер автоматически
  },
});
