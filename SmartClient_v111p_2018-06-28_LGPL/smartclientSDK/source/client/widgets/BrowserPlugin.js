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
//>	@class	BrowserPlugin
//  
//  Container for a Browser Plugin.
//
//  @inheritsFrom Canvas
//  @treeLocation Client Reference/Client Bridges
//  @requiresModules PluginBridges
//  @visibility PluginBridges
//<



isc.ClassFactory.defineClass("BrowserPlugin", "Canvas");

isc.BrowserPlugin.addClassProperties({
    instances: [], // all instances of browserPlugin

    // future extension point - called by EH handleDragMove.  
    handleDragMoveNotify : function () { }
});

isc.BrowserPlugin.addProperties({
    // the plugin src
    src: "",
    extraHTML: "",       // arbitrary additional html (added to the embed tag)
    installPlugin: true, // trigger the plugin auto-installer if supported?
    // avoid automatic redrawing, which would recreate the plugin instance.  We don't want to do
    // this for any automatic reason; only if redraw() is explicitly called.
    redrawOnResize:false,
    _redrawWithMaster:false,
    _redrawWithParent:false,

    // This flag controls whether we register the component as a maskable item with the
    // EventHandler (ultimately controls whether _showDragMask()/_hideDragMask() get called on
    // this component on dragStart.
    useDragMask: true,

    dragMaskType: "hidePlugin",

    // A placeholder dragMask means that we hide the plugin and show a "Dragging..." or similar
    // Label placeholder.  This is appropriate for plugins where no masking mechanism exists to
    // allow us to capture events.
    //
    // Moz Plugins cause uncorrectable burnthrough, but events can be captured with a standard
    // dragMask.  This setting is a tradeoff on Moz between hiding the plugin and the ability
    // to see what you're dragging over it
    usePlaceholderDragMask: !isc.Browser.isMoz,

initWidget : function () {
    isc.BrowserPlugin.instances.add(this);
},

destroy : function () {
    isc.BrowserPlugin.instances.remove(this);
    this.Super("destroy", arguments);
},

draw : function () {
    this.Super("draw", arguments);

    // if the backmask that we typically use via useBackMask will burn through this component,
    // then it we should disable it for any ancestors, otherwise this component won't show up.
    // The correct solution to this is too complex to implement at the moment - need to
    // disable/re-enable the backmask based on this component being cleared, reparented,
    // destroyed, etc and we don't want to impact the critical path code in Canvas.draw() to
    // check any children.
    //
    // For now, we simply solve the typical case of a plugin that gets burned through by a
    // backmask being placed inside a component that sets useBackMask: true by disabling all
    // such masks up the parent chain and making no effort to re-enable them.
    if (this.backMaskCausesBurnThrough) {
        var applet = this;
        this.getParentElements().map(function (ancestor) {
            if (ancestor.useBackMask) {
                applet.logInfo("Suppressing backmask of ancestor: " + ancestor.getID());
                if (ancestor._backMask) {
                    // backmask exists, suppress and hide it
                    ancestor._backMask.suppressed = true;
                    ancestor._backMask.hide();
                } else {
                    // backmask will exist after onload, suppress
                    if (!ancestor._deferredBackMaskProps) ancestor._deferredBackMaskProps={};
                    ancestor._deferredBackMaskProps.suppressed = true;
                }
            }
        });
    }
}

});
