/* m13s3 · 13.3 内角与外角 · 多边形 —— 节页：角度推理三步链（calc-kit 数学首用：依据→代入→结果）+ 多边形公式四连。
   数学红线：外角=不相邻两内角之和；直角三角形两锐角互余；内角和 (n−2)·180°；外角和恒 360°；
   正 n 边形每外角 360/n；对角线 n(n−3)/2；内角和 1440°→n=10；每内角 150°→n=12。 */
window.YJS_SECTIONS = window.YJS_SECTIONS || {};

window.YJS_SECTIONS.m13s3 = {
  mod: 'm13', sec: 's3', emoji: '🔷',
  title: '13.3 内角与外角 · 多边形', sub: '推理三步链 · 公式速算',
  nodeIds: ['m13-n13', 'm13-n14'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);

    root.innerHTML = `
      <section>
        <div class="card math">
          <p class="small"><b>本节考点自查</b>：</p>
          <div id="ms3-ckl"></div>
          <p class="hint">内角和为什么是 180°、外角和为什么恒 360°，章页都证过/走过了。这一节把它们变成拿分动作：<b>写依据的推理格式</b> + <b>公式速算</b>。</p>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧮</span>角度推理三步链 · 每一步都写"依据"</div>
        <div class="card">
          <p class="small">几何计算和物理一样认"格式"：<b>先写依据（定理），再代入，再出结果</b>。三道题，最容易糊弄的就是第一步。</p>
          <div id="ms3-chain"></div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">⬡</span>多边形公式速算 · 四连</div>
        <div class="split">
          <div class="card">
            <div id="ms3-pfguess"></div>
            <div id="ms3-pftrain" hidden>
              <p class="pwbig" id="ms3-pfq" style="font-size:18px"></p>
              <div class="numrow"><input class="numin" id="ms3-pfin" type="text" inputmode="numeric" style="width:90px"><span class="unitfix" id="ms3-pfu"></span><button class="btn primary" id="ms3-pfgo">判定</button></div>
              <p class="small" id="ms3-pfmsg"></p>
              <p class="small center">进度 <b id="ms3-pfn">0</b> / 4</p>
            </div>
            <p class="hint" id="ms3-pfhint">先答左边的先猜，速算才开门。</p>
          </div>
          <div class="card">
            <div class="explain" style="line-height:2">四个公式一张卡：<br>
              内角和 = <b>(n − 2) × 180°</b><br>
              外角和 = <b>永远 360°</b>（与边数无关）<br>
              正 n 边形每个外角 = <b>360° ÷ n</b><br>
              对角线条数 = <b>n(n − 3) ÷ 2</b></p>
          </div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧪</span>节练习 · 10 题（基础 6 + 提高 4）</div>
        <div class="card">
          <p class="hint" id="ms3-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="ms3-quizgo">开始</button></div>
          <div id="ms3-quizbox"></div>
        </div>
      </section>
    `;

    /* ---- 考点清单 ---- */
    const ckl = Y.checklist($('ms3-ckl'), [
      { t: '内角和 180°·自己证过（章页·内角证明）', keys: ['act:m13.proof'] },
      { t: '角度推理三步链（依据 → 代入 → 结果）', keys: ['act:m13.anglechain'] },
      { t: '多边形四公式速算过关', keys: ['act:m13.polyformula'] },
      { t: '节练习：反推边数与 8 字模型拿下', keys: ['q:m13s3q6', 'q:m13s3q9'] }
    ]);

    /* ---- 角度推理三步链（calc-kit 数学首用） ---- */
    window.CalcKit.train($('ms3-chain'), {
      problems: [
        {
          stem: '△ABC 中，∠A = 35°，∠B = 65°。延长 BC 到点 D，求外角 ∠ACD。',
          formula: { options: ['∠ACD = ∠A + ∠B（外角等于不相邻两内角之和）', '∠ACD = ∠A + ∠ACB', '∠ACD = 90° + ∠A'], answer: 0 },
          sub: { options: ['∠ACD = 35° + 65°', '∠ACD = 35° + 80°', '∠ACD = 180° − 35°'], answer: 0 },
          result: { answer: 100, tol: 0.1, unit: '°' },
          model: '解：∠ACD = ∠A + ∠B（三角形的外角等于与它不相邻的两个内角的和）\n     = 35° + 65°\n     = 100°',
          note: '外角性质是"内角和 180°"的快捷方式——不用先算 ∠ACB 再用 180° 去减。<b>依据那一行必须写</b>，这是几何题的"单位"。'
        },
        {
          stem: '直角三角形中，一个锐角是 37°，求另一个锐角。',
          formula: { options: ['两锐角互余（和为 90°）', '两锐角互补（和为 180°）', '两锐角相等'], answer: 0 },
          sub: { options: ['另一锐角 = 90° − 37°', '另一锐角 = 180° − 37°', '另一锐角 = 37°'], answer: 0 },
          result: { answer: 53, tol: 0.1, unit: '°' },
          model: '解：直角三角形两锐角互余\n     另一锐角 = 90° − 37°\n     = 53°',
          note: '"互余"= 和为 90°，"互补"= 和为 180°——一字之差。直角占掉 90°，剩下 90° 归两个锐角分。'
        },
        {
          stem: '一个多边形的内角和是 1440°，它是几边形？',
          formula: { options: ['(n − 2) × 180° = 1440°', 'n × 180° = 1440°', '(n + 2) × 180° = 1440°'], answer: 0 },
          sub: { options: ['n − 2 = 1440 ÷ 180 = 8', 'n = 1440 ÷ 180 = 8', 'n − 2 = 1440 ÷ 360 = 4'], answer: 0 },
          result: { answer: 10, tol: 0.01, unit: '边形' },
          model: '解：设它是 n 边形，(n − 2) × 180° = 1440°\n     n − 2 = 8\n     n = 10，是十边形',
          note: '反推题最大的坑：算出 8 就交卷——8 是 <b>n−2</b>，还要 +2！设未知数、列方程、解到底。'
        }
      ],
      onAllDone: () => Y.ev('act:m13.anglechain')
    });

    /* ---- 多边形速算四连 ---- */
    $('ms3-pfguess').appendChild(Y.guess({
      q: '先猜：正三角形的外角和，与正十二边形的外角和，谁大？', options: ['一样大（都是 360°）', '十二边形的大', '三角形的大'], answer: 0,
      reveal: '不管几边形，绕场一周总共就转 360°——外角和与边数无关，恒 360°。这是章页"绕场一周"亲手走出来的结论。',
      onDone: () => { $('ms3-pftrain').hidden = false; $('ms3-pfhint').hidden = true; nextPF(); }
    }));
    const PF = [
      { q: '七边形的内角和是多少度？', a: 900, u: '°', note: '(7−2)×180 = 900°' },
      { q: '正八边形的每个<b>外角</b>是多少度？', a: 45, u: '°', note: '360 ÷ 8 = 45°' },
      { q: '正十二边形的每个<b>内角</b>是多少度？', a: 150, u: '°', note: '外角 360÷12=30°，内角 = 180−30 = 150°（比 (n−2)·180/n 好算）' },
      { q: '十边形共有多少条对角线？', a: 35, u: '条', note: 'n(n−3)/2 = 10×7÷2 = 35' }
    ];
    let pfi = 0;
    function nextPF() {
      if (pfi >= PF.length) return;
      $('ms3-pfq').innerHTML = PF[pfi].q;
      $('ms3-pfu').textContent = PF[pfi].u;
      $('ms3-pfin').value = ''; $('ms3-pfmsg').innerHTML = '';
    }
    $('ms3-pfgo').addEventListener('click', () => {
      if (pfi >= PF.length) return;
      const v = parseFloat($('ms3-pfin').value);
      if (isNaN(v)) return;
      if (Math.abs(v - PF[pfi].a) < 0.01) {
        $('ms3-pfmsg').innerHTML = `<b style="color:var(--ok)">✓ ${PF[pfi].note}</b>`;
        pfi++; $('ms3-pfn').textContent = pfi;
        if (pfi >= PF.length) { $('ms3-pfq').innerHTML = '🏁 四连全对——四个公式随取随用。'; Y.ev('act:m13.polyformula'); }
        else setTimeout(nextPF, 900);
      } else {
        $('ms3-pfmsg').innerHTML = `<b style="color:var(--bad)">再算：</b>${PF[pfi].note.split('=')[0]}= ?`;
      }
    });

    /* ---- 节练习 ---- */
    const bestLine = () => { const b = Y.quizBest('m13s3'); $('ms3-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; };
    bestLine();
    $('ms3-quizgo').addEventListener('click', () => {
      $('ms3-quizgo').style.display = 'none';
      Y.quizStart($('ms3-quizbox'), 'm13s3', () => { $('ms3-quizgo').style.display = ''; $('ms3-quizgo').textContent = '再练一次'; bestLine(); });
    });

    return { cleanup() { ckl.stop(); } };
  }
};
