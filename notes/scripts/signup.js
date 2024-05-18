const usernameInput = document.getElementById("username-input")
const passwordInput = document.getElementById("password-input")
const signupButton = document.getElementById("signup-button")

function handleClick() {
    var xhr = new XMLHttpRequest();
    var url = "/signup";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 201) {  // The server responded with a successful status
            sessionStorage.setItem('notes_username', `${usernameInput.value}`)
            sessionStorage.setItem('newNoteID', '0')
            console.log('Success:', xhr.responseText);
            window.location.href = '/homepage'
        } else {
            console.log('Error:', xhr.status, xhr.statusText);
        }
    }

    var data = {
        username: usernameInput.value,
        password: passwordInput.value
    };
    var jsonData = JSON.stringify(data)
    xhr.send(jsonData);
}

signupButton.addEventListener("click", handleClick)