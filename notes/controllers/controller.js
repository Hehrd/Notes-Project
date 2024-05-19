const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zaxi681!',
    database: 'notesdb',
    port: '13306'
})
const Service = require("../models/model")
const {validateCredentials} = require('../validators/validator')

async function signup(req, res, credentials) {
    try {
        let username = credentials.username
        let password = credentials.password
        let validation = await validateCredentials(username, password)
        if (validation === true) {
            await Service.saveUser(username, password)
            let sessionID = createSessionID()
            res.writeHead(201, {'Content-Type': 'application/json'})
            res.end(String(sessionID))
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
        let sessionID = createSessionID()
        let validation = await validateCredentials(username, password)
        if (validation === true) {
            await Service.login(username, password)
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(String(sessionID))
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
        handleSessionID(req.headers['sessionid'])
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
        } else if (err.message === 'Session expired!') {
            res.writeHead(440, {'Content-Type' : 'application/json'})
            res.end(err.message)
        } else {
            res.writeHead(500, {'Content-Type' : 'application/json'})
            res.end('Internal server error!')
        }
    }
}

async function loadNotes(req, res, username) {
    try {
        handleSessionID(req.headers['sessionid'])
        let loadedNotes = await Service.loadNotes(username)
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end(JSON.stringify(loadedNotes))
    } catch (err) {
        if (err.message === 'Session expired!') {
            res.writeHead(440, {'Content-Type' : 'application/json'})
            res.end(err.message)
        } else {
            res.writeHead(500, {'Content-Type' : 'application/json'})
            res.end('Internal server error!')
        }
    }

}

async function deleteNote(req, res, noteData){
    try {
        handleSessionID(req.headers['sessionid'])
        let username = noteData.username
        let noteID = noteData.noteID
        await Service.deleteNote(username, Number(noteID))
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end('Note successfully deleted!')
    } catch (err) {
        if (err.message === 'Session expired!') {
            res.writeHead(440, {'Content-Type' : 'application/json'})
            res.end(err.message)
        } else {
            res.writeHead(500, {'Content-Type' : 'application/json'})
            res.end('Internal server error!')
        }

    }
}

async function updateNote(req, res, contents){
    try {
        handleSessionID(req.headers['sessionid'])
        let text = contents.text
        let type = JSON.parse(contents.type)
        let noteID = JSON.parse(contents.noteID)
        let username = contents.username
        await Service.updateNote(text, type, noteID, username)
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end('Note successfully updated!')
    } catch (err) {
        if (err.message === 'Session expired!') {
            res.writeHead(440, {'Content-Type' : 'application/json'})
            res.end(err.message)
        } else if (err.message === "Note doesn't exist!") {
            res.writeHead(404, {'Content-Type' : 'application/json'})
            res.end(err.message)
        } else {
            res.writeHead(500, {'Content-Type' : 'application/json'})
            res.end('Internal server error!')
        }
    }
}

function createSessionID() {
    let sessionID = crypto.randomUUID();
    let toMilliseconds = (hrs,min,sec) => (hrs*60*60+min*60+sec)*1000;
    let time = Date.now() + toMilliseconds(0, 10, 0)
    let sql = `INSERT INTO sessions (sessionID, time) VALUES ('${sessionID}', ${time})`
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        }
    })
    return sessionID
}

function handleSessionID(sessionID) {
    let time = Date.now()
    let sql = `SELECT * FROM sessions WHERE sessionID='${sessionID}'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err)
            throw err
        } else {
            if (results.length > 0) {
                if (results[0].time - time > 0) {
                    let toMilliseconds = (hrs,min,sec) => (hrs*60*60+min*60+sec)*1000;
                    let newTime = Date.now() + toMilliseconds(0, 10, 0)
                    sql = `UPDATE sessions SET time=${newTime} WHERE sessionID='${sessionID}'`
                    query = db.query(sql, (err, results) => {
                        if (err) {
                            console.log(err)
                            throw err
                        } else {
                            console.log('Success!')
                        }
                    })
                } else {
                    console.log("Session expired!")
                    throw new Error('Session expired!')
                }
            } else {
                console.log("Invalid SessionID!")
                throw err
            }
        }
    })
}

module.exports = {
    signup, login, createNewNote, loadNotes, updateNote, deleteNote
}