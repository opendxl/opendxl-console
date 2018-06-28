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
//> @class TabIndexManager
// Singleton class with static APIs for managing automatically assigned tab order for
// SmartClient components and other focusable elements.
// <P>
// The TabIndexManager separates the logic required to maintain a sensible tab-order for
// a page's components from the logic to handle allocation of actual tab index values.
// It is common to have non-focusable components with an implied position in the page's
// tab order - for example Layouts containing focusable buttons, or DynamicForms containing
// focusable items, and this class handles maintaining relative tab order within such
// groups, and supplying explicit TabIndex values for the items which actually need them.
// <P>
// Entries are registered with the TabIndexManager via the +link{TabIndexManager.addTarget()} 
// API. A 
// numeric tab index for each entry will be lazily generated when requested via 
// +link{TabIndexManager.getTabIndex()}. The class provides APIs to modify the position of entries 
// in the tab tree. When a target is registered, a couple of custom callback functions
// can be provided. The first is a notification method for the tab index being updated
// (due to, for example, a parent being repositioned and all its children having new
// tab indices assigned), and can be used to take an appropriate action such as updating
// the tab index of an element in the DOM. The second callback will be fired when a
// call to the special +link{TabIndexManager.focusInTarget()} or 
// +link{TabIndexManager.shiftFocus()} API requests focus be passed to an entry. This
// allows a developer to take an appropriate action (such as programmatically focussing
// in some DOM element).
// <P>
// See the +link{group:tabOrderOverview,tab order overview} topic for more information on
// tab order management for components in SmartClient.
// 
// @treeLocation Client Reference/Foundation
// @visibility external
//<


isc.defineClass("TabIndexManager");

isc.TabIndexManager.addClassMethods({







// Tab Order management is handled by a Tree.
// Each node represents a "target" whos tab-position we are managing - typically a
// Canvas or FormItem, but could be anything
_buildTree : function () {
    this._tabTree = isc.Tree.create({
        modelType:"parent",
        idField:"nodeID", // unique ID - this will be provided by calling code
        parentIdField:"parentID",
        openProperty:"isOpen"
    });
},

_addToTree : function (ID, parentID, position) {
    if (ID == null) return;
    
    var node = {
        nodeID:ID,
        // We'll never close anything in this tree - we rely on
        // being able to "get" by index
        isOpen:true
    };
    
    var parentNode;
    if (parentID) {
        parentNode = this._getNode(parentID);
    }
    if (parentNode == null) parentNode = this._tabTree.getRoot();
    
    this._tabTree.add(node, parentNode, position);
},

_getNode : function (ID) {
    var node = this._tabTree.findById(ID);
    // We expect to fail to find nodes in some cases as we call this method 
    // in 'addTarget' / 'hasTarget'
//    if (node == null) this.logWarn("Unable to find requested node:" + ID);
    return node;
},

// Remove a node (+ children) from the tree.
_removeFromTree : function (ID) {
    var node = this._getNode(ID);
    if (node != null) this._tabTree.remove(node);
},

_moveInTree : function (IDs, newParentID, position) {
    if (!isc.isAn.Array(IDs)) IDs = [IDs];
        
    var parentNode;
    if (newParentID) {
        parentNode = this._getNode(newParentID);
    }
    if (parentNode == null) parentNode = this._tabTree.getRoot();
    
    var currentChildren = this._tabTree.getChildren(parentNode) || [];
    
    var nodes = [],
        unchanged = true;
    for (var i = 0; i < IDs.length; i++) {
        var node = nodes[i] = this._getNode(IDs[i]);
        if (nodes[i] == null) {
            this.logWarn("Attempt to move unrecognized target ID:" + IDs[i]);
            return false;
        }
        // Check whether we've already got all the nodes in the expected spot
        if (currentChildren[i+position] != node) unchanged = false;
    }
    // By no-oping if we're unchanged we are more efficient.
    // By telling calling code we no-op'd we can avoid unnecessary calls to re
    // parcel out TabIndices / fire notification methods, potentially touch the DOM etc.
    if (!unchanged) {
        this._tabTree.moveList(nodes, parentNode, position);
    }
    return !unchanged;
    
},




//> @classMethod TabIndexManager.addTarget()
// Register a target to have its tab order position managed by the TabIndexManager.
// @param ID (String) Unique ID to associate with a tab position. For a Canvas this
//    would typically be the +link{Canvas.ID} but any unique string is valid.
// @param canFocus (boolean) Is this target directly focusable? Governs whether an 
//    explicit tabIndex will be created for this target. This parameter should be
//    passed as <code>false</code> for targets which do not require an explicit tabIndex
//    as they are not focusable, or not explicit tab-stops for the user tabbing through the 
//    page. They will still have an implicit tab order position which 
//    governs where descendants appear, and would be used to generate a tabIndex if
//    canFocus is subsequently updated via +link{setCanFocus()}.
// @param [parentID] (String) For cases where the tab position should be treated part of a 
//    group to be moved together, the ID of the parent target containing all members of this
//    group. An example of this would be a Layout managing the tab order of all its members.
//    If present, the passed parentID must already be being managed by this TabIndexManager.
//    May be updated for registered targets via +link{TabIndexManager.moveTarget()}.
// @param [position] (Integer) Position in the tab-order within the specified parent [or
//    within top level widgets]. Omitting this parameter will add the target to the end of
//    the specified parent's tab group. 
//    May be updated for registered targets via +link{TabIndexManager.moveTarget()}.
// @param [tabIndexUpdatedCallback] (TabIndexUpdatedCallback) This notification method will 
//    be fired when the tabIndex is actually updated, typically due to the target, or some 
//    parent of it being re-positioned in the managed Tab order. In some cases tab indices
//    may also be updated to make space for unrelated entries being added to the
//    TabIndexManager. This notification is typically used to update the appropriate element
//    in the DOM to reflect a new tab index.
// @param [shiftFocusCallback] (ShiftFocusCallback) This notification method will be 
//    when the special +link{TabIndexManager.shiftFocus()} method is called to 
//    programmatically move focus through the registered targets (simulating the user tabbing
//    through elements in the tab index chain). The implementation should attempt to update
//    the UI state by focusing in the appropriate UI for this target -- typically this means
//    putting browser focus into a DOM element, and return true to indicate success.<br>
//    Returning false indicates the element is currently not focusable (disabled, masked, etc),
//    and cause the TabIndexManager to call the shiftFocusCallback on the next registered
//    entry (skipping over this entry).<br>
//    If this  method was not supplied, calls to +link{TabIndexManager.shiftFocus()} will simply skip
//    this entry.
//    
// @visibility external
//<
_callbackMap:{},
addTarget : function (ID, canFocus, parentID, position, 
                        tabIndexUpdatedCallback, shiftFocusCallback) 
{
    if (this._getNode(ID) == null) {
        this._addToTree(ID, parentID, position);
    
    // If passed an existing ID, support this, but log a warning
    } else {
        this.logWarn("addTarget called with already registered ID '" + ID +
             "'. The existing entry will be moved to the specified position and " +
             "have its callbacks updated.");
        if (this.logIsDebugEnabled()) {
            this.logDebug("Stack trace:" + this.getStackTrace());
        }
        this._moveInTree(ID, parentID, position);
    }
    this._getNode(ID).canFocus = !!canFocus;

    this.logDebug("addTarget(" + ID + ") - update callback:" + 
                  this.echo(tabIndexUpdatedCallback) + ", shiftFocus callback:" + 
                  this.echo(shiftFocusCallback));    
    
    
    this._callbackMap[ID] = {tabIndexUpdatedCallback:tabIndexUpdatedCallback,
                             shiftFocusCallback:shiftFocusCallback};

   // Extremely spammy log option: Show the whole chain here:
    if (this.logIsDebugEnabled("TabIndexManagerFullTree")) {
        this.logDebug("Tab chain after 'addTarget':\n" + this.getAllocatedTabChain(),
            "TabIndexManagerFullTree");
    }
                             

},

//> @method Callbacks.TabIndexUpdatedCallback
// A notification +link{type:Callback} fired by the TabIndexManager to allow 
// application code to react to the numeric tab-index of some registered target being
// modified.
// @param ID (String) the ID String passed to +link{TabIndexManager.addTarget()} when 
//                  the callback was registered.
// @visibility external
//<

//> @method Callbacks.ShiftFocusCallback
// A +link{type:Callback} fired by the TabIndexManager when application code or user
// action attempts to synthetically shift focus to some registered target. 
// See +link{TabIndexManager.shiftFocus()}.
// <P>
// A typical implementation will shift focus to some native element associated
// with the registered target, or if this is not currently possible, return false.
//
// @param ID (String) The ID String passed to +link{TabIndexManager.addTarget()} when 
//                  the callback was registered.
// @return (boolean) Return true if focus could be successfully moved to the desired
//                  target. Returning false indicates the target could not accept focus and
//                  will often cause the TabIndexManager to find the next registered target
//                  and attempt to shift focus there.
// @visibility external
//<

//> @classMethod TabIndexManager.hasTarget()
// Has the specified target been added to this TabIndexManager via
// +link{TabIndexManager.addTarget()}?
// @param ID (String) Unique ID to test for.
// @return (boolean) true if we are managing the tab index for the specified target
// @visibility external
//<
hasTarget : function (ID) {
    return this._getNode(ID) != null;
},
    

//> @classMethod TabIndexManager.moveTarget()
// Move a target to the newly specified parent / position. This method may change the
// calculated tab index for this entry, or other canFocus:true entries which already
// have a calculated tabIndex. The registered tabIndexUpdated notification method will
// for for any entry where this occurs.
//
// @param ID (String) ID of the target to move
// @param [parentID] (String) ID of the new parent (if null, will move to the top level)
// @param [position] (Integer) Position within the specified parent. If null will be the 
//  last entry.
// @visibility external
//<
moveTarget : function (ID, parentID, position) {
    this.moveTargets([ID], parentID, position);
},

//> @classMethod TabIndexManager.moveTargets()
// Move a list of targets to the newly specified parent / position. This method may change the
// calculated tab index for these entries, or other canFocus:true entries which already
// have a calculated tabIndex. The registered tabIndexUpdated notification method will
// for for any entry where this occurs.
//
// @param IDs (Array of String) IDs of the targets to move
// @param [parentID] (String) ID of the new parent (if null, will move to the top level)
// @param [position] (Integer) Position within the specified parent. If null will be added at the end
// @visibility external
//<
moveTargets : function (IDs, parentID, position) {
    var changed = this._moveInTree(IDs, parentID, position);
    this.logDebug("moveTarget called - slotting " + IDs + " under " + parentID +
                  " in position:" + position +
                  (changed ? ". Tab Order tree was affected." 
                 //+ "\n" + this.showAllocatedTabChain()
                   :  ". Tab Order tree was not affected.")
    );
    if (!changed) {
        return;
    }
    
    // We're going to potentially modify the tab index of multiple targets
    // - those passed in and their descendants.
    // We want notifications to fire, but not until we've finished shifting things around
    // or a call to 'getTabIndex()' could have unpredictable results...
    var modifiedTabIndex = [];
    
    for (var i = 0; i < IDs.length; i++) {
        var ID = IDs[i];
        // notify all the descendants their tab indices have changed by firing the
        // callback functions they passed in.
        // Only do this if we *had* a tabIndex before this method was called. That handles
        // lazily notifying only things that have at some point been drawn / had "getTabIndex" 
        // called.
        // Also only if "canFocus" is set to true.
        
        var node = this._getNode(ID);

        var descendants = this._tabTree.getDescendants(node);

        if (node.canFocus && node.tabIndex != null) {
            node.tabIndex = null;
            modifiedTabIndex.add(node);
        }
        for (var ii = 0; ii < descendants.length; ii++) {
            if (descendants[ii].canFocus && descendants[ii].tabIndex != null) {        
                descendants[ii].tabIndex = null;
                modifiedTabIndex.add(descendants[ii]);
            }
        }
    }

    if (modifiedTabIndex.length > 0) {
        this.logDebug("Moving node:" + ID + " will impact the tab index of:" 
                  + modifiedTabIndex.length + " targets");
    }

    // Fire 'tab index changed' callbacks now. This allows calling code to "do the right thing",
    // including possibly calling 'getTabIndex()' to get the new index.
    
    for (var ii = 0; ii < modifiedTabIndex.length; ii++) {
        var ID = modifiedTabIndex[ii].nodeID;
        if (this._suppressedCallbacks[ID]) continue;
        
        var callback = this._callbackMap[ID].tabIndexUpdatedCallback;

        if (callback != null) {
            this.fireCallback(callback, "ID", [ID]);
        }
    }
    
    // Extremely spammy log option: Show the whole chain here:
    if (this.logIsDebugEnabled("TabIndexManagerFullTree")) {
        this.logDebug("Tab chain after 'moveTargets':\n" + this.getAllocatedTabChain(),
            "TabIndexManagerFullTree");
    }

},

//> @classMethod TabIndexManager.suppressCallbacks()
// Temporarily suppress firing any tabIndexChanged callback passed into 
// +link{TabIndexManager.addTarget()} for the 
// specified targets should their tab index change.
// <P>
// This is useful for cases where a developer is managing a list of items and wants to
// avoid any potential for multiple notifications until the entire list has been managed
// @param targets (Array of String) targets for which callbacks should be suppressed
// @see TabIndexManager.resumeCallbacks()
// @visibility external
//<
// We use this when we are assigning tab positions to items within a form to avoid
// potentially updating the element tab index repeatedly
_suppressedCallbacks:{},
suppressCallbacks : function (targets) {
    for (var i = 0; i < targets.length; i++) {
        this._suppressedCallbacks[targets[i]] = true;
    }
},

//> @classMethod TabIndexManager.resumeCallbacks()
// Resume firing any callbacks suppressed by +link{TabIndexManager.suppressCallbacks}
// @param targets (Array of String) targets for which callbacks should be resumed
// @see TabIndexManager.suppressCallbacks()
// @visibility external
//<
resumeCallbacks : function (targets) {
    for (var i = 0; i < targets.length; i++) {
        delete this._suppressedCallbacks[targets[i]];
    }
},

//> @classMethod TabIndexManager.removeTarget()
// Removes a target from this TabIndexManager.
// Any children of this target will also be removed - developers wishing to preserve
// children should first call +link{TabIndexManager.moveTarget()} to move the children out of this parent
// @param ID (String) target to remove
// @visibility external
//<
// Called on destroy()
removeTarget : function (ID) {
    var node = this._getNode(ID),
        descendantNodes = node ? this._tabTree.getDescendants(node) : [];
    
    this._removeFromTree(ID);
    for (var i = 0; i < descendantNodes.length; i++) {
        delete this._callbackMap[descendantNodes[i].nodeID];
    }
    delete this._callbackMap[ID];

},

// Non obfuscated method to get the actual Tree object
// Not publicly documented - devs shouldn't really need to see this in most cases, and we
// don't document the format of the nodes
getTree : function () {
    return this._tabTree;
},

//> @classMethod TabIndexManager.getParent()
// Returns the currently specified parent for a target being managed by this
// class. Will return null for top-level targets (targets with no parent)
// @param ID (String) target ID
// @return (String) parent ID, or null if this is a top level target
// @visibility TabIndexManager
//<
getParent : function (ID) {
    var parentNode = this._tabTree.getParent(this._getNode(ID));
    if (parentNode == this._tabTree.getRoot()) return null;
    return parentNode.nodeID;
},

//> @classMethod TabIndexManager.setCanFocus()
// Modifies whether or not some specified target should be treated as focusable and
// provide a meaningful TabIndex on a call to +link{TabIndexManager.getTabIndex()}.
// @param ID (String) target ID
// @param canFocus (boolean) new value for canFocus
// @visibility external
//<
setCanFocus : function (ID, canFocus) {
    var node = this._getNode(ID);
    if (node) {
        if (node.canFocus == canFocus) return;
        node.canFocus = canFocus;
        
        // If you set something to canFocus false,
        // then back to canFocus true (very common with enable/disable, etc), 
        // we should be able to retain the existing tabIndex in most cases.
        // However since we don't assign/update actual TabIndex to canFocus:false widgets,
        // we may have shuffled stuff about while it was canFocus:false, in which case
        // the tab index is stale.
        // We can handle this by checking if the old tabIndex is still valid
        // (Still sits between the correct previous and next siblings)
        var oldTabIndex = node.tabIndex;
        if (canFocus && oldTabIndex != null) {
            var nextNode = this._getNextCanFocusNode(node, true, true),
                prevNode = this._getNextCanFocusNode(node, false, true);
            if ((nextNode && nextNode.tabIndex <= oldTabIndex) ||
                (prevNode && prevNode.tabIndex >= oldTabIndex)) 
            {
                this.logInfo("setCanFocus(true): tab index will change for target " + ID);
                // We're not firing the notification here - assumption is that calling
                // code will be calling 'getTabIndex()' regardless and should handle the
                // fact it may actually change.
                node.tabIndex = null;
            }
        }
    }
},

//> @classMethod TabIndexManager.getTabIndex()
// Returns a tabIndex number for some target ID registered via +link{TabIndexManager.addTarget()}.
// Generated tab indices are guaranteed to be in order.
// <P>
// As targets are added to, or moved within the TabIndexManager, their tab index may become invalid.
// The <code>tabIndexUpdated</code> notification will be fired when this occurs, giving developers
// a way to pick up the new tab index, and assign it to the appropriate DOM element if appropriate.
// @param ID (String) ID of the target for which you want to get a numeric tabIndex.
// @return (Integer) returns the numeric tabIndex value for the specified target
// @visibility external
//<
// TabIndices will sit between 
// +link{isc.Canvas.TAB_INDEX_FLOOR} and +link{isc.Canvas.TAB_INDEX_CEILING}.
//
// Tab indices are generated lazily when required. This can avoid some unnecessary work
// assigning tab indices for initially undrawn widgets which are then added as children
// to some other child, etc. (We could take this further).
//
// Note that tab index can change even when relative structure appears not to change - as a dev may
// slot N widgets between two other targets with a gap of only N-1 slots, meaning we have to 
// shuffle subsequent target(s) forward.
getTabIndex : function (ID) {
    var node = this._getNode(ID);
    
    if (node == null) {
        this.logWarn("getTabIndex() - no registered target with ID:" + ID);
        return null;
    }

    if (node.canFocus == false) {
        this.logDebug("getTabIndex() on canFocus:false node " + ID + " will return -1");
        return -1;
    }

    if (node.tabIndex != null) return node.tabIndex;
    
    this.calculateTabIndex(node);
    return node.tabIndex;

},


// Helper to lazily calculate tab index values based on positions in the tree.
//
// If recalculateAll is set we will assign a new tab index to every entry in the tree.
// We use this to handle the case where we hit TAB_INDEX_CEILING and need to make extra
// space.
// 
// Otherwise we are guaranteed to assign a tab index for the node passed in and will
// also assign, or reassign numeric values to other entries as required.
// 
// Any existing tab-indices which are changed will cause the registered tabIndexUpdated
// notification to fire.
calculateTabIndex : function (node, recalculateAll) {
    var ID = node.nodeID;
    
    var logDebug = this.logIsDebugEnabled();
    var logDebugPerf = this.logIsDebugEnabled("TabIndexManagerPerformance");

    if (logDebug) this.logDebug("Calculating tabIndex for node:" + ID);    
    var startTime;
    if (logDebugPerf) startTime = isc.timeStamp();
    
    if (recalculateAll) {
        this.logInfo("Refreshing all tab indices." +
            (logDebugPerf ? "" :  "Enable debug logging on " +
             " 'TabIndexManagerPerformance' category for timings."));
    }
    
    var previousTabIndex = isc.Canvas.TAB_INDEX_FLOOR, 
        nextTabIndex = isc.Canvas.TAB_INDEX_CEILING,

        precedingUnassignedNodes = [],
        subsequentUnassignedNodes = [],
        
        parentNode = this._tabTree.getParent(node),
        siblings = this._tabTree.getChildren(parentNode),
        position = siblings.indexOf(node);

    // build a list of all adjacent tab stops with no explicit specified tab-index
    
    // loop backwards looking at previous tab-stops
    var nodeIndex = this._tabTree.indexOf(node),
        indexInTree = nodeIndex;
    while (indexInTree > 0) {
        indexInTree--;
        var previousNode = this._tabTree.get(indexInTree);
        //this.logWarn("looping backwards through tree - " + indexInTree
        //             + ": previous node:" + previousNode.nodeID)        
        if (previousNode.canFocus) {
            if (!recalculateAll && previousNode.tabIndex != null) {
                previousTabIndex = previousNode.tabIndex;
                //this.logWarn("Using as previous tab index:" + previousTabIndex);                
                break;
            } else {
                precedingUnassignedNodes.add(previousNode);
            }
        }
    }
    
    // loop forwards looking at subsequent tab-stops
    indexInTree = nodeIndex;
    var nextNode;
    while (indexInTree < this._tabTree.getLength()-1) {
        indexInTree++;
        nextNode = this._tabTree.get(indexInTree);
        //this.logWarn("looping forwards through tree - " + indexInTree
        //             + ": next node:" + nextNode.nodeID)        
        
        if (nextNode.canFocus) {
            if (!recalculateAll && nextNode.tabIndex != null) {
                nextTabIndex = nextNode.tabIndex;
                //this.logWarn("Using as next tab index:" + nextTabIndex);                
                break;
            } else {
                subsequentUnassignedNodes.add(nextNode);
            }
        }
    }

    var slots = precedingUnassignedNodes.length + 1 + subsequentUnassignedNodes.length;
    
    // Sanity check: We should never see nextTabIndex<previousTabIndex
    // Log a warning about this
    
    if (nextTabIndex <= previousTabIndex) {
        
            this.logWarn("Error in TabIndex management - out of order tab-indices detected");
        
        
        nextTabIndex = previousTabIndex + ((slots+1)*10);
    }
    
    var gap = Math.floor((nextTabIndex - previousTabIndex)/(slots+1));
    this.logDebug("Calculating requested TabIndex for " + node.nodeID + 
        (recalculateAll ?
            ". Discarding all prior indices and recalculating " + (slots-1) + " values. " 
         : 
            ". Will also lazily assign " + (slots-1) + " unassigned tabIndex values. " 
        ) +
        " Slotting between " + [previousTabIndex, nextTabIndex] +
        " [This has enough space for a gap of " + gap + " between each entry" +
        " - if zero we will reshuffle other nodes to make space]");
    
    var mustCreateSpace = false;
    // If there isn't enough space to slot the specified targets in between the
    // previous and next target, we'll have to create space by increasing the tabIndex
    // of subsequent targets.
    
    var followingAssignedNodes = [];
    if (gap < 1) {
    
        
        if (recalculateAll) {
            if (!this._shownCeilingWarning) {
                this.logWarn("TabIndex Manager has hit specified " +
                    "Canvas.TAB_INDEX_CEILING of " + isc.Canvas.TAB_INDEX_CEILING +
                    ". Some widgets may be assigned very large tab indices which can lead to " +
                    "unexpected browser behavior.");
                this._shownCeilingWarning = true;
            }
        }
    
        mustCreateSpace = true;
        
        // There isn't enough space to slot all the unassigned widgets between the
        // previous and next values.
        // Therefore we'll pick a reasonable sized gap, spread the unassigned widgets out
        // by that much, and shift subsequent widgets forward by the same amount until
        // the overlap is eliminated.
        var gap = Math.ceil(isc.Canvas.TAB_INDEX_GAP / 3),
            // maxTabIndex: tab index of the last node we know we're assigning an index to
            maxTabIndex = previousTabIndex + (gap * slots);
            
        if (!recalculateAll) {
            var exceedsCeiling = maxTabIndex >= isc.Canvas.TAB_INDEX_CEILING;
            if (!exceedsCeiling) {

                // Determine how many nodes we'll have to move forward to accomodate this            
                var followingAssignedNode = nextNode,
                    followingAssignedNodeTI = maxTabIndex + gap;
    
                while (followingAssignedNode && (maxTabIndex <= followingAssignedNodeTI))
                {
                
                    if (followingAssignedNodeTI >= isc.Canvas.TAB_INDEX_CEILING) {
                        exceedsCeiling = true;
                        break;
                    }
                    followingAssignedNodes.add(followingAssignedNode);
                    followingAssignedNode = this._getNextCanFocusNode(followingAssignedNode, true);
                    
                    // If the next node already has a tabIndex it may already be greater than
                    // the index we just set on this node plus our gap
                    // (since our gap is smaller than the default tab_index_gap).
                    // Update maxTabIndex to reflect this so we can exit the loop
                    // if appropriate.
                    
                    if (followingAssignedNode && followingAssignedNode.tabIndex != null) {
                        maxTabIndex = followingAssignedNode.tabIndex;
                    }

                    followingAssignedNodeTI += gap;
                }
                
            }
            if (exceedsCeiling && !recalculateAll) {
                this.logInfo("TabIndex assignment logic for node:" + node.nodeID +
                    " requires additional space. Recalculating all tab-indices");
                this.calculateTabIndex(node, true);
                return;
            } else {
                this.logDebug("Shuffling " + followingAssignedNodes.length +
                     " entries forward to accomodate new tab-targets, ensuring a gap of " 
                     + gap + " between adjacent tabIndex values");
            }
        }
        
        
    } else {
        // Don't default to burning all the space up to the ceiling - leave a standard
        // gap between tab indices
        gap = Math.min(gap, isc.Canvas.TAB_INDEX_GAP);
    }

    // Warn if we're recursively being fired by a custom tabIndexUpdated callback
    // Not entirely clear what ill effects, if any would occur here.
    if (this._firingTabIndexUpdatedCallbacks) {
        this.logWarn("Automated tab index assignment is being run recursively as " +
            "a result of custom code in a registered tabIndexUpdated callback.");
    }
    
    // We've got the gap we want to apply - now apply it to each entry and 
    // fire the notification function
    var tabIndex = previousTabIndex + gap;

    // This is an array of nodes which had a tabIndex assigned which we're now
    // changing. We'll call the notification method on each of these nodes
    // (after we've finished assigning everything).
    // Note that we would typically only be modifying existing tab indices if
    // recalculateAll was passed (so we're modifying TI of all nodes), or
    // we're attempting to squeeze too many nodes between two already-applied
    // tab indices, leading to us having to shuffle subsequent nodes forward.
    var modifiedTabIndex = [];

    for (var i = precedingUnassignedNodes.length-1; i >= 0; i--) {
        if (logDebug) {
            this.logDebug("Lazily assigning tabIndex " + 
                tabIndex + " to preceding entry: " + precedingUnassignedNodes[i].nodeID);
        }
    
        if (precedingUnassignedNodes[i].tabIndex != null) {
            modifiedTabIndex.add(precedingUnassignedNodes[i]);
        }
        
        precedingUnassignedNodes[i].tabIndex = tabIndex;
        tabIndex += gap;
    }

    if (logDebug) {
        this.logDebug("Assigning requested tabIndex " + tabIndex + " to " + node.nodeID);
    }
    if (node.tabIndex != null) {
        modifiedTabIndex.add(node);
    }
    node.tabIndex = tabIndex;
    tabIndex += gap;
    
    for (var i = 0; i < subsequentUnassignedNodes.length; i++) {
        if (logDebug) {
            this.logDebug("Lazily assigning tabIndex " + tabIndex +
                 " to subsequent entry: " + subsequentUnassignedNodes[i].nodeID);
        }
        if (subsequentUnassignedNodes[i].tabIndex != null) {
            modifiedTabIndex.add(subsequentUnassignedNodes[i]);
        }
        subsequentUnassignedNodes[i].tabIndex = tabIndex;
        tabIndex += gap;
    }
    
    // If we needed more space than we have, move the next tab stop forward, and
    // cascade this onto the following one and the one after that, and so on.
    
    if (mustCreateSpace) {
    
        for (var i = 0; i < followingAssignedNodes.length; i++) {
            var nextNode = followingAssignedNodes[i];
            var notify = nextNode.tabIndex != null;
            if (logDebug) {
                this.logDebug("Creating space by shifting tab index forward for node:"
                     + nextNode.nodeID +
                    " from " + nextNode.tabIndex + " to " + tabIndex);
            }
            
            nextNode.tabIndex = tabIndex;
            if (notify) modifiedTabIndex.add(nextNode);
            tabIndex += gap;
        }
        
    }
    
    // Now fire the notification methods for any tab indices that were changed
    
    this._firingTabIndexUpdatedCallbacks = true;
    var callbacksStartTime;
    if (logDebugPerf) callbacksStartTime = isc.timeStamp();
        
    for (var i = 0; i < modifiedTabIndex.length; i++) {
        var callback = this._callbackMap[modifiedTabIndex[i].nodeID].tabIndexUpdatedCallback;
    
        if (callback != null) {
            this.fireCallback(callback, "ID", [modifiedTabIndex[i].nodeID]);
        }
    }
    delete this._firingTabIndexUpdatedCallbacks;
    
    if (logDebugPerf) {
        var endTime = isc.timeStamp();
        var localTotal = (endTime - startTime),
            localCallbacks = (endTime - callbacksStartTime);
        if (recalculateAll) {
            var endTime = isc.timeStamp();
            var localTotal = (endTime - startTime),
                localCallbacks = (endTime - callbacksStartTime);
            if (this._recalculateTITimings == null) {
                this._recalculateTITimings = [localTotal, localCallbacks]
            } else {
                this._recalculateTITimings[0] += localTotal;
                this._recalculateTITimings[1] += localCallbacks;
            }
            this.logDebug("Time to recalculate all tab indices " + localTotal + "ms. " +
                "Includes " + localCallbacks + 
                "ms firing tabIndexUpdated notifications for " + 
                modifiedTabIndex.length + " entries." +
                " Cumulative time:" + this._recalculateTITimings[0] +
                " [includes cumulative callbacks time:" + this._recalculateTITimings[1] + "]",
                "TabIndexManagerPerformance"); 
        } else {
            if (this._calculateTITimings == null) {
                this._calculateTITimings = [localTotal, localCallbacks]
            } else {
                this._calculateTITimings[0] += localTotal;
                this._calculateTITimings[1] += localCallbacks;
            }
            // This could be very spammy, so only log if debug enabled for both
            // timings and TabIndexManager as a whole
            if (this.logIsDebugEnabled()) {
                this.logDebug("Time to calculate tab index for node:" + ID + ", and related nodes: " +
                     localTotal + "ms. " +
                    "Includes " + localCallbacks + 
                    "ms firing tabIndexUpdated notifications for " + 
                    modifiedTabIndex.length + " entries." +
                    " Cumulative time:" + this._calculateTITimings[0] +
                    " [includes cumulative callbacks time:" + this._calculateTITimings[1] + "]",
                    "TabIndexManagerPerformance"); 
            }
        }
    }
},

//> @classMethod TabIndexManager.focusInTarget()
// Request the TabIndexManager shift focus to a registered focus target.
// <P>
// This method does not directly change the focus within the DOM - instead it invokes the 
// <code>shiftFocusCallback</code> registered for the specified target if it is marked as
// <code>canFocus:true</code>.
// <P>
// Returns false if the target had no no <code>shiftFocusCallback</code>, 
// the <code>shiftFocusCallback</code> returned false, or if the target is marked
// as not <code>canFocus:true</code>
// @param ID (String) target to shift focus to
// @return (boolean) returns false to indicate failure to shift focus.
// @visibility external
//<
focusInTarget : function (ID) {
    if (this.logIsDebugEnabled("syntheticTabIndexTrace")) {
        this.logDebug("TabIndexManager.focusInTarget(): Stack Trace:\n" 
            + this.getStackTrace(), "syntheticTabIndexTrace");
    }
    var node = this._getNode(ID);
    if (!node || !node.canFocus || 
        this._callbackMap[node.nodeID].shiftFocusCallback == null)
    {
        this.logDebug(
            "TabIndexManager.focusInTarget(): Not attempting to focus on target with ID:" + 
            ID,
            "syntheticTabIndex");
        return false;
    }
    this.logDebug(
        "TabIndexManager.focusInTarget(): Attempting to focus on target with ID:" + ID 
        
        + ", enable 'syntheticTabIndexTrace' debug logging for stack trace.",
        "syntheticTabIndex");
    
    return this.fireCallback(
                this._callbackMap[node.nodeID].shiftFocusCallback, 
                "ID", 
                [ID]);

},

//> @classMethod TabIndexManager.shiftFocus()
// Method to shift focus to the next registered focusable target.
// <P>
// This method does not directly change the focus within the DOM - instead it finds the 
// next target marked as <code>canFocus:true</code>, and invokes the 
// <code>shiftFocusCallback</code> registered for that target.
// This callback is expected to take the appropriate action (typically shifting native
// focus to an element in the DOM), and return true (or return false, if the target
// could not receieve focus for some reason, in which case we'll find the next
// <code>canFocus:true</code> target and repeat the action there.
// <P>
// Targets with no <code>shiftFocusCallback</code> will be skipped entirely in this process.
//    
// @param ID (String) current focus target. If null, focus will be applied to the first
//   focusable target (or the last if the <code>forward</code> parameter is false).
// @param forward (boolean) should focus move forward to the next focusable target, or 
//   backward to the previous focusable target.
// @return (boolean) returns true to indicate focus was successfully shifted, false to
//   indicate this method was unable to change focus.
// @visibility external
//<
// We use this when the click-mask is up to allow the user to tab through a subset of
// unmasked widgets without us having to go and explicitly set tabIndex to -1 on every 
// masked target when the mask goes up.


_nullMarker:{isNullMarker:true},
shiftFocus : function (ID, forward, withinParent, originalID) {

    // This is a recursive method - if shiftFocusCallback fails for some node we'll
    // call the method again, moving to the next node.
    // The originalID param contains the ID (String) on which the method was first called.
    var isRecursive = (originalID != null)
    if (originalID == null) {
        if (ID == null) originalID = this._nullMarker;
        else {
            originalID = ID;
        }
    }
    
    // If we're logging stack traces on attempted shift-focus calls, log once
    // when this method is invoked rather than when we actually shift focus. This 
    // avoids the user seeing a bunch of recursive 'shiftFocus()' calls.
    if (!isRecursive && this.logIsDebugEnabled("syntheticTabIndexTrace")) {
        this.logDebug("Attempt to synthetically shift focus " +
            (withinParent ? "(within group) " : "") +
            "from " + ID + "\n" + this.getStackTrace(), 
            "syntheticTabIndexTrace");
    }
    
    var currentNode;
    if (ID == null) {
        if (forward) {
            currentNode = this._tabTree.get(0);
        } else {
            currentNode = this._tabTree.get(this._tabTree.getLength()-1);
        }
        if (!currentNode.canFocus && (currentNode.nodeID != originalID)) {
            currentNode = this._getNextCanFocusNode(currentNode, forward, null, originalID);
        }
    } else {
        // When we get called recursively we pass the node, rather than the string into
        // this method to save a lookup.
        var prevNode = ID;
        if (!isc.isAn.Object(prevNode)) {
            prevNode = this._getNode(ID);
        }
        currentNode = this._getNextCanFocusNode(prevNode, forward, null, originalID);
    }

    // if withinParent was passed and the next node isn't within the parent,
    // (or we didn't find a 'next' node), just bail.
    
    if (withinParent != null) {
        var withinParentID = withinParent;
        if (!isc.isAn.Object(withinParent)) {
            withinParent = this._getNode(withinParent);
            if (withinParent == null) {
                this.logWarn("shiftFocus() [within group]: " +
                    "Unexpected tree structure detected in TabIndexManager. " +
                    "Tabbing behavior cannot be guaranteed within this app." +
                    // Stack trace will indicate what the parent ID was, etc.
                    (this.logIsInfoEnabled() ? "\n" + this.getStackTrace() : ""));
                return;
            }
        }
        if (currentNode == null || 
            (currentNode != null &&
                (currentNode.nodeID != withinParent.nodeID && 
                    !this._tabTree.isDescendantOf(currentNode, withinParent))
            )
        )
        {
            this.logInfo("shiftFocusWithinGroup(): Unable to find a " +
                    "subsequent focusable element within group - focus will not be moved.",
                    "syntheticTabIndex");
            return false;
        }
    }
    
    // Catch the case where we've gone through the entire tab chain and didn't find anything to
    // glom onto.
    if ((currentNode == null && (originalID == this._nullMarker)) ||
        (currentNode != null && (originalID == currentNode.nodeID)) ) 
    {
        this.logInfo("shiftFocus(), passed ID:" + 
                     (originalID == this._nullMarker ? "null" : originalID) + 
                     " unable to find subsequent focusable target", "syntheticTabIndex");
        return false;
    }
    
    
    var shiftFocusCallback = currentNode && this._callbackMap[currentNode.nodeID].shiftFocusCallback,
        shifted = false;
    if (this.logIsDebugEnabled("syntheticTabIndex")) {
        this.logDebug("TabIndexManager.shiftFocus(), " +
                (currentNode ?
                    ("checking for node with ID:" + currentNode.nodeID
                     
                     ) 
                 :
                     ("found no subsequent focusable entry, looping back to " +
                      "check entries from the start of the chain")
                )
                + ", enable 'syntheticTabIndexTrace' debug logging for stack trace.",      
                    "syntheticTabIndex");
    }
    
    if (shiftFocusCallback != null) {
        shifted = this.fireCallback(shiftFocusCallback, "ID", [currentNode.nodeID]);
    }

    if (!shifted) {
        // Go recursive - find the *next* target and call the callback on that
        return this.shiftFocus(currentNode, forward, withinParent, originalID);
    } else {
        this.logInfo("shiftFocus(): Put focus into target with ID:" + currentNode.nodeID,
             "syntheticTabIndex");
        return true;
    }
},


//> @classMethod TabIndexManager.shiftFocusWithinGroup()
// Method to shift focus to the next registered focusable target within some group.
// This method will move focus forward or backward, considering only the specified
// target and any targets within its group (registered as children of the target via
// +link{TabIndexManager.addTarget()} or +link{TabIndexManager.moveTarget()}).
// <P>
// The second parameter can be passed to specify an explicit starting position to
// shift focus from. If this is not present, this method will attempt to focus into the
// group target itself if moving forward (or its last child, if moving backward) and
// failing that, shift focus from there.
// <P>
// This method does not directly change the focus within the DOM - instead it finds the 
// next target marked as <code>canFocus:true</code>, and invokes the 
// <code>shiftFocusCallback</code> registered for that target.
// This callback is expected to take the appropriate action (typically shifting native
// focus to an element in the DOM), and return true (or return false, if the target
// could not receieve focus for some reason, in which case we'll find the next
// <code>canFocus:true</code> target and repeat the action there.
// <P>
// Targets with no <code>shiftFocusCallback</code> will be skipped entirely in this process.
// <P>
// A return value of false indicates that this method was unable to shift focus to a new 
// target.
//    
// @param targetGroup (String) ID of registered target. Focus will be shifted within
//   this target and its descendants only.
// @param currentTarget (String) Optional ID of current focus target within the group
//   focus will be shifted in the specified direction from this node.
// @param forward (boolean) should focus move forward to the next focusable target, or 
//   backward to the previous focusable target.
// @return (boolean) returns true to indicate focus was successfully shifted, false to
//   indicate this method was unable to change focus.
// @visibility external
//<
shiftFocusWithinGroup : function (targetGroup, currentTarget, forward) {
    if (currentTarget == null) {
        if (forward) currentTarget = targetGroup;
        else currentTarget = this.getLastFocusTargetInGroup(targetGroup) || targetGroup;
        // See if we can just focus in the first, or last element   
        if (this.focusInTarget(currentTarget)) return true;
    }

    // actual shifting logic implemented in shiftFocus    
    return this.shiftFocus(currentTarget, forward, targetGroup);

},

//> @classMethod TabIndexManager.shiftFocusAfterGroup()
// Method to shift focus to the next registered focusable target beyond some registered
// target and any targets registered as children within its group via 
// +link{TabIndexManager.addTarget()} or +link{TabIndexManager.moveTarget()}.
// <P>
// This method does not directly change the focus within the DOM - instead it finds the 
// next target marked as <code>canFocus:true</code>, and invokes the 
// <code>shiftFocusCallback</code> registered for that target.
// This callback is expected to take the appropriate action (typically shifting native
// focus to an element in the DOM), and return true (or return false, if the target
// could not receieve focus for some reason, in which case we'll find the next
// <code>canFocus:true</code> target and repeat the action there.
// <P>
// Targets with no <code>shiftFocusCallback</code> will be skipped entirely in this process.
// <P>
// A return value of false indicates that this method was unable to shift focus to a new 
// target.
//    
// @param targetGroup (String) ID of registered target. Focus will be shifted to the
//   next registered focusable element, skipping this group and its descendants.
// @param forward (boolean) should focus move forward to the next focusable target, or 
//   backward to the previous focusable target.
// @return (boolean) returns true to indicate focus was successfully shifted, false to
//   indicate this method was unable to change focus.
// @visibility external
//<
//  Note that since children of a target node sit logically after it in the page's tab
//  sequence, calling this method with the forward param set to false is actually 
//  the same as calling the standard 'shiftFocus' method
shiftFocusAfterGroup : function (targetGroup, forward) {
    var currentTarget = forward ? 
            this.getLastFocusTargetInGroup(targetGroup) || targetGroup :
            targetGroup;

    return this.shiftFocus(currentTarget, forward);
},

// Helper to get the next canFocus:true node
_getNextCanFocusNode : function (node, forward, hasTabIndex, stopAtNode) {
    var treeIndex = this._tabTree.indexOf(node);
    var end = forward ? this._tabTree.getLength()-1 : 0,
        step = forward ? 1 : -1;
    // this.logWarn("_getNextCanFocusNode -- node:" + 
    //              node.nodeID + ", treeIndex:" + treeIndex +
    //              ", end/step:" + [end,step]);    
    while (treeIndex != end) {
        treeIndex += step;
        var nextNode = this._tabTree.get(treeIndex);
        
        // the "stopAtNode" parameter allows us to check for canFocus:true nodes
        // up to some arbitrary point.
        // We use this in 'shiftFocus' to avoid looping infinitely through our tree
        // if we don't find a focusable target.
        
        if (nextNode.nodeID == stopAtNode) {
            return nextNode;
        }
        
        // this.logWarn("NEXT NODE(" + treeIndex + "):" + this.echo(nextNode));
        if (nextNode && nextNode.canFocus &&
            (!hasTabIndex || (nextNode.tabIndex != null)))
        {
                return nextNode;
        }
    }
},    

// getNext/previous focus target are internal, for completeness only.
// (synonyms for _getNextCanFocusNode().nodeID)
// The only obvious use case for these externally would be to shift focus
// in the tab sequence (simulated tab keypress). We provide an explicit API for that.

getNextFocusTarget : function (ID) {
    var node = this._getNode(ID),
        nextNode = this._getNextCanFocusNode(node, true);
    return nextNode ? nextNode.nodeID : null;
},

getPreviousFocusTarget : function (ID) {
    var node = this._getNode(ID),
        nextNode = this._getNextCanFocusNode(node, false);
    return nextNode ? nextNode.nodeID : null;
},

// Given a parent node ID, get the last descendant thereof
// (include the parent itself if nothing else is focusable)

getLastFocusTargetInGroup : function (ID) {
    var node;
    if (ID) {
        node = this._getNode(ID);
    }
    if (node == null) node = this._tabTree.getRoot(); 
    var descendants = this._tabTree.getDescendants(node);
    
    for (var i = descendants.length-1; i >=0; i--) {
        var currentNode = descendants[i];
        if (currentNode.canFocus) return currentNode.nodeID;
    }
    if (node.canFocus) return node.nodeID;
},


//> @classMethod TabIndexManager.showAllocatedTabChain()
// Show the current hierarchy of targets passed to +link{TabIndexManager.addTarget()} together with
// current canFocus state and tabIndex (if assigned). Results are output to the developer console.
// @visibility external
//<
showAllocatedTabChain : function () {
    this.logWarn("Allocated tab chain:\n" + this.getAllocatedTabChain());
},

//> @classMethod TabIndexManager.getAllocatedTabChain()
// Get a report of the  current hierarchy of targets passed to +link{TabIndexManager.addTarget()}
// together with current canFocus state and tabIndex (if assigned).
// @return (String) 
// @visibility external
//<
getAllocatedTabChain : function () {
    var nodes = this._tabTree.getDescendants();
    var report = [];
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var level = this._tabTree.getLevel(node),
            indent = "";
        for (var ii = 1; ii < level; ii++) {
            indent += "    ";
        }
        
        // We don't associate any meaningful context with each entry in the
        // TabIndexManager, but for FormItems / Canvii, we use their global IDs,
        // so we can look up the object that way for reporting on it.
        
        var context = window[node.nodeID],
            isCanvas = context && isc.isA.Canvas(context),
            isFormItem = context && isc.isA.FormItem(context);
        
        report.add("*" + indent + node.nodeID + " canFocus:" + node.canFocus + " > " + 
            // canvas-specific report - not entirely safe:
            (isCanvas ? 
                ((context.isDrawn() ? " [drawn" : " [undrawn") + " Canvas]") 
             : 
                // formItem specific report:
                (isFormItem ? 
                    "[" + (context.name ? "name:" + context.name : "title:" + context.title) + "]" 
                    : "")
            ) +
             (node.tabIndex == null ? "unallocated" : node.tabIndex));
    }
    return report.join("\n");
}


});

isc.TabIndexManager._buildTree();
