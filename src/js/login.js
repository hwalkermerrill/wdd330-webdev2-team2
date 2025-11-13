import { loadHeaderFooter, getParam} from "./utils.mjs";
import { login } from "./auth.mjs";


// Load shared header and footer
document.addEventListener("DOMContentLoaded", async () => {
    await loadHeaderFooter();

    const submit_button = document.getElementById("submit_button");

    if (!submit_button) {
        console.error("Submit button not found!");
        return;
    }
    submit_button.addEventListener("click", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const redirect = getParam("redirect") || "/orders/";

        userLogin(username, password, redirect);
    });
});

function userLogin(userName, Password, redirect){
    const creds = {
        email: userName,
        password: Password
    };
    console.log(creds);
    login(creds, redirect);
    
    
}




