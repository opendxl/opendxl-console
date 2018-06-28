/*

  SmartClient Ajax RIA system
  Version v11.1p_2018-06-28/LGPL Deployment (2018-06-28)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/
isc.defineInterface("Observer").addInterfaceProperties({

registerObserved : isc.ClassFactory.TARGET_IMPLEMENTS,
unregisterObserved : isc.ClassFactory.TARGET_IMPLEMENTS

});

isc.defineInterface("AutoObserver", "Observer").addInterfaceProperties({

observedName: "observed",
observations: {},

registerObserved : function (observed) {
    this[this.observedName] = observed;
    for (var method in this.observations) {
        this.observe(observed, method, this.observations[method]);
    }
    if (isc.isA.Canvas(observed)) {
        this.observe(observed, "destroy", "observer.unregisterObserved(observed)");
    }
},

unregisterObserved : function (observed) {
    this[this.observedName] = null;
    for (var method in this.observations) {
        this.ignore(observed, method);
    }
},

initInterface : function () {
    if (this[this.observedName]) this.registerObserved(this[this.observedName]);
},

destroyInterface : function () {
    if (this[this.observedName]) this.unregisterObserved(this[this.observedName]);
}
});

isc.defineInterface("GridAutoObserver", "AutoObserver").addInterfaceProperties({
    observedName: "grid"
});


isc.defineClass("GridTotalRowsIndicator", "Label", "GridAutoObserver").addProperties({

height: 1,
wrap: false,
overflow: "visible",
valign: "center",

observations: {
    "dataArrived": "observer.gridDataChanged()",
    "setData": "observer.gridDataChanged()"
},

dynamicContents: true,
contents: "Total Rows: ${this.rowCount}",
rowCount: "N/A",

gridDataChanged : function () {
    var data = this.grid.getOriginalData();
    if (!data) this.rowCount = "N/A";

    if (isc.isA.ResultSet(data)) {
        if (data.lengthIsKnown()) {
            if (data.getLength() != 0 && data.progressiveLoading) {
                var lastRowIndex = data.getLength()-1;
                if (data.rowIsLoaded(lastRowIndex)) this.rowCount = data.getLength();
                else this.rowCount = data.getLength()+"+ (progressive loading)";
            } else { 
                this.rowCount = data.getLength();
            }
        }
        else this.rowCount = "N/A";
    } else if (isc.isAn.Array(data)) {
        this.rowCount = data.getLength();
    }

    this.markForRedraw();
}

});


isc.defineClass("GridToolStrip", "ToolStrip").addProperties({

membersMargin: 5,

addButtonDefaults: {
    _constructor: "Img",
    size: 16,
    layoutAlign: "center",
    src: "[SKIN]/actions/add.png",    
    click: "this.grid.startEditingNew()"    
},

removeButtonDefaults: {
    _constructor: "Img",
    size: 16,
    layoutAlign: "center",
    src: "[SKIN]/actions/remove.png",    
    click: "this.grid.removeSelectedData()"
},

refreshButtonDefaults: {
    _constructor: "Img",
    size: 16,
    layoutAlign: "center",
    src: "[SKIN]/actions/refresh.png",    
    click: "this.grid.invalidateCache()"
},

exportButtonDefaults: {
    _constructor: "IButton",
    title: "Export to CSV",
    layoutAlign: "center",
    click: "this.grid.exportData()"
},

totalRowsIndicatorDefaults: {
    _constructor: "GridTotalRowsIndicator",
    layoutAlign: "center"   
},

members: ["autoChild:removeButton", "autoChild:addButton", "autoChild:exportButton",
         "starSpacer",
         "autoChild:refreshButton", "autoChild:totalRowsIndicator"],

getDynamicDefaults : function () {
    return {
        grid: this.grid
    }
}

});
