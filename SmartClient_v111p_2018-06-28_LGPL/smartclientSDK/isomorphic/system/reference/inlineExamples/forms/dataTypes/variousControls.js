isc.DynamicForm.create({
    ID: "form1",
    width: 620,
    colWidths: [190, "*"],
    fields: [
        {name: "text", title:"Text", type:"text", hint: "A plain text field", wrapHintText: false},
        {name: "colorPicker", title:"Color Picker", type:"color"},
        {name: "textArea", title:"TextArea", type:"textArea"},
        {name: "stackedSpinner", title: "Stacked Spinner", editorType: "SpinnerItem", writeStackedIcons: true,
         defaultValue: 5, min: 0, max: 10, step: 0.5, wrapTitle: false},
        {name: "unstackedSpinner", title: "Unstacked Spinner", editorType: "SpinnerItem", writeStackedIcons: false,
         defaultValue: 5, min: 0, max: 10, step: 0.5},
        {name: "slider", title: "Slider", editorType: "SliderItem",
         minValue: 1, maxValue: 5, numValues: 5, height: isc.Browser.isTouch ? 52 : 36},
        {name: "link", title: "LinkItem", type: "link", height: 80, target: "javascript",
         click: "isc.say('Hello world!')", linkTitle: "Click Me"},
        {name: "checkbox", title: "Checkbox", type: "checkbox", height: 25},
        {name: "radioGroup",title: "Radio Group", type: "radioGroup", 
         valueMap: ["Option 1", "Option 2"]}
    ],
    values: { slider: 4 }
});

var valueMap = {
    "US" : "<b>United States</b>",
    "CH" : "China",
    "JA" : "<b>Japan</b>",
    "IN" : "India",
    "GM" : "Germany",
    "FR" : "France",
    "IT" : "Italy",
    "RS" : "Russia",
    "BR" : "<b>Brazil</b>",
    "CA" : "Canada",
    "MX" : "Mexico",
    "SP" : "Spain"
}

var valueIcons = {
    "US" : "US",
    "CH" : "CH",
    "JA" : "JA",
    "IN" : "IN",
    "GM" : "GM",
    "FR" : "FR",
    "IT" : "IT",
    "RS" : "RS",
    "BR" : "BR",
    "CA" : "CA",
    "MX" : "MX",
    "SP" : "SP"
}

isc.DynamicForm.create({
    ID: "form2",
    width: 620,
    colWidths: [190, "*"],
    isGroup: true,
    groupTitle: "Select / Combo Controls",
    fields : [{
        name: "bugStatus", title: "Select", hint: "<nobr>A simple combobox</nobr>", 
        editorType: "ComboBoxItem",
        valueMap : {
            "cat" : "Cat",
            "dog" : "Dog",
            "giraffe" : "Giraffe",
            "goat" : "Goat",
            "marmoset" : "Marmoset",
            "mouse" : "Mouse"
        }
    },
    {
        name: "itemName", title: "Item Name", editorType: "ComboBoxItem", 
        optionDataSource: "supplyItem"
    },
    {
        name: "selectItem", title: "Select", hint: "<nobr>A select with icons</nobr>",
        editorType: "SelectItem",
        valueMap : valueMap,
        valueIcons : valueIcons,
        valueIconSize : 16,
        imageURLPrefix : "flags/16/",
        imageURLSuffix : ".png"
    },
    {
        name: "selectItem2", title: "Select", hint: "<nobr>A select with styled entries</nobr>",
        editorType: "SelectItem",
        valueMap : {
            "red" : "<span style='color:#FF0000;'>Red</span>",
            "green" : "<span style='color:#00FF00;'>Green</span>",
            "blue" : "<span style='color:#0000FF;'>Blue</span>"
        }
    },
    {
        name: "selectItemMultipleGrid", title: "Select Multiple (Grid)",
        editorType: "SelectItem",
        multiple: true,
        multipleAppearance: "grid",
        valueMap : {
            "cat" : "Cat",
            "dog" : "Dog",
            "giraffe" : "Giraffe",
            "goat" : "Goat",
            "marmoset" : "Marmoset",
            "mouse" : "Mouse"
        }
    },
    {
        name: "selectItemMultiplePickList", title: "Select Multiple (PickList)",
        editorType: "SelectItem",
        multiple: true,
        multipleAppearance: "picklist",
        valueMap : {
            "cat" : "Cat",
            "dog" : "Dog",
            "giraffe" : "Giraffe",
            "goat" : "Goat",
            "marmoset" : "Marmoset",
            "mouse" : "Mouse"
        }
    }
    ]
});

isc.DynamicForm.create({
    ID: "dateForm",
    width: 620,
    fixedColWidths: true,
    colWidths: [190, "*"],
    isGroup: true,
    groupTitle: "Date Controls",
    fields : [{
        name: "dateItem", title: "Date", hint: "<nobr>Picklist based date input</nobr>", 
        editorType: "DateItem"
    },
    {
        name: "dateItem2", title: "Date", hint: "<nobr>Direct date input</nobr>", 
        editorType: "DateItem",
        useTextField: true
    },
    {
        name: "dateTimeItem", title: "Datetime", hint: "<nobr>Direct datetime input</nobr>", 
        editorType: "DateTimeItem", type: "datetime",
        useTextField: true
    },
    {
        name: "timeItem", title: "Time", 
        editorType: "TimeItem"
    },
    {
        name: "timeItem2", title: "Time", hint: "Picklist based time input",
        editorType: "TimeItem",
        useTextField: false
    },
    {
        name: "dri", title: "Date Range",
        width: 400,
        editorType: "DateRangeItem",
        allowRelativeDates: true,
        fromDate: "$today",
        toDate: "-1m"
    },
    {
        name: "mdri", title: "Mini Date Range", 
        editorType: "MiniDateRangeItem"
    },
    {
        name: "rdi", title: "Relative Date",
        editorType: "RelativeDateItem"
    }
    ]
});

isc.VStack.create({
    membersMargin: 10,
    members: [ form1, form2, dateForm]
});
