let obj = [{ guy: "Bob", bro: "Bob"}, { guy: "Jon", bro: "Jon"}, { guy: "Tom", bro: "Tom"}];
let randomGuy = Math.floor(Math.random() * obj.length());
alert(JSON.stringify(randomGuy));