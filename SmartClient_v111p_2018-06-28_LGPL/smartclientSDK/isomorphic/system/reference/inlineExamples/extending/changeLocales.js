// replace "myApp" with an abbreviation of your application name or company name to avoid
// collisions.  This structure would typically be loaded from a file based on the locale,
// similar to how the frameworkMessages file is loaded
var myApp = {
  messages: {
      localeTitle: "Locale",
      changeLocaleTitle: "Change Locale",
      dateTitle: "Date",
      filterTitle: "Filter",
      countryTitle: "Country",
      continentTitle: "Continent",
      populationTitle: "Population",
      areaTitle: "Area (km&amp;sup2;)",
      nationhoodTitle: "Nationhood"
  }
} 

isc.DynamicForm.create({
        ID: "localeForm",
        fields: [
        {name:"locale", title: myApp.messages.localeTitle, type:"select", 
            defaultValue: "en", 
            valueMap: {
                "en" : "English",
                "cs" : "Czech",
                "de" : "German",
                "es" : "Spanish",
                "fr" : "French",
                "it" : "Italian",
                "pt" : "Portuguese",
                "pt_BR" : "Brazilian Portuguese",
                "ru_RU" : "Russian"
            }
        },
        {name:"changeLocale", title: myApp.messages.changeLocaleTitle, type:"button", 
            click : function (form, item) {
                var newUrl = window.location.href;
                var selLocale = form.getValue("locale");
                if (newUrl.indexOf("locale") > 0) {
                    var regex = new RegExp("locale=[a-zA-Z_]+");
                    newUrl = newUrl.replace(regex, "locale=" + selLocale);
                } else {
                    if (newUrl.indexOf("?") > 0) {
                        if (newUrl.indexOf("#") > 0) {
                            newUrl = newUrl.replace("#", "&locale=" + selLocale + "#")    
                        } else {
                            newUrl += "&locale=" + selLocale;         
                        }
                    } else {
                        newUrl = newUrl.replace("#", "?locale=" + selLocale + "#")   
                    }
                }
                window.location.href = newUrl;
            }
        },
        {name:"picklistDate", title: myApp.messages.dateTitle, type:"date"}
        ]
});

isc.FilterBuilder.create({
    ID:"advancedFilter",
    dataSource:"worldDS",
    radioOperatorFormProperties:{width: 600},
    topOperatorAppearance: "radio"
});

isc.ListGrid.create({
    ID: "countryList",
    width:550, height:224, alternateRecordStyles:true, 
    dataSource: worldDS,
    fields:[
        {name:"countryName", title: myApp.messages.countryTitle},
        {name:"continent", title: myApp.messages.continentTitle},
        {name:"population", title: myApp.messages.populationTitle},
        {name:"area", title: myApp.messages.area},
        {name:"independence", title: myApp.messages.nationhoodTitle, width:100}
    ],
    autoFetchData: true
})

isc.IButton.create({
    ID:"filterButton",
    title: myApp.messages.filterTitle,
    click : function () {
        countryList.filterData(advancedFilter.getCriteria());
    }
})

isc.VStack.create({
    membersMargin:10,
    members:[ localeForm, advancedFilter, filterButton, countryList ]
})

if (isc.params.locale) localeForm.setValue("locale", isc.params.locale);
