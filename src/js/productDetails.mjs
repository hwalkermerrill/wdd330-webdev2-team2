import { setLocalStorage } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";

let product;

export default async function productDetails(productId){
    product = await findProductById(productId);
    renderProductDetails();
}

export function addToCart(){
  // add products to new array called cart, as object wont work
  let cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

export function renderProductDetails(){
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
    document.getElementById("productImage").src = product.Image;
    document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
    document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
}