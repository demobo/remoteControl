$(document).ready(function() {
	$('.tab-content').outerHeight($('body').height() - $('#header').outerHeight());
	non480x320Adjust();
	$('.done-button').on('vclick', function() {
		var str = $('.typing-area').val();
		if (!str)
			return;
		demobo.mobile.fireInputEvent('navigateTo', str);
		var entry = $('<div class="entry">' + str + '</div>').lettering(isWords(str) ? 'words' : null);
		$('#history').prepend(entry);
		// $('.typing-area').val('');
	});
	$('.typing-area').on('swipeleft', function() {
		$('.typing-area').val('');
	});
	var curSpan;
	$('body').on("vmousemove", ".entry span", function(e) {

	});
	$('body').on("vclick", ".tab-pane span, .tab-pane a", function(e) {
		console.log(this);
		var str = $(this).text() || $(this).attr('link');
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

function insertTextAtCursor(text) {
	var element = $('.typing-area')[0];
	element.focus();
	if (isWords(text) && $('.typing-area').val().length)
		text = ' ' + text;
	var e = document.createEvent('TextEvent');
	e.initTextEvent('textInput', true, true, null, text, 'zh-CN');
	element.dispatchEvent(e);
	// element.blur();
}

function isWords(str) {
	return /\ /.test(str) || /[\000-\177]/.test(str);
}