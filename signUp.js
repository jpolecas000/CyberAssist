document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const successMessage = document.getElementById("successMessage");

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Clear previous error/success messages
        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        successMessage.style.display = "none";
        
        let isValid = true;

        // Get trimmed values
        const nameVal = fullNameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        const confirmPasswordVal = confirmPasswordInput.value.trim();

        // Validate Full Name
        if (nameVal === "") {
            nameError.textContent = "Full name is required.";
            isValid = false;
        }

        // Validate Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal === "") {
            emailError.textContent = "Email is required.";
            isValid = false;
        } else if (!emailPattern.test(emailVal)) {
            emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        // Validate Password length
        if (passwordVal === "") {
            passwordError.textContent = "Password is required.";
            isValid = false;
        } else if (passwordVal.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters.";
            isValid = false;
        }

        // Validate Confirm Password
        if (confirmPasswordVal === "") {
            confirmPasswordError.textContent = "Please confirm your password.";
            isValid = false;
        } else if (passwordVal !== confirmPasswordVal) {
            confirmPasswordError.textContent = "Passwords do not match.";
            isValid = false;
        }

        // If all fields pass validation
        if (isValid) {
            // Simulate a successful registration database write
            successMessage.textContent = "Registration successful! Redirecting...";
            successMessage.style.display = "block";
            
            signupForm.reset();

            // Optional: Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }
    });
});