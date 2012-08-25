/* setting */
if (DEMOBO) {
	DEMOBO.developer = 'developer@demobo.com';
	DEMOBO.controller = {
		"page" : "default"
	};
	DEMOBO.maxPlayers = 1;
	DEMOBO.stayOnBlur = true;
	var imgID = 0;
	DEMOBO.init = function() {
		if (localStorage.getItem("url"))
			$('#url').val(localStorage.getItem("url"));
		demobo.addEventListener('input', function(e) {
			console.log(e.source,e.value);
			var messageCss = {
				'font-size' : 50,
				'color' : '#433',
				'position' : 'absolute',
				'text-align' : 'center',
				'width' : '30%',
				'right' : '0%',
				'top' : '10%'
			};
			if (e.source) $('#eventSource').text(e.source).css(messageCss).show().fadeOut(1000);
			messageCss.top = '30%';
			if (e.value) $('#eventValue').text(e.value).css(messageCss).show().fadeOut(1000);
		}, false);
		$('button#set').click(
				function() {
					var url = "http://net.demobo.com/server/upload/" + roomID
							+ ".html?" + Math.random();
					var c = {
							page : "default",
							url : url,
							touchEnabled : true
						};
					if (!$('#orientation').is(':checked')) c.orientation = "portrait";
					demobo.setController(c);
					$('iframe').attr('src', localStorage.getItem("url"));
					$('#controllerUrl').attr('href', url);
				});
		$('button#upload').click(function() {
			$.get($('#url').val(), function(data) {
				$.ajax( {
					type : 'POST',
					url : "http://net.demobo.com/server/upload.php",
					crossDomain : true,
					data : {
						data : data,
						roomID : roomID
					},
					dataType : 'json',
					success : function() {
						$('button#set').click();
					}
				});
				localStorage.setItem("url", $('#url').val());
			});
		});
		$('button#test').click(function() {
			var testfile = 'test.js';
			if ($('#url').val().split("/").length == 3)
				testfile = $('#url').val() + "/" + testfile;
			$.getScript(testfile, function(data, textStatus, jqxhr) {
				for ( var i = 0; i < testCases.length; i++) {
					var test = testCases[i];
					console.log(test.fn, test.param);
					$('iframe')[0].contentWindow[test.fn](test.param);
					demobo.callFunction(test.fn, test.param);
				}
			});
		});
		$('button#rc1').click(
				function() {
					var url = "http://rc1.demobo.com" + $('#url').val() + "?" + Math.random();
					var c = {
							page : "default",
							url : url,
							touchEnabled : true
						};
					if (!$('#orientation').is(':checked')) c.orientation = "portrait";
					demobo.setController(c);
					$('iframe').attr('src', url);
					$('#controllerUrl').attr('href', url);
				});
		$('input[type=radio]').click(function() {
			var wh = this.value.split("x");
			if (!$('#orientation').is(':checked')) wh.reverse();
			$('iframe').css( {
				width : wh[0],
				height : wh[1],
				border : '1px solid'
			});
		});
		$($('input[type=radio]')[0]).click();
		$('button#set').click();
	};
}
