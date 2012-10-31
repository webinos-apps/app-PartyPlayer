/*
 * Party Guest Demo
 */
$(document).ready(function(){

// init a2a-stub connection
	var channel = null;

    webinos.app2app.init('ws:localhost:10666/guest', function() {
        log('Connected to a2a stub server (as guest)');

        channel = webinos.app2app.createChannel('partyplayer', null, null, function() {
            log('Waiting for protocol implementation');
        });
    });
    
// init userName functionality
    userName.init();
});

var userName = {
	/*
	 *@startuml ../docs/figures/guest_add_to_host.png
	 * partyGuest->partyHost: userName
	 * partyHost->partyGuest: userId
	 * partyHost->partyGuest: collection
	 * @enduml
	 */	
	name: '',
	btnClick:function(event){
		var name = $('#aliasText').val();
		userName.name = name;
		//send userName to host
	    partyplayer.shareItem = function(item){
	        channel.send(JSON.stringify(name+" has joined the party!"));
	        //return: userId
	    };
		$('#aliasDiv').fadeOut(200, function(){
			$('#aliasDiv').remove();
			//after choosing an alias init mainMenu
			mainMenu.init();
		});
	},
	init:function(){	
		$('#guestApp').append('<div id="aliasDiv"><p>Alias:</p><input type="text" id="aliasText" value="<default Webinos ID>"/><button type="button" id="aliasButton">Alias</button></div>');
		$('#aliasButton').bind("click", userName.btnClick);
	}		
}

var mainMenu = {
	/*
	 * homeScreen will contain the following options:
	 * 		- "partyCollection" -(See what is already in the collection before you decide to do anything)
	 * 		- "Vote" -(See the current funnel and vote media items up and down)
	 * 		- partycollection and vote don't need their own buttons... mainMenu can be the current collection
	 * 		- "Share files with collection" -(Select files through the file API and add them to the partyCollection)
	 */
	addFiles: function(event){
		$('#homeMenu').fadeOut(200, function(){
			$('#homeMenu').remove();
			//init nextScreen
			addFiles.init();
		});
	},
	init:function(){
		//welcome message
		$('#guestApp').append('<p id="welcome">You are known as: '+userName.name+'</p>')
		//add Menu
		$('#guestApp').append('<ul id="homeMenu"></ul>');
		var homeMenuItems = '<li class="homeMenuItem"><button class="menuBtn">Collection</button></li>';
		homeMenuItems += '<li class="homeMenuItem"><button class="menuBtn">Vote</button></li>';
		homeMenuItems += '<li class="homeMenuItem" id="addFiles"><button class="menuBtn">Share</button></li>';
		$('#homeMenu').append(homeMenuItems);
		//addEvents
		$('#addFiles').bind("click", mainMenu.addFiles);
	}
}

var addFiles ={
	addList:[],
	appendToDom:function(tempList){
		//if there are no items in the list add a <ul> item and share buttton
		if(!$('#list').children().length){
			var newGuestList = '<ul id="guestAddList"><li>Media to Share:</li></ul>'; 
			$('#list').append(newGuestList);
			var newButtons = '<div id="share"><p class="title">Share With Party</p><button id="share" class="menuBtn">Share</button></div>';
			$('#guestApp').append(newButtons);
			$('#share').bind("click", shareFiles.init);	
		}
		var htmlList = '';
		for(var i=0; i<tempList.length; i++){
			var f = tempList[i];
			console.log(tempList[i]);
			htmlList+= '<li class="item">';
			htmlList+= '<strong>artist: </strong>'+f.Artist+' ';
			htmlList+= '<strong>title: </strong>'+f.Title+' ';
			htmlList+= '<strong>album: </strong>'+f.Album+' ';
			htmlList+= '<strong>name: </strong>'+f.name+' '
			htmlList+= '</li>';
			//add item to permanent list
			addFiles.addList.push(f);
		}
		$('#guestAddList').append(htmlList);
		
		//Change title to "Add more files"
		$('#inputDiv .title').text("Add more files");
	},
	parseFile: function(file, callback){
	    if(localStorage[file.name]) return callback(JSON.parse(localStorage[file.name]));
	}, 
	fileSelect:function(event) {
		var files = event.target.files;
	    var tempList=[];
		//parse ID3 tags and store in temporary list
		for(var i=0; i<files.length; i++){
			var name = files[i].name;
			/*
			*does not work in firefox... test with chrome 
			*TODO find better ID3v2 parser
			*/
			addFiles.parseFile(files[i],function(tags){      		       		
	       		tags.filename = files[i].name;
	       		tags.version = 1;
	       		tempList.push(tags);
			});
		}
		//add temporary list to DOM
		addFiles.appendToDom(tempList);
	},
	init:function(){
		//add input field to DOM
		$('#guestApp').append('<div id="inputDiv"><p class="title">Select Files</p><input type="file" accept="audio/*" id="files" name="" multiple /></div><output id="list"></output>');
		//bind fileSelect function to change
		$('#files').change(addFiles.fileSelect);
	}
}

var shareFiles={
	/*
	 *@startuml ../docs/figures/share_files.png
	 * partyGuest->partyHost: {userId, {artist, title, album, filename, filetype, etc..}}
	 * @enduml
	 */	
	share:function(item){
		partyplayer.shareItem = function(item){
			channel.send(JSON.stringify(
				{"type":"collection","cmd":"addItem","args":{"userID":alias.userName,"item":item}}
			));
			//example syntax: 
			//{"type":"collection","cmd":"addItem","args":{"userID":1,"item":{"version":1,"filename":"michael jackson - bad.mp3","title":"Bad","artist":"Michael Jackson","mediatype":"audio","mimetype":"audio/mp3","screenshot":"base64/???","screenshotURI":"http://youtube.com/screenshot.png","duration":"00:03:55","contentType":"onDemand","contentSrc":"file","URI":"","src":" "}}}
		};
	},
	init:function(){
		var shareLength = addFiles.addList.length;
		for(var i=0; i<shareLength; i++){
			shareFiles.share(addFiles.addList[i]);
		}
		//clear addList;
		addFiles.addList=[];
		//clear from DOM
		$('#guestAddList').remove();
		$('#share').remove();
		//added message
		var addMessage='<div id="added">Shared '+shareLength+' Files with Party Collection</div>';
		$('#guestApp').append(addMessage);
		$('#added').fadeOut(4000, function(){
			$('#added').remove();
		});
	}	
}

