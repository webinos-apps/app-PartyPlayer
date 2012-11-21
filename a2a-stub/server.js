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
var host = null, hostKey = null;

wss.on('request', function(wsRequest) {
    var client = wsRequest.key;

    // Accept all incoming connection requests, but separate host and guest
    var wsConnection = wsRequest.accept(null, wsRequest.origin);

    logger.info('Connection request from ' + wsRequest.socket.remoteAddress + ':' + wsRequest.socket.remotePort + ' having key ' + client);

    var request_actions = {
        'guest': function() {
            clients[client] = wsConnection;
            clients.size++;
            logger.trace(client + ' connected, #clients now ' + clients.size);
        },
        'host': function() {
            if (hostKey) {
                logger.info('Replacing host ' + client);
                host.close();
            }
            hostKey = client;
            host = wsConnection;
        },
    };

    var role = wsRequest.resourceURL.pathname.split('/')[1];
    if (role in request_actions) {
        logger.info('New connection request as ' + role + ' from ' + client);
        request_actions[role]();
    } else {
        logger.warn('Connection request with unknown role ' + role + ' from ' + client);
    }

    var message_actions = {
        // Commands is what can be sent to the a2a stub server itself
        'command': function(o) {
            logger.trace('Handling msg with type=' + o.type + ' and action=' + o.action);
            switch(o.action) {
            case 'reset':
                for (var c in clients) {
                    if (c === 'size') continue; // ours, hence enumerable
                    logger.trace('Closing connection to ' + c);
                    clients[c].close();
                }
                clients = {};
                break;
            default:
                logger.warn('Ignoring ' + o.type + ' message with unknown action ' + o.action);
            }
        },
        // All other traffic is called message and is to be forwarded
        'message': function(o) {
            if (client in clients) {
                // from client so send to host
                logger.trace('Forwarding message from client ' + c + ' to host');
                host.send(JSON.stringify(o));
            } else {
                // from host, send to clients
                for (var c in clients) {
                    if (c === 'size') continue; // ours, hence enumerable
                    logger.trace('Forwarding message from host to ' + c);
                    clients[c].send(JSON.stringify(o));
                }
            }
        },
    };

    // Handle incoming messages
    wsConnection.on('message', function(m) {
        logger.trace(client + ' sent [' + m.utf8Data + ']');
        var mo = JSON.parse(m.utf8Data);

        if (mo.type in message_actions) {
            message_actions[mo.type](mo);
        } else {
            logger.warn('Message with unknown type ' + mo.type);
        }

    });

    // Handle leaving clients
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

