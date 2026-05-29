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
        if (passwordVal === "") {
            passwordError.textContent = "Password is required.";
            isValid = false;
        } else if (passwordVal.length < 8) {
            passwordError.textContent = "Password must be at least 8 characters.";
            isValid = false;
        }
        let hasCapital = false;
        let capital = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        for (let letter of capital) {
        if (passwordVal.includes(letter)) {
            hasCapital = true;
        }
        }
        if (!hasCapital) {
             passwordError.textContent = "Password should contain at least 1 capital letter";
            isValid = false;
        }
         let hasNumber = false;
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        for (let number of numbers) {
        if (passwordVal.includes(String(number))) {
            hasNumber = true;
        }
        }
        if (!hasNumber) {
             passwordError.textContent = "Password should contain at least 1 number";
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
    // Send registration data to the backend Node server
    fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: nameVal, email: emailVal, password: passwordVal })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(res => {
        if (res.status === 201) {
            successMessage.textContent = res.body.message + " Redirecting to login...";
            successMessage.style.display = "block";
            signupForm.reset();
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } else {
            // Display errors returned by server (e.g. email already exists)
            emailError.textContent = res.body.message;
        }
    })
    .catch(error => {
        console.error("Error signing up:", error);
        emailError.textContent = "Server communication failure.";
    });
}
    });
});