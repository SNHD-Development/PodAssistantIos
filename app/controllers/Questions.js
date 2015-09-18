var args = arguments[0] || {};

function setLabel(label, text){
	text = text.toUpperCase();
	if (text == "YES" || text == "UNSURE"){
		label.color = "#e52f0c";
	}else{
		label.color = "#5ba710";
	}
	label.text = text;
}

function init(){
	$.winQ.title = args.data.MemberName_fullname_first_name + " " + args.data.MemberName_fullname_last_name;
	setLabel($.lblDialysis,args.data.MQDialysis);
	setLabel($.lblSeizure,args.data.MQSeizure);
	setLabel($.lblUnderWeight,args.data.MQUnderWeight);
	setLabel($.lblAllergicCycline,args.data.MQAllergicCycline);
	setLabel($.lblTakingDigoxin,args.data.MQTakingDigoxin);
	setLabel($.lblAllergicFloxacin,args.data.MQAllergicFloxacin);
	setLabel($.lblTakingCoumadin,args.data.MQTakingCoumadin);
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Questions"
	});
}

init();
