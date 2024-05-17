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

async function createNewNote(req, res, content){
    try {
        let text = content.text
        let type = content.type
        let username = content.username
        await Service.saveNote(text, type, username)
        res.writeHead(201, {'Content-Type' : 'application/json'})
        res.end('test')
    } catch (err) {
        if (err.message === 'Invalind note contents!') {
            res.writeHead(422, {'Content-Type' : 'application/json'})
            res.end(err.message)
        } else {
            res.writeHead(500, {'Content-Type' : 'application/json'})
            res.end('Internal server error!')
        }
    }
}

async function loadNotes(req, res, userID) {
    try {
        await Service.loadNotes(userID)
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end('Notes loaded successfully!')
    } catch (err) {
        res.writeHead(500, {'Content-Type' : 'application/json'})
        res.end('Internal server error!')
    }

}

async function deleteNote(username, noteID){
    try {
        await Service.deleteNote(userID, noteID)
    } catch (err) {

    }
}

module.exports = {
    signup, login, createNewNote, loadNotes
}