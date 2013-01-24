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
 * Authors: Victor Klos, Martin Prins, Arno Pont
 */

$(document).ready(function(){
    webinos.session.addListener('registeredBrowser', function () {
        partyplayer.init('guest');
        $.mobile.changePage("#profile-select", { transition: "slideup"} );
        selectProfile.init();
    });
});

$('#playlist').live('pageinit', function(event) {
    $('ul#playlist').listview('refresh');
});

$('#guests').live('pageinit', function(event) {
    $('ul#guest-profiles').listview('refresh');
});

$('#collection').live('pageinit', function(event) {
    $('ul#user-collection').listview('refresh');
    $('ul#party-collection').listview('refresh');
});

$(window).unload(function() {
    if (userProfile && userProfile.userID) {
        partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"leave", params:{userID:userProfile.userID}});
    } else {
        partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"leave"});
    }
    partyplayer.close();
});

// size it full screen
$( "#popupPanel" ).on({
    popupbeforeposition: function() {
        var h = $( window ).height();

        $( "#popupPanel" ).css( "height", h );
    }
});

//globals for user
var userProfile = {
	userName:'',
	userPic:'',
	userID:'',
};

var partyPlayerUsers = {};

partyplayer.joinUser = function(name, picture){
    log(name + " is joining...");
	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"join", params:{alias:name,thumbnail:picture}});
};

partyplayer.addItem = function(item){
	log("adding Item");
 	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"addItem", params:{userID:userProfile.userID,item:item}});
};

partyplayer.removeItem = function(itemID){
	log("removing Item");
	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"removeItem", params:{userID:userProfile.userID,itemID:itemID}});
}

partyplayer.addFunnelItem = function(itemID){
	log("adding Item To Funnel");
 	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"funnel", cmd:"addItem", params:{userID:userProfile.userID,itemID:itemID}});
};

partyplayer.voteFunnelItem = function(funnelItemID){
    //@TODO -> TEST
    log("item voted for: " + funnelItemID);
 	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"funnel", cmd:"vote", params:{userID:userProfile.userID,funnelItemID:funnelItemID}});
};

partyplayer.main = {};
partyplayer.funnel = {};
partyplayer.main.onwelcome = function(param, ref) {
    userProfile.userID = param.userID;
    log('onwelcome invoked! userID = '+ userProfile.userID); 
};

partyplayer.main.onupdateUser = function(param, ref) {
    log('onupdateUser Invoked!');
    if(param.userID != userProfile.userID){
		log("Adding "+param.user.alias);
    	//store user in userList
		//@TODO: user updates instead of additions
	    if (! (param.userID in partyPlayerUsers)){
	    	partyPlayerUsers[param.userID]={name:param.user.alias,picture:param.user.thumbnail};
	    	 //update users on screen
		    var newUser = '';
		    newUser += '<li id="' + param.userID + '">'
            newUser += '<img class="ui-li-icon" src="'+param.user.thumbnail+'"/>';
            newUser += '<div>'+param.user.alias+'</div>';
            newUser += '</li>';
		    $('ul#guest-profiles').append(newUser);

            try {
    		    $('ul#guest-profiles').listview('refresh');
            } catch (err) {
                
            }
	    }
    }
};

partyplayer.main.onremoveUser = function(param, ref) {
    log('onremoveUser Invoked!');
    
    delete partyPlayerUsers[param.userID];
    //delete user from screen
    $('#'+param.userID).remove();
    //delete items from collection
    $('table#partyCollection tr[user="'+param.userID+'"]').remove();
    
    try {
	    $('ul#guest-profiles').listview('refresh');
    } catch (err) {
        
    }
};

partyplayer.main.onupdateCollectionItem = function (param, ref) {
    log ('onUpdateItem Invoked; my userID='+userProfile.userID)
	//if (param.userID != userID){
		log (param.userID +" added \""+param.item.artist +" - "+param.item.title + "\" to the collection");
	//}
    //add items to screen

    var profileImage;
    
    currentCollection[param.itemID] = param.item;
    
	if(param.userID == userProfile.userID){
		profileImage = userProfile.userPic;

        // remove the item from the unshared collection
		var li = $('li[item-id*="' + param.item.localRef + '"]');
		li.remove();
		
		try {
            $('ul#user-collection').listview('refresh');
        } catch (err) {

        }
	} else {
		profileImage = partyPlayerUsers[param.userID].picture;
	}

    var trItem = '';
	trItem += '<li class="collection-item" id="' + param.itemID + '"><a href="#">';
    trItem += '<img src="'+param.item.cover+'"/>';
    trItem += '<h3>'+param.item.title+'</h3>';
    trItem += '<p>' + param.item.artist + ' / ' + param.item.album + '</p>';
    if (profileImage) trItem += '<img class="ui-li-icon" src="'+profileImage+'"/>';
	trItem += '</a></li>';

    $('ul#party-collection').append(trItem);
    
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		$('#' + param.itemID).swipeDelete({
		    btnLabel: 'Add',
		    btnTheme: 'a',
		    click: function(e) {
		        e.preventDefault();
		        currentCollection.shareItemsClick(e);
		    }
		});
    } else {
        $('#' + param.itemID).unbind("click").bind("click", currentCollection.preferItemsClick);
    }
    
    try {
        $('ul#party-collection').listview('refresh');
    } catch (err) {
        
    }

};

partyplayer.funnel.onupdateFunnelItem = function (param, ref) {
    log ('onUpdateItem Invoked on Funnel')
    //something added to the funnel or changed in the funnel
    
    var item = currentCollection[param.itemID];

    var trItem = '';
	trItem += '<li class="playlist-item" id="' + param.funnelItemID + '"><a href="#">';
    trItem += '<img src="'+item.cover+'"/>';
    trItem += '<h3>'+item.title+'</h3>';
    trItem += '<p>' + item.artist + ' / ' + item.album + '</p>';
    trItem += '<span class="ui-li-count">' + param.votes + '</span>'
	trItem += '</a></li>';

    $('ul#playlist').append(trItem);

    if (param.userID != userProfile.userID) {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    		$('#' + param.funnelItemID).swipeDelete({
    		    btnLabel: 'Vote',
    		    btnTheme: 'a',
    		    click: function(e) {
    		        e.preventDefault();
    		        currentCollection.voteClick(e);
    		    }
    		});
        } else {
            $('#' + param.funnelItemID).unbind("click").bind("click", currentCollection.voteClick);
        }
    }
	
	try {
	    $('ul#playlist').listview('refresh');
    } catch (err) {

    }
}

partyplayer.funnel.onvotedFunnelItem = function(param, ref) {
    log ('onvotedFunnel Invoked on Funnel');

    $('#' + param.funnelItemID + ' span.ui-li-count').html(param.vote);
    
    if(param.userID == userProfile.userID && param.vote > 0){
        //succesvol vote, disabled vote button
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    		$('#' + param.funnelItemID).swipeDelete();
        } else {
            $('#' + param.funnelItemID).unbind("click");
        }
    } else {
        //voted failed
        log('vote for funnelItem: ' + param.funnelItemID + ' failed');
    }
}

partyplayer.funnel.onremoveFunnelItem = function (param, ref) {
    log ('onDelete Funnel Item Invoked on Funnel')
    
    // remove the item from the unshared collection
	var li = $('li[id*="' + param.funnelItemID + '"]');
	li.remove();
	
	try {
        $('ul#playlist').listview('refresh');
    } catch (err) {

    }
    
    $('.funnel[funnelItemID=' +param.funnelItemID+']').remove();
}


//Opening screen select profile
var selectProfile = {
	profileClick:function(event){
		//collect info
		var profileName = $('.profileName', this).html();
		var profilePic = $('.profilePic', this).attr('src');
		
		//store values
		userProfile.userName = profileName;
		userProfile.userPic = profilePic;
		
		//add local items from library to HTML list  
		selectLocalItems.importItems(userProfile.userName);
		
		/*
		 *@startuml ../docs/figures/guest_add_to_host.png
		 * partyGuest->partyHost: userName
		 * partyGuest->partyHost: userPic
		 * partyHost->partyGuest: userID
		 * @enduml
		 */	
	    partyplayer.joinUser(userProfile.userName, userProfile.userPic);
	    
		//show next screen and update userInfo on screen
		//currentCollection.init();
		//add userInfo to screen
		var newUser = '';
    	newUser += '<li>'
        newUser += '<img class="ui-li-icon" src="'+userProfile.userPic+'"/></div>';
        newUser += '<div>'+userProfile.userName+'</div>';
        newUser += '</li>';        

        $('ul#guest-profiles').append(newUser);
		
		$.mobile.changePage( "#home", { transition: "slideup"} );
	},
	init:function() {
		//add profile pics to list
		var picList = '';
		for(var i=0; i<libUsers.length; i++) {
		    
			var liItem = '<li class="profileItem">';
			liItem += '<img class="profilePic" src="';
			liItem += profileIcons[i];
			liItem += '" />';
			liItem += '<div class="profileName">'+libUsers[i].userName+'</div>';
			liItem += '</li>';
			picList += liItem;
		}
		$('ul#profiles').append(picList);
		$('ul#profiles li.profileItem').unbind("click").bind("click", selectProfile.profileClick);
		$('ul#profiles').listview('refresh');
	}
};

var currentCollection = {
	voteClick:function(event){
	    var funnelItemID = $(this).attr('id');
		console.log("funnel id = "+$(this).attr('id'));
		console.log("vote+1");
		partyplayer.voteFunnelItem(funnelItemID);
	},	
	preferItemsClick:function(event){
		var itemID = $(this).attr('id');
		partyplayer.addFunnelItem(itemID);
	}
};

var selectLocalItems ={
	localItems:'',
	shareItemsClick:function(event){
	    var itemId = $(this).attr('item-id');
        $('ul#user-collection').listview('refresh');
	    
		var sendItem = selectLocalItems.localItems[itemId];
		sendItem.version = 1;
		sendItem.localRef = itemId;
		//send to host
		partyplayer.addItem(sendItem);
		return false;
	},
	importItems:function(user){
		//locate collection
		for(var i=0; i<libUsers.length; i++){
			if(libUsers[i].userName==user){
				selectLocalItems.localItems = libUsers[i].items;
			}
		}
		//append items to table
		var itemList = '';
	
        // selectLocalItems.localItems.sort(function(a, b) {
        //             if ( a.title < b.title )
        //               return -1;
        //             if ( a.title > b.title )
        //               return 1;
        //             return 0;        
        //         });
	
		$.each(selectLocalItems.localItems, function(i, item) {
			var trItem = '';
			trItem += '<li class="shareableItem" item-id="' + i + '"><a href="#" class="shareableitemlink">';
		    trItem += '<img src="'+item.cover+'"/>';
		    trItem += '<h3>'+item.title+'</h3>';
		    trItem += '<p>' + item.artist + ' / ' + item.album + '</p>';
			trItem += '</a></li>';
		    itemList += trItem;
		});	
		$('ul#user-collection').append(itemList);

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    		$('ul#user-collection li.shareableItem').swipeDelete({
    		    btnLabel: 'Share',
    		    btnTheme: 'a',
    		    click: function(e) {
    		        e.preventDefault();
    		        selectLocalItems.shareItemsClick(e);
    		    }
    		});
        } else {
            $('ul#user-collection li.shareableItem').unbind("click").bind("click", selectLocalItems.shareItemsClick);
        }
		
		try {
    	    $('ul#user-collection').listview('refresh');
        } catch (err) {

        }
	}
};
