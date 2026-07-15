/* p1s2 · 1.2 运动的描述 —— 节页：相对静止的应用场景 + "选参照物→比位置→下结论"三步快练。
   章页已有：参照物"谁在动"。这里把相对性用到考试爱考的场景里。 */
window.YJS_SECTIONS = window.YJS_SECTIONS || {};

window.YJS_SECTIONS.p1s2 = {
  mod: 'p1', sec: 's2', emoji: '🚩',
  title: '1.2 运动的描述', sub: '相对静止 · 三步判断',
  nodeIds: ['p1-n11'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);

    root.innerHTML = `
      <section>
        <div class="card phys">
          <p class="small"><b>本节考点自查</b>：</p>
          <div id="s2-ckl"></div>
          <p class="hint">"你现在动没动"这个问题在章页（谁在动）玩过了。这一节把它变成考试题型：相对静止的应用 + 快速判断的固定套路。</p>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">✈️</span>相对静止 · 考试最爱的四个场景</div>
        <div class="split">
          <div class="card"><div id="s2-scenes"></div></div>
          <div class="card"><div id="s2-scmsg"><p class="hint">四个场景各答一问。它们考的其实是同一件事。</p></div></div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🎯</span>三步判断快练 · 五连</div>
        <div class="split">
          <div class="card">
            <p class="pwbig" id="s2-drill" style="font-size:18px"></p>
            <div class="chips" style="justify-content:center">
              <button class="chip" data-v="move">运动</button>
              <button class="chip" data-v="still">静止</button>
            </div>
            <p class="small center">已答 <b id="s2-dn">0</b> · 连对 <b id="s2-dstreak">0</b> / 5</p>
          </div>
          <div class="card"><div id="s2-dmsg"><p class="hint">每题都按同一个套路来——套路是什么，五连之后揭晓。</p></div></div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧪</span>节练习 · 8 题（基础 6 + 提高 2）</div>
        <div class="card">
          <p class="hint" id="s2-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="s2-quizgo">开始</button></div>
          <div id="s2-quizbox"></div>
        </div>
      </section>
    `;

    /* ---- 考点清单 ---- */
    const ckl = Y.checklist($('s2-ckl'), [
      { t: '参照物与运动的相对性（章页·谁在动）', keys: ['act:p1.ref'] },
      { t: '相对静止的应用场景（加油机 / 同步卫星 / 交接棒）', keys: ['act:p1.relstill'] },
      { t: '三步判断成套路（选参照物 → 比位置 → 下结论）', keys: ['act:p1.refdrill'] },
      { t: '节练习：诗句题与双车相对运动题拿下', keys: ['q:p1s2q1', 'q:p1s2q8'] }
    ]);

    /* ---- 场景集 ---- */
    const SCENES = [
      { s: '🛫 空中加油：受油机紧贴加油机飞行。要想成功对接，受油机相对加油机应保持——', o: ['相对静止（速度大小方向都一样）', '比加油机快一点', '比加油机慢一点'], a: 0, note: '两机同速同向 → 相对静止，油管才接得稳。它们相对地面可都是几百 km/h。' },
      { s: '🛰️ 地球同步卫星，为什么叫"同步"？因为它相对地面——', o: ['静止（跟着地球一起转）', '高速运动', '时快时慢'], a: 0, note: '卫星绕地一圈的时间 = 地球自转一圈，所以永远悬在同一片地面上空——相对地面静止，锅盖天线才不用追着它转。' },
      { s: '🏃 接力赛交棒瞬间，两名运动员最好——', o: ['速度接近，相对静止', '后面的人停下递', '前面的人回头接'], a: 0, note: '两人速度接近 → 相对静止，棒像"递给站着的人"一样稳。这是相对静止最生活化的用法。' },
      { s: '🛗 你乘全景观光电梯上升。以电梯为参照物，对面的大楼在——', o: ['向下运动', '静止', '向上运动'], a: 0, note: '以电梯为参照物，楼的位置不断"往下退"——运动是相对的，换个参照物结论就换。' }
    ];
    let scDone = 0;
    const scBox = $('s2-scenes');
    SCENES.forEach((sc, i) => {
      const d = document.createElement('div'); d.style.cssText = 'padding:8px 0;border-bottom:1px dashed var(--line)';
      d.innerHTML = `<p class="small">${sc.s}</p><div class="chips">${sc.o.map((o, k) => `<button class="chip" data-k="${k}">${o}</button>`).join('')}</div><p class="small" id="s2-scn-${i}"></p>`;
      d.querySelector('.chips').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        const ok = +b.dataset.k === sc.a;
        d.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
        b.classList.add(ok ? 'on' : 'bad');
        $(`s2-scn-${i}`).innerHTML = ok ? '<span style="color:var(--ok)">✓ ' + sc.note + '</span>' : '<span style="color:var(--bad)">再想想——关键是"相对谁"。</span>';
        if (ok && !d.dataset.got) { d.dataset.got = 1; scDone++; }
        if (scDone === 4) { $('s2-scmsg').innerHTML = '<div class="explain">四个场景一个理：<b>"动没动"永远是"相对谁"的问题。</b>相对静止不是不动，是"跟着一起动"——加油、对接、交棒，全靠它。</div>'; Y.ev('act:p1.relstill'); }
      });
      scBox.appendChild(d);
    });

    /* ---- 三步快练 ---- */
    const DRILL = [
      { s: '顺水漂流的木筏，以<b>河岸</b>为参照物，木筏是——', v: 'move' },
      { s: '木筏上坐着的人，以<b>木筏</b>为参照物，人是——', v: 'still' },
      { s: '岸边的树，以<b>木筏</b>为参照物，树是——', v: 'move' },
      { s: '并排同速行驶的两辆车，以<b>对方</b>为参照物，各自是——', v: 'still' },
      { s: '你走在路上，以<b>地面</b>为参照物，你是——', v: 'move' }
    ];
    let di = 0, dStreak = 0, dN = 0;
    const showDrill = () => { $('s2-drill').innerHTML = DRILL[di % DRILL.length].s; };
    showDrill();
    root.querySelectorAll('#s2-drill ~ .chips .chip').forEach(btn => btn.addEventListener('click', () => {
      const d = DRILL[di % DRILL.length], ok = btn.dataset.v === d.v;
      dN++; dStreak = ok ? dStreak + 1 : 0;
      $('s2-dn').textContent = dN; $('s2-dstreak').textContent = dStreak;
      if (dStreak >= 5) {
        $('s2-dmsg').innerHTML = '<div class="stdline">五连成！你已经在无意识地走同一个套路：<b>① 圈出参照物 → ② 看研究对象相对它位置变没变 → ③ 变=运动，不变=静止</b>。考试题不管怎么绕，都是这三步。</div>';
        Y.ev('act:p1.refdrill');
      } else {
        $('s2-dmsg').innerHTML = ok ? '<p class="small" style="color:var(--ok)">✓ 对。下一题。</p>' : '<p class="small" style="color:var(--bad)">断了——先圈出"以谁为参照物"，再看位置变没变。重新连。</p>';
      }
      di++; setTimeout(showDrill, 350);
    }));

    /* ---- 节练习 ---- */
    const bestLine = () => { const b = Y.quizBest('p1s2'); $('s2-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; };
    bestLine();
    $('s2-quizgo').addEventListener('click', () => {
      $('s2-quizgo').style.display = 'none';
      Y.quizStart($('s2-quizbox'), 'p1s2', () => { $('s2-quizgo').style.display = ''; $('s2-quizgo').textContent = '再练一次'; bestLine(); });
    });

    return { cleanup() { ckl.stop(); } };
  }
};
