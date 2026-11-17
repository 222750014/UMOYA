'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const ROOT = __dirname;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_HISTORY_TURNS = 12;
const AI_TIMEOUT_MS = 30_000;

const styles = {
  simple: 'Explain the idea in plain, friendly language. Define unfamiliar words and use a concise, concrete explanation.',
  steps: 'Teach the idea as a clear numbered sequence. Explain why each step follows from the previous one, then give a short recap.',
  example: 'Explain the idea through a respectful, familiar everyday example grounded in African life where appropriate (for example a taxi route, a family shop, a community garden, a soccer team, or sharing airtime). Avoid stereotypes; make the analogy accurate and explain where it stops mapping to the concept.'
};

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body is too large.'), { statusCode: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { reject(Object.assign(new Error('Request must contain valid JSON.'), { statusCode: 400 })); }
    });
    req.on('error', reject);
  });
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-MAX_HISTORY_TURNS).filter(turn => turn && ['user', 'assistant'].includes(turn.role) && typeof turn.content === 'string')
    .map(turn => ({ role: turn.role, content: turn.content.slice(0, 4000) }));
}

function demoAnswer(question, style, history) {
  const q = question.trim();
  const followup = history.length > 0;
  const opening = followup
    ? 'Let’s connect that to what we were discussing. '
    : '';
  const examples = {
    simple: `${opening}Here’s the simple version: ${q}\n\nThink of the main idea as a way to describe how something works or why it happens. Break the question into smaller parts: what is involved, what changes, and what result you notice. The key takeaway is to focus on the relationship between those parts.\n\nThis is a demo explanation because no AI provider is configured. Add an AI_API_KEY on the server for a tailored answer.`,
    steps: `${opening}Let’s work through it step by step:\n\n1. Identify the main thing your question is about: ${q}\n2. Look for the parts involved and what each one does.\n3. Follow how one part affects the next.\n4. Check the result against a real example or observation.\n\nIn short: understand the parts, follow the connection, then check the outcome. This is a demo explanation; configure an AI_API_KEY for a specific, generated answer.`,
    example: `${opening}Imagine a neighbourhood community garden. People, tools, water, and plants each have a role; when one part changes, the garden’s result can change too. That everyday picture can help you think about the connections in your question: ${q}\n\nLike any analogy, it is only a starting point—not a perfect match for every technical detail. This is a demo explanation; configure an AI_API_KEY for a specific answer.`
  };
  return examples[style];
}

async function askProvider(question, style, history) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return { answer: demoAnswer(question, style, history), demo: true };

  const baseUrl = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  let endpoint;
  try { endpoint = new URL(`${baseUrl}/chat/completions`); }
  catch { throw Object.assign(new Error('AI_BASE_URL is not a valid URL.'), { statusCode: 500 }); }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.6,
        messages: [
          { role: 'system', content: `You are UMOYA, a patient and encouraging learning assistant. Explain accurately and accessibly. The learner may use English, isiXhosa, isiZulu, Sesotho, Afrikaans, or a natural mix; respond in a compatible language mix and do not demand translation. ${styles[style]} If the question is ambiguous, ask a brief clarifying question. Never pretend a cultural example applies to every learner.` },
          ...history,
          { role: 'user', content: question }
        ]
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw Object.assign(new Error('The configured AI provider rejected the API key. Check AI_API_KEY and provider permissions.'), { statusCode: 502 });
      if (response.status === 429) throw Object.assign(new Error('The AI provider is busy or its quota is exhausted. Please try again shortly.'), { statusCode: 503 });
      throw Object.assign(new Error(data.error?.message || `AI provider request failed (${response.status}).`), { statusCode: 502 });
    }
    const answer = data.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) throw Object.assign(new Error('The AI provider returned an empty answer. Please try again.'), { statusCode: 502 });
    return { answer: answer.trim(), demo: false };
  } catch (error) {
    if (error.name === 'AbortError') throw Object.assign(new Error('The AI provider took too long to respond. Please try again.'), { statusCode: 504 });
    throw error;
  } finally { clearTimeout(timeout); }
}

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, aiConfigured: Boolean(process.env.AI_API_KEY) });
  }
  if (url.pathname === '/api/ask') {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return sendJson(res, 405, { error: 'Use POST to ask UMOYA a question.' }); }
    try {
      const body = await readJson(req);
      if (typeof body.question !== 'string' || !body.question.trim()) return sendJson(res, 400, { error: 'Please enter a question.' });
      if (body.question.length > 4000) return sendJson(res, 400, { error: 'Please keep your question under 4,000 characters.' });
      const style = Object.hasOwn(styles, body.style) ? body.style : 'simple';
      const result = await askProvider(body.question.trim(), style, cleanHistory(body.history));
      return sendJson(res, 200, result);
    } catch (error) {
      const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
      if (status >= 500) console.error('[api/ask]', error.message);
      return sendJson(res, status, { error: status === 500 ? 'UMOYA encountered a server error. Please try again.' : error.message });
    }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.setHeader('Allow', 'GET, HEAD'); return sendJson(res, 405, { error: 'Method not allowed.' }); }
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { return sendJson(res, 400, { error: 'Invalid URL path.' }); }
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(ROOT, relativePath);
  if (!filePath.startsWith(`${ROOT}${path.sep}`) && filePath !== path.join(ROOT, 'index.html')) return sendJson(res, 403, { error: 'Forbidden.' });
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT' && !path.extname(relativePath)) {
        return fs.readFile(path.join(ROOT, 'index.html'), (indexError, html) => {
          if (indexError) return sendJson(res, 500, { error: 'Application entry point is missing.' });
          res.writeHead(200, { 'Content-Type': mimeTypes['.html'], 'X-Content-Type-Options': 'nosniff' });
          res.end(req.method === 'HEAD' ? undefined : html);
        });
      }
      return sendJson(res, error.code === 'ENOENT' ? 404 : 500, { error: error.code === 'ENOENT' ? 'Not found.' : 'Unable to read requested file.' });
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': path.basename(filePath) === 'index.html' ? 'no-cache' : 'public, max-age=3600' });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
});

server.listen(PORT, () => console.log(`UMOYA is running at http://localhost:${PORT}`));
