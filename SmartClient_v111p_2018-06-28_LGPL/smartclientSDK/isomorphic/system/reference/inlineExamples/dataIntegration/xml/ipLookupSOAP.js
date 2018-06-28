
var ipService, ipDS;

isc.DynamicForm.create({
    ID: "ipForm",
    items: [
        { 
            name: "IPAddress", editorType: "ComboBoxItem", 
            valueMap: ["108.1.1.1", "112.1.1.12", "202.65.32.1", "85.1.5.5", "141.32.1.1"],
            changeOnKeypress: false,
            changed : function () {
                callService();
            }
        },
        { name: "Country" }
    ],
    wsdlLoaded : function () {
        isc.clearPrompt();

        ipService = isc.WebService.get("http://www.webservicex.net/");
        if (ipService == null) {
            isc.warn("WSDL not currently available from service (tried "
                    +"http://www.webservicex.net/geoipservice.asmx?WSDL)");
            return;
        }
        
        ipDS = ipService.getFetchDS("GetGeoIP")
    }
});

function callService () {
    ipForm.setValue('CountryName', 'Loading...');
    var ip = ipForm.getValue("IPAddress");

    ipDS.fetchData({ IPAddress: ip }, function (dsResponse, data) {
        if (dsResponse.httpResponseCode == 500) {
            isc.warn("Invalid IP address");
            return;
        }
        var row = data[0].GetGeoIPResult;
        ipForm.setValue("Country", row.CountryName + " (" + row.CountryCode + ")");
    }, { willHandleError: true });
}

isc.showPrompt("Loading WSDL from http://www.webservicex.net/geoipservice.asmx?WSDL");
isc.XMLTools.loadWSDL("http://www.webservicex.net/geoipservice.asmx?WSDL", "ipForm.wsdlLoaded()");
