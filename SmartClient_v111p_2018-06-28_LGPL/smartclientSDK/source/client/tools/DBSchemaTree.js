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
isc.defineClass("DBSchemaTree", "ListGrid").addProperties({

showFilterEditor: true,
filterOnKeypress: true,

serverType: "sql",
emptyMessage: "No tables defined",
//dataSource: "DBSchema",

canExpandRecords: true,
detailDefaults: {
    _constructor: "ListGrid",
    autoFitData: "vertical",
    autoFitMaxRecords: 8,
    showResizeBar: true
},

initWidget : function () {
    this.dataSource = isc.DataSource.create({
        ID: this.getID()+"_DB_DS",
        clientOnly: true,
        fields : [
            {name: "name", title: "Name"},
            {name: "type", title: "Type", width: 60, valueMap: ["table", "view"]}
        ]
    });
    this.Super("initWidget", arguments);
},
        
selectionChanged : function (record, state) {
    this.tableSelected(record.name);
},
tableSelected : function (tableName) {  },

getExpansionComponent : function (record) {
    var component = this.createAutoChild("detail", {
        sortField: "primaryKey",
        sortDirection: "descending",
        fields: [
            {name: "name", title: "Column", formatCellValue: function (value, record) {
                if (record.primaryKey) return "<b>"+value+"</b>";
                return value;
            }},
            {name: "type", title: "Type", width: 50},
            {name: "length", title: "Length", width: 45},
            {name: "primaryKey", title: "PK", type: "boolean", showIf: "false", width: 22}
        ]
    });
    isc.DMI.call("isc_builtin", "com.isomorphic.tools.BuiltinRPC", "getFieldsFromTable", 
        record.name, this.schema, this.serverType, this.db.name,
        function(rpcResponse, data) {
            component.setData(data);
        }
    );
    return component;
},
      
//schema: "SST",
invalidateCache : function () {
    this.setData([]);
    this.loadSchema(this.db);
},
loadSchema : function (db) {
    this.db = db;
    isc.showPrompt("Loading schema for database: "+db.name);
    isc.DMI.call("isc_builtin", "com.isomorphic.tools.BuiltinRPC", "getTables", 
                 this.serverType, db.name, true, true, this.catalog, this.schema, this.includeList, this.excludeList,
                 this.getID()+".loadSchemaReply(data)");
},

loadSchemaReply : function (data) {
    isc.clearPrompt();
    for (var i = 0; i < data.length; i++) {
        data[i].name = data[i].TABLE_NAME;
        data[i].type = data[i].TABLE_TYPE.toLowerCase();
    }

    this.setData(isc.ResultSet.create({
        dataSource: this.dataSource,
        allRows: data
    }));

    this.sort("name");
    if (this.schemaLoaded) this.fireCallback("schemaLoaded");
}


});

isc.DBSchemaTree.registerStringMethods({
    schemaLoaded : ""
});