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
isc.defineClass("WSDataSource", "DataSource");

//> @class WSDataSource
// A WSDataSource is a DataSource that is preconfigured to contact the WSDL web service built
// into the SDK (see isomorphic/system/schema/SmartClientOperations.wsdl).  This WSDL service
// can be easily implemented on Java and non-Java backends.  
// <P>
// WSDataSource supports all 4 DataSource operations (fetch, add, update, remove) and can be
// used with ListGrids, DynamicForms and other +link{DataBoundComponent}s just like other
// DataSources.
// <P>
// Note that WSDataSource is specifically designed for use with SmartClientOperations.wsdl.  If
// you are trying to connect to a pre-existing WSDL service, start with just +link{DataSource}, 
// not WSDataSource, and see the +link{group:wsdlBinding,WSDL Integration} chapter for an
// overview.
//
// @inheritsFrom DataSource
// @treeLocation Client Reference/Data Binding
// @visibility xmlBinding
//<

isc.WSDataSource.addMethods({
    serviceNamespace : "urn:operations.smartclient.com",
    operationBindings:[
       {operationType:"fetch", wsOperation:"fetch", recordXPath:"//data/*" },
       {operationType:"add", wsOperation:"add", recordXPath:"//data/*" },
       {operationType:"remove", wsOperation:"remove", recordXPath:"//data/*" },
       {operationType:"update", wsOperation:"update" , recordXPath:"//data/*" }
    ],
    transformRequest : function (dsRequest) {
        var data = {
            dataSource : dsRequest.dataSource,
            operationType : dsRequest.operationType,
            data : dsRequest.data
        };
        // send various metadata only if set
        if (dsRequest.startRow != null) {
            data.startRow = dsRequest.startRow;
            data.endRow = dsRequest.endRow;
        }
        if (dsRequest.textMatchStyle != null) data.textMatchStyle = dsRequest.textMatchStyle;
        if (dsRequest.operationId != null) data.operationId = dsRequest.operationId;
        if (dsRequest.sortBy != null) data.sortBy = dsRequest.sortBy;
        return data;
    },
    transformResponse : function (dsResponse, dsRequest, xmlData) {
        
        // Bail out early if xmlData is null or an unexpected type
        if (!xmlData || !xmlData.selectString) return;
        
        dsResponse.status = xmlData.selectString("//status");

        // convert status from a String to a numeric code
        if (isc.isA.String(dsResponse.status)) {
            var status = isc.DSResponse[dsResponse.status];
            if (dsResponse.status == null) {
                this.logWarn("Unable to map response code: " + status
                              + " to a DSResponse code, setting status to DSResponse.STATUS_FAILURE.");
                status = isc.DSResponse.STATUS_FAILURE;
                dsResponse.data = xmlData.selectString("//data");
            } else {
                dsResponse.status = status;
            }
        }

        // if the status is a validation error, conver the errors from XML
        if (dsResponse.status == isc.DSResponse.STATUS_VALIDATION_ERROR) {
            var errors = xmlData.selectNodes("//errors/*");
            dsResponse.errors = isc.xml.toJS(errors, null, this);
        }

        dsResponse.totalRows = xmlData.selectNumber("//totalRows");
        dsResponse.startRow = xmlData.selectNumber("//startRow");
        dsResponse.endRow = xmlData.selectNumber("//endRow");

    }
});


