var serviceAgent = require("serviceAgent");

var args = arguments[0] || {};

var searchResults = Alloy.Collections.searchResults; 

function tvSearchResults_onClick(e){
	Alloy.Globals.Loader.show();
	var formId = searchResults.at(e.index).get("formId");
	serviceAgent.getMsFormById(formId,cbFormLookupResult);
}

function cbFormLookupResult(err, form){
	Alloy.Globals.Loader.hide();
	if (err || form== null){
		return;
	}
	var view = Alloy.createController('Household',{
		msForm: form
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);
}

function init(){
	if (args.searchResults.length == 0){
		$.lblNoResults.visible = true;
		Alloy.Globals.Tracker.trackEvent({
		    category: "UserActions",
		    action: "No search results"
		});
	}
	var ds = [];
	args.searchResults.forEach(function(e){
		var member = new Backbone.Model({
			name: e.Name,
			phone: e.Phone,
			address: e.Address,
			formId: e.FormId
		});
		ds.push(member);
	});
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Search Results"
	});
	searchResults.reset(ds);
}

init();
