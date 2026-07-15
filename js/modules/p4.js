/* p4 · 第四章 光现象 —— 直线传播/小孔成像、反射定律、平面镜成像、折射、色散。复用 optics-kit 光线思路，自绘为主。
   物理红线：反射角=入射角；平面镜等大等距虚像对称；折射空气侧角恒大（斯涅尔）；小孔像=烛焰形与孔形无关；
   红+绿=黄(加色)/颜料越混越黑(减色)；红光照绿叶→黑。角度交互用滑杆（实时联动=真动手）。 */
window.YJS_MODULES = window.YJS_MODULES || {};

window.YJS_MODULES.p4 = {
  id: 'p4', subject: 'phys', emoji: '🌈',
  title: '光现象', subtitle: '直线·反射·折射·色散 · 白光其实是彩虹',
  wave: 'M8',
  nodes: [
    { id: 'p4-n1', label: '光的直线传播·条件', needs: ['act:p4.line', 'q:p4q1'] },
    { id: 'p4-n2', label: '小孔成像·像与孔形无关', needs: ['act:p4.pinhole', 'q:p4q2'] },
    { id: 'p4-n3', label: '光的反射定律', needs: ['act:p4.reflect', 'q:p4q3'] },
    { id: 'p4-n4', label: '镜面反射与漫反射', needs: ['act:p4.diffuse', 'q:p4q4'] },
    { id: 'p4-n5', label: '平面镜成像·等大等距虚像', needs: ['act:p4.mirror', 'any:q:p4q5|q:p4q6'] },
    { id: 'p4-n6', label: '光的折射·空气角大', needs: ['act:p4.refract', 'q:p4q7'] },
    { id: 'p4-n7', label: '折射现象·叉鱼往下', needs: ['act:p4.fish', 'q:p4q8'] },
    { id: 'p4-n8', label: '光的色散·三棱镜', needs: ['act:p4.prism', 'q:p4q9'] },
    { id: 'p4-n9', label: '色光三原色·加色减色', needs: ['act:p4.mix', 'q:p4q10'] },
    { id: 'p4-n10', label: '物体的颜色', needs: ['act:p4.color', 'any:q:p4q11|q:p4q12'] },
    { id: 'p4-n11', label: '维也纳光学任务（RGB微距等）', needs: ['act:p4.vienna'] }
  ],
  taskIds: ['p4.vienna'],

  render(root, Y) {
    const $ = id => root.querySelector('#' + id);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (g, tag, attrs, txt) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k])); if (txt !== undefined) e.textContent = txt; g.appendChild(e); return e; };
    const D2R = Math.PI / 180;
    // 极坐标小弧线（标角度用）
    const arcPath = (cx, cy, r, a0, a1) => { const p = a => [cx + r * Math.cos(a), cy - r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M ${x0} ${y0} A ${r} ${r} 0 0 ${a1 > a0 ? 0 : 1} ${x1} ${y1}`; };

    root.innerHTML = `
      <nav class="secnav">
        ${[['p4-intro', '引入'], ['p4-line', '直线传播'], ['p4-reflect', '反射'], ['p4-mirror', '平面镜'],
        ['p4-refract', '折射'], ['p4-color', '色散混色'], ['p4-cards', '知识卡'], ['p4-quiz', '自测'], ['p4-vienna', '维也纳任务']]
        .map(s => `<button class="chip" data-to="${s[0]}">${s[1]}</button>`).join('')}
      </nav>

      <section id="p4-intro">
        <div class="card phys">
          <p class="intro-hook">光走直线，却能拐弯（反射）、能"折断"（折射）、还能把一束白光拆成一条彩虹（色散）。<br>
          这一章最颠覆的一句先剧透：<b>你看到的白光，其实是七种颜色混在一起的</b>；而<b>白色的屏幕，是红、绿、蓝三种小灯拼出来的</b>——等下用相机微距亲眼抓它。</p>
          <p class="hint">平面镜成像和数学的轴对称是同一套手艺（m15），这里数学和物理会握一次手。</p>
        </div>
      </section>

      <section id="p4-line">
        <div class="sec-title"><span class="em">🕯️</span>光沿直线传播 · 小孔成的像是什么形状</div>
        <div class="split">
          <div class="card">
            <svg id="p4-pinsvg" style="width:100%;height:180px" viewBox="0 0 320 180"></svg>
            <div class="benchbar">
              <span class="small">孔的形状</span>
              <div class="chips" id="p4-holeshape" style="margin:0">
                <button class="chip on" data-h="circle">● 圆</button>
                <button class="chip" data-h="tri">▲ 三角</button>
                <button class="chip" data-h="star">★ 星</button>
              </div>
            </div>
            <div class="benchbar"><span class="small">屏距</span><input type="range" id="p4-screendist" min="40" max="120" value="70" style="flex:1;max-width:170px"></div>
            <p class="small" id="p4-pincap"></p>
          </div>
          <div class="card">
            <div id="p4-pinguess"></div>
            <div id="p4-pinmsg"></div>
            <hr class="divider">
            <div class="chips" id="p4-linescene">
              <button class="chip on" data-s="pin">小孔成像</button>
              <button class="chip" data-s="shadow">影子</button>
              <button class="chip" data-s="eclipse">日月食</button>
            </div>
            <p class="small" id="p4-scenecap">光在<b>同种、均匀</b>介质中沿直线传播（条件不能丢）。影子、小孔成像、日月食都是它的证据。</p>
          </div>
        </div>
      </section>

      <section id="p4-reflect">
        <div class="sec-title"><span class="em">🪞</span>光的反射 · 入射角与反射角</div>
        <div class="split">
          <div class="card">
            <svg id="p4-refsvg" style="width:100%;height:180px" viewBox="0 0 300 180"></svg>
            <div class="benchbar"><span class="small">入射角</span><input type="range" id="p4-refang" min="0" max="80" value="40" style="flex:1;max-width:180px"><span class="small" id="p4-reflab"></span></div>
            <div class="chips" id="p4-refsurf">
              <button class="chip on" data-s="mirror">光滑镜面</button>
              <button class="chip" data-s="rough">粗糙表面（漫反射）</button>
            </div>
            <p class="small" id="p4-refcap"></p>
          </div>
          <div class="card"><div id="p4-refguess"></div><div id="p4-refmsg"></div></div>
        </div>
      </section>

      <section id="p4-mirror">
        <div class="sec-title"><span class="em">🕯️</span>平面镜成像 · 像会不会变小</div>
        <div class="split">
          <div class="card">
            <svg id="p4-mirsvg" style="width:100%;height:180px" viewBox="0 0 320 180"></svg>
            <div class="benchbar"><span class="small">蜡烛到镜面</span><input type="range" id="p4-mirdist" min="30" max="120" value="60" style="flex:1;max-width:180px"><span class="small" id="p4-mirlab"></span></div>
            <p class="small" id="p4-mircap"></p>
          </div>
          <div class="card">
            <div id="p4-mirguess"></div>
            <div id="p4-mirmsg"></div>
            <details style="margin-top:8px"><summary class="hint">学校实验的两个"为什么"</summary>
              <p class="small">① 为什么用<b>玻璃板</b>不用镜子？玻璃透明，能看到板后面，方便把"替身蜡烛"放到像的位置。<br>
              ② 为什么拿一支<b>一模一样</b>的蜡烛放到后面？它能和像完全重合 → 证明像与物<b>等大</b>，还能标出像的位置。<br>
              这套"对称找像"的手艺，和数学 m15 轴对称作图是同一套。</p></details>
          </div>
        </div>
      </section>

      <section id="p4-refract">
        <div class="sec-title"><span class="em">🎣</span>光的折射 · 叉鱼要往哪叉</div>
        <div class="split">
          <div class="card">
            <svg id="p4-frsvg" style="width:100%;height:180px" viewBox="0 0 300 180"></svg>
            <div class="benchbar"><span class="small">空气中入射角</span><input type="range" id="p4-frang" min="0" max="75" value="45" style="flex:1;max-width:170px"><span class="small" id="p4-frlab"></span></div>
            <p class="small" id="p4-frcap"></p>
          </div>
          <div class="card">
            <div id="p4-frguess"></div>
            <div id="p4-frmsg"></div>
            <hr class="divider">
            <h3>🐟 叉鱼小游戏</h3>
            <p class="small">水里有条鱼。你看到的位置其实是光折射后的<b>虚像</b>，未必是真鱼所在。先想想该往哪叉，再点你要下叉的地方：</p>
            <svg id="p4-fishsvg" style="width:100%;height:130px;cursor:crosshair" viewBox="0 0 300 130"></svg>
            <p class="small" id="p4-fishcap"></p>
          </div>
        </div>
      </section>

      <section id="p4-color">
        <div class="sec-title"><span class="em">🌈</span>色散与混色 · 白光里藏着彩虹</div>
        <div class="split">
          <div class="card">
            <h3>三棱镜：白光进，彩带出</h3>
            <svg id="p4-prismsvg" style="width:100%;height:150px" viewBox="0 0 300 150"></svg>
            <div id="p4-prismguess"></div>
            <p class="small" id="p4-prismcap"></p>
          </div>
          <div class="card">
            <h3>色光混色器（加色法）</h3>
            <svg id="p4-mixsvg" style="width:100%;height:150px;background:#111;border-radius:10px" viewBox="0 0 260 150"></svg>
            <div class="chips" id="p4-mixtoggle" style="justify-content:center;margin-top:8px">
              <button class="chip on" data-c="r">🔴 红灯</button>
              <button class="chip" data-c="g">🟢 绿灯</button>
              <button class="chip" data-c="b">🔵 蓝灯</button>
            </div>
            <p class="small" id="p4-mixcap"></p>
          </div>
        </div>
        <div class="split" style="margin-top:10px">
          <div class="card">
            <h3>颜料混色（减色法）· 对照</h3>
            <svg id="p4-pigsvg" style="width:100%;height:130px;background:#fff;border-radius:10px" viewBox="0 0 260 130"></svg>
            <p class="small">颜料是"减色"：每种颜料吸走一部分光，越混剩下的越少 → 越混<b>越黑</b>。和色光"越加越亮"正好相反。</p>
          </div>
          <div class="card">
            <h3>🎭 物体颜色小剧场</h3>
            <p class="small">给舞台换不同颜色的灯，先猜物体看起来什么色：</p>
            <div class="chips" id="p4-stagelight">
              <button class="chip on" data-l="white">⚪ 白光</button>
              <button class="chip" data-l="red">🔴 红光</button>
              <button class="chip" data-l="green">🟢 绿光</button>
              <button class="chip" data-l="blue">🔵 蓝光</button>
            </div>
            <svg id="p4-stagesvg" style="width:100%;height:110px" viewBox="0 0 300 110"></svg>
            <p class="small" id="p4-stagecap"></p>
          </div>
        </div>
      </section>

      <section id="p4-cards">
        <div class="sec-title"><span class="em">📇</span>标准表述卡（讲透卡）</div>
        <div id="p4-cardlist"></div>
      </section>

      <section id="p4-quiz">
        <div class="sec-title"><span class="em">🧪</span>自测 · 12 题</div>
        <div class="card">
          <p>小孔像形状、反射作图、平面镜等大与对称、折射方向与现象、三原色与物体颜色——考点全覆盖。错题进错因本。</p>
          <p class="hint" id="p4-quizbest"></p>
          <div class="btnrow"><button class="btn primary" id="p4-quizgo">开始自测</button></div>
          <div id="p4-quizbox"></div>
        </div>
      </section>

      <section id="p4-vienna">
        <div class="sec-title"><span class="em">📷</span>维也纳光学任务 · 跨学科实践</div>
        <div id="p4-viennabox"></div>
      </section>
    `;

    root.querySelectorAll('section').forEach(s => s.style.scrollMarginTop = '116px');
    root.querySelectorAll('.secnav .chip').forEach(c => c.addEventListener('click', () => { const t = document.getElementById(c.dataset.to); if (t) t.scrollIntoView({ block: 'start' }); }));

    /* ============ ① 小孔成像 + 直线传播 ============ */
    (function lineLab() {
      const svg = $('p4-pinsvg'); let shape = 'circle', screenDist = 70, revealed = false;
      const holePath = (cx, cy) => {
        if (shape === 'circle') return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="#fff"/>`;
        if (shape === 'tri') return `<polygon points="${cx},${cy - 4} ${cx - 4},${cy + 3} ${cx + 4},${cy + 3}" fill="#fff"/>`;
        return `<circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/>`; // 星用小亮点近似
      };
      function draw() {
        const objX = 40, holeX = 150, scrX = holeX + screenDist, axisY = 95, objH = 46;
        const imgH = objH * (scrX - holeX) / (holeX - objX);
        svg.innerHTML = `
          <line x1="6" y1="${axisY}" x2="294" y2="${axisY}" stroke="#e6dfd0" stroke-width="1"/>
          <rect x="${holeX - 3}" y="20" width="6" height="150" fill="#57503f"/>
          ${holePath(holeX, axisY)}
          <line x1="${objX}" y1="${axisY}" x2="${objX}" y2="${axisY - objH}" stroke="#b91c1c" stroke-width="3"/>
          <polygon points="${objX - 4},${axisY - objH} ${objX + 4},${axisY - objH} ${objX},${axisY - objH - 7}" fill="#f59e0b"/>
          <text x="${objX}" y="${axisY + 14}" font-size="10" fill="#b91c1c" text-anchor="middle">烛</text>
          <rect x="${scrX}" y="${axisY - imgH - 10}" width="4" height="${imgH * 2 + 20}" fill="#d8cfba"/>
          <line x1="${objX}" y1="${axisY - objH}" x2="${scrX}" y2="${axisY + imgH}" stroke="#f59e0b" stroke-width="1" opacity=".7"/>
          <line x1="${objX}" y1="${axisY}" x2="${scrX}" y2="${axisY - imgH}" stroke="#f59e0b" stroke-width="1" opacity=".5"/>
          <line x1="${scrX}" y1="${axisY}" x2="${scrX}" y2="${axisY + imgH}" stroke="#b91c1c" stroke-width="3"/>
          <polygon points="${scrX - 4},${axisY + imgH} ${scrX + 4},${axisY + imgH} ${scrX},${axisY + imgH + 7}" fill="#f59e0b"/>
          <text x="${scrX + 8}" y="${axisY + imgH}" font-size="9.5" fill="#8b8271">屏上的像</text>`;
        $('p4-pincap').innerHTML = revealed
          ? '不管孔是圆、三角还是星形，屏上的像永远是<b>倒立的烛焰形状</b>（孔够小时）。像的形状取决于<b>物</b>，不是孔。屏离得越远，像越大。'
          : '先在右边猜一猜，再把孔形切成三角、星形，亲眼看看屏上的像会不会跟着变形。';
      }
      $('p4-holeshape').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p4-holeshape').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); shape = b.dataset.h; revealed = true; draw(); Y.ev('act:p4.pinhole'); });
      $('p4-screendist').addEventListener('input', e => { screenDist = +e.target.value; draw(); });
      $('p4-pinguess').appendChild(Y.guess({
        q: '先猜：用一个<b>三角形</b>的小孔给烛焰成像，屏上的像是什么形状？', options: ['还是烛焰的形状（倒立）', '三角形', '烛焰和三角形的混合'], answer: 0,
        reveal: '把孔形切成三角、星形对比——像纹丝不动，还是那个倒立的烛焰。孔的形状不决定像的形状。',
        onDone: () => { revealed = true; draw(); }
      }));
      $('p4-linescene').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return; $('p4-linescene').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
        const s = b.dataset.s;
        $('p4-scenecap').innerHTML = s === 'pin' ? '光在同种均匀介质中沿直线传播（条件不能丢）。小孔成像正是直线传播的证据。'
          : s === 'shadow' ? '影子：光被不透明物体挡住、走不了直线，身后就留下暗区。手影游戏就是它。'
          : '日月食：太阳、月亮、地球恰好连成一条直线，一个挡住了另一个的光——又是直线传播。';
        Y.ev('act:p4.line');
      });
      draw();
    })();

    /* ============ ② 反射 ============ */
    (function reflectLab() {
      const svg = $('p4-refsvg'); let ang = 40, surf = 'mirror', revealed = false;
      function draw() {
        const cx = 150, my = 140, R = 105, NL = 95;
        const a = ang * D2R;
        const A = [cx - R * Math.sin(a), my - R * Math.cos(a)];   // 入射来向
        const B = [cx + R * Math.sin(a), my - R * Math.cos(a)];   // 反射去向
        let s = `<rect x="10" y="${my}" width="280" height="8" fill="#93b3c9"/>
          <line x1="10" y1="${my}" x2="290" y2="${my}" stroke="#4c81bf" stroke-width="2"/>
          <line x1="${cx}" y1="${my}" x2="${cx}" y2="${my - NL}" stroke="#8b8271" stroke-width="1.3" stroke-dasharray="5 4"/>
          <text x="${cx + 4}" y="${my - NL + 4}" font-size="10" fill="#8b8271">法线</text>`;
        if (surf === 'mirror') {
          s += `<line x1="${A[0]}" y1="${A[1]}" x2="${cx}" y2="${my}" stroke="#f59e0b" stroke-width="2.2"/>
            <polygon points="${(A[0] + cx) / 2},${(A[1] + my) / 2} ${(A[0] + cx) / 2 - 7},${(A[1] + my) / 2 - 2} ${(A[0] + cx) / 2 - 2},${(A[1] + my) / 2 + 7}" fill="#f59e0b"/>
            <line x1="${cx}" y1="${my}" x2="${B[0]}" y2="${B[1]}" stroke="#f59e0b" stroke-width="2.2"/>
            <path d="${arcPath(cx, my, 34, Math.PI / 2 + (Math.PI / 2 - a), Math.PI / 2)}" fill="none" stroke="#0f766e" stroke-width="1.5"/>
            <path d="${arcPath(cx, my, 34, Math.PI / 2, Math.PI / 2 - (Math.PI / 2 - a))}" fill="none" stroke="#b7791f" stroke-width="1.5"/>
            <text x="${cx - 30}" y="${my - 40}" font-size="11" fill="#0f766e">入射角 ${ang}°</text>
            <text x="${cx + 6}" y="${my - 40}" font-size="11" fill="#b7791f">反射角 ${revealed ? ang + '°' : '?'}</text>`;
          $('p4-refcap').innerHTML = revealed
            ? '<b>反射定律：</b>反射光线、入射光线、法线在<b>同一平面</b>；反射光线和入射光线分居法线两侧；<b>反射角 = 入射角</b>（都从法线量）。改入射角，两个角永远相等。'
            : '先在右边猜一猜反射角是多少，再拖动入射角滑杆——盯住两个角的度数，看它们有什么关系。';
        } else {
          // 漫反射：多条平行入射打到起伏表面，各自按法线反射→四散（但每条都守法）
          s = `<path d="M10 ${my} q 20 -12 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 20 0" fill="none" stroke="#4c81bf" stroke-width="2"/>` + s.split('法线</text>')[0].replace(/<rect[^>]*>|<line x1="10"[^>]*>/g, '') + '法线</text>';
          for (let k = 0; k < 5; k++) {
            const px = 60 + k * 45, na = (k % 2 ? -1 : 1) * (12 + k * 5) * D2R; // 各点法线略有偏
            const inA = [px - 70 * Math.sin(a + na), my - 70 * Math.cos(a + na)];
            const outA = [px + 70 * Math.sin(a - na), my - 70 * Math.cos(a - na)];
            s += `<line x1="${inA[0]}" y1="${inA[1]}" x2="${px}" y2="${my}" stroke="#f59e0b" stroke-width="1.4" opacity=".85"/>
              <line x1="${px}" y1="${my}" x2="${outA[0]}" y2="${outA[1]}" stroke="#f59e0b" stroke-width="1.4" opacity=".85"/>`;
          }
          $('p4-refcap').innerHTML = '漫反射：平行光射到<b>凹凸不平</b>的表面，每一小块的法线朝向不同，光就被反射到<b>四面八方</b>——但<b>每一条</b>都老老实实遵守"反射角=入射角"。<b>乱的是表面，不乱的是定律。</b>正因为漫反射，你才能从各个角度看见不发光的课本。';
        }
        svg.innerHTML = s;
        $('p4-reflab').textContent = ang + '°';
      }
      $('p4-refang').addEventListener('input', e => { ang = +e.target.value; revealed = true; draw(); Y.ev('act:p4.reflect'); });
      $('p4-refsurf').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p4-refsurf').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); surf = b.dataset.s; draw(); if (surf === 'rough') Y.ev('act:p4.diffuse'); });
      $('p4-refguess').appendChild(Y.guess({
        q: '先猜：一束光以入射角 30° 射到镜面，反射角是多少？', options: ['30°（等于入射角）', '60°（互余）', '90°'], answer: 0,
        reveal: '拖入射角滑杆，反射角永远跟它相等。注意两个角都是从"法线"量的，不是从镜面量的。',
        onDone: () => { revealed = true; draw(); }
      }));
      draw();
    })();

    /* ============ ③ 平面镜成像 ============ */
    (function mirrorLab() {
      const svg = $('p4-mirsvg'); let d = 60, revealed = false;
      function draw() {
        const mx = 165, baseY = 130, objH = 42, eye = [255, 55];
        const oT = [mx - d, baseY - objH], oB = [mx - d, baseY];
        const iT = [mx + d, baseY - objH], iB = [mx + d, baseY];
        // 两条光线：物顶点→镜面反射→眼；反向延长虚线到像顶点
        const hit1 = [mx, baseY - objH * 0.72];
        svg.innerHTML = `
          <rect x="${mx}" y="24" width="4" height="130" fill="#4c81bf"/>
          <line x1="${mx + 4}" y1="24" x2="${mx + 10}" y2="30" stroke="#93b3c9" stroke-width="1"/>
          <text x="${mx - 2}" y="20" font-size="9.5" fill="#4c81bf" text-anchor="middle">镜</text>
          <line x1="${oB[0]}" y1="${oB[1]}" x2="${oT[0]}" y2="${oT[1]}" stroke="#b91c1c" stroke-width="3"/>
          <polygon points="${oT[0] - 4},${oT[1]} ${oT[0] + 4},${oT[1]} ${oT[0]},${oT[1] - 7}" fill="#f59e0b"/>
          <text x="${oT[0]}" y="${baseY + 13}" font-size="10" fill="#b91c1c" text-anchor="middle">蜡烛</text>
          <line x1="${iB[0]}" y1="${iB[1]}" x2="${iT[0]}" y2="${iT[1]}" stroke="#b91c1c" stroke-width="2.4" stroke-dasharray="5 4" opacity=".75"/>
          <polygon points="${iT[0] - 4},${iT[1]} ${iT[0] + 4},${iT[1]} ${iT[0]},${iT[1] - 7}" fill="#f59e0b" opacity=".7"/>
          <text x="${iT[0]}" y="${baseY + 13}" font-size="10" fill="#8b8271" text-anchor="middle">${revealed ? '像(虚)' : '像'}</text>
          <line x1="${oT[0]}" y1="${oT[1]}" x2="${hit1[0]}" y2="${hit1[1]}" stroke="#f59e0b" stroke-width="1.6"/>
          <line x1="${hit1[0]}" y1="${hit1[1]}" x2="${eye[0]}" y2="${eye[1]}" stroke="#f59e0b" stroke-width="1.6"/>
          <line x1="${hit1[0]}" y1="${hit1[1]}" x2="${iT[0]}" y2="${iT[1]}" stroke="#8b8271" stroke-width="1" stroke-dasharray="4 3"/>
          <text x="${eye[0]}" y="${eye[1] + 5}" font-size="18" text-anchor="middle">👁️</text>
          <line x1="${oT[0]}" y1="${baseY + 20}" x2="${mx}" y2="${baseY + 20}" stroke="#0f766e" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="${mx}" y1="${baseY + 20}" x2="${iT[0]}" y2="${baseY + 20}" stroke="#0f766e" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="${(oT[0] + mx) / 2}" y="${baseY + 32}" font-size="9" fill="#0f766e" text-anchor="middle">${(d / 30 * 15).toFixed(0)}cm</text>
          <text x="${(mx + iT[0]) / 2}" y="${baseY + 32}" font-size="9" fill="#0f766e" text-anchor="middle">${(d / 30 * 15).toFixed(0)}cm</text>`;
        $('p4-mircap').innerHTML = revealed
          ? `蜡烛离镜 ${(d / 30 * 15).toFixed(0)}cm，像也在镜后 ${(d / 30 * 15).toFixed(0)}cm——<b>等距</b>；像和蜡烛<b>一样高</b>（等大），<b>正立虚像</b>，连线垂直镜面（对称）。`
          : `先在右边猜一猜，再拖滑杆改变蜡烛到镜的距离——量一量像到镜的距离、比一比像的高矮，自己找规律。`;
        $('p4-mirlab').textContent = (d / 30 * 15).toFixed(0) + 'cm';
      }
      $('p4-mirdist').addEventListener('input', e => { d = +e.target.value; revealed = true; draw(); Y.ev('act:p4.mirror'); });
      $('p4-mirguess').appendChild(Y.guess({
        q: '先猜：照镜子时你往后退，镜子里的像会怎样？', options: ['大小不变，只是离镜面也变远了', '像变小了', '像变大了'], answer: 0,
        reveal: '拖滑杆让蜡烛远离镜面——像同步后退、始终等大。"看起来变小"只是视角变了，像本身没变。',
        onDone: () => { revealed = true; draw(); $('p4-mirmsg').innerHTML = '<div class="explain">平面镜成像四特点：<b>等大、等距、正立、虚像</b>，物与像关于镜面<b>对称</b>。像是反射光线的反向延长线交成的，光屏接不到（虚像）。远处的人在镜里"变小"，是视角变小的错觉，不是像真的变小。</div>'; }
      }));
      draw();
    })();

    /* ============ ④ 折射 + 叉鱼 ============ */
    (function refractLab() {
      const svg = $('p4-frsvg'); let ai = 45, revealed = false;
      function draw() {
        const cx = 150, sy = 80, R = 70, n = 1.33;
        const ar = Math.asin(Math.min(1, Math.sin(ai * D2R) / n)) / D2R;   // 折射角
        const a = ai * D2R, r = ar * D2R;
        const A = [cx - R * Math.sin(a), sy - R * Math.cos(a)];
        const Br = [cx + R * 1.1 * Math.sin(r), sy + R * 1.1 * Math.cos(r)];
        const Bref = [cx + R * 0.7 * Math.sin(a), sy - R * 0.7 * Math.cos(a)];
        svg.innerHTML = `
          <rect x="6" y="${sy}" width="288" height="${170 - sy}" fill="rgba(76,129,191,.16)"/>
          <line x1="6" y1="${sy}" x2="294" y2="${sy}" stroke="#4c81bf" stroke-width="1.6"/>
          <text x="14" y="${sy - 6}" font-size="10" fill="#8b8271">空气</text><text x="14" y="${sy + 16}" font-size="10" fill="#4c81bf">水</text>
          <line x1="${cx}" y1="${sy - 62}" x2="${cx}" y2="${sy + 62}" stroke="#8b8271" stroke-width="1.2" stroke-dasharray="5 4"/>
          <line x1="${A[0]}" y1="${A[1]}" x2="${cx}" y2="${sy}" stroke="#f59e0b" stroke-width="2.2"/>
          <line x1="${cx}" y1="${sy}" x2="${Br[0]}" y2="${Br[1]}" stroke="#f59e0b" stroke-width="2.2"/>
          <line x1="${cx}" y1="${sy}" x2="${Bref[0]}" y2="${Bref[1]}" stroke="#f59e0b" stroke-width="1" opacity=".4" stroke-dasharray="3 3"/>
          <path d="${arcPath(cx, sy, 30, Math.PI / 2 + (Math.PI / 2 - a), Math.PI / 2)}" fill="none" stroke="#0f766e" stroke-width="1.5"/>
          <text x="${cx - 46}" y="${sy - 22}" font-size="11" fill="#0f766e">入射 ${ai}°</text>
          <path d="${arcPath(cx, sy, 30, -Math.PI / 2, -Math.PI / 2 + r)}" fill="none" stroke="#b7791f" stroke-width="1.5"/>
          <text x="${cx + 10}" y="${sy + 40}" font-size="11" fill="#b7791f">折射 ${revealed ? ar.toFixed(0) + '°' : '?'}</text>`;
        $('p4-frcap').innerHTML = !revealed
          ? '先在右边猜一猜，再拖动入射角滑杆——比一比空气里的角和水里的角，谁大？'
          : (ai === 0 ? '垂直入射（入射角 0°）：光<b>不偏折</b>，直接进去。' : `光从空气斜射入水，折射角(${ar.toFixed(0)}°) <b>小于</b> 入射角(${ai}°)——<b>空气里的那个角总是更大</b>。反过来从水射入空气，空气侧的角还是更大。`);
        $('p4-frlab').textContent = ai + '°';
      }
      $('p4-frang').addEventListener('input', e => { ai = +e.target.value; revealed = true; draw(); Y.ev('act:p4.refract'); });
      $('p4-frguess').appendChild(Y.guess({
        q: '先猜：光从空气<b>斜射入水</b>，进入水中后，折射角比入射角大还是小？', options: ['小（空气侧的角更大）', '大（水侧的角更大）', '一样大'], answer: 0,
        reveal: '拖入射角滑杆——折射角始终比入射角小。记法：<b>空气里的角总是大的那个</b>。',
        onDone: () => { revealed = true; draw(); }
      }));
      // 叉鱼
      const fsvg = $('p4-fishsvg');
      const realFish = [200, 100], seenFish = [200, 78];   // 看到的鱼偏高
      function drawFish(pick) {
        let s = `<rect x="0" y="45" width="300" height="85" fill="rgba(76,129,191,.18)"/>
          <line x1="0" y1="45" x2="300" y2="45" stroke="#4c81bf" stroke-width="1.4"/>
          <text x="8" y="40" font-size="10" fill="#8b8271">空气</text><text x="8" y="60" font-size="10" fill="#4c81bf">水</text>
          <text x="${seenFish[0]}" y="${seenFish[1]}" font-size="20" text-anchor="middle" opacity=".55">🐟</text>
          <text x="${seenFish[0] + 24}" y="${seenFish[1]}" font-size="9" fill="#8b8271">你看到的(虚像)</text>`;
        if (pick) {
          s += `<line x1="60" y1="20" x2="${pick[0]}" y2="${pick[1]}" stroke="#b91c1c" stroke-width="2"/><circle cx="${pick[0]}" cy="${pick[1]}" r="4" fill="none" stroke="#b91c1c" stroke-width="2"/>`;
          const hitReal = pick[1] > seenFish[1] + 8 && Math.abs(pick[0] - realFish[0]) < 40;
          s += `<text x="${realFish[0]}" y="${realFish[1]}" font-size="20" text-anchor="middle">🐟</text><text x="${realFish[0]}" y="${realFish[1] + 16}" font-size="9" fill="#b91c1c" text-anchor="middle">真鱼在这</text>`;
          $('p4-fishcap').innerHTML = hitReal
            ? '<b style="color:var(--ok)">叉中了！</b>要往看到的鱼的<b>下方（更深处）</b>叉。因为光从鱼身上射出、经水面折射进你眼睛，你逆着光看，鱼的虚像被"抬高"了，真鱼其实更深。'
            : '<b style="color:var(--warn)">没叉到。</b>真鱼比你看到的位置<b>更深</b>——往下方一点再点一次试试。';
          if (hitReal) Y.ev('act:p4.fish');
        } else s += `<text x="150" y="122" font-size="10" fill="#8b8271" text-anchor="middle">点一下你要下叉的位置</text>`;
        fsvg.innerHTML = s;
      }
      fsvg.addEventListener('click', e => { const r = fsvg.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * 300, y = (e.clientY - r.top) / r.height * 130; drawFish([x, y]); });
      draw(); drawFish(null);
    })();

    /* ============ ⑤ 色散 + 混色 + 物体颜色 ============ */
    (function colorLab() {
      // 三棱镜
      const psvg = $('p4-prismsvg');
      const COLORS = ['#e11d1d', '#f59e0b', '#eab308', '#16a34a', '#2563eb', '#4338ca', '#7c3aed'];
      let prismRevealed = false;
      function drawPrism() {
        let s = `<polygon points="150,30 120,110 180,110" fill="rgba(150,180,220,.25)" stroke="#93b3c9" stroke-width="1.5"/>
          <line x1="30" y1="78" x2="132" y2="78" stroke="#e8e8e8" stroke-width="3"/>
          <text x="30" y="70" font-size="10" fill="#8b8271">白光</text>`;
        if (prismRevealed) {
          COLORS.forEach((c, i) => { const ex = 285, ey = 92 + i * 11; s += `<line x1="168" y1="90" x2="${ex}" y2="${ey}" stroke="${c}" stroke-width="2.4"/>`; });
          s += `<text x="245" y="86" font-size="9.5" fill="#e11d1d">红(偏折最小)</text><text x="245" y="150" font-size="9.5" fill="#7c3aed">紫(偏折最大)</text>`;
        } else {
          s += `<text x="225" y="96" font-size="26" fill="#8b8271" text-anchor="middle">?</text><text x="225" y="120" font-size="10" fill="#8b8271" text-anchor="middle">出来会是什么样？</text>`;
        }
        psvg.innerHTML = s;
        $('p4-prismcap').innerHTML = prismRevealed
          ? '白光其实是<b>七种色光</b>混成的复色光。经过三棱镜，各色偏折程度不同（<b>红最小、紫最大</b>），就散开成一条彩带——这叫<b>色散</b>。雨后的彩虹，是空气里千万个小水滴当了棱镜（背对太阳才看得到）。'
          : '白光正射进三棱镜。先在下面猜一猜：出来会散成什么？哪种颜色拐得最狠？';
      }
      $('p4-prismguess').appendChild(Y.guess({
        q: '先猜：白光通过三棱镜散开成彩带，哪种颜色偏折得最厉害（拐得最狠）？', options: ['紫光', '红光', '都一样'], answer: 0,
        reveal: '看棱镜出来的彩带——红光偏折最小、紫光偏折最大。所以彩虹里红在外圈、紫在内圈。',
        onDone: () => { prismRevealed = true; drawPrism(); Y.ev('act:p4.prism'); }
      }));
      drawPrism();

      // 色光混色（加色）：三圆 screen 叠加
      const msvg = $('p4-mixsvg'); const lights = { r: true, g: false, b: false };
      function drawMix() {
        const C = { r: [105, 60, '#ff2020'], g: [155, 60, '#20ff20'], b: [130, 100, '#2060ff'] };
        let s = '';
        Object.keys(C).forEach(k => { if (lights[k]) { const [x, y, col] = C[k]; s += `<circle cx="${x}" cy="${y}" r="42" fill="${col}" style="mix-blend-mode:screen"/>`; } });
        msvg.innerHTML = s;
        const on = Object.keys(lights).filter(k => lights[k]);
        let cap;
        if (on.length === 3) cap = '红+绿+蓝三色全开 → 中间是<b>白色</b>！这就是白屏的秘密。';
        else if (on.length === 0) cap = '全关 → 一片<b>黑</b>（没有光）。';
        else if (on.length === 1) cap = '只开一种色光。再多开一个，看两色重叠出什么。';
        else { const set = on.sort().join(''); cap = set === 'gr' ? '红+绿 = <b>黄</b>（很多人以为是橙，其实是黄）。' : set === 'br' ? '红+蓝 = <b>品红/紫</b>。' : '绿+蓝 = <b>青</b>。'; }
        $('p4-mixcap').innerHTML = '色光三原色＝<b>红 绿 蓝(RGB)</b>，越加越亮（加色法）。' + cap;
      }
      $('p4-mixtoggle').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; const k = b.dataset.c; lights[k] = !lights[k]; b.classList.toggle('on', lights[k]); drawMix(); Y.ev('act:p4.mix'); });
      drawMix();

      // 颜料混色（减色）：三圆 multiply
      const pig = $('p4-pigsvg');
      pig.innerHTML = `<circle cx="105" cy="55" r="40" fill="#22c3c3" style="mix-blend-mode:multiply"/>
        <circle cx="155" cy="55" r="40" fill="#e33bb0" style="mix-blend-mode:multiply"/>
        <circle cx="130" cy="95" r="40" fill="#f2d024" style="mix-blend-mode:multiply"/>
        <text x="130" y="126" font-size="9.5" fill="#8b8271" text-anchor="middle">青+品红+黄 三色叠加 → 中间发黑</text>`;

      // 物体颜色小剧场
      const ssvg = $('p4-stagesvg'); let light = 'white';
      $('p4-stagelight').insertAdjacentElement('beforebegin', Y.guess({
        q: '先猜：在暗室里只用<b>红光</b>照一片<b>绿叶</b>，绿叶看起来会是什么颜色？',
        options: ['发黑（几乎看不见）', '还是绿色', '变成红色'], answer: 0,
        reveal: '换到下面的"红光"亲眼看——绿叶发黑。因为绿叶只反射绿光，红光里没有绿光给它反射。'
      }));
      // 物体反射的色光集合
      const OBJ = [
        { name: '绿叶', x: 60, refl: ['green'] },
        { name: '白纸', x: 150, refl: ['red', 'green', 'blue'] },
        { name: '红花', x: 240, refl: ['red'] }
      ];
      const LIGHTMAP = { white: ['red', 'green', 'blue'], red: ['red'], green: ['green'], blue: ['blue'] };
      const HEX = { red: '#e11d1d', green: '#16a34a', blue: '#2563eb', black: '#222', white: '#f4efe3' };
      function appear(obj) {
        const lit = LIGHTMAP[light].filter(c => obj.refl.includes(c));   // 被照到又能反射的色光
        if (lit.length === 0) return 'black';
        if (light === 'white') return obj.refl.length === 3 ? 'white' : obj.refl[0];
        return lit[0];
      }
      function drawStage() {
        let s = `<rect x="0" y="0" width="300" height="110" fill="${light === 'white' ? 'rgba(0,0,0,.03)' : HEX[LIGHTMAP[light][0]] + '22'}"/>`;
        OBJ.forEach(o => { const col = appear(o); s += `<circle cx="${o.x}" cy="50" r="24" fill="${HEX[col]}" stroke="#57503f" stroke-width="1"/><text x="${o.x}" y="92" font-size="10" fill="#57503f" text-anchor="middle">${o.name}</text><text x="${o.x}" y="105" font-size="9" fill="#8b8271" text-anchor="middle">看起来:${col === 'black' ? '发黑' : col === 'white' ? '白' : { red: '红', green: '绿', blue: '蓝' }[col]}</text>`; });
        ssvg.innerHTML = s;
        $('p4-stagecap').innerHTML = light === 'red'
          ? '红光下：<b>绿叶发黑</b>（它只反射绿光，可现在没有绿光给它反射）；红花、白纸都发红。<b>不透明物体的颜色，由它反射的色光决定。</b>'
          : light === 'white' ? '白光下各显本色：绿叶绿、红花红、白纸白。' : `${{ green: '绿', blue: '蓝' }[light]}光下：只有能反射${{ green: '绿', blue: '蓝' }[light]}光的物体亮，其余发黑。`;
      }
      $('p4-stagelight').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('p4-stagelight').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); light = b.dataset.l; drawStage(); if (light !== 'white') Y.ev('act:p4.color'); });
      drawStage();
    })();

    /* ============ 讲透卡 ============ */
    const FIGreflect = () => `<svg viewBox="0 0 260 120" style="max-width:260px">
      <line x1="20" y1="95" x2="240" y2="95" stroke="#4c81bf" stroke-width="2"/>
      <line x1="130" y1="95" x2="130" y2="20" stroke="#8b8271" stroke-width="1.2" stroke-dasharray="5 4"/><text x="134" y="26" font-size="9" fill="#8b8271">法线</text>
      <line x1="60" y1="35" x2="130" y2="95" stroke="#f59e0b" stroke-width="2"/><line x1="130" y1="95" x2="200" y2="35" stroke="#f59e0b" stroke-width="2"/>
      <text x="95" y="60" font-size="10" fill="#0f766e">i</text><text x="160" y="60" font-size="10" fill="#b7791f">r</text>
      <text x="130" y="115" font-size="9.5" fill="#8b8271" text-anchor="middle">反射角 r = 入射角 i（都从法线量）</text></svg>`;
    const FIGmirror = () => `<svg viewBox="0 0 260 120" style="max-width:260px">
      <rect x="128" y="15" width="4" height="95" fill="#4c81bf"/><text x="130" y="12" font-size="9" fill="#4c81bf" text-anchor="middle">镜</text>
      <line x1="70" y1="90" x2="70" y2="45" stroke="#b91c1c" stroke-width="2.6"/><polygon points="66,45 74,45 70,39" fill="#f59e0b"/>
      <line x1="190" y1="90" x2="190" y2="45" stroke="#b91c1c" stroke-width="2.2" stroke-dasharray="5 4" opacity=".7"/><polygon points="186,45 194,45 190,39" fill="#f59e0b" opacity=".7"/>
      <line x1="70" y1="100" x2="130" y2="100" stroke="#0f766e" stroke-width="1" stroke-dasharray="3 3"/><line x1="130" y1="100" x2="190" y2="100" stroke="#0f766e" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="100" y="112" font-size="9" fill="#0f766e" text-anchor="middle">d</text><text x="160" y="112" font-size="9" fill="#0f766e" text-anchor="middle">d</text>
      <text x="70" y="106" font-size="8.5" fill="#8b8271" text-anchor="middle">物</text><text x="190" y="106" font-size="8.5" fill="#8b8271" text-anchor="middle">像(虚)</text></svg>`;
    const FIGmix = () => `<svg viewBox="0 0 260 120" style="max-width:260px">
      <rect x="0" y="0" width="128" height="120" rx="6" fill="#111"/>
      <circle cx="52" cy="45" r="26" fill="#ff2020" style="mix-blend-mode:screen"/><circle cx="76" cy="45" r="26" fill="#20ff20" style="mix-blend-mode:screen"/><circle cx="64" cy="70" r="26" fill="#2060ff" style="mix-blend-mode:screen"/>
      <text x="64" y="110" font-size="9" fill="#fff" text-anchor="middle">色光：越加越白</text>
      <rect x="132" y="0" width="128" height="120" rx="6" fill="#fff"/>
      <circle cx="184" cy="45" r="26" fill="#22c3c3" style="mix-blend-mode:multiply"/><circle cx="208" cy="45" r="26" fill="#e33bb0" style="mix-blend-mode:multiply"/><circle cx="196" cy="70" r="26" fill="#f2d024" style="mix-blend-mode:multiply"/>
      <text x="196" y="110" font-size="9" fill="#333" text-anchor="middle">颜料：越混越黑</text></svg>`;

    window.ExplainKit.cards($('p4-cardlist'), [
      { emoji: '📏', title: '光的直线传播', rule: '光在<b>同种、均匀</b>介质中沿直线传播（"同种均匀"这个条件不能丢，不然会拐弯——海市蜃楼）。光速 c ≈ 3×10⁸ m/s，比声速快近百万倍。',
        steps: [{ t: '影子、日月食', r: '光被挡、走直线' }, { t: '先见闪电后闻雷', r: '光比声快得多', key: true }],
        trap: '"光总是直线传播"是错的——要加"同种均匀介质"。跨介质（空气→水）就会折射拐弯。' },
      { emoji: '🕳️', title: '小孔成像', rule: '小孔成像成的是<b>倒立的实像</b>，像的形状由<b>物</b>决定，跟孔的形状<b>无关</b>（孔够小时）。孔大了才会变成孔的形状（那是光斑，不是像）。', fig: () => `<svg viewBox="0 0 260 90" style="max-width:260px"><line x1="40" y1="45" x2="40" y2="20" stroke="#b91c1c" stroke-width="2.4"/><polygon points="36,20 44,20 40,14" fill="#f59e0b"/><rect x="128" y="15" width="4" height="60" fill="#57503f"/><circle cx="130" cy="45" r="3" fill="#fff"/><line x1="200" y1="45" x2="200" y2="70" stroke="#b91c1c" stroke-width="2.4"/><polygon points="196,70 204,70 200,76" fill="#f59e0b"/><line x1="40" y1="20" x2="200" y2="70" stroke="#f59e0b" stroke-width=".8" opacity=".6"/><line x1="40" y1="45" x2="200" y2="45" stroke="#8b8271" stroke-width=".6" stroke-dasharray="3 3"/><text x="205" y="70" font-size="8.5" fill="#8b8271">倒立像</text></svg>`,
        steps: [{ t: '三角孔、星形孔', r: '像还是倒立烛焰' }, { t: '屏离孔越远', r: '像越大', key: true }],
        trap: '别把"小孔成像"和"树荫下的圆光斑"搞混——那些圆斑正是太阳经小孔成的倒立的像（太阳是圆的）。' },
      { emoji: '🪞', title: '光的反射定律', rule: '三线共面、法线居中、两角相等：反射光线与入射光线、法线在同一平面；分居法线两侧；<b>反射角 = 入射角</b>。光路可逆。', fig: FIGreflect,
        steps: [{ t: '角都从法线量', r: '不是从镜面量' }, { t: '入射角 0°（垂直入射）', r: '反射角也 0°，原路返回', key: true }],
        trap: '"反射角 = 入射角"里的角是<b>光线与法线</b>的夹角。若说"光线与镜面成 30°"，入射角是 90−30=60°。' },
      { emoji: '🌫️', title: '镜面反射与漫反射', rule: '两者<b>都遵守反射定律</b>。镜面反射：平行光反射后仍平行（镜子、平静水面）；漫反射：粗糙面各点法线方向不同，平行光被反射到四面八方。',
        steps: [{ t: '能从各个方向看见课本', r: '靠漫反射' }, { t: '黑板"反光"看不清字', r: '镜面反射晃眼', key: true }],
        trap: '漫反射不是"不遵守定律"——每一条光线都守法，只是表面凹凸让法线乱了。乱的是表面，不乱的是定律。' },
      { emoji: '👥', title: '平面镜成像', rule: '四特点：<b>等大、等距、正立、虚像</b>；物与像关于镜面<b>对称</b>，连线垂直镜面。这与数学轴对称（m15）是同一套作图。', fig: FIGmirror,
        steps: [{ t: '像与物等大', r: '不随远近变' }, { t: '像到镜 = 物到镜', r: '等距对称', key: true }],
        trap: '像是<b>虚像</b>（反射光反向延长线相交，光屏接不到）。"人远离镜子像变小"是视角错觉，像始终等大。' },
      { emoji: '💧', title: '光的折射', rule: '光从一种介质斜射入另一种，传播方向改变。规律：<b>空气中的那个角总是更大</b>；垂直入射（0°）不偏折；光路可逆。',
        steps: [{ t: '空气→水：折射角<入射角', r: '偏向法线' }, { t: '水→空气：折射角>入射角', r: '偏离法线', key: true }],
        trap: '水中的筷子看起来"向上弯折"、池水看起来"变浅"、叉鱼要叉看到位置的<b>下方</b>——都因为折射把像抬高了。' },
      { emoji: '🌈', title: '光的色散与三原色', rule: '白光是复色光，经棱镜散成红橙黄绿蓝靛紫（红偏折最小、紫最大）。<b>色光</b>三原色＝红绿蓝(RGB)，加色越混越亮；<b>颜料</b>三原色越混越暗。', fig: FIGmix,
        steps: [{ t: '红+绿=黄，三色全开=白', r: '色光加色法' }, { t: '颜料越混越黑', r: '减色法', key: true }],
        trap: '色光三原色(红绿蓝)≠颜料三原色。屏幕发光用 RGB 加色；调颜料/打印用减色。别混。' },
      { emoji: '🎨', title: '物体的颜色 · 红外紫外', rule: '<b>不透明</b>物体的颜色由它<b>反射</b>的色光决定（绿叶反射绿光、吸收其余）；<b>透明</b>物体由它<b>透射</b>的色光决定（红玻璃透红光）。',
        steps: [{ t: '红光照绿叶', r: '绿叶发黑（无绿光可反射）' }, { t: '红光照白纸', r: '白纸发红（白反射一切）', key: true }],
        trap: '红外线（遥控器、热成像、体温枪）、紫外线（验钞、杀菌、晒黑）都在可见光之外，看不见但真实存在。' }
    ]);

    /* ============ 自测 ============ */
    function bestLine() { const b = Y.quizBest('p4'); $('p4-quizbest').textContent = b ? `历史最好成绩：${b.correct} / ${b.total}` : ''; }
    bestLine();
    $('p4-quizgo').addEventListener('click', () => {
      $('p4-quizgo').style.display = 'none';
      Y.quizStart($('p4-quizbox'), 'p4', () => { $('p4-quizgo').style.display = ''; $('p4-quizgo').textContent = '再测一次'; bestLine(); });
    });

    /* ============ 维也纳任务卡 ============ */
    (function viennaLab() {
      const box = $('p4-viennabox');
      const ITEMS = [
        ['🔬', 'v-rgb', 'RGB 微距（主打）', '用 iPad 相机贴近另一块屏幕（电视/电脑）的<b>白色</b>区域，放到最大——白色原来是<b>红绿蓝三种小灯</b>拼的！拍下来。'],
        ['🟥', 'v-glass', '教堂彩窗透光', '斯蒂芬教堂的彩色玻璃：红玻璃为什么透出红光？（透明物体的颜色由<b>透射</b>的色光决定）。'],
        ['🌈', 'v-rainbow', '喷泉彩虹', '晴天在美泉宫 Neptunbrunnen 喷泉边，<b>背对太阳</b>找找水雾里的彩虹，拍一张。'],
        ['🌞', 'v-shadow', '影子计时', '正午前后每隔一小时描一次自己影子的长度——影子最短时太阳最高（直线传播 + 太阳高度）。']
      ];
      const t = Y.taskGet('p4.vienna');
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
          Y.taskSet('p4.vienna', { data: state, done: doneCnt >= 2 });
          if (doneCnt >= 2) Y.ev('act:p4.vienna');
          if (now) Y.toast('📷 光学任务 +1', true);
        });
        body.appendChild(row);
      });
      box.appendChild(window.TaskKit.card({
        emoji: '📷', title: '维也纳光学四件套（跨学科实践）',
        desc: 'RGB 微距是主打——你自己的"显微发现"。夏天在维也纳拍好，11 月这一章上线时照片会出现在这里。完成 2 项即算过关。',
        done: t.done, body,
        onToggle: v => Y.taskSet('p4.vienna', { done: v })
      }));
    })();

    return { cleanup() {} };
  }
};
