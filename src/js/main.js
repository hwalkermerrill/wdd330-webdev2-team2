import { loadHeaderFooter } from "./utils.mjs";
import productList from "./productList.mjs";
import { loadAlerts } from "./alert.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  loadAlerts(); //load the allert banner
  productList(".product-list", "tents");
});
