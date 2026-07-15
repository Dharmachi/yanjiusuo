/* explain-kit —— "讲透卡"：把单调的"规则+一段话"升级成 规则 + 图示 + 走一遍(步骤) + 坑。
   ExplainKit.cards(container, defs)；def = {emoji,title,rule,fig?,steps?,trap?,why?}。
   fig 可以是内置图名（见 FIG）或一个返回 SVG 字符串的函数。 */
window.ExplainKit = (function () {

  /* ---------- 内置图示（清爽小 SVG） ---------- */
  const arrowhead = (x, y, dir, col) => dir === 'r'
    ? `<path d="M${x} ${y} l-8 -4 l0 8 Z" fill="${col}"/>`
    : `<path d="M${x} ${y} l8 -4 l0 8 Z" fill="${col}"/>`;

  const FIG = {
    // 和 ⇄ 积（因式分解 = 乘法的逆）
    arrow() {
      return `<svg viewBox="0 0 330 104" style="max-width:330px">
        <text x="66" y="24" text-anchor="middle" font-size="11" fill="#8b8271">和（多项式）</text>
        <rect x="8" y="34" width="116" height="34" rx="8" fill="rgba(76,81,191,.12)" stroke="#4c51bf" stroke-width="1.5"/>
        <text x="66" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#27231b">x²+5x+6</text>
        <text x="264" y="24" text-anchor="middle" font-size="11" fill="#8b8271">积（几个式子相乘）</text>
        <rect x="206" y="34" width="116" height="34" rx="8" fill="rgba(183,121,31,.16)" stroke="#b7791f" stroke-width="1.5"/>
        <text x="264" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#27231b">(x+2)(x+3)</text>
        <line x1="126" y1="45" x2="200" y2="45" stroke="#15803d" stroke-width="2"/>${arrowhead(200, 45, 'r', '#15803d')}
        <text x="163" y="40" text-anchor="middle" font-size="11.5" font-weight="700" fill="#15803d">因式分解</text>
        <line x1="204" y1="60" x2="130" y2="60" stroke="#4c51bf" stroke-width="2"/>${arrowhead(130, 60, 'l', '#4c51bf')}
        <text x="167" y="76" text-anchor="middle" font-size="11.5" font-weight="700" fill="#4c51bf">整式乘法</text>
      </svg>`;
    },
    // 平方差：大正方形挖掉角上小正方形 → 拼成长方形
    diffArea() {
      const A = 66, B = 28, OX = 14, OY = 16;
      return `<svg viewBox="0 0 320 118" style="max-width:320px">
        <rect x="${OX}" y="${OY}" width="${A}" height="${A}" fill="rgba(15,118,110,.16)" stroke="#0f766e" stroke-width="1.5"/>
        <rect x="${OX + A - B}" y="${OY + A - B}" width="${B}" height="${B}" fill="#fff" stroke="#b91c1c" stroke-width="1.4" stroke-dasharray="4 3"/>
        <text x="${OX + (A - B) / 2}" y="${OY + (A - B) / 2 + 5}" text-anchor="middle" font-size="12" font-weight="700" fill="#0f766e">a²</text>
        <text x="${OX + A - B / 2}" y="${OY + A - B / 2 + 4}" text-anchor="middle" font-size="10" fill="#b91c1c">挖 b²</text>
        <text x="${OX + A / 2}" y="${OY - 4}" text-anchor="middle" font-size="11" fill="#57503f">a</text>
        <text x="150" y="${OY + A / 2 + 4}" text-anchor="middle" font-size="20" fill="#8b8271">→</text>
        <rect x="176" y="${OY + 12}" width="${A + B}" height="${A - B}" fill="rgba(76,81,191,.14)" stroke="#4c51bf" stroke-width="1.5"/>
        <text x="${176 + (A + B) / 2}" y="${OY + 12 + (A - B) / 2 + 5}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4c51bf">(a+b)(a−b)</text>
        <text x="${176 + (A + B) / 2}" y="${OY + 8}" text-anchor="middle" font-size="11" fill="#57503f">a + b</text>
        <text x="${176 + A + B + 8}" y="${OY + 12 + (A - B) / 2 + 4}" text-anchor="start" font-size="11" fill="#57503f">a−b</text>
      </svg>`;
    },
    // 完全平方：正方形四块，中间两块 ab 高亮
    sqArea() {
      const A = 52, B = 28, OX = 26, OY = 14, S = A + B;
      return `<svg viewBox="0 0 300 116" style="max-width:300px">
        <rect x="${OX}" y="${OY}" width="${A}" height="${A}" fill="rgba(76,81,191,.20)" stroke="#4c51bf" stroke-width="1.3"/>
        <rect x="${OX + A}" y="${OY}" width="${B}" height="${A}" fill="rgba(15,118,110,.28)" stroke="#0f766e" stroke-width="1.3"/>
        <rect x="${OX}" y="${OY + A}" width="${A}" height="${B}" fill="rgba(15,118,110,.28)" stroke="#0f766e" stroke-width="1.3"/>
        <rect x="${OX + A}" y="${OY + A}" width="${B}" height="${B}" fill="rgba(183,121,31,.28)" stroke="#b7791f" stroke-width="1.3"/>
        <text x="${OX + A / 2}" y="${OY + A / 2 + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#4c51bf">a²</text>
        <text x="${OX + A + B / 2}" y="${OY + A / 2 + 4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">ab</text>
        <text x="${OX + A / 2}" y="${OY + A + B / 2 + 4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">ab</text>
        <text x="${OX + A + B / 2}" y="${OY + A + B / 2 + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#b7791f">b²</text>
        <text x="${OX + S + 16}" y="${OY + S / 2 - 6}" font-size="12.5" font-weight="700" fill="#27231b">(a+b)² =</text>
        <text x="${OX + S + 16}" y="${OY + S / 2 + 14}" font-size="12.5" font-weight="700" fill="#27231b">a²+<tspan fill="#0f766e">2ab</tspan>+b²</text>
        <text x="${OX + S + 22}" y="${OY + S + 6}" font-size="10.5" fill="#8b8271">中间两块 ab 最常丢</text>
      </svg>`;
    },
    // 三角形内角和 = 180°（三色角 + 平行线搬角）
    angleSum() {
      return `<svg viewBox="0 0 300 130" style="max-width:300px">
        <polygon points="150,26 60,104 240,104" fill="rgba(76,81,191,.10)" stroke="#4c51bf" stroke-width="1.6"/>
        <path d="M150 26 a20 20 0 0 1 12 7" fill="none" stroke="#c2410c" stroke-width="2.4"/>
        <path d="M60 104 a22 22 0 0 1 21 -8" fill="none" stroke="#0f766e" stroke-width="2.4"/>
        <path d="M240 104 a22 22 0 0 0 -21 -8" fill="none" stroke="#b7791f" stroke-width="2.4"/>
        <text x="150" y="20" text-anchor="middle" font-size="11" font-weight="700" fill="#27231b">A</text>
        <text x="50" y="110" font-size="11" font-weight="700" fill="#27231b">B</text>
        <text x="244" y="110" font-size="11" font-weight="700" fill="#27231b">C</text>
        <line x1="30" y1="122" x2="270" y2="122" stroke="#8b8271" stroke-width="1.5"/>
        <path d="M120 122 a20 20 0 0 1 12 -7" fill="none" stroke="#0f766e" stroke-width="2.2"/>
        <path d="M150 122 a20 20 0 0 1 12 7" fill="none" stroke="#c2410c" stroke-width="2.2"/>
        <path d="M180 122 a20 20 0 0 0 -12 7" fill="none" stroke="#b7791f" stroke-width="2.2"/>
        <text x="150" y="118" text-anchor="middle" font-size="10" fill="#8b8271">三个角拼成一个平角 = 180°</text>
      </svg>`;
    },
    // 等腰三角形三线合一
    isoTri() {
      return `<svg viewBox="0 0 260 130" style="max-width:260px">
        <polygon points="130,20 60,110 200,110" fill="rgba(76,81,191,.10)" stroke="#4c51bf" stroke-width="1.6"/>
        <line x1="130" y1="20" x2="130" y2="110" stroke="#b91c1c" stroke-width="2.2"/>
        <path d="M122 110 l0 -8 l8 0" fill="none" stroke="#b91c1c" stroke-width="1.4"/>
        <circle cx="130" cy="110" r="2.5" fill="#b7791f"/>
        <text x="130" y="14" text-anchor="middle" font-size="11" font-weight="700">A</text>
        <text x="52" y="116" font-size="11" font-weight="700">B</text>
        <text x="204" y="116" font-size="11" font-weight="700">C</text>
        <text x="138" y="70" font-size="10.5" fill="#b91c1c">高</text>
        <text x="138" y="84" font-size="10.5" fill="#b7791f">= 中线</text>
        <text x="138" y="98" font-size="10.5" fill="#4c51bf">= 角平分线</text>
        <text x="130" y="126" text-anchor="middle" font-size="10" fill="#8b8271">AB=AC 时，这三条线合成一条</text>
      </svg>`;
    },
    // 将军饮马：化折为直
    reflect() {
      return `<svg viewBox="0 0 300 130" style="max-width:300px">
        <line x1="10" y1="80" x2="290" y2="80" stroke="#4c81bf" stroke-width="2"/>
        <text x="16" y="94" font-size="10" fill="#4c81bf">河岸</text>
        <text x="50" y="34" font-size="16">🏠</text><text x="46" y="26" font-size="10" font-weight="700">A</text>
        <text x="228" y="42" font-size="16">🏰</text><text x="238" y="34" font-size="10" font-weight="700">B</text>
        <text x="50" y="120" font-size="16" opacity=".5">🏠</text><text x="42" y="122" font-size="10" font-weight="700" fill="#b7791f">A′</text>
        <line x1="58" y1="40" x2="58" y2="112" stroke="#b7791f" stroke-width="1.2" stroke-dasharray="4 3"/>
        <line x1="58" y1="112" x2="232" y2="40" stroke="#b7791f" stroke-width="1.6" stroke-dasharray="6 4"/>
        <circle cx="145" cy="80" r="3.5" fill="#b91c1c"/><text x="140" y="98" font-size="10" font-weight="700" fill="#b91c1c">P</text>
        <line x1="58" y1="40" x2="145" y2="80" stroke="#0f766e" stroke-width="2"/>
        <line x1="145" y1="80" x2="232" y2="40" stroke="#0f766e" stroke-width="2"/>
        <text x="150" y="128" text-anchor="middle" font-size="10" fill="#8b8271">作对称点 A′，连 A′B 交河岸于 P → 最短</text>
      </svg>`;
    },
    // 六种物态变化三角（固-液-气）
    phaseTri() {
      return `<svg viewBox="0 0 300 150" style="max-width:300px">
        <text x="150" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="#4c51bf">气</text>
        <text x="46" y="140" text-anchor="middle" font-size="13" font-weight="700" fill="#0f766e">固</text>
        <text x="254" y="140" text-anchor="middle" font-size="13" font-weight="700" fill="#b7791f">液</text>
        <text x="86" y="76" text-anchor="middle" font-size="10.5" fill="#0f766e">熔化 吸</text>
        <text x="120" y="92" text-anchor="middle" font-size="10.5" fill="#b7791f">凝固 放</text>
        <text x="216" y="76" text-anchor="middle" font-size="10.5" fill="#b7791f">汽化 吸</text>
        <text x="180" y="92" text-anchor="middle" font-size="10.5" fill="#4c51bf">液化 放</text>
        <text x="128" y="128" text-anchor="middle" font-size="10.5" fill="#0f766e">升华 吸</text>
        <text x="172" y="128" text-anchor="middle" font-size="10.5" fill="#b7791f">凝华 放</text>
        <line x1="60" y1="120" x2="240" y2="120" stroke="#c9bfa9" stroke-width="1"/>
        <text x="150" y="146" text-anchor="middle" font-size="9.5" fill="#8b8271">朝"气"走 = 吸热，反过来 = 放热</text>
      </svg>`;
    },
    // 熔化曲线：晶体有平台、非晶体无平台
    meltCurve() {
      return `<svg viewBox="0 0 300 130" style="max-width:300px">
        <line x1="30" y1="105" x2="285" y2="105" stroke="#57503f" stroke-width="1.4"/>
        <line x1="30" y1="105" x2="30" y2="18" stroke="#57503f" stroke-width="1.4"/>
        <text x="285" y="120" text-anchor="end" font-size="10" fill="#8b8271">时间</text>
        <text x="34" y="16" font-size="10" fill="#8b8271">温度</text>
        <polyline points="30,92 70,66 120,66 175,32 235,32" fill="none" stroke="#0f766e" stroke-width="2.2"/>
        <text x="95" y="60" text-anchor="middle" font-size="10" fill="#0f766e">← 平台（熔化，吸热不升温）</text>
        <polyline points="30,96 90,72 160,44 240,26" fill="none" stroke="#b7791f" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="250" y="30" font-size="9.5" fill="#b7791f">非晶体（无平台）</text>
      </svg>`;
    },
    // s-t 与 v-t：同样一条水平线，含义不同
    stvt() {
      const box = (ox, title, path, note) => `
        <text x="${ox + 55}" y="12" text-anchor="middle" font-size="10.5" font-weight="700" fill="#27231b">${title}</text>
        <line x1="${ox + 14}" y1="76" x2="${ox + 110}" y2="76" stroke="#57503f" stroke-width="1.4"/>
        <line x1="${ox + 14}" y1="76" x2="${ox + 14}" y2="22" stroke="#57503f" stroke-width="1.4"/>
        <path d="${path}" fill="none" stroke="#0f766e" stroke-width="2"/>
        <text x="${ox + 62}" y="92" text-anchor="middle" font-size="9.5" fill="#8b8271">${note}</text>`;
      return `<svg viewBox="0 0 260 100" style="max-width:260px">
        ${box(0, 's-t 图（走走停停）', 'M14 68 L44 40 L74 40 L104 22', '水平段 = 静止')}
        ${box(130, 'v-t 图（同一运动）', 'M14 50 L44 50 L44 68 L74 68 L74 50 L104 34', '贴横轴 = 静止')}
      </svg>`;
    },
    // 声波：音调（疏密）与响度（高矮）
    wave() {
      const w = (x0, amp, freq, col, lab) => {
        let d = `M${x0} 45`;
        for (let i = 0; i <= 120; i += 3) d += ` L${x0 + i} ${45 - amp * Math.sin(i / 120 * Math.PI * 2 * freq)}`;
        return `<path d="${d}" fill="none" stroke="${col}" stroke-width="1.8"/><text x="${x0 + 60}" y="92" text-anchor="middle" font-size="10" fill="#8b8271">${lab}</text>`;
      };
      return `<svg viewBox="0 0 300 100" style="max-width:300px">
        ${w(10, 16, 2, '#0f766e', '音调低（疏）')}${w(160, 16, 5, '#4c51bf', '音调高（密）')}
        <text x="150" y="16" text-anchor="middle" font-size="10.5" fill="#8b8271">波形越密→音调越高；越高→响度越大</text>
      </svg>`;
    },
    // 十字相乘图
    cross(t1, t2, b1, b2, mid) {
      return `<svg viewBox="0 0 300 110" style="max-width:300px">
        <text x="60" y="32" text-anchor="middle" font-size="15" font-weight="700" font-family="ui-monospace" fill="#4c51bf">${t1}</text>
        <text x="150" y="32" text-anchor="middle" font-size="15" font-weight="700" font-family="ui-monospace" fill="#b7791f">${t2}</text>
        <text x="60" y="92" text-anchor="middle" font-size="15" font-weight="700" font-family="ui-monospace" fill="#4c51bf">${b1}</text>
        <text x="150" y="92" text-anchor="middle" font-size="15" font-weight="700" font-family="ui-monospace" fill="#b7791f">${b2}</text>
        <line x1="74" y1="40" x2="138" y2="82" stroke="#0f766e" stroke-width="1.6"/>
        <line x1="74" y1="82" x2="138" y2="40" stroke="#0f766e" stroke-width="1.6"/>
        <text x="212" y="66" font-size="13" font-weight="700" fill="#0f766e" font-family="ui-monospace">= ${mid}</text>
        <text x="106" y="108" text-anchor="middle" font-size="10.5" fill="#8b8271">交叉相乘再相加</text>
      </svg>`;
    }
  };

  function cards(container, defs) {
    container.innerHTML = defs.map(d => {
      let body = `<div class="stdline">${d.rule}</div>`;
      if (d.fig) { const f = typeof d.fig === 'function' ? d.fig() : (FIG[d.fig] ? FIG[d.fig]() : ''); if (f) body += `<div class="kfig">${f}</div>`; }
      if (d.steps && d.steps.length) {
        body += `<div class="kwork"><div class="kwtitle">✍️ 走一遍${d.eg ? '：' + d.eg : ''}</div>` +
          d.steps.map(s => `<div class="kstep${s.key ? ' key' : ''}"><span class="kt">${s.t}</span>${s.r ? '<span class="kr">' + s.r + '</span>' : ''}</div>`).join('') +
          `</div>`;
      }
      if (d.trap) body += `<div class="ktrap"><b>小心</b> ${d.trap}</div>`;
      if (d.why) body += `<p class="why">${d.why}</p>`;
      return `<details class="kard"><summary><span>${d.emoji}</span>${d.title}</summary><div class="kbody">${body}</div></details>`;
    }).join('');
  }

  return { cards, FIG };
})();
