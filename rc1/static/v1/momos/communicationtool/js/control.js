function onReceiveTitle(data) {
	$(".nav-header").text(data);
}
function onReceiveData(data) {
	console.log(data);
	var scope = angular.element(document.getElementById('controller')).scope();
	var microdatas = data;

	scope.$apply(function() {
		scope.microdatas = microdatas;
	})
}

function responeToAction(action, data) {
	if (action === 'phonecall') {
		var value = data.trim().replace(/[^0-9]/g, '').replace(' ', '');
		window.open('tel:' + value);
	} else if (action === 'sms') {
		var value = data.trim().replace(/[^0-9]/g, '').replace(' ', '');
		window.open('sms:' + value);
	} else if (action === 'map') {
		var value = encodeURIComponent(data.trim());
		window.open('http://maps.apple.com/?daddr=' + value);
	} else if (action === 'email') {
		var value = data.trim();
		window.open('mailto:' + value);
	}
}