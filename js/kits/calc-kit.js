/* calc-kit —— 计算格式训练器：物理计算的"写规范"三步走，一步一判、点错可改选。
   第①步 选公式 → 第②步 选"带单位代入"（陷阱选项都长得很像）→ 第③步 自己算结果（数值+单位）。
   全对后展示"规范书写"示范块——这三行就是考卷上该写的样子。
   CalcKit.train(container, { problems: [...], onAllDone })
   problem = { stem, formula:{options[],answer}, sub:{options[],answer}, result:{answer,tol?,unit,units[]?}, model, note } */
window.CalcKit = (function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rich = s => esc(s).replace(/&lt;(\/?(?:b|i|br|sub|sup))&gt;/g, '<$1>');
  const shuffle = arr => arr.map((_, k) => k).sort(() => Math.random() - 0.5);

  function train(container, opts) {
    const problems = opts.problems || [];
    let pi = 0, doneCount = 0;

    function renderP() {
      const p = problems[pi];
      let step = 0;   // 0 公式 1 代入 2 结果 3 完成
      container.innerHTML = `
        <div class="qno">第 ${pi + 1} / ${problems.length} 题</div>
        <div class="qstem">${rich(p.stem)}</div>
        <div class="cksteps">
          <div class="ckstep" id="ck-f"><span class="ckn">①</span><span class="ckt">选公式</span><div class="chips" id="ck-fc"></div><span id="ck-fm"></span></div>
          <div class="ckstep" id="ck-s" hidden><span class="ckn">②</span><span class="ckt">代入（带单位！）</span><div class="chips" id="ck-sc"></div><span id="ck-sm"></span></div>
          <div class="ckstep" id="ck-r" hidden><span class="ckn">③</span><span class="ckt">算结果</span>
            <div class="numrow"><input class="numin" type="text" inputmode="decimal" placeholder="填数">
            ${p.result.units ? '<span class="chips" id="ck-ru">' + p.result.units.map(u => `<button class="chip" data-u="${esc(u)}">${esc(u)}</button>`).join('') + '</span>' : `<span class="unitfix">${esc(p.result.unit || '')}</span>`}
            <button class="btn primary" id="ck-go">确定</button></div><span id="ck-rm"></span></div>
        </div>
        <div id="ck-done"></div>`;

      const $ = id => container.querySelector('#' + id);

      // ① 公式
      const fBox = $('ck-fc');
      shuffle(p.formula.options).forEach(k => {
        const b = document.createElement('button'); b.className = 'chip'; b.innerHTML = rich(p.formula.options[k]); b.dataset.k = k;
        b.addEventListener('click', () => {
          if (step > 0) return;
          fBox.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
          const ok = k === p.formula.answer;
          b.classList.add(ok ? 'on' : 'bad');
          $('ck-fm').innerHTML = ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">再想想</b>';
          if (ok) { step = 1; $('ck-s').hidden = false; }
        });
        fBox.appendChild(b);
      });

      // ② 代入
      const sBox = $('ck-sc');
      shuffle(p.sub.options).forEach(k => {
        const b = document.createElement('button'); b.className = 'chip'; b.innerHTML = rich(p.sub.options[k]); b.dataset.k = k;
        b.addEventListener('click', () => {
          if (step !== 1) return;
          sBox.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
          const ok = k === p.sub.answer;
          b.classList.add(ok ? 'on' : 'bad');
          $('ck-sm').innerHTML = ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">仔细看数字和单位</b>';
          if (ok) { step = 2; $('ck-r').hidden = false; }
        });
        sBox.appendChild(b);
      });

      // ③ 结果
      let unitPick = null;
      container.querySelectorAll('#ck-ru .chip').forEach(c => c.addEventListener('click', () => {
        container.querySelectorAll('#ck-ru .chip').forEach(x => x.classList.remove('on'));
        c.classList.add('on'); unitPick = c.dataset.u;
      }));
      $('ck-go').addEventListener('click', () => {
        if (step !== 2) return;
        const inp = container.querySelector('#ck-r .numin');
        const v = parseFloat(String(inp.value).replace(',', '.'));
        if (isNaN(v)) { inp.classList.add('pf-shake'); setTimeout(() => inp.classList.remove('pf-shake'), 400); return; }
        if (p.result.units && !unitPick) { $('ck-ru').classList.add('pf-shake'); setTimeout(() => $('ck-ru').classList.remove('pf-shake'), 400); return; }
        const tol = (p.result.tol != null) ? p.result.tol : Math.abs(p.result.answer) * 0.01 + 1e-9;
        const ok = Math.abs(v - p.result.answer) <= tol && (!p.result.units || unitPick === p.result.unit);
        $('ck-rm').innerHTML = ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">再算算（别忘单位换算）</b>';
        if (!ok) return;
        step = 3; inp.disabled = true; $('ck-go').disabled = true;
        doneCount++;
        $('ck-done').innerHTML = `
          <div class="ckmodel"><div class="kwtitle">📝 考卷上就这么写（三行拿满分）</div><pre>${esc(p.model)}</pre></div>
          ${p.note ? `<div class="explain">${rich(p.note)}</div>` : ''}
          <div class="btnrow"><button class="btn primary" id="ck-next">${pi === problems.length - 1 ? '完成 ✓' : '下一题 ›'}</button></div>`;
        $('ck-next').addEventListener('click', () => {
          if (pi === problems.length - 1) {
            container.innerHTML = '<div class="stdline">🏁 三道规范全走完——公式、带单位代入、结果，考卷上的计算题就是这三行。</div>';
            if (opts.onAllDone) opts.onAllDone();
          } else { pi++; renderP(); }
        });
      });
    }

    renderP();
  }

  return { train };
})();
