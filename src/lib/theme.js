/** PHP common.js dark mode: html.active + #switch.active + localStorage toggleState */

export function applyTheme(isDark) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("active", isDark);
  document.getElementById("switch")?.classList.toggle("active", isDark);
  if (isDark) {
    localStorage.setItem("toggleState", "active");
  } else {
    localStorage.removeItem("toggleState");
  }
}

export function toggleTheme() {
  applyTheme(!document.documentElement.classList.contains("active"));
}

export function initTheme() {
  applyTheme(localStorage.getItem("toggleState") === "active");
}
