/* 嫣究所 · 核心：存储 / 证据与图谱 / 路由 / 首页 / 错因本 / 设置 */
(function () {
  const VER = '0.14.3';
  const MODS = window.YJS_MODULES || {};

  /* ================= 存储 ================= */
  function load(key, def) {
    try { const raw = localStorage.getItem('yjs.' + key); return raw ? JSON.parse(raw) : def; }
    catch (e) { return def; }
  }
  function save(key, val) {
    try { localStorage.setItem('yjs.' + key, JSON.stringify(val)); } catch (e) {}
  }
  const progress = load('progress', { evidence: {}, quizBest: {} });
  const mistakes = load('mistakes', []);
  const tasks = load('tasks', {});
  const meta = load('meta', {});
  progress.evidence = progress.evidence || {};
  progress.quizBest = progress.quizBest || {};

  const saveProgress = () => save('progress', progress);
  const saveMistakes = () => save('mistakes', mistakes);
  const saveTasks = () => save('tasks', tasks);
  const saveMeta = () => save('meta', meta);

  /* ================= 工具 ================= */
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function h(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function toast(msg, gold) {
    const box = document.getElementById('toastbox');
    const t = h(`<div class="toast${gold ? ' gold' : ''}">${msg}</div>`);
    box.appendChild(t);
    setTimeout(() => { t.style.opacity = 0; t.style.transition = 'opacity .4s'; }, 2400);
    setTimeout(() => t.remove(), 2900);
  }

  /* ================= 证据与知识图谱 ================= */
  function has(key) { return !!progress.evidence[key]; }
  function needMet(need) {
    if (need.startsWith('any:')) return need.slice(4).split('|').some(k => has(k));
    return has(need);
  }
  function nodeLit(node) { return node.needs.every(needMet); }
  function allNodes() {
    const out = [];
    Object.values(MODS).forEach(m => (m.nodes || []).forEach(n => out.push({ ...n, mod: m })));
    return out;
  }
  function litIds() { return new Set(allNodes().filter(nodeLit).map(n => n.id)); }
  let prevLit = litIds();

  function ev(key) {
    if (has(key)) return;
    progress.evidence[key] = 1;
    saveProgress();
    const now = litIds();
    now.forEach(id => {
      if (!prevLit.has(id)) {
        const n = allNodes().find(x => x.id === id);
        if (n) toast('🌟 点亮知识点：' + n.label, true);
      }
    });
    prevLit = now;
  }

  /* ================= 先猜组件 ================= */
  // 可改选：手滑点错了，直接再点一个别的即可。onDone 只在第一次点击触发（下游流程不重复）。
  function guess(opts) {
    const el = h(`<div class="guess"><div class="gq">🤔 ${esc(opts.q)}</div>
      <div class="chips">${opts.options.map((o, i) => `<button class="chip gold" data-i="${i}">${esc(o)}</button>`).join('')}</div>
      <div class="reveal" hidden></div></div>`);
    let committed = false;
    el.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
      const k = +c.dataset.i;
      el.querySelectorAll('.chip').forEach(x => { x.classList.remove('on'); x.style.opacity = .5; });
      c.classList.add('on'); c.style.opacity = 1;
      const ok = (opts.answer == null) ? null : (k === opts.answer);
      const rv = el.querySelector('.reveal');
      rv.hidden = false;
      rv.innerHTML = (ok === null ? '' : ok ? '<b style="color:var(--ok)">猜对了。</b>' : '<b style="color:var(--warn)">再想想——</b>') + opts.reveal +
        (!committed && ok === false ? '<div class="small" style="margin-top:6px;color:var(--muted)">（点错了？直接再点一个别的就行。）</div>' : '');
      if (!committed) { committed = true; if (opts.onDone) opts.onDone(ok, k); }
    }));
    return el;
  }

  /* ================= 任务数据 ================= */
  function taskGet(id) { return tasks[id] || {}; }
  function taskSet(id, patch) { tasks[id] = Object.assign({}, tasks[id], patch); saveTasks(); }

  /* ================= 自测接线（QuizKit + 错因本 + 证据） ================= */
  function addMistake(q, chosen, moduleId) {
    const i = mistakes.findIndex(m => m.q.id === q.id);
    if (i >= 0) { mistakes[i].chosen = chosen; mistakes[i].n = (mistakes[i].n || 1) + 1; }
    else mistakes.push({ q, chosen, module: moduleId, n: 1 });
    saveMistakes();
  }
  function removeMistake(qid) {
    const i = mistakes.findIndex(m => m.q.id === qid);
    if (i >= 0) { mistakes.splice(i, 1); saveMistakes(); }
  }
  function quizStart(container, moduleId, onDone) {
    const qs = ((window.YJS_DATA || {}).quiz || {})[moduleId] || [];
    window.QuizKit.mount(container, qs, {
      onAnswer(q, ok, chosen) {
        if (ok) { ev('q:' + q.id); removeMistake(q.id); }
        else addMistake(q, chosen, moduleId);
      },
      onFinish(res) {
        const best = progress.quizBest[moduleId];
        if (!best || res.correct > best.correct) { progress.quizBest[moduleId] = { correct: res.correct, total: res.total }; saveProgress(); }
        container.innerHTML = '';
        if (onDone) onDone(res);
      }
    });
  }
  function quizBest(moduleId) { return progress.quizBest[moduleId] || null; }

  /* ================= 模块 API ================= */
  const Y = { esc, h, toast, ev, has, guess, taskGet, taskSet, quizStart, quizBest };

  /* ================= 路线图（上线节奏，见蓝图里程碑表） ================= */
  const ROAD = {
    phys: [
      { id: 'p1', emoji: '🚇', title: '机械运动', when: '8 月上旬' },
      { id: 'p2' },
      { id: 'p3', emoji: '🌡️', title: '物态变化', when: '10 月' },
      { id: 'p4', emoji: '🌈', title: '光现象', when: '11 月' },
      { id: 'p5', emoji: '🔍', title: '透镜及其应用', when: '10 月' },
      { id: 'p6', emoji: '⚖️', title: '质量与密度', when: '12 月' }
    ],
    math: [
      { id: 'g0', emoji: '🔷', title: '图形运动场 · 几何板块开门', when: '8 月上旬' },
      { id: 'm13', emoji: '📐', title: '三角形', when: '8 月中' },
      { id: 'm14', emoji: '🗝️', title: '全等三角形', when: '8 月下' },
      { id: 'm15', emoji: '🦋', title: '轴对称', when: '8 月底' },
      { id: 'm16', emoji: '🧱', title: '整式的乘法', when: '9 月' },
      { id: 'm17', emoji: '✂️', title: '因式分解', when: '9 月' },
      { id: 'm18', emoji: '➗', title: '分式', when: '11 月' }
    ]
  };

  /* ================= 路由 ================= */
  const view = document.getElementById('view');
  const tbTitle = document.getElementById('tbTitle');
  const btnBack = document.getElementById('btnBack');
  const btnHome = document.getElementById('btnHome');
  let cleanup = null;

  btnBack.addEventListener('click', () => { location.hash = '#/'; });
  btnHome.addEventListener('click', () => { location.hash = '#/'; });
  tbTitle.addEventListener('click', () => window.scrollTo(0, 0));

  function route() {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    window.scrollTo(0, 0);
    const hash = location.hash.replace(/^#\/?/, '');
    const [seg, arg] = hash.split('/');
    if (seg === 'm' && MODS[arg]) renderModule(MODS[arg]);
    else if (seg === 'mistakes') renderMistakes();
    else if (seg === 'settings') renderSettings();
    else renderHome();
  }
  window.addEventListener('hashchange', route);

  function chrome(title, sub) {
    tbTitle.textContent = title;
    const home = !sub;
    btnBack.hidden = home;
    btnHome.hidden = true;
  }

  /* ================= 首页 ================= */
  function modCard(mod) {
    const litCount = (mod.nodes || []).filter(nodeLit).length;
    const best = quizBest(mod.id);
    const doneTasks = (mod.taskIds || []).filter(t => taskGet(t).done).length;
    return h(`<div class="modcard" data-go="#/m/${mod.id}">
      <span class="em">${mod.emoji}</span>
      <div><div class="t">${mod.title}<span class="badge live">开放中</span></div>
      <div class="d">${mod.subtitle} · ★ ${litCount}/${(mod.nodes || []).length}${best ? ` · 自测最好 ${best.correct}/${best.total}` : ''}${doneTasks ? ` · 任务 ${doneTasks}/${(mod.taskIds || []).length}` : ''}</div></div>
      <span class="go">›</span></div>`);
  }
  function lockedCard(r) {
    return h(`<div class="modcard locked"><span class="em">${r.emoji}</span>
      <div><div class="t">${r.title}<span class="badge wave">${r.when} 上线</span></div>
      <div class="d">建造中——按学校进度提前 3–4 周供货</div></div></div>`);
  }

  function renderHome() {
    chrome('嫣究所');
    view.innerHTML = '';

    if (!meta.bannerOff) {
      const b = h(`<div class="banner"><button class="x">✕</button><b>怎么用：</b>挑一个亮着的模块进去玩，10 分钟一轮。★ 是你点亮的知识点；答错的题自动进「错因本」，考前刷它就够。<br>
      <b>装成 App：</b>Safari 分享按钮 → 「添加到主屏幕」，以后从桌面图标进（进度存在本机）。</div>`);
      b.querySelector('.x').addEventListener('click', () => { meta.bannerOff = 1; saveMeta(); b.remove(); });
      view.appendChild(b);
    }

    view.appendChild(h(`<div class="hero"><div class="logo">嫣</div>
      <div><h2 style="margin:0">嫣究所</h2><div class="sub">立嫣的初二数理研究所 · 新人教版八年级上册</div></div></div>`));

    const litN = litIds().size;
    const totalN = allNodes().length;
    const stat = h(`<div class="statrow">
      <div class="stat"><div class="n">★ ${litN}<span class="hint">/${totalN}</span></div><div class="l">已点亮知识点</div></div>
      <div class="stat" data-go="#/mistakes"><div class="n">${mistakes.length}</div><div class="l">错因本待复盘 ›</div></div>
    </div>`);
    view.appendChild(stat);

    view.appendChild(h(`<div class="sec-title"><span class="em">⚛️</span>物理 · 八上</div>`));
    const pl = h('<div class="modlist"></div>');
    ROAD.phys.forEach(r => pl.appendChild(MODS[r.id] ? modCard(MODS[r.id]) : lockedCard(r)));
    view.appendChild(pl);

    view.appendChild(h(`<div class="sec-title"><span class="em">📐</span>数学 · 八上</div>`));
    const ml = h('<div class="modlist"></div>');
    ROAD.math.forEach(r => ml.appendChild(MODS[r.id] ? modCard(MODS[r.id]) : lockedCard(r)));
    view.appendChild(ml);

    Object.values(MODS).forEach(m => {
      if (!m.nodes) return;
      const sec = h(`<div class="card"><h3>🗺️ 知识图谱 · ${m.title}</h3><div class="nodes"></div>
        <p class="hint">点亮规则：玩过对应实验 + 自测答对相应的题。全亮 = 这一章真的通了。</p></div>`);
      const box = sec.querySelector('.nodes');
      m.nodes.forEach(n => box.appendChild(h(`<span class="node${nodeLit(n) ? ' lit' : ''}">${n.label}</span>`)));
      view.appendChild(sec);
    });

    view.querySelectorAll('[data-go]').forEach(c => c.addEventListener('click', () => { location.hash = c.dataset.go; }));
  }

  /* ================= 模块页 ================= */
  function renderModule(mod) {
    chrome(mod.emoji + ' ' + mod.title, true);
    meta.last = mod.id; saveMeta();
    view.innerHTML = '';
    const box = document.createElement('div');
    view.appendChild(box);
    const inst = mod.render(box, Y);
    cleanup = inst && inst.cleanup;
  }

  /* ================= 错因本 ================= */
  function renderMistakes() {
    chrome('📕 错因本', true);
    view.innerHTML = '';
    if (!mistakes.length) {
      view.appendChild(h(`<div class="card center"><p style="font-size:40px;margin:10px 0">📕</p>
        <p><b>错因本是空的。</b></p><p class="hint">答错的自测题会自动收进来，按错因分类。重新答对，它就自动消掉。</p></div>`));
      return;
    }
    const byMod = {};
    mistakes.forEach(m => { (byMod[m.module] = byMod[m.module] || []).push(m); });

    Object.keys(byMod).forEach(modId => {
      const list = byMod[modId];
      const modName = MODS[modId] ? MODS[modId].title : modId;
      const head = h(`<div class="sec-title"><span class="em">${MODS[modId] ? MODS[modId].emoji : '📘'}</span>${modName}
        <button class="btn" style="margin-left:auto">只重做这些错题（${list.length}）</button></div>`);
      view.appendChild(head);
      const quizBox = h('<div class="card" hidden></div>');
      head.querySelector('button').addEventListener('click', () => {
        quizBox.hidden = false;
        head.querySelector('button').disabled = true;
        window.QuizKit.mount(quizBox, list.map(m => m.q), {
          onAnswer(q, ok, chosen) { if (ok) { ev('q:' + q.id); removeMistake(q.id); } else addMistake(q, chosen, modId); },
          onFinish() { route(); }
        });
      });
      view.appendChild(quizBox);

      const byTag = {};
      list.forEach(m => { (byTag[m.q.tag] = byTag[m.q.tag] || []).push(m); });
      Object.keys(byTag).forEach(tag => {
        const g = h(`<div class="mgroup"><p><span class="mtag">${esc(tag)}</span><span class="hint">${byTag[tag].length} 题</span></p></div>`);
        byTag[tag].forEach(m => {
          const correct = m.q.options[m.q.answer];
          const chosen = m.q.options[m.chosen];
          g.appendChild(h(`<div class="mitem"><div class="ms">${esc(m.q.stem)}</div>
            <div class="mmeta">你选了「${esc(chosen)}」 · 正确是「<b>${esc(correct)}</b>」${m.n > 1 ? ` · 错过 ${m.n} 次` : ''}</div>
            <details><summary class="hint" style="cursor:pointer">看解析</summary><div class="explain">${esc(m.q.explain)}</div></details></div>`));
        });
        view.appendChild(g);
      });
    });
  }

  /* ================= 设置 ================= */
  function renderSettings() {
    chrome('⚙️ 设置', true);
    view.innerHTML = '';
    const card = h(`<div class="card">
      <h3>嫣究所 v${VER}</h3>
      <p class="hint">进度只存在这台设备上。换设备前先「导出」，再到新设备「导入」。</p>
      <div class="btnrow"><button class="btn" id="s-exp">导出进度</button><button class="btn" id="s-imp">导入进度</button></div>
      <textarea class="io" id="s-io" placeholder="导出的进度会出现在这里；导入时把进度粘到这里再点导入。"></textarea>
      <hr class="divider">
      <div class="btnrow"><button class="btn danger" id="s-reset">清空本机全部进度</button></div>
    </div>`);
    view.appendChild(card);

    const io = card.querySelector('#s-io');
    card.querySelector('#s-exp').addEventListener('click', () => {
      io.value = JSON.stringify({ v: VER, progress, mistakes, tasks, meta });
      io.select();
      try { document.execCommand('copy'); toast('已生成并尝试复制——发给自己存好'); } catch (e) { toast('已生成，长按全选复制'); }
    });
    card.querySelector('#s-imp').addEventListener('click', () => {
      try {
        const d = JSON.parse(io.value);
        if (!d.progress) throw new Error('格式不对');
        save('progress', d.progress); save('mistakes', d.mistakes || []);
        save('tasks', d.tasks || {}); save('meta', d.meta || {});
        toast('导入成功，正在刷新…', true);
        setTimeout(() => location.reload(), 800);
      } catch (e) { toast('导入失败：内容不是有效的进度数据'); }
    });
    let armed = false;
    const rbtn = card.querySelector('#s-reset');
    rbtn.addEventListener('click', () => {
      if (!armed) { armed = true; rbtn.textContent = '再点一次，确认清空（不可恢复）'; setTimeout(() => { armed = false; rbtn.textContent = '清空本机全部进度'; }, 4000); return; }
      ['progress', 'mistakes', 'tasks', 'meta'].forEach(k => localStorage.removeItem('yjs.' + k));
      location.reload();
    });
  }

  /* ================= Service Worker ================= */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw && nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            toast('📦 有新内容——关掉重开就是新版');
          }
        });
      });
    }).catch(() => {});
  }

  document.getElementById('footVer').textContent = '嫣究所 v' + VER + ' · 离线可用';
  route();
})();
