// 全ページ背景：流体アニメ（テーマ連動）
// テーマ切替（html[data-theme]）に即追従する。
// 既存のページ専用 fluid は外してOK（重複描画に注意）。

document.addEventListener("turbo:load", () => {
  // すでに用意済みなら再生成しない
  let canvas = document.getElementById("fluid-global-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "fluid-global-canvas";
    document.body.prepend(canvas);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  // CSS変数から現在テーマのパレットを取得
  function getPalette(){
    const cs = getComputedStyle(document.documentElement);
    // "r, g, b" → [r,g,b]
    const pick = (name) => (cs.getPropertyValue(name)||"").split(",").map(s=>+s.trim());
    return [ pick("--fluid1"), pick("--fluid2"), pick("--fluid3"), pick("--fluid4") ];
  }
  let COLS = getPalette();

  // テーマ変更に追従（data-themeの変化を監視）
  const mo = new MutationObserver(() => { COLS = getPalette(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // ===== Simplex Noise (2D) =====
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const n = Math.floor(Math.random() * (i + 1)); [p[i], p[n]] = [p[n], p[i]]; }
  const perm = new Uint8Array(512); for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad2 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  const dot = (g,x,y)=> g[0]*x + g[1]*y;
  function snoise2(xin, yin){
    const s = (xin + yin) * F2, i = Math.floor(xin + s), j = Math.floor(yin + s);
    const t = (i + j) * G2, X0 = i - t, Y0 = j - t;
    const x0 = xin - X0, y0 = yin - Y0;
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    const gi0 = grad2[perm[ii + perm[jj]] & 7];
    const gi1 = grad2[perm[ii + i1 + perm[jj + j1]] & 7];
    const gi2 = grad2[perm[ii + 1 + perm[jj + 1]] & 7];
    let n0=0,n1=0,n2=0, t0 = 0.5 - x0*x0 - y0*y0;
    if (t0 >= 0){ t0*=t0; n0 = t0*t0*dot(gi0,x0,y0); }
    let t1 = 0.5 - x1*x1 - y1*y1;
    if (t1 >= 0){ t1*=t1; n1 = t1*t1*dot(gi1,x1,y1); }
    let t2 = 0.5 - x2*x2 - y2*y2;
    if (t2 >= 0){ t2*=t2; n2 = t2*t2*dot(gi2,x2,y2); }
    return 70 * (n0 + n1 + n2);
  }

  // ==== サイズ/DPR（低解像度→拡大＝軽量） ====
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let vw, vh, scale;
  function resize(){
    vw = window.innerWidth; vh = window.innerHeight;
    scale = vw >= 1200 ? 0.35 : vw >= 768 ? 0.45 : 0.55;
    canvas.width  = Math.max(1, Math.floor(vw * scale * DPR));
    canvas.height = Math.max(1, Math.floor(vh * scale * DPR));
    canvas.style.width  = vw + "px";
    canvas.style.height = vh + "px";
  }
  resize();
  window.addEventListener("resize", ()=> { clearTimeout(resize._t); resize._t = setTimeout(resize, 120); });

  // ==== 色補間 ====
  const lerp = (a,b,t)=> a + (b-a)*t;
  function mix(c1,c2,t){ return [Math.round(lerp(c1[0],c2[0],t)), Math.round(lerp(c1[1],c2[1],t)), Math.round(lerp(c1[2],c2[2],t))]; }
  function palette(t){
    const seg = Math.min(3, Math.floor(t * 3.999));
    const local = t * 3.999 - seg;
    const cA = COLS[seg], cB = COLS[(seg+1)%COLS.length];
    return mix(cA, cB, local);
  }

  // ==== 動きパラメータ（好みで調整） ====
  const speed = 0.00035;  // 小さいほどゆっくり
  const zoom  = 0.0022;   // 小さいほど模様大きい
  const swirl = 0.0009;   // 渦の強さ

  // ==== パフォーマンス（非表示タブは休止） ====
  const targetFPS = 28, frameInterval = 1000 / targetFPS;
  let tStart = performance.now(), last = 0, animId = 0;
  function render(now){
    if (document.hidden) { animId = requestAnimationFrame(render); return; }
    if (now - last < frameInterval){ animId = requestAnimationFrame(render); return; }
    last = now;

    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h); const data = img.data;
    const dt = now - tStart, time = dt * speed;
    const cx = w * 0.5, cy = h * 0.45;

    let k = 0;
    for (let y = 0; y < h; y++){
      for (let x = 0; x < w; x++){
        const dx = x - cx, dy = y - cy;
        const r = Math.hypot(dx, dy);
        const ang = swirl * r;
        const cos = Math.cos(ang), sin = Math.sin(ang);
        const rx =  cos*dx - sin*dy;
        const ry =  sin*dx + cos*dy;

        const n1 = snoise2((rx + time*120) * zoom, (ry + time*120) * zoom);
        const n2 = snoise2((rx - time*60 ) * zoom * 0.6, (ry + time*40) * zoom * 0.6);
        let v = (n1 * 0.65 + n2 * 0.35);  // -1..1
        v = (v + 1) * 0.5;                // 0..1
        v = Math.pow(v, 1.25);            // 柔らかい分布

        const [r8,g8,b8] = palette(v);
        data[k++] = r8; data[k++] = g8; data[k++] = b8; data[k++] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    animId = requestAnimationFrame(render);
  }
  animId = requestAnimationFrame(render);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !animId) animId = requestAnimationFrame(render);
  });
});
