var testCases1 = [{
	functionName : "onReceiveTitle",
	data : "yelp.com"
}];
var testCases2 = [{
	functionName : "onReceiveData",
	data : [{
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
}];
var testCases3 = [{
	functionName : "onReceiveData",
	data : [{
		title: "ABC",
		data : "(415) 982-7877",
		type : "telephone"
	}]
}];
var testSuite = [testCases1, testCases2, testCases3];
