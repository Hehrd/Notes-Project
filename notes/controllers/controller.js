const Service = require("../models/model")

async function saveUser(req, res, credentials) {
    try {
        let username = credentials.username
        let password = credentials.password
        let user = {
            username: username,
            password: password
        }
        let newUser = Service.saveUser(username, password)
        res.writeHead(201, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(user))
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    saveUser
}