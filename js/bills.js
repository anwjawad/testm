/* bills.js
 * Bills list with monthly auto-renew and posting to transactions.
 */

var BillsState = {
  bills: []
};

function refreshBillsUI() {
  if (!window.GasApi) return;
  GasApi.fetchBills().then(function (res) {
    if (!res || !res.ok) return;
    BillsState.bills = res.bills || [];
    renderBillsList();
  }).catch(function (err) {
    console.error("fetchBills error", err);
  });
}

function renderBillsList() {
  var container = document.getElementById("bills-list");
  if (!container) return;
  container.innerHTML = "";

  var unpaid = BillsState.bills.filter(function (b) { return String(b.status) !== "paid"; });
  if (!unpaid.length) {
    container.textContent = "لا توجد فواتير حالياً.";
    return;
  }

  unpaid.forEach(function (b) {
    var row = document.createElement("div");
    row.className = "list-row";

    var main = document.createElement("div");
    main.className = "list-main";

    var title = document.createElement("div");
    title.className = "list-title";
    title.textContent = b.name + " - " + (b.amount || 0);

    var meta = document.createElement("div");
    meta.className = "list-meta";
    var badges = [];
    if (String(b.isMonthly).toLowerCase() === "yes") badges.push("شهرية");
    if (String(b.autoRenew).toLowerCase() === "yes") badges.push("تجديد تلقائي");
    meta.textContent = "استحقاق: " + (b.dueDate || "") + (badges.length ? (" | " + badges.join(" + ")) : "");

    main.appendChild(title);
    main.appendChild(meta);

    var actions = document.createElement("div");
    actions.className = "list-actions";

    var paidBtn = document.createElement("button");
    paidBtn.className = "btn primary-btn";
    paidBtn.textContent = "مدفوعة";
    paidBtn.addEventListener("click", function () {
      GasApi.updateBillStatus(b.id, "paid").then(function () {
        refreshBillsUI();
      });
    });

    actions.appendChild(paidBtn);

    row.appendChild(main);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function handleAddBillClicked() {
  var nameInput = document.getElementById("bill-name");
  var amountInput = document.getElementById("bill-amount");
  var dueInput = document.getElementById("bill-due");
  var statusInput = document.getElementById("bill-status");
  var monthlyCheckbox = document.getElementById("bill-is-monthly");
  var renewCheckbox = document.getElementById("bill-auto-renew");

  if (!nameInput || !amountInput || !dueInput) return;

  var name = nameInput.value.trim();
  var amount = parseFloat(amountInput.value || "0");
  var due = dueInput.value;
  var status = statusInput ? statusInput.value : "unpaid";
  var isMonthly = monthlyCheckbox && monthlyCheckbox.checked;
  var autoRenew = renewCheckbox && renewCheckbox.checked;

  if (!name || !due) {
    alert("أدخل اسم الفاتورة وتاريخ الاستحقاق");
    return;
  }

  GasApi.addBill({
    name: name,
    amount: amount,
    dueDate: due,
    status: status,
    isMonthly: isMonthly,
    autoRenew: autoRenew
  }).then(function () {
    nameInput.value = "";
    amountInput.value = "";
    dueInput.value = "";
    if (monthlyCheckbox) monthlyCheckbox.checked = false;
    if (renewCheckbox) renewCheckbox.checked = false;
    refreshBillsUI();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("bill-add-btn");
  if (btn) btn.addEventListener("click", handleAddBillClicked);
  refreshBillsUI();
});
