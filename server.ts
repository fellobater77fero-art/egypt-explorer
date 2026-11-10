import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleEgyptAIChat, handleTranslation, handleHieroglyphRecognition } from './src/server/api';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini API endpoints
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, history, language } = req.body;
    const result = await handleEgyptAIChat(prompt || '', history || [], language || 'en');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

app.post('/api/gemini/translate', async (req, res) => {
  try {
    const { text, fromLang, toLang } = req.body;
    const result = await handleTranslation(text || '', fromLang || 'en', toLang || 'ar');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

app.post('/api/gemini/hieroglyph', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    const result = await handleHieroglyphRecognition(image || '', mimeType || 'image/jpeg');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

// Serve static frontend build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Egypt Explorer server listening on port ${PORT}`);
});
