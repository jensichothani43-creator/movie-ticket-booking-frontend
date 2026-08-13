import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    include: ["src/tests/**/*.test.js"],
    exclude: ["src/tests/**/*.spec.js"],
  },
});