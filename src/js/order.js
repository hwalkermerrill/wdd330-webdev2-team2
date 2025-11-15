import { loadHeaderFooter, getParam} from "./utils.mjs";
import {checkLogin } from "./auth.mjs";
import { getOrders } from "./externalServices.mjs";





// Load shared header and footer
document.addEventListener("DOMContentLoaded", async () => {
    await loadHeaderFooter();
    localStorage.getItem("so-token");
    const token = checkLogin();
    console.log("Token from checkLogin:", token);
     if (token) {
        try {
            const orders = await getOrders(token);
            console.log("Orders:", orders);
            displayOrders(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            alert("Failed to load orders. Please try again.");
        }
    }
});


function displayOrders(orders) {
    const orderList = document.getElementById("order-list");
    orders.forEach(order => {
        const listItem = document.createElement("li");
        listItem.textContent = `Order ID: ${order.id}, Status: ${order.status}`;
        orderList.appendChild(listItem);
    });
}
