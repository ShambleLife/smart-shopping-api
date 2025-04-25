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

  const [dummyData, publixData, wholefoodsData] = await Promise.all([
    fetch("https://dummyjson.com/products").then(res => res.json()),
    fetch("publix.json").then(res => res.json()),
    fetch("wholefoods.json").then(res => res.json())
  ]);
  
  
  const krogerData = dummyData.products;
  

  function buildStoreBreakdown(storeItems) {
    const breakdown = [];
    let total = 0;
  
    normalizedList.forEach(name => {
      const match = storeItems.find(p => {
        const productName = (p.name || p.title || "").toLowerCase().trim();
        return productName === name;
      });
  
      if (match) {
        const productName = match.name || match.title || name;
        breakdown.push({ name: productName, price: match.price });
        total += match.price;
      } else {
        breakdown.push({ name, price: 0 });
      }
    });
  
    return { breakdown, total };
    console.log("normalizedList item:", name);
    console.log("storeItems names:", storeItems.map(p => (p.name || p.title)));
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
