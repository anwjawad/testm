/* goals.js
 * Simple goals and yearly items handling.
 */

var GoalsState = {
  goals: [],
  yearly: []
};

function refreshGoalsUI() {
  if (!window.GasApi) return;
  GasApi.fetchGoalsAndYearly().then(function (res) {
    if (!res || !res.ok) return;
    GoalsState.goals = res.goals || [];
    GoalsState.yearly = res.yearlyItems || [];
    renderGoalsUI();
  });
}

function renderGoalsUI() {
  var goalsList = document.getElementById("goals-list");
  var yearlyList = document.getElementById("yearly-list");

  if (goalsList) {
    goalsList.innerHTML = "";
    GoalsState.goals.forEach(function (g) {
      var div = document.createElement("div");
      div.className = "list-row";
      div.textContent = g.goalName + " - الهدف: " + (g.goalTarget || 0) + (g.goalNote ? (" (" + g.goalNote + ")") : "");
      goalsList.appendChild(div);
    });
  }

  if (yearlyList) {
    yearlyList.innerHTML = "";
    GoalsState.yearly.forEach(function (y) {
      var div = document.createElement("div");
      div.className = "list-row";
      var yearlyAmount = Number(y.yearlyAmount || 0);
      var monthly = yearlyAmount / 12;
      div.textContent = y.yearlyName + " - سنوي: " + yearlyAmount.toFixed(2) + " | شهري تقريبي: " + monthly.toFixed(2);
      yearlyList.appendChild(div);
    });
  }
}

function handleAddGoalClicked() {
  var nameInput = document.getElementById("goal-name");
  var targetInput = document.getElementById("goal-target");
  var noteInput = document.getElementById("goal-note");
  if (!nameInput || !targetInput) return;
  var name = nameInput.value.trim();
  var target = parseFloat(targetInput.value || "0");
  var note = noteInput ? noteInput.value.trim() : "";

  if (!name) return;

  GasApi.addGoal({
    goalName: name,
    goalTarget: target,
    goalNote: note
  }).then(function () {
    nameInput.value = "";
    targetInput.value = "";
    if (noteInput) noteInput.value = "";
    refreshGoalsUI();
  });
}

function handleAddYearlyClicked() {
  var nameInput = document.getElementById("yearly-name");
  var amountInput = document.getElementById("yearly-amount");
  if (!nameInput || !amountInput) return;
  var name = nameInput.value.trim();
  var amount = parseFloat(amountInput.value || "0");
  if (!name || !amount) return;

  GasApi.addYearlyItem({
    yearlyName: name,
    yearlyAmount: amount
  }).then(function () {
    nameInput.value = "";
    amountInput.value = "";
    refreshGoalsUI();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var btnGoal = document.getElementById("goal-add-btn");
  var btnYearly = document.getElementById("yearly-add-btn");
  if (btnGoal) btnGoal.addEventListener("click", handleAddGoalClicked);
  if (btnYearly) btnYearly.addEventListener("click", handleAddYearlyClicked);
  refreshGoalsUI();
});
