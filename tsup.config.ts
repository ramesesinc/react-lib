import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/axios/index.ts',
    'src/client/index.ts',
    'src/local-api/index.ts',
    'src/mgmt-api/index.ts',
    'src/server/index.ts',
  ],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false, // optional, helps prevent issues with CJS/ESM interop
  shims: false,     // optional: disable Node.js shims
});
