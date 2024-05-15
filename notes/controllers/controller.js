const Service = require("../models/model")

async function signup(req, res, credentials) {
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
        if (error.message === 'Username is already taken!') {
            res.writeHead(409, {'Content-Type': 'application/json'})
            res.end(error.message)
        } else {
            res.writeHead(500, {'Content-Type': 'application/json'})
            res.end('Internal server error')
        }
        console.log(error)
    }

}

async function login(req, res, credentials){
    try {
        let username = credentials.username
        let password = credentials.password
        let user = {
            username: username,
            password: password
        }
        await Service.login(username, password)
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end("Login successful!")
    } catch (error) {
        if (error.message === 'Invalid username or password') {
            res.writeHead(401, {'Content-Type': 'application/json'})
            res.end(error.message)
        } else {
            res.writeHead(500, {'Content-Type': 'application/json'})
            res.end('Internal server error')
        }
        console.log(error)
    }
}

module.exports = {
    saveUser: signup, login
}