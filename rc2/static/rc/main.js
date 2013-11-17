var curCallID;
var curUrl = "";
var myID = "634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D";
// var myID = "28BE7932-53F1-024F-063C-877712F6861F";

//register contact list click event
$(document).ready(function() {
	$(".user").on('click', function(evt) {
		console.log('browserID: ' + $(evt.currentTarget).attr('browserID'));
		curCallID = $(evt.currentTarget).attr('browserID');
		$("#showPopup").click();
		call(curCallID);
	});

	$(".endBtn").on('click', function(evt) {
		removeVideoChat();
		if (curCallID)
			hangup(curCallID);
		curCallID = "";
	});

	$(".syncBtn").on('click', function(evt) {
		sendMessage("event", {
			url : curUrl,
			action : 'urlChange'
		});
	});

	$("#gotoBtn").on('click', function(evt) {
		var url = $('#url');
		if (url.val() != '') {
			sendMessage("event", {
				url : url.val(),
				action : 'urlChange'
			});
			$('.urlList ul').append('<li><a class="urlListBtn">' + url.val() + '</a></li>');
			$('.urlList ul').listview('refresh');
			url.val('');
		}
	});
});

//for jQuery mobile event
$(document).on('pageinit', function(e) {
	$("#url").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#gotoBtn").click();
		}
	});

	$(".urlList").on('click', function(evt) {
		console.log(evt.target.text);
		demobo.mobile.fireInputEvent('gotoUrl', evt.target.text);
	});
});

function call(outgoingId) {
	var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
	outgoingCallRef.push({
		name : myID
	});
	outgoingCallRef.on('child_removed', function(snapshot) {
		var callerId = snapshot.val()['name'];
		if (callerId === myID && $('#popup:visible')[0] && !$('#chatContainer')[0]) {
			injectVideoChat(snapshot.name());
		}
	});
}

function hangup(outgoingId) {
	var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
	outgoingCallRef.remove();
}

function injectVideoChat(roomId) {
	if (!document.getElementById('chatContainer')) {
		var e = document.createElement('div');
		e.id = 'chatContainer';
		e.style.position = 'fixed';
		e.style.bottom = '30px';
		e.style.right = '0px';
		e.style.zIndex = '999';
		document.getElementById('popup').appendChild(e);
	}
	var i = document.createElement('iframe');
	i.src = 'https://koalabearate.appspot.com/?r=' + roomId;
	i.className = 'videoChatFrame';
	i.id = roomId;
	i.style.width = '100%';
	document.getElementById('chatContainer').appendChild(i);
}

function removeVideoChat() {
	$('#chatContainer').remove();
}

function sendMessage(type, data) {
	if (!demoboBody)
		return;
	var evt = new CustomEvent("FromKoala", {
		detail : {
			type : type,
			data : data
		}
	});
	demoboBody.dispatchEvent(evt);
}

function onExtensionMessage(e) {
	console.log("onExtensionMessage: ", e.detail);
	if ($(".videoChatFrame")[0])
		$(".videoChatFrame")[0].contentWindow.postMessage(JSON.stringify(e.detail), "*");
}

function onRemoteMessage(e) {
	var cmd = JSON.parse(evt.data);
	console.log("onRemoteMessage: ", e.detail);
}

addEventListener("message", function(e) {
	var evt = JSON.parse(e.data);
	console.log("onRemoteMessage: ", evt);
	if (evt.action=="urlUpdate") curUrl = evt.url;
	sendMessage("event", evt);
}, false);
