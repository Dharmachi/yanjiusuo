/* m13s2 · 13.2 与三角形有关的线段 —— 节页：第三边取值范围（拖着看三角形塌掉）+ 等腰分类讨论工作台。
   数学红线：|a−b| < c < a+b（开区间，端点恰好摊平）；等腰"4 和 9"只有一解（4 作腰围不住）、"5 和 7"两解。 */
window.YJS_SECTIONS = window.YJS_SECTIONS || {};

window.YJS_SECTIONS.m13s2 = {
  mod: 'm13', sec: 's2', emoji: '📏',
  title: '13.2 与三角形有关的线段', sub: '第三边范围 · 等腰分类讨论',
  nodeIds: ['m13-n11', 'm13-n12'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k])); if (txt !== undefined) e.textContent = txt; g.appendChild(e); return e; };

    root.innerHTML = `
      <section>
        <div class="card math">
          <p class="small"><b>本节考点自查</b>：</p>
          <div id="ms2-ckl"></div>
          <p class="hint">三边关系、高中线角平分线在章页玩过。这一节磨两个考试大户：<b>第三边能取哪些值</b>、<b>等腰三角形的分类讨论</b>。</p>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">📐</span>第三边侦察 · 拖到几，三角形塌掉？</div>
        <div class="split">
          <div class="card">
            <svg id="ms2-svg" style="width:100%;height:200px" viewBox="0 0 340 200"></svg>
            <div class="benchbar"><span class="small">第三边 c</span><input type="range" id="ms2-c" min="1" max="15" step="0.5" value="8" style="flex:1;max-width:200px"><span class="small" id="ms2-cv"></span></div>
          </div>
          <div class="card">
            <div id="ms2-rguess"></div>
            <div id="ms2-rfill" hidden>
              <p class="small">拖过头、也拖到底之后，把范围填出来——c 必须满足：</p>
              <div class="numrow"><input class="numin" id="ms2-rlo" type="text" inputmode="decimal" style="width:70px"><span class="unitfix">&lt; c &lt;</span><input class="numin" id="ms2-rhi" type="text" inputmode="decimal" style="width:70px"><button class="btn primary" id="ms2-rgo">判定</button></div>
              <p class="small" id="ms2-rmsg"></p>
            </div>
            <div id="ms2-rnote"></div>
          </div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">⚖️</span>等腰工作台 · "两边是 4 和 9"有几个答案？</div>
        <div class="split">
          <div class="card"><div id="ms2-isobox"></div></div>
          <div class="card"><div id="ms2-isomsg"><p class="hint">等腰三角形只告诉你"两条边"，没说谁是腰谁是底——这就是初二最经典的<b>分类讨论</b>。两个案子。</p></div></div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧪</span>节练习 · 10 题（基础 6 + 提高 4）</div>
        <div class="card">
          <p class="hint" id="ms2-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="ms2-quizgo">开始</button></div>
          <div id="ms2-quizbox"></div>
        </div>
      </section>
    `;

    /* ---- 考点清单 ---- */
    const ckl = Y.checklist($('ms2-ckl'), [
      { t: '三边关系（章页·三边区玩过）', keys: ['act:m13.tri'] },
      { t: '第三边取值范围：|a−b| < c < a+b（开区间）', keys: ['act:m13.range'] },
      { t: '等腰分类讨论（先分腰底、再验三边关系）', keys: ['act:m13.isodisc'] },
      { t: '节练习：范围端点与"17 或 22"陷阱拿下', keys: ['q:m13s2q2', 'q:m13s2q5'] }
    ]);

    /* ---- 第三边侦察（a=5, b=8 固定，c 可拖） ---- */
    const A = 5, B = 8;
    let cVal = 8;
    function drawTri() {
      const svg = $('ms2-svg'); svg.innerHTML = '';
      const S = 17, baseY = 168, cx = 170;
      const half = cVal * S / 2;
      const P1 = [cx - half, baseY], P2 = [cx + half, baseY];
      // 两圆交点求顶点（P1 半径 a，P2 半径 b）
      const d = cVal, x = (d * d + A * A - B * B) / (2 * d), h2 = A * A - x * x;
      el(svg, 'line', { x1: P1[0], y1: baseY, x2: P2[0], y2: baseY, stroke: '#4c51bf', 'stroke-width': 3 });
      el(svg, 'text', { x: cx, y: baseY + 18, 'font-size': 12, 'text-anchor': 'middle', fill: '#4c51bf' }, 'c = ' + cVal);
      if (h2 > 0.0001) {
        const apex = [P1[0] + x * S, baseY - Math.sqrt(h2) * S];
        el(svg, 'line', { x1: P1[0], y1: baseY, x2: apex[0], y2: apex[1], stroke: '#0f766e', 'stroke-width': 3 });
        el(svg, 'line', { x1: P2[0], y1: baseY, x2: apex[0], y2: apex[1], stroke: '#b7791f', 'stroke-width': 3 });
        el(svg, 'text', { x: (P1[0] + apex[0]) / 2 - 14, y: (baseY + apex[1]) / 2, 'font-size': 12, fill: '#0f766e' }, 'a = 5');
        el(svg, 'text', { x: (P2[0] + apex[0]) / 2 + 4, y: (baseY + apex[1]) / 2, 'font-size': 12, fill: '#b7791f' }, 'b = 8');
        el(svg, 'circle', { cx: apex[0], cy: apex[1], r: 3.5, fill: '#b91c1c' });
      } else {
        // 塌掉：画不出顶点
        el(svg, 'text', { x: cx, y: 92, 'font-size': 13, 'text-anchor': 'middle', fill: '#b91c1c', 'font-weight': 700 },
          cVal >= A + B ? '💥 5 和 8 手拉手也够不着两端——塌成一条线' : '💥 c 太短，5 和 8 撑开也围不住——叠在一起了');
        el(svg, 'line', { x1: P1[0], y1: baseY - 8, x2: P1[0] + A * S, y2: baseY - 8, stroke: '#0f766e', 'stroke-width': 3, opacity: .55 });
        el(svg, 'line', { x1: P2[0], y1: baseY - 16, x2: P2[0] - B * S, y2: baseY - 16, stroke: '#b7791f', 'stroke-width': 3, opacity: .55 });
      }
      $('ms2-cv').textContent = 'c = ' + cVal;
    }
    $('ms2-c').addEventListener('input', e => { cVal = +e.target.value; drawTri(); });
    drawTri();

    $('ms2-rguess').appendChild(Y.guess({
      q: '两边是 5 和 8，先猜：第三边 c 能不能恰好等于 3？', options: ['不能——恰好摊成一条直线', '能，勉强围成', '能，而且很正常'], answer: 0,
      reveal: '拖滑杆到 3 和 13 看看——恰好在端点时，三条边摊平成一条线，"三角形"没了。所以范围是开区间，取不到端点。',
      onDone: () => { $('ms2-rfill').hidden = false; }
    }));
    $('ms2-rgo').addEventListener('click', () => {
      const lo = parseFloat($('ms2-rlo').value), hi = parseFloat($('ms2-rhi').value);
      if (isNaN(lo) || isNaN(hi)) return;
      if (Math.abs(lo - 3) < 0.01 && Math.abs(hi - 13) < 0.01) {
        $('ms2-rmsg').innerHTML = '<b style="color:var(--ok)">✓ 3 &lt; c &lt; 13。</b>';
        $('ms2-rnote').innerHTML = '<div class="stdline">规律你已经拖出来了：<b>|a − b| &lt; c &lt; a + b</b>——第三边大于两边之差、小于两边之和，且取不到端点。做题时先算 8−5=3 和 8+5=13，一秒写出范围。</div>';
        Y.ev('act:m13.range');
      } else {
        $('ms2-rmsg').innerHTML = '<b style="color:var(--bad)">再拖拖看——</b>往小拖到几塌？往大拖到几塌？端点就是 8−5 和 8+5。';
      }
    });

    /* ---- 等腰工作台 ---- */
    const isoBox = $('ms2-isobox');
    let case1Done = false;
    function renderCase1() {
      const d = document.createElement('div');
      d.innerHTML = `<p class="small"><b>案一：</b>等腰三角形的两条边分别是 <b>4</b> 和 <b>9</b>，求周长。谁是腰？两种可能各试一下：</p>
        <div class="chips">
          <button class="chip" id="ms2-t49a">试：4 作腰 → (4, 4, 9)</button>
          <button class="chip" id="ms2-t49b">试：9 作腰 → (9, 9, 4)</button>
        </div>
        <p class="small" id="ms2-i1a"></p><p class="small" id="ms2-i1b"></p>
        <div class="numrow" id="ms2-i1fill" hidden><span class="small">所以周长 =</span><input class="numin" id="ms2-i1in" type="text" inputmode="numeric" style="width:70px"><button class="btn primary" id="ms2-i1go">判定</button><span id="ms2-i1m"></span></div>`;
      isoBox.appendChild(d);
      let tried = { a: false, b: false };
      $('ms2-t49a').addEventListener('click', () => {
        tried.a = true; $('ms2-t49a').classList.add('bad');
        $('ms2-i1a').innerHTML = '<span style="color:var(--bad)">✗ (4, 4, 9)：4 + 4 = 8 &lt; 9 —— 两条腰够不着，围不成三角形！</span>';
        if (tried.b) $('ms2-i1fill').hidden = false;
      });
      $('ms2-t49b').addEventListener('click', () => {
        tried.b = true; $('ms2-t49b').classList.add('on');
        $('ms2-i1b').innerHTML = '<span style="color:var(--ok)">✓ (9, 9, 4)：9 + 9 &gt; 4，成立。</span>';
        if (tried.a) $('ms2-i1fill').hidden = false;
      });
      $('ms2-i1go') && d.querySelector('#ms2-i1go').addEventListener('click', () => {
        const v = parseInt(d.querySelector('#ms2-i1in').value, 10);
        if (v === 22) {
          d.querySelector('#ms2-i1m').innerHTML = '<b style="color:var(--ok)">✓ 9+9+4 = 22，唯一解。</b>';
          if (!case1Done) { case1Done = true; renderCase2(); }
        } else d.querySelector('#ms2-i1m').innerHTML = '<b style="color:var(--bad)">再算：9 + 9 + 4。</b>';
      });
    }
    function renderCase2() {
      const d = document.createElement('div');
      d.style.cssText = 'margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)';
      d.innerHTML = `<p class="small"><b>案二：</b>等腰三角形的两条边分别是 <b>5</b> 和 <b>7</b>，周长是多少？先自己分两类算，再选：</p>
        <div class="chips" id="ms2-i2opts">
          <button class="chip" data-v="both">17 或 19（两解都成立）</button>
          <button class="chip" data-v="a">只有 17</button>
          <button class="chip" data-v="b">只有 19</button>
        </div>
        <p class="small" id="ms2-i2m"></p>`;
      isoBox.appendChild(d);
      d.querySelector('#ms2-i2opts').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        d.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
        const ok = b.dataset.v === 'both';
        b.classList.add(ok ? 'on' : 'bad');
        if (ok) {
          $('ms2-i2m').innerHTML = '<span style="color:var(--ok)">✓ (5,5,7)：5+5&gt;7 成立，周长 17；(7,7,5)：7+7&gt;5 成立，周长 19。<b>两解都要写</b>。</span>';
          $('ms2-isomsg').innerHTML = '<div class="stdline">等腰分类讨论的完整动作：<b>① 谁是腰分两类 → ② 每类用三边关系验一遍 → ③ 活下来的都是答案。</b>案一验掉了一类（唯一解 22），案二两类都活（17 或 19）——<b>先分类、必验证、再下结论</b>，漏一步就丢一半分。</div>';
          Y.ev('act:m13.isodisc');
        } else $('ms2-i2m').innerHTML = '<span style="color:var(--bad)">把两类都用三边关系验一遍——这回哪类都没被淘汰。</span>';
      });
    }
    renderCase1();

    /* ---- 节练习 ---- */
    const bestLine = () => { const b = Y.quizBest('m13s2'); $('ms2-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; };
    bestLine();
    $('ms2-quizgo').addEventListener('click', () => {
      $('ms2-quizgo').style.display = 'none';
      Y.quizStart($('ms2-quizbox'), 'm13s2', () => { $('ms2-quizgo').style.display = ''; $('ms2-quizgo').textContent = '再练一次'; bestLine(); });
    });

    return { cleanup() { ckl.stop(); } };
  }
};
