/*
 * Party Guest Demo
 */
$(document).ready(function(){

    partyplayer.init('guest');
    selectProfile.init();
});

var userID;

var userProfile = {
		userName:'',
		userPic:'',
		userID:'',
};

partyplayer.joinUser = function(name, picture){
	partyplayer.sendMessage({ns:"main", cmd:"join", params:{alias:name,thumbnail:picture}});
    log(name + " is joining...");
};


partyplayer.addItem = function(item){
 	partyplayer.sendMessage({ns:"main", cmd:"addItem", params:{userID:userProfile.userID,item:item}});
	log("adding Item");
};

partyplayer.main = {};
partyplayer.main.onwelcome = function(param, ref) {
    userProfile.userID = param.userID;
    log('onwelcome invoked! userID = '+ userProfile.userID); 
    //@TODO
    //mainMenu.init();
};

partyplayer.main.onupdatePlayer = function(param, ref) {
    log('onupdatePlayer Invoked!');
    //** If param.userId not in [userTable]
    //->@TODO: User admininstartion
    //log("param.userAlias + Joined the party"); 
};

partyplayer.main.onremovePlayer = function(param, ref) {
    log('onremovePlayer Invoked!');
    //->@TODO collection should be updated, as user is removed
};

partyplayer.main.onupdateCollectionItem = function (param, ref) {
    log ('onUpdateItem Invoked; my userID='+userProfile.userID)
	//if (param.userID != userID){
	log (param.userID +" added \""+param.item.artist +" - "+param.item.title + "\" to the collection");
		//@TODO: client logic 
	//}
};

//Opening screen select profile
var selectProfile = {
	profileClick:function(event){
		//collect info
		var profileName = $('.profileName', this).html();
		var profilePic = $('.profilePic', this).attr('src');
		
		//store values
		userProfile.userName = profileName;
		userProfile.userPic = profilePic;
		
		/*
		 *@startuml ../docs/figures/guest_add_to_host.png
		 * partyGuest->partyHost: userName
		 * partyGuest->partyHost: userPic
		 * partyHost->partyGuest: userID
		 * @enduml
		 */	
	    partyplayer.joinUser(userProfile.userName, userProfile.userPic);
	    //TODO: receive and store userID
	    
		//next screen
		$('#selectProfile').fadeOut(200, function(){
			currentCollection.init();
		});
	},
	init:function() {
		$('#selectProfile').show();
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
		$('#selectProfile #profiles').append(picList);
		$('#selectProfile #profiles .profileItem').bind("click", selectProfile.profileClick);
	}
};

var currentCollection = {
	addItemsClick:function(event){
		$('#currentCollection').fadeOut(200, function(){
			selectLocalItems.init();
		});
	},	
	init:function(){
		$('#currentCollection').show();
		$('#currentCollection h2').append(" "+userProfile.userName);
		console.log(userProfile.userName);
		//TODO: get collection
		$('#currentCollection #addItemsBtnContainer #addItemsBtn').bind("click", currentCollection.addItemsClick);
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
		    //also add checkBoxes
		    //checkBoxes get the same name as the fileName, the whole item is passed as value
		    trItem += '<td><input name="'+item.fileName+'" value="'+i+'" type="checkbox" checked="checked"></td>';
		    trItem += '</tr>';
		    itemList += trItem;
		});	
		$('#selectLocalItems #localCollectionContainer #localCollection').append(itemList);
	},
	init:function(){
		$('#selectLocalItems').show();
		$('#selectLocalItems #shareItemsBtnContainer #shareItemsBtn').bind("click", selectLocalItems.shareItemsClick);
		selectLocalItems.importItems(userProfile.userName);
	}
};
