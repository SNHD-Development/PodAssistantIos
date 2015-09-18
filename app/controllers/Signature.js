var args = arguments[0] || {};

Titanium.App.addEventListener("app:signature:capture", function(e){
	$.winSignature.close();
	args.onSave(e);
});

function btnBack_onClick(){
	$.winSignature.close();
}

function btnClear_onClick(){
	$.sigCapture.clear();
}

function btnSave_onClick(){
	$.sigCapture.save();
}

function init(){
	$.winSignature.hideNavBar();
	var commandButtonHeight = 60;
	var widthMultiplier = parseInt(Ti.Platform.displayCaps.platformHeight / Alloy.CFG.SignatureImageWidth);
	var heightMultiplier = parseInt((Ti.Platform.displayCaps.platformWidth - commandButtonHeight) / Alloy.CFG.SignatureImageHeight);
	var multiplier = widthMultiplier > heightMultiplier ? heightMultiplier : widthMultiplier;
	multiplier = multiplier <= 0 ? 1 : multiplier;
	if (!Alloy.Collections.isTablet){
		$.winSignature.setOrientationModes([Titanium.UI.LANDSCAPE_LEFT]);	
	}
	$.sigCapture.init({
	    borderColor:" #aaa",
		width: multiplier * Alloy.CFG.SignatureImageWidth,
		height: multiplier * Alloy.CFG.SignatureImageHeight
	});
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Signature"
	});
}

init();
