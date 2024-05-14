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
        let sql = 'CREATE TABLE test (test int)'
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
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