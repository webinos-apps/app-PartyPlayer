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

![Item Classes](figures/common_classes.png "Media Classes defined in partyplayer.common").

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

After sharing, all guest clients receive an update containing, the `userID`, the `itemID` and the same `item` . This `itemID` is unique within all guests and the host and must be used to reference that item. Done like this, the client can passively update its own view of the media collection, whilst also maintaining which user, as identified with the `userID` offers which item(s);

###Leaving

![Protocol leave](figures/protocol_leave.png "A party guest leaves the party").

On leaving, either on connection level (e.g. a network disconnect) or application level (a user leaves the application) the user is removed from the application, as well as it's items it has provided.
The host sends a removePlayer message, containing the `userID`, to notify each guest that a player has left the session.

##Funnel

The Funnel constists of two things. A Singleton (the Funnel self) that keeps track of all the items inside the Funnel and a Front-End part that gets called when the Funnel updates FunnelItems (for example switching a circle), these updates get represented using the Front-End part. The Funnel has a Collection to keep track of FunnelItems. Everywhere in the code it's possible to type funnel.method(params).

A detailed explanation of the funnel functions, along with parameter type requirements, can be found here:
[API funnel documentation](apidoc/symbols/funnel.html). 

###FunnelItem

![Protocol FunnelItem](figures/common_classes_funnelItem.png "The FunnelItem").

The FunnelItems gets build using an itemID and the amount of hitpoints it has and a default value of 100 for votes. (No hitpoints usage as of yet so a default value will be set if left blanc). 

####Start the Funnel

In order to setup the Funnel, funnel.init(funnelSize, circles) will build the size of the funnel along with the given circles. funnelSize (int) =  width + height in pixels and circles(int) is the maximum amount of circles. Funnel is the Back-End and VisualFunnel is the Front-End, hereby used in the upcoming diagrams.

####Adding items

![Protocol addItem](figures/protocol_funnel_addItem.png "Add an item to the funnel").

When an item gets added it will be used to create a FunnelItem. The key that will be returned from Collection will be used throughout the whole FunnelItem's lifetime.

The item that gets added will also be created in the DOM using the key. The DOM element created will be automatically added to the outer circle and gets invoked to make his turn (the startArc function in the apidoc). It returns the DOM element back to the funnel.

Last the created key will be returned for futures reference, but returns falls on failure (if the funnel is full).

####Removing items

![Protocol removeItem](figures/protocol_funnel_removeItem.png "Remove an item from the funnel").

Almost the same as adding items, the remove function goes through the same sequence of removing items. It looks for an item, if it can't be found it returns false, if the item can be found, it will also be removed from the DOM and returns true.

####Voting for items

![Protocol removeItem](figures/protocol_funnel_voteItem.png "Voting for an Item of the funnel").

When voting for an item, the value is a positive or a negative number. If the vote is unsucceful the Funnel returns false, the vote doesn't get updated and the VisualFunnel (Front-End) won't be called. If the vote is succesful the Front-End will be called and updates the funnelItem and will show a blink depending on the value.

##Player

The Player is by default non-existent, it needs to be created and started. When started it will look for the first item it can find in a circle, if a circle is empty it will go to the next circle of the Funnel. This means that the Funnel doesn't update itself untill the Player says so.

####Start the Player

By calling the instantiated visualPlayer, by default: playerViz, a button will be attached to the given selector, this button will look for the first song and ,when found, updates itself to a player. The function is: playerViz.setupButton();

####Updating Player

It's possible to update the Player using the following instructions:

1.  Let the Player look for the item (automatic)
2.  Update the Player to a given song (manual)
3.  Fully stop the Player


