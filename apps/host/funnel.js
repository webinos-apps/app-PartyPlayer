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
	funnel.init();
});

var funnel = (function(){
	//note: key == ID in collection
	var funnelWidth = 1200;
	var funnelList = new Collection("Funnel");
	var allItems = {};
	var circleSlots = {};
	var maxItems = 10;
	var circles = 6;
	
	return{
		init : function(){
			for(var i = 0; i < circles; i++){
				circleSlots['circle_' + (i+1)] = new Array(2*i+1);
				console.log();
			}
			console.log(circleSlots);
		},
		addItem : function(id){
			var count = 0;
			if(Object.size(allItems) < maxItems){
				console.log("add item to circle");
				var funnelItem = new partyplayer.FunnelItem(id, 100);
				var key = funnelList.addItem(funnelItem);
				var fnO = funnelObject();
				fnO.init(key);
			} else {
				console.log("funnel full");
			}
			console.log(allItems);
			console.log(funnelList);
			
		},
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
		removeItem : function(key){
			console.log("remove item with key: " + key);
			funnelViz.destroySingle(allItems['key_' + key].getSelector());
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

