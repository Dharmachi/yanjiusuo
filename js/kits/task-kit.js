/* task-kit —— 任务卡骨架：标题行 + 完成圆钮 + 自定义卡体。数据存取由 app.js 的 Y.task* 提供。 */
window.TaskKit = (function () {

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /**
   * card({emoji, title, desc, done, onToggle, body})
   * body: 可选 DOM 节点（卡体内容）；onToggle(nowDone)
   */
  function card(opts) {
    const el = document.createElement('div');
    el.className = 'taskcard';
    el.innerHTML =
      '<div class="th"><span class="em">' + (opts.emoji || '📌') + '</span>' +
      '<span class="t">' + esc(opts.title) + '</span>' +
      '<button class="tickbtn' + (opts.done ? ' on' : '') + '" aria-label="完成">✓</button></div>' +
      (opts.desc ? '<p class="small" style="margin:8px 0 0">' + opts.desc + '</p>' : '');
    if (opts.body) el.appendChild(opts.body);

    const tick = el.querySelector('.tickbtn');
    tick.addEventListener('click', () => {
      const now = !tick.classList.contains('on');
      tick.classList.toggle('on', now);
      if (opts.onToggle) opts.onToggle(now);
    });
    return el;
  }

  return { card };
})();
