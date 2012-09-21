Home of the party collection app and host-functionality

/include: contains included libraries and classes
/test: contains testscript


To test the party collection host functionality, do the following
1. Run the app2app stub server; there's a shortcut script called runApp2Appstub.sh (you might need to add executing rights ("chmod +x runApp2Appstub.sh") first
2. Open a browser, in the browser open the testPartyHost.html page (partyplayer/collection/test/testPartyHost.html)
3. Click "Init", "Search", "Create" (in that order)
4. Open a second browser tab, in this browser open the "webinos App2App stub tester" (partyplayer/a2a-stub/test/client.html)
5. Open Click "Init", "Search", "Create" (in that order).
6. Select one of the commands from the partyplayer/a2a-stub/test/testCommands.md file
7. Insert the command in the text box in the browser (step 4/5) and press send.
8a. See the result being transmitted back from the server to you browser.
8b. Also see the console out put in the first browser screen (step 3).
9. Try a different command (Step 6).


