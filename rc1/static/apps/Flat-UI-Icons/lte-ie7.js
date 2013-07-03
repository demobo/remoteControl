/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Flat-UI-Icons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'fui-double-angle-down' : '&#xf103;',
			'fui-angle-down' : '&#xf107;',
			'fui-chevron-down' : '&#xf078;',
			'fui-arrow-down' : '&#xf063;',
			'fui-caret-down' : '&#xf0d7;',
			'fui-backward' : '&#xf04a;',
			'fui-forward' : '&#xf04e;',
			'fui-share-alt' : '&#xf064;',
			'fui-fast-forward' : '&#xf050;',
			'fui-step-forward' : '&#xf051;',
			'fui-search' : '&#xf002;',
			'fui-off' : '&#xf011;',
			'fui-cog' : '&#xf013;',
			'fui-trash' : '&#xf014;',
			'fui-home' : '&#xf015;',
			'fui-remove' : '&#xf00d;',
			'fui-ok' : '&#xf00c;',
			'fui-heart' : '&#xf004;',
			'fui-repeat' : '&#xf01e;',
			'fui-refresh' : '&#xf021;',
			'fui-qrcode' : '&#xf029;',
			'fui-camera' : '&#xf030;',
			'fui-play' : '&#xf04b;',
			'fui-pause' : '&#xf04c;',
			'fui-stop' : '&#xf04d;',
			'fui-eject' : '&#xf052;',
			'fui-info-sign' : '&#xf05a;',
			'fui-question-sign' : '&#xf059;',
			'fui-remove-circle' : '&#xf05c;',
			'fui-arrow-left' : '&#xf060;',
			'fui-arrow-right' : '&#xf061;',
			'fui-arrow-up' : '&#xf062;',
			'fui-exclamation-sign' : '&#xf06a;',
			'fui-chevron-up' : '&#xf077;',
			'fui-camera-retro' : '&#xf083;',
			'fui-facebook-sign' : '&#xf082;',
			'fui-pushpin' : '&#xf08d;',
			'fui-phone' : '&#xf095;',
			'fui-phone-sign' : '&#xf098;',
			'fui-google-plus-sign' : '&#xf0d4;',
			'fui-group' : '&#xf0c0;',
			'fui-mobile' : '&#xf10b;',
			'fui-laptop' : '&#xf109;',
			'fui-desktop' : '&#xf108;',
			'fui-tablet' : '&#xf10a;',
			'fui-quote-left' : '&#xf10d;',
			'fui-quote-right' : '&#xf10e;',
			'fui-spinner' : '&#xf110;',
			'fui-reply' : '&#xf112;',
			'fui-circle-blank' : '&#xf10c;',
			'fui-circle' : '&#xf111;',
			'fui-connection' : '&#xe000;',
			'fui-happy' : '&#xe001;',
			'fui-smiley' : '&#xe002;',
			'fui-tongue' : '&#xe003;',
			'fui-sad' : '&#xe004;',
			'fui-wink' : '&#xe005;',
			'fui-grin' : '&#xe006;',
			'fui-cool' : '&#xe007;',
			'fui-angry' : '&#xe008;',
			'fui-evil' : '&#xe009;',
			'fui-shocked' : '&#xe00a;',
			'fui-confused' : '&#xe00b;',
			'fui-neutral' : '&#xe00c;',
			'fui-wondering' : '&#xe00d;',
			'fui-rss' : '&#xe00e;',
			'fui-movie' : '&#xe00f;',
			'fui-equalizer' : '&#xe010;',
			'fui-magnifying-glass' : '&#xe011;',
			'fui-layers-alt' : '&#xe012;',
			'fui-calendar' : '&#xf20f;',
			'fui-equalizer2' : '&#xf18f;',
			'fui-safari' : '&#xe013;',
			'fui-chrome' : '&#xe014;',
			'fui-IE' : '&#xe015;',
			'fui-firefox' : '&#xe016;',
			'fui-list-bulleted' : '&#xe017;',
			'fui-list-numbered' : '&#xe018;',
			'fui-keyboard' : '&#xe019;',
			'fui-keyboarddelete' : '&#xf3a6;',
			'fui-envelope-alt' : '&#xf0e0;',
			'fui-envelope' : '&#xf003;',
			'fui-address-book' : '&#xe01a;',
			'fui-address' : '&#xf08f;',
			'fui-pencil' : '&#xf040;',
			'fui-pencil-2' : '&#xe01b;',
			'fui-reorder' : '&#xf0c9;',
			'fui-th-list' : '&#xf00b;',
			'fui-play-circle' : '&#xf01d;',
			'fui-controllersnes' : '&#xf2d3;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/fui-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};