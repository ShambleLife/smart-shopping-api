document.addEventListener("DOMContentLoaded", async () => {
  const groceryList = ["Banana", "Milk"]; // You can replace this with a real list from localStorage later

  // Fetch data from each "store"
  const [krogerData, publixData, wholefoodsData] = await Promise.all([
    fetch("https://simple-grocery-store-api.glitch.me/products").then(res => res.json()),
    fetch("publix.json").then(res => res.json()),
    fetch("wholefoods.json").then(res => res.json())
  ]);

  function buildStoreBreakdown(storeItems) {
    const breakdown = [];
    let total = 0;

    groceryList.forEach(itemName => {
      const item = storeItems.find(p => p.name.toLowerCase() === itemName.toLowerCase());
      if (item) {
        breakdown.push({ name: item.name, price: item.price });
        total += item.price;
      } else {
        breakdown.push({ name: itemName, price: 0 }); // Or mark as not found
      }
    });

    return { breakdown, total };
  }

  const stores = {
    "Publix": buildStoreBreakdown(publixData),
    "Kroger": buildStoreBreakdown(krogerData),
    "Whole Foods": buildStoreBreakdown(wholefoodsData)
  };

  localStorage.setItem("shopResults", JSON.stringify(stores));

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
