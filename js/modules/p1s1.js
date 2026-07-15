/* p1s1 · 1.1 长度和时间的测量 —— 节页：停表读数、特殊测量三招、误差vs错误。
   章页已有：估测营、刻度尺估读、单位换算。这里只补该节缺的细碎考点。 */
window.YJS_SECTIONS = window.YJS_SECTIONS || {};

window.YJS_SECTIONS.p1s1 = {
  mod: 'p1', sec: 's1', emoji: '📏',
  title: '1.1 长度和时间的测量', sub: '停表 · 特殊测量 · 误差',
  nodeIds: ['p1-n9', 'p1-n10'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k])); if (txt !== undefined) e.textContent = txt; g.appendChild(e); return e; };

    root.innerHTML = `
      <section>
        <div class="card phys">
          <p class="small"><b>本节考点自查</b>（做过对应练习自动打勾）：</p>
          <div id="s1-ckl"></div>
          <p class="hint">刻度尺估读和单位换算在章页（估测营 / 刻度尺 / 换算三个区）——没玩过先回去玩。这里补三样学校要磨的：停表、特殊测量、误差。</p>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">⏱️</span>机械停表 · 大盘指着 8，为什么读 38</div>
        <div class="split">
          <div class="card">
            <svg id="s1-watch" style="width:100%;height:190px" viewBox="0 0 300 160"></svg>
            <div class="numrow" id="s1-wtrain" hidden>
              <input class="numin" id="s1-wmin" type="text" inputmode="numeric" placeholder="分" style="width:56px"><span class="unitfix">min</span>
              <input class="numin" id="s1-wsec" type="text" inputmode="decimal" placeholder="秒" style="width:70px"><span class="unitfix">s</span>
              <button class="btn primary" id="s1-wgo">判定</button>
            </div>
            <p class="small" id="s1-wmsg"></p>
            <p class="small center">连对 <b id="s1-wstreak">0</b> / 3</p>
          </div>
          <div class="card">
            <div id="s1-wguess"></div>
            <div id="s1-wrule"></div>
          </div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧵</span>特殊测量三招 · 常规量不了的怎么量</div>
        <div class="split">
          <div class="card"><div id="s1-spbox"></div></div>
          <div class="card">
            <div id="s1-spmsg"><p class="hint">三个"量不了"的场景，各选一招。三招名字先不解释——选一个看它怎么干活。</p></div>
          </div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">⚖️</span>误差 vs 错误 · 不是一回事</div>
        <div class="card">
          <p class="small">下面每种情况，判断它属于<b>误差</b>（不可避免、只能减小）还是<b>错误</b>（不该发生、必须避免）：</p>
          <div id="s1-errbox"></div>
          <div id="s1-errmsg"></div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧪</span>节练习 · 10 题（基础 6 + 提高 4）</div>
        <div class="card">
          <p class="hint" id="s1-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="s1-quizgo">开始</button></div>
          <div id="s1-quizbox"></div>
        </div>
      </section>
    `;

    /* ---- 考点清单 ---- */
    const ckl = Y.checklist($('s1-ckl'), [
      { t: '机械停表会读（小盘过半格，大盘读后半圈 30~60）', keys: ['act:p1.stopwatch'] },
      { t: '特殊测量三招会挑：累积法 / 化曲为直 / 滚轮法', keys: ['act:p1.special'] },
      { t: '误差与错误分得清（误差只能减小，错误必须避免）', keys: ['act:p1.error'] },
      { t: '刻度尺估读到分度值下一位（章页·刻度尺区）', keys: ['act:p1.ruler'] },
      { t: '节练习：停表题与换算题拿下', keys: ['q:p1s1q2', 'q:p1s1q6'] }
    ]);

    /* ---- 停表 ---- */
    // 画一块机械停表：小盘 0–15 min（每格 0.5），大盘一圈 30 s（每格 0.1，这里画到 1s 刻度）
    function drawWatch(svg, t) {
      svg.innerHTML = '';
      const S = { x: 82, y: 62, r: 34 }, B = { x: 196, y: 80, r: 56 };
      // 表壳
      el(svg, 'circle', { cx: B.x, cy: B.y, r: B.r + 12, fill: '#fffef7', stroke: '#b6ab93', 'stroke-width': 2 });
      el(svg, 'rect', { x: B.x - 7, y: B.y - B.r - 24, width: 14, height: 12, rx: 3, fill: '#b6ab93' });
      // 大盘（秒，0–30 一圈）
      el(svg, 'circle', { cx: B.x, cy: B.y, r: B.r, fill: '#fff', stroke: '#8b8271', 'stroke-width': 1.4 });
      for (let s = 0; s < 30; s++) {
        const a = s / 30 * 2 * Math.PI - Math.PI / 2, big = s % 5 === 0;
        el(svg, 'line', { x1: B.x + Math.cos(a) * (B.r - (big ? 9 : 5)), y1: B.y + Math.sin(a) * (B.r - (big ? 9 : 5)), x2: B.x + Math.cos(a) * (B.r - 1), y2: B.y + Math.sin(a) * (B.r - 1), stroke: '#57503f', 'stroke-width': big ? 1.6 : 0.8 });
        if (big) el(svg, 'text', { x: B.x + Math.cos(a) * (B.r - 16), y: B.y + Math.sin(a) * (B.r - 16) + 3.5, 'font-size': 10, 'text-anchor': 'middle', fill: '#57503f' }, String(s));
      }
      const sa = (t % 30) / 30 * 2 * Math.PI - Math.PI / 2;
      el(svg, 'line', { x1: B.x, y1: B.y, x2: B.x + Math.cos(sa) * (B.r - 12), y2: B.y + Math.sin(sa) * (B.r - 12), stroke: '#b91c1c', 'stroke-width': 2 });
      el(svg, 'circle', { cx: B.x, cy: B.y, r: 2.6, fill: '#b91c1c' });
      el(svg, 'text', { x: B.x, y: B.y + B.r + 24, 'font-size': 10, 'text-anchor': 'middle', fill: '#8b8271' }, '大盘：秒（一圈 30 s）');
      // 小盘（分，0–15）
      el(svg, 'circle', { cx: S.x, cy: S.y, r: S.r, fill: '#fff', stroke: '#8b8271', 'stroke-width': 1.2 });
      for (let m = 0; m < 30; m++) {
        const a = m / 30 * 2 * Math.PI - Math.PI / 2, big = m % 10 === 0;
        el(svg, 'line', { x1: S.x + Math.cos(a) * (S.r - (big ? 7 : 4)), y1: S.y + Math.sin(a) * (S.r - (big ? 7 : 4)), x2: S.x + Math.cos(a) * (S.r - 1), y2: S.y + Math.sin(a) * (S.r - 1), stroke: '#57503f', 'stroke-width': big ? 1.4 : 0.7 });
        if (big) el(svg, 'text', { x: S.x + Math.cos(a) * (S.r - 13), y: S.y + Math.sin(a) * (S.r - 13) + 3, 'font-size': 8.5, 'text-anchor': 'middle', fill: '#57503f' }, String(m / 2));
      }
      const ma = (t / 60) / 15 * 2 * Math.PI - Math.PI / 2;
      el(svg, 'line', { x1: S.x, y1: S.y, x2: S.x + Math.cos(ma) * (S.r - 9), y2: S.y + Math.sin(ma) * (S.r - 9), stroke: '#0f766e', 'stroke-width': 1.8 });
      el(svg, 'circle', { cx: S.x, cy: S.y, r: 2.2, fill: '#0f766e' });
      el(svg, 'text', { x: S.x, y: S.y + S.r + 14, 'font-size': 10, 'text-anchor': 'middle', fill: '#8b8271' }, '小盘：分（一圈 15 min）');
    }

    let curT = 218.4, streak = 0, ruleShown = false;
    drawWatch($('s1-watch'), curT);

    function newRound() {
      // 生成一个不含歧义的读数：秒的个位远离 0 和 30 的边界
      let sec;
      do { sec = Math.round((Math.random() * 58 + 1) * 5) / 5; } while (Math.abs(sec % 30) < 1.6 || Math.abs(sec % 30) > 28.4);
      curT = Math.floor(Math.random() * 6) * 60 + sec;
      drawWatch($('s1-watch'), curT);
      $('s1-wmin').value = ''; $('s1-wsec').value = '';
      $('s1-wmsg').innerHTML = '';
    }
    $('s1-wguess').appendChild(Y.guess({
      q: '左边这块停表：小盘指针在 3 和 4 之间、<b>已过中线</b>，大盘指针指在 8.4。它的读数是？',
      options: ['3 min 38.4 s', '3 min 8.4 s', '8 min 3.4 s'], answer: 0,
      reveal: '窍门在小盘：指针过没过两个数字的<b>中线</b>。过了 → 这一分钟已走完一半 → 大盘那圈读的是"后半圈"，要加 30。',
      onDone: () => {
        ruleShown = true;
        $('s1-wrule').innerHTML = '<div class="explain"><b>停表读数两步：</b>① 小盘读分，看指针<b>过没过半格</b>；② 大盘读秒——没过半照读（0~30），<b>过了半加 30</b>（读 30~60）。<br>读数 = 分 × 60 + 秒。</div>';
        $('s1-wtrain').hidden = false;
        newRound();
      }
    }));
    $('s1-wgo').addEventListener('click', () => {
      if (!ruleShown) return;
      const m = parseInt($('s1-wmin').value, 10), s = parseFloat(String($('s1-wsec').value).replace(',', '.'));
      if (isNaN(m) || isNaN(s)) { $('s1-wmsg').innerHTML = '<b style="color:var(--warn)">分和秒都要填。</b>'; return; }
      const okM = m === Math.floor(curT / 60), okS = Math.abs(s - (curT % 60)) <= 0.3;
      if (okM && okS) {
        streak++;
        $('s1-wstreak').textContent = streak;
        if (streak >= 3) { $('s1-wmsg').innerHTML = '<b style="color:var(--ok)">✓ 三连对——停表这题到考场直接拿分。</b>'; Y.ev('act:p1.stopwatch'); }
        else { $('s1-wmsg').innerHTML = '<b style="color:var(--ok)">✓ 对。再来。</b>'; }
        newRound();
      } else {
        streak = 0; $('s1-wstreak').textContent = 0;
        $('s1-wmsg').innerHTML = `<b style="color:var(--bad)">不对。</b>正确是 <b>${Math.floor(curT / 60)} min ${(curT % 60).toFixed(1)} s</b>——先看小盘过没过半格，再定大盘读前半圈还是后半圈。换一块再来。`;
        newRound();
      }
    });

    /* ---- 特殊测量三招 ---- */
    const SP = [
      { s: '想测<b>一张纸</b>的厚度，可它比刻度尺的分度值还薄', a: 0, note: '累积法：测 100 张的总厚度，再 ÷100。把"量不出的小"垒成"量得出的大"。' },
      { s: '想测地图上一条<b>弯弯曲曲的铁路线</b>的长度', a: 1, note: '化曲为直：拿一根棉线沿曲线摆好、做记号，拉直了再量。' },
      { s: '想测学校<b>操场跑道</b>一圈的长度', a: 2, note: '滚轮法：轮子沿跑道滚，圈数 × 轮子周长。骑行码表就是这原理。' }
    ];
    const OPTS = ['累积法（多个叠起来量）', '化曲为直（棉线贴着摆）', '滚轮法（滚过去数圈）'];
    let spDone = 0;
    const spBox = $('s1-spbox');
    SP.forEach((sp, i) => {
      const d = document.createElement('div'); d.style.cssText = 'padding:8px 0;border-bottom:1px dashed var(--line)';
      d.innerHTML = `<p class="small">${sp.s}，用哪招？</p><div class="chips" data-i="${i}">${OPTS.map((o, k) => `<button class="chip" data-k="${k}">${o}</button>`).join('')}</div><p class="small" id="s1-spn-${i}"></p>`;
      d.querySelector('.chips').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b || b.disabled) return;
        const ok = +b.dataset.k === sp.a;
        d.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
        b.classList.add(ok ? 'on' : 'bad');
        if (ok) {
          $(`s1-spn-${i}`).innerHTML = '<span style="color:var(--ok)">✓ ' + sp.note + '</span>';
          if (!d.dataset.got) { d.dataset.got = 1; spDone++; }
          if (spDone === 3) { $('s1-spmsg').innerHTML = '<div class="explain">三招全对。共同思路：<b>直接量不了，就转化成量得了的</b>——叠起来、拉直了、滚过去。考试爱考"选哪招"和累积法的除法。</div>'; Y.ev('act:p1.special'); }
        } else $(`s1-spn-${i}`).innerHTML = '<span style="color:var(--bad)">再想想这招是怎么干活的。</span>';
      });
      spBox.appendChild(d);
    });

    /* ---- 误差 vs 错误 ---- */
    const ERR = [
      ['读数时视线斜着看（俯视/仰视）', 1, '视线不垂直是操作不当——能避免，是错误。'],
      ['尺子本身受热胀冷缩，刻度不再精准', 0, '仪器本身的局限，避免不了——是误差，换更好的仪器只能减小它。'],
      ['最后一位是估读的，不同人读数略有不同', 0, '估读必然因人略异——误差。多次测量取平均能减小。'],
      ['零刻度线磨损了，还从头开始量', 1, '该换一条清晰刻度当起点——不换就是错误。'],
      ['记录数据时忘了写单位', 1, '纯粹的疏忽——错误，必须避免（没单位的数据无效）。']
    ];
    const errBox = $('s1-errbox');
    let errGot = 0;
    ERR.forEach((er, i) => {
      const d = document.createElement('div'); d.className = 'liferow';
      d.innerHTML = `<span style="flex:1;min-width:150px">${er[0]}</span>
        <span class="chips" style="margin:0"><button class="chip" data-k="0">误差</button><button class="chip" data-k="1">错误</button></span><span id="s1-em-${i}"></span>`;
      d.querySelector('.chips').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        const ok = +b.dataset.k === er[1];
        d.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
        b.classList.add(ok ? 'on' : 'bad');
        $(`s1-em-${i}`).innerHTML = ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">×</b>';
        if (ok && !d.dataset.got) { d.dataset.got = 1; errGot++; }
        if (ok) $(`s1-em-${i}`).title = er[2];
        if (errGot === 5) { $('s1-errmsg').innerHTML = '<div class="stdline">五个全分清了。<b>误差</b>：不可避免，只能减小（多次测量求平均、选更精密仪器、改进方法）；<b>错误</b>：不该发生，必须避免。"多次测量求平均"减小的是<b>误差</b>，救不了错误。</div>'; Y.ev('act:p1.error'); }
      });
      errBox.appendChild(d);
    });

    /* ---- 节练习 ---- */
    const bestLine = () => { const b = Y.quizBest('p1s1'); $('s1-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; };
    bestLine();
    $('s1-quizgo').addEventListener('click', () => {
      $('s1-quizgo').style.display = 'none';
      Y.quizStart($('s1-quizbox'), 'p1s1', () => { $('s1-quizgo').style.display = ''; $('s1-quizgo').textContent = '再练一次'; bestLine(); });
    });

    return { cleanup() { ckl.stop(); } };
  }
};
