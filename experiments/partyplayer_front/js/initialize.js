//collection managing
var collection = function(){
	var collArray = [];
	
	//private, get function used by id or html
	var getItem = function(id){
		var item = {};
		for(var i = 0; i < collArray.length; i++){
			if(collArray[i].itemID == id){
				//console.log("found: " + id);
				item.itemID = collArray[i].itemID;
				item.userID = collArray[i].userID;
				item.item = collArray[i].item;
			}
		}
		//console.log(item);
		return item;
	};
	
	var pushItem = function(itemObject){
		collArray.push(itemObject);
	};
	
	var that = {};
	
	that.setupCollection = function(){
		console.log("setting up collection...");
		for(var i = 0; i < 5; i++){
			var itemObject = setupItem();
			itemObject.itemID = i;
			pushItem(itemObject);
		};
		myVisColl.renderAll();
	};
	
	that.addItem = function(item){
		if(typeof item === 'object'){
			pushItem(item);
			myVisColl.renderSingle(item);
			myVisual.popup(item.item.filename + " added by user to collection", 1);
		} else {
			console.log("ERROR: no object given");
		}
	};
	
	that.getCollection = function(){
		console.log("getting collection array");
		return collArray;
	};
	
	that.getItembyID = function(id){
		//console.log("getting item by id");
		return getItem(id);
	};
	that.getItembyHTML = function(element){
		//console.log("get item using element");
		var id = element.attr('_contentid');
		return getItem(id);
	};	
	
	return that;
};

//playlist managing
var playlist = function(){
	var playlistArray = []; //holding item objects added to playlist
	var playlistVis = []; //array holding reference to div
	var youtubeAPIready = false; //if not ready items can't be played
	var player; //actual player of currently played the item
	var playingItem; //currently playing item
	var isPlaying = false;
	var that = {};
	
	that.getPlaylist = function(){
		console.log("get playlist");
		return playlistArray;
	};
	that.addItem = function(item){
		console.log("adding item to playlist...");
		//if(!youtubeAPIready){
		//	console.log("ERROR: API isn't ready");
		//	return;
		//}
		var playlistItem = {
			"id" : item.itemID,
			"selector" : myVisPlay.addSingle(item)
		};
		playlistArray.push(playlistItem);
		myVisual.popup(item.item.filename + " added by X to playlist", 1);
		if(!isPlaying){
			that.nextItem();
		}
	};
	that.nextItem = function(){
		console.log("start playing (next) item");
		isPlaying = true;
		
		if(playlistArray.length > 0){
			playingItem = playlistArray.shift();
			myVisPlay.highlight(playingItem.selector);
			var item = myColl.getItembyID(playingItem.id);
			myVisual.popup(item.item.filename + " is now playing!" , 2);
			myVisBack.currentPlaying(item);
			if(!player){
				player = youtubeBuilder.buildPlayer(item.item.URI);
			} else {
				youtubeBuilder.playNext(item.item.URI);
			}
		} else {
			console.log("playlist empty... awaiting new items");
			isPlaying = false;
		}
	};
	that.removeItem = function(){
		myVisPlay.removeSingle(playingItem.selector);
	};
	that.APIready = function(){
		youtubeAPIready = true;
	};
	
	return that;
};

//manages items in the funnel
var funnel = (function(){
	var funnelSlots = 6; //amount of funnelslots
	var funnelList = [];
	
	return{
		getSlots : function(){
			return funnelSlots;
		},
		getFunnel : function(){
			return funnelList;
		},
		getItem : function(id){
			var fnI;
			for(var i = 0; i < funnelList.length; i++){
				if(funnelList[i].getID() == id){
					fnI = funnelList[i];
				}
			}
			return fnI;
		},
		getItembySlot : function(slot){
			var fnI;
			for(var i = 0; i < funnelList.length; i++){
				if(funnelList[i].getSlot() == slot){
					fnI = funnelList[i];
				}
			}
			return fnI;
		},
		addItem : function(item){
			var taken = 0;
			for(var i = 0; i < funnelSlots; i++){
				if($("#f_" + i).html() == ""){
					var id = item.itemID;
					//console.log("creating item....");
					var fnI = funnelItem();
					//console.log(fnI);
					fnI.setState(id, i);
					fnI.startTimer();
					funnelList.push(fnI);
					myVisFun.addSingle(item, i);
					break;
				} else {
					taken += 1;
					if(taken == funnelSlots){
						console.log("all slots taken");
					}
				}
			}
		},
		removeItem : function(id, slot){
			for(var i = 0; i < funnelList.length; i++){
				if(slot == funnelList[i].getSlot()){
					// remove target funnelitem 
					funnelList.splice(i, 1);
					myVisFun.removeSingle(id, slot);
					
				}
			}
		},
		toPlaylist : function(id, slot){
			funnel.removeItem(id, slot);			
			var item = myColl.getItembyID(id);
			myPlaylist.addItem(item);
		}
	};
}());

//define funnelitem, manages stats and "falling down rate"
var funnelItem = function(){
	var falls = 5;
	var hp = 100;
	var timeoutTime = 1000; //ms -> fallrate	
	var myTimeout; //timeout var
	var _contentid; //holds reference to itself
	var slot; //holds reference to slot item its in
	
	return{
		//return object with methods to update hp and the fallingdown timer
		updateHP : function(amount){
			hp += amount;
			console.log(hp);
		},
		updateTime : function(time){
			timeoutTime = time;
		},
		startTimer : function(){
 	 		var internalCallback = function(){
    			return function(){
      				if ( falls > 0 ){
       					window.setTimeout(internalCallback, timeoutTime);
       	 				myVisFun.fallSingle(_contentid, slot);
       	 				if ( falls == 1 ){
       	 					myVisFun.alertItem(_contentid, slot, timeoutTime);
       	 				}
       	 				falls--;
      				} else {
      					funnel.toPlaylist(_contentid, slot);
      				}
    			}
  			}();
	 		window.setTimeout( internalCallback, timeoutTime );
	 	},
		setState : function(myID, mySlot){
			_contentid = myID;
			slot = mySlot;
		},
		getID : function(){
			return _contentid;
		},
		getSlot : function(){
			return slot;
		}
	}
};

//assign classes to vars
var myColl = collection();
var myPlaylist = playlist();

//builds a player on a given position, if player is already build,
//change the video to a given link
var youtubeBuilder = (function(){
	var player;
	var divId = "player";
	
	var onPlayerReady = function(event){
		event.target.playVideo();
	};
	var onPlayerStateChange = function(event){
		if(event.data == 0){
			myPlaylist.removeItem();
			myPlaylist.nextItem();
		}
	};
	return {
		buildPlayer : function(videoURI){
			console.log("building new player");
			player = new YT.Player(divId, {
				height: '390',
				width: '640',
				videoId: videoURI,
				events: { //attach functions to predefined events -> youtube API)
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});
			return player;
		},
		playNext : function(videoURI){
			console.log("updating player");
			player.loadVideoById(videoURI);
		}
	};
}());

