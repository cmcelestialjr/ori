import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    server: {
        hmr: {
            host: 'localhost',
            port: 5173,
            protocol: 'ws',
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/index.css', 'resources/js/main.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});
