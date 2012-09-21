var users = require("../Users.js")


var uc = new users.Users("activeusers");


uc.addUser("Aap");
uc.addUser("Noot");
uc.addUser("Mies");

console.log(uc.getUsers());




uc.changeAlias("user4","Henk");
uc.changeAlias("user3","Mies2");
usersc = uc.getUsers();


for (var rmp in usersc[0]){
	console.log(rmp);
}
