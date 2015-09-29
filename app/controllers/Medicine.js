var serviceAgent = require("serviceAgent");
var util = require ("util");

var args = arguments[0] || {};

$.cbMedicineSaved = args.cbMedicineSaved;

function winMedicine_onClick(){
	removeKeyboard();
}

function removeKeyboard(){
	$.txtType.blur();
	$.txtLot.blur();
	$.taComment.blur();
}

function btnSave_onClick(){
	if (args.medicine.LotNumber != $.txtLot.value.trim()){
		Alloy.Globals.Tracker.trackEvent({
		    category: "UserActions",
		    action: "Changed lot number",
		    label: args.medicine.MemberName_fullname_first_name + " " + args.medicine.MemberName_fullname_last_name
		});
	}
	args.medicine.LotNumber = $.txtLot.value.trim();
	args.medicine.Comment = $.taComment.value;
	args.medicine.PickedUp = $.tbPickedUp.index == 0 ? true : false;
	if (args.medicine.PickedUp == false){
		args.medicine.PickedUpLocation = "";
	}else{
		args.medicine.PickedUpLocation = Alloy.Globals.PodLocation;
	}
	args.medicine.Medicine = util.getMedicineShortName($.txtType.value);
	$.cbMedicineSaved();
	$.winMedicine.close();
}

function picker_onDone(e){
	if (e.data == null)
  		return;
  	var value = e.data[0].value;
  	$.txtType.setValue(value);
  	switch (value){
  		case "Doxycycline":
  			$.txtLot.value = Alloy.Globals.DefaultDoxyLotNum;
  			break;
  		case "Ciprofloxacin":
  			$.txtLot.value = Alloy.Globals.DefaultCiproLotNum;
  			break;
  		case "Medical":
  			break;
  		default:
  			break;
  	}
}

function txtType_onClick(){
	removeKeyboard();
	setupPicker();
}

function txtType_onFocus(){
	removeKeyboard();
	setupPicker();
}

function btnQ_onClick(){
	var view = Alloy.createController('Questions',{
		data: args.medicine
	}).getView();
	Alloy.Globals.nwMain.openWindow(view);
}

function setupPicker(){
	$.txtType.blur();
	Alloy.createWidget('danielhanold.pickerWidget', {
	  id: 'mySingleColumn',
	  outerView: $.winMedicine,
	  hideNavBar: false,
	  type: 'single-column',
	  selectedValues: [args.medicine.Medicine.toUpperCase()],
	  pickerValues: [{"C": "Ciprofloxacin", "D": "Doxycycline", "M": "Medical"}],
	  onDone: picker_onDone
	});
}

function init(){
	$.winMedicine.title = args.medicine.MemberName_fullname_first_name + " " + args.medicine.MemberName_fullname_last_name;
	$.tbPickedUp.index = args.medicine.PickedUp ? 0 : 1;
	$.txtType.value = util.getMedicineLongName(args.medicine.Medicine);
	$.txtLot.value = args.medicine.LotNumber;
	$.taComment.value = args.medicine.Comment == null ? "" : args.medicine.Comment;
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Medicine"
	});
}

init();
