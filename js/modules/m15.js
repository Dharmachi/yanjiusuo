/* m15 · 第十五章 轴对称 —— G0 的【翻转】按钮正式课程化；几何板块收官。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.m15 = {
  id: 'm15', subject: 'math', emoji: '🦋',
  title: '轴对称', subtitle: '翻转之后，与自己重合',
  wave: 'M5',
  nodes: [
    { id: 'm15-n1', label: '轴对称的两种含义', needs: ['act:m15.fold', 'any:q:m15q1|q:m15q2'] },
    { id: 'm15-n2', label: '垂直平分线·双向票', needs: ['act:m15.midperp', 'any:q:m15q3|q:m15q4'] },
    { id: 'm15-n3', label: '镜像作图', needs: ['act:m15.mirror'] },
    { id: 'm15-n4', label: '等腰·三线合一', needs: ['act:m15.iso', 'q:m15q5'] },
    { id: 'm15-n5', label: '分类讨论的习惯', needs: ['act:m15.iso', 'any:q:m15q6|q:m15q7'] },
    { id: 'm15-n6', label: '等腰判定与等边', needs: ['act:m15.eq', 'q:m15q8'] },
    { id: 'm15-n7', label: '最短路径·化折为直', needs: ['act:m15.path', 'any:q:m15q9|q:m15q10'] },
    { id: 'm15-n8', label: '大边对大角 🧪', needs: ['act:m15.bigside'] }
  ],
  taskIds: ['m15.symphoto'],

  render(root, Y) {
    const G = window.GeoKit;
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
      if (txt !== undefined) e.textContent = txt;
      g.appendChild(e); return e;
    };
    const seg = (g, p, q, col, w, dash) =>
      el(g, 'line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', ...(dash ? { 'stroke-dasharray': dash } : {}) });

    root.innerHTML = `
      <nav class="secnav">
        ${[['m15-intro', '引入'], ['m15-fold', '折纸机'], ['m15-mirror', '镜像画板'], ['m15-mid', '中垂线'],
        ['m15-iso', '等腰三角形'], ['m15-path', '将军饮马'], ['m15-big', '边与角的暗号'],
        ['m15-cards', '知识卡'], ['m15-quiz', '自测'], ['m15-tasks', '任务']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="m15-intro">
        <div class="card" style="border-top:3px solid var(--math)">
          <p class="intro-hook">G0 里那个【翻转】按钮，今天正式上岗：<b>翻转后能与自己重合的图形，叫轴对称图形</b>；
          翻转后能与<b>对方</b>重合的两个图形，叫成轴对称。<br>维也纳是轴对称之城——美泉宫、卡尔教堂、分离派金球，全是活教材。</p>
          <p class="hint">本章三大件：垂直平分线、等腰三角形、最短路径。最后那个会用一张维也纳地图讲。</p>
        </div>
      </section>

      <section id="m15-fold">
        <div class="sec-title"><span class="em">🦋</span>虚拟折纸机 · 十连判断</div>
        <div class="split">
          <div class="card">
            <svg id="m15-foldsvg"></svg>
            <p class="hint">金色虚线是折痕。先猜，再看"对折"的结果——红色是左半边翻过去的影子，<b>凸出来就是没重合</b>。</p>
          </div>
          <div class="card">
            <p id="m15-fprog" class="hint"></p>
            <h3 id="m15-fname"></h3>
            <div id="m15-fguess"></div>
            <div id="m15-fmsg"></div>
            <div class="btnrow"><button class="btn" id="m15-fnext" disabled>下一个 ›</button></div>
          </div>
        </div>
      </section>

      <section id="m15-mirror">
        <div class="sec-title"><span class="em">🪞</span>镜像画板</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="m15-mmode">
              <button class="chip on" data-m="free">自由画</button>
              <button class="chip" data-m="pred">预测挑战</button>
            </div>
            <svg id="m15-gridsvg"></svg>
          </div>
          <div class="card" id="m15-mmsg">
            <p><b>在金线左边点格子作画</b>——右边会实时长出它的镜像。</p>
            <p class="hint">观察：每对对应点的连线都被对称轴<b>垂直平分</b>。这就是轴对称的核心性质。</p>
          </div>
        </div>
      </section>

      <section id="m15-mid">
        <div class="sec-title"><span class="em">📏</span>垂直平分线 · 一张双向票</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="m15-midmode">
              <button class="chip on" data-m="prop">性质：线上的点</button>
              <button class="chip" data-m="conv">判定：等距的点</button>
            </div>
            <svg id="m15-midsvg"></svg>
          </div>
          <div class="card"><div id="m15-midmsg"></div></div>
        </div>
      </section>

      <section id="m15-iso">
        <div class="sec-title"><span class="em">🔺</span>等腰三角形 · 三条线观察台</div>
        <div class="split">
          <div class="card">
            <svg id="m15-isosvg"></svg>
            <div class="btnrow">
              <button class="btn" id="m15-btniso">一键等腰</button>
              <button class="btn" id="m15-btneq">一键等边</button>
              <button class="btn ghost" id="m15-btnrnd">随便歪</button>
            </div>
            <p class="hint">红=高 · 金=中线 · 蓝=顶角平分线（都从顶点 A 出发）。拖动顶点 A——三条线的关系会怎么变？</p>
          </div>
          <div class="card"><div id="m15-isomsg"></div></div>
        </div>
      </section>

      <section id="m15-path">
        <div class="sec-title"><span class="em">🐎</span>将军饮马 · 维也纳版</div>
        <div class="split">
          <div class="card">
            <svg id="m15-pathsvg"></svg>
            <p class="hint">从家🏠出发，到多瑙河边打水，再去美泉宫🏰。<b>拖河边的红点 P</b>，找总路程最短的位置。</p>
          </div>
          <div class="card">
            <div id="m15-pguess"></div>
            <p style="font-size:17px">当前总路程：<b id="m15-plen" class="kbd">--</b> 米<br>
            你的最好成绩：<b id="m15-pbest" class="kbd">--</b> 米</p>
            <div class="btnrow"><button class="btn gold" id="m15-preveal" disabled>🔓 揭示数学的解法（先拖几次）</button></div>
            <div id="m15-pmsg"></div>
          </div>
        </div>
      </section>

      <section id="m15-big">
        <div class="sec-title"><span class="em">⚖️</span>边与角的暗号 <span class="hint">🧪 探究与发现</span></div>
        <div class="split">
          <div class="card"><svg id="m15-bigsvg"></svg></div>
          <div class="card"><div id="m15-bigmsg"></div>
            <p class="hint">边按长短配色，角的颜色跟着<b>它对面的边</b>走。随便拖几下，观察左右两列的颜色顺序——里面藏着一条暗号。</p>
          </div>
        </div>
      </section>

      <section id="m15-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡</div>
        <div id="m15-cardlist"></div>
      </section>

      <section id="m15-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card">
          <p>概念辨析、双向票、<b>分类讨论</b>（本章第一批分类讨论题，务必做）、将军饮马。错题进错因本。</p>
          <p class="hint" id="m15-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="m15-quizgo">开始自测</button></div>
          <div id="m15-quizbox"></div>
        </div>
      </section>

      <section id="m15-tasks">
        <div class="sec-title"><span class="em">📸</span>维也纳任务</div>
        <div id="m15-tasklist"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c =>
      c.addEventListener('click', () => {
        const t = document.getElementById(c.dataset.to);
        if (t) t.scrollIntoView({ block: 'start' });
      }));

    /* ================= ① 虚拟折纸机 ================= */
    (function foldLab() {
      const svg = $('m15-foldsvg');
      svg.setAttribute('viewBox', '0 0 460 250');
      svg.classList.add('geo-svg');
      const star = [];
      for (let i = 0; i < 10; i++) {
        const R = i % 2 === 0 ? 62 : 26, a = (-90 + i * 36) * Math.PI / 180;
        star.push([230 + R * Math.cos(a), 125 + R * Math.sin(a)]);
      }
      const ITEMS = [
        { name: '等腰三角形', kind: 'poly', pts: [[230, 55], [160, 195], [300, 195]], sym: true, note: '底边的垂直平分线就是它的对称轴。' },
        { name: '平行四边形', kind: 'poly', pts: [[150, 85], [290, 85], [310, 165], [170, 165]], sym: false, note: '经典陷阱！它看着"匀称"，但沿任何直线对折都不重合——平行四边形不是轴对称图形（它是中心对称，九年级见）。' },
        { name: '五角星', kind: 'poly', pts: star, sym: true, note: '五角星有 5 条对称轴。' },
        { name: '圆', kind: 'circle', r: 72, sym: true, note: '圆有无数条对称轴——过圆心的每一条直线都算。' },
        { name: '汉字「中」', kind: 'text', ch: '中', sym: true, note: '很多汉字天生轴对称：中、日、田、王……' },
        { name: '字母 S', kind: 'text', ch: 'S', sym: false, note: 'S 翻过去就"背过身"了——它和镜像里的自己不是一回事（G0 的手性）。' },
        { name: '汉字「日」', kind: 'text', ch: '日', sym: true, note: '「日」竖折横折都行，有两条对称轴。' },
        { name: '字母 B', kind: 'text', ch: 'B', sym: false, note: '竖着折不行——但 B 有一条<b>水平</b>对称轴！对称轴不一定是竖直的。' },
        { name: '正方形', kind: 'poly', pts: [[160, 55], [300, 55], [300, 195], [160, 195]], sym: true, note: '正方形有 4 条对称轴：两条中线 + 两条对角线。' },
        { name: '字母 N', kind: 'text', ch: 'N', sym: false, note: 'N 谁来折都不行——0 条对称轴（不过它中心对称，转 180° 与自己重合）。' }
      ];
      let cur = 0, done = 0;
      function shapeSvg(fill, stroke, extra) {
        const it = ITEMS[cur];
        if (it.kind === 'poly') return `<polygon points="${it.pts.map(p => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" ${extra || ''}/>`;
        if (it.kind === 'circle') return `<circle cx="230" cy="125" r="${it.r}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" ${extra || ''}/>`;
        return `<text x="230" y="170" text-anchor="middle" font-size="130" font-weight="700" fill="${fill}" stroke="${stroke}" ${extra || ''}>${it.ch}</text>`;
      }
      function render() {
        const it = ITEMS[cur];
        svg.innerHTML = `
          <defs><clipPath id="m15-lclip"><rect x="0" y="0" width="230" height="250"/></clipPath></defs>
          ${shapeSvg('rgba(15,118,110,.18)', '#0f766e')}
          <g id="m15-mirrorg" style="opacity:0;transition:opacity .5s">
            <g transform="translate(460,0) scale(-1,1)">
              <g clip-path="url(#m15-lclip)">${shapeSvg('rgba(185,28,28,.4)', '#b91c1c')}</g>
            </g>
          </g>
          <line x1="230" y1="10" x2="230" y2="240" stroke="#b7791f" stroke-width="2" stroke-dasharray="8 6"/>`;
        $('m15-fprog').textContent = `第 ${cur + 1} / ${ITEMS.length} 个 · 已判断 ${done}`;
        $('m15-fname').textContent = it.name;
        $('m15-fmsg').innerHTML = '';
        $('m15-fnext').disabled = true;
        const gbox = $('m15-fguess');
        gbox.innerHTML = '';
        gbox.appendChild(Y.guess({
          q: '沿金色虚线对折，两边能完全重合吗？',
          options: ['能重合', '不能重合'], answer: it.sym ? 0 : 1,
          reveal: '看左边——红色影子就是左半边翻过去的样子。',
          onDone: () => {
            svg.querySelector('#m15-mirrorg').style.opacity = 1;
            $('m15-fmsg').innerHTML = `<div class="explain">${it.sym ? '✅ 红影与右半边严丝合缝——重合。' : '❌ 红影凸出来了——不重合。'}${it.note}</div>`;
            done++;
            $('m15-fprog').textContent = `第 ${cur + 1} / ${ITEMS.length} 个 · 已判断 ${done}`;
            if (done >= 6) Y.ev('act:m15.fold');
            if (cur < ITEMS.length - 1) $('m15-fnext').disabled = false;
            else $('m15-fmsg').insertAdjacentHTML('beforeend', '<div class="stdline">十连完成 🎉 判断口诀：想象沿轴翻过去，能不能和自己（或对方）严丝合缝。</div>');
          }
        }));
      }
      $('m15-fnext').addEventListener('click', () => { cur++; render(); });
      render();
    })();

    /* ================= ② 镜像画板 ================= */
    (function mirrorLab() {
      const svg = $('m15-gridsvg');
      const CELL = 24, COLS = 18, ROWS = 10;
      svg.setAttribute('viewBox', `0 0 ${COLS * CELL} ${ROWS * CELL}`);
      svg.classList.add('geo-svg');
      let mode = 'free', cells = new Set(['3,2', '4,4', '2,5', '6,6', '5,3']);
      const PATTERN = [[2, 2], [4, 3], [3, 6], [6, 7], [5, 4]];
      let round = 0, hits = 0;
      function key(c, r) { return c + ',' + r; }
      function render() {
        let html = '';
        for (let c = 0; c <= COLS; c++) html += `<line x1="${c * CELL}" y1="0" x2="${c * CELL}" y2="${ROWS * CELL}" stroke="#e6dfd0" stroke-width="1"/>`;
        for (let r = 0; r <= ROWS; r++) html += `<line x1="0" y1="${r * CELL}" x2="${COLS * CELL}" y2="${r * CELL}" stroke="#e6dfd0" stroke-width="1"/>`;
        const fill = (c, r, col) => `<rect x="${c * CELL + 1}" y="${r * CELL + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="4" fill="${col}"/>`;
        if (mode === 'free') {
          cells.forEach(k => {
            const [c, r] = k.split(',').map(Number);
            html += fill(c, r, 'rgba(15,118,110,.75)') + fill(COLS - 1 - c, r, 'rgba(76,81,191,.65)');
            html += `<line x1="${c * CELL + CELL / 2}" y1="${r * CELL + CELL / 2}" x2="${(COLS - 1 - c) * CELL + CELL / 2}" y2="${r * CELL + CELL / 2}" stroke="rgba(183,121,31,.35)" stroke-width="1.5" stroke-dasharray="4 4"/>`;
          });
        } else {
          PATTERN.forEach((p, i) => {
            html += fill(p[0], p[1], i < round ? 'rgba(15,118,110,.35)' : 'rgba(15,118,110,.75)');
            if (i < round) html += fill(COLS - 1 - p[0], p[1], 'rgba(21,128,61,.7)');
          });
          if (round < PATTERN.length) {
            const t = PATTERN[round];
            html += `<rect x="${t[0] * CELL - 2}" y="${t[1] * CELL - 2}" width="${CELL + 4}" height="${CELL + 4}" rx="6" fill="none" stroke="#b7791f" stroke-width="3"/>`;
          }
        }
        html += `<line x1="${COLS / 2 * CELL}" y1="0" x2="${COLS / 2 * CELL}" y2="${ROWS * CELL}" stroke="#b7791f" stroke-width="2.5"/>`;
        svg.innerHTML = html;
      }
      svg.addEventListener('pointerdown', e => {
        const rect = svg.getBoundingClientRect();
        const c = Math.floor((e.clientX - rect.left) / rect.width * COLS);
        const r = Math.floor((e.clientY - rect.top) / rect.height * ROWS);
        if (mode === 'free') {
          if (c >= COLS / 2) return;
          const k = key(c, r);
          cells.has(k) ? cells.delete(k) : cells.add(k);
          render();
        } else {
          if (round >= PATTERN.length) return;
          const t = PATTERN[round];
          if (c === COLS - 1 - t[0] && r === t[1]) {
            round++; hits++;
            $('m15-mmsg').innerHTML = `<p><b>✓ 对了（${hits}）。</b>对称点：到轴的<b>距离相等</b>、连线<b>垂直于轴</b>。</p>` +
              (round >= PATTERN.length ? '<div class="stdline">预测全部完成——作对称图形的本事到手：把每个关键点"等距翻"过去，再连起来。</div>' : '<p class="hint">下一个金框点在哪？继续。</p>');
            if (hits >= 4) Y.ev('act:m15.mirror');
          } else {
            $('m15-mmsg').innerHTML = '<p><b style="color:var(--bad)">✗ 不对。</b>数格子：金框点离轴几格，镜像点就在轴<b>另一侧</b>同样几格、<b>同一行</b>。</p>';
          }
          render();
        }
      });
      $('m15-mmode').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('m15-mmode').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
        mode = b.dataset.m;
        if (mode === 'pred') {
          round = 0; hits = 0;
          $('m15-mmsg').innerHTML = '<p><b>预测挑战：</b>金框标出的点，它的对称点在右边哪个格子？直接点。</p>';
        } else {
          $('m15-mmsg').innerHTML = '<p><b>在金线左边点格子作画</b>——右边会实时长出它的镜像。</p><p class="hint">每对对应点的连线都被对称轴垂直平分。</p>';
        }
        render();
      });
      render();
    })();

    /* ================= ③ 垂直平分线 ================= */
    (function midLab() {
      const svg = $('m15-midsvg');
      svg.setAttribute('viewBox', '0 0 460 300');
      svg.classList.add('geo-svg');
      const A = [120, 170], B = [340, 170], MID = 230;
      let mode = 'prop', P = [230, 80], Q = [280, 90], dots = [], propOK = false, drag = false;
      const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
      function draw() {
        svg.innerHTML = '';
        seg(svg, A, B, '#57503f', 4);
        el(svg, 'circle', { cx: A[0], cy: A[1], r: 5, fill: '#27231b' });
        el(svg, 'circle', { cx: B[0], cy: B[1], r: 5, fill: '#27231b' });
        el(svg, 'text', { x: A[0] - 8, y: A[1] + 24, 'font-size': 15, 'font-weight': 700 }, 'A');
        el(svg, 'text', { x: B[0] - 4, y: B[1] + 24, 'font-size': 15, 'font-weight': 700 }, 'B');
        seg(svg, [MID, 16], [MID, 284], '#b7791f', 2, '8 6');
        el(svg, 'path', { d: `M ${MID - 10} 170 L ${MID - 10} 160 L ${MID} 160`, fill: 'none', stroke: '#b91c1c', 'stroke-width': 1.8 });
        if (mode === 'prop') {
          const on = Math.abs(P[0] - MID) < 1;
          seg(svg, P, A, on ? '#0f766e' : '#b91c1c', 2.5);
          seg(svg, P, B, on ? '#4c51bf' : '#b91c1c', 2.5);
          el(svg, 'circle', { cx: P[0], cy: P[1], r: 9, class: 'vhandle', 'data-h': 'P' });
          el(svg, 'text', { x: P[0] + 12, y: P[1] - 8, 'font-size': 14.5, 'font-weight': 700 }, 'P');
          const da = dist(P, A), db = dist(P, B);
          $('m15-midmsg').innerHTML =
            `<p>PA = <b style="color:#0f766e">${da.toFixed(1)}</b>　PB = <b style="color:#4c51bf">${db.toFixed(1)}</b></p>` +
            (on ? '<div class="stdline">P 在中垂线上：PA = PB，永远相等（性质）。</div><p class="hint">把 P 拖离虚线试试。</p>'
              : '<p><b style="color:var(--bad)">离开中垂线，立刻不相等。</b>拖回虚线附近会自动吸附。</p>');
        } else {
          dots.forEach(d0 => el(svg, 'circle', { cx: d0[0], cy: d0[1], r: 5.5, fill: '#b7791f' }));
          const da = dist(Q, A), db = dist(Q, B);
          const eq = Math.abs(da - db) < 2.5;
          seg(svg, Q, A, 'rgba(15,118,110,.55)', 2);
          seg(svg, Q, B, 'rgba(76,81,191,.55)', 2);
          el(svg, 'circle', { cx: Q[0], cy: Q[1], r: 9, class: 'vhandle', 'data-h': 'Q', ...(eq ? { fill: '#b7791f' } : {}) });
          $('m15-midmsg').innerHTML =
            `<p>QA = <b style="color:#0f766e">${da.toFixed(1)}</b>　QB = <b style="color:#4c51bf">${db.toFixed(1)}</b>${eq ? ' —— <b style="color:var(--gold)">相等！金点 +1</b>' : ''}</p>
             <p class="hint">拖 Q 找"到 A、B 一样远"的位置（变金就是找到了），收集 3 枚金点。</p>
             ${dots.length >= 3 ? '<div class="stdline">金点连成的正是那条中垂线——到两端等距的点都在它上面（判定）。和性质合起来是一张"双向票"。</div>' : `<p>金点：<b>${dots.length}</b> / 3</p>`}`;
          if (eq && (!dots.length || dist(Q, dots[dots.length - 1]) > 30)) {
            dots.push(Q.slice());
            if (dots.length >= 3 && propOK) Y.ev('act:m15.midperp');
          }
        }
      }
      svg.addEventListener('pointerdown', e => {
        if (e.target.getAttribute && e.target.getAttribute('data-h')) {
          drag = true; e.preventDefault();
          try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });
      svg.addEventListener('pointermove', e => {
        if (!drag) return;
        const rect = svg.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 460;
        const y = Math.max(24, Math.min(276, (e.clientY - rect.top) / rect.height * 300));
        if (mode === 'prop') {
          P = [Math.abs(x - MID) < 14 ? MID : Math.max(30, Math.min(430, x)), y];
          if (Math.abs(P[0] - MID) < 1) propOK = true;
        } else Q = [Math.max(30, Math.min(430, x)), y];
        draw();
      });
      const stop = () => { drag = false; };
      svg.addEventListener('pointerup', stop);
      svg.addEventListener('pointercancel', stop);
      $('m15-midmode').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('m15-midmode').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
        mode = b.dataset.m;
        draw();
      });
      draw();
    })();

    /* ================= ④ 等腰三角形 · 三线合一 ================= */
    (function isoLab() {
      let splitSeen = false, mergeSeen = false;
      const lab = G.triLab($('m15-isosvg'), {
        w: 460, h: 300, pts: [[270, 70], [120, 250], [340, 250]],
        decorate(g, pts) {
          const [A, B, C] = pts;
          // 高
          const bc = [C[0] - B[0], C[1] - B[1]];
          const t = ((A[0] - B[0]) * bc[0] + (A[1] - B[1]) * bc[1]) / (bc[0] * bc[0] + bc[1] * bc[1]);
          const F = [B[0] + t * bc[0], B[1] + t * bc[1]];
          seg(g, A, F, '#b91c1c', 2.6);
          // 中线
          const M = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2];
          seg(g, A, M, '#b7791f', 2.6);
          el(g, 'circle', { cx: M[0], cy: M[1], r: 3.5, fill: '#b7791f' });
          // 顶角平分线
          const ub = [(B[0] - A[0]), (B[1] - A[1])], uc = [(C[0] - A[0]), (C[1] - A[1])];
          const nb = Math.hypot(ub[0], ub[1]), nc = Math.hypot(uc[0], uc[1]);
          const bis = [ub[0] / nb + uc[0] / nc, ub[1] / nb + uc[1] / nc];
          const den = bis[0] * bc[1] - bis[1] * bc[0];
          if (Math.abs(den) > 1e-6) {
            const s = ((B[0] - A[0]) * bc[1] - (B[1] - A[1]) * bc[0]) / den;
            seg(g, A, [A[0] + bis[0] * s, A[1] + bis[1] * s], '#4c51bf', 2.6);
          }
          el(g, 'text', { x: A[0] - 4, y: A[1] - 14, 'font-size': 15, 'font-weight': 700 }, 'A');
          el(g, 'text', { x: B[0] - 20, y: B[1] + 6, 'font-size': 15, 'font-weight': 700 }, 'B');
          el(g, 'text', { x: C[0] + 8, y: C[1] + 6, 'font-size': 15, 'font-weight': 700 }, 'C');
        },
        onDrag(pts, i) {
          const [A, B, C] = pts;
          const ab = Math.hypot(A[0] - B[0], A[1] - B[1]);
          const ac = Math.hypot(A[0] - C[0], A[1] - C[1]);
          const bc = Math.hypot(B[0] - C[0], B[1] - C[1]);
          const angB = G.angleAt(pts, 1), angC = G.angleAt(pts, 2);
          const iso = Math.abs(ab - ac) < 5;
          const eq = iso && Math.abs(ab - bc) < 7;
          if (iso) mergeSeen = true; else splitSeen = true;
          if (splitSeen && mergeSeen) Y.ev('act:m15.iso');
          if (eq && (splitSeen || mergeSeen)) Y.ev('act:m15.eq');
          $('m15-isomsg').innerHTML =
            `<p class="kbd">AB = ${ab.toFixed(0)}　AC = ${ac.toFixed(0)}　BC = ${bc.toFixed(0)}<br>∠B = ${angB.toFixed(1)}°　∠C = ${angC.toFixed(1)}°</p>` +
            (eq ? '<div class="stdline">等边三角形！三个角都是 60°，每个顶点处都三线合一，共 3 条对称轴——等腰家族的天花板。</div>'
              : iso ? '<div class="stdline">AB = AC：等腰！<b>∠B = ∠C（等边对等角）</b>，且红·金·蓝三条线合成了一条——<b>三线合一</b>：顶角平分线、底边中线、底边上的高，一人分饰三角。</div><p class="hint">注意：只在顶角 A 处三线合一，腰上可没有这待遇。</p>'
              : '<p>现在不等腰：三条线各走各的。<b>拖顶点 A 往中间去</b>，看它们合体。</p>');
        }
      });
      $('m15-btniso').addEventListener('click', () => lab.set([[230, 80], [120, 250], [340, 250]]));
      $('m15-btneq').addEventListener('click', () => lab.set([[230, 59.5], [120, 250], [340, 250]]));
      $('m15-btnrnd').addEventListener('click', () => lab.set([[290, 90], [120, 250], [340, 250]]));
    })();

    /* ================= ⑤ 将军饮马 · 维也纳版 ================= */
    (function pathLab() {
      const svg = $('m15-pathsvg');
      svg.setAttribute('viewBox', '0 0 460 400');
      svg.classList.add('geo-svg');
      const A = [90, 100], B = [370, 80], RY = 240;
      const Ap = [A[0], 2 * RY - A[1]];                 // A 关于河岸的对称点 (90, 380)
      const bestX = A[0] + (RY - Ap[1]) / (B[1] - Ap[1]) * (B[0] - A[0]); // 与 y=RY 交点
      const minLen = Math.hypot(B[0] - Ap[0], B[1] - Ap[1]);
      let px = 330, drags = 0, best = Infinity, revealed = false, drag = false;
      const M = v => Math.round(v * 3);                 // 换算成"米"
      function total(x) { return Math.hypot(x - A[0], RY - A[1]) + Math.hypot(B[0] - x, B[1] - RY); }
      function draw() {
        svg.innerHTML = '';
        el(svg, 'rect', { x: 0, y: RY - 12, width: 460, height: 26, fill: 'rgba(76,129,191,.25)' });
        el(svg, 'path', { d: `M 0 ${RY} Q 40 ${RY - 5} 80 ${RY} T 160 ${RY} T 240 ${RY} T 320 ${RY} T 400 ${RY} T 480 ${RY}`, fill: 'none', stroke: 'rgba(76,129,191,.8)', 'stroke-width': 2 });
        el(svg, 'text', { x: 8, y: RY + 34, 'font-size': 12.5, fill: '#4c81bf' }, '多瑙河');
        if (revealed) {
          seg(svg, A, Ap, '#b7791f', 1.6, '5 5');
          seg(svg, Ap, B, '#b7791f', 2.4, '9 6');
          el(svg, 'text', { x: Ap[0] - 14, y: Ap[1] + 8, 'font-size': 26, opacity: .45 }, '🏠');
          el(svg, 'text', { x: Ap[0] + 16, y: Ap[1] + 6, 'font-size': 13, fill: '#b45309', 'font-weight': 700 }, "A′（家的对称点）");
          el(svg, 'text', { x: bestX - 10, y: RY - 18, 'font-size': 20 }, '⭐');
        }
        seg(svg, A, [px, RY], '#0f766e', 3);
        seg(svg, [px, RY], B, '#0f766e', 3);
        el(svg, 'text', { x: A[0] - 15, y: A[1] + 9, 'font-size': 27 }, '🏠');
        el(svg, 'text', { x: B[0] - 15, y: B[1] + 9, 'font-size': 27 }, '🏰');
        el(svg, 'text', { x: A[0] - 14, y: A[1] - 22, 'font-size': 13, 'font-weight': 700 }, '家 A');
        el(svg, 'text', { x: B[0] - 30, y: B[1] - 22, 'font-size': 13, 'font-weight': 700 }, '美泉宫 B');
        el(svg, 'circle', { cx: px, cy: RY, r: 10, class: 'vhandle', 'data-h': 'P' });
        el(svg, 'text', { x: px - 5, y: RY + 30, 'font-size': 14.5, 'font-weight': 700, fill: '#b91c1c' }, 'P');
        const L = total(px);
        if (L < best) best = L;
        $('m15-plen').textContent = M(L);
        $('m15-pbest').textContent = M(best);
        if (revealed) {
          const gap = M(best) - M(minLen);
          $('m15-pmsg').innerHTML = `<div class="explain"><b>化折为直：</b>作家 A 关于河岸的对称点 A′，连 A′→美泉宫，与河岸的交点 ⭐ 就是最优的 P。<br>
            因为 PA = PA′，折线 A–P–B 与 A′–P–B 一样长，而"两点之间线段最短"。<br>
            数学最优：<b>${M(minLen)} 米</b>；你手找的最好成绩：<b>${M(best)} 米</b>${gap <= 2 ? '——就是它，手感满分 🎯' : `（只差 ${gap} 米）`}。</div>`;
        }
      }
      svg.addEventListener('pointerdown', e => {
        if (e.target.getAttribute && e.target.getAttribute('data-h')) {
          drag = true; e.preventDefault();
          try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });
      svg.addEventListener('pointermove', e => {
        if (!drag) return;
        const rect = svg.getBoundingClientRect();
        px = Math.max(40, Math.min(440, (e.clientX - rect.left) / rect.width * 460));
        draw();
      });
      const stop = () => {
        if (drag) {
          drags++;
          if (drags >= 3) {
            const b = $('m15-preveal');
            b.disabled = false;
            b.textContent = '🔓 揭示数学的解法';
          }
        }
        drag = false;
      };
      svg.addEventListener('pointerup', stop);
      svg.addEventListener('pointercancel', stop);
      $('m15-preveal').addEventListener('click', () => {
        if (revealed) return;
        revealed = true;
        Y.ev('act:m15.path');
        draw();
        Y.toast('🐎 化折为直——最短路径的钥匙到手', true);
      });
      $('m15-pguess').appendChild(Y.guess({
        q: '先猜：P 放在河岸哪里，总路程最短？',
        options: ['正对家的岸边', '正对美泉宫的岸边', '两者的正中间', '偏向一侧的某个点'], answer: 3,
        reveal: '到底偏向哪边、偏多少？拖 P 自己找最小值，再点"揭示解法"对答案——很多人猜"正中间"，答案偏偏不在那。',
        onDone: () => {}
      }));
      draw();
    })();

    /* ================= ⑥ 大边对大角 ================= */
    (function bigLab() {
      const RANKC = ['#b91c1c', '#b45309', '#15803d'];
      let bigDrags = 0;
      G.triLab($('m15-bigsvg'), {
        w: 460, h: 280, pts: [[220, 60], [100, 240], [360, 240]],
        decorate(g, pts) {
          const [A, B, C] = pts;
          const sides = [
            { name: 'BC（对 ∠A）', len: Math.hypot(B[0] - C[0], B[1] - C[1]), p: B, q: C },
            { name: 'CA（对 ∠B）', len: Math.hypot(C[0] - A[0], C[1] - A[1]), p: C, q: A },
            { name: 'AB（对 ∠C）', len: Math.hypot(A[0] - B[0], A[1] - B[1]), p: A, q: B }
          ];
          const order = [0, 1, 2].sort((i, j) => sides[j].len - sides[i].len);
          const rank = []; order.forEach((idx, r) => rank[idx] = r);
          sides.forEach((s, i) => seg(g, s.p, s.q, RANKC[rank[i]], 4.5));
          el(g, 'text', { x: A[0] - 4, y: A[1] - 14, 'font-size': 15, 'font-weight': 700, fill: RANKC[rank[0]] }, 'A');
          el(g, 'text', { x: B[0] - 20, y: B[1] + 8, 'font-size': 15, 'font-weight': 700, fill: RANKC[rank[1]] }, 'B');
          el(g, 'text', { x: C[0] + 8, y: C[1] + 8, 'font-size': 15, 'font-weight': 700, fill: RANKC[rank[2]] }, 'C');
          const angs = [G.angleAt(pts, 0), G.angleAt(pts, 1), G.angleAt(pts, 2)];
          $('m15-bigmsg').innerHTML =
            `<table class="fill"><tr><th>边</th><th>长</th><th></th><th>对角</th><th>度数</th></tr>` +
            [0, 1, 2].map(i =>
              `<tr><td style="color:${RANKC[rank[i]]};font-weight:700">${sides[i].name.slice(0, 2)}</td><td class="kbd">${sides[i].len.toFixed(0)}</td><td>↔</td>` +
              `<td style="color:${RANKC[rank[i]]};font-weight:700">∠${'ABC'[i]}</td><td class="kbd">${angs[i].toFixed(0)}°</td></tr>`).join('') +
            `</table><p class="hint">红＝最大 · 橙＝中 · 绿＝小。</p>` +
            (bigDrags >= 2
              ? '<div class="stdline">暗号破译：两列颜色顺序永远一致——<b>最长的边对着最大的角</b>（大边对大角），反过来也成立。🧪 目前是实验发现，严格证明高中会补上。</div>'
              : '<p class="hint">再拖几下——两列颜色的顺序有什么规律？</p>');
        },
        onDrag(pts, i) { if (i >= 0) { bigDrags++; Y.ev('act:m15.bigside'); } }
      });
    })();

    /* ================= 知识卡 ================= */
    window.ExplainKit.cards($('m15-cardlist'), [
      { emoji: '🦋', title: '轴对称图形 与 成轴对称', rule: '沿一条直线对折能与<b>自身</b>重合 = 轴对称图形；两个图形对折能<b>互相</b>重合 = 成轴对称。',
        steps: [{ t: '一个图形自己', r: '翻转后与自己重合' }, { t: '两个图形之间', r: '翻转后与对方重合', key: true }],
        trap: '一个是"自己与自己"、一个是"自己与对方"，别混。平行四边形看着匀称，其实不是轴对称图形。' },
      { emoji: '📍', title: '轴对称的性质', rule: '成轴对称的两个图形中，<b>对应点的连线被对称轴垂直平分</b>。',
        steps: [{ t: '对应点连线', r: '⊥ 对称轴' }, { t: '且被对称轴平分', r: '到轴等距', key: true }],
        trap: '作对称图形的全部依据就这一条：每个关键点"等距、垂直"地翻过去，再连起来。' },
      { emoji: '📏', title: '垂直平分线（双向票）', rule: '性质：线上的点到线段两端距离相等。判定：到两端距离相等的点在线上。',
        steps: [{ t: '性质：从线 → 距离', r: 'PA=PB' }, { t: '判定：从距离 → 线', r: '反方向', key: true }],
        trap: '一张票两个方向，用之前先看清自己从哪边上车。' },
      { emoji: '✏️', title: '画轴对称 · 坐标规则', rule: '找关键点 → 作对称点（等距、垂直）→ 顺次连接。P(x,y) 关于 x 轴 →(x,−y)，关于 y 轴 →(−x,y)。', eg: 'P(3, 2)',
        steps: [{ t: '关于 x 轴 → (3, −2)', r: 'x 不变、y 变号' }, { t: '关于 y 轴 → (−3, 2)', r: 'y 不变、x 变号', key: true }],
        trap: '口诀：关于谁对称，谁不变，另一个变号。' },
      { emoji: '🔺', title: '等腰三角形的性质', rule: '<b>等边对等角</b>（两底角相等）；<b>三线合一</b>：顶角平分线、底边中线、底边上的高重合。', fig: 'isoTri',
        steps: [{ t: 'AB = AC', r: '等腰' }, { t: '→ ∠B = ∠C', r: '等边对等角' }, { t: '顶角的高=中线=角平分线', r: '三线合一', key: true }],
        trap: '三线合一<b>只在顶角处</b>。拖离等腰，三条线立刻分家——这个画面就是记忆本体。' },
      { emoji: '🗝️', title: '等腰判定 与 等边三角形', rule: '<b>等角对等边</b>：有两个角相等 → 等腰。等边三角形三边相等、三角都 60°、有 3 条对称轴。',
        steps: [{ t: '∠B = ∠C', r: '两角相等' }, { t: '→ AB = AC（等腰）', r: '等角对等边', key: true }],
        trap: '"等边对等角"(性质) 与 "等角对等边"(判定) 又是双向票。有一个 60° 角的等腰三角形就是等边三角形。' },
      { emoji: '🐎', title: '最短路径 · 化折为直', rule: '同侧两点到直线上一点的路程和最短：作一点关于直线的对称点，连它与另一点，交直线于所求点。', fig: 'reflect', eg: '家 A → 河边 P → 美泉宫 B',
        steps: [{ t: '作 A 关于河岸的对称点 A′', r: 'PA = PA′', key: true }, { t: '连 A′B 交河岸于 P', r: '折线拉成直线' }, { t: '两点之间线段最短 → P 最优', r: '' }],
        trap: '答案通常不在"正中间"——它偏向离河更近的那一侧。原理两步：对称保长 + 线段最短。' },
      { emoji: '⚖️', title: '大边对大角 🧪', rule: '同一个三角形中，较大的边所对的角也较大；反过来也成立。',
        steps: [{ t: '最长边', r: '↔ 最大角' }, { t: '最短边', r: '↔ 最小角', key: true }],
        trap: '目前是探究性发现（🧪），高中给严格证明。选择题里它是快速排除的利器。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() {
      const b = Y.quizBest('m15');
      $('m15-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : '';
    }
    bestLine();
    $('m15-quizgo').addEventListener('click', () => {
      $('m15-quizgo').style.display = 'none';
      Y.quizStart($('m15-quizbox'), 'm15', () => {
        $('m15-quizgo').style.display = '';
        $('m15-quizgo').textContent = '再测一次';
        bestLine();
      });
    });

    /* ================= 任务 ================= */
    (function tasks() {
      const t = Y.taskGet('m15.symphoto');
      $('m15-tasklist').appendChild(window.TaskKit.card({
        emoji: '📸', title: '拍一张轴对称建筑',
        desc: '美泉宫正立面、卡尔教堂的双柱、分离派会馆的金球……维也纳满街都是对称轴。选一栋拍下来，想一想它的对称轴在哪里。',
        done: t.done,
        onToggle: v => { Y.taskSet('m15.symphoto', { done: v }); if (v) Y.toast('📸 对称之城打卡成功', true); }
      }));
    })();

    return { cleanup() {} };
  }
};
