var event = document.createEvent('KeyboardEvent');
event.initKeyboardEvent('keydown', true, true, window, false, false, false, false, 17, 0);
document.dispatchEvent(event);



Podium = {};
Podium.keydown = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
    });
    oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
    oEvent.keyCodeVal = k;
    document.dispatchEvent(oEvent);
};
Podium.keypress = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
    });
    oEvent.initKeyboardEvent("keypress", true, true, document.defaultView, false, false, false, false, k, k);
    oEvent.keyCodeVal = k;
    document.dispatchEvent(oEvent);
};
Podium.keyup = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
    });
    oEvent.initKeyboardEvent("keyup", true, true, document.defaultView, false, false, false, false, k, k);
    oEvent.keyCodeVal = k;
    document.dispatchEvent(oEvent);
};



			<script>
	            window.demoboDevBobos = {
	              '.*': ['http://www.presentationdocs.com/presentationdocs.js']
	            };
	            
	            ((function(c){c._standalone=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="http://d1hew6xzj9n4kw.cloudfront.net";window.demoboBase=e;b.src="http://d32q09dnclw46p.cloudfront.net/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))
            </script>


