var serviceAgent = require('serviceAgent');

function doClick(e) {
	var mf = serviceAgent.getMockForm();
	console.log(mf);
    alert(serviceAgent.getIt());
}

function btnLogin_onClick(){
	var view = Alloy.createController('Search',{}).getView();
	view.open();
}

$.index.open();
