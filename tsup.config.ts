import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/axios/index.ts',
        'src/client/index.ts',
        'src/local-api/index.ts',
        'src/mgmt-api/index.ts',
        'src/server/index.ts',
    ], // Add your submodules explicitly
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    clean: true
});
