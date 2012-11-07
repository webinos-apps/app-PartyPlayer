
/** 
 * Creates a new Collection Library with the provided Name
 **/
function Collection(name, /* optional */ randomKey){	
	randomKey = randomKey || 10;
	this.name=name;
	this.coll={};
	this.lastID = randomKey;
}

/***
 * Add item to the collection
 * @param the item.
 * returns the key if the item was successfully added
 * returb false 
 **/
Collection.prototype.addItem = function (item,/* optional */ key){
	key = key || undefined
	if (key!=undefined){
		if (key in this.coll){
			return false;		
		}
		else{
			this.coll[key]=item;
		}	
	}
	else{
		while (this.lastID in this.coll){
			this.lastID=this.lastID+1;
		}		
		id = this.lastID;
		this.coll[this.lastID] = item;
		return id;
	}	
};

/**
 * Remove the provided item from the selected userID
 * @param item - the item to be removed
 * @param the userID
 **/
Collection.prototype.removeItem = function(id){
	if(id in this.coll){
		console.log("remove item by id, id found:"+id);
		tmp = this.coll[id];
		delete this.coll[id];
		console.log("Removed item with id:"+tmp.itemID+" from user:"+tmp.userID+" item: "+tmp.item);
		return tmp.itemID;
	}
	return false;
};

/**
 * Remove the provided item from the collection
 * @param itemID - the item to be removed
 **/
Collection.prototype.removeItem = function(itemID){
	if (this.coll.hasOwnProperty(itemID)){
		delete this.coll[itemID];
		return true;
	}
	else{
		return false;
	}
};


/**
 * getItem from the collection
 * @param item - the item id
 *
 **/
Collection.prototype.getItem = function(itemID){
	if (this.coll.hasOwnProperty(itemID)){
		item = this.coll[itemID]
		return ({"itemID":itemID,"userID":item.userID, "item": item.item})
	}
	else{
		return false;
	}
};


/**
 * Get all items provided by the user, identified by the userID.
 * @param limit=max number of items
 * @param userID
 * @param filterCriteria - associative array
 * @returns array with [user,item] pairs 
 **/
Collection.prototype.getItems = function (){
	return this.coll;
};
