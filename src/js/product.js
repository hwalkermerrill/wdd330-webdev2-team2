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

function renderCart(){
  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = ""; // clear old list

  const cart = getLocalStorage("so-cart") || [];
  
  cart.forEach(item => {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-card");
    cartItem.innerHTML = cartItemTemplate(item);
    cartContainer.appendChild(cartItem);
  });

}

function removeFromCartButton(){
  document.querySelectorAll(".removeFromCart").forEach(btn => console.log(btn.dataset.id));
  document.querySelectorAll(".removeFromCart").forEach(button => {
    button.addEventListener("click", (e) => {
      console.log(e.target);
      const id = e.target.getAttribute('data-id');
      removeFromCart(id);
      renderCart();
    });
  })
}

function removeFromCart(id) {
  const cart = getLocalStorage("so-cart") || [];
  const newCart = cart.filter((item) => String(item.Id) !== String(id));
  setLocalStorage("so-cart", newCart);
  
}

const cartContainer = document.querySelector(".products");
console.log(cartContainer);

cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeFromCart")) {
    const id = e.target.getAttribute('data-id');
    removeFromCart(id);
    renderCart();
  }
})
// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
  
  
  
