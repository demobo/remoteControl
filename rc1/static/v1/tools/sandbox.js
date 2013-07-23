/* setting */
if (DEMOBO) {
	DEMOBO.developer = 'developer@demobo.com';
	DEMOBO.maxPlayers = 1;
	DEMOBO.stayOnBlur = true;
	var imgID = 0;
	var testSuite;
	DEMOBO.init = function() {
		if (localStorage.getItem("url"))
			//$('#url').val(localStorage.getItem("url"));
		demobo.setupShakeConnect();
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
		$('a#set').click(
				function() {
					localStorage.setItem("url", $('#url').val());
					var base = document.location.origin;
                    var link = base+'/v1/momos/'+$('#selectDiv .select button span.filter-option').text()+'/control.html';
                    console.log(link);
					if (link.indexOf("http")==0) {
						var url = link +"?" + Math.random();
					} else {
						var url = "http://net.demobo.com/server/upload/" + DEMOBO.roomID.substr(0,5)
								+ ".html?" + Math.random();
					}
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

		var testCounter=0;
		$('a#test').click(function() {
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
        $('#dimensions label').on('click', function(){
            var input = $(this).find('input')[0];
            var wh = input.value.split("x");
            if (!$('label.checkbox').hasClass('checked')) wh.reverse();
            $('iframe').css( {
                width : wh[0],
                height : wh[1]
            });
        });
		$($('#dimensions label')[0]).click();
		$('a#set').click();
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

$(document).ready(function(){
    if (document.domain === 'localhost'){
       //alert("Our sandbox doesn't work under domain 'localhost'. ");
    }

    var populateMomo = function(){
        //load preferences and populate select box
        var momos = JSON.parse(window.localStorage.getItem('momos'));
        var lastSelected = JSON.parse(window.localStorage.getItem("momoSelected"));
        var lastSelectedIndex = JSON.parse(window.localStorage.getItem(('momoSelectedIndex')));
        if (!momos) return;
        var parent = document.getElementById('recentMomos');
        var i;
        for (i = 0; i<momos.length; i+=1){
            var e = document.createElement('option');
            e.innerHTML = momos[i];
            e.value = momos[i];
            parent.appendChild(e);
        }
        selectMomo(lastSelectedIndex,lastSelected);
    };

    var onSelectChange = function(){
        var index=$(this).parent().attr('rel');
        var value=$('#selectDiv option')[index].value;
        switch(value){
            case 'add':
                addMomo();
                break;
            case 'remove':
                removeMomo();
                return false;
            default :
                return;
        }
    };

    var onPageLeave = function(){
        deleteRemoved();
        //save preferences
        var opts = $.map($('#recentMomos option'), function(elem, index){return elem.value;});
        var optSelected = $('#selectDiv .select button span.filter-option').text();
        var optIndexSelected = parseInt($.map($('#recentMomos option'), function(elem, index){
            if ($(elem).text() === optSelected) return index;
        })[0]);
        console.log(optIndexSelected);
        window.localStorage.setItem('momos', JSON.stringify(opts));
        window.localStorage.setItem('momoSelected', JSON.stringify(optSelected));
        window.localStorage.setItem('momoSelectedIndex', JSON.stringify(optIndexSelected));

    };

    var selectMomo = function(index, text){
        $('#selectDiv .select ul li.selected').toggleClass('selected');
        $($('#selectDiv .select ul li')[index]).toggleClass('selected');
        $('#selectDiv .select button span.filter-option').text(text);
        console.log('jere');

    }

    var removeMomo = function(){
        var totalLength = $('#selectDiv .select ul li').length;
        if ($('#selectDiv .select ul li:hidden').length === totalLength-2){
            alert('No more Momo to delete');
            return false;
        }
        var removeIndex=$.map($('#selectDiv .select ul li'), function(elem, index){if ($(elem).hasClass('selected')) return(index)})[0];
        if (removeIndex === totalLength-1 || removeIndex === totalLength-2){
            alert('Select a Momo to delete');
            return false;
        }

        $($('#selectDiv .select ul li')[removeIndex]).hide();
        $($('#recentMomos option')[removeIndex]).addClass('deleted');

        selectMomo(0, 'No Momo Selected');
    }

    var deleteRemoved  = function(){
        $('#selectDiv .select ul li:hidden').remove();
        $('#recentMomos option.deleted').remove();
    }

    var addMomo = function(){
        deleteRemoved();
        var name = prompt("Enter new momo's name:");
        if (!name){
            return;
        }
        var e = document.createElement('option');
        var parent = document.getElementById('recentMomos');
        e.innerHTML = name;
        parent.appendChild(e);
        var selectedIndex = $('#recentMomos option').length-1;
        selectMomo(selectedIndex, name);
    }

    $('#addMomo').on('click',addMomo);
    setTimeout(function(){
        $('#selectDiv .select ul').delegate('li a', 'click',onSelectChange);
    }, 1000);
    $(window).on('beforeunload',onPageLeave);

    populateMomo();
});