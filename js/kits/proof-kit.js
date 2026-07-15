/* proof-kit —— 证明脚手架引擎：三档递进练"几何证明的书写"。
   档1 选理由（语句给出）· 档2 补语句（理由给出）· 档3 白板组装（步骤卡排序）。 */
window.ProofKit = (function () {

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /**
   * mount(container, problem, hooks)
   * problem: {
   *   mode: 1|2|3, title, given, prove, figure(svgEl)?,
   *   lines: [ {frame:'…'} | {stmt, reason, reasonOpts?, stmtOpts?} | {concl, reason, reasonOpts?} ]
   * }
   * hooks: { onDone() }
   */
  function mount(container, prob, hooks = {}) {
    container.innerHTML = '';
    const head = document.createElement('div');
    head.innerHTML =
      `<p style="margin:.2em 0"><b>${esc(prob.title)}</b></p>
       <p class="small">已知：${esc(prob.given)}　<b>求证：${esc(prob.prove)}</b></p>`;
    container.appendChild(head);

    if (prob.figure) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 300 150');
      svg.classList.add('geo-svg');
      svg.style.maxWidth = '300px';
      svg.style.height = '150px';
      prob.figure(svg);
      container.appendChild(svg);
    }

    const body = document.createElement('div');
    body.style.marginTop = '10px';
    container.appendChild(body);

    const checkable = prob.lines.filter(l => !l.frame);
    let okCount = 0;

    function lineDone(row) {
      row.classList.add('pf-ok');
      okCount++;
      if (okCount === checkable.length) {
        const fin = document.createElement('div');
        fin.className = 'stdline';
        fin.innerHTML = '✓ 证明完整——语句每一步都有理由，这就是标准书写。';
        container.appendChild(fin);
        if (hooks.onDone) hooks.onDone();
      }
    }

    if (prob.mode === 3) {
      /* 档3：白板组装 —— 按正确顺序点选步骤卡 */
      const seq = prob.lines.filter(l => !l.frame);
      const frame = prob.lines.find(l => l.frame);
      const area = document.createElement('div');
      area.innerHTML = (frame ? `<p class="pf-line">${esc(frame.frame)}</p>` : '') + '<div class="pf-slot"></div>';
      const pool = document.createElement('div');
      pool.className = 'chips';
      pool.style.marginTop = '12px';
      body.appendChild(area);
      body.appendChild(document.createElement('hr')).className = 'divider';
      const poolTitle = document.createElement('p');
      poolTitle.className = 'hint';
      poolTitle.textContent = '从下面的步骤卡里，按正确顺序点进证明：';
      body.appendChild(poolTitle);
      body.appendChild(pool);
      let next = 0;
      const cardTxt = l => (l.stmt || l.concl) + '（' + l.reason + '）';
      seq.map((l, i) => ({ l, i })).sort(() => Math.random() - 0.5).forEach(({ l, i }) => {
        const b = document.createElement('button');
        b.className = 'chip';
        b.style.maxWidth = '100%';
        b.textContent = cardTxt(l);
        b.addEventListener('click', () => {
          if (i !== next) {
            b.classList.add('pf-shake');
            setTimeout(() => b.classList.remove('pf-shake'), 400);
            return;
          }
          next++;
          b.disabled = true; b.style.opacity = .35;
          const row = document.createElement('p');
          row.className = 'pf-line pf-ok';
          row.textContent = (l.concl ? '∴ ' : '') + cardTxt(l).replace(/^∴ /, '');
          area.querySelector('.pf-slot').appendChild(row);
          okCount++;
          if (okCount === seq.length) {
            const fin = document.createElement('div');
            fin.className = 'stdline';
            fin.innerHTML = '✓ 白板组装成功——你已经能独立搭出一个完整证明。';
            container.appendChild(fin);
            if (hooks.onDone) hooks.onDone();
          }
        });
        pool.appendChild(b);
      });
      return;
    }

    /* 档1 / 档2：逐行填空 */
    prob.lines.forEach(l => {
      const row = document.createElement('p');
      row.className = 'pf-line';
      if (l.frame) { row.textContent = l.frame; body.appendChild(row); return; }
      const isConcl = !!l.concl;
      const stmtHtml = (prob.mode === 2 && l.stmtOpts && !isConcl)
        ? `<select class="blank pf-sel" data-k="stmt"><option value="">选语句</option>${l.stmtOpts.map(o => `<option>${esc(o)}</option>`).join('')}</select>`
        : esc(l.stmt || l.concl);
      const reasonHtml = (prob.mode === 1 || isConcl || !l.stmtOpts)
        ? `<select class="blank pf-sel" data-k="reason"><option value="">选理由</option>${(l.reasonOpts || [l.reason]).map(o => `<option>${esc(o)}</option>`).join('')}</select>`
        : `<span class="pf-reason">（${esc(l.reason)}）</span>`;
      row.innerHTML = (isConcl ? '∴ ' : '') + stmtHtml + '　' + (reasonHtml.startsWith('<span') ? reasonHtml : '（' + reasonHtml + '）');
      body.appendChild(row);

      const sels = row.querySelectorAll('select');
      if (!sels.length) { okCount++; return; }
      function check() {
        let all = true;
        sels.forEach(s => {
          const want = s.dataset.k === 'stmt' ? l.stmt : l.reason;
          const ok = s.value === want;
          s.classList.toggle('good', ok);
          s.classList.toggle('badpick', !ok && s.value !== '');
          if (!ok) all = false;
        });
        if (all && !row.classList.contains('pf-ok')) lineDone(row);
      }
      sels.forEach(s => s.addEventListener('change', check));
    });
  }

  return { mount };
})();
