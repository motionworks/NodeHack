/**
 * socket.io.workshop.js
 */

(function() {
    var socket = null;

    getNickname(function(nickname) {
        socket  = io.connect('http://localhost:1337');
        shout   = shout.bind(socket);

        // we're connected, setup the socket
        socket.on('connect', function onConnect() {
            // send the nickname
            socket.emit('nickname', nickname);

            // when the connection is ready
            socket.on('ready', function onReady(messages) {
                // shout each historical message - if any
                messages.forEach(shout);

                // setup the message submission events
                $('#send')
                    .bind('click', { nickname : nickname }, submit);

                $('#message')
                    .bind('keypress', { nickname : nickname }, submit)
                     .focus();
                
                // shout a message once received
                socket.on('message', shout);
            });
        });
    });

    // get a nickname
    function getNickname(callback) {
        var nickname;
        
        do {
            // loop until we get a nickname
            nickname = prompt('What is your name?');
        } while ( 'string' !== typeof nickname || !nickname.length );
        
        callback(nickname);
    }

    // submit a message
    function submit(e) {
        var code        = (e.keyCode ? e.keyCode : e.which),
            msgbox      = $('#message'),
            message     = msgbox.val();

        if ('keypress' === e.type && 13 !== code) {
            // it's a keypress and it's not an enter
            return;
        }

        if (message.length) {
            // shout it out!
            shout({
                from    : e.data['nickname'],
                message : message
            });

            // send out the message
            socket.send(message);

            msgbox.val('').focus();
        }
    }

    // print out a message
    function shout(data) {
        var from    = data.from,
            message = data.message;

        $('#messages').append('<div>' + from + ': ' + message + '</div>');
    }
})();
