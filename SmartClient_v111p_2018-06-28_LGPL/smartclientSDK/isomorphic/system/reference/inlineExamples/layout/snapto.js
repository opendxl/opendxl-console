// --------------------------------
// Simple snap to
var commonProps = {
    height: 80, width: 80,
    align: "center",
    border: "1px solid black",
    styleName: "exampleTextBlock"
};

isc.Canvas.create({
    ID:"snapContainer", 
    height: 300, width: 400,
    minHeight:280, minWidth:280,
    border: "1px solid #7e7e7e",
    overflow:"hidden",
	canDragResize: true,
	children: [
        isc.Label.create({
            ID:"label1", 
            contents: "Top Left",
            backgroundColor: "#FFAAAA",
            snapTo:"TL"
        }, commonProps),
        
        isc.Label.create({
            ID:"label2", 
            contents: "Top Right",
            backgroundColor: "#BEC9FE",
            snapTo:"TR"
        }, commonProps),
        
        isc.Label.create({
            ID: "label3", 
            contents: "Bottom Left",
            backgroundColor: "#D8D5D6",
            snapTo:"BL"
        }, commonProps),
        
        isc.Label.create({
            ID: "label4", 
            contents: "Bottom Right",
            backgroundColor: "#F8BFFB",
            snapTo:"BR"
        }, commonProps),
        
        isc.Label.create({
            ID: "label5", 
            contents: "Left",
            backgroundColor: "#CCFFCC",
            snapTo:"L"
        }, commonProps),
        
        isc.Label.create({
            ID: "label6", 
            contents: "Right",
            backgroundColor: "#AB5654",
            snapTo:"R"
        }, commonProps),
        
        isc.Label.create({
            ID: "label7", 
            contents: "Bottom",
            backgroundColor: "#DCEFEF",
            snapTo:"B"
        }, commonProps),
        
        isc.Label.create({
            ID: "label8", 
            contents: "Top",
            backgroundColor: "#FFCC99",
            snapTo:"T"
        }, commonProps),
        
        isc.Label.create({
            ID: "label9", 
            contents: "Center",
            backgroundColor: "#FFFF99",
            snapTo:"C"
        }, commonProps)
	]
});

// --------------------------------
// Snap to with fixed pixel offsets

isc.Canvas.create({
    ID:"offsetContainer", 
    height: 300, width: 400,
    minHeight:280, minWidth:280,    
    border: "1px solid #7e7e7e",
    overflow:"hidden",
    showHover:true,
    prompt:"Snap offsets specified",
	canDragResize: true,
	children: [
        isc.Label.create({
            ID:"label1a", 
            contents: "Top Left",
            backgroundColor: "#FFAAAA",
            snapTo:"TL",
            snapOffsetTop: 10,
            snapOffsetLeft: 10
        }, commonProps),
        
        isc.Label.create({
            ID:"label2a", 
            contents: "Top Right",
            backgroundColor: "#BEC9FE",
            snapTo:"TR",
            snapOffsetTop:10,
            snapOffsetLeft:-10
        }, commonProps),
        
        isc.Label.create({
            ID: "label3a", 
            contents: "Bottom Left",
            backgroundColor: "#D8D5D6",
            snapTo:"BL",
            snapOffsetLeft: 10,
            snapOffsetTop: -10
        }, commonProps),
        
        isc.Label.create({
            ID: "label4a", 
            contents: "Left",
            backgroundColor: "#CCFFCC",
            snapTo:"L",
            snapOffsetLeft: 10
        }, commonProps),
        
        isc.Label.create({
            ID: "label5a", 
            contents: "Right",
            backgroundColor: "#AB5654",
            snapTo: "R",
            snapOffsetLeft: -10
        }, commonProps),
        
        isc.Label.create({
            ID: "label6a", 
            contents: "Bottom",
            backgroundColor: "#DCEFEF",
            snapTo:"B",
            snapOffsetTop: -10
        }, commonProps),
        
        isc.Label.create({
            ID: "label7a", 
            contents: "Top",
            showHover: true,
            prompt: "SnapOffsetTop using percentage",
            backgroundColor: "#FFCC99",
            snapTo:"T",
            snapOffsetTop: 10
        }, commonProps),
        
        isc.Label.create({
            ID: "label8a", 
            contents: "Bottom Right",
            backgroundColor: "#F8BFFB",
            snapTo:"BR",
            snapOffsetTop: -10,
            snapOffsetLeft: -10
        }, commonProps)
	]
});

isc.LayoutSpacer.create({
    ID: "spacer",
    width: 100
});

isc.HLayout.create({
ID:	"controlLayout",
membersMargin: 20,
height: 800, width: 1000,
members: [
	snapContainer,
	spacer,
	offsetContainer
	]
});
