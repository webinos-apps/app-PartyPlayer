/**
 *	Use directly, self initialized, singleton.
 *	The player, like the funnel, is a closure, meaning it returns an object containing methods.
 *	These methods are used to communicate with the player.
 * 
 *	@namespace player
 *	@example //everywhere in the code it is possible to do:
 *	player.method(parameters);
**/
var player = (function(){
    var playerSelector;
    
	return{
	    
        /**
         *  Get the first song in the funnel at the circle, this function loops through all circles until it finds an item
         *
         *  @TODO make the player select funnelItem based on votes in circle
        **/
		getSong : function(){
			var theCircle;
			var key;
			for(var i = 0; i < funnel.getCircles(); i++){
				var currentCircle = funnel.getFunnelItemsAtCircle(i+1);
				for(var j = 0; j < currentCircle.length; j++){
					if(typeof currentCircle[j] === 'undefined'){
						
					}else{
						console.log('item found at slot: ' + i);
						theCircle = i+1;
						key = currentCircle[j];
						break;
					}
				}
				if(theCircle){break;}
			}
			if(!theCircle){console.log("no items found"); return false;}
			var funnelItem = funnel.getFunnelListItem(key);
		    var item = pc.getItem(funnelItem.itemID);
		    //remove?
		    funnel.removeItem(key);
		    
		    playerViz.updatePlayer(item.item.url, playerSelector);
		},
		/**
		 *  Let the player directly play the given URL
		 *
		 *  @param url string The URL string to look for
		**/
		updateSong : function(url){
		    if(typeof url === 'string'){
		        playerViz.updatePlayer(url, playerSelector);
		    } else {
		        return false;
		    }
		},
		init : function(){
		    playerSelector = playerViz.buildPlayer();
		},
		start : function(){
		    player.getSong();
		},
		stop : function(){
		   
		}
	}
})();
