// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
export default defineConfig({
  plugins: [peerDepsExternal() as any, react(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactScribblePad",
      formats: ["es", "umd"],
      fileName: (format) => `react-scribble-pad.${format}.js`,
    },
    rollupOptions: {
      external: [/^react/, /^react-dom/],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      plugins: [
        postcss({
          inject: true, // <— inline styles into JS
          minimize: true,
        }),
      ],
    },
  },
});
