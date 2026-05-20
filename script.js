var appointments = {};
let user;
const button = index.html.getElementById("test_Button");
button.addEventListener("click", function() {
  handleButtonClicks(button);
});
function handleButtonClicks(buttonId) {
  alert(`Clicked ${buttonId}`);
};

document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const messageDiv = document.getElementById('message');
            submitBtn.disabled = true;
            submitBtn.innerText = "Checking Calendar...";
            messageDiv.className = "";
            messageDiv.innerText = "";
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                packages: document.getElementById('options').value
            };
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbxut9y8QlTKj_8_g3rsoNvGb74cjy-lH02n72XEjyYS0Sc8n4Q1BrgPMusco2Lle5zI/exec';
            fetch(webAppUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                messageDiv.innerText = result.message;
                messageDiv.className = result.status === 'success' ? 'success' : 'error';
                
                if(result.status === 'success') {
                    document.getElementById('bookingForm').reset();
                }
            })
            .catch(error => {
                messageDiv.innerText = "An error occurred. Please reload using the clockwise arrow.";
                messageDiv.className = 'error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Check Availability & Book";
                appointments[document.getElementById('name')] = true;
            });
        });

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
        if (isValid) {
            window.alert(`Sucessfully signed in as ${document.getElementById('email')}!`);
            successMessage.textContent = `Welcome, ${usernameVal}! Login successful.`;
            successMessage.style.display = "block";
            loginForm.reset();
        }
    });
});
