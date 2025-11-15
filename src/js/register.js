import { alertMessage, loadHeaderFooter } from "./utils.mjs";
import { updateCartBadge } from "./cartBadge";
import { registerUser} from "./externalServices.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    await loadHeaderFooter();
    updateCartBadge();
});

const submit_button = document.getElementById("submit_button");
submit_button.addEventListener("click", async (e) => {
    console.log("Register button clicked");
    e.preventDefault();
    let registrationData = {
        name: document.getElementById("name").value,
        address: document.getElementById("address").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    try{
        const response = await registerUser(registrationData);
        console.log("Registration response:", response);
    } catch(err){
        console.error("Registration error:", err);
        alertMessage("Error registering user. "+err.message.message);
    }
});