/* auth.js
 * Simple PIN-based auth for two users: me / partner
 */

function tryLogin(userKey) {
  var requirePin = true;
  if (AppState.preferences && AppState.preferences.pinRequired && typeof AppState.preferences.pinRequired[userKey] === "boolean") {
    requirePin = AppState.preferences.pinRequired[userKey];
  }

  var entered = document.getElementById("auth-pin-input").value.trim();

  if (!requirePin) {
    onLoginSuccess(userKey);
    return;
  }

  var correct = AppState.pinCodes[userKey];
  if (entered === correct) {
    onLoginSuccess(userKey);
  } else {
    alert("PIN غير صحيح");
  }
}

function onLoginSuccess(userKey) {
  setCurrentUser(userKey);
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  var btnMe = document.getElementById("auth-login-me");
  var btnPartner = document.getElementById("auth-login-partner");

  if (btnMe) {
    btnMe.addEventListener("click", function () {
      tryLogin("me");
    });
  }
  if (btnPartner) {
    btnPartner.addEventListener("click", function () {
      tryLogin("partner");
    });
  }
});
