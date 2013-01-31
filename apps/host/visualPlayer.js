/**
 *  The class updating the player frontend & css. Same build as the funnel, with Visual as baseclass
**/
var visualPlayer = function(name, selector){
  var that = Visual(name, selector);
  var disabledButtons = false;
  /**
   *  Build the player onscreen. Returns itself as DOM element.
   *  string Returns DOM element
   *
   *  @methodOf visualPlayer
  **/
  that.buildPlayer = function(){
        $(selector).html('<audio id="playback" autoplay controls onended="player.getSong()">' + 
      '<source src="" type="audio/ogg">' +
      '<source src="" type="audio/mpeg">' +
      'Your browser does not support the audio element.</audio>');
      
      var playerSelector = '#playback';
      return playerSelector;      
  };
    /**
   *  For manually updating the player to play a given url
   *
   *  @methodOf visualPlayer
   *  @param url string The URL the play
   *  @param playerSelector string The player to update
  **/
  that.updatePlayer = function(url, playerSelector){
      $(playerSelector).attr('src', url);
  };

  /**
   *  Removes the browser specific controls of the media element
   *
   *  @methodOf visualPlayer
  **/ 
  that.removeControls = function(){
      $('#playback').removeAttr('controls');
  }

  /**
   *  Disables adding a button for skipping songs.
   *
   *  @methodOf visualPlayer
  **/ 
  that.disableButtons= function(){
    disabledButtons = true;
  }
  /**
   *  Creates a button to manually look for the next song to play. Calls player.getSong()
   *
   *  @methodOf visualPlayer
  **/
  that.setupButton = function(){
      if(!disabledButtons){
        $(selector).append('<button id="setupButton">Play next track</button>');
        $('#setupButton').bind('click', player.getSong);
      }
    };
  /**
   *  Register callback for timing events of the current media file. The callback is used
   *  to create customized media player. callback conatains  the following parameters: 				   
   *  current time position, time left and duration of the media item in seconds
   *
   *  @methodOf visualPlayer
  **/  
  that.onTimeUpdate = function(callback){
    var audio = document.getElementById('playback')
    audio.addEventListener('timeupdate', function(){
    var duration = parseInt( audio.duration );
    var currentTime = parseInt( audio.currentTime );
    var timeLeft = duration - currentTime;
      callback(currentTime, timeLeft, duration);

    });

  };

  return that;
}

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
class VisualPlayer {
    public string buildPlayer()
    public void updatePlayer(url, playerSelector)
    public void setupButton()
}

Visual <|-- VisualFunnel
Visual <|-- VisualPlayer

@enduml
*/