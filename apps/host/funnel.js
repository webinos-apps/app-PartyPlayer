//augment object with size function tp count the numbers of properties
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(document).ready(function(){
	funnelViz.setupCircles(1300, funnel.getCircles());
	funnel.addItem(2);
});

var funnel = (function(){
	//note: key == ID in collection
	var funnelWidth = 1200;
	var funnelList = new Collection("Funnel");
	var allItems = {};
	var maxItems = 10;
	var circles = 6;
	
	return{
		addItem : function(id){
			var count = 0;
			if(Object.size(allItems) < maxItems){
				console.log("add item to circle");
				var funnelItem = new partyplayer.FunnelItem(id, 100);
				var key = funnelList.addItem(funnelItem);
				var fnO = funnelObject();
				allItems['key_' + key] = fnO;
				fnO.init(key);
			}
			console.log(allItems);
			console.log(funnelList);
			
		},
		removeItem : function(slot){
			console.log("removing item at slot: " + slot);
			var funnelObject = funnelSlots[slot];
			var key = funnelObject.getKey();
			funnelObject.stop();
			funnelList.removeItem(key);
			funnelSlots[(slot)] = null;
			console.log(funnelSlots);
			console.log(funnelList);
		},
		getCircles : function(){
			return circles;
		},
		getFunnelItem : function(key){
			return allItems['key_' + key];
		},
		getFunnelWidth : function(){
			return funnelWidth;
		}
	}	
})();

var funnelObject = function(){
	var key, element = {}; // selector / circle
	
	return{
		init : function(newKey){
			key = newKey;
			element = funnelViz.renderSingle(key);
		},
		setCircle : function(circle){
			element.circle = circle;
		},
		getKey : function(){
			return key;
		},
		getSelector : function(){
			return element.selector;
		},
		getCircle : function(){
			return element.circle;
		}
	}	
}

