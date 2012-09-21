/**
 * a2a-stub.js
 *
 * Include this file in your html page and enjoy a stubbed version
 * of http://dev.webinos.org/specifications/new/app2app.html
 *
 * Author: Victor Klos
 */

// From the docs:
//    // create channel and ask user to accept connections
//    var channel = webinos.app2app.createChannel(
//        "urn:webinos:org:example", { channelOwner: "exampleApp", mode: "send-receive" },
//        requestHandler(request) {
//            return confirm("Accept connect request from " + request.source)
//        }
//    );


var webinos = {
    app2app: Object.create({
        searchCB: null,
        messageCB: null,
        ws: null,

        createChannel: function(ns, properties, authCB, msgCB)
        {
            //createCB = callback;
            log('createChannel invoked with ' + authCB.name);
            ws.send(JSON.stringify({type:'command', action:'create', namespace: ns}));
            messageCB = msgCB;
            return { send: function(message) {
                log('sending message ' + message);
                ws.send(JSON.stringify({type:'message', payload: message}));
            }};
        },

        searchForChannels: function(ns, zoneIDs, successCB, errorCB)
        {
            if (ws !== null) {
                ws.send(JSON.stringify({type:'command', action:'search'}));
            }
            searchCB = successCB;
        },

        init: function(wsURI)
        {
            if (window.websocket !== 'undefined')
            {
                ws = new WebSocket(wsURI);
                ws.onopen = function()
                {
                    log('websocket open, connected to a2a stub server');
                };
                ws.onmessage = function (evt) 
                { 
                    log('received [' + evt.data + ']');
                    var msg = JSON.parse(evt.data);

                    switch (msg.type) {
                    case 'message':
                        if (typeof messageCB === 'function') {
                            (messageCB)(JSON.parse(msg.payload));
                        }
                        break;
                    default:
                        log('Don\'t know what to do with [' + evt.data + ']');
                        break;
                    }
                };
                ws.onclose = function()
                { 
                    log('Connection closed...'); 
                };
                log('webinos.app2app stub succesfully initialised');
            } else {
                log('Your browser does not support websockets!!!');
            }
        },
    }),
};


