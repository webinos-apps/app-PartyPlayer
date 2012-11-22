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

var testKey = [];

$(document).ready(function(){
	
	funnelViz.setupCircles(1200, funnel.getCircles());
	funnel.init();
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
	
	return{
		/**
		 *  Initialize function to setup circle slots.
		**/
		init : function(){
			for(var i = 0; i<circles; i++){
				circleSlots['circle_' + (i+1)] = new Array(i+1);
			}
			circleSlots.circle_5 = ['x', 'x', 'x', 'x', 'x'];
			console.log(circleSlots);
		},
		/**
		 *	Updates the given maximum for a given circle
		 *
		 *	@param circle The circle to change the maximum of slots for
		 *	@param maximum The new number of maximum items to hold 
		**/
		updateMaxSlots : function(circle, maximum){
			circleSlots['circle_' + circle].length = maximum;
			console.log(circleSlots);
		},
		/**
		 *  Add an item to the funnel. Creates a funnelItem (for in funnelList) and funnelVar 
		 *	(for in allItems), with the property as the key of the funnelItem in funnelList
		 *
		 *  @param id The ID of a partyItem  
		**/
		addItem : function(id){
			var count = 0;
			for(var i = 0; i<circleSlots['circle_' + circles].length; i++){
				if(typeof circleSlots['circle_' + circles][i] === 'undefined'){
					console.log("add item to circle");
					var funnelItem = new partyplayer.FunnelItem(id, 100);
					var key = funnelList.addItem(funnelItem);
					testKey.push(key);
					var fnO = funnelVar();
					allItems['key_' + key] = fnO;
					circleSlots['circle_' + circles][i] = key;
					fnO.init(key);
					break;
				} else {
					count++;
				}
			}
			if(count == circleSlots['circle_' + circles].length){
				console.log('funnel full');
			}
			console.log(allItems);
			console.log(circleSlots);
			console.log(funnelList);
		},
		/**
		 *  //buggy --
		 *	Checks the total circle holding space, if full switch with object in 
		 *	next or previous circle, else simply add the item to the next or previous circle
		 *	
		**/
		switchCircle : function(key, goNext){
			//first check if next circle has undefined slots
			//if yes add myself to undefined position
			//if no switch myself with first item in next circle

			var fnO1 = allItems['key_' + key];
			var circle = fnO1.getCircle();
			var circleOld = circleSlots['circle_' + circle];
			var toCircle;
			if(typeof goNext === 'boolean'){
				switch(goNext){
					case true: 
						toCircle = circle-1;
						break;
					case false:
						toCircle = circle+1;
						break;
					default:
						toCircle = circle-1;
						break;	
				}
			} else {
				return "ERROR: no boolean for goNext found";
			}
			
			var circleNext = circleSlots['circle_' + toCircle];
			var indexOld = circleOld.indexOf(key);
			var count = 0;
			
			for(var i = 0; i < circleNext.length; i++){
				if(typeof circleNext[i] === 'undefined'){
					circleOld[indexOld] = undefined;
					circleNext[i] = key;
					fnO1.setCircle(toCircle);
					console.log(fnO1.getCircle());	
					break;
				} else {
					count++;
				}
			}
			if(count == circleNext.length){
				//make for loop to get votes
				var allVotes = {};
				for(var i = 0; i < circleNext.length; i++){
					allVotes[circleNext[i]] = funnelList.getItem(circleNext[i]).votes;
				}
				var sortable = [];
				for(var key in allVotes){
					sortable.push([key, allVotes[key]]);
				}
				sortable.sort(function(a,b){return a[1]-b[1]});
				/*
				var key2 = circleNext[0]; //make randomized number
				var fnO2 = allItems['key_' + key2];
				console.log("switch: " + fnO1.getKey() +" with "+fnO2.getKey());
				fnO2.setCircle(circle);
				circleOld[indexOld] = key2;
				fnO1.setCircle(toCircle);
				circleNext[0] = key;
				*/
			}
			console.log(allVotes);
			console.log(circleSlots);			
					
		},
		/**
		 *  Removes an item from the funnelList and from allItems
		 *
		 *	@param key The ID of the funnelItem as in funnelList
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
		**/
		getCircles : function(){
			return circles;
		},
		/**
		 * Returns funnelVar as in own allItems
		 *
		 *	@param key The ID as a property in allItems
		**/
		getFunnelItem : function(key){
			return allItems['key_' + key];
		},
		getFunnelListItem : function(key){
			return funnelList.getItem(key);
		},
		/**
		 *  Returns the total funnel size (in pixels)
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
 *	@example var funnelObject = funnelVar();
**/
var funnelVar = function(){
	var key, element = {}; // selector / circle
	
	return{
		/**
		 *	Initializes the funnelVar to setup its key (as it is in funnelList).
		 *	this method also sets up the element object that gets returned after building it in the DOM
		 *
		 *	@param newKey The key from the funnelItem in funnelList
		**/
		init : function(newKey){
			key = newKey;
			element = funnelViz.renderSingle(key);
		},
		/**
		 *	Sets the circle this Item is at in the element Object
		 *
		 *	@param circle Circle number to be set to
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

