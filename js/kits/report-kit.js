/* report-kit —— 实验报告模式：把"现象级"模拟包成考试要的"规范级"实验探究。
   流程逐段解锁：原理(先问) → 器材(勾选判定) → 步骤(排序) → 数据表(自己算) → 结论(填空) → 误差辨析 → 报告完成卡。
   ReportKit.run(container, cfg)
   cfg = { title, aim,
     principle: {q, options[], answer},
     gear: {items:[{name, need}], hint},
     steps: {items[] 按正确顺序},
     table: {cols[], rows[[cell...]]}  cell = 文本 或 {input:{answer,tol?,unit?}},
     conclusion: [{pre, options[], answer, post}],
     errors: [{q, options[], answer, note}],
     onDone } */
window.ReportKit = (function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rich = s => esc(s).replace(/&lt;(\/?(?:b|i|br|sub|sup))&gt;/g, '<$1>');
  const shuffle = arr => arr.map((_, k) => k).sort(() => Math.random() - 0.5);

  function run(container, cfg) {
    container.innerHTML = `
      <div class="card">
        <h3>🧾 实验报告 · ${rich(cfg.title)}</h3>
        <p class="small"><b>目的：</b>${rich(cfg.aim)}</p>
        <div class="rpstage" id="rp-principle"><h4>一、实验原理</h4><div class="rpbody"></div></div>
        <div class="rpstage" id="rp-gear" hidden><h4>二、器材（把需要的全勾上，多勾少勾都不行）</h4><div class="rpbody"></div></div>
        <div class="rpstage" id="rp-steps" hidden><h4>三、步骤（点选排出正确顺序）</h4><div class="rpbody"></div></div>
        <div class="rpstage" id="rp-table" hidden><h4>四、数据记录（空格自己算）</h4><div class="rpbody"></div></div>
        <div class="rpstage" id="rp-conc" hidden><h4>五、结论</h4><div class="rpbody"></div></div>
        <div class="rpstage" id="rp-err" hidden><h4>六、误差辨析</h4><div class="rpbody"></div></div>
        <div id="rp-final"></div>
      </div>`;
    const $ = id => container.querySelector('#' + id);
    const body = id => $(id).querySelector('.rpbody');
    const unlock = id => { $(id).hidden = false; $(id).scrollIntoView({ block: 'nearest' }); };

    /* 一、原理（先问） */
    (function principle() {
      const p = cfg.principle, box = body('rp-principle');
      box.innerHTML = `<p class="small">${rich(p.q)}</p><div class="chips"></div><span class="rpmark"></span>`;
      const chips = box.querySelector('.chips');
      shuffle(p.options).forEach(k => {
        const b = document.createElement('button'); b.className = 'chip'; b.innerHTML = rich(p.options[k]);
        b.addEventListener('click', () => {
          chips.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
          const ok = k === p.answer; b.classList.add(ok ? 'on' : 'bad');
          box.querySelector('.rpmark').innerHTML = ok ? ' <b style="color:var(--ok)">✓</b>' : ' <b style="color:var(--bad)">再想想</b>';
          if (ok) unlock('rp-gear');
        });
        chips.appendChild(b);
      });
    })();

    /* 二、器材 */
    (function gear() {
      const g = cfg.gear, box = body('rp-gear');
      const order = shuffle(g.items);
      box.innerHTML = `<div class="chips">${order.map(k => `<button class="chip" data-k="${k}">${rich(g.items[k].name)}</button>`).join('')}</div>
        <div class="btnrow"><button class="btn primary" id="rp-gearsub">就带这些</button></div><p class="small" id="rp-gearmsg"></p>`;
      const picked = new Set();
      box.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
        if (c.disabled) return;
        const k = +c.dataset.k; picked.has(k) ? picked.delete(k) : picked.add(k); c.classList.toggle('on');
      }));
      $('rp-gearsub').addEventListener('click', () => {
        const miss = g.items.filter((it, k) => it.need && !picked.has(k)).map(it => it.name);
        const extra = g.items.filter((it, k) => !it.need && picked.has(k)).map(it => it.name);
        if (!miss.length && !extra.length) {
          box.querySelectorAll('.chip').forEach(c => c.disabled = true); $('rp-gearsub').disabled = true;
          $('rp-gearmsg').innerHTML = `<b style="color:var(--ok)">✓ 器材齐了。</b>${g.hint ? rich(g.hint) : ''}`;
          unlock('rp-steps');
        } else {
          $('rp-gearmsg').innerHTML = `<b style="color:var(--bad)">还不对：</b>${miss.length ? '漏了「' + miss.join('、') + '」' : ''}${miss.length && extra.length ? '；' : ''}${extra.length ? '「' + extra.join('、') + '」用不上（想想每样是量什么的）' : ''}`;
        }
      });
    })();

    /* 三、步骤排序 */
    (function steps() {
      const items = cfg.steps.items, box = body('rp-steps');
      const seq = [];
      box.innerHTML = `<div class="ordseq" id="rp-seq"></div><div class="chips ordpool">${shuffle(items).map(k => `<button class="chip" data-k="${k}">${rich(items[k])}</button>`).join('')}</div>
        <div class="btnrow"><button class="btn primary" id="rp-stepsub" disabled>就这个顺序</button></div><p class="small" id="rp-stepmsg"></p>`;
      const redraw = () => {
        $('rp-seq').innerHTML = seq.map((k, pos) => `<button class="chip on" data-s="${k}">${pos + 1}. ${rich(items[k])}</button>`).join('') || '<span class="hint">（点下面的步骤，按顺序放进来）</span>';
        box.querySelectorAll('.ordpool .chip').forEach(c => { c.style.display = seq.includes(+c.dataset.k) ? 'none' : ''; });
        $('rp-stepsub').disabled = seq.length !== items.length;
        $('rp-seq').querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => { seq.splice(seq.indexOf(+c.dataset.s), 1); redraw(); }));
      };
      box.querySelectorAll('.ordpool .chip').forEach(c => c.addEventListener('click', () => { seq.push(+c.dataset.k); redraw(); }));
      $('rp-stepsub').addEventListener('click', () => {
        if (seq.every((k, pos) => k === pos)) {
          $('rp-stepmsg').innerHTML = '<b style="color:var(--ok)">✓ 顺序正确。</b>';
          box.querySelectorAll('.chip').forEach(c => c.disabled = true); $('rp-stepsub').disabled = true;
          unlock('rp-table');
        } else {
          $('rp-stepmsg').innerHTML = '<b style="color:var(--bad)">顺序还不对</b>——点序列里放错的拿回来重排。';
        }
      });
      redraw();
    })();

    /* 四、数据表（含待算空格） */
    (function table() {
      const t = cfg.table, box = body('rp-table');
      let html = '<table class="fill lens"><tr>' + t.cols.map(c => '<th>' + rich(c) + '</th>').join('') + '</tr>';
      const inputs = [];
      t.rows.forEach((row, ri) => {
        html += '<tr>' + row.map((cell, ci) => {
          if (cell && typeof cell === 'object' && cell.input) {
            const id = `rp-in-${ri}-${ci}`; inputs.push({ id, ...cell.input });
            return `<td><input class="numin small" type="text" inputmode="decimal" id="${id}" style="width:64px">${cell.input.unit ? ' ' + esc(cell.input.unit) : ''}</td>`;
          }
          return '<td>' + rich(String(cell)) + '</td>';
        }).join('') + '</tr>';
      });
      html += '</table><div class="btnrow"><button class="btn primary" id="rp-tabsub">检查数据</button></div><p class="small" id="rp-tabmsg"></p>';
      box.innerHTML = html;
      $('rp-tabsub').addEventListener('click', () => {
        let allOk = true;
        inputs.forEach(f => {
          const inp = $(f.id);
          const v = parseFloat(String(inp.value).replace(',', '.'));
          const tol = (f.tol != null) ? f.tol : Math.abs(f.answer) * 0.01 + 1e-9;
          const ok = !isNaN(v) && Math.abs(v - f.answer) <= tol;
          inp.classList.toggle('good', ok); inp.classList.toggle('badpick', !ok);
          if (!ok) allOk = false;
        });
        if (allOk) {
          inputs.forEach(f => { $(f.id).disabled = true; }); $('rp-tabsub').disabled = true;
          $('rp-tabmsg').innerHTML = '<b style="color:var(--ok)">✓ 数据全对。</b>';
          unlock('rp-conc');
        } else $('rp-tabmsg').innerHTML = '<b style="color:var(--bad)">红框的再算一遍</b>（v = s ÷ t，注意单位）。';
      });
    })();

    /* 五、结论填空 */
    (function conclusion() {
      const box = body('rp-conc');
      const done = {};
      box.innerHTML = cfg.conclusion.map((c, i) =>
        `<p class="small">${rich(c.pre)} <span class="chips" data-i="${i}" style="display:inline-flex">${shuffle(c.options).map(k => `<button class="chip" data-k="${k}">${rich(c.options[k])}</button>`).join('')}</span> ${rich(c.post || '')} <span id="rp-cm-${i}"></span></p>`).join('');
      box.querySelectorAll('.chips').forEach(ch => ch.addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b || b.disabled) return;
        const i = +ch.dataset.i, k = +b.dataset.k, ok = k === cfg.conclusion[i].answer;
        ch.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
        b.classList.add(ok ? 'on' : 'bad');
        $('rp-cm-' + i).innerHTML = ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">×</b>';
        if (ok) done[i] = true;
        if (Object.keys(done).length === cfg.conclusion.length) unlock('rp-err');
      }));
    })();

    /* 六、误差辨析 */
    (function errors() {
      const box = body('rp-err');
      const done = {};
      box.innerHTML = cfg.errors.map((er, i) =>
        `<div class="liferow"><span style="flex:1;min-width:150px">${rich(er.q)}</span>
          <span class="chips" data-i="${i}" style="margin:0">${shuffle(er.options).map(k => `<button class="chip" data-k="${k}">${rich(er.options[k])}</button>`).join('')}</span>
          <span id="rp-em-${i}"></span></div><p class="small" id="rp-en-${i}"></p>`).join('');
      box.querySelectorAll('.chips').forEach(ch => ch.addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b || b.disabled) return;
        const i = +ch.dataset.i, k = +b.dataset.k, ok = k === cfg.errors[i].answer;
        ch.querySelectorAll('.chip').forEach(c => c.classList.remove('on', 'bad'));
        b.classList.add(ok ? 'on' : 'bad');
        $('rp-em-' + i).innerHTML = ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--bad)">再想想</b>';
        if (ok) { done[i] = true; $('rp-en-' + i).innerHTML = '<span class="hint">' + rich(cfg.errors[i].note) + '</span>'; }
        if (Object.keys(done).length === cfg.errors.length) {
          $('rp-final').innerHTML = '<div class="stdline">🏅 <b>实验报告完成！</b>原理、器材、步骤、数据、结论、误差——考卷上的实验探究题，就按这六段答。</div>';
          if (cfg.onDone) cfg.onDone();
        }
      }));
    })();
  }

  return { run };
})();
