# Party Guest App #
To test the guestApp functionality, do the following:

## Getting Started ##
1. Run the app2app stub server.js ( *../partyplayer/a2a-stub/server.js* ).
1. Open index.html in Chrome ( *Only browser that fully supports the file API and ID3 parser library for now*).
1. Click: *"Init"*, *"Create"* (*in that order*).
1. Open a second browser tab, in this browser open testPartyHost.html ( *../partyplayer/experiments/collection/test/testPartyHost.html* ).
1. Click: *"Init"*, *"Create"* (*in that order*).
1. Check if each tab says: (*createChannel invoked with alwaysTrue  
websocket open,connected to a2a stub server  
webinos.app2app stub succesfully initialised*)
1. Go to index.html, choose an alias and Click: *"Alias"*.

## See the collection ##
1. For now: type: *{"type":"collection","cmd":"getItems"}* in input field and Click: *"Send"*.
1. TODO: Create something where you can interact with the collection.   

## Vote ##

1. TODO: Create a vote mechanism.

## Share files with Collection ##
  
1. Click: *"Share"*.
1. Select .mp3 files through file API.(*Note that the ID3 parser library is not all that great and does not wotk with every .mp3 file*)  
1. Optional: Select more files.(*Note that the file API does not allow you to make the exact same selection twice*).
1. Click: *"Share"*.
1. Watch the collection in the log.
