/* G0 · 几何板块开门「图形运动场」—— 变换之下，什么变了、什么没变。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.g0 = {
  id: 'g0', subject: 'math', emoji: '🔷',
  title: '图形运动场', subtitle: '几何板块开门 · 什么变了，什么没变',
  wave: 'M2',
  nodes: [
    { id: 'g0-n1', label: '变换仪表盘直觉', needs: ['act:g0.t1', 'act:g0.t2'] },
    { id: 'g0-n2', label: '翻转与手性', needs: ['act:g0.t3', 'q:g0q4'] },
    { id: 'g0-n3', label: '缩放保形', needs: ['act:g0.t4', 'q:g0q2'] },
    { id: 'g0-n4', label: '面积平方律', needs: ['act:g0.t5', 'q:g0q3'] },
    { id: 'g0-n5', label: '全等≌·操作性定义', needs: ['act:g0.congA', 'any:q:g0q5|q:g0q6'] },
    { id: 'g0-n6', label: '相似∽·直觉预告', needs: ['act:g0.simB', 'q:g0q7'] },
    { id: 'g0-n7', label: '角=旋转量', needs: ['act:g0.angle', 'q:g0q1'] },
    { id: 'g0-n8', label: '形状的边界感', needs: ['act:g0.impC', 'q:g0q8'] }
  ],

  render(root, Y) {
    const G = window.GeoKit;
    const $ = id => root.querySelector('#' + id);
    const R1 = x => Math.round(x * 10) / 10;

    root.innerHTML = `
      <nav class="secnav">
        ${[['g0-intro', '引入'], ['g0-field', '运动场'], ['g0-match', '重合挑战'], ['g0-zoo', '角的动物园'],
        ['g0-dict', '几何字典'], ['g0-quiz', '自测']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="g0-intro">
        <div class="card" style="border-top:3px solid var(--math)">
          <p class="intro-hook">几何的全部秘密，是一句话：<b>变换之下，什么变了、什么没变。</b><br>
          移动、旋转、翻转、缩放——这四个动作你手指头本来就会。今天把它们变成数学。</p>
          <p class="hint">先在运动场自由玩，再做 8 个小任务、闯 12 关。之后学三角形、全等、轴对称时，你会一直用到今天的手感。</p>
        </div>
      </section>

      <section id="g0-field">
        <div class="sec-title"><span class="em">🛝</span>图形运动场</div>
        <div class="split">
          <div class="card">
            <div class="chips shapelib" id="g0-shapes"></div>
            <svg id="g0-stage"></svg>
            <div class="btnrow">
              <button class="btn" id="g0-flip">🪞 翻转</button>
              <button class="btn ghost" id="g0-reset">↺ 重置</button>
              <button class="btn ghost" id="g0-morphbtn">✂️ 自由变形：关</button>
            </div>
            <div class="ctl"><label>旋转 <span class="val" id="g0-rotv">0°</span></label>
              <input type="range" id="g0-rot" min="-180" max="180" step="1" value="0"></div>
            <div class="ctl"><label>缩放 <span class="val" id="g0-sclv">1.00×</span></label>
              <input type="range" id="g0-scl" min="0.5" max="2.5" step="0.01" value="1"></div>
            <p class="hint">拖图形＝移动；iPad 上双指旋转、双指捏合也可以（和滑杆等价）。</p>
          </div>
          <div>
            <div id="g0-taskbox"></div>
            <div class="card dash" id="g0-dash">
              <h3>变与不变仪表盘</h3>
              <div id="g0-dashrows"></div>
              <p class="legend">🟡 黄 = 这次操作里它变了 🟢 绿 = 它没变。<b>盯住绿色的——不变的量才是几何的宝贝。</b></p>
            </div>
          </div>
        </div>
        <div class="card" id="g0-saycard">
          <h3>✍️ 规律自述</h3>
          <p style="font-size:17px;line-height:2.1">
            移、转、翻不改变图形的 <select class="blank g0say"><option value="">？</option><option>大小</option><option>形状</option><option>位置</option></select>
            和 <select class="blank g0say"><option value="">？</option><option>大小</option><option>形状</option><option>位置</option></select>；
            缩放会改变 <select class="blank g0say"><option value="">？</option><option>大小</option><option>形状</option><option>位置</option></select>，
            但仍然不改变 <select class="blank g0say"><option value="">？</option><option>大小</option><option>形状</option><option>位置</option></select>。
          </p>
          <div id="g0-sayresult"></div>
        </div>
      </section>

      <section id="g0-match">
        <div class="sec-title"><span class="em">🎯</span>重合挑战 <span class="hint">把你的图形叠到金色虚影上</span></div>
        <div class="split">
          <div class="card">
            <div class="lvl" id="g0-lvls"></div>
            <svg id="g0-mstage"></svg>
            <div class="btnrow">
              <button class="btn" id="g0-mflip">🪞 翻转</button>
              <button class="btn ghost" id="g0-mreset">↺ 重置</button>
              <span class="chip" id="g0-msteps" style="pointer-events:none">步数 0</span>
            </div>
            <div class="ctl"><label>旋转 <span class="val" id="g0-mrotv">0°</span></label>
              <input type="range" id="g0-mrot" min="-180" max="180" step="1" value="0"></div>
            <div class="ctl" id="g0-msclrow"><label>缩放 <span class="val" id="g0-msclv">1.00×</span></label>
              <input type="range" id="g0-mscl" min="0.5" max="2.5" step="0.01" value="1"></div>
          </div>
          <div class="card">
            <h3 id="g0-mtitle">第 1 关</h3>
            <p id="g0-mhint" class="small"></p>
            <div id="g0-mmsg"></div>
          </div>
        </div>
      </section>

      <section id="g0-zoo">
        <div class="sec-title"><span class="em">🦁</span>角的动物园</div>
        <div class="grid2">
          <div class="card">
            <h3>角 = 旋转量</h3>
            <svg id="g0-angsvg" class="geo-svg zoo" style="touch-action:none"></svg>
            <div class="anglebig"><span id="g0-angdeg">45.0</span>°<small> · <span id="g0-angname">锐角</span></small></div>
            <div class="ctl"><label>边的长度 <span class="val" id="g0-anglenv">100</span></label>
              <input type="range" id="g0-anglen" min="60" max="150" step="1" value="100"></div>
            <p class="hint" id="g0-anghint">拖动蓝色的边改变角度；再拉动"边的长度"滑杆——<b>盯住度数</b>。</p>
          </div>
          <div class="card">
            <h3>对顶角 · 剪刀永远公平</h3>
            <svg id="g0-vertsvg" class="geo-svg zoo" style="touch-action:none"></svg>
            <p class="hint">拖动旋转一条直线：两把"对顶"的角永远相等，另一对也一样（相邻的两个角合起来 = 180°，叫邻补角）。</p>
          </div>
          <div class="card">
            <h3>三线八角速查 <span class="hint">字典，不是课</span></h3>
            <svg id="g0-linesvg" class="geo-svg zoo"></svg>
            <div class="chips">
              <button class="chip" data-k="F">同位角 · F</button>
              <button class="chip" data-k="Z">内错角 · Z</button>
              <button class="chip" data-k="U">同旁内角 · U</button>
            </div>
            <p class="hint" id="g0-linemsg">两条平行线被第三条线所截。点上面的按钮，用字母形状记住每一对。8 月中学三角形内角和的证明时，内错角是主角。</p>
          </div>
          <div class="card">
            <h3>外角 = 转弯角</h3>
            <svg id="g0-walksvg" class="geo-svg zoo"></svg>
            <div class="walkstat" id="g0-walkstat">小人站在起点，准备绕三角形走一圈。</div>
            <div class="btnrow" style="justify-content:center"><button class="btn primary" id="g0-walkbtn">🚶 走到下一个拐角</button></div>
          </div>
        </div>
      </section>

      <section id="g0-dict">
        <div class="sec-title"><span class="em">📖</span>几何字典 <span class="hint">做题卡住随时来查</span></div>
        <div id="g0-dictlist"></div>
      </section>

      <section id="g0-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 8 题</div>
        <div class="card">
          <p>全是概念判断——检查的不是计算，是你的空间感有没有立起来。</p>
          <p class="hint" id="g0-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="g0-quizgo">开始自测</button></div>
          <div id="g0-quizbox"></div>
        </div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c =>
      c.addEventListener('click', () => {
        const t = document.getElementById(c.dataset.to);
        if (t) t.scrollIntoView({ block: 'start' });
      }));

    /* ================= 运动场 ================= */
    const stage = G.mount($('g0-stage'), {});
    const LIB = ['tri1', 'tri2', 'tri3', 'sq', 'rect', 'para', 'lshape', 'star', 'fletter', 'bolt'];
    $('g0-shapes').innerHTML = LIB.map((id, i) =>
      `<button class="chip${i === 0 ? ' on' : ''}" data-s="${id}">${G.SHAPES[id].name}</button>`).join('');
    $('g0-shapes').addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $('g0-shapes').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      stage.setShape(b.dataset.s);
      syncSliders();
    });

    function syncSliders() {
      const t = stage.get();
      let deg = Math.round(t.rot * 180 / Math.PI);
      while (deg > 180) deg -= 360; while (deg < -180) deg += 360;
      $('g0-rot').value = deg; $('g0-rotv').textContent = deg + '°';
      $('g0-scl').value = t.scale; $('g0-sclv').textContent = t.scale.toFixed(2) + '×';
    }
    $('g0-rot').addEventListener('input', e => {
      stage.rotateTo(+e.target.value);
      $('g0-rotv').textContent = e.target.value + '°';
    });
    $('g0-rot').addEventListener('change', () => taskEngine.poke('rotate'));
    $('g0-scl').addEventListener('input', e => {
      stage.scaleTo(+e.target.value);
      $('g0-sclv').textContent = (+e.target.value).toFixed(2) + '×';
    });
    $('g0-scl').addEventListener('change', () => taskEngine.poke('scale'));
    $('g0-flip').addEventListener('click', () => { stage.flip(); });
    $('g0-reset').addEventListener('click', () => { stage.reset(); syncSliders(); });
    let morphOn = false;
    $('g0-morphbtn').addEventListener('click', () => {
      morphOn = !morphOn;
      stage.setMorph(morphOn);
      $('g0-morphbtn').textContent = '✂️ 自由变形：' + (morphOn ? '开' : '关');
    });

    /* ---- 仪表盘 ---- */
    let snap = null, snapDirty = false, dashTick = 0;
    function fmtList(a) {
      const v = a.map(x => R1(x));
      return (v.length > 6 ? v.slice(0, 6).join(' ') + ' …' : v.join(' '));
    }
    function renderDash(diff) {
      const m = stage.metrics();
      const rows = [
        ['各边长', fmtList(m.edges), diff && diff.edges],
        ['各内角', fmtList(m.angles) + '°', diff && diff.angles],
        ['周长', R1(m.perim), diff && diff.perim],
        ['面积', Math.round(m.area), diff && diff.area],
        ['朝向', Math.round(m.rotDeg) + '°', diff && diff.rot],
        ['左右手', m.flipped ? '🫲 镜像' : '🫱 正向', diff && diff.flip]
      ];
      $('g0-dashrows').innerHTML = rows.map(r =>
        `<div class="drow ${r[2] === true ? 'chg' : r[2] === false ? 'same' : ''}"><span class="dl">${r[0]}</span><span class="dv">${r[1]}</span></div>`).join('');
    }
    function diffMetrics(a, b) {
      const listChanged = (x, y, tol) => x.length !== y.length || x.some((v, i) => Math.abs(v - y[i]) > tol);
      return {
        edges: listChanged(a.edges, b.edges, 0.8),
        angles: listChanged(a.angles, b.angles, 0.9),
        perim: Math.abs(a.perim - b.perim) > 1.6,
        area: Math.abs(a.area - b.area) > 9,
        rot: Math.abs(a.rotDeg - b.rotDeg) > 1.5 && Math.abs(a.rotDeg - b.rotDeg) < 358.5,
        flip: a.flipped !== b.flipped
      };
    }
    stage.onChange(kind => {
      if (kind === 'set') { snapDirty = false; renderDash(null); return; }
      if (!snapDirty) { snap = stage.metrics(); snapDirty = true; }
      if ((dashTick++ % 4) === 0) renderDash(diffMetrics(stage.metrics(), snap));
      taskEngine.watch(kind);
    });
    stage.onOpEnd(kind => {
      renderDash(snapDirty ? diffMetrics(stage.metrics(), snap) : null);
      snapDirty = false;
      taskEngine.poke(kind);
    });
    renderDash(null);

    /* ================= 引导任务 T1–T8 ================= */
    const ZONE = { x: 400, y: 24, w: 216, h: 180 };
    const TASKS = [
      { id: 't1', title: '搬家', text: '把图形拖进右上角的金色区域——只许拖，别的都不碰。',
        guess: { q: '先猜：移动它，仪表盘上哪些数字会变？', options: ['边长会变', '角度会变', '全都不变'], answer: 2 },
        act() { stage.reset(); syncSliders(); stage.showZone(ZONE); },
        check(b) {
          const c = stage.center(), t = stage.get();
          return c[0] > ZONE.x && c[1] < ZONE.y + ZONE.h &&
            Math.abs(t.rot - b.t.rot) < 0.05 && Math.abs(t.scale - b.t.scale) < 0.05 && t.flip === b.t.flip;
        },
        done: '整盘全绿——平移什么都不改变，只换了个地方。', after() { stage.showZone(null); } },
      { id: 't2', title: '原地转体', text: '把它旋转至少 45°（滑杆或双指都行）。',
        guess: { q: '先猜：旋转它，仪表盘上会发生什么？', options: ['边长会跟着变', '角度会跟着变', '只有朝向在变'], answer: 2 },
        act() { stage.reset(); syncSliders(); },
        check(b) {
          const t = stage.get();
          return Math.abs(t.rot - b.t.rot) * 180 / Math.PI >= 45 && Math.abs(t.scale - b.t.scale) < 0.05 && t.flip === b.t.flip;
        },
        done: '只有"朝向"一行变黄——旋转保留大小和形状的一切。' },
      { id: 't3', title: '照镜子', text: '现在是字母 F。点【翻转】，再试着只用旋转把它转回原来的样子——回得去吗？',
        act() { stage.setShape('fletter'); syncSliders(); $('g0-shapes').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.s === 'fletter')); },
        check(b) { return stage.get().flip !== b.t.flip; },
        done: '转一万圈也回不去——翻转改变了<b>左右手</b>（镜像方向），只有再翻一次才能复原。仪表盘上边长角度依然全绿：镜像不改变大小形状。' },
      { id: 't4', title: '吹气球', text: '把正方形放大到 2 倍（缩放滑杆拉到 2.0）。',
        guess: { q: '先猜：放大 2 倍后，原来 90° 的角会变成多少？', options: ['还是 90°', '略大于 90°', '变成 180°'], answer: 0 },
        act() { stage.setShape('sq'); syncSliders(); $('g0-shapes').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.s === 'sq')); },
        check(b) { return stage.get().scale / b.t.scale >= 1.9; },
        done: '边长翻倍、周长翻倍，但<b>角度一行始终全绿</b>——缩放不改变任何角度。"形状没变"说的就是这个。' },
      { id: 't5', title: '面积的秘密', text: '重置后再放大到 2 倍，这次盯住"面积"那一行。',
        guess: { q: '先猜：边长 ×2，面积变成几倍？', options: ['2 倍', '3 倍', '4 倍', '8 倍'], answer: 2 },
        act() { stage.reset(); syncSliders(); },
        check(b) { return stage.get().scale / b.t.scale >= 1.9; },
        done() {
          const now = Math.round(stage.metrics().area);
          return `面积从 ${Math.round(snapArea)} 变到 ${now}——差不多正好 <b>4 倍</b>（2²）。边长 ×3 时面积会 ×9。这个"平方规律"初三还会大显身手。`;
        } },
      { id: 't6', title: '真正的变形', text: '自由变形已打开：拖动某个红色顶点。',
        act() { morphOn = true; stage.setMorph(true); $('g0-morphbtn').textContent = '✂️ 自由变形：开'; },
        check(b, ctx) { return ctx.morphed; },
        done: '满盘飘黄——边长、角度全乱了。<b>这才叫"形状变了"</b>。前面四种变换再怎么折腾都做不到这一点。',
        after() { morphOn = false; stage.setMorph(false); $('g0-morphbtn').textContent = '✂️ 自由变形：关'; stage.setShape(stage.shapeId); } },
      { id: 't7', title: '叠上去', text: '去下面的【重合挑战】，把第 1 关叠上再回来。（这种"能完全叠上"的关系，8 月中的全等模块会正式给它名字。）',
        check() { return Y.has('act:g0.cA1'); },
        done: '你已经会了全等的"操作版定义"：能靠移、转、翻完全重合。' },
      { id: 't8', title: '最后一猜', text: '',
        guess: { q: '只用等比缩放，能把正方形变成长方形吗？', options: ['能', '不能'], answer: 1 },
        check(b, ctx) { return ctx.guessed; },
        done: '等比缩放保持所有比例——正方形永远变不成长方形。<b>"形状相同" = 能靠移转翻缩互相重合</b>，这个含义从今天起是精确的。' }
    ];

    let snapArea = 0;
    const taskEngine = (function () {
      let cur = -1, base = null, ctx = {}, active = true;
      const box = $('g0-taskbox');
      const doneIds = () => TASKS.filter(t => Y.has('act:g0.' + t.id)).map(t => t.id);
      const firstUndone = () => TASKS.findIndex(t => !Y.has('act:g0.' + t.id));
      function activate() {
        cur = firstUndone();
        if (cur >= 0) {
          ctx = { morphed: false, guessed: false };
          const t = TASKS[cur];
          if (t.act) t.act();
          base = { t: stage.get(), m: stage.metrics() };
          snapArea = base.m.area;
        }
        renderBox();
      }
      function renderBox() {
        const done = doneIds();
        const dots = `<div class="tasklist-mini">${TASKS.map((t, i) =>
          `<span class="tdot ${done.includes(t.id) ? 'done' : (i === cur ? 'cur' : '')}">${done.includes(t.id) ? '✓' : i + 1}</span>`).join('')}</div>`;
        if (cur === -1) {
          box.innerHTML = `<div class="taskbox taskdone" style="border-color:var(--math);background:#eef0fb">${dots}<b>八个任务全部完成。</b><p class="small" style="margin:6px 0 0">把下面的规律自述填了，这一节就通了。</p></div>`;
          return;
        }
        const t = TASKS[cur];
        box.innerHTML = `<div class="taskbox" style="border-color:var(--math);background:#eef0fb">${dots}
          <div class="tno" style="color:var(--math)">任务 ${cur + 1} / ${TASKS.length}</div>
          <h3 style="margin:.2em 0">${t.title}</h3>
          <div id="g0-tguess"></div>
          <p id="g0-ttext" style="margin:.4em 0 0">${t.text}</p></div>`;
        if (t.guess && !ctx.guessed) {
          const tt = $('g0-ttext'); if (tt) tt.style.opacity = .35;
          $('g0-tguess').appendChild(Y.guess({
            q: t.guess.q, options: t.guess.options, answer: t.guess.answer,
            reveal: t.id === 't8' ? '看下面的结论——' : '动手验证 ↓',
            onDone: () => { ctx.guessed = true; if (tt) tt.style.opacity = 1; poke('guess'); }
          }));
        }
      }
      function watch(kind) { if (kind === 'morph') ctx.morphed = true; }
      function poke() {
        if (!active || cur === -1) return;
        const t = TASKS[cur];
        if (t.guess && !ctx.guessed) return;
        if (t.check(base, ctx)) {
          Y.ev('act:g0.' + t.id);
          Y.toast('✓ ' + t.title, true);
          const doneHtml = `<div class="explain">${typeof t.done === 'function' ? t.done() : t.done}</div>`;
          if (t.after) t.after();
          activate();
          box.insertAdjacentHTML('beforeend', doneHtml);
        }
      }
      return { activate, poke, watch, renderBox };
    })();
    taskEngine.activate();

    /* ---- 规律自述 ---- */
    const says = [...root.querySelectorAll('.g0say')];
    function checkSay() {
      const v = says.map(s => s.value);
      if (v.some(x => !x)) return;
      const pairOk = (v[0] === '大小' && v[1] === '形状') || (v[0] === '形状' && v[1] === '大小');
      const ok = pairOk && v[2] === '大小' && v[3] === '形状';
      says.forEach(s => { s.classList.toggle('good', ok); s.classList.toggle('badpick', !ok); });
      if (ok) {
        $('g0-sayresult').innerHTML = `<div class="stdline">标准表述：平移、旋转、轴对称（翻转）都不改变图形的<b>大小和形状</b>；缩放改变大小、保持形状——保持形状的缩放关系，就是初三要学的"相似"。</div>`;
        Y.ev('act:g0.say');
        Y.toast('✍️ 四种变换，一句话说清了', true);
      }
    }
    says.forEach(s => s.addEventListener('change', checkSay));

    /* ================= 重合挑战 ================= */
    const mstage = G.mount($('g0-mstage'), { homeX: 170, homeY: 240 });
    const D2R = d => d * Math.PI / 180;
    const LV = [
      { id: 'cA1', g: 'A', shape: 'tri1', t: { dx: 260, dy: -90, rot: 0 }, hint: '第 1 关只需要拖过去。' },
      { id: 'cA2', g: 'A', shape: 'tri2', t: { dx: 250, dy: -80, rot: 60 }, hint: '先转到对的角度，再拖过去。' },
      { id: 'cA3', g: 'A', shape: 'sq', t: { dx: 270, dy: -100, rot: 45 }, hint: '正方形转 45° 是个菱形站姿。' },
      { id: 'cA4', g: 'A', shape: 'fletter', t: { dx: 260, dy: -60, rot: 0, flip: -1 }, hint: '这关有点邪门——怎么转都差一点的时候，想想还有哪个按钮没用过。' },
      { id: 'cA5', g: 'A', shape: 'bolt', t: { dx: 255, dy: -85, rot: 30, flip: -1 }, hint: '组合拳：可能要翻、要转、要移。' },
      { id: 'cA6', g: 'A', shape: 'lshape', t: { dx: 265, dy: -90, rot: -45, flip: -1 }, hint: '毕业关：三招全用上。' },
      { id: 'cB1', g: 'B', shape: 'tri1', t: { dx: 255, dy: -80, rot: 0, scale: 0.6 }, hint: '虚影比你的小——移和转不够用了，解锁新滑杆：缩放。' },
      { id: 'cB2', g: 'B', shape: 'sq', t: { dx: 265, dy: -95, rot: 30, scale: 1.6 }, hint: '放大 + 旋转。' },
      { id: 'cB3', g: 'B', shape: 'tri3', t: { dx: 250, dy: -85, rot: -60, scale: 1.5, flip: -1 }, hint: '全家桶：移转翻缩一起上。' },
      { id: 'cC1', g: 'C', shape: 'tri1', perturb: 16, t: { dx: 255, dy: -85, rot: 0 }, hint: '……这关好像哪里不对劲。' },
      { id: 'cC2', g: 'C', shape: 'sq', perturb: 18, t: { dx: 260, dy: -90, rot: 0 }, hint: '还是不对劲。' },
      { id: 'cC3', g: 'C', shape: 'para', perturb: 16, t: { dx: 255, dy: -85, rot: 15 }, hint: '最后一次，下结论吧。' }
    ];
    let mcur = 0, msteps = 0;
    function lvUnlocked(i) { return i === 0 || Y.has('act:g0.' + LV[i - 1].id); }
    function renderLvls() {
      $('g0-lvls').innerHTML = LV.map((l, i) => {
        const okc = Y.has('act:g0.' + l.id) ? ' ok' : '';
        const lock = lvUnlocked(i) ? '' : ' lock';
        return `<button class="lc ${l.g}${okc}${i === mcur ? ' cur' : ''}${lock}" data-i="${i}">${l.g}${(i % 6) % 3 + Math.floor((i % 6) / 3) * 3 + 1 && ''}${i < 6 ? i + 1 : i < 9 ? i - 5 : i - 8}</button>`;
      }).join('');
      $('g0-lvls').querySelectorAll('.lc').forEach(b => b.addEventListener('click', () => loadLv(+b.dataset.i)));
    }
    function loadLv(i) {
      mcur = i; msteps = 0;
      const l = LV[i];
      mstage.setShape(l.shape);
      mstage.setAllowScale(l.g === 'B');
      $('g0-msclrow').style.display = l.g === 'B' ? '' : 'none';
      $('g0-mrot').value = 0; $('g0-mrotv').textContent = '0°';
      $('g0-mscl').value = 1; $('g0-msclv').textContent = '1.00×';
      $('g0-msteps').textContent = '步数 0';
      const gt = { tx: 170 + l.t.dx, ty: 240 + l.t.dy, rot: D2R(l.t.rot || 0), scale: l.t.scale || 1, flip: l.t.flip || 1 };
      let gv = null;
      if (l.perturb) {
        gv = G.SHAPES[l.shape].v.map(p => p.slice());
        gv[1] = [gv[1][0] + l.perturb, gv[1][1] - l.perturb * 0.7];
      }
      mstage.setGhost({ shapeId: l.shape, v: gv, t: gt });
      $('g0-mtitle').textContent = (l.g === 'A' ? '全等挑战 ' : l.g === 'B' ? '相似挑战 ' : '奇怪的关卡 ') + (i + 1) + ' / 12';
      $('g0-mhint').textContent = l.hint;
      $('g0-mmsg').innerHTML = Y.has('act:g0.' + l.id)
        ? '<div class="explain">这一关已通过 ✓</div>'
        : (l.g === 'C' ? '<div class="btnrow"><button class="btn danger" id="g0-giveup">我确定：这关怎么都叠不上</button></div>' : '');
      const gu = $('g0-giveup');
      if (gu) gu.addEventListener('click', () => {
        $('g0-mmsg').innerHTML = '';
        $('g0-mmsg').appendChild(Y.guess({
          q: '为什么怎么都叠不上？', options: ['我操作得还不够好，再试几次总能叠上', '虚影的形状和我的不一样，谁来都叠不上'], answer: 1,
          reveal: '对。它的形状被人动过手脚。<b>移、转、翻、缩都保不住的差异，才是真正的"形状不同"</b>——这就是全等与相似的边界。',
          onDone: () => passLv(true)
        }));
      });
      renderLvls();
    }
    function passLv(isC) {
      const l = LV[mcur];
      if (!Y.has('act:g0.' + l.id)) {
        Y.ev('act:g0.' + l.id);
        if (!isC) mstage.snapToGhost();
        Y.toast((isC ? '🧠 ' : '🎯 ') + $('g0-mtitle').textContent.trim() + ' 通过' + (isC ? '' : ' · ' + msteps + ' 步'), true);
        if (LV.filter(x => x.g === 'A').every(x => Y.has('act:g0.' + x.id))) Y.ev('act:g0.congA');
        if (LV.filter(x => x.g === 'B').every(x => Y.has('act:g0.' + x.id))) Y.ev('act:g0.simB');
        if (LV.filter(x => x.g === 'C').every(x => Y.has('act:g0.' + x.id))) Y.ev('act:g0.impC');
        taskEngine.poke();
      }
      $('g0-mmsg').innerHTML = `<div class="explain">${isC ? '看破陷阱 ✓' : '严丝合缝 ✓（' + msteps + ' 步）'}${mcur < LV.length - 1 ? ' <button class="btn" id="g0-mnext" style="margin-left:8px">下一关 ›</button>' : ' 十二关全部通关 🏆'}</div>`;
      const nx = $('g0-mnext');
      if (nx) nx.addEventListener('click', () => loadLv(mcur + 1));
      renderLvls();
    }
    let mTick = 0;
    mstage.onChange(() => {
      if ((mTick++ % 5) !== 0) return;
      if (!LV[mcur].perturb && mstage.matchGhost(9)) passLv(false);
    });
    mstage.onOpEnd(() => {
      msteps++;
      $('g0-msteps').textContent = '步数 ' + msteps;
      if (!LV[mcur].perturb && mstage.matchGhost(9)) passLv(false);
    });
    $('g0-mrot').addEventListener('input', e => { mstage.rotateTo(+e.target.value); $('g0-mrotv').textContent = e.target.value + '°'; });
    $('g0-mrot').addEventListener('change', () => { msteps++; $('g0-msteps').textContent = '步数 ' + msteps; if (!LV[mcur].perturb && mstage.matchGhost(9)) passLv(false); });
    $('g0-mscl').addEventListener('input', e => { mstage.scaleTo(+e.target.value); $('g0-msclv').textContent = (+e.target.value).toFixed(2) + '×'; });
    $('g0-mscl').addEventListener('change', () => { msteps++; if (!LV[mcur].perturb && mstage.matchGhost(9)) passLv(false); });
    $('g0-mflip').addEventListener('click', () => { mstage.flip(); });
    $('g0-mreset').addEventListener('click', () => { loadLv(mcur); });
    loadLv(0);

    /* ================= 角的动物园 ================= */
    const NS = 'http://www.w3.org/2000/svg';
    /* --- (a) 角 = 旋转量 --- */
    (function angleLab() {
      const svg = $('g0-angsvg');
      svg.setAttribute('viewBox', '0 0 340 220');
      const O = [78, 158];
      let theta = 45, len = 100, rotated = 0, lenMoved = false, lastTheta = 45;
      svg.innerHTML = `
        <path id="g0-arc" fill="rgba(76,81,191,.15)" stroke="#4c51bf" stroke-width="1.5"></path>
        <line id="g0-rayfix" stroke="#8b8271" stroke-width="3" stroke-linecap="round"></line>
        <line id="g0-raymov" stroke="#4c51bf" stroke-width="4" stroke-linecap="round" style="cursor:grab"></line>
        <circle cx="${O[0]}" cy="${O[1]}" r="5" fill="#27231b"></circle>
        <circle id="g0-angtip" r="9" fill="#4c51bf" style="cursor:grab"></circle>`;
      const el = id => svg.querySelector('#' + id);
      function draw() {
        const rad = theta * Math.PI / 180;
        const tip = [O[0] + len * Math.cos(rad), O[1] - len * Math.sin(rad)];
        el('g0-rayfix').setAttribute('x1', O[0]); el('g0-rayfix').setAttribute('y1', O[1]);
        el('g0-rayfix').setAttribute('x2', O[0] + len); el('g0-rayfix').setAttribute('y2', O[1]);
        el('g0-raymov').setAttribute('x1', O[0]); el('g0-raymov').setAttribute('y1', O[1]);
        el('g0-raymov').setAttribute('x2', tip[0]); el('g0-raymov').setAttribute('y2', tip[1]);
        el('g0-angtip').setAttribute('cx', tip[0]); el('g0-angtip').setAttribute('cy', tip[1]);
        const r = 30, large = theta > 180 ? 1 : 0;
        el('g0-arc').setAttribute('d',
          `M ${O[0] + r} ${O[1]} A ${r} ${r} 0 ${large} 0 ${O[0] + r * Math.cos(rad)} ${O[1] - r * Math.sin(rad)} L ${O[0]} ${O[1]} Z`);
        $('g0-angdeg').textContent = theta.toFixed(1);
        $('g0-angname').textContent = theta < 89 ? '锐角' : theta <= 91 ? '直角' : theta < 179 ? '钝角' : theta <= 181 ? '平角' : theta < 358 ? '大于平角（优角）' : '周角';
      }
      draw();
      let dragging = false;
      function pt(e) {
        const r = svg.getBoundingClientRect();
        return [(e.clientX - r.left) / r.width * 340, (e.clientY - r.top) / r.height * 220];
      }
      svg.addEventListener('pointerdown', e => { dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (err) {} });
      svg.addEventListener('pointermove', e => {
        if (!dragging) return;
        const [x, y] = pt(e);
        let a = Math.atan2(O[1] - y, x - O[0]) * 180 / Math.PI;
        if (a < 0) a += 360;
        rotated += Math.min(Math.abs(a - lastTheta), 360 - Math.abs(a - lastTheta));
        lastTheta = a; theta = a;
        draw(); grant();
      });
      const stop = () => { dragging = false; };
      svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
      $('g0-anglen').addEventListener('input', e => {
        len = +e.target.value; lenMoved = true;
        $('g0-anglenv').textContent = len;
        $('g0-anghint').innerHTML = '边在变长变短——<b style="color:var(--ok)">度数纹丝不动</b>。角的大小与边长无关，它量的是"张开多少"。';
        draw(); grant();
      });
      function grant() { if (rotated > 30 && lenMoved) Y.ev('act:g0.angle'); }
    })();

    /* --- (b) 对顶角 --- */
    (function vertLab() {
      const svg = $('g0-vertsvg');
      svg.setAttribute('viewBox', '0 0 340 220');
      const O = [170, 110], L = 95;
      let phi = 28;
      svg.innerHTML = `
        <line id="g0-vl1" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" style="cursor:grab"></line>
        <line id="g0-vl2" stroke="#b7791f" stroke-width="3.5" stroke-linecap="round"></line>
        <circle cx="${O[0]}" cy="${O[1]}" r="4.5" fill="#27231b"></circle>
        <text id="g0-va1" font-size="15" fill="#0f766e" font-weight="700"></text>
        <text id="g0-va2" font-size="15" fill="#b45309" font-weight="700"></text>
        <text id="g0-va3" font-size="15" fill="#0f766e" font-weight="700"></text>
        <text id="g0-va4" font-size="15" fill="#b45309" font-weight="700"></text>`;
      const el = id => svg.querySelector('#' + id);
      function draw() {
        const r1 = phi * Math.PI / 180, base = 0;
        el('g0-vl1').setAttribute('x1', O[0] - L * Math.cos(r1)); el('g0-vl1').setAttribute('y1', O[1] + L * Math.sin(r1));
        el('g0-vl1').setAttribute('x2', O[0] + L * Math.cos(r1)); el('g0-vl1').setAttribute('y2', O[1] - L * Math.sin(r1));
        el('g0-vl2').setAttribute('x1', O[0] - L); el('g0-vl2').setAttribute('y1', O[1]);
        el('g0-vl2').setAttribute('x2', O[0] + L); el('g0-vl2').setAttribute('y2', O[1]);
        const a = Math.min(phi, 180 - phi) === phi ? phi : phi; // 夹角
        const acute = Math.round(phi > 90 ? 180 - phi : phi);
        const obtuse = 180 - acute;
        const mid = (deg, r) => [O[0] + r * Math.cos(deg * Math.PI / 180), O[1] - r * Math.sin(deg * Math.PI / 180)];
        const p1 = mid(phi / 2, 46), p3 = mid(phi / 2 + 180, 46);
        const p2 = mid(phi + (180 - phi) / 2, 52), p4 = mid(phi + (180 - phi) / 2 + 180, 52);
        el('g0-va1').setAttribute('x', p1[0] - 12); el('g0-va1').setAttribute('y', p1[1] + 5);
        el('g0-va1').textContent = (phi > 90 ? obtuse : acute) + '°';
        el('g0-va3').setAttribute('x', p3[0] - 12); el('g0-va3').setAttribute('y', p3[1] + 5);
        el('g0-va3').textContent = (phi > 90 ? obtuse : acute) + '°';
        el('g0-va2').setAttribute('x', p2[0] - 12); el('g0-va2').setAttribute('y', p2[1] + 5);
        el('g0-va2').textContent = (phi > 90 ? acute : obtuse) + '°';
        el('g0-va4').setAttribute('x', p4[0] - 12); el('g0-va4').setAttribute('y', p4[1] + 5);
        el('g0-va4').textContent = (phi > 90 ? acute : obtuse) + '°';
      }
      draw();
      let dragging = false;
      svg.addEventListener('pointerdown', e => { dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (err) {} });
      svg.addEventListener('pointermove', e => {
        if (!dragging) return;
        const r = svg.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width * 340, y = (e.clientY - r.top) / r.height * 220;
        let a = Math.atan2(O[1] - y, x - O[0]) * 180 / Math.PI;
        a = ((a % 180) + 180) % 180;
        phi = Math.max(12, Math.min(168, a));
        draw();
      });
      const stop = () => { dragging = false; };
      svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
    })();

    /* --- (c) 三线八角 --- */
    (function eightLab() {
      const svg = $('g0-linesvg');
      svg.setAttribute('viewBox', '0 0 300 220');
      svg.innerHTML = `
        <line x1="30" y1="80" x2="270" y2="80" stroke="#57503f" stroke-width="2.5"></line>
        <line x1="30" y1="160" x2="270" y2="160" stroke="#57503f" stroke-width="2.5"></line>
        <line x1="60" y1="190" x2="200" y2="50" stroke="#4c51bf" stroke-width="2.5"></line>
        <g id="g0-lmarks"></g><g id="g0-lletter"></g>`;
      const MARKS = {
        F: { pts: [[192, 71], [112, 151]], color: '#b7791f', path: 'M200,50 L90,160 M170,80 L245,80 M90,160 L165,160', msg: '同位角：位置相同（都在交点的同一方位）。两直线平行时，同位角相等。' },
        Z: { pts: [[146, 90], [112, 151]], color: '#0f766e', path: 'M95,80 L170,80 L90,160 L165,160', msg: '内错角：夹在两线之间、分居截线两侧，连起来是个 Z。两直线平行时，内错角相等——内角和证明的主角。' },
        U: { pts: [[180, 104], [112, 151]], color: '#b91c1c', path: 'M170,80 L245,80 M170,80 L90,160 M90,160 L165,160', msg: '同旁内角：夹在两线之间、同一侧，像个 U。两直线平行时，同旁内角互补（和为 180°）。' }
      };
      root.querySelector('#g0-zoo .card:nth-child(3) .chips').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        e.currentTarget.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        const m = MARKS[b.dataset.k];
        svg.querySelector('#g0-lmarks').innerHTML = m.pts.map(p =>
          `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="${m.color}" opacity=".85"></circle>`).join('');
        svg.querySelector('#g0-lletter').innerHTML =
          `<path d="${m.path}" fill="none" stroke="${m.color}" stroke-width="5" opacity=".3" stroke-linecap="round"></path>`;
        $('g0-linemsg').innerHTML = m.msg;
      });
    })();

    /* --- (d) 外角 = 转弯角 --- */
    (function walkLab() {
      const svg = $('g0-walksvg');
      svg.setAttribute('viewBox', '0 0 340 220');
      const V = [[60, 185], [285, 185], [205, 62]];
      svg.innerHTML = `
        <polygon points="${V.map(p => p.join(',')).join(' ')}" fill="rgba(76,81,191,.1)" stroke="#4c51bf" stroke-width="2.5"></polygon>
        <circle id="g0-walker" cx="${V[0][0]}" cy="${V[0][1]}" r="11" fill="#b7791f" style="transition:cx .7s,cy .7s"></circle>
        <text id="g0-wlabel" font-size="14" font-weight="700" fill="#b45309"></text>`;
      let step = 0, total = 0;
      $('g0-walkbtn').addEventListener('click', () => {
        const w = svg.querySelector('#g0-walker');
        const next = V[(step + 1) % 3];
        w.setAttribute('cx', next[0]); w.setAttribute('cy', next[1]);
        const seq = [123.7, 96.9, 139.4];   // 到达 B、C、回到 A 时的转弯角（外角），和恰为 360°
        total = Math.round(seq.slice(0, (step % 3) + 1).reduce((a, b) => a + b, 0) * 10) / 10;
        step++;
        if (step % 3 === 0) {
          $('g0-walkstat').innerHTML = `回到起点！三次转弯共转了 <b>360.0°</b> 🎉 —— 每个"转弯角"就是三角形的<b>外角</b>：任何多边形绕一圈，外角和都是 360°。`;
          Y.ev('act:g0.walk');
          total = 0;
        } else {
          $('g0-walkstat').innerHTML = `在拐角转了 <b>${seq[(step % 3) - 1]}°</b>，累计 <b>${total}°</b>。`;
        }
      });
    })();

    /* ================= 几何字典 ================= */
    const DICT = [
      ['📍', '点·线段·射线·直线', '线段有两个端点、可度量；射线有一个端点、向一方无限延伸；直线没有端点、两方无限延伸。', '生活里的"线"几乎都是线段；手电筒的光近似射线。'],
      ['📏', '两点之间，线段最短', '连接两点的所有线中，线段最短；这条线段的长度叫这两点间的距离。', '抄近道走直线，就是这条公理在腿上的体现。它也是"三角形两边之和大于第三边"的根据。'],
      ['🡒', '垂直与垂线段最短', '两线相交成 90° 即互相垂直；直线外一点与直线上各点的连线中，垂线段最短。', '测量点到直线的距离，量的就是垂线段——跳远成绩这么量。'],
      ['∥', '平行', '同一平面内不相交的两条直线互相平行；过直线外一点，有且只有一条直线与已知直线平行。', '铁轨、作业本的横线。平行线被第三条线所截，就有了三线八角（见上面速查）。'],
      ['✂️', '对顶角', '两条直线相交成 4 个角，相对的两个角是对顶角，对顶角相等。', '剪刀开合，两对对顶角始终同步——证明只需一句"同角的补角相等"。'],
      ['🔗', '邻补角', '相邻且互补的两个角，和为 180°。', '一条直线上"拐弯"的两边。它和对顶角是同一张图里的两组关系。'],
      ['📐', '角的分类', '锐角 <90° < 直角 < 钝角 <180°（平角）；转满一圈是 360°（周角）。', '角 = 旋转量。度数只看张开程度，与边画多长无关（去"角的动物园"拉一拉）。'],
      ['🧭', '角平分线', '从角的顶点出发、把角分成两个相等的角的射线。', '8 月学全等时它会带着一条重要性质回归：角平分线上的点到角两边距离相等。']
    ];
    $('g0-dictlist').innerHTML = DICT.map(d =>
      `<details class="kard"><summary><span>${d[0]}</span>${d[1]}</summary>
       <div class="kbody"><div class="stdline">${d[2]}</div><p class="why">${d[3]}</p></div></details>`).join('');

    /* ================= 自测 ================= */
    function bestLine() {
      const b = Y.quizBest('g0');
      $('g0-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : '';
    }
    bestLine();
    $('g0-quizgo').addEventListener('click', () => {
      $('g0-quizgo').style.display = 'none';
      Y.quizStart($('g0-quizbox'), 'g0', () => {
        $('g0-quizgo').style.display = '';
        $('g0-quizgo').textContent = '再测一次';
        bestLine();
      });
    });

    return { cleanup() {} };
  }
};
