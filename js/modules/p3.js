/* p3 · 第三章 物态变化 —— 温度、熔化/凝固曲线、汽化液化、升华凝华。复用 graph-kit。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.p3 = {
  id: 'p3', subject: 'phys', emoji: '🌡️',
  title: '物态变化', subtitle: '固液气之间 · 白气不是水蒸气',
  wave: 'M7',
  nodes: [
    { id: 'p3-n1', label: '温度与温度计', needs: ['act:p3.thermo', 'any:q:p3q1|q:p3q2'] },
    { id: 'p3-n2', label: '熔化凝固曲线·平台吸热', needs: ['act:p3.heat', 'any:q:p3q3|q:p3q5'] },
    { id: 'p3-n3', label: '晶体与非晶体', needs: ['act:p3.paraffin', 'q:p3q4'] },
    { id: 'p3-n4', label: '蒸发与沸腾·气泡', needs: ['act:p3.boil', 'q:p3q10'] },
    { id: 'p3-n5', label: '六种物态变化·吸放热', needs: ['act:p3.tri', 'q:p3q6'] },
    { id: 'p3-n6', label: '升华与凝华', needs: ['act:p3.tri', 'q:p3q7'] },
    { id: 'p3-n7', label: '白气不是水蒸气', needs: ['act:p3.baiqi', 'any:q:p3q8|q:p3q9'] },
    { id: 'p3-n8', label: '厨房实践', needs: ['act:p3.kitchen'] }
  ],
  taskIds: ['p3.kitchen'],

  render(root, Y) {
    const G = window.GraphKit;
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k])); if (txt !== undefined) e.textContent = txt; g.appendChild(e); return e; };
    const timers = [];

    root.innerHTML = `
      <nav class="secnav">
        ${[['p3-intro', '引入'], ['p3-thermo', '温度计'], ['p3-heat', '加热台'], ['p3-boil', '蒸发沸腾'],
        ['p3-tri', '六变化'], ['p3-baiqi', '白气侦探'], ['p3-cards', '知识卡'], ['p3-quiz', '自测'], ['p3-kitchen', '厨房任务']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="p3-intro">
        <div class="card phys">
          <p class="intro-hook">水会结冰、会烧开、会蒸发不见——同一种物质，在<b>固、液、气</b>三种状态间来回变身，这就是物态变化。<br>
          这一章有个反直觉的真相要先剧透一半：<b>你看到的"白气"，其实根本不是水蒸气</b>。为什么？往下玩。</p>
          <p class="hint">厨房就是最好的实验室——烧水、结霜、锅盖上的水珠，全是现成的物态变化（结尾有维也纳厨房任务）。</p>
        </div>
      </section>

      <section id="p3-thermo">
        <div class="sec-title"><span class="em">🌡️</span>温度计训练器 · 视线要与液面相平</div>
        <div class="split">
          <div class="card">
            <svg id="p3-thsvg" style="width:100%;height:150px" viewBox="0 0 300 150"></svg>
            <div class="chips" id="p3-thsight">
              <button class="chip on" data-s="0">平视（正确）</button>
              <button class="chip" data-s="1">俯视（往下看）</button>
              <button class="chip" data-s="-1">仰视（往上看）</button>
            </div>
            <p class="small" id="p3-thmsg"></p>
          </div>
          <div class="card">
            <div id="p3-thguess"></div>
            <hr class="divider">
            <h3>体温计 · 为什么能拿出来读</h3>
            <p class="small">普通温度计一离开热源，液柱就缩回去，必须<b>不取出读</b>。体温计不一样：玻璃泡上方有一段<b>细缩口</b>，水银升上去后<b>回不来</b>，所以能拿出来慢慢看。用前要用力甩，把水银甩回泡里。</p>
            <div class="btnrow"><button class="btn" id="p3-shake">🤙 甩一甩体温计</button></div>
            <p class="small" id="p3-shakemsg"></p>
          </div>
        </div>
      </section>

      <section id="p3-heat">
        <div class="sec-title"><span class="em">🔥</span>虚拟加热台 · 平台段为什么吸热却不升温</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p3-hmode">
              <button class="chip on" data-m="ice">冰（晶体）加热</button>
              <button class="chip" data-m="wax">石蜡（非晶体）加热</button>
              <button class="chip" data-m="freeze">水凝固</button>
            </div>
            <svg id="p3-heatsvg"></svg>
            <div class="btnrow">
              <button class="btn primary" id="p3-hstart">▶ 开始加热</button>
              <button class="btn" id="p3-hfire">🔥 撤火</button>
              <button class="btn ghost" id="p3-hreset">↺</button>
            </div>
            <p class="anglebig" style="margin:4px 0"><span id="p3-htemp">−10</span><small> ℃ · <span id="p3-hstate">固态</span></small></p>
          </div>
          <div class="card">
            <div id="p3-hguess"></div>
            <div id="p3-hmsg"><p class="hint">点"开始加热"，看温度-时间曲线怎么长。到了"平台"（温度不动那段），试试<b>撤火</b>。</p></div>
          </div>
        </div>
      </section>

      <section id="p3-boil">
        <div class="sec-title"><span class="em">🫧</span>蒸发与沸腾 · 气泡是变大还是变小</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p3-boilmode">
              <button class="chip on" data-m="pre">快开了（沸腾前）</button>
              <button class="chip" data-m="boil">正在沸腾</button>
            </div>
            <svg id="p3-boilsvg" style="width:100%;height:180px" viewBox="0 0 300 180"></svg>
            <p class="small" id="p3-boilcap"></p>
          </div>
          <div class="card">
            <div id="p3-boilguess"></div>
            <div id="p3-boilmsg"></div>
            <details style="margin-top:8px"><summary class="hint">蒸发 与 沸腾 有什么不同？</summary>
              <table class="fill" style="margin-top:8px"><tr><th></th><th>蒸发</th><th>沸腾</th></tr>
              <tr><td>温度</td><td>任何温度</td><td>要达到沸点</td></tr>
              <tr><td>部位</td><td>只在液面</td><td>表面和内部同时</td></tr>
              <tr><td>快慢</td><td>缓慢</td><td>剧烈</td></tr></table>
              <p class="small">共同点：都是汽化（液→气），都<b>吸热</b>。湿手背擦一下觉得凉，就是蒸发吸热带走了热量。</p></details>
          </div>
        </div>
      </section>

      <section id="p3-tri">
        <div class="sec-title"><span class="em">🔺</span>六变化三角图 · 名称 + 吸放热</div>
        <div class="split">
          <div class="card"><svg id="p3-trisvg" style="width:100%;height:210px" viewBox="0 0 320 210"></svg></div>
          <div class="card">
            <p class="small">给六条变化各填"名称"和"吸/放热"。填对的会在左图亮起来。</p>
            <div id="p3-trirows"></div>
            <div id="p3-trimsg"></div>
          </div>
        </div>
      </section>

      <section id="p3-baiqi">
        <div class="sec-title"><span class="em">🕵️</span>白气侦探 · 这是水蒸气，还是小水滴？</div>
        <div class="split">
          <div class="card">
            <p class="pwbig" id="p3-bqscene" style="font-size:19px"></p>
            <div class="chips" style="justify-content:center">
              <button class="chip" data-v="gas">是水蒸气（看不见的气）</button>
              <button class="chip" data-v="drop">是小水滴（看得见的白）</button>
            </div>
            <p class="small center">已判 <b id="p3-bqn">0</b> · 连对 <b id="p3-bqstreak">0</b></p>
          </div>
          <div class="card"><div id="p3-bqmsg"><p class="hint">一条铁律：<b>水蒸气无色透明、看不见</b>。凡是你眼睛能看见的白雾、白气、水珠，都是小水滴（液态）。</p></div></div>
        </div>
      </section>

      <section id="p3-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡（讲透卡）</div>
        <div id="p3-cardlist"></div>
      </section>

      <section id="p3-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card">
          <p>温度计读数、熔化曲线读图（平台状态必考）、六变化命名、白气判断——本章考点全在这。错题进错因本。</p>
          <p class="hint" id="p3-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="p3-quizgo">开始自测</button></div>
          <div id="p3-quizbox"></div>
        </div>
      </section>

      <section id="p3-kitchen">
        <div class="sec-title"><span class="em">🍳</span>维也纳厨房任务 · 跨学科实践</div>
        <div id="p3-kitchenbox"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c => c.addEventListener('click', () => { const t = document.getElementById(c.dataset.to); if (t) t.scrollIntoView({ block: 'start' }); }));

    /* ================= ① 温度计 · 仰视俯视 ================= */
    (function thermoLab() {
      const svg = $('p3-thsvg'); let sight = 0;
      function draw() {
        // 液面在 y=70（真实刻度读数 30），刻度 0(底,y=120) 到 60(顶,y=20)
        const liqY = 70, trueVal = 30;
        svg.innerHTML = '';
        el(svg, 'rect', { x: 60, y: 20, width: 24, height: 100, rx: 6, fill: '#fffef2', stroke: '#c9bfa9', 'stroke-width': 1.5 });
        el(svg, 'rect', { x: 60, y: liqY, width: 24, height: 120 - liqY, fill: 'rgba(185,28,28,.5)' });
        el(svg, 'ellipse', { cx: 72, cy: 128, rx: 12, ry: 10, fill: 'rgba(185,28,28,.6)', stroke: '#b91c1c' });
        for (let v = 0; v <= 60; v += 10) { const y = 120 - v / 60 * 100; el(svg, 'line', { x1: 84, y1: y, x2: 92, y2: y, stroke: '#57503f', 'stroke-width': 1.2 }); el(svg, 'text', { x: 96, y: y + 3.5, 'font-size': 9, fill: '#8b8271' }, String(v)); }
        // 眼睛位置
        const eyeY = liqY - sight * 40, eyeX = 190;
        el(svg, 'text', { x: eyeX, y: eyeY + 5, 'font-size': 22 }, '👁️');
        // 视线：眼 → 液面 → 交到刻度（近似）
        const readVal = trueVal + sight * 10;   // 俯视(+1)偏大, 仰视(−1)偏小
        const readY = 120 - readVal / 60 * 100;
        el(svg, 'line', { x1: eyeX - 4, y1: eyeY, x2: 72, y2: liqY, stroke: '#4c51bf', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
        el(svg, 'line', { x1: 72, y1: liqY, x2: 90, y2: readY, stroke: '#4c51bf', 'stroke-width': 1.4, 'stroke-dasharray': '5 4', opacity: sight ? 1 : 0 });
        el(svg, 'line', { x1: 44, y1: liqY, x2: 92, y2: liqY, stroke: '#0f766e', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: .6 });
        el(svg, 'text', { x: 40, y: liqY + 3, 'font-size': 9, fill: '#0f766e', 'text-anchor': 'end' }, '真实 30');
        $('p3-thmsg').innerHTML = sight === 0
          ? '<b style="color:var(--ok)">平视：视线与液面相平，读数 30℃，准确。</b>'
          : `<b style="color:var(--bad)">${sight > 0 ? '俯视（往下斜看）→ 读数偏<b>大</b>，读成了 ' + readVal + '℃' : '仰视（往上斜看）→ 读数偏<b>小</b>，读成了 ' + readVal + '℃'}。</b>　口诀：俯大仰小。`;
        if (sight !== 0) Y.ev('act:p3.thermo');
      }
      $('p3-thsight').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p3-thsight').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); sight = +b.dataset.s; draw(); });
      $('p3-thguess').appendChild(Y.guess({ q: '先猜：读温度计时如果"俯视"（视线从上往下斜），读出的数会偏大还是偏小？', options: ['偏大', '偏小', '不受影响'], answer: 0, reveal: '点上面"俯视"看视线怎么歪——俯大仰小。', onDone: () => {} }));
      $('p3-shake').addEventListener('click', () => { $('p3-shakemsg').innerHTML = '<span style="color:var(--ok)">甩过了：水银被甩回玻璃泡，示数归位，可以量下一个人了。忘了甩，会读到上一次的高温。</span>'; });
      draw();
    })();

    /* ================= ② 虚拟加热台（graph-kit） ================= */
    (function heatLab() {
      const plot = G.plot($('p3-heatsvg'), { xMax: 26, yMin: -20, yMax: 120, xLab: '时间/s', yLab: '温度/℃', title: '温度-时间曲线', color: '#b91c1c' });
      let mode = 'ice', t = 0, fire = false, running = false, askedPlatform = false, timer = null;
      const startTimer = () => { timer = setInterval(tick, 140); timers.push(timer); };
      const SEG = {
        ice: [[0, -10], [4, 0], [10, 0], [18, 100], [24, 100], [26, 100]],
        wax: [[0, -10], [26, 92]],   // 非晶体：单调无平台
        freeze: [[0, 10], [4, 0], [11, 0], [18, -10], [26, -10]]
      };
      function tempAt(m, tt) {
        const seg = SEG[m];
        if (m === 'wax') { const f = Math.min(1, tt / 26); return -10 + 102 * Math.pow(f, 0.85); }
        for (let i = 0; i < seg.length - 1; i++) { const [t0, v0] = seg[i], [t1, v1] = seg[i + 1]; if (tt <= t1) return v0 + (v1 - v0) * (tt - t0) / (t1 - t0 || 1); }
        return seg[seg.length - 1][1];
      }
      function stateAt(m, temp, tt) {
        if (m === 'wax') return temp < 40 ? '固态（渐软）' : '变软/黏稠';
        if (m === 'freeze') { if (tt < 4) return '液态（水）'; if (tt < 11) return '凝固中·固液共存'; return '固态（冰）'; }
        if (tt < 4) return '固态（冰）'; if (tt < 10) return '熔化中·固液共存'; if (tt < 18) return '液态（水）'; if (tt < 24) return '沸腾·汽液共存'; return '沸腾中';
      }
      const inMeltPlatform = tt => mode === 'ice' && tt >= 4 && tt < 10;
      function draw() {
        const temp = tempAt(mode, t);
        $('p3-htemp').textContent = Math.round(temp);
        $('p3-hstate').textContent = stateAt(mode, temp, t);
      }
      function tick() {
        if (!running || fire) return;
        t += 0.2;
        plot.push(t, tempAt(mode, t));
        draw();
        // 熔化平台第一次到达 → 先猜
        if (mode === 'ice' && !askedPlatform && t >= 4.1 && t < 9) {
          askedPlatform = true; running = false; clearInterval(timer);
          $('p3-hmsg').innerHTML = '';
          $('p3-hguess').appendChild(Y.guess({
            q: '到熔化平台了——温度不动。先猜：现在冰还在吸热吗？', options: ['还在吸热', '不吸热了（所以温度才不变）'], answer: 0,
            reveal: '往下按"撤火"验证：如果不吸热，撤火应该没影响；试试看。',
            onDone: () => { $('p3-hguess').innerHTML = ''; running = true; startTimer(); }
          }));
        }
        if (t >= 26) { running = false; clearInterval(timer); finish(); }
      }
      function finish() {
        if (mode === 'ice') { $('p3-hmsg').innerHTML = '<div class="explain">看到<b>两段平台</b>了吗：0℃ 熔化、100℃ 沸腾。平台段温度不变，但一直吸热——热量都用来"改变状态"（熔化、汽化），不用来升温。这是晶体的标志。</div>'; Y.ev('act:p3.heat'); }
        else if (mode === 'wax') { $('p3-hmsg').innerHTML = '<div class="explain">石蜡的曲线<b>圆滑上升、没有平台</b>——它是非晶体，没有固定熔点，边吸热边慢慢变软。对比冰的平台，晶体/非晶体一图分明。</div>'; Y.ev('act:p3.paraffin'); }
        else { $('p3-hmsg').innerHTML = '<div class="explain">水凝固：0℃ 处也有一段平台，但这次是<b>放热</b>（凝固放热）。它和熔化曲线正好镜像。</div>'; Y.ev('act:p3.heat'); }
      }
      $('p3-hstart').addEventListener('click', () => { if (running) return; if (t >= 26) reset(); running = true; startTimer(); });
      $('p3-hfire').addEventListener('click', () => {
        fire = !fire;
        $('p3-hfire').textContent = fire ? '🔥 复火' : '🔥 撤火';
        if (fire && inMeltPlatform(t)) $('p3-hmsg').innerHTML = '<div class="explain">🔥 撤火了！曲线<b>停在平台，熔化不再前进</b>——没有火（不吸热），冰就不继续熔化。这正说明：平台段温度虽不变，却一直靠<b>吸热</b>推进。复火看它继续。</div>';
      });
      $('p3-hreset').addEventListener('click', reset);
      function reset() { running = false; if (timer) clearInterval(timer); t = 0; fire = false; askedPlatform = false; $('p3-hfire').textContent = '🔥 撤火'; $('p3-hguess').innerHTML = ''; plot.reset(); draw(); $('p3-hmsg').innerHTML = '<p class="hint">点"开始加热"，到平台段试试撤火。</p>'; }
      $('p3-hmode').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p3-hmode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); mode = b.dataset.m; reset(); });
      draw();
    })();

    /* ================= ③ 蒸发与沸腾 · 气泡 ================= */
    (function boilLab() {
      const svg = $('p3-boilsvg'); let mode = 'pre', anim = null, phase = 0;
      function draw() {
        phase = (phase + 1) % 100;
        svg.innerHTML = '';
        el(svg, 'path', { d: 'M40 40 L40 170 L260 170 L260 40', fill: 'none', stroke: '#8b8271', 'stroke-width': 3 });
        el(svg, 'rect', { x: 40, y: 60, width: 220, height: 110, fill: 'rgba(76,129,191,.18)' });
        el(svg, 'rect', { x: 40, y: 170, width: 220, height: 6, fill: 'rgba(185,60,30,.5)' });
        // 气泡：从底部上升，沸腾前变小、沸腾时变大
        for (let k = 0; k < 5; k++) {
          const prog = ((phase + k * 20) % 100) / 100;   // 0 底 → 1 面
          const y = 168 - prog * 106;
          const baseR = 3 + (k % 3);
          const r = mode === 'pre' ? Math.max(0.5, baseR * (1 - prog)) : baseR * (0.6 + prog * 1.1);
          if (r < 0.6) continue;
          el(svg, 'circle', { cx: 80 + k * 38, cy: y, r, fill: 'none', stroke: '#4c81bf', 'stroke-width': 1.4 });
        }
        el(svg, 'text', { x: 150, y: 30, 'font-size': 12, 'text-anchor': 'middle', 'font-weight': 700, fill: '#27231b' }, mode === 'pre' ? '沸腾前（约 90℃）' : '沸腾（100℃）');
      }
      function run() { if (anim) clearInterval(anim); anim = timers[timers.push(setInterval(draw, 90)) - 1]; }
      $('p3-boilcap').innerHTML = '';
      $('p3-boilmode').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('p3-boilmode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); mode = b.dataset.m;
        $('p3-boilcap').innerHTML = mode === 'pre' ? '气泡上升时<b>越来越小</b>——上层水温低，气泡里的水蒸气遇冷液化。' : '气泡上升时<b>越来越大</b>——整壶都到沸点，上升中不断汽化、压强变小，到水面破裂。';
        if (mode === 'boil') Y.ev('act:p3.boil');
      });
      $('p3-boilguess').appendChild(Y.guess({
        q: '先猜：水"快开、但还没开"时，锅底的气泡在上升过程中是变大还是变小？', options: ['变大', '变小', '不变'], answer: 1,
        reveal: '切到"正在沸腾"对比一下——沸腾前变小、沸腾时变大，这是判断沸没沸腾的窍门。',
        onDone: () => { $('p3-boilmsg').innerHTML = '<div class="explain">沸腾<b>前</b>气泡上升<b>变小</b>（遇冷液化）；真正<b>沸腾时</b>气泡上升<b>变大</b>（到处都沸）。用两个模式来回切，看得最清楚。</div>'; }
      }));
      run(); draw();
    })();

    /* ================= ④ 六变化三角图 ================= */
    (function triLab() {
      const TRANS = [
        { from: '固', to: '液', name: '熔化', heat: '吸' },
        { from: '液', to: '固', name: '凝固', heat: '放' },
        { from: '液', to: '气', name: '汽化', heat: '吸' },
        { from: '气', to: '液', name: '液化', heat: '放' },
        { from: '固', to: '气', name: '升华', heat: '吸' },
        { from: '气', to: '固', name: '凝华', heat: '放' }
      ];
      const NAMES = ['熔化', '凝固', '汽化', '液化', '升华', '凝华'];
      const done = {};
      function drawTri() {
        const svg = $('p3-trisvg'); svg.innerHTML = '';
        const P = { 气: [160, 30], 固: [50, 175], 液: [270, 175] };
        Object.keys(P).forEach(k => { el(svg, 'circle', { cx: P[k][0], cy: P[k][1], r: 22, fill: 'var(--surface)', stroke: '#c9bfa9', 'stroke-width': 1.5 }); el(svg, 'text', { x: P[k][0], y: P[k][1] + 6, 'font-size': 17, 'text-anchor': 'middle', 'font-weight': 700 }, k); });
        TRANS.forEach((tr, i) => {
          if (!done[i]) return;
          const a = P[tr.from], b = P[tr.to];
          const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          el(svg, 'line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: tr.heat === '吸' ? '#0f766e' : '#b7791f', 'stroke-width': 2 });
          el(svg, 'text', { x: mid[0], y: mid[1] - 2, 'font-size': 10.5, 'text-anchor': 'middle', 'font-weight': 700, fill: tr.heat === '吸' ? '#0f766e' : '#b7791f' }, tr.name + ' ' + tr.heat);
        });
      }
      function rows() {
        $('p3-trirows').innerHTML = TRANS.map((tr, i) =>
          `<div style="margin:6px 0;font-size:15px"><b>${tr.from} → ${tr.to}</b>：
            <select class="blank" data-i="${i}" data-k="name"><option value="">名称</option>${NAMES.map(n => `<option>${n}</option>`).join('')}</select>
            <select class="blank" data-i="${i}" data-k="heat"><option value="">吸/放</option><option>吸</option><option>放</option></select>
            <span id="p3-trm-${i}"></span></div>`).join('');
        $('p3-trirows').querySelectorAll('select').forEach(s => s.addEventListener('change', () => {
          const i = +s.dataset.i, r = $('p3-trirows').querySelector(`select[data-i="${i}"][data-k="name"]`).value, h = $('p3-trirows').querySelector(`select[data-i="${i}"][data-k="heat"]`).value;
          const ok = r === TRANS[i].name && h === TRANS[i].heat;
          $('p3-trm-' + i).innerHTML = (r && h) ? (ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">再想想</b>') : '';
          if (ok) { done[i] = true; drawTri(); }
          if (Object.keys(done).length === 6) { $('p3-trimsg').innerHTML = '<div class="stdline">六种物态变化全部对上！规律：<b>朝"气"方向走的（熔化、汽化、升华）都吸热；反过来（凝固、液化、凝华）都放热</b>。霜是气→固（凝华，放热），不是凝固——别被"结冰"表象骗了。</div>'; Y.ev('act:p3.tri'); }
        }));
      }
      drawTri(); rows();
    })();

    /* ================= ⑤ 白气侦探 ================= */
    (function baiqiLab() {
      const DECK = [
        { s: '烧水壶嘴上方，紧挨壶嘴那一小截"透明看不见"的区域', v: 'gas', note: '这才是真正的水蒸气——高温、透明、看不见。' },
        { s: '烧水壶嘴上方，那团浓浓的白雾', v: 'drop', note: '水蒸气跑出来遇冷液化成小水滴，才变白。看得见 = 已经不是气了。' },
        { s: '冬天嘴里呼出的"白气"', v: 'drop', note: '呼出的水蒸气遇冷空气液化成小水滴。夏天不冷，就看不到。' },
        { s: '夏天冰棍周围向<b>下</b>飘的"白气"', v: 'drop', note: '空气中的水蒸气被冰棍冷却、液化成小水滴；冷空气密度大，所以向下飘。' },
        { s: '洗澡后浴室镜子上的一层"雾"', v: 'drop', note: '水蒸气遇到较冷的镜面液化成小水珠。' },
        { s: '草叶上的露珠', v: 'drop', note: '夜里空气中的水蒸气遇冷液化，是液态的水。' },
        { s: '天上的白云', v: 'drop', note: '云是大量小水滴（或小冰晶）聚成的，不是水蒸气。' },
        { s: '干燥晴天，空气里明明有水分，却什么也看不见', v: 'gas', note: '那正是水蒸气——它无色透明，本来就看不见。' }
      ];
      let i = 0, streak = 0, doneN = 0, order = DECK.map((_, k) => k).sort(() => Math.random() - 0.5);
      function show() { $('p3-bqscene').innerHTML = DECK[order[i % order.length]].s; }
      show();
      root.querySelectorAll('#p3-baiqi .chips .chip').forEach(btn => btn.addEventListener('click', () => {
        const d = DECK[order[i % order.length]], ok = btn.dataset.v === d.v;
        doneN++; streak = ok ? streak + 1 : 0;
        $('p3-bqn').textContent = doneN; $('p3-bqstreak').textContent = streak;
        $('p3-bqmsg').innerHTML = `<div class="explain">${ok ? '✅ ' : '❌ 是「' + (d.v === 'gas' ? '水蒸气' : '小水滴') + '」。'}${d.note}</div>`;
        if (doneN >= 6 && streak >= 3) Y.ev('act:p3.baiqi');
        i++; setTimeout(show, 1100);
      }));
    })();

    /* ================= 讲透卡 ================= */
    window.ExplainKit.cards($('p3-cardlist'), [
      { emoji: '🌡️', title: '摄氏温标与温度计', rule: '标准大气压下，冰水混合物 0℃、沸水 100℃，中间分 100 份。用温度计四规范：全浸没、不碰壁底、待稳定、不取出读。',
        steps: [{ t: '视线与液面相平', r: '否则有误差' }, { t: '俯视 → 偏大、仰视 → 偏小', r: '口诀：俯大仰小', key: true }],
        trap: '体温计是例外：有缩口、水银上去回不来，所以能取出读；用前要甩回去。' },
      { emoji: '🔺', title: '六种物态变化 · 吸放热', rule: '固→液熔化、液→固凝固、液→气汽化、气→液液化、固→气升华、气→固凝华。', fig: 'phaseTri',
        steps: [{ t: '朝"气"走：熔化、汽化、升华', r: '都吸热' }, { t: '反过来：凝固、液化、凝华', r: '都放热', key: true }],
        trap: '霜是气→固（凝华、放热），不是凝固！没经过液态。别被"结冰"表象骗。' },
      { emoji: '❄️', title: '晶体与非晶体', rule: '晶体有固定熔点（熔化图像有温度不变的"平台"）；非晶体没有（图像圆滑上升）。',
        steps: [{ t: '冰、海波、金属 → 晶体', r: '有平台' }, { t: '石蜡、玻璃、松香 → 非晶体', r: '无平台', key: true }],
        trap: '有没有固定熔点，是两者的分水岭——不是"软硬""能不能熔化"。' },
      { emoji: '📈', title: '熔化凝固曲线 · 平台段', rule: '晶体熔化/沸腾时，温度不变的一段叫平台。平台上物体<b>固液（或汽液）共存，且持续吸热</b>。', fig: 'meltCurve',
        steps: [{ t: '平台段温度不变', r: '但一直吸热' }, { t: '一撤火，熔化立刻停', r: '证明它在吸热', key: true }],
        trap: '"温度不变 = 不吸热"是大错！热量都花在改变状态上（拆晶体结构），不用来升温。' },
      { emoji: '💨', title: '蒸发与沸腾', rule: '都是汽化（液→气）、都吸热。蒸发：任何温度、只在液面、缓慢；沸腾：达到沸点、表面内部同时、剧烈。',
        steps: [{ t: '沸腾前气泡上升 → 变小', r: '遇冷液化' }, { t: '沸腾时气泡上升 → 变大', r: '判断沸没沸腾的窍门', key: true }],
        trap: '蒸发吸热有降温作用（湿手觉得凉、出汗散热）——这是它的重要用途。' },
      { emoji: '💧', title: '液化 · 白气不是水蒸气', rule: '气→液叫液化，放热。液化有两条路：<b>降低温度</b>、<b>压缩体积</b>。',
        steps: [{ t: '水蒸气：无色透明、看不见', r: '' }, { t: '白气、白雾、水珠 = 小水滴', r: '液态，看得见', key: true }],
        trap: '你看得见的"白气"全是小水滴，不是水蒸气！壶嘴上方那截透明区才是水蒸气。' },
      { emoji: '🌫️', title: '升华与凝华', rule: '固→气叫升华（吸热）；气→固叫凝华（放热）。都不经过液态。',
        steps: [{ t: '升华：干冰变烟、樟脑丸变小、冰冻衣服变干', r: '吸热' }, { t: '凝华：霜、雾凇、灯泡壁变黑', r: '放热', key: true }],
        trap: '干冰"制造白雾"：干冰升华吸热，使周围水蒸气液化成小水滴——白雾是水，不是二氧化碳。' },
      { emoji: '🍳', title: '厨房里的物态变化', rule: '烧水（汽化）、锅盖水珠（液化）、冰箱结霜（凝华）、湿抹布变干（蒸发）——物态变化天天在厨房上演。',
        why: '这一章的跨学科实践就是"探索厨房中的物态变化"。在维也纳自己做饭时，每个现象都能对到三角图的一条箭头上。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() { const b = Y.quizBest('p3'); $('p3-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; }
    bestLine();
    $('p3-quizgo').addEventListener('click', () => {
      $('p3-quizgo').style.display = 'none';
      Y.quizStart($('p3-quizbox'), 'p3', () => { $('p3-quizgo').style.display = ''; $('p3-quizgo').textContent = '再测一次'; bestLine(); });
    });

    /* ================= 厨房任务 ================= */
    (function kitchenLab() {
      const box = $('p3-kitchenbox');
      const ITEMS = [
        ['🫧', 'kb-boil', '烧水观察', '水快开时看锅底气泡——上升是<b>变小</b>还是变大？（沸腾前变小、沸腾时变大）真正开了再看一次。'],
        ['💧', 'kb-lid', '锅盖内侧的水珠', '锅盖内侧挂着的水珠，是锅里的水蒸气遇冷<b>液化</b>来的。拍一张。'],
        ['❄️', 'kb-frost', '冰箱里的霜', '冷冻室壁上的白霜，是空气里的水蒸气直接<b>凝华</b>成的冰晶（气→固）。'],
        ['🧊', 'kb-evap', '湿抹布擦手臂', '用湿抹布擦一下手背，觉得凉——<b>蒸发吸热</b>带走了热量。'],
        ['🍝', 'kb-salt', '煮意面加盐（彩蛋）', '加盐后水的沸点略微升高、要更晚才开——不深究，感受一下就好。']
      ];
      const t = Y.taskGet('p3.kitchen');
      const state = t.data || {};
      const body = document.createElement('div');
      ITEMS.forEach(it => {
        const row = document.createElement('label');
        row.style.cssText = 'display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px dashed var(--line)';
        row.innerHTML = `<button class="tickbtn${state[it[1]] ? ' on' : ''}" data-k="${it[1]}">✓</button><span><b>${it[0]} ${it[2]}</b><br><span class="small">${it[3]}</span></span>`;
        row.querySelector('.tickbtn').addEventListener('click', () => {
          const now = !row.querySelector('.tickbtn').classList.contains('on');
          row.querySelector('.tickbtn').classList.toggle('on', now);
          state[it[1]] = now; const doneCnt = Object.values(state).filter(Boolean).length;
          Y.taskSet('p3.kitchen', { data: state, done: doneCnt >= 3 });
          if (doneCnt >= 3) Y.ev('act:p3.kitchen');
          if (now) Y.toast('🍳 观察打卡 +1', true);
        });
        body.appendChild(row);
      });
      box.appendChild(window.TaskKit.card({
        emoji: '🍳', title: '厨房物态变化观察（跨学科实践）',
        desc: '在维也纳的家里做饭时，把这几样看一遍、拍下来。完成 3 项就算过关——开学做这个项目时你已经是老手了。',
        done: t.done, body,
        onToggle: v => Y.taskSet('p3.kitchen', { done: v })
      }));
    })();

    return { cleanup() { timers.forEach(t => clearInterval(t)); } };
  }
};
