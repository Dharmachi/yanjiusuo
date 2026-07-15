/* p2 · 声现象「声学实验室」—— 首发模块。教学流程铁律：先猜 → 动手 → 自述 → 标准表述。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.p2 = {
  id: 'p2', subject: 'phys', emoji: '🎵',
  title: '声现象', subtitle: '声学实验室 · 在音乐之都看见声音',
  wave: 'M1 · 首发',
  nodes: [
    { id: 'p2-n1', label: '声的产生', needs: ['act:p2.t1', 'q:p2q1'] },
    { id: 'p2-n2', label: '传播与介质', needs: ['act:p2.bell', 'q:p2q2'] },
    { id: 'p2-n3', label: '声速与回声', needs: ['act:p2.echo', 'any:q:p2q3|q:p2q4'] },
    { id: 'p2-n4', label: '音调·频率', needs: ['act:p2.t1', 'q:p2q6'] },
    { id: 'p2-n5', label: '响度·振幅', needs: ['act:p2.t2', 'q:p2q5'] },
    { id: 'p2-n6', label: '音色', needs: ['act:p2.t3', 'q:p2q7'] },
    { id: 'p2-n7', label: '声的利用', needs: ['act:p2.table', 'q:p2q8'] },
    { id: 'p2-n8', label: '噪声与分贝', needs: ['act:p2.db1', 'any:q:p2q9|q:p2q10'] }
  ],
  taskIds: ['p2.hausmusik', 'p2.dbmap', 'p2.organ'],

  render(root, Y) {
    const A = window.AudioKit;
    let synth = null, bell = null, micAn = null;
    let waveHandle = null, specHandle = null, meterTimer = null;
    let source = 'synth';               // 'synth' | 'mic'
    let liveDb = null;

    /* ================= 页面骨架 ================= */
    root.innerHTML = `
      <nav class="secnav">
        ${[['p2-intro', '引入'], ['p2-lab', '实验室'], ['p2-db', '分贝计'], ['p2-bell', '真空铃'],
        ['p2-echo', '回声'], ['p2-iso', '隔音'], ['p2-say', '自述'], ['p2-cards', '知识卡'],
        ['p2-quiz', '自测'], ['p2-tasks', '维也纳任务']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="p2-intro">
        <div class="card phys">
          <p class="intro-hook">你现在住在<b>音乐之都</b>——金色大厅、管风琴、街头提琴手都在这座城里。
          但你见过<b>声音本身的样子</b>吗？<br>今天，用你自己的声音，把它画出来。</p>
          <p class="hint">整个实验室 10 分钟就能玩一遍。开学后老师讲"声现象"这一章时，你已经亲手做过所有实验。</p>
          <div class="btnrow"><button class="btn gold big" id="p2-start">▶ 开始实验</button></div>
        </div>
      </section>

      <section id="p2-lab">
        <div class="sec-title"><span class="em">🎹</span>声音实验室</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p2-srcchips">
              <button class="chip on" data-src="synth">🎹 合成器</button>
              <button class="chip" data-src="mic">🎤 我的声音</button>
            </div>
            <div class="canvasbox"><span class="tag" id="p2-wavetag">波形 · 合成器</span><canvas id="p2-wave"></canvas></div>
            <div id="p2-micmsg"></div>
            <div id="p2-synthctl">
              <div class="btnrow"><button class="btn primary" id="p2-play">▶ 播放</button></div>
              <div class="ctl"><label><span id="p2-flab">频率</span><span class="val" id="p2-fv">440 Hz</span></label>
                <input type="range" id="p2-freq" min="120" max="1600" step="1" value="440"></div>
              <div class="ctl"><label><span id="p2-alab">振幅</span><span class="val" id="p2-av">50%</span></label>
                <input type="range" id="p2-amp" min="0" max="1" step="0.01" value="0.5"></div>
              <div class="ctl"><label><span id="p2-wlab">波形</span></label>
                <div class="chips" id="p2-wavesel">
                  <button class="chip on" data-w="sine">圆润（正弦）</button>
                  <button class="chip" data-w="square">硬朗（方波）</button>
                  <button class="chip" data-w="sawtooth">明亮（锯齿）</button>
                </div></div>
            </div>
            <details style="margin-top:8px"><summary class="hint">进阶：频谱视图（一个声音里藏着的所有频率）</summary>
              <div class="canvasbox short" style="margin-top:8px"><canvas id="p2-spec"></canvas></div>
            </details>
          </div>
          <div>
            <div id="p2-taskbox"></div>
            <div class="card" id="p2-tablecard">
              <h3>三特性对照表 <span class="hint">（完成任务解锁，自己填）</span></h3>
              <table class="fill" id="p2-table">
                <tr><th>特性</th><th>由什么决定</th><th>在波形上看</th></tr>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="p2-db">
        <div class="sec-title"><span class="em">📢</span>分贝计 · 维也纳有多吵</div>
        <div class="split">
          <div class="card">
            <div class="dbbig" id="p2-dbnum">--<small> dB</small></div>
            <p class="hint center">iPad 麦克风不是专业仪器，读数做<b>相对比较</b>用。</p>
            <div class="btnrow" style="justify-content:center"><button class="btn primary" id="p2-dbstart">开启分贝计</button></div>
            <div id="p2-dbfallback"></div>
            <div class="dbscale" id="p2-dbscale"></div>
          </div>
          <div class="card">
            <h3>记一笔分贝地图</h3>
            <p class="hint">同一台设备、举同样高：地铁、公园、家里、音乐厅门口……各记一条，凑出你的维也纳声音地图。</p>
            <div class="chips" id="p2-places"></div>
            <div class="btnrow">
              <input class="note" id="p2-dbmanual" type="number" inputmode="numeric" placeholder="没开麦克风时手动填 dB" style="max-width:220px;margin:0">
              <button class="btn gold" id="p2-dbrec">记录这一条</button>
            </div>
            <div class="reclist" id="p2-dbrecs"></div>
          </div>
        </div>
      </section>

      <section id="p2-bell">
        <div class="sec-title"><span class="em">🔔</span>真空铃 · 声音靠什么跑</div>
        <div class="split">
          <div class="card">
            <div class="bellstage"><div class="jar" id="p2-jar"><div class="airfill" id="p2-air"></div><div class="bell">🔔</div></div></div>
            <div class="btnrow" style="justify-content:center"><button class="btn primary" id="p2-bellbtn">🔔 敲铃</button></div>
            <div class="ctl"><label>罩内空气量 <span class="val" id="p2-airv">100%</span></label>
              <input type="range" id="p2-airslider" min="4" max="100" step="1" value="100"></div>
            <p class="hint">慢慢往左拉，模拟抽气机把玻璃罩里的空气抽走。注意听。</p>
          </div>
          <div class="card" id="p2-bellthink"><h3>想一想</h3><p class="hint">先把空气抽到 10% 以下，再回来回答。</p></div>
        </div>
      </section>

      <section id="p2-echo">
        <div class="sec-title"><span class="em">⛰️</span>回声测距 · 用耳朵量距离</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p2-echomode">
              <button class="chip on" data-m="echo">⛰️ 山谷回声</button>
              <button class="chip" data-m="thunder">⛈️ 雷声测距</button>
            </div>
            <div class="stopwatch" id="p2-swatch">0.00 s</div>
            <div class="btnrow" style="justify-content:center"><button class="btn primary big" id="p2-swbtn">开始计时</button></div>
            <p class="hint" id="p2-echotip">对着远处山崖或大楼拍一下手，同时按"开始"；听到回声立刻按"停"。推荐地点：卡伦山观景台、多瑙岛开阔处。</p>
          </div>
          <div>
            <div class="card"><h3>先口算一道</h3>
              <p>对着山崖喊一声，<b>2 秒</b>后听到回声。山崖离你多少米？（声速 340 m/s）</p>
              <div class="btnrow">
                <input class="note" id="p2-echoin" type="number" inputmode="numeric" placeholder="你的答案（米）" style="max-width:170px;margin:0">
                <button class="btn primary" id="p2-echok">交卷</button>
              </div>
              <div id="p2-echogr"></div>
            </div>
            <div class="card"><h3>计算</h3><div id="p2-echoresult"><p class="hint">测一次，这里会展示完整算法。</p></div></div>
          </div>
        </div>
      </section>

      <section id="p2-iso">
        <div class="sec-title"><span class="em">📦</span>隔音实验 · 跨学科实践</div>
        <div class="card">
          <p>教材第 5 节的项目，在家就能做：手机放一首<b>固定音量</b>的歌，扣进盒子；iPad 分贝计放在<b>固定距离</b>（比如 30 cm）。
          每换一种包裹材料测一次，看谁隔音最强。</p>
          <div class="bars" id="p2-isobars"></div>
          <p class="hint">至少测 3 种，柱状图会自己排出"隔音榜"。变量控制的关键：音源、音量、距离全都不变，只换材料。</p>
        </div>
      </section>

      <section id="p2-say">
        <div class="sec-title"><span class="em">✍️</span>规律自述 · 用自己的话说一遍</div>
        <div class="card" id="p2-saycard">
          <p style="font-size:17.5px;line-height:2.2">
            音调由 <select class="blank" id="p2-s1"><option value="">？</option><option>频率</option><option>振幅</option><option>发声体本身</option></select> 决定；
            响度跟 <select class="blank" id="p2-s2"><option value="">？</option><option>频率</option><option>振幅</option><option>发声体本身</option></select> 和到声源的距离有关；
            音色由 <select class="blank" id="p2-s3"><option value="">？</option><option>频率</option><option>振幅</option><option>发声体本身</option></select> 决定。
          </p>
          <div id="p2-sayresult"></div>
        </div>
      </section>

      <section id="p2-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡 <span class="hint">考试要的话，都在这里</span></div>
        <div id="p2-cardlist"></div>
      </section>

      <section id="p2-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card" id="p2-quizcard">
          <p>不是题海——每题都在检查一个具体概念，错了的会自动进<b>错因本</b>。</p>
          <p class="hint" id="p2-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="p2-quizgo">开始自测</button></div>
          <div id="p2-quizbox"></div>
        </div>
      </section>

      <section id="p2-tasks">
        <div class="sec-title"><span class="em">🇦🇹</span>维也纳任务</div>
        <div id="p2-tasklist"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c =>
      c.addEventListener('click', () => {
        const t = document.getElementById(c.dataset.to);
        if (t) t.scrollIntoView({ block: 'start' });
      }));

    /* ================= 合成器与波形 ================= */
    const $ = id => root.querySelector('#' + id);
    const state = { freq: 440, amp: 0.5, wave: 'sine', get playing() { return !!(synth && synth.playing); } };

    function ensureSynth() {
      if (!synth) synth = A.createSynth();
      return synth;
    }
    function startWaveLoop() {
      if (!waveHandle) waveHandle = A.drawWave($('p2-wave'), () => source === 'mic' ? micAn : (synth && synth.analyser));
      if (!specHandle) specHandle = A.drawSpectrum($('p2-spec'), () => source === 'mic' ? micAn : (synth && synth.analyser));
    }

    $('p2-start').addEventListener('click', () => {
      A.ensure();
      ensureSynth().toggle(true);
      $('p2-play').textContent = '⏸ 停止';
      startWaveLoop();
      Y.ev('act:p2.intro');
      $('p2-lab').scrollIntoView({ block: 'start' });
      taskEngine.activate();
    });

    $('p2-play').addEventListener('click', () => {
      const on = ensureSynth().toggle();
      $('p2-play').textContent = on ? '⏸ 停止' : '▶ 播放';
      startWaveLoop();
      taskEngine.poke();
    });

    $('p2-freq').addEventListener('input', e => {
      state.freq = +e.target.value;
      $('p2-fv').textContent = state.freq + ' Hz';
      if (synth) synth.setFreq(state.freq);
      taskEngine.poke();
    });
    $('p2-amp').addEventListener('input', e => {
      state.amp = +e.target.value;
      $('p2-av').textContent = Math.round(state.amp * 100) + '%';
      if (synth) synth.setLevel(state.amp);
      taskEngine.poke();
    });
    $('p2-wavesel').addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $('p2-wavesel').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      state.wave = b.dataset.w;
      if (synth) synth.setWave(state.wave);
      taskEngine.poke();
    });

    /* 声源切换（示波器） */
    $('p2-srcchips').addEventListener('click', async e => {
      const b = e.target.closest('.chip'); if (!b) return;
      const want = b.dataset.src;
      if (want === source) return;
      if (want === 'mic') {
        try {
          micAn = await A.startMic();
          source = 'mic';
          $('p2-micmsg').innerHTML = `<div class="explain">🎤 对着 iPad：<b>唱 do–re–mi</b> 看疏密变化（音调）；<b>轻声 / 大声</b>说同一句话看高矮（响度）；<b>两个人唱同一个音</b>比波形形状（音色）。</div>`;
          $('p2-synthctl').style.display = 'none';
          $('p2-wavetag').textContent = '波形 · 你的声音';
          if (synth) synth.toggle(false), $('p2-play').textContent = '▶ 播放';
          startWaveLoop();
          Y.ev('act:p2.scope');
        } catch (err) {
          $('p2-micmsg').innerHTML = `<div class="explain">🎤 麦克风暂时用不了（${Y.esc(err.message || err.name || '未授权')}）。<br>
          没关系——<b>合成器已经能演示音调、响度、音色的全部规律</b>。想用真声音：确认在 Safari 里打开本页（HTTPS），并允许麦克风权限。</div>`;
          return;
        }
      } else {
        source = 'synth';
        $('p2-synthctl').style.display = '';
        $('p2-micmsg').innerHTML = '';
        $('p2-wavetag').textContent = '波形 · 合成器';
      }
      $('p2-srcchips').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.src === source));
    });

    /* ================= 引导任务（先猜 → 动手 → 作证） ================= */
    const TASKS = [
      { id: 't1', row: 'pitch', title: '让声音变高', text: '让波形变密、声音变高——三个控件里，谁能做到？把效果拉到足够明显。',
        check: (b, s) => s.playing && s.wave === b.wave && Math.abs(s.amp - b.amp) <= 0.3 && s.freq >= b.freq + 250,
        done: '找到了，是<b>频率</b>——振动快、频率大，音调就高（它的标签刚刚点亮了新身份）。对照表第一行已解锁。' },
      { id: 't2', row: 'loud', title: '让声音变响', text: '这次让波形变高、声音变响——又是哪个控件的本事？',
        check: (b, s) => s.playing && s.wave === b.wave && Math.abs(s.freq - b.freq) <= 100 && s.amp >= b.amp + 0.18,
        done: '是<b>振幅</b>——振幅大，响度大。注意疏密没变：音调没被它带跑。' },
      { id: 't3', row: 'timbre', title: '换一种嗓音', text: '高低不动、大小不动，只把声音的"嗓音"换掉——哪个控件是干这个的？',
        check: (b, s) => s.playing && s.wave !== b.wave,
        done: '是<b>波形</b>——高低大小都没变，但"味道"完全不同：波形的形状就是音色。' },
      { id: 't4', title: '组合挑战：又高又轻', text: '调一个"音调很高、响度很小"的声音：频率 ≥ 1000 Hz，响度 ≤ 30%。',
        check: (b, s) => s.playing && s.freq >= 1000 && s.amp <= 0.3,
        done: '高 ≠ 响。音调和响度是两个互不干涉的旋钮——把变量分开研究，这招叫<b>控制变量</b>。' },
      { id: 't5', guess: { q: '先猜：把响度调大，波形会发生什么？', options: ['变高，疏密不变', '变密，高矮不变', '又变高又变密'], answer: 0 },
        title: '验证你的猜想', text: '只动响度滑杆（幅度大一点），眼睛盯住波形的疏密。',
        check: (b, s) => s.playing && Math.abs(s.freq - b.freq) <= 30 && Math.abs(s.amp - b.amp) >= 0.15,
        done: '疏密纹丝不动——响度管不了音调。' },
      { id: 't6', guess: { q: '先猜：换一种波形，频率和响度的读数会怎样？', options: ['频率读数会跟着变', '响度读数会跟着变', '两个读数都不动'], answer: 2 },
        title: '再验证一次', text: '换波形，同时盯住疏密和高矮。',
        check: (b, s) => s.playing && s.wave !== b.wave,
        done: '疏密、高矮都没动——<b>音色是独立的第三个维度</b>。任务全部完成 🎉' }
    ];

    // 控件标签"挣来注释"：完成对应任务后，标签才点亮它决定的特性
    function applyLabels() {
      if (Y.has('act:p2.t1')) $('p2-flab').textContent = '频率（→ 音调 ✓）';
      if (Y.has('act:p2.t2')) $('p2-alab').textContent = '振幅（→ 响度 ✓）';
      if (Y.has('act:p2.t3')) $('p2-wlab').textContent = '波形（→ 音色 ✓）';
    }
    applyLabels();

    const taskEngine = (function () {
      let cur = -1, base = null, guessed = false, active = false;
      const box = $('p2-taskbox');
      function doneSet() { return TASKS.filter(t => Y.has('act:p2.' + t.id)).map(t => t.id); }
      function firstUndone() { return TASKS.findIndex(t => !Y.has('act:p2.' + t.id)); }
      function activate() { active = true; cur = firstUndone(); snap(); renderBox(); }
      function snap() { base = { freq: state.freq, amp: state.amp, wave: state.wave }; guessed = false; }
      function renderBox() {
        const done = doneSet();
        const dots = `<div class="tasklist-mini">${TASKS.map((t, i) =>
          `<span class="tdot ${done.includes(t.id) ? 'done' : (i === cur ? 'cur' : '')}">${done.includes(t.id) ? '✓' : i + 1}</span>`).join('')}</div>`;
        if (cur === -1) {
          box.innerHTML = `<div class="taskbox taskdone">${dots}<b>六个引导任务全部完成。</b><p class="small" style="margin:6px 0 0">去右边把三特性对照表填完，这一节就通了。</p></div>`;
          return;
        }
        const t = TASKS[cur];
        box.innerHTML = `<div class="taskbox">${dots}
          <div class="tno">任务 ${cur + 1} / ${TASKS.length}</div>
          <h3 style="margin:.2em 0">${t.title}</h3>
          <div id="p2-tguess"></div>
          <p id="p2-ttext" style="margin:.4em 0 0">${t.text}</p></div>`;
        if (t.guess && !guessed) {
          $('p2-ttext').style.opacity = .35;
          $('p2-tguess').appendChild(Y.guess({
            q: t.guess.q, options: t.guess.options, answer: t.guess.answer,
            reveal: '动手验证一下就知道了 ↓',
            onDone: () => { guessed = true; $('p2-ttext').style.opacity = 1; }
          }));
        }
      }
      function poke() {
        if (!active || cur === -1) return;
        const t = TASKS[cur];
        if (t.guess && !guessed) return;
        if (t.check(base, state)) {
          Y.ev('act:p2.' + t.id);
          applyLabels();
          if (t.row) renderTable();
          Y.toast('✓ ' + t.title + ' 完成', true);
          const doneHtml = `<div class="explain">${t.done}</div>`;
          cur = firstUndone();
          snap(); renderBox();
          box.insertAdjacentHTML('beforeend', doneHtml);
        }
      }
      return { activate, poke, renderBox };
    })();

    /* ================= 三特性对照表 ================= */
    const ROWS = [
      { key: 'pitch', name: '音调', a: '频率', b: '疏密变化', unlock: 'act:p2.t1' },
      { key: 'loud', name: '响度', a: '振幅', b: '高矮变化', unlock: 'act:p2.t2' },
      { key: 'timbre', name: '音色', a: '发声体本身', b: '形状不同', unlock: 'act:p2.t3' }
    ];
    const OPT_A = ['频率', '振幅', '发声体本身'], OPT_B = ['疏密变化', '高矮变化', '形状不同'];
    function tableState() { return Y.taskGet('p2.table').data || {}; }
    function renderTable() {
      const tb = $('p2-table');
      const st = tableState();
      tb.innerHTML = '<tr><th>特性</th><th>由什么决定</th><th>在波形上看</th></tr>' + ROWS.map(r => {
        const unlocked = Y.has(r.unlock);
        if (!unlocked) return `<tr class="locked"><td>${r.name}</td><td>🔒 完成任务解锁</td><td>🔒</td></tr>`;
        if (st[r.key]) return `<tr class="done"><td><b>${r.name}</b></td><td>${r.a}</td><td>${r.b}</td></tr>`;
        const sel = (opts, slot) =>
          `<select class="blank" data-row="${r.key}" data-slot="${slot}"><option value="">选一选</option>${opts.map(o => `<option>${o}</option>`).join('')}</select>`;
        return `<tr><td><b>${r.name}</b></td><td>${sel(OPT_A, 'a')}</td><td>${sel(OPT_B, 'b')}</td></tr>`;
      }).join('');
      tb.querySelectorAll('select.blank').forEach(s => s.addEventListener('change', onFill));
    }
    function onFill(e) {
      const sel = e.target, row = ROWS.find(r => r.key === sel.dataset.row);
      const other = $('p2-table').querySelector(`select[data-row="${row.key}"][data-slot="${sel.dataset.slot === 'a' ? 'b' : 'a'}"]`);
      const ok = sel.value === (sel.dataset.slot === 'a' ? row.a : row.b);
      sel.classList.toggle('badpick', !ok && sel.value !== '');
      sel.classList.toggle('good', ok);
      if (ok && other && other.classList.contains('good')) {
        const st = tableState(); st[row.key] = true;
        Y.taskSet('p2.table', { data: st });
        renderTable();
        if (ROWS.every(r => st[r.key])) { Y.ev('act:p2.table'); Y.toast('📋 三特性对照表完成——这一节的核心你已经自己总结出来了', true); }
      }
    }
    renderTable();

    /* ================= 分贝计 ================= */
    const SCALE = [['30', '深夜的房间', 22], ['40', '图书馆', 32], ['60', '正常交谈', 50], ['80', '地铁车厢', 68], ['100', '摇滚现场', 85], ['120', '痛觉边缘', 100]];
    $('p2-dbscale').innerHTML = SCALE.map(s =>
      `<div class="row"><span style="width:34px;text-align:right;font-family:ui-monospace,Menlo,monospace"><b>${s[0]}</b></span><span class="bar" style="width:${s[2]}%"></span><span class="hint">${s[1]}</span></div>`).join('');

    $('p2-dbstart').addEventListener('click', async () => {
      try {
        micAn = await A.startMic();
        if (meterTimer) clearInterval(meterTimer);
        meterTimer = setInterval(() => {
          liveDb = A.dbApprox(micAn);
          $('p2-dbnum').innerHTML = liveDb + '<small> dB</small>';
        }, 160);
        $('p2-dbstart').textContent = '分贝计运行中…';
        $('p2-dbstart').disabled = true;
      } catch (err) {
        $('p2-dbfallback').innerHTML = `<div class="explain">麦克风不可用（${Y.esc(err.message || err.name || '未授权')}）——可以先用右边的手动输入记录（用另一台手机上的分贝 App 读数也行）。</div>`;
      }
    });

    const PLACES = ['家里', '教室 / 自习室', '地铁', '公园', '街头', '音乐厅门口', '其他'];
    let curPlace = PLACES[0];
    $('p2-places').innerHTML = PLACES.map((p, i) => `<button class="chip${i === 0 ? ' on' : ''}">${p}</button>`).join('');
    $('p2-places').addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $('p2-places').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      curPlace = b.textContent;
    });
    function dbRecs() { return Y.taskGet('p2.dbmap').data || []; }
    function renderRecs() {
      const recs = dbRecs();
      $('p2-dbrecs').innerHTML = recs.length
        ? recs.map((r, i) => `<div class="rec"><span class="place">${Y.esc(r.place)}</span><span class="db">${r.db} dB</span><span class="hint">${r.when}</span><button class="del" data-i="${i}">✕</button></div>`).join('')
        : '<p class="hint">还没有记录。</p>';
      $('p2-dbrecs').querySelectorAll('.del').forEach(b => b.addEventListener('click', () => {
        const recs2 = dbRecs(); recs2.splice(+b.dataset.i, 1);
        Y.taskSet('p2.dbmap', { data: recs2 }); renderRecs();
      }));
    }
    renderRecs();
    $('p2-dbrec').addEventListener('click', () => {
      const manual = parseInt($('p2-dbmanual').value, 10);
      const db = Number.isFinite(manual) && manual > 0 ? manual : liveDb;
      if (!db) { Y.toast('先开启分贝计，或手动填一个数'); return; }
      const recs = dbRecs();
      recs.unshift({ place: curPlace, db, when: new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) });
      Y.taskSet('p2.dbmap', { data: recs });
      $('p2-dbmanual').value = '';
      renderRecs();
      Y.ev('act:p2.db1');
      const places = new Set(recs.map(r => r.place));
      if (places.size >= 4 && !Y.taskGet('p2.dbmap').done) {
        Y.taskSet('p2.dbmap', { done: true });
        Y.toast('🗺️ 分贝地图凑齐 4 个场所——任务完成！', true);
        renderTasks();
      }
    });

    /* ================= 真空铃 ================= */
    let bellAsked = Y.has('act:p2.bell');
    $('p2-bellbtn').addEventListener('click', () => {
      if (!bell) bell = A.createBell();
      if (bell.on) { bell.stop(); $('p2-jar').classList.remove('ringing'); $('p2-bellbtn').textContent = '🔔 敲铃'; }
      else { bell.start(); $('p2-jar').classList.add('ringing'); $('p2-bellbtn').textContent = '🔕 停'; }
    });
    $('p2-airslider').addEventListener('input', e => {
      const v = +e.target.value;
      $('p2-airv').textContent = v + '%';
      $('p2-air').style.opacity = v / 100;
      if (bell) bell.setAir(v / 100);
      if (v <= 10 && !bellAsked) {
        bellAsked = true;
        const card = $('p2-bellthink');
        card.innerHTML = '<h3>想一想</h3>';
        card.appendChild(Y.guess({
          q: '假如真能把罩子抽到绝对真空（0%），铃声会怎样？',
          options: ['还能传出一点点', '一点也传不出来', '没法下结论——实验根本到不了 0%'],
          answer: 1,
          reveal: '实验确实到不了 0%——但科学有办法：<b>看清趋势，向极限外推</b>。空气越少声越小，推到没有空气，就没有声音。这招叫<b>科学推理</b>（理想实验），你在物理里第一次用它，以后还会常见。',
          onDone: () => { Y.ev('act:p2.bell'); }
        }));
      }
    });

    /* ================= 回声测距 ================= */
    let echoMode = 'echo', swT0 = null, swTimer = null;
    $('p2-echomode').addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      echoMode = b.dataset.m;
      $('p2-echomode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      $('p2-echotip').textContent = echoMode === 'echo'
        ? '对着远处山崖或大楼拍一下手，同时按"开始"；听到回声立刻按"停"。推荐地点：卡伦山观景台、多瑙岛开阔处。'
        : '看到闪电立刻按"开始"，听到雷声按"停"。光几乎瞬间到达，声音才是那个慢吞吞的。';
    });
    $('p2-swbtn').addEventListener('click', () => {
      if (swT0 === null) {
        swT0 = performance.now();
        swTimer = setInterval(() => { $('p2-swatch').textContent = ((performance.now() - swT0) / 1000).toFixed(2) + ' s'; }, 50);
        $('p2-swbtn').textContent = '停！';
      } else {
        clearInterval(swTimer);
        const t = (performance.now() - swT0) / 1000; swT0 = null;
        $('p2-swbtn').textContent = '再测一次';
        showEcho(t);
      }
    });
    function showEcho(t) {
      const ts = t.toFixed(2);
      let html;
      if (t > 12) html = '<p class="hint">超过 12 秒的回声？大概是按晚了，重来一次。</p>';
      else if (echoMode === 'echo') {
        const total = 340 * t, d = total / 2;
        html = `<div class="formula">声音跑的总路程 = 340 m/s × ${ts} s = ${Math.round(total)} m</div>
          <div class="formula"><b>你到山崖的距离 = ${Math.round(total)} ÷ 2 ≈ ${Math.round(d)} m</b></div>
          <p class="hint">为什么除以 2？——声音去了一趟，又回来一趟。这一步是考试最爱挖的坑。</p>`;
      } else {
        const d = 340 * t;
        html = `<div class="formula"><b>雷电离你 ≈ 340 m/s × ${ts} s ≈ ${Math.round(d)} m</b></div>
          <p class="hint">雷声只跑单程，不用除以 2。快速心算：3 秒 ≈ 1 公里。</p>`;
      }
      $('p2-echoresult').innerHTML = html;
      if (t >= 0.15 && t <= 12) { Y.ev('act:p2.echo'); Y.taskSet('p2.echo', { data: { mode: echoMode, t: +ts } }); }
    }

    $('p2-echok').addEventListener('click', () => {
      const v = parseInt($('p2-echoin').value, 10);
      if (!Number.isFinite(v)) { Y.toast('先填一个数'); return; }
      let html;
      if (Math.abs(v - 340) <= 5) html = '<div class="explain">✅ <b>340 米</b>——你避开了本章最大的坑：声音跑的是<b>来回</b>，距离只算单程。</div>';
      else if (Math.abs(v - 680) <= 5) html = '<div class="explain">💥 <b>中招！</b>680 米是声音 2 秒跑的<b>总路程</b>——它去了一趟、又回来一趟。你到山崖只有一半：<b>340 米</b>。考试第一坑，现在踩过就免疫了。</div>';
      else html = '<div class="explain">思路：声音 2 秒共跑 340 × 2 = 680 米，但这是<b>来回</b>的路程——你到山崖是单程，一半：<b>340 米</b>。</div>';
      $('p2-echogr').innerHTML = html;
      $('p2-echok').disabled = true;
    });

    /* ================= 隔音实验 ================= */
    const MATS = ['无遮盖', '毛巾', '报纸团', '锡箔纸', '枕头 / 棉被'];
    function isoData() { return Y.taskGet('p2.insulation').data || {}; }
    function renderIso() {
      const d = isoData();
      const vals = Object.values(d).filter(v => v > 0);
      const max = Math.max(70, ...vals);
      $('p2-isobars').innerHTML = MATS.map(m => {
        const v = d[m];
        return `<div class="brow"><span class="bl">${m}</span>
          <div class="btrack">${v ? `<div class="bfill" style="width:${Math.min(100, v / max * 100)}%">${v} dB</div>` : ''}</div>
          <span class="bact"><input class="note" data-m="${m}" type="number" inputmode="numeric" placeholder="dB" value="${v || ''}" style="width:76px;margin:0;padding:6px 8px">
          <button class="btn" data-read="${m}" style="padding:6px 10px;min-height:36px">取读数</button></span></div>`;
      }).join('');
      $('p2-isobars').querySelectorAll('input.note').forEach(inp => inp.addEventListener('change', () => {
        const d2 = isoData(); const v = parseInt(inp.value, 10);
        if (Number.isFinite(v) && v > 0) d2[inp.dataset.m] = v; else delete d2[inp.dataset.m];
        saveIso(d2);
      }));
      $('p2-isobars').querySelectorAll('[data-read]').forEach(b => b.addEventListener('click', () => {
        if (!liveDb) { Y.toast('先在上面开启分贝计'); return; }
        const d2 = isoData(); d2[b.dataset.read] = liveDb; saveIso(d2);
      }));
    }
    function saveIso(d) {
      const done = Object.keys(d).length >= 3;
      Y.taskSet('p2.insulation', { data: d, done });
      renderIso();
      if (done) Y.toast('📦 隔音榜出炉——开学做这个项目时你已经是老手了', true);
    }
    renderIso();

    /* ================= 规律自述 ================= */
    const SAY = { 'p2-s1': '频率', 'p2-s2': '振幅', 'p2-s3': '发声体本身' };
    Object.keys(SAY).forEach(id => {
      $(id).addEventListener('change', () => {
        const sel = $(id), ok = sel.value === SAY[id];
        sel.classList.toggle('good', ok);
        sel.classList.toggle('badpick', !ok && sel.value !== '');
        if (Object.keys(SAY).every(k => $(k).value === SAY[k])) {
          $('p2-sayresult').innerHTML = `<div class="stdline">标准表述：音调由发声体振动的<b>频率</b>决定；响度与<b>振幅</b>有关，也与到声源的距离有关；音色由<b>发声体的材料和结构</b>决定。</div>`;
          Y.ev('act:p2.selfstate');
          Y.toast('✍️ 这句话你已经能自己说出来了——这就叫学透', true);
        }
      });
    });
    if (Y.has('act:p2.selfstate')) {
      Object.keys(SAY).forEach(id => { $(id).value = SAY[id]; $(id).classList.add('good'); });
      $('p2-sayresult').innerHTML = `<div class="stdline">标准表述：音调由发声体振动的<b>频率</b>决定；响度与<b>振幅</b>有关，也与到声源的距离有关；音色由<b>发声体的材料和结构</b>决定。</div>`;
    }

    /* ================= 知识卡 ================= */
    window.ExplainKit.cards($('p2-cardlist'), [
      { emoji: '🥁', title: '声的产生', rule: '声音是由物体的<b>振动</b>产生的；振动停止，发声停止。',
        steps: [{ t: '摸喉咙说话', r: '指尖的麻 = 声带在振动' }, { t: '音叉触水溅水花', r: '把看不见的振动放大', key: true }],
        trap: '一切正在发声的物体都在振动——"把看不见的振动放大给你看"，这招叫转换法。' },
      { emoji: '🌫️', title: '传播与介质', rule: '声音传播需要<b>介质</b>（气、液、固都行）；<b>真空不能传声</b>。声以声波传播。',
        steps: [{ t: '空气越抽越少', r: '铃声越来越小' }, { t: '外推到没有空气', r: '就没有声音', key: true }],
        trap: '真空铃抽不到绝对真空，靠"越少越小"的趋势外推——这叫科学推理（理想实验）。' },
      { emoji: '🚄', title: '声速', rule: '15℃ 空气中声速约 <b>340 m/s</b>；一般规律：固体 > 液体 > 气体。', eg: '对山喊，2s 后回声',
        steps: [{ t: '声音跑来回 = 340 × 2 = 680 m', r: '' }, { t: '到山崖 = 680 ÷ 2 = 340 m', r: '别忘除以 2！', key: true }],
        trap: '回声测距最大的坑是忘了除以 2——声音去了一趟又回来一趟。' },
      { emoji: '🎼', title: '音调', rule: '音调由发声体振动的<b>频率</b>决定：频率越大，音调越高。单位赫兹（Hz）。', fig: 'wave',
        steps: [{ t: '波形越密 → 频率越大', r: '音调越高' }, { t: '人耳听 20 ~ 20000 Hz', r: '' }],
        trap: '高于 20000 Hz 叫超声波、低于 20 Hz 叫次声波——都存在，只是你听不见。' },
      { emoji: '📣', title: '响度', rule: '响度由振动的<b>振幅</b>决定：振幅越大响度越大；离声源越远越小。',
        steps: [{ t: '波形看"高矮"', r: '= 响度' }, { t: '波形看"疏密"', r: '= 音调，两者互不干涉', key: true }],
        trap: '生活里"高声"常指响度大，不是音调高——别被日常说法带偏。' },
      { emoji: '🪪', title: '音色', rule: '音色由发声体本身（<b>材料、结构</b>）决定，波形的形状不同。',
        steps: [{ t: '同一个音', r: '钢琴和小提琴波形不同' }, { t: '"闻其声知其人"', r: '靠的就是音色', key: true }],
        trap: '音色是声音的"身份证"——高低（音调）、大小（响度）都一样时，靠它区分是谁。' },
      { emoji: '🦇', title: '声的利用', rule: '声能传递<b>信息</b>（B超、声呐、回声定位），也能传递<b>能量</b>（超声清洗、碎石）。',
        steps: [{ t: '靠声"知道了什么"', r: '= 信息' }, { t: '靠声"干了活"', r: '= 能量', key: true }],
        trap: '超声碎石是"能量"不是"信息"——它把石头震碎，干了活。' },
      { emoji: '🚧', title: '噪声与分贝', rule: '分贝（dB）表示声音强弱的<b>等级</b>：0 dB 刚能听见，长期 90 dB 以上损伤听力。',
        steps: [{ t: '声源处', r: '消声器' }, { t: '传播过程', r: '隔声板、绿化带' }, { t: '人耳处', r: '耳塞', key: true }],
        trap: 'dB 是等级不是能量单位；0 dB 是"刚能听见"，不是没有声音。控制噪声认准这三个环节。' },
      { emoji: '🧠', title: '方法卡 · 科学推理', rule: '实验做不到理想极限时：<b>看清趋势，向极限外推</b>。',
        why: '真空铃抽不到绝对真空，但"越少越小"的趋势指向"没有介质就没有声"。这是你第一个理想实验，以后学运动定律还会再遇到这招。' }
    ]);

    /* ================= 自测 ================= */
    function bestLine() {
      const b = Y.quizBest('p2');
      $('p2-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : '';
    }
    bestLine();
    $('p2-quizgo').addEventListener('click', () => {
      $('p2-quizgo').style.display = 'none';
      Y.quizStart($('p2-quizbox'), 'p2', () => {
        $('p2-quizgo').style.display = '';
        $('p2-quizgo').textContent = '再测一次';
        bestLine();
      });
    });

    /* ================= 维也纳任务 ================= */
    function renderTasks() {
      const list = $('p2-tasklist');
      list.innerHTML = '';

      const t1 = Y.taskGet('p2.hausmusik');
      const noteEl = document.createElement('div');
      noteEl.innerHTML = `<input class="note" placeholder="最好玩的一个展品是……" value="${Y.esc(t1.data || '')}">`;
      noteEl.querySelector('input').addEventListener('change', e => Y.taskSet('p2.hausmusik', { data: e.target.value }));
      list.appendChild(window.TaskKit.card({
        emoji: '🏛️', title: '音乐博物馆 Haus der Musik 打卡',
        desc: '市中心，四层全是<b>声学互动展品</b>：巨型乐器、看得见的声波、还能指挥虚拟维也纳爱乐。等于把这个模块搬进现实。玩完回来打勾，写一件最好玩的展品。',
        done: t1.done, body: noteEl,
        onToggle: v => { Y.taskSet('p2.hausmusik', { done: v }); if (v) Y.toast('🏛️ 打卡成功', true); }
      }));

      const t2 = Y.taskGet('p2.dbmap');
      const cnt = (t2.data || []).length;
      const b2 = document.createElement('p');
      b2.className = 'small'; b2.style.margin = '8px 0 0';
      b2.innerHTML = `已记录 <b>${cnt}</b> 条（在上面"分贝计"一节记录）。凑满 4 个不同场所自动完成。`;
      list.appendChild(window.TaskKit.card({
        emoji: '🗺️', title: '维也纳分贝地图',
        desc: '地铁、公园、家里、音乐厅门口……同一台 iPad、举同样高，各记一条分贝。9 月以后，这些数字会出现在你的题目里。',
        done: t2.done, body: b2,
        onToggle: v => Y.taskSet('p2.dbmap', { done: v })
      }));

      const t3 = Y.taskGet('p2.organ');
      const b3 = document.createElement('div');
      if (!t3.done) {
        b3.appendChild(Y.guess({
          q: '先猜：管风琴最长的那根管子，发的音更高还是更低？',
          options: ['更高', '更低'], answer: 1,
          reveal: '长管里的空气柱振动得<b>慢</b>——频率小，音调低。所以大管子 = 低音炮。去圣斯蒂芬教堂或金色大厅亲眼验证。',
          onDone: () => {}
        }));
      }
      list.appendChild(window.TaskKit.card({
        emoji: '🎹', title: '管风琴观察',
        desc: '在教堂或音乐厅找到管风琴，观察管子的长短排布。',
        done: t3.done, body: b3,
        onToggle: v => { Y.taskSet('p2.organ', { done: v }); if (v) Y.toast('🎹 观察完成', true); }
      }));
    }
    renderTasks();

    /* ================= 清理 ================= */
    return {
      cleanup() {
        if (waveHandle) waveHandle.stop();
        if (specHandle) specHandle.stop();
        if (meterTimer) clearInterval(meterTimer);
        if (swTimer) clearInterval(swTimer);
        if (synth) synth.kill();
        if (bell) bell.kill();
        A.stopMic();
      }
    };
  }
};
