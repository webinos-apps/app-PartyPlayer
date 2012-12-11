/*
 * Code contributed to the webinos project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * (C) Copyright 2012, TNO
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


