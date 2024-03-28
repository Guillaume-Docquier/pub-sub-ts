/// <reference types="vitest" />
import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ["es", 'cjs'],
    },
  },
  plugins: [tsconfigPaths()],
  test: {
    include: [
      '**/*.test.ts',
    ],
    coverage: {
      include: [
        '**/*.ts',
      ],
      provider: 'istanbul',
    },
  },
})
