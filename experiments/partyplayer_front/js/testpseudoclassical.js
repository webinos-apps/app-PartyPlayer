//augment object with a function to return an object as prototype
//function not in older versions of JS, declared here
if(typeof Object.create !== 'function'){
	Object.create = function(o){
		var F = function(){};
		F.prototype = o;
		return new F();
	}	
}
//augment function prototype for adding extra methods
Function.prototype.method = function(name, func){
	this.prototype[name] = func;
	return this;
}
Function.method('new', function(){
	//Create a new object that inherits from the constructor's prototype
	var that = Object.create(this.prototype);
	
	//Invoke the constructor, binding -this- to the new object
	var other = this.apply(that, arguments);
	
	//if its return value isn't an object, substitue the new object
	return(typeof other === 'object' && other ) || that;
});
//method to enable cascading prototype augmentation
Function.method('inherits', function(Parent){
	this.prototype = new Parent();
	return this;
});

//define a constructor
var Mammal = function(name){
	this.name = name;
};
//augment prototype
Mammal.prototype.get_name = function (){
	return this.name;
};
Mammal.prototype.says = function(){
	return this.saying || '';
}

//new constructor
var Cat = function(name){
	this.name = name;
	this.saying = 'meow';
}

//set Cat prototype as new Instance of Mammal
Cat.prototype = new Mammal();
Cat.prototype.get_name = function(){
	return this.says() + "meow";
}

//another constructor with augmented prototype in one go
var Dog = function(name){
	this.name = name;
	this.saying = "woof";
}.inherits(Mammal).method('get_name', function(){
	return this.says() + ' ' + this.name;
});

$(document).ready(function(){
	var myMammal = new Mammal("herb the mammal");
	var name = myMammal.get_name();
	console.log(name);
	
	var myCat = new Cat('henrietta');
	var says = myCat.says();
	var abc = myCat.get_name();
	console.log(abc);
	
	var myDog = new Dog('Daryll');
	var woof = myDog.says();
	var bark = myDog.get_name();
	console.log(woof);
	console.log(bark);
});
