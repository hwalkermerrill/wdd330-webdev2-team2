const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlString.join(""));
}
export function renderWithTemplate(
  templateFn,
  parentElement,
  data = {},
  callback,
  position = "afterbegin",
  clear = true,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);

  if (callback) {
    callback(data);
  }
}
function loadTemplate(path) {
  // wait what?  we are returning a new function? 
  // this is called currying and can be very helpful.
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  };
}


export async function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
  const headerHTML = await headerTemplateFn();
  const footerHTML = await footerTemplateFn();
  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("#main-footer");
  renderWithTemplate(() => headerHTML, headerEl);
  renderWithTemplate(() => footerHTML, footerEl);
}

export function getCartTotal() {
  let totalCost = 0;
  const cartItems = getLocalStorage("so-cart") || [];
  if (cartItems && cartItems.length > 0) {
    cartItems.forEach(item => {
      totalCost += item.FinalPrice * item.quantity;
    });
  }
  return totalCost;
}

export function getCartCount() {
  let cartNumber = 0;
  const cartItems = getLocalStorage("so-cart") || [];
  if (cartItems && cartItems.length > 0) {
    cartItems.forEach(item => {
      cartNumber += item.quantity;
    });
  }
  return cartNumber;
}

export function alertMessage(message, scroll = true, type = "error") {
  const main = document.querySelector("main");
  if (!main) return;
  main.querySelectorAll(".alert-message").forEach(el => el.remove());

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert-message ${type}`;
  alertDiv.setAttribute("role", "alert");
  alertDiv.innerHTML = `
    <div class="alert-message__content">
      <strong class="alert-message__title">${type === "error" ? "Error" : "Success"}</strong>
      <p class="alert-message__message">${escapeHTML(message)}</p>
    </div>
    <button class="alert-message__close" aria-label="Close alert">&times;</button>
  `;
  alertDiv.querySelector(".alert-message__close").addEventListener("click", () => { alertDiv.remove(); })
  main.prepend(alertDiv);
  if (scroll) { main.scrollIntoView({ behavior: "smooth" }); }

  setTimeout(() => alertDiv.remove(), 10000);
}

// Security helper
function escapeHTML(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

