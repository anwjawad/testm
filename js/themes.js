/* themes.js
 * Simple theme toggling using CSS variables.
 */

function applyTheme(name) {
  var body = document.body;
  body.classList.remove("theme-dark", "theme-light");
  if (name === "light") {
    body.classList.add("theme-light");
  } else {
    body.classList.add("theme-dark");
  }
  AppState.preferences.theme = name;
}

document.addEventListener("DOMContentLoaded", function () {
  applyTheme(AppState.preferences.theme || "dark");
});
