var departmentTree = isc.Tree.create({
    modelType: "children",
    root: {
        name: "root",
        children: [{
            id: 1000,
            name: "Marketing",
            children: [
                { id: 1001, name: "Advertising" },
                { id: 1002, name: "Community Relations" }
            ]
        }, {
            id: 2000,
            name: "Sales",
            children: [
                { id: 2001, name: "Channel Sales" },
                { id: 2002, name: "Direct Sales" }
            ]
        }, {
            id: 3000,
            name: "Manufacturing",
            children: [
                { id: 3001, name: "Design" },
                { id: 3002, name: "Development" },
                { id: 3003, name: "QA" }
            ]
        }, {
            id: 4000,
            name: "Services",
            children: [
                { id: 4001, name: "Support" },
                { id: 4002, name: "Consulting" }
            ]
        }]
    }
});

isc.DataSource.create({
    ID: "clientOnlyUsersDS",
    clientOnly: true,
    fields: [{
        name: "id",
        title: "ID",
        type: "integer",
        primaryKey: true,
        hidden: true
    }, {
        name: "name",
        title: "Name"
    }],
    cacheData: [
        { id: 1, name: "Max" },
        { id: 2, name: "Bethany" },
        { id: 3, name: "Zach" },
        { id: 4, name: "Francesca" }
    ]
});

isc.DataSource.create({
    ID: "clientOnlyUserFavoritesDS",
    clientOnly: true,
    fields: [{
        name: "id",
        title: "ID",
        type: "integer",
        primaryKey: true,
        hidden: true
    }, {
        name: "userID",
        type: "integer",
        foreignKey: "clientOnlyUsersDS.id",
        title: "User ID"
    }, {
        name: "favoriteAnimal",
        title: "Favorite Animal"
    }, {
        name: "favoriteNumber",
        type: "number",
        title: "Favorite Integer (0 - 100)"
    }, {
        name: "hasFavoriteColor",
        title: "Has a Favorite Color?",
        type: "boolean"
    }, {
        name: "favoriteColor",
        valueMap: ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]
    }, {
        name: "favoriteDate",
        type: "date",
        title: "Favorite Date"
    }, {
        name: "favoriteTime",
        type: "time",
        title: "Favorite Time"
    }, {
        name: "favoriteMusicGenres",
        multiple: true,
        title: "Favorite Music Genres",
        valueMap: ["Alternative", "Classical", "Country", "Folk", "Hip Hop", "Jazz", "Pop", "R&B", "Rock", "World", "Other"]
    }, {
        name: "favoriteVacationDestination",
        title: "Favorite Vacation Destination",
        valueMap: {
            "AS": "Australia",
            "BR": "Brazil",
            "CA": "Canada",
            "CH": "China",
            "FR": "France",
            "GM": "Germany",
            "IN": "India",
            "ID": "Indonesia",
            "IT": "Italy",
            "JA": "Japan",
            "MX": "Mexico",
            "RS": "Russia",
            "KS": "South Korea",
            "SP": "Spain",
            "UK": "United Kingdom",
            "US": "United States"
        }
    }, {
        name: "favoriteCuisines",
        multiple: true,
        title: "Favorite Cuisines",
        valueMap: {
            "US": "American",
            "AS": "Australian",
            "BR": "Brazilian",
            "UK": "British",
            "CA": "Canadian",
            "CH": "Chinese",
            "FR": "French",
            "GM": "German",
            "IN": "Indian",
            "ID": "Indonesian",
            "IT": "Italian",
            "JA": "Japanese",
            "KS": "Korean",
            "MX": "Mexican",
            "RS": "Russian",
            "SP": "Spanish"
        }
    }, {
        name: "favoriteDepartment",
        title: "Favorite Department"
    }],
    cacheData: [
        {
            id: 1,
            userID: 1,
            favoriteAnimal: "Lemur",
            favoriteNumber: 90,
            hasFavoriteColor: false,
            favoriteDate: isc.Date.createLogicalDate(2000, 0, 1),
            favoriteTime: isc.Date.createLogicalTime(0, 0),
            favoriteMusicGenres: ["Classical", "Rock", "World"],
            favoriteVacationDestination: "JA",
            favoriteCuisines: ["CA", "CH", "IN", "RS"],
            favoriteDepartment: 4002
        },
        {
            id: 2,
            userID: 2,
            favoriteAnimal: "Zebra",
            favoriteNumber: 12,
            hasFavoriteColor: true,
            favoriteColor: "Orange",
            favoriteDate: isc.Date.createLogicalDate(2012, 11, 12),
            favoriteTime: isc.Date.createLogicalTime(12, 12),
            favoriteMusicGenres: ["Alternative", "Hip Hop"],
            favoriteVacationDestination: "US",
            favoriteCuisines: ["US", "AS", "BR", "UK"],
            favoriteDepartment: 3002
        },
        {
            id: 3,
            userID: 3,
            favoriteAnimal: "Elephant",
            favoriteNumber: 10,
            hasFavoriteColor: true,
            favoriteColor: "Green",
            favoriteDate: isc.Date.createLogicalDate(2010, 9, 10),
            favoriteTime: isc.Date.createLogicalTime(10, 10),
            favoriteMusicGenres: ["Country", "Folk"],
            favoriteVacationDestination: "MX",
            favoriteCuisines: ["GM", "ID", "JA", "MX"],
            favoriteDepartment: 1001
        },
        {
            id: 4,
            userID: 4,
            favoriteAnimal: "Blue Whale",
            favoriteNumber: 55,
            hasFavoriteColor: true,
            favoriteColor: "Blue",
            favoriteDate: isc.Date.createLogicalDate(2005, 4, 5),
            favoriteTime: isc.Date.createLogicalTime(12, 0),
            favoriteMusicGenres: ["Pop", "R&B", "Other"],
            favoriteVacationDestination: "SP",
            favoriteCuisines: ["FR", "IT", "KS", "SP"],
            favoriteDepartment: 3001
        }
    ]
});

var favoritesForm = isc.DynamicForm.create({
    ID: "favoritesForm",
    autoDraw: false,
    autoFetchData: true,
    initialCriteria: { userID: 1 },
    width: 500,
    colWidths: [175, "*"],
    dataSource: clientOnlyUserFavoritesDS,
    revertValueKey: "Escape",
    items: [{
        name: "userID",
        title: "User",
        editorType: "SelectItem",
        optionDataSource: "clientOnlyUsersDS",
        valueField: "id",
        displayField: "name",

        changed : function (form, item, value) {
            form.fetchData({ userID: value }, function (dsResponse, data, dsRequest) {
                var hasFavoriteColor = (data != null && data.length >= 1 &&
                                         !!data[0].hasFavoriteColor)
                form.getItem("favoriteColor").setDisabled(!hasFavoriteColor);
            });
        }
    }, {
        name: "favoriteAnimal",
        showPending: true
    }, {
        name: "favoriteNumber",
        editorType: "SliderItem",
        height: 30,
        minValue: 0,
        maxValue: 100,
        showPending: true
    }, {
        name: "hasFavoriteColor",
        editorType: "CheckboxItem",
        showPending: true,

        changed : function (form, item, value) {
            form.getItem("favoriteColor").setDisabled(!value);
        }
    }, {
        name: "favoriteColor",
        editorType: "RadioGroupItem",
        disabled: true,
        showPending: true
    }, {
        name: "favoriteDate",
        editorType: "DateItem",
        showPending: true
        
    }, {
        name: "favoriteTime",
        editorType: "TimeItem",
        showPending: true
        
    }, {
        name: "favoriteMusicGenres",
        editorType: "MultiComboBoxItem",
        useInsertionOrder: false,
        showPending: true
    }, {
        name: "favoriteVacationDestination",
        wrapTitle: false,
        editorType: "SelectItem",
        showPending: true,
        imageURLPrefix: "flags/16/",
        imageURLSuffix: ".png",
        getValueIcon : function (value) {
            return value;
        }
    }, {
        name: "favoriteCuisines",
        editorType: "SelectItem",
        width: "*",
        showPending: true,
        imageURLPrefix: "flags/16/",
        imageURLSuffix: ".png",
        getValueIcon : function (value) {
            if (isc.isAn.Array(value)) return null;
            return value;
        }
    }, {
        name: "favoriteDepartment",
        editorType: "PickTreeItem",
        width: 140,
        displayField: "name",
        valueField: "id",
        valueTree: departmentTree,
        showPending: true
    }]
});

isc.HStack.create({
    width: "100%",
    members: [favoritesForm]
});
