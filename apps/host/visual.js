//main visual engine
var visual = function(name, selector){
	var name = name;
	var selector = selector; 

	var that = {};
	
	that.getSelector = function(){
		return selector;
	}
	that.getName = function(){
		return name;
	}
	that.replaceSelector = function(newSelector){
		selector = newSelector;
		return selector;
	}
	
	return that;
}

var visualFunnel = function(name, selector){
	var that = visual(name, selector);
	
	return that;
}

var funnelViz = visualFunnel("VisualFunnel", "div#main");
