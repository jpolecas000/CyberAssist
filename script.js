var apointments = {};
let user;
const button = index.html.getElementById("test_Button");
button.addEventListener("click", function() {
  handleButtonClicks(button);
});
function handleButtonClicks(buttonId) {
  alert(`Clicked ${buttonId}`);
};

