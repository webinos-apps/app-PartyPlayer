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
        +-- a2a-stub                   -> webinos App2App stub server
        |
        +-- apps                       -> apps, both host and guest
        |
        +-- docs                       -> documentation, incl generated figures
        |
        +-- library                    -> content
        |
        +-- README.md                  -> this file


### Running

The PartyPlayer depends on the webinos platform, in particular the App2App API. As this API is currently missing, a stub is used. This stub is started from the a2a-stub folder by issueing `./server.js`.

The PartyPlayer consists of two parts, that both must be opened in a recent version of firefox or chromium:

1. Party **Host** front-end at `apps/host/index.html`. Use a single instance.
2. Party **Guest** front-end at `apps/guest/index.html`. Use as many as you like.

Check out [jira for AppParty](http://jira.webinos.org/browse/APPPARTY) for a complete overview of the product backlog, plans for new features or for issueing bugs.

For details on the implementation please refer to the docs.

### Usage

The Host app is supposed to run large, on a TV screen for example. It plays the media, shows upcoming songs, displays chats and invites people at the party to join in the interactive experience.

Each guest runs a guest app. Using the app you can share your own music collection with 'Add local items'. Doing so will extend the Collection that is seen by everyone, visually too. Other guests can then proceed to actually 'Add' the content. Note that this scheme requires you to convince others that your shared music should be played!

All music that has been added this way is moved to the funnel. This is where the interaction takes place. Think of simply upvoting your favourites, but also of playing mini games to gain power...

### Acknowledgements

Icons located in apps/guest/icons/icons.js were downloaded from the [Icon Archive](http://www.iconarchive.com/).

