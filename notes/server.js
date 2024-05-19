const http = require('http')
const fs = require('fs')
const mysql = require('mysql2')
const path = require('path');
const PORT= process.env.PORT ||  6969

const {signup, login, createNewNote, updateNote, loadNotes, deleteNote} = require("./controllers/controller")
const deleteNoteRegex = /\/deletenote\/(\w+)\/(\d+)/


const server = http.createServer((req, res) => {
    let filePath =  '.' + req.url
    let sql
    let changePage = 'change'
    if (req.url === '/signup' && req.method === 'GET') {
        filePath = "./templates/signup.html"
    } else if (req.url === '/login' && req.method === 'GET') {
        filePath = "./templates/login.html"
    } else if (req.url === '/homepage' && req.method === 'GET') {
        filePath = './templates/homepage.html'
    } else if (req.url === '/signup' && req.method === 'POST') {
        changePage = ''
        let body = ''
        req.on('data', (chunk) => {
            console.log(`Received chunk: ${chunk}`);
            body += chunk.toString()
        })
        req.on('end', () => {
            let parsedData = JSON.parse(body)
            if (parsedData.username !== '' || parsedData.password !== ''){
                signup(req, res, parsedData)
            }
        })
    } else if (req.url === '/login' && req.method === 'POST') {
        changePage = ''
        let body = ''
        req.on('data', (chunk) => {
            console.log(`Received chunk: ${chunk}`);
            body += chunk.toString()
        })
        req.on('end', () => {
            let parsedData = JSON.parse(body)
                login(req, res, parsedData)
        })
    } else if (req.url === '/createnote' && req.method === 'POST') {
        changePage = ''
        let body = ''
        req.on('data', (chunk) => {
            console.log(`Received chunk: ${chunk}`);
            body += chunk.toString()
        })
        req.on('end', () => {
            let parsedData = JSON.parse(body)
            createNewNote(req, res, parsedData)
        })
    } else if (req.url === '/updatenote' && req.method === 'PATCH') {
        changePage = ''
        let body = ''
        req.on('data', (chunk) => {
            console.log(`Received chunk: ${chunk}`);
            body += chunk.toString()
        })
        req.on('end', () => {
            let parsedData = JSON.parse(body)
            updateNote(req, res, parsedData)
        })
    } else if (req.url === '/loadnotes' && req.method === 'POST') {
        changePage = ''
        let body = ''
        req.on('data', (chunk) => {
            console.log(`Received chunk: ${chunk}`);
            body += chunk.toString()
        })
        req.on('end', () => {
            let parsedData = JSON.parse(body)
            loadNotes(req, res, parsedData)
        })
    } else if (deleteNoteRegex.test(req.url) && req.method === 'DELETE') {
        changePage = ''
        let noteData = {
            username: req.url.match(deleteNoteRegex)[1],
            noteID: req.url.match(deleteNoteRegex)[2]
        }
        deleteNote(req, res, noteData)
    }
    // if (filePath === './') {
    //     filePath = './templates/index.html'; // Homepage
    // }
    if (changePage == 'change') {
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            // Add more content types as needed
        }
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if(error.code == 'ENOENT') {
                    res.writeHead(404);
                    res.end('Not Found');
                } else {
                    res.writeHead(500);
                    res.end('Internal Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        })
    }

})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))