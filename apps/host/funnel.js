//augment object with size function tp count the numbers of properties
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(document).ready(function(){
	funnelViz.setupCircles(1500, funnel.getCircles());
	//funnel.addItem(2);
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
			} else {
				console.log("funnel full");
			}
			console.log(allItems);
			console.log(funnelList);
			
		},
		removeItem : function(key){
			console.log("remove item with key: " + key);
			var fnO = allItems['key_' + key];
			funnelViz.destroySingle(fnO.getSelector());
			funnelList.removeItem(key);
			delete allItems['key_' + key];
			console.log(allItems);
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

