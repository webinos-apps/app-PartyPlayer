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
	

	var funnelWidth = 500;


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
    var buildSwitcher = function (selector, state, itemInfo) {
        var newState;
        switch(state){
            case 1:
                var trackCover = '<img src="'+itemInfo.cover+'" class="cover"/>';
                $(selector).html(trackCover);
                $(selector + ' .cover').css({
                'width': inDist * 0.8,
                'height' : inDist * 0.8,
                'margin' : inDist * 0.1
		        });
		        newState = 2;
		        break;
		    case 2:
		        var trackInfo = '<p class=title>' + itemInfo.title +'</p><p class=artist>' + itemInfo.artist +'</p><p class=album>' + itemInfo.album +'</p>';
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
		        var userCover = '<p class=usertxt>Added by: </p><img src='+ itemInfo.thumbnail +' class=thumbnail>';
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
	    //console.log(newState);
	    setTimeout( function() { buildSwitcher(selector, newState, itemInfo) }, 2000)
	};
	
	/**
	*  int Returns The amount of circles the funnel consists of
	*
	**/
	that.getCircles = function () {
		return allCircles;
	};
	/**
	 *  int Returns The total funnel size (in pixels)
	 *
	**/
	that.getFunnelWidth = function () {
		return funnelSize;
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
		
		trackCover = '<img src="'+item.item.cover+'" class="cover"/>';
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
        var itemInfo = {};
        itemInfo.title = item.item.title;
        itemInfo.artist = item.item.artist;
        itemInfo.album = item.item.album;
        itemInfo.cover = item.item.cover;
        itemInfo.thumbnail = user.thumbnail;		
		element.interval = setTimeout(function(){ buildSwitcher(element.selector, state, itemInfo); }, 5000);
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
/*
* item is removed in the funnel.js in order to clearly separate between view and logic.
*/
//funnel.removeItem($(selector).attr('_funnelItemID'), partyplayer.funnel.removeFunnelItem);
	    });
	};
	
	return that;
}




/**
 *	The funnelVar is a seperate Object that will be created when a funnelItem is created in funnelList. 
 *	funnelVar holds the ID of the funnelItem as it is in funnelList. funnelVar holds an object called 'element'.
 *	This object contains many properties that the visual part uses in order to update a specific Item on the Front-End
 *
 *	@constructor funnelVar
 *	@example var funnelObject = funnelVar();
**/
var funnelVar = function(){
	var key, element = {}; // selector / circle / state / interval
	
	return{
		/**
		 *	Sets up the element object that gets returned after building it in the DOM
		 *
		**/
		init : function(){
			element = funnelViz.renderSingle(key);
		},
		/**
		 *	Sets the key of this Item
		 *
		 *	@param key int The key to be set to
		**/
		setKey : function(newKey){
			key = newKey;
		},
		/**
		 *	Sets the circle this Item is at in the element Object
		 *
		 *	@param circle int Circle number to be set to
		**/
		setCircle : function(circle){
			element.circle = circle;
		},
		/**
		 *	Sets the interval this Item has.
		 *
		 *	@param interval Object Interval to set to
		**/		
		setInterval : function(interval){
		    element.interval = interval;
		},
		/**
		 *	string Returns The key of the Item
		**/
		getKey : function(){
			return key;
		},
		/**
		 *	string Returns The selector the element Object
		**/
		getSelector : function(){
			return element.selector;
		},
		/**
		 *	int Returns The circle the Item is at
		**/
		getCircle : function(){
			return element.circle;
		},
		/**
		 *	Object Returns The interval reference for the timer
		**/
		getInterval : function(){
		    return element.interval;
		}
	}	
}


//initialize the visual parts, assigning them to a var
var funnelViz = visualFunnel("VisualFunnel", 'div#funnel');

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
