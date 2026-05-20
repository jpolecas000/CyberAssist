document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");
    const successMessage = document.getElementById("successMessage");

    loginForm.addEventListener("submit", function(event) {
        // Prevent the default form submission behavior (page reload)
        event.preventDefault();

        // Clear previous messages
        usernameError.textContent = "";
        passwordError.textContent = "";
        successMessage.style.display = "none";
        
        let isValid = true;
        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value.trim();

        // Basic Validation
        if (usernameVal === "") {
            usernameError.textContent = "Username is required.";
            isValid = false;
        }

        if (passwordVal === "") {
            passwordError.textContent = "Password is required.";
            isValid = false;
        }

        // If everything is valid, simulate a successful login
        if (isValid) {
            // In a real app, you would send this data to your backend server here using fetch() or an XMLHttpRequest
            
            successMessage.textContent = `Welcome, ${usernameVal}! Login successful.`;
            successMessage.style.display = "block";
            
            // Optional: clear the form
            loginForm.reset();
        }
    });
});