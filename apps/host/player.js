var player = (function(){
    var audioPlayer;

	return{
		getSong : function(){
			var theCircle;
			var key;
			for(var i = 0; i < funnel.getCircles(); i++){
				var currentCircle = funnel.getFunnelItemsAtCircle(i+1);
				for(var j = 0; j < currentCircle.length; j++){
					if(typeof currentCircle[j] === 'undefined'){
						console.log('no item found')
					}else{
						console.log('item found at slot: ' + i);
						theCircle = i+1;
						key = currentCircle[j];
						break;
					}
				}
				if(theCircle){break;}
			}
			if(!theCircle){return};
			var funnelItem = funnel.getFunnelListItem(key);
		    var item = pc.getItem(funnelItem.itemID);
		    playerViz.updatePlayer(item.item.url);
		}
	}
})();
