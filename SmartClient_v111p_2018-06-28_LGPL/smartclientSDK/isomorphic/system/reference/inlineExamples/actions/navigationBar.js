isc.NavigationBar.create({
    width: "100%",
    leftButtonTitle: "Back",
    rightButtonTitle: "Forward",
    showRightButton: true,
    title: "NavBar Title",

    navigationClick : function (direction) {
        if (direction === "back") {
            isc.say("Back button clicked!");
        } else if (direction === "forward") {
            isc.say("Forward button clicked!");
        }
    }
});
