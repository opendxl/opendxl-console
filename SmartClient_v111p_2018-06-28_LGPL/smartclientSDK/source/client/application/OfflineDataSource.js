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
// =======================================================================================
// OfflineDataSource
// =======================================================================================
//> @class OfflineDataSource
// DataSource implementation using isc.Offline for the persientence mechanis:  Loads cacheData 
// automatically at init via Offline.get(), and saves it via Offline.put() every time it's 
// modified
// 
// @visibility internal
//<


isc.defineClass("OfflineDataSource", "DataSource").addProperties({
    cacheAllData: true, 
    clientOnly: true,

    //> @attr offlineDataSource.storageKey              (String : null : [IR]) 
    // The key to be used for Offline storage.
    //<

    //> @method offlineDataSource.getOfflineStorageKey() 
    // Obtain a key to be used for Offline storage, whether one has been configured explcitly
    // or not.
    // 
    // @return (String) OfflineDataSource.storageKey with OfflineDataSource.ID used 
    //                  if storageKey is unset
    // @visibility internal
    //<
    getOfflineStorageKey : function() {
        return this.storageKey || this.getID();
    },

          
    updateOfflineCache : function() {
        var that = this;
        var func = function() {
            isc.Offline.put(that.getOfflineStorageKey(), isc.JSON.encode(that.cacheData));    
        }
        isc.Timer.setTimeout(func, 1);        
    },

    init : function () {
        this.Super("init", arguments);
        var data = this.cacheData;
        
        if (! data) {
            var json = isc.Offline.get(this.getOfflineStorageKey());
            if (json) {
                data = isc.JSON.decode(json, {dateFormat: "logicalDateConstructor"});
            } else {
                data = [];
            }
            this.setCacheData(data);
        }
        
        this.observe(this, "updateCaches", "observer.updateOfflineCache()");
    }
});