import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Launch checks (`npm run check:placeholders`), kept apart from the everyday test suite. */
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["scripts/**/*.test.ts"], environment: "node" },
});
