import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
// 	plugins: [
// 		react(),
// 		compression(), // Agrega este plugin para habilitar la compresión de archivos
// 	],
// });

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'https://tasas.eltoque.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
