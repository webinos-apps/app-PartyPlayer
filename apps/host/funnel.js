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
 * Author: Arno Pont, Martin Prins, Daryll Rinzema
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
	var funnelWidth = 500;
	var funnelList = new Collection("Funnel");
	var allItems = {}; //object to push all funnelVars
	var sortedItems = []; //array for sorting
	var circles = 6;
	var nextItem = false; //true if center circle is taken
	
	return{
		/**
		 *  Initialize function to setup circle slots.
		 *
		 *  @param funnelSize int The size of the funnel (width & height) in pixels
		 *  @param circles int The amount of circles the funnel holds 
		**/
		init : function (funnelSize, the_circles) {
		    funnelWidth = funnelSize;
		    circles = the_circles;
			funnelViz.setupCircles(funnelWidth, circles);
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
            
            var fnO = funnelVar();
            allItems['key_' + key] = fnO;
            fnO.setKey(key);
            fnO.init();

            sortedItems.push([key, funnelItem.votes]);

            return key;
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
			var fnO = allItems['key_' + key];
			if(fnO){
			    funnelViz.destroySingle(allItems['key_' + key].getSelector());
			    funnelList.removeItem(key);
			    delete allItems['key_' + key];
			    
			    for(var i = 0; i < sortedItems.length; i++){
			        if(sortedItems[i][0] == key){
			            sortedItems.splice(i, 1);
			        }
			    }
			    
			    //automatically set highest item to 'Next Item'
			    if(sortedItems[0]){
			        if(sortedItems[0][1] >= circles){
			            funnelViz.setCenter(allItems['key_' + sortedItems[0][0]].getSelector());
			        }
			    }
			    
			    callback(key);
			} else {
			    return false;
			}
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
			
			//make the visual part update Item to next circle
			if(funnelItem.votes < circles){
			    allItems['key_' + key].setCircle(circles + 1 - funnelItem.votes);
			    funnelViz.updateCircle(allItems['key_' + key].getSelector(), allItems['key_' + key].getCircle());
			} else if (!nextItem && funnelItem.votes >= circles) {
			    allItems['key_' + key].setCircle(circles + 1 - funnelItem.votes);
			    funnelViz.setCenter(allItems['key_' + key].getSelector());
			    nextItem = true;
			}
			
			if(nextItem && funnelItem.votes >= circles){
			    if(funnelItem.votes >= oldSorted[0][1]){
			        var oldItem = allItems['key_' + oldSorted[0][0]];
			        oldItem.setCircle(2);
			        funnelViz.updateCircle(oldItem.getSelector(), oldItem.getCircle());
			        allItems['key_' + key].setCircle(1);
			        funnelViz.setCenter(allItems['key_' + key].getSelector());
			    }
			}
			console.log(oldSorted);
			console.log(sortedItems);
			
			return funnelItem.votes;
		},
		/**
		 *  Calls the visual function to animate the to-be-played Item
		 *
		 *  @param key string The funnelItemID
		**/
		animateToPlayer : function (key) {
		    clearInterval(allItems['key_' + key].getInterval());
		    funnelViz.animateToPlayer(allItems['key_' + key].getSelector());
		},
		/**
		 *  int Returns The amount of circles the funnel consists of
		 *
		**/
		getCircles : function () {
			return circles;
		},
		/**
		 *  int Returns The total funnel size (in pixels)
		 *
		**/
		getFunnelWidth : function () {
			return funnelWidth;
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
	}	
})();

/**
 *	The funnelVar is a seperate Object that will be created when a funnelItem is created in funnelList. 
 *	funnelVar holds the ID of the funnelItem as it is in funnelList. funnelVar holds an object called 'element'.
 *	This object contains many properties that the visual part uses in order to update a specific Item on the Front-End
 *
 *	@constructor funnelVar
 *	@example var funnelObject = funnelVar();
**/
var funnelVar = function(){
	var key, element = {}; // selector / circle / state / interval
	
	return{
		/**
		 *	Sets up the element object that gets returned after building it in the DOM
		 *
		**/
		init : function(){
			element = funnelViz.renderSingle(key);
		},
		/**
		 *	Sets the key of this Item
		 *
		 *	@param key int The key to be set to
		**/
		setKey : function(newKey){
			key = newKey;
		},
		/**
		 *	Sets the circle this Item is at in the element Object
		 *
		 *	@param circle int Circle number to be set to
		**/
		setCircle : function(circle){
			element.circle = circle;
		},
		/**
		 *	Sets the interval this Item has.
		 *
		 *	@param interval Object Interval to set to
		**/		
		setInterval : function(interval){
		    element.interval = interval;
		},
		/**
		 *	string Returns The key of the Item
		**/
		getKey : function(){
			return key;
		},
		/**
		 *	string Returns The selector the element Object
		**/
		getSelector : function(){
			return element.selector;
		},
		/**
		 *	int Returns The circle the Item is at
		**/
		getCircle : function(){
			return element.circle;
		},
		/**
		 *	Object Returns The interval reference for the timer
		**/
		getInterval : function(){
		    return element.interval;
		}
	}	
}

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
