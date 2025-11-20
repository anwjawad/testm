/* gas-api.js
 * JSONP client for the Google Apps Script backend.
 * Make sure AppState.dataConfig.gasBaseUrl is set to your GAS web app URL.
 */

(function () {
  function getGasBaseUrl() {
    if (window.AppState && AppState.dataConfig && AppState.dataConfig.gasBaseUrl) {
      return AppState.dataConfig.gasBaseUrl;
    }
    console.warn("gasBaseUrl not configured in AppState.dataConfig.gasBaseUrl");
    return "";
  }

  function buildQuery(params) {
    var str = [];
    for (var k in params) {
      if (!params.hasOwnProperty(k)) continue;
      if (params[k] === undefined || params[k] === null) continue;
      str.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
    }
    return str.join("&");
  }

  function gasCallJSONP(params) {
    return new Promise(function (resolve, reject) {
      var baseUrl = getGasBaseUrl();
      if (!baseUrl) {
        reject(new Error("gasBaseUrl is empty"));
        return;
      }
      var cbName = "gas_cb_" + Date.now().toString(36) + "_" + Math.floor(Math.random() * 1e6).toString(36);
      params = params || {};
      params.callback = cbName;

      var url = baseUrl;
      url += (baseUrl.indexOf("?") === -1 ? "?" : "&") + buildQuery(params);

      window[cbName] = function (data) {
        try {
          resolve(data);
        } finally {
          delete window[cbName];
          if (script.parentNode) script.parentNode.removeChild(script);
        }
      };

      var script = document.createElement("script");
      script.src = url;
      script.onerror = function (err) {
        delete window[cbName];
        if (script.parentNode) script.parentNode.removeChild(script);
        reject(err || new Error("JSONP error"));
      };
      document.body.appendChild(script);
    });
  }

  // Transactions
  function fetchTransactions() {
    return gasCallJSONP({ action: "getTransactions" });
  }

  function addTransaction(payload) {
    payload = payload || {};
    return gasCallJSONP({
      action: "addTransaction",
      type: payload.type,
      categories: Array.isArray(payload.categories) ? payload.categories.join(",") : (payload.categories || ""),
      amount: payload.amount,
      note: payload.note,
      source: payload.source
    });
  }

  function deleteTransaction(id) {
    return gasCallJSONP({
      action: "deleteTransaction",
      id: id
    });
  }

  // Categories
  function fetchCategories() {
    return gasCallJSONP({ action: "getCategories" });
  }

  function saveCategoriesObjects(list) {
    return gasCallJSONP({
      action: "saveCategories",
      categoryObjects: JSON.stringify(list || [])
    });
  }

  function saveCategories(names) {
    var list = (names || []).map(function (name) {
      return { category: name, budget: "" };
    });
    return saveCategoriesObjects(list);
  }

  // Bills
  function fetchBills() {
    return gasCallJSONP({ action: "getBills" });
  }

  function addBill(payload) {
    payload = payload || {};
    return gasCallJSONP({
      action: "addBill",
      name: payload.name,
      amount: payload.amount,
      dueDate: payload.dueDate,
      status: payload.status || "unpaid",
      isMonthly: payload.isMonthly ? "yes" : "no",
      autoRenew: payload.autoRenew ? "yes" : "no"
    });
  }

  function updateBillStatus(billId, status) {
    return gasCallJSONP({
      action: "updateBillStatus",
      id: billId,
      status: status
    });
  }

  // Goals & yearly
  function fetchGoalsAndYearly() {
    return gasCallJSONP({ action: "getGoalsAndYearly" });
  }

  function addGoal(payload) {
    payload = payload || {};
    return gasCallJSONP({
      action: "addGoal",
      goalName: payload.goalName,
      goalTarget: payload.goalTarget,
      goalNote: payload.goalNote
    });
  }

  function addYearlyItem(payload) {
    payload = payload || {};
    return gasCallJSONP({
      action: "addYearlyItem",
      yearlyName: payload.yearlyName,
      yearlyAmount: payload.yearlyAmount
    });
  }

  // Shopping
  function fetchShoppingList() {
    return gasCallJSONP({ action: "getShoppingList" });
  }

  function addShoppingItem(payload) {
    payload = payload || {};
    return gasCallJSONP({
      action: "addShoppingItem",
      itemName: payload.itemName,
      category: payload.category,
      note: payload.note
    });
  }

  function markShoppingItemPurchased(payload) {
    payload = payload || {};
    return gasCallJSONP({
      action: "markShoppingPurchased",
      itemId: payload.itemId,
      price: payload.price
    });
  }

  function deleteShoppingItem(payload) {
    payload = payload || {};
    return gasCallJSONP({
      action: "deleteShoppingItem",
      itemId: payload.itemId
    });
  }

  // Expose API globally
  window.GasApi = {
    gasCallJSONP: gasCallJSONP,
    fetchTransactions: fetchTransactions,
    addTransaction: addTransaction,
    deleteTransaction: deleteTransaction,
    fetchCategories: fetchCategories,
    saveCategoriesObjects: saveCategoriesObjects,
    saveCategories: saveCategories,
    fetchBills: fetchBills,
    addBill: addBill,
    updateBillStatus: updateBillStatus,
    fetchGoalsAndYearly: fetchGoalsAndYearly,
    addGoal: addGoal,
    addYearlyItem: addYearlyItem,
    fetchShoppingList: fetchShoppingList,
    addShoppingItem: addShoppingItem,
    markShoppingItemPurchased: markShoppingItemPurchased,
    deleteShoppingItem: deleteShoppingItem
  };

  console.log("gas-api.js ready ✅");
})();