/*
 * Code contributed to the webinos project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * (C) Copyright 2012, TNO
 *
 * Author: Daryll Rinzema
 */

//main visual engine

/**
 * The visual baseclass. Holds name and selector vars / functions. Not used directly,
 *
 *	@class Visual
 *	@example 
 *	//used for functional pattern
 *	var childClass = function(){
 *		var varName; //define private field
 *		var privateMethod = function(){}; //define private function
 *		var that = Visual('VisualFunnel', 'div#funnel'); //construct class using Visual as baseclass
 *		that.publicMethod = function(){}; //define public function
 *		return that; //return it
 *	}
 *	//calling the method is done like
 *	childClass.publicMethod();
 *	@param name string the name of the visual class
 *	@param selector string the base element the code looks for when appending extra elements
**/
var Visual = function(name, selector){
	this.name = name;
	this.selector = selector; 

	var that = {};
	
	/**
	 *	string Returns The selector
	 *
	 *	@methodOf Visual
	**/
	that.getSelector = function(){
		return selector;
	};
	/**
	 *	string Returns The name
	 *
	 *	@methodOf Visual
	**/
	that.getName = function(){
		return name;
	};
	/**
	 *	Replaces the current the selector with the given selector
	 *
	 *	@methodOf Visual
	 *	@param newSelector string the selector replacing the current selector
	**/
	that.replaceSelector = function(newSelector){
		selector = newSelector;
		return selector;
	};
	
	return that;
}

/**
 *	The class handling all the frontend css and jQuery for the funnel. Uses Visual as baseclass.
 *	See for this mechanism the Visual documentation.
 *	
 *	@example
 *	//See Visual for more in-depth example
 *	var funnelViz = visualFunnel('name', 'div#funnel');
 *	funnelViz.function(parameters);
 *	@class visualFunnel
 *	@param name the name of the visual class
 *	@param selector the base element the code looks for when appending extra elements
**/
var visualFunnel = function(name, selector){
	var funnelSize, step, allCircles, inDist;
	var that = Visual(name, selector);
	
	/**
	 *	Builds the path the DOM funnel element moves along
	 *
	 *	@private plus @function startArc 
	 *	
	 *	@private
	 *	@param selector string The DOM funnel element to animate
	 *	@param circle int The numbered circle to animate along (larger circle number is larger circle is larger radius)
	**/
	var startArc = function(selector, circle, first){
		//console.log("start arc");
		var r = circle*step/2 - inDist/2;
		var arc_params = {
			center: [funnelSize/2 - inDist/2,funnelSize/2 - inDist/2],
			radius: r,
			start: 180,
			end: -180,
			dir: -1
		};
		
		$(selector).animate({path : new $.path.arc(arc_params)}, 30000, function(){
			startArc(selector, circle);
		});	
	};
	/**
	 *	Makes the funnelItem switch the info it's showing. After switch, it calls itself again with new variables. Using Timeout function.
	 *
	 *	@private plus @function buildSwitcher 
	 *	
	 *	@private
	 *	@param selector string The DOM funnel element to animate
	 *	@param state int The info to show depending on state
	**/	
    var buildSwitcher = function (selector, state) {
        var newState;
        switch(state){
            case 1:
                var trackCover = '<img src='+item.item.cover+' class=cover>';
                $(selector).html(trackCover);
                $(selector + ' .cover').css({
                'width': inDist * 0.8,
                'height' : inDist * 0.8,
                'margin' : inDist * 0.1
		        });
		        newState = 2;
		        break;
		    case 2:
		        var trackInfo = '<p class=title>' + item.item.title +'</p><p class=artist>' + item.item.artist +'</p><p class=album>' + item.item.album +'</p>';
		        $(selector).html(trackInfo);
		        $(selector + ' p').css({
		            'font-size' : inDist/6,
		            'font-weight' : 'bold',
		            'margin-left' : inDist * 0.1,
		            'margin-top' : inDist * 0.1,
		            'width' : inDist * 0.8
		        });
                $(selector + ' .title').css({
                    'padding-bottom' : inDist * 0.05,
                    'border-bottom' : '1px solid #777777'
                });
                $(selector + ' .artist').css({
                    'margin-top' : inDist * 0.05,
                    'padding-bottom' : inDist * 0.05,
                    'border-bottom' : '1px solid #777777'
                });

                $(selector + ' .album').css({
                    'margin-top' : inDist * 0.05,
                    'padding-bottom' : inDist * 0.05,
                });
                newState = 3;
                break;
		    case 3:
		        var userCover = '<p class=usertxt>Added by: </p><img src='+ user.thumbnail +' class=thumbnail>';
		        $(selector).html(userCover);
		        $(selector + ' p').css({
		            'font-size' : inDist/6,
		            'font-weight' : 'bold',
		            'margin-left' : inDist * 0.1,
		            'margin-top' : inDist * 0.1,
		            'width' : inDist * 0.8
		        });
		        $(selector + ' .thumbnail').css({
		            'width' : inDist * 0.6,
		            'height' : inDist * 0.6,
		            'margin' : '0px ' + inDist * 0.2 +'px' 
		        }); 
		        newState = 1;
		        break;
        }
	    console.log(newState);
	    setTimeout( function() { buildSwitcher(selector, newState) }, 2000)
	};
	
	/**
	 *	Builds the DOM and (background) css for the funnel.
	 *
	 *	@methodOf visualFunnel
	 *	@param funnel int The max width the funnel is (also uses this number for height)
	 *	@param maxCircles int The maximum number of circles the funnel will hold
	**/
	that.setupCircles = function(funnel, maxCircles){
		funnelSize = funnel;
		allCircles = maxCircles;
		step = funnelSize / maxCircles;
		inDist = step/2
		$('div#funnel').css({
			width: funnelSize,
			height: funnelSize
		});
		for(var i = 0; i < allCircles; i++){
			$('<div class="funnelCircle" circle=' + (i+1) + '>' +
			'<div class="info">' + (allCircles - i) + '</div>' +
		    '</div>').appendTo('div#funnel').css({
				width: ((i+1) * step),
				height: ((i+1) * step),
				'z-index' : i-(i+i),
			});
			if(i%2==0){
			    $('.funnelCircle[circle=' + (i+1 + ']')).css({
			        'background-color': '#BBFFFF'
			    });
			};
	        $('.funnelCircle .info').css({
	            'bottom' : inDist/2,
	            'width' : inDist/3,
		        'font-size' : inDist/5
		    });
		    $('.funnelCircle[circle=1] .info').html('NEXT ITEM').css({
		        'left' : '25%',
		        'width' : inDist,
		        'height' : inDist,
		        'border' : '1px dashed black',
		        'border-radius' : '33%',
		        'line-height' : inDist/2 + 'px'
		    });
		    $('.funnelCircle[circle=2] .info').html(allCircles-1 + '+');

		}//end for loop
	};
	/**
	 *	Builds the DOM and css for a funnelItem. It also creates an element object holding the last circle and
	 *	the selector of the element.
	 *	When these things are build, it invokes the startArc function. The element object will be returned
	 *	for future reference
	 *
	 *  string Returns the DOM element
	 *
	 *	@methodOf visualFunnel
	 *	@param key int The ID of the funnelItem as in funnelList, used as a custom attribute at the DOM element
	 *	for future reference
	**/	
	that.renderSingle = function(key){
		var element = {};
		element.selector = 'div[_funnelItemID=' + key + ']';
		element.circle = (allCircles+1) - funnel.getFunnelListItem(key).votes;
		//console.log("render at: " + element.circle);
		user = pc.getUser(funnel.getFunnelListItem(key).userID);
		item = pc.getItem(funnel.getFunnelListItem(key).itemID);
		 //.userID).alias;
		//log(user.alias); 
		trackCover = '<img src='+item.item.cover+' class=cover>';
		$('<div class="funnelObject" _funnelItemID=' + key + '>' + trackCover + '</div>').appendTo('#funnel');
		
		//make object switch between states (intervals)?
		
		$('.funnelObject').css({
		    'width' : inDist,
		    'height' : inDist,
		});
		
		$(selector + ' .cover').css({
		    'width': inDist * 0.8,
		    'height' : inDist * 0.8,
		    'margin' : inDist * 0.1
		});
		
		var state = 2;
        		
		element.interval = setTimeout(function(){ buildSwitcher(element.selector, state); }, 5000);
		startArc(element.selector, element.circle);
		return element;
	};
	/**
	 *	Destroys the DOM element for the given funnelItem. It also stops any animations
	 *
	 *	@methodOf visualFunnel
	 *	@param selector string The selector of the DOM funnel element to look for
	**/
	that.destroySingle = function(selector){
		$(selector).stop(true);
		$(selector).remove();
	};
	/**
	 *	Moves the given DOM element to the given circle
	 *	It stops any animations. It then starts the startArc function.
	 *
	 *	@methodOf visualFunnel
	 *	@param selector string The selector of the DOM funnel element to look for
	 *	@param circle int The circle to update to
	**/
	that.updateCircle = function(selector, circle){
		$(selector).stop(true);
		
		$(selector).animate({
		    'top' : (allCircles - circle) * inDist,
		    'left' : funnelSize/2 - inDist/2
		}, 300, function(){ 
		    startArc(selector, circle);
		});
		
	};
	/**
	 *	Sets the final item on the center of the Funnel. Doesn't invoke the startArc function
	 *
	 *	@methodOf visualFunnel
	 *	@param selector string The selector of the DOM funnel element to look for
	**/
	that.setCenter = function(selector){
	    $(selector).stop(true);
	    $(selector).animate({
	        'top' : funnelSize/2 - inDist/2 + 'px',
	        'left' : funnelSize/2 - inDist/2 + 'px'
	    });
	};
	/**
	 *	Animates the to-be-played item to the player onscreen. Invokes the removing functions after the animation
	 *
	 *	@methodOf visualFunnel
	 *	@param selector string The selector of the DOM funnel element to look for
	**/
	that.animateToPlayer = function(selector){
	    $(selector).stop(true);
	    var dist = $('#funnel').offset();
	    var playerPos = $('#player').offset();
	    $(selector).animate({
	        'left' : playerPos.left - dist.left,
	        'top' : playerPos.top - dist.top
	    }, 2000, function(){
	        funnel.removeItem($(selector).attr('_funnelItemID'), partyplayer.funnel.removeFunnelItem);
	    });
	};
	
	return that;
}

/**
 *  The class updating the player frontend & css. Same build as the funnel, with Visual as baseclass
**/
var visualPlayer = function(name, selector){
	var that = Visual(name, selector);
	
	/**
	 *	Build the player onscreen. Returns itself as DOM element.
	 *  string Returns DOM element
	 *
	 *	@methodOf visualPlayer
	**/
	that.buildPlayer = function(){
        $(selector).html('<audio id="playback" autoplay onended="player.getSong()" controls="false">' + 
	    '<source src="" type="audio/ogg">' +
	    '<source src="" type="audio/mpeg">' +
	    'Your browser does not support the audio element.</audio>');
	    
	    var playerSelector = '#playback';
	    return playerSelector;	    
	};
    /**
	 *	For manually updating the player to play a given url
	 *
	 *	@methodOf visualPlayer
	 *  @param url string The URL the play
	 *  @param playerSelector string The player to update
	**/
	that.updatePlayer = function(url, playerSelector){
	    $(playerSelector).attr('src', url);
	};
    /**
	 *	Creates a button to manually look for the next song to play. Calls player.getSong()
	 *
	 *	@methodOf visualPlayer
	**/
	that.setupButton = function(){
	    $(selector).append('<button id="setupButton">Play next track</button>');
	    $('#setupButton').bind('click', player.getSong);
    };
	
	return that;
}

//initialize the visual parts, assigning them to a var
var funnelViz = visualFunnel("VisualFunnel", 'div#funnel');
var playerViz = visualPlayer("VisualPlayer", 'div#player');

/******************||**||**|||**|||**||*****************************
*******************||**||**||*||*||**||*****************************
*******************||||||**||****||**|||||**************************/
/*
@startuml visual_classes.png

class Visual {
    protected string name
    protected string selector
}
class VisualFunnel {
    private int funnelSize, step, allCircles, inDist
    private void startArc(selector, circle)
    public void setupCircles(funnelSize, maxCircles)
    public Object renderSingle(key)
    public void destroySingle(selector)
    public void updateCircle(selector, circle)
    public void setCenter(selector)
    public void animateToPlayer(selector)
}
class VisualPlayer {
    public string buildPlayer()
    public void updatePlayer(url, playerSelector)
    public void setupButton()
}

Visual <|-- VisualFunnel
Visual <|-- VisualPlayer

@enduml
*/
