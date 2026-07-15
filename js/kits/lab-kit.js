/* lab-kit —— 测量器材引擎（p6 质量与密度）。
   LabKit.balance(container, opts)：虚拟托盘天平。加/减砝码 + 游码滑杆 → 横梁按 (右−左) 倾斜、指针联动，
     两边相等时平衡，读数 = 砝码 + 游码。onBalance(reading) 在首次平衡时回调。
   LabKit.cylinder(svg, opts)：量筒读数。凹液面 + 平视/俯视/仰视视差（俯大仰小），setVolume/setSight。 */
window.LabKit = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (p, tag, attrs, txt) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (txt !== undefined) e.textContent = txt; p.appendChild(e); return e; };

  /* ---------------- 托盘天平 ---------------- */
  function balance(container, opts) {
    opts = opts || {};
    const leftMass = opts.leftMass || 0;          // 左盘物体真实质量（g）
    const objLabel = opts.objLabel || '物体';
    const SET = opts.weightSet || [50, 20, 10, 10, 5];   // 可用砝码（g）
    const riderMax = opts.riderMax || 5, riderStep = opts.riderStep || 0.2;
    let placed = [];                               // 已放到右盘的砝码
    let rider = 0;                                 // 游码示数
    let balancedOnce = false;

    container.innerHTML = `
      <svg class="balsvg" viewBox="0 0 320 210" style="width:100%;height:auto"></svg>
      <div class="labreadout" id="lk-read"></div>
      <div class="weighttray" id="lk-tray"></div>
      <div class="benchbar"><span class="small">游码</span><input type="range" id="lk-rider" min="0" max="${riderMax}" step="${riderStep}" value="0" style="flex:1;max-width:200px"><span class="small" id="lk-riderlab">0.0 g</span></div>`;
    const svg = container.querySelector('.balsvg');

    function sum() { return placed.reduce((a, b) => a + b, 0) + rider; }
    function draw() {
      const right = sum(), diff = right - leftMass;
      const bal = Math.abs(diff) < 0.05;
      const theta = 0.32 * Math.tanh(diff / 8);       // 右重→右低（theta>0）
      const cx = 160, pivotY = 60, BW = 105, PL = 44;
      const lEnd = [cx - BW * Math.cos(theta), pivotY - BW * Math.sin(theta)];
      const rEnd = [cx + BW * Math.cos(theta), pivotY + BW * Math.sin(theta)];
      svg.innerHTML = '';
      // 立柱与底座
      mk(svg, 'rect', { x: cx - 4, y: pivotY, width: 8, height: 118, fill: '#b8ae97' });
      mk(svg, 'rect', { x: cx - 55, y: 176, width: 110, height: 10, rx: 4, fill: '#a99f88' });
      // 横梁
      mk(svg, 'line', { x1: lEnd[0], y1: lEnd[1], x2: rEnd[0], y2: rEnd[1], stroke: '#6b6350', 'stroke-width': 5, 'stroke-linecap': 'round' });
      mk(svg, 'circle', { cx, cy: pivotY, r: 5, fill: '#57503f' });
      // 指针 + 刻度
      const tip = [cx + PL * Math.sin(theta), pivotY + 96 * Math.cos(theta) * 0 + PL + (theta * 40)];
      mk(svg, 'line', { x1: cx, y1: pivotY, x2: cx + Math.sin(theta) * (PL + 60), y2: pivotY + Math.cos(theta) * (PL + 60), stroke: bal ? '#15803d' : '#b91c1c', 'stroke-width': 2 });
      for (let k = -2; k <= 2; k++) mk(svg, 'line', { x1: cx + k * 9, y1: 170, x2: cx + k * 9, y2: 176, stroke: '#8b8271', 'stroke-width': k === 0 ? 1.6 : 1 });
      // 托盘（从横梁两端垂下）
      const pan = (x, y, items, label) => {
        mk(svg, 'line', { x1: x, y1: y, x2: x - 22, y2: y + 34, stroke: '#b8ae97', 'stroke-width': 1 });
        mk(svg, 'line', { x1: x, y1: y, x2: x + 22, y2: y + 34, stroke: '#b8ae97', 'stroke-width': 1 });
        mk(svg, 'path', { d: `M ${x - 26} ${y + 34} Q ${x} ${y + 48} ${x + 26} ${y + 34}`, fill: 'rgba(150,180,200,.25)', stroke: '#93a9bc', 'stroke-width': 1.4 });
        if (label === 'obj' && leftMass > 0) { mk(svg, 'rect', { x: x - 13, y: y + 20, width: 26, height: 16, rx: 3, fill: '#c98a5a', stroke: '#8a5a34' }); mk(svg, 'text', { x, y: y + 16, 'font-size': 9, fill: '#57503f', 'text-anchor': 'middle' }, objLabel); }
        if (label === 'wt') { items.forEach((w, i) => mk(svg, 'rect', { x: x - 10 + (i % 3) * 7, y: y + 30 - Math.floor(i / 3) * 8 - w * 0.15, width: 12, height: 6 + w * 0.12, rx: 1, fill: '#9aa7b0', stroke: '#6b7680' })); }
      };
      pan(lEnd[0], lEnd[1], [], 'obj');
      pan(rEnd[0], rEnd[1], placed, 'wt');
      mk(svg, 'text', { x: lEnd[0], y: lEnd[1] + 62, 'font-size': 9.5, fill: '#8b8271', 'text-anchor': 'middle' }, '物（左）');
      mk(svg, 'text', { x: rEnd[0], y: rEnd[1] + 62, 'font-size': 9.5, fill: '#8b8271', 'text-anchor': 'middle' }, '砝码（右）');
      // 读数
      const rd = container.querySelector('#lk-read');
      rd.className = 'labreadout' + (bal ? ' ok' : '');
      rd.innerHTML = bal
        ? `<b>⚖️ 平衡！</b>读数 = 砝码 ${right - rider} g + 游码 ${rider.toFixed(1)} g = <b>${right.toFixed(1)} g</b>`
        : (right === 0 ? '右盘空着——从下面拿砝码放上去，再用游码微调，直到指针居中。'
          : `指针偏${diff > 0 ? '右（砝码重了）' : '左（砝码轻了）'} ｜ 当前右盘 ${right.toFixed(1)} g`);
      if (bal && !balancedOnce) { balancedOnce = true; if (opts.onBalance) opts.onBalance(right); }
      if (opts.onChange) opts.onChange({ right, balanced: bal, reading: right });
    }
    // 砝码托盘按钮
    const tray = container.querySelector('#lk-tray');
    SET.forEach((w, idx) => {
      const b = document.createElement('button'); b.className = 'wbtn'; b.textContent = w + 'g'; b.dataset.idx = idx;
      b.addEventListener('click', () => {
        const at = placed.indexOf(w);
        if (b.classList.contains('on')) { b.classList.remove('on'); if (at >= 0) placed.splice(at, 1); }
        else { b.classList.add('on'); placed.push(w); }
        draw();
      });
      tray.appendChild(b);
    });
    container.querySelector('#lk-rider').addEventListener('input', e => { rider = +e.target.value; container.querySelector('#lk-riderlab').textContent = rider.toFixed(1) + ' g'; draw(); });
    draw();
    return { getReading: sum, isBalanced: () => Math.abs(sum() - leftMass) < 0.05 };
  }

  /* ---------------- 量筒读数 ---------------- */
  function cylinder(svg, opts) {
    opts = opts || {};
    const max = opts.max || 100;                 // 量程 mL
    let vol = opts.volume || 40;                 // 真实体积
    let sight = 0;                               // 0 平视 / +1 俯视 / −1 仰视
    function reading() { return vol + sight * (opts.parallax || 4); }   // 俯视偏大、仰视偏小
    function draw() {
      const x = 120, w = 70, top = 20, bot = 190, H = bot - top;
      const yFor = v => bot - (v / max) * H;
      svg.innerHTML = '';
      mk(svg, 'rect', { x, y: top, width: w, height: H, rx: 6, fill: '#f7fbff', stroke: '#9db4c0', 'stroke-width': 1.6 });
      // 刻度
      for (let v = 0; v <= max; v += max / 10) { const y = yFor(v); mk(svg, 'line', { x1: x + w - 14, y1: y, x2: x + w, y2: y, stroke: '#93a9bc', 'stroke-width': 1 }); mk(svg, 'text', { x: x + w + 4, y: y + 3.5, 'font-size': 9, fill: '#8b8271' }, String(Math.round(v))); }
      // 水 + 凹液面（中间低、两边高）
      const yL = yFor(vol);
      mk(svg, 'rect', { x: x + 2, y: yL, width: w - 4, height: bot - yL - 2, fill: 'rgba(76,129,191,.28)' });
      mk(svg, 'path', { d: `M ${x + 2} ${yL} Q ${x + w / 2} ${yL + 8} ${x + w - 2} ${yL}`, fill: 'none', stroke: '#4c81bf', 'stroke-width': 1.6 });
      mk(svg, 'text', { x: x + w / 2, y: yL + 20, 'font-size': 8.5, fill: '#4c81bf', 'text-anchor': 'middle' }, '凹液面');
      // 视线（眼在右侧，随俯仰上下）
      const eyeY = yL - sight * 42, eyeX = 250;
      mk(svg, 'text', { x: eyeX, y: eyeY + 5, 'font-size': 20 }, '👁️');
      const readY = yFor(reading());
      mk(svg, 'line', { x1: eyeX - 6, y1: eyeY, x2: x + w / 2, y2: yL + 4, stroke: '#4c51bf', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' });
      if (sight) mk(svg, 'line', { x1: x + w / 2, y1: yL + 4, x2: x + w, y2: readY, stroke: '#4c51bf', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' });
      mk(svg, 'line', { x1: x - 16, y1: yL + 4, x2: x + w, y2: yL + 4, stroke: '#0f766e', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: .6 });
      mk(svg, 'text', { x: x - 18, y: yL + 7, 'font-size': 9, fill: '#0f766e', 'text-anchor': 'end' }, '真实 ' + vol);
      if (opts.onRead) opts.onRead({ real: vol, read: reading(), sight });
    }
    draw();
    return {
      setVolume(v) { vol = v; draw(); },
      setSight(s) { sight = s; draw(); },
      reading, getVolume: () => vol, draw
    };
  }

  return { balance, cylinder };
})();
