/* tile-kit —— 代数瓷砖引擎（m16 首用，m17 因式分解逆向复用）。
   核心图景：乘法 = 算面积。因式 (a·x+b) 画成长度 a 段 x + b 段 1；矩形内部自动分区。
   仅支持非负因子（符号交给 m16 的公式剪拼动画处理，更清楚）。 */
window.TileKit = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const X = 60, U = 22;                 // x 段长、单位段长（像素）
  const COL = {
    xx: 'rgba(76,81,191,.28)', xxs: '#4c51bf',   // x² 靛蓝
    x: 'rgba(15,118,110,.26)', xs: '#0f766e',     // x 青
    one: 'rgba(183,121,31,.32)', ones: '#b7791f'  // 1 金
  };
  const cellType = (c, r) => (c === 'x' && r === 'x') ? 'xx' : (c === 'u' && r === 'u') ? 'one' : 'x';

  function el(parent, tag, attrs, txt) {
    const e = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    if (txt !== undefined) e.textContent = txt;
    parent.appendChild(e);
    return e;
  }

  /**
   * grid(svg, f1, f2, {reveal, hlXX, hlX, hlOne})
   * f1 = {a, b} 横向因子 (a·x + b)；f2 纵向因子。reveal=false 只画外框与分区虚线。
   * 返回 {xx, x, one}
   */
  function grid(svg, f1, f2, opts) {
    opts = opts || {};
    const OX = 52, OY = 30;
    const cols = [], rows = [];
    for (let i = 0; i < f1.a; i++) cols.push('x');
    for (let i = 0; i < f1.b; i++) cols.push('u');
    for (let i = 0; i < f2.a; i++) rows.push('x');
    for (let i = 0; i < f2.b; i++) rows.push('u');
    const cx = [OX]; let xx = OX;
    cols.forEach(c => { xx += (c === 'x' ? X : U); cx.push(xx); });
    const ry = [OY]; let yy = OY;
    rows.forEach(r => { yy += (r === 'x' ? X : U); ry.push(yy); });
    const W = xx + 16, H = yy + 16;
    svg.setAttribute('viewBox', `0 0 ${Math.max(W, 150)} ${Math.max(H, 120)}`);
    svg.classList.add('geo-svg');
    svg.innerHTML = '';

    const counts = { xx: 0, x: 0, one: 0 };
    for (let i = 0; i < cols.length; i++) {
      for (let j = 0; j < rows.length; j++) {
        const t = cellType(cols[i], rows[j]);
        counts[t]++;
        const hl = (t === 'xx' && opts.hlXX) || (t === 'x' && opts.hlX) || (t === 'one' && opts.hlOne);
        el(svg, 'rect', {
          x: cx[i], y: ry[j], width: cx[i + 1] - cx[i], height: ry[j + 1] - ry[j],
          fill: opts.reveal ? COL[t] : (hl ? COL[t] : 'transparent'),
          stroke: opts.reveal || hl ? COL[t + 's'] : '#d8cfba',
          'stroke-width': hl ? 2.5 : 1.4
        });
      }
    }
    // 外框
    el(svg, 'rect', { x: OX, y: OY, width: cx[cx.length - 1] - OX, height: ry[ry.length - 1] - OY, fill: 'none', stroke: '#27231b', 'stroke-width': 2 });
    // 顶部每段标签（宽因子）
    for (let i = 0; i < cols.length; i++)
      el(svg, 'text', { x: (cx[i] + cx[i + 1]) / 2, y: OY - 8, 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle', fill: cols[i] === 'x' ? '#4c51bf' : '#b7791f' }, cols[i] === 'x' ? 'x' : '1');
    // 左侧每段标签（高因子）
    for (let j = 0; j < rows.length; j++)
      el(svg, 'text', { x: OX - 12, y: (ry[j] + ry[j + 1]) / 2 + 4, 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle', fill: rows[j] === 'x' ? '#4c51bf' : '#b7791f' }, rows[j] === 'x' ? 'x' : '1');
    // 因子表达式（角标）
    el(svg, 'text', { x: OX, y: 16, 'font-size': 12.5, fill: '#57503f' }, '宽 = ' + fstr(f1));
    el(svg, 'text', { x: 6, y: OY - 2, 'font-size': 12.5, fill: '#57503f', transform: `rotate(-90 6 ${OY - 2})` }, '高 = ' + fstr(f2));
    return counts;
  }

  function fstr(f) {
    if (f.a === 0) return String(f.b);
    let s = (f.a === 1 ? 'x' : f.a + 'x');
    if (f.b > 0) s += ' + ' + f.b;
    return s;
  }

  // 把 {xx,x,one} 写成多项式字符串（HTML，带上标）
  function polyStr(c) {
    const parts = [];
    if (c.xx) parts.push((c.xx === 1 ? '' : c.xx) + 'x<sup>2</sup>');
    if (c.x) parts.push((c.x === 1 ? '' : c.x) + 'x');
    if (c.one) parts.push(String(c.one));
    return parts.join(' + ') || '0';
  }

  /* 散砖池：给一堆瓷砖（用于 m17 逆向"拼矩形"的备料展示） */
  function palette(svg, counts) {
    svg.setAttribute('viewBox', '0 0 320 90');
    svg.classList.add('geo-svg');
    svg.innerHTML = '';
    let x = 12;
    const draw = (n, w, h, t, lab) => {
      for (let i = 0; i < n; i++) {
        el(svg, 'rect', { x, y: 45 - h / 2, width: w, height: h, fill: COL[t], stroke: COL[t + 's'], 'stroke-width': 1.6, rx: 2 });
        x += w + 5;
      }
      if (n) x += 10;
    };
    draw(counts.xx, 44, 44, 'xx');
    draw(counts.x, 44, 16, 'x');
    draw(counts.one, 16, 16, 'one');
  }

  /* builder —— 真·拖拽摆瓷砖：从托盘拖砖去填满长方形，填对才亮。
     onComplete(counts) 全部填满时触发。返回 {target, reset}。 */
  function builder(svg, f1, f2, opts) {
    opts = opts || {};
    const OX = 54, OY = 34;
    const cols = [], rows = [];
    for (let i = 0; i < f1.a; i++) cols.push('x');
    for (let i = 0; i < f1.b; i++) cols.push('u');
    for (let i = 0; i < f2.a; i++) rows.push('x');
    for (let i = 0; i < f2.b; i++) rows.push('u');
    const cx = [OX]; let ax = OX; cols.forEach(c => { ax += (c === 'x' ? X : U); cx.push(ax); });
    const ry = [OY]; let ay = OY; rows.forEach(r => { ay += (r === 'x' ? X : U); ry.push(ay); });
    const frameR = cx[cx.length - 1], frameB = ry[ry.length - 1];
    const trayY = frameB + 42;
    const W = Math.max(frameR + 20, 300), H = trayY + 70;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add('geo-svg');
    svg.style.touchAction = 'none';
    svg.innerHTML = '';

    const cells = [];
    for (let i = 0; i < cols.length; i++) for (let j = 0; j < rows.length; j++) {
      const type = cellType(cols[i], rows[j]);
      const rc = el(svg, 'rect', { x: cx[i], y: ry[j], width: cx[i + 1] - cx[i], height: ry[j + 1] - ry[j], fill: 'transparent', stroke: '#d8cfba', 'stroke-width': 1.4, 'stroke-dasharray': '4 3', rx: 2 });
      cells.push({ type, x: cx[i], y: ry[j], x2: cx[i + 1], y2: ry[j + 1], filled: false, el: rc });
    }
    el(svg, 'rect', { x: OX, y: OY, width: frameR - OX, height: frameB - OY, fill: 'none', stroke: '#27231b', 'stroke-width': 2 });
    for (let i = 0; i < cols.length; i++) el(svg, 'text', { x: (cx[i] + cx[i + 1]) / 2, y: OY - 8, 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle', fill: cols[i] === 'x' ? '#4c51bf' : '#b7791f' }, cols[i] === 'x' ? 'x' : '1');
    for (let j = 0; j < rows.length; j++) el(svg, 'text', { x: OX - 12, y: (ry[j] + ry[j + 1]) / 2 + 4, 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle', fill: rows[j] === 'x' ? '#4c51bf' : '#b7791f' }, rows[j] === 'x' ? 'x' : '1');
    el(svg, 'text', { x: OX, y: 16, 'font-size': 12.5, fill: '#57503f' }, '宽 = ' + fstr(f1) + '　高 = ' + fstr(f2));

    el(svg, 'text', { x: OX, y: trayY - 12, 'font-size': 12, fill: '#8b8271' }, '↓ 拖瓷砖填满长方形（放错了？点一下那块砖就能拿回来）');
    const stampDefs = [{ type: 'xx', w: X, h: X }, { type: 'x', w: X, h: U }, { type: 'one', w: U, h: U }];
    let tx = OX;
    stampDefs.forEach(sd => {
      el(svg, 'rect', { x: tx, y: trayY, width: sd.w, height: sd.h, fill: COL[sd.type], stroke: COL[sd.type + 's'], 'stroke-width': 1.8, rx: 3, 'data-stamp': sd.type, style: 'cursor:grab' });
      el(svg, 'text', { x: tx + sd.w / 2, y: trayY + sd.h / 2 + 4, 'font-size': 12, 'text-anchor': 'middle', 'font-weight': 700, fill: COL[sd.type + 's'], 'pointer-events': 'none' }, sd.type === 'xx' ? 'x²' : sd.type === 'x' ? 'x' : '1');
      tx += sd.w + 20;
    });

    let ghost = null, ghostType = null, tapCell = null, tapPt = null;
    const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    const clearCell = c => { c.filled = false; c.el.setAttribute('fill', 'transparent'); c.el.setAttribute('stroke', '#d8cfba'); c.el.setAttribute('stroke-dasharray', '4 3'); c.el.setAttribute('stroke-width', '1.4'); c.el.style.cursor = ''; };
    svg.addEventListener('pointerdown', e => {
      const st = e.target.getAttribute && e.target.getAttribute('data-stamp');
      if (st) {
        e.preventDefault();
        try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        ghostType = st;
        const sd = stampDefs.find(s => s.type === st);
        const [x, y] = pt(e);
        ghost = el(svg, 'rect', { x: x - sd.w / 2, y: y - sd.h / 2, width: sd.w, height: sd.h, fill: COL[st], stroke: COL[st + 's'], 'stroke-width': 2, rx: 3, opacity: .85, 'pointer-events': 'none' });
        ghost._w = sd.w; ghost._h = sd.h;
        return;
      }
      // 点已放的砖 → 记下，抬手若没怎么移动就拿回来
      const filled = cells.find(c => c.el === e.target && c.filled);
      if (filled) { tapCell = filled; tapPt = pt(e); try { svg.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    svg.addEventListener('pointermove', e => {
      if (ghost) { const [x, y] = pt(e); ghost.setAttribute('x', x - ghost._w / 2); ghost.setAttribute('y', y - ghost._h / 2); return; }
      if (tapCell) { const [x, y] = pt(e); if (Math.hypot(x - tapPt[0], y - tapPt[1]) > 12) tapCell = null; }
    });
    svg.addEventListener('pointerup', e => {
      if (ghost) {
        const [x, y] = pt(e);
        const cell = cells.find(c => !c.filled && x >= c.x && x <= c.x2 && y >= c.y && y <= c.y2);
        if (cell && cell.type === ghostType) {
          cell.filled = true;
          cell.el.setAttribute('fill', COL[cell.type]);
          cell.el.setAttribute('stroke', COL[cell.type + 's']);
          cell.el.setAttribute('stroke-dasharray', '');
          cell.el.style.cursor = 'pointer';
          if (opts.onPlace) opts.onPlace(cells.filter(c => c.filled).length, cells.length);
          if (cells.every(c => c.filled) && opts.onComplete) opts.onComplete(target());
        } else if (cell) {
          const old = cell.el.getAttribute('stroke');
          cell.el.setAttribute('stroke', '#b91c1c');
          cell.el.setAttribute('stroke-width', '2.5');
          setTimeout(() => { if (!cell.filled) { cell.el.setAttribute('stroke', old); cell.el.setAttribute('stroke-width', '1.4'); } }, 380);
        }
        ghost.remove(); ghost = null; ghostType = null;
        return;
      }
      if (tapCell) {
        const [x, y] = pt(e);
        if (Math.hypot(x - tapPt[0], y - tapPt[1]) <= 12 && x >= tapCell.x && x <= tapCell.x2 && y >= tapCell.y && y <= tapCell.y2) {
          clearCell(tapCell);
          if (opts.onPlace) opts.onPlace(cells.filter(c => c.filled).length, cells.length);
        }
        tapCell = null; tapPt = null;
      }
    });
    svg.addEventListener('pointercancel', () => { if (ghost) { ghost.remove(); ghost = null; ghostType = null; } tapCell = null; });

    function target() { const c = { xx: 0, x: 0, one: 0 }; cells.forEach(cl => c[cl.type]++); return c; }
    return {
      target: target(),
      reset() { cells.forEach(clearCell); }
    };
  }

  /* factorBuilder —— 逆向拼矩形（m17 因式分解核心）：给一堆散砖，亲手拼成长方形。
     x² 固定在角落；x 砖拖到右列(竖)或下行(横)；单位砖填角落。拼成 → 读出两条边 = 两个因式。
     opts.onChange(state) 每次变动；state={p,q,units,xRem,uRem,solved,stuck}。 */
  function factorBuilder(svg, pile, opts) {
    opts = opts || {};
    const OX = 58, OY = 40, W = 300, H = 330, trayY = 258;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add('geo-svg'); svg.style.touchAction = 'none';
    let p = 0, q = 0, units = 0, ghost = null, ghostType = null, tapPt = null, tapDown = false;
    const xRem = () => pile.x - p - q, uRem = () => pile.one - units;
    const solved = () => xRem() === 0 && units === pile.one && units === p * q && p > 0 && q > 0;
    const stuck = () => xRem() === 0 && uRem() > 0 && units === p * q;

    function state() { return { p, q, units, xRem: xRem(), uRem: uRem(), solved: solved(), stuck: stuck() }; }
    function draw() {
      svg.innerHTML = '';
      // 当前矩形外框（引导）
      if (p > 0 || q > 0) el(svg, 'rect', { x: OX, y: OY, width: X + p * U, height: X + q * U, fill: 'none', stroke: '#c9bfa9', 'stroke-width': 1.4, 'stroke-dasharray': '3 3' });
      // x²
      el(svg, 'rect', { x: OX, y: OY, width: X, height: X, fill: COL.xx, stroke: COL.xxs, 'stroke-width': 1.8, rx: 2 });
      el(svg, 'text', { x: OX + X / 2, y: OY + X / 2 + 5, 'font-size': 15, 'text-anchor': 'middle', 'font-weight': 700, fill: COL.xxs, 'pointer-events': 'none' }, 'x²');
      // 右列竖 x
      for (let i = 0; i < p; i++) { el(svg, 'rect', { x: OX + X + i * U, y: OY, width: U, height: X, fill: COL.x, stroke: COL.xs, 'stroke-width': 1.6, rx: 2, 'data-zone': 'right' }); }
      // 下行横 x
      for (let j = 0; j < q; j++) { el(svg, 'rect', { x: OX, y: OY + X + j * U, width: X, height: U, fill: COL.x, stroke: COL.xs, 'stroke-width': 1.6, rx: 2, 'data-zone': 'bottom' }); }
      // 角落：p×q 空槽 + 已填单位
      if (p > 0 && q > 0) {
        for (let r0 = 0; r0 < q; r0++) for (let c0 = 0; c0 < p; c0++) {
          const idx = r0 * p + c0, filled = idx < units;
          el(svg, 'rect', { x: OX + X + c0 * U, y: OY + X + r0 * U, width: U, height: U, fill: filled ? COL.one : 'transparent', stroke: filled ? COL.ones : '#d8cfba', 'stroke-width': filled ? 1.6 : 1.2, 'stroke-dasharray': filled ? '' : '3 2', rx: 2, 'data-zone': 'corner' });
        }
      }
      // 边标签
      if (p > 0) el(svg, 'text', { x: OX + X + p * U / 2, y: OY - 10, 'font-size': 13, 'text-anchor': 'middle', 'font-weight': 700, fill: '#b7791f' }, '+ ' + p);
      el(svg, 'text', { x: OX + X / 2, y: OY - 10, 'font-size': 13, 'text-anchor': 'middle', 'font-weight': 700, fill: '#4c51bf' }, 'x');
      if (q > 0) el(svg, 'text', { x: OX - 14, y: OY + X + q * U / 2 + 4, 'font-size': 13, 'text-anchor': 'middle', 'font-weight': 700, fill: '#b7791f' }, '+' + q);
      el(svg, 'text', { x: OX - 14, y: OY + X / 2 + 4, 'font-size': 13, 'text-anchor': 'middle', 'font-weight': 700, fill: '#4c51bf' }, 'x');
      // 托盘：剩余 x 砖 + 单位砖
      el(svg, 'text', { x: OX, y: trayY - 12, 'font-size': 12, fill: '#8b8271' }, '↓ 拖砖去拼（x 砖放右边竖排或下边横排；小砖填角落）');
      el(svg, 'rect', { x: OX, y: trayY, width: X, height: U, fill: xRem() > 0 ? COL.x : '#eee', stroke: COL.xs, 'stroke-width': 1.8, rx: 3, opacity: xRem() > 0 ? 1 : .4, 'data-stamp': 'x' });
      el(svg, 'text', { x: OX + X / 2, y: trayY + U / 2 + 4, 'font-size': 11, 'text-anchor': 'middle', 'font-weight': 700, fill: COL.xs, 'pointer-events': 'none' }, 'x');
      el(svg, 'text', { x: OX + X + 8, y: trayY + U / 2 + 4, 'font-size': 13, 'font-weight': 700, fill: '#57503f' }, '× ' + xRem());
      el(svg, 'rect', { x: OX + X + 54, y: trayY, width: U, height: U, fill: uRem() > 0 ? COL.one : '#eee', stroke: COL.ones, 'stroke-width': 1.8, rx: 3, opacity: uRem() > 0 ? 1 : .4, 'data-stamp': 'one' });
      el(svg, 'text', { x: OX + X + 54 + U / 2, y: trayY + U / 2 + 4, 'font-size': 11, 'text-anchor': 'middle', 'font-weight': 700, fill: COL.ones, 'pointer-events': 'none' }, '1');
      el(svg, 'text', { x: OX + X + 54 + U + 8, y: trayY + U / 2 + 4, 'font-size': 13, 'font-weight': 700, fill: '#57503f' }, '× ' + uRem());
    }
    const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    function zoneAt(x, y) {
      const rightX = OX + X, botY = OY + X;
      if (x > rightX && y > botY) return 'corner';
      if (x > rightX && y <= botY) return 'right';
      if (y > botY && x <= rightX) return 'bottom';
      // 模糊区：看谁的超出更多
      return (x - rightX) > (y - botY) ? 'right' : 'bottom';
    }
    function change() { draw(); if (opts.onChange) opts.onChange(state()); }
    svg.addEventListener('pointerdown', e => {
      const st = e.target.getAttribute && e.target.getAttribute('data-stamp');
      const [x, y] = pt(e);
      if (st && ((st === 'x' && xRem() > 0) || (st === 'one' && uRem() > 0))) {
        e.preventDefault(); try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        ghostType = st;
        const w = st === 'x' ? X : U, hh = U;
        ghost = el(svg, 'rect', { x: x - w / 2, y: y - hh / 2, width: w, height: hh, fill: COL[st === 'x' ? 'x' : 'one'], stroke: COL[(st === 'x' ? 'x' : 'one') + 's'], 'stroke-width': 2, rx: 3, opacity: .85, 'pointer-events': 'none' });
        ghost._w = w; ghost._h = hh;
        return;
      }
      // 点已放的砖 → 拿回来
      tapDown = true; tapPt = [x, y];
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    });
    svg.addEventListener('pointermove', e => {
      if (ghost) { const [x, y] = pt(e); ghost.setAttribute('x', x - ghost._w / 2); ghost.setAttribute('y', y - ghost._h / 2); return; }
      if (tapDown) { const [x, y] = pt(e); if (Math.hypot(x - tapPt[0], y - tapPt[1]) > 12) tapDown = false; }
    });
    svg.addEventListener('pointerup', e => {
      const [x, y] = pt(e);
      if (ghost) {
        const z = zoneAt(x, y);
        if (ghostType === 'x' && xRem() > 0) { if (z === 'right') p++; else if (z === 'bottom') q++; else if (z === 'corner') { if (x - (OX + X) > y - (OY + X)) p++; else q++; } if (units > p * q) units = p * q; change(); }
        else if (ghostType === 'one' && uRem() > 0 && z === 'corner' && units < p * q) { units++; change(); }
        ghost.remove(); ghost = null; ghostType = null;
        checkDone();
        return;
      }
      if (tapDown) {
        if (Math.hypot(x - tapPt[0], y - tapPt[1]) <= 12) {
          const z = zoneAt(x, y);
          if (z === 'right' && p > 0 && y <= OY + X && x <= OX + X + p * U) { p--; if (units > p * q) units = p * q; change(); }
          else if (z === 'bottom' && q > 0 && x <= OX + X && y <= OY + X + q * U) { q--; if (units > p * q) units = p * q; change(); }
          else if (z === 'corner' && units > 0) { units--; change(); }
        }
        tapDown = false;
      }
    });
    svg.addEventListener('pointercancel', () => { if (ghost) { ghost.remove(); ghost = null; ghostType = null; } tapDown = false; });
    function checkDone() { if (solved() && opts.onSolve) opts.onSolve(p, q); }
    draw();
    return { state, reset() { p = 0; q = 0; units = 0; change(); } };
  }

  return { grid, builder, factorBuilder, polyStr, fstr, palette, COL };
})();
