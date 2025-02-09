import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			server: path.resolve(__dirname, '../server'),
			types: path.resolve(__dirname, './src/types'),
			sagas: path.resolve(__dirname, './src/sagas'),
			components: path.resolve(__dirname, './src/components'),
			logic: path.resolve(__dirname, './src/logic'),
			store: path.resolve(__dirname, './src/store'),
			socket: path.resolve(__dirname, './src/socket'),
		},
	},
	css: {
		modules: {
			localsConvention: 'camelCase',
		},
	},
	build: {
		minify: 'terser',
	},
	server: {
		port: 3002,
	},
})
