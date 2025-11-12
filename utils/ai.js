// utils/ai.js
// Small wrapper for OpenAI calls. Uses 'openai' npm package.
// This function is intentionally simple — we'll improve the prompt chain in next steps.

const { OpenAI } = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set — AI calls will fail until you set it in .env');
}

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * generatePlan(goal, options)
 * - goal: string, user goal text
 * - options: { days: number } optional
 *
 * Returns: { planText: string, structured: Array }
 */
async function generatePlan(goal, options = {}) {
  const days = options.days || 14;

  // Simple prompt. We'll evolve this into a chain later.
  const prompt = `You are an assistant that converts a user's learning goal into a ${days}-day daily plan.
User goal: "${goal}"
Output a short JSON with fields:
- summary: short one-line summary
- days: an array of objects [{ day: 1, task: "..." }, ...] with exactly ${days} entries.

Respond ONLY with valid JSON.`;

  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini', // placeholder; change to preferred model name or Gemini endpoint later
      messages: [
        { role: 'system', content: 'You convert goals into structured daily plans.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700
    });

    const text = resp.choices?.[0]?.message?.content ?? '';
    let parsed = { summary: '', days: [] };
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // Fallback: return raw text
      return { planText: text, structured: null, error: 'AI output was not valid JSON' };
    }

    return { planText: JSON.stringify(parsed, null, 2), structured: parsed };
  } catch (err) {
    console.error('AI error', err);
    throw err;
  }
}

module.exports = { generatePlan };
