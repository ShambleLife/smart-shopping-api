document.addEventListener("DOMContentLoaded", async () => {
  const groceryList = JSON.parse(localStorage.getItem("groceryList_guest")) || [];

  if (groceryList.length === 0) {
    alert("You must have selected grocery items on your list.");
    window.location.href = "main.html";
    return;
  }

  const normalizedList = groceryList.map(item =>
    item.name?.toLowerCase?.().trim?.() || item.toLowerCase?.().trim?.()
  );

  let krogerData = [];
  let publixData = [];
  let wholefoodsData = [];

  // Function to scrape GitHub HTML pages
  async function fetchStoreData(url) {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const items = [...doc.querySelectorAll("#grocery-list li")];
    return items.map(li => {
      const name = li.querySelector(".item-name")?.textContent?.trim() || "";
      const priceText = li.querySelector(".item-price")?.textContent?.replace('$', '').trim() || "0";
      const price = parseFloat(priceText) || 0;
      return { name, price };
    });
  }

  try {
    const [krogerResponse, publixResponse, wholefoodsResponse] = await Promise.all([
      fetchStoreData("https://shamblelife.github.io/mock-grocery-data/groceries.html"),
      fetchStoreData("https://shamblelife.github.io/mock-grocery-data/pub.html"),
      fetchStoreData("https://shamblelife.github.io/mock-grocery-data/wf.html")
    ]);

    krogerData = krogerResponse;
    publixData = publixResponse;
    wholefoodsData = wholefoodsResponse;
  } catch (error) {
    console.error("Failed to fetch store data:", error);
    alert("Error loading store data. Please try again later.");
    return;
  }

  function buildStoreBreakdown(storeItems) {
    const breakdown = [];
    let total = 0;

    normalizedList.forEach(name => {
      const match = storeItems.find(p =>
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