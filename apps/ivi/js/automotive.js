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
 * (C) Copyright 2013, BMW Forschung und Technik GmbH
 *
 * Authors: Simon Isenberg
 */
var funnel2Automotive = (function(){
  var visibleItems = new Array(6);
  var sortedList = [];
  var initalized = false;
  funnel.onInit(function(){
    playerViz.onTimeUpdate(function(currentTime, timeLeft, duration){
      var s, m;
      s = timeLeft % 60;
      m = Math.floor( timeLeft / 60 ) % 60;
      s = s < 10 ? "0"+s : s;
      m = m < 10 ? "0"+m : m;
      $('#cTime').html( m+":"+s);

     var width = Math.round((currentTime/duration)*300);
           $('#progressbar-inner').css("width", width +'px');     
    });
    playerViz.removeControls();
    playerViz.disableButtons();
  });

  funnel.onRemoveItem(function(key){
    updateFunnelView();
  });
  
  funnel.onVoteItem(function(key){
    updateFunnelView();
  });  

  funnel.onAddItem(function(key){
    updateFunnelView();  
  });

  var updateFunnelView = function(){
    sortedList = funnel.getFunnel();
  



    if(sortedList.length > 0){
      
      /*
      * ELEMENT 0: key 1: is number of votes
      */
      
      if(visibleItems[0] != sortedList[0][0]){
        var key = sortedList[0][0];
        var votes = sortedList[0][1];
        user = pc.getUser(funnel.getFunnelListItem(key).userID);
        item = pc.getItem(funnel.getFunnelListItem(key).itemID);

        //DISPLAY NEXT SONG;
        
        $('#cNext').css("background-image", "url("+ item.item.cover+")");

        $('#cNextInner > .vtitle').html(item.item.title);
        $('#cNextInner > .vartist').html(item.item.artist);

        $('#cNext > .csTrend').html(votes);
        $('#cNext > .csPerson').css("background-image", "url("+user.thumbnail+")");
        visibleItems[0] = sortedList[0][0];
      }
      if(initalized){
        $('#currentlyPlaying').removeClass('full');
        $('#currentlyPlaying').addClass('medium');
        $('#cNext').fadeIn(); 
        
      }else{
        initalized = true;
        $('#currentlyPlaying').fadeIn();
      }
      if(sortedList.length == 1){
          $('#cSongs').fadeOut();
      }else{
          for(var i = 1; i < visibleItems.length; i++){
            if(sortedList.length > i){
              if(sortedList[i][0] != visibleItems[i]){
                visibleItems[i] = sortedList[i][0];
                var key = sortedList[i][0];
                var votes = sortedList[i][1];
                user = pc.getUser(funnel.getFunnelListItem(key).userID);
                item = pc.getItem(funnel.getFunnelListItem(key).itemID);
                $('#cs'+i).css("background-image", "url("+ item.item.cover+")");

                $('#cs'+i +' > .csTrend').html(votes);
                $('#cs'+i +' > .csPerson').css("background-image", "url("+user.thumbnail+")");
                $('#cs'+i).fadeIn();

                $('#cs'+i +' > .csVoteInner >.vtitle').html(item.item.title);
                $('#cs'+i +' > .csVoteInner >.vartist').html(item.item.artist);
              
              }
            }else{
                visibleItems[i] = 0;
                $('#cs'+i).fadeOut();
            }

          }

          $('#cSongs').fadeIn();
      
      }
  }else{
     $('#currentlyPlaying').removeClass('medium');
     $('#currentlyPlaying').addClass('full');
     $('#cNext').fadeOut();
  }
  initalized = true;
  };

  funnel.onAnimate(function(key){
    
    user = pc.getUser(funnel.getFunnelListItem(key).userID);
    item = pc.getItem(funnel.getFunnelListItem(key).itemID);
    
    console.log(user);
    console.log(item);


    $('#cSong').html(item.item.title);

    $('#cArtist').html(item.item.artist);

    $('#containerCover').css("background-image", "url("+ item.item.cover+")");  
    $('#cChosenInner').css("background-image", "url("+user.thumbnail+")");
  });



  return{
    displayCurrentPlayedSong : function(key){
    },

    displayNextSong : function(key){

    },

    displayFunnel : function(){


    },


  }

})();