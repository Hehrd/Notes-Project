const loginButton = document.getElementById('login-button')
const signupButton = document.getElementById('signup-button')

loginButton.addEventListener('click', function (event) {
    window.location.href = '/login'
})
signupButton.addEventListener('click', function (event) {
    window.location.href = '/signup'
})