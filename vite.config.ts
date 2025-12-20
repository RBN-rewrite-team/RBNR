import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import vueJsx from '@vitejs/plugin-vue-jsx';
import htmlMinifier from 'vite-plugin-html-minifier';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
// https://vite.dev/config/
export default defineConfig({
	define: {
		__VUE_I18N_FULL_INSTALL__: true,
		__VUE_I18N_LEGACY_API__: false,
		__INTLIFY_PROD_DEVTOOLS__: false,
	},
	plugins: [
		vue(),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
		vueJsx({
			include: [/\.tsx$/, /\.jsx$/],
			exclude: [/\.vue$/],
		}),
		htmlMinifier({
			minify: true,
		}),
		vueI18n({
			runtimeOnly: false,
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
					// 如果模块在 node_modules 中，将其分割到 vendor chunk
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
			},
		},
	},
});
