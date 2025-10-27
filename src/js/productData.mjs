// --- Convert response to JSON ---
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// --- Use environment variable for server URL ---
const baseURL = import.meta.env.VITE_SERVER_URL || "http://server-nodejs.cit.byui.edu:3000/";

// --- Fetch all products in a given category ---
export async function getData(category = "tents") {
  try {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // API returns { Result: [...] }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// --- Fetch a single product by ID ---
export async function findProductById(id) {
  try {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; // single product object
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
