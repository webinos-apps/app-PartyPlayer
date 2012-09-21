$(document).ready(function(){
    var channel = null;

    webinos.app2app.init('ws:localhost:10666/host', function() {
        log('Connected to a2a stub server (as host)');

        channel = webinos.app2app.createChannel('partyplayer', null, null, function() {
            log('Waiting for protocol implementation');

            //////////// protocol implementation from here ////////////

            /*
            @startuml protocol_join.png
                hide footbox
                participant "g:PartyGuestApp" as guest
                participant PartyHostApp as host
                group A guest initialises
                    guest -> host : join(alias)
                    host -> guest : welcome(userId)
                    note right : From now on all messages\nto the host include userId
                    loop over collection
                        host -> guest : updateCollectionItem(itemId, item)
                    end
                end
            @enduml
            */


            /* 
            @startuml protocol_share.png
                hide footbox
                participant "g:PartyGuestApp" as guest
                participant PartyHostApp as host
                group A guest shares media
                    guest -> host : shareItem(userId,_Item)
                    host -> guest : updateCollectionItem(itemId, item)
                end
            @enduml
             */
        });
    });
});
