//augment object with a function to return an object as prototype
//function not in older versions of JS, declared here
if(typeof Object.create !== 'function'){
	Object.create = function(o){
		var F = function(){};
		F.prototype = o;
		return new F();
	}	
}
//augment prototype for adding extra methods
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
//define super method
Object.method('superior', function(name){
	var that = this,
		method = that[name];
	return function(){
		return method.apply(that, arguments);
	};
});

//functional constructor
var mammal = function(spec){
	var that = {};
	
	that.getName = function(){
		return spec.name;
	};
	
	that.says = function(){
		return spec.saying || '';
	};
	
	return that;
};

//functional constructor augmentation
var cat = function(spec){
	spec.saying = spec.saying || 'meow';
	var abc = "abc";
	var that = mammal(spec);
	
	that.purr = function(){
		return 'purr';
	};
	that.getName = function(){
		return abc + that.purr();
	};
	that.setAbc = function(x){
		abc = "def";
		doABC();
	};	
	
	return that;
};
//another constructor to demonstrate use of super method
var coolcat = function(spec){
	var that = cat(spec),
		super_get_name = that.superior('getName');
	that.getName = function(){
		return 'like ' + super_get_name() + ' baby';
	}
	return that;
};

$(document).ready(function(){
	var myMammal = mammal({name: 'herb'});
	console.log(myMammal.getName());
	
	var myCat = cat({name: 'catname'});
	console.log(myCat.abc);
	console.log(myCat.purr());
	console.log(myCat.getName());
	
	var myCoolCat = coolcat({name: 'Bix'});
	var name = myCoolCat.getName();
	console.log(name);
});
