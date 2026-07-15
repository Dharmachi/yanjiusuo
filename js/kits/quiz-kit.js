/* quiz-kit —— 自测引擎：一次一题、即时反馈、必看解析；对错回调交给上层（错因本在 app.js 接线） */
window.QuizKit = (function () {

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /**
   * mount(container, questions, hooks)
   * question: {id, stem, options:[], answer:idx, explain, tag, node}
   * hooks: { onAnswer(q, correct, chosenIdx), onFinish({total, correct, wrongQs}) , retryLabel }
   */
  function mount(container, questions, hooks = {}) {
    let i = 0, correctCount = 0;
    const wrongQs = [];
    container.classList.add('quiz');

    function renderQ() {
      const q = questions[i];
      // 选项随机排序——位置不能成为答题线索
      const order = q.options.map((_, k) => k).sort(() => Math.random() - 0.5);
      container.innerHTML =
        '<div class="qno">第 ' + (i + 1) + ' / ' + questions.length + ' 题</div>' +
        '<div class="qstem">' + esc(q.stem) + '</div>' +
        order.map((k, pos) =>
          '<button class="opt" data-k="' + k + '">' + 'ABCD'[pos] + '. ' + esc(q.options[k]) + '</button>'
        ).join('') +
        '<div class="qslot"></div>';

      container.querySelectorAll('.opt').forEach(btn => {
        btn.addEventListener('click', () => choose(q, +btn.dataset.k));
      });
    }

    function choose(q, k) {
      const ok = (k === q.answer);
      if (ok) correctCount++; else wrongQs.push({ q, chosen: k });
      container.querySelectorAll('.opt').forEach(b => {
        b.disabled = true;
        const bk = +b.dataset.k;
        if (bk === q.answer) b.classList.add('correct');
        if (bk === k && !ok) b.classList.add('wrong');
      });
      const slot = container.querySelector('.qslot');
      slot.innerHTML =
        '<div class="explain">' + (ok ? '<b>答对了。</b>' : '<b>不对。</b>') + esc(q.explain) + '</div>' +
        '<div class="btnrow"><button class="btn primary" id="qnext">' +
        (i === questions.length - 1 ? '看结果' : '下一题 ›') + '</button></div>';
      slot.querySelector('#qnext').addEventListener('click', next);
      if (hooks.onAnswer) hooks.onAnswer(q, ok, k);
    }

    function next() {
      i++;
      if (i < questions.length) { renderQ(); }
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
              '<span class="ms">' + esc(w.q.stem) + '</span></div>').join('')
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

  return { mount };
})();
