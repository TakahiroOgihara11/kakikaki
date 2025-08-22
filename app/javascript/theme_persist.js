// app/javascript/theme_persist.js
const THEME_KEY = "appTheme";
const DEFAULT_THEME = "blue";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function setChecked(theme) {
  const input = document.querySelector(`.theme-switch [value="${theme}"]`);
  if (input) input.checked = true;
}

function initThemePersist() {
  const switcher = document.querySelector(".theme-switch");
  if (!switcher) return;

  // 復元
  const saved = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  applyTheme(saved);
  setChecked(saved);

  // 変更を保存
  switcher.addEventListener("change", (e) => {
    const t = e.target;
    if (t && t.name === "theme") {
      localStorage.setItem(THEME_KEY, t.value);
      applyTheme(t.value);
    }
  });
}

// Turboでも通常DOMでも
document.addEventListener("turbo:load", initThemePersist);
document.addEventListener("DOMContentLoaded", initThemePersist);
