/* transactions.js
 * Income/expense list and summary.
 */

var TransactionsState = {
  list: []
};

function loadTransactions() {
  if (!window.GasApi) return;
  GasApi.fetchTransactions().then(function (res) {
    if (!res || !res.ok) return;
    TransactionsState.list = res.transactions || [];
    renderTransactionsList();
    renderDashboardSummary();
  }).catch(function (err) {
    console.error("fetchTransactions error", err);
  });
}

function renderTransactionsList() {
  var container = document.getElementById("transactions-list");
  if (!container) return;
  container.innerHTML = "";

  if (!TransactionsState.list.length) {
    container.textContent = "لا توجد حركات بعد.";
    return;
  }

  TransactionsState.list.slice().reverse().forEach(function (t) {
    var row = document.createElement("div");
    row.className = "list-row";

    var main = document.createElement("div");
    main.className = "list-main";

    var title = document.createElement("div");
    title.className = "list-title";
    title.textContent = (t.type === "income" ? "دخل: " : "مصروف: ") + (t.amount || 0);

    var meta = document.createElement("div");
    meta.className = "list-meta";
    var cats = (t.categories || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean).join("، ");
    meta.textContent = (t.timestamp || "") + " | " + (cats || "بدون فئة") + (t.note ? (" | " + t.note) : "");

    main.appendChild(title);
    main.appendChild(meta);

    var actions = document.createElement("div");
    actions.className = "list-actions";

    var delBtn = document.createElement("button");
    delBtn.className = "btn danger-btn";
    delBtn.textContent = "حذف";
    delBtn.addEventListener("click", function () {
      if (AppState.preferences.deleteConfirm === "on") {
        if (!confirm("هل تريد حذف هذه الحركة؟")) return;
      }
      GasApi.deleteTransaction(t.id).then(function () {
        loadTransactions();
      });
    });

    actions.appendChild(delBtn);

    row.appendChild(main);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function handleAddIncome() {
  var amountInput = document.getElementById("income-amount");
  var catSelect = document.getElementById("income-category");
  var noteInput = document.getElementById("income-note");
  var srcInput = document.getElementById("income-source");

  if (!amountInput) return;
  var amount = parseFloat(amountInput.value || "0");
  if (!amount || amount <= 0) return;

  GasApi.addTransaction({
    type: "income",
    amount: amount,
    categories: catSelect && catSelect.value ? [catSelect.value] : [],
    note: noteInput ? noteInput.value.trim() : "",
    source: srcInput ? srcInput.value.trim() : ""
  }).then(function () {
    amountInput.value = "";
    if (noteInput) noteInput.value = "";
    if (srcInput) srcInput.value = "";
    if (catSelect) catSelect.value = "";
    loadTransactions();
  });
}

function handleAddExpense() {
  var amountInput = document.getElementById("expense-amount");
  var catSelect = document.getElementById("expense-category");
  var noteInput = document.getElementById("expense-note");

  if (!amountInput) return;
  var amount = parseFloat(amountInput.value || "0");
  if (!amount || amount <= 0) return;

  GasApi.addTransaction({
    type: "expense",
    amount: amount,
    categories: catSelect && catSelect.value ? [catSelect.value] : [],
    note: noteInput ? noteInput.value.trim() : "",
    source: ""
  }).then(function () {
    amountInput.value = "";
    if (noteInput) noteInput.value = "";
    if (catSelect) catSelect.value = "";
    loadTransactions();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var btnInc = document.getElementById("income-add-btn");
  var btnExp = document.getElementById("expense-add-btn");
  if (btnInc) btnInc.addEventListener("click", handleAddIncome);
  if (btnExp) btnExp.addEventListener("click", handleAddExpense);
  loadTransactions();
});
