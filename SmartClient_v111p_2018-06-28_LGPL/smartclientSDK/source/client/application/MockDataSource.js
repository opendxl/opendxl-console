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
// ----------------------------------------------------------------------------------------

//> @class MockDataSource
// A special kind of +link{dataSource.clientOnly,client-only DataSource} that can be configured
// with +link{mockDataSource.mockData,"mock data"} - a simple text format for table or tree
// data.
// <p>
// MockDataSources are produced by the Reify Mockup Importer when starting from mockup formats
// that use the mock data format.  The docs for the 
// +link{group:balsamiqImport,Reify Mockup Importer} explain various steps for converting a
// <code>MockDataSource</code> to a real DataSource.
// <p>
// <code>MockDataSource</code> is primarily intended as a temporary form of DataSource used
// during the process of converting a mockup into a real application.  Generally, if creating a
// client-only DataSource in <smartclient>JavaScript</smartclient> <smartgwt>Java</smartgwt>,
// there is no reason to use the mock data format, as the mock data is not especially readable
// when written as a String literal.  The mock data format <i>can</i> be a slightly more
// compact and readable as compared to declaring +link{DataSource.testData} in XML.
//
// @inheritsFrom DataSource
// @treeLocation Client Reference/Data Binding
// @visibility external
//<
isc.defineClass("MockDataSource", "DataSource");

isc.MockDataSource.addClassProperties({

    parseTextWikiSymbols : function (text) {
        var italic = false;
        var bold = false;
        var link = false;
        var res = [];
        for (var i=0; i<text.length; i++) {
            var c = text.charAt(i);
            if (c == '\\') {
                if( (i + 1) < text.length && text.charAt(i + 1) == 'r') {
                    c = "<br/>";
                    i++;    
                }
            } else if (c == '[' && text.indexOf("]",i+1) > 0) {
                c = "<a href='#'>";
                link = true;
            } else if (c == ']') {
                if (link) {
                    c = "</a>";
                    link = false;
                }
            } else if (c == '*') {
                if (bold) {
                    bold = false;
                    c = "</b>";
                } else {
                    bold = true;
                    c = "<b>";
                }
            } else if (c == '_') {
                if (italic) {
                    italic = false;
                    c = "</i>";
                } else {
                    italic = true;
                    c = "<i>";
                }
            }
            res.push(c);
        }
        return res.join("");
    },
    
    convertTitleToName : function (title, fieldNamingConvention, rawHeaders) {
        var trailingUnderscore = true,
            name = title.trim().replace(/(\\r|\r)/g, "_").replace(/[^a-zA-Z0-9_# ]/g, "_");
        
        name = name.replace(/#+/g, " Number ");
        name = name.trim();
        
        if (name == "" || (name.charAt(0) >= '0' && name.charAt(0) <= '9')) {
            name = '_' + name;
        }
        var parts = name.split(" ");
        name = "";
        // naming conventions used when generating MockDataSource and FormItem field names from
        //  titles:
        //     - "camelCaps" eg "First Name" becomes firstName
        //  - "underscores" eg "First Name" becomes first_name
        //  - "underscoresAllCaps" eg "First Name" becomes FIRST_NAME
        //  - "underscoresKeepCase" eg "First Name" becomes First_Name
        // - default to camelCaps
        if ("underscores" == fieldNamingConvention) {
            for (var i = 0; i < parts.length; i++) {
                name += parts[i].toLowerCase();
                if (i != (parts.length - 1)) {
                    name += "_";
                }
            }
        } else if ("underscoresAllCaps" == fieldNamingConvention) {
            for (var i = 0; i < parts.length; i++) {
                name += parts[i].toUpperCase();
                if (i != (parts.length - 1)) {
                    name += "_";
                }
            }
        } else if ("underscoresKeepCase" == fieldNamingConvention) {
            for (var i = 0; i < parts.length; i++) {
                name += parts[i];
                if (i != (parts.length - 1)) {
                    name += "_";
                }
            }
        } else {
            name = parts[0].toLowerCase();
            // camelCaps is default
            for (var i = 1; i < parts.length; i++) {
                name += parts[i].substring(0, 1).toUpperCase();
                name += parts[i].substring(1).toLowerCase();
            }
        }
        while (trailingUnderscore) {
            if (name.endsWith("_")) {
                name = name.substring(0, name.length - 1);
            } else {
                trailingUnderscore = false;
            }
        }

        if (name == "") {
            name = "isc_gen";
        }
        
        if (name != title && rawHeaders.contains(name)) {
            // new name collides with another title
            while (rawHeaders.contains(name)) {
                name += "_";
            }
        }
        
        return name;
    },

    // Test for digits
    _isDigit : function(aChar) {
        var myCharCode = aChar.charCodeAt(0);
        if((myCharCode > 47) && (myCharCode <  58)) {
            return true;
        }
        return false;
    },
   
    splitComma : function(str) {
        var rawParts = str.split(","), parts = [];
        for (var i = 0, len = rawParts.length, part; i < len; ++i) {
            part = "";
            while (rawParts[i].slice(-1) == "\\") {
                part += rawParts[i++].slice(0, -1) + ",";
            }
            parts.push(part + rawParts[i]);
        }
        return parts;
    },

    isFieldParametersLine : function (line) {
        return (line.startsWith("[") &&
                line.endsWith("]") && 
                line != "[]" &&
                line != "[ ]" &&
                line != "[x]");
    },

    // Tree-specific formatting is documented here:
    // https://support.mybalsamiq.com/projects/uilibrary/Tree%20Pane
    parseTree : function(treeData) {
        var nodeArray = treeData.split("\n");
        var dataTree = [];
        var lastNode;
        var lastIndent = 0;
        for (var i=0; i < nodeArray.length; i++) {
            var newNode = {};
            
            var nodeChars = nodeArray[i].split("");
            var indent = 0;
            for (var j=0; j < nodeChars.length; j++) {             
                if (nodeChars[j] == " " || nodeChars[j] == ".") {
                    indent += 1;  
                } else {
                    break;
                }
            }
            var nodeName = nodeArray[i].substr(indent);
            
            // detect open folder
            if (nodeName.startsWith("f") || nodeName.startsWith(">") 
             || nodeName.startsWith("[x") || nodeName.startsWith("[+")) {
                newNode.isFolder = true;            
            // detect closed folder
            } else if (nodeName.startsWith("F") || nodeName.startsWith("v") 
             || nodeName.startsWith("[ ") || nodeName.startsWith("[-")) {
                newNode.isFolder = true;
                newNode.isOpen = true;
            }
            var checkedImage = isc.CheckboxItem.getInstanceProperty("checkedImage");
            var uncheckedImage = isc.CheckboxItem.getInstanceProperty("uncheckedImage");
            // set the appropriate icon
            if (nodeName.startsWith("f")) {
            } else if (nodeName.startsWith(">")) {
            } else if (nodeName.startsWith("[x")) {
                newNode.icon = checkedImage;
            } else if (nodeName.startsWith("[+")) {
            } else if (nodeName.startsWith("F")) {
            } else if (nodeName.startsWith("v")) {
            } else if (nodeName.startsWith("[ ")) {
                newNode.icon = uncheckedImage;
            } else if (nodeName.startsWith("[-")) {
            } else if (nodeName.startsWith("-")) {
                newNode.isFolder = false;

            // _ means "leave a space for your own icon". If it ends up being a folder node,
            // then the folder is open. See, e.g., the Windows Explorer example:
            // https://mockupstogo.mybalsamiq.com/projects/desktopapplications/Windows%20Explorer
            } else if (nodeName.startsWith("_")) {
                newNode.icon = isc.Canvas._blankImgURL;
                newNode.isOpen = true;
            }
            // strip out node metadata
            if (nodeName.startsWith("[")) nodeName = nodeName.substr(3);
            else if (newNode.isFolder) nodeName = nodeName.substr(1);
            else if (nodeName.startsWith("-") || nodeName.startsWith("_")) nodeName = nodeName.substr(1);

            newNode.name = isc.MockDataSource.parseTextWikiSymbols(nodeName).trim();
            newNode.children = [];
            if (indent == 0) {
                // node is top level
                dataTree.add(newNode);
            } else if (indent > lastIndent) {
                // node is child of previous node
                lastNode.children.add(newNode);
                newNode.parent = lastNode;
            } else if (indent == lastIndent) {
                // node is same level as previous node
                lastNode.parent.children.add(newNode);
                newNode.parent = lastNode.parent;
            } else {
                // indent is less than last indent, so we need to add further up
                // the parent hierarchy
                var ti = lastIndent;
                var parent = lastNode.parent;
                while (ti > indent) {
                    parent = parent.parent;
                    ti -= 1;
                }
                parent.children.add(newNode);
                newNode.parent = parent;
            }
            lastNode = newNode;
            lastIndent = indent;
        }
        return dataTree;
    }
})

isc.MockDataSource.addProperties({
    //> @attr mockDataSource.mockData (String | Array of Record : "md" : IR)
    // Data intended for a +link{ListGrid} or +link{TreeGrid}, expressed in a simple text
    // format popularized by mockup tools such as +externalLink{http://balsamiq.com} and now
    // commonly supported in a variety of mockup tools.
    // <p>
    // Balsamiq publishes documentation of the grid format 
    // +externalLink{http://support.balsamiq.com/customer/portal/articles/110188-working-with-data-grids-tables,here},
    // with a simple example of using tree-specific formatting
    // +externalLink{https://support.mybalsamiq.com/projects/uilibrary/Tree%20Pane,here}.
    // <p>
    // An alternative format of data consisting of an array of +link{object:Record,Records} can
    // also be provided. In this case the records are converted to "grid" +link{type:MockDataType,format}.
    // @visibility external
    //<
    mockData: "md",

    //> @type MockDataType
    // Whether the mock data is for a flat grid-like dataset or for a tree.  If "grid" is
    // specified, text shortcuts that would cause a hierarchy to be created (such as starting a
    // line with "[+]") will not have special meaning and be considered to be just a normal
    // data value.
    //
    // @value "grid"              Mock data for a ListGrid
    // @value "tree"              Mock data for a TreeGrid
    //
    // @visibility external
    //<

    //> @attr mockDataSource.mockDataType (MockDataType : "grid" : IR)
    // Whether +link{mockData} is in the "grid" or "tree" format.  See +link{MockDataType}.
    //
    // @visibility external
    //<
    mockDataType: "grid",

    //> @type FieldNamingConvention
    // Field naming convention for fields derived from +link{mockDataSource.mockData}.
    //
    // @value "camelCaps"           Format name with camel casing (eg "Fist Name" becomes firstName)
    // @value "underscores"         Format name with underscores (eg "First Name" becomes first_name)
    // @value "underscoresAllCaps"  Format name with underscores in all caps (eg "First Name" becomes FIRST_NAME)
    // @value "underscoresKeepCase" Format name with underscores retaining casing (eg "First Name" becomes First_Name)
    //
    // @visibility internal
    //<

    //> @attr mockDataSource.fieldNamingConvention (FieldNamingConvention : "camelCaps" : IR)
    // Naming convention for fields derived from +link{mockData}.
    //
    // @visibility internal
    //<
    fieldNamingConvention: "camelCaps",

    //> @attr mockDataSource.detectFieldTypes (Boolean : true : IR)
    // Should field types be detected using +{class:SchemaGuesser}?
    //
    // @visibility internal
    //<
    detectFieldTypes:true,

    // Properties to be applied to SchemaGuesser instances
    guesserProperties: { minExampleCount: 4 },

    clientOnly: true,
    cacheData: [],
    fields: [],

    // Override init to setup cacheData and fields using mockData
    init : function () {
        if (this.mockData && isc.isAn.Array(this.mockData) && this.mockData.length > 0) {
            // mockData provided as Array of Record. Convert data to
            // mockData format.

            // Save original records
            this._origMockData = this.mockData;

            var md = this.mockData,
                records = []
            ;

            // Extract field names from the records.
            // Since XML and JSON formats can leave empty
            // fields out of records all of the records
            // must be inspected to determine the full
            // list of field names in use.
            var fieldNames = [];

            md.forEach(function (line) {
                var keys = isc.getKeys(line);

                for (var i = 0; i < keys.length; i++) {
                    var fieldName = keys[i];
                    if (!fieldNames.contains(fieldName)) fieldNames.add(fieldName);
                }
            });
            records.push(fieldNames.join());

            // Create CSV lines for each record using extracted fieldNames
            // so the values are always in the same order
            md.forEach(function (line) {
                var record = [];

                for (var i = 0; i < fieldNames.length; i++) {
                    var fieldName = fieldNames[i],
                        value = line[fieldName]
                    ;
                    if (value == null) value = "";
                    else if (isc.isA.String(value) && value.contains(",")) value = "\"" + value + "\"";
                    record.push(value);
                }
                records.push(record.join());
            });

            this.mockData = records.join('\n');
        }

        if (this.mockDataType == "grid") {
            var rawMockLines = this.mockData.split("\n");
            var fieldParameters = this.getFieldParameters(rawMockLines);

            this.rawHeaderLine = rawMockLines[0];

            var fields = this.parseTableFields(this.rawHeaderLine, fieldParameters);
            this.sortProperties = this.extractSortProperties(fields);

            var records = this.getDataRecords(rawMockLines, fields, fieldParameters);

            // If SchemaGuesser is not loaded skip field type detection
            if (isc.SchemaGuesser && this.detectFieldTypes) {
                var guesser = isc.SchemaGuesser.create(this.guesserProperties);
                guesser.fields = fields;

                fields = guesser.extractFieldsFrom(records);
                records = guesser.convertData(records);
            }
            if (!this.fields || this.fields.length == 0) this.fields = fields;
            if (!this.cacheData || this.cacheData.length == 0) this.cacheData = records;
        } else if (this.mockDataType == "tree") {
            if (!this.fields || this.fields.length == 0) {
                this.fields = [{
                    name: "name",
                    type: "text"
                }];
            }
            if (!this.cacheData || this.cacheData.length == 0) {
                this.cacheData = isc.MockDataSource.parseTree(this.mockData);
            }
        }
        return this.Super("init", arguments);
    },

    // Apply settings to grid paletteNode
    // Used by balsamiqTransformRules and GridEditProxy
    applyGridSettings : function (control) {
        if (!control) control = {};

        control.autoFetchData = true;
        if (this.mockDataType == "tree") {
            control.dataProperties = {openProperty: "isOpen"};
            return control;
        }

        // compute headerHeight based on number of rows in titles
        var maxRows = this.getHeaderDisplayRowCount();

        control.headerHeight = Math.max(25, 15 * maxRows);
        control.autoFitFieldWidths = true;
        control.autoFitWidthApproach = "title";
        if (control.leaveScrollbarGap == null) {
            control.leaveScrollbarGap = false;
        }

        if (this.sortProperties) isc.addProperties(control, this.sortProperties);

        // Add basic ListGridFields so editNodes are created
        var fields = isc.getValues(this.fields);
        control.fields = [];
        for (var i = 0; i < fields.length; i++) {
            control.fields.add({
                name: fields[i].name,
                type: fields[i].type,
                title: fields[i].title
            });
        }

        if (control.dataSource && control.dataSource.MockDataSource) {
            control.dataSource.MockDataSource.fieldNamingConvention = this.fieldNamingConvention;
            control.dataSource.MockDataSource.fields = fields;
            control.dataSource.MockDataSource.cacheData = this.cacheData;
        }

        return control;
    },

    getFieldParameters : function (rawMockLines) {
        var fieldsParameters = null, 
            fieldsParametersLine = rawMockLines[rawMockLines.length - 1]
        ;
        if (isc.MockDataSource.isFieldParametersLine(fieldsParametersLine)) {
            fieldsParameters = fieldsParametersLine.substring(1, fieldsParametersLine.length - 1).split(",");
        }

        return fieldsParameters;
    },

    extractSortProperties : function (fields) {
        var properties;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].sortDirection) {
                properties = {
                    sortField: fields[i].name
                };
                if (fields[i].sortDirection == "descending") {
                    properties.sortDirection = fields[i].sortDirection;
                }
                delete fields[i].sortDirection;
                break;
            }
        }
        return properties;
    },

    getHeaderDisplayRowCount : function () {
        var vs = this.rawHeaderLine.split(","),
            maxRows = 1
        ;
        for (var i = 0; i < vs.length; i++) {
            maxRows = Math.max(maxRows, vs[i].split("\\r").length);
        }
        return maxRows;
    },

    parseTableFields : function(rawHeaderLine, fieldParameters) {
        var rawHeaders = isc.MockDataSource.splitComma(rawHeaderLine),
            headerArray = []
        ;

        for (var j = 0; j < rawHeaders.length; j++) {
            var text = rawHeaders[j].trim().replace(/(\\r|\r)/g, "<br/>");
            var sortDirection = null;
            if (text.endsWith(" ^")) {
                sortDirection = "ascending";
                text = text.substring(0, text.length-2).trim();
            } else if (text.endsWith(" v")) {
                sortDirection = "descending";
                text = text.substring(0, text.length-2).trim();
            }

            var name = isc.MockDataSource.convertTitleToName(rawHeaders[j], this.fieldNamingConvention, rawHeaders);
            var actualName = name;
            var iter = 0;
            do {
                var wasSame = false;
                for (var i=0; i < headerArray.length; i++) {
                    if (headerArray[i].name == actualName) {
                        iter++;
                        actualName = name + iter;
                        wasSame = true;
                        break;
                    }
                }  
            } while (wasSame);
            if (text == "") {
                text = "&nbsp;";
            }
            var field = {
                name: actualName,
                title: text
            };
            if (field.title.length <= 3) {
                field.align = "center";
            }
            if (sortDirection) field.sortDirection = sortDirection;
            if (fieldParameters && fieldParameters[j]) {
                field.width = fieldParameters[j];
                var lastChar = field.width[field.width.length - 1];
                if (!isc.MockDataSource._isDigit(lastChar)) {
                    field.width = field.width.substring(0, fieldParameters[j].length - 1);
                    if (lastChar == 'R' || lastChar == 'r') {
                        field.align = "right";
                    } else if (lastChar == 'L' || lastChar == 'l') {
                        field.align = "left";
                    } else if (lastChar == 'C' || lastChar == 'c') {
                        field.align = "center";
                    } 
                }
                field.width += "%";
            }
            headerArray.add(field);
        }
        return headerArray;
    },


    getDataRecords : function (rawMockLines, fields, fieldParameters) {
        var rowArray = [];

        // ignore the first line which is column names.
        // if fieldParameters was found ignore the last line
        var length = rawMockLines.length - (fieldParameters ? 1 : 0);
        for (var i = 1; i < length; i++) {   
            if (isc.MockDataSource.isFieldParametersLine(rawMockLines[i])) {
                // Failsafe in case a field parameters line is found within the data
                continue;
            }
            var rowObject = {};
            var valueArray = isc.MockDataSource.splitComma(rawMockLines[i]);

            for (var j=0; j < fields.length; j++) {
                var currVal = valueArray[j];
                if (currVal != null) {
                    currVal = currVal.replace(/\r/g, "<br/>");
                      if (!this.detectFieldTypes || currVal != "[]" && currVal != "[ ]" && currVal != "[x]") {
                        currVal = currVal.replace("[]", "<input type='checkbox' />");
                        currVal = currVal.replace("[ ]", "<input type='checkbox' />");
                        currVal = currVal.replace("[x]", "<input type='checkbox' checked='true' />");
                        currVal = isc.MockDataSource.parseTextWikiSymbols(currVal);
                    }
                    rowObject[fields[j].name] = currVal;
                }
            }            
            rowArray.add(rowObject);
        }
        return rowArray;
    }
});
