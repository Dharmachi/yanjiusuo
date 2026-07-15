/* graph-kit —— s-t / v-t / 温度-时间 图像台（p1 首用，p3 复用）。
   plot() 返回一个绘图器：push 实时数据、setGhost 目标曲线、reset。 */
window.GraphKit = (function () {
  const NS = 'http://www.w3.org/2000/svg';

  /**
   * plot(svg, {xMax, yMax, xLab, yLab, color, title})
   */
  function plot(svg, opts) {
    const W = 320, H = 220, L = 46, B = 182, PW = 254, PH = 148;
    const yMin = opts.yMin || 0;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add('geo-svg');
    svg.innerHTML = '';
    const mk = (tag, attrs, txt) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
      if (txt !== undefined) e.textContent = txt;
      svg.appendChild(e); return e;
    };
    // 坐标轴
    mk('line', { x1: L, y1: B, x2: L + PW, y2: B, stroke: '#57503f', 'stroke-width': 1.8 });
    mk('line', { x1: L, y1: B, x2: L, y2: B - PH, stroke: '#57503f', 'stroke-width': 1.8 });
    mk('text', { x: L + PW - 2, y: B + 16, 'font-size': 11, fill: '#57503f', 'text-anchor': 'end' }, opts.xLab || 't/s');
    mk('text', { x: L - 6, y: B - PH + 4, 'font-size': 11, fill: '#57503f', 'text-anchor': 'end' }, opts.yLab || '');
    if (opts.title) mk('text', { x: L + 6, y: 20, 'font-size': 12.5, 'font-weight': 700, fill: '#27231b' }, opts.title);
    // 刻度（0 / 半 / 满）
    [0, 0.5, 1].forEach(f => {
      const x = L + f * PW, y = B - f * PH;
      mk('line', { x1: x, y1: B, x2: x, y2: B + 4, stroke: '#57503f', 'stroke-width': 1.2 });
      mk('text', { x, y: B + 15, 'font-size': 10, fill: '#8b8271', 'text-anchor': 'middle' }, String(Math.round(opts.xMax * f * 10) / 10));
      mk('line', { x1: L - 4, y1: y, x2: L, y2: y, stroke: '#57503f', 'stroke-width': 1.2 });
      mk('text', { x: L - 7, y: y + 3.5, 'font-size': 10, fill: '#8b8271', 'text-anchor': 'end' }, String(Math.round((yMin + (opts.yMax - yMin) * f) * 10) / 10));
      if (f > 0) {
        mk('line', { x1: L, y1: y, x2: L + PW, y2: y, stroke: '#e6dfd0', 'stroke-width': 1 });
        mk('line', { x1: x, y1: B, x2: x, y2: B - PH, stroke: '#efe9dc', 'stroke-width': 1 });
      }
    });
    const ghostEl = mk('polyline', { fill: 'none', stroke: '#b7791f', 'stroke-width': 2.2, 'stroke-dasharray': '7 5', points: '' });
    const lineEl = mk('polyline', { fill: 'none', stroke: opts.color || '#0f766e', 'stroke-width': 2.6, 'stroke-linejoin': 'round', points: '' });
    const dot = mk('circle', { r: 4, fill: opts.color || '#0f766e', visibility: 'hidden' });

    const X = t => L + Math.max(0, Math.min(1, t / opts.xMax)) * PW;
    const Yv = v => B - Math.max(0, Math.min(1, (v - yMin) / (opts.yMax - yMin))) * PH;
    let pts = [];

    return {
      push(t, v) {
        pts.push(`${X(t).toFixed(1)},${Yv(v).toFixed(1)}`);
        lineEl.setAttribute('points', pts.join(' '));
        dot.setAttribute('cx', X(t)); dot.setAttribute('cy', Yv(v));
        dot.setAttribute('visibility', 'visible');
      },
      reset() { pts = []; lineEl.setAttribute('points', ''); dot.setAttribute('visibility', 'hidden'); },
      setGhost(pairs) {
        ghostEl.setAttribute('points', pairs.map(p => `${X(p[0]).toFixed(1)},${Yv(p[1]).toFixed(1)}`).join(' '));
      },
      clearGhost() { ghostEl.setAttribute('points', ''); }
    };
  }

  return { plot };
})();
