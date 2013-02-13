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
 * Authors: Daryll Rinzema, Martin Prins
 */

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
    var playerSelector, sortedItems, playing = false;
    var url;
    
	return{
	    
        /**
         *  Get the first song in the funnel, based on votes
         *
        **/
		getSong : function(){
		    // if a song is being played let it play
		    if (playing) return;
		    
		    sortedItems = funnel.getFunnel();

            if(sortedItems.length == 0) {
                partyplayer.player.updateItem(undefined, "00:01:00");
                return false;
            }

		    var key = sortedItems[0][0];
		    if(!key){
                partyplayer.player.updateItem(undefined, "00:01:00");
		        return false;
		    }
		    
		    var funnelListItem = funnel.getFunnelListItem(key);
		    var item = pc.getItem(funnelListItem.itemID); 
		    
		    if (!item.item.bumped) {
                partyplayer.player.updateItem(undefined, "00:01:00");
		        return false;
	        }
		    
            funnel.animateToPlayer(key);
		    
		    if (url) {
		        window.URL.revokeObjectURL(url);
		    }
		    
            url = window.URL.createObjectURL(item.item.blob);
            partyplayer.player.updateItem(funnelListItem.itemID, "00:01:00");
            $("#albumArtImg").attr("src", item.item.cover);
		    playerViz.updatePlayer(url, playerSelector);

		    playing = true;
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
		/**
		 *  Starts the player, calls visual part to build the player onscreen
		 *
		**/
		init : function(){
		    playerSelector = playerViz.buildPlayer();
		    //playerViz.setupButton();
		},
		start : function(){
		    player.getSong();
		},
		isPlaying: function() {
		    return playing;
		},
		getNextSong : function() {
		    playing = false;
		    player.getSong();
		},
		skipSong : function() {
		    player.getNextSong();
		}
	}
})();

/******************||**||**|||**|||**||*****************************
*******************||**||**||*||*||**||*****************************
*******************||||||**||****||**|||||**************************/
 /*
 @startuml starting_player.png
 group Starting the Player
    PartyCollection -> Player: init()
    Player -> VisualPlayer: buildPlayer()
    
    VisualPlayer -> Player: return string playerSelector
 end
 @enduml
 */
 
 /*
 @startuml protocol_updating_player.png
 group Updating the Player's source file
    VisualPlayer -> Player: getSong()
    
    Player -> Funnel: animateToPlayer()
    Funnel -> Funnel: removeItem(key)
    
    Player -> VisualPlayer: updatePlayer(url, selector)/false
 end
 @enduml
 */
