var qrreader = require("com.acktie.mobile.ios.qr"); 

var args = arguments[0] || {};

var qrCodeView;

function btnClose_onClose(){
	qrCodeView.stop();
	$.Scanner.close();
}

function sLight_onChange(e){
	if (e.value) {
		qrCodeView.turnLightOn();
	} else {
		qrCodeView.turnLightOff();
	}
}

function cancel() {
	console.log('QR Reader Cancel');
};

function success(data) {
	if (data != undefined && data.data != undefined) {
		Titanium.Media.vibrate();
		qrCodeView.stop();
		$.Scanner.close();
		args.onScannerResult(null, data.data);
	}else{
		args.onScannerResult(true);
	}
};

function init(){
	var options = {
		backgroundColor : 'black',
		width : '100%',
		height : '100%',
		top : 0,
		left : 0,
		zIndex: -1,
		success : success,
		cancel : cancel
	};
	qrCodeView = qrreader.createQRCodeView(options);
	$.Scanner.add(qrCodeView);
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Scanner"
	});
}

init();
