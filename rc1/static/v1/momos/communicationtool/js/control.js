
function onReceiveData(args) {
	$(".nav-header").text(args.title);
	var scope = angular.element(document.getElementById('controller')).scope();
	var microdatas = args.data;
	scope.$apply(function() {
		scope.microdatas = microdatas;
	});
	// TODO: listen to rendercomplete event
	setTimeout(function(){
		$('.title').css("opacity",1).dotdotdot();
	},10);
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
		window.open('Maps://?saddr=Current+Location&daddr=' + value);
	} else if (action === 'gmap') {
		var value = encodeURIComponent(data.trim());
		window.open('comgooglemaps://?saddr=Current+Location&daddr=' + value);
	} else if (action === 'email') {
		var value = data.trim();
		window.open('mailto:' + value);
	} else if (action === 'chrome') {
		var value = data.trim();
		window.open('googlechrome://' + value);
	} else if (action === 'safari') {
		var value = data.trim();
		window.open('http://' + value, '_blank');
	} else if (action === 'event') {
		var value = data.trim();
		window.open('x-apple-calevent://');
	} else if (action === 'photo') {
		var value = data.trim();
		window.open('photos-redirect:');
	} 
}

Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
}