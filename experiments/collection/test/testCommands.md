Testcommands to be transmitted via the App2Appstub tester


#getItems - with specified userID, and filter on mimetype:
{"type":"collection","cmd":"getItems","args":{"userID":1,"mimetype":"audio/mp3"}}

{"type":"collection","cmd":"getItems","args":{"userID":1,"mimetype":"audio/mp4"}}

#get all Items
{"type":"collection","cmd":"getItems"}



#add Item to the collection:

{"type":"collection","cmd":"addItem","args":{"userID":1,"item":{"version":1,"filename":"michael jackson - bad.mp3","title":"Bad","artist":"Michael Jackson","mediatype":"audio","mimetype":"audio/mp3","screenshot":"base64/???","screenshotURI":"http://youtube.com/screenshot.png","duration":"00:03:55","contentType":"onDemand","contentSrc":"file","URI":"","src":"      "}}}


removeItemByID:

{"type":"collection","cmd":"removeItem","args":{"itemID":1}}
