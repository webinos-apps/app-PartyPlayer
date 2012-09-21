#!/usr/bin/env node
/**
 * server.js
 *
 * This server is part of the a2a-stub project and simulates the webinos
 * App2App API implementation. Just include the a2a-stub.js file in your
 * html and you are good to go.
 *
 * For examples, see the test directory and check out the App2App speci-
 * fication at http://dev.webinos.org/specifications/new/app2app.html
 *
 * Author: Victor Klos
 */
var PORT = 10666;

var logger = require('./logger');
logger.info('WELCOME to the a2a-stub server. Have fun!');

var WebSocket = require('websocket') || logger.die('Did you npm install websocket?');
var WebSocketServer = WebSocket.server || logger.die('creating websocket server');

var http = require('http');
var server = http.createServer(function(request, response) {
    logger.trace('Received request for ' + request.url);
    response.writeHead(404);
    response.end();
}) || logger.die('Could not create web server');

server.listen(PORT, function() {
    logger.info('Server is listening on port ' + PORT);
});
var wss = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
}) || logger.die('Could not create websocket server');

logger.info('WebSocket server created, is accepting ALL requests');

var clients = {};
clients.size = 0;

wss.on('request', function(wsRequest) {
    // Accept all incoming connection requests
    var client = wsRequest.socket.remoteAddress + ':' + wsRequest.socket.remotePort;
    var wsConnection = wsRequest.accept(null, wsRequest.origin);

    // Add new client to administration
    clients[client] = wsConnection;
    clients.size++;
    logger.info(client + ' connected, #clients now ' + clients.size);

    // Handle incoming messages
    wsConnection.on('message', function(m) {
        logger.trace(client + ' sent [' + m.utf8Data + ']');
        var mo = JSON.parse(m.utf8Data);
        switch(mo.type) {
            case 'command': // stuff clients want us to do
                logger.trace('Command issued, ' + mo.action + ' requested');
                switch(mo.action) {
                    case 'search':
                        wsConnection.send(
                            JSON.stringify({type:'searchresult', namespace: 'name your space'}));
                        break;
                    case 'create':
                        break;
                }
                
                break;
            case 'message': // stuff to send to others
                for (var c in clients) {
                    if (c === 'size') continue; // ours, hence enumerable
                    if (c === client) continue; // don't forward to self
                    logger.trace('Forwarding message from ' + client + ' to ' + c);
                    clients[c].send(m.utf8Data);
                }
                break;
            default:
                logger.warn('Unknown message type!');
                break;
        }

    });

    // Remove the client from the administration
    wsConnection.on('close', function(reasonCode, reasonString) {
        var peer = wsConnection.socket._peername.address + ':' + wsConnection.socket._peername.port;
        logger.trace('Connection closed by ' + peer);
        var client = clients[peer];
        if (client !== null) {
            delete clients.peer;
            clients.size--;
            logger.info(peer + ' has left the building, #clients now ' + clients.size);
        } else {
            logger.warn('Somebody left, but I don\'t know who: ' + peer);
        }
    });
});

