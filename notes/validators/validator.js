async function validateCredentials(username, password) {
    let validationRegex = /\w{3,}/
    if (validationRegex.test(username) && validationRegex.test(password)) {
        return true
    }
        return false
}

module.exports = {
    validateCredentials
}