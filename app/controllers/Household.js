var serviceAgent = require("serviceAgent");
var imageFactory = require('ti.imagefactory');

var args = arguments[0] || {};

$.msForm = args.msForm;
$.toast = Alloy.createWidget('net.beyondlink.toast');
$.winHousehold.add($.toast.getView());
var houseMembers = Alloy.Collections.houseMembers; 

function setlblSpecialColor(needAssistance){
	if (typeof(needAssistance)=="string" && needAssistance.toLowerCase() == "true")
		needAssistance = true;
	else if (typeof(needAssistance)=="string" && needAssistance.toLowerCase() == "false")
		needAssistance = false;
		
	if (needAssistance){
		$.lblSpecial.color = "#e52f0c";
		$.lblSpecial.text = "Yes";
	} else if (!needAssistance){
		$.lblSpecial.color = "#5ba710";
		$.lblSpecial.text = "No";
	} else{
		$.lblSpecial.color = "#e52f0c";
		$.lblSpecial.text = "Unknown";
	}
}

function vCheckContainer_onClick(e){
	e.cancelBubble = true;
	var pickedUp = $.msForm.Fields.HouseHoldMembers[e.index].PickedUp;
	if (pickedUp){
		$.msForm.Fields.HouseHoldMembers[e.index].PickedUp = false;
		e.source.image = "/images/empty_check.png";
	}else{
		$.msForm.Fields.HouseHoldMembers[e.index].PickedUp = true;
		e.source.image = "/images/check.png";
	}
	Alloy.Globals.PendingChanges = true;
}

function row_onTouchStart(e){
	e.source.animate({
		backgroundColor: "#ccc",
  		duration: 100,
  		curve: Titanium.UI.ANIMATION_CURVE_EASE_IN
	});
}

function row_onTouchEnd(e){
	e.source.animate({
		backgroundColor: "transparent",
  		duration: 250,
  		curve: Titanium.UI.ANIMATION_CURVE_EASE_OUT
	});
}

function tvMembers_onClick(e){
	var m = $.msForm.Fields.HouseHoldMembers[e.index];
	var view = Alloy.createController('Medicine',{
		medicine: m,
		cbMedicineSaved : cbMedicineSaved,
		msForm: $.msForm
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);
}

function cbMedicineSaved(){
	refreshMembersTable();
}

function refreshMembersTable(){
	var ds = [];
	$.msForm.Fields.HouseHoldMembers.forEach(function(e){
		var patientName = e.MemberName_fullname_first_name + " " + e.MemberName_fullname_last_name;
		patientName = patientName.substring(0, 24);
		var member = new Backbone.Model({
			patientData: patientName,
			checkedImage: e.PickedUp ? "/images/check.png" : "/images/empty_check.png",
			medicine: e.Medicine
		});
		ds.push(member);
	});
	houseMembers.reset(ds);
}

function isSignatureCaptured(){
	if (Alloy.Globals.SignatureCaptured){
		return true;
	}
	if ($.msForm.Fields.YourSignature != null &&
		$.msForm.Fields.YourSignature.length == 24){
		return true;		
	}
	return false;
}

function isAllowedToSave(){
	if (medicalPickUpEnabled()){
		alert ("M - Medical, is not a valid pick up type");
		return false;
	}
	return true;
}

function saveChanges(){
	Alloy.Globals.Tracker.trackEvent({
	    category: "UserActions",
	    action: "Save Clicked"
	});
	setPickedUpLocation();
	Alloy.Globals.Loader.show();
	$.msForm.Status = getSaveFormStatus();
	serviceAgent.saveForm($.msForm, cbFormSaved);
}

function setPickedUpLocation(){
	$.msForm["Fields"]["HouseHoldMembers"].forEach(function(e){
		if (e.PickedUp){
			e.PickedUpLocation = Alloy.Globals.PodLocation;	
		}else{
			e.PickedUpLocation = '';
		}	
	});	
}

function btnComplete_onClick(){
	if (!isAllowedToSave()){
		return;
	}
	if (!isSignatureCaptured()){
		$.odSaveNoSignature.show();		
		return;
	}
	saveChanges();
}

function medicalPickUpEnabled(){
	var arr = $.msForm.Fields.HouseHoldMembers;
	for (var i = 0; i < arr.length; i++){
		if (arr[i].Medicine == "M" && arr[i].PickedUp){
			return true;
		}
	}
}

function getSaveFormStatus(){
	var status = "Pending";
	var sigCaptured = isSignatureCaptured();
	$.msForm.Fields.HouseHoldMembers.forEach(function(e){
		if (e.PickedUp == true && sigCaptured){
			status = "Completed";
		}
	});
	return status;
}

function cbFormSaved(err){
	Alloy.Globals.Loader.hide();
	if (err){
		$.toast.error("Error in saving");
		return;
	}
	Alloy.Globals.SavedForm = true;
	$.toast.success("Saved successfully!");
	Alloy.Globals.Tracker.trackEvent({
	    category: "UserActions",
	    action: "Save successful"
	});
	setTimeout(function(){
		$.winHousehold.close();
	}, 2000);
}

function cbUpdateSignature(e){
	$.toast.info ("You have pending changes to save");
	var imageDataBase64 = e.data.replace(/^data:image\/(png|jpg);base64,/, "");
	var imageData = Ti.Utils.base64decode(imageDataBase64);	
	var resizedImageData = imageFactory.imageAsResized(imageData, {
		width: 560,
		height: 300,
		quality: imageFactory.QUALITY_LOW
	});
	var resizedImageData = imageFactory.compress(resizedImageData, 0.1);
	var resizedBase64ImageData = Ti.Utils.base64encode(resizedImageData);
	$.ivSignature.image = resizedImageData;
	if ($.msForm.Fields.YourSignature != null && $.msForm.Fields.YourSignature.length == 24){
		Alloy.Globals.OldSignatureId = $.msForm.Fields.YourSignature;
	}
	$.msForm.Fields.YourSignature = resizedBase64ImageData.toString();
	$.lblGetSignature.visible = false;
}

function vSignature_onClick(){
	var view = Alloy.createController('Signature',{
		onSave: cbUpdateSignature
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);
}

function setDefaultPickup(){
	$.msForm.Fields.HouseHoldMembers.forEach(function(e){
		if (e.PickedUp == null){
			e.PickedUp = false;	
		}
		if (e.LotNumber != null && e.LotNumber != ''){
			return;
		}
		switch (e.Medicine){
			case "D":
				e.LotNumber = Alloy.Globals.DefaultDoxyLotNum;
				break;
			case "C":
				e.LotNumber = Alloy.Globals.DefaultCiproLotNum;
				break;
			default:
				e.LotNumber = "";
				break;
		}
	});
}
 
function cbSignatureLoaded(err, d){
	if (err || d == null){
		return;
	}
	$.ivSignature.image = Ti.Utils.base64decode(d.FileContentString);
	$.lblGetSignature.visible = false;
}

function setStatusLabel(status){
	if (status == "Completed"){
		$.lblStatus.color = "#5ba710";
	}
	$.lblStatus.text = status;
}

function odSave_onClick(e){
	if (e.index == 0){
		btnComplete_onClick();
	}else{
		$.winHousehold.close();
	}
}

function odSaveNoSignature_onClick(e){
	if (e.index == 0){
		saveChanges();
	}
}

function btnBack_onClick(){
	if (!Alloy.Globals.SavedForm && Alloy.Globals.PendingChanges){
		$.odSave.show();
	}else{
		$.winHousehold.close();
	}
}

function init(){
	Alloy.Globals.SignatureCaptured = false;
	Alloy.Globals.PendingChanges = false;
	Alloy.Globals.SavedForm = false;
	Alloy.Globals.OldSignatureId = "";
	setStatusLabel($.msForm.Status);
	$.lblPhone.text = $.msForm.Fields.YourPhone;
	var addr = $.msForm.Fields.YourAddress_address_street + "\n" +
		$.msForm.Fields.YourAddress_address_city + ", " + 
		$.msForm.Fields.YourAddress_address_state + " " +
		$.msForm.Fields.YourAddress_address_zip;
	$.lblAddress.text = addr;
	setlblSpecialColor($.msForm.Fields.NeedSpecialAccommodations);
	setDefaultPickup();
	refreshMembersTable();
	if ($.msForm.Fields.YourSignature != null){
		serviceAgent.getSignature($.msForm.Fields.YourSignature, cbSignatureLoaded);
	}
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Household"
	});
}

init();
