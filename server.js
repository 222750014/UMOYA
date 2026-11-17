const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const STYLES = new Set(['simple', 'steps', 'example']);
const systemPrompt = `You are UMOYA, a patient learning assistant for South African learners. Your purpose is to explain academic and practical concepts—not merely translate questions. Understand naturally mixed English, isiXhosa, isiZulu, Sesotho and Afrikaans. Reply in the language or mix the learner used, as naturally as you can; do not claim perfect language recognition. If you genuinely cannot understand the question or language preference, ask a brief clarifying question instead of guessing. Use clear, age-appropriate language, define necessary technical terms, and check understanding where helpful. Use South African everyday examples only when relevant and respectful; never stereotype. Follow the requested style: simple = concise plain-language explanation; steps = ordered, logical steps; example = teach the concept through a relevant everyday South African example and explain the connection. Preserve context from the conversation and answer follow-ups directly. Be accurate; say when uncertain. Do not invent facts.`;

function send(res, status, data, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store'
  });
  res.end(type.startsWith('application/json') ? JSON.stringify(data) : data);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 100_000) {
        reject(new Error('Request is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Please send a valid question.')); }
    });
    req.on('error', reject);
  });
}

async function answer(req, res) {
  let input;
  try { input = await readJson(req); } catch (error) {
    return send(res, 400, { error: error.message });
  }
  const question = typeof input.question === 'string' ? input.question.trim() : '';
  const style = STYLES.has(input.style) ? input.style : 'simple';
  if (!question) return send(res, 400, { error: 'Type a question first, then UMOYA can help explain it.' });
  if (question.length > 4000) return send(res, 400, { error: 'Please keep your question under 4,000 characters.' });
  if (!process.env.AI_API_KEY) {
    return send(res, 503, { error: 'AI is not configured yet. Add AI_API_KEY on the server to enable real explanations; no demo answer has been generated.' });
  }

  const styles = {
    simple: 'Explain Simply: use plain, concise language and one idea at a time.',
    steps: 'Step by Step: organize the explanation into numbered, logical steps.',
    example: 'Everyday African Example: teach through one relevant everyday South African example, then explicitly connect it to the concept.'
  };
  const history = Array.isArray(input.history) ? input.history.slice(-10).flatMap(item => {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') return [];
    return [{ role: item.role, content: item.content.slice(0, 4000) }];
  }) : [];
  const messages = [
    { role: 'system', content: `${systemPrompt}\n\nCurrent explanation style: ${styles[style]}` },
    ...history,
    { role: 'user', content: question }
  ];
  const base = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.AI_MODEL || 'gpt-4o-mini', messages, temperature: 0.5 }),
      signal: controller.signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('AI provider returned', response.status, result.error?.message || 'Unknown error');
      return send(res, 502, { error: 'UMOYA could not get an explanation right now. Check the server AI settings and try again.' });
    }
    const text = result.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) return send(res, 502, { error: 'UMOYA received an empty response. Please try again.' });
    return send(res, 200, { answer: text.trim() });
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'That took too long. Please try again.'
      : 'Could not reach the AI service. Check your connection and server configuration.';
    return send(res, 502, { error: message });
  } finally {
    clearTimeout(timeout);
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'POST' && url.pathname === '/api/ask') return void answer(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
  const file = url.pathname === '/' ? 'index.html' : path.basename(url.pathname);
  if (file !== 'index.html') return send(res, 404, { error: 'Not found.' });
  fs.readFile(path.join(ROOT, file), 'utf8', (error, html) => {
    if (error) return send(res, 500, { error: 'Could not load UMOYA.' });
    send(res, 200, html, 'text/html; charset=utf-8');
  });
});

server.listen(PORT, () => console.log(`UMOYA is running at http://localhost:${PORT}`));
