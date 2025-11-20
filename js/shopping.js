/* shopping.js
 * Shopping list: wife (partner) and husband (me) shared.
 * - Both can add items with category + note and delete items.
 * - Only "me" can mark as purchased with price, which creates an expense transaction.
 */

var ShoppingState = {
  items: []
};

function refreshShoppingUI() {
  if (!window.GasApi) return;
  GasApi.fetchShoppingList().then(function (res) {
    if (!res || !res.ok) return;
    ShoppingState.items = res.items || [];
    renderShoppingList();
  }).catch(function (err) {
    console.error("fetchShoppingList error", err);
  });
}

function renderShoppingList() {
  var container = document.getElementById("shopping-list");
  if (!container) return;
  container.innerHTML = "";

  if (!ShoppingState.items.length) {
    container.textContent = "لا توجد عناصر حالياً.";
    return;
  }

  ShoppingState.items.forEach(function (item) {
    var row = document.createElement("div");
    row.className = "list-row";

    var main = document.createElement("div");
    main.className = "list-main";

    var title = document.createElement("div");
    title.className = "list-title";
    title.textContent = item.name;

    var meta = document.createElement("div");
    meta.className = "list-meta";
    var catText = item.category ? ("فئة: " + item.category) : "بدون فئة";
    var noteText = item.note ? ("ملاحظة: " + item.note) : "";
    meta.textContent = catText + (noteText ? " | " + noteText : "");

    main.appendChild(title);
    main.appendChild(meta);

    var actions = document.createElement("div");
    actions.className = "list-actions";

    // delete button (available for both users)
    var delBtn = document.createElement("button");
    delBtn.className = "btn danger-btn";
    delBtn.textContent = "حذف";
    delBtn.addEventListener("click", function () {
      if (AppState.preferences.deleteConfirm === "on") {
        if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
      }
      GasApi.deleteShoppingItem({ itemId: item.id }).then(function () {
        refreshShoppingUI();
      });
    });
    actions.appendChild(delBtn);

    // purchase controls - only for "me"
    if (AppState.currentUser === "me") {
      var priceInput = document.createElement("input");
      priceInput.type = "number";
      priceInput.min = "0";
      priceInput.placeholder = "السعر";
      priceInput.className = "text-input small";

      var buyBtn = document.createElement("button");
      buyBtn.className = "btn primary-btn";
      buyBtn.textContent = "تم الشراء";
      buyBtn.addEventListener("click", function () {
        var price = parseFloat(priceInput.value || "0");
        if (!price || price <= 0) {
          alert("أدخل سعر صالح");
          return;
        }
        GasApi.markShoppingItemPurchased({ itemId: item.id, price: price }).then(function () {
          refreshShoppingUI();
        });
      });

      actions.appendChild(priceInput);
      actions.appendChild(buyBtn);
    }

    row.appendChild(main);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function handleAddShoppingClicked() {
  var nameInput = document.getElementById("shopping-item-input");
  var catSelect = document.getElementById("shopping-item-category");
  var noteInput = document.getElementById("shopping-item-note");

  if (!nameInput || !catSelect || !noteInput) return;
  var name = nameInput.value.trim();
  var category = catSelect.value || "";
  var note = noteInput.value.trim();

  if (!name) return;

  GasApi.addShoppingItem({
    itemName: name,
    category: category,
    note: note
  }).then(function () {
    nameInput.value = "";
    noteInput.value = "";
    catSelect.value = "";
    refreshShoppingUI();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("shopping-add-btn");
  if (btn) btn.addEventListener("click", handleAddShoppingClicked);
  refreshShoppingUI();
});
