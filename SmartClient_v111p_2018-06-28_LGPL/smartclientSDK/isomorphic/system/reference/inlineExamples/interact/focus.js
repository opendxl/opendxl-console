isc.HStack.create({
    showEdges: true,
    canAcceptDrop: true,
    animateMembers: true,
    dropLineThickness: 4,
    members: [
        isc.Img.create({
            ID:"bluePawn",
            layoutAlign: "center",
            width:48, height:48,
            canFocus: true,
            src: "pieces/48/pawn_blue.png",
            canDragReposition: true,
            canDrop: true,
            dragAppearance: "target",
            focusChanged : function (hasFocus) {
                focusLabel.setFocusWidget(this, hasFocus);
            }
        }),
        isc.DynamicForm.create({
            ID:"simpleForm",
            layoutAlign: "center",
            height: 48,
            fields: [
                {name: "field1", type: "select", valueMap: ["Option 1", "Option 2"]},
                {name: "field2", type: "date"}
            ],
            focusChanged : function (hasFocus) {
                focusLabel.setFocusWidget(this, hasFocus);
            }
        }),
        isc.Img.create({
            ID:"greenPawn",
            layoutAlign: "center",
            width:48, height:48,
            canFocus: true,
            src: "pieces/48/pawn_green.png",
            canDragReposition: true,
            canDrop: true,
            dragAppearance: "target",
            focusChanged : function (hasFocus) {
                focusLabel.setFocusWidget(this, hasFocus);
            }
        })
    ]
});

isc.Label.create({
    ID:"focusLabel",
    align:"center",
    top:150,
    width:300,
    height:50,
    setFocusWidget : function (widget, hasFocus) {
        if (hasFocus) this.setContents(widget.getID() + " has focus");
        else this.setContents("");
    }

});
