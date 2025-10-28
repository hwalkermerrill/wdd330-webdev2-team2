import productList from "./productList.mjs";
import { getParam } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load shared header and footer
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
});

// Get the category parameter from the URL (default to tents)
const category = getParam("category") || "tents";

// Fix and format the heading text
const heading = document.getElementById("page-title");
if (heading) {
  // Capitalize first letter and replace hyphens with spaces
  const formattedCategory = category.replace(/-/g, " ");
  heading.textContent = `Top Products: ${formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1)}`;
}

// Load the product list for the selected category
productList("#product-list", category);
