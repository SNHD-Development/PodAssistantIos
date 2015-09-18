var util = require ("util");
var mockData = require("mockdata");
var async = require('async');

function getAuthHeader(){
	var username = "SnhdPodAssistantUser";
	var password = "09MJL54Yav8jnBD";
	var credentials = username + ':' + password;
	var authHeaderValue = 'Basic ' + Ti.Utils.base64encode(credentials);
	return authHeaderValue;
}

exports.getDefaultLotNumbers = function(){
	Alloy.Globals.DefaultDoxyLotNum = "";
	Alloy.Globals.DefaultCiproLotNum = "";
	if (Alloy.CFG.MockDataMode){
		Alloy.Globals.DefaultDoxyLotNum = "D12";
		Alloy.Globals.DefaultCiproLotNum = "D34";
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	var url = Alloy.CFG.ApiBaseUri + "PodAssistant/DefaultLotNumbers?podLocation=" + Alloy.Globals.PodLocation;
	xhr.open("GET", Alloy.CFG.ApiBaseUri + "PodAssistant/DefaultLotNumbers?podLocation=" + Alloy.Globals.PodLocation);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.onload = function() {
		var res = JSON.parse(this.responseText);
		if (res){
			Alloy.Globals.DefaultDoxyLotNum = res.DefaultDoxyLotNum;
			Alloy.Globals.DefaultCiproLotNum = res.DefaultCiproLotNum;
		}
	};
	xhr.onerror = function(e){
		console.log('in error');
		var err = "Error in getDefaultLotNumbers. Status Code: " + this.status + ', ' + e.code + e.error;
		console.log(err);
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
	};
	xhr.send();
};

exports.getLotNumbers = function(cb){
	if (Alloy.CFG.MockDataMode){
		cb(null, mockData.getLotNumbers());
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", Alloy.CFG.ApiBaseUri + "PodAssistant/LotNumbers?podLocation=" + Alloy.Globals.PodLocation);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.onload = function() {
		cb(null, JSON.parse(this.responseText));
	};
	xhr.onerror = function(e){
		var err = "Error in getLotNumbers. Status Code: " + this.status + ', ' + e.code + e.error;
		console.log(err);
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
		cb(true, null);
	};
	xhr.send();
};

exports.authenticate = function (username, password, cb){
	if (Alloy.CFG.MockDataMode){
		Alloy.Globals.PodLocation = "CANYONSPRINGS";
		cb(null,true);
		return;
	}
	username = username.toUpperCase().trim();
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", Alloy.CFG.ApiBaseUri + "PodAssistant/Authenticate?username=" + username + "&password=" + password);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.onload = function() {
		Alloy.Globals.PodLocation = username;
		cb(null, JSON.parse(this.responseText));
	};
	xhr.onerror = function(e){
		var err = "Error in authenticate. Status Code: " + this.status + ', ' + e.code + e.error;
		console.log(err);
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
		cb(true, 0);
	};
	xhr.send();
};

exports.getMsFormById = function (id, cb){
	if (Alloy.CFG.MockDataMode){
		cb(null, mockData.getMsForm());
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	var url = Alloy.CFG.ApiBaseUri + "form/" + id;
	xhr.open("GET", Alloy.CFG.ApiBaseUri + "form/" + id);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.onload = function() {
		cb(null, JSON.parse(JSON.parse(this.responseText)));
	};
	xhr.onerror = function(e){
		var err = "Error in getMsFormById. Status Code: " + this.status + ', ' + e.code + e.error;
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
		cb(true, null);
	};
	xhr.send();
};

exports.getSearchResults = function(firstName, lastName, phoneNumber, cb){
	if (Alloy.CFG.MockDataMode){
		cb (null, mockData.getSearchResults());
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", Alloy.CFG.ApiBaseUri + "PodAssistant/Search?firstName=" + firstName + 
		"&lastName=" + lastName + "&phoneNumber=" + phoneNumber);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.onload = function() {
		cb(null, JSON.parse(this.responseText));
	};
	xhr.onerror = function(e){
		var err = "Error in getMsFormById. Status Code: " + this.status + ', ' + e.code + e.error;
		console.log(err);
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
		cb(true, null);
	};
	xhr.send();
};

exports.getSignature = function(id, cb){
	if (Alloy.CFG.MockDataMode){
		cb (true, null);
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", Alloy.CFG.ApiBaseUri + "Files/" + id);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.onload = function() {
		cb(null, JSON.parse(this.responseData));
	};
	xhr.onerror = function(e){
		var err = "Error in getSignature. Status Code: " + this.status + ', ' + e.code + e.error;
		console.log(err);
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
		cb(true, null);
	};
	xhr.send();
};

function deleteOldSignature(id){
	if (Alloy.CFG.MockDataMode){
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("DELETE", Alloy.CFG.ApiBaseUri + "Files/" + id);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.onload = function() {
		console.log("Deleted signature successfully");
	};
	xhr.onerror = function(e){
		var err = "Error in delelteOldSignature. Status Code: " + this.status + ', ' + e.code + e.error;
		console.log(err);
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
	};
	xhr.send();
}

function saveSignature (form, cb){
	if (Alloy.CFG.MockDataMode){
		cb(null);
		return;
	}	
	
	if (form.Fields.YourSignature == null || form.Fields.YourSignature.length == 24){
		cb(null);
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	xhr.open('POST', Alloy.CFG.ApiBaseUri + "Files");
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.setRequestHeader('Content-Type', 'application/json');
	var sigData = form.Fields.YourSignature;
	var payload = {
		FileContentString: sigData,
		FileName: util.newGuid(),
		ContentType: "image/jpeg",
		FormName: "PODMedicalScreeningForm",
		MetaData:{
			FormName: "PODMedicalScreeningForm"
		}
	};
	var payload = JSON.stringify(payload);
	xhr.onload = function(){
		if (this.status == 201){
			var s = this.getResponseHeader("location").split('/');
			var id = s[s.length-1];
			form.Fields.YourSignature = id;
			cb(null);
		}else{
			cb(true);
		}
	};
	xhr.onerror = function(e){
		var err = "Error in saveSignature. Status Code: " + this.status + ", " + e.code + e.error;
		console.log(err);
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
		cb(true);
	};
	xhr.send(payload);
};

function saveFormContent(form, cb){
	if (Alloy.CFG.MockDataMode){
		cb(null);
		return;
	}
	var id = form._id.$oid;
	var xhr = Ti.Network.createHTTPClient();
	xhr.open('PUT', Alloy.CFG.ApiBaseUri + "Form/" + id);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.setRequestHeader('Content-Type', 'application/json');
	var payload = JSON.stringify(form);
	xhr.onload = function(){
		if (this.status == 204){
			cb(null);
		}else{
			cb(true);
		}
	};
	xhr.onerror = function(e){
		var err = "Error in saveFormContent. Status Code: " + this.status + ", " + e.code + e.error;
		Alloy.Globals.Tracker.trackException({
		    description: err,
		    fatal: false
		});
		cb(true);
	};
	xhr.send(payload);
}

exports.saveForm = function(form, cb){
	if (Alloy.CFG.MockDataMode){
		cb(null);
		return;
	}
	async.series([
	    function(callback){
	    	saveSignature(form,callback);
	    },
	    function(callback){
	    	saveFormContent(form, callback);
	    }
	],
	function(err, results){
		if (err){
			Alloy.Globals.Tracker.trackException({
			    description: err,
			    fatal: false
			});
			cb(true);
		}else{
			if (Alloy.Globals.OldSignatureId != ""){
				deleteOldSignature(Alloy.Globals.OldSignatureId);
				Alloy.Globals.OldSignatureId = "";
			}
			cb(null);
		}
	});
};
