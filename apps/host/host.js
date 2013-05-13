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
 *
 * Authors: Victor Klos, Martin Prins
 */

var pc = null;
var users = {};
var uID; 
var streamURLs={};

partyplayer.main = {};
partyplayer.funnel = {};
partyplayer.files = { services: {}};
partyplayer.player = {};
partyplayer.player.streaming="False";
partyplayer.chat = {};

var bootstrapped = false;

partyplayer.main.onjoin = function(params, ref, from) {
    uID = pc.addUser(params); //registration on application level
    users[from]=uID; //registration on connection level.
    partyplayer.sendMessageTo(from, {ns:"main", cmd:"welcome", params:{userID:uID}});
    pUsers = pc.getUsers();
    
    for (var u in pUsers){
        if(uID != u){
            partyplayer.sendMessageTo(from, {ns:"main", cmd:"updateUser", params:{userID:u,user:pUsers[u]}});      
        }
    }    
    
    partyplayer.sendMessage({ns:"main", cmd:"updateUser", params:{userID:uID,user:pc.getUser(uID)}});
    updateUsers();
    
    //send available Items to this user
    var pItems = pc.getItems();
    for (var i=0; i<pItems.length;i++){
        partyplayer.sendMessageTo(from, {ns:"main", cmd:"updateCollectionItem", params:pItems[i]})
    }

    var fItems = funnel.getFunnelList().getItems();
    for (var item in fItems){
        partyplayer.sendMessageTo(from, {ns:"funnel", cmd:"updateFunnelItem", params:fItems[item]})
    }
    
    // send the currently playing item to the user
    if (nowPlaying) {
        partyplayer.sendMessageTo(from, {ns:"player", cmd:"updateItem", params:{nowPlaying:nowPlaying}}); 
    }

    // Try to bind the file service of the user that is connecting. The file service is needed to be able
    // to transfer the files.
    webinos.discovery.findServices(new ServiceType("http://webinos.org/api/file"), {
        /**
         * When the service is found
         * @param service The service that is found.
         * @private
         */
        onFound: function (service) {
            if (params.serviceAddress === service.serviceAddress) {
                service.bindService({
                    onBind: function () {
                        partyplayer.files.services[uID] = service;
                    }
                });
            }
            
            if (!bootstrapped && service.serviceAddress.substring(0, webinos.session.getPZHId().length) === webinos.session.getPZHId()) {
                // first PZP of this PZ has connected as guest. Adding all content from this PZP
                bootstrapped = true;
                
                // this guest is the host
                pc.getUser(uID).isHost = true;

                service.bindService({
                    onBind: function () {
                        addHostCollection(service, uID);
                    }
                });
            }
        },
        /**
         * When an error occurs.
         * @param error The object describing the error event.
         * @private
         */
        onError: function (error) {
            //alert("Error finding service: " + error.message + " (#" + error.code + ")");
        }
    });
};

partyplayer.main.onleave= function (params, ref, from) {
    //log('leave invoked!');
    var userID;
    
    if (typeof params === 'undefined'){ //registered on protocol level
        if (typeof users[from] !== 'undefined'){
            userID = users[from];
        }
    } else if (typeof params !== 'undefined' && params.userID !== undefined ){ //registered on application level
        userID = params.userID;
    } 
    
    var user = pc.getUser(userID);
    
    if (user && !user.isHost) {
        // the host never leaves
        pc.removeUser(userID);
        pc.removeUserItems(userID);
        partyplayer.sendMessage({ns:"main", cmd:"removeUser", params:{userID:userID}}); 

        // remove the reference to the file service for the user that is leaving
        delete partyplayer.files.services[userID];
    }
    
    delete users.from;
    updateUsers();
    updateItems();
    
};

partyplayer.main.onaddItem = function (params, ref, from) {
    log('adding item');

    // only add an item to the party collection when a user is sharing the file service.
    // otherwise it is impossible to get the item when it should be played.
    if (partyplayer.files.services[params.userID]) {
        itemID = pc.addItem(params.userID, params.item);

        if(itemID!==false){
            partyplayer.sendMessage({ns:"main", cmd:"updateCollectionItem", params:{ userID: params.userID,itemID: itemID,item: params.item }}); 
            updateItems();
        }
    }
};

partyplayer.funnel.onaddItem = function(params, ref, from) {
    log("got a new item for the funnel");   
    
    if (bootstrapped) { // the party host must enable the party by visiting as guest on one of his devices
        funnelItemID = funnel.addItem(params.itemID, params.userID);
        partyplayer.sendMessage({"ns":"funnel",cmd:"updateFunnelItem", params:{userID:params.userID,funnelItemID:funnelItemID,itemID:params.itemID,votes:1}});

        var item = pc.getItem(params.itemID);
        var service = partyplayer.files.services[item.userID];
        
        var filename;
        var type = 'audio/mpeg';
        
        if ($.browser.mozilla) {
            // on firefox use .ogg if available
            filename = item.item.filename + '.ogg';
            type = 'application/ogg';
        } else {
            // otherwise use mp3 (which is the default)
            filename = item.item.filename;
        }

        if (service) {
    		service.requestFileSystem(1, 1024, function (fileSystem) {
    		    fileSystem.root.getFile('/partyplayer/collection/' + filename, null, function(entry) {
        		    entry.file(function (blob) {
                        item.item.blob = blob.slice(0, blob.size, type);
                        item.item.bumped = true;
                        funnel.bump();
                    });
    		    }, function (error) {
        			//alert("Error getting file (#" + error.code + ")");
    		    });
    		}, function (error) {
    			//alert("Error requesting filesystem (#" + error.code + ")");
    		});
        }
    }
}

partyplayer.funnel.onvote = function (params, ref, from) {
    log("got a vote");
    var voteResult = funnel.voteItem(params.funnelItemID, params.userID);
    
    if (voteResult !== -1) {
        partyplayer.sendMessage({ns:"funnel", cmd:"votedFunnelItem", params:{userID:params.userID,funnelItemID:params.funnelItemID,votes:voteResult}});
    }
}

//@TODO: create callback from visual.js to this function 
partyplayer.funnel.removeFunnelItem = function (funnelItemID) {
    partyplayer.sendMessage({ns:"funnel", cmd:"removeFunnelItem", params:{funnelItemID:funnelItemID}});
};

var nowPlaying;

partyplayer.player.updateItem = function (itemID, duration) {
    log("updating item");
    
    nowPlaying = {
        itemID: itemID,
        duration: duration
    };
    
    partyplayer.sendMessage({ns:"player", cmd:"updateItem", params:{nowPlaying:nowPlaying}}); 
}


partyplayer.player.startScreencast = function (params) {
    log("starting screencast");
    $('#scStatus').attr('fill', 'Green');
    partyplayer.player.streaming="True";
    
    for (channel in params){
		if (params[channel].name == "audio/mp3"){
			streamURLs["mp3"]=params[channel].stream;
		}
		if (params[channel].name == "audio/ogg"){
			streamURLs["oga"]=params[channel].stream;
		}
	}
    partyplayer.sendMessage({ns:"player", cmd:"streamUpdate", params:{enabled:"True", streams:streamURLs}}); 
}

partyplayer.player.stopScreencast = function () {
    //log("starting screencast");
    $('#scStatus').attr('fill', 'Red');
    partyplayer.player.streaming="False";
    partyplayer.sendMessage({ns:"player", cmd:"streamUpdate", params:{enabled:"False"}}); 
}

partyplayer.chat.onnewChatMessage = function(params) {
    partyplayer.sendMessage({ns: "chat", cmd:"chatReceived", params:{user: params.user, message: params.message}});
}


function updateUsers(){
    players = pc.getUsers();
    var str = "";
    var nrUsers =0;
    for (var t in players) {
        nrUsers+=1;
        str+=players[t].alias+",";
    }
    log("Currently "+nrUsers+" User(s):"+str);
}

function updateItems(){
    itemCount = pc.getItemCount();
    log(itemCount)
    var str = "";     
    for (t in itemCount){
        if (t!="TOTAL"){
            str+=pc.getUser(t).alias+":"+itemCount[t]+";";
        }
        else{
            str+=t+":"+itemCount[t]+";";
        }
    }
    console.log("COLLECTION="+str);
}

function addHostCollection(fileService, uID) {
    fileService.requestFileSystem(1, 1024, function (fileSystem) {
        fileSystem.root.getFile('/partyplayer/collection/index.json', null, function(entry) {
             entry.file(function (blob) {
                var reader = new FileReader();
                
                reader.onloadend = function() {
                    var items = JSON.parse(reader.result);
                    
                    for (var i in items) {
                        items[i].version = 1;
                        var itemID = pc.addItem(uID, items[i]);

                        if(itemID){
                            partyplayer.sendMessage({ns:"main", cmd:"updateCollectionItem", params:{ userID: uID, itemID: itemID, item: items[i] }}); 
                            updateItems();
                        }                        
                    }
                }
                
                reader.readAsText(blob);
            });
        }, function (error) {
        });
    }, function (error) {
    });
}

function logRandom(){
    var item = pc.getRandom();
    if (item != 'false'){
        log(item);
    }
}

    //////////// protocol implementation from here ////////////

    /*
    @startuml protocol_join.png
        hide footbox
        participant "g:PartyGuestApp" as guest
        participant PartyHostApp as host
        group A guest initialises
            guest -> host : join(alias)
            host -> guest : welcome(userID,users)
            note right : From now on all messages\nto the host include userID
            loop over collection
                host -> guest : updateCollectionItem(userID,itemID, item)
            end
        end
    @enduml
    */


    /* 
    @startuml protocol_share.png
        hide footbox
        participant "g:PartyGuestApp" as guest
        participant PartyHostApp as host
        group A guest shares media
            guest -> host : shareItem(userID,_Item)
            host -> guest : updateCollectionItem(userID,itemID, item)
        end
    @enduml
    */

      /* 
    @startuml protocol_leave.png
        hide footbox
        participant "g:PartyGuestApp" as guest
        participant PartyHostApp as host
        group A guest shares media
            guest -> host : leave(userID)
            host -> guest : removePlayer(userID)
            note right: a userID may not be provided
        end
    @enduml
    */

$(document).ready(function(){
    if ($('.flexslider').flexslider) {
        $('.flexslider').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: true,
            slideshow: true,
            slideshowSpeed: 5000,
            animationSpeed: 600,
            randomize: true,
            directionNav: false        
        });
    }
    
    webinos.session.addListener('registeredBrowser', function () {
        partyplayer.init('host', function(connected) {
            if (connected) {
                pc = new PartyCollection("Webinos Party");
                player.init();
                funnel.init(5);    
            }
        });
    });
});


var previousWindowBeforeUnload = window.onbeforeunload;

window.onbeforeunload = function() { 
    partyplayer.close();
    
    if (previousWindowBeforeUnload) {
        previousWindowBeforeUnload();
    }
};
