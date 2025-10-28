//import { findProductById } from "./productData.mjs"; //if we don't need addToCartHandler we dont need this
import { getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs"; 
import { updateCartBadge } from "./cartBadge.js";
import { loadHeaderFooter } from "./utils.mjs";

// Load shared header and footer
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
});

document.addEventListener("DOMContentLoaded", updateCartBadge);
const productId = getParam("product");


productDetails(productId);

// do we need this add to cart button event handler if our addToCart logic already lives inside
// productDetails.mjs ????
//async function addToCartHandler(e) {
  //const product = await findProductById(e.target.dataset.id);
  //addProductToCart(product);
//}

//setTotalNumber();

// add listener to Add to Cart button
