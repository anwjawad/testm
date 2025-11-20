/* charts.js
 * Simple dashboard summary per-category vs monthly budget.
 */

function renderDashboardSummary() {
  var incomeTotal = 0;
  var expenseTotal = 0;

  var now = new Date();
  var monthKey = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2);

  var perCatSpent = {};
  (TransactionsState.list || []).forEach(function (t) {
    if (!t.timestamp || t.timestamp.indexOf(monthKey) !== 0) return;
    var amt = Number(t.amount || 0);
    if (t.type === "income") {
      incomeTotal += amt;
    } else if (t.type === "expense") {
      expenseTotal += amt;
      var cats = (t.categories || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      if (!cats.length) cats = ["غير مصنف"];
      cats.forEach(function (c) {
        perCatSpent[c] = (perCatSpent[c] || 0) + amt;
      });
    }
  });

  var net = incomeTotal - expenseTotal;
  var elIncome = document.getElementById("dash-income");
  var elExpense = document.getElementById("dash-expense");
  var elNet = document.getElementById("dash-net");

  if (elIncome) elIncome.textContent = incomeTotal.toFixed(2);
  if (elExpense) elExpense.textContent = expenseTotal.toFixed(2);
  if (elNet) elNet.textContent = net.toFixed(2);

  renderBudgetSummary(perCatSpent);
}

function renderBudgetSummary(perCatSpent) {
  var container = document.getElementById("budget-summary");
  if (!container) return;
  container.innerHTML = "";

  if (!CategoriesState.objects.length) {
    container.textContent = "لا توجد ميزانيات محددة للفئات.";
    return;
  }

  CategoriesState.objects.forEach(function (o) {
    var budget = Number(o.budget || 0);
    if (!budget) return;
    var spent = perCatSpent[o.category] || 0;
    var remain = budget - spent;
    var percent = budget > 0 ? Math.min(100, Math.max(0, (spent / budget) * 100)) : 0;

    var row = document.createElement("div");
    row.className = "budget-row";

    var head = document.createElement("div");
    head.className = "budget-row-head";
    head.innerHTML = '<span class="budget-cat-name">' + o.category + '</span>' +
      '<span class="budget-cat-percent">' + percent.toFixed(0) + '%</span>';

    var barWrap = document.createElement("div");
    barWrap.className = "budget-bar";
    var barFill = document.createElement("div");
    barFill.className = "budget-bar-fill";
    barFill.style.width = percent + "%";
    barWrap.appendChild(barFill);

    var foot = document.createElement("div");
    foot.className = "budget-row-footer";
    foot.textContent =
      "مخصص: " + budget.toFixed(2) +
      " | مصروف: " + spent.toFixed(2) +
      " | متبقي: " + remain.toFixed(2);

    row.appendChild(head);
    row.appendChild(barWrap);
    row.appendChild(foot);
    container.appendChild(row);
  });
}
