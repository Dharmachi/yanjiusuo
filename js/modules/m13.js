/* m13 · 第十三章 三角形 —— 几何从"量一量"升级成"讲道理"的第一章。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.m13 = {
  id: 'm13', subject: 'math', emoji: '📐',
  title: '三角形', subtitle: '从量一量，到讲道理',
  wave: 'M3',
  nodes: [
    { id: 'm13-n1', label: '三边关系', needs: ['act:m13.tri', 'any:q:m13q1|q:m13q2'] },
    { id: 'm13-n2', label: '高·中线·角平分线', needs: ['act:m13.height', 'any:q:m13q3|q:m13q4'] },
    { id: 'm13-n3', label: '稳定性', needs: ['act:m13.stable', 'q:m13q10'] },
    { id: 'm13-n4', label: '内角和·从量到证', needs: ['act:m13.sum', 'act:m13.proof', 'q:m13q5'] },
    { id: 'm13-n5', label: '外角定理', needs: ['act:m13.ext', 'any:q:m13q6|q:m13q7'] },
    { id: 'm13-n6', label: '多边形内角和', needs: ['act:m13.polyin', 'q:m13q8'] },
    { id: 'm13-n7', label: '外角和·绕场一周', needs: ['act:m13.polyout', 'q:m13q9'] },
    { id: 'm13-n8', label: '重心·综合实践', needs: ['act:m13.gravity'] },
    /* —— 逐节精读（跟课层）—— */
    { id: 'm13-n9', label: '13.1 双轴分类', needs: ['act:m13.classify', 'any:q:m13s1q1|q:m13s1q2'] },
    { id: 'm13-n10', label: '13.1 第三角速判', needs: ['act:m13.thirdangle', 'any:q:m13s1q3|q:m13s1q6'] },
    { id: 'm13-n11', label: '13.2 第三边取值范围', needs: ['act:m13.range', 'any:q:m13s2q2|q:m13s2q3'] },
    { id: 'm13-n12', label: '13.2 等腰分类讨论', needs: ['act:m13.isodisc', 'any:q:m13s2q5|q:m13s2q6'] },
    { id: 'm13-n13', label: '13.3 角度推理链', needs: ['act:m13.anglechain', 'any:q:m13s3q2|q:m13s3q4'] },
    { id: 'm13-n14', label: '13.3 多边形公式', needs: ['act:m13.polyformula', 'any:q:m13s3q6|q:m13s3q8'] }
  ],
  taskIds: ['m13.gravity', 'm13.truss'],

  render(root, Y) {
    const G = window.GeoKit;
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const COLS = ['#c2410c', '#0f766e', '#4c51bf'];

    /* 小工具：方向、角度扇形 */
    const dir = (a, b) => { const d = [b[0] - a[0], b[1] - a[1]]; const L = Math.hypot(d[0], d[1]) || 1; return [d[0] / L, d[1] / L]; };
    const wedge = (p, u, v, r) => {
      const sa = Math.atan2(u[1], u[0]), ea = Math.atan2(v[1], v[0]);
      let d = ea - sa;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      const sweep = d > 0 ? 1 : 0;
      const P1 = [p[0] + r * Math.cos(sa), p[1] + r * Math.sin(sa)];
      const P2 = [p[0] + r * Math.cos(ea), p[1] + r * Math.sin(ea)];
      return `M ${p[0]} ${p[1]} L ${P1[0]} ${P1[1]} A ${r} ${r} 0 0 ${sweep} ${P2[0]} ${P2[1]} Z`;
    };
    const svgEl = (g, tag, attrs) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
      g.appendChild(e); return e;
    };

    root.innerHTML = `
      <nav class="secnav">
        ${[['m13-intro', '引入'], ['m13-side', '三边'], ['m13-sum', '内角·证明'], ['m13-lines', '三条线段'],
        ['m13-stable', '稳定性'], ['m13-poly', '多边形'], ['m13-cards', '知识卡'], ['m13-quiz', '自测'], ['m13-tasks', '实践']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="m13-intro">
        <div class="card" style="border-top:3px solid var(--math)">
          <p class="intro-hook">从这一章起，几何从<b>"量一量"</b>升级成<b>"讲道理"</b>。<br>
          你在运动场玩出来的直觉——转弯角、内错角、拼得上拼不上——现在要一个个立正站好，变成定理。</p>
          <p class="hint">全章带两枚徽章：🧪 = 实验发现（量出来的猜想），✓ = 推理证明（讲清道理）。盯住它们什么时候出现。</p>
        </div>
      </section>

      <section id="m13-sections">
        <div class="sec-title"><span class="em">📚</span>逐节精读 · 跟课层</div>
        <p class="hint" style="margin:0 2px 8px">下面的游乐场先玩懂概念；开学跟课时，一节一节进这里磨考点。</p>
        <div class="secgrid" id="m13-secgrid"></div>
      </section>

      <section id="m13-side">
        <div class="sec-title"><span class="em">🥢</span>三边拼接器 · 什么样的三根棍子能围成三角形</div>
        <div class="split">
          <div class="card">
            <svg id="m13-sidesvg"></svg>
            <div class="ctl"><label>边 ① <span class="val" id="m13-av">5</span></label>
              <input type="range" id="m13-a" min="2" max="15" step="1" value="5"></div>
            <div class="ctl"><label>边 ② <span class="val" id="m13-bv">4</span></label>
              <input type="range" id="m13-b" min="2" max="15" step="1" value="4"></div>
            <div class="ctl"><label>底边 <span class="val" id="m13-cv">6</span></label>
              <input type="range" id="m13-c" min="2" max="15" step="1" value="6"></div>
          </div>
          <div class="card">
            <h3>试这几组</h3>
            <div id="m13-guessbox"></div>
            <div class="chips" id="m13-presets">
              ${[[3, 4, 5], [5, 3, 9], [5, 3, 8], [6, 6, 6], [2, 9, 10]].map(p =>
                `<button class="chip" data-p="${p.join(',')}">${p.join('、')}</button>`).join('')}
            </div>
            <div id="m13-sidemsg" class="explain" style="display:none"></div>
            <hr class="divider">
            <p style="font-size:16.5px">规律自述：三角形任意两边之和
              <select class="blank" id="m13-say1"><option value="">？</option><option>大于</option><option>等于</option><option>小于</option></select>
              第三边。</p>
            <div id="m13-say1r"></div>
          </div>
        </div>
      </section>

      <section id="m13-sum">
        <div class="sec-title"><span class="em">🧭</span>内角和：先量，再证</div>
        <div class="split">
          <div class="card">
            <h3>🧪 实验台 <span class="hint">随便拖三个顶点</span></h3>
            <svg id="m13-sumsvg"></svg>
            <p class="anglebig" style="margin:8px 0"><span id="m13-sumval">180.0</span>°<small> · 三个内角之和</small></p>
            <div class="btnrow"><button class="btn" id="m13-tearbtn">🧩 开拼角尺</button></div>
            <p class="hint" id="m13-tearhint">把三个角"搬"到一条直线上对齐——开了拼角尺再拖顶点看看。</p>
          </div>
          <div class="card">
            <h3>✓ 证明台 <span class="hint">量一万个也只是猜想，证一次就管所有三角形</span></h3>
            <svg id="m13-proofsvg"></svg>
            <div class="btnrow"><button class="btn primary" id="m13-proofbtn">第一步：过顶点 A 作 BC 的平行线</button></div>
            <div id="m13-proofmsg"></div>
          </div>
        </div>
        <div class="card">
          <h3>↗️ 多出来的角 <span class="hint">把一条边延长出去</span></h3>
          <div class="split">
            <div><svg id="m13-extsvg"></svg></div>
            <div>
              <p id="m13-extline" style="font-size:17px;font-family:ui-monospace,Menlo,monospace"></p>
              <p class="hint">拖动顶点，盯住上面那行算式——三个数字之间藏着什么关系？（顺带一提：金色这个角，就是 G0 里小人的"转弯角"。）</p>
              <p style="font-size:16.5px">规律自述：外角等于
                <select class="blank" id="m13-say2"><option value="">？</option><option>与它不相邻的两个内角之和</option><option>相邻内角</option><option>任意两个内角之和</option></select>。</p>
              <div id="m13-say2r"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="m13-lines">
        <div class="sec-title"><span class="em">📏</span>三条重要线段 · 高在哪里</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="m13-linemode">
              <button class="chip on" data-m="h">高</button>
              <button class="chip" data-m="m">中线</button>
              <button class="chip" data-m="b">角平分线</button>
            </div>
            <svg id="m13-linesvg2"></svg>
          </div>
          <div class="card">
            <div id="m13-linemsg2"><p><b>挑战：把三角形拖得越来越"钝"，盯住三条高。</b></p>
            <p class="hint">从每个顶点向对边作垂线段——拖的过程中，有什么异常吗？</p></div>
          </div>
        </div>
      </section>

      <section id="m13-stable">
        <div class="sec-title"><span class="em">🌉</span>稳定性对抗赛</div>
        <div class="card">
          <svg id="m13-stablesvg"></svg>
          <div class="btnrow">
            <button class="btn" id="m13-brace">🔩 给四边形加一根斜杆</button>
          </div>
          <p id="m13-stablemsg">左右拖动<b>四边形的顶梁</b>，再去推<b>三角形的顶点</b>——感受一下谁是硬骨头。</p>
          <p class="hint">维也纳到处是证据：多瑙河铁路桥的桁架、摩天轮的辐条，全是三角形。见到了就拍下来（实践区有任务卡）。</p>
        </div>
      </section>

      <section id="m13-poly">
        <div class="sec-title"><span class="em">🔷</span>多边形分割器</div>
        <div class="split">
          <div class="card">
            <div class="chips">
              <button class="chip on" id="m13-tabin">内角视角</button>
              <button class="chip" id="m13-tabout">外角视角</button>
            </div>
            <svg id="m13-polysvg"></svg>
            <div class="ctl"><label>边数 n <span class="val" id="m13-nv">5</span></label>
              <input type="range" id="m13-n" min="3" max="12" step="1" value="5"></div>
          </div>
          <div class="card">
            <div id="m13-polymsg"></div>
            <hr class="divider">
            <p style="font-size:16.5px">规律自述：n 边形内角和 =
              <select class="blank" id="m13-say3"><option value="">？</option><option>(n−2)</option><option>n</option><option>(n+2)</option></select> × 180°。</p>
            <div id="m13-say3r"></div>
          </div>
        </div>
      </section>

      <section id="m13-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡</div>
        <div id="m13-cardlist"></div>
      </section>

      <section id="m13-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card">
          <p>三边判断、高的位置、外角推理、多边形——期中卷的常客都在这了。错题进错因本。</p>
          <p class="hint" id="m13-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="m13-quizgo">开始自测</button></div>
          <div id="m13-quizbox"></div>
        </div>
      </section>

      <section id="m13-tasks">
        <div class="sec-title"><span class="em">🛠️</span>综合与实践</div>
        <div id="m13-tasklist"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');

    /* ---- 逐节精读入口卡 ---- */
    (function sectionCards() {
      const SECS = ['m13s1', 'm13s2', 'm13s3'].map(k => (window.YJS_SECTIONS || {})[k]).filter(Boolean);
      const grid = $('m13-secgrid');
      if (!SECS.length) { grid.innerHTML = '<p class="hint">节页建设中。</p>'; return; }
      const met = k => k.startsWith('any:') ? k.slice(4).split('|').some(x => Y.has(x)) : Y.has(k);
      grid.innerHTML = SECS.map(s => {
        const ns = (window.YJS_MODULES.m13.nodes || []).filter(n => (s.nodeIds || []).includes(n.id));
        const lit = ns.filter(n => n.needs.every(met)).length;
        return `<div class="seccard" data-go="#/m/m13/${s.sec}"><span class="em">${s.emoji}</span><div><div class="t">${s.title}</div><div class="d">${s.sub} · ★ ${lit}/${ns.length}</div></div><span class="go">›</span></div>`;
      }).join('');
      grid.querySelectorAll('[data-go]').forEach(c => c.addEventListener('click', () => { location.hash = c.dataset.go; }));
    })();
    root.querySelectorAll('.secnav .chip').forEach(c =>
      c.addEventListener('click', () => {
        const t = document.getElementById(c.dataset.to);
        if (t) t.scrollIntoView({ block: 'start' });
      }));

    /* ================= ① 三边拼接器 ================= */
    (function sideLab() {
      const svg = $('m13-sidesvg');
      svg.setAttribute('viewBox', '0 0 460 240');
      svg.classList.add('geo-svg');
      let a = 5, b = 4, c = 6, tried = new Set(['5,4,6']);
      const SC = 13, BY = 205, CX = 230;
      function draw() {
        svg.innerHTML = '';
        const A = [CX - c * SC / 2, BY], B = [CX + c * SC / 2, BY];
        svgEl(svg, 'line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: '#57503f', 'stroke-width': 5, 'stroke-linecap': 'round' });
        const d = c, x = (d * d + a * a - b * b) / (2 * d), h2 = a * a - x * x;
        const msg = $('m13-sidemsg');
        msg.style.display = '';
        if (h2 > 0.05) {
          const C = [A[0] + x * SC, BY - Math.sqrt(h2) * SC];
          svgEl(svg, 'polygon', { points: [A, B, C].map(p => p.join(',')).join(' '), fill: 'rgba(76,81,191,.15)', stroke: '#4c51bf', 'stroke-width': 3, 'stroke-linejoin': 'round' });
          msg.innerHTML = `✅ 拼成了！<b>${a}、${b}、${c}</b>：两条短边之和 ${[a, b, c].sort((p, q) => p - q)[0] + [a, b, c].sort((p, q) => p - q)[1]} > 最长边 ${Math.max(a, b, c)}。`;
        } else if (h2 > -0.05) {
          svgEl(svg, 'line', { x1: A[0], y1: A[1], x2: A[0] + x * SC, y2: BY, stroke: '#b91c1c', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: .6 });
          msg.innerHTML = `⚠️ <b>${a}、${b}、${c}</b>：两边之和<b>恰好等于</b>第三边——三根棍子被压成了一条线段，不算三角形！临界情况是考试最爱。`;
        } else {
          svgEl(svg, 'path', { d: `M ${A[0]} ${A[1] - 4} A ${a * SC} ${a * SC} 0 0 1 ${A[0] + a * SC * 0.72} ${BY - a * SC * 0.69}`, fill: 'none', stroke: '#c2410c', 'stroke-width': 3.5, 'stroke-dasharray': '6 5' });
          svgEl(svg, 'path', { d: `M ${B[0]} ${B[1] - 4} A ${b * SC} ${b * SC} 0 0 0 ${B[0] - b * SC * 0.72} ${BY - b * SC * 0.69}`, fill: 'none', stroke: '#0f766e', 'stroke-width': 3.5, 'stroke-dasharray': '6 5' });
          msg.innerHTML = `❌ <b>${a}、${b}、${c}</b>：两条短边拼命伸也够不着——${[a, b, c].sort((p, q) => p - q)[0]}+${[a, b, c].sort((p, q) => p - q)[1]} ≤ ${Math.max(a, b, c)}，围不成。`;
        }
        tried.add(a + ',' + b + ',' + c);
        grant();
      }
      function grant() {
        if (tried.size >= 3 && $('m13-say1').value === '大于') Y.ev('act:m13.tri');
      }
      const upd = () => { $('m13-av').textContent = a; $('m13-bv').textContent = b; $('m13-cv').textContent = c; draw(); };
      $('m13-a').addEventListener('input', e => { a = +e.target.value; upd(); });
      $('m13-b').addEventListener('input', e => { b = +e.target.value; upd(); });
      $('m13-c').addEventListener('input', e => { c = +e.target.value; upd(); });
      $('m13-presets').addEventListener('click', e => {
        const btn = e.target.closest('.chip'); if (!btn) return;
        [a, b, c] = btn.dataset.p.split(',').map(Number);
        $('m13-a').value = a; $('m13-b').value = b; $('m13-c').value = c;
        upd();
      });
      $('m13-guessbox').appendChild(Y.guess({
        q: '先猜：「5、3、9」和「5、3、8」这两组，哪些能围成三角形？',
        options: ['两组都能', '两组都不能', '只有 5、3、9 能', '只有 5、3、8 能'], answer: 1,
        reveal: '把两组都点出来试试——尤其注意 5、3、8：两条短边"刚好够到"的那一刻，发生了什么？',
        onDone: () => {}
      }));
      $('m13-say1').addEventListener('change', () => {
        const ok = $('m13-say1').value === '大于';
        $('m13-say1').classList.toggle('good', ok);
        $('m13-say1').classList.toggle('badpick', !ok);
        if (ok) {
          $('m13-say1r').innerHTML = '<div class="stdline">三角形任意两边之和大于第三边（依据：两点之间线段最短）。快捷检查：两短边之和 > 最长边。</div>';
          grant();
        }
      });
      draw();
    })();

    /* ================= ② 内角和：实验 + 拼角尺 ================= */
    let tearOn = false;
    const sumLab = G.triLab($('m13-sumsvg'), {
      w: 460, h: 320, pts: [[230, 60], [90, 230], [380, 230]],
      decorate(g, pts) {
        const angs = [0, 1, 2].map(i => G.angleAt(pts, i));
        pts.forEach((p, i) => {
          const u = dir(p, pts[(i + 1) % 3]), v = dir(p, pts[(i + 2) % 3]);
          svgEl(g, 'path', { d: wedge(p, u, v, 24), fill: COLS[i], opacity: .5 });
          const bis = [(u[0] + v[0]), (u[1] + v[1])];
          const L = Math.hypot(bis[0], bis[1]) || 1;
          svgEl(g, 'text', { x: p[0] + bis[0] / L * 42 - 12, y: p[1] + bis[1] / L * 42 + 5, 'font-size': 14, 'font-weight': 700, fill: COLS[i] }).textContent = angs[i].toFixed(0) + '°';
        });
        if (tearOn) {
          const P0 = [230, 306], r = 30;
          svgEl(g, 'line', { x1: 120, y1: P0[1], x2: 340, y2: P0[1], stroke: '#57503f', 'stroke-width': 2.5 });
          let acc = 180;
          angs.forEach((d, i) => {
            const a1 = acc * Math.PI / 180, a2 = (acc - d) * Math.PI / 180;
            const p1 = [P0[0] + r * Math.cos(a1), P0[1] - r * Math.sin(a1)];
            const p2 = [P0[0] + r * Math.cos(a2), P0[1] - r * Math.sin(a2)];
            svgEl(g, 'path', { d: `M ${P0[0]} ${P0[1]} L ${p1[0]} ${p1[1]} A ${r} ${r} 0 0 1 ${p2[0]} ${p2[1]} Z`, fill: COLS[i], opacity: .55 });
            acc -= d;
          });
          svgEl(g, 'text', { x: P0[0] - 58, y: P0[1] - 38, 'font-size': 12.5, fill: '#8b8271' }).textContent = '三个角搬到一条直线上：';
        }
      },
      onDrag(pts, i) {
        const s = G.angleAt(pts, 0) + G.angleAt(pts, 1) + G.angleAt(pts, 2);
        $('m13-sumval').textContent = s.toFixed(1);
        if (i >= 0) { Y.ev('act:m13.sum'); if (tearOn) Y.ev('act:m13.tear'); }
      }
    });
    $('m13-tearbtn').addEventListener('click', () => {
      tearOn = !tearOn;
      $('m13-tearbtn').textContent = tearOn ? '🧩 关拼角尺' : '🧩 开拼角尺';
      if (tearOn) $('m13-tearhint').innerHTML = '现在拖顶点——三块颜色不管怎么变，<b>永远刚好拼满一个平角（180°）</b>。这是 🧪 实验证据；右边把它变成 ✓ 证明。';
      sumLab.render();
    });

    /* ================= ② 证明台（固定图形，分步） ================= */
    (function proofLab() {
      const svg = $('m13-proofsvg');
      svg.setAttribute('viewBox', '0 0 460 300');
      svg.classList.add('geo-svg');
      const A = [230, 70], B = [90, 250], C = [370, 250];
      let step = 0;
      const STEPS = [
        { btn: '第二步：找出左边的内错角', msg: '<div class="explain">过 A 作 BC 的平行线——<b>辅助线</b>：图里本来没有、为了搭桥自己画的线。这是你人生第一条辅助线。</div>' },
        { btn: '第三步：找出右边的内错角', msg: '<div class="explain"><b style="color:#0f766e">∠1 = ∠B</b>（两直线平行，内错角相等——G0 字典里的 Z 形）。∠B 被"搬"到了 A 点。</div>' },
        { btn: '最后一步：合体', msg: '<div class="explain"><b style="color:#c2410c">∠2 = ∠C</b>（同样是内错角相等）。∠C 也被搬上来了。</div>' },
        { btn: '✓ 证明完成', msg: '<div class="explain">A 点处：∠1 + ∠A + ∠2 恰好排满平行线的一侧 = 平角 = 180°。<br>∴ <b>∠A + ∠B + ∠C = 180°</b> ✓<br><br>这不是量出来的，是<b>推理出来的</b>——对宇宙里所有三角形一次说清。这就是证明的力量。</div>' }
      ];
      function draw() {
        svg.innerHTML = '';
        svgEl(svg, 'polygon', { points: [A, B, C].map(p => p.join(',')).join(' '), fill: 'rgba(76,81,191,.12)', stroke: '#4c51bf', 'stroke-width': 2.5 });
        const lbl = (p, t, dx, dy) => svgEl(svg, 'text', { x: p[0] + dx, y: p[1] + dy, 'font-size': 15, 'font-weight': 700, fill: '#27231b' }).textContent = t;
        lbl(A, 'A', -5, -14); lbl(B, 'B', -18, 6); lbl(C, 'C', 10, 6);
        if (step >= 1) {
          svgEl(svg, 'line', { x1: 60, y1: A[1], x2: 400, y2: A[1], stroke: '#b7791f', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' });
          svgEl(svg, 'text', { x: 372, y: A[1] - 8, 'font-size': 12.5, fill: '#b7791f' }).textContent = '辅助线 ∥ BC';
        }
        if (step >= 2) {
          svgEl(svg, 'path', { d: wedge(B, dir(B, A), dir(B, C), 26), fill: '#0f766e', opacity: .55 });
          svgEl(svg, 'path', { d: wedge(A, [-1, 0], dir(A, B), 26), fill: '#0f766e', opacity: .55 });
          svgEl(svg, 'text', { x: A[0] - 52, y: A[1] + 20, 'font-size': 13, 'font-weight': 700, fill: '#0f766e' }).textContent = '∠1';
        }
        if (step >= 3) {
          svgEl(svg, 'path', { d: wedge(C, dir(C, B), dir(C, A), 26), fill: '#c2410c', opacity: .55 });
          svgEl(svg, 'path', { d: wedge(A, dir(A, C), [1, 0], 26), fill: '#c2410c', opacity: .55 });
          svgEl(svg, 'text', { x: A[0] + 38, y: A[1] + 20, 'font-size': 13, 'font-weight': 700, fill: '#c2410c' }).textContent = '∠2';
        }
        if (step >= 4) {
          svgEl(svg, 'path', { d: wedge(A, dir(A, B), dir(A, C), 26), fill: '#4c51bf', opacity: .55 });
        }
      }
      $('m13-proofbtn').addEventListener('click', () => {
        if (step >= 4) return;
        step++;
        draw();
        $('m13-proofmsg').insertAdjacentHTML('beforeend', STEPS[step - 1].msg);
        $('m13-proofbtn').textContent = step < 4 ? STEPS[step - 1].btn : '✓ 已证明（对所有三角形成立）';
        if (step >= 4) {
          $('m13-proofbtn').classList.remove('primary');
          Y.ev('act:m13.proof');
        }
      });
      draw();
    })();

    /* ================= ② 外角实验台 ================= */
    G.triLab($('m13-extsvg'), {
      w: 460, h: 280, pts: [[170, 60], [80, 230], [310, 230]],
      decorate(g, pts) {
        const [A, B, C] = pts;
        const d = dir(B, C);
        const D = [C[0] + d[0] * 90, C[1] + d[1] * 90];
        svgEl(g, 'line', { x1: C[0], y1: C[1], x2: D[0], y2: D[1], stroke: '#b7791f', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' });
        svgEl(g, 'path', { d: wedge(C, dir(C, D), dir(C, A), 28), fill: '#b7791f', opacity: .55 });
        svgEl(g, 'path', { d: wedge(A, dir(A, B), dir(A, C), 22), fill: COLS[2], opacity: .5 });
        svgEl(g, 'path', { d: wedge(B, dir(B, A), dir(B, C), 22), fill: COLS[1], opacity: .5 });
        const a = G.angleAt(pts, 0), b = G.angleAt(pts, 1);
        const ext = 180 - G.angleAt(pts, 2);
        $('m13-extline').innerHTML =
          `<span style="color:${COLS[2]}">∠A ${a.toFixed(0)}°</span> + <span style="color:${COLS[1]}">∠B ${b.toFixed(0)}°</span> = ${(a + b).toFixed(0)}° = <span style="color:#b7791f"><b>外角 ${ext.toFixed(0)}°</b></span>`;
      },
      onDrag(pts, i) { if (i >= 0) Y.ev('act:m13.ext'); }
    });
    $('m13-say2').addEventListener('change', () => {
      const ok = $('m13-say2').value === '与它不相邻的两个内角之和';
      $('m13-say2').classList.toggle('good', ok);
      $('m13-say2').classList.toggle('badpick', !ok);
      if (ok) $('m13-say2r').innerHTML = '<div class="stdline">三角形的一个外角等于与它不相邻的两个内角之和（推论：外角大于任何一个与它不相邻的内角）。</div>';
    });

    /* ================= ③ 三条重要线段 ================= */
    let lineMode = 'h';
    const lineLab = G.triLab($('m13-linesvg2'), {
      w: 460, h: 300, pts: [[230, 60], [90, 250], [370, 250]],
      decorate(g, pts) {
        const foot = (P, Q, R) => {
          const qr = [R[0] - Q[0], R[1] - Q[1]];
          const t = ((P[0] - Q[0]) * qr[0] + (P[1] - Q[1]) * qr[1]) / (qr[0] * qr[0] + qr[1] * qr[1]);
          return { p: [Q[0] + t * qr[0], Q[1] + t * qr[1]], t };
        };
        let outside = false;
        for (let i = 0; i < 3; i++) {
          const P = pts[i], Q = pts[(i + 1) % 3], R = pts[(i + 2) % 3];
          if (lineMode === 'h') {
            const f = foot(P, Q, R);
            if (f.t < 0 || f.t > 1) {
              outside = true;
              const from = f.t < 0 ? Q : R;
              svgEl(g, 'line', { x1: from[0], y1: from[1], x2: f.p[0], y2: f.p[1], stroke: '#8b8271', 'stroke-width': 1.6, 'stroke-dasharray': '5 5' });
              svgEl(g, 'circle', { cx: f.p[0], cy: f.p[1], r: 4.5, fill: '#fff', stroke: COLS[i], 'stroke-width': 2 });
            }
            svgEl(g, 'line', { x1: P[0], y1: P[1], x2: f.p[0], y2: f.p[1], stroke: COLS[i], 'stroke-width': 2.4, 'stroke-dasharray': f.t < 0 || f.t > 1 ? '' : '' });
          } else if (lineMode === 'm') {
            const M = [(Q[0] + R[0]) / 2, (Q[1] + R[1]) / 2];
            svgEl(g, 'line', { x1: P[0], y1: P[1], x2: M[0], y2: M[1], stroke: COLS[i], 'stroke-width': 2.4 });
            svgEl(g, 'circle', { cx: M[0], cy: M[1], r: 3.5, fill: COLS[i] });
          } else {
            const u = dir(P, Q), v = dir(P, R);
            const bis = [u[0] + v[0], u[1] + v[1]];
            const qr = [R[0] - Q[0], R[1] - Q[1]];
            const den = bis[0] * qr[1] - bis[1] * qr[0];
            if (Math.abs(den) > 1e-6) {
              const t = ((Q[0] - P[0]) * qr[1] - (Q[1] - P[1]) * qr[0]) / den;
              const X = [P[0] + bis[0] * t, P[1] + bis[1] * t];
              svgEl(g, 'line', { x1: P[0], y1: P[1], x2: X[0], y2: X[1], stroke: COLS[i], 'stroke-width': 2.4 });
            }
          }
        }
        if (lineMode === 'm') {
          const cen = [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3];
          svgEl(g, 'circle', { cx: cen[0], cy: cen[1], r: 6, fill: '#b7791f' });
          svgEl(g, 'text', { x: cen[0] + 10, y: cen[1] + 5, 'font-size': 13.5, 'font-weight': 700, fill: '#b45309' }).textContent = '重心';
        }
        if (lineMode === 'h' && outside) {
          Y.ev('act:m13.height');
          $('m13-linemsg2').innerHTML = '<p><b>看到了吗——垂足跑到边的延长线上去了！</b></p><p class="hint">钝角三角形有两条高落在形外（虚线是把边延长出去接住它）。直角三角形更妙：两条高干脆和直角边重合。画高永远记住：<b>高是从顶点向对边（或延长线）作的垂线段</b>。</p>';
        }
      }
    });
    $('m13-linemode').addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $('m13-linemode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      lineMode = b.dataset.m;
      const msgs = {
        h: '<p><b>挑战：把三角形拖成钝角，看看高都去哪了。</b></p><p class="hint">从每个顶点向对边作垂线段。垂足乖乖待在边上吗？</p>',
        m: '<p><b>中线：顶点连到对边中点。</b></p><p class="hint">三条中线交于一点——<b>重心</b>。硬纸板剪个三角形，用指尖顶住重心，它就平衡了（实践区有任务卡）。中线还把三角形分成两块<b>面积相等</b>的小三角形。</p>',
        b: '<p><b>角平分线：把每个内角平分的线段。</b></p><p class="hint">三条角平分线也交于一点。它在 8 月的全等模块里会带着一条重要性质回归——先记住它的脸。</p>'
      };
      $('m13-linemsg2').innerHTML = msgs[lineMode];
      lineLab.render();
    });

    /* ================= ④ 稳定性对抗赛 ================= */
    (function stableLab() {
      const svg = $('m13-stablesvg');
      svg.setAttribute('viewBox', '0 0 500 250');
      svg.classList.add('geo-svg');
      let dx = 0, braced = false, sheared = false, bracedTried = false;
      const Q = [[60, 210], [200, 210], [200, 95], [60, 95]];
      const T = [[300, 210], [460, 210], [385, 95]];
      function bar(g, p, q, col, w) {
        svgEl(g, 'line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: col, 'stroke-width': w || 10, 'stroke-linecap': 'round' });
      }
      function draw() {
        svg.innerHTML = '';
        const top = [[Q[3][0] + dx, Q[3][1]], [Q[2][0] + dx, Q[2][1]]];
        bar(svg, Q[0], Q[1], '#8b8271'); bar(svg, Q[0], top[0], '#0f766e'); bar(svg, Q[1], top[1], '#0f766e');
        bar(svg, top[0], top[1], '#4c51bf');
        if (braced) bar(svg, Q[0], top[1], '#b7791f', 7);
        svgEl(svg, 'circle', { cx: (top[0][0] + top[1][0]) / 2, cy: top[0][1], r: 13, fill: '#4c51bf', opacity: .85, id: 'm13-qhandle', style: 'cursor:grab' });
        svgEl(svg, 'text', { x: 88, y: 55, 'font-size': 13.5, fill: '#8b8271' }).textContent = '四边形框架' + (braced ? '（已加斜杆）' : '');
        bar(svg, T[0], T[1], '#8b8271'); bar(svg, T[0], T[2], '#0f766e'); bar(svg, T[1], T[2], '#0f766e');
        svgEl(svg, 'circle', { cx: T[2][0], cy: T[2][1], r: 13, fill: '#0f766e', opacity: .85, id: 'm13-thandle', style: 'cursor:grab' });
        svgEl(svg, 'text', { x: 340, y: 55, 'font-size': 13.5, fill: '#8b8271' }).textContent = '三角形框架';
      }
      let mode = null, sx = 0, dx0 = 0;
      svg.addEventListener('pointerdown', e => {
        const id = e.target.id;
        if (id === 'm13-qhandle') { mode = 'q'; sx = e.clientX; dx0 = dx; try { svg.setPointerCapture(e.pointerId); } catch (err) {} }
        if (id === 'm13-thandle') { mode = 't'; try { svg.setPointerCapture(e.pointerId); } catch (err) {} }
      });
      svg.addEventListener('pointermove', e => {
        if (mode === 'q') {
          const r = svg.getBoundingClientRect();
          const d = (e.clientX - sx) / r.width * 500;
          if (braced) {
            bracedTried = true;
            $('m13-stablemsg').innerHTML = '<b>推不动了！</b>斜杆把四边形分成了两个三角形——三角形一多，整个结构就定死了。这就是"三角形的稳定性"。';
            if (sheared) Y.ev('act:m13.stable');
          } else {
            dx = Math.max(-75, Math.min(75, dx0 + d));
            if (Math.abs(dx) > 30 && !sheared) {
              sheared = true;
              $('m13-stablemsg').innerHTML = '四边形<b>一推就歪</b>——四条边长度都没变，形状却塌了。现在点【加一根斜杆】再推推看。';
            }
            draw();
          }
        } else if (mode === 't') {
          $('m13-stablemsg').innerHTML = '三角形<b>纹丝不动</b>——三条边一定，形状就唯一确定（这正是三边关系的另一面）。';
        }
      });
      const stop = () => { mode = null; };
      svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
      $('m13-brace').addEventListener('click', () => {
        braced = !braced;
        if (braced) dx = 0;
        $('m13-brace').textContent = braced ? '🔩 拆掉斜杆' : '🔩 给四边形加一根斜杆';
        draw();
      });
      draw();
    })();

    /* ================= ⑤ 多边形分割器 ================= */
    (function polyLab() {
      const svg = $('m13-polysvg');
      svg.setAttribute('viewBox', '0 0 460 300');
      svg.classList.add('geo-svg');
      let n = 5, tab = 'in';
      function verts() {
        const c = [230, 155], R = 105, v = [];
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / n;
          v.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]);
        }
        return v;
      }
      function draw() {
        svg.innerHTML = '';
        const v = verts();
        svgEl(svg, 'polygon', { points: v.map(p => p.join(',')).join(' '), fill: 'rgba(76,81,191,.12)', stroke: '#4c51bf', 'stroke-width': 2.5 });
        if (tab === 'in') {
          for (let i = 2; i < n - 1; i++)
            svgEl(svg, 'line', { x1: v[0][0], y1: v[0][1], x2: v[i][0], y2: v[i][1], stroke: '#c2410c', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
          svgEl(svg, 'circle', { cx: v[0][0], cy: v[0][1], r: 6, fill: '#c2410c' });
          $('m13-polymsg').innerHTML =
            `<p>从一个顶点出发拉对角线，${n} 边形被分成 <b style="font-size:20px">${n - 2}</b> 个三角形。</p>
             <div class="formula">内角和 = (${n}−2) × 180° = <b>${(n - 2) * 180}°</b></div>
             <p class="hint">公式不用背——数三角形就行。</p>`;
        } else {
          v.forEach((p, i) => {
            const prev = v[(i - 1 + n) % n], next = v[(i + 1) % n];
            const d = dir(prev, p);
            const D = [p[0] + d[0] * 34, p[1] + d[1] * 34];
            svgEl(svg, 'line', { x1: p[0], y1: p[1], x2: D[0], y2: D[1], stroke: '#b7791f', 'stroke-width': 1.8, 'stroke-dasharray': '5 4' });
            svgEl(svg, 'path', { d: wedge(p, dir(p, D), dir(p, next), 15), fill: '#b7791f', opacity: .6 });
          });
          $('m13-polymsg').innerHTML =
            `<p>每个顶点的金色小角是<b>外角</b>（转弯角）。</p>
             <div class="formula">外角和 = <b>360°</b>（不管几条边！）</div>
             <p class="hint">G0 的小人绕场一周转了 360°——现在把 n 拖到 12，图形越来越圆，"绕一圈"的感觉越来越明显。</p>`;
        }
      }
      $('m13-n').addEventListener('input', e => {
        n = +e.target.value; $('m13-nv').textContent = n; draw();
        Y.ev(tab === 'in' ? 'act:m13.polyin' : 'act:m13.polyout');
      });
      $('m13-tabin').addEventListener('click', () => { tab = 'in'; $('m13-tabin').classList.add('on'); $('m13-tabout').classList.remove('on'); draw(); });
      $('m13-tabout').addEventListener('click', () => { tab = 'out'; $('m13-tabout').classList.add('on'); $('m13-tabin').classList.remove('on'); draw(); });
      $('m13-say3').addEventListener('change', () => {
        const ok = $('m13-say3').value === '(n−2)';
        $('m13-say3').classList.toggle('good', ok);
        $('m13-say3').classList.toggle('badpick', !ok);
        if (ok) $('m13-say3r').innerHTML = '<div class="stdline">n 边形内角和 = (n−2)×180°；外角和恒为 360°。</div>';
      });
      draw();
    })();

    /* ================= 知识卡 ================= */
    window.ExplainKit.cards($('m13-cardlist'), [
      { emoji: '🔺', title: '三角形的定义与分类', rule: '由不在同一条直线上的三条线段首尾顺次相接组成的图形。',
        steps: [{ t: '按边分', r: '不等边 / 等腰 / 等边' }, { t: '按角分', r: '锐角 / 直角 / 钝角三角形' }],
        trap: '等边三角形是特殊的等腰三角形（三边都相等）；直角三角形常记作 Rt△。' },
      { emoji: '🥢', title: '三边关系', rule: '任意两边之和 > 第三边；任意两边之差 < 第三边。依据是"两点之间线段最短"。', eg: '两边 5、8，第三边 x 的范围',
        steps: [{ t: 'x < 5 + 8 = 13', r: '小于和' }, { t: 'x > 8 − 5 = 3', r: '大于差', key: true }, { t: '3 < x < 13', r: '两端取不到' }],
        trap: '快捷判别能不能组成：只看"两短边之和 > 最长边"。5、3、8 中 5+3=8 不大于 8，压成一条线，不行。' },
      { emoji: '📏', title: '高 · 中线 · 角平分线', rule: '三条都是<b>线段</b>。高：顶点到对边（或延长线）的垂线段；中线：顶点到对边中点；角平分线：平分内角交对边。',
        steps: [{ t: '三条中线', r: '交于一点 = 重心' }, { t: '三条角平分线', r: '也交于一点' }],
        trap: '钝角三角形有<b>两条高落在形外</b>（垂足在对边的延长线上）——画高时最容易漏。' },
      { emoji: '🌉', title: '稳定性', rule: '三边长度一定，三角形的形状和大小就唯一确定——这叫稳定性。四边形没有。',
        steps: [{ t: '三角形框架', r: '推不动（形状定死）' }, { t: '四边形框架', r: '一推就歪；加根斜杆才稳', key: true }],
        trap: '桁架桥、塔吊、车架全靠稳定性；伸缩门、折叠椅反过来利用四边形"易变形"。' },
      { emoji: '🧭', title: '内角和定理', rule: '三角形三个内角的和等于 <b>180°</b>。', fig: 'angleSum',
        steps: [{ t: '过顶点 A 作 BC 的平行线', r: '这是第一条辅助线', key: true }, { t: '∠1=∠B、∠2=∠C', r: '两直线平行，内错角相等' }, { t: '∠1+∠A+∠2 = 平角 = 180°', r: '搬到一条直线上' }],
        trap: '量三个三角形都是 180° 只是"猜想"（🧪）；上面这套推理才是"证明"（✓），对所有三角形一次说清。' },
      { emoji: '↗️', title: '外角定理', rule: '三角形的一个外角 = 与它<b>不相邻</b>的两个内角之和；外角大于任一不相邻内角。', eg: '内角 50°、70°',
        steps: [{ t: '外角 = 50° + 70°', r: '两个不相邻内角之和', key: true }, { t: '= 120°', r: '也 = 180°−60°（相邻内角的补角）' }],
        trap: '外角是"一边与另一边延长线的夹角"，不是三角形外面的任意角。G0 的"转弯角"就是它，绕一圈转 360°。' },
      { emoji: '🔷', title: '多边形内角和与外角和', rule: 'n 边形内角和 = <b>(n−2)×180°</b>；外角和恒等于 <b>360°</b>。', eg: '六边形',
        steps: [{ t: '从一个顶点拉对角线', r: '分成 6−2 = 4 个三角形', key: true }, { t: '内角和 = 4×180° = 720°', r: '不用背公式，数三角形' }],
        trap: '外角和跟边数无关，永远 360°——想想"绕场一周转一整圈"。' },
      { emoji: '🧠', title: '方法卡 · 什么是证明', rule: '量出来的是猜想（🧪），推理出来的才是证明（✓）。证明 = 从已知出发、每步给理由、直到结论。',
        steps: [{ t: '为什么要证明？', r: '例子验不完、测量有误差' }, { t: '推理一次', r: '对所有情形都生效', key: true }],
        trap: '辅助线 = 为搭桥自己添的线，画成虚线并写"作……"。它是证明里最灵光、也最需要练的一步。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() {
      const b = Y.quizBest('m13');
      $('m13-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : '';
    }
    bestLine();
    $('m13-quizgo').addEventListener('click', () => {
      $('m13-quizgo').style.display = 'none';
      Y.quizStart($('m13-quizbox'), 'm13', () => {
        $('m13-quizgo').style.display = '';
        $('m13-quizgo').textContent = '再测一次';
        bestLine();
      });
    });

    /* ================= 实践任务 ================= */
    (function tasks() {
      const list = $('m13-tasklist');
      const t1 = Y.taskGet('m13.gravity');
      list.appendChild(window.TaskKit.card({
        emoji: '⚖️', title: '确定匀质薄板的重心（教材·综合与实践）',
        desc: '① 硬纸板剪一个任意形状；② 边缘扎孔挂线，沿线画铅垂线；③ 换一个孔再挂再画；④ 两线交点就是重心——用指尖顶住试试，稳稳的。剪个三角形验证：重心恰好是三条中线的交点。',
        done: t1.done,
        onToggle: v => {
          Y.taskSet('m13.gravity', { done: v });
          if (v) { Y.ev('act:m13.gravity'); Y.toast('⚖️ 重心实验完成——12 月学"质量与密度"时还会想起它', true); }
        }
      }));
      const t2 = Y.taskGet('m13.truss');
      list.appendChild(window.TaskKit.card({
        emoji: '🌉', title: '维也纳找三角形',
        desc: '多瑙河的铁路桥、摩天轮的辐条、脚手架……拍一张"满是三角形"的结构照片存进相册。它们全是稳定性一节的活教材。',
        done: t2.done,
        onToggle: v => { Y.taskSet('m13.truss', { done: v }); if (v) Y.toast('🌉 找到了！', true); }
      }));
    })();

    return { cleanup() {} };
  }
};
