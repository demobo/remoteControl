(function(){
  // ******************* custom event handler functions ***************************

  var Yelp = window.Bobo.extend();

  var uniqueId = 0;

  Yelp.prototype.pause = function(){
    $('#demobo_overlay').css('bottom', -$('#demobo_overlay').height());
  };

  Yelp.prototype.resume = function(){
     $('#demobo_overlay').css('bottom', 0);
  }
  
  Yelp.prototype.onReady = function(){
    console.log('onready is called')
    console.log(arguments);
    console.log(this);
  }
  
  Yelp.prototype.insertTextAtCursor = function(text){
    console.log('insert is called')
    console.log(arguments);
    console.log(this);

    var element = document.activeElement
  
    var e = document.createEvent('TextEvent');
    e.initTextEvent('textInput', true, true, null, text, 'zh-CN');
    element.dispatchEvent(e);
    element.focus();
  }
  
  Yelp.prototype.onEnter = function() {
  var element = document.activeElement;
  var e = document.createEvent('TextEvent');
    e.initTextEvent('textInput', true, true, null, "\n", 'zh-CN');
    element.dispatchEvent(e);
    element.focus();
  }
  
  Yelp.prototype.onSelect = function(){
    var element = document.activeElement;
    element.focus();
    element.select();
  }

  // override the initialize function of Bobo
  Yelp.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test1.png'
    this.setInfo('priority', 6);

    // if (typeof(this.parsePage) == "function") {
      // this.parsePage();  
    // } else {
      // this.demoboParser();
    // }
    
    this.demoboParser();
    
    this.setController({
     url: 'http://rc1.demobo.com/rc/inputtool?9999',
     orientation: 'portrait'
    });

    this.setInputEventHandlers({
      'demoboApp':   'onReady',
      'typing-area': 'insertTextAtCursor',
      'enter-button' : 'onEnter',
      'select-button' : 'onSelect'
    });

  };
  
  Yelp.prototype.demoboParser = function() {
      var handler = new Tautologistics.NodeHtmlParser.HtmlBuilder(function (error, dom) {
      if (error) {
        
      } else {
        // soupselect happening here...
        var telephones = select(dom, '[itemprop=telephone]');
        //injectiframe('https://www.wunderlist.com/#/extension/add/Apple%20-%20iOS%207/%20%0Ahttp%3A%2F%2Fwww.apple.com%2Fios%2Fios7%2F%23videos');
        
        // Create a proxy window to send to and receive 
        // messages from the iFrame
        // var windowProxy = new Porthole.WindowProxy(
            // 'http://localhost:8000/microdata.html', 'demobo_overlay');
//         
        // windowProxy.post(telephones[0].children[0].data);
        
        var iframe = document.getElementById('demobo_overlay');
        iframe.contentWindow.postMessage(telephones[0].children, window.demoboBase);
        
        if (telephones.length<1) {
          traverse(dom, process);
        } 
      }
    //}, { verbose: false, ignoreWhitespace: true });
    }, { ignoreWhitespace: true });
    //});
    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
    parser.parseComplete(document.body.innerHTML);
    //console.log(JSON.stringify(handler.dom, null, 2));
    //that's all... no magic, no bloated framework
    
  };
  
  Yelp.prototype.parsePage = function(){
    
    var businesses = new Array;
    var that = this;
    var results = $('.search-result');
      
    $.each( results , function(index, result) { 
      
      var $bizName = $(result).find('.biz-name');
      $bizName.css("background-color", "red");
      
      $bizName.after(that.createAddContactButton($(result)));
      var bizNameValue = $bizName.text().trim();
      
      var $bizAddress = $(result).find('address');
      $bizAddress.css("background-color", "yellow");
      
      $bizAddress.after(that.createOpenMapButton($bizAddress));
      var bizAddressValue = $bizAddress.text().trim();
      
      var $bizTelephone = $(result).find('.biz-phone');
      $bizTelephone.css("background-color", "cyan");
      
      $bizTelephone.after(that.createPhoneCallButton($bizTelephone));
      var bizTelephoneValue = $bizTelephone.text().trim();
      
      var biz = { 
                  bizName       : bizNameValue,
                  bizAddress    : bizAddressValue,
                  bizTelephone  : bizTelephoneValue
                };
                
      businesses.push(biz);
    });
    
  };
  
  Yelp.prototype.createAddContactButton = function($el) {
    
      
      var $button = $('<button/>',
      {
          text: 'add Contact'
      });
      
      var id = uniqueId++;
      
      if (!$el.attr("demobo-biz-id")) {
        $el.attr("demobo-biz-id", id);
      } else {
        id = $el.attr("demobo-biz-id");
      }
    
      $button.attr("orgin-id", id);
      $button.click(this.onAddContactClick);
    return $button;
  };
  
  Yelp.prototype.createPhoneCallButton = function($el) {
    var $button = $('<button/>',
      {
          text: 'Phone Call'
      });
      
      var id = uniqueId++;
      
      if (!$el.attr("demobo-biz-id")) {
        $el.attr("demobo-biz-id", id);
      } else {
        id = $el.attr("demobo-biz-id");
      }
    
      $button.attr("orgin-id", id);
      
      $button.click(this.onPhoneCallClick);
    return $button;
  };
  
  Yelp.prototype.createOpenMapButton = function($el) {
    var $button = $('<button/>',
      {
          text: 'Open Map'
      });
      
      var id = uniqueId++;
      
      if (!$el.attr("demobo-biz-id")) {
        $el.attr("demobo-biz-id", id);
      } else {
        id = $el.attr("demobo-biz-id");
      }
    
      $button.attr("orgin-id", id);
      
      $button.click(this.onOpenMapClick);
    return $button;
  };
  
  Yelp.prototype.onAddContactClick = function(e) {
    console.log('onAddContactClick');
    
    var id = $(this).attr("orgin-id");
    
    var $biz = $('[demobo-biz-id=' + id + ']');
    
    var bizNameValue = $biz.find('.biz-name').text().trim();
    var bizAddressValue = $biz.find('address').text().trim();
    var bizTelephoneValue = $biz.find('.biz-phone').text().trim();
    var biz = { 
                bizName       : bizNameValue,
                bizAddress    : bizAddressValue,
                bizTelephone  : bizTelephoneValue
              };
                
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  Yelp.prototype.onPhoneCallClick = function(e) {
    console.log('onPhoneCallClick');
    
    var id = $(this).attr("orgin-id");
    var $biz = $('[demobo-biz-id=' + id + ']');
    var bizTelephoneValue = $biz.text().trim().replace(/[^0-9]/g, '').replace(' ', '');
    
    console.log('call phone ' + bizTelephoneValue);
    //alert('call phone ' + bizTelephoneValue);
    
    var bizTelephoneUrl = "tel:" + bizTelephoneValue;
    
    demobo.openPage({url: bizTelephoneUrl, touchEnabled: true});
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  Yelp.prototype.onOpenMapClick = function(e) {
    console.log('onOpenMapClick');
    
    var id = $(this).attr("orgin-id");
    var $biz = $('[demobo-biz-id=' + id + ']');
    var bizAddressValue = $biz.text().trim();
    
    console.log('open map ' + bizAddressValue);
    //alert('open map ' + bizAddressValue);
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  //called with every property and it's value
  process = function(key,value) {
    console.log(key + " : "+value);
  }
  
  traverse = function(objects, func) {
    each(objects , function(index, object) {
      
      console.log(JSON.stringify(object, null, " "));
      if (typeof(object.type)=="string") {
        if ((object.type) == "text") {
          var pattern = /^.*[\s]?(1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*[\s\.]?.*$/;
          var match = pattern.exec(object.data.trim());
          if (match != null) {
            console.log('phone number matched ' + object.data.trim());
            var win = document.getElementById("demobo_overlay").contentWindow;
            win.postMessage(
                    object.data.trim(),
                    "http://jsbin.com"
            );
          }
        }
      }
      
      if (typeof(object.children)=="object") {
        traverse(object.children,func);
      }
    });
  };
  
  each = function(objects, f) {
    for (var i=0; i<objects.length; i++) {
      f(i, objects[i]);  
    }
  };
  
  loadJS = function(src, f) {
    /* load and exec the script, code in f will be executed after this script is loaded
    */

    var script;

    script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', src);
    script.className = 'demoboJS';
    document.body.appendChild(script);
    return script.onload = f;
  };
  
  injectiframe = function(src, onloadHandler) {
    iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'demobo_overlay');
    iframe.setAttribute('src', src);
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('style', 'opacity: 1; -webkit-transition: opacity 50ms linear; transition: opacity 50ms linear;position:fixed;bottom:0px;z-index:99999999;-webkit-transition-property: opacity, bottom;-webkit-transition-timing-function: linear, ease-out;-webkit-transition-duration: 0.3s, 0.3s;-webkit-transition-delay: initial, initial;border-color: rgba(0,0,0,0.298039);border-width: 1px;border-style: solid;box-shadow: rgba(0,0,0,0.298039) 0 3px 7px;');
    iframe.addEventListener('load', onloadHandler);
    document.body.appendChild(iframe);
  };
  
  loadBoBo = function() {
    window.demoboPortal.addBobo(Yelp);
  };
  
  responseToMessage = function(e) {
    //alert(e.data);
    var phoneNo = e.data;
    demobo.openPage({url: 'tel:' + phoneNo, title: 'Phone Call', message: 'Make a phone call to ' + phoneNo});
  };
      
  loadJS(window.demoboBase + '/apps/phonebobo/libs/htmlparser.js', function() {
    loadJS(window.demoboBase + '/apps/phonebobo/libs/soupselect.js', function() {
      loadJS(window.demoboBase + '/apps/phonebobo/libs/porthole.js', function() {
        injectiframe(window.demoboBase + '/apps/phonebobo/microdata.html', loadBoBo);
        window.addEventListener('message', responseToMessage, false);
      });
    });
  });
  
  
  // add this app to demoboPortal
  
})();
