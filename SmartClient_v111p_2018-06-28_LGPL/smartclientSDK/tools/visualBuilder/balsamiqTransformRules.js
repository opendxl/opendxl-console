/*-=-
    Isomorphic SmartClient web presentation layer
    Copyright 2000 and beyond Isomorphic Software, Inc.

    OWNERSHIP NOTICE
    Isomorphic Software owns and reserves all rights not expressly granted in this source code,
    including all intellectual property rights to the structure, sequence, and format of this code
    and to all designs, interfaces, algorithms, schema, protocols, and inventions expressed herein.

    CONFIDENTIALITY NOTICE
    The contents of this file are confidential and protected by non-disclosure agreement:
      * You may not expose this file to any person who is not bound by the same obligations.
      * You may not expose or send this file unencrypted on a public network.

    SUPPORTED INTERFACES
    Most interfaces expressed in this source code are internal and unsupported. Isomorphic supports
    only the documented behaviors of properties and methods that are marked "@visibility external"
    in this code. All other interfaces may be changed or removed without notice. The implementation
    of any supported interface may also be changed without notice.

    If you have any questions, please email <sourcecode@isomorphic.com>.

    This entire comment must accompany any portion of Isomorphic Software source code that is
    copied or moved from this file.
*/

var transformRules = {
    // a mapping from Balsamiq control name to SmartClient classname, eg, 
    classTranslations: {
        "com.balsamiq.mockups::TitleWindow": "Window",
        "com.balsamiq.mockups::BrowserWindow": "VStack",
        "com.balsamiq.mockups::TabBar": "TabSet",
        "com.balsamiq.mockups::Label": "Label",
        "com.balsamiq.mockups::Button": "ButtonItem",
        "com.balsamiq.mockups::TextInput": "TextItem",
        "com.balsamiq.mockups::ComboBox": "SelectItem",
        "com.balsamiq.mockups::NumericStepper": "SpinnerItem",
        "com.balsamiq.mockups::MenuBar": "MenuBar",
        "com.balsamiq.mockups::Accordion": "SectionStack",
        "com.balsamiq.mockups::CheckBox": "CheckboxItem",
        "com.balsamiq.mockups::DateChooser": "DateItem",
        "com.balsamiq.mockups::FormattingToolbar": "ToolStrip",
        "com.balsamiq.mockups::FieldSet": "Canvas",
        "com.balsamiq.mockups::Link": "LinkItem",
        "com.balsamiq.mockups::Calendar": "DateChooser",
        "com.balsamiq.mockups::VerticalTabBar": "TabSet",
        "com.balsamiq.mockups::Image": "Img",
        "com.balsamiq.mockups::DataGrid": "ListGrid",
        "com.balsamiq.mockups::Tree": "TreeGrid",
        "com.balsamiq.mockups::Switch": "CheckboxItem",
        "com.balsamiq.mockups::ButtonBar": "MenuBar",
        "com.balsamiq.mockups::Canvas": "VStack",
        "com.balsamiq.mockups::BreadCrumbs": "HLayout",
        "com.balsamiq.mockups::TextArea": "TextAreaItem",
        "com.balsamiq.mockups::Title": "Label",
        "com.balsamiq.mockups::SubTitle": "Label",
        "com.balsamiq.mockups::MultilineButton": "Button",
        "com.balsamiq.mockups::CheckBoxGroup": "DynamicForm",
        "com.balsamiq.mockups::ColorPicker": "ColorItem",
        "com.balsamiq.mockups::RadioButton": "RadioItem",
        "com.balsamiq.mockups::RadioButtonGroup": "DynamicForm",
        "com.balsamiq.mockups::PointyButton": "Button",
        "com.balsamiq.mockups::Paragraph": "Label",
        "com.balsamiq.mockups::HSlider": "SliderItem",
        "com.balsamiq.mockups::LinkBar": "HLayout",
        "com.balsamiq.mockups::SearchBox": "TextItem",
        "com.balsamiq.mockups::Icon": "Label",
        "com.balsamiq.mockups::IconLabel": "Label",
        "com.balsamiq.mockups::HelpButton": "Label",
        "com.balsamiq.mockups::VSlider": "SliderItem",
        "com.balsamiq.mockups::List": "SelectItem",
        "com.balsamiq.mockups::ProgressBar": "Progressbar",
        "com.balsamiq.mockups::BarChart": "FacetChart",
        "com.balsamiq.mockups::ColumnChart": "FacetChart",
        "com.balsamiq.mockups::PieChart": "FacetChart",
        "com.balsamiq.mockups::LineChart": "FacetChart",
        "com.balsamiq.mockups::Menu": "MenuButton",
        "com.balsamiq.mockups::TagCloud": "Label",
        "com.balsamiq.mockups::HorizontalScrollBar": "Scrollbar",
        "com.balsamiq.mockups::VerticalScrollBar": "Scrollbar",
        "com.balsamiq.mockups::Component": "Symbol"
    },
    
    // a mapping from Balsamiq property name to equivalent SmartClient property
    propertyTranslations: {
        "x": "left",
        "y": "top",
        "w": "width",
        "h": "height",
        "zOrder": "zIndex",
        "text": "title",
        "customData": "customData",
        "customID": "customID"
    },

    // items that can be used only as form item element of DynamicForm widget
    formItems: [ "TextItem", "TextAreaItem", "SelectItem", "SpinnerItem", "CheckboxItem",
        "ColorItem", "DateItem", "LinkItem", "RadioItem", "SliderItem", "ButtonItem" ],

    // markup items should be placed separately and have absolute positioning
    markupItems: [
        "com.balsamiq.mockups::Arrow",
        "com.balsamiq.mockups::CallOut",
        "com.balsamiq.mockups::StickyNote",
        "com.balsamiq.mockups::RoundButton",
        "com.balsamiq.mockups::HCurly",
        "com.balsamiq.mockups::RedX",
        "com.balsamiq.mockups::ScratchOut",
        "com.balsamiq.mockups::VCurly"
    ],
    
    iconsMap: {
        "PrintIcon": "/actions/print.png",
        "SearchIcon": "/actions/view.png",
        "CheckMarkIcon": "/actions/approve.png",
        "PencilIcon": "/actions/edit.png",
        "LeftArrowIcon": "/actions/back.png",
        "RightArrowIcon": "/actions/forward.png",
        "CircledPlusIcon": "/actions/add.png",
        "CircledMinusIcon": "/actions/remove.png",
        "FilterIcon": "/actions/filter.png",
        "InfoIcon": "/actions/help.png",
        "RepeatIcon": "/actions/refresh.png",
        "ReloadIcon": "/actions/refresh.png",
        "SaveIcon": "/actions/save.png",
        "OutdentIcon": "/RichTextEditor/outdent.png",
        "PasteIcon": "/RichTextEditor/paste.png",
        "TextAlignCenterIcon": "/RichTextEditor/text_align_center.png",
        "TextAlignLeftIcon": "/RichTextEditor/text_align_left.png",
        "TextAlignRightIcon": "/RichTextEditor/text_align_right.png",
        "ItalicIcon": "/RichTextEditor/text_italic.png",
        "UnderlineIcon": "/RichTextEditor/text_underline.png",
        "BoldIcon": "/RichTextEditor/text_bold.png",
        "DataBaseIcon": "/DatabaseBrowser/data.png",
        "FolderClosed": "/TreeGrid/folder_closed.png",
        "FolderIcon": "/TreeGrid/folder_open.png",
        "SquaredPlusIcon": "/TreeGrid/opener_closed.png",
        "SquaredMinusIcon": "/TreeGrid/opener_opened.png",
        "FileIcon": "/TreeGrid/file.png",
        "DocEmptyIcon": "/headerIcons/document.png",
        "XIcon": "/headerIcons/close.png",
        "MinusIcon": "/headerIcons/minimize.png",
        "DownFillTriangleIcon": "/headerIcons/arrow_down.png",
        "RightFillTriangleIcon": "/headerIcons/arrow_right.png",
        "LeftFillTriangleIcon": "/headerIcons/arrow_left.png",
        "UpFillTriangleIcon": "/headerIcons/arrow_up.png",
        "CartIcon": "/headerIcons/cart.png",
        "PagesIcon": "/headerIcons/cascade.png",
        "SmallClockIcon": "/headerIcons/clock.png",
        "ClockIcon": "/headerIcons/clock.png",
        "AddCommentIcon": "/headerIcons/comment.png",
        "CommentsIcon": "/headerIcons/comment.png",
        "HeartIcon": "/headerIcons/favourite.png",
        "HelpIcon": "/headerIcons/help.png",
        "Help2Icon": "/headerIcons/help.png",
        "HomeMobileIcon": "/headerIcons/home.png",
        "HomeIcon": "/headerIcons/home.png",
        "EmailIcon": "/headerIcons/mail.png",
        "GMailIcon": "/headerIcons/mail.png",
        "ContactIcon": "/headerIcons/person.png",
        "PushPinIcon": "/headerIcons/pin_down.png",
        "GearIcon": "/headerIcons/settings.png",
        "Trash2Icon": "/headerIcons/trash.png",
        "TrashIcon": "/headerIcons/trash.png",
        "CalendarIcon": "DynamicForm/date_control.png"
    },

    // Tool function for parsing balsamiq text - it encoded using wiki-style
    // Replaces '\r' by '<br/>', '[text]' by text in a link, '*text*' by text in bold,
    // '_text_' by text in italic.
    // See:  http://support.balsamiq.com/customer/portal/articles/110121
    
    parseTextWikiSymbols : function (text) {
        var italic = false;
        var bold = false;
        var link = false;
        var res = [];
        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            if (c == '\\') {
                if( (i + 1) < text.length && text.charAt(i + 1) == 'r') {
                    c = "<br/>";
                    i++;    
                }
            } else if (c == '[' && text.indexOf("]",i + 1) > 0) {
                c = "<a href='#'>";
                link = true;
            } else if (c == ']') {
                if (link) {
                    c = "</a>";
                    link = false;
                }
            } else if (c == '*') {
                if (bold) {
                    bold = false;
                    c = "</b>";
                } else {
                    bold = true;
                    c = "<b>";
                }
            } else if (c == '_') {
                if (italic) {
                    italic = false;
                    c = "</i>";
                } else {
                    italic = true;
                    c = "<i>";
                }
            }
            res.push(c);
        }
        return res.join("");
    },
    
    // Helper logic for translating balsamiq controls.
    // Every control (named using balsamiq name) can have:
    // 1. balsamiqPropertyName -> smartclient property name pairs
    // 2. controlPropertiesParser function for correct parsing text in 
    //    balsamiq controlProperties tag
    // 3. getAdditionalElements function for creating additional controls or datasources
    // 4. afterInit function to add/modify properties of converted control
    // CONTAINERS PARAMETERS:
    // 5. addChild function if element is container that should add child items
    // 6. container interior params: 
    //    - the "interior" of a container means the area in which you would typically put
    //    other controls without overlapping part of the container itself.  For example, for a
    //    TitleWindow it would be the interior rect excluding the header and footer and a small
    //    amount of room for the left/right border.
    //    - leftMargin
    //    - rightMargin
    //    - topMargin
    //    - bottomMargin
    widgetPropertyTranslations: {
        // CONTAINERS
        "com.balsamiq.mockups::TitleWindow": {
            "dragger": "showResizer",
            "minimize": "showMinimizeButton",
            "close": "showCloseButton",
            "maximizeRestore": "showMaximizeButton",
            canUseMargin: false,
            getLeftMargin : function (container) {
                return 6;
            },
            getRightMargin : function (container) {
                return 6;
            },
            getTopMargin : function (container) {
                return 23;
            },
            getBottomMargin : function (container) {
                if (container.showFooter) {
                    return 24;
                } else {
                    return 4;
                }
            },
            afterInit : function (name, control) {
                if (control.specialProperties.bottomheight != null 
                    && parseInt(control.specialProperties.bottomheight) < 3)
                {
                    control.showFooter = false;    
                } else {
                    control.showFooter = true;
                    if (control.specialProperties.bottomheight) { 
                        control.footerHeight = control.specialProperties.bottomheight;
                    }
                }
                if (control.specialProperties.topheight) {
                    control.headerProperties = { 
                        height: control.specialProperties.topheight
                    }
                }
                if (control.showResizer == "true") {
                    control.canDragResize = true;
                }
                if (!control.showMinimizeButton && !control.showMaximizeButton && !control.showCloseButton) {
                    control.showMinimizeButton = false;
                    control.showCloseButton = false;
                } else {
                    if (!control.showMinimizeButton) control.showMinimizeButton = false;
                    if (!control.showMaximizeButton) control.showMaximizeButton = false; 
                    if (!control.showCloseButton) control.showCloseButton = false;
                }
            },
            // - TitleWindow: add it to Window.items 
            addChild : function (control, child) {
                if (control.items == null) {
                    control.items = [];
                }
                control.items.add(child);
            },
            // - "controls area" of Window; add as window.headerControls, after standard
            // controls but before closeButton 
            // (also minimize and maximize?)
            addControl : function (container, headerControl) {
                var controlAreaName = headerControl.controlAreaName;
                var control = headerControl.control;
                if (controlAreaName == "header") {
                    if (container.headerControls == null) {
                        // Add default header controls using special marker classes
                        container.headerControls = [{
                            _constructor: "WindowHeaderIcon"
                        },{
                            _constructor: "WindowHeaderLabel"
                        },{
                            _constructor: "WindowMinimizeButton"
                        },{
                            _constructor: "WindowMaximizeButton"
                        },{
                            _constructor: "WindowCloseButton"
                        }];
                    }
                    // Place custom control before the minimize button
                    container.headerControls.add("ref:" + control.ref, container.headerControls.length - 3);
                } else {
                    if (container.footerControls == null) {
                        // Add default footer controls using special marker classes
                        container.footerControls = [{
                            _constructor: "WindowFooterSpacer"
                        },{
                            _constructor: "WindowResizer"
                        }];
                    }
                    // Place custom control before spacer
                    container.footerControls.addAt("ref:" + control.ref, container.footerControls.length - 2);         
                }
            },
            getControlAreaName : function (container, control) {
                var controlY = control.top;
                if (control.height != null) {
                    controlY += control.height / 2;
                }
                if (controlY < this.getTopMargin(container)) {
                    return "header";
                } else if (container.showFooter && 
                    controlY > (container.height - this.getBottomMargin(container)))
                {
                    return "footer";
                }
            }
        },
        "com.balsamiq.mockups::BrowserWindow" : {
            getLeftMargin : function (container) {
                return 0;
            },
            getRightMargin : function (container) {
                return 0;
            },
            getTopMargin : function (container) {
                return 77;
            },
            getBottomMargin : function (container) {
                return 17;
            },
            addChild : function (control, child) {
                if (control.members == null) {
                    control.members = [];
                }
                control.members.add(child);
            },
            onProcessFinished : function (control) {
                control.top = parseInt(control.top) + 71;
                control.height = parseInt(control.height) - 77;                
            }
        },
        "com.balsamiq.mockups::TabBar": {
            "text": "tabs",
            "selectedIndex": "selectedTab",
            "position": "tabBarPosition",
            getLeftMargin : function (container) {
                // 6 is pane margin in balsamiq - we use it to determine margin for all inner
                // components
                return 6;
            },
            getRightMargin : function (container) {
                if (container.verticalScrollbar != null) {
                    return 14;
                }
                return 7;
            },
            getTopMargin : function (container) {
                if (container.tabBarPosition == "bottom") {
                    return 6 + container._addedHeight;
                } else {
                    return 29;                    
                }
            },
            getBottomMargin : function (container) {
                if (container.tabBarPosition == "bottom") {
                    return 29;
                } else {
                    // 6 real pixels + 4 that we added to height
                    return 6 + container._addedHeight;                    
                }
            },
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var res = [];
                    var tabNames = value.trim().split(",");
                    for (var i = 0; i < tabNames.length; i++) {
                        res.add({
                            title: tabNames[i].trim()
                        });
                    } 
                    return res                    
                } else {
                    return value;
                }
            },
            // - TabSet: make it the tab.pane for the selected tab
            addChild : function (control, child) {
                
                if (control.tabs == null) return;

                var currIndex = control.selectedTab == null?0 :control.selectedTab;
                if (currIndex >= control.tabs.length) currIndex = control.tabs.length - 1; 
                var currentTab = control.tabs[currIndex];
                // - if a VStack is being added to a TabSet / SectionStack where the
                //   Balsamiq XML had the "scrollbar" attribute set, make the VStack
                //   overflow:"auto" and convert it to a VLayout
                if (currentTab.pane == null) {
                    if (child.ref) {
                        currentTab.pane = child.ref;
                    } else {
                        currentTab.pane = child;
                    }
                } else if (currentTab.pane.VStack == null && currentTab.pane.VLayout == null) {
                    var vContainer= {
                        members: [currentTab.pane, child.ref]
                    }
                    if (control.verticalScrollbar != null) {
                        currentTab.pane = {
                            VLayout: vContainer
                        }
                        vContainer.overflow = "auto";
                        delete control.verticalScrollbar;
                    } else {
                        currentTab.pane = {
                            VStack: vContainer
                        }
                    }
                    if (control.membersMargin) {
                        vContainer.membersMargin = control.membersMargin;
                        delete control.membersMargin;
                    }
                    if (control.layoutLeftMargin) {
                        vContainer.layoutLeftMargin = control.layoutLeftMargin;
                        delete control.layoutLeftMargin;
                    }
                    if (control.layoutRightMargin) {
                        vContainer.layoutRightMargin = control.layoutRightMargin;
                        delete control.layoutRightMargin;
                    }
                    if (control.layoutTopMargin) {
                        vContainer.layoutTopMargin = control.layoutTopMargin;
                        delete control.layoutTopMargin;
                    }
                } else {
                    if (currentTab.pane.VStack == null) {
                        currentTab.pane.VLayout.members.add(child.ref);
                    } else {
                        currentTab.pane.VStack.members.add(child.ref);                        
                    }
                }
            },
            // - "controls area" of TabSet: add as tabBarControls
            addControl : function (container, headerControl) {
                if (container.tabBarControls == null) {
                    container.tabBarControls = [];
                }
                container.tabBarControls.add(headerControl.control.ref);
            },
            getControlAreaName : function (container, control) {
                var controlY = control.top;
                if (control.height != null) {
                    controlY += control.height / 2;
                }
                if (controlY < this.getTopMargin(container)) {
                    return "header";
                }
            },
            afterInit : function (name, control) {
                // increase height because balsamiq header takes less space than isomorphic
                var bmTabSetHeaderHeight = 25;
                var scTabSetHeaderHeight = isc.TabSet.getInstanceProperty("tabBarThickness");
                var scTabSetBaseLineThickness = isc.TabBar.getInstanceProperty("baseLineThickness");
                var scTabSetPaneMargin = isc.TabSet.getInstanceProperty("paneMargin");
                var sum = scTabSetHeaderHeight + scTabSetBaseLineThickness + scTabSetPaneMargin;
                control._addedHeight = (sum - bmTabSetHeaderHeight);
                control.height = parseInt(control.height) + (sum - bmTabSetHeaderHeight);
                control.selectedTab = control.selectedTab || 0;
                control.defaultTabWidth = 1;
            }
        },
        
        "com.balsamiq.mockups::VerticalTabBar": {
            "text": "tabs",
            "selectedIndex": "selectedTab",
            "position": "tabBarPosition",
            getLeftMargin : function (container) {
                if (container.tabBarPosition == "right") {
                    return 6;
                } else {
                    return 29;
                }
            },
            getRightMargin : function (container) {
                if (container.tabBarPosition == "right") {
                    // TODO maybe it depends on tabs titles
                    if (container.verticalScrollbar != null) {
                        return 100;
                    }
                    return 85;
                } else {
                    if (container.verticalScrollbar != null) {
                        return 14;
                    }
                    return 6;                    
                }
            },
            getTopMargin : function (container) {
                return 6;
            },
            getBottomMargin : function (container) {
                return 6  + container._addedHeight;
            },
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var res = [];
                    var tabNames = value.trim().split("\n");
                    for (var i = 0; i < tabNames.length; i++) {
                        res.add({
                            title: tabNames[i],
                            height: 1
                        });
                    } 
                    return res                    
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                if (control.tabBarPosition == null) {
                    control.tabBarPosition = "left";                    
                }
                // increase height because balsamiq header takes less space than isomorphic
                var bmTabSetHeaderHeight = 25;
                var scTabSetHeaderHeight = isc.TabSet.getInstanceProperty("tabBarThickness");
                var scTabSetBaseLineThickness = isc.TabBar.getInstanceProperty("baseLineThickness");
                var scTabSetPaneMargin = isc.TabSet.getInstanceProperty("paneMargin");
                var sum = scTabSetHeaderHeight + scTabSetBaseLineThickness + scTabSetPaneMargin;
                control._addedHeight = (sum - bmTabSetHeaderHeight);
                control.height = parseInt(control.height) + (sum - bmTabSetHeaderHeight);
                // same thickness as in balsamiq
                control.tabBarThickness = 80;
                control.selectedTab = control.selectedTab || 0;
            },
            addChild : function (control, child) {
                var currIndex = control.selectedTab == null?0 :control.selectedTab; 
                var currentTab = control.tabs[currIndex];
                // - if a VStack is being added to a TabSet / SectionStack where the
                //   Balsamiq XML had the "scrollbar" attribute set, make the VStack
                //   overflow:"auto" and convert it to a VLayout
                if (currentTab.pane == null) {
                    if (child.ref) {
                        currentTab.pane = child.ref;
                    } else {
                        currentTab.pane = child;
                    }
                } else if (currentTab.pane.VStack == null && currentTab.pane.VLayout == null) {
                    var vContainer= {
                        members: [currentTab.pane, child.ref]
                    }
                    if (control.verticalScrollbar != null) {
                        currentTab.pane = {
                            VLayout: vContainer
                        }
                        vContainer.overflow = "auto";
                        delete control.verticalScrollbar;
                    } else {
                        currentTab.pane = {
                            VStack: vContainer
                        }
                    }
                    if (control.membersMargin) {
                        vContainer.membersMargin = control.membersMargin;
                        delete control.membersMargin;
                    }
                    if (control.layoutLeftMargin) {
                        vContainer.layoutLeftMargin = control.layoutLeftMargin;
                        delete control.layoutLeftMargin;
                    }
                    if (control.layoutRightMargin) {
                        vContainer.layoutRightMargin = control.layoutRightMargin;
                        delete control.layoutRightMargin;
                    }
                    if (control.layoutTopMargin) {
                        vContainer.layoutTopMargin = control.layoutTopMargin;
                        delete control.layoutTopMargin;
                    }
                } else {
                    if (currentTab.pane.VStack == null) {
                        currentTab.pane.VLayout.members.add(child.ref);
                    } else {
                        currentTab.pane.VStack.members.add(child.ref);                        
                    }
                }
            },
            addControl : function (container, headerControl) {
                if (container.tabBarControls == null) {
                    container.tabBarControls = [];
                }
                container.tabBarControls.add(headerControl.control.ref);
            },
            getControlAreaName : function (container, control) {
                var controlX = control.left;
                if (control.width != null) {
                    controlX += control.width / 2;
                }
                if (controlX < this.getLeftMargin(control)) {
                    return "header";
                }
            }
        },
        
        "com.balsamiq.mockups::FieldSet": {
            "text": "groupTitle",
            getLeftMargin : function (container) {
                return 2;
            },
            getRightMargin : function (container) {
                return 2;                    
            },
            getTopMargin : function (container) {
                return 14;
            },
            getBottomMargin : function (container) {
                return 2;
            },
            afterInit : function (name, control) {
                control.isGroup = true;
            },
            // - Rectangle/FieldSet: add it to canvas.children (or layout.members, or tileLayout.tiles)
            addChild : function (control, child, layout) {
                if (control.contained.length == 1 && child.ref != null) {
                    for (var i = 0; i < layout.length; i++) {
                        if (layout[i].ID == child.ref) {
                            // in processLayoutMargins we check for margins and determined padding
                            // if we didn't set it, that we can't move items to the form
                            if (layout[i]._constructor == "DynamicForm" && control.padding != null) {
                                if (layout[i].numCols) control.numCols = layout[i].numCols;
                                if (layout[i].colWidths) control.colWidths = layout[i].colWidths;
                                if (layout[i].valuesManager ) control.valuesManager  = layout[i].valuesManager;
                                if (layout[i].orientation ) control.orientation  = layout[i].orientation;
                                control.items = layout[i].items;
                                layout.removeAt(i);
                                return;                                    
                            }
                            break;
                        }
                    }
                }

                var controlClass = control._constructor
                            && isc.ClassFactory.getClass(control._constructor),
                    layout = controlClass && controlClass.isA("Layout"),
                    tileLayout = !layout && controlClass && controlClass.isA("TileLayout"),
                    membersProp = layout ? "members" : (tileLayout ? "tiles" : "children");

                if (control[membersProp] == null) {
                    control[membersProp] = [];
                }
                control[membersProp].add(child);
            }
        },
        
        "com.balsamiq.mockups::Accordion": {
            "text": "sections",
            "selectedIndex": "selectedIndex",
            sectionHeight: 26,
            getLeftMargin : function (container) {
                return 1;
            },
            getRightMargin : function (container) {
                return 1;                    
            },
            getTopMargin : function (container) {
                var sectionIndex = container._sectionIndex == null? 1: (parseInt(container._sectionIndex) + 1);
                return sectionIndex * this.sectionHeight;
            },
            getBottomMargin : function (container) {
                return 2;
            },
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var d = value.trim().split("\n");
                    var res = [];
                    var widgets = [];
                    var c = 0;
                    for (var i = 0; i < d.length; i++) {
                        if (!d[i].trim().startsWith("-")) {
                            res[c] = {
                                title: d[i],
                                autoShow: true,
                                expanded: false,
                                _index: i
                            };
                            widgets.add(res[c]);
                            c++;
                        } else {
                            if (res[c - 1].items == null) {
                                res[c - 1].items = [];
                            }
                            var l = {
                                _constructor: "Label",
                                contents: d[i].trim().substring(1),
                                height: 20
                            };
                            res[c - 1].items.add(l);
                            widgets.add(l);
                        }
                    }
                    res.widgets = widgets;
                    return res;
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                if (control.sections != null) {
                    var sectionIndex = control.selectedIndex == null? 0: control.selectedIndex;
                    for (var i = 0; i < control.sections.length; i++) {
                        if (control.sections[i]._index <= sectionIndex) {
                            control._sectionIndex = i;
                        }
                    }
                    delete control.selectedIndex;
                    control.sections[control._sectionIndex].expanded = true;
                } else {
                    delete control.selectedIndex;
                }

                if (control.specialProperties.hrefs) {
                    var hrefs = control.specialProperties.hrefs.split(",");
                    control.specialProperties.widgets = [];
                    for (var i = 0; i < hrefs.length; i++) {
                        if (control.sections.widgets[i]._constructor == "Label") {
                            if (control.sections.widgets[i].specialProperties == null) {
                                control.sections.widgets[i].specialProperties = {};
                            }
                            if (hrefs[i] && hrefs[i] != "") {
                                control.sections.widgets[i].specialProperties.hrefs = hrefs[i];
                            }
                            control.specialProperties.widgets.add(control.sections.widgets[i]);
                        }
                    }
                }
                if (control.sections != null) delete control.sections.widgets;
            },
            // - SectionStack: add it to section.items for the expanded section
            addChild : function (container, child) {
                var currentSection =  container.sections[this.getCurrentSectionIndex(container)];
                if (currentSection.items == null) {
                    currentSection.items = [];
                }
                currentSection.items.add(child);
            },
            // - "controls area" of SectionStack: as a section.headerControls (for each
            // section where they appear)
            addControl : function (container, headerControl) {
                var controlAreaName = headerControl.controlAreaName;
                var control = headerControl.control;
                var controlSectionInd = parseInt(controlAreaName.substr(8));
                var currentSection = container.sections[controlSectionInd];
                if (currentSection.controls == null) {
                    currentSection.controls = [];
                }
                currentSection.controls.add(control);
            },
            getControlAreaName : function (container, control) {
                var controlY = control.top;
                if (control.height != null) {
                    controlY += control.height / 2;
                }
                var sectionIndex = this.getCurrentSectionIndex(container);
                var sectionsCount = container.sections.length;
                // above current section
                var bottom = 2;
                for (var i = 0; i <= sectionIndex; i++) {
                    bottom += this.sectionHeight;
                    if (controlY < bottom) {
                        return "section_" + i;
                    }
                }
                // below current section
                bottom = container.height - 2;
                for (var i = sectionsCount - 1; i > sectionIndex; i--) {
                    bottom -= this.sectionHeight;
                    if (controlY > bottom) {
                        return "section_" + i;
                    }
                }
                return null;
            },
            getCurrentSectionIndex : function (control) {
                return control._sectionIndex;
            }
        },
        
        "com.balsamiq.mockups::Canvas": {
            getLeftMargin : function (container) {
                return 2;
            },
            getRightMargin : function (container) {
                return 2;                    
            },
            getTopMargin : function (container) {
                return 2;
            },
            getBottomMargin : function (container) {
                return 2;
            },
            afterInit : function (name, control) {
                var sp = control.specialProperties,
                    borderColor = (sp && sp.borderColor != null ?
                            this._colorToHex(sp.borderColor) : "black"),
                    borderStyle = sp && sp.borderStyle,
                    color = sp && sp.color;

                if (borderStyle == "roundedSolid") {
                    control.border = this._borderWidth + "px solid " + borderColor;
                    control.borderRadius = "25px / 15px";

                } else if (borderStyle == "roundedDotted") {
                    control.border = this._borderWidth + "px dashed " + borderColor;
                    control.borderRadius = "10px";

                } else if (borderStyle != "none") {
                    control.border = "1px solid " + borderColor;
                }

                if (color != null) {
                    control.backgroundColor = this._colorToHex(color);
                }
            },
            _borderWidth: 3,
            _hexDigits: "0123456789ABCDEF",
            _colorToHex : function (color) {
                var ret = "",
                    hexDigits = this._hexDigits;

                for (var i = 0; i < 6; ++i) {
                    ret = hexDigits.charAt(color % 16) + ret;
                    color = Math.floor(color / 16);
                }
                return "#" + ret;
            },
            addChild : function (control, child) {
                var controlClass = control._constructor
                            && isc.ClassFactory.getClass(control._constructor),
                    layout = controlClass && controlClass.isA("Layout"),
                    tileLayout = !layout && controlClass && controlClass.isA("TileLayout"),
                    membersProp = layout ? "members" : (tileLayout ? "tiles" : "children");

                if (control[membersProp] == null) {
                    control[membersProp] = [];
                }
                control[membersProp].add(child);
            }
        },
        "Stack": {
            getLeftMargin : function (container) {
                return 1;
            },
            getRightMargin : function (container) {
                return 1;                    
            },
            getTopMargin : function (container) {
                return 1;
            },
            getBottomMargin : function (container) {
                return 1;
            },
            addChild : function (control, child) {
                if (control.members == null) {
                    control.members = [];
                }
                control.members.add(child);
            }
        },
        // WIDGETS
        "com.balsamiq.mockups::Label": {
            "text": "contents",
            sloppyEdgeControl: true,
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    return transformRules.parseTextWikiSymbols(value.trim());
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                if (parseInt(control.width) < parseInt(control.specialProperties.measuredW)) {
                    // for Label, Balsamiq provides measuredW/H to tell us the text size, but
                    // if the text is wrapped, measuredW/H are wrong (they are for unwrapped).
                    // - if measuredW exceeds "w", draw the text offscreen in a Canvas with an
                    // approximately similar font in an overflow:visible Canvas with width set
                    // to the value for "w", and take the resulting scrollHeight/Width as the
                    // dimensions for the generated SC Label
                    var l = isc.Label.create({
                        contents: control.contents,
                        width: control.width,
                        height: 1,
                        overflow: "visible"
                    });
                    control.height = l.getScrollHeight();
                    l.destroy();
                }
            },
            estimateControlSize : function (control) {
                // TODO use size property there
                return {
                    width:  Math.min((control.contents == null ? 0 : control.contents.length * 8), control.width),
                    height: control.height
                };
            }
        },
        "com.balsamiq.mockups::Button": {
            "icon": "icon",
            controlPropertiesParser : function (name, value) {
                if (name == "icon") {
                    var d = value.split("|");
                    if (transformRules.iconsMap[d[0]]) {
                        return "[SKIN]" + transformRules.iconsMap[d[0]];
                    } else {
                        return "[SKIN]/actions/" + d[0];
                    }
                }
                return value;
            },
            afterInit : function (name, control) {
                // startRow/endRow false should not appear on a FormItem unless it differs
                // from the default for that item.
                if (isc.ClassFactory.getClass("ButtonItem").getInstanceProperty("startRow") == true) {
                    control.startRow = false;
                }
                if (isc.ClassFactory.getClass("ButtonItem").getInstanceProperty("endRow") == true) {
                    control.endRow = false;
                }
                if (!control.title) {
                    // default title
                    
                    if (control.title == null) control.title = "Button";
                    else if (control.icon) {
                        if (control.buttonProperties == null) control.buttonProperties = {};
                        control.buttonProperties.iconSpacing = 0;
                    }
                }
            }
        },
        "com.balsamiq.mockups::MenuBar": {
            "text": "menus",
            defaultValue: "File, Edit, View, Help",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var res = [];
                    var menuNames = value.trim().split(", ");
                    for (var i = 0; i < menuNames.length; i++) {
                        res.add({
                            title: menuNames[i]
                        });
                    } 
                    return res
                }
                return value;
            },
            afterInit : function (name, control) {
                if (control.menus == null) {
                    control.menus = this.controlPropertiesParser("text", this.defaultValue);
                }
            }
        },
        "com.balsamiq.mockups::TextInput": {
            "align": "textAlign",
            "text": "defaultValue",
            afterInit : function (name, control) {
                if (control.height == null || control.height == '-1') {
                    control.height = 22;
                }
            }
        },
        "com.balsamiq.mockups::TextArea": {
            "text": "defaultValue"
        },
        "com.balsamiq.mockups::NumericStepper": {
            "text": "defaultValue",
            afterInit : function (name, control) {
                if (control.height == null || control.height == '-1') {
                    control.height = 22;
                }
            }
        },
        "com.balsamiq.mockups::ComboBox": {
            "text": "valueMap",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var res = value.trim().split("\n");
                    var hasDups = false;
                    outer:
                    for (var i = 0; i < res.length - 1; i++) {
                        for (var j = i + 1; j < res.length; j++) {
                            if (res[i] == res[j]) {
                                hasDups = true;
                                break outer;
                            }
                        }
                    }
                    if (!hasDups) {
                        res._defaultValue = res[0];
                        return res;
                    }
                    var r = {};
                    var indexes = {};
                    for (var i = 0; i < res.length; i++) {
                        var key = isc.MockDataSource.convertTitleToName(res[i], transformRules.mockupImporter.fieldNamingConvention);
                        if (r[key]) {
                            if (indexes[key]) {
                                indexes[key]++;
                            } else {
                                indexes[key] = 1;
                            }
                            key = key + indexes[key]; 
                        }
                        r[key] = res[i];
                    }
                    r._defaultValue = res[0];
                    return r;
                }
                return value;
            },
            afterInit : function (name, control) {
                if (control.height == null || control.height == '-1') {
                    control.height = 22;
                }
                if (control.valueMap) {
                    control.defaultValue = control.valueMap._defaultValue;
                    delete control.valueMap._defaultValue;

                    // state could be "closed", "disabledClosed"
                    if (control.valueMap.length > 1 && (control.specialProperties.state == null ||
                        (control.specialProperties.state != "closed" && control.specialProperties.state != "disabledClosed")))
                    {
                        control.height = 22;
                    }
                }
            }
        },
        "com.balsamiq.mockups::DateChooser": {
            // TODO displayFormat can be calculated using this
            "text": "_displayFormat",
            afterInit : function (name, control) {
                control.useTextField = "true";
                if (control.height == null || control.height == '-1') {
                    control.height = 22;
                }
            }
        },
        "com.balsamiq.mockups::Link": {
            "text": "linkTitle",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    if (value.trim() == "") return "&nbsp;";
                }
                return value;
            }
        },
        "com.balsamiq.mockups::Image": {
            "src": "src",
            afterInit : function (name, control) {
                if (control.src != null && !control.src.trim().startsWith("http://")) {
                    control.title = control.src;
                }
                if (control.title != null ) {
                    control.showTitle = "true";
                }
            }
        },
        "com.balsamiq.mockups::ButtonBar": {
            "text": "menus",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var res = [];
                    var menuNames = value.trim().split(", ");
                    for (var i = 0; i < menuNames.length; i++) {
                        res.add({
                            title: menuNames[i]
                        });
                    } 
                    return res
                }
                return value;
            }
        },
        "com.balsamiq.mockups::BreadCrumbs": {
            "text": "members",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var d = value.trim().split(",");
                    var res = [];
                    var c = 0;
                    for (var i = 0; i < d.length; i++) {
                        res.add({
                            _constructor: "Label",
                            contents: "<a href='#'>" + transformRules.parseTextWikiSymbols(d[i]) + "</a>",
                            width: 1,
                            wrap: false
                        });
                        if ((i + 1) < d.length) {
                            res.add({
                                _constructor: "Label",
                                contents: " > ",
                                width: 1
                            });                        
                        }
                    }
                    return res;
                }
                return value;
            },
             afterInit : function (name, control) {
                control.membersMargin = 10;
            }
        },
        "com.balsamiq.mockups::Switch": {
            "onOffState": "value",
            afterInit : function (name, control) {
                control.showTitle = false;
            },
            controlPropertiesParser : function (name, value) {
                if (name == "onOffState") {
                    return value == "on" ? true : false;    
                }
                return value;
            }
        },
        "com.balsamiq.mockups::DataGrid": {
            "text": "dataSource",
            "verticalScrollbar": "leaveScrollbarGap",
            defaultMockData: "Name\r(job title) ^, Age, Nickname, Employee\n" +
                    "Giacomo Guilizzoni\rFounder & CEO, 34, Peldi, [x]\n" +
                    "Guido Jack Guilizzoni, 4, The Guids, []\n" +
                    "Marco Botton\rTuttofare, 31, , [x]\n" +
                    "Mariah Maclachlan\rBetter Half, 35, Patata, [x]\n" +
                    "Valerie Liberty\rCOO\\, WOW! Division, :), Val, [x]\n" +
                    "{75L, 0R, 25, 0C}",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    return {MockDataSource: {
                        _constructor: "MockDataSource",
                        // xml handles {} as special symbols
                        mockData: value.trim().replace("{", "[").replace("}", "]")
                    }};
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                if (control.dataSource == null) {
                    control.dataSource = this.controlPropertiesParser("text", this.defaultMockData);
                }
                var ds = isc.MockDataSource.create({
                    addGlobalId: false,
                    mockData: control.dataSource.MockDataSource.mockData,
                    mockDataType: "grid",
                    fieldNamingConvention: transformRules.mockupImporter.fieldNamingConvention
                });
                ds.applyGridSettings(control);
                ds.destroy();
            },
            getAdditionalElements : function (name, control) {
                var ds = control.dataSource.MockDataSource;
                ds.ID = control.ID + "_DataSource";
                control.dataSource = ds.ID;
                return [ds];
            }
        },
        "com.balsamiq.mockups::Tree": {
            "text": "dataSource",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    return {MockDataSource:{
                        _constructor: "MockDataSource",
                        mockData: value.trim(),
                        mockDataType: "tree"
                    }};
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                control.autoFetchData = true;
                control.dataProperties = {openProperty: "isOpen"};
            },
            getAdditionalElements : function (name, control) {
                if (control.dataSource != null) {
                    var ds = control.dataSource.MockDataSource;
                    ds.ID = "ds_"+control.ID;
                    control.dataSource = ds.ID;
                    return [ds];
                }
            }
        },
        "com.balsamiq.mockups::Title": {
            "text": "contents",
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    return "<h1>" + transformRules.parseTextWikiSymbols(value.trim()) + "</h1>";
                } else {
                    return value;
                }
            }
        },
        "com.balsamiq.mockups::SubTitle": {
            "text": "contents",
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    return "<h2>" + transformRules.parseTextWikiSymbols(value.trim()) + "</h2>";
                } else {
                    return value;
                }
            }
        },
        "com.balsamiq.mockups::MultilineButton": {
            "text": "title",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    return value.trim().replace(/\n/g, "<br/>");
                }
                return value;
            }
        },
        "com.balsamiq.mockups::CheckBox": {
            "state": "value",
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    return transformRules.parseTextWikiSymbols(value);
                } else if (name == "state" && value == "selected") {
                    return true;
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                
                if (control.title == null) {
                    control.title = "Checkbox";
                }
            }
        },
        "com.balsamiq.mockups::RadioButton": {
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    return transformRules.parseTextWikiSymbols(value);
                } else {
                    return value;
                }
            }
        },
        "com.balsamiq.mockups::CheckBoxGroup": {
            "text": "items",
            sloppyEdgeControl: true,
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var d = value.trim().split("\n");
                    var res = [];
                    for (var i = 0; i < d.length; i++) {
                        var cbLine = d[i];
                        var disabled = cbLine.startsWith("-") && cbLine.endsWith("-");
                        if (disabled) {
                            cbLine = cbLine.substring(1, cbLine.length-1);
                        }
                        cbLine.replace(/\r/g, "<br/>");
                        var item;
                        if (cbLine.startsWith('[ ]')) {
                            item = {
                                _constructor: "CheckboxItem",
                                title: transformRules.parseTextWikiSymbols(cbLine.substring(3).trim())
                            }; 
                        } else if (cbLine.startsWith('[x]')) {
                            item = {
                                _constructor: "CheckboxItem",
                                title: transformRules.parseTextWikiSymbols(cbLine.substring(3).trim()),
                                value: true
                            }; 
                        } else {
                            item = {
                                _constructor: "StaticTextItem",
                                value: transformRules.parseTextWikiSymbols(cbLine)
                            }; 
                        }
                        item.disabled = disabled;
                        item.showTitle = false;
                        res.add(item);
                    }
                    return res;
                }
                return value;
            },
            afterInit : function (name, control) {
                control.numCols = 1;
            },
            estimateControlSize : function (control) {
                var largestWidth = 1,
                    items = control.items ? control.items : [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].title) {
                        largestWidth = 
                            Math.max(largestWidth, 8 * items[i].title.length);                        
                    } else {
                        largestWidth = 
                            Math.max(largestWidth, 8 * items[i].value.length);
                    }
                }
                return {
                    width:  Math.min((25 + largestWidth), control.width),
                    height: control.height
                };
            }
        },
        "com.balsamiq.mockups::ColorPicker": {
            "color": "color",
            afterInit : function (name, control) {
                control.type = "color";
                control.showTitle = false;

                // A BMML ColorPicker shows the square color picker icon but not a text box,
                // so the control's width and height correspond to the
                // isc.ColorItem.pickerIconWidth and pickerIconHeight.
                // However, the width and height are not user-configurable in the
                // Balsamiq Mockups website (it reverts a ColorPicker size back to 26 x 28
                // whenever it is changed), so use the default dimensions of isc.ColorItem.
                delete control.width;
                delete control.height;

                if (control.color != null) {
                    var hexStr = parseInt(control.color, 10).toString(16);
                    for (var len = hexStr.length; len < 6; ++len) {
                        hexStr = "0" + hexStr;
                    }
                    control.value = "#" + hexStr;
                }
            }
        },
        "com.balsamiq.mockups::RadioButtonGroup": {
            "text": "items",
            sloppyEdgeControl: true,
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var d = value.trim().split("\n");
                    var res = [];
                    for (var i = 0; i < d.length; i++) {
                        var cbLine = d[i];
                        var disabled = cbLine.startsWith("-") && cbLine.endsWith("-");
                        if (disabled) {
                            cbLine = cbLine.substring(1, cbLine.length-1);
                        }
                        cbLine.replace(/\r/g,"<br/>");
                        var item;
                        if (cbLine.startsWith('()')) {
                            item = {
                                _constructor: "RadioItem",
                                title: transformRules.parseTextWikiSymbols(cbLine.substring(2).trim())
                            };
                        } else if (cbLine.startsWith('( )')) {
                            item = {
                                _constructor: "RadioItem",
                                title: transformRules.parseTextWikiSymbols(cbLine.substring(3).trim())
                            };
                        } else if (cbLine.startsWith('(o)')) {
                            item = {
                                _constructor: "RadioItem",
                                title: transformRules.parseTextWikiSymbols(cbLine.substring(3).trim()),
                                value: true
                            }; 
                        } else {
                            item = {
                                _constructor: "StaticTextItem",
                                value: transformRules.parseTextWikiSymbols(cbLine)
                            }; 
                        }
                        item.disabled = disabled;
                        item.showTitle = false;
                        res.add(item);
                    }
                    return res;
                } else {
                    return value
                }
            },
            afterInit : function (name, control) {
                control.numCols = 1;
            }
        },
        "com.balsamiq.mockups::Paragraph": {
            "text": "contents",
            "color": "color",
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    return transformRules.parseTextWikiSymbols(value.trim().replace(/\n/g, "<br/>"));
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                if (control.color) {
                    control.contents = "<font color='#" + parseInt(control.color).toString(16) + "'>" + control.contents + "</font>";
                    delete control.color;
                }
                control.valign = "top";
            }
        },
        "com.balsamiq.mockups::TagCloud": {
            "text": "contents",
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    
                    var text = transformRules.parseTextWikiSymbols(value.trim()),
                        res = [];
                    for (var i = 0, textLen = text.length; i < textLen; ++i) {
                        var c = text.charAt(i);
                        if (c == '\\') {
                            if (i < textLen - 1 && text.charAt(i + 1) == ' ') {
                                c = "&nbsp;";
                                ++i;
                            }
                        }
                        res.push(c);
                    }
                    return res.join("");
                } else {
                    return value;
                }
            }
        },
        "com.balsamiq.mockups::LinkBar": {
            "text": "members",
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    var d = value.trim().split(",");
                    var res = [];
                    var c = 0;
                    for (var i = 0; i < d.length; i++) {
                        res.add({
                            _constructor: "Label",
                            contents: "<a href='#'>" + transformRules.parseTextWikiSymbols(d[i]) + "</a>",
                            width: 1
                        });
                        if ((i + 1) < d.length) {
                            res.add({
                                _constructor: "Label",
                                contents: " | ",
                                width: 1
                            });                        
                        }
                    }
                    return res;
                } else {
                    return value;
                }
            },
             afterInit : function (name, control) {
                control.membersMargin = 10;
            }
        },
        "com.balsamiq.mockups::SearchBox": {
            afterInit : function (name, control) {
                control.showHintInField = true;
                control.hint = "search";
                control.icons = [{
                    inline: true,
                    inlineIconAlign: "left",
                    src: "[SKINIMG]actions/view.png"
                }];
            }
        },
        "com.balsamiq.mockups::Icon": {
            "icon": "icon",
            controlPropertiesParser : function (name, value) {
                if (name == "icon") {
                    var d = value.split("|");
                    if (transformRules.iconsMap[d[0]]) {
                        return "[SKIN]" + transformRules.iconsMap[d[0]];    
                    } else {
                        return "[SKIN]/actions/" + d[0];    
                    }
                }
                return value
            }
        },
        "com.balsamiq.mockups::IconLabel": {
            "text": "contents",
            controlPropertiesParser : function (name, value) {
                if (name == "icon") {
                    var d = value.split("|");
                    if (transformRules.iconsMap[d[0]]) {
                        return "[SKIN]" + transformRules.iconsMap[d[0]];    
                    } else {
                        return "[SKIN]/actions/" + d[0];    
                    }                    
                } else {
                    return value;
                }
            }
        },
        "com.balsamiq.mockups::HelpButton": {
            afterInit : function (name, control) {
                control.icon = "[SKIN]/actions/help.png";
            }
        },
        "com.balsamiq.mockups::VSlider": {
            afterInit : function (name, control) {
                control.vertical = true;
            }
        },
        "com.balsamiq.mockups::List": {
            "text": "valueMap",
            controlPropertiesParser : function (name, value) {
                if (name == "text") {
                    var d = value.trim().split("\n");
                    var res = {};
                    for (var i = 0; i < d.length; i++) {
                        res["cb_"+i] = d[i];
                    }
                    return res;
                }
                return value;
            },
            afterInit : function (name, control) {
                control.multiple = true;
                control.multipleAppearance = "grid";
            }
        },
        "com.balsamiq.mockups::ProgressBar": {
            afterInit : function (name, control) {
                control.percentDone = 50;
            }
        },
        "com.balsamiq.mockups::BarChart": {
            afterInit : function (name, control) {
                control.facets = [{
                    id: "region"
                },{
                    id: "product"
                }];
                control.data = [
                    {region: "West",  product: "Cars", sales: 20},
                    {region: "North", product: "Cars", sales: 26},
                
                    {region: "West",  product: "Trucks", sales: 23},
                    {region: "North", product: "Trucks", sales: 24}
                ];
                // hide labels for data as it is in balsamiq, can't set fontSize: 0 because
                // it fails in firefox, can't remove setting fontSize because it used to 
                // count chart width/height
                control.dataLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.gradationLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.valueProperty = "sales";
                control.chartType = "Bar";
                control.stacked = false;
                control.showTitle = false;
                control.showLegend = false;
            }            
        },
        "com.balsamiq.mockups::ColumnChart": {
            afterInit : function (name, control) {
                control.facets = [{
                    id: "region"
                },{
                    id: "product"
                }];
                control.data = [
                    {region: "West",  product: "Cars", sales: 20},
                    {region: "North", product: "Cars", sales: 26},
                
                    {region: "West",  product: "Trucks", sales: 23},
                    {region: "North", product: "Trucks", sales: 24}
                ];
                // hide labels for data as it is in balsamiq, can't set fontSize: 0 because
                // it fails in firefox, can't remove setting fontSize because it used to 
                // count chart width/height
                control.dataLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.gradationLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.valueProperty = "sales";
                control.chartType = "Column";
                control.stacked = false;
                control.showTitle = false;
                control.showLegend = false;
            }
        },
        "com.balsamiq.mockups::PieChart": {
            afterInit : function (name, control) {
                control.facets = [{
                    id: "region"
                },{
                    id: "product"
                }];
                control.data = [
                    {region: "West",  product: "Cars", sales: 20},
                    {region: "West", product: "Trucks", sales: 26}
                ];
                // hide labels for data as it is in balsamiq, can't set fontSize: 0 because
                // it fails in firefox, can't remove setting fontSize because it used to 
                // count chart width/height
                control.dataLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.gradationLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.valueProperty = "sales";
                control.chartType = "Pie";
                control.stacked = false;
                control.showTitle = false;
                control.showLegend = false;
                control.pieStartAngle = 114;
            }
        },
        "com.balsamiq.mockups::LineChart": {
            afterInit : function (name, control) {
                control.facets = [{
                    id: "region"
                },{
                    id: "product"
                }];
                control.data = [
                    {region: "West",  product: "Cars", sales: 0},
                    {region: "North", product: "Cars", sales: 20},
                    {region: "East",  product: "Cars", sales: 13},
                    {region: "South", product: "Cars", sales: 32},
                
                    {region: "West",  product: "Trucks", sales: 7},
                    {region: "North", product: "Trucks", sales: 10},
                    {region: "East",  product: "Trucks", sales: 29},
                    {region: "South", product: "Trucks", sales: 22}
                    
                ];
                // hide labels for data as it is in balsamiq, can't set fontSize: 0 because
                // it fails in firefox, can't remove setting fontSize because it used to 
                // count chart width/height
                control.dataLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.gradationLabelProperties = {
                    fontSize: 1,
                    hidden: true
                };
                control.valueProperty = "sales";
                control.chartType = "Line";
                control.stacked = false;
                control.showTitle = false;
                control.showLegend = false;
            }
        },
        "com.balsamiq.mockups::Menu": {
            "text": "menu",
            controlPropertiesParser : function (name, value) {
                if (name == 'text') {
                    var menu = isc.MenuEditProxy.parseMenuButtonString(value);
                    return isc.addProperties(menu, {
                        autoDraw: false,
                        showShadow: true,
                        shadowDepth: 10
                    });
                } else {
                    return value;
                }
            },
            afterInit : function (name, control) {
                delete control.height;
                control.title = "Menu";
            }
        },
        "com.balsamiq.mockups::CallOut": {
            afterInit : function (name, control) {
                if (control.title == null) {
                    control.title = "1";
                }
            }
        },
        "com.balsamiq.mockups::HorizontalScrollBar": {
            afterInit : function (name, control) {
                control.vertical = false;
            }
        },
        "com.balsamiq.mockups::Component": {
            src: "symbolPath",
            override: "override"
        },
        "com.balsamiq.mockups::Calendar": {
            afterInit : function (name, control) {
                // Calendar widget min.size is 153x150
                if (control.height < 153) {
                    control.height = 153;                    
                }
                if (control.width < 150) {
                    control.width = 150;                    
                }
            }
        }
    }
}
