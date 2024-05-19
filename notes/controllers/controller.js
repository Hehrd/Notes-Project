const Service = require("../models/model")
const {validateCredentials} = require('../validators/validator')

async function signup(req, res, credentials) {
    try {
        let username = credentials.username
        let password = credentials.password
        let validation = await validateCredentials(username, password)
        if (validation === true) {
            await Service.saveUser(username, password)
            res.writeHead(201, {'Content-Type': 'application/json'})
            res.end("New user created!")
        } else {
            res.writeHead(422, {'Content-Type': 'application/json'})
            res.end('Insufficient data!')
        }
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
        let validation = validateCredentials(username, password)
        if (validation === true) {
            await Service.login(username, password)
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end("Login successful!")
        } else {
            res.writeHead(422, {'Content-Type': 'application/json'})
            res.end('Insufficient data!')
        }
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

async function createNewNote(req, res, contents){
    try {
        let text = contents.text
        let type = contents.type
        let username = contents.username
        const noteID = await Service.saveNote(text, type, username)
        res.writeHead(201, {'Content-Type' : 'application/json'})
        res.end(JSON.stringify(noteID))
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

async function loadNotes(req, res, username) {
    try {
        let loadedNotes = await Service.loadNotes(username)
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end(JSON.stringify(loadedNotes))
    } catch (err) {
        res.writeHead(500, {'Content-Type' : 'application/json'})
        res.end('Internal server error!')
    }

}

async function deleteNote(req, res, noteData){
    try {
        let username = noteData.username
        let noteID = noteData.noteID
        await Service.deleteNote(username, Number(noteID))
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end('Note successfully deleted!')
    } catch (err) {
        res.writeHead(500, {'Content-Type' : 'application/json'})
        res.end('Internal server error!')
    }
}

async function updateNote(req, res, contents){
    try {
        let text = contents.text
        let type = JSON.parse(contents.type)
        let noteID = JSON.parse(contents.noteID)
        let username = contents.username
        await Service.updateNote(text, type, noteID, username)
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end('Note successfully updated!')
    } catch (err) {
        if (err.message === "Note doesn't exist!") {
            res.writeHead(404, {'Content-Type' : 'application/json'})
            res.end(err.message)
        } else {
            res.writeHead(500, {'Content-Type' : 'application/json'})
            res.end('Internal server error!')
        }
    }
}

module.exports = {
    signup, login, createNewNote, loadNotes, updateNote, deleteNote
}