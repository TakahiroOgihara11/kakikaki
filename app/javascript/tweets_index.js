// app/javascript/tweets_index.js
document.addEventListener("turbo:load", () => {
  const root = document.querySelector(".index");
  if (!root) return; // このページ以外では何もしない

  // スクロールで段階的にフェードイン
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-in"); });
  }, { threshold: 0.15 });

  root.querySelectorAll("[data-reveal]").forEach(el => io.observe(el));

  // スクロールキュー（次セクションへ）
  const cue = root.querySelector(".lp-scroll-cue");
  const next = root.querySelector(".lp-why");
  cue?.addEventListener("click", () => next?.scrollIntoView({ behavior: "smooth" }));
});
