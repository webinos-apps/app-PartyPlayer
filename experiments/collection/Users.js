var hash = require("./include/hash.js");

/** 
 * Creates a new User Collection
 **/
function Users(name){	
	this.name=name;
	this.users=new hash.Hash()
	this.lastID=0;
}


Users.prototype.addUser = function (userAlias){
	this.lastID=this.lastID+1;
	res = this.users.set("user"+this.lastID,{"userAlias":userAlias});
	return this.lastID;
};


Users.prototype.getAlias = function (userID){
	console.log("getALias");	
	user = this.users.item(userID)
	return ({"userID":userID,"userAlias":user.userAlias});
};


/**
 * Change Alias
 * Changes the Alias of the user with id useID to the provided userAlias
 * returns True if the alias was successfully updated
 * returns False if the alias could not be updated
 **/
Users.prototype.changeAlias = function (userID,userAlias){
	console.log("changeAlias");
	if(this.users.hasKey()){
		res = this.users.set(userID,{"userAlias":userAlias});
		return true;
	}
	return false;
};

/**
 * Get users 
 * @returns array containing all userID - userAlias tuples
 **/
Users.prototype.getUsers = function (){
	console.log("getUsers()");
	users = [];
	
	keys = this.users.keys()
	for (var i=0;i<keys.length;i++ ){
		item = this.users.item(keys[i])
		users.push({"userID":keys[i], "userAlias":item.userAlias});
	}
	return users;
};

exports.Users = Users;
