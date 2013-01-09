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

Author Victor Klos, Martin Prins, Arno Pont, Daryll Rinzema
-->

# webinos PartyPlayer Design

> Authors: Victor Klos, Martin Prins, Arno Pont, Daryll Rinzema

## Introduction

The webinos PartyPlayer is a wp5/wp6 demo application showcasing webinos in the
home media domain.

## Overview

### Collection and Playlist

The host keeps the `PartyCollection`, the `PartyItemFunnel` and the `PartyPlayList`. These are distinct entities.
All these entities extend `Collecion`, which provides generic entities.

### Media items

![item Classes](figures/common_classes.png "Media Classes defined in partyplayer.common").

Also check out the generated [API documentation](apidoc/index.html).

##Protocol

The PartyPlayer utilises two types of messages: unidirectional and broadcast messages.
Broadcast messages are sent from the Host to all connected party guest clients.
Unidirectional messages are sent from a Client to a Host and vice versa.
An Unidirectional message from Client to Host MAY be followed by a Unidirectional message from Host to Client, but this is optional.

![Message Format](figures/common_classes_message.png "Message format")

A message consists of a header and params. The header consists of three parameters/fields: the namespace ("ns"), the command ("cmd") and the optional reference identifier ("ref"). Params contain all parameters associated with the cmd.

###Joining

![Protocol join](figures/protocol_join.png "A party guest client connects to the server").

The guest sends his users' alias to the server. On success, it receives the `userID` to use for the rest of the session as well as `users`, a collection of all `userID`-`userAlias` pairs. Users may use the same alias. After doing the user administration, the server continues with sending the complete collection.

###Sharing
![Protocol share](figures/protocol_share.png "A party guest shares content").

After sharing, all guest clients receive an update containing, the `userID`, the `itemID` and the same `Item` . This `itemID` is unique within all guests and the host and must be used to reference that Item. Done like this, the client can passively update its own view of the media collection, whilst also maintaining which user, as identified with the `userID` offers which Item(s);

###Leaving

![Protocol leave](figures/protocol_leave.png "A party guest leaves the party").

On leaving, either on connection level (e.g. a network disconnect) or application level (a user leaves the application) the user is removed from the application, as well as it's items it has provided.
The host sends a removePlayer message, containing the `userID`, to notify each guest that a player has left the session.

##Funnel

The Funnel constists of two things. A Singleton (the Funnel self) that keeps track of all the items inside the Funnel and a Front-End part that gets called when the Funnel updates FunnelItems (for example switching a circle), these updates get represented using the Front-End part. The Funnel has a Collection to keep track of FunnelItems. Everywhere in the code it's possible to type funnel.method(params).

A detailed explanation of the funnel functions, along with parameter type requirements, can be found here:
[API funnel documentation](apidoc/symbols/funnel.html). 

###FunnelItem

![Protocol FunnelItem](figures/common_classes_funnelItem.png "The FunnelItem")

The FunnelItems get build using an itemID, starts with 1 vote and a userID for the guest who added the Item.

####Start the Funnel

![Protocol startFunnel](figures/starting_funnel.png "Starting the Funnel")

In order to setup the Funnel, funnel.init(funnelSize, circles) will build the size of the funnel along with the given circles. funnelSize (int) =  width + height in pixels and circles(int) is the maximum amount of circles. Funnel is the Back-End and VisualFunnel is the Front-End, hereby used in the upcoming diagrams.

####Adding items

![Protocol addItem](figures/protocol_funnel_addItem.png "Add an Item to the funnel")

When an Item gets added it will be used to create a FunnelItem. The key that will be returned from Collection will be used throughout the whole FunnelItem's lifetime.

The Item that gets added will also be created in the DOM using the same key as an attribute for that element. The DOM element created will be automatically added to the outer circle and gets invoked to make his turn (the startArc function in the apidoc). It returns the DOM element back to the Funnel.

####Removing items

![Protocol removeItem](figures/protocol_funnel_removeItem.png "Remove an Item from the funnel")

The remove function makes sure to delete all references to the Item in the Funnel. It looks for an Item, if it can't be found it returns false, if the Item can be found, it will also be removed from the DOM. The remove function asks for a callback function, and this has the purpose to assign the PartyCollection remove function.

####Voting for items

![Protocol voteItem](figures/protocol_funnel_voteItem.png "Voting for an Item of the Funnel")

When voting for an Item, only the key will be needed. If the vote is unsucceful the Funnel returns false, the vote doesn't get updated and the VisualFunnel (Front-End) won't be called. If the vote is succesful the Front-End will be called and updated. Also a true will be send back to the PartyCollection.

##Player

The Player is by default non-existent, like the Funnel. It needs to be started. The Player itself is active and has influence on the Funnel. More specefic, the Player has the ability to "empty" the funnel, this by looking for the highest ranked Item (in votes) to play.

####Start the Player

![Protocol startPlayer](figures/starting_player.png "Starting the Player")

By calling the player.init() function, the Player will be created and invokes the visual part to build a player. Like the Funnel, the Front-End part hereby referenced as VisualPlayer. The Visual part returns, when the player has been created, the DOM element. This will be saved in the Player for future reference.

####Updating Player

NOTE: the Player will automatically grab the very first Item that gets added to the Funnel (player.start()). Other items will be looked for when a song has finished playing.

![Protocol updatePlayer](figures/protocol_updating_player.png "Updating the Player")

The HTML5 audio element has the funcionality to invoke functions when it has reached a certain state, this gets set in the HTML. That's why the protocol starts with the VisualPlayer, because in fact the function will be called from the Front-End. When the Player gets invoked to look for the next song it looks for the top rated Item (in votes) in the Funnel and, if found, invokes the Funnel to play an animation, if the animation is done, the Funnel will remove the Item. At the same time, the player calls the VisualPlayer to update it's source file to the new song. However, if the funnel is empty, a 'false' will be returned.

The player.getSong() function is being used for all matters of changing the Player's source file. So the button next to player invokes the same function and goes through the same process.

## Visual Design

An explanation about the working of the Visual Part of the Funnel and Player.

![Protocol visual_classes](figures/visual_classes.png "Visual Design Funnel/Player")

The baseclass Visual holds the name of the inherited class and as well the DOM element so it can be referenced throughout the rest of the class. Mainly the Funnel has extra private variables that are used for calculations in the different private and public functions. The Player however is smaller and only has a few public functions. As can be seen in the classes, the functions ask a lot for a 'selector' paramater, this is used to update the visual representation of an Item. The way this is setup is done by a JavaScript Pattern, called the Functional Pattern.
