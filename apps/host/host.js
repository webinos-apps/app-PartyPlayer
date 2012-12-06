
var pc = null;
var users = {};

partyplayer.main = {};
partyplayer.funnel = {};

partyplayer.main.onjoin = function(params, ref, key) {
    uID = pc.addUser(params); //registration on application level
    users[key]=uID; //registration on connection level.
    partyplayer.sendMessage({ns:"main", cmd:"welcome", params:{userID:uID}}, key);
    pUsers = pc.getUsers();
    for (var u in pUsers){
    	log(u);
        if(uID != u){
            partyplayer.sendMessage({ns:"main", cmd:"updateUser", params:{userID:u,user:pUsers[u]}}, key);      
        }
    }    
    partyplayer.sendMessage({ns:"main", cmd:"updateUser", params:{userID:uID,user:pc.getUser(uID)}});
    //log('join invoked!');
    getUsers();
    //send available Items to this user
    pItems = pc.getItems();
    for (var i=0; i<pItems.length;i++){
        partyplayer.sendMessage({ns:"main", cmd:"updateCollectionItem", params:pItems[i]})
    }
    getRandom();
};

partyplayer.main.onleave= function (params, ref, key) {
    //log('leave invoked!');
    if (typeof params === 'undefined'){ //registered on protocol level
        if (typeof users[key] !== 'undefined'){
            userID = users[key];
            pc.removeUser(userID);
            pc.removeUserItems(userID);
            partyplayer.sendMessage({ns:"main", cmd:"removeUser", params:{userID:userID}}); 
        }
    }
    else if (typeof params !== 'undefined' && params[userID] !== undefined ){ //registered on application level
        userID = params[userID];
        pc.removeUser(userID);
        pc.removeUserItems(userID);
        partyplayer.sendMessage({ns:"main", cmd:"removeUser", params:{userID:uID}}); 
    } 
    delete users.key;
    getUsers();
    getItems();
};

partyplayer.main.onaddItem = function (params, ref, key) {
    log('adding item');
    itemID = pc.addItem(params.userID,params.item);
    if(itemID!==false){
        partyplayer.sendMessage({ns:"main", cmd:"updateCollectionItem", params:{userID:params.userID,itemID:itemID,item:params.item}}); 
        getItems();
        getRandom();
    }
   
};


partyplayer.funnel.onaddItem = function( params,ref, key) {
    log("got a new item for the funnel");   
    funnelItemID = funnel.addItem(params.itemID,params.userID);
    partyplayer.sendMessage({"ns":"funnel",cmd:"updateFunnelItem", params:{userID:uID,funnelItemID:funnelItemID,itemID:params.itemID,vote:0}});
}

partyplayer.funnel.onvote = function (params, ref, key) {
    log("got a vote");
    funnel.vote(userID,itemID,funnelItemID,vote);
    //user "pietje" upvoted item in funnelID "blaat"
    partyplayer.sendMessage({ns:"funnel", cmd:"updateFunnelItem", params:{userID:uID,funnelItemID:funnelItemID,vote:voteresult}});
}

//@TODO: create callback from 
partyplayer.funnel.removeFunnelItem = function (funnelItemID) {
    partyplayer.sendMessage({ns:"funnel", cmd:"removeFunnelItem", params:{funnelItemID:funnelItemID}});
};



function getUsers(){
    players = pc.getUsers();
    var str = "";
    var nrUsers =0;
    for (var t in players) {
        nrUsers+=1;
        str+=players[t].alias+",";
    }
    log("Currently "+nrUsers+" Users:"+str);
}

function getItems(){
    itemCount = pc.getItemCount();
    log(itemCount)
    var str = "";     
    for (t in itemCount){
        if (t!="TOTAL"){
            str+=pc.getItem(t)+":"+itemCount[t]+";";
        }
        else{
            str+=t+":"+itemCount[t]+";";
        }
    }
    console.log("COLLECTION="+str);
}


function getRandom(){
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
    partyplayer.init('host');
    pc = new PartyCollection("testCollection");
    funnel.init(500, 5);
	player.init();
    
});
