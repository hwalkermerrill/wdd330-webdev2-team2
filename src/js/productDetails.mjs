import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";
import { findProductById, getProductsByCategory} from "./externalServices.mjs";
import { updateCartBadge } from "./cartBadge.js";

document.addEventListener("DOMContentLoaded", updateCartBadge);

let product;

export default async function productDetails(productId) {
  try {
    product = await findProductById(productId);

    if (!product) {
      document.querySelector("#product-detail").innerHTML = `
        <p class="error-message">Product not found.</p>`;
      return;
    }

    renderProductDetails();
    similarProducts();
    setupComments(product.Id);

    // Add event listener for cart button
    const addBtn = document.getElementById("addToCart");
    if (addBtn) addBtn.addEventListener("click", addToCart);
  } catch {
    alertMessage("Error loading product details. Please try again later.", true, "error");
  }
}
function cartAnimation() {
  document.querySelector(".cart").classList.add("animate");
  setTimeout(() => {
    document.querySelector(".cart").classList.remove("animate");
  }, 1000);
}

export function addToCart() {
    let cart = getLocalStorage("so-cart") || [];
    const existingProduct = cart.find((item) => item.Id === product.Id);
    if (existingProduct) {
        existingProduct.quantity += 1;
        setLocalStorage("so-cart", cart);
        updateCartBadge();
        cartAnimation();
        return;
    }
    // If not, add new product with quantity 1
    product.quantity = 1;
    cart.push(product);
    setLocalStorage("so-cart", cart);
    updateCartBadge();
    cartAnimation();

  alertMessage(`${product.Name} added to cart!`, true, "success");
}

export function renderProductDetails() {
  // Constants at the top

  const colorName = product.Colors?.[0]?.ColorName || "N/A";
  const discountElement = document.getElementById("productDiscount");
  const originalPriceElement = document.getElementById("productOriginalPrice")

  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productNameWithoutBrand").textContent =
    product.NameWithoutBrand || product.Name;
  
  const productImg = document.getElementById("productImage");

// Fallback for missing images
const primaryLarge = product.Images?.PrimaryLarge || "images/default-image.jpg";
const primaryMedium = product.Images?.PrimaryMedium || primaryLarge;
const primarySmall = product.Images?.PrimarySmall || primaryMedium;

productImg.src = primaryLarge;
productImg.alt = `Image of ${product.Name}`;

// Responsive images
productImg.srcset = `
  ${primarySmall} 480w,
  ${primaryMedium} 768w,
  ${primaryLarge} 1200w
`;

productImg.sizes = "(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px";

  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColorName").textContent = colorName;

  // Insert Discount Flag
  if (discountElement &&
    product.SuggestedRetailPrice &&
    product.FinalPrice < product.SuggestedRetailPrice
  ) {
    const discount = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
    );
    discountElement.textContent = `${discount}% OFF`;
    discountElement.style.display = "inline-block"; // switches from hidden to visible

    if (originalPriceElement) {
      originalPriceElement.textContent = `$${product.SuggestedRetailPrice}`;
      originalPriceElement.style.textDecoration = "line-through";
      originalPriceElement.style.display = "inline-block"; // switches from hidden to visible
    }
  } else {
    if (discountElement) discountElement.style.display = "none";
    if (originalPriceElement) originalPriceElement.style.display = "none";
  }
  renderThumbnails();

  // Some API descriptions are HTML-formatted — render safely
  document.getElementById("productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple || product.Description || "No description available.";

  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) addToCartBtn.dataset.id = product.Id;
}

export function loadBreadCrumbs() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  // const count = params.get("count");

  const breadcrumbContainer = document.getElementById("breadcrumb");
  const path = window.location.pathname.split("/").filter(Boolean);
  let html = "<ol class=\"breadcrumb\">";
  html += "<li class=\"breadcrumb-item\"><a href=\"/\">Home</a></li>";

  let accumulatedPath = "";
  const visibleSegments = path.filter(seg => seg !== "index.html");

  visibleSegments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;

    // Last segment in visible segments
    if (index === visibleSegments.length - 1 && category) {
      html += `<li class="breadcrumb-item"><a href="${accumulatedPath}">${decodeURIComponent(segment)}</a></li>`;
      html += `<li class="breadcrumb-item active">${decodeURIComponent(category)}</li>`;
    } else {
      html += `<li class="breadcrumb-item"><a href="${accumulatedPath}">${decodeURIComponent(segment)}</a></li>`;
    }
  });

  breadcrumbContainer.innerHTML = html;
}

export function renderThumbnails() {
  const hasExtraImages = product.Images?.ExtraImages?.length > 0;
  
  if (!hasExtraImages) {
    return;
  }
  
  let allImages = [];
  allImages.push(product.Images.PrimaryLarge);
  
  product.Images.ExtraImages.forEach(img => {
    allImages.push(img.Src);
  });
  
  const thumbnailContainer = document.getElementById("thumbnailContainer");
  const ul = thumbnailContainer.querySelector("ul");
  
  ul.innerHTML = "";
  
  allImages.forEach((imageSrc, index) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = `Thumbnail ${index + 1}`;
    img.classList.add("thumbnail");
    
    img.addEventListener("click", () => {
      document.getElementById("productImage").src = imageSrc;
    });
    
    li.appendChild(img);
    ul.appendChild(li);
  });
}

export async function similarProducts() {

  const similarProducts = await getProductsByCategory(product.CategoryId)

  console.log("Similar products:", similarProducts);

  const numberOfRecommendations = 3;
  const picks = similarProducts.sort(() => 0.5 - Math.random()).slice(0, numberOfRecommendations);

  const similarProductsContainer = document.getElementById("similarProducts");
  similarProductsContainer.innerHTML = "";

  


  picks.forEach((product) => {
    const productCard = document.createElement("div");

    console.log(product);

    productCard.random = Math.random(2);

    productCard.innerHTML = `
      <div class="product-card">
        <a href="/product_pages/?product=${product.Id}">
          <img src="${product.Images.PrimaryLarge}" alt="${product.Name}" loading="lazy">
          <h3 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h3>
          <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
          <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
      </div>
    `;

    
    similarProductsContainer.appendChild(productCard);
  });
}

// COMMENTS SYSTEM WITH DELETE, RATING, AND SORT

function setupComments(productId) {
  const form = document.getElementById("commentForm");
  const list = document.getElementById("commentList");
  const sortSelect = document.getElementById("sortComments");

  if (!form || !list || !sortSelect) return;

  // Render comments initially
  renderComments(productId);

  // Add new comment
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("commenterName").value.trim();
    const text = document.getElementById("commentText").value.trim();
    const rating = parseInt(document.getElementById("commentRating").value);

    if (!name || !text || !rating) return;

    const newComment = {
      id: Date.now(), // unique ID for deletion
      name,
      text,
      rating,
      date: new Date().toISOString(),
    };

    const key = `comments-${productId}`;
    const comments = getLocalStorage(key) || [];
    comments.push(newComment);
    setLocalStorage(key, comments);

    form.reset();
    renderComments(productId);
  });

  // Sorting
  sortSelect.addEventListener("change", () => renderComments(productId));
}

function renderComments(productId) {
  const list = document.getElementById("commentList");
  const sortSelect = document.getElementById("sortComments");
  if (!list) return;

  const key = `comments-${productId}`;
  let comments = getLocalStorage(key) || [];

  // Sort logic
  const sortBy = sortSelect?.value || "newest";
  if (sortBy === "newest") {
    comments.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "oldest") {
    comments.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === "highest") {
    comments.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "lowest") {
    comments.sort((a, b) => a.rating - b.rating);
  }

  // Clear existing
  list.innerHTML = "";

  comments.forEach((c) => {
    const li = document.createElement("li");
    li.classList.add("comment-item");

    li.innerHTML = `
      <p>
        <strong>${c.name}</strong>
        <em>(${new Date(c.date).toLocaleDateString()})</em>
        - ${"⭐️".repeat(c.rating)}
      </p>
      <p>${c.text}</p>
      <button class="deleteComment" data-id="${c.id}">Delete</button>
    `;

    // Delete comment
    li.querySelector(".deleteComment").addEventListener("click", () => {
      const updatedComments = comments.filter((com) => com.id !== c.id);
      setLocalStorage(key, updatedComments);
      renderComments(productId);
    });

    list.appendChild(li);
  });
}

loadBreadCrumbs();

