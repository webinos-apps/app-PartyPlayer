$(document).ready(function(){
    partyplayer.init('host');
    coll = new PartyCollection("testCollection");
});

var coll = null;
var users = {};

partyplayer.main = {};
partyplayer.main.onjoin = function(params, ref,key) {
    uID = coll.addUser(params); //registration on application level
    users[key]=uID; //registration on connection level.
    partyplayer.sendMessage({ns:"main", cmd:"welcome", key:key, params:{userID:uID,users:coll.getUsers()}});
    partyplayer.sendMessage({ns:"main", cmd:"updatePlayer", params:{userID:uID,userAlias:params.name}});
    log('join invoked!');
    getUsers();

    //send available Items to this user
    //items = coll.getItems();
    //for (i=0;i<items.length;i++){
    //	partyplayer.sendMessage({ns:"main", cmd:"
//
//    }

};

partyplayer.main.onleave= function (params, ref,key) {
    log('leave invoked!');
    if (typeof params == 'undefined'){ //registered on protocol level
	if (typeof users[key] != 'undefined'){
                userID = users[key];
		coll.removeUser(userID);
        	coll.removeUserItems(userID);
		partyplayer.sendMessage({ns:"main", cmd:"removePlayer", params:{userID:userID}}); 
	}
    }
    else if (typeof params != 'undefined' && params[userID] != undefined ){ //registered on application level
	userID = params[userID];
	coll.removeUser(userID);
        coll.removeUserItems(userID);
	partyplayer.sendMessage({ns:"main", cmd:"removePlayer", params:{userID:uID}}); 
    } 
    delete users.key; 	
    getUsers();
    getItems();
}

partyplayer.main.onaddItem = function (params, ref, key) {
    log('adding item');
    itemID = coll.addItem(params.userID,params.item);
    if(itemID!=false){
	partyplayer.sendMessage({ns:"main", cmd:"updateItem", params:{userID:uID,itemID:itemID,item:params.item}}); 
    }
    getItems();
}


function getUsers(){
    players = coll.getUsers();
    var str = "";
    var nrUsers =0;
    for (t in players){
        nrUsers+=1;
        str+=players[t].name+",";
    }
    log("Currently "+nrUsers+" Users:"+str)
}

function getItems(){
	itemCount = coll.getItemCount();
	var str = ""; 	
	for (t in itemCount){
		if (t!="TOTAL"){
			str+=coll.getItem(t)+":"+itemCount[t]+";";
		}
		else{
			str+=t+":"+itemCount[t]+";";
		}
	}
	console.log("COLLECTION="+str);
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
