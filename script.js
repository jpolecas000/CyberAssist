var appointment = {};
let obj = [{ guy: "Bob", bro: "Bob" }, { guy: "Jon", bro: "Jon" }, { guy: "Tom", bro: "Tom" }];
let randomGuy = obj.find(person => person.guy.startsWith("J"));
alert(JSON.stringify(obj.randomGuy));