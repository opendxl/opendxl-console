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
//> @class FacadeDataSource
// Extends an arbitrary +link{DataSource} with the ability to queue requests made on it and
// dispatch the queued requests on demand. To use, create a FacadeDataSource instance with
// the +link{DataSource.inheritsFrom,inheritsFrom} property set to the DataSource that you wish
// to extend.
// <p>
// This advanced class is intended to be used for testing data-bound components. This should
// not be used in production code.
// <p>
// See also the overview of the +link{group:dsFacade,DataSource Facade pattern}.
//
// @inheritsFrom DataSource
// @treeLocation Client Reference/Data Binding
// @visibility external
//<
isc.defineClass("FacadeDataSource", "DataSource");
isc.FacadeDataSource.addProperties({
    dataProtocol: "clientCustom",

    //> @attr facadeDataSource.queueRequests (boolean : false : IRW)
    // Should requests be queued?
    // <p>
    // When DS requests are made on the FacadeDataSource, a new, derived DS request on the underlying
    // +link{DataSource.inheritsFrom,inherited} DataSource is created. If queueRequests is true,
    // then the derived DS request is added to the +link{FacadeDataSource.queuedRequests,queuedRequests}
    // array. If false, then the derived DS request is +link{DataSource.execute(),executed}
    // immediately on the inherited DataSource.
    // @setter setQueueRequests()
    // @visibility external
    //<
    queueRequests: false,

    //> @attr facadeDataSource.queuedRequests (Array of DSRequest : null : R)
    // An array of derived DS requests that are queued to be +link{DataSource.execute(),executed} on the
    // underlying +link{DataSource.inheritsFrom,inherited} DataSource.
    // <p>
    // When a DS request is made on this FacadeDataSource, if +link{FacadeDataSource.queueRequests,queueRequests}
    // is true, then a new DS request is created based on the given DS request and added to this
    // queue.
    // <p>
    // To clear the queue, set +link{FacadeDataSource.queueRequests,queueRequests} to false
    // or call +link{FacadeDataSource.clearQueue(),clearQueue()}.
    // @visibility external
    //<
    queuedRequests: null
});

isc.FacadeDataSource.addMethods({
    

    //> @method facadeDataSource.setQueueRequests()
    // Setter for +link{FacadeDataSource.queueRequests,queueRequests}.
    // @param queueRequests (boolean)
    // @see FacadeDataSource.clearQueue()
    // @visibility external
    //<
    setQueueRequests : function (queueRequests) {
        

        this.queueRequests = queueRequests = !!queueRequests;
        if (!queueRequests) {
            var queuedRequests = this.queuedRequests;
            if (queuedRequests != null) {
                delete this.queuedRequests;

                var superDS = this.superDS();
                for (var i = 0, len = queuedRequests.length; i < len; ++i) {
                    superDS.execute(queuedRequests[i]);
                }
            }
        }

        
    },

    // We don't want the facade's sparse and no-null update settings to be applied. The inherited
    // data source's settings will be applied to the derived requests when executed on the inherited
    // data source.
    _applySparseAndNoNullUpdates : isc.Class.NO_OP,

    //> @method facadeDataSource.clearQueue()
    // Shorthand to clear the +link{FacadeDataSource.queuedRequests,request queue} without
    // changing the value of +link{FacadeDataSource.queueRequests,queueRequests}.
    // @visibility external
    //<
    clearQueue : function () {
        

        if (this.queueRequests) {
            this.setQueueRequests(false);
            this.setQueueRequests(true);
        }
    },

    transformRequest : function (dsRequest) {
        

        var selfDS = this;

        var derivedDSRequest = this.cloneDSRequest(dsRequest, true);
        derivedDSRequest.showPrompt = false;
        derivedDSRequest.callback = function (dsResponse, data, derivedDSRequest) {
            selfDS.processResponse(dsRequest.requestId, selfDS.superDS().cloneDSResponse(dsResponse));
        };

        if (!this.queueRequests) {
            this.superDS().execute(derivedDSRequest);
        } else {
            var queuedRequests = this.queuedRequests;
            if (queuedRequests == null) queuedRequests = this.queuedRequests = [];
            queuedRequests.add(derivedDSRequest);
        }

        

        return dsRequest.data;
    }
});
