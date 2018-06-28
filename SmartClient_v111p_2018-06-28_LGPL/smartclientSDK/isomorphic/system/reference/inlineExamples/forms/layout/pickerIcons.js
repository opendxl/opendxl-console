// Create picker FormItemIcons based on default skin settings
var clearPicker = isc.FormItem.getPickerIcon("clear", {
    click : function () {
        isc.say("Clear Picker clicked");
    }
});

var searchPicker = isc.FormItem.getPickerIcon("search", {
    click : function () {
        isc.say("Search Picker clicked");
    }
});

var datePicker = isc.FormItem.getPickerIcon("date", {
    click : function () {
        isc.say("Date Picker clicked");
    }
});

var refreshPicker = isc.FormItem.getPickerIcon("refresh", {
    click : function () {
        isc.say("Refresh Picker clicked");
    }
});

isc.DynamicForm.create({
    width: 400,
    margin: 10,
    titleWidth: 100,
    colWidths: [110, "*"],
    autoFocus: true,
    fields: [
        { name: "pickerControls", title: "Picker Controls", icons: [ clearPicker, searchPicker, refreshPicker ] },
        { name: "datePicker", title: "Date Picker", icons: [ datePicker ] },
        { name: "refreshOnlyControls", title: "Refresh Picker", icons: [ refreshPicker ] },
    ]
});
