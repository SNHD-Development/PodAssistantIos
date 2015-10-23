var serviceAgent = require('serviceAgent');
var animation = require('alloy/animation');
var async = require('async');
var privateConfig;

try{
	privateConfig = require("privateconfig");
}catch(e){
}
 
function btnLogin_onClick(){
	Alloy.Globals.Loader.show();
	if (($.txtUsername.value == "" && $.txtPassword.value == "") &&
		(Ti.App.deployType == "test" || Ti.App.deployType == "development")){
		if (privateConfig){
			$.txtUsername.value = privateConfig.getData().PodLocation;
			$.txtPassword.value = privateConfig.getData().PodLocationPassword;	
		}
	}
	serviceAgent.authenticate($.txtUsername.value, $.txtPassword.value, cbAuth);
}

function cbAuth(err, success){
	Alloy.Globals.Loader.hide();
	if (err || !success){
		animation.shake($.btnLogin,30);
		$.lblAuthResult.text = "Login not successful";
		animation.fadeIn($.lblAuthResult, 30);
		Alloy.Globals.Tracker.trackEvent({
		    category: "UserActions",
		    action: "Login failure"
		});
	}else{
		serviceAgent.getDefaultLotNumbers();
		serviceAgent.getFormSchema();
		animation.fadeOut($.lblAuthResult, 1);
		var view = Alloy.createController('Search',{}).getView();
		Alloy.Globals.nwMain.openWindow(view);
		Alloy.Globals.Tracker.trackEvent({
		    category: "UserActions",
		    action: "Login success"
		});
	}
}

function winIndex_onClick(){
	$.txtUsername.blur();
	$.txtPassword.blur();
}

function txtUsername_onChange(){
	$.txtUsername.value = $.txtUsername.value.toUpperCase();
}

function init(){
	animation.fadeIn($.winIndex, 2000);
	Alloy.Globals.nwMain = $.nwMain;
	$.winIndex.hideNavBar();
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Login"
	});
}
console.log('console output works');
init();

$.nwMain.open();
