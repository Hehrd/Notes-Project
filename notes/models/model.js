const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zaxi681!',
    database: 'notesdb',
    port: '13306'
})

db.connect((err) => {
    if (err) {
        throw err
    }
})
async function saveUser (username, password){
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM users WHERE username='${username}'`
        let query = db.query(sql, (err, results) => {
            if (err) {
                reject(err)
            } else if (results.length > 0) {
                reject(new Error("Username is already taken!"))
            } else {
                sql = `INSERT INTO users (username, password_hash) VALUES ('${username}', '${password}')`
                query = db.query(sql, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results)
                    }
                })
            }

        })

        let newUser = {
            username: username,
            password: password
        }
    })
}

async function login(username, password){
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM users WHERE username='${username}' AND password_hash='${password}'`
        let query = db.query(sql, (err, results) => {
            if (err) {
                reject(err)
            } else if (results.length < 1) {
                reject(new Error("Invalid username or password"))
            } else {
                resolve(results)
            }
        })
    })
}

async function saveNote(text, type, username){
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO notes (note_text, note_type, username) VALUES ('${text}', ${type}, '${username}')`
        let query = db.query(sql, (err, results) => {
            if (err) {
                reject(err)
            } else if (type === 1) {
                console.log(JSON.stringify(results))
                resolve(results.insertId)
            } else if (type === 2) {
                console.log(JSON.stringify(results))
                resolve(results.insertId)
            } else if (type === 3) {
                console.log(JSON.stringify(results))
                resolve(results.insertId)
            } else if(type != 1 && type != 2 && type != 3){
                reject(new Error('Invalid note contents!'))
            }
        })
    })
}

async function loadNotes(username) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM notes WHERE username='${username}'`
        let query = db.query(sql, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

async function updateNote(text, type, noteID, username) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM notes WHERE noteID='${noteID}' AND username='${username}'`
        let query = db.query(sql, (err, results) => {
            if (err) {
                reject(err)
            } else if (results.length < 1) {
                reject(new Error("Note doesn't exist!"))
            } else {
                sql = `UPDATE notes SET note_text='${text}', note_type=${type} WHERE noteID=${noteID}`
                query = db.query(sql, (err, results) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(noteID)
                    }
                })
            }
        })
    })
}

module.exports = {
    saveUser, login, saveNote, loadNotes, updateNote
}