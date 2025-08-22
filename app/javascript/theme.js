// const THEME_KEY = "app:theme";

// function applyTheme(theme) {
//   // html 要素に data-theme を付与（CSSはここを見る）
//   document.documentElement.setAttribute("data-theme", theme);
//   // 保存
//   try { localStorage.setItem(THEME_KEY, theme); } catch {}
//   // アクティブ表示（任意）
//   document.querySelectorAll('[data-theme]').forEach(el => {
//     el.classList.toggle('is-active', el.getAttribute('data-theme') === theme);
//   });
// }

// function initTheme() {
//   const saved = (typeof localStorage !== "undefined") ? localStorage.getItem(THEME_KEY) : null;
//   const initial = saved || "sunny"; // 初期テーマ名はお好みで
//   applyTheme(initial);
// }

// // Turbo 対応（初回 & 遷移後に有効）
// const onLoad = () => {
//   initTheme();

//   // デリゲーションでテーマボタンを拾う（.theme-card, .theme-btn など何でもOK）
//   document.addEventListener("click", (e) => {
//     const target = e.target.closest('[data-theme]');
//     if (!target) return;
//     const theme = target.getAttribute('data-theme');
//     if (!theme) return;
//     e.preventDefault();
//     applyTheme(theme);
//   }, { passive: false });
// };

// document.addEventListener("turbo:load", onLoad);
// document.addEventListener("turbo:render", onLoad);