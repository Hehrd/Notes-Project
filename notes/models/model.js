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
        db.query(sql, (err, result) => {
            if (err) {
                reject(err)
            }
            if (result[0].username == username) {
                reject(err)
            } else {
                sql = `INSERT INTO users (username, password_hash) VALUES ('${username}', '${password}')`
            }
        })

        db.query(sql, (err, result) => {
            if (err) {
                reject(err)
            }
        })

        let newUser = {
            username: username,
            password: password
        }
        resolve(newUser)
    })

}

module.exports = {
    saveUser
}