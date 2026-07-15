/* m14 · 第十四章 全等三角形 —— 全项目最重的数学模块：判定探究 + 证明书写。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.m14 = {
  id: 'm14', subject: 'math', emoji: '🗝️',
  title: '全等三角形', subtitle: '几个条件，才能锁死一把钥匙',
  wave: 'M4',
  nodes: [
    { id: 'm14-n1', label: '全等与对应', needs: ['act:m14.detect', 'q:m14q1'] },
    { id: 'm14-n2', label: '全等的性质', needs: ['act:m14.detect', 'q:m14q2'] },
    { id: 'm14-n3', label: 'SSS · SAS', needs: ['act:m14.keys', 'any:q:m14q3|q:m14q4'] },
    { id: 'm14-n4', label: 'ASA · AAS', needs: ['act:m14.keys', 'any:q:m14q5|q:m14q10'] },
    { id: 'm14-n5', label: 'SSA 与 HL', needs: ['act:m14.ssa', 'any:q:m14q6|q:m14q7'] },
    { id: 'm14-n6', label: '证明书写', needs: ['act:m14.proof1', 'act:m14.proof2', 'q:m14q9'] },
    { id: 'm14-n7', label: '角平分线', needs: ['act:m14.bisect', 'q:m14q8'] },
    { id: 'm14-n8', label: '白板证明·毕业', needs: ['act:m14.proof3'] }
  ],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const D2R = d => d * Math.PI / 180;
    const dirUp = deg => [Math.cos(D2R(deg)), -Math.sin(D2R(deg))];
    const el = (g, tag, attrs, txt) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
      if (txt !== undefined) e.textContent = txt;
      g.appendChild(e); return e;
    };
    const seg = (g, p, q, col, w, dash) =>
      el(g, 'line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', ...(dash ? { 'stroke-dasharray': dash } : {}) });
    const wedgeArc = (g, p, u, v, r, col) => {
      const sa = Math.atan2(u[1], u[0]), ea = Math.atan2(v[1], v[0]);
      let d = ea - sa;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      const sweep = d > 0 ? 1 : 0;
      el(g, 'path', {
        d: `M ${p[0] + r * Math.cos(sa)} ${p[1] + r * Math.sin(sa)} A ${r} ${r} 0 0 ${sweep} ${p[0] + r * Math.cos(ea)} ${p[1] + r * Math.sin(ea)}`,
        fill: 'none', stroke: col, 'stroke-width': 2.2
      });
    };

    root.innerHTML = `
      <nav class="secnav">
        ${[['m14-intro', '引入'], ['m14-keys', '配钥匙'], ['m14-ssa', 'SSA 悬案'], ['m14-detect', '对应侦探'],
        ['m14-proof', '证明脚手架'], ['m14-bisect', '角平分线'], ['m14-cards', '知识卡'], ['m14-quiz', '自测']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="m14-intro">
        <div class="card" style="border-top:3px solid var(--math)">
          <p class="intro-hook">还记得 G0 的重合挑战吗——能靠<b>移、转、翻</b>完全叠上的两个图形，数学名字叫<b>全等（≌）</b>。<br>
          今天的问题只有一个：<b>最少给几个条件，才能把一个三角形"锁死"？</b>就像配钥匙——齿数不够，谁都能开。</p>
          <p class="hint">教材 14.2 专门设了"用信息技术探究三角形全等的条件"一节——你现在用的这个页面，就是那节课本身。</p>
        </div>
      </section>

      <section id="m14-keys">
        <div class="sec-title"><span class="em">🗝️</span>配钥匙 · 十道锁</div>
        <div class="split">
          <div class="card">
            <div class="lvl" id="m14-klvls"></div>
            <svg id="m14-keysvg"></svg>
            <p class="hint">青色 = 给定的条件（锉好的齿）；灰色虚线 = 自由的部分。<b>拖红点</b>试试还能不能动。</p>
          </div>
          <div class="card">
            <h3 id="m14-ktitle"></h3>
            <p id="m14-kgiven"></p>
            <div id="m14-kguess"></div>
            <div class="btnrow"><button class="btn primary" id="m14-kverdict" disabled>下结论</button></div>
            <div id="m14-kmsg"></div>
          </div>
        </div>
      </section>

      <section id="m14-ssa">
        <div class="sec-title"><span class="em">🕵️</span>SSA 悬案 · 同一套条件，能配出几把钥匙？</div>
        <div class="split">
          <div class="card">
            <svg id="m14-ssasvg"></svg>
            <div class="ctl"><label>BC 的长度（那条"摆动的边"）<span class="val" id="m14-rv">130</span></label>
              <input type="range" id="m14-r" min="40" max="220" step="0.5" value="130"></div>
            <div class="chips">
              <button class="chip" data-r="70">太短</button>
              <button class="chip" data-r="98.5">刚好垂直</button>
              <button class="chip" data-r="130">中等</button>
              <button class="chip" data-r="185">超过 AB</button>
            </div>
          </div>
          <div class="card">
            <div id="m14-ssaguess"></div>
            <div id="m14-ssamsg"></div>
          </div>
        </div>
      </section>

      <section id="m14-detect">
        <div class="sec-title"><span class="em">🕵️</span>对应侦探 · 谁跟谁是一对</div>
        <div class="split">
          <div class="card">
            <div class="lvl" id="m14-dlvls"></div>
            <svg id="m14-dsvg"></svg>
            <div class="btnrow"><button class="btn ghost" id="m14-dreset">↺ 重连</button></div>
          </div>
          <div class="card">
            <p>先点左边一个顶点，再点右边它的"对应顶点"，连满三对。</p>
            <p class="hint">线索不是位置，是<b>角上的记号</b>——一道弧对一道弧，两道对两道。全等式的字母必须按对应顶点的顺序写，这是考试丢分重灾区。</p>
            <div id="m14-dmsg"></div>
          </div>
        </div>
      </section>

      <section id="m14-proof">
        <div class="sec-title"><span class="em">✍️</span>证明脚手架 · 把话说全</div>
        <div class="card">
          <p>全等这一章，很多人<b>会想不会写</b>。脚手架三档，一档比一档松手：</p>
          <div class="chips" id="m14-ptabs">
            <button class="chip on" data-t="1">档 1 · 选理由</button>
            <button class="chip" data-t="2">档 2 · 补语句</button>
            <button class="chip" data-t="3">档 3 · 白板组装</button>
          </div>
          <div id="m14-parea"></div>
        </div>
      </section>

      <section id="m14-bisect">
        <div class="sec-title"><span class="em">📐</span>角平分线 · 一条线的两副面孔</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="m14-bmode">
              <button class="chip on" data-m="prop">性质：线上的点</button>
              <button class="chip" data-m="conv">判定：等距的点</button>
            </div>
            <svg id="m14-bsvg"></svg>
          </div>
          <div class="card"><div id="m14-bmsg"></div></div>
        </div>
      </section>

      <section id="m14-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡</div>
        <div id="m14-cardlist"></div>
      </section>

      <section id="m14-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card">
          <p>判定选择、对应关系、SSA 辨析、书写理由——全等章的考点浓缩。错题进错因本。</p>
          <p class="hint" id="m14-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="m14-quizgo">开始自测</button></div>
          <div id="m14-quizbox"></div>
        </div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c =>
      c.addEventListener('click', () => {
        const t = document.getElementById(c.dataset.to);
        if (t) t.scrollIntoView({ block: 'start' });
      }));

    /* ================= ① 配钥匙 ================= */
    (function keyLab() {
      const svg = $('m14-keysvg');
      svg.setAttribute('viewBox', '0 0 460 300');
      svg.classList.add('geo-svg');
      const A = [110, 250];
      const TEAL = '#0f766e', GRAY = '#8b8271', IND = '#4c51bf';
      const LV = [
        { n: 1, name: '一个条件：一条边', given: 'AB = 22（青色）', type: 'free', c: 220, ans: 1,
          verdict: '锁不死——C 想去哪去哪。一条边远远不够。' },
        { n: 2, name: '一个条件：一个角', given: '∠A = 50°', type: 'twofree', Adeg: 50, ans: 1,
          verdict: '锁不死——两条边想多长就多长。' },
        { n: 3, name: '两个条件：两条边', given: 'AB = 22，AC = 15', type: 'circle', c: 220, b: 150, ans: 1,
          verdict: '锁不死——C 还能沿圆弧滑，夹角是自由的。' },
        { n: 4, name: '两个条件：一边一角', given: 'AB = 22，∠A = 50°', type: 'ray', c: 220, Adeg: 50, ans: 1,
          verdict: '锁不死——AC 的长度还自由。' },
        { n: 5, name: '两个条件：两个角', given: '∠A = 50°，∠B = 65°', type: 'scale', Adeg: 50, Bdeg: 65, ans: 1,
          gq: '先猜：两个角，能锁死一个三角形吗？',
          gopts: ['能，唯一确定', '不能——大小还自由', '不能——连形状都没定'], gans: 1,
          verdict: '锁不死——但注意：<b>形状已经定了，只有大小在变</b>。这就是 G0 见过的"相似"，初三主角。所以 AAA 永远锁不死。' },
        { n: 6, name: '三个条件：SSS', given: 'AB = 22，AC = 15，BC = 17', type: 'locked', kind: 'SSS', c: 220, b: 150, a: 170, ans: 0,
          verdict: '<b>锁死 ✓ SSS</b>——三边分别相等的两个三角形全等。拖不动的手感，就是"三角形稳定性"。' },
        { n: 7, name: '三个条件：SAS', given: 'AB = 22，∠A = 50°，AC = 15（角夹在两边中间）', type: 'locked', kind: 'SAS', c: 220, Adeg: 50, b: 150, ans: 0,
          verdict: '<b>锁死 ✓ SAS</b>——两边及其夹角。注意"夹"字：角必须夹在两条给定边中间。' },
        { n: 8, name: '三个条件：ASA', given: '∠A = 50°，AB = 22，∠B = 65°（边夹在两角中间）', type: 'locked', kind: 'ASA', c: 220, Adeg: 50, Bdeg: 65, ans: 0,
          verdict: '<b>锁死 ✓ ASA</b>——两角及其夹边。两条射线只有一个交点，C 无处可逃。' },
        { n: 9, name: '三个条件：AAS', given: '∠A = 50°，∠B = 65°，BC = 17（边不是夹边）', type: 'locked', kind: 'AAS', Adeg: 50, Bdeg: 65, a: 170, ans: 0,
          verdict: '<b>锁死 ✓ AAS</b>——第三个角早被内角和定死了（180°−50°−65°=65°），所以 AAS 本质上就是 ASA 的变装。' },
        { n: 10, name: '三个条件：SSA', given: '∠A = 38°，AB = 16，BC = 12（角不夹在两边中间）', type: 'ssa2', ans: 1,
          gq: '先猜：也是三个条件，这把锁的下场是？',
          gopts: ['锁死，唯一确定', '锁不死——还能连续变动', '更邪门——恰好能摆出两个不同的三角形'], gans: 2,
          verdict: '<b>两个解！</b>同一套条件，C 有两个合法位置，配出两把不同的钥匙——所以 <b>SSA 不能作为判定</b>。去下一节"SSA 悬案"做完整的现场勘查。' }
      ];
      let cur = 0, done = new Set(), tried = false, guessed = false, dragging = null;
      let state = {};

      function lvChips() {
        $('m14-klvls').innerHTML = LV.map((l, i) =>
          `<button class="lc${done.has(i) ? ' ok' : ''}${i === cur ? ' cur' : ''}" data-i="${i}">${l.n}</button>`).join('');
        $('m14-klvls').querySelectorAll('.lc').forEach(b => b.addEventListener('click', () => load(+b.dataset.i)));
      }
      function computeC(l) {
        if (l.type === 'locked') {
          if (l.kind === 'SSS') {
            const x = (l.c * l.c + l.b * l.b - l.a * l.a) / (2 * l.c);
            return [A[0] + x, A[1] - Math.sqrt(Math.max(1, l.b * l.b - x * x))];
          }
          if (l.kind === 'SAS') { const u = dirUp(l.Adeg); return [A[0] + l.b * u[0], A[1] + l.b * u[1]]; }
          // ASA / AAS：两射线交点
          const c = l.kind === 'AAS' ? 170 * Math.sin(D2R(65)) / Math.sin(D2R(50)) * (170 / 170) : l.c;
          const cLen = l.kind === 'AAS' ? 170 * Math.sin(D2R(180 - l.Adeg - l.Bdeg)) / Math.sin(D2R(l.Adeg)) : l.c;
          const B = [A[0] + cLen, A[1]];
          const u = dirUp(l.Adeg), v = dirUp(180 - l.Bdeg);
          const t = ((B[0] - A[0]) * v[1] - (B[1] - A[1]) * v[0]) / (u[0] * v[1] - u[1] * v[0]);
          return [A[0] + u[0] * t, A[1] + u[1] * t];
        }
        return null;
      }
      function load(i) {
        cur = i; tried = false; guessed = done.has(i);
        const l = LV[i];
        state = {};
        if (l.type === 'free') state.C = [250, 120];
        if (l.type === 'twofree') { state.tB = 230; state.tC = 160; }
        if (l.type === 'circle') state.ang = 62;
        if (l.type === 'ray') state.t = 150;
        if (l.type === 'scale') state.tB = 220;
        if (l.type === 'ssa2') state.side = 1;
        $('m14-ktitle').textContent = `第 ${l.n} 道锁 · ${l.name}`;
        $('m14-kgiven').innerHTML = '给定：<b>' + l.given + '</b>';
        $('m14-kmsg').innerHTML = done.has(i) ? '<div class="explain">' + l.verdict + '</div>' : '';
        $('m14-kverdict').disabled = !done.has(i) && true;
        $('m14-kguess').innerHTML = '';
        if (!done.has(i)) {
          $('m14-kguess').appendChild(Y.guess({
            q: l.gq || '先猜：这些条件能把三角形锁死吗？',
            options: l.gopts || ['能，唯一确定', '不能，还能变'],
            answer: l.gans !== undefined ? l.gans : l.ans,
            reveal: '动手试试——拖那个红点。',
            onDone: () => { guessed = true; maybeEnable(); }
          }));
        }
        lvChips(); draw();
      }
      function maybeEnable() { if (guessed && tried && !done.has(cur)) $('m14-kverdict').disabled = false; }
      function draw() {
        const l = LV[cur];
        svg.innerHTML = '';
        el(svg, 'circle', { cx: A[0], cy: A[1], r: 5, fill: '#27231b' });
        el(svg, 'text', { x: A[0] - 20, y: A[1] + 6, 'font-size': 15, 'font-weight': 700 }, 'A');
        const put = (name, p, dx, dy) => el(svg, 'text', { x: p[0] + dx, y: p[1] + dy, 'font-size': 15, 'font-weight': 700 }, name);
        const handle = (p, id) => el(svg, 'circle', { cx: p[0], cy: p[1], r: 9, class: 'vhandle', 'data-h': id });

        if (l.type === 'free') {
          const B = [A[0] + l.c, A[1]];
          seg(svg, A, B, TEAL, 5); put('B', B, 8, 6);
          seg(svg, A, state.C, GRAY, 2, '6 5'); seg(svg, B, state.C, GRAY, 2, '6 5');
          put('C', state.C, 8, -8); handle(state.C, 'C');
        } else if (l.type === 'twofree') {
          const u = dirUp(l.Adeg);
          seg(svg, A, [A[0] + 320, A[1]], GRAY, 1.5, '4 5');
          seg(svg, A, [A[0] + 300 * u[0], A[1] + 300 * u[1]], GRAY, 1.5, '4 5');
          wedgeArc(svg, A, [1, 0], u, 26, TEAL);
          const B = [A[0] + state.tB, A[1]], C = [A[0] + state.tC * u[0], A[1] + state.tC * u[1]];
          seg(svg, A, B, GRAY, 2.5); seg(svg, A, C, GRAY, 2.5); seg(svg, B, C, GRAY, 2, '6 5');
          put('B', B, 8, 18); put('C', C, 8, -8);
          handle(B, 'B'); handle(C, 'C');
        } else if (l.type === 'circle') {
          const B = [A[0] + l.c, A[1]];
          seg(svg, A, B, TEAL, 5); put('B', B, 8, 6);
          el(svg, 'circle', { cx: A[0], cy: A[1], r: l.b, fill: 'none', stroke: GRAY, 'stroke-width': 1.5, 'stroke-dasharray': '5 6' });
          const u = dirUp(state.ang);
          const C = [A[0] + l.b * u[0], A[1] + l.b * u[1]];
          seg(svg, A, C, TEAL, 5); seg(svg, B, C, GRAY, 2, '6 5');
          put('C', C, 8, -8); handle(C, 'C');
        } else if (l.type === 'ray') {
          const B = [A[0] + l.c, A[1]];
          seg(svg, A, B, TEAL, 5); put('B', B, 8, 6);
          const u = dirUp(l.Adeg);
          seg(svg, A, [A[0] + 300 * u[0], A[1] + 300 * u[1]], GRAY, 1.5, '4 5');
          wedgeArc(svg, A, [1, 0], u, 26, TEAL);
          const C = [A[0] + state.t * u[0], A[1] + state.t * u[1]];
          seg(svg, A, C, GRAY, 2.5); seg(svg, B, C, GRAY, 2, '6 5');
          put('C', C, 8, -8); handle(C, 'C');
        } else if (l.type === 'scale') {
          const u = dirUp(l.Adeg), B = [A[0] + state.tB, A[1]];
          const v = dirUp(180 - l.Bdeg);
          const t = ((B[0] - A[0]) * v[1] - (B[1] - A[1]) * v[0]) / (u[0] * v[1] - u[1] * v[0]);
          const C = [A[0] + u[0] * t, A[1] + u[1] * t];
          seg(svg, A, B, GRAY, 2.5); seg(svg, A, C, GRAY, 2.5); seg(svg, B, C, GRAY, 2.5);
          wedgeArc(svg, A, [1, 0], u, 24, TEAL);
          wedgeArc(svg, B, [-1, 0], v, 24, TEAL);
          put('B', B, 8, 18); put('C', C, 8, -8); handle(B, 'B');
        } else if (l.type === 'locked') {
          const C = computeC(l);
          const cLen = l.kind === 'AAS' ? 170 * Math.sin(D2R(65)) / Math.sin(D2R(50)) : l.c;
          const B = [A[0] + cLen, A[1]];
          seg(svg, A, B, l.kind === 'AAS' ? GRAY : TEAL, l.kind === 'AAS' ? 2.5 : 5);
          seg(svg, A, C, (l.kind === 'SSS' || l.kind === 'SAS') ? TEAL : GRAY, (l.kind === 'SSS' || l.kind === 'SAS') ? 5 : 2.5);
          seg(svg, B, C, (l.kind === 'SSS' || l.kind === 'AAS') ? TEAL : GRAY, (l.kind === 'SSS' || l.kind === 'AAS') ? 5 : 2.5);
          if (l.Adeg) wedgeArc(svg, A, [1, 0], dirUp(l.Adeg), 26, IND);
          if (l.Bdeg) wedgeArc(svg, B, [-1, 0], dirUp(180 - l.Bdeg), 26, IND);
          put('B', B, 8, 18); put('C', C, 8, -8);
          const h = handle(C, 'C');
          h.style.fill = '#d6d1c4';
        } else if (l.type === 'ssa2') {
          const Bp = [A[0] + 160 * dirUp(38)[0], A[1] + 160 * dirUp(38)[1]];
          seg(svg, A, [A[0] + 330, A[1]], GRAY, 1.5, '4 5');
          seg(svg, A, Bp, TEAL, 5);
          wedgeArc(svg, A, [1, 0], dirUp(38), 26, IND);
          put('B', Bp, 8, -8);
          const dy = A[1] - Bp[1];
          const dx = Math.sqrt(120 * 120 - dy * dy);
          const C1 = [Bp[0] - dx, A[1]], C2 = [Bp[0] + dx, A[1]];
          [C1, C2].forEach((Cg, k) => {
            seg(svg, Bp, Cg, k + 1 === state.side ? TEAL : 'rgba(15,118,110,.25)', k + 1 === state.side ? 5 : 3);
            el(svg, 'circle', { cx: Cg[0], cy: Cg[1], r: 5, fill: k + 1 === state.side ? '#b91c1c' : 'rgba(185,28,28,.3)' });
          });
          const C = state.side === 1 ? C1 : C2;
          put(state.side === 1 ? 'C₁' : 'C₂', C, 8, 20);
          handle(C, 'C');
          el(svg, 'path', { d: `M ${Bp[0] - dx} ${A[1]} A 120 120 0 0 0 ${Bp[0] + dx} ${A[1]}`, fill: 'none', stroke: '#b7791f', 'stroke-width': 1.5, 'stroke-dasharray': '5 5' });
        }
      }
      function svgPt(e) {
        const r = svg.getBoundingClientRect();
        return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300];
      }
      svg.addEventListener('pointerdown', e => {
        const h = e.target.closest && e.target.getAttribute && e.target.getAttribute('data-h');
        if (!h) return;
        e.preventDefault();
        try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        const l = LV[cur];
        tried = true; maybeEnable();
        if (l.type === 'locked') {
          svg.style.transition = 'transform .08s';
          svg.style.transform = 'translateX(3px)';
          setTimeout(() => { svg.style.transform = 'translateX(-3px)'; }, 80);
          setTimeout(() => { svg.style.transform = ''; }, 160);
          return;
        }
        dragging = h;
      });
      svg.addEventListener('pointermove', e => {
        if (!dragging) return;
        const l = LV[cur], [x, y] = svgPt(e);
        if (l.type === 'free') state.C = [Math.max(20, Math.min(440, x)), Math.max(20, Math.min(230, y))];
        else if (l.type === 'circle') {
          let ang = Math.atan2(A[1] - y, x - A[0]) * 180 / Math.PI;
          state.ang = Math.max(14, Math.min(165, ang));
        } else if (l.type === 'ray') {
          const u = dirUp(l.Adeg);
          state.t = Math.max(50, Math.min(260, (x - A[0]) * u[0] + (y - A[1]) * u[1]));
        } else if (l.type === 'twofree') {
          if (dragging === 'B') state.tB = Math.max(110, Math.min(330, x - A[0]));
          else {
            const u = dirUp(l.Adeg);
            state.tC = Math.max(60, Math.min(250, (x - A[0]) * u[0] + (y - A[1]) * u[1]));
          }
        } else if (l.type === 'scale') state.tB = Math.max(130, Math.min(330, x - A[0]));
        else if (l.type === 'ssa2') {
          const Bp = [A[0] + 160 * dirUp(38)[0], A[1] + 160 * dirUp(38)[1]];
          state.side = x < Bp[0] ? 1 : 2;
        }
        draw();
      });
      const stopK = () => { dragging = null; };
      svg.addEventListener('pointerup', stopK);
      svg.addEventListener('pointercancel', stopK);
      $('m14-kverdict').addEventListener('click', () => {
        const l = LV[cur];
        if (done.has(cur)) return;
        done.add(cur);
        $('m14-kmsg').innerHTML = '<div class="explain">' + l.verdict + '</div>';
        $('m14-kverdict').disabled = true;
        lvChips();
        Y.toast('🗝️ 第 ' + l.n + ' 道锁：结论正确', true);
        if (done.size >= 10) { Y.ev('act:m14.keys'); Y.toast('🎉 十道锁全部试完——判定条件是你自己摸出来的', true); }
      });
      load(0);
    })();

    /* ================= ② SSA 翻车现场 ================= */
    (function ssaLab() {
      const svg = $('m14-ssasvg');
      svg.setAttribute('viewBox', '0 0 460 300');
      svg.classList.add('geo-svg');
      const A = [70, 250], AB = 160, ANG = 38;
      const B = [A[0] + AB * Math.cos(D2R(ANG)), A[1] - AB * Math.sin(D2R(ANG))];
      const H = A[1] - B[1];              // 高 ≈ 98.5
      let r = 130, touched = false;
      function draw() {
        svg.innerHTML = '';
        seg(svg, A, [440, A[1]], '#8b8271', 1.5, '4 5');
        seg(svg, A, B, '#0f766e', 5);
        wedgeArc(svg, A, [1, 0], dirUp(ANG), 26, '#4c51bf');
        el(svg, 'text', { x: A[0] - 16, y: A[1] + 18, 'font-size': 15, 'font-weight': 700 }, 'A');
        el(svg, 'text', { x: B[0] - 4, y: B[1] - 12, 'font-size': 15, 'font-weight': 700 }, 'B');
        el(svg, 'circle', { cx: B[0], cy: B[1], r: 4.5, fill: '#27231b' });
        el(svg, 'path', {
          d: `M ${B[0] - r} ${B[1]} A ${r} ${r} 0 0 0 ${B[0] + r} ${B[1]}`,
          fill: 'none', stroke: '#b7791f', 'stroke-width': 1.6, 'stroke-dasharray': '6 5', transform: `rotate(180 ${B[0]} ${B[1]})`
        });
        const msg = $('m14-ssamsg');
        if (r < H - 1.2) {
          msg.innerHTML = '<div class="explain">❌ <b>无解</b>：BC 太短，圆弧根本够不着底线——这样的三角形不存在。</div>';
        } else if (Math.abs(r - H) <= 1.2) {
          const F = [B[0], A[1]];
          seg(svg, B, F, '#0f766e', 5);
          el(svg, 'path', { d: `M ${F[0] - 12} ${F[1]} L ${F[0] - 12} ${F[1] - 12} L ${F[0]} ${F[1] - 12}`, fill: 'none', stroke: '#b91c1c', 'stroke-width': 2 });
          el(svg, 'text', { x: F[0] + 6, y: F[1] + 18, 'font-size': 15, 'font-weight': 700 }, 'C');
          seg(svg, A, F, 'rgba(76,81,191,.5)', 3);
          msg.innerHTML = '<div class="explain">⭐ <b>恰好一解</b>：BC 刚好等于"高"，垂直落地，∠C = 90°——<b>这就是 HL</b>：直角把摆动的边钉死了，SSA 在直角这里破例成立。</div>';
        } else if (r < AB) {
          if (touched) Y.ev('act:m14.ssa');
          const dx = Math.sqrt(r * r - H * H);
          const C1 = [B[0] - dx, A[1]], C2 = [B[0] + dx, A[1]];
          seg(svg, B, C1, '#c2410c', 4.5); seg(svg, A, C1, 'rgba(194,65,12,.45)', 3);
          seg(svg, B, C2, '#4c51bf', 4.5); seg(svg, A, C2, 'rgba(76,81,191,.45)', 3);
          el(svg, 'circle', { cx: C1[0], cy: C1[1], r: 5, fill: '#c2410c' });
          el(svg, 'circle', { cx: C2[0], cy: C2[1], r: 5, fill: '#4c51bf' });
          el(svg, 'text', { x: C1[0] - 10, y: C1[1] + 20, 'font-size': 14.5, 'font-weight': 700, fill: '#c2410c' }, 'C₁');
          el(svg, 'text', { x: C2[0] + 4, y: C2[1] + 20, 'font-size': 14.5, 'font-weight': 700, fill: '#4c51bf' }, 'C₂');
          msg.innerHTML = '<div class="explain">💥 <b>两个解</b>：橙色 △ABC₁ 和蓝色 △ABC₂ 用的是<b>同一套条件</b>（同样的 ∠A、AB、BC），形状却不同——这就是 SSA 不能当判定的铁证。</div>';
        } else {
          const dx = Math.sqrt(r * r - H * H);
          const C2 = [B[0] + dx, A[1]];
          seg(svg, B, C2, '#4c51bf', 4.5); seg(svg, A, C2, 'rgba(76,81,191,.45)', 3);
          el(svg, 'circle', { cx: C2[0], cy: C2[1], r: 5, fill: '#4c51bf' });
          el(svg, 'text', { x: C2[0] + 4, y: C2[1] + 20, 'font-size': 14.5, 'font-weight': 700 }, 'C');
          msg.innerHTML = '<div class="explain">✅ <b>只剩一解</b>：BC ≥ AB 时，左边那个交点跑到 A 的另一侧去了，不再合法。（顺带一提：BC 恰好垂直时的那一格，就是 HL。）</div>';
        }
      }
      $('m14-r').addEventListener('input', e => { touched = true; r = +e.target.value; $('m14-rv').textContent = Math.round(r); draw(); });
      root.querySelectorAll('#m14-ssa .chips .chip').forEach(c => c.addEventListener('click', () => {
        touched = true; r = +c.dataset.r; $('m14-r').value = r; $('m14-rv').textContent = Math.round(r); draw();
      }));
      $('m14-ssaguess').appendChild(Y.guess({
        q: '先猜：∠A、AB、BC 三个条件全部定死（角不夹在两边中间），能画出几个不同形状的三角形？',
        options: ['只有 1 个', '正好 2 个', '0 个、1 个、2 个都有可能'], answer: 2,
        reveal: '把 BC 滑杆从最短一路拖到最长——数数每一档各能画出几个。',
        onDone: () => {}
      }));
      draw();
    })();

    /* ================= ③ 对应侦探 ================= */
    (function detectLab() {
      const svg = $('m14-dsvg');
      svg.setAttribute('viewBox', '0 0 460 260');
      svg.classList.add('geo-svg');
      const TRI = [[0, 55], [110, 40], [45, -50]];
      const DL = [
        { rot: 40, flip: 1, labels: ['E', 'D', 'F'] },
        { rot: 150, flip: 1, labels: ['F', 'E', 'D'] },
        { rot: -100, flip: 1, labels: ['D', 'F', 'E'] },
        { rot: 20, flip: -1, labels: ['E', 'F', 'D'] },
        { rot: 130, flip: -1, labels: ['D', 'E', 'F'] },
        { rot: -70, flip: -1, labels: ['F', 'D', 'E'] }
      ];
      const COLP = ['#c2410c', '#0f766e', '#4c51bf'];
      let cur = 0, done = new Set(), sel = -1, pairs = {};
      function xf(p, lv, center) {
        const rad = D2R(lv.rot);
        const x = p[0] * lv.flip, y = p[1];
        return [center[0] + x * Math.cos(rad) - y * Math.sin(rad), center[1] + x * Math.sin(rad) + y * Math.cos(rad)];
      }
      function chips() {
        $('m14-dlvls').innerHTML = DL.map((l, i) =>
          `<button class="lc${done.has(i) ? ' ok' : ''}${i === cur ? ' cur' : ''}${i > 2 ? ' C' : ''}" data-i="${i}">${i + 1}</button>`).join('');
        $('m14-dlvls').querySelectorAll('.lc').forEach(b => b.addEventListener('click', () => { cur = +b.dataset.i; sel = -1; pairs = {}; draw(); chips(); }));
      }
      function ticks(g, p, u, v, count, col) {
        for (let k = 0; k < count; k++) wedgeArc(g, p, u, v, 16 + k * 5, col);
      }
      function draw() {
        const lv = DL[cur];
        svg.innerHTML = '';
        const LC = [105, 145], RC = [330, 135];
        const L = TRI.map(p => [LC[0] + p[0] - 50, LC[1] + p[1]]);
        const R = TRI.map(p => xf(p, lv, RC));
        el(svg, 'polygon', { points: L.map(p => p.join(',')).join(' '), fill: 'rgba(15,118,110,.12)', stroke: '#0f766e', 'stroke-width': 2.5 });
        el(svg, 'polygon', { points: R.map(p => p.join(',')).join(' '), fill: 'rgba(76,81,191,.12)', stroke: '#4c51bf', 'stroke-width': 2.5 });
        ['A', 'B', 'C'].forEach((n, i) => {
          const u = [L[(i + 1) % 3][0] - L[i][0], L[(i + 1) % 3][1] - L[i][1]];
          const v = [L[(i + 2) % 3][0] - L[i][0], L[(i + 2) % 3][1] - L[i][1]];
          const nu = Math.hypot(u[0], u[1]), nv = Math.hypot(v[0], v[1]);
          ticks(svg, L[i], [u[0] / nu, u[1] / nu], [v[0] / nv, v[1] / nv], i + 1, COLP[i]);
          el(svg, 'circle', { cx: L[i][0], cy: L[i][1], r: 9, fill: sel === i ? '#b7791f' : '#fff', stroke: '#0f766e', 'stroke-width': 2, 'data-side': 'L', 'data-i': i, style: 'cursor:pointer' });
          el(svg, 'text', { x: L[i][0] - 4, y: L[i][1] - 14, 'font-size': 14, 'font-weight': 700 }, n);
        });
        R.forEach((p, i) => {
          const u = [R[(i + 1) % 3][0] - p[0], R[(i + 1) % 3][1] - p[1]];
          const v = [R[(i + 2) % 3][0] - p[0], R[(i + 2) % 3][1] - p[1]];
          const nu = Math.hypot(u[0], u[1]), nv = Math.hypot(v[0], v[1]);
          ticks(svg, p, [u[0] / nu, u[1] / nu], [v[0] / nv, v[1] / nv], i + 1, COLP[i]);
          el(svg, 'circle', { cx: p[0], cy: p[1], r: 9, fill: '#fff', stroke: '#4c51bf', 'stroke-width': 2, 'data-side': 'R', 'data-i': i, style: 'cursor:pointer' });
          el(svg, 'text', { x: p[0] - 4, y: p[1] - 14, 'font-size': 14, 'font-weight': 700 }, lv.labels[i]);
        });
        Object.keys(pairs).forEach(li => {
          seg(svg, L[+li], R[pairs[li]], 'rgba(183,121,31,.7)', 2.5);
        });
      }
      svg.addEventListener('pointerdown', e => {
        const side = e.target.getAttribute && e.target.getAttribute('data-side');
        if (!side) return;
        const i = +e.target.getAttribute('data-i');
        if (side === 'L') { sel = i; draw(); return; }
        if (sel < 0) return;
        pairs[sel] = i; sel = -1;
        draw();
        if (Object.keys(pairs).length === 3) check();
      });
      function check() {
        const lv = DL[cur];
        const ok = [0, 1, 2].every(i => pairs[i] === i);
        if (ok) {
          done.add(cur);
          const seq = [0, 1, 2].map(i => lv.labels[i]).join('');
          $('m14-dmsg').innerHTML = `<div class="explain">✓ 连对了。全等式按对应顶点顺序写：<b style="font-size:19px">△<span style="color:${COLP[0]}">A</span><span style="color:${COLP[1]}">B</span><span style="color:${COLP[2]}">C</span> ≌ △<span style="color:${COLP[0]}">${seq[0]}</span><span style="color:${COLP[1]}">${seq[1]}</span><span style="color:${COLP[2]}">${seq[2]}</span></b>${lv.flip === -1 ? '<br>这关是<b>翻转型</b>——位置感靠不住，角上的记号才是铁证（G0 的手性觉醒还记得吧）。' : ''}</div>`;
          chips();
          if (done.size >= 4) Y.ev('act:m14.detect');
          if (cur < DL.length - 1) { cur++; sel = -1; pairs = {}; setTimeout(() => { draw(); chips(); }, 900); }
        } else {
          $('m14-dmsg').innerHTML = '<div class="explain">✗ 有连错的——别看位置，<b>数角上的弧线记号</b>：一道对一道，两道对两道。再来。</div>';
          pairs = {}; sel = -1;
          setTimeout(draw, 500);
        }
      }
      $('m14-dreset').addEventListener('click', () => { pairs = {}; sel = -1; draw(); });
      chips(); draw();
    })();

    /* ================= ④ 证明脚手架 ================= */
    (function proofLab() {
      const figTri2 = (svg, pts1, pts2, labels) => {
        el(svg, 'polygon', { points: pts1.map(p => p.join(',')).join(' '), fill: 'rgba(15,118,110,.1)', stroke: '#0f766e', 'stroke-width': 2 });
        el(svg, 'polygon', { points: pts2.map(p => p.join(',')).join(' '), fill: 'rgba(76,81,191,.1)', stroke: '#4c51bf', 'stroke-width': 2 });
        labels.forEach(l => el(svg, 'text', { x: l[1], y: l[2], 'font-size': 13, 'font-weight': 700 }, l[0]));
      };
      const PROBLEMS = [
        {
          id: 'pf1', mode: 1, title: '例 1（选理由）',
          given: 'AB = CB，BD 平分 ∠ABC', prove: '△ABD ≌ △CBD',
          figure(svg) {
            const B = [40, 75], A2 = [160, 22], C2 = [160, 128], D = [255, 75];
            [[B, A2], [B, C2], [B, D], [A2, D], [C2, D]].forEach(s => seg(svg, s[0], s[1], '#57503f', 2));
            [['B', 28, 80], ['A', 158, 16], ['C', 158, 144], ['D', 262, 80]].forEach(l => el(svg, 'text', { x: l[1], y: l[2], 'font-size': 13, 'font-weight': 700 }, l[0]));
          },
          lines: [
            { frame: '在 △ABD 和 △CBD 中：' },
            { stmt: 'AB = CB', reason: '已知', reasonOpts: ['已知', '公共边', '对顶角相等', 'SAS'] },
            { stmt: '∠ABD = ∠CBD', reason: '角平分线的定义', reasonOpts: ['角平分线的定义', '已知', '两直线平行，内错角相等', '对顶角相等'] },
            { stmt: 'BD = BD', reason: '公共边', reasonOpts: ['公共边', '已知', '中点的定义', '对顶角相等'] },
            { concl: '△ABD ≌ △CBD', reason: 'SAS', reasonOpts: ['SAS', 'SSS', 'ASA', 'AAS'] }
          ]
        },
        {
          id: 'pf2', mode: 1, title: '例 2（选理由）',
          given: 'AB 与 CD 相交于点 O，OA = OB，OC = OD', prove: '△AOC ≌ △BOD',
          figure(svg) {
            const A2 = [40, 25], Bp = [260, 125], C2 = [40, 125], D = [260, 25], O = [150, 75];
            seg(svg, A2, Bp, '#57503f', 2); seg(svg, C2, D, '#57503f', 2);
            seg(svg, A2, C2, '#0f766e', 2); seg(svg, Bp, D, '#4c51bf', 2);
            [['A', 30, 22], ['B', 266, 132], ['C', 30, 138], ['D', 266, 22], ['O', 152, 66]].forEach(l => el(svg, 'text', { x: l[1], y: l[2], 'font-size': 13, 'font-weight': 700 }, l[0]));
          },
          lines: [
            { frame: '在 △AOC 和 △BOD 中：' },
            { stmt: 'OA = OB', reason: '已知', reasonOpts: ['已知', '公共边', '对顶角相等', '中点的定义'] },
            { stmt: '∠AOC = ∠BOD', reason: '对顶角相等', reasonOpts: ['对顶角相等', '已知', '公共边', '角平分线的定义'] },
            { stmt: 'OC = OD', reason: '已知', reasonOpts: ['已知', '对顶角相等', '公共边', 'SSS'] },
            { concl: '△AOC ≌ △BOD', reason: 'SAS', reasonOpts: ['SAS', 'ASA', 'SSS', 'HL'] }
          ]
        },
        {
          id: 'pf3', mode: 2, title: '例 3（补语句）· 四边形 ABCD，对角线 BD',
          given: 'AB = CD，AD = CB', prove: '△ABD ≌ △CDB',
          figure(svg) {
            const A2 = [70, 25], Bp = [250, 25], C2 = [230, 125], D = [50, 125];
            [[A2, Bp], [Bp, C2], [C2, D], [D, A2]].forEach(s => seg(svg, s[0], s[1], '#57503f', 2));
            seg(svg, Bp, D, '#b7791f', 2);
            [['A', 60, 20], ['B', 256, 20], ['C', 236, 140], ['D', 38, 140]].forEach(l => el(svg, 'text', { x: l[1], y: l[2], 'font-size': 13, 'font-weight': 700 }, l[0]));
          },
          lines: [
            { frame: '在 △ABD 和 △CDB 中：' },
            { stmt: 'AB = CD', reason: '已知', stmtOpts: ['AB = CD', 'AB = BD', '∠A = ∠C'] },
            { stmt: 'AD = CB', reason: '已知', stmtOpts: ['AD = CB', 'AD = BD', 'AB = CB'] },
            { stmt: 'BD = DB', reason: '公共边', stmtOpts: ['BD = DB', 'AB = CD', 'AC = AC'] },
            { concl: '△ABD ≌ △CDB', reason: 'SSS', reasonOpts: ['SSS', 'SAS', 'ASA', 'AAS'] }
          ]
        },
        {
          id: 'pf4', mode: 2, title: '例 4（补语句）· 注意"角边角"的三明治结构',
          given: '∠B = ∠E，BC = EF，∠C = ∠F', prove: '△ABC ≌ △DEF',
          figure(svg) {
            figTri2(svg, [[40, 120], [130, 120], [75, 30]], [[170, 120], [260, 120], [205, 30]],
              [['B', 30, 134], ['C', 134, 134], ['A', 70, 24], ['E', 160, 134], ['F', 264, 134], ['D', 200, 24]]);
          },
          lines: [
            { frame: '在 △ABC 和 △DEF 中：' },
            { stmt: '∠B = ∠E', reason: '已知', stmtOpts: ['∠B = ∠E', '∠A = ∠D', 'BC = EF'] },
            { stmt: 'BC = EF', reason: '已知', stmtOpts: ['BC = EF', 'AB = DE', '∠C = ∠F'] },
            { stmt: '∠C = ∠F', reason: '已知', stmtOpts: ['∠C = ∠F', '∠B = ∠E', 'AC = DF'] },
            { concl: '△ABC ≌ △DEF', reason: 'ASA', reasonOpts: ['ASA', 'AAS', 'SAS', 'SSS'] }
          ]
        },
        {
          id: 'pf5', mode: 3, title: '例 5（白板组装）',
          given: 'AC 与 BD 相交于点 O，∠A = ∠D，OB = OC', prove: '△AOB ≌ △DOC',
          figure(svg) {
            const A2 = [40, 25], Bp = [40, 125], C2 = [260, 125], D = [260, 25], O = [150, 75];
            seg(svg, A2, C2, '#57503f', 2); seg(svg, Bp, D, '#57503f', 2);
            seg(svg, A2, Bp, '#0f766e', 2); seg(svg, D, C2, '#4c51bf', 2);
            [['A', 30, 22], ['B', 30, 138], ['C', 266, 138], ['D', 266, 22], ['O', 152, 66]].forEach(l => el(svg, 'text', { x: l[1], y: l[2], 'font-size': 13, 'font-weight': 700 }, l[0]));
          },
          lines: [
            { frame: '在 △AOB 和 △DOC 中：' },
            { stmt: '∠A = ∠D', reason: '已知' },
            { stmt: '∠AOB = ∠DOC', reason: '对顶角相等' },
            { stmt: 'OB = OC', reason: '已知' },
            { concl: '△AOB ≌ △DOC', reason: 'AAS' }
          ]
        },
        {
          id: 'pf6', mode: 3, title: '例 6（白板组装）· 直角三角形',
          given: '∠ACB = ∠DFE = 90°，AB = DE，BC = EF', prove: 'Rt△ABC ≌ Rt△DEF',
          figure(svg) {
            figTri2(svg, [[60, 120], [140, 120], [60, 30]], [[180, 120], [260, 120], [180, 30]],
              [['C', 48, 134], ['B', 144, 134], ['A', 48, 24], ['F', 168, 134], ['E', 264, 134], ['D', 168, 24]]);
            el(svg, 'path', { d: 'M 60 108 L 72 108 L 72 120', fill: 'none', stroke: '#b91c1c', 'stroke-width': 1.8 });
            el(svg, 'path', { d: 'M 180 108 L 192 108 L 192 120', fill: 'none', stroke: '#b91c1c', 'stroke-width': 1.8 });
          },
          lines: [
            { frame: '在 Rt△ABC 和 Rt△DEF 中：' },
            { stmt: 'AB = DE', reason: '已知 · 斜边' },
            { stmt: 'BC = EF', reason: '已知 · 直角边' },
            { concl: 'Rt△ABC ≌ Rt△DEF', reason: 'HL' }
          ]
        }
      ];
      const doneSet = new Set();
      function renderTab(t) {
        const area = $('m14-parea');
        area.innerHTML = '';
        PROBLEMS.filter(p => p.mode === +t).forEach(p => {
          const box = document.createElement('div');
          box.className = 'card';
          box.style.marginTop = '12px';
          area.appendChild(box);
          window.ProofKit.mount(box, p, {
            onDone() {
              if (doneSet.has(p.id)) return;
              doneSet.add(p.id);
              Y.ev('act:m14.' + p.id);
              Y.toast('✍️ ' + p.title.split('（')[0] + ' 完成', true);
              const pair = { 1: ['pf1', 'pf2'], 2: ['pf3', 'pf4'], 3: ['pf5', 'pf6'] }[p.mode];
              if (pair.every(id => Y.has('act:m14.' + id))) {
                Y.ev('act:m14.proof' + p.mode);
                if (p.mode === 3) Y.toast('🏆 白板证明毕业——你已经能独立写全等证明了', true);
              }
            }
          });
        });
      }
      $('m14-ptabs').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('m14-ptabs').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        renderTab(b.dataset.t);
      });
      renderTab(1);
    })();

    /* ================= ⑤ 角平分线 ================= */
    (function bisectLab() {
      const svg = $('m14-bsvg');
      svg.setAttribute('viewBox', '0 0 460 300');
      svg.classList.add('geo-svg');
      const O = [55, 150], HALF = 26;
      const U1 = dirUp(HALF), U2 = dirUp(-HALF);
      let mode = 'prop', t = 200, Q = [230, 150], dots = [], propDragged = false, drag = false;
      const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
      function distFoot(P, u) {
        const v = [P[0] - O[0], P[1] - O[1]];
        const d = Math.abs(cross(u, v));
        const s = v[0] * u[0] + v[1] * u[1];
        return { d, foot: [O[0] + u[0] * s, O[1] + u[1] * s] };
      }
      function rightMark(g, F, towardP, towardO) {
        const m = 9;
        const p1 = [F[0] + towardO[0] * m, F[1] + towardO[1] * m];
        const p2 = [p1[0] + towardP[0] * m, p1[1] + towardP[1] * m];
        const p3 = [F[0] + towardP[0] * m, F[1] + towardP[1] * m];
        el(g, 'path', { d: `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]}`, fill: 'none', stroke: '#b91c1c', 'stroke-width': 1.6 });
      }
      function draw() {
        svg.innerHTML = '';
        seg(svg, O, [O[0] + 400 * U1[0], O[1] + 400 * U1[1]], '#57503f', 3);
        seg(svg, O, [O[0] + 400 * U2[0], O[1] + 400 * U2[1]], '#57503f', 3);
        seg(svg, O, [O[0] + 400, O[1]], '#b7791f', 2, '8 6');
        el(svg, 'text', { x: O[0] - 16, y: O[1] + 6, 'font-size': 15, 'font-weight': 700 }, 'O');
        el(svg, 'text', { x: 402, y: 148, 'font-size': 12.5, fill: '#b45309' }, '平分线');
        if (mode === 'prop') {
          const P = [O[0] + t, O[1]];
          const f1 = distFoot(P, U1), f2 = distFoot(P, U2);
          seg(svg, P, f1.foot, '#0f766e', 2.5);
          seg(svg, P, f2.foot, '#4c51bf', 2.5);
          const to1 = [(f1.foot[0] - P[0]), (f1.foot[1] - P[1])], n1 = Math.hypot(to1[0], to1[1]);
          rightMark(svg, f1.foot, [-to1[0] / n1, -to1[1] / n1], [-U1[0], -U1[1]]);
          const to2 = [(f2.foot[0] - P[0]), (f2.foot[1] - P[1])], n2 = Math.hypot(to2[0], to2[1]);
          rightMark(svg, f2.foot, [-to2[0] / n2, -to2[1] / n2], [-U2[0], -U2[1]]);
          el(svg, 'circle', { cx: P[0], cy: P[1], r: 9, class: 'vhandle', 'data-h': 'P' });
          el(svg, 'text', { x: P[0] - 4, y: P[1] + 24, 'font-size': 14.5, 'font-weight': 700 }, 'P');
          $('m14-bmsg').innerHTML =
            `<p>P 到上边的距离 = <b style="color:#0f766e">${f1.d.toFixed(1)}</b><br>P 到下边的距离 = <b style="color:#4c51bf">${f2.d.toFixed(1)}</b></p>
             <div class="stdline">性质：角平分线上的点，到角两边的距离相等（距离 = 垂线段的长度）。</div>
             <p class="hint">拖 P 沿线跑——两个数字永远一起变、永远相等。</p>`;
        } else {
          dots.forEach(d0 => el(svg, 'circle', { cx: d0[0], cy: d0[1], r: 5.5, fill: '#b7791f' }));
          const f1 = distFoot(Q, U1), f2 = distFoot(Q, U2);
          seg(svg, Q, f1.foot, 'rgba(15,118,110,.6)', 2);
          seg(svg, Q, f2.foot, 'rgba(76,81,191,.6)', 2);
          const equal = Math.abs(f1.d - f2.d) < 2.5;
          el(svg, 'circle', { cx: Q[0], cy: Q[1], r: 9, class: 'vhandle', 'data-h': 'Q', fill: equal ? '#b7791f' : undefined });
          $('m14-bmsg').innerHTML =
            `<p>Q 到两边的距离：<b style="color:#0f766e">${f1.d.toFixed(1)}</b> 和 <b style="color:#4c51bf">${f2.d.toFixed(1)}</b>${equal ? ' —— <b style="color:var(--gold)">相等！留下一枚金点</b>' : ''}</p>
             <p class="hint">自由拖动 Q，找到"到两边距离相等"的位置（变金就是找到了），多收集几枚金点。</p>
             ${dots.length >= 3 ? '<div class="stdline">判定：到角两边距离相等的点，在这个角的平分线上——你收集的金点，全排在虚线上。</div>' : `<p>已收集金点：<b>${dots.length}</b> / 3</p>`}`;
          if (equal && (!dots.length || Math.hypot(Q[0] - dots[dots.length - 1][0], Q[1] - dots[dots.length - 1][1]) > 30)) {
            dots.push(Q.slice());
            if (dots.length >= 3 && propDragged) Y.ev('act:m14.bisect');
          }
        }
      }
      function svgPt(e) {
        const r = svg.getBoundingClientRect();
        return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 300];
      }
      svg.addEventListener('pointerdown', e => {
        if (e.target.getAttribute && e.target.getAttribute('data-h')) {
          drag = true;
          try { svg.setPointerCapture(e.pointerId); } catch (err) {}
          e.preventDefault();
        }
      });
      svg.addEventListener('pointermove', e => {
        if (!drag) return;
        const [x, y] = svgPt(e);
        if (mode === 'prop') {
          t = Math.max(60, Math.min(380, x - O[0]));
          propDragged = true;
        } else {
          const v = [x - O[0], y - O[1]];
          const ang = Math.atan2(-(v[1]), v[0]) * 180 / Math.PI;
          const r0 = Math.max(50, Math.min(390, Math.hypot(v[0], v[1])));
          const a = Math.max(-HALF + 4, Math.min(HALF - 4, ang));
          Q = [O[0] + r0 * Math.cos(D2R(a)), O[1] - r0 * Math.sin(D2R(a))];
        }
        draw();
      });
      const stopB = () => { drag = false; };
      svg.addEventListener('pointerup', stopB);
      svg.addEventListener('pointercancel', stopB);
      $('m14-bmode').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('m14-bmode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        mode = b.dataset.m;
        draw();
      });
      draw();
    })();

    /* ================= 知识卡 ================= */
    window.ExplainKit.cards($('m14-cardlist'), [
      { emoji: '🧩', title: '全等形与对应关系', rule: '能完全重合的两个图形叫全等形；≌ 两边字母按<b>对应顶点顺序</b>书写。', eg: '△ABC ≌ △DEF',
        steps: [{ t: 'A↔D、B↔E、C↔F', r: '顺序对齐' }, { t: 'AB 对应 DE、∠A 对应 ∠D', r: '照字母顺序抄', key: true }],
        trap: '"完全重合"=G0 里靠移、转、翻叠上。找对应看角上的记号，别看位置——翻转型最容易配错。' },
      { emoji: '⚖️', title: '全等三角形的性质', rule: '全等三角形的<b>对应边相等、对应角相等</b>（周长、面积也相等）。',
        steps: [{ t: '△ABC ≌ △DEF', r: '已知全等' }, { t: '→ AB=DE、∠A=∠D …', r: '对应量全部相等', key: true }],
        trap: '摆放方向可以完全不同，翻过去照样全等——方向不算"内在量"。' },
      { emoji: '🔩', title: 'SSS', rule: '<b>三边</b>分别相等的两个三角形全等。',
        steps: [{ t: '三条边定死', r: '形状唯一确定' }, { t: '配钥匙第 6 关"拖不动"', r: '就是它', key: true }],
        trap: '三边定死形状——这正是"三角形稳定性"的数学本质。' },
      { emoji: '📌', title: 'SAS', rule: '两边和它们的<b>夹角</b>分别相等，两三角形全等。',
        steps: [{ t: '∠B 夹在 AB、BC 之间', r: '两边一夹角' }, { t: '→ SAS 成立', r: '', key: true }],
        trap: '重点在"夹"：角必须在两条边中间。角不夹（SSA）就会翻车（见下）。' },
      { emoji: '📐', title: 'ASA 与 AAS', rule: '两角及其<b>夹边</b>（ASA），或两角及其中一角的<b>对边</b>（AAS），两三角形全等。',
        steps: [{ t: '两个角一定', r: '第三个角被内角和定死' }, { t: 'AAS 本质就是 ASA', r: '', key: true }],
        trap: '但三个角全等（AAA）只能保证<b>形状相同</b>——那是相似，不是全等。' },
      { emoji: '💥', title: 'SSA 反例与 HL', rule: 'SSA（两边及其中一边的对角）<b>不能</b>判定全等——摆动的边可能给出两个解。唯一例外：直角三角形的 HL（斜边+一条直角边）。',
        steps: [{ t: 'BC 太短 / 中等 / 很长', r: '无解 / 两解 / 一解' }, { t: 'BC 恰好垂直', r: '一解 = HL', key: true }],
        trap: 'HL 表面是 SSA，但直角把圆弧与底线的交点钉死成一个——所以它例外成立。' },
      { emoji: '✒️', title: '全等证明的标准格式', rule: '在 △×× 和 △×× 中 → 三行条件（每行带理由）→ ∴ △××≌△××（判定名）。', eg: '格式',
        steps: [{ t: '在 △ABD 和 △CBD 中：', r: '开头三角号' }, { t: 'AB=CB（已知）… BD=BD（公共边）', r: '每行都要写理由', key: true }, { t: '∴ △ABD≌△CBD（SAS）', r: '结尾写判定名' }],
        trap: '公共边、对顶角也是条件，必须写出来；理由不写等于没证。字母全程按对应关系排。' },
      { emoji: '🪞', title: '角平分线的性质', rule: '角平分线上的点，到角<b>两边的距离相等</b>（距离 = 垂线段的长度）。',
        steps: [{ t: 'P 在平分线上', r: '' }, { t: '→ P 到两边距离相等', r: '少证一次全等', key: true }],
        trap: '看到"角平分线 + 两条垂线段"，直接用它得距离相等，别再吭哧证全等。' },
      { emoji: '🧭', title: '角平分线的判定', rule: '到角两边<b>距离相等</b>的点，在这个角的平分线上。',
        steps: [{ t: '性质：从线 → 距离', r: '' }, { t: '判定：从距离 → 线', r: '方向相反', key: true }],
        trap: '性质和判定互为"往返票"，用之前先想清走哪个方向。' },
      { emoji: '📜', title: '史卡 · 公理化方法', rule: '从少数公认的基本事实（公理）出发，用逻辑推出整座几何大厦。',
        why: '欧几里得《几何原本》两千年前就这么干了。你这一章学的每个判定，教材都给了推理来源——证明不是刁难，是数学的"讲理传统"。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() {
      const b = Y.quizBest('m14');
      $('m14-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : '';
    }
    bestLine();
    $('m14-quizgo').addEventListener('click', () => {
      $('m14-quizgo').style.display = 'none';
      Y.quizStart($('m14-quizbox'), 'm14', () => {
        $('m14-quizgo').style.display = '';
        $('m14-quizgo').textContent = '再测一次';
        bestLine();
      });
    });

    return { cleanup() {} };
  }
};
