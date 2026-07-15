/* p1 · 第一章 机械运动 —— 物理第一课：先学会"量"，再学会"看谁在动"。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.p1 = {
  id: 'p1', subject: 'phys', emoji: '🚇',
  title: '机械运动', subtitle: '先学会量，再谈快慢',
  wave: 'M2',
  nodes: [
    { id: 'p1-n1', label: '长度估测·单位体感', needs: ['act:p1.est'] },
    { id: 'p1-n2', label: '刻度尺·估读位', needs: ['act:p1.ruler', 'any:q:p1q1|q:p1q2'] },
    { id: 'p1-n3', label: '单位换算·3.6', needs: ['act:p1.conv', 'any:q:p1q3|q:p1q4'] },
    { id: 'p1-n4', label: '参照物·相对性', needs: ['act:p1.ref', 'any:q:p1q5|q:p1q6'] },
    { id: 'p1-n5', label: '双图像·读图', needs: ['act:p1.graph', 'any:q:p1q9|q:p1q10'] },
    { id: 'p1-n6', label: '反向驾驶·跟曲线', needs: ['act:p1.chase'] },
    { id: 'p1-n7', label: '平均速度·斜面实验', needs: ['act:p1.slope', 'any:q:p1q7|q:p1q8'] },
    { id: 'p1-n8', label: '地铁测速·实践', needs: ['act:p1.metro'] },
    /* —— 逐节精读（跟课层）—— */
    { id: 'p1-n9', label: '1.1 停表与测量基本功', needs: ['act:p1.stopwatch', 'any:q:p1s1q2|q:p1s1q6'] },
    { id: 'p1-n10', label: '1.1 误差与特殊测量', needs: ['act:p1.special', 'act:p1.error', 'any:q:p1s1q5|q:p1s1q8'] },
    { id: 'p1-n11', label: '1.2 相对静止的应用', needs: ['act:p1.relstill', 'act:p1.refdrill', 'any:q:p1s2q2|q:p1s2q3'] },
    { id: 'p1-n12', label: '1.3 速度单位换算', needs: ['act:p1.convert', 'any:q:p1s3q2|q:p1s3q9'] },
    { id: 'p1-n13', label: '1.3 计算格式与陷阱', needs: ['act:p1.calc', 'any:q:p1s3q6|q:p1s3q8|q:p1s3q10'] },
    { id: 'p1-n14', label: '1.4 实验报告规范', needs: ['act:p1.slopereport', 'any:q:p1s4q3|q:p1s4q4'] }
  ],
  taskIds: ['p1.metro'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
      if (txt !== undefined) e.textContent = txt;
      g.appendChild(e); return e;
    };
    const timers = [];
    const addTimer = id => { timers.push(id); return id; };

    root.innerHTML = `
      <nav class="secnav">
        ${[['p1-intro', '引入'], ['p1-est', '估测营'], ['p1-ruler', '刻度尺'], ['p1-conv', '换算'],
        ['p1-ref', '谁在动'], ['p1-graph', '图像台'], ['p1-slope', '斜面实验'],
        ['p1-cards', '知识卡'], ['p1-quiz', '自测'], ['p1-metro', '地铁测速']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="p1-intro">
        <div class="card phys">
          <p class="intro-hook">开学第一节物理课，讲的不是公式，是<b>测量</b>——因为物理的一切都从"量出来"开始。<br>
          今天先给你的眼睛装一把尺子，再回答一个比想象中难的问题：<b>你现在是运动的吗？</b></p>
          <p class="hint">这是 9 月开学的第一章物理——现在玩过，开学时你已经用它量过维也纳的地铁了。</p>
        </div>
      </section>

      <section id="p1-sections">
        <div class="sec-title"><span class="em">📚</span>逐节精读 · 跟课层</div>
        <p class="hint" style="margin:0 2px 8px">下面的游乐场先玩懂概念；开学跟课时，一节一节进这里磨考点。</p>
        <div class="secgrid" id="p1-secgrid"></div>
      </section>

      <section id="p1-est">
        <div class="sec-title"><span class="em">👁️</span>估测训练营 · 给眼睛装尺子</div>
        <div class="split">
          <div class="card">
            <div id="p1-calbox">
              <p><b>先校准屏幕：</b>拿一张银行卡（或任何标准卡片）贴在下面的虚线框上，拖滑杆让框和卡片一样宽，然后点"校准完成"。</p>
              <svg id="p1-calsvg" style="width:100%;height:80px" viewBox="0 0 460 80"></svg>
              <div class="ctl"><label>框的宽度 <span class="val" id="p1-calv"></span></label>
                <input type="range" id="p1-cal" min="2.2" max="6" step="0.02" value="3.78"></div>
              <div class="btnrow"><button class="btn primary" id="p1-calok">校准完成</button></div>
            </div>
            <div id="p1-estbox" hidden>
              <p id="p1-estq" style="font-size:17px"></p>
              <svg id="p1-estsvg" style="width:100%;height:70px" viewBox="0 0 460 70"></svg>
              <div class="btnrow">
                <input class="note" id="p1-estin" type="number" inputmode="decimal" placeholder="你的估计（mm）" style="max-width:180px;margin:0">
                <button class="btn primary" id="p1-estgo">提交</button>
                <button class="btn ghost" id="p1-estnext" hidden>下一个 ›</button>
              </div>
              <div id="p1-estmsg"></div>
            </div>
          </div>
          <div class="card">
            <h3>为什么先练估测？</h3>
            <p class="small">考试里"估测题"年年有（教室门高约 2 ___？），靠的不是计算，是<b>单位体感</b>——1 mm、1 cm、1 m 在你手上各是多长。</p>
            <p class="hint">屏幕校准后，下面出现的线段都是<b>真实尺寸</b>。先用眼睛猜，再看答案。</p>
            <p id="p1-estscore" class="small"></p>
          </div>
        </div>
      </section>

      <section id="p1-ruler">
        <div class="sec-title"><span class="em">📏</span>刻度尺读数器 · 最后一位是估出来的</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p1-rmode">
              <button class="chip on" data-m="mm">分度值 1 mm</button>
              <button class="chip" data-m="cm">分度值 1 cm</button>
            </div>
            <svg id="p1-rulersvg"></svg>
            <div class="btnrow">
              <input class="note" id="p1-rin" type="text" inputmode="decimal" placeholder="读数（cm）" style="max-width:160px;margin:0">
              <button class="btn primary" id="p1-rgo">提交读数</button>
              <button class="btn ghost" id="p1-rnew">换一个</button>
            </div>
          </div>
          <div class="card"><div id="p1-rmsg"><p>读出蓝色物体右端的位置（单位 cm），<b>写到你认为规范的位数</b>。</p><p class="hint">提交后告诉你写得规不规范。</p></div></div>
        </div>
      </section>

      <section id="p1-conv">
        <div class="sec-title"><span class="em">🔁</span>单位换算速练 · 3.6 的来历</div>
        <div class="split">
          <div class="card">
            <p style="font-size:18px" id="p1-cq"></p>
            <div class="btnrow">
              <input class="note" id="p1-cin" type="number" inputmode="decimal" placeholder="答案" style="max-width:150px;margin:0">
              <button class="btn primary" id="p1-cgo">提交</button>
            </div>
            <div id="p1-cmsg"></div>
            <p class="small">已答对 <b id="p1-cok">0</b> / 6</p>
          </div>
          <div class="card">
            <details class="kard"><summary><span>🧮</span>3.6 是哪来的？</summary>
              <div class="kbody">
                <div class="formula">1 m/s = 1 秒走 1 米 = 3600 秒走 3600 米 = 1 小时走 3.6 km = 3.6 km/h</div>
                <p class="why">所以：m/s → km/h 乘 3.6；km/h → m/s 除以 3.6。记不清方向就想：同一个速度，用"米每秒"说数字小，用"千米每小时"说数字大。</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section id="p1-ref">
        <div class="sec-title"><span class="em">🚋</span>谁在动？· 参照物切换器</div>
        <div class="split">
          <div class="card">
            <svg id="p1-refsvg"></svg>
            <div class="chips" id="p1-refbtns">
              <button class="chip on" data-r="ground">🌏 地面</button>
              <button class="chip" data-r="mine">🚋 我坐的车</button>
              <button class="chip" data-r="other">🚊 对面的车</button>
            </div>
            <p class="hint">点按钮，换一双眼睛看同一个世界。</p>
          </div>
          <div class="card">
            <div id="p1-refguess"></div>
            <div id="p1-refmsg"></div>
          </div>
        </div>
      </section>

      <section id="p1-graph">
        <div class="sec-title"><span class="em">📈</span>双图像实验台 · 一次运动，两张画像</div>
        <div class="card">
          <svg id="p1-track" style="width:100%;height:92px" viewBox="0 0 460 92"></svg>
          <div class="chips" id="p1-scripts">
            <button class="chip" data-s="uniform">▶ 匀速前进</button>
            <button class="chip" data-s="stopgo">▶ 走走停停</button>
            <button class="chip" data-s="accel">▶ 越来越快</button>
            <button class="chip gold" data-s="manual">🎮 自己开（记录 8 秒）</button>
            <button class="chip gold" data-s="chase">🏁 反向挑战：照着金线开</button>
          </div>
          <div class="grid2" style="margin-top:10px">
            <div><svg id="p1-splot"></svg></div>
            <div><svg id="p1-vplot"></svg></div>
          </div>
          <div id="p1-gmsg"></div>
          <hr class="divider">
          <p style="font-size:16.5px">规律自述：s-t 图里的水平线段表示
            <select class="blank" id="p1-say1"><option value="">？</option><option>静止</option><option>匀速运动</option></select>；
            v-t 图里的水平线段表示
            <select class="blank" id="p1-say2"><option value="">？</option><option>静止</option><option>匀速运动</option></select>。</p>
          <div id="p1-sayr"></div>
        </div>
      </section>

      <section id="p1-slope">
        <div class="sec-title"><span class="em">⛷️</span>斜面小车实验 · 测平均速度（教材分组实验）</div>
        <div class="split">
          <div class="card">
            <svg id="p1-slopesvg"></svg>
            <div class="ctl"><label>坡度 <span class="val" id="p1-slv">15°</span></label>
              <input type="range" id="p1-slang" min="10" max="30" step="1" value="15"></div>
            <div class="btnrow">
              <button class="btn" id="p1-st1">① 放金属片</button>
              <button class="btn" id="p1-st2">② 小车就位</button>
              <button class="btn primary" id="p1-st3">③ 放车并开表</button>
            </div>
            <p class="anglebig" style="margin:6px 0"><span id="p1-swatch2">0.00</span><small> s</small></p>
          </div>
          <div class="card">
            <div id="p1-slguess"></div>
            <div id="p1-slmsg"><p class="hint">斜面长 1.2 m，中点有标记。按顺序操作：金属片 → 小车就位 → 放车开表。</p></div>
            <div id="p1-sltable"></div>
          </div>
        </div>
      </section>

      <section id="p1-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡</div>
        <div id="p1-cardlist"></div>
      </section>

      <section id="p1-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card">
          <p>读数规范、3.6 换算、参照物、平均速度经典题、s-t / v-t 辨析——开学第一章的考点都在这。</p>
          <p class="hint" id="p1-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="p1-quizgo">开始自测</button></div>
          <div id="p1-quizbox"></div>
        </div>
      </section>

      <section id="p1-metro">
        <div class="sec-title"><span class="em">🚇</span>维也纳任务 · 给地铁测速</div>
        <div id="p1-metrobox"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c =>
      c.addEventListener('click', () => {
        const t = document.getElementById(c.dataset.to);
        if (t) t.scrollIntoView({ block: 'start' });
      }));

    /* ---- 逐节精读入口卡 ---- */
    (function sectionCards() {
      const SECS = ['p1s1', 'p1s2', 'p1s3', 'p1s4'].map(k => (window.YJS_SECTIONS || {})[k]).filter(Boolean);
      const grid = $('p1-secgrid');
      if (!SECS.length) { grid.innerHTML = '<p class="hint">节页建设中。</p>'; return; }
      const met = k => k.startsWith('any:') ? k.slice(4).split('|').some(x => Y.has(x)) : Y.has(k);
      grid.innerHTML = SECS.map(s => {
        const ns = (window.YJS_MODULES.p1.nodes || []).filter(n => (s.nodeIds || []).includes(n.id));
        const lit = ns.filter(n => n.needs.every(met)).length;
        return `<div class="seccard" data-go="#/m/p1/${s.sec}"><span class="em">${s.emoji}</span><div><div class="t">${s.title}</div><div class="d">${s.sub} · ★ ${lit}/${ns.length}</div></div><span class="go">›</span></div>`;
      }).join('');
      grid.querySelectorAll('[data-go]').forEach(c => c.addEventListener('click', () => { location.hash = c.dataset.go; }));
    })();

    /* ================= ① 估测训练营 ================= */
    (function estLab() {
      let cal = (Y.taskGet('p1.cal').data) || 3.78;
      const calsvg = $('p1-calsvg');
      function drawCal() {
        const w = 85.6 * cal, h = 54 * cal * (80 / (54 * cal)) > 0 ? Math.min(54 * cal, 70) : 60;
        calsvg.innerHTML = `<rect x="10" y="6" width="${w}" height="${Math.min(54 * cal, 66)}" rx="8" fill="rgba(15,118,110,.06)" stroke="#0f766e" stroke-width="2" stroke-dasharray="8 6"/>
          <text x="${10 + w / 2}" y="42" font-size="12" fill="#8b8271" text-anchor="middle">银行卡贴这里（宽 85.6 mm）</text>`;
        $('p1-calv').textContent = '按当前校准 ≈ ' + (85.6 * cal).toFixed(0) + ' 像素';
      }
      $('p1-cal').addEventListener('input', e => { cal = +e.target.value; drawCal(); });
      drawCal();
      const ITEMS = [['一元硬币的直径', 25], ['大号回形针的长度', 33], ['乒乓球的直径', 40], ['一节 5 号电池的长度', 50], ['网球的直径', 67]];
      let cur = 0, tried = 0, best = [];
      $('p1-calok').addEventListener('click', () => {
        Y.taskSet('p1.cal', { data: cal });
        $('p1-calbox').hidden = true;
        $('p1-estbox').hidden = false;
        showItem();
      });
      function showItem() {
        const it = ITEMS[cur];
        $('p1-estq').innerHTML = `下面这条线段和<b>${it[0]}</b>一样长。先别量——用眼睛估：多少毫米？`;
        const w = Math.min(it[1] * cal, 440);
        $('p1-estsvg').innerHTML = `<line x1="10" y1="35" x2="${10 + w}" y2="35" stroke="#4c51bf" stroke-width="6" stroke-linecap="round"/>`;
        $('p1-estin').value = '';
        $('p1-estmsg').innerHTML = '';
        $('p1-estgo').disabled = false;
        $('p1-estnext').hidden = true;
      }
      $('p1-estgo').addEventListener('click', () => {
        const v = parseFloat($('p1-estin').value);
        if (!Number.isFinite(v)) { Y.toast('先填一个数'); return; }
        const t = ITEMS[cur][1];
        const err = Math.abs(v - t) / t * 100;
        best.push(err);
        $('p1-estmsg').innerHTML = `<div class="explain">真实长度：<b>${t} mm</b>（${(t / 10).toFixed(1)} cm）。你的估计偏差 <b>${err.toFixed(0)}%</b> ${err < 10 ? '——神眼！' : err < 25 ? '——不错，体感在长出来。' : '——正常，多对几次答案就准了。'}</div>`;
        $('p1-estgo').disabled = true;
        tried++;
        $('p1-estscore').innerHTML = `已估 ${tried} 件，平均偏差 ${(best.reduce((a, b) => a + b, 0) / best.length).toFixed(0)}%`;
        if (tried >= 3) Y.ev('act:p1.est');
        if (cur < ITEMS.length - 1) $('p1-estnext').hidden = false;
      });
      $('p1-estnext').addEventListener('click', () => { cur++; showItem(); });
    })();

    /* ================= ② 刻度尺读数器 ================= */
    (function rulerLab() {
      const svg = $('p1-rulersvg');
      svg.setAttribute('viewBox', '0 0 460 150');
      svg.classList.add('geo-svg');
      let mode = 'mm', target = 3.67, corrects = 0;
      const TARGETS = { mm: [3.67, 2.34, 4.81, 1.28, 5.43], cm: [3.7, 2.3, 4.8, 1.6] };
      let ti = 0;
      const X = cm => 30 + cm * 68;
      function draw() {
        svg.innerHTML = '';
        el(svg, 'rect', { x: 20, y: 40, width: 425, height: 46, fill: '#fffef2', stroke: '#c9bfa9', 'stroke-width': 1.5 });
        for (let c = 0; c <= 6; c++) {
          el(svg, 'line', { x1: X(c), y1: 40, x2: X(c), y2: 66, stroke: '#27231b', 'stroke-width': 2 });
          el(svg, 'text', { x: X(c), y: 80, 'font-size': 12, 'text-anchor': 'middle', fill: '#27231b' }, String(c));
          if (mode === 'mm' && c < 6) {
            for (let m = 1; m < 10; m++)
              el(svg, 'line', { x1: X(c + m / 10), y1: 40, x2: X(c + m / 10), y2: m === 5 ? 58 : 52, stroke: '#57503f', 'stroke-width': 1 });
          }
        }
        el(svg, 'text', { x: 428, y: 80, 'font-size': 11, fill: '#8b8271' }, 'cm');
        // 被测物体（蓝条，从 0 到 target）
        el(svg, 'rect', { x: X(0), y: 96, width: X(target) - X(0), height: 16, rx: 4, fill: 'rgba(76,81,191,.75)' });
        el(svg, 'text', { x: X(0) + 4, y: 108, 'font-size': 10.5, fill: '#fff' }, '被测物体');
        el(svg, 'path', { d: `M ${X(target)} 92 l -6 -12 l 12 0 Z`, fill: '#b91c1c' });
      }
      draw();
      $('p1-rmode').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('p1-rmode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        mode = b.dataset.m; ti = 0; target = TARGETS[mode][0];
        draw();
      });
      $('p1-rnew').addEventListener('click', () => {
        ti = (ti + 1) % TARGETS[mode].length;
        target = TARGETS[mode][ti];
        $('p1-rin').value = '';
        $('p1-rmsg').innerHTML = '<p>新的一条——读出蓝条右端的位置（cm）。</p>';
        draw();
      });
      $('p1-rgo').addEventListener('click', () => {
        const raw = ($('p1-rin').value || '').trim();
        const v = parseFloat(raw);
        if (!Number.isFinite(v)) { Y.toast('先填读数'); return; }
        const dec = (raw.split('.')[1] || '').length;
        const needDec = mode === 'mm' ? 2 : 1;
        const tol = mode === 'mm' ? 0.051 : 0.21;
        let html;
        if (dec < needDec) {
          html = `<p><b style="color:var(--warn)">数值不错，但少了"估读位"。</b></p><p class="small">分度值是 ${mode === 'mm' ? '1 mm' : '1 cm'}，规范读数要<b>估读到分度值的下一位</b>——应写成 ${needDec} 位小数，比如 ${target.toFixed(needDec)} cm。末尾哪怕是 0 也得写。</p>`;
        } else if (dec > needDec) {
          html = `<p><b style="color:var(--warn)">估读过头了。</b></p><p class="small">估读只估<b>一位</b>：分度值下一位。再往后写就是编数字了——应为 ${target.toFixed(needDec)} cm 这样的 ${needDec} 位小数。</p>`;
        } else if (Math.abs(v - target) <= tol) {
          corrects++;
          html = `<p><b style="color:var(--ok)">✓ 规范！</b>准确值 + 一位估读，位数正好。（已答对 ${corrects} 次）</p>`;
          if (corrects >= 2) Y.ev('act:p1.ruler');
        } else {
          html = `<p><b style="color:var(--bad)">位数规范，但数值偏了。</b></p><p class="small">再对齐红色箭头看看——现在应约为 ${target.toFixed(needDec)} cm。</p>`;
        }
        $('p1-rmsg').innerHTML = html;
      });
    })();

    /* ================= ③ 单位换算速练 ================= */
    (function convLab() {
      const DR = [[72, 'km/h', 'm/s', 20], [15, 'm/s', 'km/h', 54], [36, 'km/h', 'm/s', 10],
        [5, 'm/s', 'km/h', 18], [90, 'km/h', 'm/s', 25], [20, 'm/s', 'km/h', 72],
        [108, 'km/h', 'm/s', 30], [2, 'm/s', 'km/h', 7.2], [54, 'km/h', 'm/s', 15], [25, 'm/s', 'km/h', 90]];
      let i = 0, ok = 0;
      function show() {
        const d = DR[i % DR.length];
        $('p1-cq').innerHTML = `<b>${d[0]} ${d[1]}</b> = ______ ${d[2]}`;
        $('p1-cin').value = '';
      }
      show();
      $('p1-cgo').addEventListener('click', () => {
        const d = DR[i % DR.length];
        const v = parseFloat($('p1-cin').value);
        if (!Number.isFinite(v)) { Y.toast('先填答案'); return; }
        if (Math.abs(v - d[3]) < 0.05) {
          ok++;
          $('p1-cok').textContent = ok;
          $('p1-cmsg').innerHTML = '<p style="color:var(--ok)"><b>✓</b></p>';
          if (ok >= 6) { Y.ev('act:p1.conv'); $('p1-cmsg').innerHTML = '<div class="stdline">换算过关。心法：m/s 说出来数字小、km/h 说出来数字大——方向拿不准就想想这句话。</div>'; }
          i++;
          show();
        } else {
          $('p1-cmsg').innerHTML = `<div class="explain">不对。先想方向：${d[1]} 变 ${d[2]}，数字应该变${d[2] === 'km/h' ? '大（×3.6）' : '小（÷3.6）'}。再算一次：${d[0]} ${d[1]} = <b>${d[3]} ${d[2]}</b>。</div>`;
          i++;
          show();
        }
      });
    })();

    /* ================= ④ 谁在动？参照物切换器 ================= */
    (function refLab() {
      const svg = $('p1-refsvg');
      svg.setAttribute('viewBox', '0 0 460 240');
      svg.classList.add('geo-svg');
      const V = { ground: 0, mine: 42, other: -62, tree: 0 };
      let ref = 'ground', t0 = performance.now(), tried = new Set(['ground']);
      function wrap(x) { let m = ((x + 90) % 640 + 640) % 640; return m - 90; }
      function draw() {
        const t = (performance.now() - t0) / 1000;
        const rx = V[ref] * t;
        svg.innerHTML = '';
        el(svg, 'rect', { x: 0, y: 0, width: 460, height: 240, fill: '#f2f7fb' });
        el(svg, 'line', { x1: 0, y1: 196, x2: 460, y2: 196, stroke: '#8b8271', 'stroke-width': 3 });
        // 树（地面系）
        for (let k = 0; k < 5; k++) {
          const x = wrap(k * 150 - rx);
          el(svg, 'text', { x, y: 192, 'font-size': 30, 'text-anchor': 'middle' }, '🌳');
          if (k === 1) el(svg, 'text', { x, y: 148, 'font-size': 11.5, 'text-anchor': 'middle', fill: statusColor('tree') }, statusOf('tree'));
        }
        // 对面的车（上方轨道）
        const ox = wrap(300 + V.other * t - rx);
        el(svg, 'rect', { x: ox - 55, y: 58, width: 110, height: 34, rx: 8, fill: '#c2410c', opacity: .85 });
        el(svg, 'text', { x: ox, y: 81, 'font-size': 15, 'text-anchor': 'middle', fill: '#fff' }, '对面的车');
        el(svg, 'text', { x: ox, y: 48, 'font-size': 11.5, 'text-anchor': 'middle', fill: statusColor('other') }, statusOf('other'));
        // 我的车
        const mx = wrap(120 + V.mine * t - rx);
        el(svg, 'rect', { x: mx - 60, y: 118, width: 120, height: 38, rx: 8, fill: '#0f766e', opacity: .9 });
        el(svg, 'text', { x: mx - 18, y: 143, 'font-size': 15, fill: '#fff' }, '我的车');
        el(svg, 'text', { x: mx + 38, y: 144, 'font-size': 17, 'text-anchor': 'middle' }, '🧍');
        el(svg, 'text', { x: mx, y: 108, 'font-size': 11.5, 'text-anchor': 'middle', fill: statusColor('mine') }, statusOf('mine'));
      }
      function statusOf(o) {
        const dv = V[o] - V[ref];
        if (Math.abs(dv) < 1) return o === 'mine' ? '我们：静止' : '静止';
        return (o === 'mine' ? '我们：' : '') + (dv > 0 ? '向右动' : '向左动');
      }
      function statusColor(o) { return Math.abs(V[o] - V[ref]) < 1 ? '#15803d' : '#b91c1c'; }
      const anim = addTimer(setInterval(draw, 66));
      function refMsg() {
        const lines = {
          ground: '以【地面】为参照物：你和你的车在<b>向右开</b>，树是静止的，对面的车向左开。',
          mine: '以【我坐的车】为参照物：<b>你是静止的</b>——而窗外的树在向后跑，对面的车更是飞快地掠过。',
          other: '以【对面的车】为参照物：<b>你正猛地向右冲过去</b>——相对速度是两车速度之和，这就是会车时"嗖"的由来。'
        };
        $('p1-refmsg').innerHTML = `<div class="explain">${lines[ref]}</div>` +
          (tried.size >= 3 ? '<div class="stdline">同一个你，三种答案都对——<b>运动和静止是相对的：不先说参照物，"动没动"这个问题没有答案</b>。物体的判断口诀：相对参照物位置变了就是运动。</div>' : '<p class="hint">三个按钮都试试。</p>');
        if (tried.size >= 3) Y.ev('act:p1.ref');
      }
      $('p1-refbtns').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('p1-refbtns').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        ref = b.dataset.r;
        tried.add(ref);
        refMsg();
      });
      $('p1-refguess').appendChild(Y.guess({
        q: '先猜：对面车里的乘客看你，你是什么状态？',
        options: ['几乎不动', '慢慢靠近他', '飞快地冲过去'], answer: 2,
        reveal: '点【对面的车】那个按钮，亲眼看看。',
        onDone: () => {}
      }));
      refMsg();
    })();

    /* ================= ⑤ 双图像实验台 ================= */
    (function graphLab() {
      const G = window.GraphKit;
      const sPlot = G.plot($('p1-splot'), { xMax: 8, yMax: 100, xLab: 't/s', yLab: 's/m', title: 's-t 图（路程-时间）', color: '#0f766e' });
      const vPlot = G.plot($('p1-vplot'), { xMax: 8, yMax: 30, xLab: 't/s', yLab: 'v/(m/s)', title: 'v-t 图（速度-时间）', color: '#4c51bf' });
      const track = $('p1-track');
      let carS = 10, recording = null, runDone = false, sayDone = false, dragging = false;
      function drawTrack() {
        track.innerHTML = `
          <line x1="20" y1="66" x2="440" y2="66" stroke="#8b8271" stroke-width="3"/>
          ${[0, 25, 50, 75, 100].map(m => `<line x1="${20 + m * 4.2}" y1="62" x2="${20 + m * 4.2}" y2="70" stroke="#57503f" stroke-width="1.5"/><text x="${20 + m * 4.2}" y="84" font-size="10" text-anchor="middle" fill="#8b8271">${m}m</text>`).join('')}
          <text id="p1-car" x="${20 + carS * 4.2}" y="52" font-size="30" text-anchor="middle" style="cursor:grab">🚌</text>`;
      }
      drawTrack();
      track.addEventListener('pointerdown', e => {
        if (e.target.id === 'p1-car') { dragging = true; try { track.setPointerCapture(e.pointerId); } catch (err) {} e.preventDefault(); }
      });
      track.addEventListener('pointermove', e => {
        if (!dragging) return;
        const r = track.getBoundingClientRect();
        carS = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width * 460 - 20) / 4.2));
        const car = track.querySelector('#p1-car');
        car.setAttribute('x', 20 + carS * 4.2);
      });
      const stopDrag = () => { dragging = false; };
      track.addEventListener('pointerup', stopDrag);
      track.addEventListener('pointercancel', stopDrag);

      const SCRIPTS = {
        uniform: { fn: t => 12 * t, cap: '匀速：s-t 是一条<b>斜直线</b>（越陡越快），v-t 是一条<b>水平线</b>。同一个运动，两张完全不同的画像。' },
        stopgo: { fn: t => t < 3 ? 10 * t : t < 5 ? 30 : Math.min(100, 30 + 23.3 * (t - 5)), cap: '中间停的那 2 秒：s-t 里是<b>水平段</b>（路程不涨），v-t 里是<b>贴地段</b>（速度为零）。水平线在两张图里含义完全不同——去下面把自述填了。' },
        accel: { fn: t => Math.min(100, 1.56 * t * t), cap: '越来越快：s-t 是越来越陡的<b>曲线</b>，v-t 是一条<b>上坡直线</b>。' }
      };
      const CHASE = t => t < 2.5 ? 12 * t : t < 4.5 ? 30 : Math.min(100, 30 + 20 * (t - 4.5));

      function record(mode) {
        if (recording) return;
        sPlot.reset(); vPlot.reset();
        if (mode === 'chase') {
          const ghost = [];
          for (let t = 0; t <= 8.01; t += 0.25) ghost.push([t, CHASE(t)]);
          sPlot.setGhost(ghost);
          $('p1-gmsg').innerHTML = '<p><b>跟着金色虚线开车！</b>它走你也走，它停你也停——绿线越贴近金线越好。</p>';
        } else {
          sPlot.clearGhost();
        }
        let sPrev = mode === 'manual' || mode === 'chase' ? carS : 0;
        if (mode === 'manual' || mode === 'chase') { /* 起点用当前车位 */ } else { carS = 0; }
        let v = 0, errSum = 0, n = 0;
        const t0 = performance.now();
        recording = addTimer(setInterval(() => {
          const t = (performance.now() - t0) / 1000;
          if (t > 8) {
            clearInterval(recording); recording = null;
            if (mode === 'chase') {
              const avg = errSum / Math.max(1, n);
              if (avg < 8) {
                $('p1-gmsg').innerHTML = `<div class="stdline">🏁 跟车成功！平均偏差 ${avg.toFixed(1)} m——你已经能"读着曲线开车"了，读图的最高境界。</div>`;
                Y.ev('act:p1.chase');
              } else {
                $('p1-gmsg').innerHTML = `<div class="explain">平均偏差 ${avg.toFixed(1)} m，还差一点（目标 < 8 m）。提示：金线水平的那段，车要<b>完全停住</b>。再来！</div>`;
              }
            } else if (mode !== 'manual') {
              $('p1-gmsg').innerHTML = `<div class="explain">${SCRIPTS[mode].cap}</div>`;
              runDone = true;
              maybeGraphEv();
            } else {
              $('p1-gmsg').innerHTML = '<div class="explain">这就是你刚才那 8 秒的"运动画像"。试试预设剧本，看看标准图形长什么样。</div>';
            }
            return;
          }
          let s;
          if (mode === 'manual' || mode === 'chase') s = carS;
          else { s = SCRIPTS[mode].fn(t); carS = s; const car = track.querySelector('#p1-car'); if (car) car.setAttribute('x', 20 + s * 4.2); }
          const dt = 0.1;
          const vNew = Math.max(0, Math.min(30, (s - sPrev) / dt));
          v = 0.55 * vNew + 0.45 * v;
          sPrev = s;
          sPlot.push(t, s);
          vPlot.push(t, v);
          if (mode === 'chase') { errSum += Math.abs(s - CHASE(t)); n++; }
        }, 100));
      }
      $('p1-scripts').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        record(b.dataset.s);
      });
      function maybeGraphEv() { if (runDone && sayDone) Y.ev('act:p1.graph'); }
      const SAY = { 'p1-say1': '静止', 'p1-say2': '匀速运动' };
      Object.keys(SAY).forEach(id => {
        $(id).addEventListener('change', () => {
          const sel = $(id), okv = sel.value === SAY[id];
          sel.classList.toggle('good', okv);
          sel.classList.toggle('badpick', !okv && sel.value !== '');
          if (Object.keys(SAY).every(k => $(k).value === SAY[k])) {
            $('p1-sayr').innerHTML = '<div class="stdline">同样的水平线：s-t 图里是静止（路程不再增加），v-t 图里是匀速（速度保持不变）。先看纵轴是谁，再下结论。</div>';
            sayDone = true;
            maybeGraphEv();
          }
        });
      });
    })();

    /* ================= ⑥ 斜面小车实验 ================= */
    (function slopeLab() {
      const svg = $('p1-slopesvg');
      svg.setAttribute('viewBox', '0 0 460 220');
      svg.classList.add('geo-svg');
      let ang = 15, state = 0, runs = [], anim = null;   // state: 0 未备 1 金属片 2 车就位
      const TOP = () => [70, 190 - 340 * Math.sin(ang * Math.PI / 180) * 0.9];
      function draw(prog) {
        const T = TOP(), B = [410, 190];
        svg.innerHTML = '';
        el(svg, 'line', { x1: 30, y1: 190, x2: 440, y2: 190, stroke: '#8b8271', 'stroke-width': 3 });
        el(svg, 'line', { x1: T[0], y1: T[1], x2: B[0], y2: B[1], stroke: '#57503f', 'stroke-width': 5, 'stroke-linecap': 'round' });
        const mid = [(T[0] + B[0]) / 2, (T[1] + B[1]) / 2];
        el(svg, 'line', { x1: mid[0] - 6, y1: mid[1] - 10, x2: mid[0] + 6, y2: mid[1] + 2, stroke: '#b7791f', 'stroke-width': 3 });
        el(svg, 'text', { x: mid[0] + 10, y: mid[1] - 8, 'font-size': 11, fill: '#b45309' }, '中点 0.6 m');
        const metal = state >= 1 || prog !== undefined;
        if (metal) el(svg, 'rect', { x: B[0] - 4, y: B[1] - 22, width: 8, height: 22, fill: '#4c51bf' });
        el(svg, 'text', { x: B[0] + 8, y: B[1] - 8, 'font-size': 11, fill: metal ? '#4c51bf' : '#c9bfa9' }, '金属片');
        if (state >= 2 || prog !== undefined) {
          const p = prog === undefined ? 0 : prog;
          const cx = T[0] + (B[0] - T[0]) * p, cy = T[1] + (B[1] - T[1]) * p;
          el(svg, 'text', { x: cx, y: cy - 8, 'font-size': 26, 'text-anchor': 'middle' }, '🛒');
        }
        el(svg, 'text', { x: 46, y: 40, 'font-size': 12.5, fill: '#8b8271' }, `斜面长 1.2 m · 坡度 ${ang}°`);
      }
      draw();
      $('p1-slang').addEventListener('input', e => {
        ang = +e.target.value;
        $('p1-slv').textContent = ang + '°';
        if (ang > 22) $('p1-slmsg').innerHTML = '<p class="hint">⚠️ 坡这么陡，小车嗖一下就到底，时间短得没法测准——实验里坡度要<b>小一点</b>。</p>';
        draw();
      });
      $('p1-st1').addEventListener('click', () => { if (state < 1) state = 1; draw(); });
      $('p1-st2').addEventListener('click', () => {
        if (state === 0) { Y.toast('先放金属片（不然车冲出去啦）'); return; }
        state = 2; draw();
      });
      $('p1-st3').addEventListener('click', () => {
        if (state < 2) {
          $('p1-slmsg').innerHTML = '<div class="explain">💥 手忙脚乱——车还没就位就开表，这一次作废。按顺序来：① 金属片 → ② 车就位 → ③ 放车开表。真实实验里"先想清流程"就是这么练的。</div>';
          return;
        }
        const a = 9.8 * Math.sin(ang * Math.PI / 180) * 0.25;
        const jitter = 1 + (Math.random() - 0.5) * 0.04;
        const tTotal = Math.sqrt(2 * 1.2 / a) * jitter;
        const tHalf = Math.sqrt(2 * 0.6 / a) * jitter;
        const t0 = performance.now();
        state = 0;
        if (anim) clearInterval(anim);
        anim = addTimer(setInterval(() => {
          const t = (performance.now() - t0) / 1000;
          const p = Math.min(1, (0.5 * a * t * t) / 1.2);
          draw(p);
          $('p1-swatch2').textContent = Math.min(t, tTotal).toFixed(2);
          if (p >= 1) {
            clearInterval(anim); anim = null;
            finishRun(tHalf, tTotal);
          }
        }, 50));
      });
      function finishRun(t1, t2) {
        const v1 = 0.6 / t1, v2 = 0.6 / (t2 - t1), vAll = 1.2 / t2;
        runs.push({ t1, t2, v1, v2, vAll });
        let html = `<table class="fill"><tr><th>次</th><th>t 前半/s</th><th>t 全程/s</th><th>v 前半</th><th>v 后半</th><th>v 全程</th></tr>` +
          runs.map((r, i) => `<tr><td>${i + 1}</td><td>${r.t1.toFixed(2)}</td><td>${r.t2.toFixed(2)}</td><td>${r.v1.toFixed(2)}</td><td><b>${r.v2.toFixed(2)}</b></td><td>${r.vAll.toFixed(2)}</td></tr>`).join('');
        if (runs.length >= 3) {
          const m = k => (runs.reduce((s, r) => s + r[k], 0) / runs.length).toFixed(2);
          html += `<tr style="background:var(--gold-bg)"><td><b>平均</b></td><td>${m('t1')}</td><td>${m('t2')}</td><td>${m('v1')}</td><td><b>${m('v2')}</b></td><td>${m('vAll')}</td></tr>`;
        }
        html += '</table>';
        html += `<div class="explain">v 后半 > v 前半：小车越滑越快——这是<b>变速运动</b>，所以说"平均速度"必须说明<b>哪一段</b>的平均速度。${runs.length < 3 ? `再做 ${3 - runs.length} 次，取平均对付误差。` : ''}</div>`;
        if (runs.length >= 3) {
          html += '<div class="stdline">三次取平均完成——<b>多次测量取平均值</b>能减小误差；而"没放金属片"这类是错误，错误必须避免、不能靠平均。</div>';
          Y.ev('act:p1.slope');
        }
        $('p1-sltable').innerHTML = html;
        $('p1-slmsg').innerHTML = '<p class="hint">想再来一次：① 金属片 → ② 就位 → ③ 放车。</p>';
      }
      $('p1-slguess').appendChild(Y.guess({
        q: '先猜：小车滑下来，前半段和后半段哪段的平均速度更大？',
        options: ['前半段', '后半段', '两段一样大'], answer: 1,
        reveal: '做一次实验，让数据说话。',
        onDone: () => {}
      }));
    })();

    /* ================= 知识卡 ================= */
    window.ExplainKit.cards($('p1-cardlist'), [
      { emoji: '📏', title: '长度测量与估读', rule: '长度基本单位是米（m）。要<b>估读到分度值的下一位</b>；记录 = 准确值 + 一位估读值 + 单位。', eg: '1mm 刻度尺量铅笔',
        steps: [{ t: '准确读到 5.2 cm', r: '对齐分度线' }, { t: '再估读一位 → 5.24 cm', r: '估读位不能少', key: true }],
        trap: '5.2 cm 和 5.20 cm 是两种规格的测量——末尾的 0 是估读的证据，一个都不能省。' },
      { emoji: '⏱️', title: '时间测量', rule: '时间基本单位是秒（s）。机械停表读数 = 小圈的分 + 大圈的秒。',
        steps: [{ t: '1 h = 60 min = 3600 s', r: '' }, { t: '这个 3600', r: '正是速度换算里 3.6 的来源', key: true }] },
      { emoji: '🎯', title: '误差与错误', rule: '误差：测量值与真实值的差异，只能减小、不能消除，<b>多次测量取平均</b>可减小。错误：操作不当造成，必须避免。',
        steps: [{ t: '手抖 → 误差', r: '平均救得了' }, { t: '读错刻度、忘放金属片 → 错误', r: '平均救不了', key: true }],
        trap: '别把两者混为一谈：平均值只对付误差，对付不了错误——错误只能避免。' },
      { emoji: '🌏', title: '参照物与运动的相对性', rule: '判断动没动，先选<b>参照物</b>：相对参照物位置改变，就是运动。参照物可任意选（常选地面）。',
        steps: [{ t: '以地面看你', r: '在飞驰' }, { t: '以车厢看你', r: '纹丝不动', key: true }],
        trap: '"你现在动没动？"——不先说参照物，这问题没有答案。说某物在动之前，先说清参照物。' },
      { emoji: '🚀', title: '速度', rule: '速度表示运动快慢，<b>v = s / t</b>。国际单位 m/s；1 m/s = 3.6 km/h。', eg: '54 km/h = ? m/s',
        steps: [{ t: 'km/h → m/s 除以 3.6', r: '54 ÷ 3.6' }, { t: '= 15 m/s', r: '数字变小', key: true }],
        trap: '速度是初中第一个"比值定义"的量（路程与时间的比）。记住这个套路，12 月学密度还会再见。' },
      { emoji: '📊', title: '平均速度', rule: '平均速度 = <b>总路程 ÷ 总时间</b>，必须指明哪段的平均。', eg: '前半程 4、后半程 6 m/s',
        steps: [{ t: '设每半程 12 m', r: '前半用 3s、后半用 2s' }, { t: '全程 24m ÷ 5s = 4.8 m/s', r: '不是 5！', key: true }],
        trap: '不是各段速度的算术平均——慢的那段占时间多，把平均往下拖，所以答案比 5 小。' },
      { emoji: '📈', title: 's-t 与 v-t 图像', rule: 's-t 图：水平=静止，斜线=匀速（越陡越快）。v-t 图：水平=匀速，贴横轴=静止。', fig: 'stvt',
        steps: [{ t: '同样一条水平线', r: '' }, { t: 's-t 图里 = 静止', r: '路程不再增加' }, { t: 'v-t 图里 = 匀速', r: '速度保持不变', key: true }],
        trap: '两张图长得像、含义完全不同——先看纵轴是 s 还是 v，再开口。期中卷经典陷阱位。' },
      { emoji: '⛷️', title: '测平均速度实验', rule: '原理 v = s/t。器材：斜面、小车、刻度尺、停表、金属片。坡度要<b>小</b>（时间长才好测）。',
        steps: [{ t: '分段计时', r: '算 v前半、v后半' }, { t: 'v后半 > v前半', r: '小车越滑越快=变速', key: true }],
        trap: '金属片的作用：让小车停在同一位置、便于准确计时。坡太陡时间太短，测不准。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() {
      const b = Y.quizBest('p1');
      $('p1-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : '';
    }
    bestLine();
    $('p1-quizgo').addEventListener('click', () => {
      $('p1-quizgo').style.display = 'none';
      Y.quizStart($('p1-quizbox'), 'p1', () => {
        $('p1-quizgo').style.display = '';
        $('p1-quizgo').textContent = '再测一次';
        bestLine();
      });
    });

    /* ================= 维也纳任务 · 地铁测速 ================= */
    (function metroLab() {
      const SEG = [
        ['U4', 'Schönbrunn → Hietzing', 900],
        ['U4', 'Karlsplatz → Stadtpark', 700],
        ['U4', 'Kettenbrückengasse → Karlsplatz', 800],
        ['U1', 'Stephansplatz → Karlsplatz', 900],
        ['U3', 'Volkstheater → Neubaugasse', 600],
        ['U3', 'Westbahnhof → Zieglergasse', 500],
        ['U6', 'Längenfeldgasse → Meidling', 900],
        ['U2', 'Schottentor → Rathaus', 500]
      ];
      const box = $('p1-metrobox');
      const body = document.createElement('div');
      body.innerHTML = `
        <p class="small" style="margin-top:8px">列车一开动就按"开表"，到站停稳按"停表"——或者直接手填秒数。<b>站距为地图约值</b>，结果当然也是"约"——这正是测量的常态。</p>
        <div class="btnrow">
          <select class="blank" id="p1-mseg">${SEG.map((s, i) => `<option value="${i}">${s[0]} · ${s[1]}（约 ${s[2]} m）</option>`).join('')}</select>
        </div>
        <div class="btnrow">
          <button class="btn primary" id="p1-msw">开表</button>
          <span class="chip" style="pointer-events:none" id="p1-mtime">0.0 s</span>
          <input class="note" id="p1-mmanual" type="number" inputmode="decimal" placeholder="或手填秒数" style="max-width:140px;margin:0">
          <button class="btn gold" id="p1-mcalc">算速度并记录</button>
        </div>
        <div id="p1-mres"></div>
        <div class="reclist" id="p1-mrecs"></div>`;
      const t1 = Y.taskGet('p1.metro');
      box.appendChild(window.TaskKit.card({
        emoji: '🚇', title: '维也纳地铁测速（数据会回流进你的题目里）',
        desc: '真实测量第一课：坐 U 系地铁，测一站的时间，算出速度。测满 2 段不同区间算完成。',
        done: t1.done, body,
        onToggle: v => Y.taskSet('p1.metro', { done: v })
      }));
      let running = null, t0 = 0, sec = 0;
      $('p1-msw').addEventListener('click', () => {
        if (!running) {
          t0 = performance.now();
          running = addTimer(setInterval(() => {
            sec = (performance.now() - t0) / 1000;
            $('p1-mtime').textContent = sec.toFixed(1) + ' s';
          }, 100));
          $('p1-msw').textContent = '停表';
        } else {
          clearInterval(running); running = null;
          $('p1-msw').textContent = '开表';
        }
      });
      function renderRecs() {
        const recs = Y.taskGet('p1.metro').data || [];
        $('p1-mrecs').innerHTML = recs.map(r =>
          `<div class="rec"><span class="place">${r.seg}</span><span class="db">${r.v} m/s</span><span class="hint">≈ ${r.kmh} km/h · ${r.t} s</span></div>`).join('');
      }
      renderRecs();
      $('p1-mcalc').addEventListener('click', () => {
        const manual = parseFloat($('p1-mmanual').value);
        const t = Number.isFinite(manual) && manual > 0 ? manual : sec;
        if (!t || t < 5) { Y.toast('先测（或填）一个像样的时间'); return; }
        const s = SEG[+$('p1-mseg').value];
        const v = s[2] / t;
        const kmh = v * 3.6;
        $('p1-mres').innerHTML = `<div class="explain">v = s ÷ t = ${s[2]} m ÷ ${t.toFixed(1)} s ≈ <b>${v.toFixed(1)} m/s ≈ ${kmh.toFixed(0)} km/h</b><br>
          对比：骑车 ≈ 15 km/h · 市区汽车 ≈ 40 km/h · 博尔特冲刺 ≈ 37 km/h。</div>`;
        const recs = Y.taskGet('p1.metro').data || [];
        recs.unshift({ seg: s[0] + ' ' + s[1].split(' → ')[0] + '→' + s[1].split(' → ')[1], t: t.toFixed(1), v: v.toFixed(1), kmh: kmh.toFixed(0) });
        const segsUsed = new Set(recs.map(r => r.seg));
        Y.taskSet('p1.metro', { data: recs, done: segsUsed.size >= 2 });
        Y.ev('act:p1.metro');
        renderRecs();
        if (segsUsed.size >= 2) Y.toast('🚇 两段区间到手——任务完成，数据已存档回流', true);
      });
    })();

    return {
      cleanup() { timers.forEach(t => clearInterval(t)); }
    };
  }
};
