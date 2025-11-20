/* categories.js
 * Category list with monthly budgets.
 */

var CategoriesState = {
  list: [],
  objects: []
};

function loadCategories() {
  if (!window.GasApi) return;
  GasApi.fetchCategories().then(function (res) {
    if (!res || !res.ok) return;
    CategoriesState.objects = res.categoryObjects || [];
    CategoriesState.list = CategoriesState.objects.map(function (o) { return o.category; });
    renderCategoriesUI();
    fillCategoryDropdowns();
  }).catch(function (err) {
    console.error("fetchCategories error", err);
  });
}

function renderCategoriesUI() {
  var tableContainer = document.getElementById("categories-table");
  if (!tableContainer) return;
  tableContainer.innerHTML = "";

  var table = document.createElement("table");
  table.className = "simple-table";
  var thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>الفئة</th><th>ميزانية شهرية</th></tr>";
  table.appendChild(thead);
  var tbody = document.createElement("tbody");

  CategoriesState.objects.forEach(function (o, idx) {
    var tr = document.createElement("tr");

    var tdName = document.createElement("td");
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = o.category;
    nameInput.className = "text-input";
    nameInput.addEventListener("input", function () {
      CategoriesState.objects[idx].category = nameInput.value.trim();
    });
    tdName.appendChild(nameInput);

    var tdBudget = document.createElement("td");
    var budInput = document.createElement("input");
    budInput.type = "number";
    budInput.value = o.budget || "";
    budInput.className = "text-input";
    budInput.addEventListener("input", function () {
      CategoriesState.objects[idx].budget = budInput.value;
    });
    tdBudget.appendChild(budInput);

    tr.appendChild(tdName);
    tr.appendChild(tdBudget);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

function fillCategoryDropdowns() {
  var selects = document.querySelectorAll(".category-select");
  selects.forEach(function (sel) {
    var current = sel.value;
    sel.innerHTML = "";
    var optEmpty = document.createElement("option");
    optEmpty.value = "";
    optEmpty.textContent = "اختر فئة";
    sel.appendChild(optEmpty);
    CategoriesState.list.forEach(function (name) {
      var o = document.createElement("option");
      o.value = name;
      o.textContent = name;
      sel.appendChild(o);
    });
    if (current) sel.value = current;
  });
}

function addNewCategoryFromInputs() {
  var nameInput = document.getElementById("new-category-name");
  var budInput = document.getElementById("new-category-budget");
  if (!nameInput || !budInput) return;
  var name = nameInput.value.trim();
  var budget = budInput.value.trim();
  if (!name) return;
  CategoriesState.objects.push({ category: name, budget: budget });
  CategoriesState.list = CategoriesState.objects.map(function (o) { return o.category; });
  nameInput.value = "";
  budInput.value = "";
  renderCategoriesUI();
  fillCategoryDropdowns();
}

function saveCategoriesToBackend() {
  if (!window.GasApi) return;
  GasApi.saveCategoriesObjects(CategoriesState.objects).then(function () {
    alert("تم حفظ الفئات");
    loadCategories();
  }).catch(function (err) {
    console.error("saveCategories error", err);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var btnAdd = document.getElementById("add-category-btn");
  var btnSave = document.getElementById("save-categories-btn");
  if (btnAdd) btnAdd.addEventListener("click", addNewCategoryFromInputs);
  if (btnSave) btnSave.addEventListener("click", saveCategoriesToBackend);
  loadCategories();
});
