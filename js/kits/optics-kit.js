/* optics-kit —— 光路引擎（p5 透镜旗舰，p4 光现象反向复用）。
   薄透镜成像：1/f = 1/u + 1/v  ⇒  v = u·f/(u−f)。
   约定（世界坐标，单位=格；1 格当作 2cm，UI 里换算显示）：主光轴 y=0，凸透镜在 x=0，
   蜡烛在左侧 x=−u（u>0），像点 (v, −objH·v/u) —— 这一条式子同时给出实像(v>0,右侧,倒立)与
   虚像(v<0,左侧,正立)的位置与朝向，方向自动正确。
   三条特殊光线：①平行主轴→折射后过另一侧焦点F′(f,0)；②过光心O→不偏折；③过焦点F(−f,0)→折射后平行主轴。
   OpticsKit.bench(svg, opts) → 句柄 {setU,setF,setScreen,setScreenU,getState,redraw,onChange}。 */
window.OpticsKit = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (parent, tag, attrs, txt) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (txt !== undefined) e.textContent = txt;
    parent.appendChild(e);
    return e;
  };

  // 每格代表的厘米数（只影响读数文案，不影响几何）
  const CM = 2;

  function bench(svg, opts) {
    opts = opts || {};
    const VBW = opts.VBW || 640, VBH = opts.VBH || 300;
    const cx = VBW * 0.5, cy = Math.round(VBH * 0.54), S = opts.S || 12; // px/格
    const X = wx => cx + wx * S;
    const Yc = wy => cy - wy * S;

    let f = opts.f || 7;
    let u = opts.u || 20;
    const objH = opts.objH || 2.6;
    let screenOn = !!opts.screen;
    let screenU = opts.screenU || 16;      // 光屏世界横坐标（透镜右侧为正）
    const nameImage = opts.nameImage !== false;  // 是否在像旁标"实像/虚像"（剧透审查：发现阶段关掉）
    const uMin = opts.uMin || 2.4, uMax = opts.uMax || 26;
    const fMin = opts.fMin || 4, fMax = opts.fMax || 11;
    const showRays = opts.rays !== false;

    svg.setAttribute('viewBox', `0 0 ${VBW} ${VBH}`);
    svg.setAttribute('style', (opts.style || 'width:100%;height:auto') + ';touch-action:none;user-select:none');

    // ---- 计算成像状态 ----
    function compute() {
      const nearFocus = Math.abs(u - f) < 0.22 * f;      // u≈f：不成像
      let v, real, virtual, inverted, mag;
      if (nearFocus) { v = Infinity; real = false; virtual = false; inverted = false; mag = Infinity; }
      else {
        v = u * f / (u - f);
        real = v > 0; virtual = v < 0; inverted = real; mag = Math.abs(v) / u;
      }
      let region;
      if (nearFocus) region = 'u=f';
      else if (Math.abs(u - 2 * f) < 0.28 * f) region = 'u=2f';
      else if (u > 2 * f) region = 'u>2f';
      else if (u > f) region = 'f<u<2f';
      else region = 'u<f';
      return { u, f, v, real, virtual, inverted, mag, region, nearFocus, objH, CM };
    }

    // ---- 画一条从 (x0,y0) 沿方向 (dx,dy) 的长线（超出 viewBox 自动裁剪）----
    function ray(g, x0, y0, dx, dy, col, dash, t) {
      const T = t || 60;
      mk(g, 'line', { x1: X(x0), y1: Yc(y0), x2: X(x0 + dx * T), y2: Yc(y0 + dy * T), stroke: col, 'stroke-width': 1.7, ...(dash ? { 'stroke-dasharray': dash } : {}) });
    }
    function seg(g, x0, y0, x1, y1, col, w, dash) {
      mk(g, 'line', { x1: X(x0), y1: Yc(y0), x2: X(x1), y2: Yc(y1), stroke: col, 'stroke-width': w || 1.7, ...(dash ? { 'stroke-dasharray': dash } : {}) });
    }

    let handle = {};

    function redraw() {
      const st = compute();
      svg.innerHTML = '';

      // 背景轴
      mk(svg, 'line', { x1: 8, y1: Yc(0), x2: VBW - 8, y2: Yc(0), stroke: '#8b8271', 'stroke-width': 1.3 });   // 主光轴
      mk(svg, 'text', { x: VBW - 10, y: Yc(0) - 6, 'font-size': 10, fill: '#8b8271', 'text-anchor': 'end' }, '主光轴');

      // 焦点 F / 2F 刻度（常亮，纠"焦距=透镜到像距离"）
      const marks = [[-2 * f, '2F'], [-f, 'F'], [f, "F′"], [2 * f, "2F′"]];
      marks.forEach(([mx, lab]) => {
        mk(svg, 'line', { x1: X(mx), y1: Yc(0) - 5, x2: X(mx), y2: Yc(0) + 5, stroke: '#b7791f', 'stroke-width': 1.5 });
        mk(svg, 'circle', { cx: X(mx), cy: Yc(0), r: 2.6, fill: '#b7791f' });
        mk(svg, 'text', { x: X(mx), y: Yc(0) + 18, 'font-size': 10.5, fill: '#b7791f', 'text-anchor': 'middle', 'font-weight': 700 }, lab);
      });

      // 凸透镜（双凸轮廓 + 上下箭头示会聚）
      const lensH = objH * 2.05;
      const ly0 = Yc(lensH), ly1 = Yc(-lensH), bulge = 15;
      mk(svg, 'path', {
        d: `M ${cx} ${ly0} Q ${cx + bulge} ${cy} ${cx} ${ly1} Q ${cx - bulge} ${cy} ${cx} ${ly0} Z`,
        fill: 'rgba(76,129,191,.14)', stroke: '#4c81bf', 'stroke-width': 1.8
      });
      mk(svg, 'polygon', { points: `${cx - 4},${ly0} ${cx + 4},${ly0} ${cx},${ly0 + 7}`, fill: '#4c81bf' });
      mk(svg, 'polygon', { points: `${cx - 4},${ly1} ${cx + 4},${ly1} ${cx},${ly1 - 7}`, fill: '#4c81bf' });
      mk(svg, 'circle', { cx: cx, cy: cy, r: 2.4, fill: '#4c81bf' });
      mk(svg, 'text', { x: cx + 8, y: cy - 4, 'font-size': 10, fill: '#4c81bf' }, 'O');

      // 物（蜡烛：箭头向上）
      const oX = -u;
      mk(svg, 'line', { x1: X(oX), y1: Yc(0), x2: X(oX), y2: Yc(objH), stroke: '#b91c1c', 'stroke-width': 3 });
      mk(svg, 'polygon', { points: `${X(oX) - 5},${Yc(objH)} ${X(oX) + 5},${Yc(objH)} ${X(oX)},${Yc(objH) - 8}`, fill: '#b91c1c' });
      mk(svg, 'text', { x: X(oX), y: Yc(0) + 16, 'font-size': 11, fill: '#b91c1c', 'text-anchor': 'middle', 'font-weight': 700 }, '烛');

      // 三条特殊光线（从烛焰顶点 P）
      if (showRays && !st.nearFocus) {
        const P = [oX, objH];
        const cA = '#0f766e', cB = '#4c51bf', cC = '#b7791f';
        // ① 平行 → 折射过 F′(f,0)
        seg(svg, P[0], P[1], 0, objH, cA, 1.7);
        const dA = [f - 0, 0 - objH];
        // ② 过光心 → 不偏折
        seg(svg, P[0], P[1], 0, 0, cB, 1.7);
        const dB = [u, -objH];
        // ③ 过焦点 F(−f,0) → 折射后平行主轴
        const yC = objH * f / (f - u);        // 光线在透镜处的高度
        seg(svg, P[0], P[1], 0, yC, cC, 1.7);
        const dC = [1, 0];
        if (st.real) {
          // 实像：折射光线实线继续，会聚于像点
          ray(svg, 0, objH, dA[0], dA[1], cA);
          ray(svg, 0, 0, dB[0], dB[1], cB);
          ray(svg, 0, yC, dC[0], dC[1], cC);
        } else {
          // 虚像：折射光线发散（实线向右），反向延长线（虚线向左）交于虚像
          ray(svg, 0, objH, dA[0], dA[1], cA);
          ray(svg, 0, 0, dB[0], dB[1], cB);
          ray(svg, 0, yC, dC[0], dC[1], cC);
          ray(svg, 0, objH, -dA[0], -dA[1], cA, '5 4', 40);
          ray(svg, 0, 0, -dB[0], -dB[1], cB, '5 4', 40);
          ray(svg, 0, yC, -dC[0], -dC[1], cC, '5 4', 40);
        }
      } else if (st.nearFocus && showRays) {
        // u=f：折射后平行射出，不成像
        seg(svg, oX, objH, 0, objH, '#0f766e', 1.7);
        ray(svg, 0, objH, f, -objH, '#0f766e');
        ray(svg, 0, 0, u, -objH, '#4c51bf');
        mk(svg, 'text', { x: cx + 60, y: Yc(objH) - 6, 'font-size': 11, fill: '#57503f' }, '折射光平行射出 → 不成像');
      }

      // 像（箭头）：实像红实线、虚像灰虚线
      if (!st.nearFocus && isFinite(st.v)) {
        const iX = st.v, iY = -objH * st.v / u;   // 像顶点纵坐标（负=倒立）
        const col = st.real ? '#b91c1c' : '#6b7280';
        if (X(iX) > 4 && X(iX) < VBW - 4) {
          mk(svg, 'line', { x1: X(iX), y1: Yc(0), x2: X(iX), y2: Yc(iY), stroke: col, 'stroke-width': 3, ...(st.virtual ? { 'stroke-dasharray': '5 4' } : {}) });
          mk(svg, 'polygon', { points: `${X(iX) - 5},${Yc(iY)} ${X(iX) + 5},${Yc(iY)} ${X(iX)},${Yc(iY) + (iY > 0 ? -8 : 8)}`, fill: col, ...(st.virtual ? { opacity: .8 } : {}) });
          if (nameImage) mk(svg, 'text', { x: X(iX), y: Yc(0) + (iY > 0 ? -6 : 16), 'font-size': 10.5, fill: col, 'text-anchor': 'middle', 'font-weight': 700 }, st.real ? '实像' : '虚像');
        } else {
          // 像跑出画面（物近像远的真实结果）
          const side = X(iX) >= VBW - 4 ? VBW - 12 : 12;
          mk(svg, 'text', { x: side, y: Yc(0) - 10, 'font-size': 11, fill: col, 'text-anchor': X(iX) >= VBW - 4 ? 'end' : 'start', 'font-weight': 700 }, X(iX) >= VBW - 4 ? '像在很远处 →' : '← 像在此侧');
        }
      }

      // 光屏（可选，可拖）
      if (screenOn) {
        const sx = X(screenU);
        const near = st.real && Math.abs(screenU - st.v) < 0.9;
        mk(svg, 'rect', { x: sx - 3, y: Yc(objH * 2.4), width: 6, height: (objH * 2.4) * 2 * S, rx: 2, fill: near ? 'rgba(21,128,61,.25)' : '#efe9db', stroke: near ? '#15803d' : '#b6ab93', 'stroke-width': 1.6, style: 'cursor:ew-resize' });
        if (st.real) {
          if (near) {
            // 屏上呈现清晰的倒立像
            const h = objH * st.v / u;
            mk(svg, 'line', { x1: sx, y1: Yc(0), x2: sx, y2: Yc(-h), stroke: '#15803d', 'stroke-width': 3 });
            mk(svg, 'polygon', { points: `${sx - 5},${Yc(-h)} ${sx + 5},${Yc(-h)} ${sx},${Yc(-h) + 8}`, fill: '#15803d' });
            mk(svg, 'text', { x: sx, y: Yc(objH * 2.4) - 6, 'font-size': 10.5, fill: '#15803d', 'text-anchor': 'middle', 'font-weight': 700 }, '✓ 清晰');
          } else {
            const blur = Math.min(16, 3 + Math.abs(screenU - st.v) * 2.4);
            mk(svg, 'ellipse', { cx: sx, cy: cy, rx: blur, ry: blur * 1.2, fill: 'rgba(107,114,128,.28)' });
            mk(svg, 'text', { x: sx, y: Yc(objH * 2.4) - 6, 'font-size': 10, fill: '#8b8271', 'text-anchor': 'middle' }, '模糊');
          }
        } else {
          mk(svg, 'text', { x: sx, y: Yc(objH * 2.4) - 6, 'font-size': 10, fill: '#8b8271', 'text-anchor': 'middle' }, '屏上接不到');
        }
      }

      if (handle.onChange) handle.onChange(st);
      handle._st = st;
    }

    // ---- 拖动：蜡烛（改 u）、光屏（改 screenU）----
    function clientToWorldX(clientX) {
      const r = svg.getBoundingClientRect();
      const vbX = (clientX - r.left) / r.width * VBW;
      return (vbX - cx) / S;
    }
    let dragging = null;
    svg.addEventListener('pointerdown', e => {
      const wx = clientToWorldX(e.clientX);
      const dObj = Math.abs(wx - (-u));
      const dScr = screenOn ? Math.abs(wx - screenU) : 1e9;
      if (dObj < 1.6 && dObj <= dScr) dragging = 'obj';
      else if (screenOn && dScr < 1.6) dragging = 'scr';
      else if (opts.draggableObj !== false) dragging = 'obj';   // 点空白也抓蜡烛，触屏更宽容
      else return;
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove', e => {
      if (!dragging) return;
      const wx = clientToWorldX(e.clientX);
      if (dragging === 'obj') { u = Math.max(uMin, Math.min(uMax, -wx)); redraw(); }
      else { screenU = Math.max(1, Math.min(uMax + 6, wx)); redraw(); }
    });
    const endDrag = e => { if (dragging) { dragging = null; try { svg.releasePointerCapture(e.pointerId); } catch (_) {} } };
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    handle = {
      setU(nu) { u = Math.max(uMin, Math.min(uMax, nu)); redraw(); },
      setF(nf) { f = Math.max(fMin, Math.min(fMax, nf)); redraw(); },
      setScreen(on) { screenOn = on; redraw(); },
      setScreenU(su) { screenU = su; redraw(); },
      getState: () => compute(),
      redraw,
      onChange: opts.onChange || null,
      get u() { return u; }, get f() { return f; }, get screenU() { return screenU; }
    };
    redraw();
    return handle;
  }

  return { bench, CM };
})();
