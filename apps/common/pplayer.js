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

/*
@startuml common_classes.png

class Item {
    String title
    String artist
    String url
}
class AudioItem {
    String album;
    Base64String cover;
}
class VideoItem {
    Base64String thumbnail;
}

Item <|-- AudioItem
Item <|-- VideoItem

@enduml
*/



'use strict';


/**
 * Contains our killer demo app.
 *
 * @namespace partyplayer
 * @author Victor Klos, Martin Prins, Arno Pont, Daryll Rinzema
 */
var partyplayer = partyplayer || {};


/**
 * Constructor for Item, never used directly.
 *
 * @constructor
 * @param title String representing the title of a media item
 * @param artist String representing the artist
 * @param url String representing the URL from which it can be retrieved
 */
partyplayer._Item = function(title, artist, url) {
    this._class = 'base';
    this.title = title;
    this.artist = artist;
    this.url = url;
    this.isVideoItem = function() { return this._class === 'VideoItem'; };
    this.isAudioItem = function() { return this._class === 'AudioItem'; };
};


/**
 * Constructor for AudioItem.
 *
 * @constructor
 * @param title
 * @param artist
 * @param url
 * @param album String with name of album
 * @param cover Base64 representation of album cover
 * @augments partyplayer._Item
 * @example
 *   var a = new AudioItem(
 *       'Nederwiet', 'Doe Maar', 'http://xyz/bh.mp3',
 *       'Skunk', 'BASE64STRINGLIKESO=');
 *
 *   a.isAudioItem();       // true
 *   a.isVideoItem();       // false
 */
partyplayer.AudioItem = function(title, artist, url, album, cover) {
    this._class = 'AudioItem';
    this.title = title;
    this.artist = artist;
    this.url = url;
    this.album = album;
    this.cover = cover;
};
partyplayer.AudioItem.prototype = new partyplayer._Item();


/**
 * Constructor for VideoItem.
 *
 * @constructor
 * @param title
 * @param artist
 * @param url
 * @param thumbnail Base64 representation of a thumbnail or DVD cover
 * @augments partyplayer._Item
 * @example
 *   var v = new VideoItem(
 *       'Poker Face', 'Lady Gaga', 'http://www.youtube.com/watch?v=bESGLojNYSo',
 *       'ANOTHERBASE64STRINGLIKESO=');
 *
 *   v.isAudioItem();       // false
 *   v.isVideoItem();       // true
 */
partyplayer.VideoItem = function(title, artist, url, thumbnail) {
    this._class = 'VideoItem';
    this.title = title;
    this.artist = artist;
    this.url = url;
    this.thumbnail = thumbnail;
};
partyplayer.VideoItem.prototype = new partyplayer._Item();

/*
@startuml common_classes_message.png

class Message {
    String ns 
    String cmd
    String ref
    struct payload	
}

@enduml
*/

/**
 * Constructor for Message
 * @constructor
 * @param ns - the message namespace
 * @param cmd - the function call
 * @param ref - identifier for the call 
 * @param params - the parameters of the function, as as struct
 */
partyplayer.Message = function( namespace, cmd, ref, params )
{
    this.ns = namespace;
    this.ref = ref || undefined; 
    this.cmd = cmd;
    this.params = params;
};


/**
 * Convert JSON-string to partyplayer message
 * @TODO: needs to be tested
 **/
partyplayer.parseMessage = function( msg ) {	
    var ret = null;
	if (msg.version === 1) {
		ret = new partyplayer.Message(msg.type, msg.cmd, msg.payload, 1);
	}
	return ret;	
};

/*
@startuml common_classes_user.png

class User {
    int ID
    string alias
}

@enduml
*/

/**
 * Constructor for User
 * @constructor
 * @param id The userID (unique)
 * @param alias alias of the user
 */
partyplayer.User = function(id, alias)
{
    this.id = id;
    this.alias = alias;
};


/*
@startuml common_classes_funnelItem.png
class FunnelItem {
    string itemID
    int votes
    string userID
}
@enduml
*/

/**
 * Constructor for FunnelItem
 * @constructor
 * @param itemID string the itemID in the collection
 * @param votes int the "votes" of the item
 * @param userID string the userID in the collection
 */
partyplayer.FunnelItem = function(itemID, votes, userID) {
    this.itemID = itemID;
    this.userID = userID;
    this.votes = votes;
};

/**
 * Closes the current connected channel
 */
partyplayer.close = function() {
    if (this.channel) {
        this.channel.disconnect();
        this.channel = undefined;
    }
} 

/**
 * Returns the address of the host.
 */
partyplayer.getHost = function() {
    if (this.channel) {
        return this.channel.creator;
    }
}

/**
 * Initialises the webinos app2app channel and set up the communication protocol
 * @param hostorguest either 'host' or 'guest', relevant for a2a-stub behaveour
 * @param callback gets called when the player is initialized.
 */
partyplayer.init = function(hostorguest, callback) {
    var self = this;
    this.isHost = false;
    this.channel = undefined;
    
    var CHANNEL_NAMESPACE = "urn:nl-tno:partyplayer:host";
    
    // when the party player is initialized by the host
    if (hostorguest === 'host') {
        this.isHost = true;
    }
    
    webinos.discovery.findServices(new ServiceType("http://webinos.org/api/app2app"), {
        /**
         * When the service is found
         * @param service The service that is found.
         * @private
         */
        onFound: function (service) {
            if (self.channel) {
                return;
            }

            service.bindService({
                onBind: function () {
                    connect(service);
                }
            });
        },
        /**
         * When an error occurs.
         * @param error The object describing the error event.
         * @private
         */
        onError: function (error) {
            alert("Error finding service: " + error.message + " (#" + error.code + ")");
        }
    });
    
    /**
     * Connect to app2app channel. When in host mode this function will create a channel and connect to it. When in
     * guest mode the function connects to the host channel.
     * @param app2app The app2app service used for channel interaction.
     * @private
     */
    var connect = function (app2app) {
        if (self.isHost) {
            var properties = {};
        
            // we allow all channel clients to send and receive
            properties.mode = "send-receive";

            var config = {};
            // the namespace is an URN which uniquely defines the channel in the personal zone
            config.namespace = CHANNEL_NAMESPACE;
            config.properties = properties;
            // we can attach application-specific information to the channel
            config.appInfo = {};

            app2app.createChannel(
                    config,
                    // callback invoked when a client want to connect to the channel
                    function(request) {
                        // we allow all clients to connect
                        return true;
                        //return confirm("Do you allow the party guest to connect?");
                    },
                    // callback invoked to receive messages
                    function(message) {
                        console.log("The party host received a message: " + message.contents);
                        handleMessage(message);
                    },
                    // callback invoked on success, with the client's channel proxy as parameter
                    function(channel) {
                        self.channel = channel;
                        callback(true);
                    },
                    function(error) {
                        if (!self.channel) {
                            alert("Could not create channel: " + error.message);
                            callback(false);
                        }
                    }
            );
        } else {
            app2app.searchForChannels(
                    CHANNEL_NAMESPACE,
                    // for now no other zones need to be searched, only its own personal zone
                    [],
                    // callback invoked on each channel found, we expect it to be called at most once
                    // because we did not use a wildcard
                    function(channel) {
                        // we can include application-specific information to the connect request
                        var requestInfo = {};
                        channel.connect(
                            requestInfo,
                            // callback invoked to receive messages, only after successful connect
                            function(message) {
                                console.log("Party guest received message from party host: " + message.contents);
                                handleMessage(message);
                            },
                            // callback invoked when the client is successfully connected (i.e. authorized by the creator)
                            function(success) {
                                // make the proxy available now that we are successfully connected
                                self.channel = channel;
                                callback(true);
                            },
                            function(error) {
                                if (!self.channel) {
                                    alert("Could not connect to channel: " + error.message);
                                    callback(false);
                                }
                            }
                        );
                    },
                    // callback invoked when the search query is accepted for processing
                    function(success) {
                        // ok, but no action needed for now
                    },
                    function(error) {
                        //alert("Could not search for channel: " + error.message);
                    }
            );
        }
    };

    /**
     * Handles a message that is received on the party channel.
     * @private
     * @param payload The payload of the received message
     */
    var handleMessage = function (message) {
        var msg = message.contents;
        var from = message.from;
        
        var func, handler;
        
        // when the message is a party player message
        if (msg.ns in partyplayer) {
            handler = 'on' + msg.cmd;
        
            // select the apriopiate message handle
            if (handler in partyplayer[msg.ns]) {
                var func = partyplayer[msg.ns][handler];

                // call the message handler
                if (typeof func === 'function') {
                    func(msg.params, msg.ref, from);
                } else {
                    log('Raise condition. No function registred for handler.' + msg.ns + '.on' + msg.cmd);
                }
            } else {
                log('Can\'t find handler partyplayer.' + msg.ns + '.on' + msg.cmd);
            }
        } else {
            log('Don\'t known how to handle messages from this namespace.' + msg.ns + '.on' + msg.cmd);
        }
    };    
};

/**
 * Sends a message to the party channel.
 * @param msg The message to send
 */
partyplayer.sendMessage = function(msg) {
    if (this.channel && this.channel.send) {
        this.channel.send(msg);
    } else {
        console.log('No channel present. Not sending messsage <' + msg + '>');
    }
};

/**
 * Sends a message to someone on the party channel.
 * @param to The address where the message is send to
 * @param msg The message to send
 */
partyplayer.sendMessageTo = function(to, msg) {
    if (this.channel && this.channel.sendTo) {
        this.channel.sendTo(to, msg);
    } else {
        console.log('No channel present. Not sending messsage <' + msg + '> to <' + to + '>');
    }
};
