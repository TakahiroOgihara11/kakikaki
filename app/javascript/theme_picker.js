// app/javascript/theme_picker.js
document.addEventListener("turbo:load", initThemePicker);
document.addEventListener("DOMContentLoaded", initThemePicker); // 非Turboでも保険

function initThemePicker() {
  const root = document.documentElement;
  const panel = document.getElementById("theme-panel");
  const toggle = document.querySelector(".theme-picker__toggle");
  const cards = document.querySelectorAll(".theme-card");
  if (!toggle || !panel || !cards.length) return;

  // 既存テーマを適用（localStorage）
  const saved = localStorage.getItem("appTheme") || "blue";
  applyTheme(saved);
  markActive(saved);

  // トグル（開閉）
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    panel.hidden = open;
  });

  // カード選択
  cards.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      applyTheme(theme);
      localStorage.setItem("appTheme", theme);
      markActive(theme);
    });
  });

  // パネル外クリックで閉じる
  document.addEventListener("click", (e) => {
    if (!panel.hidden && !e.target.closest(".theme-picker")) {
      toggle.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    }
  });

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  function markActive(theme) {
    cards.forEach(c => c.classList.toggle("is-active", c.dataset.theme === theme));
  }
}
