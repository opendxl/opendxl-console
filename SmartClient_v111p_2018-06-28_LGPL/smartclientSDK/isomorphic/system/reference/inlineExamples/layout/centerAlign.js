// There are 3 HLayout examples and 3 VLayout examples
//
// 1. HLayout with layout.align = 'center'
// 2. HLayout with member.layoutAlign = 'center' (or layout.defaultLayoutAlign = 'center')
// 3. HLayout with LayoutSpacers
// 4. VLayout with layout.align = 'center'
// 5. VLayout with member.layoutAlign = 'center' (or layout.defaultLayoutAlign = 'center')
// 6. VLayout with LayoutSpacers


// 1. HLayout with layout.align = 'center'
//
// This centers the members along the horizontal axis of the HLayout.
// Note that the members have a specified width that is less than the
// width of the HLayout -- otherwise, you would not see the centering
// visually!

isc.HLayout.create({
    ID: "hLayoutAlignCenter",
    autoDraw: false,
    // Specifying the width creates space within which to
    // center the members.
    width: "100%",
    height: "100%",
    layoutMargin: 6,
    membersMargin: 6,
    border: "1px dashed blue",
    align: "center",  // As promised!
    members: [
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "red"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "green"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "blue"
        })
    ]
});


// 2. HLayout with member.layoutAlign = 'center' (or layout.defaultLayoutAlign = 'center')
//
// This centers every member along the vertical axis of the HLayout.
// If you don't want to center *every* member vertically, you can
// instead specify the layoutAlign property on individual members.
// Note that the height of the members is fixed -- if they filled
// the layout, you wouldn't see the centering.

isc.HLayout.create({
    ID: "hLayoutDefaultLayoutAlign",
    autoDraw: false,
    // Specifying the height creates space within which to
    // center the members.
    height: "100%",
    width: "100%",
    layoutMargin: 6,
    membersMargin: 6,
    border: "1px dashed blue",
    defaultLayoutAlign: "center", // As promised!
    members: [
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "red"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "green"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "blue"
        })
    ]
});


// 3. HLayout with LayoutSpacers
//
// This example uses LayoutSpacers as members to center one member in the space
// remaining after the first member is drawn. Note that it is the positioning
// of the two LayoutSpacer members that creates the centering ... no alignment
// property is used.

isc.HLayout.create({
    ID: "hLayoutLayoutSpacers",
    autoDraw: false,
    // Specifying the width creates space for the LayoutSpacers to distribute.
    width: "100%",
    height: "100%",
    layoutMargin: 6,
    membersMargin: 6,
    border: "1px dashed blue",
    // Note no alignment property! It's all done with LayoutSpacers
    members: [
        isc.Label.create({
            height: 40,
            width: "33%",
            padding: 10,
            backgroundColor: "red",
            contents: "<b>No alignment</b>"
        }),
        isc.LayoutSpacer.create(), // Note the use of the LayoutSpacer
        isc.Label.create({
            height: 40,
            width: "33%",
            padding: 10,
            backgroundColor: "green",
            contents: "<b>Centered in remaning space</b>"
        }),
        isc.LayoutSpacer.create() // And another layout spacer
    ]
});


// 4. VLayout with layout.align = 'center'
//
// This centers the members along the vertical axis of the VLayout.
// Note that the members have a specified height that is less than the
// height of the VLayout -- otherwise, you would not see the centering
// visually!

isc.VLayout.create({
    ID: "vLayoutAlignCenter",
    autoDraw: false,
    // Specifying the height creates space within which to
    // center the members.
    height: "100%",
    width: "100%",
    layoutMargin: 6,
    membersMargin: 6,
    border: "1px dashed blue",
    align: "center",  // As promised!
    members: [
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "red"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "green"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "blue"
        })
    ]
});


// 5. VLayout with member.layoutAlign = 'center' (or layout.defaultLayoutAlign = 'center')
//
// This centers every member along the horizontal axis of the VLayout.
// If you don't want to center *every* member horizontally, you can
// instead specify the layoutAlign property on individual members.
// Note that the width of the members is fixed -- if they filled
// the layout, you wouldn't see the centering.

isc.VLayout.create({
    ID: "vLayoutDefaultLayoutAlign",
    autoDraw: false,
    // Specifying the width creates space within which to
    // center the members.
    width: "100%",
    height: "100%",
    layoutMargin: 6,
    membersMargin: 6,
    border: "1px dashed blue",
    defaultLayoutAlign: "center", // As promised!
    members: [
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "red"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "green"
        }),
        isc.Canvas.create({
            height: 40,
            width: 40,
            backgroundColor: "blue"
        })
    ]
});


// 6. VLayout with LayoutSpacers
//
// This example uses LayoutSpacers as members to center one member in the space
// remaining after the first member is drawn. Note that it is the positioning
// of the two LayoutSpacer members that creates the centering ... no alignment
// property is used.

isc.VLayout.create({
    ID: "vLayoutLayoutSpacers",
    autoDraw: false,
    // Specifying the height creates space which the LayoutSpacers can distribute.
    height: "100%",
    width: "100%",
    layoutMargin: 6,
    membersMargin: 6,
    border: "1px dashed blue",
    // Note no alignment property! It's all done with LayoutSpacers.
    members: [
        isc.Label.create({
            width: "100%",
            height: "33%",
            padding: 10,
            backgroundColor: "red",
            contents: "<b>No alignment</b>"
        }),
        isc.LayoutSpacer.create(), // Note the use of the LayoutSpacer
        isc.Label.create({
            width: "100%",
            height: "33%",
            padding: 10,
            backgroundColor: "green",
            contents: "<b>Centered in remaning space</b>"
        }),
        isc.LayoutSpacer.create() // And another LayoutSpacer
    ]
});


// The rest of the code is merely to organize the examples visually.

isc.defineClass("LayoutAlignCenterExample", isc.VLayout).addProperties({
    title: "",
    example: null,
    autoDraw: false,
    border:"1px solid #CCCCCC",
    layoutMargin: 3,
    membersMargin: 2,
    initWidget : function() {
        this.Super("initWidget", arguments);
        this.addMembers([
          isc.Label.create({
              autoDraw: false,
              width: "100%",
              autoFit: true,
              padding: 6,
              contents: this.title
          }),
          this.example
        ]);
    }
});

isc.HLayout.create({
    width: "100%",
    height: "100%",
    members: [
        isc.VLayout.create({
            width: "40%",
            autoDraw: false,
            members: [
                isc.LayoutAlignCenterExample.create({
                    title: "HLayout with layout.align = 'center'",
                    example: hLayoutAlignCenter
                }),
                isc.LayoutAlignCenterExample.create({
                    title: "HLayout with member.layoutAlign = 'center' (or layout.defaultLayoutAlign = 'center')",
                    example: hLayoutDefaultLayoutAlign
                }),
                isc.LayoutAlignCenterExample.create({
                    title: "HLayout with LayoutSpacers",
                    example: hLayoutLayoutSpacers
                })
            ]
        }),
        isc.LayoutAlignCenterExample.create({
            title: "VLayout with layout.align = 'center'",
            example: vLayoutAlignCenter
        }),
        isc.LayoutAlignCenterExample.create({
            title: "VLayout with member.layoutAlign = 'center' (or layout.defaultLayoutAlign = 'center')",
            example: vLayoutDefaultLayoutAlign
        }),
        isc.LayoutAlignCenterExample.create({
            title: "VLayout with LayoutSpacers",
            example: vLayoutLayoutSpacers
        })
    ]
});
