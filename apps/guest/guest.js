/*
 * Party Guest Demo
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
};

partyplayer.addItem = function(item){
 	partyplayer.sendMessage({ns:"main", cmd:"addItem", params:{userID:userProfile.userID,item:item}});
	log("adding Item");
};

partyplayer.removeItem = function(itemID){
	partyplayer.sendMessage({ns:"main", cmd:"removeItem", params:{userID:userProfile.userID,itemID:itemID}});
	log("removing Item");
}

partyplayer.main = {};
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
	    	partyPlayerUsers[param.userID]={name:param.user.alias,picture:param.user.thumbnail}
	    	 //update users on screen
		    var newUser = '';
		    newUser += '<div class="profile">';
		    newUser += '<div class="userInfoPic">';
		    newUser += '<img class="profilePicSmall" id="base64image" src="'+param.user.thumbnail+'"/></div>';
		    newUser += '<div class="userInfoText">'+param.user.alias+'</div>';
		    newUser += '</div>';
		    $('#userInfo').append(newUser);
	    }
    }
	console.log(partyPlayerUsers);
};

partyplayer.main.onremoveUser = function(param, ref) {
    log('onremoveUser Invoked!');
    
    delete partyPlayerUsers[param.userID];
    //->@TODO collection should be updated, as user is removed
};

partyplayer.main.onupdateCollectionItem = function (param, ref) {
    log ('onUpdateItem Invoked; my userID='+userProfile.userID)
	//if (param.userID != userID){
		log (param.userID +" added \""+param.item.artist +" - "+param.item.title + "\" to the collection");
		 
	//}
    //add items to screen
	var trItem = '';
	trItem += '<tr>';
	trItem += '<td>'+param.item.artist+'</td>';
	trItem += '<td>'+param.item.title+'</td>';
	trItem += '<td>'+param.item.album+'</td>';
	trItem += '<td><img src="'+param.item.cover+'" width=40px height=40px/></td>';
	trItem += '</tr>';
	$('#currentCollection .collectionContainer #partyCollection').append(trItem);
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
		    trItem += '<td>'+"<img src="+item.cover+' width=40px hight=40px/>'+'</td>';
		    //also add checkBoxes
		    //checkBoxes get the same name as the fileName, the whole item is passed as value
		    trItem += '<td><input name="'+item.fileName+'" value="'+i+'" type="checkbox" checked="checked"></td>';
		    trItem += '</tr>';
		    itemList += trItem;
		});	
		$('#selectLocalItems .collectionContainer #localCollection').append(itemList);
	},
	init:function(){
		$('#selectLocalItems').show();
		$('#selectLocalItems #shareItemsBtnContainer #shareItemsBtn').bind("click", selectLocalItems.shareItemsClick);
	}
};
