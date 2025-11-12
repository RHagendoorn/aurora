// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import topLevelAwait from "vite-plugin-top-level-await";

// // https://vitejs.dev/config/
// export default defineConfig(async () => ({
//     plugins: [react(), topLevelAwait()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    //   clearScreen: false,
    //   // 2. tauri expects a fixed port, fail if that port is not available
    //   server: {
    //     port: 1420,
    //     strictPort: true,
    //     watch: {
    //       // 3. tell vite to ignore watching `src-tauri`
    //       ignored: ["**/src-tauri/**"],
    //     },
    //   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outputDir: "dist/types",
      tsConfigFilePath: "tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyReactLibrary",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
  },
});
