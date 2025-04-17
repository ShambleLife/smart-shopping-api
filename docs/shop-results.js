document.addEventListener("DOMContentLoaded", async () => {
  const groceryList = JSON.parse(localStorage.getItem("groceryList_guest")) || [];

  if (groceryList.length === 0) {
    alert("You must have selected grocery items on your list.");
    window.location.href = "main.html";
    return;
  }

  // Normalize product names in the list
  const normalizedList = groceryList.map(item =>
    item.name?.toLowerCase?.().trim?.() || item.toLowerCase?.().trim?.()
  );

  const [krogerData, publixData, wholefoodsData] = await Promise.all([
    fetch("https://corsproxy.io/?https://simple-grocery-store-api.glitch.me/products").then(res => res.json()),
    fetch("publix.json").then(res => res.json()),
    fetch("wholefoods.json").then(res => res.json())
  ]);
  

  function buildStoreBreakdown(storeItems) {
    const breakdown = [];
    let total = 0;

    normalizedList.forEach(name => {
      const match = storeItems.find(p => p.name?.toLowerCase?.().trim?.() === name);
      if (match) {
        breakdown.push({ name: match.name, price: match.price });
        total += match.price;
      } else {
        breakdown.push({ name, price: 0 });
      }
    });

    return { breakdown, total };
  }

  const stores = {
    "Publix": buildStoreBreakdown(publixData),
    "Kroger": buildStoreBreakdown(krogerData),
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
