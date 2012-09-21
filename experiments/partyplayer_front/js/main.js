
//get youtube API
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//gets called when youtube API is ready
function onYouTubeIframeAPIReady() {
	myPlaylist.APIready();
	console.log("youtube API ready");
}

$(document).ready(function(){
	myColl.setupCollection();
	myVisFun.setupFunnelSlots();
	//myColl.addItem({"itemID" : 4, "userID" : "10" , "item" : {"screenshot" : "", "filename" : "asdfasdf"}});
	//$("#funnelitem").animate({path : new $.path.bezier(bezier_params)}, 4000)
	//$("#funnelitem").animate({path : new $.path.arc(arc_params)}, 5000)
});
var arc_params = {
    center : [200,200],
	   radius : 20 * -10,
	   start : 0,
	   end   : -360 * 2,
	   dir : -1
 };
var bezier_params = {
	start : {
		x : 100,
		y : 100,
		angle : 0, //control point angle relative to line between start & end
		length: 0.5 //control point line percent relative to length of line between start & end (larger = bigger curve)
	},
	end : {
		x : 800,
		y : 100,
		angle: 0,
		length : 2.0
	}
};

