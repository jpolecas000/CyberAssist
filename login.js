document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");
    const successMessage = document.getElementById("successMessage");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        usernameError.textContent = "";
        passwordError.textContent = "";
        successMessage.style.display = "none";
        
        let isValid = true;
        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        if (usernameVal === "") {
            usernameError.textContent = "Username is required.";
            isValid = false;
        }

        if (passwordVal === "") {
            passwordError.textContent = "Password is required.";
            isValid = false;
        }

        // If everything is valid, simulate a successful login
       // Replace the old "if (isValid)" block in public/script.js with this:
if (isValid) {
    window.alert("Successfully logged in!")
    // Send data to the backend Node server
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameVal, password: passwordVal })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(res => {
        if (res.status === 200) {
            successMessage.textContent = res.body.message;
            successMessage.style.display = "block";
            loginForm.reset();
        } else {
            // Handle server-side errors (e.g. wrong password)
            usernameError.textContent = res.body.message;
        }
    })
    .catch(error => {
        console.error("Error logging in:", error);
        usernameError.textContent = "Something went wrong. Please Reload.";
    });
}
    });
});