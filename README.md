# UMOYA

**African intelligence, understood.** A lightweight learning assistant for South African learners who think in English, isiXhosa, isiZulu, Sesotho, Afrikaans, or a natural mix.

## Run locally

Requires Node.js 18 or newer; no package installation is needed.

```sh
npm start
```

Open http://localhost:3000. The interface and input validation work without credentials. Real explanations require an OpenAI-compatible chat-completions service; without credentials UMOYA clearly reports that AI is not configured and does not invent a demo answer.

## Enable real AI explanations

Configure these environment variables on the server (never in browser code):

- `AI_API_KEY` — secret API key for your provider.
- `AI_MODEL` — optional model name; defaults to `gpt-4o-mini`.
- `AI_BASE_URL` — optional API base URL; defaults to `https://api.openai.com/v1`.
- `PORT` — optional local port; defaults to `3000`.

Example:

```sh
AI_API_KEY=your-secret-key npm start
```

The server sends the learner's question, selected teaching style, and recent conversation turns to the configured provider. Language adaptation is an AI instruction, not a guarantee of perfect language recognition; UMOYA is instructed to ask for clarification when it cannot confidently understand.
