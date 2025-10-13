import { getData } from "./productData.mjs";
import { renderListWithTemplate } from "./utils.mjs";
import { updateCartBadge } from "./cartBadge.js";

document.addEventListener("DOMContentLoaded", updateCartBadge);
function productCardTemplate(product) {
    return `<li class="product-card">
    <a href="product_pages/index.html?product=">
    <img
      src="${product.Image}"
      alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
  </li>`
}

export default function productList(selector, category) {
   const el = document.querySelector(selector);
   const products = getData(category);
   console.log(products);
    renderListWithTemplate(productCardTemplate, el, products);
}

