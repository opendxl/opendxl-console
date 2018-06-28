isc.NavigationBar.create({
    ID : "navBar",
    width : 296,
    leftButtonTitle : "Folders",
    rightButtonTitle : "New",
    showRightButton : true,
    title : "Inbox",
    animateStateChanges: true,
    navigationClick : function(direction) {
        if (direction == "back") {
            if (this.leftButtonTitle == "Inbox") {
                this.setRightButtonTitle("New");
                this.setViewState({
                    leftButtonTitle: "Folders",
                    title: "Inbox"
                }, "back");
            } else if (this.leftButtonTitle == "Folders") {
                this.setRightButtonTitle("Inbox");
                this.setViewState({
                   leftButtonTitle: "Exit",
                   title: "Folders"
                }, "back");
            } else if (this.leftButtonTitle == "Exit") {
                isc.say("Exiting");
            }
        } else {
            if (this.title == "Inbox") {
                this.setRightButtonTitle("Done");
                this.setViewState({
                    leftButtonTitle: this.title,
                    title: "New Message"
                }, "forward");
            } else if (this.title == "Folders") {
                this.setRightButtonTitle("New");
                this.setViewState({
                    leftButtonTitle: "Folders",
                    title: "Inbox"
                }, "forward");
            } else if (this.title == "New Message") {
                isc.say("Sending message");
                this.setRightButtonTitle("New");
                if (this.leftButtonTitle == "Inbox") {
                    this.setViewState({
                        leftButtonTitle: "Folders",
                        title: "Inbox"
                    }, "back");
                } else if (this.leftButtonTitle == "Folders") {
                    this.setViewState({
                        leftButtonTitle: "Exit",
                        title: "Folders"
                    }, "back");
                }
            }
        }
    }

});