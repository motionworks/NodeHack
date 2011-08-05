var express = require('express');
var ejs     = require('ejs');

var server = express.createServer();

server.configure(function() {
    server.register('html', ejs);
    server.set('view engine', 'html');
    server.set('views', __dirname + '/view');
    
    server.use(express.cookieParser());
    server.use(express.session({ secret : 'NodeHack 2 rocks!' }));
    server.use(express.static(__dirname + '/public'));
});

server.get('/', function(req, res) {
    res.render('index.html');
});

server.get('/about', function(req, res) {
    res.render('about.html');
});

server.listen(1337);
