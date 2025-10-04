import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";

function addProductToCart(product) {
  // get existing cart or start with empty array
  const cart = getLocalStorage("so-cart") || [];
  cart.push(product);

  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
  cartAnimation();
}

function cartAnimation() {
  document.querySelector(".cart").classList.add("animate");
  setTimeout(() => {
    document.querySelector(".cart").classList.remove("animate");
  }, 1000);
}



// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
  
