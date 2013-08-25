var testCases1 = [{
	functionName : "onReceiveData",
	data : {
		title: "Chinese Restaurant",
		data: [{
			title: "ABC",
			data : "(415) 982-1234",
			type : "telephone"
		}, {
			title: "",
			data : "(415) 982-1234",
			type : "telephone"
		},{
			title: "Ramen Dojo",
			data : "805 S B St, San Mateo, CA 94401",
			type : "address"
		},{
			title: "Jeff Lin",
			data : "jeff@gmail.com",
			type : "email"
		},{
			title: "",
			data : "jeff@gmail.com",
			type : "email"
		}, {
			title: "",
			data : "805 S B St, San Mateo, CA 94401",
			type : "address"
		},{
			title: "ABC",
			data : "(415) 982-1234",
			type : "telephone"
		},{
			title: "ABC",
			data : "(415) 982-1234",
			type : "telephone"
		},{
			title: "ABC",
			data : "(415) 982-1234",
			type : "telephone"
		}, {
			title: "ABC",
			data : "(415) 982-1234",
			type : "telephone"
		},{
			title: "ABC",
			data : "(415) 982-1234",
			type : "telephone"
		},{
			title: "ABC",
			data : "(415) 982-1234",
			type : "telephone"
		}]
	}
}];
var testCases2 = [{
	functionName : "onReceiveData",
	data : {
		title: "Taco Restaurant",
		data: [{
			title: "URL",
			data : "http://www.yelp.com/search?find_desc=taco&find_loc=San+Mateo%2C+CA&ns=1",
			type : "url"
		}, {
			title: "9. China Village Seafood Restaurant",
			data : "asdfghjklkiuytrdfghjiuytghjjh@gmail.com",
			type : "email"
		}, {
			title: "Seafood Restaurant",
			data : "08/25/2013 14:30PM",
			type : "url"
		}]
	}
}];
var testCases3 = [{
	functionName : "onReceiveData",
	data : {
		title: "Taco Restaurant",
		data: [{
			title: "9. China Village Seafood Restaurafsasafasfsadfadsfadfdafadfafaeaaaefaewfe fnt 9. China Village Seafood Restaurant 9. China Village Seafood Restaurant 9. China Village Seafood Restaurant 9. China Village Seafood Restaurant9. China Village Seafood Restaurant 9. China Village Seafood Restaurant",
			data : "(415) 982-7877",
			type : "telephone"
		}]
	}
}];
var testSuite = [testCases1, testCases2, testCases3];
