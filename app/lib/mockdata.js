
exports.getMsForm = function(){
	return {
	    "Name" : "PODMedicalScreeningForm",
	    "Fields" : {
	        "HouseHoldMembers" : [
	            {
	                "MemberName_fullname_first_name" : "Tharindu",
	                "MemberName_fullname_last_name" : "Abeygunawardana",
	                "MQDialysis" : "No",
	                "MQUnderWeight" : "Yes",
	                "MQAllergicCycline" : "Unsure",
	                "MQTakingDigoxin" : "No",
	                "MQAllergicFloxacin" : "No",
	                "MQTakingCoumadin" : "No",
	                "Medicine" : "D"
	            },
	            {
	                "MemberName_fullname_first_name" : "Mary",
	                "MemberName_fullname_last_name" : "Jones",
	                "MQDialysis" : "No",
	                "MQUnderWeight" : "No",
	                "MQAllergicCycline" : "Unsure",
	                "MQTakingDigoxin" : "No",
	                "MQAllergicFloxacin" : "No",
	                "MQTakingCoumadin" : "Yes",
	                "Medicine" : "C"
	            },
	            {
	                "MemberName_fullname_first_name" : "Fred",
	                "MemberName_fullname_last_name" : "Jones",
	                "MQDialysis" : "Yes",
	                "MQUnderWeight" : "Yes",
	                "MQAllergicCycline" : "Unsure",
	                "MQTakingDigoxin" : "No",
	                "MQAllergicFloxacin" : "No",
	                "MQTakingCoumadin" : "No",
	                "Medicine" : "M"
	            }
	        ],
	        "PODLocationCode" : "WYNNLV",
	        "YourPhone" : "(122) 212-1231",
	        "YourAddress_address_country" : "US",
	        "YourAddress_address_street" : "331 Main St.",
	        "YourAddress_address_city" : "Las Vegas",
	        "YourAddress_address_state" : "NV",
	        "YourAddress_address_zip" : "89129",
	        "NeedSpecialAccommodations" : "false"
	    },
	    "Status" : "Pending"
	};
};

exports.getLotNumbers = function(){
	return {
		"Cipro":[
			"12",
			"34"
		],
		"Doxy":[
			"56"
		]
	};	
};

exports.getSearchResults = function(){
	return [{
			"Name": "Bob Jones",
			"Phone": "702-424-2412",
			"Address": "331 Main St. Las Vegas, NV 89129",
			"FormId": 1
		},{
			"Name": "Mary Jones",
			"Phone": "702-424-2412",
			"Address": "331 Main St. Las Vegas, NV 89129",
			"FormId": 2
		},{
			"Name": "Tom Jones",
			"Phone": "702-424-2412",
			"Address": "331 Main St. Las Vegas, NV 89129",
			"FormId": 3
		}
	];
};

