$(document).ready(function(){
	funnelViz.setupSlots(funnel.getSlots());
	funnel.init();
});

var funnel = (function(){
	//note: key == ID in collection
	var funnelList = new Collection("Funnel");
	var funnelSlots = [];
	var slots = 6;
	var timeout = 1000;
	
	return{
		init : function(){
			//stub function to fill up funnellist with funnelitems
			for(var i = 0; i < 5; i++){
				var funnelItem = new partyplayer.FunnelItem((i+1)*10, 100);
				var key = funnelList.addItem(funnelItem);
				var funnelObject = funnelTimer(timeout, key, i);
				funnelSlots.push(funnelObject);
				funnelViz.renderSingle(key, i);				
			}
			console.log(funnelSlots);
			console.log(funnelList);
		},
		addItem : function(id){
			var count = 0;
			for(var i = 0; i < slots; i++){
				if(funnelSlots[i] == null){
					console.log("add item at pos: " + i);
					var funnelItem = new partyplayer.FunnelItem(id, 100);
					var key = funnelList.addItem(funnelItem);
					var funnelObject = funnelTimer(timeout, key, i);
					funnelObject.start();
					funnelSlots[i] = funnelObject;
					funnelViz.renderSingle(key, i);
					break;
				} else {
					count++;
				}
			}
			if(count == slots){
				console.log("funnel full");
			}
			console.log(funnelSlots);
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
		getSlots : function(){
			return slots;
		},
		getFunnelItem : function(slot){
			return funnelSlots[slot];
		}
	}	
})();

var funnelTimer = function(time, key, slot){
	this.time = time;
	this.key = key;
	this.slot = slot;
	var timeID;
	var falls = 7;
	
	var faller = function(){
		if(falls > 0){
			funnelViz.fallSingle(slot);
			timeID = setTimeout(faller, time);
			falls--;
		} else {
			console.log("end");
		}
	}
	
	return{
		start : function(){
			timeID = setTimeout(faller, time);
		},
		stop : function(){
			clearTimeout(timeID);
		},
		getKey : function(){
			return key;
		}
	}
}

