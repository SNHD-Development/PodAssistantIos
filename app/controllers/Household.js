var serviceAgent = require("serviceAgent");
var imageFactory = require('ti.imagefactory');

var args = arguments[0] || {};

$.msForm = args.msForm;
var houseMembers = Alloy.Collections.houseMembers; 

function setlblSpecialColor(needSpecialAssistance){
	needSpecialAssistance = needSpecialAssistance.toLowerCase();
	if (needSpecialAssistance == "false"){
		$.lblSpecial.color = "#5ba710";
		$.lblSpecial.text = "No";
	}else{
		$.lblSpecial.color = "#e52f0c";
		$.lblSpecial.text = "Yes";
	}
}

function tvMembers_onClick(e){
	var m = $.msForm.Fields.HouseHoldMembers[e.index];
	var view = Alloy.createController('Medicine',{
		medicine: m,
		cbMedicineSaved : cbMedicineSaved
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);
}

function cbMedicineSaved(){
	refreshMembersTable();
}

function refreshMembersTable(){
	var ds = [];
	$.msForm.Fields.HouseHoldMembers.forEach(function(e){
		var member = new Backbone.Model({
			patientData: e.MemberName_fullname_first_name + " " + e.MemberName_fullname_last_name,
			checkedImage: e.PickedUp == null || e.PickedUp == true ? "/images/check.png" : "",
			medicine: e.Medicine
		});
		ds.push(member);
	});
	houseMembers.reset(ds);
}

function btnSave_onClick(){
	Alloy.Globals.Tracker.trackEvent({
	    category: "UserActions",
	    action: "Save Clicked"
	});
	Alloy.Globals.Loader.show();
	$.msForm.Status = "Completed";
	serviceAgent.saveForm($.msForm, cbFormSaved);
}

function cbFormSaved(err){
	Alloy.Globals.Loader.hide();
	$.toast = Alloy.createWidget('net.beyondlink.toast');
	$.winHousehold.add($.toast.getView());
	if (err){
		$.toast.error("Error in saving");
		return;
	}
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
			e.PickedUp = true;	
		}
		if (e.PickedUpLocation == null){
			e.PickedUpLocation = Alloy.Globals.PodLocation;	
		}
		if (e.LotNumber != null)
			return;
		
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

function init(){
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
