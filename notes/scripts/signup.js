const usernameInput = document.getElementById("username-input")
const passwordInput = document.getElementById("password-input")
const signupButton = document.getElementById("signup-button")
const errorLabel = document.getElementById('error-label')

function handleClick() {
    var xhr = new XMLHttpRequest();
    var url = "/signup";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 201) {  // The server responded with a successful status
            sessionStorage.setItem('notes_sessionID', xhr.responseText)
            sessionStorage.setItem('notes_username', `${usernameInput.value}`)
            sessionStorage.setItem('newNoteID', '0')
            console.log('Success:', xhr.responseText);
            window.location.href = '/homepage'
        } else if (xhr.status === 409){
            console.log('Error:', xhr.status, xhr.statusText);
            errorLabel.textContent = 'Username is already taken!'
        } else if (xhr.status === 422) {
            console.log('Error:', xhr.status, xhr.statusText);
            errorLabel.textContent = 'Insufficient data!'
        }
    }

    var data = {
        username: usernameInput.value,
        password: passwordInput.value
    };
    if (data.username !== '' && data.username !== '') {
        var jsonData = JSON.stringify(data)
        xhr.send(jsonData);
    } else {
        console.log('Error:', 422, 'Insufficient data!')
        errorLabel.textContent = 'Insufficient data!'
    }
}

signupButton.addEventListener("click", handleClick)