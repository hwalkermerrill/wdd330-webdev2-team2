import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

let totalCost = 0;
let cartNumber =0

export function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  if (cartItems && cartItems.length > 0) {
    console.log(cartItems);
    cartItems.forEach(item =>{
      totalCost += item.FinalPrice;
      cartNumber++;
      console.log(cartNumber);
    })
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    console.log(htmlItems.join(""));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    document.getElementById("total-price").textContent = `$${totalCost.toFixed(2)}`;
  } else {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty.</p>";
  }
  if(totalCost > 0){
    document.querySelector(".cart-total").classList.remove("hide");
  } else{
    document.querySelector(".cart-total").classList.add("hide");
  }
}
export function setTotalNumber(){
  const cartItems = getLocalStorage("so-cart");
  if (cartItems && cartItems.length > 0) {
    cartNumber = cartItems.length;
    if (document.querySelector(".cart-badge")) {
      document.querySelector(".cart-badge").textContent = cartNumber;
    } else {
      console.warn("No cart badge element found");
    }
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}


loadHeaderFooter();
setTotalNumber();