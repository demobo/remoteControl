function init() {
	$("#logo01").drawImage( {
		source : "iphone_4s_mock_up.svg",
		x : 0,
		y : 0,
		sWidth: 512,
		sHeight: 220,
		sx: 3, 
		sy: 0,
		scale : 1,
		fromCenter: false
	});
}

$(document).ready(init);