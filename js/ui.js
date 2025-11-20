/* ui.js
 * Side menu navigation handling.
 */

document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll(".side-link");
  links.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var screen = btn.getAttribute("data-screen");
      if (screen) {
        setCurrentScreen(screen);
      }
    });
  });
});
