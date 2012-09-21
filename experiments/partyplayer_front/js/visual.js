//visual engine
//define parent class for collection/playlist classes
var visual = function(){
	var classKey = "selected";
	var popups = []; //holds all popups on screen
	var running = false; //is popup "remover" running?
	var that = {};
	
	//popup remover function, adds fadeout and removes popups on a set interval
	var emptyPopups = function(){
		//console.log("popup remover called");
		if(!running){
			//console.log("popup remover start");
			running = true;
			var timer = setInterval(function(){
				var element = popups.shift();
				$(element).fadeOut("slow", function(){
					//console.log("element removed");
    				$(this).remove();
    			});
				if(popups.length == 0){
					clearInterval(timer);
					running = false;
				}
			}, 2000);
		}
	}
	
	that.item = {
		isSelected : function(element){
			var sel;
			if(element.hasClass(classKey)){
				sel = true;
			} else {
				sel = false;
			}
			return sel;
		},
		select : function(element){
			//console.log('select item called');
			element.addClass(classKey);
		},
		deselect : function (element){
			//console.log('deselect item called');
			element.removeClass(classKey);
		}
	};
	that.sidebar = {
		show : function(element){
			console.log("show sidebar");
			var item = myColl.getItembyHTML(element);
			$("ul#infolist").html(
				"<li>item version: " + item.item.version + "</li>" +
				"<li>filename: " + item.item.filename + "</li>" +
				"<li>title: " + item.item.title + "</li>" +
				"<li>artist: " + item.item.artist + "</li>" +
				"<li>mediatype: " + item.item.mediatype + "</li>" +
				"<li>mimetype: " + item.item.mimetype + "</li>" +
				"<li>screenshot: " + item.item.screenshot + "</li>" +
				"<li>screenshotURI: " + item.item.screenshotURI + "</li>" +
				"<li>duration: " + item.item.duration + "</li>" +
				"<li>contentType: " + item.item.contentType + "</li>" +
				"<li>contentSrc: " + item.item.contentSrc + "</li>" +
				"<li>URI: " + item.item.URI + "</li>" +
				"<li>src: " + item.item.src + "</li>" +
				"<li>OWNER: " + item.userID + "</li>" +
				"<li>ITEMID: " + item.itemID + "</li>"
			);
			//set id for later use (when passing object to playlist)
			$("button.playlistadd").attr('_contentid', item.itemID);
			$("button.playlistadd").off("click");//first remove any previously attached clicks
			$("button.playlistadd").on("click", function(){
				var item = myColl.getItembyHTML($(this));
				funnel.addItem(item);
			});
		},
		hide : function(){
			console.log("hide sidebar");
			$("ul#infolist").html("");
		}
	};
	that.popup = function(text, type){//type= 0:delete/1:add/2:now playing
		console.log("popup called");
		var liClass = "";
		switch(type){
			case 0:
				liClass = "delete";
				break;
			case 1:
				liClass = "add";
				break;
			case 2:
				liClass = "playing";
				break;
		}
		var popupLi = "<li class=" + liClass + ">" + text + "</li>";
		popups.push($(popupLi).appendTo('ul#eventlist'));
		emptyPopups();
	};
	
	return that;
}
/**********************************************
//define visual collection with parent visual
***********************************************/
var visualCollection = function(){
	var old = "";
	var that = visual();
	
	var selection = function(e){
		if(!that.item.isSelected($(this))){
			that.item.select($(this));
			if(old != ""){that.item.deselect(old);}
			old = $(this);
			that.sidebar.show($(this));
		} else {
			that.item.deselect($(this));
			old = "";
			that.sidebar.hide();
		}
	};
	
	that.renderAll = function(){
		console.log("(re)rendering all items...");
		var collArray = myColl.getCollection();
		$("ul#partylist").html("");//emtpy partylist
		for(var i = 0; i < collArray.length; i++){
			console.log("rendering item");
			$("<li _contentid=" + collArray[i].itemID + "><img src=" + collArray[i].item.screenshot +
			">" + collArray[i].item.filename + "</li>").appendTo("#partylist")
			.click(selection);
		}
	};
	that.renderSingle = function(item, callback){
		console.log("render single item");
		$("<li _contentid=" + item.itemID + "><img src=" + item.item.screenshot +
		">" + item.item.filename + "</li>").appendTo("#partylist")
		.click(selection);
	};
	return that;
}
/***************************************************
//define visual playlist with parent visual
***************************************************/
var visualPlaylist = function(){
	var counter = 0; 
	var that = visual();
	
	that.addSingle = function(item){
		//console.log("show HTML item playlist");
		counter++;
		$("<div id=pl_" + counter + " class=partylistitem>" +
			"itemID: " + item.itemID + "<br/>" +
			"filename: " + item.item.filename + "<br/>" +
			"artist: " + item.item.artist + "<br/>" +
			"mediatype: " + item.item.mediatype + "<br/>" +
		"</div>").appendTo("#queue").addClass(item.item.mediatype);
		return "pl_" + counter;
	};
	
	that.highlight = function(selector){
		console.log("adding class...");
		$("#" + selector).addClass("highlight");
	};
	
	that.removeSingle = function(selector){
		$("#" + selector).remove();
		counter--;
	};
	return that;
}

var visualPlayback = function(){
	var that = visual();
	
	that.currentPlaying = function(item){
		$("#playback p.info").html("<span>title: " + item.item.title + "<br/>" +
		"artist: " + item.item.artist + "<br/>" +
		"mediatype: " + item.item.mediatype + "<br/>" + 
		"itemID: " + item.itemID + "<br/>" + 
		"</span>");
	}
	
	return that;
}
/**************************************************
//define visual funnel with parent visual
**************************************************/
var visualFunnel = function(){
	var slots = funnel.getSlots();
	var that = visual();
	
	that.setupFunnelSlots = function(){
		for(var i = 0; i < slots; i++){
			$("<div id=f_" + i + " class=funnelslot></div>").appendTo("#funnel");
		}
	};
	
	that.addSingle = function(item, slot){
		$("<div class=" + slot + " _contentid=" + item.itemID + ">" +
				"filename: " + item.item.filename + "<br/>" +
				"mediatype: " + item.item.mediatype + "<br/>" +
				"itemID: " + item.itemID + "<br/>" +
				"slot: " + slot +
				"<button class=voteadd slot=" + slot + ">vote +50</button>" +
				"<button class=votedel slot=" + slot + ">vote -50</button>" +
				"</div>").appendTo("#funnel .addeditems");
		$("<div class=funnelitem _contentid=" + item.itemID + ">" +
			"id: "+ item.itemID + "<br/>" +
			"name: " + item.item.filename + "<br/>" +
			"artist: " +item.item.artist + "<br/>" +
			"mediatype: " +item.item.mediatype + "<br/>" +
		"</div>").appendTo("#f_" + slot)
		.css("opacity", "0")
		.transition({x: "100px", opacity: 100});
		
		
		$("button.voteadd").off("click");
		$("button.voteadd").on("click", function(){
			slot = $(this).attr("slot");
			var fnI = funnel.getItembySlot(slot);
			fnI.updateHP(50);
		});
		$("button.votedel").off("click");
		$("button.votedel").on("click", function(){
			slot = $(this).attr("slot");
			var fnI = funnel.getItembySlot(slot);
			fnI.updateHP(-50);
		});
	};
	that.fallSingle = function(id, slot){
		element = $("#f_" + slot + " div[_contentid=" + id +"]");
		console.log("move it!");
		$(element).transition({y: '+=100'});
	};
	that.alertItem = function(id, slot, time){
		element = $("#f_" + slot + " div[_contentid=" + id +"]");
		$(element).effect("pulsate", {times:1}, time/2);
	};
	that.removeSingle = function(id, slot){
		$("div[_contentid=" + id + "]." + slot).remove();
		element = $("#f_" + slot + " div[_contentid=" + id +"]");
		$(element).transition({scale: "1.5", opacity: 0}, function(){
			this.remove();
		});
	};
	return that;
}
var myVisual = visual();
var myVisColl = visualCollection();
var myVisFun = visualFunnel();
var myVisPlay = visualPlaylist();
var myVisBack = visualPlayback();
