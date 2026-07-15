/* geo-kit · transform 层 —— G0 图形运动场的地基（m13/14/15 的构造层将叠在其上）
   图形 = 顶点数组 + 变换 {tx,ty,rot(弧度),scale,flip(±1)}；单指拖=平移，双指=旋转+缩放，翻转=按钮。 */
window.GeoKit = (function () {
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- 图形库（顶点大致围绕质心） ---------- */
  function star() {
    const v = [];
    for (let i = 0; i < 10; i++) {
      const R = i % 2 === 0 ? 44 : 18, a = -Math.PI / 2 + i * Math.PI / 5;
      v.push([R * Math.cos(a), R * Math.sin(a)]);
    }
    return v;
  }
  const SHAPES = {
    tri1: { name: '锐角三角形', v: [[-40, 28], [44, 20], [-2, -40]] },
    tri2: { name: '直角三角形', v: [[-35, 25], [45, 25], [-35, -35]] },
    tri3: { name: '钝角三角形', v: [[-60, 15], [60, 15], [45, -20]] },
    sq:   { name: '正方形', v: [[-30, -30], [30, -30], [30, 30], [-30, 30]] },
    rect: { name: '长方形', v: [[-45, -25], [45, -25], [45, 25], [-45, 25]] },
    para: { name: '平行四边形', v: [[-52, 25], [28, 25], [52, -25], [-28, -25]] },
    lshape: { name: 'L 形', v: [[-30, -40], [0, -40], [0, 10], [25, 10], [25, 40], [-30, 40]] },
    star: { name: '五角星', v: star() },
    fletter: { name: '字母 F', v: [[0, 0], [35, 0], [35, 10], [12, 10], [12, 26], [30, 26], [30, 36], [12, 36], [12, 60], [0, 60]].map(p => [(p[0] - 15) * 1.25, (p[1] - 30) * 1.25]) },
    bolt: { name: '闪电', v: [[3, -40], [28, -40], [13, -14], [28, -14], [-12, 40], [1, -2], [-13, -2]] }
  };

  /* ---------- 几何计算 ---------- */
  function applyT(v, t) {
    const c = Math.cos(t.rot), s = Math.sin(t.rot);
    return v.map(p => {
      const x = p[0] * t.scale * t.flip, y = p[1] * t.scale;
      return [x * c - y * s + t.tx, x * s + y * c + t.ty];
    });
  }
  function shoelace(pts) {
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
      a += x1 * y2 - x2 * y1;
    }
    return a / 2;
  }
  function metricsOf(pts) {
    const n = pts.length, edges = [], angles = [];
    let perim = 0;
    const sgn = Math.sign(shoelace(pts)) || 1;
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
      edges.push(L); perim += L;
      const o = pts[(i - 1 + n) % n];
      const a = [o[0] - p[0], o[1] - p[1]], b = [q[0] - p[0], q[1] - p[1]];
      const dot = a[0] * b[0] + a[1] * b[1];
      const cross = a[0] * b[1] - a[1] * b[0];
      let ang = Math.acos(Math.max(-1, Math.min(1, dot / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]) || 1)))) * 180 / Math.PI;
      if (Math.sign(cross) === sgn) ang = 360 - ang;   // 凹顶点（优角）
      angles.push(ang);
    }
    return { edges, angles, perim, area: Math.abs(shoelace(pts)) };
  }

  /* ---------- 舞台 ---------- */
  function mount(svg, opts = {}) {
    const W = opts.w || 640, H = opts.h || 430;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add('geo-svg');
    svg.innerHTML = '';
    const mk = (tag, cls) => { const e = document.createElementNS(NS, tag); if (cls) e.setAttribute('class', cls); svg.appendChild(e); return e; };
    const zoneEl = mk('rect', 'zone'); zoneEl.setAttribute('visibility', 'hidden');
    const ghostEl = mk('polygon', 'ghost'); ghostEl.setAttribute('visibility', 'hidden');
    const polyEl = mk('polygon', 'shapefill');
    const handleG = mk('g');

    const HOME = { tx: opts.homeX || W * 0.36, ty: opts.homeY || H * 0.52, rot: 0, scale: 1, flip: 1 };
    let shapeId = 'tri1';
    let baseV = SHAPES.tri1.v.map(p => p.slice());
    let t = { ...HOME };
    let morph = false, morphed = false;
    let ghost = null;                      // {v, t}
    let changeCb = null, opEndCb = null;
    let gestures = opts.gestures !== false;
    let allowScaleGesture = opts.allowScale !== false;

    function ptsNow() { return applyT(baseV, t); }
    function render() {
      polyEl.setAttribute('points', ptsNow().map(p => p.map(x => x.toFixed(1)).join(',')).join(' '));
      polyEl.classList.toggle('morph', morph);
      handleG.innerHTML = '';
      if (morph) ptsNow().forEach((p, i) => {
        const h = document.createElementNS(NS, 'circle');
        h.setAttribute('class', 'vhandle'); h.setAttribute('r', 7);
        h.setAttribute('cx', p[0]); h.setAttribute('cy', p[1]);
        h.dataset.i = i; handleG.appendChild(h);
      });
    }
    function fire(kind) { if (changeCb) changeCb(kind); }
    render();

    /* ---- 指针手势 ---- */
    const pointers = new Map();
    let drag = null, pinch = null, opKind = null;
    function svgPoint(e) {
      const r = svg.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H];
    }
    svg.addEventListener('pointerdown', e => {
      e.preventDefault();
      pointers.set(e.pointerId, svgPoint(e));
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
      if (pointers.size === 1) {
        const [x, y] = svgPoint(e);
        if (morph && e.target.classList && e.target.classList.contains('vhandle')) {
          drag = { kind: 'vertex', i: +e.target.dataset.i };
          opKind = 'morph';
        } else if (e.target === polyEl || pointInPoly([x, y], ptsNow())) {
          drag = { kind: 'move', sx: x, sy: y, tx0: t.tx, ty0: t.ty };
          opKind = 'move';
        } else drag = null;
      } else if (pointers.size === 2 && gestures && !morph) {
        const [a, b] = [...pointers.values()];
        pinch = {
          d0: Math.hypot(b[0] - a[0], b[1] - a[1]),
          a0: Math.atan2(b[1] - a[1], b[0] - a[0]),
          rot0: t.rot, scale0: t.scale
        };
        drag = null; opKind = 'rotate';
      }
    });
    svg.addEventListener('pointermove', e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, svgPoint(e));
      if (pinch && pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        t.rot = pinch.rot0 + (ang - pinch.a0);
        if (allowScaleGesture) t.scale = clamp(pinch.scale0 * d / (pinch.d0 || 1), 0.4, 2.6);
        render(); fire('rotate');
      } else if (drag) {
        const [x, y] = svgPoint(e);
        if (drag.kind === 'move') {
          t.tx = drag.tx0 + x - drag.sx; t.ty = drag.ty0 + y - drag.sy;
          render(); fire('move');
        } else if (drag.kind === 'vertex') {
          // 反变换回局部坐标
          const c = Math.cos(-t.rot), s = Math.sin(-t.rot);
          const dx = x - t.tx, dy = y - t.ty;
          baseV[drag.i] = [(dx * c - dy * s) / (t.scale * t.flip), (dx * s + dy * c) / t.scale];
          morphed = true;
          render(); fire('morph');
        }
      }
    });
    function up(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) {
        drag = null;
        if (opKind) { if (opEndCb) opEndCb(opKind); opKind = null; }
      }
    }
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);

    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function pointInPoly(p, poly) {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }

    /* ---- 对外 API ---- */
    const stage = {
      SHAPES,
      get shapeId() { return shapeId; },
      get morphed() { return morphed; },
      setShape(id) {
        shapeId = id;
        baseV = SHAPES[id].v.map(p => p.slice());
        morphed = false; t = { ...HOME };
        render(); fire('set');
      },
      perturb(amount) {                       // C 组不可能关：悄悄改形状
        const i = 1;
        baseV[i] = [baseV[i][0] + amount, baseV[i][1] - amount * 0.7];
        morphed = true; render();
      },
      get() { return { ...t }; },
      set(nt) { t = { ...t, ...nt }; render(); fire('set'); },
      reset() { t = { ...HOME }; render(); fire('set'); },
      flip() { t.flip *= -1; render(); fire('flip'); if (opEndCb) opEndCb('flip'); },
      rotateTo(deg) { t.rot = deg * Math.PI / 180; render(); fire('rotate'); },
      scaleTo(s) { t.scale = clamp(s, 0.4, 2.6); render(); fire('scale'); },
      setMorph(on) { morph = on; render(); },
      metrics() {
        const m = metricsOf(ptsNow());
        m.rotDeg = ((t.rot * 180 / Math.PI) % 360 + 360) % 360;
        m.flipped = t.flip === -1;
        return m;
      },
      center() {
        const p = ptsNow();
        return [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length];
      },
      setGhost(g) {                            // g = {shapeId?, v?, t} 或 null
        ghost = g;
        if (!g) { ghostEl.setAttribute('visibility', 'hidden'); return; }
        const gv = g.v || SHAPES[g.shapeId].v;
        ghostEl.setAttribute('points', applyT(gv, g.t).map(p => p.map(x => x.toFixed(1)).join(',')).join(' '));
        ghostEl.setAttribute('visibility', 'visible');
      },
      matchGhost(tol) {
        if (!ghost) return false;
        const gv = ghost.v || SHAPES[ghost.shapeId].v;
        const A = ptsNow(), B = applyT(gv, ghost.t);
        if (A.length !== B.length) return false;
        const n = A.length;
        const tryOrder = ord => {
          for (let off = 0; off < n; off++) {
            let ok = true;
            for (let i = 0; i < n; i++) {
              const b = B[ord === 1 ? (i + off) % n : (off - i + 2 * n) % n];
              if (Math.hypot(A[i][0] - b[0], A[i][1] - b[1]) > tol) { ok = false; break; }
            }
            if (ok) return true;
          }
          return false;
        };
        return tryOrder(1) || tryOrder(-1);
      },
      snapToGhost() { if (ghost && !ghost.v) { t = { ...ghost.t }; render(); } },
      showZone(rect) {
        if (!rect) { zoneEl.setAttribute('visibility', 'hidden'); return; }
        zoneEl.setAttribute('x', rect.x); zoneEl.setAttribute('y', rect.y);
        zoneEl.setAttribute('width', rect.w); zoneEl.setAttribute('height', rect.h);
        zoneEl.setAttribute('rx', 12); zoneEl.setAttribute('visibility', 'visible');
      },
      onChange(cb) { changeCb = cb; },
      onOpEnd(cb) { opEndCb = cb; },
      setAllowScale(b) { allowScaleGesture = b; },
      W, H
    };
    return stage;
  }

  /* ---------- 构造层 v1：可拖顶点的三角形实验台（m13 首用，m14 复用） ---------- */
  function angleAt(pts, i) {
    const n = pts.length;
    const o = pts[(i - 1 + n) % n], p = pts[i], q = pts[(i + 1) % n];
    const a = [o[0] - p[0], o[1] - p[1]], b = [q[0] - p[0], q[1] - p[1]];
    const dot = a[0] * b[0] + a[1] * b[1];
    return Math.acos(Math.max(-1, Math.min(1, dot / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]) || 1)))) * 180 / Math.PI;
  }
  function triLab(svg, opts = {}) {
    const W = opts.w || 460, H = opts.h || 300;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add('geo-svg');
    svg.innerHTML = '';
    const mk = tag => { const e = document.createElementNS(NS, tag); svg.appendChild(e); return e; };
    const polyEl = mk('polygon');
    polyEl.setAttribute('class', 'shapefill');
    polyEl.style.cursor = 'default';
    const decoG = mk('g');
    const handG = mk('g');
    let pts = (opts.pts || [[W * 0.5, H * 0.22], [W * 0.2, H * 0.82], [W * 0.82, H * 0.82]]).map(p => p.slice());

    function render() {
      polyEl.setAttribute('points', pts.map(p => p.join(',')).join(' '));
      if (opts.decorate) { decoG.innerHTML = ''; opts.decorate(decoG, pts); }
      handG.innerHTML = '';
      pts.forEach((p, i) => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('class', 'vhandle'); c.setAttribute('r', 9);
        c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]);
        c.dataset.i = i; handG.appendChild(c);
      });
    }
    let dragI = -1;
    function svgPt(e) {
      const r = svg.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H];
    }
    svg.addEventListener('pointerdown', e => {
      if (e.target.classList && e.target.classList.contains('vhandle')) {
        dragI = +e.target.dataset.i;
        try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        e.preventDefault();
      }
    });
    svg.addEventListener('pointermove', e => {
      if (dragI < 0) return;
      const [x, y] = svgPt(e);
      pts[dragI] = [Math.max(14, Math.min(W - 14, x)), Math.max(14, Math.min(H - 14, y))];
      render();
      if (opts.onDrag) opts.onDrag(pts, dragI);
    });
    const stop = () => { dragI = -1; };
    svg.addEventListener('pointerup', stop);
    svg.addEventListener('pointercancel', stop);
    render();
    if (opts.onDrag) opts.onDrag(pts, -1);
    return {
      get pts() { return pts; },
      set(np) { pts = np.map(p => p.slice()); render(); if (opts.onDrag) opts.onDrag(pts, -1); },
      render
    };
  }

  return { mount, SHAPES, triLab, angleAt };
})();
