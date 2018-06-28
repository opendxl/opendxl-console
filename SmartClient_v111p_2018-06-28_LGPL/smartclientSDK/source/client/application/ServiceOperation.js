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
isc.defineClass("ServiceOperation").addClassMethods({
    getServiceOperation : function (operationName, serviceName, serviceNamespace) {
        if (this._instances) return this._instances.find({
            operationName: operationName,
            serviceName: serviceName,
            serviceNamespace: serviceNamespace
        });
    }
});

isc.ServiceOperation.addMethods({
    init : function () {
	    // get a global ID so we can be called in the global scope
    	isc.ClassFactory.addGlobalID(this);
        this.Super("init", arguments);
        if (!isc.ServiceOperation._instances) isc.ServiceOperation._instances = [];
        isc.ServiceOperation._instances.add(this);
    },
    
    invoke : function () {
        var service = this.service = isc.WebService.getByName(this.serviceName, this.serviceNamespace);
        if (!service) {
            this.logWarn("Unable to find web service with serviceName '" + this.serviceName +
                         "' and serviceNamespace '" + this.serviceNamespace + "'. Has it been " +
                         "loaded?");
            return;
        }
        
        var data = this.inputVM.getValues();
        if (service.useSimplifiedInputs(this.operationName)) {
            data = data[isc.firstKey(data)];
        }
   
        var _this = this;
        service.callOperation(this.operationName, data, null, 
            function (data, xmlDoc, rpcResponse, wsRequest) {
                _this.invocationCallback(data, xmlDoc, rpcResponse, wsRequest);
            }
        );
    },
        
    invocationCallback : function (data, xmlDoc, rpcResponse, wsRequest) {
        if (!this.outputVM) return;

        // with document style SOAP there is no element representing the message as such - the
        // message parts appear as elements directly.  If there's only a single part there's no
        // representation in the returned data of that single part name (which is a good
        // simplification).  However the dataPaths are specified message-relative and so the
        // partName needs to be explicitly re-introduced
        if (this.service.getSoapStyle(this.operationName) == "document") {
            var fieldNames = this.outputVM.getDataSource().getFieldNames();
            if (fieldNames.length == 1) {
                var firstFieldName = fieldNames.first(),
                    fullData = {};
                fullData[firstFieldName] = data;
                data = fullData;
            }
        }

        this.outputVM.setValues(data);
 
        if (this.logIsInfoEnabled()) {
            this.logInfo("populating listeners on dataView: " + this.dataView + 
                         ", vm has values: " + this.echo(this.outputVM.getValues()));
        }

        // populate inputDataPath listeners via the DataView       
        if (this.dataView) this.dataView.populateListeners(this.outputVM);
    }
        
});

