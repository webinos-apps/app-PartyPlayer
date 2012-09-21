//include PartyCollection.js

var party_col = require("../PartyCollection.js")
var item = require("../include/item_interface.js");
var utils = require("../include/utils.js");






function printItems(){
	//test: get Items
	items = c1.getItems(0);
	console.log(items.length +" items found");
	for (i=0;i<items.length;i++){
		console.log("ID="+items[i].itemID +" , user="+items[i].userID+", item: "+items[i].item.artist +" - "+items[i].item.title);
	}
}


//test HashFunctionality
var c1 = new party_col.PartyCollection("testCollection");
c1.addItem("Victor",item.item1);
c1.addItem("Victor",item.item1);
c1.addItem("Daryll", item.item1);
c1.addItem("Victor",item.item1);
c1.addItem("Daryll", item.item1);
c1.addItem("Arno", item.item1);
c1.addItem("Fabian", item.item1);
c1.addItem("Arno", item.item1);

printItems();


testItem1 =  c1.getItem(46);
testItem2 = c1.getItem(11);

console.log(testItem1);
console.log(testItem2);


printItems();
c1.removeItemByID(15);
printItems();
c1.removeItemByID(15);


//create two collections
var c2 = new party_col.PartyCollection("test2");
//c1.printName();
//c2.printName();




//test inserting (in)valid items
var testJSONString = JSON.stringify(item.item1);
//console.log(testJSONString);
var testItem = party_col.JSONtoItem(testJSONString);
if (testItem != null){
	console.log("item supported");
}
 
//test valid item, but invalid version
var testItem = party_col.JSONtoItem(JSON.stringify(item.item2));
if (testItem != null){
	console.log("item supported");
}

//test invalid item
var testItem = party_col.JSONtoItem("onzin");
if (testItem == null){
	console.log("item not supported");
}


item3 = new utils.cloneObject(item.item1);
item4 = new utils.cloneObject(item.item1);
item5 = new utils.cloneObject(item.item1);
item3.title = "Thriller";
item4.artist = "Britney Spears";
item4.title = "Oops";

item5.title = "randomrecorderdvideo";
item5.artist = "unknown";
item5.mediatype="video"
item5.mimetype="video/mp4"

c1.addItem("Arno", item3);
c1.addItem("Bas", item.item1);
c1.addItems("Bas",[ item.item1, item3, item4]);

printItems();



//test: getUsers: see which users have provided content

console.log("##########Test: getUsers() ######################");
users = c1.getUsers();
console.log(users);
userItems = c1.getItemCount();
console.log(userItems);

console.log("test removing Victors files");
c1.removeUserItems("Victor");
users = c1.getUsers();
console.log(users);


//test: remove a specific item from a specified user
if (c1.removeItem("Bas", item.item1)==true){
	console.log("succesfully removed item by Bas");
}
else{
	console.log("could not remove item");	
}




printItems();

console.log("\r\n\r\nPrinting all items by Bas");
items = c1.getItems("Bas","undefined");
//console.log(items);
for (i=0;i<items.length;i++){
	console.log(items[i].itemID+ " - "+items[i].userID+ " : "+items[i].item.artist +" - "+items[i].item.title);
}





printItems()


//test: removeVictors items;

items = c1.getItems(0);
console.log(items.length +" items found");
userItems = c1.getItemCount();
//console.log(items);
//var myJSONText = JSON.stringify(msg,replacer);
//var msg = JSON.parse(e.data)


console.log("Test filter");
var passed = party_col.filterItem(item.item1,{"mediatype":"audio", "mimetype":"audio/mp3"});
console.log("did I pass: (should be true) "+passed);

var passed = party_col.filterItem(item.item1,{"mediatype":"video", "mimetype":"audio/mp3"});
console.log("did I pass (should be false: "+passed);







//////////////////////////////////////////////////////////////
console.log("\r\n##########################################");
c2.addItem("Arno", item3);
c2.addItem("Arno", item4);
c2.addItem("Arno", item5);
items = c2.getItems(0);
console.log("length="+items.length);
console.log("Printing all items");
for (i=0;i<items.length;i++){
	console.log(items[i].item.artist +" - "+items[i].item.title);
}
console.log("\r\n\r\nPrinting all audio items");
items = c2.getItems(0,"test",{"mediatype":"audio", "mimetype":"audio/mp3"} );
for (i=0;i<items.length;i++){
	console.log(items[i].item.artist +" - "+items[i].item.title);
}

console.log("\r\n\r\nPrinting all video items");
items = c2.getItems(0,"test",{"mediatype":"video"} );
for (i=0;i<items.length;i++){
	console.log(items[i].item.artist +" - "+items[i].item.title);
}


console.log("\r\n Test filter");
var passed = party_col.filterItem(item3,{"mediatype":"audio", "mimetype":"audio/mp3"});
console.log("did I pass: (should be true) "+passed);
//test: getItems
items = c1.getItems(0,"test",{"mediatype":"audio", "mimetype":"audio/mp3"} );


console.log("\r\n Test add Multiple items at once");
nrOfitemsAdded = c2.addItems(0,[item3,item4,item.item2] );
console.log("Could add "+nrOfitemsAdded+" items");

//console.log("sending: "+myJSONText);
//Define a functional object to hold persons in javascript
