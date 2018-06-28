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

function findScLocator(element, autWindow) {
    // The element Selenium passes is a "safe" XPCNativeWrappers wrapper of the real
    // element. XPCNativeWrappers are used to protect the chrome code working with content
    // objects and there's no way to access the real "underlying" element object.  Example of
    // an element passed here is [object XPCNativeWrapper [object HTMLInputElement]].

    // see https://developer.mozilla.org/en/wrappedJSObject
    // https://developer.mozilla.org/en/XPCNativeWrapper
    if (autWindow == null) autWindow = this.window;
    if (autWindow.wrappedJSObject) {
        autWindow = autWindow.wrappedJSObject;
    }

    if(hasSC(autWindow)) {
        var e;
        try {
            e = convertToLiveElement(element, autWindow);
            
            // Second parameter tells the autoTest subsystem *not* to return
            // a locator if the element relies on native event handling and we
            // dont' have a direct locator to pick it up. EG: Don't returns 
            // the locator for a canvas handle when a click occurred on a link embedded
            // in a canvas.
            var scLocator = autWindow.isc.AutoTest.getLocator(e, true);
            
            if(scLocator != null && scLocator != "") {
                return "scLocator=" + scLocator;
            } else {
                return null;
            }
        } catch(ex) {
            alert('caught error ' + ex + ' for element ' + e + ' with id' + e.id);
            return null;
        }
    } else {
        return null;
    }
}


function convertToLiveElement(element, autWindow) {
    var id = element.id,
        nullID;
    if (id == null || id === undefined || id == '') {
        //assign an id to the element if one does not exist so that it can be located by SC
        id = "sel_" + autWindow.isc.ClassFactory.getNextGlobalID();
        element.id = id;
        nullID = true;
    }

    // The sc classes are loaded in wrappedJSObject window, and not the window reference held
    // by Locators.  See https://developer.mozilla.org/en/wrappedJSObject
    var e = autWindow.document.getElementById(id);
    
    // reset ID to null - this way if we *don't* get a SmartClient locator
    // normal page locator strategy will work
    if (nullID) {
        // For FF20+, assigning ID to null is broken, so use empty string
        element.id = '';
    }
    return e;
}

LocatorBuilders.add('sc', findScLocator);
// add SC Locator to the head of the priority of builders.
LocatorBuilders.order = ['sc', 'id', 'link', 'name', 'dom:name', 'xpath:link', 'xpath:img', 
                         'xpath:attributes', 'xpath:href', 'dom:index', 'xpath:position'];

// override the default clickLocator so that duplicate click events are not recorded
Recorder.removeEventHandler('clickLocator');
Recorder.addEventHandler('clickLocator', 'click', function(event) {
        if (event.button == 0) {

        // === start sc specific code ===
        var autWindow = this.window;
        if (autWindow.wrappedJSObject) {
            autWindow = autWindow.wrappedJSObject;
        }
        if(hasSC(autWindow)) {
            var element = this.clickedElement,
                scLocator = findScLocator(element, autWindow);
        
            // If an scLocator is found, then this event will be captured by the scClickLocator
            // mousedown event recorder 'return' so that we don't get duplicate records.
            if(scLocator != null) {
                return;
            }
        }
        // === end sc specific code ===
            
        var clickable = this.findClickableElement(event.target);
        if (clickable) {
            // prepend any required mouseovers. These are defined as
            // handlers that set the "mouseoverLocator" attribute of the
            // interacted element to the locator that is to be used for the
            // mouseover command. For example:
            //
            // Recorder.addEventHandler('mouseoverLocator', 'mouseover', function(event) {
            //     var target = event.target;
            //     if (target.id == 'mmlink0') {
            //         this.mouseoverLocator = 'img' + target._itemRef;
            //     }
            //     else if (target.id.match(/^mmlink\d+$/)) {
            //         this.mouseoverLocator = 'lnk' + target._itemRef;
            //     }
            // }, { alwaysRecord: true, capture: true });
            //
            if (this.mouseoverLocator) {
                this.record('mouseOver', this.mouseoverLocator, '');
                delete this.mouseoverLocator;
            }
            this.record("click", this.findLocators(event.target), '');
        } else {
            var target = event.target;
            this.callIfMeaningfulEvent(function() {
                    this.record("click", this.findLocators(target), '');
                });
        }
    }
	}, { capture: true });


Recorder.addEventHandler('scMouseDownLocator', 'mousedown', function(event) {
    if (event.button == 0) {
        var autWindow = this.window;
        if (autWindow.wrappedJSObject) {
            autWindow = autWindow.wrappedJSObject;
        }
        if(hasSC(autWindow)) {
            var element = this.clickedElement;
            var canvas = autWindow.isc.AutoTest.locateCanvasFromDOMElement(element);
            var scLocator = findScLocator(element, autWindow);
            setSCContextValue(autWindow, "mouseDownTarget", canvas);
            setSCContextValue(autWindow, "mouseDownLocator", scLocator);
            setSCContextValue(autWindow, "mouseDownCoords", 
                              [autWindow.isc.EH.getX(), autWindow.isc.EH.getY()]);
            setSCContextValue(autWindow, "mouseDownLocatorCoords", 
                              autWindow.isc.AutoTest.getPageCoords(scLocator));
        }
    }
}, { capture: true });

Recorder.addEventHandler('scMouseUpLocator', 'mouseup', function(event) {
    if (event.button == 0) {
        var autWindow = this.window;
        if (autWindow.wrappedJSObject) {
            autWindow = autWindow.wrappedJSObject;
        }
        if(hasSC(autWindow)) {
            var isc = autWindow.isc,
                element = event.target;
            
            // If the element clicked is a form text input based field or textArea, record
            // a delayed click so as to avoid out of order replays with "type" command.
            var delayed = isTextBasedElement(element);

            var scLocator = findScLocator(element, autWindow);
            var mouseDownLocator = getSCContextValue(autWindow, "mouseDownLocator");
                
            // if mouseDown occurred over an sc-significant element, but mouseup didn't,
            // we may still need to fire drag stop handlers.
            if (scLocator == null && mouseDownLocator == null) return;

            var EH = isc.EH;

            // Are we finishing a drag operation?
            if (mouseDownLocator && EH.dragging) {
                // 2 possibilities: 
                // dragAndDropToObject - records a source and target object and at playback
                // coords will be determined from those elements
                // dragAndDrop - records a source and a px offset - at playback time we'll
                // move by that number of pixels.
                
                // special case, reordering header buttons
                if (scLocator == mouseDownLocator && isHeaderButton(isc, EH.dragTarget)) {
                    var grid = EH.dragTarget.grid,
                        dropTarget = grid.getFieldHeaderButton(grid.header.dragCurrentPosition);
                    if (dropTarget) {
                        scLocator = findScLocator(dropTarget.getHandle(), autWindow);
                    }
                }

                // If the current target matches the mouse-down target, or we have no SC element
                // at the current location, treat as absolute coordinates
                var dragToObject = (scLocator != null && scLocator != mouseDownLocator);

                // If the current target != the mouse down target and both are valid SC elements
                // its still worth discounting cases where we obviously aren't attempting to do
                // a drag and drop over the target object.
                // This is important to catch as in these cases absolute pixel offsets are likely
                // more appropriate than the center of whatever element we ended up over.
                if (dragToObject &&
                    (!canDropWidget(isc, scLocator) || EH.dragOperation == EH.DRAG_RESIZE))
                {
                    dragToObject = false;
                }
                
                // mouse over new target - record as "dragAndDropToObject". Coords will be
                // derived from the live DOM elements
                if (dragToObject) {
                    this.recordSC2(
                        "dragAndDropToObject", 
                        mouseDownLocator,
                        scLocator
                    );
                // If mouse is over drag target (or no SC-significant target), record as simple
                // "dragAndDrop" - this will handle drag resize, reposition etc.  If an edge is
                // being dragged, record mouse offset from the coordinates representing the
                // mouse-down locator that we'll generate.  This is because, for a drag resize,
                // the final position is all that matters, not where the mouse started.
                } else {
                    var startCoords = (mouseDownLocator.match(/\/[BTLR]+$/) &&
                                      getSCContextValue(autWindow, "mouseDownLocatorCoords")) ||
                                      getSCContextValue(autWindow, "mouseDownCoords")
                    ;
                    var offsetX = EH.getX() - startCoords[0],
                        offsetY = EH.getY() - startCoords[1];
                        
                    this.recordSC1(
                        "dragAndDrop",
                        mouseDownLocator,
                        (offsetX > 0 ? "+" : "") + offsetX + "," +
                        (offsetY > 0 ? "+" : "") + offsetY
                    );
                }
            // Not a drag/drop interaction - perform click operation.
            } else {
                
                // don't fire click if mouseDown locator or mouse up locator are unset.
                if (mouseDownLocator != null && scLocator != null) {

                    // If this event is within the double click interval since the last SC click we
                    // recorded, record as a double-click event
                    var EH = EH,
                        time = autWindow.isc.timeStamp(),
                        withinDoubleClickInterval = false;
                    if (EH.lastClickTime != null) {
                        var completeTime = EH._lastClickCompleteTime || EH.$k9;
                        withinDoubleClickInterval = 
                         ((completeTime - EH.lastClickTime) < EH.DOUBLE_CLICK_DELAY) ?
                            time - EH.lastClickTime < EH.DOUBLE_CLICK_DELAY :
                            ((time - completeTime) < 100);
                    }

                    // If mouse coordinates haven't changed, use scLocator generated
                    // during the mouseDown event; this avoids generating a bad locator
                    // for situations in which the click itself moves the widget stack
                    var startCoords = getSCContextValue(autWindow, "mouseDownCoords");
                    if (EH.getX() == startCoords[0] &&
                        EH.getY() == startCoords[1]) scLocator = mouseDownLocator;

                    var command = withinDoubleClickInterval ? "secondClick" : "click";
                    if (!delayed) this.recordSC1(command, scLocator, '', createScEvent(event));
                    else this.recordDelayedScEvent(createScEvent(event, command, scLocator));
                }
            }
            
            // clear out mouseDown context vars
            setSCContextValue(autWindow, "mouseDownTarget",        null);
            setSCContextValue(autWindow, "mouseDownLocator",       null);
            setSCContextValue(autWindow, "mouseDownCoords",        null);
            setSCContextValue(autWindow, "mouseDownLocatorCoords", null);
        }
    }
}, { capture: true });

Recorder.addEventHandler('scContextMenuLocator', 'mousedown', function(event) {
    if (event.button == 2) {
        var autWindow = this.window;
        if (autWindow.wrappedJSObject) {
            autWindow = autWindow.wrappedJSObject;
        }
        if(hasSC(autWindow)) {
            var element = this.clickedElement;
           
            var scLocator = findScLocator(element,autWindow);
            
            if(scLocator != null) {
                this.recordSC1("contextMenu", scLocator, '');
                delete this.click;
            }
        }
    }
}, { capture: true });


// override the default type locator to pick up typing within SC form items.
Recorder.removeEventHandler('type');
Recorder.addEventHandler('scType', 'change', function(event) {
    if (isTextBasedElement(event.target)) {
        // === start sc specific code ===
        var autWindow = this.window;
        if (autWindow.wrappedJSObject) {
            autWindow = autWindow.wrappedJSObject;
        }
        if(hasSC(autWindow)) {
            var element = event.target,
            scLocator = findScLocator(element, autWindow);
            
            if(scLocator != null) {
                this.recordSC1("type", scLocator, event.target.value);
            }
        } else {
            this.record("type", this.findLocators(event.target), event.target.value);
        }
    }
}, { capture: true });

// get scLocator from last event seen by EventHandler
function getLastEventScLocator (autWindow) {
    if (!hasSC(autWindow)) return;

    var isc = autWindow.isc,
        document = autWindow.document,
        lastDOMevent = isc.EH.lastEvent.DOMevent;

    // primary - get locator for last event target element
    var scLocator = findScLocator(lastDOMevent.target, autWindow);
    if (scLocator) return scLocator;

    // fallback - get locator for element at event coordinates
    var x = lastDOMevent.clientX,
        y = lastDOMevent.clientY;

    return findScLocator(document.elementFromPoint(x, y), autWindow);
}

// support for recording keyboard navigation and control
var keyEventHandler = function(event) {
    var autWindow = this.window;
    if (autWindow.wrappedJSObject) {
        autWindow = autWindow.wrappedJSObject;
    }
    if (!hasSC(autWindow)) return;

    var element = event.target,
    keyCode = event.keyCode,
    command = event.type.toLowerCase(),
    textBased = isTextBasedElement(element),
    scLocator = findScLocator(element, autWindow);
    if (scLocator == null) return;

    // Don't capture ordinary keystrokes for unmasked TextItems; Selenium IDE will
    // generate a single 'type' command for the text when focus leaves the element.
    // (A few navigation keystrokes are still allowed such as arrow keys and tab.)
    if (textBased) {
        var isc = autWindow.isc,
        scObject = isc.AutoTest.getObject(scLocator);
        if (!isc.isA.TextItem(scObject) || scObject.mask == null) {
            if (keyCode <   9 || keyCode >= 48 || 
                keyCode == 13 && isc.isA.TextAreaItem(scObject)) return;
        }
    }

    var argument;
    switch (keyCode) {
    case 9:  argument = "${KEY_TAB}";       break;
    case 13: argument = "${KEY_ENTER}";     break;
    case 18: argument = "${KEY_ALT}";       break;
    case 32: argument = "${KEY_SPACE}";     break;
    case 33: argument = "${KEY_PAGE_UP}";   break;
    case 34: argument = "${KEY_PAGE_DOWN}"; break;
    case 37: argument = "${KEY_LEFT}";      break;
    case 38: argument = "${KEY_UP}";        break;
    case 39: argument = "${KEY_RIGHT}";     break;
    case 40: argument = "${KEY_DOWN}";      break;
    default:
        if (event.charCode > 0) {
            argument = String.fromCharCode(event.charCode).toUpperCase();
        }
        if (argument == " ") argument = "${KEY_SPACE}"; // HTML trims whitespace!
    }

    // not a supported key
    if (!argument) return;

    switch (command) {
    case "keypress":
        break;
    case "keydown":
        // tapping alt will manually insert commands
        if (keyCode == 18) {
            if (isTextBasedElement(element)) {
                // for a text element, insert a "type" command with current content
                command  = "type";
                argument = element.value;
            } else {
                // otherwise, insert a "mouseMove", useful for menu interactions
                scLocator = getLastEventScLocator(autWindow);
                command   = "mouseMove";
                argument  = null;
                textBased = false;
            }
            break;
        } // fall through
    case "keyup":
    default:
        return;
    }
    this.recordDelayedScEvent(createScEvent(event, command, scLocator, argument, textBased));
};

Recorder.addEventHandler('scKeyDown',  'keydown',  keyEventHandler, { capture: true });
Recorder.addEventHandler('scKeyPress', 'keypress', keyEventHandler, { capture: true });
Recorder.addEventHandler('scKeyPress', 'keyup',    keyEventHandler, { capture: true });

// ============================ End Experimental Features Section ============================

var origValueBuilder, dummyWindow = {};
dummyWindow[Recorder.WINDOW_RECORDER_PROPERTY] = {};
    
// find and store original value builder for later use
CommandBuilders.builders.map(function (binding) {
    var builder     = binding.builder,
        commandType = binding.commandType;
    if (commandType != "accessor") return;

    var dummyResult = builder.call(CommandBuilders, dummyWindow);
    if (dummyResult && dummyResult.accessor == "value") {
        origValueBuilder = builder;
    }
});

// wrap each builder to apply SmartClient-specific logic
CommandBuilders.builders.map(function (binding) {
    var builder     = binding.builder,
        commandType = binding.commandType;
    if (commandType != "accessor") return;

    binding.builder = function (window) {
        var autWindow = window;
        if (autWindow.wrappedJSObject) {
            autWindow = autWindow.wrappedJSObject;
        }

        var result = builder.call(CommandBuilders, window);
        if (result == null || !hasSC(autWindow)) return result;

        // handle accessor-specific logic
        var accessor = result.accessor;
        if (accessor == "table") { 
            result.disabled = true;

            var element = this.getRecorder(window).clickedElement;
            if (!element) return result;
        
            var e = convertToLiveElement(element, autWindow),
                grid = autWindow.isc.AutoTest.locateCanvasFromDOMElement(e);
            if (grid == null || !grid.isA("GridRenderer")) return result;

            var cellXY = grid.getCellFromDomElement(e);
            if (cellXY == null) return result;

            var row = Number(cellXY[0]),
                col = Number(cellXY[1]);

            // if GridRenderer is a GridBody, map it to the parent ListGrid
            if (grid.grid) {
                col  = grid.grid.getFieldNumFromLocal(col, grid);
                grid = grid.grid;
            }

            var record = grid.getCellRecord(row, col),
                text = grid.getCellValue(record, row, col);

            delete result.disabled;
            result.target = "scLocator=" + grid.getLocator() + "." + row + "." + col;
            result.value = text;

        } else if (accessor != "title") {
            // update the result target to use an scLocator
            var element = this.getRecorder(window).clickedElement,
                scLocator = findScLocator(element, autWindow);
            if (scLocator != null) result.target = scLocator;
            
            // update value
            switch (accessor) {
            case "value": // in SmartClient, value means the Framework JS value
                if (scLocator != null) {
                    result.value = autWindow.isc.AutoTest.getValue(scLocator);
                    if (result.value == null) result.value = "";
                    else               delete result.disabled;
                    if (!autWindow.isc.isA.String(result.value)) result.value += "";
                }
                break;
            case "text": // in SmartClient, text falls back to native (display) value
                if (!result.value && origValueBuilder) {
                    var fallback = origValueBuilder.call(CommandBuilders, window);
                    result.value    = fallback.value;
                    result.disabled = fallback.disabled;
                }
                break;
            }
        }

        return result;
    }
});

CommandBuilders.add('action', function(window) {
    var autWindow = window;
    if (autWindow.wrappedJSObject) {
        autWindow = autWindow.wrappedJSObject;
    }

    if (hasSC(autWindow)) {
        var element = this.getRecorder(window).clickedElement,
            scLocator = findScLocator(element, autWindow);
        if (scLocator != null) {
            return {
                command: "click",
                target: scLocator
            };
        }
    }

    return {
        command: "click",
        disabled : true
    };
});


Recorder.prototype.recordSC1 = function (actionName, argument1, argument2, modifiers) {
    this.flushPendingModifierScEvent();
    this.record("waitForElementClickable", argument1, '');
    this.record(actionName, argument1, argument2, modifiers);
};

Recorder.prototype.recordSC2 = function (actionName, argument1, argument2, modifiers) {
    this.flushPendingModifierScEvent();
    this.record("waitForElementClickable", argument1, '');
    this.record("waitForElementClickable", argument2, '');
    this.record(actionName, argument1, argument2, modifiers);
};

Recorder.prototype.recordScTabNavigation = function (oldScLocator) {

    var autWindow = this.window;
    if (autWindow.wrappedJSObject) {
        autWindow = autWindow.wrappedJSObject;
    }
    if(!hasSC(autWindow)) return;

    var isc = autWindow.isc,
        newElement = autWindow.document.activeElement;
        newScLocator = findScLocator(newElement, autWindow);
    if (newScLocator == null) return;

    this.record("blur",                    oldScLocator);
    this.record("waitForElementClickable", newScLocator);
    this.record("focus",                   newScLocator, "true");
};

Recorder.prototype.recordModifierDown = function (keyName, keyCode, locator) {
    this.record(keyName + "KeyDown");
    this.record("keyDown",  locator, keyCode.toString());
    this.record("keyPress", locator, keyCode.toString());
};
Recorder.prototype.recordModifierUp = function (keyName, keyCode, locator) {
    this.record(keyName + "KeyUp");
    this.record("keyUp", locator, keyCode.toString());
};

Recorder.prototype.recordScEvent = function (scEvent) {

    var actionName = scEvent.command,
        locator = scEvent.scLocator,
        strict = scEvent.textBased,
        argument = scEvent.argument || "";

    this.record("waitForElement" + (strict ? "ReadyForKeyPresses" : "Clickable"), locator, '');

    switch (actionName.toLowerCase()) {
    case "keypress":
        this.record("sendKeys", locator, argument, scEvent);
        if (argument == "${KEY_TAB}") this.recordScTabNavigation(locator);
        break;
    default:
        this.record(actionName, locator, argument, scEvent);
    }
};

Recorder.prototype.recordDelayedScEvent = function (newEvent) {
    // clear any pending callback
    if (this._scEventId != null) {
        clearTimeout(this._scEventId);
        this._scEventId = null;
    }

    var oldEvent = this._scEvent;
    this._scEvent = null;

    if (oldEvent) this.recordScEvent(oldEvent);
    if (newEvent == null) return;

    var recorder = this;
    this._scEvent = newEvent;

    // only emit modifier events with other events
    if (this.isModifierScEvent(this._scEvent)) return;

    this._scEventId = setTimeout(function () { recorder.recordDelayedScEvent(); }, 100);
};

Recorder.prototype.isModifierScEvent = function (event) {
    if (event == null) return false;
    return event.command == "keydown" || event.command == "keyup";
};

Recorder.prototype.flushPendingModifierScEvent = function () {
    if (this.isModifierScEvent(this._scEvent)) this.recordDelayedScEvent();
};

// augment the original record API to take and apply modifier keys
Recorder.prototype.orig_record = Recorder.prototype.record;
Recorder.prototype.record = function (actionName, argument1, argument2, modifiers) {
    if (!modifiers) modifiers = {};

    switch (actionName) {
    case "sendKeys": 
        if (modifiers.ctrlDown)  argument2 = "${KEY_CTRL}"  + argument2 + "${KEY_CTRL}";
        if (modifiers.shiftDown) argument2 = "${KEY_SHIFT}" + argument2 + "${KEY_SHIFT}";
        break;
    case "click":
    case "secondClick":
        if (modifiers.ctrlDown)  this.recordModifierDown("control", 17, argument1);
        if (modifiers.shiftDown) this.recordModifierDown("shift",   16, argument1);
        this.orig_record(actionName, argument1, argument2);
        if (modifiers.shiftDown) this.recordModifierUp  ("shift",   16, argument1);
        if (modifiers.ctrlDown)  this.recordModifierUp  ("control", 17, argument1);
        return;
    }
    
    this.orig_record(actionName, argument1, argument2);
}

function createScEvent(nativeEvent, command, scLocator, argument, textBased) {
    var scEvent = {command: command, scLocator: scLocator, 
                   argument: argument, textBased: textBased};
    if (nativeEvent) {
        scEvent.ctrlDown  = nativeEvent.ctrlKey;
        scEvent.shiftDown = nativeEvent.shiftKey;
    }
    return scEvent;
}

function hasSC(autWindow) {
    // require AutoTest, as it's part of ISC_Core.js in newer SC versions
    var hasSC = autWindow.isc != null && autWindow.isc.AutoTest != null;
    if(hasSC && autWindow.isc.Canvas.getCanvasLocatorFallbackPath === undefined) {
        autWindow.isc.ApplyAutoTestMethods();
    }
    return hasSC;
}

function setSCContextValue(autWindow, fieldName, value) {
    if (!hasSC(autWindow)) return;
    if (autWindow.isc.SeleniumContext == null) autWindow.isc.SeleniumContext = {};
    autWindow.isc.SeleniumContext[fieldName] = value;
}

function getSCContextValue(autWindow, fieldName) {
    if (!hasSC(autWindow)) return;
    if (autWindow.isc.SeleniumContext == null) return null;
    return autWindow.isc.SeleniumContext[fieldName];
}

function isTextBasedElement(element) {
    var tagName = element.tagName;
    if (!element.tagName) return false;
    tagName = tagName.toLowerCase();
    return tagName == "textarea" || tagName == "input" && 
        (element.type == "text" || element.type == "password" || element.type == "file");
}

function isHeaderButton(isc, canvas) {
    return isc.isA.Canvas(canvas) && isc.isA.ListGrid(canvas.grid) &&
        canvas.grid.getFieldHeaderButton(canvas.masterIndex) == canvas;
}

function canDropWidget(isc, scDropLocator) {
    var dragTarget = isc.EH.dragTarget;
    if (!isHeaderButton(isc, dragTarget)) return dragTarget != null && dragTarget.canDrop;
    var dropTarget = isc.AutoTest.getObject(scDropLocator);
    if (dropTarget == null) return false;
    return dropTarget != dragTarget.grid._dragLine;
}

function getEnvVarValue(varName) {
    try {
        var classes = Components.classes,
            environment = classes["@mozilla.org/process/environment;1"],
            value = environment.getService(Components.interfaces.nsIEnvironment).get(varName);
        if (value != null && value.length > 0) return value;
    } catch (x) {}
    return null;
 };

// Return whether supplied port should emit our internal exampleOpen command used for
// testing the SmartClient Feature Explorer and SGWT LGPL and SGWT EE Showcases.
// Define SMARTPORTS as a regular expression of ports, i.e. "8080|15011|1001[0-2]"
function isPortSCDevPort(urlPort) {
    var smartports = getEnvVarValue("SMARTPORTS");
    return urlPort.match(new RegExp(smartports)) != null;
};

// When called, replace Selenium IDE Command object with our own modified version that
// emits the exampleOpen command to open our SC Feature Explorer and SGWT showcases.
function replaceCommandObject() {
    var oldCommandObject = Command;
        newCommandObject = function (command, target, value) {

            if (command == "open") {
                var recordAbsoluteURL = editor.getOptions().recordAbsoluteURL == "true";            
                if (recordAbsoluteURL) {

                    var urlPort = "80",
                        portMatches = target.match(/(?:http\/\/)?[^:\/]+:([0-9]+)/);
                    if (portMatches != null && portMatches.length > 1) urlPort = portMatches[1];

                    if (isPortSCDevPort(urlPort)) {
                        var showcase = target.match(/SmartClient_Explorer\.html/) != null ? 
                            "smartclient" : "smartgwt";
                        var idMatch = target.match(/\#(.*)$/),
                            mappedId = idMatch != null && idMatch.length > 1 ? idMatch[1] : "";

                        oldCommandObject.call(this, "exampleOpen", showcase, mappedId);
                        return;
                    }
                } else {
                    alert("The exampleOpen command will not be generated for you unless " +
                          "you configure Selenium IDE options to 'Record Absolute URL'");
                }
            }
            oldCommandObject.apply(this, arguments);
        };

    // install the new Command object
    Command           = newCommandObject;
    Command.prototype = oldCommandObject.prototype;
    for (var i in oldCommandObject) Command[i] = oldCommandObject[i];
}

// In a development environment, replace Selenium IDE Command object.
if (getEnvVarValue("GLOBAL_DEVENV") != null) replaceCommandObject();
