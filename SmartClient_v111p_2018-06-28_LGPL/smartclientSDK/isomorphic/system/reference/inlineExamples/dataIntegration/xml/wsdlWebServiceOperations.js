// form to take user input of zipcode, and display city returned from web service
isc.DynamicForm.create({
    ID:"zipForm",
    left:50, top:50, numCols:3, cellSpacing:5,
    items:[
        {name:"ZipCode", keyPress: "if(keyName == 'Enter') form.callService()"},
        {type:"button", startRow:false, click:"form.callService()",
         title:"Web Service Loading...", disabled: true, name: "button",
         enableFindCity : function () { // web service descriptor loaded
             this.setTitle("Find City");
             this.setDisabled(false);
         },
        },
        {name:"City", type:"staticText"}
    ],
    setZipCodeService : function (service) {
        this.zipCodeService = service;
        this.getItem("button").enableFindCity();
    },
	callService: function () {
        this.setValue('City', 'Loading...');
		// call the web service
	    this.zipCodeService.callOperation(
        	"GetInfoByZIP",                         // operation name
    	    {USZip:zipForm.getValue("ZipCode")},    // inbound data for operation
	        "//CITY",                               // XPath, Type, or ElementName to extract result
    	    "zipForm.setValue('City', data[0])"     // script to execute when operation returns
	    );
	}
});


// load the zipcode-lookup web-service description
isc.XMLTools.loadWSDL(
    "http://www.webservicex.net/uszip.asmx?WSDL",            // URL to load WSDL from
    "if (window.zipForm) zipForm.setZipCodeService(service)" // script to execute when description is loaded
);
