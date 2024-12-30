import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        createSvgSpritePlugin({
            exportType: 'vue',
            include: '**/icons/*.svg'
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
