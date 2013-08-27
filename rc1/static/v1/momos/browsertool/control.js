$(document).ready(function() {
	$('.tab-content').outerHeight($('body').height() - $('#header').outerHeight());
	non480x320Adjust();
	$('.done-button').on('vclick', function() {
		var str = $('.typing-area').val();
		if (!str)
			return;
		demobo.mobile.fireInputEvent('navigateTo', str);
		var entry = $('<div class="entry">' + str + '</div>').lettering('words');
		$('#history').prepend(entry);
	});
	$('.typing-area').on('swipeleft', function() {
		$('.typing-area').val('');
	});
	var curSpan;
	$('body').on("vmousemove", ".entry span", function(e) {

	});
	$('body').on("vclick", ".tab-pane span, .tab-pane a", function(e) {
		console.log(this);
		var str = $(this).attr('link') || $(this).text();
		if (!str)
			return;
		demobo.mobile.fireInputEvent('navigateTo', str);
	});
});
function non480x320Adjust() {
	var screenWidth = $(window).width();
	// zoomAdjust for non iphones
	$('body').css('zoom', screenWidth / 320);
}
