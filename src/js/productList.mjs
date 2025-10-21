import { getData } from "./productData.mjs";
import { renderListWithTemplate } from "./utils.mjs";

const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("search");

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default async function productList(selector, category) {
  const el = document.querySelector(selector);
  let products = await getData(category);

  // If search query exists, this filter results
  if (searchQuery) {
    const queryLower = searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.Name.toLowerCase().includes(queryLower) ||
        p.Brand.Name.toLowerCase().includes(queryLower)
    );

    // If no results, show a user-friendly message
    if (products.length === 0) {
      el.innerHTML = `<p class="no-results">No products found for "${searchQuery}".</p>`;
      return;
    }
  }

  renderListWithTemplate(productCardTemplate, el, products);
}
