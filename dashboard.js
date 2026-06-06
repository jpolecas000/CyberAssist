document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('cyberassistUser'));

    if (!user || !user.email) {
        window.location.href = 'loginPage.html';
        return;
    }

    const greeting = document.getElementById('greeting');
    const appointmentMessage = document.getElementById('appointmentMessage');
    const appointmentDetails = document.getElementById('appointmentDetails');
    const apptName = document.getElementById('apptName');
    const apptEmail = document.getElementById('apptEmail');
    const apptDate = document.getElementById('apptDate');
    const apptTime = document.getElementById('apptTime');
    const apptPackage = document.getElementById('apptPackage');
    const logoutBtn = document.getElementById('logoutBtn');

    greeting.textContent = `Welcome back, ${user.name}!`;

    fetch(`/api/appointments/next?email=${encodeURIComponent(user.email)}`)
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(result => {
            if (result.status === 200 && result.body.success) {
                const appt = result.body.appointment;
                appointmentMessage.textContent = 'Here is your next upcoming appointment.';
                appointmentDetails.style.display = 'block';
                apptName.textContent = appt.name;
                apptEmail.textContent = appt.email;
                apptDate.textContent = appt.date;
                apptTime.textContent = appt.time;
                apptPackage.textContent = appt.packages;
            } else {
                appointmentMessage.textContent = 'You do not have any upcoming appointments yet.';
                appointmentDetails.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Failed to load next appointment:', error);
            appointmentMessage.textContent = 'Could not load appointment details right now.';
            appointmentDetails.style.display = 'none';
        });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('cyberassistUser');
        window.location.href = 'loginPage.html';
    });
});
