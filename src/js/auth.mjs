import { alertMessage, setLocalStorage } from "./utils.mjs";
import { loginRequest } from "./externalServices.mjs";
import { jwtDecode } from "jwt-decode";  // CORRECT IMPORT

const tokenKey = "so_token";  // CORRECT KEY (with hyphen)

export async function login(creds, redirect = "/") {
  try {
    const token = await loginRequest(creds);
    console.log("Token received:", token);
    
    // Use localStorage.setItem directly, not setLocalStorage
    localStorage.setItem(tokenKey, token);
    
    console.log("About to redirect to:", redirect);
    window.location.href = redirect;
  } catch (err) {
    console.error("Login error:", err);
    alertMessage("Error logging in. Please try again later.");
  }
}

export function checkLogin() {
  const token = localStorage.getItem(tokenKey);
  const valid = isTokenValid(token);

  if (!valid) {
    localStorage.removeItem(tokenKey);
    const redirect = window.location.pathname;
    window.location = `/login/index.html?redirect=${redirect}`;
    return null;
  } else {
    return token;
  }
}

export function isTokenValid(token) {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);  // CORRECT FUNCTION NAME
    const currentDate = new Date();

    if (decoded.exp * 1000 < currentDate.getTime()) {
      console.log("Token expired.");
      return false;
    } else {
      console.log("Valid token");
      return true;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
}
