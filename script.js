var appointment = {};
let obj = [{ guy: "Bob", bro: "Bob" }, { guy: "Jon", bro: "Jon" }, { guy: "Tom", bro: "Tom" }];
let randomGuy = obj.find(person => person.guy.startsWith("J"));
alert(JSON.stringify(randomGuy.guy));
const button = index.html.getElementById("test_Button");
 function handleButtonClicks() {
      console.log(click);
    }
button.addEventListener("click", handleButtonClicks);