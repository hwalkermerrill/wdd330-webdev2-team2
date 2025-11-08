import { loadHeaderFooter } from "./utils.mjs";
import { loadAlerts } from "./alert.mjs";
import productList from "./productList.mjs";
import { updateCartBadge } from "./cartBadge";

document.addEventListener("DOMContentLoaded", async () => {
  // Load shared site elements
  await loadHeaderFooter();
  await loadAlerts();
  updateCartBadge();

  // Determine what page we're on
  const path = window.location.pathname;

  // If we're on the product list page, load tents
  if (path.includes("product-list")) {
    productList(".product-list", "tents");
  }
});

// Attach search event listener after header loads
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
        } else {
          // If empty search, just go to product list page
          window.location.href = `/product-list/index.html`;
        }
      });
    }
  });

  observer.observe(header, { childList: true, subtree: true });
});

// Friendly message for newsletter submission form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value;
      alert(`Thanks for subscribing, ${email}!`);
      form.reset();
    });
  }
});

// Keeps banner ad from appearing more than once
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("register-modal");
  const closeBtn = modal.querySelector(".modal-close-button");

  if (!localStorage.getItem("seenSweepstakesPromo")) {
    modal.classList.remove("hide");
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hide");
    localStorage.setItem("seenSweepstakesPromo", "true");
  });
});
