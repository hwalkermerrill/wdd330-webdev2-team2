import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter, getCartTotal } from "./utils.mjs";



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

function combineCartItems(cart) {
  const combined = [];
  cart.forEach(item => {
    const existing = combined.find(i => i.Id === item.Id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      combined.push({ ...item, quantity: item.quantity || 1 });
    }
  });
  return combined;
}

function removeFromCartButton(){
  document.querySelectorAll(".removeFromCart").forEach(btn => console.log(btn.dataset.id));
  document.querySelectorAll(".removeFromCart").forEach(button => {
    button.addEventListener("click", (e) => {
      console.log("button hit");
      const id = e.target.getAttribute('data-id');
      removeFromCart(id);
      increaseQuantity(id);
    });
  })
}


export function renderCartContents() {
  let totalCost = getCartTotal();
  let cartNumber = 0;

  const cartItems = getLocalStorage("so-cart");
  if (cartItems && cartItems.length > 0) {
    cartItems.forEach(item =>{
      cartNumber++;
    })
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
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
const addQuantity = document.querySelectorAll(".increaseQty");
const removeQuantity = document.querySelectorAll(".decreaseQty");
function increaseQuantity(id) {
const item = cart.find(p => String(p.Id) === id);
    if (item) item.quantity += 1;
    setLocalStorage("so-cart", cart);
    renderCartContents();
    addQuantity.forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.getAttribute('data-id');
        increaseQuantity(id);
      });
    })
};

function decreaseQuantity(id) {
  const item = cart.find(p => String(p.Id) === id);
  if (item) item.quantity -= 1;
  setLocalStorage("so-cart", cart);
  renderCartContents();
};

document.querySelector(".product-list").addEventListener("click", e => {
  const id = e.target.dataset.id;
  let cart = getLocalStorage("so-cart") || []; // <-- define cart first!

  if (e.target.classList.contains("increaseQty")) {
    const item = cart.find(p => String(p.Id) === id);
    if (item) item.quantity = (item.quantity || 1) + 1;
    setLocalStorage("so-cart", cart);
    renderCartContents();
  }

  if (e.target.classList.contains("decreaseQty")) {
    const item = cart.find(p => String(p.Id) === id);
    if (item) {
      item.quantity = (item.quantity || 1) - 1;
      if (item.quantity <= 0) {
        cart = cart.filter(p => String(p.Id) !== id);
      }
    }
    setLocalStorage("so-cart", cart);
    renderCartContents();
  }

  if (e.target.classList.contains("removeFromCart")) {
    cart = cart.filter(p => String(p.Id) !== id);
    setLocalStorage("so-cart", cart);
    renderCartContents();
  }
});

 

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
  <div class="cart-card__quantity-controls">
        <p class="cart-card__quantity">qty: ${item.quantity}</p>
        <button class="decreaseQty" data-id="${item.Id}">-</button>
        <button class="increaseQty" data-id="${item.Id}">+</button>
      </div>
  
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="removeFromCart" data-id="${item.Id}">x</button>

</li>`;

  return newItem;
}


loadHeaderFooter();
removeFromCartButton();
