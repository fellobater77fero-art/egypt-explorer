import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleEgyptAIChat, handleTranslation, handleHieroglyphRecognition } from './src/server/api';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        // Read request body
        let bodyStr = '';
        req.on('data', chunk => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            res.setHeader('Content-Type', 'application/json');
            const data = bodyStr ? JSON.parse(bodyStr) : {};

            if (url === '/api/gemini/chat') {
              const result = await handleEgyptAIChat(data.prompt || '', data.history || [], data.language || 'en');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
              return;
            }

            if (url === '/api/gemini/translate') {
              const result = await handleTranslation(data.text || '', data.fromLang || 'en', data.toLang || 'ar');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
              return;
            }

            if (url === '/api/gemini/hieroglyph') {
              const result = await handleHieroglyphRecognition(data.image || '', data.mimeType || 'image/jpeg');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
              return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (err: any) {
            console.error('Server middleware error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
