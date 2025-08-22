document.addEventListener("turbo:load", () => {
  const header = document.querySelector("header.app-header");
  if (!header) return;

  // ---- スクロールでヘッダーを締める＆進捗バー更新 ----
  const onScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, window.scrollY / max);
    header.style.setProperty("--scroll-ratio", ratio);
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---- ナビの現在地ハイライト（同じパスのリンクに .is-active）----
  header.querySelectorAll(".header-list a[href]").forEach(a => {
    try{
      const ahref = new URL(a.href, location.origin);
      if (ahref.pathname === location.pathname) a.classList.add("is-active");
    }catch(_e){}
  });

  // ---- “フォローした人の日記”リンクがある時は軽く誘目 ----
  const followLink = header.querySelector('.header-list a[href*="/tweets/following_posts"]');
  if (followLink) followLink.classList.add("is-highlight");

  // ---- クリック時のリップル（a / input / button）----
  const addRipple = (el) => {
    el.addEventListener("click", (e) => {
      const r = document.createElement("span");
      r.className = "ripple";
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + "px";
      r.style.left = (e.clientX - rect.left - size/2) + "px";
      r.style.top  = (e.clientY - rect.top  - size/2) + "px";
      el.appendChild(r);
      setTimeout(() => r.remove(), 520);
    });
  };
  header.querySelectorAll("a, input[type='submit'], button").forEach(addRipple);

  // ---- ロゴを“マグネット”っぽく追従 ----
  const logo = header.querySelector(".site-logo");
  if (logo) {
    const maxMove = 6; // px
    const maxTilt = 3; // deg
    const move = (e) => {
      const rect = header.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      logo.style.transform =
        `translate(${x*maxMove}px, ${y*maxMove}px) rotate(${x*maxTilt}deg)`;
    };
    const reset = () => { logo.style.transform = ""; };
    header.addEventListener("mousemove", move);
    header.addEventListener("mouseleave", reset);
  }
});
