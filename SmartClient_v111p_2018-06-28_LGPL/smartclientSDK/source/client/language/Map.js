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
//>	@staticMethod isc.getValueForKey()
// Given a key and an object of <code>key:value</code> pairs, return the value that corresponds to
// that key.
// <P>
// If the key is not found, <code>defaultValue</code> will be returned if provided, otherwise the
// key will be returned.
//
//	@param	key				(String | number)	key to look for
//	@param	valueMap		(Object)			object of key:value pairs
//	@param	[defaultValue]	(Any)				default value to return if key not found
//
//	@return					(Any)				returns value in valueMap under name key, or
//                                              defaultValue if key not found
// @visibility external
//<
isc.getValueForKey = function (key, valueMap, defaultValue) {
    
	if (valueMap && valueMap[key] != null && !isc.isAn.Array(valueMap)) return valueMap[key];
	return (arguments.length < 3 ? key : defaultValue);
}

//>	@staticMethod isc.getKeyForValue()
// Given a value and an object of <code>key:value</code> pairs, return a key that corresponds
// to that value.
// <P>
// If the key is not found, <code>defaultKey</code> will be returned if provided, otherwise the
// value will be returned.
//
//	@param	value			(String | number)	value to look for
//	@param	valueMap		(Object)			object of key:value pairs
//	@param	[defaultKey]	(Any)				default key to return if value not found
//
//	@return					(Any)				returns first key in valueMap with value, or
//                                              defaultKey if value not found
// @visibility external
//<
isc.getKeyForValue = function (value, valueMap, defaultKey) {
// JMD: handle null value here?
	if (valueMap) {
		for (var key in valueMap) {
			if (valueMap[key] == value) return key;
		}
	}
	return (arguments.length < 3 ? value : defaultKey);
}


//>	@staticMethod isc.makeReverseMap()
// Given a key:value map, return a new map as value:key.
// <P>
// If the same value appears more than once, the key will correspond to the last instance of that
// value.
//
//	@param	valueMap		(Object)			object of key:value pairs
//	@return					(Object)			reversed value map
// @visibility external
//<
isc.makeReverseMap = function (valueMap) {
	var newMap = {}, value;
	for (var key in valueMap) {
		value = valueMap[key];
		newMap[value] = key;
	}
	return newMap;
}

// returns a new value map, sorted by the key
// technically, maps can't be sorted, but in JS, objects "remember" the order in which key/value
// pairs were added
// XXX add support for normalizers
isc.sortByKey = function (valueMap) {
    var newMap = {},
        keys = isc.getKeys(valueMap).sort()
    ;
    for (var i = 0; i < keys.length; i++) {
        newMap[keys[i]] = valueMap[keys[i]];
    }
    return newMap;
}

// returns a new value map, sorted by the value
// technically, maps can't be sorted, but in JS, objects "remember" the order in which key/value
// pairs were added
// XXX add support for normalizers
isc.sortByValue = function (valueMap) {
    // make a reverse map of the input map; map is now: value -> key
    // call sortByKey on this reversed map
    // reverse the map again (so map is key -> value) and return it
    // XXX horribly inefficient
    return isc.makeReverseMap(isc.sortByKey(isc.makeReverseMap(valueMap)));
}
