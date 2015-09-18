// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var GA = require("analytics.google");
GA.dryRun = false;
GA.dispatchInterval = 10;
Alloy.Globals.Tracker = GA.getTracker("UA-67738110-1");

Alloy.Globals.Loader = Alloy.createWidget('com.caffeinalab.titanium.loader', {
    message: "Loading...",
    cancelable: true,
    useImages: false
});

Alloy.Collections.isTablet = Ti.Platform.osname === "ipad";
Alloy.Collections.houseMembers = new Backbone.Collection();
Alloy.Collections.searchResults = new Backbone.Collection();

Alloy.Globals.isiOS4 = false;
if (Titanium.Platform.model == "iPhone3,1" ||
	Titanium.Platform.model == "iPhone3,3" ||
	Titanium.Platform.model == "iPhone4,1"){
	Alloy.Globals.isiOS4 = true;
}	

