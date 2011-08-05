/**
 * Module dependencies
 */
var express = require('express'),
    io      = require('socket.io'),
    ejs     = require('ejs');

/**
 * locals
 */
var server      = express.createServer(),
    sockServer  = io.listen(server),

    options     = {
        host : 'localhost',
        port : 1337
    },
    
    messages    = [];

// Express configuration
server.configure(function() {
    server.register('html', ejs);
    server.set('view engine', 'html');
    server.set('views', __dirname + '/view');
    
    server.use(express.cookieParser());
    server.use(express.session({ secret : 'NodeHack 2 rocks!' }));
    server.use(express.static(__dirname + '/public'));
});

// Routing
server.get('/', function(req, res) {
    res.render('index.html');
});

server.get('/about', function(req, res) {
    res.render('about.html');
});

// Socket.IO configuration
sockServer.configure(function socket() {
    sockServer.set('authorization', function(handshake, callback) {
        callback(null, true);
    });
});

sockServer.sockets.on('connection', function onConnect(socket) {
    // set up a nickname
    socket.on('nickname', function onNickname(nickname) {
        socket.set('nickname', nickname, function onResponse() {
            // let the client know they're good to go!
            // send them the message history too
            socket.emit('ready', messages);
        });
    });

    socket.on('message', function onMessage(message) {
        socket.get('nickname', function onResponse(err, nickname) {
            if (err) {
                throw err;
            }

            var data = {
                from    : nickname,
                message : message
            };

            // add a client message to our list
            messages.push(data);

            // broadcast it to everyone else
            socket.broadcast.send(data);
        });
    });

    socket.on('disconnect', function onDisconnect() {
        socket.get('nickname', function onResponse(err, nickname) {
            if (err) {
                throw err;
            }

            sockServer.sockets.send({
                from    : 'SERVER',
                message : nickname + ' has disconnected.'
            });
        });
    });
});

// start listening
server.listen(options.port, options.host, function() {
    var o = this.address();

    console.log('Running on http://%s:%d ...', o.address, o.port);
});
