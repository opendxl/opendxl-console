isc.HStack.create({membersMargin:10, height:160, members:[ 
    isc.ListGrid.create({
        ID: "countryList",
        width:500, height:224, alternateRecordStyles:true,
        data: countryData,
        fields:[
            {name:"countryCode", title:"Flag", width:50, type:"image", imageURLPrefix:"flags/16/", imageURLSuffix:".png"},
            {name:"countryName", title:"Country"},
            {name:"capital", title:"Capital"},
            {name:"continent", title:"Continent"}
        ],
        canReorderRecords: true
    }),
    isc.VStack.create({width:32, height:74, layoutAlign:"center", membersMargin:5, members:[
        isc.ImgButton.create({src:"[SKINIMG]TransferIcons/up_first.png", width:24, height:22,
        	imageType: "center", showDisabled: false, showRollOver: false, showDown: false,
            showFocused: false,
            click:function () {
            	var selectedRecords = countryList.getSelectedRecords();  
                for (var i=0; i<selectedRecords.length; i++) {
                    var selectedRecord = selectedRecords[i];
                    if(selectedRecord != null) {  
                        var idx = countryList.getRecordIndex(selectedRecord);  
                        if(idx > 0) {  
                            var rs = countryList.data;  
                            rs.removeAt(idx);  
                            rs.addAt(selectedRecord, i);  
                        }
                    } 
                }
            }
        }),
        isc.ImgButton.create({src:"[SKINIMG]TransferIcons/up.png", width:24, height:22,
        	imageType: "center", showDisabled: false, showRollOver: false, showDown: false,
            showFocused: false,
            click:function () {
            	var selectedRecords = countryList.getSelectedRecords();  
                for (var i=0; i<selectedRecords.length; i++) {
                    var selectedRecord = selectedRecords[i];
                    if(selectedRecord != null) {  
                        var idx = countryList.getRecordIndex(selectedRecord);
                        if(idx > 0) {  
                            var rs = countryList.data;  
                            rs.removeAt(idx);  
                            rs.addAt(selectedRecord, idx - 1);  
                        } else {
                            break;
                        }
                    }  
                }
            }
        }),
        isc.ImgButton.create({src:"[SKINIMG]TransferIcons/down.png", width:24, height:22,
        	imageType: "center", showDisabled: false, showRollOver: false, showDown: false,
            showFocused: false,
            click:function () {
            	var selectedRecords = countryList.getSelectedRecords();  
                for (var i=selectedRecords.length-1; i>=0; i--) {
                    var selectedRecord = selectedRecords[i];
                    if(selectedRecord != null) {  
                        var rs = countryList.data;  
                        var numRecords = rs.getLength();  
                        var idx = countryList.getRecordIndex(selectedRecord);
                        if(idx < numRecords - 1) {  
                            rs.removeAt(idx);  
                            rs.addAt(selectedRecord, idx + 1);  
                        } else {
                            break;
                        }
                    }  
                }
            }
        }),
        isc.ImgButton.create({src:"[SKINIMG]TransferIcons/down_last.png", width:24, height:22,
        	imageType: "center", showDisabled: false, showRollOver: false, showDown: false,
            showFocused: false,
            click:function () {
            	var selectedRecords = countryList.getSelectedRecords();  
                for (var i=0; i<selectedRecords.length; i++) {
                    var selectedRecord = selectedRecords[i];
                    if(selectedRecord != null) {  
                        var rs = countryList.data;  
                        var numRecords = rs.getLength();  
                        var idx = countryList.getRecordIndex(selectedRecord);  
                        if(idx < numRecords - 1) {  
                            rs.removeAt(idx);  
                            rs.addAt(selectedRecord, rs.getLength());  
                        }  
                    }  
                }
            }
        })
    ]})
]})