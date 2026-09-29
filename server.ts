import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // AI Sustainability Green Bot
  app.post('/api/ai/query', async (req, res) => {
    const { query, role } = req.body || {};
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const systemInstruction = `You are Campus Green AI, an authoritative, helpful, and pragmatic campus sustainability advisor.
You are conversing with a ${role || 'Student'} on campus.
Link responses directly to UN Sustainable Development Goals (SDGs 7: Affordable & Clean Energy, 11: Sustainable Cities & Communities, 12: Responsible Consumption & Production, 13: Climate Action, 15: Life on Land).
Keep responses clear, inspiring, professional, actionable, and formatted with bullet points where appropriate.
Explain clearly which bins to use (Blue = dry clean recyclables/plastics/paper, Green = food scraps/organics compost, Yellow = electronics/hazardous e-waste).`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: query,
          config: {
            systemInstruction,
          },
        });

        const answer = response.text || 'No response generated.';
        return res.json({
          answer,
          sdgReferences: ['SDG 12: Responsible Consumption', 'SDG 13: Climate Action'],
        });
      } catch (err: any) {
        console.error('Gemini API call failed, falling back to heuristic engine:', err);
      }
    }

    // Heuristic fallback
    let generatedAnswer = "Campus Green connects campus behaviors to UN Sustainable Development Goals. Please filter your waste using Blue (Recyclables) and Green (Organics) bins.";
    const lower = query.toLowerCase();
    if (lower.includes('recycle') || lower.includes('bin') || lower.includes('waste')) {
      generatedAnswer = "Campus Recycling Protocols:\n• Blue Bins: Clean plastics (PET 1, HDPE 2), drink cans, and flattened clean paper.\n• Green Bins: Strictly food leftovers, fruit rinds, and compostable cafeteria scraps.\n• Yellow Stations: E-waste, rechargeable batteries, and broken tech accessories at the Library quad.";
    } else if (lower.includes('faculty') || lower.includes('curriculum') || lower.includes('syllabus') || lower.includes('class')) {
      generatedAnswer = "Faculty Action Recommendation: Incorporate a 15-minute campus biodiversity or energy audit into lab assessments. Students can map native flora and calculate carbon sequestration credits via the Impact Dashboard.";
    } else if (lower.includes('points') || lower.includes('earn') || lower.includes('reward')) {
      generatedAnswer = "Eco-Points Accumulation:\n• Join Campus Plantation & Cleanup Drives (+50 Pts)\n• Scan verified Solar/Compost QR tags (+50 Pts)\n• Complete interactive weekly Eco Quizzes (+50 Pts)\n• File Voice Maintenance Reports (+25 Pts)\nRedeem points for reusable flasks, tote bags, and organic coffee vouchers in the Eco Rewards Store!";
    }

    return res.json({
      answer: generatedAnswer,
      sdgReferences: ['SDG 12: Responsible Consumption', 'SDG 13: Climate Action'],
    });
  });

  // Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Green Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
