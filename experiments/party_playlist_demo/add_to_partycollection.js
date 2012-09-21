/*Add Files to Party Collection*/


/*
 * Selecteer alleen MP3 files uit dezelfde map als de .html file
 * De file API geeft je geen toegang tot het volledige path van een mp3 
 * Dit gaan we later nog fixen / faken
 * 
 */

/*
 * TODO: knop maken die de playList naar de collectie stuurt
 * De player verder uitbouwen, volgende, vorige, en nummers poppen uit de array als ze klaar zijn
 * 
 */


window.onload=function(){
	// Check for browsersupport of HTML5 file API's
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		//initiate browse function
		addFiles.init(); 
	} else {
	  alert("Your browser doesn't support file API's");
	};	
};

var a2a = {
	init: function(){
        webinos.app2app.init('ws://localhost:10666/a2a-stub');
        //webinos.app2app.createChannel('urn:partyplayer', null, function(msg) { log(msg); });
    }, 
    create: function(){
        channel = webinos.app2app.createChannel(
            'urn:webinos.org:partyplayer', null, alwaysTrue,
            function handleMessage(payload) {
            	// payload is an object
                log('Received payload: ' + JSON.stringify(payload));
     	});
    }
}

/*
 * Dit is de playList die we straks via webinos en nu via websockets naar de centrale party collection sturen
 * Het is een array van objecten (elk playlist item is een object dat titel, auteur, album etc. bevat)
 */
var playList = [];

//function to add files to the playlist, begin bij init()
var addFiles = {
	appendToDom:function(templist){
		//if there are no items in the list add a <ul> item
		if(!$('#list').children().length){
			$('#list').append("<ul id='guestAddList'><li>Playlist:</li></ul>");
		}
		var htmlList = '';
		for(var i=0; i<templist.length; i++){
			var f = templist[i];
			htmlList+= '<li class="item">'
			htmlList+= '<strong>artist: </strong>'+f.Artist+' ';
			htmlList+= '<strong>title: </strong>'+f.Title+' ';
			htmlList+= '<strong>album: </strong>'+f.Album+' ';
			htmlList+= '<strong>name: </strong>'+f.name+' '
			htmlList+= '</li>'
			//add to main playList
			/*
			 * Hier worden objecten pas naar de echte playlist gepusht, zo krijg je nooit verschil tussen wat er op je scherm staat en wat er 
			 * daadwerkelijk in de playlist zit
			 */
			playList.push(f);
		}
		$('#guestAddList').append(htmlList);
		console.log(playList);
		/*
		 * Zet pas een player op het scherm als je ook iets hebt ok af te spelen, 
		 * NUiteindelijk speel je de muziek dus op een ander apparaat af
		 * 
		 */
		player.init();
	}, 
	parseFile: function(file, callback){
	    if(localStorage[file.name]) return callback(JSON.parse(localStorage[file.name]));
	    //ID3v2.parseFile(file,function(tags){
	      //callback(APIC);
	   // })
	},
	//fileSelect wordt aangeroepen als je via de file api mp3's selecteert      
	fileSelect:function(event) {
		var files = event.target.files;
	    //zet alles wat je selecteert in een tijdelijke lijst zodat je meerdere keren items aan de echte lijst kunt toevoegen
	    var tempList=[];
		for(var i=0; i<files.length; i++){
			var name = files[i].name;
			
			addFiles.parseFile(files[i],function(tags){
       		//add file name to object       		       		
       		tags.name = files[i].name;
       		//De library die de ID3Tags opvraagt doet het niet altijd, je krijgt pusht nu alleen de items die het wel doen. 
       		tempList.push(tags);
			});
		}
	//voeg de files uit de tempList toe aan de HTML
		addFiles.appendToDom(tempList);
	},
	init:function(){
		//add input field to DOM
		$('body').append("<input type='file' accept='audio/*' id='files' name='' multiple /><output id='list'></output>");
		//bind fileSelect function to change
		$('#files').change(addFiles.fileSelect);
	},
}

var player = {
	songEnds:function(event){
		player.next("01.mp3");
		//volgende stap is om de volgende file te spelen en de hudige uit de array te poppen
	},
	next:function(file) {
				
		document.getElementById('audio').src=file;
		document.getElementById('audio').play();
	}, 
	init:function(){
		//als nog geen audio
		if(!document.getElementById('audio')){
			//add audio
			audioHTMLTag = '<audio id="audio" controls>';
			audioHTMLTag += '<source src="'+playList[0].name+'" type="audio/mpeg" />';					    
			audioHTMLTag += '</audio>'
			audioHTMLTag += '<button>Next</button>';
			$('body').append(audioHTMLTag);
			//add events
			$('audio').bind('ended', player.songEnds);	
		}
	}
}
