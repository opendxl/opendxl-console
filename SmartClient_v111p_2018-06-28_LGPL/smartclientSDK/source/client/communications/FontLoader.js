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
//>	@class FontLoader
// Force-loads the custom fonts declared in the +link{group:skinning,current skin's CSS file}
// and updates any potentially-affected, already-drawn canvii when loading completes.  Without
// FontLoader, auto-sized canvii that use custom fonts may end up with the wrong size if a page
// is loaded when its custom fonts are not available in the browser cache.
// <P>
// To disable FontLoader, set &nbsp;<code>window.isc_loadCustomFonts = false</code>&nbsp; before
// SmartClient is loaded.
// <P> 
// If you want to avoid the Framework redrawing canvii after the fonts load, you may want to
// code your app to delay drawing anything until the skin fonts are loaded.  You can check
// +link{FontLoader.isLoadingComplete()} to see whether loading is done, and if it's not, you
// can <smartclient>set a "fontsLoaded" +link{page.setEvent(), page event}</smartclient>
// <smartgwt>call {@link #addFontsLoadedHandler addFontsLoadedHandler()}</smartgwt> to run code
// when it's done or
// <smartclient>a "fontLoadingFailed" +link{page.setEvent(), page event}</smartclient>
// <smartgwt>{@link #addFontLoadingFailedHandler addFontLoadingFailedHandler()}</smartgwt> to
// run code if there's an error.
// <P>
// <h3>Advanced Usage</h3>
// <code>FontLoader</code> will use the new 
// +externalLink{https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API,CSS Font Loading API}
// in browsers in which it's available and has proven reliable.  Otherwise, we fall back to
// canvas measurement techniques to detect loading.  To force fallback and avoid the API, set
// &nbsp;<code>window.isc_useCSSFontAPI = false</code>&nbsp;, or to force the API to be used
// (where it exists but may be unreliable) set &nbsp;<code>window.isc_useCSSFontAPI = 
// true</code>&nbsp, before SmartClient is loaded.
// <P>
// If you're loading additional style sheets, beyond the skin, that declare custom fonts with
// &#064;font-face, you can request that the <code>FontLoader</code> force-load them as well by
// specifying them in <code>window.isc_additionalFonts</code> as an array of the font family
// names matching those from the &#064;font-face declarations.
// <P>
// Note that currently, if you have more than one font with the same font family name in your
// CSS, you'll need to use the CSS Font Loading API approach if you want them all loaded by the
// FontLoader.  Under the measurement approach, the FontLoader is only able to load the default
// font for each font family, since it has no knowledge beyond the specified family names.
// 
// @treeLocation Client Reference/Foundation
// @visibility external
//<
isc.ClassFactory.defineClass("FontLoader").addClassProperties({

    // logging category
    _$fontLoading: "fontLoading",

    // common attributes
    customFonts: [],
    canviiToAdjust: [],
    fontLoadTimeout: 20000,

    // CSS Font API-only
    loadingFontFaces: [],

    // measurement (fallback-only)
    customFontElements: [],
    fontPollingInterval: 100,

    
    _getElementHTMLForFont : function (fontFamily) {
        fontFamily = (fontFamily ? fontFamily + ", " : "") + "monospace";
        return "<div style='font-size: 72px; font-family: " + fontFamily + 
            "'>AMWTYVPXIamwtyvpxi@#%^&_</div>"
    },

    // create an off-screen test canvas to measure the custom fonts
    _createMeasureCanvas : function () {
        // add an element for the built-in, fallback font
        var contents = isc.SB.create();
        contents.append(this._getElementHTMLForFont());

        // add an element for each requested custom font
        var fonts = this.customFonts;
        for (var i = 0; i < fonts.length; i++) {
            contents.append(this._getElementHTMLForFont(fonts[i]));
        }

        return isc.Canvas.create({
            ID: "_fontLoaderMeasureCanvas", left: -10000, autoDraw: true, overflow: "ignore", 
            contents: contents.release(), showCustomScrollbars: false, _fontLoaderIgnore: true
        });
    },


    //> @classMethod FontLoader.loadCustomFonts()
    // Starts loading the specified fonts, either by using the
    // +externalLink{https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API,CSS Font Loading API},
    // or drawing a measure canvas containing those fonts.  If a measure canvas is needed, we
    // may have to wait until the document body is present before the canvas can be created.
    // @param customFonts (Array of String) custom fonts to load, as fontFamily names
    // @param cssLoaded (Boolean) whether skin CSS has finished loading (!= false means yes)
    //<
    
    loadCustomFonts : function (customFonts, cssLoaded) {
        if (window.isc_loadCustomFonts == false) return;

        
        if (isc.isAn.Array(customFonts)) {
            if (isc.isAn.Array(window.isc_additionalFonts)) {
                customFonts = customFonts.duplicate();
                customFonts.addList(window.isc_additionalFonts);
            }
            this.customFonts = customFonts;
        }

        // nothing to do if no fonts requested
        customFonts = this.customFonts;
        if (!isc.isAn.Array(customFonts)) return;

        // handle cssLoaded param that indicates whether the skin CSS is loaded
        if (cssLoaded == false) {
            this.logInfo("CSS not yet loaded - deferring detection of custom font loading " +
                         "until CSS loaded", this._$fontLoading);
            this.fontLoadInProgress = true;
            return;
        } else if (!this.cssLoaded) {
            this.logInfo("CSS loaded - detection of custom font loading can proceed", 
                         this._$fontLoading);
            this.cssLoaded = true;
        }

        this.logInfo("Requested loading of " + customFonts.length + " custom fonts",
                     this._$fontLoading);

        
        var that = this,
            nFontsToLoad = 0,
            shouldUseAPI = window.isc_useCSSFontAPI == true ||
                           window.isc_useCSSFontAPI != false && isc.Browser.isMoz
        ;

        var fontFaceSet = window.FontFace && document.fonts;
        if (fontFaceSet && fontFaceSet.forEach && shouldUseAPI) { 
            // CSS Font API approach - loop across each FontFace in FontFaceSet,
            // performing a load() on each font that's not already loaded
            fontFaceSet.forEach(function (fontFace) {
                
                var family = fontFace.family.replace(/['"]/g, "");
                if (customFonts.indexOf(family) < 0) return;

                
                var fontStatus = fontFace.status;
                if (fontStatus == "unloaded" || fontStatus == "loading") {
                    fontFace.load().then(function () {
                        if (that.fontLoadInProgress) that.finishLoading();
                    });
                    
                    this.loadingFontFaces.add(fontFace);
                    nFontsToLoad++;
                }
            }, this);
            
            this.useCSSFontAPI = true;
        } else {
            
            if (this.getDocumentBody(true) == null) {
                this.fontLoadInProgress = true;
                this._bodyTimer = this.delayCall("loadCustomFonts");
                this.logInfo("Rescheduling loadCustomFonts() to run after the current " +
                    "thread, since the document body doesn't yet exist, but is required " +
                    "to detect font loading by measuring a test canvas", this._$fontLoading);
                return;
            }
            delete this._bodyTimer;

            

            

            // measurement/fallback approach - detect font loading via a measure canvas
            this.fontMeasureCanvas = this._createMeasureCanvas();
            var measureHandle = this.fontMeasureCanvas.getHandle(),
                defaultFontWidth = measureHandle.children[0].scrollWidth;

            // track which elements correspond to unloaded fonts
            for (var i = 0; i < customFonts.length; i++) {
                var fontDiv = measureHandle.children[1 + i];
                // if size hasn't changed, font isn't loaded
                if (fontDiv.scrollWidth == defaultFontWidth) {
                    this.customFontElements.add(fontDiv);
                    nFontsToLoad++;                    
                }
            }

            
            if (nFontsToLoad) this._schedulePoll();

            this.useCSSFontAPI = false;
        }

        if (nFontsToLoad) {
            // for either approach, log the fonts that we're waiting on and set a timeout
            this.fontLoadInProgress = true;
            this._notLoadedTimer = isc.Timer.setTimeout(
                {target: this, methodName: "loadingTimedOut"}, this.fontLoadTimeout);
            this.logInfo("Waiting on " + nFontsToLoad + "/" + customFonts.length + 
                         " fonts to load using " + (this.useCSSFontAPI ? 
                         "the CSS Font API" : "canvas measurement"), this._$fontLoading);
        } else {
            // all fonts are loaded - but call loadingComplete() since canvii may be queued
            this.logInfo("All " + customFonts.length + " requested fonts loaded synchronously",
                         this._$fontLoading);
            this.loadingComplete(isc.EventHandler.FONTS_LOADED);
        }
    },

    // schedule a poll to check element widths (fallback approach)
    _schedulePoll : function () {
        var that = this;
        this._pollingTimer = isc.Timer.setTimeout(function () {
            this._pollingTimer = null;
            if (that.fontLoadInProgress && !that.finishLoading()) that._schedulePoll();
        }, this.fontPollingInterval);
    },

    // return whether any fonts are unloaded (and add unloaded fontFamilies to fonts)
    _getUnloadedFonts : function (fonts) {
        if (this.useCSSFontAPI) { // check for FontFaces "loaded"
            var loadingFontFaces = this.loadingFontFaces;
            for (var i = 0; i < loadingFontFaces.length; i++) {
                var face = loadingFontFaces[i];
                if (face.status != "loaded") {
                    if (fonts) fonts.add(face.family);
                    else return true;
                }
            }
        } else { // check whether font element widths have changed
            var measureHandle = this.fontMeasureCanvas.getHandle(),
                defaultFontWidth = measureHandle.children[0].scrollWidth
            ;
            var customFontElements = this.customFontElements;
            for (var i = 0; i < customFontElements.length; i++) {
                var fontDiv = customFontElements[i];
                if (fontDiv.scrollWidth == defaultFontWidth) {
                    if (fonts) fonts.add(fontDiv.style.fontFamily.replace(/,.*$/, ""));
                    else return true;
                }
            }
        }
        return fonts ? fonts.length > 0 : false;
    },

    //> @classMethod FontLoader.isLoadingComplete()
    // Whether all requested custom fonts have been loaded.  If this method returns true, you
    // know that the +link{FontLoader} won't need to redraw any canvii drawn afterwards, and
    // that a
    // <smartclient>"fontsLoaded" or "fontLoadingFailed" +link{page.setEvent(), page event}
    // won't fire (it may have previously fired).</smartclient>
    // <smartgwt><smartgwt>{@link com.smartgwt.client.util.events.FontsLoadedEvent}
    // or {@link com.smartgwt.client.util.events.FontLoadingFailedEvent} won't arrive
    // (it may have previously been handled).</smartgwt>
    //
    // @return (boolean) whether all requested fonts have been loaded
    // @visibility external
    //<
    isLoadingComplete : function () {
        return !this.fontLoadInProgress;
    },

    // have fonts finished loading? - if so, set loading as complete and adjust queued canvii
    finishLoading : function (timedOut, unloadedFonts) {
        
        if (this._bodyTimer) {
            if (this.getDocumentBody(true) == null) return false;
            isc.Timer.clear(this._bodyTimer);
            this.loadCustomFonts();
        }

        // nothing to do if fonts aren't being loaded
        if (!this.fontLoadInProgress) return true;

        // we're still waiting for CSS if useCSSFontAPI null
        if (this.useCSSFontAPI == null) return false;

        
        var logWait = this.logIsDebugEnabled(this._$fontLoading) && !timedOut;
        if (logWait) {
            
            unloadedFonts = [];
        }

        // we're done unless there are any unloaded fonts
        if (this._getUnloadedFonts(unloadedFonts)) {
            if (logWait) this.logDebug("Still waiting for custom fonts to load: " +
                                      unloadedFonts.join(", "), this._$fontLoading);
            return false;
        }

        // fonts have loaded, so clear any polling, and cancel the timeout
        isc.Timer.clear(this._pollingTimer),   delete this._pollingTimer;
        isc.Timer.clear(this._notLoadedTimer), delete this._notLoadedTimer;

        // all fonts have successfully loaded, so adjust queued autofitting canvii
        this.logInfo("All fonts needed have successfully loaded", this._$fontLoading);
        this.loadingComplete(isc.EventHandler.FONTS_LOADED);
        return true;
    },

    
    loadingTimedOut : function () {
        var unloadedFonts = [];
        if (this.finishLoading(true, unloadedFonts)) return;

        // we've timed out, so clear any scheduled polling callback
        isc.Timer.clear(this._pollingTimer), delete this._pollingTimer;

        // we timed out, but some fonts may have loaded, so adjust queued autofitting canvii
        this.logWarn("Timed out waiting on load of custom fonts: " + unloadedFonts.join(", "),
                     this._$fontLoading);
        this.loadingComplete(isc.EventHandler.FONT_LOADING_FAILED);
    },

    // set isLoadingComplete() to return true, stop waiting for fonts, and
    loadingComplete : function (eventType) {
        this.fontLoadInProgress = false;
        // release measure canvas if created
        if (this.fontMeasureCanvas) {
            this.fontMeasureCanvas.destroy();
            delete this.fontMeasureCanvas;
        }
        if (this.canviiToAdjust.length) isc.FontLoader.adjustCanviiForContent();
        // run any installed event handlers for "fontsLoaded" or "fontLoadingFailed" 
        if (eventType) isc.Page.handleEvent(null, eventType);
    },

    
    // register canvas to be potentially resized after all custom fonts have been loaded
    registerForAdjustContent : function (canvas) {
        if (canvas.canOverflowWidth() || canvas.canOverflowHeight()) {
            if (!canvas._markedForAdjustment) {
                canvas._markedForAdjustment = true;
                this.canviiToAdjust.add(canvas);
            }
        }
    },

    
    // adjust all canvii queued by registerForAdjustContent() - called after fonts load
    adjustCanviiForContent : function () {
        var canvii = this.canviiToAdjust,
            nCanvii = canvii.length
        ;
        for (var i = 0; i < nCanvii; i++) {
            var canvas = canvii[i];
            delete canvas._markedForAdjustment;            
            canvas.adjustForContent();
        }
        this.logInfo(nCanvii + 
            " canvii drawn before fonts were loaded have been adjusted", this._$fontLoading);
        this.nCanviiAdjusted = nCanvii;
        this.canviiToAdjust = [];
    }
        
});
