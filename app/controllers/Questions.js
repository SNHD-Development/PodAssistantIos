var serviceAgent = require("serviceAgent");
var args = arguments[0] || {};

function renderQA(){
	Alloy.Globals.Loader.hide();
	if (Alloy.Globals.FormSchema == null){
		alert ("Unable to load data");
	}
	var houseHoldMembers = _.find(Alloy.Globals.FormSchema.Fields, function(e){
		return e.Name == "HouseHoldMembers";
	});
	var questions = _.filter(houseHoldMembers.Fields, function (field){
		if (field.Name != null &&
			field.Name.substring(0,2) == "MQ")
			return true;
	});
	var a = [];
	questions.forEach(function(e){
		var qLabel = $.UI.create("Label", {
			classes: ["cQ"],
			text: e.DescriptionPlainText
		});
		a.push(qLabel);
		var answer = args.data[e.Name].toUpperCase();
		var aLabel = $.UI.create("Label", {
			classes: ["cA"],
			color: answer == "YES" || answer == "UNSURE" ? "#e52f0c" : "#5ba710",
			text: answer
		});
		a.push(aLabel);
	});
	a.push(Ti.UI.createLabel({
		height: 20
	}));
	$.svMain.add(a);
}

function init(){
	$.winQ.title = args.data.MemberName_fullname_first_name + " " + args.data.MemberName_fullname_last_name;
	if (Alloy.Globals.FormSchema == null){
		Alloy.Globals.Loader.show();
		serviceAgent.getFormSchema(renderQA);
	}else{
		renderQA();
	}
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Questions"
	});
}

init();
