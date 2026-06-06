document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('test_Button');
    if (button) {
        button.addEventListener('click', () => handleButtonClicks('test_Button'));
    }

    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) {
        return;
    }

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('message');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Checking Calendar...';
        messageDiv.className = '';
        messageDiv.innerText = '';

        const user = JSON.parse(localStorage.getItem('cyberassistUser') || null);
        const data = {
            name: user?.name || document.getElementById('name').value,
            email: user?.email || document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            packages: document.getElementById('options').value
        };

        fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(result => {
                messageDiv.innerText = result.body.message;
                messageDiv.className = result.status === 201 ? 'success' : 'error';

                if (result.status === 201) {
                    bookingForm.reset();
                }
            })
            .catch(error => {
                messageDiv.innerText = 'An error occurred while booking your appointment.';
                messageDiv.className = 'error';
                console.error(error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Check Availability & Book';
            });
    });
});

       
