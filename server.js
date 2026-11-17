<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#263B65">
  <meta name="description" content="Learn in the language mix that feels like you. Ask UMOYA to explain concepts simply, step by step, or with an everyday example.">
  <title>UMOYA — African intelligence, understood.</title>
  <style>
    :root {
      --sand: #F5E9D2;
      --sand-deep: #EADCC0;
      --indigo: #263B65;
      --green: #167A58;
      --terracotta: #D97745;
      --gold: #E5AD3C;
      --coral: #D95D62;
      --ink: #1F2430;
      --muted: #5E6B82;
      --panel: rgba(255, 255, 255, 0.78);
      --panel-strong: rgba(255, 255, 255, 0.9);
      --line: rgba(38, 59, 101, 0.12);
      --shadow: 0 18px 40px rgba(38, 59, 101, 0.14);
      --success: #3A8D6B;
      --danger: #B8574A;
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
      --radius-sm: 12px;
      --font: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    * { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: var(--font);
      background:
        radial-gradient(circle at top left, rgba(217, 119, 69, 0.18), transparent 26%),
        radial-gradient(circle at bottom right, rgba(22, 122, 88, 0.12), transparent 30%),
        linear-gradient(180deg, #fbf6ee 0%, var(--sand) 100%);
      color: var(--indigo);
    }

    body::before,
    body::after {
      content: "";
      position: fixed;
      width: 220px;
      height: 220px;
      border-radius: 26px;
      opacity: 0.12;
      pointer-events: none;
      transform: rotate(18deg);
      border: 1px solid rgba(38, 59, 101, 0.2);
      z-index: 0;
    }

    body::before {
      top: 70px;
      right: 4%;
      background: linear-gradient(135deg, rgba(217, 119, 69, 0.3), rgba(229, 173, 60, 0.08));
    }

    body::after {
      bottom: 80px;
      left: 3%;
      background: linear-gradient(135deg, rgba(22, 122, 88, 0.25), rgba(38, 59, 101, 0.08));
    }

    a { color: inherit; text-decoration: none; }
    button, textarea { font: inherit; }

    .shell {
      position: relative;
      z-index: 1;
      max-width: 1220px;
      margin: 0 auto;
      padding: 28px 18px 40px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 18px 22px;
      background: rgba(255,255,255,0.55);
      border: 1px solid var(--line);
      border-radius: 22px;
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--terracotta), var(--gold));
      color: #fff;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.05em;
      box-shadow: 0 12px 24px rgba(217, 119, 69, 0.28);
    }

    .brand-copy {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand-copy strong {
      font-size: clamp(1.2rem, 2vw, 1.7rem);
      letter-spacing: 0.11em;
      line-height: 1;
      white-space: nowrap;
    }

    .brand-copy span {
      color: var(--muted);
      font-size: 0.72rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(22, 122, 88, 0.08);
      border: 1px solid rgba(22, 122, 88, 0.15);
      color: var(--green);
      border-radius: 999px;
      font-size: 0.88rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-pill .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 0 5px rgba(22, 122, 88, 0.13);
    }

    main {
      margin-top: 26px;
    }

    .intro {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 26px;
      max-width: 760px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      align-self: flex-start;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(38, 59, 101, 0.06);
      color: var(--indigo);
      border: 1px solid rgba(38, 59, 101, 0.08);
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.4rem, 6vw, 5rem);
      line-height: 0.96;
      letter-spacing: -0.06em;
      color: var(--indigo);
    }

    h1 span {
      display: block;
      color: var(--green);
    }

    .intro p {
      margin: 0;
      max-width: 680px;
      color: var(--muted);
      font-size: 1.08rem;
      line-height: 1.7;
    }

    .intro-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;
    }

    .intro-stat {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.62);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 0.9rem;
      color: var(--indigo);
      font-weight: 600;
    }

    .intro-stat::before {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--terracotta), var(--gold));
      box-shadow: 0 0 0 5px rgba(217, 119, 69, 0.12);
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.8fr);
      gap: 24px;
      align-items: start;
    }

    .workspace,
    .side-card {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
    }

    .workspace {
      overflow: hidden;
    }

    .workspace-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 20px 22px 16px;
      border-bottom: 1px solid var(--line);
      background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.52));
    }

    .workspace-head h2 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--indigo);
    }

    .workspace-head p {
      margin: 5px 0 0;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .session {
      align-self: flex-start;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(38, 59, 101, 0.06);
      color: var(--indigo);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .chat {
      display: flex;
      flex-direction: column;
      gap: 18px;
      min-height: 350px;
      max-height: 560px;
      overflow-y: auto;
      padding: 22px 20px 20px;
      background: linear-gradient(180deg, rgba(245,233,210,0.08), rgba(255,255,255,0.34));
    }

    .welcome {
      display: grid;
      place-items: center;
      min-height: 210px;
      text-align: center;
      padding: 16px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, rgba(22,122,88,0.06), rgba(38,59,101,0.04));
      border: 1px dashed rgba(22,122,88,0.2);
    }

    .welcome-icon {
      display: grid;
      place-items: center;
      width: 54px;
      height: 54px;
      border-radius: 18px;
      margin: 0 auto 12px;
      background: linear-gradient(135deg, var(--terracotta), var(--gold));
      color: white;
      font-size: 1.6rem;
      box-shadow: 0 12px 22px rgba(217, 119, 69, 0.18);
    }

    .welcome h3 {
      margin: 0 0 8px;
      font-size: clamp(1.4rem, 2vw, 2rem);
      color: var(--indigo);
    }

    .welcome p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
      max-width: 480px;
    }

    .message {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .message.user {
      flex-direction: row-reverse;
    }

    .message-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: rgba(38,59,101,0.07);
      color: var(--indigo);
      font-weight: 700;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      flex-shrink: 0;
    }

    .message.user .message-label {
      background: linear-gradient(135deg, var(--indigo), var(--green));
      color: white;
    }

    .bubble {
      max-width: min(82%, 720px);
      padding: 14px 16px;
      border-radius: 18px;
      line-height: 1.7;
      white-space: pre-wrap;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(38,59,101,0.08);
      color: var(--ink);
      box-shadow: 0 8px 16px rgba(31,36,48,0.04);
    }

    .message.user .bubble {
      background: linear-gradient(135deg, rgba(38,59,101,0.95), rgba(22,122,88,0.95));
      color: #fff;
      border-color: transparent;
    }

    .bubble.error {
      background: rgba(184, 87, 74, 0.08);
      border-color: rgba(184, 87, 74, 0.16);
      color: #7e2b22;
    }

    .composer {
      padding: 18px 20px 20px;
      border-top: 1px solid var(--line);
      background: rgba(255,255,255,0.45);
    }

    .style-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 0.8rem;
      color: var(--muted);
      font-weight: 600;
    }

    .styles {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 18px;
    }

    .style-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      min-height: 52px;
      padding: 12px 10px;
      border: 1px solid rgba(38,59,101,0.12);
      background: rgba(255,255,255,0.68);
      border-radius: 14px;
      color: var(--indigo);
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .style-btn:hover,
    .style-btn:focus-visible {
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(38,59,101,0.08);
      border-color: rgba(38,59,101,0.16);
      outline: none;
    }

    .style-btn[aria-pressed="true"] {
      background: linear-gradient(135deg, var(--green), var(--indigo));
      color: #fff;
      border-color: transparent;
      box-shadow: 0 12px 22px rgba(22,122,88,0.24);
    }

    .glyph {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255,255,255,0.16);
      font-size: 0.9rem;
    }

    .field-label {
      display: block;
      margin: 0 0 8px;
      color: var(--indigo);
      font-weight: 700;
      font-size: 0.84rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .input-wrap {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      padding: 12px 12px 12px 16px;
      background: rgba(255,255,255,0.9);
      border: 1px solid rgba(38,59,101,0.12);
      border-radius: var(--radius-md);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
    }

    .question {
      flex: 1;
      min-height: 92px;
      border: none;
      resize: vertical;
      background: transparent;
      font-size: 1rem;
      color: var(--ink);
      line-height: 1.6;
      padding: 4px 0;
    }

    .question:focus {
      outline: none;
    }

    .send-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 138px;
      min-height: 48px;
      padding: 0 18px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--terracotta), var(--gold));
      color: white;
      font-weight: 800;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      box-shadow: 0 14px 22px rgba(217,119,69,0.24);
    }

    .send-btn:hover,
    .send-btn:focus-visible {
      transform: translateY(-1px);
      box-shadow: 0 18px 30px rgba(217,119,69,0.32);
      outline: none;
    }

    .send-btn:disabled {
      opacity: 0.7;
      cursor: wait;
      transform: none;
    }

    .status {
      min-height: 24px;
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .hint {
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .side-card {
      padding: 18px 18px 16px;
    }

    .side-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .side-heading h3 {
      margin: 0;
      font-size: 1.08rem;
      color: var(--indigo);
    }

    .clear {
      border: 1px solid rgba(38,59,101,0.12);
      background: rgba(255,255,255,0.5);
      color: var(--indigo);
      border-radius: 999px;
      padding: 7px 10px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .history-empty {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .history-item {
      width: 100%;
      text-align: left;
      border: 1px solid rgba(38,59,101,0.08);
      background: rgba(255,255,255,0.68);
      padding: 12px 12px;
      border-radius: 12px;
      color: var(--indigo);
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }

    .history-item:hover,
    .history-item:focus-visible {
      transform: translateY(-1px);
      border-color: rgba(22,122,88,0.24);
      box-shadow: 0 8px 18px rgba(22,122,88,0.08);
      outline: none;
    }

    .example-title {
      margin: 18px 0 8px;
      color: var(--muted);
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
    }

    .example-list {
      display: grid;
      gap: 8px;
    }

    .example {
      width: 100%;
      text-align: left;
      background: rgba(255,255,255,0.7);
      color: var(--indigo);
      border: 1px solid rgba(38,59,101,0.08);
      padding: 10px 12px;
      border-radius: 12px;
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      line-height: 1.5;
    }

    .example:hover,
    .example:focus-visible {
      border-color: rgba(217,119,69,0.22);
      box-shadow: 0 10px 16px rgba(217,119,69,0.08);
      outline: none;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 10px 0;
      margin-top: 22px;
      color: var(--muted);
      font-size: 0.82rem;
      flex-wrap: wrap;
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        order: 2;
      }
    }

    @media (max-width: 640px) {
      .shell {
        padding-left: 12px;
        padding-right: 12px;
      }

      .topbar,
      .workspace-head,
      .side-heading {
        flex-direction: column;
        align-items: flex-start;
      }

      .brand-copy strong {
        letter-spacing: 0.08em;
      }

      .status-pill {
        white-space: normal;
      }

      .styles {
        grid-template-columns: 1fr;
      }

      .input-wrap {
        flex-direction: column;
        align-items: stretch;
      }

      .send-btn {
        width: 100%;
      }

      .message {
        gap: 8px;
      }

      .bubble {
        max-width: 100%;
      }

      .footer {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="UMOYA home">
        <span class="brand-mark" aria-hidden="true">u</span>
        <span class="brand-copy">
          <strong>UMOYA</strong>
          <span>African intelligence, understood.</span>
        </span>
      </a>
      <div class="status-pill"><span class="dot" aria-hidden="true"></span> Made for the way you learn</div>
    </header>

    <main>
      <section class="intro" aria-labelledby="headline">
        <div class="eyebrow">Learning that speaks your language</div>
        <h1 id="headline">Big ideas, explained <span>your way.</span></h1>
        <p>Think in English, isiXhosa, isiZulu, Sesotho, Afrikaans, or a natural mix. UMOYA turns the idea into clear language, using the method that helps you learn best.</p>
        <div class="intro-stats" aria-label="UMOYA features">
          <div class="intro-stat">Plain explanations</div>
          <div class="intro-stat">Step-by-step learning</div>
          <div class="intro-stat">Daily African examples</div>
        </div>
      </section>

      <div class="layout">
        <section class="workspace" aria-label="Ask UMOYA">
          <div class="workspace-head">
            <div>
              <h2>Ask UMOYA</h2>
              <p>One question at a time. We’ll work it out together.</p>
            </div>
            <span class="session">Your learning space</span>
          </div>

          <div class="chat" id="chat" aria-live="polite" aria-label="Conversation">
            <div class="welcome" id="welcome">
              <div>
                <div class="welcome-icon" aria-hidden="true">✳</div>
                <h3>What are you figuring out?</h3>
                <p>Ask in the language mix that feels like you. Choose the style that helps you understand best.</p>
              </div>
            </div>
          </div>

          <form class="composer" id="form" novalidate>
            <div class="style-label">
              <span>Choose an explanation style</span>
              <span>Change it whenever you like</span>
            </div>

            <div class="styles" role="group" aria-label="Explanation style">
              <button class="style-btn" type="button" data-style="simple" aria-pressed="true">
                <span class="glyph" aria-hidden="true">◌</span>
                Explain Simply
              </button>
              <button class="style-btn" type="button" data-style="steps" aria-pressed="false">
                <span class="glyph" aria-hidden="true">≡</span>
                Step by Step
              </button>
              <button class="style-btn" type="button" data-style="example" aria-pressed="false">
                <span class="glyph" aria-hidden="true">⌂</span>
                Everyday African Example
              </button>
            </div>

            <label for="question" class="field-label">Your question</label>
            <div class="input-wrap">
              <textarea class="question" id="question" maxlength="4000" placeholder="e.g. Ndiziva ndingaqondanga i-API… how does a database relationship work?" required></textarea>
              <button id="send" class="send-btn" type="submit" aria-label="Ask UMOYA">Ask UMOYA</button>
            </div>

            <p class="status" id="status" role="status" aria-live="polite"></p>
            <p class="hint">No need to choose a language. Just ask how you naturally speak.</p>
          </form>
        </section>

        <aside class="sidebar" aria-label="Learning tools">
          <section class="side-card">
            <div class="side-heading">
              <h3>Learning history</h3>
              <button class="clear" id="clear" type="button">Clear</button>
            </div>
            <div class="history-list" id="history">
              <p class="history-empty">Your questions will show up here. Pick one to continue learning.</p>
            </div>
          </section>

          <section class="side-card">
            <div class="side-heading"><h3>Need a starting point?</h3></div>

            <div class="example-title">Technology</div>
            <div class="example-list">
              <button class="example" type="button">What happens when I save a photo to the cloud?</button>
              <button class="example" type="button">How does a database relationship work?</button>
            </div>

            <div class="example-title">Maths &amp; science</div>
            <div class="example-list">
              <button class="example" type="button">Why does a heavier object not always fall faster?</button>
              <button class="example" type="button">What is electricity in simple terms?</button>
            </div>

            <div class="example-title">University concepts</div>
            <div class="example-list">
              <button class="example" type="button">What is opportunity cost? Use a student-life example.</button>
            </div>
          </section>
        </aside>
      </div>
    </main>

    <footer class="footer">
      <span>UMOYA · African intelligence, understood.</span>
      <span>Built for curious minds, everywhere.</span>
    </footer>
  </div>

  <script>
    (() => {
      const chat = document.querySelector('#chat');
      const form = document.querySelector('#form');
      const field = document.querySelector('#question');
      const sendButton = document.querySelector('#send');
      const status = document.querySelector('#status');
      const historyBox = document.querySelector('#history');

      let style = 'simple';
      let turns = [];
      let conversations = [];
      let activeId = null;

      function setLoading(isLoading) {
        if (!form || !sendButton || !field) return;
        form.classList.toggle('is-loading', isLoading);
        sendButton.disabled = isLoading;
        sendButton.textContent = isLoading ? 'Thinking…' : 'Ask UMOYA';
        field.disabled = isLoading;
      }

      function addMessage(role, text, isError = false) {
        const welcome = document.querySelector('#welcome');
        if (welcome) welcome.remove();

        const article = document.createElement('article');
        article.className = `message ${role}`;

        const label = document.createElement('div');
        label.className = 'message-label';
        label.textContent = role === 'user' ? 'You' : 'UMOYA';

        const bubble = document.createElement('div');
        bubble.className = `bubble${isError ? ' error' : ''}`;
        bubble.textContent = text;

        article.append(label, bubble);
        chat.append(article);
        chat.scrollTop = chat.scrollHeight;
        return article;
      }

      function renderHistory() {
        if (!historyBox) return;
        historyBox.replaceChildren();

        if (!conversations.length) {
          const empty = document.createElement('p');
          empty.className = 'history-empty';
          empty.textContent = 'Your questions will show up here. Pick one to continue learning.';
          historyBox.append(empty);
          return;
        }

        conversations.slice().reverse().forEach(item => {
          const button = document.createElement('button');
          button.className = 'history-item';
          button.type = 'button';
          button.textContent = item.title;
          button.setAttribute('aria-label', `Continue: ${item.title}`);
          button.addEventListener('click', () => loadConversation(item.id));
          historyBox.append(button);
        });
      }

      function loadConversation(id) {
        const item = conversations.find(conversation => conversation.id === id);
        if (!item) return;

        activeId = id;
        turns = item.turns.map(turn => ({ ...turn }));
        chat.replaceChildren();

        turns.forEach(turn => addMessage(turn.role, turn.content));
        status.textContent = 'Conversation restored. Ask a follow-up to continue.';
        field.focus();
      }

      document.querySelectorAll('.style-btn').forEach(button => {
        button.addEventListener('click', () => {
          style = button.dataset.style;
          document.querySelectorAll('.style-btn').forEach(item => {
            item.setAttribute('aria-pressed', String(item === button));
          });
          status.textContent = `Explanation style set to ${button.textContent.trim()}.`;
        });
      });

      document.querySelectorAll('.example').forEach(button => {
        button.addEventListener('click', () => {
          field.value = button.textContent;
          field.focus();
        });
      });

      document.querySelector('#clear').addEventListener('click', () => {
        conversations = [];
        turns = [];
        activeId = null;
        chat.replaceChildren();

        const welcome = document.createElement('div');
        welcome.className = 'welcome';
        welcome.id = 'welcome';
        welcome.innerHTML = `
          <div>
            <div class="welcome-icon" aria-hidden="true">✳</div>
            <h3>What are you figuring out?</h3>
            <p>Ask in the language mix that feels like you. Choose how you’d like it explained.</p>
          </div>
        `;

        chat.append(welcome);
        status.textContent = '';
        renderHistory();
      });

      form.addEventListener('submit', async event => {
        event.preventDefault();

        const question = field.value.trim();
        if (!question) {
          status.textContent = 'Type a question first, then UMOYA can help explain it.';
          field.focus();
          return;
        }

        if (question.length > 4000) {
          status.textContent = 'Please keep your question under 4,000 characters.';
          return;
        }

        const previousTurns = turns.map(turn => ({ ...turn }));
        addMessage('user', question);
        const waiting = addMessage('assistant', 'Thinking it through…');
        field.value = '';
        status.textContent = '';
        setLoading(true);

        try {
          const response = await fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, style, history: previousTurns })
          });

          const data = await response.json().catch(() => ({}));
          waiting.remove();

          if (!response.ok) {
            const message = data.error || 'UMOYA could not answer right now. Please try again.';
            addMessage('assistant', message, true);
            status.textContent = message;
            return;
          }

          const answer = typeof data.answer === 'string' && data.answer.trim()
            ? data.answer.trim()
            : 'UMOYA answered, but the response was empty. Please try again.';

          addMessage('assistant', answer);
          turns.push({ role: 'user', content: question }, { role: 'assistant', content: answer });

          if (!activeId) {
            activeId = String(Date.now());
            conversations.push({ id: activeId, title: question, turns });
          } else {
            const item = conversations.find(conversation => conversation.id === activeId);
            if (item) item.turns = turns;
          }

          if (data.demo) {
            status.textContent = 'Demo mode is active. Add AI_API_KEY to enable live explanations.';
          }

          renderHistory();
        } catch (error) {
          waiting.remove();
          addMessage('assistant', 'Could not reach UMOYA just now. Check your connection and try again.', true);
          status.textContent = 'Network error. Please check your connection and try again.';
        } finally {
          setLoading(false);
          field.focus();
        }
      });
    })();
  </script>
</body>
</html>
"},{
