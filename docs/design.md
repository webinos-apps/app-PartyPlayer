# webinos PartyPlayer Design

> Authors: Victor Klos, Martin Prins, Arno Pont, Daryll Rinzema

## Introduction

The webinos PartyPlayer is a wp5/wp6 demo application showcasing webinos in the
home media domain.

## Overview

### Collection and Playlist

The host keeps the `PartyCollection`, the `PartyItemFunnel` and the `PartyPlayList`. These are distinct entities.

### Media items

![Item Classes](figures/common_classes.png "Media Classes defined in partyplayer.common").

Also check out the generated [API documentation](apidoc/index.html).

### Protocol

![Protocol join](figures/protocol_join.png "A party guest client connects to the server").

The guest sends his users' alias to the server. On success, it receives the `userId` to use for the rest of the session. Users may use the same alias. After doing the user administration, the server continues with sending the complete collection.

![Protocol share](figures/protocol_share.png "A party guest shares content").

After sharing, the guest client receives the same item extended with an `itemId`. This id is unique within all guests and the host and must be used to reference that item. Done like this, the client can passively update its own view of the media collection.

