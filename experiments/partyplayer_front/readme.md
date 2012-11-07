## partyplayer_front

this folder is an expiremental folder containing small bits and pieces of the partyplayer app.

In the JS folder are a few test js files showing some javascript patterns, these are:

1. testpseudoclassical.js
2. functionalpattern.js

The canvas folder holds a small test using the html5 canvas draw element.

These files are stub files to fake the data I would be getting for the frontend:

* create_collection.js
* create_collection2.js
* screenshot.js

The collection.html file contains the basic html and loads the javascript files.

Current status of this experiment can be loaded using main.js, initialize.js and visual.js<br/>
functionalities:

* load collection
* add/remove partyitem to funnel/playlist
* integrated youtube API
* able to play youtube movies
* when youtube is done, load next item in playlist
* updating funnel items
* buildup playlist

main.js doesnt do a lot except for once initializing the whole setup, the rest happens in initialize.js

intialize.js manages for a small bit the 3 important parts of the partyplayer:

* Collection
* Funnel
* Playlist

visual.js gets called all the other times when jquery has to update things that are happening
in the collection and show these changes on screen.
Again visual holds a system managing the 3 parts metioned above.

It's an expirement trying to work with closures and different kinds of patterns in
JavaScript.

Many bugs are still present and many files are outdated and are simple tests of coding
