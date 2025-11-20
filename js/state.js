/* state.js
 * Central app state.
 */

window.AppState = {
  currentUser: null, // "me" or "partner"
  pinCodes: {
    me: "1234",
    partner: "5678"
  },
  preferences: {
    theme: "dark",
    deleteConfirm: "on",
    pinRequired: {
      me: true,
      partner: true
    }
  },
  ui: {
    currentScreen: "auth-screen"
  },
  dataConfig: {
    gasBaseUrl: "" // TODO: set in settings
  }
};

function setCurrentUser(userKey) {
  AppState.currentUser = userKey;
  applyUserPermissions();
}

function setCurrentScreen(screenId) {
  AppState.ui.currentScreen = screenId;
  var screens = document.querySelectorAll(".screen");
  screens.forEach(function (el) {
    el.classList.toggle("hidden", el.id !== screenId);
  });
}

function applyUserPermissions() {
  var allScreens = [
    "dashboard-screen",
    "transactions-screen",
    "bills-screen",
    "goals-screen",
    "shopping-screen",
    "categories-screen",
    "preferences-screen"
  ];

  var allowed = [];
  if (AppState.currentUser === "me") {
    allowed = allScreens.slice();
  } else if (AppState.currentUser === "partner") {
    // partner can see dashboard + shopping + preferences (for theme etc.)
    allowed = ["dashboard-screen", "shopping-screen", "preferences-screen"];
  }

  allScreens.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("hidden", allowed.indexOf(id) === -1);
  });

  if (allowed.length) {
    setCurrentScreen(allowed[0]);
  }
}

function updatePreferences(partial) {
  AppState.preferences = Object.assign({}, AppState.preferences, partial || {});
  applyTheme(AppState.preferences.theme || "dark");
}

document.addEventListener("DOMContentLoaded", function () {
  applyTheme(AppState.preferences.theme || "dark");
});
