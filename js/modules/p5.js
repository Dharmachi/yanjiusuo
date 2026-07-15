/* p5 · 第五章 透镜及其应用 —— 凸透镜成像规律（八上物理第一大考点）。旗舰模块，产出 optics-kit 光路引擎。
   纪律：沙盒里光线与像是"实验现象"（她观察），"倒立/放大/实虚"这些结论词藏到规律表让她自己填；
   图谱证据绑定真实拖动（bench.onChange 检测里程碑），不在先猜点击时发放。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.p5 = {
  id: 'p5', subject: 'phys', emoji: '🔍',
  title: '透镜及其应用', subtitle: '一个凸透镜 · 照相机/投影仪/放大镜全靠它',
  wave: 'M7',
  nodes: [
    { id: 'p5-n1', label: '凸凹透镜·会聚与发散', needs: ['act:p5.converge', 'q:p5q1'] },
    { id: 'p5-n2', label: '三条特殊光线', needs: ['act:p5.rays', 'q:p5q2'] },
    { id: 'p5-n3', label: '成像分界·u=2f 等大', needs: ['act:p5.equalsize', 'q:p5q3'] },
    { id: 'p5-n4', label: '动态规律·物近像远像变大', needs: ['act:p5.dynamic', 'q:p5q7'] },
    { id: 'p5-n5', label: '实像与虚像·放大镜', needs: ['act:p5.virtual', 'any:q:p5q5|q:p5q6'] },
    { id: 'p5-n6', label: '凸透镜成像规律表（通关）', needs: ['act:p5.table'] },
    { id: 'p5-n7', label: '挡半透镜·像完整变暗', needs: ['act:p5.half', 'q:p5q9'] },
    { id: 'p5-n8', label: '眼睛与近视远视矫正', needs: ['act:p5.eye', 'q:p5q10'] },
    { id: 'p5-n9', label: '生活透镜·照相机/投影仪/放大镜', needs: ['act:p5.life', 'q:p5q4'] },
    { id: 'p5-n10', label: '望远镜 DIY（跨学科实践）', needs: ['act:p5.telescope'] }
  ],
  taskIds: ['p5.telescope'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k])); if (txt !== undefined) e.textContent = txt; g.appendChild(e); return e; };
    const round = x => Math.round(x);

    root.innerHTML = `
      <nav class="secnav">
        ${[['p5-intro', '引入'], ['p5-lens', '透镜'], ['p5-bench', '光路沙盒'], ['p5-half', '挡半透镜'],
        ['p5-eye', '眼睛'], ['p5-life', '生活透镜'], ['p5-cards', '知识卡'], ['p5-quiz', '自测'], ['p5-tele', '望远镜任务']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="p5-intro">
        <div class="card phys">
          <p class="intro-hook">照相机拍出<b>缩小</b>的你，投影仪投出<b>放大</b>的画面，放大镜让你看清<b>更大</b>的字——
          它们其实是<b>同一片凸透镜</b>，只是蜡烛离透镜远近不同。<br>
          这一章就干一件事：把蜡烛在光具座上拖来拖去，让你<b>自己发现</b>"离多远得到什么像"的规律。这是八上物理最大的一个考点。</p>
          <p class="hint">先剧透一半：决定成什么像的，只有一个东西——<b>物距 u 和焦距 f 的关系</b>。往下玩，规律让你自己拖出来。</p>
        </div>
      </section>

      <section id="p5-lens">
        <div class="sec-title"><span class="em">🔎</span>透镜 · 会聚还是发散 · 三条特殊光线</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p5-lensmode">
              <button class="chip on" data-m="convex">凸透镜（中间厚）</button>
              <button class="chip" data-m="concave">凹透镜（中间薄）</button>
            </div>
            <svg id="p5-lenssvg" style="width:100%;height:160px" viewBox="0 0 300 160"></svg>
            <p class="small" id="p5-lenscap"></p>
          </div>
          <div class="card">
            <div id="p5-lensguess"></div>
            <hr class="divider">
            <h3>三条特殊光线 · 闭眼能画</h3>
            <p class="small">凸透镜作图就靠这三条"听话"的光线。每条先猜它折射后往哪走：</p>
            <div id="p5-rayq"></div>
            <div id="p5-raysvg-wrap" hidden><svg id="p5-raysvg" style="width:100%;height:140px" viewBox="0 0 320 140"></svg></div>
          </div>
        </div>
      </section>

      <section id="p5-bench">
        <div class="sec-title"><span class="em">🕯️</span>光路沙盒 · 拖蜡烛，规律自己现</div>
        <div class="card">
          <svg id="p5-benchsvg"></svg>
          <div class="benchbar">
            <span class="small">焦距 f</span>
            <input type="range" id="p5-f" min="4" max="11" step="0.5" value="7" style="flex:1;max-width:180px">
            <label class="small" style="display:flex;align-items:center;gap:4px"><input type="checkbox" id="p5-screen" checked> 光屏</label>
            <button class="btn ghost" id="p5-benchreset">↺ 复位</button>
          </div>
          <p class="anglebig" style="margin:4px 0;font-size:15px" id="p5-readout"></p>
          <p class="small" style="color:var(--muted)">👆 用手指拖动<b>蜡烛</b>（红箭头）左右移动；拖<b>光屏</b>找清晰像。F、2F 是焦点和二倍焦距点。</p>
        </div>
        <div class="split" style="margin-top:10px">
          <div class="card">
            <h3>🎯 三步发现任务</h3>
            <div id="p5-tasks"></div>
          </div>
          <div class="card">
            <div id="p5-benchguess"></div>
            <div id="p5-benchmsg"><p class="hint">跟着左边三步任务拖蜡烛。三步都点亮后，会出现"成像规律通关表"。</p></div>
          </div>
        </div>
        <div class="card" id="p5-tablewrap" hidden>
          <h3>📜 凸透镜成像规律 · 通关表</h3>
          <p class="small">五种情况你都在沙盒里见过了。凭观察把每一行填上——填对的行会点亮。全对，这张表就是你的通关证书。</p>
          <div id="p5-tablebox"></div>
          <div id="p5-tablemsg"></div>
          <div id="p5-challenge" hidden></div>
        </div>
      </section>

      <section id="p5-half">
        <div class="sec-title"><span class="em">🌓</span>挡住半个透镜 · 像会缺一半吗</div>
        <div class="split">
          <div class="card">
            <svg id="p5-halfsvg" style="width:100%;height:180px" viewBox="0 0 300 180"></svg>
            <div class="btnrow"><button class="btn" id="p5-halfbtn">🖐️ 挡住透镜下半</button></div>
            <p class="small" id="p5-halfcap"></p>
          </div>
          <div class="card"><div id="p5-halfguess"></div><div id="p5-halfmsg"></div></div>
        </div>
      </section>

      <section id="p5-eye">
        <div class="sec-title"><span class="em">👁️</span>眼睛模拟器 · 近视远视怎么矫正</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p5-eyemode">
              <button class="chip on" data-m="normal">正常眼</button>
              <button class="chip" data-m="myopia">近视眼</button>
              <button class="chip" data-m="hyper">远视眼</button>
            </div>
            <svg id="p5-eyesvg" style="width:100%;height:170px" viewBox="0 0 320 170"></svg>
            <div class="chips" id="p5-eyelens">
              <button class="chip on" data-l="none">裸眼</button>
              <button class="chip" data-l="concave">戴凹透镜</button>
              <button class="chip" data-l="convex">戴凸透镜</button>
            </div>
            <p class="small" id="p5-eyecap"></p>
          </div>
          <div class="card">
            <div id="p5-eyeguess"></div>
            <div id="p5-eyemsg"></div>
            <details style="margin-top:8px"><summary class="hint">彩蛋：为什么眯着眼能看清一点？</summary>
              <p class="small">眯眼把进光的"口"缩小了，相当于给眼睛加了个小孔光圈，模糊的光斑变小、清晰些——这跟小孔成像是一家人（回链 光现象）。当然，长期靠眯眼不解决问题，该配镜还得配。</p></details>
          </div>
        </div>
      </section>

      <section id="p5-life">
        <div class="sec-title"><span class="em">📷</span>生活透镜 · 它们工作在哪一段</div>
        <div class="split">
          <div class="card">
            <p class="small">照相机、投影仪、放大镜都是凸透镜，区别只在物距落在哪一段。给每个填上物距区间和成的像——填对点亮。</p>
            <div id="p5-liferows"></div>
            <div id="p5-lifemsg"></div>
          </div>
          <div class="card">
            <p class="small">左边三个先自己配。配不出来、想核对，再点开下面的答案。</p>
            <details><summary class="hint">连一句话记牢（配完再对照）</summary>
              <ul class="small" style="padding-left:18px;line-height:1.9">
                <li><b>照相机</b>：物体远（u&gt;2f）→ 倒立缩小实像，底片小小的</li>
                <li><b>投影仪/幻灯机</b>：胶片放在 f 和 2f 之间 → 倒立放大实像（所以胶片要<b>倒着</b>插）</li>
                <li><b>放大镜</b>：字放在焦点内（u&lt;f）→ 正立放大虚像</li>
              </ul></details>
            <p class="small" style="color:var(--muted);margin-top:8px">手机摄像头＝一片超短焦凸透镜，靠镜片组微调对焦，不用像老相机那样"拉风箱"。</p>
          </div>
        </div>
      </section>

      <section id="p5-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡（讲透卡）</div>
        <div id="p5-cardlist"></div>
      </section>

      <section id="p5-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 12 题</div>
        <div class="card">
          <p>成像规律正反推（含 u=f、u=2f 边界）、动态变化、挡半透镜、眼睛矫正、实虚像判断——本章考点全覆盖。错题进错因本。</p>
          <p class="hint" id="p5-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="p5-quizgo">开始自测</button></div>
          <div id="p5-quizbox"></div>
        </div>
      </section>

      <section id="p5-tele">
        <div class="sec-title"><span class="em">🔭</span>望远镜 DIY · 跨学科实践</div>
        <div id="p5-telebox"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c => c.addEventListener('click', () => { const t = document.getElementById(c.dataset.to); if (t) t.scrollIntoView({ block: 'start' }); }));

    /* ============ ① 透镜 · 会聚发散 ============ */
    (function lensLab() {
      const svg = $('p5-lenssvg'); let mode = 'convex', revealed = false;
      function draw() {
        svg.innerHTML = '';
        const axisY = 80, lensX = 150;
        el(svg, 'line', { x1: 8, y1: axisY, x2: 292, y2: axisY, stroke: '#8b8271', 'stroke-width': 1 });
        // 透镜轮廓
        if (mode === 'convex') el(svg, 'path', { d: `M ${lensX} 30 Q ${lensX + 14} ${axisY} ${lensX} 130 Q ${lensX - 14} ${axisY} ${lensX} 30 Z`, fill: 'rgba(76,129,191,.14)', stroke: '#4c81bf', 'stroke-width': 1.8 });
        else el(svg, 'path', { d: `M ${lensX - 8} 30 Q ${lensX + 2} ${axisY} ${lensX - 8} 130 L ${lensX + 8} 130 Q ${lensX - 2} ${axisY} ${lensX + 8} 30 Z`, fill: 'rgba(76,129,191,.14)', stroke: '#4c81bf', 'stroke-width': 1.8 });
        const ys = [50, 65, 95, 110];
        const fx = mode === 'convex' ? 222 : 78;   // 凸：右侧实焦点；凹：左侧虚焦点
        if (revealed) {
          el(svg, 'circle', { cx: fx, cy: axisY, r: 3, fill: '#b7791f' });
          el(svg, 'text', { x: fx, y: axisY + 16, 'font-size': 10, fill: '#b7791f', 'text-anchor': 'middle', 'font-weight': 700 }, mode === 'convex' ? 'F 焦点' : 'F 虚焦点');
        }
        ys.forEach(y => {
          el(svg, 'line', { x1: 8, y1: y, x2: lensX, y2: y, stroke: '#0f766e', 'stroke-width': 1.5 });   // 入射平行光
          if (!revealed) return;
          if (mode === 'convex') {
            el(svg, 'line', { x1: lensX, y1: y, x2: fx, y2: axisY, stroke: '#0f766e', 'stroke-width': 1.5 });     // 会聚到 F
            el(svg, 'line', { x1: fx, y1: axisY, x2: 292, y2: axisY + (axisY - y), stroke: '#0f766e', 'stroke-width': 1, opacity: .5 });
          } else {
            const slope = (y - axisY) / (lensX - fx);   // 发散：好像从虚焦点射出
            el(svg, 'line', { x1: lensX, y1: y, x2: 292, y2: y + slope * (292 - lensX), stroke: '#0f766e', 'stroke-width': 1.5 });
            el(svg, 'line', { x1: fx, y1: axisY, x2: lensX, y2: y, stroke: '#b7791f', 'stroke-width': 1, 'stroke-dasharray': '4 3', opacity: .7 });
          }
        });
        if (!revealed) el(svg, 'text', { x: 232, y: axisY - 6, 'font-size': 13, fill: '#8b8271', 'text-anchor': 'middle' }, '穿过后 → ?');
        $('p5-lenscap').innerHTML = !revealed
          ? '平行光正射向透镜。先在右边猜一猜：穿过"中间厚"的凸透镜后，光会怎样？再点凸/凹两个都看看。'
          : (mode === 'convex'
            ? '凸透镜（中间厚）：平行光穿过后<b>会聚</b>到一点——那个点就是焦点 F。凸透镜对光<b>会聚</b>。'
            : '凹透镜（中间薄）：平行光穿过后<b>发散</b>开；反向延长线交于同侧一点（虚焦点）。凹透镜对光<b>发散</b>。');
      }
      $('p5-lensmode').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        $('p5-lensmode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        mode = b.dataset.m; revealed = true; draw();
        Y.ev('act:p5.converge');   // 亲手切换、看过两种 → 记会聚/发散
      });
      $('p5-lensguess').appendChild(Y.guess({
        q: '先猜：一束平行光射向"中间厚"的凸透镜，穿过后会怎样？', options: ['会聚到一点', '发散开', '还是平行'], answer: 0,
        reveal: '点上面"凸/凹"两个都看一遍——凸会聚、凹发散。会聚到的那个点就是焦点。',
        onDone: () => { revealed = true; draw(); }
      }));
      // 三条特殊光线：三连预测
      const RAYQ = [
        { q: '① 一条<b>平行于主光轴</b>的光线，穿过凸透镜后往哪走？', options: ['折射后过另一侧焦点 F′', '原方向不变', '过光心不偏折'], answer: 0, note: '平行光 → 折射后必过焦点 F′。' },
        { q: '② 一条正对<b>光心 O</b>（透镜中心）射来的光线，穿过后？', options: ['照直走、不偏折', '折射后过焦点', '被弹回去'], answer: 0, note: '过光心的光线传播方向不变。' },
        { q: '③ 一条<b>先过焦点 F</b> 再打到透镜的光线，穿过后？', options: ['折射后平行于主光轴射出', '过另一侧焦点', '原路返回'], answer: 0, note: '过焦点入射 → 折射后平行主光轴（和①正好互为逆过程）。' }
      ];
      let rayDone = 0;
      RAYQ.forEach((rq, k) => {
        const box = document.createElement('div'); box.style.margin = '6px 0';
        box.appendChild(Y.guess({
          q: rq.q, options: rq.options, answer: rq.answer, reveal: rq.note,
          onDone: () => { rayDone++; if (rayDone >= 3) { $('p5-raysvg-wrap').hidden = false; drawRays(); Y.ev('act:p5.rays'); } }
        }));
        $('p5-rayq').appendChild(box);
      });
      function drawRays() {
        const svg = $('p5-raysvg'); svg.innerHTML = '';
        const axisY = 70, lensX = 170, F1 = 90, F2 = 250, oX = 40, oTop = 34;
        el(svg, 'line', { x1: 6, y1: axisY, x2: 314, y2: axisY, stroke: '#8b8271', 'stroke-width': 1 });
        el(svg, 'path', { d: `M ${lensX} 20 Q ${lensX + 12} ${axisY} ${lensX} 120 Q ${lensX - 12} ${axisY} ${lensX} 20 Z`, fill: 'rgba(76,129,191,.12)', stroke: '#4c81bf', 'stroke-width': 1.6 });
        [[F1, 'F'], [F2, "F′"]].forEach(([x, l]) => { el(svg, 'circle', { cx: x, cy: axisY, r: 2.6, fill: '#b7791f' }); el(svg, 'text', { x, y: axisY + 15, 'font-size': 9.5, fill: '#b7791f', 'text-anchor': 'middle' }, l); });
        el(svg, 'line', { x1: oX, y1: axisY, x2: oX, y2: oTop, stroke: '#b91c1c', 'stroke-width': 2.4 });
        el(svg, 'polygon', { points: `${oX - 4},${oTop} ${oX + 4},${oTop} ${oX},${oTop - 6}`, fill: '#b91c1c' });
        // 平行光（青）
        el(svg, 'line', { x1: oX, y1: oTop, x2: lensX, y2: oTop, stroke: '#0f766e', 'stroke-width': 1.6 });
        el(svg, 'line', { x1: lensX, y1: oTop, x2: 300, y2: axisY + (axisY - oTop) * (300 - lensX) / (F2 - lensX), stroke: '#0f766e', 'stroke-width': 1.6 });
        // 过光心（蓝）
        const slopeB = (axisY - oTop) / (lensX - oX);
        el(svg, 'line', { x1: oX, y1: oTop, x2: 300, y2: oTop + slopeB * (300 - oX), stroke: '#4c51bf', 'stroke-width': 1.6 });
        // 过焦点 F（琥珀）→ 折射后平行
        const yAtLens = oTop + (axisY - oTop) * (lensX - oX) / (F1 - oX) * -1 + (axisY - oTop);
        // 直接用几何：入射过 F1，斜率 = (oTop-axisY)/(oX-F1)
        const sC = (oTop - axisY) / (oX - F1); const yC = oTop + sC * (lensX - oX);
        el(svg, 'line', { x1: oX, y1: oTop, x2: lensX, y2: yC, stroke: '#b7791f', 'stroke-width': 1.6 });
        el(svg, 'line', { x1: lensX, y1: yC, x2: 300, y2: yC, stroke: '#b7791f', 'stroke-width': 1.6 });
        el(svg, 'text', { x: 160, y: 134, 'font-size': 10, fill: '#8b8271', 'text-anchor': 'middle' }, '三条光线交于一点 = 像的位置');
      }
      draw();
    })();

    /* ============ ② 光路沙盒（旗舰） ============ */
    (function benchLab() {
      let bench, m1 = false, m2 = false, m3 = false, everBeyond2f = false, tableShown = false;
      const CM = window.OpticsKit.CM;
      const TASKS = [
        ['找到"等大分界"：拖蜡烛，让光屏上接到和蜡烛<b>一样大</b>的清晰像', false],
        ['体会"物近像远"：把蜡烛从远处往里推（进入 F、2F 之间），看像变大、光屏要往外退', false],
        ['推进焦点以内（u&lt;f）：看看光屏还接不接得到像', false]
      ];
      function drawTasks() {
        $('p5-tasks').innerHTML = TASKS.map((t, i) =>
          `<div class="taskline${t[1] ? ' done' : ''}"><span class="tk">${t[1] ? '✅' : (i + 1)}</span><span>${t[0]}</span></div>`).join('');
      }
      drawTasks();

      bench = window.OpticsKit.bench($('p5-benchsvg'), {
        f: 7, u: 20, objH: 2.6, screen: true, screenU: 15, nameImage: false,
        onChange: st => {
          // 读数（不泄结论词）
          let r = `物距 u = <b>${round(st.u * CM)}</b> cm`;
          if (st.nearFocus) r += ' ｜ 光屏上一片模糊，怎么也接不到清晰像';
          else if (st.real) r += ` ｜ 像距 v = <b>${round(st.v * CM)}</b> cm（光屏能接到）`;
          else r += ' ｜ 光屏这侧接不到清晰像（把眼睛凑到透镜后面看看）';
          $('p5-readout').innerHTML = r;

          if (st.region === 'u>2f') everBeyond2f = true;
          const screenNear = bench && st.real && Math.abs(bench.screenU - st.v) < 1.3;
          // 里程碑①：u=2f 且光屏接到等大像
          if (!m1 && st.region === 'u=2f' && screenNear) {
            m1 = true; TASKS[0][1] = true; drawTasks(); Y.ev('act:p5.equalsize');
            $('p5-benchmsg').innerHTML = '<div class="explain">🎯 <b>u = 2f</b>！物距正好等于二倍焦距时，成的是<b>等大</b>的像——这是"放大"和"缩小"的分界线。往里推会放大，往外拉会缩小。</div>';
          }
          // 里程碑②：从 2f 外推进到 f~2f，实像放大
          if (!m2 && everBeyond2f && st.real && st.region === 'f<u<2f') {
            m2 = true; TASKS[1][1] = true; drawTasks(); Y.ev('act:p5.dynamic');
            $('p5-benchmsg').innerHTML = '<div class="explain">📈 看到没：蜡烛越往里推（物距变小），像跑得越远、还越<b>大</b>——光屏得往外退才接得清。口诀：<b>物近像远像变大</b>（成实像时都这样）。这正是投影仪工作的那一段。</div>';
          }
          // 里程碑③：推进焦点内
          if (!m3 && st.region === 'u<f') {
            m3 = true; TASKS[2][1] = true; drawTasks(); Y.ev('act:p5.virtual');
            $('p5-benchmsg').innerHTML = '<div class="explain">🔍 光屏接不到了！焦点以内，折射光线不再真的会聚——它们发散开，只有<b>反向延长线</b>（虚线）在透镜同侧交出一个<b>正立、放大</b>的像。这种接不到、只能用眼看的像叫<b>虚像</b>，这就是放大镜。</div>';
            revealTable();
          }
        }
      });

      $('p5-f').addEventListener('input', e => bench.setF(+e.target.value));
      $('p5-screen').addEventListener('change', e => bench.setScreen(e.target.checked));
      $('p5-benchreset').addEventListener('click', () => { bench.setF(7); $('p5-f').value = 7; bench.setScreenU(15); bench.setU(20); });

      $('p5-benchguess').appendChild(Y.guess({
        q: '先猜：把蜡烛从很远处慢慢推近凸透镜（还在焦点外），光屏上的像会怎么变？', options: ['越来越大，屏要往外退', '越来越小，屏往里挪', '大小不变'], answer: 0,
        reveal: '拖蜡烛验证——从 2F 外往里推，像变大、像距变大（物近像远像变大）。'
      }));

      /* ---- 规律通关表 ---- */
      const ROWS = [
        { r: 'u &gt; 2f（物体很远）', dz: '倒立', sz: '缩小', sx: '实像' },
        { r: 'u = 2f', dz: '倒立', sz: '等大', sx: '实像' },
        { r: 'f &lt; u &lt; 2f', dz: '倒立', sz: '放大', sx: '实像' },
        { r: 'u = f（在焦点上）', dz: '不成像', sz: '—', sx: '—' },
        { r: 'u &lt; f（焦点以内）', dz: '正立', sz: '放大', sx: '虚像' }
      ];
      const OPT = { dz: ['—', '倒立', '正立', '不成像'], sz: ['—', '放大', '缩小', '等大'], sx: ['—', '实像', '虚像'] };
      const rowDone = {};
      function revealTable() {
        if (tableShown) return; tableShown = true;
        $('p5-tablewrap').hidden = false;
        $('p5-tablebox').innerHTML = `<table class="fill lens"><tr><th>物距</th><th>正/倒</th><th>大/小</th><th>虚/实</th></tr>` +
          ROWS.map((row, i) => `<tr><td>${row.r}</td>` +
            ['dz', 'sz', 'sx'].map(k => `<td><select class="blank" data-i="${i}" data-k="${k}">${OPT[k].map(o => `<option>${o}</option>`).join('')}</select></td>`).join('') +
            `<td id="p5-rm-${i}"></td></tr>`).join('') + `</table>`;
        $('p5-tablebox').querySelectorAll('select').forEach(s => s.addEventListener('change', () => {
          const i = +s.dataset.i;
          const get = k => $('p5-tablebox').querySelector(`select[data-i="${i}"][data-k="${k}"]`).value;
          const ok = get('dz') === ROWS[i].dz && get('sz') === ROWS[i].sz && get('sx') === ROWS[i].sx;
          $('p5-rm-' + i).innerHTML = ok ? '<b style="color:var(--ok)">✓</b>' : (get('dz') !== '—' ? '<b style="color:var(--bad)">再看看</b>' : '');
          if (ok) { rowDone[i] = true; s.closest('tr').classList.add('litrow'); }
          if (Object.keys(rowDone).length === 5) {
            $('p5-tablemsg').innerHTML = '<div class="stdline">🏆 <b>通关！</b>两句总纲替你收尾：<b>一倍焦距分虚实</b>（u&gt;f 成实像、u&lt;f 成虚像）；<b>二倍焦距分大小</b>（u&gt;2f 缩小、u&lt;2f 放大）。记住这两句，五种情况随手就能推。</div>';
            Y.ev('act:p5.table');
            showChallenge();
          }
        }));
      }
      function showChallenge() {
        const box = $('p5-challenge'); box.hidden = false;
        box.innerHTML = `<hr class="divider"><h3>🎓 反推挑战</h3>
          <p class="small">有人用这个凸透镜，在光屏上得到了一个<b>倒立、缩小</b>的清晰像。蜡烛（物体）在哪个区间？</p>
          <div class="chips" id="p5-chopts">
            ${['u > 2f', 'u = 2f', 'f < u < 2f', 'u < f'].map((o, i) => `<button class="chip" data-i="${i}">${o}</button>`).join('')}
          </div><p class="small" id="p5-chmsg"></p>`;
        box.querySelector('#p5-chopts').addEventListener('click', e => {
          const b = e.target.closest('.chip'); if (!b) return;
          const ok = +b.dataset.i === 0;
          box.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad')); b.classList.add(ok ? 'on' : 'bad');
          $('p5-chmsg').innerHTML = ok
            ? '<b style="color:var(--ok)">对！</b>倒立缩小实像 → 屏在 f~2f 之间、物在 2F 之外（u&gt;2f）——正是照相机。'
            : '<b style="color:var(--bad)">再想想：</b>缩小的实像，靠"二倍焦距分大小"——缩小说明 u 在 2f 之外。（点别的再试）';
          if (ok) Y.ev('act:p5.challenge');
        });
      }
    })();

    /* ============ ③ 挡半透镜 ============ */
    (function halfLab() {
      const svg = $('p5-halfsvg'); let blocked = false;
      const axisY = 95, lensX = 150, tip = [40, 45], img = [255, 135];  // 物在轴上方，像在轴下方（倒立）
      function draw() {
        svg.innerHTML = '';
        el(svg, 'line', { x1: 8, y1: axisY, x2: 292, y2: axisY, stroke: '#8b8271', 'stroke-width': 1 });
        el(svg, 'path', { d: `M ${lensX} 35 Q ${lensX + 12} ${axisY} ${lensX} 155 Q ${lensX - 12} ${axisY} ${lensX} 35 Z`, fill: 'rgba(76,129,191,.12)', stroke: '#4c81bf', 'stroke-width': 1.6 });
        // 物
        el(svg, 'line', { x1: tip[0], y1: axisY, x2: tip[0], y2: tip[1], stroke: '#b91c1c', 'stroke-width': 2.6 });
        el(svg, 'polygon', { points: `${tip[0] - 4},${tip[1]} ${tip[0] + 4},${tip[1]} ${tip[0]},${tip[1] - 6}`, fill: '#b91c1c' });
        // 一大束光线：从烛焰顶点打到透镜各处，再会聚到像点
        const lensYs = [40, 55, 70, 85, 95, 105, 120, 135, 150];
        lensYs.forEach(ly => {
          const isLower = ly > axisY;
          if (blocked && isLower) return;                       // 挡下半 → 下半光线没了
          el(svg, 'line', { x1: tip[0], y1: tip[1], x2: lensX, y2: ly, stroke: '#0f766e', 'stroke-width': .8, opacity: .55 });
          el(svg, 'line', { x1: lensX, y1: ly, x2: img[0], y2: img[1], stroke: '#0f766e', 'stroke-width': .8, opacity: .55 });
        });
        if (blocked) el(svg, 'rect', { x: lensX - 13, y: axisY, width: 26, height: 122, fill: 'rgba(60,60,60,.55)' });
        // 像（挡后变暗）
        const op = blocked ? .45 : 1;
        el(svg, 'line', { x1: img[0], y1: axisY, x2: img[0], y2: img[1], stroke: '#b91c1c', 'stroke-width': 3, opacity: op });
        el(svg, 'polygon', { points: `${img[0] - 4},${img[1]} ${img[0] + 4},${img[1]} ${img[0]},${img[1] + 6}`, fill: '#b91c1c', opacity: op });
        el(svg, 'text', { x: img[0], y: axisY - 6, 'font-size': 10, fill: '#b91c1c', 'text-anchor': 'middle' }, blocked ? '像还在，只是变暗' : '完整的像');
      }
      $('p5-halfbtn').addEventListener('click', () => {
        blocked = !blocked; $('p5-halfbtn').textContent = blocked ? '🖐️ 放开（恢复）' : '🖐️ 挡住透镜下半';
        draw();
        $('p5-halfcap').innerHTML = blocked
          ? '挡掉下半，剩下的上半光线<b>依旧会聚到同一个像点</b>——像是完整的，只是参与的光线少了一半，所以<b>变暗</b>了。'
          : '完整时，烛焰上一点发出无数条光线，穿过透镜各处后<b>都会聚到同一个像点</b>。';
        if (blocked) Y.ev('act:p5.half');
      });
      $('p5-halfguess').appendChild(Y.guess({
        q: '先猜：用手挡住凸透镜的下半部分，光屏上的像会怎样？', options: ['缺下面一半', '缺上面一半', '完整，但变暗', '完全消失'], answer: 2,
        reveal: '点"挡住透镜下半"看——像不缺角，只是暗了。',
        onDone: () => { $('p5-halfmsg').innerHTML = '<div class="explain">关键在于：<b>一个像点，是千万条光线共同凑出来的</b>。挡掉一半光线，凑份子的人少了一半，"礼"还是那个礼（像完整），只是薄了（变暗）。所以"一条光线成一个点"是错的。</div>'; }
      }));
      draw();
    })();

    /* ============ ④ 眼睛模拟器 ============ */
    (function eyeLab() {
      const svg = $('p5-eyesvg'); let mode = 'normal', lens = 'none';
      // 眼球：角膜+晶状体在左（x≈120），视网膜在右（x≈250）。平行光经眼球会聚，正常眼恰落视网膜。
      function focusX() {
        // 基准会聚点
        let base = 250;                       // 正常眼：落在视网膜
        if (mode === 'myopia') base = 218;    // 近视：眼轴偏长/晶状体偏强 → 像落在视网膜"前"
        if (mode === 'hyper') base = 282;     // 远视：像落在视网膜"后"
        if (lens === 'concave') base += 32;   // 凹镜先发散 → 会聚点后移
        if (lens === 'convex') base -= 32;    // 凸镜再会聚 → 会聚点前移
        return base;
      }
      function draw() {
        svg.innerHTML = '';
        const axisY = 90, eyeX = 130, retX = 250;
        // 眼球
        el(svg, 'ellipse', { cx: 185, cy: axisY, rx: 62, ry: 52, fill: 'rgba(76,129,191,.06)', stroke: '#8b8271', 'stroke-width': 1.4 });
        el(svg, 'path', { d: `M ${eyeX} ${axisY - 34} Q ${eyeX - 12} ${axisY} ${eyeX} ${axisY + 34}`, fill: 'none', stroke: '#4c81bf', 'stroke-width': 2 }); // 角膜
        el(svg, 'ellipse', { cx: eyeX + 8, cy: axisY, rx: 7, ry: 24, fill: 'rgba(76,81,191,.18)', stroke: '#4c51bf', 'stroke-width': 1.4 }); // 晶状体
        el(svg, 'path', { d: `M ${retX} ${axisY - 40} A 52 52 0 0 1 ${retX} ${axisY + 40}`, fill: 'none', stroke: '#b91c1c', 'stroke-width': 2.4 }); // 视网膜
        el(svg, 'text', { x: retX + 4, y: axisY - 40, 'font-size': 9.5, fill: '#b91c1c' }, '视网膜');
        // 矫正镜片
        if (lens !== 'none') {
          const gx = 78;
          if (lens === 'convex') el(svg, 'path', { d: `M ${gx} ${axisY - 30} Q ${gx + 9} ${axisY} ${gx} ${axisY + 30} Q ${gx - 9} ${axisY} ${gx} ${axisY - 30} Z`, fill: 'rgba(15,118,110,.14)', stroke: '#0f766e', 'stroke-width': 1.6 });
          else el(svg, 'path', { d: `M ${gx - 6} ${axisY - 30} Q ${gx + 2} ${axisY} ${gx - 6} ${axisY + 30} L ${gx + 6} ${axisY + 30} Q ${gx - 2} ${axisY} ${gx + 6} ${axisY - 30} Z`, fill: 'rgba(15,118,110,.14)', stroke: '#0f766e', 'stroke-width': 1.6 });
          el(svg, 'text', { x: gx, y: axisY + 44, 'font-size': 9.5, fill: '#0f766e', 'text-anchor': 'middle' }, lens === 'convex' ? '凸透镜' : '凹透镜');
        }
        // 平行入射光（远处物体）两条
        const fx = focusX();
        [axisY - 18, axisY + 18].forEach(y => {
          el(svg, 'line', { x1: 10, y1: y, x2: eyeX + 8, y2: y, stroke: '#b7791f', 'stroke-width': 1.4 });
          el(svg, 'line', { x1: eyeX + 8, y1: y, x2: fx, y2: axisY, stroke: '#b7791f', 'stroke-width': 1.4 });
          if (fx < retX - 2) el(svg, 'line', { x1: fx, y1: axisY, x2: retX, y2: axisY + (axisY - y) * (retX - fx) / (fx - eyeX - 8) * -1, stroke: '#b7791f', 'stroke-width': .8, opacity: .4 });
        });
        el(svg, 'circle', { cx: fx, cy: axisY, r: 3, fill: fx > retX - 3 && fx < retX + 3 ? '#15803d' : '#b91c1c' });
        const onRet = Math.abs(fx - retX) < 4;
        let cap;
        if (onRet) cap = '<b style="color:var(--ok)">✓ 光会聚在视网膜上 —— 看得清！</b>';
        else if (fx < retX) cap = '会聚点落在视网膜<b>前面</b>（像还没到视网膜就聚齐了）→ 看远处模糊。';
        else cap = '会聚点落在视网膜<b>后面</b>（到视网膜还没聚齐）→ 看近处模糊。';
        $('p5-eyecap').innerHTML = cap;
        // 证据：选对矫正镜片使像回到视网膜
        if (onRet && ((mode === 'myopia' && lens === 'concave') || (mode === 'hyper' && lens === 'convex'))) {
          Y.ev('act:p5.eye');
          $('p5-eyemsg').innerHTML = `<div class="explain">✅ ${mode === 'myopia' ? '<b>近视</b>的像落在视网膜前，配<b>凹透镜</b>：光先发散一点，会聚点后移，正好落回视网膜。' : '<b>远视</b>的像落在视网膜后，配<b>凸透镜</b>：光先多会聚一点，会聚点前移，落回视网膜。'} 你鼻梁上那副眼镜，干的就是这件事。</div>`;
        }
      }
      $('p5-eyemode').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p5-eyemode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); mode = b.dataset.m; draw(); });
      $('p5-eyelens').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p5-eyelens').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); lens = b.dataset.l; draw(); });
      $('p5-eyeguess').appendChild(Y.guess({
        q: '先猜：近视眼看远处，像落在视网膜前面。要把像"拉回"视网膜，该戴哪种透镜？', options: ['凹透镜（先发散）', '凸透镜（再会聚）', '戴哪种都行'], answer: 0,
        reveal: '切到"近视眼"，再逐个试"戴凹/戴凸"——凹透镜先发散，会聚点后移到视网膜上。'
      }));
      draw();
    })();

    /* ============ ⑤ 生活透镜连连看 ============ */
    (function lifeLab() {
      const DEV = [
        { name: '📷 照相机', region: 'u > 2f', img: '倒立缩小实像' },
        { name: '📽️ 投影仪', region: 'f < u < 2f', img: '倒立放大实像' },
        { name: '🔍 放大镜', region: 'u < f', img: '正立放大虚像' }
      ];
      const REG = ['—', 'u > 2f', 'f < u < 2f', 'u < f'];
      const IMG = ['—', '倒立缩小实像', '倒立放大实像', '正立放大虚像'];
      const done = {};
      $('p5-liferows').innerHTML = DEV.map((d, i) =>
        `<div class="liferow"><b>${d.name}</b>
          <select class="blank" data-i="${i}" data-k="region">${REG.map(o => `<option>${o}</option>`).join('')}</select>
          <select class="blank" data-i="${i}" data-k="img">${IMG.map(o => `<option>${o}</option>`).join('')}</select>
          <span id="p5-lm-${i}"></span></div>`).join('');
      $('p5-liferows').querySelectorAll('select').forEach(s => s.addEventListener('change', () => {
        const i = +s.dataset.i;
        const reg = $('p5-liferows').querySelector(`select[data-i="${i}"][data-k="region"]`).value;
        const img = $('p5-liferows').querySelector(`select[data-i="${i}"][data-k="img"]`).value;
        const ok = reg === DEV[i].region && img === DEV[i].img;
        $('p5-lm-' + i).innerHTML = (reg !== '—' && img !== '—') ? (ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">再配配</b>') : '';
        if (ok) done[i] = true;
        if (Object.keys(done).length === 3) { $('p5-lifemsg').innerHTML = '<div class="stdline">全对！同一片凸透镜，物距落在不同段，就成了照相机、投影仪、放大镜。<b>投影仪的胶片要倒插</b>，因为它成的是倒立的像，倒插才能在屏上正过来。</div>'; Y.ev('act:p5.life'); }
      }));
    })();

    /* ============ 讲透卡 ============ */
    const FIGrays = () => `<svg viewBox="0 0 300 130" style="max-width:300px">
      <line x1="6" y1="66" x2="294" y2="66" stroke="#8b8271" stroke-width="1"/>
      <path d="M150 20 Q162 66 150 112 Q138 66 150 20 Z" fill="rgba(76,129,191,.12)" stroke="#4c81bf" stroke-width="1.5"/>
      <circle cx="90" cy="66" r="2.4" fill="#b7791f"/><text x="90" y="80" font-size="9" fill="#b7791f" text-anchor="middle">F</text>
      <circle cx="210" cy="66" r="2.4" fill="#b7791f"/><text x="210" y="80" font-size="9" fill="#b7791f" text-anchor="middle">F′</text>
      <line x1="40" y1="34" x2="40" y2="66" stroke="#b91c1c" stroke-width="2"/><polygon points="36,34 44,34 40,28" fill="#b91c1c"/>
      <line x1="40" y1="34" x2="150" y2="34" stroke="#0f766e" stroke-width="1.5"/><line x1="150" y1="34" x2="270" y2="90" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="40" y1="34" x2="270" y2="86" stroke="#4c51bf" stroke-width="1.5"/>
      <line x1="40" y1="34" x2="150" y2="90" stroke="#b7791f" stroke-width="1.5"/><line x1="150" y1="90" x2="270" y2="90" stroke="#b7791f" stroke-width="1.5"/>
      <text x="150" y="124" font-size="9.5" fill="#8b8271" text-anchor="middle">①平行→过F′　②过光心→直走　③过F→平行</text></svg>`;
    const FIGtable = () => `<svg viewBox="0 0 300 128" style="max-width:300px">
      <text x="150" y="14" font-size="10.5" font-weight="700" fill="#27231b" text-anchor="middle">一倍焦距分虚实 · 二倍焦距分大小</text>
      <line x1="20" y1="70" x2="280" y2="70" stroke="#57503f" stroke-width="1.3"/>
      ${[['F', 110], ['2F', 180]].map(([l, x]) => `<line x1="${x}" y1="64" x2="${x}" y2="76" stroke="#b7791f" stroke-width="1.4"/><text x="${x}" y="90" font-size="10" fill="#b7791f" text-anchor="middle">${l}</text>`).join('')}
      <text x="65" y="44" font-size="9.5" fill="#0f766e" text-anchor="middle">u&gt;2f</text><text x="65" y="56" font-size="9" fill="#8b8271" text-anchor="middle">倒立缩小实</text>
      <text x="145" y="44" font-size="9.5" fill="#0f766e" text-anchor="middle">f&lt;u&lt;2f</text><text x="145" y="56" font-size="9" fill="#8b8271" text-anchor="middle">倒立放大实</text>
      <text x="235" y="44" font-size="9.5" fill="#b91c1c" text-anchor="middle">u&lt;f</text><text x="235" y="56" font-size="9" fill="#8b8271" text-anchor="middle">正立放大虚</text>
      <text x="110" y="104" font-size="8.5" fill="#8b8271" text-anchor="middle">照相机</text>
      <text x="145" y="116" font-size="8.5" fill="#8b8271" text-anchor="middle">投影仪</text>
      <text x="235" y="104" font-size="8.5" fill="#8b8271" text-anchor="middle">放大镜</text></svg>`;
    const FIGeye = () => `<svg viewBox="0 0 300 120" style="max-width:300px">
      <ellipse cx="150" cy="60" rx="52" ry="44" fill="rgba(76,129,191,.06)" stroke="#8b8271" stroke-width="1.3"/>
      <ellipse cx="104" cy="60" rx="6" ry="20" fill="rgba(76,81,191,.18)" stroke="#4c51bf" stroke-width="1.3"/>
      <path d="M202 26 A44 44 0 0 1 202 94" fill="none" stroke="#b91c1c" stroke-width="2"/>
      <text x="150" y="14" font-size="10" fill="#27231b" text-anchor="middle">正常：像落在视网膜上</text>
      <line x1="20" y1="48" x2="104" y2="48" stroke="#b7791f" stroke-width="1.2"/><line x1="104" y1="48" x2="202" y2="60" stroke="#b7791f" stroke-width="1.2"/>
      <line x1="20" y1="72" x2="104" y2="72" stroke="#b7791f" stroke-width="1.2"/><line x1="104" y1="72" x2="202" y2="60" stroke="#b7791f" stroke-width="1.2"/>
      <text x="150" y="112" font-size="9" fill="#8b8271" text-anchor="middle">近视→像落前方，配凹镜；远视→像落后方，配凸镜</text></svg>`;

    window.ExplainKit.cards($('p5-cardlist'), [
      { emoji: '🔎', title: '凸透镜与凹透镜 · 会聚与发散', rule: '凸透镜中间厚，对光<b>会聚</b>；凹透镜中间薄，对光<b>发散</b>。平行光经凸透镜会聚到的那个点＝焦点 F，焦点到光心的距离＝焦距 f。',
        steps: [{ t: '凸透镜（放大镜、照相机镜头）', r: '会聚' }, { t: '凹透镜（近视镜片）', r: '发散', key: true }],
        trap: '焦距 f 是"焦点到透镜"的距离，不是"透镜到像"的距离——F、2F 是透镜的固有刻度，和物体放哪无关。' },
      { emoji: '📐', title: '三条特殊光线（作图规范）', rule: '画凸透镜成像，用这三条"听话"的光线，任取两条的交点就是像。', fig: FIGrays,
        steps: [{ t: '平行于主光轴的光线', r: '折射后过另一侧焦点 F′' }, { t: '过光心 O 的光线', r: '传播方向不变' }, { t: '过焦点 F 的光线', r: '折射后平行于主光轴', key: true }],
        trap: '光线要画箭头、实像用实线、虚像的光线用虚线反向延长——作图题最爱在这些规范上扣分。' },
      { emoji: '🕯️', title: '凸透镜成像规律（背下这张表）', rule: '两句总纲：<b>一倍焦距分虚实</b>（u&gt;f 实像、u&lt;f 虚像）；<b>二倍焦距分大小</b>（u&gt;2f 缩小、u&lt;2f 放大）。', fig: FIGtable,
        steps: [{ t: 'u>2f → 倒立缩小实像', r: '照相机' }, { t: 'f<u<2f → 倒立放大实像', r: '投影仪' }, { t: 'u<f → 正立放大虚像', r: '放大镜', key: true }],
        trap: 'u=2f 是等大分界、u=f 不成像——这两个边界最爱考，别漏。实像都倒立、虚像都正立。' },
      { emoji: '📈', title: '动态规律 · 物近像远像变大', rule: '成<b>实像</b>时：物体靠近透镜（u 变小），像会远离透镜（v 变大）、并且变大。',
        steps: [{ t: '物近 → 像远', r: '光屏要往外退' }, { t: '物近 → 像变大', r: '照相机拉近拍大就是这样', key: true }],
        trap: '这条只对实像成立（u>f）。到了虚像段（放大镜，u<f）：物离得越近，像反而越小。' },
      { emoji: '👻', title: '实像与虚像', rule: '实像：光线<b>真的会聚</b>而成，能用光屏承接，倒立（照相机、投影仪）。虚像：光线并未会聚，是<b>反向延长线</b>相交，光屏接不到、只能用眼看，正立（放大镜、平面镜）。',
        steps: [{ t: '能用光屏接到 → 实像', r: '倒立' }, { t: '屏上接不到、只能看 → 虚像', r: '正立', key: true }],
        trap: '"看得到就是实像"是错的——放大镜里放大的字是虚像，你看得到却接不到屏上。' },
      { emoji: '👁️', title: '眼睛与近视、远视', rule: '眼睛＝一个焦距可调的凸透镜（晶状体），把像成在视网膜上。看近看远靠睫状肌改变晶状体厚度（变焦）。', fig: FIGeye,
        steps: [{ t: '近视：像落在视网膜前', r: '配凹透镜（先发散）' }, { t: '远视：像落在视网膜后', r: '配凸透镜（先会聚）', key: true }],
        trap: '别记反：近视是"看远模糊"、配<b>凹</b>镜（度数带负号）；远视/老花配<b>凸</b>镜。' },
      { emoji: '📷', title: '生活中的透镜', rule: '照相机（u>2f，倒立缩小实像）、投影仪（f<u<2f，倒立放大实像、胶片倒插）、放大镜（u<f，正立放大虚像）——同一片凸透镜的三种用法。',
        steps: [{ t: '要"缩小"记录 → 物体放远', r: '照相机' }, { t: '要"放大"投墙 → 物体放 f~2f', r: '投影仪' }, { t: '要"放大"看清 → 物体放焦内', r: '放大镜', key: true }],
        trap: '手机摄像头是超短焦凸透镜，靠镜片组微调对焦，不"拉风箱"；但成像原理一样是 u>2f 的缩小实像。' },
      { emoji: '🔭', title: '望远镜与显微镜（初步）', rule: '两个凸透镜组合：望远镜看远（物镜长焦+目镜短焦，开普勒式成倒像）；显微镜看微小（两次放大）。',
        why: '天文望远镜看到的像是倒着的——这很正常，天上的星星无所谓上下。本章的跨学科实践就是用两个放大镜自制一个望远镜，去维也纳的天文台看看。' }
    ]);

    /* ============ 自测 ============ */
    function bestLine() { const b = Y.quizBest('p5'); $('p5-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; }
    bestLine();
    $('p5-quizgo').addEventListener('click', () => {
      $('p5-quizgo').style.display = 'none';
      Y.quizStart($('p5-quizbox'), 'p5', () => { $('p5-quizgo').style.display = ''; $('p5-quizgo').textContent = '再测一次'; bestLine(); });
    });

    /* ============ 望远镜 DIY 任务卡 ============ */
    (function teleLab() {
      const box = $('p5-telebox');
      const ITEMS = [
        ['🛒', 'tl-buy', '备两片放大镜', '一欧店/文具店买两个放大镜：一个大而扁（长焦，做<b>物镜</b>），一个小而鼓（短焦，做<b>目镜</b>）。'],
        ['🔭', 'tl-make', '前后对齐看远处', '两镜前后放在一条线上，一边看远处（窗外教堂尖顶），一边前后移动目镜，直到看清——你做出了开普勒式望远镜。'],
        ['🙃', 'tl-invert', '发现像是倒的', '看到的像是<b>倒立</b>的（正常！天文望远镜都这样）。想成正像？换一片凹透镜做目镜＝伽利略式。'],
        ['⭐', 'tl-obs', '去天文台（可选）', '维也纳 Urania 天文台、Kuffner 天文台可买观测夜票——用真望远镜看看月亮和土星环。']
      ];
      const t = Y.taskGet('p5.telescope');
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
          Y.taskSet('p5.telescope', { data: state, done: doneCnt >= 2 });
          if (doneCnt >= 2) Y.ev('act:p5.telescope');
          if (now) Y.toast('🔭 望远镜任务 +1', true);
        });
        body.appendChild(row);
      });
      box.appendChild(window.TaskKit.card({
        emoji: '🔭', title: '自制望远镜（跨学科实践）',
        desc: '两片放大镜就能拼出望远镜。夏天在维也纳做好、拍下来——10 月这一章上线时，你的照片会出现在这里。完成 2 项即算过关。',
        done: t.done, body,
        onToggle: v => Y.taskSet('p5.telescope', { done: v })
      }));
    })();

    return { cleanup() {} };
  }
};
