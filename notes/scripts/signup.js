let usernameInput = document.getElementById("username-input")
let passwordInput = document.getElementById("password-input")
let signupButton = document.getElementById("signup-button")

function handleClick() {
    var xhr = new XMLHttpRequest();
    var url = "/signup";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
            if (xhr.status === 200) {  // The server responded with a successful status
                console.log('Success:', xhr.responseText);
            } else {
                console.log('Error:', xhr.status, xhr.statusText);
            }
        }

    var data = {
        username: usernameInput.value,
        password: passwordInput.value
    };
    xhr.send(JSON.stringify(data));
}

signupButton.addEventListener("click", handleClick)