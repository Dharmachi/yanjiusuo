/* p1s4 · 1.4 速度的测量 —— 节页：把章页"玩过"的斜面小车实验，升级成考试要的完整实验报告。
   数据设计（经典）：全程 1.20m/3.0s → 0.4；上半程 0.60m/2.0s → 0.3；下半程 = 差值法 → 0.6（不是 0.5！）。 */
window.YJS_SECTIONS = window.YJS_SECTIONS || {};

window.YJS_SECTIONS.p1s4 = {
  mod: 'p1', sec: 's4', emoji: '⏱️',
  title: '1.4 速度的测量', sub: '实验报告 · 六段答法',
  nodeIds: ['p1-n14'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);

    root.innerHTML = `
      <section>
        <div class="card phys">
          <p class="small"><b>本节考点自查</b>：</p>
          <div id="s4-ckl"></div>
          <p class="hint">斜面小车在章页玩过"现象"了——这里按考卷的实验探究题格式，把整份报告自己写一遍。六段一段一段解锁。</p>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧾</span>实验报告 · 测量小车的平均速度</div>
        <div id="s4-report"></div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧪</span>节练习 · 6 题（实验题型）</div>
        <div class="card">
          <p class="hint" id="s4-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="s4-quizgo">开始</button></div>
          <div id="s4-quizbox"></div>
        </div>
      </section>
    `;

    /* ---- 考点清单 ---- */
    const ckl = Y.checklist($('s4-ckl'), [
      { t: '实验原理与器材（刻度尺 + 停表是测量主角）', keys: ['act:p1.slopereport'] },
      { t: '斜面实验玩过现象（章页·斜面实验）', keys: ['act:p1.slope'] },
      { t: '节练习：下半程速度差值法拿下', keys: ['q:p1s4q3'] },
      { t: '节练习：误差方向题拿下', keys: ['q:p1s4q4'] }
    ]);

    /* ---- 实验报告 ---- */
    window.ReportKit.run($('s4-report'), {
      title: '测量小车沿斜面下滑的平均速度',
      aim: '用刻度尺和停表，测出小车全程、上半程、下半程的平均速度，看看它是不是匀速下滑。',
      principle: {
        q: '本实验依据的原理是——',
        options: ['v = s / t（测出路程和时间，算速度）', 's = v t（用速度算路程）', '二力平衡', '光的反射定律'],
        answer: 0
      },
      gear: {
        items: [
          { name: '斜面（木板）', need: true }, { name: '小车', need: true }, { name: '刻度尺', need: true },
          { name: '停表', need: true }, { name: '金属片（挡板）', need: true }, { name: '木块（垫斜面）', need: true },
          { name: '天平', need: false }, { name: '弹簧测力计', need: false }, { name: '量筒', need: false }, { name: '温度计', need: false }
        ],
        hint: '测速度只要"路程"和"时间"两样——<b>刻度尺量 s，停表计 t</b>，其余器材都是搭台子的。天平量筒是测质量体积的，这里用不上。'
      },
      steps: {
        items: [
          '用木块把斜面垫成较小的坡度，固定好',
          '用刻度尺量出全程路程 s₁，在起点、终点做标记',
          '小车从顶端由静止释放，同时按下停表开始计时',
          '小车撞上底端金属片的瞬间停止计时，记下 t₁',
          '把金属片移到中点，重复测出上半程的 s₂ 和 t₂'
        ]
      },
      table: {
        cols: ['路段', '路程 s', '时间 t', '平均速度 v'],
        rows: [
          ['全程', '1.20 m', '3.0 s', { input: { answer: 0.4, tol: 0.02, unit: 'm/s' } }],
          ['上半程', '0.60 m', '2.0 s', { input: { answer: 0.3, tol: 0.02, unit: 'm/s' } }],
          ['下半程（算出来）', '0.60 m', { input: { answer: 1.0, tol: 0.05, unit: 's' } }, { input: { answer: 0.6, tol: 0.02, unit: 'm/s' } }]
        ]
      },
      conclusion: [
        { pre: '比较三段速度：小车沿斜面下滑时做', options: ['越来越快的（加速）', '匀速的', '越来越慢的（减速）'], answer: 0, post: '直线运动；' },
        { pre: '下半程的平均速度', options: ['大于', '等于', '小于'], answer: 0, post: '上半程的平均速度。' },
        { pre: '底端放金属片，是为了', options: ['让小车停在同一位置，便于准确测时间', '增大摩擦保护小车', '让实验更好看'], answer: 0, post: '' }
      ],
      errors: [
        { q: '如果小车过了起点才开始计时，测出的平均速度会——', options: ['偏大', '偏小', '不变'], answer: 0, note: '计时晚了 → 测得的 t 偏小 → v = s/t 里分母小了 → v 偏大。' },
        { q: '斜面的坡度不宜太大，是因为——', options: ['坡太陡小车下滑太快，时间太短、不容易测准', '坡太陡不安全', '坡太陡小车会翻车'], answer: 0, note: '本实验最大的误差来源是"人按停表的反应"——时间越长越好测，所以坡度要小、让小车慢点跑。' }
      ],
      onDone: () => Y.ev('act:p1.slopereport')
    });

    /* ---- 节练习 ---- */
    const bestLine = () => { const b = Y.quizBest('p1s4'); $('s4-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; };
    bestLine();
    $('s4-quizgo').addEventListener('click', () => {
      $('s4-quizgo').style.display = 'none';
      Y.quizStart($('s4-quizbox'), 'p1s4', () => { $('s4-quizgo').style.display = ''; $('s4-quizgo').textContent = '再练一次'; bestLine(); });
    });

    return { cleanup() { ckl.stop(); } };
  }
};
