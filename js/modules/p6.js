/* p6 · 第六章 质量与密度 —— 质量不变性、天平、密度=属性、量筒排水法、误差方向、皇冠疑案。产出 lab-kit。
   物理红线：质量不随形状/状态/位置变；天平读数=砝码+游码；ρ=m/V 是物质属性（不随 m、V 变）；
   量筒俯大仰小；排水 V=V₂−V₁；先天平后量筒；皇冠 ρ 落金银之间=掺假。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.p6 = {
  id: 'p6', subject: 'phys', emoji: '⚖️',
  title: '质量与密度', subtitle: '铁和棉花谁重 · 密度是物质的身份证',
  wave: 'M9',
  nodes: [
    { id: 'p6-n1', label: '质量及其不变性', needs: ['act:p6.mass', 'q:p6q1'] },
    { id: 'p6-n2', label: '天平的使用', needs: ['act:p6.balance', 'q:p6q2'] },
    { id: 'p6-n3', label: '密度是物质的属性', needs: ['act:p6.density', 'any:q:p6q3|q:p6q4'] },
    { id: 'p6-n4', label: '密度单位与换算', needs: ['q:p6q5'] },
    { id: 'p6-n5', label: '量筒读数·凹液面视差', needs: ['act:p6.cylinder', 'q:p6q6'] },
    { id: 'p6-n6', label: '排水法测密度', needs: ['act:p6.drainage', 'q:p6q7'] },
    { id: 'p6-n7', label: '测量误差方向', needs: ['act:p6.error', 'q:p6q8'] },
    { id: 'p6-n8', label: '阿基米德·鉴别物质', needs: ['act:p6.crown', 'q:p6q9'] },
    { id: 'p6-n9', label: '密度应用·空心与间接测量', needs: ['act:p6.poker', 'q:p6q10'] },
    { id: 'p6-n10', label: '珍宝库皇冠（跨学科实践）', needs: ['act:p6.vienna'] }
  ],
  taskIds: ['p6.vienna'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k])); if (txt !== undefined) e.textContent = txt; g.appendChild(e); return e; };
    const RHO = { 铝: 2.7, 铁: 7.9, 铜: 8.9, 银: 10.5, 铅: 11.3, 金: 19.3, 冰: 0.9, 水: 1.0 };

    root.innerHTML = `
      <nav class="secnav">
        ${[['p6-intro', '引入'], ['p6-mass', '质量'], ['p6-balance', '天平'], ['p6-density', '密度'],
        ['p6-drain', '排水法'], ['p6-crown', '皇冠疑案'], ['p6-poker', '密度扑克'], ['p6-cards', '知识卡'], ['p6-quiz', '自测'], ['p6-vienna', '珍宝库任务']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="p6-intro">
        <div class="card phys">
          <p class="intro-hook">"一斤铁和一斤棉花，哪个重？"——一样重。可为什么总有人觉得铁重？<br>
          因为铁<b>又小又沉</b>、棉花<b>又大又轻</b>。同样质量下，谁的体积小、谁就"密"。这个"密"，物理上叫<b>密度</b>——它是每种物质的<b>身份证</b>。</p>
          <p class="hint">这一章你会用虚拟天平和量筒亲手测密度，最后当一回阿基米德，验一验你在珍宝库见过的那顶皇冠是不是纯金。</p>
        </div>
      </section>

      <section id="p6-mass">
        <div class="sec-title"><span class="em">🧱</span>质量 · 它什么时候都不变</div>
        <div class="split">
          <div class="card">
            <div class="chips" id="p6-massmode">
              <button class="chip on" data-m="clay">橡皮泥捏扁</button>
              <button class="chip" data-m="ice">冰化成水</button>
              <button class="chip" data-m="moon">带上月球</button>
            </div>
            <svg id="p6-masssvg" style="width:100%;height:150px" viewBox="0 0 300 150"></svg>
            <p class="small" id="p6-masscap"></p>
          </div>
          <div class="card">
            <div id="p6-massguess"></div>
            <div id="p6-massmsg"><p class="hint">质量 = 物体所含<b>物质的多少</b>。改变形状、状态、甚至位置，物质的量没变，质量就不变。单位：千克(kg)、克(g)、吨(t)。</p></div>
          </div>
        </div>
      </section>

      <section id="p6-balance">
        <div class="sec-title"><span class="em">⚖️</span>虚拟天平 · 测出这块橡皮多少克</div>
        <div class="split">
          <div class="card">
            <div id="p6-balbox"></div>
          </div>
          <div class="card">
            <div id="p6-balmsg"><p class="hint">目标：把右盘砝码 + 游码调到和左边橡皮平衡，读出它的质量。</p></div>
            <details style="margin-top:8px" open><summary class="hint">天平使用流程（照着做）</summary>
              <ol class="small" style="padding-left:18px;line-height:1.85">
                <li>天平放<b>水平</b>台上，游码拨到<b>零</b>刻度</li>
                <li>调两端平衡螺母，让指针指<b>中央</b>（左偏右移、右偏左移）</li>
                <li><b>左物右码</b>：物体放左盘，砝码放右盘</li>
                <li>镊子夹砝码，<b>从大到小</b>加；最后用游码微调</li>
                <li>读数 = 砝码总质量 + 游码示数</li>
              </ol></details>
            <details style="margin-top:6px"><summary class="hint">如果"左码右物"放反了会怎样？</summary>
              <p class="small">用了游码时，放反会让读数<b>偏大</b>。因为正确时 物 = 砝码 + 游码；放反后 物 = 砝码 − 游码。差了两个游码的量。所以务必左物右码。</p></details>
          </div>
        </div>
      </section>

      <section id="p6-density">
        <div class="sec-title"><span class="em">🪪</span>密度 · 物质的身份证</div>
        <div class="split">
          <div class="card">
            <h3>开场对决：1kg 铁 vs 1kg 棉花</h3>
            <svg id="p6-duelsvg" style="width:100%;height:140px" viewBox="0 0 300 140"></svg>
            <div id="p6-duelguess"></div>
          </div>
          <div class="card">
            <h3>发现"属性"：测三块，比一比</h3>
            <div class="chips" id="p6-matmode"><button class="chip on" data-m="铝">铝块</button><button class="chip" data-m="铁">铁块</button></div>
            <table class="fill lens" id="p6-rhotable"></table>
            <p class="small" id="p6-rhomsg"></p>
            <div class="btnrow"><button class="btn" id="p6-cake">🍰 把最大那块切一半</button></div>
            <p class="small" id="p6-cakecap"></p>
          </div>
        </div>
      </section>

      <section id="p6-drain">
        <div class="sec-title"><span class="em">💧</span>量筒与排水法 · 测出不规则石块的密度</div>
        <div class="split">
          <div class="card">
            <h3>量筒读数：视线要平齐</h3>
            <svg id="p6-cylsvg" style="width:100%;height:180px" viewBox="0 0 300 210"></svg>
            <div class="chips" id="p6-cylsight">
              <button class="chip on" data-s="0">平视（正确）</button><button class="chip" data-s="1">俯视</button><button class="chip" data-s="-1">仰视</button>
            </div>
            <p class="small" id="p6-cylcap"></p>
          </div>
          <div class="card">
            <div id="p6-cylguess"></div>
            <hr class="divider">
            <h3>石块测密度（先天平，后量筒）</h3>
            <div id="p6-drainstep"></div>
            <div id="p6-drainmsg"></div>
          </div>
        </div>
        <div class="card">
          <h3>🔍 误差找茬 · 测出的 ρ 偏大还是偏小？</h3>
          <div id="p6-errbox"></div>
          <div id="p6-errmsg"></div>
        </div>
      </section>

      <section id="p6-crown">
        <div class="sec-title"><span class="em">👑</span>阿基米德 · 皇冠疑案</div>
        <div class="card">
          <p class="small"><b>第一幕：</b>两千年前，国王叫金匠打了顶纯金王冠，又怀疑金匠掺了银子偷金子。王冠不能砸、不能熔，怎么验？阿基米德泡进浴缸时看见水溢出——<b>溢出的水的体积，就是王冠的体积</b>！他喊着"Eureka（我知道了）"光身子跑上了街。</p>
          <p class="small"><b>第二幕：你来断案。</b>纯金密度 <b>19.3</b> g/cm³、纯银 <b>10.5</b> g/cm³。称得王冠质量 <b>965 g</b>，用排水法测体积：</p>
          <svg id="p6-crownsvg" style="width:100%;height:120px" viewBox="0 0 320 120"></svg>
          <div id="p6-crownstep"></div>
          <div id="p6-crownmsg"></div>
        </div>
      </section>

      <section id="p6-poker">
        <div class="sec-title"><span class="em">🃏</span>密度扑克 · 三种用法</div>
        <div id="p6-pokerbox"></div>
        <div id="p6-pokermsg"></div>
      </section>

      <section id="p6-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡（讲透卡）</div>
        <div id="p6-cardlist"></div>
      </section>

      <section id="p6-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 10 题</div>
        <div class="card">
          <p>质量不变性、天平读数、密度属性、单位换算、量筒视差、测量误差方向、空心与鉴别——考点全覆盖。错题进错因本。</p>
          <p class="hint" id="p6-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="p6-quizgo">开始自测</button></div>
          <div id="p6-quizbox"></div>
        </div>
      </section>

      <section id="p6-vienna">
        <div class="sec-title"><span class="em">👑</span>珍宝库任务 · 跨学科实践</div>
        <div id="p6-viennabox"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c => c.addEventListener('click', () => { const t = document.getElementById(c.dataset.to); if (t) t.scrollIntoView({ block: 'start' }); }));

    /* ============ ① 质量不变性 ============ */
    (function massLab() {
      const svg = $('p6-masssvg'); let mode = 'clay', revealed = false;
      const SC = {
        clay: ['一块橡皮泥，从圆球捏成一条', '🔵 → 〰️', '形状变了，物质没多没少 → 质量不变（都是 50 g）。'],
        ice: ['一块冰，化成一滩水', '🧊 → 💧', '状态变了（固→液），水分子一个没跑 → 质量不变。体积却变了（冰化水体积变小）。'],
        moon: ['把月饼从地球带到月球', '🌍 → 🌕', '位置变了，甚至"变轻"了（月球引力小、重力变小）——但质量不变，还是那么多物质。质量 ≠ 重量。']
      };
      function draw() {
        const d = SC[mode];
        svg.innerHTML = '';
        el(svg, 'text', { x: 150, y: 66, 'font-size': 40, 'text-anchor': 'middle' }, d[1]);
        if (revealed) {
          el(svg, 'text', { x: 150, y: 112, 'font-size': 13, 'text-anchor': 'middle', fill: '#15803d' }, '质量：50 g　→　50 g　✓ 不变');
          $('p6-masscap').innerHTML = '<b>' + d[0] + '</b>：' + d[2];
        } else {
          el(svg, 'text', { x: 150, y: 112, 'font-size': 12, 'text-anchor': 'middle', fill: '#8b8271' }, '质量：50 g　→　? g');
          $('p6-masscap').innerHTML = '<b>' + d[0] + '</b>：物质是变多、变少，还是没变？先在右边猜一猜，再揭晓。';
        }
      }
      $('p6-massmode').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p6-massmode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); mode = b.dataset.m; draw(); Y.ev('act:p6.mass'); });
      $('p6-massguess').appendChild(Y.guess({
        q: '先猜：把一块冰化成水（或橡皮泥捏扁、月饼带上月球），它的质量会：', options: ['不变', '变小', '变大'], answer: 0,
        reveal: '揭晓了——把上面三个场景都切一遍：形状、状态、位置怎么变，质量都不变，因为"物质的多少"没变。',
        onDone: () => { revealed = true; draw(); Y.ev('act:p6.mass'); }
      }));
      draw();
    })();

    /* ============ ② 天平 ============ */
    (function balanceLab() {
      // 先猜：平衡螺母调节方向（左偏右移）
      const balCard = $('p6-balmsg').parentElement;
      balCard.insertBefore(Y.guess({
        q: '称量前先调平衡：天平放好后指针偏向左边（左盘那端低），两端的平衡螺母该往哪移，才能让指针回中央？',
        options: ['向右移', '向左移', '不用动，直接称'], answer: 0,
        reveal: '<b>左偏右移、右偏左移</b>——螺母往指针偏的反方向调。这一步要在放物、加砝码之前调好，中途不能再碰螺母。'
      }), $('p6-balmsg'));
      window.LabKit.balance($('p6-balbox'), {
        leftMass: 34.6, objLabel: '橡皮', weightSet: [20, 10, 5, 5, 2, 1], riderMax: 5, riderStep: 0.2,
        onBalance: r => { $('p6-balmsg').innerHTML = `<div class="explain">⚖️ 平衡了！这块橡皮的质量 = <b>${r.toFixed(1)} g</b>（砝码 + 游码）。<br>你已经把天平流程走了一遍：<b>放平→游码归零→调平衡螺母→左物右码→加减砝码→读数</b>。学校实验课你会是手最稳的那个。</div>`; Y.ev('act:p6.balance'); }
      });
    })();

    /* ============ ③ 密度：属性 ============ */
    (function densityLab() {
      // 开场对决（先猜后揭示，不提前剧透"平衡"）
      const dsvg = $('p6-duelsvg');
      function drawDuel(revealed) {
        dsvg.innerHTML = `
          <rect x="146" y="30" width="8" height="80" fill="#b8ae97"/><rect x="110" y="112" width="80" height="8" rx="3" fill="#a99f88"/>
          <line x1="70" y1="45" x2="230" y2="45" stroke="#6b6350" stroke-width="4"/>
          <rect x="58" y="58" width="24" height="16" rx="2" fill="#9aa7b0" stroke="#6b7680"/><text x="70" y="90" font-size="10" text-anchor="middle" fill="#57503f">铁 1kg（小）</text>
          <ellipse cx="218" cy="60" rx="30" ry="20" fill="#f4efe3" stroke="#d8cfba"/><text x="218" y="90" font-size="10" text-anchor="middle" fill="#57503f">棉花 1kg（大）</text>
          ${revealed ? '<text x="150" y="132" font-size="11" text-anchor="middle" fill="#15803d">⚖️ 平衡：质量相同，体积悬殊</text>'
            : '<text x="150" y="132" font-size="12" text-anchor="middle" fill="#8b8271">⚖️ 哪端会往下沉？先猜 →</text>'}`;
      }
      drawDuel(false);
      $('p6-duelguess').appendChild(Y.guess({
        q: '天平两端：一边 1kg 铁、一边 1kg 棉花。天平会：', options: ['保持平衡（一样重）', '铁那端下沉', '棉花那端下沉'], answer: 0,
        reveal: '一样重！区别在体积：铁一小块、棉花一大包。同样质量、体积差这么多——差的这个量就是密度。',
        onDone: () => drawDuel(true)
      }));
      // 属性发现：先猜 → 逐块测量 → 自己看比值 → 规律自述 → 才揭示密度
      const DATA = { 铝: [[10, 27], [20, 54], [40, 108]], 铁: [[10, 79], [20, 158], [40, 316]] };
      let mat = '铝', halved = false, measured = {}, discovered = false;
      function drawTable() {
        const rows = DATA[mat].map((d, i) => {
          const [v, m] = d;
          if (!discovered && !measured[mat + i]) return `<tr><td>${i + 1}</td><td colspan="3"><button class="wbtn" data-measure="${i}">📏 测量第 ${i + 1} 块</button></td></tr>`;
          const cut = (discovered && halved && i === 2), vv = cut ? v / 2 : v, mm = cut ? m / 2 : m, rr = (mm / vv).toFixed(1);
          return `<tr${cut ? ' class="litrow"' : ''}><td>${i + 1}${cut ? '(切半)' : ''}</td><td>${mm}</td><td>${vv}</td><td><b>${rr}</b></td></tr>`;
        }).join('');
        $('p6-rhotable').innerHTML = `<tr><th>块</th><th>质量 m/g</th><th>体积 V/cm³</th><th>m/V</th></tr>${rows}`;
        if (discovered) {
          $('p6-rhomsg').innerHTML = `<b>密度 ρ = m/V。</b>${mat}块无论大小，m/V 都 ≈ <b>${RHO[mat]} g/cm³</b>——这个比值只跟<b>物质种类</b>有关，跟质量、体积都无关，所以说密度是物质的"身份证"。<br><span style="color:var(--muted)">还记得 p1 的速度 v=路程/时间 吗？ρ=质量/体积。<b>"比值定义"</b>是物理造概念的看家本领，这是你第二次遇到。换成铁块再点"测量"，验一验规律照样成立。</span>`;
          return;
        }
        const allM = DATA[mat].every((_, i) => measured[mat + i]);
        if (!allM) { $('p6-rhomsg').innerHTML = `三块大小不同的${mat}块——逐块点"测量"，把每块的 m/V 算出来。<b>先猜猜：三个比值会一样吗？</b>`; return; }
        $('p6-rhomsg').innerHTML = `三块都测了：m/V 分别是 ${DATA[mat].map(d => (d[1] / d[0]).toFixed(1)).join('、')}，<b>全都 ≈ ${RHO[mat]}</b>！那么这个比值到底由什么决定？
          <div class="chips" id="p6-rulepick" style="margin-top:6px"><button class="chip" data-v="mat">只跟物质种类有关</button><button class="chip" data-v="size">跟块的大小有关</button><button class="chip" data-v="mass">跟质量多少有关</button></div>`;
        $('p6-rulepick').addEventListener('click', e => {
          const b = e.target.closest('.chip'); if (!b) return; const ok = b.dataset.v === 'mat';
          $('p6-rulepick').querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad')); b.classList.add(ok ? 'on' : 'bad');
          if (ok) { discovered = true; drawTable(); Y.ev('act:p6.density'); }
          else b.insertAdjacentHTML('afterend', '');
        });
      }
      $('p6-rhotable').addEventListener('click', e => { const b = e.target.closest('[data-measure]'); if (!b) return; measured[mat + (+b.dataset.measure)] = true; drawTable(); });
      $('p6-matmode').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p6-matmode').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); mat = b.dataset.m; halved = false; drawTable(); });
      $('p6-cake').addEventListener('click', () => {
        if (!discovered) { $('p6-cakecap').innerHTML = '先把上面三块测完、找到规律，再来切蛋糕验证～'; return; }
        halved = !halved; drawTable(); $('p6-cakecap').innerHTML = halved ? '切一半：质量减半、体积也减半，<b>m/V 岿然不动</b>。密度是物质属性，不随质量、体积改变。' : '';
      });
      drawTable();
    })();

    /* ============ ④ 量筒 + 排水法 + 误差 ============ */
    (function drainLab() {
      // 量筒读数
      const cyl = window.LabKit.cylinder($('p6-cylsvg'), { max: 100, volume: 46, parallax: 4, onRead: null });
      $('p6-cylsight').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return; $('p6-cylsight').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        const s = +b.dataset.s; cyl.setSight(s);
        $('p6-cylcap').innerHTML = s === 0 ? '<b style="color:var(--ok)">平视：视线与凹液面最低处相平，读数 46 mL，准确。</b>'
          : s > 0 ? '<b style="color:var(--bad)">俯视（从上往下斜看）→ 读数偏<b>大</b>。</b>　口诀同温度计：俯大仰小。'
          : '<b style="color:var(--bad)">仰视（从下往上斜看）→ 读数偏<b>小</b>。</b>　口诀：俯大仰小。';
        if (s !== 0) Y.ev('act:p6.cylinder');
      });
      $('p6-cylguess').appendChild(Y.guess({
        q: '先猜：读量筒时"仰视"（视线从下往上斜），读出的体积会偏大还是偏小？', options: ['偏小', '偏大', '不受影响'], answer: 0,
        reveal: '点上面"仰视"看视线怎么歪——和温度计一样，俯大仰小。读数看凹液面最低处、视线平齐才准。'
      }));
      // 排水法：①②③读数给出，④⑤让她自己算（选择），不直接把结果摆出来
      const drainBox = $('p6-drainstep');
      let dstep = 0;   // 0 待算④, 1 待算⑤, 2 完成
      function wire(boxId, correct, msgId, onOk) {
        const w = $(boxId); if (!w) return;
        w.addEventListener('click', e => {
          const b = e.target.closest('.chip'); if (!b) return; const ok = b.dataset.v === correct;
          w.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad')); b.classList.add(ok ? 'on' : 'bad');
          $(msgId).innerHTML = ok ? ' <b style="color:var(--ok)">✓</b>' : ' <b style="color:var(--bad)">再算算</b>';
          if (ok) setTimeout(onOk, 350);
        });
      }
      function drawDrain() {
        let h = `<div class="taskline done"><span class="tk">✓</span><span>① 天平称石块质量：m = <b>79 g</b>（读数）</span></div>
          <div class="taskline done"><span class="tk">✓</span><span>② 量筒装水读体积：V₁ = <b>40 mL</b>（读数）</span></div>
          <div class="taskline done"><span class="tk">✓</span><span>③ 石块浸没后读体积：V₂ = <b>60 mL</b>（读数）</span></div>`;
        if (dstep >= 1) h += `<div class="taskline done"><span class="tk">✓</span><span>④ 石块体积 V = V₂ − V₁ = 60 − 40 = <b>20 cm³</b></span></div>`;
        if (dstep >= 2) h += `<div class="taskline done"><span class="tk">✓</span><span>⑤ 密度 ρ = m ÷ V = 79 ÷ 20 = <b>3.95 g/cm³</b></span></div>`;
        if (dstep === 0) h += `<p class="small" style="margin-top:6px">④ 该你算了：石块体积 V = V₂ − V₁ = 60 − 40 = ?<span id="p6-dq1m"></span></p>
          <div class="chips" id="p6-dq1"><button class="chip" data-v="20">20 cm³</button><button class="chip" data-v="100">100 cm³</button><button class="chip" data-v="50">50 cm³</button></div>`;
        else if (dstep === 1) h += `<p class="small" style="margin-top:6px">⑤ 再算密度：ρ = m ÷ V = 79 ÷ 20 ≈ ?（g/cm³）<span id="p6-dq2m"></span></p>
          <div class="chips" id="p6-dq2"><button class="chip" data-v="3.95">3.95</button><button class="chip" data-v="1580">1580</button><button class="chip" data-v="0.25">0.25</button></div>`;
        drainBox.innerHTML = h;
        if (dstep === 0) wire('p6-dq1', '20', 'p6-dq1m', () => { dstep = 1; drawDrain(); });
        else if (dstep === 1) wire('p6-dq2', '3.95', 'p6-dq2m', () => { dstep = 2; drawDrain(); $('p6-drainmsg').innerHTML = '<div class="explain">V 和 ρ 都是你自己算出来的。关键顺序：<b>先天平称质量、后量筒测体积</b>——反了的话石块沾水再上天平，质量偏大。排水法的灵魂：<b>浸没物体，涨上来的水的体积 = 物体体积</b>。</div>'; Y.ev('act:p6.drainage'); });
      }
      drawDrain();
      // 误差找茬
      const ERR = [
        ['测固体：先量筒测体积，再把沾了水的石块放上天平称质量', 'big', 'm 偏大 → ρ = m/V 偏大'],
        ['读"石块放入后"的水面 V₂ 时俯视', 'small', 'V₂ 偏大 → V=V₂−V₁ 偏大 → ρ 偏小'],
        ['砝码用久生锈、变重了（实际比标称重）', 'small', '平衡时 物体=砝码实际质量，但你读的是较小的标称值 → 记录质量偏小 → ρ 偏小'],
        ['测液体：把烧杯里的液体全倒进量筒（杯壁有残留），用"总质量÷量筒读数"', 'big', '量筒里体积偏小、却用了全部质量 → ρ 偏大']
      ];
      const errState = {};
      $('p6-errbox').innerHTML = ERR.map((er, i) =>
        `<div class="liferow"><span style="flex:1;min-width:160px">${er[0]}</span>
          <div class="chips" data-i="${i}" style="margin:0"><button class="chip" data-v="big">ρ 偏大</button><button class="chip" data-v="small">ρ 偏小</button></div>
          <span id="p6-erm-${i}"></span></div>`).join('');
      $('p6-errbox').querySelectorAll('.chips').forEach(ch => ch.addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return; const i = +ch.dataset.i;
        ch.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
        const ok = b.dataset.v === ERR[i][1]; b.classList.add(ok ? 'on' : 'bad');
        $('p6-erm-' + i).innerHTML = ok ? `<b style="color:var(--ok)">✓ ${ERR[i][2]}</b>` : '<b style="color:var(--bad)">再想想</b>';
        if (ok) errState[i] = true;
        if (Object.keys(errState).length === 4) { $('p6-errmsg').innerHTML = '<div class="stdline">四道全对！误差分析的通法：把每一步"读到的值"和"真实值"比大小，代进 ρ=m/V，看比值往哪偏。</div>'; Y.ev('act:p6.error'); }
      }));
    })();

    /* ============ ⑤ 皇冠疑案 ============ */
    (function crownLab() {
      const svg = $('p6-crownsvg');
      svg.innerHTML = `
        <rect x="10" y="70" width="120" height="45" rx="4" fill="#f7fbff" stroke="#9db4c0"/>
        <rect x="12" y="88" width="116" height="25" fill="rgba(76,129,191,.28)"/>
        <text x="70" y="64" font-size="10" text-anchor="middle" fill="#8b8271">放入前 V₁=200mL</text>
        <rect x="190" y="70" width="120" height="45" rx="4" fill="#f7fbff" stroke="#9db4c0"/>
        <rect x="192" y="80" width="116" height="33" fill="rgba(76,129,191,.28)"/>
        <text x="250" y="64" font-size="10" text-anchor="middle" fill="#8b8271">放入皇冠 V₂=260mL</text>
        <text x="250" y="100" font-size="16" text-anchor="middle">👑</text>
        <text x="160" y="40" font-size="13" text-anchor="middle" fill="#b7791f" font-weight="700">👑 王冠 m = 965 g</text>`;
      const box = $('p6-crownstep');
      box.innerHTML = `
        <p class="small">王冠体积 V = V₂ − V₁ = 260 − 200 = <b>60 cm³</b>。它的密度 ρ = m/V = 965 / 60 ≈ ?（先自己算）</p>
        <div class="chips" id="p6-crownopts">
          <button class="chip" data-v="a">≈ 16.1 g/cm³</button><button class="chip" data-v="b">≈ 19.3 g/cm³</button><button class="chip" data-v="c">≈ 10.5 g/cm³</button>
        </div>`;
      $('p6-crownopts').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return; const ok = b.dataset.v === 'a';
        $('p6-crownopts').querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad')); b.classList.add(ok ? 'on' : 'bad');
        if (ok) {
          $('p6-crownmsg').innerHTML = `<div class="explain">ρ = 965 ÷ 60 ≈ <b>16.1 g/cm³</b>。它<b>不等于纯金的 19.3</b>，落在了金(19.3)和银(10.5)<b>之间</b>——<b>王冠掺假实锤！</b>金匠动了手脚。<br><b>第三幕：</b>你今年夏天在维也纳皇家珍宝库亲眼看过神圣罗马帝国的皇冠——如果让你验它是不是纯金，你现在知道该怎么办了：称质量、排水测体积、算密度，比一比。</div>
            <details style="margin-top:8px"><summary class="hint">🧗 选做挑战：金匠到底掺了多少银？（初二拔高，先自己列式）</summary>
              <p class="small">设金的体积 V金、银的体积 V银，列两个方程：<br>
              ① 体积和：V金 + V银 = 60<br>
              ② 质量和：19.3·V金 + 10.5·V银 = 965<br>
              解这个二元一次方程组 → V金 ≈ 38.1 cm³、V银 ≈ 21.9 cm³。<br>
              再换成质量：金 ≈ <b>735 g</b>、银 ≈ <b>230 g</b>——金匠偷偷用约 <b>230 g 银</b>替掉了金，占了总质量近四分之一。难怪阿基米德一验就露馅。</p></details>`;
          Y.ev('act:p6.crown');
        } else $('p6-crownmsg').innerHTML = '<div class="small" style="color:var(--warn)">再算一次：965 ÷ 60 ≈ 16.1。（点别的试试）</div>';
      });
    })();

    /* ============ ⑥ 密度扑克 ============ */
    (function pokerLab() {
      const CARDS = [
        { q: '鉴别：一块金属 m=89 g，V=10 cm³，ρ=? 是什么？', opts: ['8.9 g/cm³，铜', '7.9 g/cm³，铁', '2.7 g/cm³，铝'], a: 0, why: 'ρ=89/10=8.9 g/cm³，查表是铜。' },
        { q: '间接测质量：一根钢梁 V=0.5 m³，钢的密度 7.9×10³ kg/m³，质量是？（不用称）', opts: ['3950 kg', '395 kg', '15.8 kg'], a: 0, why: 'm=ρV=7.9×10³×0.5=3950 kg。密度能让你"不称就知重"。' },
        { q: '空心判断：一个铁球 m=79 g，体积 V=20 cm³。它是实心还是空心？（铁 ρ=7.9）', opts: ['空心（该有体积只需 10 cm³）', '实心', '无法判断'], a: 0, why: '若实心，V应=m/ρ=79/7.9=10 cm³；实测 20 cm³ 比它大 → 里面有空 → 空心。' }
      ];
      let ci = 0, done = 0;
      const box = $('p6-pokerbox');
      function drawCard() {
        if (ci >= CARDS.length) { box.innerHTML = '<div class="stdline">🎉 密度扑克通关！鉴别物质、间接测质量、判断空心——密度的三大用法你都会了。</div>'; return; }
        const c = CARDS[ci];
        box.innerHTML = `<div class="card"><p><b>第 ${ci + 1}/${CARDS.length} 张</b>　${c.q}</p><div class="chips" id="p6-pkopts">${c.opts.map((o, i) => `<button class="chip" data-i="${i}">${o}</button>`).join('')}</div><p class="small" id="p6-pkfb"></p></div>`;
        $('p6-pkopts').addEventListener('click', e => {
          const b = e.target.closest('.chip'); if (!b) return; const ok = +b.dataset.i === c.a;
          $('p6-pkopts').querySelectorAll('.chip').forEach(x => x.classList.remove('on', 'bad')); b.classList.add(ok ? 'on' : 'bad');
          $('p6-pkfb').innerHTML = (ok ? '<b style="color:var(--ok)">✓ </b>' : '<b style="color:var(--bad)">再想想：</b>') + c.why + (ok ? '　（马上跳下一张…）' : '');
          if (ok) { done++; if (done === CARDS.length) Y.ev('act:p6.poker'); setTimeout(() => { ci++; drawCard(); }, 950); }
        });
      }
      drawCard();
    })();

    /* ============ 讲透卡 ============ */
    const FIGrho = () => `<svg viewBox="0 0 300 120" style="max-width:300px">
      <text x="150" y="16" font-size="11" font-weight="700" text-anchor="middle" fill="#27231b">同种物质：m 与 V 成正比，斜率=ρ</text>
      <line x1="40" y1="105" x2="285" y2="105" stroke="#57503f" stroke-width="1.3"/><line x1="40" y1="105" x2="40" y2="20" stroke="#57503f" stroke-width="1.3"/>
      <text x="286" y="118" font-size="9" fill="#8b8271" text-anchor="end">V</text><text x="30" y="24" font-size="9" fill="#8b8271">m</text>
      <line x1="40" y1="105" x2="230" y2="35" stroke="#0f766e" stroke-width="2.2"/><text x="235" y="40" font-size="9.5" fill="#0f766e">铁(陡)</text>
      <line x1="40" y1="105" x2="250" y2="72" stroke="#4c51bf" stroke-width="2.2"/><text x="255" y="76" font-size="9.5" fill="#4c51bf">铝(缓)</text>
      <text x="150" y="118" font-size="9" fill="#8b8271" text-anchor="middle">越陡＝密度越大；同一条线上 ρ 处处相同</text></svg>`;

    window.ExplainKit.cards($('p6-cardlist'), [
      { emoji: '🧱', title: '质量及其不变性', rule: '质量＝物体所含物质的多少，用 m 表示。单位：千克(kg)、克(g)、吨(t)。1t=1000kg，1kg=1000g。',
        steps: [{ t: '形状变（橡皮泥捏扁）', r: '质量不变' }, { t: '状态变（冰化水）、位置变（上月球）', r: '质量都不变', key: true }],
        trap: '质量 ≠ 重量。到月球上重力变小（"变轻"），但质量不变。质量是物体自身的属性。' },
      { emoji: '⚖️', title: '天平的使用', rule: '流程：放水平 → 游码归零 → 调平衡螺母使指针居中 → 左物右码 → 镊子加减砝码(大到小) → 读数=砝码+游码。',
        steps: [{ t: '调平衡螺母', r: '左偏右移、右偏左移' }, { t: '读数 = 砝码总质量 + 游码示数', r: '别漏游码', key: true }],
        trap: '① 左物右码不能反（用游码时放反会偏大）；② 砝码要用镊子夹、不能手拿（汗液生锈变重）；③ 潮湿/有腐蚀的东西要放容器里称。' },
      { emoji: '🪪', title: '密度是物质的属性', rule: '密度 ρ = m/V（质量÷体积），反映物质"疏密"。同种物质 ρ 相同，<b>不随质量、体积改变</b>——它是物质的"身份证"。', fig: FIGrho,
        steps: [{ t: '一块铁切成两半', r: 'm、V 都减半，ρ 不变' }, { t: 'ρ 只跟物质种类（和状态/温度）有关', r: '比值定义，回链 p1 速度 v=s/t', key: true }],
        trap: '"大铁块密度比小铁块大"是错的——密度和大小无关。铁比棉花"重"，说的其实是铁的密度大。' },
      { emoji: '🔁', title: '密度单位与换算', rule: '国际单位 kg/m³，常用 g/cm³。换算：<b>1 g/cm³ = 1000 kg/m³</b>。水的密度 ρ水 = 1.0×10³ kg/m³ = 1 g/cm³，一定要记住。',
        steps: [{ t: 'g/cm³ → kg/m³', r: '×1000' }, { t: '1 m³ 的水 = 1000 kg = 1 吨', r: '体感：1.5L 水≈1.5kg', key: true }],
        trap: '换算方向别反：数值上 g/cm³ 的数比 kg/m³ 小 1000 倍（因为 1m³ 比 1cm³ 大 10⁶ 倍、1kg 比 1g 大 10³ 倍）。' },
      { emoji: '💧', title: '量筒与排水法', rule: '量筒读数看<b>凹液面最低处</b>、视线相平（俯视偏大、仰视偏小）。测不规则固体体积用<b>排水法</b>：V物 = V₂(放入后) − V₁(放入前)。',
        steps: [{ t: '先用天平称质量 m', r: '顺序！' }, { t: '后用量筒排水测体积 V', r: '反了石块沾水，m 偏大', key: true }],
        trap: '误差通法：把"读到的值"与真实值比大小，代入 ρ=m/V 看往哪偏。如石块带水称→m偏大→ρ偏大。' },
      { emoji: '🃏', title: '密度的三大应用', rule: '① 鉴别物质：测出 ρ 查表；② 间接求质量 m=ρV（钢梁多重不用称）；③ 间接求体积 V=m/ρ、判断空心（实测 V 比 m/ρ 大就是空心）。',
        why: '阿基米德验金冠用的就是"鉴别物质"：称质量、排水测体积、算密度，和纯金的 19.3 一比就知真假。你在维也纳珍宝库见过的皇冠，也能这么验。' }
    ]);

    /* ============ 自测 ============ */
    function bestLine() { const b = Y.quizBest('p6'); $('p6-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; }
    bestLine();
    $('p6-quizgo').addEventListener('click', () => {
      $('p6-quizgo').style.display = 'none';
      Y.quizStart($('p6-quizbox'), 'p6', () => { $('p6-quizgo').style.display = ''; $('p6-quizgo').textContent = '再测一次'; bestLine(); });
    });

    /* ============ 珍宝库任务卡 ============ */
    (function viennaLab() {
      const box = $('p6-viennabox');
      const ITEMS = [
        ['👑', 'k-crown', '珍宝库看皇冠', '拿年卡进 Kaiserliche Schatzkammer（皇家珍宝库），找到神圣罗马帝国皇冠，拍一张——它究竟是不是纯金？'],
        ['💧', 'k-water', '1.5L 矿泉水掂重', '超市拎一瓶 1.5L 矿泉水，感受它≈1.5 kg——水的密度 1 g/cm³ 的体感。'],
        ['☕', 'k-melange', 'Melange 咖啡分层', '维也纳 Melange 咖啡：奶泡浮在上面，因为它密度小。（为什么会浮是八下浮力，先种个直觉。）'],
        ['🥇', 'k-guess', '给皇冠估个密度', '如果能称能量，你会怎么验皇冠真假？把方法写下来（称 m、排水测 V、算 ρ 比 19.3）。']
      ];
      const t = Y.taskGet('p6.vienna');
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
          Y.taskSet('p6.vienna', { data: state, done: doneCnt >= 2 });
          if (doneCnt >= 2) Y.ev('act:p6.vienna');
          if (now) Y.toast('👑 珍宝库任务 +1', true);
        });
        body.appendChild(row);
      });
      box.appendChild(window.TaskKit.card({
        emoji: '👑', title: '珍宝库皇冠 · 阿基米德的实验（跨学科实践）',
        desc: '你夏天在珍宝库见过的皇冠，12 月这一章上线时照片会放进"皇冠疑案"。先见实物，再学怎么验它——完成 2 项即算过关。',
        done: t.done, body,
        onToggle: v => Y.taskSet('p6.vienna', { done: v })
      }));
    })();

    return { cleanup() {} };
  }
};
