// --- Convert response to JSON ---
import { alertMessage } from "./utils.mjs";


export async function convertToJson(res) {
  let jsonResponse;
  try {
    jsonResponse = await res.json();
  } catch {
    throw { name: "jsonError", message: "Failed to parse JSON" };
  }
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse, status: res.status };
  }
}

// --- Use environment variable for server URL ---
const baseURL = import.meta.env.VITE_SERVER_URL || "http://server-nodejs.cit.byui.edu:3000/";

// --- Fetch all products in a given category ---
export async function getProductsByCategory(category = "tents") {
  try {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // API returns { Result: [...] }
  } catch {
    alertMessage("Error fetching products. Please try again later.", true, "error");
    return [];
  }
}

// --- Fetch a single product by ID ---
export async function findProductById(id) {
  try {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; // single product object
  } catch {
    alertMessage("Error fetching product details. Please try again later.", true, "error");
    return null;
  }
}

export async function checkout(order) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  };
  const response = await fetch(`${baseURL}checkout`, options)
  const data = await convertToJson(response);
  return data;
}

export async function loginRequest(creds){
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds)
  };
  const response = await fetch(`${baseURL}login`, options);
  const data = await convertToJson(response);
  
  // Log everything and pause
  console.log("===== LOGIN RESPONSE =====");
  console.log("Full data:", data);
  console.log("Type:", typeof data);
  console.log("Keys:", Object.keys(data));
  console.log("data.accessToken:", data.accessToken);
  console.log("data.token:", data.token);
  console.log("data.access_token:", data.access_token);
  console.log("==========================");
  
  debugger; // This will pause execution so you can read the logs
  
  return data.accessToken;
}

export async function getOrders(token){
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  };
  const response = await fetch(`${baseURL}orders`, options);
  const data = await convertToJson(response);
  return data;
}

