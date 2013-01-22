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

    partyplayer.init('guest');
    selectProfile.init();
});

//globals for user
var userProfile = {
	userName:'',
	userPic:'',
	userID:'',
};

var partyPlayerUsers = {};

partyplayer.joinUser = function(name, picture){
	partyplayer.sendMessage({ns:"main", cmd:"join", params:{alias:name,thumbnail:picture}});
    log(name + " is joining...");
    console.log("1: "+name+" aanmelden");
};

partyplayer.addItem = function(item){
 	partyplayer.sendMessage({ns:"main", cmd:"addItem", params:{userID:userProfile.userID,item:item}});
	log("adding Item");
};

partyplayer.removeItem = function(itemID){
	partyplayer.sendMessage({ns:"main", cmd:"removeItem", params:{userID:userProfile.userID,itemID:itemID}});
	log("removing Item");
}

partyplayer.addFunnelItem = function(itemID){
 	partyplayer.sendMessage({ns:"funnel", cmd:"addItem", params:{userID:userProfile.userID,itemID:itemID}});
	log("adding Item To Funnel");
};

partyplayer.voteFunnelItem = function(funnelItem, voteValue){
    //@TODO -> TEST
 	partyplayer.sendMessage({ns:"funnel", cmd:"vote", params:{userID:userProfile.userID,funnelItemID:funnelItemID}});
	log("adding Item To Funnel");
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
		    newUser += '<div class="profile" user="'+param.userID+'">';
		    newUser += '<div class="userInfoPic">';
		    newUser += '<img class="profilePicSmall" id="base64image" src="'+param.user.thumbnail+'"/></div>';
		    newUser += '<div class="userInfoText">'+param.user.alias+'</div>';
		    newUser += '</div>';
		    $('#userInfo').append(newUser);
	    }
    }
};

partyplayer.main.onremoveUser = function(param, ref) {
    log('onremoveUser Invoked!');
    
    delete partyPlayerUsers[param.userID];
    //delete user from screen
    $('.profile[user="'+param.userID+'"]').remove();
    //delete items from collection
    $('table#partyCollection tr[user="'+param.userID+'"]').remove();
};

partyplayer.main.onupdateCollectionItem = function (param, ref) {
    console.log("2: collection updated");
	log ('onUpdateItem Invoked; my userID='+userProfile.userID)
	//if (param.userID != userID){
		log (param.userID +" added \""+param.item.artist +" - "+param.item.title + "\" to the collection");
	//}
    //add items to screen
	var trItem = '';
	trItem += '<tr user="'+param.userID+'" itemID="'+param.itemID+'">';
	trItem += '<td class="artist">'+param.item.artist+'</td>';
	trItem += '<td class="title">'+param.item.title+'</td>';
	trItem += '<td class="album">'+param.item.album+'</td>';
	trItem += '<td align="center" class="cover"><img class="cover" src="'+param.item.cover+'" width="80" height="40" /></td>'
	if(param.userID == userProfile.userID){
		// you added this item
		var profileImage = userProfile.userPic;
		trItem += '<td align="center" class="user"><img src="'+profileImage+'" width="25" height="25" /></td>';
		trItem += '<td align="center"><img src="../../library/trash.png" width="30" height="30" /></td>';
	}else if (param.userID != userProfile.userID){
		//other user added this item
		var profileImage = partyPlayerUsers[param.userID].picture;
		trItem += '<td align="center"><img src="'+profileImage+'" width="25" height="25" /></td>';
		trItem += '<td align="center"><button class="addBtn" itemid="'+param.itemID+'">Add</button></td>';
	}
	trItem += '</tr>';
	$('table#partyCollection').append(trItem);
	$('table#partyCollection .addBtn[itemID="'+param.itemID+'"]').bind("click", currentCollection.preferItemsClick);
};

partyplayer.funnel.onupdateFunnelItem = function (param, ref) {
    log ('onUpdateItem Invoked on Funnel')
    //something added to the funnel or changed in the funnel
    
    //get values from party collection
    var item = $('table#partyCollection tr[itemID="'+param.itemID+'"]');
    var artist = item.find('.artist').html();
    var title = item.find('.title').html();
    var album = item.find('.album').html();
    var cover = item.find('.cover').html();

    //add items to funnel on screen
	var trItem = '';
	trItem += '<tr class="funnel" funnelItemID="'+param.funnelItemID+'">';
	trItem += '<td>'+artist+'</td>';
	trItem += '<td>'+title+'</td>';
	trItem += '<td>'+album+'</td>';
	trItem += '<td align="center">'+cover+'</td>'
	//var profileImage = partyPlayerUsers[param.userID].picture;
	//trItem += '<td align="center"><img src="'+profileImage+'" width="25" height="25" /></td>'
	trItem += '<td></td>'
	trItem += '<td align="center"><button class="voteBtn" funnelid="'+param.funnelItemID+'">Vote</button></td>'
	trItem += '</tr>';
	$('table#partyFunnel').append(trItem);
	$('table#partyFunnel .voteBtn[funnelid='+param.funnelItemID+']').bind("click", currentCollection.voteClick);   
}

partyplayer.funnel.onremoveFunnelItem = function (param, ref) {
    log ('onDelete Funnel Item Invoked on Funnel')
    //something added to the funnel / or changed in the funnel
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
		$('#selectProfile').fadeOut(200, function(){
			currentCollection.init();
			//add userInfo to screen
			
			var newUser = '';
		    newUser += '<div id="yourProfile" class="profile">';
		    newUser += '<div class="userInfoPic">';
		    newUser += '<img class="profilePicSmall" id="base64image" src="'+userProfile.userPic+'"/></div>';
		    newUser += '<div class="userInfoText">'+userProfile.userName+'</div>';
		    newUser += '</div>';
		    $('#userInfo').prepend(newUser);
			$('#userInfo').show();
		});
	},
	init:function() {
		$('div#selectProfile').show();
		//add profile pics to list
		var picList = '';
		for(var i=0; i<libUsers.length; i++) {
			var liItem = '<li class="profileItem">';
			liItem += '<img class="profilePic" id="base64image" src="';
			liItem += profileIcons[i];
			liItem += '" />';
			liItem += '<p class="profileName">'+libUsers[i].userName+'</p>';
			liItem += '</li>';
			picList += liItem;
		}
		$('div#selectProfile ul#profiles').append(picList);
		$('ul#profiles li.profileItem').bind("click", selectProfile.profileClick);
	}
};

var currentCollection = {
	voteClick:function(event){
		console.log("funnel id = "+$(this).attr('funnelid'));
		console.log("vote+1");
	},	
	preferItemsClick:function(event){
		var itemID = $(this).attr('itemid');
		partyplayer.addFunnelItem(itemID);
	},
	addItemsClick:function(event){
		$('#currentCollection').fadeOut(200, function(){
			selectLocalItems.init();
		});
	},	
	init:function(){
		$('div#currentCollection').show();
		$('div#addItemsBtnContainer button#addItemsBtn').bind("click", currentCollection.addItemsClick);
	}	
};

var selectLocalItems ={
	localItems:'',
	shareItemsClick:function(event){
		//loop through checked checkBoxes
		$.each($('input:checked'), function(i, item){
			//get value
			var itemKey = item.value;
			var sendItem = selectLocalItems.localItems[itemKey];
			//send to host
			partyplayer.addItem(sendItem);
		}); 
		//go to previous screen
		$('#selectLocalItems').fadeOut(200, function(){
			$('#currentCollection').show();
		});		
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
	
		$.each(selectLocalItems.localItems, function(i, item) {
			var trItem = '';
			trItem += '<tr>';
		    trItem += '<td>'+item.artist+'</td>';
		    trItem += '<td>'+item.title+'</td>';
		    trItem += '<td>'+item.album+'</td>';
		    trItem += '<td>'+'<img class="cover" src="'+item.cover+'" width="80px" height="40px" />'+'</td>';
		    //also add checkBoxes
		    //checkBoxes get the same name as the fileName, the whole item is passed as value
		    trItem += '<td><input name="'+item.fileName+'" value="'+i+'" type="checkbox"></td>';
		    trItem += '</tr>';
		    itemList += trItem;
		});	
		$('div.collectionContainer table#localCollection').append(itemList);
	},
	init:function(){
		$('div#selectLocalItems').show();
		$('div#shareItemsBtnContainer button#shareItemsBtn').bind("click", selectLocalItems.shareItemsClick);
	}
};
