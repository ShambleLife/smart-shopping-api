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

  try {
    const [krogerHTML, publixHTML, wholefoodsHTML] = await Promise.all([
      fetch("https://raw.githubusercontent.com/ShambleLife/mock-grocery-data/main/groceries.html").then(res => res.text()),
      fetch("https://raw.githubusercontent.com/ShambleLife/mock-grocery-data/main/pub.html").then(res => res.text()),
      fetch("https://raw.githubusercontent.com/ShambleLife/mock-grocery-data/main/wf.html").then(res => res.text())
    ]);

    krogerData = scrapeHTML(krogerHTML);
    publixData = scrapeHTML(publixHTML);
    wholefoodsData = scrapeHTML(wholefoodsHTML);

  } catch (error) {
    console.error("Failed to fetch store data:", error);
    alert("Error loading store data. Please try again later.");
    return;
  }

  function scrapeHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const items = [];
    const itemElements = doc.querySelectorAll(".item");

    itemElements.forEach(el => {
      const name = el.querySelector(".name")?.textContent?.trim();
      const price = parseFloat(el.querySelector(".price")?.textContent?.replace("$", "").trim());

      if (name && !isNaN(price)) {
        items.push({ name, price });
      }
    });

    return items;
  }

  function buildStoreBreakdown(storeItems) {
    const breakdown = [];
    let total = 0;

    normalizedList.forEach(name => {
      const match = storeItems.find(p =>
        (p.name)?.toLowerCase?.().trim?.() === name
      );
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