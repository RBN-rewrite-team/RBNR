import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import vueJsx from '@vitejs/plugin-vue-jsx';
import htmlMinifier from 'vite-plugin-html-minifier';

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
		htmlMinifier({
			minify: true,
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
	  terserOptions: {
	    drop_debugger: false
	  },
	  mangle: {
	    reserved: ["debugger"]
	  }
	}
});
