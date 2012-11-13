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
	var funnelSize, step, allCircles;
	var that = visual(name, selector);
	
	var startArc = function(key, circle){
		console.log("start arc");
		var r = (allCircles-circle)*step/2;
		console.log(r);
		var arc_params = {
			center: [r,r],
			radius: r,
			start: 180,
			end: -180,
			dir: -1
		};
		$('div[_funnelitemid=' + key + ']').animate({path : new $.path.arc(arc_params)}, 40000);
	};
	
	that.setupCircles = function(funnelSize, maxCircles){
		funnelSize = funnelSize;
		allCircles = maxCircles;
		step = funnelSize / maxCircles;
		circles = maxCircles;
		$('div#funnel').css({
			width: funnelSize,
			height: funnelSize
		});
		for(var i = 0; i < maxCircles; i++){
			$('<div class="funnelCircle" circle=' + i + '></div>').appendTo('div#funnel').css({
				width: (circles * step),
				height: (circles * step)
			});
			circles--;
		}
	};
	that.renderSingle = function(key){
		var element = $('<div _funnelItemID=' + key + '>');
		$('<div class="funnelObject" _funnelItemID=' + key + '>funnelItemID: ' + key + '</div>').appendTo('.funnelCircle[circle=0]');
		startArc(key, 0);
		
		return element;
	};
	
	return that;
}

var funnelViz = visualFunnel("VisualFunnel", 'div#funnel');
