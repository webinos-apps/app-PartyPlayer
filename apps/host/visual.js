//main visual engine

/**
 * The visual baseclass. Holds name and selector vars / functions. Not used directly,
 *
 *  @class Visual
 *  @example 
 *  //used for functional pattern
 *  var childClass = function(){
 *    var varName; //define private field
 *    var privateMethod = function(){}; //define private function
 *    var that = Visual('VisualFunnel', 'div#funnel'); //construct class using Visual as baseclass
 *    that.publicMethod = function(){}; //define public function
 *    return that; //return it
 *  }
 *  //calling the method is done like
 *  childClass.publicMethod();
 *  @param name string the name of the visual class
 *  @param selector string the base element the code looks for when appending extra elements
**/
var Visual = function(name, selector){
  this.name = name;
  this.selector = selector;
  var that = {};
  
  /**
   *  string Returns The selector
   *
   *  @methodOf Visual
  **/
  that.getSelector = function(){
    return selector;
  };
  /**
   *  string Returns The name
   *
   *  @methodOf Visual
  **/
  that.getName = function(){
    return name;
  };
  /**
   *  Replaces the current the selector with the given selector
   *
   *  @methodOf Visual
   *  @param newSelector string the selector replacing the current selector
  **/
  that.replaceSelector = function(newSelector){
    selector = newSelector;
    return selector;
  };
  
  return that;
}