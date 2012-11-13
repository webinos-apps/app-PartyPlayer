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
	
	var startArc = function(selector, circle){
		console.log("start arc");
		var r = circle*step/2;
		var arc_params = {
			center: [funnelSize/2-75,funnelSize/2-25],
			radius: r,
			start: 180,
			end: -180,
			dir: -1
		};
		$(selector).animate({path : new $.path.arc(arc_params)}, 40000, function(){
			console.log("end of arc");
		});
	};
	
	that.setupCircles = function(funnel, maxCircles){
		funnelSize = funnel;
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
		var element = {};
		element.selector = 'div[_funnelItemID=' + key + ']';
		element.circle = allCircles;
		$('<div class="funnelObject" _funnelItemID=' + key + '>funnelItemID: ' + key + '</div>').appendTo('.funnelCircle[circle=0]');
		startArc(element.selector, allCircles);
		return element;
	};
	that.nextCircle = function(selector){
		console.log("stop current animation");
		$(selector).stop(true);
		var key = $(selector).attr('_funnelItemID');
		var circle = funnel.getFunnelItem(key).getCircle();
		circle--;
		funnel.getFunnelItem(key).setCircle(circle);
		startArc(selector, circle);
	};
	
	return that;
}

var funnelViz = visualFunnel("VisualFunnel", 'div#funnel');
