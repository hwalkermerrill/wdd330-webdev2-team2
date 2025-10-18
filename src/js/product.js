import { findProductById } from "./productData.mjs";
import { getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs"; 
import { updateCartBadge } from "./cartBadge.js";
import { setTotalNumber } from "./cart.js";

document.addEventListener("DOMContentLoaded", updateCartBadge);
const productId = getParam("product");


productDetails(productId);

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// setTotalNumber();

// add listener to Add to Cart button
