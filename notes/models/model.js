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

module.exports = {
    saveUser, login
}