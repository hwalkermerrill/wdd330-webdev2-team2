import { getCartTotal, getCartCount } from "./utils.mjs";

const checkoutProcess = {
    key: "",
    outputSelector: "",
    list: [],
    itemTotal: 0,
    shipping: 0,
    tax: 0,
    orderTotal: 0,
    init(key, outputSelector) {
      this.key = key;
      this.outputSelector = outputSelector;
      this.list = getLocalStorage(key);
      this.displaySubtotal();
    },

    displaySubtotal() {
      this.itemTotal = getCartTotal();
      document.getElementById("subtotal-amount").textContent = `$${this.itemTotal.toFixed(2)}`;
    },

    displayDetails() {
      this.shipping = 10 + ((getCartCount() - 1) * 2);
      this.tax = this.itemTotal * 0.06;
      this.orderTotal = this.itemTotal + this.shipping + this.tax;
      document.getElementById("item-count").textContent = cartCount;
      document.getElementById("shipping-amount").textContent = `$${this.shipping.toFixed(2)}`;
      document.getElementById("tax-amount").textContent = `$${this.tax.toFixed(2)}`;
      document.getElementById("order-total-amount").textContent = `$${this.orderTotal.toFixed(2)}`;
    }
}

export default checkoutProcess;