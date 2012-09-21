var setupItem = function(){
	
	var item = {}; //object
	item.version = 1; //item version
	item.filename="michael jackson - bad.mp3";
	item.title="Bad";
	item.artist="Michael Jackson";
	item.mediatype="audio"; //[audio|video|image|.....]
	item.mimetype="audio/mp3"; // mime type, see RFC ....
	item.screenshot=base64screenshot; //base64 encoded screenshot or thumbnail
	item.screenshotURI="http://youtube.com/screenshot.png" // screenshot url
	item.duration= "00:03:55";   //hh:mm:ss
	item.contentType="onDemand"; // [live|ondemand|
	item.contentSrc="file"; // [file, stream]
	item.URI ="RuAb-EohLN4"; //uri path to item ?? 
	item.src = ""; // [youtube, mediaserver, spotify, camera, microfone, phone, webserver] string
	
	var itemObject = {};
	itemObject.itemID;
	itemObject.userID = "10";
	itemObject.item = item;
	
	return itemObject;
}
