/* m18 · 第十八章 分式 —— "分式就是长大的分数"。名场面：增根显微镜。数学收官章。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.m18 = {
  id: 'm18', subject: 'math', emoji: '➗',
  title: '分式', subtitle: '长大的分数 · 见分母先想≠0',
  wave: 'M8',
  nodes: [
    { id: 'm18-n1', label: '分式与有意义条件', needs: ['act:m18.define', 'any:q:m18q1|q:m18q2'] },
    { id: 'm18-n2', label: '分式=长大的分数', needs: ['act:m18.parallel', 'q:m18q3'] },
    { id: 'm18-n3', label: '约分·约因式不约项', needs: ['act:m18.reduce', 'q:m18q4'] },
    { id: 'm18-n4', label: '通分·最简公分母', needs: ['act:m18.lcd', 'any:q:m18q5|q:m18q6'] },
    { id: 'm18-n5', label: '负整数指数幂', needs: ['act:m18.negexp', 'q:m18q7'] },
    { id: 'm18-n6', label: '科学记数法（小数）', needs: ['act:m18.sci', 'q:m18q8'] },
    { id: 'm18-n7', label: '分式方程·验根', needs: ['act:m18.equation', 'any:q:m18q9|q:m18q10'] },
    { id: 'm18-n8', label: '增根从哪来', needs: ['act:m18.zenggen', 'q:m18q11'] },
    { id: 'm18-n9', label: '分式方程·应用', needs: ['act:m18.apply', 'q:m18q12'] }
  ],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const fr = (n, d, dz) => `<span class="frac${dz ? ' dz' : ''}"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;

    root.innerHTML = `
      <nav class="secnav">
        ${[['m18-intro', '引入'], ['m18-mean', '有意义'], ['m18-parallel', '像分数'], ['m18-reduce', '约分找茬'],
        ['m18-lcd', '通分'], ['m18-neg', '负指数'], ['m18-eq', '增根显微镜'], ['m18-apply', '应用'],
        ['m18-cards', '知识卡'], ['m18-quiz', '自测']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="m18-intro">
        <div class="card" style="border-top:3px solid var(--math)">
          <p class="intro-hook">分母里出现了字母，分数就"长大"成了<b>分式</b>。<br>
          好消息：<b>分式的运算法则，和小学的分数一模一样</b>——约分、通分、加减乘除，全是老朋友。<br>
          一个新规矩要记牢：<b>分母不能为 0</b>。所以这一章分式的分母，我都给它标了淡红底：${fr('x+1', 'x−2', true)}——见分母，先想它等不等于 0。</p>
        </div>
      </section>

      <section id="m18-mean">
        <div class="sec-title"><span class="em">🚫</span>有意义条件 · 分母不能为 0</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="m18-mchips"></div>
            <div class="bigfrac" id="m18-mfrac"></div>
            <div class="ctl"><label>拖动 x <span class="val" id="m18-mxv">0</span></label>
              <input type="range" id="m18-mx" min="-4" max="4" step="1" value="0"></div>
            <div id="m18-mval" class="eqline"></div>
          </div>
          <div class="card">
            <div id="m18-mguess"></div>
            <div id="m18-mmsg"></div>
          </div>
        </div>
      </section>

      <section id="m18-parallel">
        <div class="sec-title"><span class="em">👯</span>分式 = 长大的分数 · 左右对照</div>
        <div class="card">
          <div class="split">
            <div style="text-align:center"><p class="small">熟悉的分数</p><div class="bigfrac" id="m18-pleft"></div></div>
            <div style="text-align:center"><p class="small">长大的分式</p><div class="bigfrac" id="m18-pright"></div></div>
          </div>
          <div class="btnrow" style="justify-content:center"><button class="btn primary" id="m18-pgo">一起约分 →</button></div>
          <div id="m18-pmsg"></div>
          <hr class="divider">
          <p style="font-size:16.5px">规律自述：分式的约分、通分、加减乘除，和分数的法则
            <select class="blank" id="m18-psay"><option value="">？</option><option>完全一样</option><option>完全不同</option><option>只有约分一样</option></select>。</p>
          <div id="m18-psayr"></div>
        </div>
      </section>

      <section id="m18-reduce">
        <div class="sec-title"><span class="em">🔎</span>约分找茬 · 约的是因式，不是项</div>
        <div class="split">
          <div class="card">
            <p class="small">下面每个"约分"，判对错：</p>
            <div class="eqline" id="m18-rexpr"></div>
            <div class="chips" style="justify-content:center">
              <button class="chip" data-v="ok">约得对</button>
              <button class="chip" data-v="bad">约错了</button>
            </div>
            <p class="small center">已判 <b id="m18-rn">0</b> · 连对 <b id="m18-rstreak">0</b></p>
          </div>
          <div class="card"><div id="m18-rmsg"><p class="hint">约分只能约"公因式"（乘在一起的整块），不能约"项"（加减连着的部分）。约之前先因式分解——这正是上一章的用处。</p></div></div>
        </div>
      </section>

      <section id="m18-lcd">
        <div class="sec-title"><span class="em">🧮</span>通分工作台 · 找最简公分母</div>
        <div class="split">
          <div class="card">
            <div class="eqline" id="m18-lexpr"></div>
            <p>先想：这两个分母的<b>最简公分母</b>是哪个？</p>
            <div class="chips" id="m18-lopts"></div>
            <div id="m18-lresult"></div>
            <div class="btnrow" id="m18-lnav"></div>
          </div>
          <div class="card"><div id="m18-lmsg"><p class="hint">最简公分母 = 各分母所有因式的"最省"公共倍式。没有公因式时，直接相乘；有公因式时别重复乘。</p></div></div>
        </div>
      </section>

      <section id="m18-neg">
        <div class="sec-title"><span class="em">🪜</span>负指数阶梯 与 科学记数法</div>
        <div class="split">
          <div class="card">
            <p class="small">从 10³ 出发，每下一级 <b>÷10</b>。看指数怎么变、负指数是什么。</p>
            <div class="ladder" id="m18-ladder"></div>
            <div class="btnrow"><button class="btn primary" id="m18-ldown">再 ÷10 ↓</button><button class="btn ghost" id="m18-lreset">↺</button></div>
            <div id="m18-negmsg"></div>
          </div>
          <div class="card">
            <h3>科学记数法 · 写小数</h3>
            <p id="m18-sciq" class="eqline"></p>
            <div class="btnrow">
              <input class="note" id="m18-sciin" type="text" placeholder="如 3.5×10^-4，指数填 −4" style="max-width:180px;margin:0">
              <button class="btn primary" id="m18-scigo">交卷</button>
              <button class="btn ghost" id="m18-scinew">换一个</button>
            </div>
            <div id="m18-scimsg"></div>
          </div>
        </div>
      </section>

      <section id="m18-eq">
        <div class="sec-title"><span class="em">🔬</span>增根显微镜 · 分式方程为什么要验根</div>
        <div class="split">
          <div class="card">
            <div class="lvl" id="m18-eqlv"></div>
            <div class="stepbar" id="m18-eqbar"></div>
            <div class="bigfrac" id="m18-eqform"></div>
            <div id="m18-eqbody"></div>
          </div>
          <div class="card"><div id="m18-eqmsg"><p class="hint">分式方程三步：<b>去分母 → 解整式方程 → 验根</b>。第三步不是走过场——去分母时可能乘了 0，得回头查。</p></div>
            <details style="margin-top:10px"><summary class="hint">进阶：从图像看增根</summary>
              <p class="small" style="margin-top:8px">把方程两边各看成一条曲线，增根那个 x 恰好是两条曲线的<b>断点</b>（分母为 0 处画不出点），所以那里根本没有交点——代数上"多出来"的根，图像上是个空洞。</p></details>
          </div>
        </div>
        <div class="card" id="m18-zsay" hidden>
          <p style="font-size:16.5px">规律自述：增根是<b>去分母</b>时两边乘了
            <select class="blank" id="m18-zs1"><option value="">？</option><option>可能等于 0 的式子</option><option>一个常数</option><option>分子</option></select>
            产生的，所以解分式方程必须
            <select class="blank" id="m18-zs2"><option value="">？</option><option>验根</option><option>通分</option><option>画图</option></select>。</p>
          <div id="m18-zsayr"></div>
        </div>
      </section>

      <section id="m18-apply">
        <div class="sec-title"><span class="em">🚉</span>应用 · 把话变成分式方程</div>
        <div class="card">
          <p id="m18-apq"></p>
          <p class="small">先想清楚：<b>等量关系</b>是什么？然后每个量用含字母的式子写出来。</p>
          <div class="chips" id="m18-apopts"></div>
          <div id="m18-apmsg"></div>
        </div>
      </section>

      <section id="m18-cup" style="scroll-margin-top:116px">
        <div class="card gold">
          <h3>🥤 彩蛋：容器里的水，能倒完吗？</h3>
          <div class="split">
            <div style="text-align:center"><div class="cup"><div class="water" id="m18-water" style="height:96%"></div></div>
              <div class="btnrow" style="justify-content:center;margin-top:8px"><button class="btn" id="m18-pour">倒掉一半</button></div></div>
            <div><div id="m18-cupmsg" class="small"></div></div>
          </div>
        </div>
      </section>

      <section id="m18-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡（讲透卡）</div>
        <div id="m18-cardlist"></div>
      </section>

      <section id="m18-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 12 题</div>
        <div class="card">
          <p>有意义条件、约分找茬、通分、四则、负指数与科记、分式方程（含增根、应用）——收官难度。错题进错因本。</p>
          <p class="hint" id="m18-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="m18-quizgo">开始自测</button></div>
          <div id="m18-quizbox"></div>
        </div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => { if (!s.style.scrollMarginTop) s.style.scrollMarginTop = '116px'; });
    root.querySelectorAll('.secnav .chip').forEach(c => c.addEventListener('click', () => { const t = document.getElementById(c.dataset.to); if (t) t.scrollIntoView({ block: 'start' }); }));

    /* ================= ① 有意义条件 ================= */
    (function meanLab() {
      const FR = [
        { n: 'x + 3', d: 'x − 2', bad: [2], f: x => (x + 3) / (x - 2), gq: '这个分式什么时候没意义？', go: ['x = 2', 'x = −3', '永远有意义'], ga: 0 },
        { n: 'x', d: 'x² − 1', bad: [1, -1], f: x => x / (x * x - 1), gq: 'x/(x²−1) 什么时候没意义？', go: ['只有 x = 1', 'x = 1 或 x = −1', 'x = 0'], ga: 1 },
        { n: '5', d: 'x', bad: [0], f: x => 5 / x, gq: '5/x 什么时候没意义？', go: ['x = 5', 'x = 0', '永远有意义'], ga: 1 }
      ];
      let cur = 0, hitBad = false;
      $('m18-mchips').innerHTML = FR.map((f, i) => `<button class="chip${i === 0 ? ' on' : ''}" data-i="${i}">${f.n} / (${f.d})</button>`).join('');
      $('m18-mchips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('m18-mchips').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); load(+b.dataset.i); });
      function load(i) {
        cur = i; hitBad = false;
        $('m18-mx').value = 0; draw();
        $('m18-mguess').innerHTML = '';
        $('m18-mguess').appendChild(Y.guess({ q: FR[i].gq, options: FR[i].go, answer: FR[i].ga, reveal: '把 x 拖到那个值试试——分式会变红。', onDone: () => {} }));
        $('m18-mmsg').innerHTML = '';
      }
      function draw() {
        const f = FR[cur], x = +$('m18-mx').value;
        $('m18-mxv').textContent = x;
        const bad = f.bad.includes(x);
        const num = f.n.replace(/x/g, x < 0 ? '(' + x + ')' : x);
        const den = f.d.replace(/x/g, x < 0 ? '(' + x + ')' : x);
        $('m18-mfrac').innerHTML = fr(f.n, f.d, true);
        if (bad) {
          $('m18-mval').innerHTML = `<span style="color:var(--bad);font-weight:700">分母 = 0 → 无意义 ✗</span>`;
          $('m18-mfrac').querySelector('.frac').style.color = 'var(--bad)';
          $('m18-mmsg').innerHTML = `<div class="explain">💥 x = ${x} 时，分母 ${f.d} = 0。<b>分母为 0，分式没有意义</b>——这就是它的"禁区"。${f.bad.length > 1 ? '注意禁区不止一个：' + f.bad.join('、') + ' 都不行。' : ''}</div>`;
          hitBad = true; if (hitBad) Y.ev('act:m18.define');
        } else {
          $('m18-mval').innerHTML = `分子 ${num} ÷ 分母 ${den} = <b>${(f.f(x)).toFixed(2)}</b>`;
          $('m18-mfrac').querySelector('.frac').style.color = '';
        }
      }
      $('m18-mx').addEventListener('input', draw);
      load(0);
    })();

    /* ================= ② 分式=长大的分数 ================= */
    (function parallelLab() {
      let stage = 0;
      function draw() {
        if (stage === 0) {
          $('m18-pleft').innerHTML = fr('6', '8');
          $('m18-pright').innerHTML = fr('x²−1', 'x²+x', true);
          $('m18-pmsg').innerHTML = '<p class="hint">左边是你熟悉的分数，右边分母含字母、成了分式。点"一起约分"，看它俩怎么<b>同步</b>化简。</p>';
          $('m18-pgo').textContent = '一起约分 →';
        } else if (stage === 1) {
          $('m18-pleft').innerHTML = fr('6', '8') + ' <span style="color:var(--muted)">→ 约掉 2 →</span> ' + fr('3', '4');
          $('m18-pright').innerHTML = fr('(x+1)(x−1)', 'x(x+1)', true) + ' <span style="color:var(--muted)">→ 约掉 (x+1) →</span> ' + fr('x−1', 'x', true);
          $('m18-pmsg').innerHTML = '<div class="explain">左边约掉公因数 2，右边约掉公因式 (x+1)——<b>一模一样的动作</b>。右边约分前要先因式分解（x²−1=(x+1)(x−1)、x²+x=x(x+1)），这正是上一章的用处。<br>红底提醒：右边 x ≠ 0 且 x ≠ −1（分母不能为 0）。</div>';
          $('m18-pgo').textContent = '再看一次通分 →';
        } else {
          $('m18-pleft').innerHTML = fr('1', '2') + ' + ' + fr('1', '3') + ' = ' + fr('3', '6') + ' + ' + fr('2', '6') + ' = ' + fr('5', '6');
          $('m18-pright').innerHTML = fr('1', 'a', true) + ' + ' + fr('1', 'b', true) + ' = ' + fr('b', 'ab', true) + ' + ' + fr('a', 'ab', true) + ' = ' + fr('a+b', 'ab', true);
          $('m18-pmsg').innerHTML = '<div class="explain">通分也一样：分数找公分母 6，分式找公分母 ab。<b>分子分母一起乘</b>，绝不能只动分母。把下面的自述填了。</div>';
          $('m18-pgo').textContent = '✓ 看完了';
          $('m18-pgo').disabled = true;
          Y.ev('act:m18.parallel');
        }
      }
      $('m18-pgo').addEventListener('click', () => { if (stage < 2) { stage++; draw(); } });
      $('m18-psay').addEventListener('change', e => {
        const ok = e.target.value === '完全一样';
        e.target.classList.toggle('good', ok); e.target.classList.toggle('badpick', !ok && e.target.value !== '');
        if (ok) { $('m18-psayr').innerHTML = '<div class="stdline">分式的基本性质、约分通分、四则运算法则，都和分数<b>完全一样</b>——"分式就是长大的分数"。唯一多出来的规矩：分母不能为 0。</div>'; Y.ev('act:m18.parallel'); }
      });
      draw();
    })();

    /* ================= ③ 约分找茬 ================= */
    (function reduceLab() {
      const DECK = [
        { e: fr('a+b', 'a') + ' = b', ok: false, note: 'a 是分子里的一"项"，不是"因式"，划不掉。反例 a=b=1：原式 (1+1)/1=<b>2</b>，而 b=1——2≠1。' },
        { e: fr('2xy', '2y') + ' = x', ok: true, note: '2 和 y 是公因式，约掉得 x。对。' },
        { e: fr('x²−1', 'x+1') + ' = x−1', ok: true, note: '先分解：(x+1)(x−1)/(x+1)，约 (x+1) = x−1。对。' },
        { e: fr('x+2', '2') + ' = x', ok: false, note: '2 只和分母连着，划不掉分子里的 x。反例 x=4：原式 6/2=<b>3</b>，而 x=4——3≠4。' },
        { e: fr('3x+3', 'x+1') + ' = 3', ok: true, note: '3x+3=3(x+1)，约 (x+1) = 3。对。' },
        { e: fr('x²+x', 'x') + ' = x+1', ok: true, note: 'x²+x=x(x+1)，约 x = x+1。对。' },
        { e: fr('x²+4', 'x+2') + ' = x+2', ok: false, note: 'x²+4 分不了（平方加平方），x+2 不是它的因式。反例 x=2：原式 8/4=<b>2</b>，而 x+2=4——2≠4。' },
        { e: fr('a²b', 'ab²') + ' = ' + fr('a', 'b'), ok: true, note: '约掉公因式 ab，得 a/b。对。' }
      ];
      let i = 0, streak = 0, done = 0, order = DECK.map((_, k) => k).sort(() => Math.random() - 0.5);
      function show() { $('m18-rexpr').innerHTML = DECK[order[i % order.length]].e; }
      show();
      root.querySelectorAll('#m18-reduce .chips .chip').forEach(btn => btn.addEventListener('click', () => {
        const d = DECK[order[i % order.length]], correct = (btn.dataset.v === 'ok') === d.ok;
        done++; streak = correct ? streak + 1 : 0;
        $('m18-rn').textContent = done; $('m18-rstreak').textContent = streak;
        $('m18-rmsg').innerHTML = `<div class="explain">${correct ? '✅ 判对了。' : '❌ 判错了。'}${d.ok ? '这个约分是<b>对的</b>：' : '这个约分是<b>错的</b>：'}${d.note}</div>`;
        if (done >= 6 && streak >= 3) Y.ev('act:m18.reduce');
        i++; setTimeout(show, 1200);
      }));
    })();

    /* ================= ④ 通分工作台 ================= */
    (function lcdLab() {
      const EX = [
        { a: fr('1', 'x−1'), b: fr('1', 'x+1'), opts: ['(x−1)(x+1)', '(x−1)(x+1)(x−1)', 'x−1'], lcd: '(x−1)(x+1)', sum: fr('(x+1)+(x−1)', '(x−1)(x+1)') + ' = ' + fr('2x', 'x²−1'), note: '两分母无公因式，最简公分母就是它俩的积 (x−1)(x+1)=x²−1。' },
        { a: fr('1', 'x'), b: fr('1', 'x²'), opts: ['x²', 'x³', 'x·x²'], lcd: 'x²', sum: fr('x', 'x²') + ' + ' + fr('1', 'x²') + ' = ' + fr('x+1', 'x²'), note: '一个分母是 x、一个是 x²，x² 已经是 x 的倍式，最简公分母取 x²（不是 x³，别重复乘）。' },
        { a: fr('1', '2a'), b: fr('1', '3a'), opts: ['6a', '6a²', '5a'], lcd: '6a', sum: fr('3', '6a') + ' + ' + fr('2', '6a') + ' = ' + fr('5', '6a'), note: '系数取 2、3 的最小公倍数 6，字母 a 取一次 → 6a。' }
      ];
      let i = 0;
      function show() {
        const ex = EX[i];
        $('m18-lexpr').innerHTML = ex.a + ' + ' + ex.b;
        $('m18-lopts').innerHTML = ex.opts.map(o => `<button class="chip" data-o="${o}">${o}</button>`).join('');
        $('m18-lresult').innerHTML = '';
        $('m18-lmsg').innerHTML = '<p class="hint">最简公分母：各分母因式取"最省"的公共倍式。</p>';
        $('m18-lopts').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
          const ok = b.dataset.o === ex.lcd;
          $('m18-lopts').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
          if (ok) { $('m18-lresult').innerHTML = `<div class="eqline">${ex.sum}</div>`; $('m18-lmsg').innerHTML = `<div class="explain">${ex.note} 通分后分子相加、分母不变——分子分母一起乘，别只动分母。</div>`; Y.ev('act:m18.lcd'); }
          else $('m18-lmsg').innerHTML = `<div class="explain">不是最简——${b.dataset.o.length > 6 ? '乘重复了' : '还不够'}。最简公分母只取"够用"的，不多不少。</div>`;
        }));
        $('m18-lnav').innerHTML = EX.map((_, k) => `<button class="chip${k === i ? ' on' : ''}" data-k="${k}">例 ${k + 1}</button>`).join('');
        $('m18-lnav').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => { i = +b.dataset.k; show(); }));
      }
      show();
    })();

    /* ================= ⑤ 负指数阶梯 + 科学记数法 ================= */
    (function negLab() {
      let exp = 3;
      const val = e => e >= 0 ? String(Math.pow(10, e)) : '0.' + '0'.repeat(-e - 1) + '1';
      function draw() {
        const rows = [];
        for (let e = 3; e >= exp; e--) rows.push(e);
        $('m18-ladder').innerHTML = rows.map(e =>
          `<div class="rung ${e < 0 ? 'neg' : e === 0 ? 'zero' : ''}">10<sup>${e}</sup> = ${val(e)}${e < exp + 1 && e <= 0 ? (e === 0 ? '　← 10⁰=1' : '　← 负指数 = 继续除') : ''}</div>`).join('');
        $('m18-negmsg').innerHTML = exp <= -2
          ? '<div class="stdline">指数每减 1，就 ÷10 一次。<b>负指数不是负数，是"继续往下除"</b>：10⁻ⁿ = 1/10ⁿ。所以 10⁻² = 1/100 = 0.01，不是 −100！</div>'
          : '<p class="hint">继续按"再 ÷10"，一直滑到负指数。</p>';
        if (exp <= -2) Y.ev('act:m18.negexp');
      }
      $('m18-ldown').addEventListener('click', () => { if (exp > -3) exp--; draw(); });
      $('m18-lreset').addEventListener('click', () => { exp = 3; draw(); });
      draw();

      const SCI = [['0.00035', -4, '3.5'], ['0.0000072', -6, '7.2'], ['0.0004', -4, '4'], ['0.000000015', -8, '1.5']];
      let si = 0;
      function sciShow() { $('m18-sciq').innerHTML = `把 <b>${SCI[si][0]}</b> 写成科学记数法：a × 10ⁿ`; $('m18-sciin').value = ''; $('m18-scimsg').innerHTML = ''; }
      sciShow();
      $('m18-scigo').addEventListener('click', () => {
        const s = SCI[si], raw = ($('m18-sciin').value || '').replace(/\s/g, '');
        const m = raw.match(/(-?\d+)\s*$/);
        const expGiven = m ? +m[1] : null;
        if (expGiven === s[1]) { $('m18-scimsg').innerHTML = `<div class="explain">✅ ${s[0]} = <b>${s[2]} × 10<sup>${s[1]}</sup></b>。小数点从原位搬到第一个非零数字后，向右移了 ${-s[1]} 位 → 指数 ${s[1]}。</div>`; Y.ev('act:m18.sci'); }
        else $('m18-scimsg').innerHTML = `<div class="explain">再数一遍小数点搬家的步数：从 ${s[0]} 到 ${s[2]}，向右移了几位？小数用<b>负</b>指数。答案指数是 ${s[1]}。</div>`;
      });
      $('m18-scinew').addEventListener('click', () => { si = (si + 1) % SCI.length; sciShow(); });
    })();

    /* ================= ⑥ 增根显微镜 ================= */
    (function eqLab() {
      const P = [
        {
          eq: fr('1', 'x−1', true) + ' = ' + fr('2', 'x²−1', true),
          lcdQ: '两个分母是 x−1 和 x²−1。最简公分母是？',
          lcdOpts: ['(x−1)(x+1)', 'x−1', '(x−1)(x²−1)'], lcdAns: 0,
          zero: 'x = 1 或 x = −1', cleared: 'x + 1 = 2', root: 'x = 1',
          bad: true, verifyNote: 'x=1 代回原方程，分母 x−1 = 0——"除以 0"没有意义！所以 x=1 是<b>增根</b>，必须舍去。舍去后没有别的根。',
          conclusion: '原方程<b>无解</b>。'
        },
        {
          eq: fr('2', 'x−3', true) + ' = ' + fr('1', 'x', true),
          lcdQ: '两个分母是 x−3 和 x。最简公分母是？',
          lcdOpts: ['x(x−3)', 'x−3', 'x(x−3)(x−3)'], lcdAns: 0,
          zero: 'x = 0 或 x = 3', cleared: '2x = x − 3', root: 'x = −3',
          bad: false, verifyNote: 'x=−3 代回原方程，分母 x−3 = −6 ≠ 0、x = −3 ≠ 0——都不为 0，成立！所以 x=−3 是<b>真解</b>。',
          conclusion: '原方程的解是 <b>x = −3</b>。'
        }
      ];
      const STEPS = ['去分母', '解方程', '验根', '结论'];
      let cur = 0, done = new Set();
      function lvls() { $('m18-eqlv').innerHTML = P.map((p, i) => `<button class="lc${done.has(i) ? ' ok' : ''}${i === cur ? ' cur' : ''}" data-i="${i}">${i + 1}</button>`).join(''); $('m18-eqlv').querySelectorAll('.lc').forEach(b => b.addEventListener('click', () => load(+b.dataset.i))); }
      function bar(step) { $('m18-eqbar').innerHTML = STEPS.map((s, k) => `<span class="sb ${k < step ? 'done' : k === step ? 'on' : ''}">${k + 1}. ${s}</span>`).join(''); }
      function load(i) {
        cur = i; const p = P[i];
        $('m18-eqform').innerHTML = p.eq;
        bar(0);
        $('m18-eqmsg').innerHTML = '<p class="hint">分式方程三步：去分母 → 解 → 验根。</p>';
        // 第一步：找最简公分母（去分母）
        $('m18-eqbody').innerHTML = `<p><b>第 1 步 · 去分母：</b>${p.lcdQ}</p><div class="chips" id="m18-eqlcd">${p.lcdOpts.map((o, k) => `<button class="chip" data-k="${k}">${o}</button>`).join('')}</div><div id="m18-eqstep"></div>`;
        $('m18-eqlcd').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
          if (+b.dataset.k !== p.lcdAns) { $('m18-eqstep').innerHTML = '<div class="explain">不是最简——想想 x²−1 其实等于 (x−1)(x+1)，别多乘也别少乘。</div>'; return; }
          $('m18-eqlcd').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
          bar(1);
          $('m18-eqstep').innerHTML = `<div class="mag">两边同乘 <b>${p.lcdOpts[p.lcdAns]}</b>，约去分母 → <b>${p.cleared}</b>。<br><b style="color:var(--warn)">当 ${p.zero} 时，这个式子等于 0</b>——你乘的可能是 0，方程从这里"变宽"了。记住：解完<b>一定要验根</b>。</div>
            <div class="btnrow"><button class="btn primary" id="m18-eqsolve">第 2 步：解这个整式方程 →</button></div>`;
          $('m18-eqsolve').addEventListener('click', () => {
            bar(2);
            $('m18-eqstep').innerHTML = `<div class="explain">解 ${p.cleared} → <b>${p.root}</b>。</div>
              <div class="mag" style="background:var(--surface);border-color:var(--line2)"><b>第 3 步 · 验根：</b>把 ${p.root} 代回<b>原方程</b>，分母会不会变成 0？<br>你来判：</div>
              <div class="chips" style="justify-content:center"><button class="chip" data-j="real">是真解</button><button class="chip" data-j="zeng">是增根</button></div>
              <div id="m18-eqjudge"></div>`;
            $('m18-eqstep').querySelectorAll('[data-j]').forEach(jb => jb.addEventListener('click', () => {
              const said = jb.dataset.j, correct = (said === 'zeng') === p.bad;
              bar(3);
              $('m18-eqjudge').innerHTML = `<div class="explain">${correct ? '✅ 判对了。' : '❌ 再看分母。'}${p.verifyNote}</div><div class="stdline">${p.conclusion}</div>`;
              done.add(cur); lvls();
              if (done.size >= 2) { Y.ev('act:m18.equation'); $('m18-zsay').hidden = false; }
            }));
          });
        }));
        lvls();
      }
      $('m18-zs1').addEventListener('change', chkSay); $('m18-zs2').addEventListener('change', chkSay);
      function chkSay() {
        const ok = $('m18-zs1').value === '可能等于 0 的式子' && $('m18-zs2').value === '验根';
        [$('m18-zs1'), $('m18-zs2')].forEach(s => { s.classList.toggle('good', ok && s.value); s.classList.toggle('badpick', !ok && s.value !== ''); });
        if (ok) { $('m18-zsayr').innerHTML = '<div class="stdline">增根 = 去分母时两边乘了"可能为 0 的式子"而多出来的根。所以解分式方程<b>必须验根</b>：把根代回原方程，让分母为 0 的就是增根，舍去。</div>'; Y.ev('act:m18.zenggen'); }
      }
      load(0);
    })();

    /* ================= ⑦ 应用 ================= */
    (function applyLab() {
      const Q = [
        { text: '甲每小时走 v km，乙每小时走 (v+2) km。甲走 20 km 用的时间，正好等于乙走 30 km 用的时间。', rel: '甲的时间 = 乙的时间，时间 = 路程 ÷ 速度', opts: ['20/v = 30/(v+2)', '20/(v+2) = 30/v', '20v = 30(v+2)'], ans: 0 },
        { text: '一项工程，甲队单独 x 天完成，乙队单独 (x+5) 天完成。两队一天合起来完成全部工程的 1/6。', rel: '甲一天 + 乙一天 = 1/6（把总工程看成 1）', opts: ['1/x + 1/(x+5) = 1/6', '1/x − 1/(x+5) = 1/6', 'x + (x+5) = 6'], ans: 0 }
      ];
      let i = 0;
      function show() {
        const q = Q[i];
        $('m18-apq').innerHTML = `<b>题 ${i + 1}：</b>${q.text}`;
        $('m18-apopts').innerHTML = q.opts.map((o, k) => `<button class="chip" data-k="${k}">${o}</button>`).join('') + Q.map((_, k) => `<button class="chip ghost" data-nav="${k}" style="opacity:.7">题${k + 1}</button>`).join('');
        $('m18-apmsg').innerHTML = `<p class="hint">等量关系：${q.rel}</p>`;
        $('m18-apopts').querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
          const ok = +b.dataset.k === q.ans;
          $('m18-apopts').querySelectorAll('[data-k]').forEach(c => c.classList.toggle('on', c === b));
          $('m18-apmsg').innerHTML = `<div class="explain">${ok ? '✅ ' : '❌ 是 ' + q.opts[q.ans] + '。'}${q.rel}。把每个量写成含字母的式子，代进等量关系就成方程。列完记得——解出来要验根。</div>`;
          if (ok) Y.ev('act:m18.apply');
        }));
        $('m18-apopts').querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => { i = +b.dataset.nav; show(); }));
      }
      show();
    })();

    /* ================= 水杯彩蛋 ================= */
    (function cupLab() {
      let times = 0, total = 0;
      $('m18-cupmsg').innerHTML = '<p>杯子满的。每次倒掉<b>剩下的一半</b>——能把它倒完吗？先猜，再点按钮试。</p>';
      $('m18-pour').addEventListener('click', () => {
        times++; const left = Math.pow(0.5, times); total = 1 - left;
        $('m18-water').style.height = (left * 96) + '%';
        $('m18-cupmsg').innerHTML = `<p>倒了 <b>${times}</b> 次，已倒出 <b>1 − ${fr('1', Math.pow(2, times))}</b> = ${total.toFixed(times < 4 ? 3 : 6)}……杯里还剩 ${fr('1', Math.pow(2, times))}。</p>
          <p class="hint">1/2 + 1/4 + 1/8 + … 越加越接近 <b>1</b>，但永远差最后一丝，<b>倒不完</b>。这就是"无限接近"——高中会正式认识它，先种颗种子。</p>`;
      });
    })();

    /* ================= 讲透卡 ================= */
    window.ExplainKit.cards($('m18-cardlist'), [
      { emoji: '➗', title: '分式与有意义条件', rule: '分母含字母的式子叫分式。<b>分母不能为 0</b>——见分式，先看分母。', eg: '(x+3)/(x−2)',
        steps: [{ t: '分母 x−2 ≠ 0', r: '否则无意义' }, { t: '→ x ≠ 2', r: '这是它的"禁区"', key: true }],
        trap: '禁区可能不止一个：x/(x²−1) 里 x²−1=(x+1)(x−1)，x≠1 且 x≠−1，漏一个就扣分。' },
      { emoji: '👯', title: '基本性质 · 分式=长大的分数', rule: '分子分母同乘（或同除）一个不为 0 的整式，分式的值不变——和分数的基本性质一模一样。',
        steps: [{ t: '分数 6/8 = 3/4', r: '同除 2' }, { t: '分式 (x²−1)/(x²+x) = (x−1)/x', r: '同除 (x+1)', key: true }],
        trap: '一定是分子分母"一起"乘除。只动分母、不动分子，值就变了。' },
      { emoji: '🔎', title: '约分 · 约因式不约项', rule: '约分只能约<b>公因式</b>（乘在一起的整块），不能约<b>项</b>（加减连着的部分）。约前先因式分解。',
        steps: [{ t: '(x²−1)/(x²+x)', r: '先分解' }, { t: '= (x+1)(x−1) / x(x+1)', r: '' }, { t: '= (x−1)/x', r: '约掉公因式 (x+1)', key: true }],
        trap: '(a+b)/a 不能约成 b！a 是"项"不是"因式"。反例 a=b=1：原式=2，b=1，2≠1。' },
      { emoji: '🧮', title: '通分 · 最简公分母', rule: '异分母相加减，先通分成同分母。<b>最简公分母</b> = 各分母因式取"最省"的公共倍式。',
        steps: [{ t: '1/(x−1) + 1/(x+1)', r: '无公因式' }, { t: '公分母 = (x−1)(x+1)', r: '直接相乘', key: true }, { t: '= 2x/(x²−1)', r: '分子分母一起乘' }],
        trap: '有公因式时别重复乘：1/x 与 1/x² 的公分母是 x²，不是 x³。' },
      { emoji: '✖️', title: '乘除法则', rule: '乘法：分子乘分子、分母乘分母。除法：<b>除以一个分式 = 乘它的倒数</b>。能约先约。',
        steps: [{ t: 'a/b ÷ c/d', r: '除 = 乘倒数' }, { t: '= a/b × d/c', r: '把 c/d 翻过来', key: true }, { t: '= ad/(bc)', r: '再约分' }],
        trap: '除法一定要"翻倒数"再乘；乘除前先因式分解，能约的先约，最后结果保持最简。' },
      { emoji: '➕', title: '加减法则', rule: '同分母：分母不变、分子相加减。异分母：先通分再加减。',
        steps: [{ t: '1/x + 1/y', r: '异分母，通分' }, { t: '= y/(xy) + x/(xy)', r: '公分母 xy' }, { t: '= (x+y)/(xy)', r: '分子相加', key: true }],
        trap: '1/x + 1/y ≠ 2/(x+y)！分母不能直接相加——这是加减最狠的坑。' },
      { emoji: '🪜', title: '整数指数幂 · 负指数与科记', rule: 'a⁻ⁿ = 1/aⁿ（a≠0）。负指数不是负数，是"继续除"。小数用负指数写科学记数法。',
        steps: [{ t: '2⁻³ = 1/2³ = 1/8', r: '继续除，不是 −8' }, { t: '0.00035 = 3.5×10⁻⁴', r: '小数点右移 4 位', key: true }],
        trap: '10⁻² = 0.01，不是 −100！负号在指数上，管的是"除几次"，不是给整个数变号。' },
      { emoji: '🔬', title: '分式方程三步曲', rule: '<b>去分母 → 解整式方程 → 验根</b>。验根不是走过场：去分母时可能乘了 0，会多出增根。', eg: '1/(x−1)=2/(x²−1)',
        steps: [{ t: '① 去分母（×最简公分母）', r: '' }, { t: '② 解得 x=1', r: '' }, { t: '③ 验根：x=1 使分母=0 → 增根', r: '舍去 → 无解', key: true }],
        trap: '增根 = 去分母乘了"可能为 0 的式子"多出来的根。所以每道分式方程解完都要把根代回原方程验一验。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() { const b = Y.quizBest('m18'); $('m18-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; }
    bestLine();
    $('m18-quizgo').addEventListener('click', () => {
      $('m18-quizgo').style.display = 'none';
      Y.quizStart($('m18-quizbox'), 'm18', () => { $('m18-quizgo').style.display = ''; $('m18-quizgo').textContent = '再测一次'; bestLine(); });
    });

    return { cleanup() {} };
  }
};
