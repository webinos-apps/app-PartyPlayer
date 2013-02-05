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
 * Authors: Victor Klos, Martin Prins, Arno Pont
 */
 
var popupLogin = false;
var popupLoading = false;

function bindFileAPI() {
    webinos.discovery.findServices(new ServiceType("http://webinos.org/api/file"), {
        /**
         * When the service is found
         * @param service The service that is found.
         * @private
         */
        onFound: function (service) {
            if (webinos.session.getPZPId() === service.serviceAddress) {
                service.bindService({
                    onBind: function () {
                        localItems.fileService = service;
                        localItems.importItems();
                    }
                });
            }
        },
        /**
         * When an error occurs.
         * @param error The object describing the error event.
         * @private
         */
        onError: function (error) {
            alert("Error finding service: " + error.message + " (#" + error.code + ")");
        }
    });
}

function validateEmail(email) { 
     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
}

function initProfile() {
    if (!localStorage.username || !localStorage.mailAddress) {
        $( "#login").unbind('click').bind('click', function (event) {
            var username = $('#name').val();
            var mailAddress = $('#mail').val();

            if (username && username.length > 0) {
                localStorage.username = username;
            }

            if (mailAddress && validateEmail(mailAddress)) {
                localStorage.mailAddress = mailAddress;
            }
            
            if (localStorage.username && localStorage.mailAddress) {
                $( "#popupLogin" ).popup( "close" );
                popupLogin = false;
                
                if (popupLoading) {
                    $( "#popupLoading" ).popup( "open" );
                }
                
                enterTheParty(localStorage.username, localStorage.mailAddress);
            }
        });
        
        $( "#popupLogin" ).bind({
            popupafteropen: function(event, ui) {
                $('#user').val(localStorage.username);
                $('#mail').val(localStorage.mailAddress);
            }
        });

        if (popupLoading) {
            $('#popupLoading').popup("close");
        }
        
        $( "#popupLogin" ).popup( "open" );
        popupLogin = true;
    } else {
        enterTheParty(localStorage.username, localStorage.mailAddress);
    }
}

$('#home').live('pageshow', function(event) {
    $('.flexslider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        slideshow: true,
        slideshowSpeed: 2000,
        animationSpeed: 300,
        randomize: true,
        directionNav: false        
    });

    webinos.session.addListener('registeredBrowser', function () {
        partyplayer.init('guest', function(connected) {
            if (connected) {
                initProfile();
                bindFileAPI();
            }
        });
    });
});

$('#playlist').live('pageinit', function(event) {
    $('ul#playlist').listview('refresh');
});

$('#guests').live('pageinit', function(event) {
    $('ul#guest-profiles').listview('refresh');
});

$('#collection').live('pageinit', function(event) {
    $('ul#user-collection').listview('refresh');
    $('ul#party-collection').listview('refresh');
});

$(document).ready(function() {
    $.mobile.changePage("#home", { transition: "slideup"} );
});

$(window).unload(function() {
    if (userProfile && userProfile.userID) {
        partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"leave", params:{userID:userProfile.userID}});
    } else {
        partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"leave"});
    }
    partyplayer.close();
});

// size it full screen
$( "#popupPanel" ).on({
    popupbeforeposition: function() {
        var h = $( window ).height();

        $( "#popupPanel" ).css( "height", h );
    }
});

//globals for user
var userProfile = {
	userName:'',
	userPic:'',
	userID:'',
};

var partyPlayerUsers = {};

partyplayer.joinUser = function(name, picture){
    log(name + " is joining...");

    var serviceAddress = webinos.session.getPZPId();
	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"join", params:{alias:name,thumbnail:picture, 'serviceAddress':serviceAddress}});
};

partyplayer.addItem = function(item){
	log("adding Item");
 	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"addItem", params:{userID:userProfile.userID,item:item}});
};

partyplayer.removeItem = function(itemID){
	log("removing Item");
	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"main", cmd:"removeItem", params:{userID:userProfile.userID,itemID:itemID}});
}

partyplayer.addFunnelItem = function(itemID){
	log("adding Item To Funnel");
 	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"funnel", cmd:"addItem", params:{userID:userProfile.userID,itemID:itemID}});
};

partyplayer.voteFunnelItem = function(funnelItemID){
    //@TODO -> TEST
    log("item voted for: " + funnelItemID);
 	partyplayer.sendMessageTo(partyplayer.getHost(), {ns:"funnel", cmd:"vote", params:{userID:userProfile.userID,funnelItemID:funnelItemID}});
};

partyplayer.main = {};
partyplayer.funnel = {};
partyplayer.main.onwelcome = function(param, ref) {
    userProfile.userID = param.userID;
    log('onwelcome invoked! userID = '+ userProfile.userID); 
};

partyplayer.main.onupdateUser = function(param, ref) {
    log('onupdateUser Invoked!');
    if(param.userID != userProfile.userID){
		log("Adding "+param.user.alias);
    	//store user in userList
		//@TODO: user updates instead of additions
	    if (! (param.userID in partyPlayerUsers)){
	    	partyPlayerUsers[param.userID]={name:param.user.alias,picture:param.user.thumbnail};
	    	 //update users on screen
		    var newUser = '';
		    newUser += '<li id="' + param.userID + '">'
            newUser += '<img class="ui-li-icon" src="'+param.user.thumbnail+'"/>';
            newUser += '<div>'+param.user.alias+'</div>';
            newUser += '</li>';
		    $('ul#guest-profiles').append(newUser);

            try {
    		    $('ul#guest-profiles').listview('refresh');
            } catch (err) {
                
            }
	    }
    }
};

partyplayer.main.onremoveUser = function(param, ref) {
    log('onremoveUser Invoked!');
    
    delete partyPlayerUsers[param.userID];
    //delete user from screen
    $('#'+param.userID).remove();
    //delete items from collection
    $('table#partyCollection tr[user="'+param.userID+'"]').remove();
    
    try {
	    $('ul#guest-profiles').listview('refresh');
    } catch (err) {
        
    }
};

partyplayer.main.onupdateCollectionItem = function (param, ref) {
    log ('onUpdateItem Invoked; my userID='+userProfile.userID)
	//if (param.userID != userID){
		log (param.userID +" added \""+param.item.artist +" - "+param.item.title + "\" to the collection");
	//}
    //add items to screen

    var profileImage;
    
    currentCollection[param.itemID] = param.item;
    
	if(param.userID == userProfile.userID){
		profileImage = userProfile.userPic;

        // remove the item from the unshared collection
		var li = $('li[item-id*="' + param.item.localRef + '"]');
		li.remove();
		
		try {
            $('ul#user-collection').listview('refresh');
        } catch (err) {

        }
	} else {
		profileImage = partyPlayerUsers[param.userID].picture;
	}

    var trItem = '';
	trItem += '<li class="collection-item" id="' + param.itemID + '"><a href="#">';
	
	if (param.item.cover) {
        trItem += '<img src="'+param.item.cover+'"/>';
	} else {
        trItem += '<img src="../library/album-art-unknown.png"/>';
	}
	
    trItem += '<h3>'+param.item.title+'</h3>';
    trItem += '<p>' + param.item.artist + ' / ' + param.item.album + '</p>';
    if (profileImage) trItem += '<img class="ui-li-icon" src="'+profileImage+'"/>';
	trItem += '</a></li>';

    $('ul#party-collection').append(trItem);
    
        //     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        // $('#' + param.itemID).swipeDelete({
        //     btnLabel: 'Add',
        //     btnTheme: 'a',
        //     click: function(e) {
        //         e.preventDefault();
        //         currentCollection.shareItemsClick(e);
        //     }
        // });
        //     } else {
        $('#' + param.itemID).unbind("click").bind("click", currentCollection.preferItemsClick);
    // }
    
    try {
        $('ul#party-collection').listview('refresh');
    } catch (err) {
        
    }

};

partyplayer.funnel.onupdateFunnelItem = function (param, ref) {
    log ('onUpdateItem Invoked on Funnel')
    //something added to the funnel or changed in the funnel
    
    var item = currentCollection[param.itemID];

    var trItem = '';
	trItem += '<li class="playlist-item" id="' + param.funnelItemID + '"><a href="#">';
    trItem += '<img src="'+item.cover+'"/>';
    trItem += '<h3>'+item.title+'</h3>';
    trItem += '<p>' + item.artist + ' / ' + item.album + '</p>';
    trItem += '<span class="ui-li-count">' + param.votes + '</span>'
	trItem += '</a></li>';

    $('ul#playlist').append(trItem);

    if (param.userID != userProfile.userID) {
            //         if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
            // $('#' + param.funnelItemID).swipeDelete({
            //     btnLabel: 'Vote',
            //     btnTheme: 'a',
            //     click: function(e) {
            //         e.preventDefault();
            //         currentCollection.voteClick(e);
            //     }
            // });
            //         } else {
            $('#' + param.funnelItemID).unbind("click").bind("click", currentCollection.voteClick);
        // }
    }
	
	try {
	    $('ul#playlist').listview('refresh');
    } catch (err) {

    }
}

partyplayer.funnel.onvotedFunnelItem = function(param, ref) {
    log ('onvotedFunnel Invoked on Funnel');

    $('#' + param.funnelItemID + ' span.ui-li-count').html(param.vote);
    
    if(param.userID == userProfile.userID && param.vote > 0){
        //succesvol vote, disabled vote button
            //         if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
            // $('#' + param.funnelItemID).swipeDelete();
            //         } else {
            $('#' + param.funnelItemID).unbind("click");
        // }
    } else {
        //voted failed
        log('vote for funnelItem: ' + param.funnelItemID + ' failed');
    }
}

partyplayer.funnel.onremoveFunnelItem = function (param, ref) {
    log ('onDelete Funnel Item Invoked on Funnel')
    
    // remove the item from the unshared collection
	var li = $('li[id*="' + param.funnelItemID + '"]');
	li.remove();
	
	try {
        $('ul#playlist').listview('refresh');
    } catch (err) {

    }
    
    $('.funnel[funnelItemID=' +param.funnelItemID+']').remove();
}

function getGravatar(email, size) {
    // MD5 (Message-Digest Algorithm) by WebToolkit
    // 
    var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
    var size = size || 80;
    return 'http://www.gravatar.com/avatar/' + MD5(email) + '.png?s=' + size;
}

function enterTheParty(username, mailAddress) {
	//store values
	userProfile.userName = username;
	userProfile.userPic = getGravatar(mailAddress);
	
	/*
	 *@startuml ../docs/figures/guest_add_to_host.png
	 * partyGuest->partyHost: userName
	 * partyGuest->partyHost: userPic
	 * partyHost->partyGuest: userID
	 * @enduml
	 */	
    partyplayer.joinUser(userProfile.userName, userProfile.userPic);
    
    //add userInfo to screen
    var newUser = '';
    newUser += '<li>'
        newUser += '<img class="ui-li-icon" src="'+userProfile.userPic+'"/></div>';
        newUser += '<div>'+userProfile.userName+'</div>';
        newUser += '</li>';        

    $('ul#guest-profiles').append(newUser);
}

var currentCollection = {
	voteClick:function(event){
	    var funnelItemID = $(this).attr('id');
		console.log("funnel id = "+$(this).attr('id'));
		console.log("vote+1");
		partyplayer.voteFunnelItem(funnelItemID);
	},	
	preferItemsClick:function(event){
		var itemID = $(this).attr('id');
		partyplayer.addFunnelItem(itemID);
	}
};

var localItems = {
	items: new Array(),
	shareItemsClick:function(event){
	    var itemId = $(this).attr('item-id');
        $('ul#user-collection').listview('refresh');
	    
		var sendItem = localItems.items[itemId];
		sendItem.version = 1;
		sendItem.localRef = itemId;
		//send to host
		partyplayer.addItem(sendItem);
		return false;
	},
	importItems:function() {
	    var self = this;
	    
	    if (!this.fileService) {
	        alert('Invalid state! File service not initialized.');
	        return;
	    }
	    
	    if (!popupLogin) {
            $('#popupLoading').popup("open");
	    }

        popupLoading = true;
	    
		//read collection
		this.fileService.requestFileSystem(1, 1024, function (fileSystem) {
		    fileSystem.root.getFile('/partyplayer/collection/index.json', null, function(entry) {
    		    entry.file(function (blob) {
                    var url = window.URL.createObjectURL(blob);
                    $.getJSON(url, function(data) {
                        self.items = data;
                        self.drawItems();
                        
                        if (!popupLogin) {
                            $('#popupLoading').popup('close');
                        }
                        
                        popupLoading = false;
                    });
		        });
		    }, function (error) {
    			alert("Error getting file (#" + error.code + ")");
		    });
		}, function (error) {
			alert("Error requesting filesystem (#" + error.code + ")");
		});
	},
	drawItems:function() {
		var itemList = '';

        this.items.sort(function(a, b) {
                    if ( a.title < b.title )
                      return -1;
                    if ( a.title > b.title )
                      return 1;
                    return 0;        
        });
	
		$.each(localItems.items, function(i, item) {
			var trItem = '';
			trItem += '<li class="shareableItem" item-id="' + i + '"><a href="#" class="shareableitemlink">';
			
			if (item.cover) {
    		    trItem += '<img src="'+item.cover+'"/>';
			} else {
    		    trItem += '<img src="../library/album-art-unknown.png"/>';
			}
			
			if (item.title) {
    		    trItem += '<h3>'+item.title+'</h3>';
			} else {
			    trItem += '<h3>'+item.filename+'</h3>';
			}

		    trItem += '<p>' + item.artist + ' / ' + item.album + '</p>';
			trItem += '</a></li>';
		    itemList += trItem;
		});	
		$('ul#user-collection').append(itemList);

            //         if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
            // $('ul#user-collection li.shareableItem').swipeDelete({
            //     btnLabel: 'Share',
            //     btnTheme: 'a',
            //     click: function(e) {
            //         e.preventDefault();
            //         localItems.shareItemsClick(e);
            //     }
            // });
            //         } else {
            $('ul#user-collection li.shareableItem').unbind("click").bind("click", localItems.shareItemsClick);
        // }
		
		try {
    	    $('ul#user-collection').listview('refresh');
        } catch (err) {

        }
	}
};
