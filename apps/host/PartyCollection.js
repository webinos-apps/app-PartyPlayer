
/** 
 * Creates a new Party Collection Library with the provided Name
 **/
function PartyCollection(name){	
	this.name=name;
	this.coll=new Collection();
	this.users=new Collection();
}

PartyCollection.prototype.printName = function () {
	console.log("Name = "+this.name);
};


/***
 * Add the providedItems to the PartyCollection
 * @param userID - the identifier of the user
 * @param items - array of items to be added to the collection
 * @return number of items added
PartyCollection.prototype.addItems = function (userID, items) {
	var itemsAdded =0;
	for (i = 0;i<items.length;i++){
		this.addItem(userID,items[i])==true?itemsAdded++:itemsAdded
	}
	return itemsAdded;
}
 **/ 

/***
 * Add item from user userID
 * @param userID - the user identifier
 * @param item - the item
 * returns true if the item was successfully added
 **/
PartyCollection.prototype.addItem = function (userID, item){
	if(item.version ==1){
		return this.coll.addItem({"userID":userID,"item":item});
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
	return this.coll.removeItem(id);
};

/**
 * Remove the provided item from the selected userID
 * @param item - the item to be removed
 * @param the userID
 *
 **/
PartyCollection.prototype.removeItem = function(userID, itemID){
	coll = this.coll.getItems();
	for (var key in coll)
	{
		if (coll[key].userID==userID && tcoll[key] == item){
			return this.coll.removeItem(id);
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
		return this.coll.getItem(itemID);
};

/**
 * Remove all items by the specified user
 * @userID - the user who's items should be removed from the collection
 **/
PartyCollection.prototype.removeUserItems = function (userID){
	for (var key in this.coll.getItems())
	{
		item = this.coll.getItem(key);
		if(item.userID==userID){
			this.coll.removeItem(key);		
		}
	}
}

/**
 * Get users 
 * @returns array containing all users participating 
 **/
PartyCollection.prototype.getUsers = function ()
{
	users = [];
	for (var index in this.coll ){
		item = this.coll[index];
		if(!users.contains(item.userID)){
			users.push(item.userID);
		}
	}
	return users;
};

/**
 * GetItemCount: provide list /ass. array with the number of items per user + total number of items
 * @returns associative array contain UserID as Key and integer as Value
 **/
PartyCollection.prototype.getItemCount = function (){
	userMap={}
        total=0;
	for (var index in this.coll.getItems() ){
		item = this.coll.getItem(index);
		total+=1;
		if (!userMap[item.userID]) {
  			userMap[item.userID] = 1;
		}
		else{
			userMap[item.userID] +=1;
		}
	}
	userMap["TOTAL"]=total;		
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
	for (var index in this.coll.getItems() ){
		tmpItem = this.coll.getItem(index);
		if(userID!=0){
			if (typeof filterCriteria=='undefined' ){
				filterCriteria={};
			}
			filterCriteria["userID"]=userID;
			//tmpItem.item.userID=tmpItem.userID;
		}
		if (typeof filterCriteria != 'undefined' ){
			if (filterItem(tmpItem.item, filterCriteria) == true){
				result.push({"itemID":index,"userID":tmpItem.userID, "item": tmpItem.item});
			}		
		}
		else{
			result.push({"itemID":index,"userID":tmpItem.userID, "item": tmpItem.item});
		}
	}
	return result;
};

/**
 * Filter the item based on the provided criteria
 * @item - partyCollection item
 * @filters - asso. array containing filtercriteria and criteriavalues;
 * e.g {"mediatype":"audio","mimetype":"audio/mp3"}
 * return true if the items passes all criteria
 **/
function filterItem(item,filters){
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


PartyCollection.prototype.addUser = function(user){
	return this.users.addItem(user);
}

PartyCollection.prototype.updateUser = function(userID,userAlias){
	return this.users.updateItem(userID,userAlias);
}

PartyCollection.prototype.removeUser = function(userID){
	return this.users.removeItem(userID);
}

PartyCollection.prototype.getItem = function(userID){
	return this.users.getItem(userID);
}

PartyCollection.prototype.getUsers = function(){
        return this.users.getItems();
}

