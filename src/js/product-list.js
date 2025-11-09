import productList from "./productList.mjs";
import { getParam } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import productDetails from "./productDetails.mjs";
import { updateCartBadge } from "./cartBadge";
import { renderThumbnails } from "./productDetails.mjs";

// Load shared header and footer
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  updateCartBadge();
});

// Place constants at the top
const category = getParam("category") || "tents";
const breadCrumbs = document.getElementById("breadcrumbs");
const heading = document.getElementById("page-title");
if (heading) {
  // Capitalize first letter and replace hyphens with spaces
  const formattedCategory = category.replace(/-/g, " ");
  heading.textContent = `Top Products: ${formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1)}`;
}

// Load the product list for the selected category
productList("#product-list", category).then(() => {

  let buttons = document.querySelectorAll(".quick-view-button");
  // console.log(buttons);
  buttons.forEach(button => {
    button.addEventListener("click", (e) => {
      // console.log("Quick View button clicked");
      const productId = e.target.id;
      openQuickView(productId);
    });
  });
});

function openQuickView(productId) {
  let modalHolder = document.createElement("div");
  modalHolder.classList.add("modal-holder");
  modalHolder.innerHTML = `
    <div class="item-modal">
    <button class="modal-close-button">X</button>
    <section class="modal-details product-detail">
        <h3 id="productName"></h3>
        <h4 class="divider" id="productNameWithoutBrand"></h4>

        <div class="product-image-carousel">
          <img id="productImage" class="divider" src="" alt="">
          <div  id="thumbnailContainer" class="thumbnails">
            <ul class="thumbnails"></ul>
          </div>
        </div>
        <!-- Price Block -->
        <div class="product_pricing">
          <p class="product-card__price--original" id="productOriginalPrice"></p>
          <p class="product-card__discount" id="productDiscount"></p>
          <p class="product-card__price" id="productFinalPrice"></p>
        </div>

        <p class="product__color" id="productColorName"></p>
        <p class="product__description" id="productDescriptionHtmlSimple"></p>

        <div class="product-detail__add">
          <button id="addToCart" data-id="">Add to Cart</button>
        </div>
      </section>
    </div>
  `;
  document.body.prepend(modalHolder);
  document.body.classList.add("no-scroll");
  productDetails(productId);

  // Add event listener to close the modal
  const closeButton = modalHolder.querySelector(".modal-close-button");
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modalHolder);
    document.body.classList.remove("no-scroll");
  });
  renderThumbnails();
}

