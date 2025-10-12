import { getLocalStorage } from "./utils.mjs";

let totalCost = 0;
let cartNumber =0

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  if (cartItems && cartItems.length > 0) {
    cartItems.forEach(item =>{
      totalCost += item.FinalPrice;
      cartNumber++;
      console.log(cartNumber);
    })
  }
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  document.getElementById("total-price").textContent = `$${totalCost.toFixed(2)}`;
  if(totalCost > 0){
    document.querySelector(".cart-total").classList.remove("hide");
  } else{
    document.querySelector(".cart-total").classList.add("hide");
  }
}
function setTotalNumber(){
  const cartItems = getLocalStorage("so-cart");
  if (cartItems && cartItems.length > 0) {
    cartNumber = cartItems.length;
    document.querySelector(".cart-badge").textContent = cartNumber;
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

setTotalNumber();
renderCartContents();
