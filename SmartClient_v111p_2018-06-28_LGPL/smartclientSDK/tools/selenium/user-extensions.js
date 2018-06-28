/*
 * Isomorphic SmartClient
 * Version 8.0
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

// handle various versions of Selenium IDE and Selenium Script playback environments
function isSeleniumIDE() {
    return typeof Recorder != "undefined";
}
function hasHtmlTestSuite() {
    return typeof HtmlTestSuite != "undefined";
}
function hasSendKeys() {
    return typeof Selenium.prototype.doSendKeys != "undefined";
}

// Warn if we're being loaded twice as things will be very likely to not work in this case
if (Selenium.prototype.sc_userExtensions_loaded) {
    LOG.warn("SmartClient user-extensions.js is being loaded more than once - " +
        "check for this file being included multiple times in the Selenium core extensions.");
}
Selenium.prototype.sc_userExtensions_loaded = true;

// provide control over whether to add URL query string defining sc_selenium as true
Selenium.prototype.use_url_query_sc_selenium = true;

// track scroll state of the test root container
Selenium.prototype.testRootScrollState = {};

// extract named-URL argument passed from Java TestRunner Framework to Selenium
function seleniumGetURLParameter(parameterName, targetWindow) {
    if (!targetWindow) targetWindow = frames[0];

    // we may be called before the frames are opened, but still need our params
    var href = !targetWindow ? unescape(seleniumGetURLParameter("test", window)) :
                targetWindow.location ? targetWindow.location.href : null;
    if (href == null) return null;

    var match = href.match(new RegExp("[?&](?:" + parameterName + ")=([^&#]*)"));
    return match && match.length > 1 ? match[1] : null;
};

PageBot.prototype.getAutWindow = function() {
    var autWindow = this.browserbot.getUserWindow();
    
    // if the user window is the dev console, redirect to the actual app window
    if (autWindow.targetWindow != null) autWindow = autWindow.targetWindow;

    // if SmartClient isn't loaded on the target window, just bail;
    // require AutoTest, as it's part of ISC_Core.js in newer SC versions
    if (autWindow.isc == null || autWindow.isc.AutoTest == null) return;

    if (autWindow.isc.Canvas.getCanvasLocatorFallbackPath === undefined) {
        autWindow.isc.ApplyAutoTestMethods();
    }
    autWindow.isc.EventHandler.useNativeEventTime = false;
    return autWindow;
};

Selenium.prototype.getAutWindow = PageBot.prototype.getAutWindow;

PageBot.prototype.locateByScID = function (idLocator, getter, description) {

    var undef, autWindow = this.getAutWindow();

    idLocator = idLocator.replace(/'/g, "");
    idLocator = idLocator.replace(/"/g, "");

    var scObj = autWindow[idLocator];
    if (scObj == null) {
        LOG.info("Unable to locate SC object with ID " + idLocator);
        return description == "element" ? null : undef;
    } else {
        LOG.debug('Found SC object ' + scObj);
    }

    var scLocator = "//" + scObj.getClassName() + "[ID=\"" + idLocator + "\"]";
    LOG.debug("Using SC Locator " + scLocator);
    var target = autWindow.isc.AutoTest.seleniumExecute(getter, scLocator);
    LOG.info("Returning " + description + " :: " + target + " for SC locator " + scLocator);
    return target;
},

PageBot.prototype.locateByScLocator = function (scLocator, getter, description) {

    // support scLocators with the direct ID of the widget specified
    if (scLocator.indexOf("/") == -1) {
        LOG.debug("Using ID locator");
        return this.locateByScID(scLocator, getter, description);
    }
    var autWindow = this.getAutWindow();

    var target = autWindow.isc.AutoTest.seleniumExecute(getter, scLocator);
    LOG.debug("Returning " + description + " :: " + target + " for SC locator " + scLocator);
    return target;
},

// All locateElementBy* methods are added as locator-strategies.
PageBot.prototype.locateElementByScID = function(idLocator, inDocument, inWindow) {
    LOG.debug("Locate Element with SC ID=" + idLocator + ", inDocument=" + inDocument + 
              ", inWindow=" + inWindow.location.href);
    return this.locateByScID(idLocator, "getElement", "element");
},
PageBot.prototype.locateElementByScLocator = function(scLocator, inDocument, inWindow) {
    LOG.debug("Locate Element with SC Locator=" + scLocator + ", inDocument=" + inDocument + 
              ", inWindow=" + inWindow.location.href);
    return this.locateByScLocator(scLocator, "getElement", "element");
},

// We must do our own locator strategy resolution for locateValueBy*
PageBot.prototype.locateValueByScLocatorOrScID = function(locator) {
    LOG.debug("Locate Value with SC Locator/ScID=" + locator);

    var locatorObject = parse_locator(locator),
        locatorType = locatorObject.type;

    // install trimmed locator
    locator = locatorObject.string;

    if (locatorType == "scid") return this.locateByScID(locator, "getValue", "value");
    else                  return this.locateByScLocator(locator, "getValue", "value");
},

Selenium.prototype.orig_doType = Selenium.prototype.doType;

Selenium.prototype.doType = function(locator, value) {
    /**
   * Sets the value of an input field, as though you typed it in.
   *
   * <p>Can also be used to set the value of combo boxes, check boxes, etc. In these cases,
   * value should be the value of the option selected, not the visible text.</p>
   *
   * @param locator an <a href="#locators">element locator</a>
   * @param value the value to type
   */
    this.doFocus(locator);
    this.orig_doType(locator, value);

    // Selenium doesn't actually simulate a user typing into an input box so
    // for SmartClient FormItem's manually register the change.
    if (this.hasSC()) {
    
        var element = this.page().findElement(locator);
        if (element != null) {
    
            var autWindow = this.getAutWindow(),
                isc = autWindow.isc,
                canvas = isc.AutoTest.locateCanvasFromDOMElement(element);
            if (canvas != null && isc.DynamicForm && isc.isA.DynamicForm(canvas)) {
                var itemInfo = isc.DynamicForm._getItemInfoFromElement(element, canvas);
                if (itemInfo && itemInfo.item) {
                    var item = itemInfo.item,
                        event = isc.EH.lastEvent || {};
                    if (isc.isA.ComboBoxItem(item)) {
                        item.refreshPickList(value);
                    }
                    item._handleInput();
                }
            }
        }
    }
};

// scroll the supplied element into view, but only if it's needed
function scrolledElementIntoView (element, coords, canvas, autWindow) {
    // ascend widget hierarchy checking whether each canvas hides element
    for (var isc = autWindow.isc, document = autWindow.document; 
         canvas != null; canvas = canvas.parentElement) 
    {
        var handle = canvas.getClipHandle();
        if (!handle) return;
        // get the bounding box for this canvas
        var rect = isc.Element.getBoundingClientRect(handle);
        if (!rect) return;
        // if coordinates are outside the box, call scrollIntoView()
        if (coords[0] < rect.left || coords[0] > rect.right ||
            coords[1] < rect.top  || coords[1] > rect.bottom)
        {
            element.scrollIntoView(coords[1] < (rect.top + rect.bottom) / 2);
            return true;
        }
    }
};

Selenium.prototype.orig_doClick = Selenium.prototype.doClick;

Selenium.prototype.doClick = function(locator, eventParams)
{
    LOG.info("Located in doScClick : " + locator);
    var element = this.page().findElement(locator);

    if (this.isSCLocator(locator)) {
        var autWindow = this.getAutWindow();

        var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element, true);
        // if the clicked element does not correspond to a SmartClient widget,
        // then perform the default SmartClient click operation
        if (canvas == null) {
            this.orig_doClick(locator, eventParams);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);

        var coords = this.getSCLocatorCoords(autWindow, locator);
        if (coords == null) return;

        // if needed, scroll the element into view and update coordinates      
        if (scrolledElementIntoView(element, coords, canvas, autWindow)) {
            coords = this.getSCLocatorCoords(autWindow, locator);
        }            

        var clientX = coords[0];
        var clientY = coords[1];
  
        // Ensure we explicitly indicate whether this is a second click within double-click delay
        // This makes SC logic fire double click on the second click, regardless of the
        // playback timing
        if (autWindow.isc.EH._isSecondClick == null) {
            autWindow.isc.EH._isSecondClick = false;
        }
      
        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);

        this.doFocus(locator);

        // fire a sequence of mousedown, mouseup and click operation to
        // trigger a SmartClient click event
        this.browserbot.triggerMouseEvent(element, "mouseover", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mousedown", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mouseup", true, clientX, clientY);
        this.browserbot.clickElement(element);

        autWindow.isc.EH._isSecondClick = null;
    } else {
        this.orig_doClick(locator, eventParams);
    }
};

// Special secondClick event - second half of a double-click
Selenium.prototype.doSecondClick = function (locator, eventParams) 
{
    if (!this.hasSC()) return this.doClick(locator, eventParams);
    
    var autWindow = this.getAutWindow();
    autWindow.isc.EH._isSecondClick = true;
    this.doClick(locator, eventParams);
    autWindow.isc.EH._isSecondClick = null;
}

// ensure playback of mouseDown / mouseUp on SmartClient locators behaves as expected.
Selenium.prototype.orig_doMouseDown = Selenium.prototype.doMouseDown;

Selenium.prototype.doMouseDown = function(locator, eventParams)
{
    LOG.info("Located in doScMouseDown : " + locator);
    var element = this.page().findElement(locator);
    if (this.isSCLocator(locator)) {
        var autWindow = this.getAutWindow();
      
        var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element);
        // if the clicked element does not correspond to a SmartClient widget,
        // then perform the default SmartClient click operation
        if (canvas == null) {
            this.orig_doMouseDown(locator, eventParams);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);

        var coords = this.getSCLocatorCoords(autWindow, locator);
        if (coords == null) return;
        var clientX = coords[0];
        var clientY = coords[1];
  
      
        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);

        // fire mouseover / mouseDown
        // This will set up for SmartClient click, doubleclick or drag event as appropriate
        this.browserbot.triggerMouseEvent(element, "mouseover", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mousedown", true, clientX, clientY);
    } else {
        this.orig_doMouseDown(locator, eventParams);
    }
};


Selenium.prototype.orig_doMouseUp = Selenium.prototype.doMouseUp;

Selenium.prototype.doMouseUp = function(locator, eventParams)
{
    LOG.info("Located in doScMouseUp : " + locator);
    var element = this.page().findElement(locator);
    if (this.isSCLocator(locator)) {
        var autWindow = this.getAutWindow();
      
        var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element);
        // if the clicked element does not correspond to a SmartClient widget,
        // then perform the default SmartClient click operation
        if (canvas == null) {
            this.orig_doMouseUp(locator, eventParams);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);

        var coords = this.getSCLocatorCoords(autWindow, locator);
        if (coords == null) return;
        
        var clientX = coords[0];
        var clientY = coords[1];
  
        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);

        // fire mouseUp and click to trigger a SmartClient click event
        // We should have already fired mouseDown
        this.browserbot.triggerMouseEvent(element, "mouseup", true, clientX, clientY);
        this.browserbot.clickElement(element);
        
    } else {
        this.orig_doMouseUp(locator, eventParams);
    }
};


Selenium.prototype.orig_doDoubleClick = Selenium.prototype.doDoubleClick;

Selenium.prototype.doDoubleClick = function(locator, eventParams)
{
    LOG.info("Locator in doDoubleClick : " + locator);
    var element = this.page().findElement(locator);
    
    if (this.hasSC()) {
        var autWindow = this.getAutWindow();
        var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element, true);
        // if the clicked element does not correspond to a SmartClient widget,
        // then perform the default SmartClient doubleclick operation
        if (canvas == null) {
            this.orig_doDoubleClick(locator, eventParams);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);
        var coords = this.getSCLocatorCoords(autWindow, locator);
        if (coords == null) return;

        // if needed, scroll the element into view and update coordinates
        if (scrolledElementIntoView(element, coords, canvas, autWindow)) {
            coords = this.getSCLocatorCoords(autWindow, locator);
        }            

        var clientX = coords[0];
        var clientY = coords[1];

        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);

        this.doFocus(locator);

        //fire a sequence of events to trigger a SmartClient doubleclick event
        this.browserbot.triggerMouseEvent(element, "mouseover", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mousedown", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mouseup", true, clientX, clientY);
        this.browserbot.clickElement(element);
        this.browserbot.triggerMouseEvent(element, "mousedown", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mouseup", true, clientX, clientY);
        this.browserbot.clickElement(element);

    } else {
        this.orig_doDoubleClick(locator, eventParams);
    }
};

Selenium.prototype.orig_doContextMenu = Selenium.prototype.doContextMenu;

Selenium.prototype.doContextMenu = function(locator, eventParams)
{
    LOG.info("Locator in doContextMenu : " + locator);
    var element = this.page().findElement(locator);
    if (this.hasSC()) {
        var autWindow = this.getAutWindow();
        var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element);
        if (canvas == null) {
            this.orig_doContextMenu(locator, eventParams);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);

        var coords = this.getSCLocatorCoords(autWindow, locator);
        var clientX = coords[0];
        var clientY = coords[1];

        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);
        // Add a mousemove event here to work around a bug where the event coordinates
        // don't reach the Event Handler, resulting in the event being applied to (0, 0).
        this.browserbot.triggerMouseEvent(element, "mousemove",   true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "contextmenu", true, clientX, clientY);
    } else {
        this.orig_doContextMenu(locator, eventParams);
    }
};

// getAutWidow() properly handles checking for the AutoTest module and loading missing APIs on
// Canvas/FormItem with ApplyAutoTestMethods(), so just check its returned window for hasSC() 
Selenium.prototype.hasSC = function() {return this.getAutWindow() != null;};

Selenium.prototype.isSCLocator = function(locator) {
    if (!this.hasSC()) return false;
    return locator && (locator.substring(0, "scLocator".length) == "scLocator" ||
                       locator.substring(0, "scID".length)      == "scID");
};

// append the query string to the URL; set sc_selenium to true
Selenium.prototype.appendScSeleniumQueryToURL = function (url) {
    var index, baseUrl = url, fragment = "";

    if ((index = url.indexOf("#")) >= 0) {
        fragment = url.substring(index);
        baseUrl = url.substring(0,index);
    }

    if ((index = baseUrl.indexOf("?")) >= 0) baseUrl += "&sc_selenium=true";
    else                                     baseUrl += "?sc_selenium=true";

    return baseUrl + fragment;
};

Selenium.prototype.orig_getTable = Selenium.prototype.getTable;

Selenium.prototype.getTable = function(tableCellAddress) {
/**
 * Gets the text from a cell of a table. The cellAddress syntax
 * tableLocator.row.column, where row and column start at 0.
 *
 * @param tableCellAddress a cell address, e.g. "foo.1.4"
 * @return string the text from the specified cell
 */

    if (this.hasSC()) {
        // This regular expression matches "tableName.row.column"
        // For example, "mytable.3.4"
        var pattern = /(.*)\.(\d+)\.(\d+)/;
        if (!pattern.test(tableCellAddress)) {
            throw new SeleniumError("Invalid target format. Correct format is " +
                                    "tableLocator.rowNum.columnNum");
        }

        var pieces = tableCellAddress.match(pattern),
            tableName = pieces[1],
            row = pieces[2],
            col = pieces[3];

        var autWindow = this.getAutWindow(),
            element = this.browserbot.findElement(tableName),
            listGrid = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element);

        if (listGrid != null) {
            //the locator can return a GridBody
            if (listGrid.grid) listGrid = listGrid.grid;

            if (autWindow.isc.isA.Function(listGrid.getCellValue)) {
                LOG.debug("Found ListGrid " + listGrid.getClassName());

                var record = listGrid.getRecord(Number(row));
                LOG.debug("Record for row " + row + " is " + record);
                return listGrid.getCellValue(record, row, col);
            }
        }
    }
    return this.orig_getTable(tableCellAddress);
};

Selenium.prototype.orig_doMouseOver = Selenium.prototype.doMouseOver;

Selenium.prototype.doMouseOver = function(locator, eventParams) {
    /**
   * Simulates a user hovering a mouse over the specified element.
   *
   * @param locator an <a href="#locators">element locator</a>
   */

    LOG.info("Locator in doMouseOver : " + locator);
    var element = this.page().findElement(locator);
    if (this.hasSC()) {
        var autWindow = this.getAutWindow();
        var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element);
        if (canvas == null) {
            this.orig_doMouseOver(locator);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);

        var coords = this.getSCLocatorCoords(autWindow, locator);
        var clientX = coords[0];
        var clientY = coords[1];

        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);
        this.browserbot.triggerMouseEvent(element, "mouseover", true, clientX, clientY);
    } else {
        this.orig_doMouseOver(locator);
    }

};


Selenium.prototype.orig_doMouseMove = Selenium.prototype.doMouseMove;

Selenium.prototype.doMouseMove = function(locator, eventParams) {
  /**
   * Simulates a user hovering a mouse over the specified element.
   *
   * @param locator an <a href="#locators">element locator</a>
   */

    LOG.info("Locator in doMouseMove : " + locator);
    var element = this.page().findElement(locator);
    if (this.hasSC()) {
        var autWindow = this.getAutWindow(),
            isc = autWindow.isc,
            canvas = isc.AutoTest.locateCanvasFromDOMElement(element);
        if (canvas == null) {
            this.orig_doMouseMove(locator);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);

        isc.EH._focusInCanvas(canvas); // ensure focus on Mouse Move target

        var coords = this.getSCLocatorCoords(autWindow, locator);
        var clientX = coords[0];
        var clientY = coords[1];

        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);
        isc.EH.immediateMouseMove = true;
        this.browserbot.triggerMouseEvent(element, "mousemove", true, clientX, clientY);
        isc.EH.immediateMouseMove = null;
    } else {
        this.orig_doMouseMove(locator);
    }

};

// Override drag and drop for SC components
Selenium.prototype.orig_doDragAndDrop = Selenium.prototype.doDragAndDrop;
Selenium.prototype.doDragAndDrop = function (locator, eventParams) {
    var element = this.page().findElement(locator);
    if (this.isSCLocator(locator)) {
        var autWindow = this.getAutWindow();
      
        var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element);
        // if the clicked element does not correspond to a SmartClient widget,
        // then perform the default SmartClient click operation
        if (canvas == null) {
            this.orig_doDragAndDrop(locator, eventParams);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);

        var coords = this.getSCLocatorCoords(autWindow, locator);
        if (coords == null) return;
        var clientX = coords[0];
        var clientY = coords[1];
  
      
        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);

        autWindow.isc.EH.immediateMouseMove = true;

        // fire mouseover / mouseDown / mousemove at original coordinates
        this.browserbot.triggerMouseEvent(element, "mouseover", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mousedown", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mousemove", true, clientX, clientY);
        // now trigger mousemove and mouseup at drop coordinates
        // eventParams should contain offset as string like "+100,-25"
        var delta = eventParams.split(",");
        clientX += parseInt(delta[0]);
        clientY += parseInt(delta[1]);
        
        this.browserbot.triggerMouseEvent(element, "mousemove", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mouseup", true, clientX, clientY);
        
        autWindow.isc.EH.immediateMouseMove = null;

    } else {
        this.orig_doDragAndDrop(locator, eventParams);
    }
};

Selenium.prototype.orig_doDragAndDropToObject = Selenium.prototype.dragAndDropToObject;
Selenium.prototype.doDragAndDropToObject = function (locator, targetLocator) {
    var element = this.page().findElement(locator);
    if (this.isSCLocator(locator)) {
        var autWindow = this.getAutWindow(),
            isc = autWindow.isc,
            canvas = isc.AutoTest.locateCanvasFromDOMElement(element);
        // if the clicked element does not correspond to a SmartClient widget,
        // then perform the default SmartClient click operation
        if (canvas == null) {
            this.orig_doDragAndDropToObject(locator, targetLocator);
            return;
        }
        LOG.debug("Located canvas " + canvas + " for locator " + locator);
        var coords = this.getSCLocatorCoords(autWindow, locator);
        if (coords == null) return;

        var clientX = coords[0];
        var clientY = coords[1];
  
        LOG.debug("clientX = " + clientX + ", clientY=" + clientY);

        isc.EH.immediateMouseMove = true;

        // fire mouseover / mouseDown / mousemove at original coordinates
        this.browserbot.triggerMouseEvent(element, "mouseover", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mousedown", true, clientX, clientY);
        this.browserbot.triggerMouseEvent(element, "mousemove", true, clientX, clientY);
        // now trigger mousemove and mouseup at drop coordinates
        
        var dropElement = this.page().findElement(targetLocator);
        var isSCTarget = targetLocator.indexOf("scLocator") != -1;
        if (isSCTarget) {
            var targetCoords = this.getSCLocatorCoords(autWindow, targetLocator);
            if (targetCoords != null) coords = targetCoords;

            var canvas = isc.AutoTest.locateCanvasFromDOMElement(dropElement);
            if (isc.isA.GridRenderer(canvas)) {
                if (canvas.getHandle() == dropElement) {
                    // if the locator is pointing at the GridRenderer proper, and not to a
                    // row and column, then try to drop against the bottom edge, since otherwise
                    // we'll unexpectedly drop on top of whatever row is at the center, which
                    // may depend on the skin, density, etc., currently loaded
                    if (!targetLocator.match(/[TBLR]$/)) {
                        targetLocator += targetLocator.endsWith("/") ? "B" : "/B";
                    }
                    var targetCoords = this.getSCLocatorCoords(autWindow, targetLocator);
                    if (targetCoords != null) coords = targetCoords;
                } else {
                    // if target is GridRenderer, bias drop coordinates downward within the
                    // DOM element to ensure deterministic behavior when dropping on row
                    coords[1] += dropElement.offsetHeight/8;
                }
            }

        } else {
            // In this case we've got a drag from a SmartClient component to
            // some arbitrary element on the page.
            var targetLeft = isc.Element.getLeftOffset(dropElement);
            var targetTop = isc.Element.getTopOffset(dropElement);
            coords = [targetLeft,targetTop];
        }

        this.browserbot.triggerMouseEvent(dropElement, "mouseover", true, coords[0], coords[1]);
        this.browserbot.triggerMouseEvent(dropElement, "mousemove", true, coords[0], coords[1]);
        this.browserbot.triggerMouseEvent(dropElement, "mouseup", true, coords[0], coords[1]);
        
        isc.EH.immediateMouseMove = null;

    } else {
        this.orig_doDragAndDropToObject(locator, targetLocator);
    }
    
};

Selenium.prototype.getSCLocatorCoords = function (autWindow, scLocator) {
    if (scLocator.indexOf("scLocator=") != -1) {
        scLocator = scLocator.substring("scLocator=".length);
        var coords = autWindow.isc.AutoTest.getPageCoords(scLocator);
        LOG.debug("Determining page coordinates for SC Locator:" + scLocator + ": " + coords);
        return coords;
    } else if (scLocator.indexOf("scID=") != -1) {
        var ID = scLocator.substring("scID=".length);
        var canvas = autWindow[ID];
        if (canvas != null && autWindow.isc.isA.Canvas(canvas) &&
            canvas.isDrawn() && canvas.isVisible()) 
        {
            var left = canvas.getPageLeft() + parseInt(canvas.getVisibleWidth()/2),
                top = canvas.getPageTop() + parseInt(canvas.getVisibleHeight()/2);
            LOG.debug("Determining page coordinates for SC canvas:" + ID + ": " + [left,top]);
            return [left,top];
        }
    }
    LOG.debug("Unable to determine page coordinates for SC Locator:" + scLocator);
    return null;
};

function reportAssertFailure (event) {
    LOG.error("A SmartClient Framework assertion has failed - see the developer logs " +
              "for details" + (event.detail ? ": " + event.detail : "."));
    if         (isSeleniumIDE()) currentTest.commandError();
    else if (hasHtmlTestSuite()) htmlTestRunner.markFailed();
};

// firefox specific - fail the test if an assertion fails
function setupFrameworkAssertionHandler () {
    var autWindow = selenium.browserbot.getAutWindow(),
        autDocument = autWindow && autWindow.document;
    if (!autDocument) return;

    // only applies to Firefox
    var isc = autWindow.isc;
    if (!isc.Browser.isFirefox) return;

    // configure Selenium to be notified when assert fails
    if (isc.Class.registerSeleniumForAssertFailures) {
        isc.Class.registerSeleniumForAssertFailures();
    }
    // register the custom assert reporter with the Framework event
    autDocument.addEventListener("IscSeleniumAssertFailedEvent", 
                                 reportAssertFailure, false, true);
}

Selenium.prototype.isElementClickable = function (locator) {
    LOG.info("Located in isScElementClickable : " + locator);

    var isElementPresent = this.isElementPresent(locator);

    // if not present at all, report null
    if (!isElementPresent) return null;

    // not a SmartClient Locator, report null
    if (!this.isSCLocator(locator)) return null;

    // otherwise, run SmartClient verifications
    var element = this.page().findElement(locator),
        isc = this.getAutWindow().isc,
        autotest = isc.AutoTest;

    // start automatic server log capture if server log mode is "all"
    if (this._serverLogMode == "all") this.doCaptureServerLogs();

    // run a one-time initialization for internal test samples
    if (!this._exampleInited && this._exampleOpened) {
        this._exampleInited = true;
        // engage implicit network wait
        this.doSetImplicitNetworkWait();
        // install assert failure handler
        setupFrameworkAssertionHandler();
    }

    return autotest.seleniumExecute("isElementClickable", element, locator);
};

Selenium.prototype.isElementReadyForKeyPresses = function (locator) {
    LOG.info("Located in isScElementReadyForKeyPresses : " + locator);

    var isElementPresent = this.isElementPresent(locator);

    // if not present at all, report null
    if (!isElementPresent) return null;

    // not a SmartClient Locator, report null
    if (!this.isSCLocator(locator)) return null;

    // otherwise, run SmartClient verifications
    var element = this.page().findElement(locator);
        isc = this.getAutWindow().isc,
        autotest = isc.AutoTest;
        
    return autotest.seleniumExecute("isElementReadyForKeyPresses", element, locator);
};

Selenium.prototype.doSetImplicitNetworkWait = function (waitArg) {
    var autWindow = this.getAutWindow();
    waitArg = waitArg != null ? waitArg.toLowerCase().replace(/^\s+|\s+$/g, "") : "";
    autWindow.isc.AutoTest.implicitNetworkWait = waitArg == "" || waitArg == "true";
};

Selenium.prototype.isGridDone = function (locator, allowEdits) {

    LOG.info("Located in isScGridDone : " + locator);

    // not a SmartClient Locator, report null
    if (!this.isSCLocator(locator)) return null;

    // otherwise, run SmartClient verifications
    var element = this.page().findElement(locator),
        autotest = this.getAutWindow().isc.AutoTest;

    // tranform allowEdits into a boolean from Selenium string
    allowEdits = allowEdits == "true" || allowEdits == "yes";

    return autotest.seleniumExecute("isGridDone", element, locator, allowEdits);
};

// install standard wrapper to call the AutoTest API for most Selenium isXXXDone() methods
["isCanvasDone", "isTileLayoutDone", "isTileGridDone", "isFormDone", "isItemDone"].
    map(function (methodName) {
        var scMethodName = methodName.replace(/is(.*)/, "isSc$1");
        Selenium.prototype[methodName] = function (locator) {
            LOG.info("Located in " + scMethodName + ": " + locator);

            // not a SmartClient Locator, report null
            if (!this.isSCLocator(locator)) return null;

            // otherwise, run SmartClient verifications
            var  element = this.page().findElement(locator),
                autotest = this.getAutWindow().isc.AutoTest;

            return autotest.seleniumExecute(methodName, element, locator);
        }
    });

// Wait for a SmartClient Hover to show with specified text
Selenium.prototype.isHoverTextPresent = function (textString) {
    LOG.info("Checking for Hover Text Present :" + textString);
    var hoverCanvas = this.getAutWindow().isc.Hover.hoverCanvas
    if (hoverCanvas != null) {
        if (hoverCanvas.isDrawn() && hoverCanvas.isVisible() && textString != null) {
            // use search so we can support regex patterns
            return (hoverCanvas.contents.search(new RegExp(textString)) != -1);
        }
    }
    return false;
};

Selenium.prototype.isSystemDone = function () {
    LOG.info("Located in isScSystemDone");
    var autotest = this.getAutWindow().isc.AutoTest;
    return autotest.seleniumExecute("isSystemDone");
};

Selenium.prototype.doScrollAndHoldExample = function (position, percent) {
    
    LOG.info("Located in doScScrollAndHoldExample : " + position);

    // can scroll and hold at top, bottom, or release scrolling hold
    if (position != "top" && position != "bottom" && 
        position != "right" && position != "left" && position != "release") 
    {
        LOG.warn("Invalid position " + position);
        return;
    }
    // otherwise, run SmartClient verifications
    var autWindow = this.getAutWindow(),
        testRoot = autWindow.isc.AutoTest.testRoot;

    // no valid test root defined, report null;
    if (testRoot == null) {
        LOG.warn("No AutoTest.testRoot defined");
        return;
    }

    var container = autWindow.isc.AutoTest.getTestRootScrollCanvas(),
        scrollState = Selenium.prototype.testRootScrollState;

    if (percent != null) percent = parseInt(percent);
    if (isNaN(percent))  percent = 0;

    delete container.scrolled;

    switch (position) {
    case "top":    scrollState.y =       percent || 0; break;
    case "bottom": scrollState.y = 100 - percent || 0; break;
    case "left":   scrollState.x =       percent || 0; break;
    case "right":  scrollState.x = 100 - percent || 0; break;
    case "releasee":
        delete scrollState.x;
        delete scrollState.y;
        return;
    }

    container.scroller = function () { this.scrollToPercent(scrollState.x, scrollState.y); };
    container.scroller();
};

Selenium.prototype.doReleaseExampleScrollHold = function () {
    this.doScrollAndHoldExample("release");
};

// provide a way to convert DataBoundComponents to client-only operation
Selenium.prototype.doSetForClientOnlyOperation = function (locator) {
   if (!this.hasSC()) return;

    var isc = this.getAutWindow().isc,
        dbc = isc.AutoTest.getObject(locator);
    if (!isc.isA.DataBoundComponent(dbc)) return;

    var dataSource = isc.DataSource.get(dbc.dataSource);
    if (dataSource && !dataSource.clientOnly) {
        dataSource.autoCacheAllData = true;
        dataSource.invalidateCache();
        dataSource.fetchData();
    }
};
Selenium.prototype.isClientOnlyReady = function (locator) {
   if (!this.hasSC()) return true;

    var isc = this.getAutWindow().isc,
        dbc = isc.AutoTest.getObject(locator);
    if (!isc.isA.DataBoundComponent(dbc)) return true;

    var dataSource = isc.DataSource.get(dbc.dataSource);
    if (dataSource && !dataSource.clientOnly) {
        if (!dataSource.hasAllData()) return false;
        dataSource.setClientOnly(true);
    }
    return true;
};

Selenium.prototype.willUrlRequestHitServer = function (url) {
    if (url != "") url = absolutify(url, this.browserbot.baseUrl);
    var location = this.browserbot.getUserWindow().location.href;
    // browser loads new page unless requested url has fragment identifier and
    // differs from the current browser address only by that fragment identifier
    return url.indexOf("#") < 0 || url.split("#")[0] != location.split("#")[0];
}
    
Selenium.prototype.orig_doOpen = Selenium.prototype.doOpen;

Selenium.prototype.doOpen = function(url, ignoreResponseCode) {
    if (this.mustAddKeysToStoredVars) addKeysToStoredVars();
    this._serverLogMode = seleniumGetURLParameter("serverLogMode");
    if (this.use_url_query_sc_selenium) url = this.appendScSeleniumQueryToURL(url);
    var openResult = this.orig_doOpen(url, ignoreResponseCode);
    if (this.willUrlRequestHitServer(url)) return openResult;
};

Selenium.prototype.orig_doOpenWindow = Selenium.prototype.doOpenWindow;

Selenium.prototype.doOpenWindow = function(url, windowID) {
    if (this.use_url_query_sc_selenium) url = this.appendScSeleniumQueryToURL(url);
    return this.orig_doOpenWindow(url, windowID);
};

Selenium.prototype.doExampleOpen = function(showcase, mappedId) {
    this._exampleOpened = true;
    delete this._exampleInited;

    // pull these settings from the URL parameters preferentially
    showcase = seleniumGetURLParameter("showcase") || showcase;
    mappedId = seleniumGetURLParameter("mappedId") || mappedId;

    var url = showcase == "smartgwt" ?  "index.html" : "SmartClient_Explorer.html";
    return this.doOpen(url + "#" + mappedId);
};

Selenium.prototype.orig_getText = Selenium.prototype.getText;

Selenium.prototype.getText = function (locator) {

    LOG.info("Located in getSCText : " + locator); 

    var text = this.orig_getText(locator);
    if (text || !this.isSCLocator(locator)) return text;

    // fall back to original (display) value
    try {
        text = this.orig_getValue(locator);
    } catch (e) {
        LOG.info("No fallback value available: " + e);
    }
    return text || "";
};

Selenium.prototype.orig_getValue = Selenium.prototype.getValue;

Selenium.prototype.getValue = function (locator) {

    LOG.info("Located in getSCValue : " + locator); 

    if (!this.isSCLocator(locator)) return this.orig_getValue(locator);

    // use SmartClient custom locator strategies at this point
    return this.browserbot.locateValueByScLocatorOrScID(locator);
};

Selenium.prototype.isValueEmpty = function (locator) {
    LOG.info("Located in isSCValueEmpty : " + locator);
    return this.getValue(locator) == null;
}

Selenium.prototype.doVerifyCanvasWidth = function (locator, requiredWidth) {
    LOG.info("Located in doScVerifyCanvasWidth : " + locator);

    var success; // a Selenium command succeeds by returning no value

    if (this.hasSC()) {
        var isc = this.getAutWindow().isc,
            canvas = isc.AutoTest.getObject(locator);
        if (isc.isA.Canvas(canvas)) {
            var actualWidth = canvas.getVisibleWidth(),
                tolerance = parseInt(storedVars["canvasWidthTolerance"] ||
                                     storedVars["valueTolerance"] || "10");
            if (Math.abs(actualWidth - requiredWidth) <= tolerance) {
                return success;
            }
        }
    }
    // return a function that throws an exception for failure - message will be logged;
    // directly throwing an exception would stop the script (i.e. verifyXXX vs. assertXXX)
    return function () {
        throw new SeleniumError("Required width " + requiredWidth + 
            " didn't match actual width " + actualWidth + " within tolerance " + tolerance);
    };
}
Selenium.prototype.doVerifyCanvasHeight = function (locator, requiredHeight) {
    LOG.info("Located in doScVerifyCanvasHeight : " + locator);

    var success; // a Selenium command succeeds by returning no value

    if (this.hasSC()) {
        var isc = this.getAutWindow().isc,
            canvas = isc.AutoTest.getObject(locator);
        if (isc.isA.Canvas(canvas)) {
            var actualHeight = canvas.getVisibleHeight(),
                tolerance = parseInt(storedVars["canvasHeightTolerance"] ||
                                     storedVars["valueTolerance"] || "10");
            if (Math.abs(actualHeight - requiredHeight) <= tolerance) {
                return success;
            }
        }
    }
    // return a function that throws an exception for failure - message will be logged;
    // directly throwing an exception would stop the script (i.e. verifyXXX vs. assertXXX)
    return function () {
        throw new SeleniumError("Required height " + requiredHeight +
            " didn't match actual height " + actualHeight + " within tolerance " + tolerance);
    };
}

Selenium.prototype.doVerifyElementWidthWithTolerance = function (locator, desiredWidth) {
    LOG.info("Located in doScVerifyElementWidthWithTolerance : " + locator);

    var success; // a Selenium command succeeds by returning no value

    var actualWidth = this.getElementWidth(locator),
        tolerance = parseInt(storedVars["elementTolerance"] || "10");
    if (Math.abs(actualWidth - desiredWidth) <= tolerance) {
        return success;
    }
    // return a function that throws an exception for failure - message will be logged;
    // directly throwing an exception would stop the script (i.e. verifyXXX vs. assertXXX)
    return function () {
        throw new SeleniumError("Desired width " + desiredWidth + 
            " didn't match actual width " + actualWidth + " within tolerance " + tolerance);
    };
}
Selenium.prototype.doVerifyElementHeightWithTolerance = function (locator, desiredHeight) {
    LOG.info("Located in doScVerifyElementHeightWithTolerance : " + locator);

    var success; // a Selenium command succeeds by returning no value

    var actualHeight = this.getElementHeight(locator),
        tolerance = parseInt(storedVars["elementTolerance"] || "10");
    if (Math.abs(actualHeight - desiredHeight) <= tolerance) {
        return success;
    }
    // return a function that throws an exception for failure - message will be logged;
    // directly throwing an exception would stop the script (i.e. verifyXXX vs. assertXXX)
    return function () {
        throw new SeleniumError("Desired width " + desiredHeight + 
            " didn't match actual width " + actualHeight + " within tolerance " + tolerance);
    };
}

// provide a mechanism to verify locator values subject to a configurable tolerance
Selenium.prototype.doVerifyValueWithTolerance = function (locator, desiredValue) {
    LOG.info("Located in doScVerifyValueWithTolerance : " + locator);

    if (!this.hasSC() || typeof desiredValue != "string") {
        return function () {
            throw new SeleniumError("doScVerifyValueWithTolerance only works on Smartclient " +
                                    "pages and expects the desiredValue to be a String");
        };
    }

    var success, // a Selenium command succeeds by returning no value
        isc = this.getAutWindow().isc,
        actualValue = this.getValue(locator),
        parseFloat = function (value) {return isc.NumberUtil.parseFloat(value);},
        tolerance = parseFloat(storedVars["valueTolerance"] || "10")
    ;

    // convert the desiredValue into an array of numbers
    desiredValue = desiredValue.split(/\s+/).map(parseFloat);

    // return a function that throws an exception for failure - message will be logged;
    // directly throwing an exception would stop the script (i.e. verifyXXX vs. assertXXX)
    var failure = function () {
        throw new SeleniumError("Actual value '" + actualValue + "' didn't match " +
            "desired value '" + desiredValue + "' within tolerance " + tolerance);
    }

    if (isc.isA.Number(actualValue)) {
        actualValue = [actualValue];
    } else if (isc.isA.String(actualValue)) {
        actualValue = actualValue.split(/\s+/).map(parseFloat);
    } else if (!isc.isAn.Array(actualValue)) {
        return failure;
    }

    // we must have two arrays of the same length to succeed
    if (desiredValue.length != actualValue.length) return failure;

    // verify that each array position is within the desired tolerance
    for (var i = 0; i < actualValue.length; i++) {
        if (Math.abs(desiredValue[i] - actualValue[i]) > tolerance) {
            return failure;
        }
    }

    return success;
}

// Ideally, we'd define this as isSelected(), but Selenium defines an internal function named
// assertSelected() which would collide with that method's automatically generated commands.
Selenium.prototype.isElementSelected = function (locator) {
    LOG.info("Located in isScSelected : " + locator);

    // not a SmartClient Locator, report null
    if (!this.isSCLocator(locator)) return null;

    // otherwise, check selection via SC Framework
    var autotest = this.getAutWindow().isc.AutoTest;
    return autotest.seleniumExecute("isSelected", locator);
}

Selenium.prototype.orig_doFocus = Selenium.prototype.doFocus;

Selenium.prototype.doFocus = function (locator, clearModifiers) {
    // many event handlers fail without browsr focus
    var opener = window.opener;
    if (opener != null) opener.focus();

    var isc, canvas, masked;
    if (this.hasSC()) {
        isc    = this.getAutWindow().isc;
        canvas = isc.AutoTest.getObject(locator);
        masked = isc.isA.Canvas(canvas) && canvas.isMasked();
    }

    // skip running focus logic if target is masked, since that may trigger unexpected
    // logic such as the premature exiting of the modal editing of a row in a ListGrid
    if (!masked) {
        // run the built-in Selenium doFocus()
        if (locator) this.orig_doFocus(locator);

        // For a SmartClient Canvas, the default element called by doFocus() may
        // not be correct, so explicitly call focus on the right element.
        if (isc && isc.isA.Canvas(canvas)) {
            var focusElement = canvas.getFocusHandle();
            if (focusElement && focusElement.onfocus) {
                focusElement.focus();
            }
        }
    }

    // In some cases, modifiers get stuck down; clear them if requested
    if (locator) {
        // tranform clearModifiers into a boolean from Selenium string
        clearModifiers = clearModifiers == "true" || clearModifiers == "yes";
        if (clearModifiers) this.orig_doSendKeys(locator, this.modifierClearSequence);
    }
};

Selenium.prototype.doBlur = function (locator) {
    // allow attempt to trigger blur event on a missing element
    try { this.doFireEvent(locator, "blur"); } catch (x) {}
}

Selenium.prototype.orig_doKeyPress = Selenium.prototype.doKeyPress;

Selenium.prototype.doKeyPress = function (locator, keySequence) {
    LOG.info("Located in doScKeyPress : " + locator);
    this.doFocus();
    this.orig_doKeyPress(locator, keySequence);
    // allow attempt to trigger input event on a missing element
    try { this.doFireEvent(locator, "input"); } catch (x) {}
};

if (!hasSendKeys()) {
    // Copyright [2014] [Isomorphic Corporation]
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    
    // The code below this point within the current if statement is adapted from the 
    // Apache Selenium IDE JavaScript source in order to ensure the doSendKeys() API is
    // available when a Selenium HTML script is run by Selenium Server.  That API is by
    // default only available when a script is being run in the Selenium IDE environment.
    var unicodeToKeys = {};

    function add_sendkeys_key(key, unicodeChar, alias, botKey) {
        botKey = botKey || key;
        if (bot.Keyboard.Keys[botKey]) {
            storedVars['KEY_' + key] = unicodeChar;
            if (alias) {
                storedVars['KEY_' + alias] = unicodeChar;
            }
            unicodeToKeys[unicodeChar] = bot.Keyboard.Keys[botKey];
            return true;
        }
        return false;
    }
    function addKeysToStoredVars() {
        add_sendkeys_key("BACKSPACE", '\uE003', "BKSP");
        add_sendkeys_key("TAB",       '\uE004');
        add_sendkeys_key("ENTER",     '\uE007');
        add_sendkeys_key("SHIFT",     '\uE008');
        add_sendkeys_key("CONTROL",   '\uE009', "CTRL");
        add_sendkeys_key("ALT",       '\uE00A');
        add_sendkeys_key("PAUSE",     '\uE00B');
        add_sendkeys_key("ESC",       '\uE00C', "ESCAPE");
        add_sendkeys_key("SPACE",     '\uE00D');
        add_sendkeys_key("PAGE_UP",   '\uE00E', "PGUP");
        add_sendkeys_key("PAGE_DOWN", '\uE00F', "PGDN");
        add_sendkeys_key("END",       '\uE010');
        add_sendkeys_key("HOME",      '\uE011');
        add_sendkeys_key("LEFT",      '\uE012');
        add_sendkeys_key("UP",        '\uE013');
        add_sendkeys_key("RIGHT",     '\uE014');
        add_sendkeys_key("DOWN",      '\uE015');
        add_sendkeys_key("INSERT",    '\uE016', "INS");
        add_sendkeys_key("DELETE",    '\uE017', "DEL");
        add_sendkeys_key("SEMICOLON", '\uE018');
        add_sendkeys_key("EQUALS",    '\uE019');
        add_sendkeys_key("META",      '\uE03D', "COMMAND");
    };
    Selenium.prototype.mustAddKeysToStoredVars = true;

    Selenium.prototype.doSendKeys = function(locator, value) {
        /** *Experimental* Simulates keystroke events on the specified element, as though you
         * typed the value key-by-key.
         * <p>
         * This simulates a real user typing every character in the specified string; it is
         * also bound by the limitations of a real user, like not being able to type into a
         * invisible or read only elements. This is useful for dynamic UI widgets (like
         * auto-completing combo boxes) that require explicit key events.</p> 
         * <p>
         * Unlike the simple "type" command, which forces the specified value into the page
         * directly, this command will not replace the existing content. If you want to replace
         * the existing contents, you need to use the simple "type" command to set the value of
         * the field to empty string to clear the field and then the "sendKeys" command to send
         * the keystroke for what you want to type.</p>
         * <p>
         * This command is experimental. It may replace the typeKeys command in the future.</p>
         * <p>
         * For those who are interested in the details, unlike the typeKeys command, which tries
         * to fire the keyDown, the keyUp and the keyPress events, this command is backed by the
         * atoms from Selenium 2 and provides a much more robust implementation that will be 
         * maintained in the future.</p>
         *
         * @param locator an <a href="#locators">element locator</a> 
         * @param value the value to type 
         */
        if (this.browserbot.controlKeyDown || this.browserbot.altKeyDown || 
            this.browserbot.metaKeyDown) 
        {
            throw new SeleniumError("type not supported immediately after call to " + 
                                    "controlKeyDown() or altKeyDown() or metaKeyDown()");
        }

        var element = this.browserbot.findElement(locator);

        if (value.match(/[\uE000-\uF8FF]/)) {
            //we have special keys, process separately
            var keysRa = value.split(/([\0-\uDFFF]+)|([\uE000-\uF8FF])/).filter(function (key) {
                return (key && key.length > 0);
            }).map(function (key) {
                if (key.match(/[\uE000-\uF8FF]/) && unicodeToKeys.hasOwnProperty(key)) {
                    return unicodeToKeys[key];
                }
                return key;
            });

            bot.action.type(element, keysRa);
        } else {
            bot.action.type(element, value);
        }
    };
}

Selenium.prototype.orig_doSendKeys = Selenium.prototype.doSendKeys;

Selenium.prototype.doSendKeys = function (locator, keySequence) {
    LOG.info("Located in doScSendKeys : " + locator);
    this.doFocus();
    this.orig_doSendKeys(locator, keySequence);
    // allow attempt to trigger input event on a missing element
    try { this.doFireEvent(locator, "input"); } catch (x) {}
};

// we can't use ${KEY_XXX} syntax here since internal strings aren't resolved
Selenium.prototype.modifierClearSequence = "\uE008\uE009\uE009\uE008";

// communicate with AUT web page using events to avoid security limitation
Selenium.prototype.triggerAutWindowEvent = function (id, arguments) {
    var autDocument = this.browserbot.getAutWindow().document;
    var requestElement = autDocument.createElement("IscSelenium" + id + "Element");
    if (arguments != null) requestElement.setAttribute("arguments", arguments);
    autDocument.documentElement.appendChild(requestElement);

    var autWindowEvent = autDocument.createEvent("Events");
    autWindowEvent.initEvent("IscSelenium" + id + "Event", true, false);
    requestElement.dispatchEvent(autWindowEvent);
};

// initiate capture of server logs by clearing them and marking for retrieval
Selenium.prototype.doCaptureServerLogs = function () {
    if (this._captureServerLogs) return;

    if (this._serverLogMode == null) {
        LOG.warn("Ignoring captureServerLogs() command since TestRunner " +
                 "has not asked to receive any server logs");
        return;
    }
    if (!this.browserbot.getAutWindow().isc.Browser.isFirefox) {
        LOG.warn("Ignoring captureServerLogs() command as it's only supported on Firefox");
        return;
    }
    this._captureServerLogs = true;

    this.triggerAutWindowEvent("ClearServerLogs");

    LOG.debug("Requested server logs be cleared in preparation for capture");
};

Selenium.prototype.doSetClientLogLevel = function (category, level) {
    var isc = this.getAutWindow().isc;
    isc.Log.setPriority(category, isc.Log[level]);
}

Selenium.prototype.doSetServerLogLevel = function (category, level) {
    var isc = this.getAutWindow().isc;
    this.triggerAutWindowEvent("ConfigureServerLogs", [category, level]);
}

// Customizations for HTMLLauncher environment
//
// The following code is needed only when running Selenium HTML scripts via Selenium Server,
// but not when running in the Selenium IDE enivronment - so check if HtmlTestSuite is defined.

if (hasHtmlTestSuite() && !isSeleniumIDE()) {

    // Override HtmlTestSuite to collect and return the ISC Developer Console
    // messages along with the test results.

    HtmlTestSuite.prototype.orig_onTestSuiteComplete = 
        HtmlTestSuite.prototype._onTestSuiteComplete;

    HtmlTestSuite.prototype._onTestSuiteComplete = function () {
        if (this._testSuiteComplete) return;
        else this._testSuiteComplete = true;

        if (seleniumGetURLParameter("addMessages") == "true") {
            var messages = selenium.browserbot.getAutWindow().isc.Log.getMessages();
            LOG.pendingMessages.push({type: "ISC_DEVELOPER_MESSAGES", 
                                      msg: messages.join('\n')});
        }

        // if no server logs have been requested, we're done with test sutie
        if (!selenium._captureServerLogs) return this.orig_onTestSuiteComplete();

        var htmlSuite = this,
            autDocument = selenium.browserbot.getAutWindow().document;
        autDocument.addEventListener("IscSeleniumServerLogsCapturedEvent", function (event) {
            LOG.debug("Captured all server logs generated for this Selenium script");
            LOG.pendingMessages.push({type: "ISC_SERVER_LOG_MESSAGES",
                                      msg: event.target.getAttribute("logMessages")});
            htmlSuite.orig_onTestSuiteComplete();
        }, false, true);

        selenium.triggerAutWindowEvent("RequestServerLogs");

        LOG.debug("Requested all server logs generated for this Selenium script");
    };

    // ensure that the logs are reported back to Selenium in the event of a hang    
    var scriptTimeout = seleniumGetURLParameter("timeout");
    if (scriptTimeout) setTimeout(function() {
        var htmlTestSuite = htmlTestRunner.getTestSuite();
        if (htmlTestSuite != null) {
            LOG.pendingMessages.unshift({type: "SELENIUM_PAGE_TIMEOUT",
                msg: "Script failed due to timeout after " + scriptTimeout + " seconds:"});
            htmlTestSuite._onTestSuiteComplete();
        }
    }, scriptTimeout * 1000);

    // override HtmlTestRunner class so that the test is run in a maximized browser
    // if requested from the TestRunner Java Framework.  This may enhance the usefulness
    // of the capture screenshot capability.

    HtmlTestRunner.prototype.orig_startTestSuite = 
        HtmlTestRunner.prototype.startTestSuite;

    HtmlTestRunner.prototype.startTestSuite = function () {
        if (seleniumGetURLParameter("maximize") == "true") {
            // the AUT (Application under Test) window contains the SmartClient code
            var autWindow = selenium.browserbot.getUserWindow();
            if (autWindow != null) {
                autWindow.moveTo(0,0);
                autWindow.resizeTo(screen.width, screen.height);
            }
        }
        this.orig_startTestSuite();
    };
}
