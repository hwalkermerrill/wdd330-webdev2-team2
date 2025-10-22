import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";
import { updateCartBadge } from "./cartBadge.js";

document.addEventListener("DOMContentLoaded", updateCartBadge);

let product;

export default async function productDetails(productId) {
  try {
    product = await findProductById(productId);

    if (!product) {
      document.querySelector("#product-detail").innerHTML = `
        <p class="error-message">Product not found.</p>`;
      return;
    }

    renderProductDetails();

    // Add event listener for cart button
    const addBtn = document.getElementById("addToCart");
    if (addBtn) addBtn.addEventListener("click", addToCart);
  } catch (error) {
    console.error("Error loading product details:", error);
  }
}

export function addToCart() {
  let cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
  updateCartBadge();
}

export function renderProductDetails() {
  // Use correct API image structure
  const imageSrc = product.Images?.PrimaryLarge || "images/default-image.jpg";
  const colorName = product.Colors?.[0]?.ColorName || "N/A";

  // Update content safely
  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productNameWithoutBrand").textContent =
    product.NameWithoutBrand || product.Name;
  document.getElementById("productImage").src = imageSrc;
  document.getElementById("productImage").alt = `Image of ${product.Name}`;
  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColorName").textContent = colorName;

  // Some API descriptions are HTML-formatted — render safely
  document.getElementById("productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple || product.Description || "No description available.";

  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) addToCartBtn.dataset.id = product.Id;
}
