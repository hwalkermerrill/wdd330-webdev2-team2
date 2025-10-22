import { getData } from "./productData.mjs";
import { renderListWithTemplate } from "./utils.mjs";

const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("search");

function productCardTemplate(product) {
  // Use PrimaryMedium image from API and fallback if missing
  const imageSrc = product.Images?.PrimaryMedium || "images/default-image.jpg";
  const altText = product.Name
    ? `Image of ${product.Name}`
    : "Product image unavailable";

  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img src="${imageSrc}" alt="${altText}" loading="lazy" />
      <h3 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default async function productList(selector, category) {
  const el = document.querySelector(selector);
  let products = await getData(category);

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