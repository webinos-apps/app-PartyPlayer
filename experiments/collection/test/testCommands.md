Testcommands to be transmitted via the App2Appstub tester


#getItems - with specified userID, and filter on mimetype:
{"type":"collection","cmd":"getItems","args":{"userID":1,"mimetype":"audio/mp3"}}

{"type":"collection","cmd":"getItems","args":{"userID":1,"mimetype":"audio/mp4"}}

#get all Items
{"type":"collection","cmd":"getItems"}

#getItemCount
{"type":"collection","cmd":"getItemCount"}

{"type":"collection","cmd":"getUsers"}

#add Item to the collection:

{"type":"collection","cmd":"addItem","args":{"userID":"anton","item":{"version":1,"filename":"michael jackson - bad.mp3","title":"Bad","artist":"Michael Jackson","mediatype":"audio","mimetype":"audio/mp3","screenshot":"base64/???","screenshotURI":"http://youtube.com/screenshot.png","duration":"00:03:55","contentType":"onDemand","contentSrc":"file","URI":"","src":"      "}}}


removeItemByID:

{"type":"collection","cmd":"removeItem","args":{"itemID":1}}


#getItemID
{"type":"collection","cmd":"getItem","args":{"itemID":11}}


{"type":"collection","cmd":"getItem","args":{"itemID":"2obbvqexhhy"}}


##################################################
#Joining / Leaving

#Client -> Host:
{"ns":"main","cmd":"join","payload":{"alias":"henk"}}
Host -> Client:
{"ns":"main","cmd":"join","payload":{"userID":"dsgsvgfs34r"}}

#change Alias
{"ns":"main","cmd":"changeAlias", payload{"userID":userID,"alias":newAlias}

#Host -> Broadcast #either for join or aliasUpdate
{"ns":"main","cmd:"updatePlayer","payload":{"userID":userID,"alias":alias}

#Client -> Host: leave
{"ns:"main","cmd":"leave","args":{"userID": "NUMBER"}}

#Host -> Broadcast
{"ns:"main","cmd":"leave","args":{"userID": "NUMBER"}}



##################################################
#adding Items
# ds



#addItem
{"ns":"main","cmd":"addItem","payload":{"userID":"anton","item":{"version":1,"filename":"michael jackson - bad.mp3","title":"Bad","artist":"Michael Jackson","mediatype":"audio","mimetype":"audio/mp3","screenshot":"base64/???","screenshotURI":"http://youtube.com/screenshot.png","duration":"00:03:55","contentType":"onDemand","contentSrc":"file","URI":"","src":"      "}}}



{"type":"message","payload":{"ns":"main","cmd":"leave","params":{"userID":"c947au4k7bo"}}}
{"type":"message","payload":{"ns":"main","cmd":"updateAlias","params":{"userId":"pietje","userAlias":"nieuwe"}}



{"ns":"partyplayer", "CMD": 
