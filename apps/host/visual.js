//main visual engine

//constructor visual
var visual = function(name, selector){
	this.name = name;
	this.selector = selector; 

	var that = {};
	
	that.getSelector = function(){
		return selector;
	};
	that.getName = function(){
		return name;
	};
	that.replaceSelector = function(newSelector){
		selector = newSelector;
		return selector;
	};
	
	return that;
}

var visualFunnel = function(name, selector){
	var that = visual(name, selector);
	
	that.setupSlots = function(slots){
		for(var i = 0; i<slots; i++){
			$('<div slot=' + i + '></div>').appendTo(selector);
			$('<div waitslot=' + (i+1) + '>' + (i+1) + ': </div>').appendTo('div#waitlist');
		}
	};
	that.renderSingle = function(id, slot){
		//get item from collection here
		$('<div _itemID=' + id + '>itemID: ' + id + '</div>').appendTo('div[slot=' + slot + ']'); 
	};
	that.fallSingle = function(slot){
		console.log("fall item at " + slot);
		var element = $('div[slot=' + slot + ']').children();
		$(element).transition({y : '+=50px'}, 500, 'in');
	}
	
	return that;
}

var funnelViz = visualFunnel("VisualFunnel", 'div#funnel');
