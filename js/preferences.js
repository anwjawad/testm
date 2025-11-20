/* preferences.js
 * UI bindings for preferences, including PIN settings.
 */

document.addEventListener("DOMContentLoaded", function () {
  var themeSelect = document.getElementById("pref-theme");
  var deleteConfirmSelect = document.getElementById("pref-delete-confirm");
  var pinMeSelect = document.getElementById("pref-pin-me");
  var pinPartnerSelect = document.getElementById("pref-pin-partner");
  var pinSaveBtn = document.getElementById("pref-pin-save-btn");

  if (themeSelect) {
    themeSelect.value = AppState.preferences.theme || "dark";
    themeSelect.addEventListener("change", function () {
      updatePreferences({ theme: themeSelect.value });
    });
  }

  if (deleteConfirmSelect) {
    deleteConfirmSelect.value = AppState.preferences.deleteConfirm || "on";
    deleteConfirmSelect.addEventListener("change", function () {
      AppState.preferences.deleteConfirm = deleteConfirmSelect.value;
    });
  }

  if (pinMeSelect && pinPartnerSelect && pinSaveBtn) {
    pinMeSelect.value = AppState.preferences.pinRequired.me ? "on" : "off";
    pinPartnerSelect.value = AppState.preferences.pinRequired.partner ? "on" : "off";

    pinSaveBtn.addEventListener("click", function () {
      var newPinMe = document.getElementById("pref-new-pin-me").value.trim();
      var newPinPartner = document.getElementById("pref-new-pin-partner").value.trim();

      AppState.preferences.pinRequired.me = (pinMeSelect.value === "on");
      AppState.preferences.pinRequired.partner = (pinPartnerSelect.value === "on");

      if (newPinMe) {
        AppState.pinCodes.me = newPinMe;
      }
      if (newPinPartner) {
        AppState.pinCodes.partner = newPinPartner;
      }

      alert("تم حفظ إعدادات PIN");
      document.getElementById("pref-new-pin-me").value = "";
      document.getElementById("pref-new-pin-partner").value = "";
    });
  }

  var gasUrlInput = document.getElementById("pref-gas-url");
  if (gasUrlInput) {
    gasUrlInput.value = AppState.dataConfig.gasBaseUrl || "";
    gasUrlInput.addEventListener("change", function () {
      AppState.dataConfig.gasBaseUrl = gasUrlInput.value.trim();
    });
  }
});
