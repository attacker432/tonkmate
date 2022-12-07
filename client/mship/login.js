// we'll do it.

let name = '';
let password = '';
function test(){
name = document.getElementById('NameInput').value; // get the username provided inside the login page
password = document.getElementById('passInput').value; // get the password provided inside the login page
document.getElementById("result").innerHTML = "";
  
 function write(string) {
      document.getElementById("result").innerHTML += string
      document.getElementById("result").innerHTML += '</br>'
    } // define the function which writes to the result element.

let data = {
  password: password,
  username: name
};

fetch("https://tonkmate.glitch.me/login", { // the main part: the https request to the server.
  method: 'POST',
  body: JSON.stringify(data), // convert it into json
   headers: {
    'Content-Type': 'application/json'
  }
  }).then(res => {
  console.log("Request complete! response:", res);
});
};
// by the way can we merge login + register(.js) together?