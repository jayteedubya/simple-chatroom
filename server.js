const express = require('express');
const app = express();
const ws = require('ws');
const server = require('http').createServer(app);
const randomWords = require('random-words');
const session = require('cookie-session')


const handles = [];
const getNewHandle = () => {
    const handle = randomWords({wordsPerString: 2, exactly: 1, formatter: (word)=> word.toUpperCase(), separator: '_'});
    if (handles.includes(handle)) {
        return getNewHandle();
    }
    handles.push(handle);
    return handle;
}
const PORT = 3000 || process.env.PORT
const clients = []

const chatSocket = new ws.Server({server, clientTracking: false});

chatSocket.on('connection', (socket, req) => {
    clients.push(socket);
    console.log("connection established")
    socket.on('message', (message) => {
        clients.forEach(client => client.send(message));
    })
})

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
})
app.get('/handle', (req, res, next) => {
    const handle = getNewHandle()[0];
    res.json({ handle });
})

app.use('/styles', express.static(__dirname + "/styles"));

server.listen(PORT, () => console.log('websocket listening on port ' + PORT));