//augment object with size function tp count the numbers of properties
/**
 *	Helper function to count all properties of the object
 *
 *	@namespace
 *	@param obj Object to count
**/
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

var item = {};
item.version = 1;
item.url = '../../library/01.mp3';

var pc = new PartyCollection('name');
var blaKey= [];
var pcKey = [];

$(document).ready(function(){
    //adding tests items in party collection
    pcKey.push(pc.addItem(2, item));
    pcKey.push(pc.addItem(2, item));
    pcKey.push(pc.addItem(2, item));
    pcKey.push(pc.addItem(2, item));
    pcKey.push(pc.addItem(2, item));

	funnel.init(500, 5);
	player.init();
});

/**
 *	Use directly, self initialized, singleton.
 *	The funnel is a closure, meaning it returns an object containing methods.
 *	These methods are used to communicate with the funnel.
 *	The funnel uses mainly 2 vars: the funnelList as a Collection, and an Object called allItems.
 *	allItems uses the generated key(ID) from the funnelList. This ID gets created when an Item gets added to the funnelList.
 *	This key is a property in allItems, attached to the property is a funnelVar(see funnelVar).
 * 
 *	@namespace funnel
 *	@example //everywhere in the code it is possible to do:
 *	funnel.method(parameters);
**/
var funnel = (function(){
	//note: key == ID in collection
	var funnelWidth = 500;
	var funnelList = new Collection("Funnel");
	var allItems = {}; 
	var circles = 6;
	var circleSlots = {}; 
	
	var randomFromTo = function(from, to){
		return Math.floor(Math.random() * (to - from + 1) + from);
	}
	
	
	return{
		/**
		 *  Initialize function to setup circle slots.
		 *
		 *  @param funnelSize int The size of the funnel (width & height) in pixels
		 *  @param circles int The amount of circles the funnel holds 
		**/
		init : function(funnelSize, the_circles){
		    funnelWidth = funnelSize;
		    circles = the_circles;
			for(var i = 0; i<circles; i++){
				circleSlots['circle_' + (i+1)] = new Array(i+1);
			}
			/*
			var votes = 50;
			for(var i = 0; i<circleSlots.circle_5.length-1; i++){
				var funnelItem = new partyplayer.FunnelItem(pcKey[i],100);
				funnelItem.votes = votes - 10;
				blaKey.push(funnelList.addItem(funnelItem));
				circleSlots.circle_5[i] = blaKey[i];
				var fnO = funnelVar();
				allItems['key_' + blaKey[i]] = fnO;
				fnO.setKey(blaKey[i]);
				votes +=  50;
			}
			*/
			funnelViz.setupCircles(funnelWidth, circles);
			console.log(circleSlots);
			console.log(funnelList);
		},
		/**
		 *	Updates the given maximum for a given circle
		 *
		 *	@param circle int The circle to change the maximum of slots for
		 *	@param maximum int The new number of maximum items to hold 
		**/
		updateMaxSlots : function(circle, maximum){
			circleSlots['circle_' + circle].length = maximum;
			console.log(circleSlots);
		},
		/**
		 *  Add an item to the funnel. Creates a funnelItem (for in funnelList) and funnelVar 
		 *	(for in allItems), with the property as the key of the funnelItem in funnelList
		 * 
		 *  Returns int The key as in funnelList
		 * 
		 *  @param id int The ID of a partyItem. 
		 * 
		**/
		addItem : function(id){
			var count = 0;
			for(var i = 0; i<circleSlots['circle_' + circles].length; i++){
				if(typeof circleSlots['circle_' + circles][i] === 'undefined'){
					console.log("add item to circle");
					var funnelItem = new partyplayer.FunnelItem(id, 100);
					var key = funnelList.addItem(funnelItem);
					var fnO = funnelVar();
					allItems['key_' + key] = fnO;
					circleSlots['circle_' + circles][i] = key;
					fnO.setKey(key);
					fnO.init();
					break;
				} else {
					count++;
				}
			}
			if(count == circleSlots['circle_' + circles].length){
				console.log('funnel full');
				return false;
			}
			console.log(allItems);
			console.log(circleSlots);
			console.log(funnelList);
			
			return key;
		},
		/**
		 *  Function to handle switching circles, it looks for the next item with least votes to be switched with if the next circle is full
		 *	If the same amount of votes are found it picks a random item of the ones with least votes
		 *
		 *	@param key int The itemID as in funnelList to look for
		 *	@param goNext boolean If true, looks for the next circle, if false, looks for the prev circle
		 *	
		**/
		switchCircle : function(key, goNext){
			var fnO1 = allItems['key_' + key];
			var circle = fnO1.getCircle();
			var toCircle;
			var key2;
			if(typeof goNext === 'boolean'){
				switch(goNext){
					case true: 
						toCircle = circle-1;
						break;
					case false:
						toCircle = circle+1;
						break;
				}
			} else {
				return "ERROR: no boolean for goNext!";
			}
			
			if(circle == 1){
				//console.log('animate same circle: ' + circle);
				funnelViz.updateCircle(fnO1.getSelector(), circle);
				return;
			}
			var circleOld = circleSlots['circle_' + circle];
			var indexOld = circleOld.indexOf(key);
			
			var circleNext = circleSlots['circle_' + toCircle];
			var indexNext;
			var count = 0;
			
			for(var i = 0; i < circleNext.length; i++){
				if(typeof circleNext[i] === 'undefined'){
					circleOld[indexOld] = undefined;
					circleNext[i] = key;
					fnO1.setCircle(toCircle);
					funnelViz.updateCircle(fnO1.getSelector(), toCircle);
					//console.log('funnelItem set to circle: ' + fnO1.getCircle());	
					break;
				} else {
					count++;
				}
			}
			if(count == circleNext.length){
				var allVotes = {};
				for(var i = 0; i < circleNext.length; i++){
					allVotes[circleNext[i]] = funnelList.getItem(circleNext[i]).votes;
				}
				var sortable = [];
				for(var key in allVotes){
					sortable.push([key, allVotes[key]]);
				}
				sortable.sort(function(a,b){return a[1]-b[1]});
				
				if(sortable.length == 1){
					//console.log('pick first in sortable (with lowest votes)');
					var key2 = sortable[0][0];
				} else {
					var sameVotes = 0;
					for(var i = 0;i<sortable.length;i++){
						if((i+1) == sortable.length){break;}
						else {
							if(sortable[i][1] == sortable[(i+1)][1]){
								sameVotes++;
							}
						}
					}
					if(sameVotes > 0){
						var r = randomFromTo(0, sameVotes);
						console.log('same votes found, pick random: ' + r);
						var key2 = sortable[r][0];
					} else {
						//console.log('pick first in sortable (with lowest votes)');
						var key2 = sortable[0][0];
					}
				}
				
				indexNext = circleNext.indexOf(key2);
				var fnO2 = allItems['key_' + key2];
				console.log("switch: " + fnO1.getKey() +" with "+fnO2.getKey());
				fnO2.setCircle(circle);
				circleOld[indexOld] = key2;
				funnelViz.updateCircle(fnO2.getSelector(), circle);
				fnO1.setCircle(toCircle);
				circleNext[indexNext] = fnO1.getKey();
				funnelViz.updateCircle(fnO1.getSelector(), toCircle);
				
				console.log(allVotes);
				console.log(sortable);

			}
			//console.log(circleSlots);			
					
		},
		/**
		 *  Removes an item from the funnelList and from allItems
		 *  boolean Returns if succesful yes/no
		 *
		 *	@param key int The ID of the funnelItem as in funnelList
		**/
		removeItem : function(key){
			console.log("remove item with key: " + key);
			var fnO = allItems['key_' + key];
			if(fnO){
			    funnelViz.destroySingle(allItems['key_' + key].getSelector());
			    funnelList.removeItem(key);
			    var circle = allItems['key_' + key].getCircle();
			    var index = circleSlots['circle_' + circle].indexOf(key);
			    circleSlots['circle_' + circle][index] = undefined;
			    delete allItems['key_' + key];
			    console.log(allItems);
			    console.log(circleSlots);
			    console.log(funnelList);
			    return true;
			} else {
			    return false;
			}
		},
		/**
		 *  Vote for an item inside the Funnel
		 *  boolean Return (un)succesful
		 *
		 *	@param value int The amount of votes given to the item
		 *  @param string key The funnelItem ID
		**/
		voteItem : function(value, key){
		    if(value && key){
		        var funnelItem = funnelList.getItem(key);
		        funnelItem.votes += value;
		        funnelViz.showVote(value, allItems['key_' + key].getSelector())
		        console.log(funnelItem.votes);
		        return true;
		    } else {
		        return false;
		    }
		},
		/**
		 *  int Returns The amount of circles the funnel consists of
		 *
		**/
		getCircles : function(){
			return circles;
		},
		/**
		 *  object Returns funnelVar as in allItems
		 *
		 *	@param key int The ID as a property in allItems
		**/
		getFunnelItem : function(key){
			return allItems['key_' + key];
		},
		/**
		 *  object Returns funnelItem as in funnelList
		 *
		 *	@param key int The ID as a property in allItems
		**/
		getFunnelListItem : function(key){
			return funnelList.getItem(key);
		},
		/**
		 *  int Returns The total funnel size (in pixels)
		 *
		**/
		getFunnelWidth : function(){
			return funnelWidth;
		},
		/**
		 *  array Returns The circle given with all items in it
		 *
		 *  @param circle int The circle to return
		**/
		getFunnelItemsAtCircle : function(circle){
			return circleSlots['circle_' + circle];
		}
	}	
})();

/**
 *	The funnelVar is a seperate Object that will be created when a funnelItem is created in funnelList. 
 *	funnelVar holds the ID of the funnelItem as it is in funnelList. funnelVar holds an object called 'element'.
 *	This object contains the funnelItem selector and circle it currently is at.
 *
 *	@constructor funnelVar
 *	@example var funnelObject = funnelVar();
**/
var funnelVar = function(){
	var key, element = {}; // selector / circle
	
	return{
		/**
		 *	This method sets up the element object that gets returned after building it in the DOM
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
		}
	}	
};

/******************||**||**|||**|||**||*****************************
*******************||**||**||*||*||**||*****************************
*******************||||||**||****||**|||||**************************/

 /*
 @startuml protocol_funnel_addItem.png
 group Adding an Item to the funnel
    PartyCollection -> Funnel: addItem(itemID)
    Funnel -> VisualFunnel: renderSingle(key)
 
    VisualFunnel --> Funnel: return element
    Funnel --> PartyCollection: return key/false
 end
 @enduml
 */
 
 /*
 @startuml protocol_funnel_removeItem.png
 group Removing an Item from the funnel
    PartyCollection -> Funnel: removeItem(key)
    Funnel -> VisualFunnel: destroySingle(key)
 
    Funnel --> PartyCollection: return boolean
 end
 @enduml
 */
 
  /*
 @startuml protocol_funnel_voteItem.png
 group Voting for an Item
    PartyCollection -> Funnel: voteItem(value, key)
    Funnel -> VisualFunnel: showVote(value, selector)
 
    Funnel --> PartyCollection: return boolean
 end
 @enduml
 */


