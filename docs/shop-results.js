// shop-results.js

document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("shopResults"));
  
    function renderStore(storeKey, columnId) {
      const column = document.getElementById(columnId);
      if (!column || !data[storeKey]) return;
  
      const store = data[storeKey];
      store.breakdown.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
          <span>${item.name}</span>
          <span>$${item.price.toFixed(2)}</span>
        `;
        column.appendChild(itemRow);
      });
  
      const totalRow = document.createElement('div');
      totalRow.className = 'total-row';
      totalRow.innerHTML = `Total: $${parseFloat(store.total).toFixed(2)}`;
      column.appendChild(totalRow);
    }
  
    renderStore("Publix", "publix-items");
    renderStore("Kroger", "kroger-items");
    renderStore("Whole Foods", "wholefoods-items");
  });