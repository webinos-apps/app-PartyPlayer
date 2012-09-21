
/**
 * Example items with associative array and JSON notation.
 *
 *
 **/

var item = {};
item.version = 1; "item version"
item.filename="michael jackson - bad.mp3";
item.title="Bad";
item.artist="Michael Jackson";
item.mediatype="audio"; //[audio|video|image|.....]
item.mimetype="audio/mp3"; // mime type, see RFC ....
item.screenshot="base64/???"; //base64 encoded screenshot or thumbnail
item.screenshotURI="http://youtube.com/screenshot.png" // screenshot url
item.duration="00:03:55";   "hh:mm:ss"
item.contentType="onDemand"; // [live|ondemand|
item.contentSrc="file"; // [file, stream]
item.URI =""; //uri path to item ?? 
item.src = "      "; // [youtube, mediaserver, spotify, camera, microfone, phone, webserver] string



var item2 = {};
item2.version = 2; "item version"


var myJSONText = JSON.stringify(item);


//exports.item1 = item;
//exports.item2 = item2;

//console.log(item.title);
//console.log(item);


testArray = [item, item2]


//console.log("myjsontext = "+myJSONText);
var myJSONText = JSON.stringify(testArray);
//console.log(myJSONText);




//item5=JSON.parse(myJSONText);
//console.log(item5.title);
