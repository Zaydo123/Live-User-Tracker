const socketIO = require('socket.io');
const express = require('express');
const uuid4 = require('uuid4');
const http = require('http');
const app = express();
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
const io = socketIO(server);
const Session = require('./Session.js');
const Sessions = require('./Sessions.js');

let activeSessions = new Sessions();

const socketURL = 'http://localhost:3001';

const html = `
    <html>
    <head>
    <title> Analytics </title>
    </head>
    <body>
    <h4 id='cookie'>---Cookie---</h4>

    <h1> Analytics </h1>
    <h2> This should not be visible </h2>

    <script src="/socket.io.js"></script>

    <script> 
        const socket = io();
        //every 1 seconds, send a message to the server with contents of the cookies and the current url
        function sendMessage(){
            socket.emit('message', document.getElementById('cookie').innerText + ' ' + window.location.href);
        } 
        console.log("REFFERER");    
        console.log(document.referrer);

        sendMessage();
        setInterval(() => {
            sendMessage(); 
        }, 10000);

    </script>


    </body>

    </html>

`;

formatHTML = (html,cookie) => {
    return html.replace('---Cookie---', cookie);
}

let whiteListedDomains = ['http://localhost:3000', 'http://localhost:3001', 'https://physics-central.com'];
let userCount = 0;

app.use('/', express.static(__dirname + '/'));
app.use(cookieParser());

app.get ('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/queryByIP/:ip', (req, res) => {
    if(req.params.ip.length){
        let sessions = activeSessions.getSessionsByIP(req.params.ip);
        res.send(sessions);
    } else{
        res.send('No IP provided');
    }
});

app.get('/fetchAll', (req, res) => {
    res.send(activeSessions.getSessions());
});

app.get('/countRoutes', (req, res) => {
    res.send(activeSessions.countRoutes());
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});


app.get('/queryByRouteEmbedded/*', (req, res) => {
    //turn * into a string
    let routeEmbedded = '';
    if(req.params[0]){
        routeEmbedded = req.params[0];
        res.send(activeSessions.getSessionsByURL(routeEmbedded));

    }

});



app.get('/io/*', (req, res) => {
    if(req.params[0] === 'favicon.ico'){
        res.sendFile(__dirname + '/favicon.ico');
        return;
    }
    function sendNewCookie(){
        let sessionId = uuid4();
        res.cookie('sessionId', sessionId, {maxAge: 60*60*1000, httpOnly: true}).send(formatHTML(html, sessionId));
        let session = new Session(sessionId, req.originalUrl, req.ip, Date.now());
        activeSessions.addSession(session);
    }

    sendNewCookie();
});

io.on('connection', (socket) => {
    //get ip 
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    socket.on('message', (message) => {
        socket.sessionID = message.split(' ')[0];
        verify = uuid4.valid(socket.sessionID);

        if(activeSessions.getSession(socket.sessionID) == null){
            activeSessions.addSession( new Session(socket.sessionID,message.split(' ')[1],ip,Date.now()));
        }

        if(verify){
            let session = activeSessions.getSession(socket.sessionID);
            if(session !== undefined){
                session.updateLastActive();
            }
            

        }
    });
    socket.on('disconnect', () => {
        if(activeSessions.getSession(socket.sessionID) !== undefined){
            //console.log(activeSessions.getSessions().length)
            //console.log(activeSessions.getSession(socket.sessionID).calculateTotalTime());
        }
        activeSessions.removeSession(socket.sessionID);

    });
    }
);


setInterval(function(){
   activeSessions.pruneSessions();
}, 5000)


server.listen(3001, () => {
    console.log('listening on *:3001');
  });