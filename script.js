var apointments = {};
let user;
const button = index.html.getElementById("test_Button");
button.addEventListener("click", function() {
  handleButtonClicks(button);
});
function handleButtonClicks(buttonId) {
  alert(`Clicked ${buttonId}`);
};

document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page reload
            
            const submitBtn = document.getElementById('submitBtn');
            const messageDiv = document.getElementById('message');
            
            // Disable button and show loading text
            submitBtn.disabled = true;
            submitBtn.innerText = "Checking Calendar...";
            messageDiv.className = "";
            messageDiv.innerText = "";

            // Gather form data
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                packages: document.getElementById('options').value
            };

            // REPLACE THIS URL with your deployed Google Apps Script Web App URL
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbxut9y8QlTKj_8_g3rsoNvGb74cjy-lH02n72XEjyYS0Sc8n4Q1BrgPMusco2Lle5zI/exec';

            // Send data to Google Apps Script
            fetch(webAppUrl, {
                method: 'POST',
                // Using text/plain prevents complex CORS preflight issues with GAS
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                // Handle the response (Success or Conflict)
                messageDiv.innerText = result.message;
                messageDiv.className = result.status === 'success' ? 'success' : 'error';
                
                if(result.status === 'success') {
                    document.getElementById('bookingForm').reset();
                }
            })
            .catch(error => {
                messageDiv.innerText = "An error occurred. Please try again.";
                messageDiv.className = 'error';
            })
            .finally(() => {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerText = "Check Availability & Book";
            });
        });