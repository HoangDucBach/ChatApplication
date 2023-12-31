// #!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('chatapplication:server');
const message = require('../public/js/message');
const {addMessageToView} = require("../public/js/message");
const user = require('../user/User');
const room = require('../user/Room');
const cors = require('cors');
app.use(cors());
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Create HTTP server.
 */

const server = require('http').Server(app);
const io = require('socket.io')(server);
/**
 * Socket IO.
 */

io.on('connection', async (socket) => {
    socket.user = {
        userName: 'anonymous',
        color: '#000000',

    }
    let id = socket.id;
    let userName = socket.user.userName;
    console.log('a user connected ' + socket.id);
    socket.on('chat-message', async (message, color) => {
        io.emit('chat-message', {userName: socket.user.userName, color: socket.user.color, message: message});
        room.history.push({userName: socket.user.userName, color: socket.user.color, message: message});
    });
    socket.on('user-name', (userName, color) => {
        socket.user.userName = userName;
        socket.user.color = color || '#000000';
        if (!room.userList.has(userName)) {
            room.userList.set(userName, color);
            io.emit('new-user', userName, room.userList.length);
        }
        const map = [];
        room.userList.forEach((val, key) => {
            map.push([key, val]);
        });
        io.emit('load-history', room.history, map);
        io.emit('user-join', socket.user.userName);
    });

    socket.on('disconnect', () => {
        userName = socket.user.userName;
        const map = [];
        room.userList.delete(userName);
        room.userList.forEach((val, key) => {
            map.push([key, val]);
        });
        io.emit('user-leave', userName, id, map);
        console.log(id + " has left");
    });
    socket.on('check-name', userName => {
        if (!room.userList.has(userName)) {
            io.emit('check-username', true);
        } else {
            io.emit('handle-username', false);
        }
    });
});
/**
 * Sever.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports.io = io;
