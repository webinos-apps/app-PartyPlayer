$(document).ready(function(){

    partyplayer.init('host');

});

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
