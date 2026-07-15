/* m13s1 · 13.1 三角形的概念 —— 节页：按边/按角双轴分类（等边⊂等腰的陷阱）+ 第三角速判。
   数学红线：等边三角形是特殊的等腰三角形；三角形按角的类型由"最大的角"决定；最多一个直角/一个钝角。 */
window.YJS_SECTIONS = window.YJS_SECTIONS || {};

window.YJS_SECTIONS.m13s1 = {
  mod: 'm13', sec: 's1', emoji: '🔺',
  title: '13.1 三角形的概念', sub: '双轴分类 · 第三角速判',
  nodeIds: ['m13-n9', 'm13-n10'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);

    root.innerHTML = `
      <section>
        <div class="card math">
          <p class="small"><b>本节考点自查</b>（做过对应练习自动打勾）：</p>
          <div id="ms1-ckl"></div>
          <p class="hint">三角形长什么样你早知道——这一节考试考的是<b>分类的精确</b>："等边算不算等腰？""最多几个钝角？"这类一字之差的题。</p>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🗂️</span>分类判官 · 一个三角形，两个户口</div>
        <div class="split">
          <div class="card"><div id="ms1-clsbox"></div></div>
          <div class="card">
            <div id="ms1-clsmsg"><p class="hint">每个三角形要上两个户口：<b>按角</b>一个、<b>按边</b>一个。五个案子，都判对才结案。选"最准确"的那类。</p></div>
          </div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🎯</span>第三角速判 · 算出它，再定性</div>
        <div class="split">
          <div class="card">
            <p class="pwbig" id="ms1-taq" style="font-size:19px"></p>
            <div class="numrow"><span class="small">第三个角 =</span><input class="numin" id="ms1-tain" type="text" inputmode="numeric" style="width:80px"><span class="unitfix">°</span></div>
            <p class="small">这个三角形按角分类，是——</p>
            <div class="chips" id="ms1-tatype">
              <button class="chip" data-t="acute">锐角三角形</button>
              <button class="chip" data-t="right">直角三角形</button>
              <button class="chip" data-t="obtuse">钝角三角形</button>
            </div>
            <div class="btnrow"><button class="btn primary" id="ms1-tago">判定</button></div>
            <p class="small" id="ms1-tamsg"></p>
            <p class="small center">连对 <b id="ms1-tastreak">0</b> / 3</p>
          </div>
          <div class="card">
            <div id="ms1-taguess"></div>
            <div id="ms1-tanote"></div>
          </div>
        </div>
      </section>

      <section>
        <div class="sec-title"><span class="em">🧪</span>节练习 · 8 题（基础 6 + 提高 2）</div>
        <div class="card">
          <p class="hint" id="ms1-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="ms1-quizgo">开始</button></div>
          <div id="ms1-quizbox"></div>
        </div>
      </section>
    `;

    /* ---- 考点清单 ---- */
    const ckl = Y.checklist($('ms1-ckl'), [
      { t: '按角、按边双轴分类（等边是特殊的等腰）', keys: ['act:m13.classify'] },
      { t: '第三角速算 + 由最大角定类型', keys: ['act:m13.thirdangle'] },
      { t: '最多一个直角、最多一个钝角（内角和撑不下第二个）', keys: ['q:m13s1q5'] },
      { t: '节练习：比例角与直角三角形性质拿下', keys: ['q:m13s1q6', 'q:m13s1q8'] }
    ]);

    /* ---- 分类判官 ---- */
    const CASES = [
      { s: '三个角都是 60°', ang: 0, side: 2, note: '三角都 60° → 三边也相等：按角是锐角三角形，按边是等边三角形。' },
      { s: '两条边相等，其中一个角是 100°', ang: 2, side: 1, note: '有 100° 的钝角 → 钝角三角形；两边相等 → 等腰三角形。' },
      { s: '∠C = 90°，三条边各不相等', ang: 1, side: 0, note: '有直角 → 直角三角形；三边互不相等 → 不等边三角形。' },
      { s: '三边都是 6 cm', ang: 0, side: 2, note: '等边三角形每个角都是 60° —— 所以等边一定是锐角三角形。' },
      { s: '两条边相等，它们的夹角是 90°', ang: 1, side: 1, note: '这是"等腰直角三角形"：按角直角、按边等腰。两个户口都要报对。' }
    ];
    const ANG = ['锐角三角形', '直角三角形', '钝角三角形'];
    const SIDE = ['不等边三角形', '等腰三角形', '等边三角形'];
    let clsDone = 0;
    const clsBox = $('ms1-clsbox');
    CASES.forEach((c, i) => {
      const d = document.createElement('div'); d.style.cssText = 'padding:9px 0;border-bottom:1px dashed var(--line)';
      d.innerHTML = `<p class="small"><b>案 ${i + 1}：</b>${c.s}</p>
        <div class="chips" data-x="ang">${ANG.map((o, k) => `<button class="chip" data-k="${k}">${o}</button>`).join('')}</div>
        <div class="chips" data-x="side" style="margin-top:4px">${SIDE.map((o, k) => `<button class="chip" data-k="${k}">${o}</button>`).join('')}</div>
        <p class="small" id="ms1-cn-${i}"></p>`;
      const pick = { ang: null, side: null };
      d.querySelectorAll('.chips').forEach(ch => ch.addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b || d.dataset.got) return;
        const axis = ch.dataset.x; pick[axis] = +b.dataset.k;
        ch.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); b.classList.add('on');
        if (pick.ang == null || pick.side == null) return;
        const okA = pick.ang === c.ang, okS = pick.side === c.side;
        if (okA && okS) {
          d.dataset.got = 1; clsDone++;
          $(`ms1-cn-${i}`).innerHTML = '<span style="color:var(--ok)">✓ ' + c.note + '</span>';
          if (clsDone === 5) { $('ms1-clsmsg').innerHTML = '<div class="stdline">五案全结。两条容易翻车的：<b>等边三角形是特殊的等腰三角形</b>（说"等腰"不算错，但"等边"更准确）；<b>等边三角形一定是锐角三角形</b>（每角 60°）。分类的每一格都要拿"定义"去卡。</div>'; Y.ev('act:m13.classify'); }
        } else {
          $(`ms1-cn-${i}`).innerHTML = `<span style="color:var(--bad)">${!okA ? '按角的户口不对——盯住最大的那个角。' : ''}${!okS ? '按边的户口再想想——有没有"更准确"的类？' : ''}（重选即可）</span>`;
        }
      }));
      clsBox.appendChild(d);
    });

    /* ---- 第三角速判 ---- */
    $('ms1-taguess').appendChild(Y.guess({
      q: '先猜：一个三角形里，<b>最多</b>能有几个钝角？', options: ['1 个', '2 个', '3 个'], answer: 0,
      reveal: '两个钝角加起来就超过 180° 了，内角和装不下——所以钝角最多 1 个，直角同理也最多 1 个。',
      onDone: () => { $('ms1-tanote').innerHTML = '<div class="explain">判类型的口诀：<b>算出第三角后，盯住三个角里最大的</b>——最大角是钝角→钝角三角形；是直角→直角三角形；连最大角都小于 90°→锐角三角形。</div>'; newTA(); }
    }));
    let ta = null, taStreak = 0;
    function newTA() {
      const pool = [[30, 40], [80, 60], [45, 45], [25, 35], [70, 50], [15, 60], [65, 25], [50, 40]];
      ta = pool[Math.floor(Math.random() * pool.length)];
      $('ms1-taq').innerHTML = `△ 中两个角是 <b>${ta[0]}°</b> 和 <b>${ta[1]}°</b>`;
      $('ms1-tain').value = '';
      $('ms1-tatype').querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
      $('ms1-tamsg').innerHTML = '';
    }
    let taPick = null;
    $('ms1-tatype').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('ms1-tatype').querySelectorAll('.chip').forEach(c => c.classList.remove('on')); b.classList.add('on'); taPick = b.dataset.t; });
    $('ms1-tago').addEventListener('click', () => {
      if (!ta) { $('ms1-tamsg').innerHTML = '<span style="color:var(--warn)">先答左下的先猜。</span>'; return; }
      const third = 180 - ta[0] - ta[1];
      const maxA = Math.max(ta[0], ta[1], third);
      const type = maxA > 90 ? 'obtuse' : maxA === 90 ? 'right' : 'acute';
      const v = parseInt($('ms1-tain').value, 10);
      if (isNaN(v) || !taPick) { $('ms1-tamsg').innerHTML = '<span style="color:var(--warn)">角度和类型都要填。</span>'; return; }
      if (v === third && taPick === type) {
        taStreak++; $('ms1-tastreak').textContent = taStreak;
        if (taStreak >= 3) { $('ms1-tamsg').innerHTML = '<b style="color:var(--ok)">✓ 三连对——速判到手。</b>'; Y.ev('act:m13.thirdangle'); }
        else $('ms1-tamsg').innerHTML = '<b style="color:var(--ok)">✓ 对。再来。</b>';
        newTA();
      } else {
        taStreak = 0; $('ms1-tastreak').textContent = 0;
        $('ms1-tamsg').innerHTML = `<b style="color:var(--bad)">不对。</b>第三角 = 180 − ${ta[0]} − ${ta[1]} = <b>${third}°</b>；最大角是 ${maxA}° → ${maxA > 90 ? '钝角' : maxA === 90 ? '直角' : '锐角'}三角形。注意：<b>定类型看的是最大角，不一定是第三角。</b>`;
        newTA();
      }
    });

    /* ---- 节练习 ---- */
    const bestLine = () => { const b = Y.quizBest('m13s1'); $('ms1-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; };
    bestLine();
    $('ms1-quizgo').addEventListener('click', () => {
      $('ms1-quizgo').style.display = 'none';
      Y.quizStart($('ms1-quizbox'), 'm13s1', () => { $('ms1-quizgo').style.display = ''; $('ms1-quizgo').textContent = '再练一次'; bestLine(); });
    });

    return { cleanup() { ckl.stop(); } };
  }
};
