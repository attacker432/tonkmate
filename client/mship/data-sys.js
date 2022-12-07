"use strict";
//let data = import('./database.js') // returns Promise <pending>
import data from "/database.js"
console.log(data)
          
//array for account data
data.accounts.forEach(a => {
console.log(a)
})
//helo
let node = document.createTextNode("test");
function doIt() {
  document.getElementById("test").innerHTML = ""
  function write(string) {
      document.getElementById("test").innerHTML += string
      document.getElementById("test").innerHTML += '</br>'
    }
let element = document.getElementById("test");
write(JSON.stringify(data))
}
// Costikoooo: 
// Felix: 
// Attacker: 
// cws: