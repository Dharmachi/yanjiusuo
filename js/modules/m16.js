/* m16 · 第十六章 整式的乘法 —— 代数板块旗舰：乘法 = 算面积。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.m16 = {
  id: 'm16', subject: 'math', emoji: '🧱',
  title: '整式的乘法', subtitle: '乘法，其实是在算面积',
  wave: 'M6',
  nodes: [
    { id: 'm16-n1', label: '同底数幂相乘', needs: ['act:m16.pow1', 'q:m16q1'] },
    { id: 'm16-n2', label: '幂的乘方', needs: ['act:m16.pow2', 'q:m16q2'] },
    { id: 'm16-n3', label: '积的乘方', needs: ['act:m16.pow3', 'q:m16q3'] },
    { id: 'm16-n4', label: '同底数幂相除·a⁰', needs: ['act:m16.pow4'] },
    { id: 'm16-n5', label: '整式乘法·瓷砖', needs: ['act:m16.tileA', 'act:m16.tileB', 'any:q:m16q4|q:m16q5'] },
    { id: 'm16-n6', label: '平方差公式', needs: ['act:m16.diff', 'any:q:m16q8|q:m16q9'] },
    { id: 'm16-n7', label: '完全平方公式', needs: ['act:m16.sq', 'any:q:m16q6|q:m16q7'] },
    { id: 'm16-n8', label: '公式识别', needs: ['act:m16.recog', 'q:m16q10'] }
  ],

  render(root, Y) {
    const T = window.TileKit;
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
      if (txt !== undefined) e.textContent = txt;
      g.appendChild(e); return e;
    };
    const rect = (g, x, y, w, h, fill, stroke, sw) => el(g, 'rect', { x, y, width: w, height: h, fill, stroke: stroke || 'none', 'stroke-width': sw || 1.5 });

    root.innerHTML = `
      <nav class="secnav">
        ${[['m16-intro', '引入'], ['m16-pow', '幂律积木'], ['m16-tile', '代数瓷砖'], ['m16-area', '面积证明台'],
        ['m16-recog', '火眼金睛'], ['m16-yh', '杨辉三角'], ['m16-cards', '知识卡'], ['m16-quiz', '自测'], ['m16-feel', '手感练习']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="m16-intro">
        <div class="card" style="border-top:3px solid var(--math)">
          <p class="intro-hook">从这一章起，字母开始"相乘"。别怕——<b>所有的乘法，都可以看成在算一块长方形的面积</b>。<br>
          几何板块你已经会看形状了，现在把面积算给字母听。</p>
          <p class="hint">这一章是初中代数的"发动机舱"：往下接因式分解、分式，再往下接初三的方程。玩熟它，后面一路顺。</p>
        </div>
      </section>

      <section id="m16-pow">
        <div class="sec-title"><span class="em">🧱</span>幂律积木 · 指数到底该加还是该乘</div>
        <div id="m16-powlist"></div>
      </section>

      <section id="m16-tile">
        <div class="sec-title"><span class="em">🟦</span>代数瓷砖 · 把乘法摆成一块长方形</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="m16-tilelv">
              <button class="chip on" data-l="A">① 2x(x+3)</button>
              <button class="chip" data-l="B">② (x+2)(x+3)</button>
              <button class="chip" data-l="free">🎛️ 自由摆</button>
            </div>
            <svg id="m16-tilesvg"></svg>
            <div id="m16-tilefree" hidden>
              <p class="small">自己设两个因子，看它俩的"面积"长什么样：</p>
              <div class="btnrow" id="m16-freeq"></div>
            </div>
          </div>
          <div class="card">
            <h3 id="m16-tiletitle"></h3>
            <p id="m16-tileask"></p>
            <div id="m16-tilepredict"></div>
            <div id="m16-tilemsg"></div>
          </div>
        </div>
      </section>

      <section id="m16-area">
        <div class="sec-title"><span class="em">✂️</span>面积证明台 · 公式是剪出来的</div>
        <div class="card">
          <div class="chips" id="m16-areatab">
            <button class="chip on" data-f="sq">(a+b)²</button>
            <button class="chip" data-f="min">(a−b)²</button>
            <button class="chip" data-f="diff">a² − b²</button>
          </div>
          <div class="fanim">
            <div class="stage"><svg id="m16-areasvg" style="width:260px;height:240px"></svg></div>
            <div style="flex:1;min-width:240px">
              <div class="fstepnav">
                <button class="btn" id="m16-aprev">‹ 上一步</button>
                <button class="btn primary" id="m16-anext">下一步 ›</button>
                <span id="m16-adots" style="display:flex;gap:6px;margin-left:6px"></span>
              </div>
              <div class="fstep" id="m16-astep"></div>
              <div id="m16-asay"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="m16-recog">
        <div class="sec-title"><span class="em">👁️</span>火眼金睛 · 这个式子藏着哪条公式</div>
        <div class="split">
          <div class="card">
            <p class="pwbig" id="m16-rexpr"></p>
            <div class="chips" style="justify-content:center">
              <button class="chip" data-t="diff">能用平方差</button>
              <button class="chip" data-t="square">能用完全平方</button>
              <button class="chip" data-t="none">用不了公式</button>
            </div>
            <p class="small center">进度：<b id="m16-rn">0</b> · 连对 <b id="m16-rstreak">0</b></p>
          </div>
          <div class="card"><div id="m16-rmsg"><p class="hint">看结构，不看字母长相：两项相同、符号一正一负 → 平方差；一个式子自己平方 → 完全平方。</p></div></div>
        </div>
      </section>

      <section id="m16-yh">
        <div class="sec-title"><span class="em">🔺</span>杨辉三角 <span class="hint">阅读与思考 · 彩蛋</span></div>
        <div class="split">
          <div class="card">
            <svg id="m16-yhsvg" class="yh" style="width:100%;height:230px"></svg>
            <div class="ctl"><label>(a+b)ⁿ 的 n <span class="val" id="m16-yhnv">2</span></label>
              <input type="range" id="m16-yhn" min="0" max="6" step="1" value="2"></div>
          </div>
          <div class="card"><div id="m16-yhmsg"></div></div>
        </div>
      </section>

      <section id="m16-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡</div>
        <div id="m16-cardlist"></div>
      </section>

      <section id="m16-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card">
          <p>幂律相加还是相乘、瓷砖读系数、平方差、完全平方——代数第一章的考点全在这。错题进错因本。</p>
          <p class="hint" id="m16-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="m16-quizgo">开始自测</button></div>
          <div id="m16-quizbox"></div>
        </div>
      </section>

      <section id="m16-feel">
        <div class="sec-title"><span class="em">⚡</span>手感练习 · 不动笔，两秒出答案</div>
        <div class="card feel">
          <p class="small">这一章光懂不够，还要<b>熟</b>。快问快答，只练手感、不进错因本。目标正确率 90%。</p>
          <div class="chips" id="m16-feeldeck">
            <button class="chip on" data-d="power">幂运算</button>
            <button class="chip" data-d="formula">乘法公式</button>
          </div>
          <div id="m16-feelbox"></div>
        </div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c =>
      c.addEventListener('click', () => { const t = document.getElementById(c.dataset.to); if (t) t.scrollIntoView({ block: 'start' }); }));

    /* ================= ① 幂律积木 ================= */
    (function powLab() {
      const LAWS = [
        { id: 'pow1', title: '两个幂相乘', expr: 'a² · a³',
          guess: ['a⁵', 'a⁶', '2a⁵'], gans: 0,
          blocks: { mode: 'merge', m: 2, n: 3 }, count: 5, result: 'a⁵',
          say: '数一数总共几个 a：', sayOpts: ['相加', '相乘', '相减'], sayAns: '相加',
          rule: '同底数幂相乘：底数不变，指数<b>相加</b> → aᵐ · aⁿ = aᵐ⁺ⁿ。' },
        { id: 'pow2', title: '幂的乘方', expr: '(a³)²',
          guess: ['a⁶', 'a⁵', 'a⁹'], gans: 0,
          blocks: { mode: 'copy', m: 3, n: 2 }, count: 6, result: 'a⁶',
          say: '三个 a 复制两份，指数之间是：', sayOpts: ['相加', '相乘', '相减'], sayAns: '相乘',
          rule: '幂的乘方：底数不变，指数<b>相乘</b> → (aᵐ)ⁿ = aᵐⁿ。和"相乘"配一对，别和上面的"相加"记串。' },
        { id: 'pow3', title: '积的乘方', expr: '(ab)³',
          guess: ['a³b³', 'ab³', '3ab'], gans: 0,
          blocks: { mode: 'prod', n: 3 }, count: 3, result: 'a³b³',
          say: '括号里每个因式，都要被立方吗？', sayOpts: ['每个都要', '只要第一个', '只要最后一个'], sayAns: '每个都要',
          rule: '积的乘方：每个因式分别乘方 → (ab)ⁿ = aⁿbⁿ。("(−2a²)³ 忘了给 −2 立方"就是没记牢这条。)' },
        { id: 'pow4', title: '相除，一直除到光', expr: 'a⁵ ÷ a²  →  a³ ÷ a³',
          guess: ['a³ 和 1', 'a³ 和 0', 'a⁷ 和 a'], gans: 0,
          blocks: { mode: 'divide', m: 5, n: 2 }, count: 3, result: 'a³',
          say: '把 a³ 也除以 a³：摘光了，结果只能是：', sayOpts: ['1', '0', '没有意义'], sayAns: '1',
          rule: '同底数幂相除：指数<b>相减</b> → aᵐ ÷ aⁿ = aᵐ⁻ⁿ。除到指数为 0：a⁰ = 1（只要 a ≠ 0）。' }
      ];
      const box = $('m16-powlist');
      LAWS.forEach(law => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${law.title} <span class="hint">${law.expr} = ?</span></h3>
          <div id="m16-g-${law.id}"></div>
          <div id="m16-b-${law.id}" hidden>
            <div class="pwrow" id="m16-blk-${law.id}"></div>
            <div class="pwbig" id="m16-res-${law.id}"></div>
            <p>${law.say}
              <select class="blank" id="m16-say-${law.id}"><option value="">？</option>${law.sayOpts.map(o => `<option>${o}</option>`).join('')}</select></p>
            <div id="m16-rule-${law.id}"></div>
          </div>`;
        box.appendChild(card);
        $('m16-g-' + law.id).appendChild(Y.guess({
          q: '先猜：' + law.expr + ' = ?', options: law.guess, answer: law.gans,
          reveal: '数积木验证 ↓',
          onDone: () => {
            $('m16-b-' + law.id).hidden = false;
            drawBlocks($('m16-blk-' + law.id), law.blocks);
            $('m16-res-' + law.id).innerHTML = '= <b>' + sup(law.result) + '</b>（' + law.count + ' 个）';
          }
        }));
        $('m16-say-' + law.id).addEventListener('change', e => {
          const ok = e.target.value === law.sayAns;
          e.target.classList.toggle('good', ok);
          e.target.classList.toggle('badpick', !ok && e.target.value !== '');
          if (ok) { $('m16-rule-' + law.id).innerHTML = '<div class="stdline">' + law.rule + '</div>'; Y.ev('act:m16.' + law.id); }
        });
      });
      function sup(s) { return s.replace(/([a-z])(\d+)/g, (m, a, d) => a + '<sup>' + d + '</sup>'); }
      function drawBlocks(row, b) {
        row.innerHTML = '';
        const blk = (cls, txt) => `<div class="pwblk ${cls || ''}">${txt || 'a'}</div>`;
        if (b.mode === 'merge') {
          let h = '<span class="pwbrace" style="align-self:center">' + b.m + ' 个</span>';
          for (let i = 0; i < b.m; i++) h += blk();
          h += '<span class="pwsep">·</span><span class="pwbrace" style="align-self:center">' + b.n + ' 个</span>';
          for (let i = 0; i < b.n; i++) h += blk('g2');
          h += '<span class="pwsep">=</span><b style="font-size:18px">' + (b.m + b.n) + ' 个 a</b>';
          row.innerHTML = h;
        } else if (b.mode === 'copy') {
          let h = '';
          for (let k = 0; k < b.n; k++) {
            h += '<span class="pwbrace" style="align-self:center">第' + (k + 1) + '份</span>';
            for (let i = 0; i < b.m; i++) h += blk(k % 2 ? 'g2' : '');
          }
          h += '<span class="pwsep">=</span><b style="font-size:18px">' + (b.m * b.n) + ' 个 a</b>';
          row.innerHTML = h;
        } else if (b.mode === 'prod') {
          let h = '';
          for (let k = 0; k < b.n; k++) h += blk('', 'a') + blk('g2', 'b') + (k < b.n - 1 ? '<span class="pwsep">·</span>' : '');
          h += '<span class="pwsep">=</span><b style="font-size:16px">' + b.n + ' 个 a、' + b.n + ' 个 b</b>';
          row.innerHTML = h;
        } else {
          let h = '<span class="pwbrace" style="align-self:center">共 ' + b.m + ' 个</span>';
          for (let i = 0; i < b.m; i++) h += blk(i >= b.m - b.n ? 'gone' : '');
          h += '<span class="pwsep">−' + b.n + '</span><b style="font-size:18px">剩 ' + (b.m - b.n) + ' 个</b>';
          row.innerHTML = h;
        }
      }
    })();

    /* ================= ② 代数瓷砖（真·拖拽摆砖） ================= */
    (function tileLab() {
      const svg = $('m16-tilesvg');
      const LV = {
        A: { title: '① 单项 × 多项：2x(x+3)', f1: { a: 2, b: 0 }, f2: { a: 1, b: 3 }, ev: 'act:m16.tileA',
          label: '2x(x+3)', close: '第二项 6x = 2x 和括号里的 3 相乘，别漏——瓷砖里那 6 块 x 就是它。' },
        B: { title: '② 多项 × 多项：(x+2)(x+3)', f1: { a: 1, b: 2 }, f2: { a: 1, b: 3 }, ev: 'act:m16.tileB',
          label: '(x+2)(x+3)', close: '中间的 5x，是 3 块 x 和 2 块 x 拼起来的——(x+2)(x+3) 里那两次"交叉握手"就在这。' }
      };
      let cur = 'A';
      function countOf(f1, f2) { return { xx: f1.a * f2.a, x: f1.a * f2.b + f1.b * f2.a, one: f1.b * f2.b }; }
      function loadLevel(l) {
        cur = l;
        if (l === 'free') { showFree(); return; }
        $('m16-tilefree').hidden = true;
        const lv = LV[l];
        const c = countOf(lv.f1, lv.f2);
        $('m16-tiletitle').textContent = lv.title;
        $('m16-tileask').innerHTML = '这块长方形，宽 ' + T.fstr(lv.f1) + '、高 ' + T.fstr(lv.f2) + '。先猜里面要用到几块每种瓷砖，再<b>亲手拖砖去填满它</b>。';
        // 先画空框（还没开始）
        T.grid(svg, lv.f1, lv.f2, { reveal: false });
        // 先猜（承诺），再解锁拖砖
        $('m16-tilepredict').innerHTML = `
          <div class="tilefill">
            <span class="cell"><span class="tilesw xx"></span>x² <input class="numin" id="m16-pxx" inputmode="numeric"></span>
            <span class="cell"><span class="tilesw x"></span>x <input class="numin" id="m16-px" inputmode="numeric"></span>
            <span class="cell"><span class="tilesw one"></span>1 <input class="numin" id="m16-pone" inputmode="numeric"></span>
          </div>
          <div class="btnrow"><button class="btn gold" id="m16-tilestart">🧩 我猜好了，开始摆</button></div>`;
        $('m16-tilemsg').innerHTML = '<p class="hint">不确定也没关系——猜个数填上，摆的时候自己就看明白了。</p>';
        $('m16-tilestart').addEventListener('click', () => {
          const guess = { xx: +$('m16-pxx').value || 0, x: +$('m16-px').value || 0, one: +$('m16-pone').value || 0 };
          $('m16-tilepredict').innerHTML = '';
          const b = T.builder(svg, lv.f1, lv.f2, {
            onPlace(done, all) {
              if (done < all) $('m16-tilemsg').innerHTML = `<p class="hint">已铺 <b>${done} / ${all}</b> 块。按形状对号入座——大方块是 x²、长条是 x、小方块是 1。</p>`;
            },
            onComplete(built) {
              const match = (k) => guess[k] === built[k];
              const allMatch = match('xx') && match('x') && match('one');
              $('m16-tilemsg').innerHTML = `<div class="explain">
                🧩 填满了！你亲手摆出：<b>${built.xx}</b> 块 x²、<b>${built.x}</b> 块 x、<b>${built.one}</b> 块 1。
                ${allMatch ? '和你开头猜的一模一样 🎯' : '（开头猜的是 ' + guess.xx + '/' + guess.x + '/' + guess.one + '——现在眼见为实。）'}<br>
                所以 <b>${lv.label} = ${T.polyStr(built)}</b>。<br>${lv.close}</div>
                <div class="btnrow"><button class="btn ghost" id="m16-tileredo">↺ 重摆</button></div>`;
              $('m16-tileredo').addEventListener('click', () => { b.reset(); $('m16-tilemsg').innerHTML = '<p class="hint">再摆一遍，加深手感。</p>'; });
              Y.ev(lv.ev);
            }
          });
          $('m16-tilemsg').innerHTML = `<p class="hint">从下面的托盘拖瓷砖上来，把这块 <b>${lv.label}</b> 的长方形填满。</p>`;
        });
      }
      function showFree() {
        $('m16-tilefree').hidden = false;
        $('m16-tiletitle').textContent = '🎛️ 自由摆';
        $('m16-tileask').textContent = '调两个因子的系数，看看它俩相乘的"面积"。';
        $('m16-tilepredict').innerHTML = '';
        $('m16-tilemsg').innerHTML = '';
        const st = { a1: 1, b1: 1, a2: 1, b2: 2 };
        const stepper = (k, lab) => `${lab} <button class="chip" data-k="${k}" data-d="-1">−</button><b id="m16-f-${k}" style="font-family:ui-monospace">${st[k]}</b><button class="chip" data-k="${k}" data-d="1">+</button>`;
        $('m16-freeq').innerHTML = `<span class="small">宽 ${stepper('a1', 'x×')} ${stepper('b1', '+')}</span><span class="small">　高 ${stepper('a2', 'x×')} ${stepper('b2', '+')}</span>`;
        function redraw() {
          const c = countOf({ a: st.a1, b: st.b1 }, { a: st.a2, b: st.b2 });
          T.grid(svg, { a: st.a1, b: st.b1 }, { a: st.a2, b: st.b2 }, { reveal: true });
          $('m16-tilemsg').innerHTML = `<div class="explain">(${T.fstr({ a: st.a1, b: st.b1 })})(${T.fstr({ a: st.a2, b: st.b2 })}) = <b>${T.polyStr(c)}</b></div>`;
        }
        $('m16-freeq').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
          const k = b.dataset.k, d = +b.dataset.d;
          st[k] = Math.max(k[0] === 'a' ? 0 : 0, Math.min(3, st[k] + d));
          $('m16-f-' + k).textContent = st[k];
          redraw();
        }));
        redraw();
      }
      $('m16-tilelv').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('m16-tilelv').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        loadLevel(b.dataset.l);
      });
      loadLevel('A');
    })();

    /* ================= ③ 面积证明台 ================= */
    (function areaLab() {
      const svg = $('m16-areasvg');
      let tab = 'sq', step = 0;
      const MAX = { sq: 4, min: 4, diff: 4 };
      const COL = { a2: 'rgba(76,81,191,.30)', a2s: '#4c51bf', ab: 'rgba(15,118,110,.30)', abs: '#0f766e', b2: 'rgba(183,121,31,.34)', b2s: '#b7791f', cut: 'rgba(185,28,28,.14)', cuts: '#b91c1c' };
      const STEPTXT = {
        sq: ['一个边长 (a+b) 的大正方形。它的面积就是 (a+b)²。', '把边按 a 和 b 切开，正方形分成四块。', '角上两块是正方形：a² 和 b²。', '中间还有两块长方形，各是 a×b —— 别漏了它们！', '合起来：(a+b)² = a² + 2ab + b²。那两块 ab 就是最常被丢掉的"中间项"。'],
        min: ['大正方形边长 a，我们要的是左上那块 (a−b)² 的小正方形。', '减掉右边一条 a×b（− ab）。', '再减掉下边一条 a×b（又 − ab）。', '右下角那块 b×b 被减了两次，得补回来 + b²。', '(a−b)² = a² − 2ab + b²。中间项是负的，末项 b² 永远为正。'],
        diff: ['边长 a 的正方形，面积 a²。', '从角上挖掉一个 b×b，剩下 L 形，面积 a² − b²。', '把 L 形沿虚线剪成两块。', '拼一拼：两块正好拼成一个长方形，宽 (a+b)、高 (a−b)。', 'a² − b² = (a+b)(a−b)。剪一刀、拼一下，平方差公式就出来了。']
      };
      const A = { sq: 92, min: 132, diff: 118 }, B = { sq: 50, min: 50, diff: 44 }, OX = 30, OY = 40;
      function draw() {
        svg.innerHTML = '';
        const a = A[tab], b = B[tab];
        el(svg, 'rect', { x: 0, y: 0, width: 260, height: 240, fill: 'transparent' });
        if (tab === 'sq') {
          const s = a + b;
          rect(svg, OX, OY, s, s, step === 0 ? 'rgba(76,81,191,.1)' : 'none', '#27231b', 2);
          if (step >= 1) { el(svg, 'line', { x1: OX + a, y1: OY, x2: OX + a, y2: OY + s, stroke: '#27231b', 'stroke-width': 1.5 }); el(svg, 'line', { x1: OX, y1: OY + a, x2: OX + s, y2: OY + a, stroke: '#27231b', 'stroke-width': 1.5 }); }
          if (step >= 2) { rect(svg, OX, OY, a, a, COL.a2, COL.a2s, 1.5); rect(svg, OX + a, OY + a, b, b, COL.b2, COL.b2s, 1.5); el(svg, 'text', { x: OX + a / 2, y: OY + a / 2 + 5, 'font-size': 15, 'text-anchor': 'middle', fill: COL.a2s, 'font-weight': 700 }, 'a²'); el(svg, 'text', { x: OX + a + b / 2, y: OY + a + b / 2 + 4, 'font-size': 12, 'text-anchor': 'middle', fill: COL.b2s, 'font-weight': 700 }, 'b²'); }
          if (step >= 3) { [[OX + a, OY, b, a], [OX, OY + a, a, b]].forEach(r => rect(svg, r[0], r[1], r[2], r[3], COL.ab, COL.abs, step === 3 ? 3 : 1.5)); el(svg, 'text', { x: OX + a + b / 2, y: OY + a / 2 + 4, 'font-size': 12, 'text-anchor': 'middle', fill: COL.abs, 'font-weight': 700 }, 'ab'); el(svg, 'text', { x: OX + a / 2, y: OY + a + b / 2 + 4, 'font-size': 12, 'text-anchor': 'middle', fill: COL.abs, 'font-weight': 700 }, 'ab'); }
          el(svg, 'text', { x: OX + a / 2, y: OY - 8, 'font-size': 12, 'text-anchor': 'middle', fill: '#4c51bf' }, 'a'); el(svg, 'text', { x: OX + a + b / 2, y: OY - 8, 'font-size': 12, 'text-anchor': 'middle', fill: '#b7791f' }, 'b');
        } else if (tab === 'min') {
          rect(svg, OX, OY, a, a, 'none', '#27231b', 2);
          if (step === 0) { rect(svg, OX, OY, a - b, a - b, 'rgba(76,81,191,.14)', COL.a2s, 1.5); el(svg, 'text', { x: OX + (a - b) / 2, y: OY + (a - b) / 2 + 5, 'font-size': 12, 'text-anchor': 'middle', fill: COL.a2s, 'font-weight': 700 }, '(a−b)²'); }
          if (step >= 1) rect(svg, OX + a - b, OY, b, a, COL.cut, COL.cuts, 1.5);
          if (step >= 2) rect(svg, OX, OY + a - b, a, b, COL.cut, COL.cuts, 1.5);
          if (step >= 3) { rect(svg, OX + a - b, OY + a - b, b, b, COL.b2, COL.b2s, 2.5); el(svg, 'text', { x: OX + a - b / 2, y: OY + a - b / 2 + 4, 'font-size': 11, 'text-anchor': 'middle', fill: COL.b2s, 'font-weight': 700 }, '+b²'); }
          if (step >= 4) { rect(svg, OX, OY, a - b, a - b, COL.a2, COL.a2s, 1.5); el(svg, 'text', { x: OX + (a - b) / 2, y: OY + (a - b) / 2 + 5, 'font-size': 12, 'text-anchor': 'middle', fill: COL.a2s, 'font-weight': 700 }, '(a−b)²'); }
          el(svg, 'text', { x: OX + a / 2, y: OY - 8, 'font-size': 12, 'text-anchor': 'middle', fill: '#57503f' }, 'a'); el(svg, 'text', { x: OX + a - b / 2, y: OY + a + 16, 'font-size': 11, 'text-anchor': 'middle', fill: COL.cuts }, 'b');
        } else {
          const a2 = 118;
          if (step <= 2) {
            rect(svg, OX, OY, a, a, step === 0 ? 'rgba(76,81,191,.12)' : 'rgba(15,118,110,.16)', '#27231b', 2);
            el(svg, 'text', { x: OX + a / 2, y: OY - 8, 'font-size': 12, 'text-anchor': 'middle', fill: '#57503f' }, 'a');
            if (step >= 1) { rect(svg, OX + a - b, OY + a - b, b, b, '#fff', COL.cuts, 1.5); el(svg, 'text', { x: OX + a - b / 2, y: OY + a - b / 2 + 4, 'font-size': 11, 'text-anchor': 'middle', fill: COL.cuts }, '挖 b²'); }
            if (step >= 2) el(svg, 'line', { x1: OX, y1: OY + a - b, x2: OX + a - b, y2: OY + a - b, stroke: COL.cuts, 'stroke-width': 2, 'stroke-dasharray': '6 4' });
            if (step >= 1) el(svg, 'text', { x: OX + a / 2, y: OY + a + 18, 'font-size': 11.5, 'text-anchor': 'middle', fill: '#0f766e' }, 'L 形面积 = a² − b²');
          } else {
            // 拼成 (a+b)×(a−b)
            const w1 = a, w2 = b, h = a - b;
            rect(svg, OX, OY + 40, w1, h, COL.ab, COL.abs, 1.5);
            rect(svg, OX + w1, OY + 40, w2, h, COL.b2, COL.b2s, 1.5);
            el(svg, 'text', { x: OX + (w1 + w2) / 2, y: OY + 40 - 8, 'font-size': 12, 'text-anchor': 'middle', fill: '#27231b', 'font-weight': 700 }, 'a + b');
            el(svg, 'text', { x: OX - 8, y: OY + 40 + h / 2 + 4, 'font-size': 12, 'text-anchor': 'end', fill: '#27231b', 'font-weight': 700 }, 'a−b');
            el(svg, 'rect', { x: OX, y: OY + 40, width: w1 + w2, height: h, fill: 'none', stroke: '#27231b', 'stroke-width': 2 });
            if (step >= 4) el(svg, 'text', { x: OX + (w1 + w2) / 2, y: OY + 40 + h + 22, 'font-size': 13, 'text-anchor': 'middle', fill: '#0f766e', 'font-weight': 700 }, '= a² − b²');
          }
        }
      }
      function refresh() {
        draw();
        $('m16-astep').innerHTML = STEPTXT[tab][step];
        $('m16-aprev').disabled = step === 0;
        $('m16-anext').disabled = step === MAX[tab];
        $('m16-adots').innerHTML = STEPTXT[tab].map((_, i) => `<span class="fdot${i === step ? ' on' : ''}"></span>`).join('');
        renderSay();
      }
      function renderSay() {
        const done = step === MAX[tab];
        const box = $('m16-asay');
        if (!done) { box.innerHTML = '<p class="hint">走到最后一步，把规律填一下。</p>'; return; }
        if (tab === 'sq') {
          box.innerHTML = `<p style="font-size:16.5px">(a+b)² = a² + <select class="blank" id="m16-saysq"><option value="">?</option><option>1</option><option>2</option><option>0</option></select> ab + b²</p><div id="m16-saysqr"></div>`;
          $('m16-saysq').addEventListener('change', e => {
            const ok = e.target.value === '2'; e.target.classList.toggle('good', ok); e.target.classList.toggle('badpick', !ok && e.target.value !== '');
            if (ok) { $('m16-saysqr').innerHTML = '<div class="stdline">完全平方公式：(a±b)² = a² ± 2ab + b²。中间项 2ab 绝不能丢——它就是面积图里那两块 ab。</div>'; Y.ev('act:m16.sq'); }
          });
        } else if (tab === 'diff') {
          box.innerHTML = `<p style="font-size:16.5px">a² − b² = (a+b)(a <select class="blank" id="m16-saydf"><option value="">?</option><option>+</option><option>−</option></select> b)</p><div id="m16-saydfr"></div>`;
          $('m16-saydf').addEventListener('change', e => {
            const ok = e.target.value === '−'; e.target.classList.toggle('good', ok); e.target.classList.toggle('badpick', !ok && e.target.value !== '');
            if (ok) { $('m16-saydfr').innerHTML = '<div class="stdline">平方差公式：a² − b² = (a+b)(a−b)。一个和、一个差，相乘中间项抵消。</div>'; Y.ev('act:m16.diff'); }
          });
        } else {
          box.innerHTML = '<div class="stdline">(a−b)² = a² − 2ab + b²。和 (a+b)² 只差中间那个符号——记一个，另一个跟着变号。</div>';
        }
      }
      $('m16-anext').addEventListener('click', () => { if (step < MAX[tab]) step++; refresh(); });
      $('m16-aprev').addEventListener('click', () => { if (step > 0) step--; refresh(); });
      $('m16-areatab').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('m16-areatab').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        tab = b.dataset.f; step = 0; refresh();
      });
      refresh();
    })();

    /* ================= ④ 火眼金睛 ================= */
    (function recogLab() {
      const DECK = [
        { e: '(x + 7)(x − 7)', t: 'diff', note: '相同的 x、相反的 ±7 → 平方差，= x² − 49。' },
        { e: '(x + 3)²', t: 'square', note: '一个式子自己平方 → 完全平方，= x² + 6x + 9。' },
        { e: '(a + b)(b − a)', t: 'diff', note: '换个顺序：(b + a)(b − a) → 平方差，= b² − a²。别被顺序骗了。' },
        { e: '(x + 2)(x − 3)', t: 'none', note: '一个 +2、一个 −3，既不同号相反、也不是同式平方 → 老实用两两握手。' },
        { e: '(2x + 1)²', t: 'square', note: '完全平方，= 4x² + 4x + 1。首项别忘了也要平方。' },
        { e: '(−x + 5)(−x − 5)', t: 'diff', note: '把 −x 看成整体：(−x)² − 5² = x² − 25 → 平方差。' },
        { e: '(x + 4)(x + 4)', t: 'square', note: '两个因式一模一样 = (x+4)² → 完全平方。' },
        { e: '(x − 1)(x + 1)', t: 'diff', note: '差 × 和 → 平方差，= x² − 1。' },
        { e: '(a + b + 1)(a + b − 1)', t: 'diff', note: '把 (a+b) 看成整体：(a+b)² − 1 → 平方差。' },
        { e: '(3x + 2)(2x + 3)', t: 'none', note: '两个因式不相同、也不是和差配对 → 用不了公式。' }
      ];
      const LAB = { diff: '平方差', square: '完全平方', none: '用不了' };
      let i = 0, streak = 0, done = 0, order = DECK.map((_, k) => k).sort(() => Math.random() - 0.5);
      function show() {
        const d = DECK[order[i % order.length]];
        $('m16-rexpr').textContent = d.e;
        $('m16-rmsg').innerHTML = '<p class="hint">看结构，不看字母长相：两项相同、符号一正一负 → 平方差；一个式子自己平方 → 完全平方。</p>';
      }
      show();
      root.querySelectorAll('#m16-recog .chips .chip').forEach(btn => btn.addEventListener('click', () => {
        const d = DECK[order[i % order.length]];
        const ok = btn.dataset.t === d.t;
        done++;
        streak = ok ? streak + 1 : 0;
        $('m16-rn').textContent = done; $('m16-rstreak').textContent = streak;
        $('m16-rmsg').innerHTML = `<div class="explain">${ok ? '✅ 对了。' : '❌ 是「' + LAB[d.t] + '」。'}${d.note}</div>`;
        if (done >= 8 && streak >= 4) Y.ev('act:m16.recog');
        i++;
        setTimeout(show, 950);
      }));
    })();

    /* ================= ⑤ 杨辉三角 ================= */
    (function yhLab() {
      const svg = $('m16-yhsvg');
      let n = 2, moved = false;
      function binom(row) { const r = [1]; for (let k = 1; k <= row; k++) r.push(r[k - 1] * (row - k + 1) / k); return r; }
      function draw() {
        svg.setAttribute('viewBox', '0 0 460 230');
        svg.innerHTML = '';
        for (let row = 0; row <= n; row++) {
          const coeffs = binom(row);
          const y = 26 + row * 30;
          coeffs.forEach((c, k) => {
            const x = 230 + (k - row / 2) * 46;
            el(svg, 'circle', { cx: x, cy: y, r: 13, fill: row === n ? 'var(--gold-bg)' : 'var(--surface)', stroke: row === n ? '#b7791f' : '#d8cfba', 'stroke-width': row === n ? 2 : 1.3 });
            el(svg, 'text', { x, y: y + 4, 'font-size': 12.5, 'text-anchor': 'middle', 'font-weight': 700, fill: '#27231b' }, String(c));
          });
        }
        $('m16-yhnv').textContent = n;
        $('m16-yhmsg').innerHTML = `<p>(a+b)<sup>${n}</sup> 展开后，各项的系数就是这一行：<b class="kbd">${binom(n).join('  ')}</b>。</p>` +
          (n >= 2 ? `<p class="hint">试试比对：(a+b)² = a² + <b>2</b>ab + b²，系数正是 1 2 1。每个数都等于它"肩膀上"两个数之和——这就是<b>杨辉三角</b>（西方叫帕斯卡三角），我们的祖先早八百年就发现了。</p>` : '<p class="hint">把 n 往上滑，看金字塔怎么长。</p>');
        if (n >= 3 && moved) Y.ev('act:m16.yh');
      }
      $('m16-yhn').addEventListener('input', e => { n = +e.target.value; moved = true; draw(); });
      draw();
    })();

    /* ================= 知识卡（讲透卡） ================= */
    window.ExplainKit.cards($('m16-cardlist'), [
      { emoji: '✖️', title: '同底数幂相乘', rule: '底数不变，指数<b>相加</b>：aᵐ · aⁿ = aᵐ⁺ⁿ。', eg: 'a² · a³',
        steps: [{ t: 'a² · a³', r: '底数都是 a' }, { t: '= aa · aaa', r: '摊开数积木' }, { t: '= a⁵', r: '一共 5 个 a → 指数 2+3', key: true }],
        trap: 'a²·a³ = a⁵，不是 a⁶！"相加"别写成"相乘"（相乘是下面的幂的乘方）。' },
      { emoji: '⤴️', title: '幂的乘方', rule: '底数不变，指数<b>相乘</b>：(aᵐ)ⁿ = aᵐⁿ。', eg: '(a³)²',
        steps: [{ t: '(a³)²', r: '把 a³ 连乘两次' }, { t: '= a³ · a³', r: '' }, { t: '= a⁶', r: '指数 3×2', key: true }],
        trap: '和上面配成一对：同底相乘→指数加，幂的乘方→指数乘。最容易记串。' },
      { emoji: '📦', title: '积的乘方', rule: '每个因式<b>分别</b>乘方：(ab)ⁿ = aⁿbⁿ。', eg: '(−2a²)³',
        steps: [{ t: '(−2a²)³', r: '括号里每个因式都要立方' }, { t: '= (−2)³ · (a²)³', r: '别漏了 −2', key: true }, { t: '= −8a⁶', r: '(−2)³=−8、(a²)³=a⁶', key: true }],
        trap: '负号和系数也要乘方——忘给 −2 立方、写成 −2a⁶ 是最常见的错。' },
      { emoji: '➗', title: '同底数幂相除与 a⁰', rule: '底数不变，指数<b>相减</b>：aᵐ ÷ aⁿ = aᵐ⁻ⁿ（a≠0）。特别地 a⁰ = 1。', eg: 'a³ ÷ a³',
        steps: [{ t: 'a⁵ ÷ a² = a³', r: '指数 5−2' }, { t: 'a³ ÷ a³ = a⁰', r: '指数 3−3=0' }, { t: '而 a³÷a³ = 1', r: '所以 a⁰ = 1', key: true }],
        trap: 'a⁰=1 只在 a≠0 时成立。它是"除到指数为 0"逼出来的，不是硬规定。' },
      { emoji: '🤝', title: '整式乘法法则', rule: '每一项和每一项<b>各握一次手</b>（分配律），再合并同类项。', fig: 'sqArea', eg: '(x+2)(x+3)',
        steps: [{ t: '(x+2)(x+3)', r: '两两相乘，共四次' }, { t: '= x² + 3x + 2x + 6', r: '四次握手', key: true }, { t: '= x² + 5x + 6', r: '合并 3x+2x' }],
        trap: '漏握手是通病——尤其中间的交叉项 3x、2x 最容易丢一个。面积图里数瓷砖，一块不漏。' },
      { emoji: '🔀', title: '平方差公式', rule: '(a + b)(a − b) = a² − b²。一个和乘一个差，中间项抵消。', fig: 'diffArea', eg: '102 × 98',
        steps: [{ t: '102 × 98', r: '看成 (100+2)(100−2)' }, { t: '= 100² − 2²', r: '套平方差', key: true }, { t: '= 10000 − 4 = 9996', r: '心算就出来' }],
        trap: '别把它和完全平方搞混：这里是"和×差"，结果只有两项、没有中间项。' },
      { emoji: '⬛', title: '完全平方公式', rule: '(a ± b)² = a² ± 2ab + b²。', fig: 'sqArea', eg: '(x+5)²',
        steps: [{ t: '(x+5)²', r: '首² + 2·首·尾 + 尾²' }, { t: '= x² + 2·x·5 + 5²', r: '别丢中间项', key: true }, { t: '= x² + 10x + 25', r: '' }],
        trap: '头号误区：(a+b)² 写成 a²+b²，丢了中间的 2ab！面积图里那两块 ab 看得见。末项永远为正。' },
      { emoji: '🔺', title: '杨辉三角', rule: '(a+b)ⁿ 展开的系数，恰好是杨辉三角第 n 行；每个数等于肩上两数之和。',
        steps: [{ t: '(a+b)² → 1 2 1', r: '对应 a²+2ab+b²' }, { t: '(a+b)³ → 1 3 3 1', r: '每个数 = 肩上两数之和', key: true }],
        why: '中国南宋杨辉记载，比帕斯卡早约四百年。这里只作彩蛋，二项式定理高中再见。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() { const b = Y.quizBest('m16'); $('m16-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; }
    bestLine();
    $('m16-quizgo').addEventListener('click', () => {
      $('m16-quizgo').style.display = 'none';
      Y.quizStart($('m16-quizbox'), 'm16', () => { $('m16-quizgo').style.display = ''; $('m16-quizgo').textContent = '再测一次'; bestLine(); });
    });

    /* ================= 手感练习 ================= */
    (function feelLab() {
      const DECKS = (window.YJS_DATA.feel || {}).m16 || { power: [], formula: [] };
      let deck = 'power', q = null, ok = 0, total = 0, times = [], t0 = 0;
      const box = $('m16-feelbox');
      function pick() {
        const arr = DECKS[deck];
        q = arr[Math.floor(Math.random() * arr.length)];
        const opts = q.o.slice().sort(() => Math.random() - 0.5);
        box.innerHTML = `
          <div class="fq">${sup(q.q)} = ?</div>
          <div class="feelopt">${opts.map(o => `<button data-o="${o}">${sup(o)}</button>`).join('')}</div>
          <div class="feelstat">
            <span>正确率 <b>${total ? Math.round(ok / total * 100) : 0}%</b></span>
            <span>已答 <b>${total}</b></span>
            <span>手速 <b>${times.length ? (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(1) : '–'}</b>s</span>
            <span class="spark">${times.slice(-16).map(t => `<i style="height:${Math.max(4, 34 - Math.min(30, t / 100))}px"></i>`).join('')}</span>
          </div>`;
        t0 = performance.now();
        box.querySelectorAll('.feelopt button').forEach(b => b.addEventListener('click', () => answer(b)));
      }
      function answer(btn) {
        const correct = btn.dataset.o === q.a;
        total++; if (correct) ok++;
        times.push(performance.now() - t0);
        box.querySelectorAll('.feelopt button').forEach(b => {
          b.disabled = true;
          if (b.dataset.o === q.a) b.classList.add('ok');
          if (b === btn && !correct) b.classList.add('no');
        });
        Y.taskSet('m16.feel', { deck, ok, total });
        setTimeout(pick, correct ? 420 : 1100);
      }
      function sup(s) { return String(s).replace(/([a-zA-Z0-9)])([²³⁴⁵⁶⁷⁸⁹⁰¹ⁿ]+)/g, (m, a, d) => a + '<sup>' + toN(d) + '</sup>'); }
      function toN(d) { const map = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9, 'ⁿ': 'n' }; return d.split('').map(c => map[c]).join(''); }
      $('m16-feeldeck').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('m16-feeldeck').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        deck = b.dataset.d; ok = 0; total = 0; times = []; pick();
      });
      pick();
    })();

    return { cleanup() {} };
  }
};
