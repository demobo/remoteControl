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
			console.log(e);
			var messageCss = {
				'font-size' : 300,
				'color' : '#433',
				'position' : 'absolute',
				'text-align' : 'center',
				'width' : '90%',
				'top' : '10%'
			};
			$('#message').text(e.value).css(messageCss).show().fadeOut(1000);
		}, false);
		$('button#set').click(
				function() {
					var url = "http://net.demobo.com/server/upload/" + roomID
							+ ".html?" + Math.random();
					demobo.setController( {
						page : "default",
						url : url,
						touchEnabled : true
					});
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
					demobo.setController( {
						page : "default",
						url : url,
						touchEnabled : true
					});
					$('iframe').attr('src', url);
					$('#controllerUrl').attr('href', url);
				});
		$('input[type=radio]').click(function() {
			var wh = this.value.split("x");
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
