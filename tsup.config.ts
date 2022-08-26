import { defineConfig as defineTsupConfig } from 'tsup'

export function defineConfig({ external }: { external?: string[] }) {
  return defineTsupConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    external,
    format: ['esm', 'cjs'],
    sourcemap: true,
    target: 'esnext'
  })
}
