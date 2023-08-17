import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }),
  ],
  test: {
    globals: true,
    setupFiles: `./vitest-setup.js`,
    environment: "jsdom",
  },
})
