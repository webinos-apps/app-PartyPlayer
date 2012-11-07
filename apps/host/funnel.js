$(document).ready(function(){
	funnel.init();
	
	console.log(funnelViz.getSelector());
});

var funnel = (function(){
	//note: funnelItemID == slot
	var funnelList = new Collection("Funnel");
	var funnelSlots = [];
	var slots = 6;
	
	return{
		init : function(){
			//stub function to fill up funnellist with funnelitems
			for(var i = 0; i < slots; i++){
				var funnelItem = new partyplayer.FunnelItem((i+1)*10, 100);
				var key = funnelList.addItem(funnelItem);
				funnelSlots.push(key);
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
					funnelSlots[i] = key;
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
			var key = funnelSlots[(slot)]
			funnelList.removeItem(key);
			funnelSlots[(slot)] = null;
			console.log(funnelSlots);
			console.log(funnelList);
		}
	}	
})();
