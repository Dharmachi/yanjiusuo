/* audio-kit —— 三层：合成器（无需权限）/ 麦克风 / 计量。iOS 规则：AudioContext 必须在用户手势里 resume。 */
window.AudioKit = (function () {
  let ctx = null;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* ---------- 合成器 ---------- */
  function createSynth() {
    const c = ensure();
    const osc = c.createOscillator();
    const gain = c.createGain();
    const an = c.createAnalyser();
    an.fftSize = 2048;
    an.smoothingTimeConstant = 0.2;
    osc.type = 'sine';
    osc.frequency.value = 440;
    gain.gain.value = 0.0001;
    osc.connect(gain); gain.connect(an); an.connect(c.destination);
    osc.start();

    let level = 0.5, playing = false, dead = false;
    function apply() {
      const t = c.currentTime;
      gain.gain.cancelScheduledValues(t);
      // 0.28 上限防炸耳；指数逼近避免爆音
      gain.gain.setTargetAtTime(playing ? 0.02 + level * 0.26 : 0.0001, t, 0.03);
    }
    return {
      analyser: an,
      setFreq(f) { if (!dead) osc.frequency.setTargetAtTime(f, c.currentTime, 0.02); },
      setWave(w) { if (!dead) osc.type = w; },
      setLevel(v) { level = v; if (!dead) apply(); },
      get playing() { return playing; },
      toggle(on) { playing = (on === undefined) ? !playing : on; apply(); return playing; },
      kill() {
        if (dead) return; dead = true; playing = false;
        try { apply(); osc.stop(c.currentTime + 0.1); } catch (e) {}
        setTimeout(() => { try { osc.disconnect(); gain.disconnect(); an.disconnect(); } catch (e) {} }, 200);
      }
    };
  }

  /* ---------- 麦克风 ---------- */
  let micStream = null, micSrc = null, micAn = null;
  async function startMic() {
    const c = ensure();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const err = new Error('此环境不支持麦克风'); err.code = 'unsupported'; throw err;
    }
    if (micAn) return micAn;
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    });
    micSrc = c.createMediaStreamSource(micStream);
    micAn = c.createAnalyser();
    micAn.fftSize = 2048;
    micAn.smoothingTimeConstant = 0.5;
    micSrc.connect(micAn); // 不接 destination，避免啸叫
    return micAn;
  }
  function stopMic() {
    if (micStream) micStream.getTracks().forEach(t => t.stop());
    micStream = null; micSrc = null; micAn = null;
  }

  /* ---------- 计量 ---------- */
  const tbuf = new Uint8Array(2048);
  function rms(an) {
    an.getByteTimeDomainData(tbuf);
    let s = 0;
    for (let i = 0; i < an.fftSize; i++) { const v = (tbuf[i] - 128) / 128; s += v * v; }
    return Math.sqrt(s / an.fftSize);
  }
  // 近似分贝：dBFS + 校准偏移。iPad 麦克风非专业设备，只做相对比较。
  function dbApprox(an) {
    const r = rms(an);
    const dbfs = 20 * Math.log10(Math.max(r, 1e-5));
    return Math.max(28, Math.min(120, Math.round(dbfs + 96)));
  }

  /* ---------- 波形 / 频谱绘制（rAF 循环，返回句柄可停） ---------- */
  function fitCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
    }
    return dpr;
  }
  // 画布不在视口（或页面隐藏）时降到 4fps —— 省电，也避免长页面上白跑渲染
  function canvasVisible(c) {
    if (document.hidden || !c.isConnected) return false;
    const r = c.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < (window.innerHeight || 9999);
  }
  function drawWave(canvas, getAnalyser, opts = {}) {
    const g = canvas.getContext('2d');
    let alive = true, tick = 0, vis = true;
    const data = new Uint8Array(2048);
    function frame() {
      if (!alive) return;
      if ((tick++ % 12) === 0) vis = canvasVisible(canvas);
      if (!vis) { setTimeout(() => requestAnimationFrame(frame), 250); return; }
      const dpr = fitCanvas(canvas);
      const w = canvas.width, h = canvas.height;
      g.fillStyle = '#17140f'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
      const an = getAnalyser();
      if (an) {
        an.getByteTimeDomainData(data);
        g.beginPath();
        g.strokeStyle = opts.color || '#ffd166';
        g.lineWidth = 2 * dpr;
        const n = an.fftSize;
        for (let i = 0; i < n; i++) {
          const x = i / (n - 1) * w;
          const y = h / 2 + ((data[i] - 128) / 128) * h * 0.44;
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.stroke();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return { stop() { alive = false; } };
  }
  function drawSpectrum(canvas, getAnalyser) {
    const g = canvas.getContext('2d');
    let alive = true, tick = 0, vis = true;
    const data = new Uint8Array(1024);
    function frame() {
      if (!alive) return;
      if ((tick++ % 12) === 0) vis = canvasVisible(canvas);
      if (!vis) { setTimeout(() => requestAnimationFrame(frame), 250); return; }
      fitCanvas(canvas);
      const w = canvas.width, h = canvas.height;
      g.fillStyle = '#17140f'; g.fillRect(0, 0, w, h);
      const an = getAnalyser();
      if (an) {
        an.getByteFrequencyData(data);
        const bins = 96, bw = w / bins;
        g.fillStyle = '#7dd3c8';
        for (let i = 0; i < bins; i++) {
          // 低频段更有内容，取前 1/3 频谱
          const v = data[Math.floor(i / bins * data.length / 3)] / 255;
          g.fillRect(i * bw + 1, h - v * h * 0.96, bw - 2, v * h * 0.96);
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return { stop() { alive = false; } };
  }

  /* ---------- 真空铃 ---------- */
  function createBell() {
    const c = ensure();
    const osc = c.createOscillator();
    osc.type = 'square'; osc.frequency.value = 1560;
    const g = c.createGain(); g.gain.value = 0.0001;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6000;
    osc.connect(g); g.connect(lp); lp.connect(c.destination);
    osc.start();
    let air = 1, on = false, timer = null, dead = false;
    function beat() {
      if (!on || dead) return;
      const t = c.currentTime;
      const amp = Math.pow(air, 1.7) * 0.2 + 0.00008;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(amp, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    }
    return {
      get on() { return on; },
      start() { ensure(); on = true; if (!timer) timer = setInterval(beat, 250); },
      stop() { on = false; if (timer) { clearInterval(timer); timer = null; } },
      setAir(a) { air = a; lp.frequency.setTargetAtTime(300 + a * 5700, c.currentTime, 0.05); },
      kill() {
        this.stop(); if (dead) return; dead = true;
        try { osc.stop(c.currentTime + 0.05); } catch (e) {}
        setTimeout(() => { try { osc.disconnect(); g.disconnect(); lp.disconnect(); } catch (e) {} }, 150);
      }
    };
  }

  return { ensure, createSynth, startMic, stopMic, rms, dbApprox, drawWave, drawSpectrum, createBell };
})();
