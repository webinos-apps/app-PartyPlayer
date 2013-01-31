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
 * (C) Copyright 2012, TNO, BMW Forschung & Technik GmbH
 * Author: Arno Pont, Martin Prins, Daryll Rinzema, Simon Isenberg
 */

//
//augment object with size function tp count the numbers of properties
/**
 *	Helper function to count all properties of the object
 *
 *	@namespace
 *	@param obj Object to count
**/
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
}

/**
 *	Use directly, self initialized, singleton.
 *	The funnel is a closure, meaning it returns an object containing methods.
 *	These methods are used to communicate with the funnel.
 *	The funnel uses mainly 2 vars: the funnelList as a Collection, and an Object called sortedItems.
 *	sortedItems uses the generated key(ID) from the funnelList. This ID gets created when an Item gets added to the funnelList.
 *	This key is a property in sortedItems, attached to the property is a funnelVar(see funnelVar).
 * 
 *	@namespace funnel
 *	@example //everywhere in the code it is possible to do:
 *	funnel.method(parameters);
**/
var funnel = (function () {
	//note: key == ID in collection
	
	var funnelList = new Collection("Funnel");
	//var allItems = {}; //object to push all funnelVars
	var sortedItems = []; //array for sorting
	var circles = 6;
	var nextItem = false; //true if center circle is taken
	
	var onInitCallback = function(circles){};
	var onAddItemCallback = function(key){};
	var onVoteItemCallback = function(key){};
	var onRemoveItemCallback = function(key){}; 
	var onAnimateCallback = function(key){}; 


	return{
		/**
		 *  Initialize function to setup circle slots.
		 *
		**/
		init : function (levels) {
			circles = levels
			onInitCallback(circles);
		},

		onInit : function(callback){
			onInitCallback = callback;
		},
		/**
		 *  Add an item to the funnel. Creates a funnelItem (for in funnelList) and funnelVar 
		 *	(for in sortedItems), with the property as the key of the funnelItem in funnelList
		 * 
		 *  Returns int The key as in funnelList
		 * 
		 *  @param id int The ID of a partyItem. 
		 * 
		**/
		addItem : function (id, userID) {			
	    var funnelItem = new partyplayer.FunnelItem(id, 1, userID); //1 = 1 vote
	    var key = funnelList.addItem(funnelItem);
	    funnelItem.funnelItemID = key;
	    

	    sortedItems.push([key, funnelItem.votes]);

	    onAddItemCallback(key);
	    return key;
		},

		/**
		 *  Register the callback for adding an item to the playlist
		 * 
		 *  @param callback method which is triggered when the an item is added to the funnel.
		 *  The callback handler receives the key of the add item
		 * 
		**/
		onAddItem : function (callback){
			onAddItemCallback = callback;
		},
		/**
		 *  Removes an item from the funnelList and from sortedItems
		 *  if succesful remove, it calls the callback function provided
		 *  if unsecceful returns boolean false
		 *
		 *	@param key int The ID of the funnelItem as in funnelList
		 *  @param callback function The function to call if succesful remove
		**/
		removeItem : function (key, callback) {
			for(var i = 0; i < sortedItems.length; i++){
				if(sortedItems[i][0] == key){
				      sortedItems.splice(i, 1);
				  }
			}
			onRemoveItemCallback(key);
			callback(key);
			funnelList.removeItem(key);
			return true;
		},
		/**
		 *  Register the callback for removing an item from the funnel
		 * 
		 *  @param callback method which is triggered when the an item is removed from the funnel.
		 *  The callback handler receives the key of the removed item
		 * 
		**/
		onRemoveItem : function(callback){
			onRemoveItemCallback = callback;

		},
		/**
		 *  Vote for an item inside the Funnel
		 *  boolean Return (un)succesful true/false
		 *
		 *  @param string key The funnelItem ID
		**/
		voteItem : function (key) {		    
	        var funnelItem = funnelList.getItem(key);
	        
	        if(!funnelItem){
	            return -1;
	        }
	        funnelItem.votes += 1;
	        console.log(funnelItem.votes);
	        
	        //sort sortedItems object according to votes
	        var oldSorted = sortedItems.slice();
	        if(funnelItem.votes >= oldSorted[0][1]){
	            for( var x = 0; x < sortedItems.length; x++){
	                if(oldSorted[x][0] == key){
	                    var newItem = [key, funnelItem.votes]
	                    sortedItems.splice(x, 1);
	                    sortedItems.splice(0,0, newItem);
	                }
	            }
	        } else {
	        
	          sortedItems = [];
			    	for(var oldKey in allItems){
			        newKey = oldKey.replace("key_", "");
				    	sortedItems.push([newKey, funnelList.getItem(newKey).votes]);
			    	}
			    sortedItems.sort(function(a,b){return b[1]-a[1]});
					
				}
			
			//check if items moved a position
			var oldPos, newPos;
			for(var i = 0; i < sortedItems.length; i++){
			    if(oldSorted[i][0]!= sortedItems[i][0]){
			        for(var j = 0; j < sortedItems.length; j++){
			            if(sortedItems[j][0] == oldSorted[i][0]){
			                oldPos = i;
			                newPos = j;
			                console.log("oldpos for: " + oldSorted[oldPos][0] + " = " + oldPos + " & newpos = " + newPos);
			                break;
			            }
			        }
			    }
			}
			
			onVoteItemCallback(funnelItem, key);

			console.log(oldSorted);
			console.log(sortedItems);
			
			return funnelItem.votes;
		},
		/**
		 *  Register the callback for voting on an item
		 * 
		 *  @param callback method which is triggered when the an item has received a vote.
		 *  The callback handler receives the key of the item, which has been voted on.
		 * 
		**/
		onVoteItem : function(callback){
			onVoteItemCallback = callback;
		},


		/**
		 *  Calls the visual function to animate the to-be-played Item
		 *
		 *  @param key string The funnelItemID
		**/
		animateToPlayer : function (key) {
				onAnimateCallback(key);
				funnel.removeItem(key, partyplayer.funnel.removeFunnelItem);
		},

		onAnimate : function(callback){
			onAnimateCallback = callback;
		},
		/**
		 *  object Returns funnelItem as in funnelList
		 *
		 *	@param key int The ID as a property in sortedItems
		**/
		getFunnelListItem : function (key) {
			return funnelList.getItem(key);
		},
		/**
		 *  collection Returns full funnelList
		 *
		**/
		getFunnelList : function () {
		    return funnelList;
		},
		/**
		 *  array Returns the sortedItems array, where items have been sorted on votes
		 *
		**/
		getFunnel : function () {
		    return sortedItems;
		},
		/**
		 *  int Returns The amount of circles the funnel consists of
		 *
		**/
		getCircles : function () {
			return circles;
		},
		/**
		 *  boolean Returns If the next Item is already chosen
		 *
		**/
		nextItem : function () {
			return nextItem;
		}
	}	
})();



/******************||**||**|||**|||**||*****************************
*******************||**||**||*||*||**||*****************************
*******************||||||**||****||**|||||**************************/
 /*
 @startuml starting_funnel.png
 group Starting the Funnel
    PartyCollection -> Funnel: init()
    Funnel -> VisualFunnel: setupCircles(funnelSize, maxCircles)
 end
 @enduml
 */
 
 /*
 @startuml protocol_funnel_addItem.png
 group Adding an Item to the Funnel
    PartyCollection -> Funnel: addItem(itemID)
    Funnel -> VisualFunnel: renderSingle(key)
 
    VisualFunnel --> Funnel: return element
    Funnel --> PartyCollection: return key/false
 end
 @enduml
 */
 
 /*
 @startuml protocol_funnel_removeItem.png
 group Removing an Item from the Funnel
    PartyCollection -> Funnel: removeItem(key, callback)
    Funnel -> VisualFunnel: destroySingle(key)
 
    Funnel --> PartyCollection: callback(key)/false
 end
 @enduml
 */
 
  /*
 @startuml protocol_funnel_voteItem.png
 group Voting for an Item
    PartyCollection -> Funnel: voteItem(key)
    Funnel -> VisualFunnel: updateCircle(selector, circle)
    
    Funnel -> PartyCollection: return boolean
 end
 @enduml
 */
