import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
		vueJsx({
			include: [/\.tsx$/, /\.jsx$/],
			exclude: [/\.vue$/],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	base: './',
	server: {
		host: '0.0.0.0',
	},
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 定义包到块的映射
          const packageToChunk = {
            'vue': 'vue',
            'katex': 'katex',
            'break_eternity.js': 'break_eternity',
            'pako': 'pako',
            'chevrotain': 'chevrotain'
          };
          
          for (const [pkg, chunkName] of Object.entries(packageToChunk)) {
            if (id.includes(`node_modules/${pkg}`) || id.includes(pkg)) {
              return chunkName;
            }
          }
          
          if (id.includes('/src/main.ts')) {
            return 'game';
          }
          
          if (id.match(/\.vue($|\?)/) && !id.includes('node_modules')) {
            return 'vue-components';
          }
          
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
