const usernameInput = document.getElementById("username-input")
const passwordInput = document.getElementById("password-input")
const loginButton = document.getElementById("login-button")
const errorLabel = document.getElementById('error-label')
function handleClick() {
    var xhr = new XMLHttpRequest();
    var url = "/login";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {  // The server responded with a successful status
            sessionStorage.setItem('notes_username', `${usernameInput.value}`)
            sessionStorage.setItem('newNoteID', '0')
            console.log('Success:', xhr.responseText);
            window.location.href = '/homepage'
        } else if (xhr.status === 401){
            console.log('Error:', xhr.status, xhr.statusText);
            errorLabel.textContent = 'User not found!'
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
loginButton.addEventListener("click", handleClick)