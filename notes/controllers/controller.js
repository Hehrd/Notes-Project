const Service = require("../models/model")

async function saveUser(req, res, credentials) {
    try {
        let username = credentials.username
        let password = credentials.password
        let user = {
            username: username,
            password: password
        }
        await Service.saveUser(username, password)
        res.writeHead(201, {'Content-Type': 'application/json'})
        res.end("New user created!")
    } catch (error) {
        res.writeHead(409, {'Content-Type': 'application/json'})
        res.end("Username already exists!")
        console.log(error)
    }

}

module.exports = {
    saveUser
}