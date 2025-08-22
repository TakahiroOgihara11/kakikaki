// // app/javascript/diary_fx.js
// document.addEventListener("turbo:load", () => {
//   const root = document.documentElement;
//   root.classList.add("has-js");

//   const page = document.querySelector(".diary-new");
//   if (!page) return;

//   // フォーカスモード：カード内フォーカスで背景を少し落とす
//   const card = page.querySelector(".diary-card");
//   card?.addEventListener("focusin", () => page.classList.add("is-focus"));
//   card?.addEventListener("focusout", () => page.classList.remove("is-focus"));

//   // フェードイン（IntersectionObserver）
//   const io = new IntersectionObserver((ents)=>{
//     ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); }});
//   }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
//   page.querySelectorAll("[data-reveal]").forEach(el=>io.observe(el));

//   // ボタンのリップル（CSS変数で光位置を渡す）
//   page.querySelectorAll(".btn-primary").forEach(btn=>{
//     btn.addEventListener("pointermove", (ev)=>{
//       const r = btn.getBoundingClientRect();
//       btn.style.setProperty("--rx", (ev.clientX - r.left) + "px");
//       btn.style.setProperty("--ry", (ev.clientY - r.top)  + "px");
//     });
//     btn.addEventListener("pointerdown", ()=>{
//       btn.classList.add("is-rippling");
//       setTimeout(()=>btn.classList.remove("is-rippling"), 260);
//     });
//   });

//   // ドロップゾーンの視覚フィードバック
//   const drop = page.querySelector("#upload-drop");
//   if (drop){
//     ["dragenter","dragover"].forEach(t=> drop.addEventListener(t, e=>{ e.preventDefault(); drop.style.boxShadow="0 0 0 6px rgba(255,174,23,.22)"; }));
//     ["dragleave","drop"].forEach(t=> drop.addEventListener(t, e=>{ e.preventDefault(); drop.style.boxShadow="none"; }));
//   }

//   // 便箋“インク”の気持ち演出（タイプ時に軽く明滅）
//   const diary = page.querySelector(".diary-input");
//   if (diary){
//     let t;
//     diary.addEventListener("input", ()=>{
//       diary.style.textShadow = "0 0 0 rgba(0,0,0,0)"; // kick for repaint
//       diary.classList.add("ink-glow");
//       clearTimeout(t);
//       t = setTimeout(()=> diary.classList.remove("ink-glow"), 180);
//     });
//   }
// });
