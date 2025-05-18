import { defineConfig } from 'vite';
import { resolve } from 'path';
import vuePlugin from '@vitejs/plugin-vue';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 7173,
  },
  plugins: [vuePlugin(), vueJsxPlugin()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@components', replacement: resolve(__dirname, 'src/components') },
    ],
    extensions: [
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
    ],
  },
});
