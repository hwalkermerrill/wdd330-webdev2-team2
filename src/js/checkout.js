import checkoutProcess from "./checkoutProcess.mjs";

const zip = document.getElementById("zip");

checkoutProcess.init("so-cart", "#checkout-items");

zip.addEventListener("focusout", () => checkoutProcess.displayDetails());

const checkoutForm = document.querySelector("form");
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await checkoutProcess.checkout(checkoutForm);
});