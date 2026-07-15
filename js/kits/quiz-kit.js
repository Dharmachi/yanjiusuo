/* quiz-kit v2 —— 自测引擎：一次一题、即时反馈、必看解析；对错回调交给上层（错因本在 app.js 接线）。
   题型（q.type，缺省 'single'）：
   - single：单选。options[] + answer(索引)。选项随机排序。
   - multi ：多选。options[] + answers[索引数组]。chips 多选 + 确定。
   - numeric：数值输入。answer(数) + tol(容差，缺省 |answer|×1% ) + unit('m/s'，展示) 或 units[]（须选对单位）。
   - order ：排序。items[]（按正确顺序书写），展示时打乱，点选入序。
   题干/选项/解析支持少量 HTML 标签（b/i/br/sub/sup），其余字符一律转义（math 里的 < > 安全）。
   q.fig 可携带受信任的内联 SVG（作图/读数题配图），原样渲染。 */
window.QuizKit = (function () {

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  // 先全转义，再放行白名单标签——作者能用 <b>，数学里的 "f < u" 不会被当成标签吞掉
  function rich(s) { return esc(s).replace(/&lt;(\/?(?:b|i|br|sub|sup))&gt;/g, '<$1>'); }
  const shuffle = arr => arr.map((_, k) => k).sort(() => Math.random() - 0.5);

  /**
   * mount(container, questions, hooks)
   * hooks: { onAnswer(q, correct, chosen), onFinish({total, correct, wrongQs}) }
   * chosen：single 存索引（错因本兼容），其余题型存展示字符串。
   */
  function mount(container, questions, hooks = {}) {
    let i = 0, correctCount = 0;
    const wrongQs = [];
    container.classList.add('quiz');

    const correctText = q => {
      const t = q.type || 'single';
      if (t === 'numeric') return q.answer + (q.unit ? ' ' + q.unit : '');
      if (t === 'multi') return q.answers.map(k => q.options[k]).join('、');
      if (t === 'order') return q.items.join(' → ');
      return q.options[q.answer];
    };

    function head(q) {
      return '<div class="qno">第 ' + (i + 1) + ' / ' + questions.length + ' 题' +
        ((q.type && q.type !== 'single') ? '<span class="qtype">' + ({ multi: '多选', numeric: '填数', order: '排序' })[q.type] + '</span>' : '') + '</div>' +
        '<div class="qstem">' + rich(q.stem) + '</div>' +
        (q.fig ? '<div class="qfig">' + q.fig + '</div>' : '');
    }

    function renderQ() {
      const q = questions[i], type = q.type || 'single';
      let body = head(q);

      if (type === 'single') {
        const order = shuffle(q.options);
        body += order.map((k, pos) => '<button class="opt" data-k="' + k + '">' + 'ABCDEF'[pos] + '. ' + rich(q.options[k]) + '</button>').join('');
      } else if (type === 'multi') {
        const order = shuffle(q.options);
        body += '<div class="chips qmulti">' + order.map(k => '<button class="chip" data-k="' + k + '">' + rich(q.options[k]) + '</button>').join('') + '</div>' +
          '<div class="btnrow"><button class="btn primary" id="qgo">确定</button></div>';
      } else if (type === 'numeric') {
        body += '<div class="numrow"><input class="numin" type="text" inputmode="decimal" placeholder="填数">' +
          (q.units ? '<span class="chips qunits">' + q.units.map(u => '<button class="chip" data-u="' + esc(u) + '">' + esc(u) + '</button>').join('') + '</span>'
            : (q.unit ? '<span class="unitfix">' + esc(q.unit) + '</span>' : '')) +
          '<button class="btn primary" id="qgo">确定</button></div>';
      } else if (type === 'order') {
        const order = shuffle(q.items);
        body += '<p class="hint">按正确顺序，点下面的步骤放进序列（点序列里的可拿回来）：</p>' +
          '<div class="ordseq" id="qseq"></div>' +
          '<div class="chips ordpool">' + order.map(k => '<button class="chip" data-k="' + k + '">' + rich(q.items[k]) + '</button>').join('') + '</div>' +
          '<div class="btnrow"><button class="btn primary" id="qgo" disabled>确定</button></div>';
      }

      container.innerHTML = body + '<div class="qslot"></div>';

      if (type === 'single') {
        container.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => {
          const k = +btn.dataset.k, ok = (k === q.answer);
          container.querySelectorAll('.opt').forEach(b => {
            b.disabled = true;
            if (+b.dataset.k === q.answer) b.classList.add('correct');
            if (+b.dataset.k === k && !ok) b.classList.add('wrong');
          });
          settle(q, ok, k, null);
        }));
      } else if (type === 'multi') {
        const picked = new Set();
        container.querySelectorAll('.qmulti .chip').forEach(c => c.addEventListener('click', () => {
          const k = +c.dataset.k;
          picked.has(k) ? picked.delete(k) : picked.add(k);
          c.classList.toggle('on');
        }));
        container.querySelector('#qgo').addEventListener('click', () => {
          if (!picked.size) return;
          const ok = picked.size === q.answers.length && q.answers.every(k => picked.has(k));
          container.querySelectorAll('.qmulti .chip').forEach(c => {
            c.disabled = true;
            const k = +c.dataset.k;
            if (q.answers.includes(k)) c.classList.add('on');
            else if (picked.has(k)) c.classList.add('bad');
          });
          container.querySelector('#qgo').disabled = true;
          settle(q, ok, [...picked].map(k => q.options[k]).join('、'), correctText(q));
        });
      } else if (type === 'numeric') {
        let unitPick = null;
        container.querySelectorAll('.qunits .chip').forEach(c => c.addEventListener('click', () => {
          container.querySelectorAll('.qunits .chip').forEach(x => x.classList.remove('on'));
          c.classList.add('on'); unitPick = c.dataset.u;
        }));
        container.querySelector('#qgo').addEventListener('click', () => {
          const inp = container.querySelector('.numin');
          const v = parseFloat(String(inp.value).replace(',', '.'));
          if (isNaN(v)) { inp.classList.add('pf-shake'); setTimeout(() => inp.classList.remove('pf-shake'), 400); return; }
          if (q.units && !unitPick) { container.querySelector('.qunits').classList.add('pf-shake'); setTimeout(() => container.querySelector('.qunits').classList.remove('pf-shake'), 400); return; }
          const tol = (q.tol != null) ? q.tol : Math.abs(q.answer) * 0.01 + 1e-9;
          const ok = Math.abs(v - q.answer) <= tol && (!q.units || unitPick === q.unit);
          inp.disabled = true; container.querySelector('#qgo').disabled = true;
          container.querySelectorAll('.qunits .chip').forEach(c => c.disabled = true);
          settle(q, ok, v + (unitPick ? ' ' + unitPick : (q.unit ? ' ' + q.unit : '')), correctText(q));
        });
      } else if (type === 'order') {
        const seq = [];
        const seqBox = container.querySelector('#qseq');
        const go = container.querySelector('#qgo');
        const redraw = () => {
          seqBox.innerHTML = seq.map((k, pos) => '<button class="chip on" data-s="' + k + '">' + (pos + 1) + '. ' + rich(q.items[k]) + '</button>').join('') || '<span class="hint">（还没放进步骤）</span>';
          container.querySelectorAll('.ordpool .chip').forEach(c => { c.style.display = seq.includes(+c.dataset.k) ? 'none' : ''; });
          go.disabled = seq.length !== q.items.length;
          seqBox.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => { seq.splice(seq.indexOf(+c.dataset.s), 1); redraw(); }));
        };
        container.querySelectorAll('.ordpool .chip').forEach(c => c.addEventListener('click', () => { seq.push(+c.dataset.k); redraw(); }));
        go.addEventListener('click', () => {
          const ok = seq.every((k, pos) => k === pos);
          go.disabled = true;
          container.querySelectorAll('.ordpool .chip, #qseq .chip').forEach(c => c.disabled = true);
          settle(q, ok, seq.map(k => q.items[k]).join(' → '), correctText(q));
        });
        redraw();
      }
    }

    function settle(q, ok, chosen, correctTxt) {
      if (ok) correctCount++; else wrongQs.push({ q, chosen });
      const slot = container.querySelector('.qslot');
      slot.innerHTML =
        '<div class="explain">' + (ok ? '<b>答对了。</b>' : '<b>不对。</b>' + (correctTxt ? '正确答案：<b>' + rich(correctTxt) + '</b>。<br>' : '')) + rich(q.explain) + '</div>' +
        '<div class="btnrow"><button class="btn primary" id="qnext">' +
        (i === questions.length - 1 ? '看结果' : '下一题 ›') + '</button></div>';
      slot.querySelector('#qnext').addEventListener('click', next);
      if (hooks.onAnswer) hooks.onAnswer(q, ok, chosen);
    }

    function next() {
      i++;
      if (i < questions.length) renderQ();
      else finish();
    }

    function finish() {
      const total = questions.length;
      container.innerHTML =
        '<div class="qsummary">' +
        '<div class="score">' + correctCount + ' / ' + total + '</div>' +
        '<p class="center hint">' + verdict(correctCount, total) + '</p>' +
        (wrongQs.length
          ? '<p><b>错题回顾</b>（已收进错因本）：</p>' +
            wrongQs.map(w =>
              '<div class="mitem"><span class="mtag">' + esc(w.q.tag) + '</span>' +
              '<span class="ms">' + rich(w.q.stem) + '</span></div>').join('')
          : '<p class="center">🌟 全对，这一章的题感已经在线。</p>') +
        '<div class="btnrow center" style="justify-content:center">' +
        (wrongQs.length ? '<button class="btn" id="qretry">只重做错题</button>' : '') +
        '<button class="btn primary" id="qdone">完成</button></div></div>';

      const retry = container.querySelector('#qretry');
      if (retry) retry.addEventListener('click', () => {
        mount(container, wrongQs.map(w => w.q), hooks);
      });
      container.querySelector('#qdone').addEventListener('click', () => {
        if (hooks.onFinish) hooks.onFinish({ total, correct: correctCount, wrongQs });
      });
    }

    function verdict(c, t) {
      const r = c / t;
      if (r === 1) return '满分，可以去教别人了。';
      if (r >= 0.8) return '很稳。错的那几题看懂解析，就齐了。';
      if (r >= 0.6) return '底子有了，错题解析值得慢慢读一遍。';
      return '别慌——先回实验区把概念再玩一遍，题自然就通了。';
    }

    renderQ();
    return { destroy() { container.innerHTML = ''; } };
  }

  return { mount, rich };
})();
