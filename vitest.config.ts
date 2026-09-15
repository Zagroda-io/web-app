import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

/**
 * Testy jednostkowe warstwy API i komponentów klienckich.
 *
 * Bez wtyczki React — JSX transpiluje wbudowany transformer Vitesta (automatyczny runtime),
 * co wystarcza do testów i nie wciąga łańcucha zależności Babela.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
})
