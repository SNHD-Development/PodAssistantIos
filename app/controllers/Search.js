var serviceAgent = require('serviceAgent');
var args = arguments[0] || {};

function vLogout_onClick(){
	$.winSearch.close();
}
 
function btnQr_onClick(){
	var view = Alloy.createController('Scanner',{
		onScannerResult: cbScannerResult
	}).getView();
	view.open({modal:true});
}

function cbScannerResult(err, formId){
	if (err){
		alert ("Unable to scan QR code");
		return;
	}
	var isValidMongoId = formId.length == 24;
	if (!isValidMongoId){
		alert ("That was not an acceptable QR code.");
		return;
	}
	serviceAgent.getMsFormById(formId,cbFormLookupResult);
}

function cbFormLookupResult(err, d){
	if (err || d == null){
		alert ("Unable to open form");
		return;
	}
	var view = Alloy.createController('Household',{
		msForm: d
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);	
}

function cbSearchResults(err, searchResults){
	$.btnSearch.enabled = true;
	Alloy.Globals.Loader.hide();
	if (err || searchResults == null){
		$.toast = Alloy.createWidget('net.beyondlink.toast');
		$.winSearch.add($.toast.getView());
		$.toast.error("Unable to load search results");
		return;
	}
	var view = Alloy.createController('SearchResults',{
		searchResults: searchResults
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);
	$.txtFirstName.value = "";
	$.txtLastName.value = "";
	$.txtPhoneNumber.value = "";
}

function vGears_onClick(){
	var view = Alloy.createController('Options',{
		
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);
}

function btnSearch_onClick(){
	var firstName = $.txtFirstName.value.trim();
	var lastName = $.txtLastName.value.trim();
	var phoneNumber = $.txtPhoneNumber.value.trim();
	
	if ((Ti.App.deployType == "test" || Ti.App.deployType == "development") &&
		(!firstName && !lastName)){
		firstName = "Fred";
		lastName = "Jones";
	}
	if (!phoneNumber && !firstName && !lastName){
		alert ("Please enter search criteria");
		return;
	}
	if (!phoneNumber && firstName && !lastName){
		alert ("Please also enter a last name to search");
		return;
	}
	Alloy.Globals.Loader.show();
	$.btnSearch.enabled = false;
	serviceAgent.getSearchResults(firstName,lastName,phoneNumber,cbSearchResults);
	 
}

function winSearch_onClick(){
	$.txtFirstName.blur();
	$.txtLastName.blur();
	$.txtPhoneNumber.blur();
}


function init(){
	$.btnQr.height = Ti.Platform.displayCaps.platformHeight / 3;
	$.vManualSearch.top = 60;
	$.winSearch.hideNavBar();
	if (Alloy.Globals.isiOS4){
		$.btnLogout.left = 0;
		$.btnLogout.bottom = 30;
	}
	$.lblPodLocation.text = Alloy.Globals.PodLocation.toUpperCase();
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Search"
	});
}

init();
