<!--
This file is part of webinos platform.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

(C) Copyright 2012, TNO

Author Victor Klos
-->

## Project home of the webinos PartyPlayer demo

The layout of this project folder is as follows:

        |
        +-- apps                       -> apps, both host and guest
        |
        +-- docs                       -> documentation, incl generated figures
        |
        +-- indexer                    -> the content indexer
        |
        +-- library                    -> shared files
        |
        +-- README.md                  -> this file

### Installing

The PartyPlayer depends on the [webinos platform](www.webinos.org), in particular the [App2App](http://dev.webinos.org/deliverables/wp3/Deliverable34/app2app.html) and [File API](http://www.w3.org/TR/2011/WD-FileAPI-20111020/).

Please make sure you have a [running webinos platform that is connected to a PZH](https://developer.webinos.org/running) before continuing the installation of PartyPlayer. Webinos installers are found [here](https://developer.webinos.org/webinos-installers).

To install the PartyPlayer clone the project or download the [zip file](https://github.com/webinos/app-PartyPlayer/archive/master.zip) and unzip in onto your system.

### Indexing your content

For now your mp3 collection has to be indexed and added manually to the PartyPlayer to be able to share media items. The collection has to be put at the correct location of the root file system of your PZP following the steps below:

#### Create the index

1. Create a folder and put the mp3 you want to use in the PartyPlayer into that folder.
2. Install the indexer pre-requests by executing *npm install* from the indexer folder *<PartyPlayer folder>/indexer*. Note: this will need [node-canvas](https://github.com/learnboost/node-canvas).
3. Run the indexer by executing: *./indexer.js --lib=[path-to-folder-containing-mp3s]*

#### Copy the files into your PZP

1. Create the folder that is going to hold your media collection: *mkdir -p ~/.webinos/${HOSTNAME}_Pzp/userData/file/default/partyplayer/collection*.
2. Copy all the files from your mp3 folder into the newly created folder.

Or on Android:

1. *adb shell* into your device (this requires your device to be in developer mode).
2. Change into the root folder of your PZP. It should be a subfolder of */sdcard/.webinos* and ends with *_Pzp*. For example: *85fc647caa9834c8_Pzp*.
3. From within your *...._Pzp* folder create the folder that is going to hold your media collection: *mkdir -p userData/file/default/partyplayer/collection*.
4. Use *adb push* to copy all the files from the folder that holds your mp3s into the newly created folder on your Android device.

When you add more media items to your collection you should always re-run the indexer to have them picked up by the partyplayer.

### Running

The PartyPlayer consists of two parts, that both must be opened in a recent version of Safari, Chrome or Chromium. The guest app also works in recent versions of Firefox:

1. Open the party **Host** front-end by opening the file `app-PartyPlayer/apps/host/index.html`. Use a single instance.
2. Open the party **Guest** front-end by opening the file `app-PartyPlayer/apps/guest/index.html`. Use as many as you like.

Check out [jira for AppParty](http://jira.webinos.org/browse/APPPARTY) for a complete overview of the product backlog, plans for new features or for issuing bugs.

For details on the implementation please refer to the docs.

### Usage

The Host app is supposed to run large, on a TV screen for example. It plays the media, shows upcoming songs, displays chats and invites people at the party to join in the interactive experience.

The party has to be started by the guest app of the host. For now this is the first guest that arrives and uses the same Personal Zone as the party host uses. All content of this guest is automatically added to the party collection. Once the party host has arrived the party is started and media items can be added to the playlist.

Each guest runs a guest app. Using the app you can share your own music collection with 'Add local items'. Doing so will extend the Collection that is seen by everyone, visually too. Other guests can then proceed to actually 'Add' the content. Note that this scheme requires you to convince others that your shared music should be played!

All music that has been added this way is moved to the funnel. This is where the interaction takes place. Think of simply up-voting your favorites, but also of playing mini games to gain power...

### Documentation

Building the documentation requires [PlantUML](http://plantuml.sourceforge.net/), [jsdoc-toolkit](https://code.google.com/p/jsdoc-toolkit/) and [markdown](http://daringfireball.net/projects/markdown/).

#### Building documentation on OSX

1. Download and install [PlantUML](http://plantuml.sourceforge.net/)
2. Create a script to execute PlantUML and add it to your path. Or you can use [this example script](https://gist.github.com/4502562)
3. Install jsdoc-toolkit using [Homebrew](http://mxcl.github.com/homebrew/): *brew install jsdoc-toolkit*
4. Install markdown using [Homebrew](http://mxcl.github.com/homebrew/): *brew install markdown*

Good luck!

### Acknowledgements

Check the NOTICE file to see what 3rd party code the PartyPlayer is using.



