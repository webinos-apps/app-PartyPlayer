$(document).ready(function(){
    var channel = null;

    webinos.app2app.init('ws:localhost:10666/guest', function() {
        log('Connected to a2a stub server (as guest)');

        channel = webinos.app2app.createChannel('partyplayer', null, null, function() {
            log('Waiting for protocol implementation');
        });
    });


    partyplayer.shareItem = function(item)
    {
        channel.send( item );
    };
});
