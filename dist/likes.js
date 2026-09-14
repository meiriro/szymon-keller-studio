(() => {
  const config = window.SZYMON_LIKES_CONFIG || {};
  const baseUrl = String(config.url || '').replace(/\/$/, '');
  const key = String(config.publishableKey || '');
  const enabled = /^https:\/\/.+\.supabase\.co$/.test(baseUrl) && key.length > 20;
  const sessionKey = 'szymon-likes-session-v1';
  let sessionPromise;

  const icon = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M9 15.1 2.7 9.2A3.75 3.75 0 0 1 8 3.9L9 4.8l1-.9a3.75 3.75 0 0 1 5.3 5.3Z"/></svg>';
  const headers = (token) => ({
    'apikey': key,
    'Authorization': `Bearer ${token || key}`,
    'Content-Type': 'application/json'
  });

  function readStoredSession() {
    try {
      const stored = JSON.parse(localStorage.getItem(sessionKey) || 'null');
      return stored && stored.access_token && stored.expires_at > Math.floor(Date.now() / 1000) + 60 ? stored : null;
    } catch { return null; }
  }

  async function getSession() {
    if (!enabled) return null;
    if (sessionPromise) return sessionPromise;
    sessionPromise = (async () => {
      const stored = readStoredSession();
      if (stored) return stored;
      const response = await fetch(`${baseUrl}/auth/v1/signup`, {
        method: 'POST', headers: headers(), body: '{}'
      });
      if (!response.ok) throw new Error('No se pudo iniciar el contador de likes.');
      const data = await response.json();
      const next = { access_token: data.access_token, expires_at: data.expires_at };
      if (!next.access_token) throw new Error('No se recibió una sesión para el contador de likes.');
      localStorage.setItem(sessionKey, JSON.stringify(next));
      return next;
    })();
    try { return await sessionPromise; } catch (error) { sessionPromise = null; throw error; }
  }

  async function rpc(name, body) {
    const session = await getSession();
    const response = await fetch(`${baseUrl}/rest/v1/rpc/${name}`, {
      method: 'POST', headers: headers(session.access_token), body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('No se pudo actualizar el contador de likes.');
    return response.json();
  }

  function paint(node, state) {
    const button = node.querySelector('button');
    const count = node.querySelector('[data-like-count]');
    button.setAttribute('aria-pressed', String(state.liked));
    button.classList.toggle('is-empty', state.likes === 0 && !state.liked);
    button.setAttribute('aria-label', `${state.liked ? 'Quitar me gusta' : 'Dar me gusta'} · ${state.likes} me gusta`);
    button.title = state.liked ? 'Quitar me gusta' : 'Dar me gusta';
    count.textContent = state.likes ? String(state.likes) : '';
  }

  window.initialiseProjectLikes = async function initialiseProjectLikes(project) {
    const node = document.querySelector('[data-project-likes]');
    if (!node || !enabled) return;
    node.innerHTML = `<button type="button" class="project-like-button" aria-pressed="false" aria-label="Cargando likes" title="Dar me gusta">${icon}<span data-like-count>—</span></button>`;
    const button = node.querySelector('button');
    let state = { likes: 0, liked: false };
    try {
      const rows = await rpc('project_like_summaries', { p_project_ids: [project.id] });
      const row = rows[0] || state;
      state = { likes: Number(row.likes || 0), liked: Boolean(row.liked) };
      paint(node, state);
    } catch {
      node.replaceChildren();
      return;
    }
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = true;
      try {
        const rows = await rpc('toggle_project_like', { p_project_id: project.id });
        const row = rows[0] || state;
        state = { likes: Number(row.likes || 0), liked: Boolean(row.liked) };
        paint(node, state);
      } catch {
        button.title = 'No se pudo actualizar el me gusta';
      } finally {
        button.disabled = false;
      }
    });
  };

// El índice muestra el mismo recuento y permite votar sin abrir la ficha.
window.initialiseIndexLikes = async function initialiseIndexLikes(projects) {
  const nodes = [...document.querySelectorAll('[data-card-likes]')];
  if (!nodes.length || !enabled) return;
  const card = (state) => `<button type="button" class="card-like-button${state.likes === 0 && !state.liked ? ' is-empty' : ''}" aria-pressed="${state.liked}" aria-label="${state.liked ? 'Quitar me gusta' : 'Dar me gusta'} · ${state.likes} me gusta" title="${state.liked ? 'Quitar me gusta' : 'Dar me gusta'}">${icon}<span data-card-like-count>${state.likes ? state.likes : ''}</span></button>`;
  const nodesFor = (id) => nodes.filter(node => node.dataset.cardLikes === id);
  const paintCards = (id, state) => nodesFor(id).forEach(node => {
    node.innerHTML = card(state);
    const button = node.querySelector('button');
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = true;
      try {
        const rows = await rpc('toggle_project_like', { p_project_id: id });
        const row = rows[0] || state;
        const next = { likes: Number(row.likes || 0), liked: Boolean(row.liked) };
        paintCards(id, next);
      } catch {
        button.title = 'No se pudo actualizar el me gusta';
      } finally {
        button.disabled = false;
      }
    });
  });
  nodes.forEach(node => { node.innerHTML = card({ likes: 0, liked: false }); });
  try {
    const rows = await rpc('project_like_summaries', { p_project_ids: projects.map(project => project.id) });
    const summaries = new Map(rows.map(row => [row.project_id, { likes: Number(row.likes || 0), liked: Boolean(row.liked) }]));
    projects.forEach(project => paintCards(project.id, summaries.get(project.id) || { likes: 0, liked: false }));
    const totalNode = document.querySelector('[data-likes-total]');
    const totalLikes = [...summaries.values()].reduce((total, state) => total + state.likes, 0);
    if (totalNode) totalNode.textContent = totalLikes ? ` · ${totalLikes} me gusta` : '';
  } catch {
    nodes.forEach(node => node.replaceChildren());
  }
};
})();
