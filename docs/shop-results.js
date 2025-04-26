document.addEventListener("DOMContentLoaded", async () => {
  const groceryList = JSON.parse(localStorage.getItem("groceryList_guest")) || [];

  if (groceryList.length === 0) {
    alert("You must have selected grocery items on your list.");
    window.location.href = "main.html";
    return;
  }

  // Normalize product names
  const normalizedList = groceryList.map(item =>
    item.name?.toLowerCase?.().trim?.() || item.toLowerCase?.().trim?.()
  );

  const [krogerData, publixData, wholefoodsData] = await Promise.all([
    fetch("https://dummyjson.com/products").then(res => res.json()), // Updated to DummyJSON
    fetch("publix.json").then(res => res.json()),
    fetch("wholefoods.json").then(res => res.json())
  ]);

  function buildStoreBreakdown(storeItems, isDummyJson = false) {
    const breakdown = [];
    let total = 0;

    normalizedList.forEach(name => {
      const itemsArray = isDummyJson ? storeItems.products : storeItems; // DummyJSON has .products
      const match = itemsArray.find(p => 
        (p.name || p.title)?.toLowerCase?.().trim?.() === name
      );

      if (match) {
        breakdown.push({ name: match.name || match.title, price: match.price });
        total += match.price;
      } else {
        breakdown.push({ name, price: 0 });
      }
    });

    return { breakdown, total };
  }

  const stores = {
    "Publix": buildStoreBreakdown(publixData),
    "Kroger": buildStoreBreakdown(krogerData, true), // true = DummyJSON format
    "Whole Foods": buildStoreBreakdown(wholefoodsData)
  };

  function renderStore(storeKey, columnId) {
    const column = document.getElementById(columnId);
    if (!column || !stores[storeKey]) return;

    const store = stores[storeKey];
    store.breakdown.forEach(item => {
      const itemRow = document.createElement("div");
      itemRow.className = "item-row";
      itemRow.innerHTML = `
        <span>${item.name}</span>
        <span>$${item.price.toFixed(2)}</span>
      `;
      column.appendChild(itemRow);
    });

    const totalRow = document.createElement("div");
    totalRow.className = "total-row";
    totalRow.innerHTML = `Total: $${store.total.toFixed(2)}`;
    column.appendChild(totalRow);
  }

  renderStore("Publix", "publix-items");
  renderStore("Kroger", "kroger-items");
  renderStore("Whole Foods", "wholefoods-items");
});