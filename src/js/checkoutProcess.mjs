import { getCartTotal, getCartCount, getLocalStorage } from "./utils.mjs";
import { checkout } from "./externalServices.mjs";
import { alertMessage } from "./utils.mjs";

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
    this.itemTotal = getCartTotal().toFixed(2);
    document.getElementById("subtotal-amount").textContent = `$${this.itemTotal}`;
  },

  displayDetails() {
    const cartCount = getCartCount();
    this.shipping = 10 + ((getCartCount() - 1) * 2);
    this.tax = (this.itemTotal * 0.06).toFixed(2);
    this.orderTotal = parseFloat(this.itemTotal) + parseFloat(this.shipping) + parseFloat(this.tax);
    document.getElementById("item-count").textContent = cartCount;
    document.getElementById("shipping-amount").textContent = `$${this.shipping.toFixed(2)}`;
    document.getElementById("tax-amount").textContent = `$${this.tax}`;
    document.getElementById("order-total-amount").textContent = `$${this.orderTotal.toFixed(2)}`;
  },

  async checkout(form) {
    const items = packageItems(this.list);
    let orderData = {
      orderDate: new Date().toISOString(),
      fname: form.fname.value,
      lname: form.lname.value,
      street: form.street.value,
      city: form.city.value,
      state: form.state.value,
      zip: form.zip.value,
      cardNumber: form.cardNumber.value,
      expiration: form.expiration.value,
      code: form.code.value,
      items: items,
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax

    };
    try {
      const response = await checkout(orderData);
      localStorage.removeItem(this.key);
      window.location.href = "/checkout/success.html";
      return response;
    } catch (err) {
      // Error handling here
      let message = "An error occurred during checkout.";
      if (err.name === "jsonError") {
        message = "There was a problem processing your order. Please try again.";
      } else if (err.name === "servicesError") {
        message = `Service error: ${err.message}`;
      }
      alertMessage(message, true, "error");
    }
  }
}

function packageItems(items) {
  return items.map(item => ({
    id: item.Id,
    name: item.Name,
    price: item.Price,
    quantity: item.quantity
  }));
}

export default checkoutProcess;