import { getProductsByCategory } from "./externalServices.mjs";
import { renderListWithTemplate } from "./utils.mjs";

const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("search");

function productCardTemplate(product) {
  // Use PrimaryMedium image from API and fallback if missing
  const imageSrc = product.Images?.PrimaryMedium || "images/default-image.jpg";
  const altText = product.Name
    ? `Image of ${product.Name}`
    : "Product image unavailable";

  const originalPrice = Math.max(
    product.ListPrice || 0,
    product.SuggestedRetailPrice || 0
  );
  const hasDiscount = originalPrice && product.FinalPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - product.FinalPrice) / originalPrice) * 100)
    : null;
  // console.log(product);

  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img src="${imageSrc}" alt="${altText}" loading="lazy">
      <h3 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
      
      <!-- Price Block -->
      <div class="product_pricing">
        ${hasDiscount ? `<p class="product-card__price--original">$${originalPrice}</p>` : ""}
        ${hasDiscount ? `<p class="product-card__discount">${discountPercent}% OFF</p>` : ""}
        <p class="product-card__price">$${product.FinalPrice}</p>
      </div>
    </a>
    <button id="${product.Id}" class="quick-view-button">Quick View</button>
  </li>`;
}

export default async function productList(selector, category) {
  const el = document.querySelector(selector);
  let products = await getProductsByCategory(category);

  // If a search query exists, filter results
  if (searchQuery) {
    const queryLower = searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.Name.toLowerCase().includes(queryLower) ||
        p.Brand?.Name.toLowerCase().includes(queryLower)
    );

    // If no results, show a user-friendly message
    if (products.length === 0) {
      el.innerHTML = `<p class="no-results">No products found for "${searchQuery}".</p>`;
      return;
    }
  }
  renderListWithTemplate(productCardTemplate, el, products);
}