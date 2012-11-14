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
};

$(document).ready(function(){
	funnelViz.setupCircles(1200, funnel.getCircles());
	funnel.init();
});

/**
 *	The funnel is a closure, meaning it returns an object containg methods, self initialized.
 *	These methods are used to communicate with the funnel.
 *	The funnel uses mainly 2 vars: the funnelList as a Collection, and an Object called allItems.
 *	allItems uses the generated key(ID) from the funnelList. This ID gets created when an Item gets added to the funnelList.
 *	This key is a property in allItems, attached to the property is a funnelVar(see funnelVar).
 * 
 *	@constructor funnel
**/
var funnel = (function(){
	//note: key == ID in collection
	var funnelWidth = 500;
	var funnelList = new Collection("Funnel");
	var allItems = {};
	var circleSlots = {};
	var maxItems = 10;
	var circles = 6;
	
	return{
		/**
		 *  Initialize function to setup circle slots 
		 *
		 *	@function init  
		**/
		init : function(){
			for(var i = 0; i < circles; i++){
				circleSlots['circle_' + (i+1)] = new Array(i+1);
				console.log();
			}
			console.log(circleSlots);
		},
		/**
		 *  Add an item to the funnel. Creates a funnelItem (for in funnelList) and funnelVar 
		 *	(for in allItems), with the property as the key of the funnelItem in funnelList
		 *
		 *	@function addItem
		 *  @param id the ID of a partyItem  
		**/
		addItem : function(id){
			var count = 0;
			if(Object.size(allItems) < maxItems){
				console.log("add item to circle");
				var funnelItem = new partyplayer.FunnelItem(id, 100);
				var key = funnelList.addItem(funnelItem);
				var fnO = funnelVar();
				allItems['key_' + key] = fnO;
				fnO.init(key);
			} else {
				console.log("funnel full");
			}
			console.log(allItems);
			console.log(funnelList);
			
		},
		/**
		 *  //buggy
		 *	Checks the total circle holding space, if full switch with object in 
		 *	next or previous circle, else simply add the item to the next or previous circle
		 *	
		 *	@function switchCircle  
		**/
		switchCircle : function(key){
			//first check if next circle has undefined slots
			//if yes add myself to undefined position
			//if no switch myself with first item in next circle
			var fnO1 = allItems['key_' + key];
			var circle = fnO1.getCircle();
			var circleNext = circleSlots['circle_' + (circle-1)];
			var count = 0;
			for(var i = 0; i < circleNext.length; i++){
				if(typeof circleNext[i] === 'undefined'){
					console.log("add to next circle");	
					circleNext[i] = fnO1;
					fnO1.setCircle(circle-1);
					console.log(fnO1.getCircle());	
					break;
				} else {
					count++;
				}
			}
			if(count == circleNext.length){
				var fnO2 = circleSlots['circle_' + (circle-1)][0];
				console.log("switch: " + fnO1 +" with "+fnO2);
				
			}
			console.log(circleSlots);							
		},
		/**
		 *  Removes an item from the funnelList and from allItems
		 *
		 *	@function removeItem
		 *	@param key the ID of the funnelItem as in funnelList
		**/
		removeItem : function(key){
			console.log("remove item with key: " + key);
			funnelViz.destroySingle(allItems['key_' + key].getSelector());
			funnelList.removeItem(key);
			delete allItems['key_' + key];
			console.log(allItems);
			console.log(funnelList);
		},
		/**
		 *  Returns the amount of circles the funnel consists of
		 *
		 *	@function getCircles  
		**/
		getCircles : function(){
			return circles;
		},
		/**
		 * Returns funnelVar as in own allItems
		 *
		 *	@function getFunnelItem  
		 *	@param key the ID as a property in allItems
		**/
		getFunnelItem : function(key){
			return allItems['key_' + key];
		},
		/**
		 *  Returns the total funnel size (in pixels)
		 *
		 *	@function getFunnelWidth
		 *  
		**/
		getFunnelWidth : function(){
			return funnelWidth;
		}
	}	
})();

/**
 *	The funnelVar is a seperate Object that will be created when a funnelItem is created in funnelList. 
 *	funnelVar holds the ID of the funnelItem as it is in funnelList. funnelVar holds an object called 'element'.
 *	This object contains the funnelItem selector and circle it currently is at.
 *
 *	@constructor funnelVar
**/
var funnelVar = function(){
	var key, element = {}; // selector / circle
	
	return{
		/**
		 *	Initializes the funnelVar to setup its key (as it is in funnelList).
		 *	this method also sets up the element object that gets returned after building it in the DOM
		 *
		 *	@param newKey the key from the funnelItem in funnelList
		**/
		init : function(newKey){
			key = newKey;
			element = funnelViz.renderSingle(key);
		},
		/**
		 *	Sets the circle this Item is at in the element Object
		 *
		 *	@param circle circle number to be set to
		**/
		setCircle : function(circle){
			element.circle = circle;
		},
		/**
		 *	Returns the key of the Item
		**/
		getKey : function(){
			return key;
		},
		/**
		 *	Returns the selector the element Object
		**/
		getSelector : function(){
			return element.selector;
		},
		/**
		 *	Returns the circle the Item is at
		**/
		getCircle : function(){
			return element.circle;
		}
	}	
};

