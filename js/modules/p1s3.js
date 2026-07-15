/* p1s3 · 1.3 运动的快慢 —— 节页：m/s↔km/h 换算训练器 + calc-kit 计算格式三步（过桥题、平均速度陷阱）。
   章页已有：s-t/v-t 图像台、跟车挑战。这里补学校真正扣分的两样：换算和计算书写。 */
window.YJS_SECTIONS = window.YJS_SECTIONS || {};

window.YJS_SECTIONS.p1s3 = {
  mod: 'p1', sec: 's3', emoji: '🏎️',
  title: '1.3 运动的快慢', sub: '×3.6 换算 · 计算三步走',
  nodeIds: ['p1-n12', 'p1-n13'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);

    root.innerHTML = `
      <section>
        <div class="card phys">
          <p class="small"><b>本节考点自查</b>：</p>
          <div id="s3-ckl"></div>
          <p class="hint">图像（s-t / v-t）在章页图像台。这里练两样最容易丢分的：单位换算的方向、计算题的书写格式。</p>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🔁</span>m/s ↔ km/h · 换算训练器</div>
        <div class="split">
          <div class="card">
            <div id="s3-cvguess"></div>
            <div id="s3-ladder"></div>
          </div>
          <div class="card">
            <div id="s3-cvtrain" hidden>
              <p class="pwbig" id="s3-cvq" style="font-size:19px"></p>
              <div class="numrow"><input class="numin" id="s3-cvin" type="text" inputmode="decimal" placeholder="填数"><span class="unitfix" id="s3-cvunit"></span><button class="btn primary" id="s3-cvgo">判定</button></div>
              <p class="small" id="s3-cvmsg"></p>
              <p class="small center">连对 <b id="s3-cvstreak">0</b> / 4</p>
            </div>
            <p class="hint" id="s3-cvhint">先答左边的问题，训练器才开门。</p>
          </div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">📝</span>计算三步走 · 公式 → 代入 → 结果</div>
        <div class="card">
          <p class="small">物理计算题，考卷上就认这三行：<b>写公式、带单位代入、得带单位的结果</b>。三道题，每步自己来，最容易丢分的坑都埋在里面。</p>
          <div id="s3-calc"></div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧪</span>节练习 · 10 题（基础 6 + 提高 4）</div>
        <div class="card">
          <p class="hint" id="s3-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="s3-quizgo">开始</button></div>
          <div id="s3-quizbox"></div>
        </div>
      </section>
    `;

    /* ---- 考点清单 ---- */
    const ckl = Y.checklist($('s3-ckl'), [
      { t: 'm/s ↔ km/h 双向换算（×3.6 / ÷3.6）', keys: ['act:p1.convert'] },
      { t: '计算格式三步走（公式 → 带单位代入 → 结果）', keys: ['act:p1.calc'] },
      { t: 's-t / v-t 图像会读（章页·图像台）', keys: ['act:p1.graph'] },
      { t: '节练习：隧道题与平均速度陷阱拿下', keys: ['q:p1s3q6', 'q:p1s3q8'] }
    ]);

    /* ---- 换算训练器 ---- */
    $('s3-cvguess').appendChild(Y.guess({
      q: '先猜：1 m/s 等于多少 km/h？', options: ['3.6 km/h', '0.36 km/h', '36 km/h', '1.6 km/h'], answer: 0,
      reveal: '看下面这架"梯子"怎么爬——每秒 1 米，一小时就是 3600 米，也就是 3.6 千米。',
      onDone: () => {
        $('s3-ladder').innerHTML = `<div class="explain" style="line-height:2">
          1 m/s ＝ 一秒走 1 m<br>＝ 一小时走 3600 m（1h = 3600s）<br>＝ 一小时走 3.6 km ＝ <b>3.6 km/h</b><br>
          <b>口诀：m/s → km/h 乘 3.6；km/h → m/s 除 3.6。</b></div>`;
        $('s3-cvtrain').hidden = false; $('s3-cvhint').hidden = true;
        newConv();
      }
    }));
    const POOL = [
      [15, 'ms2kmh'], [20, 'ms2kmh'], [25, 'ms2kmh'], [10, 'ms2kmh'], [30, 'ms2kmh'],
      [72, 'kmh2ms'], [54, 'kmh2ms'], [108, 'kmh2ms'], [90, 'kmh2ms'], [36, 'kmh2ms']
    ];
    let cur = null, cvStreak = 0;
    function newConv() {
      cur = POOL[Math.floor(Math.random() * POOL.length)];
      const [v, dir] = cur;
      $('s3-cvq').innerHTML = dir === 'ms2kmh' ? `${v} m/s ＝ ？ km/h` : `${v} km/h ＝ ？ m/s`;
      $('s3-cvunit').textContent = dir === 'ms2kmh' ? 'km/h' : 'm/s';
      $('s3-cvin').value = ''; $('s3-cvmsg').innerHTML = '';
    }
    $('s3-cvgo').addEventListener('click', () => {
      if (!cur) return;
      const [v, dir] = cur;
      const ans = dir === 'ms2kmh' ? v * 3.6 : v / 3.6;
      const x = parseFloat(String($('s3-cvin').value).replace(',', '.'));
      if (isNaN(x)) return;
      if (Math.abs(x - ans) <= 0.05) {
        cvStreak++;
        $('s3-cvstreak').textContent = cvStreak;
        if (cvStreak >= 4) { $('s3-cvmsg').innerHTML = '<b style="color:var(--ok)">✓ 四连对，换算过关。</b>顺手记两个常用：72 km/h = 20 m/s、54 km/h = 15 m/s。'; Y.ev('act:p1.convert'); }
        else $('s3-cvmsg').innerHTML = '<b style="color:var(--ok)">✓</b>';
        newConv();
      } else {
        cvStreak = 0; $('s3-cvstreak').textContent = 0;
        $('s3-cvmsg').innerHTML = `<b style="color:var(--bad)">不对，是 ${+ans.toFixed(2)}。</b>方向别反：${dir === 'ms2kmh' ? 'm/s 变 km/h 要 <b>×3.6</b>' : 'km/h 变 m/s 要 <b>÷3.6</b>'}。`;
        newConv();
      }
    });

    /* ---- calc-kit 三题 ---- */
    window.CalcKit.train($('s3-calc'), {
      problems: [
        {
          stem: '城际列车从 A 城开往 B 城，行驶路程 s = 120 km，用时 t = 0.5 h。求列车的平均速度。',
          formula: { options: ['v = s / t', 's = v t', 't = s / v'], answer: 0 },
          sub: { options: ['v = 120 km ÷ 0.5 h', 'v = 0.5 h ÷ 120 km', 'v = 120 ÷ 0.5（不带单位）'], answer: 0 },
          result: { answer: 240, tol: 0.5, unit: 'km/h', units: ['km/h', 'm/s', 'km'] },
          model: '解：v = s / t\n     = 120 km ÷ 0.5 h\n     = 240 km/h',
          note: '三行拿满分：公式一行、代入一行（<b>数字都带单位</b>）、结果一行。不带单位的代入，判卷要扣分。'
        },
        {
          stem: '一列火车长 200 m，以 20 m/s 的速度匀速通过一座长 1600 m 的大桥。求火车<b>完全通过</b>大桥所用的时间。',
          formula: { options: ['t = s / v', 'v = s / t', 's = v t'], answer: 0 },
          sub: { options: ['t = (1600 + 200) m ÷ 20 m/s', 't = 1600 m ÷ 20 m/s', 't = (1600 − 200) m ÷ 20 m/s'], answer: 0 },
          result: { answer: 90, tol: 0.5, unit: 's', units: ['s', 'min', 'm'] },
          model: '解：火车完全通过，走的路程\n     s = 桥长 + 车长 = 1600 m + 200 m = 1800 m\n     t = s / v = 1800 m ÷ 20 m/s = 90 s',
          note: '<b>坑在"完全通过"四个字：</b>从车头上桥到车尾下桥，火车走了"桥长 + 车长"。只算 1600 m 的，全班一半人。'
        },
        {
          stem: '汽车先以 60 km/h 行驶 1 h，接着又用 2 h 走完剩下的 60 km。求全程的平均速度。',
          formula: { options: ['v̄ = s总 / t总', 'v̄ = (v₁ + v₂) / 2', 'v̄ = v₁ + v₂'], answer: 0 },
          sub: { options: ['v̄ = (60 + 60) km ÷ (1 + 2) h', 'v̄ = (60 + 30) km/h ÷ 2', 'v̄ = 60 km ÷ 2 h'], answer: 0 },
          result: { answer: 40, tol: 0.5, unit: 'km/h', units: ['km/h', 'm/s', 'km'] },
          model: '解：s总 = 60 km + 60 km = 120 km\n     t总 = 1 h + 2 h = 3 h\n     v̄ = s总 / t总 = 120 km ÷ 3 h = 40 km/h',
          note: '<b>平均速度 ≠ 速度的平均。</b>把 60 和 30 平均成 45 的，是本章最大陷阱——必须"总路程 ÷ 总时间"。'
        }
      ],
      onAllDone: () => Y.ev('act:p1.calc')
    });

    /* ---- 节练习 ---- */
    const bestLine = () => { const b = Y.quizBest('p1s3'); $('s3-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; };
    bestLine();
    $('s3-quizgo').addEventListener('click', () => {
      $('s3-quizgo').style.display = 'none';
      Y.quizStart($('s3-quizbox'), 'p1s3', () => { $('s3-quizgo').style.display = ''; $('s3-quizgo').textContent = '再练一次'; bestLine(); });
    });

    return { cleanup() { ckl.stop(); } };
  }
};
