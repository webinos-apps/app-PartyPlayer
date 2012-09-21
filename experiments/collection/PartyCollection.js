//require("./include/utils.js");
//var hash = require("./include/hash.js");

/**
 * PartyCollection
 * -- libarary functionality for the Webinos Partyplayer demo
 * Martin Prins - TNO
 *
 **/


/** 
 * @TODO remove to utils libary
 */
Array.prototype.contains = function(k) {
    for(p in this)
        if(this[p] === k)
            return true;
    return false;
}

/**
 * Parse JSON string to Item object
 * @jsonString - the JSON notation of the item object
 * @returns the item, if JSON string could be parsed && version is supported, else null
 **/ 
function JSONtoItem(jsonString){
		
	try{
        	item=JSON.parse(jsonString);
	}catch(e){
		console.log(e); //error in the above string(in this case,yes)!
		return null;
	}
	//var item = JSON.parse(jsonString)
	if ("version" in item && item.version == 1){
		return item;
	}
	else{
		console.log("item not supported");
		return null;
	}	
}

/** 
 * Creates a new Party Collection Library with the provided Name
 *
 **/
function PartyCollection(name){	
	this.name=name;
	this.collection=[]
	this.coll=new Hash()
	this.lastID=10;
}


PartyCollection.prototype.printName = function () {
	console.log("Name = "+this.name);
};


/***
 * Add the providedItems to the PartyCollection
 * @param userID - the identifier of the user
 * @param items - array of items to be added to the collection
 * @return number of items added
 **/ 
PartyCollection.prototype.addItems = function (userID, items) {
	var itemsAdded =0;
	for (i = 0;i<items.length;i++){
		this.addItem(userID,items[i])==true?itemsAdded++:itemsAdded
	}
	return itemsAdded;
}

/***
 * Add item from user userID
 * @param userID - the user identifier
 * @param item - the item
 * returns true if the item was successfully added
 **/
PartyCollection.prototype.addItem = function (userID, item){
	
	if(item.version ==1){
		this.lastID=this.lastID+1;
		newID=this.lastID;
		//console.log("addItem: "+this.lastID);
		res = this.coll.set(newID,{"itemID":newID, "userID":userID,"item":item});
		return this.lastID;
	}
	else{
		console.log("item not supported");
	}	
	return false;
};



/**
 * Remove the provided item from the selected userID
 * @param item - the item to be removed
 * @param the userID
 **/
PartyCollection.prototype.removeItemByID = function(id){
	if(this.coll.hasKey(id)){
		//console.log("remove item by id, id found:"+id);
		tmp = this.coll.remove(id);	
		console.log("Removed item with id:"+tmp.itemID+" from user:"+tmp.userID+" item: "+tmp.item);
		return tmp.itemID;
	}
	return false;
};



/**
 * Remove the provided item from the selected userID
 * @param item - the item to be removed
 * @param the userID
 *
 **/
PartyCollection.prototype.removeItem = function(userID, itemID){
	for (i=0;i<this.collection.length;i++){
		if (this.collection[i].userID==userID && this.collection[i].itemID == item){
			this.collection.splice(i, 1);
			return true;
		}
	}
	return false;
};


/**
 * getItem from the collection
 * @param item - the item id
 *
 **/
PartyCollection.prototype.getItem = function(itemID){
	if (this.coll.hasKey(itemID)){
		item = this.coll.item(itemID)
		return ({"itemID":itemID,"userID":tmpItem.userID, "item": tmpItem.item})
	}
	else{
		return false;
	}
};





/**
 * Remove all items by the specified user
 * @userID - the user who's items should be removed from the collection
 *
 **/
PartyCollection.prototype.removeUserItems = function (userID){
	console.log("removeUserItems");
	var keys=this.coll.keys();
	for (i=0;i<keys.length;i++){
		console.log("index="+i +"key="+keys[i]);
		item = this.coll.item(keys[i]);
		if(item.userID==userID){
			//console.log("Removing id="+keys[i]);
			this.coll.remove(keys[i]);
			i--;
		}
	}


}

/**
 * Get users 
 * @returns array containing all users participating 
 **/
PartyCollection.prototype.getUsers = function (){
	console.log("getUsers()");
	users = [];
	var keys=this.coll.keys();
	for (i=0;i<keys.length;i++){
		item = this.coll.item(keys[i]);
		if(!users.contains(item.userID)){
			users.push(item.userID);
		}
	}

	/** legacy collections
	for (i=0;i<this.collection.length;i++){
		if  (! users.contains(this.collection[i].user)){
			users.push(this.collection[i].user);
		}	
	}
	**/
	return users;
};

/**
 * GetItemCount: provide list /ass. array with the number of items per user + total number of items
 * @returns associative array contain UserID as Key and integer as Value
 **/
PartyCollection.prototype.getItemCount = function (){
	userMap={}
	var keys=this.coll.keys();
	for (i=0;i<keys.length;i++){

		item = this.coll.item(keys[i]);
		if (!userMap[item.userID]) {
  			userMap[item.userID] = 1;
		}
		else{
			userMap[item.userID] +=1;
		}
	}

	/**
	legacy collection
	for (i=0;i<this.collection.length;i++){	
		if (!userMap[this.collection[i].user]) {
  			userMap[this.collection[i].user] = 1;
		}
		else{
			userMap[this.collection[i].user] = userMap[this.collection[i].user]+=1;
		}
		//if(itemCount.user==this.collection[i].user
		//usersthis.collection[i].user

	}
	**/
	userMap["TOTAL"]=keys.length;		
	return userMap;
}


/**
 * Get all items provided by the user, identified by the userID.
 * @param limit=max number of items
 * @param userID
 * @param filterCriteria - associative array
 * @returns array with [user,item] pairs 
 **/
PartyCollection.prototype.getItems = function (userID, limit, filterCriteria){
	result = [];
	var keys = this.coll.keys();
	for (var i=0;i<keys.length;i++){
		tmpItem = this.coll.item(keys[i]);

		if(userID!=0){
			if (typeof filterCriteria=='undefined' ){
				filterCriteria={};
			}
			filterCriteria["userID"]=userID;
			tmpItem.item.userID=tmpItem.userID;
		}
		if (typeof filterCriteria != 'undefined' ){
			//console.log("check for filter");
			if (filterItem(tmpItem.item, filterCriteria) == true){
				//result.push(tmpItem)
				result.push({"itemID":keys[i],"userID":tmpItem.userID, "item": tmpItem.item});
			}		
		}
		else{
			//result.push(tmpItem);
			result.push({"itemID":keys[i],"userID":tmpItem.userID, "item": tmpItem.item});
		}
	}
	return result;
};

/**
Object.prototype.size = function () {
  var len = this.length ? --this.length : -1;
    for (var k in this)
      len++;
  return len;
}
**/


/**
 * Filter the item based on the provided criteria
 * @item - partyCollection item
 * @filters - asso. array containing filtercriteria and criteriavalues;
 * e.g {"mediatype":"audio","mimetype":"audio/mp3"}
 * return true if the items passes all criteria
 **/
function filterItem(item,filters){
	//console.log(item);
	//console.log(filters);
	var success =false;
	for(var filter in filters) {
		if ((filter in item) && (item[filter]==filters[filter])){
			success = true;
		}
		else{
			return false;
		}
	}
	return success;
};


//exports.PartyCollection = PartyCollection;
//exports.JSONtoItem = JSONtoItem;
//exports.filterItem = filterItem;
