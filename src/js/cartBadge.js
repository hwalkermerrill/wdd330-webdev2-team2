import { getLocalStorage } from "./utils.mjs";

export function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;

  const cartItems = getLocalStorage("so-cart") || [];
  const count = cartItems.length;

  badge.textContent = count;

  // Optional: hide badge if empty
  badge.style.display = count > 0 ? "inline-block" : "none";
}

updateCartBadge();