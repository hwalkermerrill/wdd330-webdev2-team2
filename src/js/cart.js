import { getLocalStorage, setLocalStorage } from "./utils.mjs";



function removeFromCart(id) {
   const cart = getLocalStorage("so-cart") || [];
  // Find the index of the first item with this Id
  const index = cart.findIndex(item => String(item.Id) === String(id));
  if (index > -1) {
    cart.splice(index, 1); // remove that one item
  }
  setLocalStorage("so-cart", cart);
  renderCartContents();

  location.reload();
}

function removeFromCartButton(){
  document.querySelectorAll(".removeFromCart").forEach(btn => console.log(btn.dataset.id));
  document.querySelectorAll(".removeFromCart").forEach(button => {
    button.addEventListener("click", (e) => {
      console.log("button hit");
      const id = e.target.getAttribute('data-id');
      removeFromCart(id);
    });
  })
}

function renderCartContents() {
  let totalCost = 0;
  let cartNumber = 0;

  const cartItems = getLocalStorage("so-cart");
  if (cartItems && cartItems.length > 0) {
    cartItems.forEach(item =>{
      totalCost += item.FinalPrice;
      cartNumber++;
      // eslint-disable-next-line no-console
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
export function setTotalNumber(){
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
  <button class="removeFromCart" data-id="${item.Id}">x</button>

</li>`;

  return newItem;
}


renderCartContents();
removeFromCartButton();
