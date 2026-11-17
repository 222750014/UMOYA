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
        req.resume();
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
  return history.slice(-MAX_HISTORY_TURNS)
    .filter(turn => turn && ['user', 'assistant'].includes(turn.role) && typeof turn.content === 'string')
    .map(turn => ({ role: turn.role, content: turn.content.slice(0, 4000) }));
}

function getProviderConfig() {
  const apiKey = process.env.AI_API_KEY?.trim();
  const baseUrl = process.env.AI_BASE_URL?.trim().replace(/\/+$/, '');
  const model = process.env.AI_MODEL?.trim();
  const missing = [];
  if (!apiKey) missing.push('AI_API_KEY');
  if (!baseUrl) missing.push('AI_BASE_URL');
  if (!model) missing.push('AI_MODEL');
  if (missing.length) {
    throw Object.assign(new Error(`AI is not configured. Set these server environment variables: ${missing.join(', ')}. Keep the API key out of frontend code.`), { statusCode: 503 });
  }

  let endpoint;
  try {
    endpoint = new URL(`${baseUrl}/chat/completions`);
    if (!['https:', 'http:'].includes(endpoint.protocol)) throw new Error('Unsupported protocol');
  } catch {
    throw Object.assign(new Error('AI_BASE_URL must be an HTTP(S) provider base URL, without /chat/completions.'), { statusCode: 500 });
  }
  return { apiKey, endpoint, model };
}

async function askProvider(question, style, history) {
  const { apiKey, endpoint, model } = getProviderConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          messages: [
            { role: 'system', content: `You are UMOYA, a patient and encouraging learning assistant. Explain accurately and accessibly. The learner may mix English, isiXhosa, isiZulu, Sesotho, and Afrikaans naturally within one message. Preserve the learner's language mix, code-switching, and preferred language in your reply; do not translate their question into a single language unless they ask. ${styles[style]} If the question is ambiguous, ask a brief clarifying question. Never pretend a cultural example applies to every learner.` },
            ...history,
            { role: 'user', content: question }
          ]
        })
      });
    } catch (error) {
      if (error.name === 'AbortError') throw Object.assign(new Error('The AI provider took too long to respond. Please try again.'), { statusCode: 504 });
      throw Object.assign(new Error('Could not connect to the AI provider. Check AI_BASE_URL and the server network.'), { statusCode: 502 });
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw Object.assign(new Error('The AI provider rejected the configured key. Verify it in the provider dashboard and check that this model is enabled.'), { statusCode: 502 });
      if (response.status === 429) throw Object.assign(new Error('The AI provider is busy or its quota is exhausted. Check provider billing/quota or try again shortly.'), { statusCode: 503 });
      const providerMessage = typeof data.error?.message === 'string' ? data.error.message : '';
      throw Object.assign(new Error(providerMessage || `AI provider request failed (${response.status}). Verify AI_BASE_URL and AI_MODEL.`), { statusCode: 502 });
    }

    const answer = data.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) throw Object.assign(new Error('The AI provider returned an empty or unsupported response. Check that the selected model supports chat completions.'), { statusCode: 502 });
    return { answer: answer.trim() };
  } finally {
    clearTimeout(timeout);
  }
}

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, {
      ok: true,
      aiConfigured: Boolean(process.env.AI_API_KEY?.trim() && process.env.AI_BASE_URL?.trim() && process.env.AI_MODEL?.trim())
    });
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
