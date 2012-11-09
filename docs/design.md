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

### Protocol

The PartyPlayer utilises two types of messages: unidirectional and broadcast messages.
Broadcast messages are sent from the Host to all connected party guest clients.
Unidirectional messages are sent from a Client to a Host and vice versa.
An Unidirectional message from Client to Host MAY be followed by a Unidirectional message from Host to Client, but this is optional.

![Message Format](figures/common_classes_message.png "Message format")

A message consists of a header and a payload. The header consists of three parameters/fields: the namespace ("ns"), the command ("cmd") and the optional reference identifier ("ref")



![Protocol join](figures/protocol_join.png "A party guest client connects to the server").

The guest sends his users' alias to the server. On success, it receives the `userId` to use for the rest of the session. Users may use the same alias. After doing the user administration, the server continues with sending the complete collection.

![Protocol share](figures/protocol_share.png "A party guest shares content").

After sharing, the guest client receives the same item extended with an `itemId`. This id is unique within all guests and the host and must be used to reference that item. Done like this, the client can passively update its own view of the media collection.

