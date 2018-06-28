isc.ListGrid.create({
    ID: "countryList",
    width:"100%", alternateRecordStyles:true
});

isc.XMLTools.loadWSDL("/isomorphic/services/1.0/SmartClientOperations?WSDL", function () {
    if (window.countryList) {                                                                             
        countryList.setDataSource(countryDS);
        countryList.fetchData();
    }
});
