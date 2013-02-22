/* setting */
if (DEMOBO) {
	DEMOBO.developer = 'developer@demobo.com';
	DEMOBO.maxPlayers = 1;
	DEMOBO.stayOnBlur = true;
	var imgID = 0;
	var testSuite;
	DEMOBO.init = function() {
		if (localStorage.getItem("url"))
			$('#url').val(localStorage.getItem("url"));
		demobo.addEventListener('input', function(e) {
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
			console.log(e.source, e.value);
		}, false);
		$('button#set').click(
				function() {
					var url = "http://net.demobo.com/server/upload/" + DEMOBO.roomID.substr(0,5)
							+ ".html?" + Math.random();
					var c = {
							page : "default",
							url : url,
							touchEnabled : true
						};
					if (!$('#orientation').is(':checked')) c.orientation = "portrait";
					demobo.setController(c);
//					$('iframe').attr('src', localStorage.getItem("url"));
					$('iframe').attr('src', url);
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
						roomID : DEMOBO.roomID.substr(0,5)
					},
					dataType : 'json',
					success : function() {
						$('button#set').click();
					}
				});
				localStorage.setItem("url", $('#url').val());
			});
		});
		var testCounter=0;
		$('button#test').click(function() {
			testSuite = null;
			var testfile = 'test.js';
			if ($('#url').val().split("/").length == 3)
				testfile = $('#url').val() + "/" + testfile;
			$.getScript(testfile, function(data, textStatus, jqxhr) {
				if (testSuite) {
					testCases = testSuite[testCounter%testSuite.length];
					testCounter++;
				}
				console.log(testCases);
				for ( var i = 0; i < testCases.length; i++) {
					var test = testCases[i];
//					$('iframe')[0].contentWindow[test.functionName](test.data);
//					$('iframe')[0].contentWindow.postMessage(test,'*');
//					console.log(test.data);
					demobo.callFunction(test.functionName, test.data);
				}
			});
		});
		$('button#rc1').click(function() {
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
		$('button#connect').click(toggleDemobo);
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
		// simulator eventListener
		document.getElementById('demoboBody').addEventListener(
				"FromFrontground",
				function(e) {
					$('#simulator iframe')[0].contentWindow.postMessage(e.detail.data, '*');
					if (e.detail.type == 'register') {
						var url = e.detail.data.url;
						setSimulator(url);
					}
				}
		);
	};
}

window.showDemobo = function() {
	var demoboCover = document.getElementById('demoboCover');
	if (demoboCover) {
		demoboCover.style.display='block';
		demobo.showQR();
		return;
	}
	var id = 'demoboCover';
	var demoboCover = document.createElement('div');
	demoboCover.setAttribute('id', 'demoboCover');
	document.getElementById('demoboBody').appendChild(demoboCover);

	var demoboCoverDiv = document.createElement("div");
	demoboCoverDiv.setAttribute('id', 'demoboCoverDiv');
	demoboCover.appendChild(demoboCoverDiv);

	var div = document.createElement("div");
	div.setAttribute('id', 'demoboClose');
	demoboCoverDiv.appendChild(div);
	var a = document.createElement("a");
	a.setAttribute("onclick", "hideDemobo();");
	newContent = document.createTextNode('✕');
	a.appendChild(newContent);
	div.appendChild(a);
	
	if (demobo.getState()!=1) {
		var div = document.createElement("div");
		div.appendChild(document.createTextNode('Failed to connect with de Mobo:'));
		demoboCoverDiv.appendChild(div);
		var div = document.createElement("div");
		div.appendChild(document.createTextNode('Unable to connect to the server. If you have a firewall, it may be blocking the connection.'));
		demoboCoverDiv.appendChild(div);
		demoboCover.style.opacity = 1;
	} else {
		var div = document.createElement("div");
		div.setAttribute('id','settings');
		var label = document.createElement("label");
		label.setAttribute("class","info");
		label.setAttribute("for","alwaysOnCheckbox");
		label.setAttribute("onclick","");
		label.appendChild(document.createTextNode('AUTO CONNECT'));
		div.appendChild(label);
		var ul = document.createElement("ul");
		ul.setAttribute("id","checked");
		div.appendChild(ul);
		var li = document.createElement("li");
		ul.appendChild(li);
		var p = document.createElement("p");
		li.appendChild(p);
		var alwaysOn = document.createElement("input");
		alwaysOn.id = "alwaysOnCheckbox";
		alwaysOn.type = "checkbox";
		alwaysOn.name = "alwaysOnCheckbox";
		p.appendChild(alwaysOn);
		var label = document.createElement("label");
		label.setAttribute("class","check");
		label.setAttribute("for","alwaysOnCheckbox");
		label.setAttribute("onclick","");
		p.appendChild(label);
		
		demoboCoverDiv.appendChild(div);
		alwaysOn.checked = localStorage.isAutoLoad;
		var OnChangeCheckbox = function() {
			localStorage.isAutoLoad = alwaysOn.checked?"true":"";
		};
		alwaysOn.addEventListener ("click", OnChangeCheckbox, false);
		
		demobo.renderQR('demoboCoverDiv', 1);
		var temp = document.querySelector('#demoboCoverDiv > img');
		
		var iframe = document.createElement("iframe");
		iframe.setAttribute('id','demoboHelpPage');
//		iframe.src = helpUrl;	
		demoboCoverDiv.appendChild(iframe);
		iframe.onload = function() {
			demoboCover.style.opacity = 1;
		};
	}
}

window.hideDemobo = function() {
	var demoboCover = document.getElementById('demoboCover');
	if (demoboCover) {
		demoboCover.style.display='none';
		demobo.hideQR();
	}
}

window.toggleDemobo = function() {
	var demoboCover = document.getElementById('demoboCover');
	if (demoboCover && demoboCover.style.display!='none') {
		hideDemobo();
	} else {
		showDemobo();
		demobo.setController();
	}
}

function setSimulator(url) {
	$('#simulator iframe').attr('src', url);
}