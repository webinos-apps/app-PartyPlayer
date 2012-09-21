$(document).ready(function(){

	//Visual.state.setAlias();
	
	//set correct css file
	adjustStyle($(this).width());
	$(window).resize(function() {
	    adjustStyle($(this).width());
	});
	
	var getItem;
	$.getScript("js/create_collection.js", function() {
		var itemList = initItems();
		getItem = function(obj){
			var item = {};
				for(var i=0; i<itemList.length; i++){
					if(itemList[i].itemID == $(obj).attr('_contentid')){
						item.ID = itemList[i].itemID;
						item.user = itemList[i].userID;
						item.item = itemList[i].item;
					}
				}
			return item;
		}
		
		for(var i=0; i<itemList.length; i++){
			$("#partylist").append("<li _contentid=" + itemList[i].itemID + "><img src=" + itemList[i].item.screenshot +
			">" + itemList[i].item.filename + "</li>");
		};		
		
		$("#partylist li").on({click : function(){
			var item = getItem($(this));
			var sel = $(this).hasClass('selected'); //do we have selected class?
			//based on itemversion 1
			$("#infolist").html(
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
				"<li>OWNER: " + item.user + "</li>" +
				"<li>ITEMID: " + item.ID + "</li>"
			);
			//set id for later use (when passing object to playlist)
			$("button.playlistadd").attr('_contentid', item.ID);
			
			//if i'm owner of item, i'm able to delete
			if(item.user == Visual.state.getAlias()){
				$("button.colldel").attr('_contentid', item.ID);
				$("button.colldel").removeAttr('disabled');
				$("button.colldel").css('display', 'block');
			}
			
			//edit html + css itemselect + sidebar
			if(!sel){
				Visual.item.select($(this));
			} else {
				Visual.item.deselect($(this));
			}
		}});	
	});//end getscript

	$("button.playlistadd").click(function(){
		var item = getItem($(this));
		updateItem(item, Visual.event.playlistAdd);
	});
	
	$("button.colldel").click(function(){
		var item = getItem($(this));
		updateItem(item, Visual.event.collDel); 
	});
});

//load in new css file depending on browserwidth
function adjustStyle(width) {
	width = parseInt(width);
	if (width < 701) {
	    $("#size-stylesheet").attr("href", "css/collection_min.css");
	    console.log("min.css loaded");
	} else if ((width >= 701) && (width < 900)) {
	    $("#size-stylesheet").attr("href", "css/collection_mid.css");
	    console.log("mid.css loaded");
	} else {
	   $("#size-stylesheet").attr("href", "css/collection_full.css"); 
	   console.log("full.css loaded");
	}	
};	

function updateItem(item, callback){
	//wait for item to go across network, then call visual event
	var succeeded = true; //confirm("send item: " + item.ID +"?");
	
	if(succeeded){
		callback(item, Visual.state.getAlias());
	}
};

