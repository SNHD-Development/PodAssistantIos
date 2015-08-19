
exports.getIt = function(){
	return 'foo3';
};

exports.getMockForm = function(){
	return {
	    "Fields" : {
	        "members" : [
	            {
	                "member_fullname_first_name" : "Donald", 
	                "member_fullname_last_name" : "Duck", 
	                "q_a" : "0", 
	                "q_b" : "0", 
	                "q_c" : "0", 
	                "q_d" : "0", 
	                "q_e" : "0", 
	                "medicine" : "D"
	            }, 
	            {
	                "member_fullname_first_name" : "Daisy", 
	                "member_fullname_last_name" : "Duck", 
	                "q_a" : "0", 
	                "q_b" : "1", 
	                "q_c" : "0", 
	                "q_d" : "0", 
	                "q_e" : "0", 
	                "medicine" : "C"
	            }, 
	            {
	                "member_fullname_first_name" : "Huey", 
	                "member_fullname_last_name" : "Duck", 
	                "q_a" : "1", 
	                "q_b" : "0", 
	                "q_c" : "0", 
	                "q_d" : "0", 
	                "q_e" : "0", 
	                "medicine" : "D"
	            }, 
	            {
	                "member_fullname_first_name" : "Louie", 
	                "member_fullname_last_name" : "Duck", 
	                "q_a" : "0", 
	                "q_b" : "1", 
	                "q_c" : "0", 
	                "q_d" : "1", 
	                "q_e" : "0", 
	                "medicine" : "M"
	            }
	        ], 
	        "employer_code" : "UMC201306", 
	        "location_name" : "University Medical Center", 
	        "location_address" : "1800 W Charleston Blvd", 
	        "location_city" : "Las Vegas", 
	        "location_state" : "NV", 
	        "location_zipcode" : "89102", 
	        "phone" : "(702) 555-1234", 
	        "street_address" : "3456 Decatur Rd.", 
	        "city" : "Las Vegas", 
	        "state" : "NV", 
	        "zipcode" : "89144", 
	        "pick_up" : [
	            "Picking up medication for myself", 
	            "Picking up medication for others"
	        ]
	    }, 
	    "Name" : "MedicalScreeningForm",
	};
};
