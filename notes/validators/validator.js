async function validateCredentials(username, password) {
    return new Promise((resolve, reject) => {
        let validationRegex = /\w{3,}/
        if (validationRegex.test(username) && validationRegex.test(password)) {
            resolve(true)
        }
        resolve(false)
    })
}

module.exports = {
    validateCredentials
}