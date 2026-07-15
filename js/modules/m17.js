/* m17 · 第十七章 因式分解 —— 整式乘法的逆运算。核心=逆向拼矩形；再往深：带符号、多步彻底、十字相乘、分组。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.m17 = {
  id: 'm17', subject: 'math', emoji: '✂️',
  title: '因式分解', subtitle: '把和改写成积 · 乘法倒着走',
  wave: 'M6',
  nodes: [
    { id: 'm17-n1', label: '方向·和→积', needs: ['act:m17.dir', 'q:m17q1'] },
    { id: 'm17-n2', label: '拼矩形发现因式', needs: ['act:m17.tileL1', 'act:m17.tileL2'] },
    { id: 'm17-n3', label: '完全平方=正方形', needs: ['act:m17.tileSquare'] },
    { id: 'm17-n4', label: '"拼不成"的边界', needs: ['act:m17.tileStuck'] },
    { id: 'm17-n5', label: '提公因式', needs: ['act:m17.factor', 'any:q:m17q2|q:m17q3'] },
    { id: 'm17-n6', label: '公式法逆用（含系数）', needs: ['act:m17.formula', 'any:q:m17q6|q:m17q7|q:m17q8'] },
    { id: 'm17-n7', label: '多步·分解要彻底', needs: ['act:m17.multistep', 'any:q:m17q9|q:m17q10'] },
    { id: 'm17-n8', label: '带符号找两数', needs: ['act:m17.twonum', 'any:q:m17q4|q:m17q5'] },
    { id: 'm17-n9', label: '挑战·十字相乘/分组', needs: ['act:m17.cross', 'any:q:m17q11|q:m17q12'] }
  ],

  render(root, Y) {
    const T = window.TileKit;
    const $ = id => root.querySelector('#' + id);

    root.innerHTML = `
      <nav class="secnav">
        ${[['m17-intro', '引入'], ['m17-tile', '拼矩形'], ['m17-common', '提公因式'], ['m17-formula', '公式逆用'],
        ['m17-two', '找两数'], ['m17-multi', '四步曲'], ['m17-cross', '挑战'], ['m17-detective', '侦探'],
        ['m17-cards', '知识卡'], ['m17-quiz', '自测'], ['m17-feel', '手感练习']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="m17-intro">
        <div class="card" style="border-top:3px solid var(--math)">
          <p class="intro-hook">上一章你把 (x+2)(x+3) 乘开成 x²+5x+6。这一章<b>倒着走</b>：把 x²+5x+6 变回 (x+2)(x+3)。<br>
          一句话——<b>因式分解 = 把"和"改写成"积"</b>，正好是乘法的逆运算。</p>
          <p class="hint">先练一个眼力：下面哪些是"和→积"（真的因式分解），哪些不是？</p>
          <div id="m17-sort"></div>
        </div>
      </section>

      <section id="m17-tile">
        <div class="sec-title"><span class="em">🧩</span>逆向拼矩形 · 给你一堆砖，拼出因式</div>
        <div class="split">
          <div class="card">
            <div class="lvl" id="m17-tilelv"></div>
            <svg id="m17-tilesvg"></svg>
          </div>
          <div class="card">
            <h3 id="m17-tiletitle"></h3>
            <div id="m17-tileguess"></div>
            <div id="m17-tilestatus" class="small"></div>
            <div id="m17-tilemsg"></div>
          </div>
        </div>
      </section>

      <section id="m17-common">
        <div class="sec-title"><span class="em">🪝</span>提公因式 · 把大家都有的抽出来</div>
        <div class="split">
          <div class="card">
            <p class="pwbig" id="m17-cexpr"></p>
            <p id="m17-cask"></p>
            <div class="chips" id="m17-copts"></div>
            <div id="m17-cresult"></div>
          </div>
          <div class="card"><div id="m17-cmsg"></div><div class="btnrow" id="m17-cnav"></div></div>
        </div>
      </section>

      <section id="m17-formula">
        <div class="sec-title"><span class="em">🔄</span>公式逆用 · 倒着认平方差和完全平方（连系数一起）</div>
        <div class="card">
          <div class="chips" id="m17-ftab">
            <button class="chip on" data-f="diff">平方差型</button>
            <button class="chip" data-f="sq">完全平方型</button>
          </div>
          <div id="m17-fbox"></div>
        </div>
      </section>

      <section id="m17-two">
        <div class="sec-title"><span class="em">🎴</span>带符号找两数 · 分解 x² + bx + c</div>
        <div class="split">
          <div class="card">
            <p id="m17-twoq" class="pwbig" style="font-size:20px"></p>
            <p class="hint" id="m17-twohint"></p>
            <div class="feelopt" id="m17-twoopts"></div>
            <p class="small center">答对 <b id="m17-twook">0</b> · 连对 <b id="m17-twostreak">0</b></p>
          </div>
          <div class="card"><div id="m17-twomsg"></div></div>
        </div>
      </section>

      <section id="m17-multi">
        <div class="sec-title"><span class="em">🪜</span>分解四步曲 · 一提二套三查彻底</div>
        <div class="split">
          <div class="card">
            <div class="lvl" id="m17-mlv"></div>
            <p class="small">一步步把它拆到底。每一步：想清楚<b>这个式子该用哪招</b>。</p>
            <p class="pwbig" id="m17-mform" style="font-size:22px"></p>
            <div class="chips" id="m17-mopts" style="justify-content:center"></div>
          </div>
          <div class="card"><div id="m17-mmsg"><p class="hint">口诀：一<b>提</b>（先提公因式）→ 二<b>套</b>（平方差/完全平方）→ 三<b>查彻底</b>（括号里还能拆吗）→ 四<b>验</b>（乘回去）。</p></div>
            <div id="m17-mtrace" class="small" style="margin-top:8px"></div>
          </div>
        </div>
      </section>

      <section id="m17-cross">
        <div class="sec-title"><span class="em">✖️</span>挑战 · 十字相乘 与 分组分解 <span class="hint">往初三探探头</span></div>
        <div class="card">
          <div class="chips" id="m17-crtab">
            <button class="chip on" data-c="cross">十字相乘（首系数≠1）</button>
            <button class="chip" data-c="group">分组分解</button>
          </div>
          <div id="m17-crbox"></div>
        </div>
      </section>

      <section id="m17-detective">
        <div class="sec-title"><span class="em">🔎</span>彻底了吗 · 侦探判案 <span class="hint">帮别人挑错</span></div>
        <div class="split">
          <div class="card">
            <p class="small">别人给出一个"分解结果"，你来判：<b>彻底了</b>、<b>没分完</b>、还是<b>根本错了</b>？</p>
            <p class="pwbig" id="m17-dexpr" style="font-size:18px"></p>
            <div class="chips" style="justify-content:center">
              <button class="chip" data-v="ok">彻底了</button>
              <button class="chip" data-v="more">没分完</button>
              <button class="chip" data-v="wrong">根本错了</button>
            </div>
            <p class="small center">已判 <b id="m17-dn">0</b> · 连对 <b id="m17-dstreak">0</b></p>
          </div>
          <div class="card"><div id="m17-dmsg"><p class="hint">口诀"分解要彻底"：每一步做完都回头问一句——括号里还能再拆吗？</p></div></div>
        </div>
      </section>

      <section id="m17-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡</div>
        <div id="m17-cardlist"></div>
      </section>

      <section id="m17-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 12 题（含挑战）</div>
        <div class="card">
          <p>方向、提公因式（含变号）、带符号找两数、公式逆用（含系数）、多步彻底、十字相乘、分组——难度拉满。错题进错因本。</p>
          <p class="hint" id="m17-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="m17-quizgo">开始自测</button></div>
          <div id="m17-quizbox"></div>
        </div>
      </section>

      <section id="m17-feel">
        <div class="sec-title"><span class="em">⚡</span>手感练习 · 三招混着来（带符号·带系数·多步）</div>
        <div class="card feel">
          <p class="small">因式分解光会不够，还要<b>快</b>。快问快答，只练手感、不进错因本。目标正确率 90%。</p>
          <div id="m17-feelbox"></div>
        </div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c => c.addEventListener('click', () => { const t = document.getElementById(c.dataset.to); if (t) t.scrollIntoView({ block: 'start' }); }));

    /* ================= ① 引入：和→积 分拣 ================= */
    (function introSort() {
      const CARDS = [
        { e: 'x² − 1 = (x+1)(x−1)', isF: true, why: '左边是和、右边是积 → 是因式分解。' },
        { e: '(x+1)(x−1) = x² − 1', isF: false, why: '积→和，这是整式乘法（上一章），方向反了。' },
        { e: 'x² + 2x = x(x+2)', isF: true, why: '和→积 ✓ 提了个公因式 x。' },
        { e: 'x(x+2) = x² + 2x', isF: false, why: '积→和，是乘法不是分解。' },
        { e: 'x² + 1 = x² + 1', isF: false, why: '右边还是"和"，没变成积——不是分解。' }
      ];
      const box = $('m17-sort');
      box.innerHTML = CARDS.map((c, i) =>
        `<div class="mitem" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="pwbig" style="font-size:16px;margin:0;flex:1;min-width:180px">${c.e}</span>
          <button class="chip" data-i="${i}" data-a="1">是分解</button>
          <button class="chip" data-i="${i}" data-a="0">不是</button>
          <span id="m17-sr-${i}" class="small"></span></div>`).join('');
      let done = 0;
      box.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.i, said = b.dataset.a === '1', c = CARDS[i], ok = said === c.isF;
        $('m17-sr-' + i).innerHTML = (ok ? '<b style="color:var(--ok)">✓</b> ' : '<b style="color:var(--bad)">✗</b> ') + c.why;
        if (!b.parentNode.dataset.done) { b.parentNode.dataset.done = '1'; done++; if (done >= 4) Y.ev('act:m17.dir'); }
      }));
    })();

    /* ================= ② 逆向拼矩形 ================= */
    (function tileLab() {
      const LV = [
        { id: 'L1', pile: { xx: 1, x: 3, one: 2 }, poly: 'x² + 3x + 2', ev: 'act:m17.tileL1', guess: { q: '先猜：1 块 x²、3 条 x、2 个 1，能刚好拼成一个长方形吗？', o: ['能', '不能', '说不准'], a: 0 } },
        { id: 'L2', pile: { xx: 1, x: 5, one: 6 }, poly: 'x² + 5x + 6', ev: 'act:m17.tileL2', say: true, guess: { q: '先猜：这堆（1 个 x²、5 条 x、6 个 1）能拼成长方形吗？', o: ['能', '不能', '说不准'], a: 0 } },
        { id: 'L3', pile: { xx: 1, x: 4, one: 4 }, poly: 'x² + 4x + 4', ev: 'act:m17.tileSquare', square: true, guess: { q: '先猜：1 个 x²、4 条 x、4 个 1，拼出来会是什么形状？', o: ['长方形', '正方形', '拼不成'], a: 1 } },
        { id: 'L4', pile: { xx: 1, x: 1, one: 1 }, poly: 'x² + x + 1', ev: 'act:m17.tileStuck', stuck: true, guess: { q: '先猜：1 个 x²、1 条 x、1 个 1，能拼成完整的长方形吗？', o: ['能', '不能'], a: 1 } }
      ];
      let cur = 0, fb = null;
      function chips() {
        $('m17-tilelv').innerHTML = LV.map((l, i) => `<button class="lc${Y.has(l.ev) ? ' ok' : ''}${i === cur ? ' cur' : ''}" data-i="${i}">${i + 1}</button>`).join('');
        $('m17-tilelv').querySelectorAll('.lc').forEach(b => b.addEventListener('click', () => load(+b.dataset.i)));
      }
      function load(i) {
        cur = i; const lv = LV[i];
        $('m17-tiletitle').innerHTML = '第 ' + (i + 1) + ' 关 · 把这堆砖拼成长方形：<b>' + lv.poly + '</b>';
        $('m17-tilemsg').innerHTML = ''; $('m17-tilestatus').innerHTML = ''; $('m17-tileguess').innerHTML = '';
        let started = false;
        function begin() {
          fb = T.factorBuilder($('m17-tilesvg'), lv.pile, {
            onChange(st) {
              $('m17-tilestatus').innerHTML = `右列 <b>${st.p}</b> 条 x · 下行 <b>${st.q}</b> 条 x · 角落 <b>${st.units}</b> 个 1　（还剩 x×${st.xRem}、1×${st.uRem}）`;
              if (st.solved) return;
              if (st.stuck && !lv.done) {
                $('m17-tilemsg').innerHTML = `<div class="explain">🧩 x 用完了，可角落还剩 <b>${st.uRem}</b> 个小砖，塞不进这个 ${st.p}×${st.q} 的角。<b>这堆拼不成完整的长方形</b>——${lv.poly} 在整式范围内<b>分不了</b>。不是所有式子都能因式分解。</div>`;
                lv.done = 1; Y.ev(lv.ev); chips(); Y.toast('🔎 拼不成——也是一种发现', true);
              } else if (!st.stuck) $('m17-tilemsg').innerHTML = '';
            },
            onSolve(p, q) {
              if (lv.done) return; lv.done = 1;
              let html = `<div class="explain">🎉 拼成了！两条边是 <b>x + ${p}</b> 和 <b>x + ${q}</b>。<br>所以 <b>${lv.poly} = (x + ${p})(x + ${q})</b>。`;
              if (p === q) html += `<br>两条边一样长——拼出<b>正方形</b>！这就是完全平方式：${lv.poly} = (x + ${p})²。`;
              if (lv.say) html += '<br>看出门道没：中间的 <b>5</b> 是两加数之<b>和</b>（2+3），末项 <b>6</b> 是它俩之<b>积</b>（2×3）。带符号找两数就靠这个。';
              html += '</div><div class="btnrow"><button class="btn ghost" id="m17-tileredo">↺ 重拼</button></div>';
              $('m17-tilemsg').innerHTML = html;
              $('m17-tileredo').addEventListener('click', () => { fb.reset(); $('m17-tilemsg').innerHTML = ''; });
              Y.ev(lv.ev); chips(); Y.toast('🧩 ' + lv.poly + ' 拼出来了', true);
            }
          });
        }
        $('m17-tileguess').appendChild(Y.guess({ q: lv.guess.q, options: lv.guess.o, answer: lv.guess.a, reveal: '动手拼拼看——把砖拖上去。', onDone: () => { if (!started) { started = true; begin(); } } }));
        if (Y.has(lv.ev)) { started = true; begin(); }
        chips();
      }
      T.factorBuilder($('m17-tilesvg'), { xx: 1, x: 3, one: 2 }, {});
      load(0);
    })();

    /* ================= ③ 提公因式 ================= */
    (function commonLab() {
      const EX = [
        { e: '6a²b + 9ab²', opts: ['3ab', 'ab', '3a²b²', '3'], gcf: '3ab', out: '3ab(2a + 3b)', note: '系数 6、9 最大公约数 3；a、b 每项都有、各取最低次 → 3ab。抽出后 2a、3b。' },
        { e: '12x³y − 18x²y²', opts: ['6x²y', '6xy', '2x²y', '6x²y²'], gcf: '6x²y', out: '6x²y(2x − 3y)', note: '12、18 最大公约数 6；x 取最低次 x²、y 取 y¹ → 6x²y。这题字母次数最容易取错。' },
        { e: '−4x² + 8x', opts: ['−4x', '4x', 'x', '−4'], gcf: '−4x', out: '−4x(x − 2)', neg: true, note: '首项负，提出负号。−4x²÷(−4x)=x；8x÷(−4x)=−2 —— 括号里<b>每项都要变号</b>。' },
        { e: 'x(a+b) + 2(a+b)', opts: ['(a+b)', 'x', '2', 'x+2'], gcf: '(a+b)', out: '(a+b)(x + 2)', note: '公因式可以是个多项式——两项都含 (a+b)，整体抽出，剩 x 和 2。' }
      ];
      let i = 0;
      function show() {
        const ex = EX[i];
        $('m17-cexpr').textContent = ex.e;
        $('m17-cask').innerHTML = '先想：这几项的<b>公因式</b>是哪个？';
        $('m17-copts').innerHTML = ex.opts.map(o => `<button class="chip" data-o="${o}">${o}</button>`).join('');
        $('m17-cresult').innerHTML = '';
        $('m17-cmsg').innerHTML = '<p class="hint">公因式 = 各项系数最大公约数 × 每项都有的字母（取最低次）。</p>';
        $('m17-copts').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
          const ok = b.dataset.o === ex.gcf;
          $('m17-copts').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
          if (ok) { $('m17-cresult').innerHTML = `<div class="stdline" style="font-size:18px">${ex.e} = <b>${ex.out}</b></div>`; $('m17-cmsg').innerHTML = `<div class="explain">${ex.note}${ex.neg ? '<br><b style="color:var(--bad)">变号是这里的坑。</b>' : ''}</div>`; Y.ev('act:m17.factor'); }
          else $('m17-cmsg').innerHTML = `<div class="explain">${b.dataset.o} 还不是<b>完整</b>的公因式——要么提得不够干净（括号里还留着公因式），要么取多了。再看看。</div>`;
        }));
        $('m17-cnav').innerHTML = EX.map((_, k) => `<button class="chip${k === i ? ' on' : ''}" data-k="${k}">例 ${k + 1}</button>`).join('');
        $('m17-cnav').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => { i = +b.dataset.k; show(); }));
      }
      show();
    })();

    /* ================= ④ 公式逆用（含系数） ================= */
    (function formulaLab() {
      let tab = 'diff', di = 0, si = 0;
      const DIFF = [
        { e: 'x² − 9', a: 'x', b: '3', out: '(x + 3)(x − 3)' },
        { e: '4x² − 25', a: '2x', b: '5', out: '(2x + 5)(2x − 5)' },
        { e: '9x² − 16', a: '3x', b: '4', out: '(3x + 4)(3x − 4)' }
      ];
      const SQ = [
        { e: 'x² − 6x + 9', sign: '−', ok: true, out: '(x − 3)²' },
        { e: '9x² − 12x + 4', sign: '−', ok: true, out: '(3x − 2)²' },
        { e: 'x² + 5x + 4', sign: '+', ok: false, out: '(x+1)(x+4)（靠"找两数"，不是完全平方）' }
      ];
      function render() {
        const box = $('m17-fbox');
        if (tab === 'diff') {
          const d = DIFF[di];
          box.innerHTML = `<p class="pwbig" style="font-size:22px">${d.e}</p>
            <p>它是"平方 − 平方"。先猜：这里的两个"平方"分别是谁的平方？（系数也要开方！）</p>
            <div id="m17-fdg"></div><div id="m17-fdr"></div>
            <div class="btnrow">${DIFF.map((_, k) => `<button class="chip${k === di ? ' on' : ''}" data-k="${k}">例 ${k + 1}</button>`).join('')}</div>`;
          box.querySelector('#m17-fdg').appendChild(Y.guess({
            q: d.e + ' = (  )² − (  )²，括号里依次是：',
            options: [d.a + ' 和 ' + d.b, (d.a.replace(/^\dx/, 'x')) + ' 和 ' + d.b + '（系数忘开方）', d.a + ' 和 ' + (d.b + '²') + '（尾项多开了）'],
            answer: 0, reveal: `对：${d.e} = (${d.a})² − (${d.b})²，套平方差 → <b>${d.out}</b>。`,
            onDone: () => { box.querySelector('#m17-fdr').innerHTML = `<div class="stdline">${d.e} = <b>${d.out}</b>　（a²−b² = (a+b)(a−b)）</div>`; Y.ev('act:m17.formula'); }
          }));
          box.querySelectorAll('.btnrow .chip').forEach(b => b.addEventListener('click', () => { di = +b.dataset.k; render(); }));
        } else {
          const s = SQ[si];
          box.innerHTML = `<p class="pwbig" style="font-size:22px">${s.e}</p>
            <p>完全平方式要过<b>三要素</b>关，逐个勾：</p><div id="m17-sq3"></div><div id="m17-sqr"></div>
            <div class="btnrow">${SQ.map((_, k) => `<button class="chip${k === si ? ' on' : ''}" data-k="${k}">例 ${k + 1}</button>`).join('')}</div>`;
          const checks = [['首项是某个式子的平方吗？', true], ['末项是某个数的平方吗？', true], ['中间项 = ±2 × √首 × √尾 吗？', s.ok]];
          const st = [null, null, null];
          const c3 = box.querySelector('#m17-sq3');
          c3.innerHTML = checks.map((ck, k) => `<div style="margin:8px 0"><b>${ck[0]}</b> <button class="chip" data-k="${k}" data-y="1">是</button><button class="chip" data-k="${k}" data-y="0">否</button> <span id="m17-sqm-${k}" class="small"></span></div>`).join('');
          c3.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
            const k = +b.dataset.k, yes = b.dataset.y === '1', truth = checks[k][1]; st[k] = yes;
            c3.querySelectorAll(`.chip[data-k="${k}"]`).forEach(x => x.classList.toggle('on', x === b));
            $('m17-sqm-' + k).innerHTML = (yes === truth) ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">再看看</b>';
            if (st.every((v, idx) => v === checks[idx][1])) {
              box.querySelector('#m17-sqr').innerHTML = s.ok ? `<div class="stdline">三要素齐全，中间 ${s.sign} 号 → ${s.e} = <b>${s.out}</b></div>` : `<div class="explain">第三关没过——中间项配不上 2×√首×√尾。它<b>不是</b>完全平方式：${s.out}。"长得像"不等于"是"。</div>`;
              Y.ev('act:m17.formula');
            }
          }));
          box.querySelectorAll('.btnrow .chip').forEach(b => b.addEventListener('click', () => { si = +b.dataset.k; render(); }));
        }
      }
      $('m17-ftab').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('m17-ftab').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); tab = b.dataset.f; render(); });
      render();
    })();

    /* ================= ⑤ 带符号找两数 ================= */
    (function twoLab() {
      const DECK = [
        { b: 5, c: 6, n: [2, 3], hint: '积正、和正 → 两数都正。' },
        { b: -5, c: 6, n: [-2, -3], hint: '积正、和负 → 两数都负。' },
        { b: 1, c: -6, n: [3, -2], hint: '积负 → 一正一负；和正 → 正的绝对值更大。' },
        { b: -1, c: -6, n: [-3, 2], hint: '积负 → 异号；和负 → 负的绝对值更大。' },
        { b: -7, c: 12, n: [-3, -4], hint: '积正和负 → 都负。' },
        { b: 2, c: -15, n: [5, -3], hint: '积负异号，和正 → 正的更大。' },
        { b: -2, c: -8, n: [-4, 2], hint: '积负异号，和负 → 负的更大。' },
        { b: -5, c: -6, n: [-6, 1], hint: '积负异号，和负 → 负的更大。' }
      ];
      const fac = n => `(x ${n < 0 ? '− ' + (-n) : '+ ' + n})`;
      function opts(d) {
        const right = fac(d.n[0]) + fac(d.n[1]);
        const set = new Set([right]);
        // 干扰项：符号弄反、拆错
        const cands = [fac(-d.n[0]) + fac(-d.n[1]), fac(d.n[0]) + fac(-d.n[1]), fac(-d.n[0]) + fac(d.n[1])];
        cands.forEach(c => { if (set.size < 4) set.add(c); });
        while (set.size < 4) set.add(fac(d.n[0] + 1) + fac(d.n[1] - 1));
        return { list: [...set].sort(() => Math.random() - 0.5), right };
      }
      let i = 0, ok = 0, streak = 0, order = DECK.map((_, k) => k).sort(() => Math.random() - 0.5);
      function show() {
        const d = DECK[order[i % order.length]], bT = d.b < 0 ? '− ' + (-d.b) : '+ ' + d.b, cT = d.c < 0 ? '− ' + (-d.c) : '+ ' + d.c;
        $('m17-twoq').innerHTML = `x² ${bT}x ${cT}`;
        $('m17-twohint').innerHTML = `找两个数：和是 <b>${d.b}</b>、积是 <b>${d.c}</b>，就是 (x+这个)(x+那个)。`;
        const o = opts(d);
        $('m17-twoopts').innerHTML = o.list.map(x => `<button data-o="${x}">${x}</button>`).join('');
        $('m17-twoopts').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
          const good = b.dataset.o === o.right;
          ok += good ? 1 : 0; streak = good ? streak + 1 : 0;
          $('m17-twook').textContent = ok; $('m17-twostreak').textContent = streak;
          $('m17-twoopts').querySelectorAll('button').forEach(x => { x.disabled = true; if (x.dataset.o === o.right) x.classList.add('ok'); if (x === b && !good) x.classList.add('no'); });
          $('m17-twomsg').innerHTML = `<div class="explain">${good ? '✅ ' : '❌ 是 ' + o.right + '。'}<b>${d.hint}</b> 两个数是 ${d.n[0]} 和 ${d.n[1]}：和 ${d.n[0] + d.n[1]}、积 ${d.n[0] * d.n[1]} ✓ → x² ${bT}x ${cT} = ${o.right}。</div>`;
          if (ok >= 5 && streak >= 3) Y.ev('act:m17.twonum');
          i++; setTimeout(show, good ? 750 : 1500);
        }));
      }
      show();
    })();

    /* ================= ⑥ 分解四步曲工作台 ================= */
    (function multiLab() {
      const PROB = [
        { start: '3x³ − 12x', steps: [
          { form: '3x³ − 12x', opt: ['提公因式 3x', '直接用平方差', '用完全平方', '已经彻底'], a: 0, next: '3x(x² − 4)', note: '先看公因式——3x³ 和 12x 都含 3x。永远先提公因式。' },
          { form: '3x(x² − 4)', opt: ['再提公因式', '括号里用平方差', '用完全平方', '已经彻底'], a: 1, next: '3x(x + 2)(x − 2)', note: 'x²−4 = x²−2² 是平方差。' },
          { form: '3x(x + 2)(x − 2)', opt: ['还能再提', '还能用平方差', '用完全平方', '已经彻底 ✓'], a: 3, next: null, note: '每个括号都拆不动了——彻底！' }
        ] },
        { start: '2x² − 8', steps: [
          { form: '2x² − 8', opt: ['提公因式 2', '直接用平方差', '用完全平方', '已经彻底'], a: 0, next: '2(x² − 4)', note: '先提 2。跳过这步就套不干净。' },
          { form: '2(x² − 4)', opt: ['再提', '括号里用平方差', '用完全平方', '已经彻底'], a: 1, next: '2(x + 2)(x − 2)', note: 'x²−4 是平方差。' },
          { form: '2(x + 2)(x − 2)', opt: ['还能提', '还能用平方差', '用完全平方', '已经彻底 ✓'], a: 3, next: null, note: '彻底了。' }
        ] },
        { start: 'x⁴ − 16', steps: [
          { form: 'x⁴ − 16', opt: ['提公因式', '用平方差', '用完全平方', '已经彻底'], a: 1, next: '(x² + 4)(x² − 4)', note: 'x⁴−16 = (x²)²−4²，平方差。没有公因式可提。' },
          { form: '(x² + 4)(x² − 4)', opt: ['(x²+4) 再拆', '(x²−4) 用平方差', '用完全平方', '已经彻底'], a: 1, next: '(x² + 4)(x + 2)(x − 2)', note: 'x²−4 还是平方差！而 x²+4 是"平方+平方"，拆不动。' },
          { form: '(x² + 4)(x + 2)(x − 2)', opt: ['还能拆', '还能平方差', '用完全平方', '已经彻底 ✓'], a: 3, next: null, note: 'x²+4 拆不了，其余都拆到底——彻底。' }
        ] },
        { start: 'a⁴ − 1', steps: [
          { form: 'a⁴ − 1', opt: ['提公因式', '用平方差', '用完全平方', '已经彻底'], a: 1, next: '(a² + 1)(a² − 1)', note: 'a⁴−1=(a²)²−1²，平方差。' },
          { form: '(a² + 1)(a² − 1)', opt: ['(a²+1) 再拆', '(a²−1) 用平方差', '用完全平方', '已经彻底'], a: 1, next: '(a² + 1)(a + 1)(a − 1)', note: 'a²−1 还能拆；a²+1 拆不动。' },
          { form: '(a² + 1)(a + 1)(a − 1)', opt: ['还能拆', '还能平方差', '用完全平方', '已经彻底 ✓'], a: 3, next: null, note: '彻底。' }
        ] }
      ];
      let cur = 0, si = 0, solved = new Set();
      function chips() {
        $('m17-mlv').innerHTML = PROB.map((p, i) => `<button class="lc${solved.has(i) ? ' ok' : ''}${i === cur ? ' cur' : ''}" data-i="${i}">${i + 1}</button>`).join('');
        $('m17-mlv').querySelectorAll('.lc').forEach(b => b.addEventListener('click', () => { cur = +b.dataset.i; si = 0; render(); }));
      }
      function render() {
        const p = PROB[cur], step = p.steps[si];
        $('m17-mform').textContent = step.form;
        $('m17-mopts').innerHTML = step.opt.map((o, k) => `<button class="chip" data-k="${k}">${o}</button>`).join('');
        $('m17-mtrace').innerHTML = '过程：' + p.steps.slice(0, si + 1).map(s => s.form).join(' → ');
        $('m17-mopts').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (k === step.a) {
            $('m17-mmsg').innerHTML = `<div class="explain">✅ ${step.note}</div>`;
            if (step.next === null) {
              solved.add(cur); chips();
              const total = p.steps.map(s => s.form);
              $('m17-mmsg').innerHTML += `<div class="stdline">${p.start} = <b>${total[total.length - 1]}</b>　✂️ 拆到底了。别忘了第四步：<b>乘回去验一验</b>。</div>`;
              if (solved.size >= 2) Y.ev('act:m17.multistep');
              if (cur < PROB.length - 1) $('m17-mmsg').innerHTML += `<div class="btnrow"><button class="btn primary" id="m17-mnext">下一题 ›</button></div>`, setTimeout(() => { const nb = $('m17-mnext'); if (nb) nb.addEventListener('click', () => { cur++; si = 0; render(); }); }, 0);
            } else { si++; setTimeout(render, 350); }
          } else {
            $('m17-mmsg').innerHTML = `<div class="explain">❌ 这一步不对。${step.a === 0 ? '有公因式就得先提，别急着套公式。' : step.next === null ? '再看看——括号里真的都拆不动了吗？' : '想想这个式子的结构：是"平方−平方"还是别的？'}</div>`;
          }
        }));
      }
      chips(); render();
    })();

    /* ================= ⑦ 挑战：十字相乘 + 分组 ================= */
    (function crossLab() {
      let tab = 'cross';
      const CROSS = [
        { e: '2x² + 7x + 3', out: '(2x + 1)(x + 3)', rows: [['2x', '1'], ['x', '3']], cross: '2x·3 + x·1 = 7x', opts: ['(2x + 1)(x + 3)', '(2x + 3)(x + 1)', '(x + 1)(x + 3)', '(2x + 7)(x + 3)'] },
        { e: '3x² + 7x + 2', out: '(3x + 1)(x + 2)', rows: [['3x', '1'], ['x', '2']], cross: '3x·2 + x·1 = 7x', opts: ['(3x + 1)(x + 2)', '(3x + 2)(x + 1)', '(3x + 7)(x + 2)', '(x + 1)(x + 2)'] },
        { e: '2x² − 5x + 2', out: '(2x − 1)(x − 2)', rows: [['2x', '−1'], ['x', '−2']], cross: '2x·(−2) + x·(−1) = −5x', opts: ['(2x − 1)(x − 2)', '(2x − 2)(x − 1)', '(2x + 1)(x + 2)', '(x − 1)(x − 2)'] }
      ];
      const GROUP = [
        { e: 'ax + ay + bx + by', out: '(a + b)(x + y)', steps: ['前两项提 a → a(x+y)', '后两项提 b → b(x+y)', '两组都含 (x+y) → (a+b)(x+y)'], opts: ['(a + b)(x + y)', '(a + x)(b + y)', 'ab(x + y)', '(ax + by)(a + b)'] },
        { e: 'x² − xy + x − y', out: '(x + 1)(x − y)', steps: ['前两项提 x → x(x−y)', '后两项 x−y = 1·(x−y)', '两组都含 (x−y) → (x+1)(x−y)'], opts: ['(x + 1)(x − y)', '(x − 1)(x + y)', 'x(x − y + 1)', '(x² + x)(1 − y)'] }
      ];
      let ci = 0, gi = 0;
      function render() {
        const box = $('m17-crbox');
        if (tab === 'cross') {
          const c = CROSS[ci];
          box.innerHTML = `<p class="pwbig" style="font-size:22px">${c.e}</p>
            <p>首系数不是 1，"找两数"不够用了——试试<b>十字相乘</b>：把两列竖着摆，交叉相乘再相加要等于中间项。</p>
            <table class="fill" style="max-width:220px;margin:8px auto"><tr><td class="kbd">${c.rows[0][0]}</td><td style="color:var(--muted)">✕</td><td class="kbd">${c.rows[0][1]}</td></tr><tr><td class="kbd">${c.rows[1][0]}</td><td style="color:var(--muted)">✕</td><td class="kbd">${c.rows[1][1]}</td></tr></table>
            <p class="small center">交叉相乘相加：<b class="kbd">${c.cross}</b> ✓（对上中间项就成）</p>
            <div class="feelopt" id="m17-crc">${c.opts.slice().sort(() => Math.random() - 0.5).map(o => `<button data-o="${o}">${o}</button>`).join('')}</div>
            <div id="m17-crr"></div>
            <div class="btnrow">${CROSS.map((_, k) => `<button class="chip${k === ci ? ' on' : ''}" data-k="${k}">例 ${k + 1}</button>`).join('')}</div>`;
          box.querySelectorAll('#m17-crc button').forEach(b => b.addEventListener('click', () => {
            const good = b.dataset.o === c.out;
            box.querySelectorAll('#m17-crc button').forEach(x => { x.disabled = true; if (x.dataset.o === c.out) x.classList.add('ok'); if (x === b && !good) x.classList.add('no'); });
            box.querySelector('#m17-crr').innerHTML = `<div class="explain">${good ? '✅ ' : '❌ 是 ' + c.out + '。'}十字交叉 ${c.cross}，对上了中间项 → ${c.e} = <b>${c.out}</b>。验一验：乘开正好回到原式。</div>`;
            if (good) Y.ev('act:m17.cross');
          }));
          box.querySelectorAll('.btnrow .chip').forEach(b => b.addEventListener('click', () => { ci = +b.dataset.k; render(); }));
        } else {
          const g = GROUP[gi];
          box.innerHTML = `<p class="pwbig" style="font-size:20px">${g.e}</p>
            <p>四项、没有公共因式——但可以<b>两两分组</b>，各自提公因式，再找共同的括号。</p>
            <div class="fstep">${g.steps.map((s, k) => `<div>${k + 1}. ${s}</div>`).join('')}</div>
            <p>那么它 = ？</p>
            <div class="feelopt" id="m17-crg">${g.opts.slice().sort(() => Math.random() - 0.5).map(o => `<button data-o="${o}">${o}</button>`).join('')}</div>
            <div id="m17-grr"></div>
            <div class="btnrow">${GROUP.map((_, k) => `<button class="chip${k === gi ? ' on' : ''}" data-k="${k}">例 ${k + 1}</button>`).join('')}</div>`;
          box.querySelectorAll('#m17-crg button').forEach(b => b.addEventListener('click', () => {
            const good = b.dataset.o === g.out;
            box.querySelectorAll('#m17-crg button').forEach(x => { x.disabled = true; if (x.dataset.o === g.out) x.classList.add('ok'); if (x === b && !good) x.classList.add('no'); });
            box.querySelector('#m17-grr').innerHTML = `<div class="explain">${good ? '✅ ' : '❌ 是 ' + g.out + '。'}两组都含同一个括号，把它提出来 → ${g.e} = <b>${g.out}</b>。这叫<b>分组分解法</b>。</div>`;
            if (good) Y.ev('act:m17.cross');
          }));
          box.querySelectorAll('.btnrow .chip').forEach(b => b.addEventListener('click', () => { gi = +b.dataset.k; render(); }));
        }
      }
      $('m17-crtab').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('m17-crtab').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); tab = b.dataset.c; render(); });
      render();
    })();

    /* ================= ⑧ 彻底了吗 侦探 ================= */
    (function detLab() {
      const DECK = [
        { e: 'x⁴ − 1 = (x²+1)(x²−1)', v: 'more', note: '(x²−1) 还是平方差，能再拆！彻底：(x²+1)(x+1)(x−1)。' },
        { e: 'x² − 4 = (x+2)(x−2)', v: 'ok', note: '拆到底了。' },
        { e: 'x² + 4 = (x+2)(x−2)', v: 'wrong', note: '乘开是 x²−4，不是 x²+4！"平方+平方"分不了。' },
        { e: '2x² − 8 = 2(x²−4)', v: 'more', note: 'x²−4 还是平方差，得 2(x+2)(x−2)。' },
        { e: 'x² − 6x + 9 = (x−3)²', v: 'ok', note: '完全平方，到底。' },
        { e: '(a+b)² = a² + b²', v: 'wrong', note: '根本不成立——丢了中间项 2ab。' },
        { e: 'x³ − x = x(x²−1)', v: 'more', note: 'x²−1 还能拆：x(x+1)(x−1)。' },
        { e: '4x² − 9 = (2x+3)(2x−3)', v: 'ok', note: '平方差拆彻底。' },
        { e: 'x² − 5x + 6 = (x−2)(x+3)', v: 'wrong', note: '乘开是 x²+x−6，不对！应是 (x−2)(x−3)，两数都负。' }
      ];
      const LAB = { ok: '彻底了', more: '没分完', wrong: '根本错了' };
      let i = 0, streak = 0, done = 0, order = DECK.map((_, k) => k).sort(() => Math.random() - 0.5);
      function show() { $('m17-dexpr').textContent = DECK[order[i % order.length]].e; }
      show();
      root.querySelectorAll('#m17-detective .chips .chip').forEach(btn => btn.addEventListener('click', () => {
        const d = DECK[order[i % order.length]], ok = btn.dataset.v === d.v;
        done++; streak = ok ? streak + 1 : 0;
        $('m17-dn').textContent = done; $('m17-dstreak').textContent = streak;
        $('m17-dmsg').innerHTML = `<div class="explain">${ok ? '✅ 判对了。' : '❌ 应是「' + LAB[d.v] + '」。'}${d.note}</div>`;
        i++; setTimeout(show, 1000);
      }));
    })();

    /* ================= 知识卡（讲透卡：规则 + 图 + 走一遍 + 坑） ================= */
    window.ExplainKit.cards($('m17-cardlist'), [
      { emoji: '↔️', title: '什么是因式分解', rule: '把一个多项式（"和"）改写成几个整式的<b>积</b>——正好是整式乘法的逆运算。', fig: 'arrow',
        trap: '结果必须是"积"。写成 a(b+c)+d 这种还带着"和"，就是没分完；方向反了（积→和）那是乘法，不是分解。',
        why: '记住这张图的两个方向：往右是乘法（把括号拆开），往左是因式分解（把它收回括号）。这一章练的全是"往左走"。' },
      { emoji: '🪝', title: '提公因式法', rule: '公因式 = 各项系数的最大公约数 × 每项都含的字母（取最低次幂）。', eg: '12x³y − 18x²y²',
        steps: [
          { t: '12x³y − 18x²y²', r: '先找公因式' },
          { t: '系数 12、18 → 最大公约数 6', r: '数字部分' },
          { t: '字母取最低次 → x²·y', r: 'x 最低是 x²、y 是 y¹', key: true },
          { t: '= 6x²y(2x − 3y)', r: '各项除以 6x²y', key: true }
        ],
        trap: '首项为负常提负号，括号里<b>每一项都要变号</b>：−4x²+8x = −4x(x−2)，不是 (x+2)。' },
      { emoji: '🔀', title: '平方差公式（逆用）', rule: 'a² − b² = (a + b)(a − b)。只有"平方 <b>减</b> 平方"才行。', fig: 'diffArea', eg: '4x² − 9',
        steps: [
          { t: '4x² − 9', r: '先认结构：平方 − 平方' },
          { t: '= (2x)² − 3²', r: '4x²=(2x)²、9=3²，系数也开方', key: true },
          { t: '= (2x + 3)(2x − 3)', r: '套公式', key: true }
        ],
        trap: 'x² + 4 是"平方 + 平方"，整式范围内分不了——(x+2)(x−2) 乘开是 x²−4，不是它。' },
      { emoji: '⬛', title: '完全平方公式（逆用）', rule: 'a² ± 2ab + b² = (a ± b)²。要过<b>三要素</b>关。', fig: 'sqArea', eg: '9x² − 12x + 4',
        steps: [
          { t: '首 9x² = (3x)²、尾 4 = 2²', r: '首、尾都是平方 ✓' },
          { t: '中间 −12x = −2·(3x)·2', r: '= ±2·√首·√尾 ✓', key: true },
          { t: '= (3x − 2)²', r: '中间负号 → 括号里减号', key: true }
        ],
        trap: '中间项配不上 2·√首·√尾就<b>不是</b>完全平方：x²+5x+4 看着像，其实是 (x+1)(x+4)。' },
      { emoji: '🎴', title: '带符号找两数', rule: 'x² + bx + c = (x + m)(x + n)，其中 m + n = b、m · n = c。', eg: 'x² − x − 6',
        steps: [
          { t: 'x² − x − 6', r: '找两数：和 −1、积 −6' },
          { t: '积 −6 < 0 → 一正一负', r: '先定符号', key: true },
          { t: '和 −1 < 0 → 负的绝对值更大', r: '得 −3 和 +2', key: true },
          { t: '= (x − 3)(x + 2)', r: '验：−3+2=−1、−3×2=−6 ✓' }
        ],
        trap: '符号是命门：积为正 → 两数同号（正负看"和"）；积为负 → 两数异号（谁绝对值大随"和"的符号）。' },
      { emoji: '✖️', title: '十字相乘（首系数 ≠ 1）', rule: 'ax² + bx + c：把 a、c 各拆成两个因数竖排，<b>交叉相乘之和 = b</b> 时即可。', fig: () => window.ExplainKit.FIG.cross('2x', '1', 'x', '3', '7x'), eg: '2x² + 7x + 3',
        steps: [
          { t: '2x 与 x 竖排；1 与 3 竖排', r: '拆首项和末项' },
          { t: '交叉：2x·3 + x·1 = 7x', r: '凑中间项 ✓', key: true },
          { t: '= (2x + 1)(x + 3)', r: '横着读出两个因式', key: true }
        ],
        trap: '交叉之和必须等于中间项——(2x+3)(x+1) 的交叉是 2x·1+3·x=5x，对不上。初三会系统学，这里先会用。' },
      { emoji: '🔗', title: '分组分解法', rule: '四项、无公共因式时，两两分组各自提公因式，再提出共同的括号。', eg: 'ax + ay + bx + by',
        steps: [
          { t: 'ax + ay + bx + by', r: '四项，直接提不出' },
          { t: '= a(x + y) + b(x + y)', r: '前两项提 a、后两项提 b', key: true },
          { t: '= (a + b)(x + y)', r: '两组都含 (x+y)，再提', key: true }
        ],
        trap: '要分得"两组能提出同一个括号"才行——分错组就前功尽弃，换一种分法再试。' },
      { emoji: '📋', title: '方法卡 · 分解四步曲', rule: '一<b>提</b> → 二<b>套</b> → 三<b>查彻底</b> → 四<b>验</b>。顺序不能乱。', eg: '3x³ − 12x',
        steps: [
          { t: '3x³ − 12x', r: '① 提：先看公因式' },
          { t: '= 3x(x² − 4)', r: '提出 3x', key: true },
          { t: '= 3x(x + 2)(x − 2)', r: '② 套：x²−4 是平方差', key: true },
          { t: '③ 查彻底 ✓　④ 乘回去验', r: '每个括号都拆不动了' }
        ],
        trap: '跳步就套不上：3x³−12x 不先提 3x，直接套平方差是套不了的。停在 3x(x²−4) 就是没分完。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() { const b = Y.quizBest('m17'); $('m17-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; }
    bestLine();
    $('m17-quizgo').addEventListener('click', () => {
      $('m17-quizgo').style.display = 'none';
      Y.quizStart($('m17-quizbox'), 'm17', () => { $('m17-quizgo').style.display = ''; $('m17-quizgo').textContent = '再测一次'; bestLine(); });
    });

    /* ================= 手感练习 ================= */
    (function feelLab() {
      const DECK = ((window.YJS_DATA.feel || {}).m17 || {}).factor || [];
      let q = null, ok = 0, total = 0, times = [], t0 = 0;
      const box = $('m17-feelbox');
      function sup(s) { return String(s).replace(/([a-zA-Z0-9)])([²³⁴⁵⁶⁷⁸⁹⁰¹ⁿ]+)/g, (m, a, d) => a + '<sup>' + toN(d) + '</sup>'); }
      function toN(d) { const map = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9, 'ⁿ': 'n' }; return d.split('').map(c => map[c]).join(''); }
      function pick() {
        q = DECK[Math.floor(Math.random() * DECK.length)];
        const opts = q.o.slice().sort(() => Math.random() - 0.5);
        box.innerHTML = `<div class="fq">${sup(q.q)} = ?</div>
          <div class="feelopt">${opts.map(o => `<button data-o="${o}">${sup(o)}</button>`).join('')}</div>
          <div class="feelstat"><span>正确率 <b>${total ? Math.round(ok / total * 100) : 0}%</b></span><span>已答 <b>${total}</b></span>
            <span>手速 <b>${times.length ? (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(1) : '–'}</b>s</span>
            <span class="spark">${times.slice(-16).map(t => `<i style="height:${Math.max(4, 34 - Math.min(30, t / 100))}px"></i>`).join('')}</span></div>`;
        t0 = performance.now();
        box.querySelectorAll('.feelopt button').forEach(b => b.addEventListener('click', () => answer(b)));
      }
      function answer(btn) {
        const correct = btn.dataset.o === q.a; total++; if (correct) ok++; times.push(performance.now() - t0);
        box.querySelectorAll('.feelopt button').forEach(b => { b.disabled = true; if (b.dataset.o === q.a) b.classList.add('ok'); if (b === btn && !correct) b.classList.add('no'); });
        Y.taskSet('m17.feel', { ok, total });
        setTimeout(pick, correct ? 450 : 1200);
      }
      pick();
    })();

    return { cleanup() {} };
  }
};
