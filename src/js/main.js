import { loadHeaderFooter } from "./utils.mjs";
import productList from "./productList.mjs";
import { loadAlerts } from "./alert.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  loadAlerts(); //load the allert banner
  productList(".product-list", "tents");
});

// Attach search event listener once header is loaded
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");

  const observer = new MutationObserver(() => {
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
      observer.disconnect();

      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = document.getElementById("searchInput").value.trim();
        if (query) {
          // Redirect to product list page with search query
          window.location.href = `/product-list/index.html?search=${encodeURIComponent(query)}`;
        }
      });
    }
  });

  observer.observe(header, { childList: true, subtree: true });
});
