import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // eslint-disable-next-line no-undef
      entry: path.resolve(__dirname, "src/features/index.js"),
      name: "react-img-annotation",
      formats: ["es", "umd"],
      fileName: (format) => `react-img-annotation.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "styled-components"],
      output: {
        globals: {
          react: "React",
          konva: "konva",
          "react-dom": "ReactDOM",
          "react-icons": "reactIcons",
          "react-konva": "reactKonva",
          "react-konva-utils": "reactKonvaUtils",
        },
      },
    },
  },
});
