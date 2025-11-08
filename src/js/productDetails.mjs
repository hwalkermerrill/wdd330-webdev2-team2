import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";
import { findProductById } from "./externalServices.mjs";
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
  } catch {
    alertMessage("Error loading product details. Please try again later.", true, "error");
  }
}
function cartAnimation() {
  document.querySelector(".cart").classList.add("animate");
  setTimeout(() => {
    document.querySelector(".cart").classList.remove("animate");
  }, 1000);
}

export function addToCart() {
    let cart = getLocalStorage("so-cart") || [];
    const existingProduct = cart.find((item) => item.Id === product.Id);
    if (existingProduct) {
        existingProduct.quantity += 1;
        setLocalStorage("so-cart", cart);
        updateCartBadge();
        cartAnimation();
        return;
    }
    // If not, add new product with quantity 1
    product.quantity = 1;
    cart.push(product);
    setLocalStorage("so-cart", cart);
    updateCartBadge();
    cartAnimation();

  alertMessage(`${product.Name} added to cart!`, true, "success");
}

export function renderProductDetails() {
  // Constants at the top
  const imageSrc = product.Images?.PrimaryLarge || "images/default-image.jpg";
  const colorName = product.Colors?.[0]?.ColorName || "N/A";
  const discountElement = document.getElementById("productDiscount");
  const originalPriceElement = document.getElementById("productOriginalPrice")

  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productNameWithoutBrand").textContent =
    product.NameWithoutBrand || product.Name;
  document.getElementById("productImage").src = imageSrc;
  document.getElementById("productImage").alt = `Image of ${product.Name}`;
  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColorName").textContent = colorName;

  // Insert Discount Flag
  if (discountElement &&
    product.SuggestedRetailPrice &&
    product.FinalPrice < product.SuggestedRetailPrice
  ) {
    const discount = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
    );
    discountElement.textContent = `${discount}% OFF`;
    discountElement.style.display = "inline-block"; // switches from hidden to visible

    if (originalPriceElement) {
      originalPriceElement.textContent = `$${product.SuggestedRetailPrice}`;
      originalPriceElement.style.textDecoration = "line-through";
      originalPriceElement.style.display = "inline-block"; // switches from hidden to visible
    }
  } else {
    if (discountElement) discountElement.style.display = "none";
    if (originalPriceElement) originalPriceElement.style.display = "none";
  }

  // Some API descriptions are HTML-formatted — render safely
  document.getElementById("productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple || product.Description || "No description available.";

  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) addToCartBtn.dataset.id = product.Id;
}

export function loadBreadCrumbs() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  // const count = params.get("count");

  const breadcrumbContainer = document.getElementById("breadcrumb");
  const path = window.location.pathname.split("/").filter(Boolean);
  let html = "<ol class=\"breadcrumb\">";
  html += "<li class=\"breadcrumb-item\"><a href=\"/\">Home</a></li>";

  let accumulatedPath = "";
  const visibleSegments = path.filter(seg => seg !== "index.html");

  visibleSegments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;

    // Last segment in visible segments
    if (index === visibleSegments.length - 1 && category) {
      html += `<li class="breadcrumb-item"><a href="${accumulatedPath}">${decodeURIComponent(segment)}</a></li>`;
      html += `<li class="breadcrumb-item active">${decodeURIComponent(category)}</li>`;
    } else {
      html += `<li class="breadcrumb-item"><a href="${accumulatedPath}">${decodeURIComponent(segment)}</a></li>`;
    }
  });

  breadcrumbContainer.innerHTML = html;
}

loadBreadCrumbs();

