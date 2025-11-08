import { getLocalStorage } from "./utils.mjs";

export function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;

  const cartItems = getLocalStorage("so-cart") || [];
  let count = 0;
  for (const item of cartItems) {
    count += item.quantity || 1;
  }

  badge.textContent = count;

  // Optional: hide badge if empty
  badge.style.display = count > 0 ? "inline-block" : "none";
}
