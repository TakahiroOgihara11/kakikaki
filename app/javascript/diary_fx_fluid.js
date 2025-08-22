// // app/javascript/diary_fx_fluid.js
// document.addEventListener("turbo:load", () => {
//   // const holder = document.querySelector(".diary-hero-layer");
//   // const canvas = holder?.querySelector(".fluid-canvas");
//   // if (!holder || !canvas) return;
//   const holder = document.querySelector(".diary-hero-layer");
//   if (!holder) return;
//   let canvas = holder.querySelector(".fluid-canvas");
//   if (!canvas) {
//     canvas = document.createElement("canvas");
//     canvas.className = "fluid-canvas";
//    // 背景レイヤーとして全面固定＆半透明
//     Object.assign(canvas.style, {
//       position: "fixed",
//       inset: "0",
//       zIndex: "0",           // マイナスにしない（bodyの裏に落ちる事故を防ぐ）
//       width: "100%",
//       height: "100%",
//       pointerEvents: "none",
//       opacity: "0.55",
//     });
//     holder.prepend(canvas);
//   }
//   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

//   const ctx = canvas.getContext("2d", { alpha: true });

//   // --- Palette（かきか記の世界観） ---
//   const COLS = [
//     [255, 233, 194], // ベージュ淡
//     [255, 209, 155], // オレンジ淡
//     [255, 174,  23], // 橙アクセント
//     [255, 140,  66]  // ソフトオレンジ
//   ];

//   // --- Simplex Noise 2D ---
//   const F2 = 0.5 * (Math.sqrt(3) - 1);
//   const G2 = (3 - Math.sqrt(3)) / 6;
//   const p = new Uint8Array(256);
//   for (let i = 0; i < 256; i++) p[i] = i;
//   for (let i = 255; i > 0; i--) { const n = Math.floor(Math.random() * (i + 1)); [p[i], p[n]] = [p[n], p[i]]; }
//   const perm = new Uint8Array(512); for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
//   const grad2 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
//   const dot = (g,x,y)=> g[0]*x + g[1]*y;
//   function snoise2(xin, yin){
//     const s = (xin + yin) * F2, i = Math.floor(xin + s), j = Math.floor(yin + s);
//     const t = (i + j) * G2, X0 = i - t, Y0 = j - t;
//     const x0 = xin - X0, y0 = yin - Y0;
//     const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
//     const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
//     const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
//     const ii = i & 255, jj = j & 255;
//     const gi0 = grad2[perm[ii + perm[jj]] & 7];
//     const gi1 = grad2[perm[ii + i1 + perm[jj + j1]] & 7];
//     const gi2 = grad2[perm[ii + 1 + perm[jj + 1]] & 7];
//     let n0=0,n1=0,n2=0, t0 = 0.5 - x0*x0 - y0*y0;
//     if (t0 >= 0){ t0*=t0; n0 = t0*t0*dot(gi0,x0,y0); }
//     let t1 = 0.5 - x1*x1 - y1*y1;
//     if (t1 >= 0){ t1*=t1; n1 = t1*t1*dot(gi1,x1,y1); }
//     let t2 = 0.5 - x2*x2 - y2*y2;
//     if (t2 >= 0){ t2*=t2; n2 = t2*t2*dot(gi2,x2,y2); }
//     return 70 * (n0 + n1 + n2);
//   }

//   // --- Size / DPR（低解像度で描いて拡大＝軽い） ---
//   const DPR = Math.min(2, window.devicePixelRatio || 1);
//   let vw, vh, scale;
//   function resize(){
//     vw = window.innerWidth; vh = window.innerHeight;
//     scale = vw >= 1200 ? 0.35 : vw >= 768 ? 0.45 : 0.50; // ↑軽くしたいなら数値を大きく
//     canvas.width  = Math.max(1, Math.floor(vw * scale * DPR));
//     canvas.height = Math.max(1, Math.floor(vh * scale * DPR));
//     canvas.style.width  = vw + "px";
//     canvas.style.height = vh + "px";
//   }
//   resize();
//   window.addEventListener("resize", ()=> { clearTimeout(resize._t); resize._t = setTimeout(resize, 120); });

//   // --- 色補間 ---
//   const lerp = (a,b,t)=> a + (b-a)*t;
//   function mix(c1,c2,t){ return [Math.round(lerp(c1[0],c2[0],t)), Math.round(lerp(c1[1],c2[1],t)), Math.round(lerp(c1[2],c2[2],t))]; }
//   function palette(t){
//     const seg = Math.min(3, Math.floor(t * 3.999));
//     const local = t * 3.999 - seg;
//     const cA = COLS[seg], cB = COLS[(seg+1) % COLS.length];
//     return mix(cA, cB, local);
//   }

//   // --- 動きのパラメータ（好みに合わせて微調整） ---
//   const speed = 0.00035;  // 速さ（小さいほどゆっくり）
//   const zoom  = 0.0022;   // 模様の大きさ（小さいほど大きく見える）
//   const swirl = 0.0009;   // 渦の強さ（0で無効）

//   // FPS制御（重い端末向け）
//   const targetFPS = 28, frameInterval = 1000 / targetFPS;
//   let tStart = performance.now(), last = 0;

//   function render(now){
//     if (now - last < frameInterval){ requestAnimationFrame(render); return; }
//     last = now;

//     const w = canvas.width, h = canvas.height;
//     const img = ctx.createImageData(w, h); const data = img.data;

//     const dt = now - tStart, time = dt * speed;
//     const cx = w * 0.5, cy = h * 0.45;

//     let k = 0;
//     for (let y = 0; y < h; y++){
//       for (let x = 0; x < w; x++){
//         const dx = x - cx, dy = y - cy;
//         const r = Math.hypot(dx, dy);
//         const ang = swirl * r;
//         const cos = Math.cos(ang), sin = Math.sin(ang);
//         const rx =  cos*dx - sin*dy;
//         const ry =  sin*dx + cos*dy;

//         const n1 = snoise2((rx + time*120) * zoom, (ry + time*120) * zoom);
//         const n2 = snoise2((rx - time*60 ) * zoom * 0.6, (ry + time*40) * zoom * 0.6);
//         let v = (n1 * 0.65 + n2 * 0.35);  // -1..1
//         v = (v + 1) * 0.5;                // 0..1
//         v = Math.pow(v, 1.25);            // コントラスト調整

//         const [r8,g8,b8] = palette(v);
//         data[k++] = r8; data[k++] = g8; data[k++] = b8; data[k++] = 255; // alphaはCSSのopacityで全体制御
//       }
//     }

//     ctx.putImageData(img, 0, 0);
//     requestAnimationFrame(render);
//   }
//   requestAnimationFrame(render);
// });
