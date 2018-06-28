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
//>	@class Timeline
// Timeline is a trivial subclass of +link{Calendar} that configures the Calendar with settings
// typical for a standalone timeline view: hides the +link{calendar.dayView, day}, 
// +link{calendar.weekView, week} and +link{calendar.monthView, month} tabs and the 
// +link{calendar.controlsBar, controls bar} by default.
// <P>
// Note that the +link{group:loadingOptionalModules, Calendar module} must be loaded to make 
// use of the Timeline class.
//  
// @inheritsFrom Calendar
// @treeLocation  Client Reference/Calendar
// @visibility external
//<
isc.ClassFactory.defineClass("Timeline", "Calendar");

isc.Timeline.addProperties({

showTimelineView: true,
showDayView: false,
showWeekView: false,
showMonthView: false,
showControlBar: false,

labelColumnWidth: 75,

sizeEventsToGrid: false,
eventDragGap: 0

});
