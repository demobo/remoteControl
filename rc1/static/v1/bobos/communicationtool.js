(function(){
  // ******************* custom event handler functions ***************************

  var Communication = window.Bobo.extend();

  var uniqueId = 0;

  Communication.telephones = [];
  
  Communication.prototype.pauseBobo = function(){
    //$('#demobo_overlay').css('bottom', -$('#demobo_overlay').height());
    //$('#boboModal').modal('hide');
    $('#demobo_overlay').hide();
  };

  Communication.prototype.resumeBobo = function(){
    //$('#demobo_overlay').css('bottom', 0);
    //$('#boboModal').modal();
    $('#demobo_overlay').show();
  }
  
  Communication.prototype.onReady = function(){
    console.log('onready is called')
    console.log(arguments);
    console.log(this);
  }
  
  Communication.prototype.insertTextAtCursor = function(text){
    console.log('insert is called')
    console.log(arguments);
    console.log(this);

    var element = document.activeElement
  
    var e = document.createEvent('TextEvent');
    e.initTextEvent('textInput', true, true, null, text, 'zh-CN');
    element.dispatchEvent(e);
    element.focus();
  }
  
  Communication.prototype.onEnter = function() {
  var element = document.activeElement;
  var e = document.createEvent('TextEvent');
    e.initTextEvent('textInput', true, true, null, "\n", 'zh-CN');
    element.dispatchEvent(e);
    element.focus();
  }
  
  Communication.prototype.onSelect = function(){
    var element = document.activeElement;
    element.focus();
    element.select();
  }

  // override the initialize function of Bobo
  Communication.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test1.png'
    // this.setInfo('priority', 2);
    this.setInfo('boboID', 'communicationtool');
    this.setInfo('iconClass', 'fui-phone');
    this.setInfo('name', 'Contact Helper');
    this.setInfo('description', 'An amazing tool to sync phones, emails and addresses to your phone. It lets your make calls and send messages right away!');
    this.setInfo('type', 'generic');

    // if (typeof(this.parsePage) == "function") {
      // this.parsePage();  
    // } else {
      // this.demoboParser();
    // }
    
    this.demoboParser();
    
    this.setController({
     url: 'http://rc1.demobo.com/rc/communicationtool/control.html?0810',
     orientation: 'portrait'
    });

    this.setInputEventHandlers({
      'demoboApp':   'onReady',
      'typing-area': 'insertTextAtCursor',
      'enter-button' : 'onEnter',
      'select-button' : 'onSelect'
    });

  };
  
  Communication.prototype.demoboParser = function() {
      var handler = new Tautologistics.NodeHtmlParser.HtmlBuilder(function (error, dom) {
      if (error) {
        
      } else {
        Communication.telephones = [];
        // soupselect happening here...
        Communication.telephones = select(dom, '[itemprop=telephone]');
        var iframe = document.getElementById('demobo_overlay');
        
        try{
          if (Communication.telephones.length<1) {
            traverse(dom, process);
            iframe.contentWindow.postMessage(Communication.telephones, '*');
            //iframe.contentWindow.postMessage(Communication.telephones, window.demoboBase);
          } else {
            iframe.contentWindow.postMessage(Communication.telephones[0].children, '*');
            //iframe.contentWindow.postMessage(Communication.telephones[0].children, window.demoboBase);
          }
        }catch(e){
          //TODO: there is an exception here 
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
  
  Communication.prototype.parsePage = function(){
    
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
  
  Communication.prototype.createAddContactButton = function($el) {
    
      
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
  
  Communication.prototype.createPhoneCallButton = function($el) {
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
  
  Communication.prototype.createOpenMapButton = function($el) {
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
  
  Communication.prototype.onAddContactClick = function(e) {
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
  
  Communication.prototype.onPhoneCallClick = function(e) {
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
  
  Communication.prototype.onOpenMapClick = function(e) {
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
    var telephone = { 
                data : value,
                type : key
              };
    Communication.telephones.push(telephone);
  }
  
  traverse = function(objects, func) {
        
    each(objects , function(index, object) {
      //console.log(JSON.stringify(object, null, " "));
      if (typeof(object.type)=="string") {
        if ((object.type) == "text") {
          var pattern = /^.*[\s]?(1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*[\s\.]?.*$/;
          var match = pattern.exec(object.data.trim());
          if (match != null) {
            //console.log('phone number matched ' + object.data.trim());
            //telephones.push(object.data.trim());
            var phase = object.data.trim();
            var bizTelephoneValue = phase.replace(/[^0-9]/g, '').replace(' ', '');
            pattern = /^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/;
            match = pattern.exec(bizTelephoneValue);
            if (match != null) {
              console.log('phone number matched ' + phase);
              func("telephone", phase);
            }
            else {
              var tokens = phase.split(" ");
              each(tokens, function(index, token) {
                //var pattern1 = /^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/;
                var match1 = pattern.exec(token);
                if (match1 != null) {
                  console.log('phone number matched ' + token);
                  func("telephone", token);
                }
              });  
            }
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
  
  loadCSS = function(src) {

    var link;
    
    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', src);

    document.head.appendChild(link);
  };
  
  
  injectiframe = function(src, onloadHandler) {
    
    var div = document.createElement('div');
    div.setAttribute('id', 'demobo-widget');
    div.setAttribute('class', 'demobobarright');
    div.setAttribute('style', 'height: 188px; width: 332px; display: none;');
    
    iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'demobo_overlay');
    iframe.setAttribute('src', src);
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('style', 'border: 1; overflow: hidden; height: 188px; width: 332px;');
    //iframe.setAttribute('style', 'opacity: 1; -webkit-transition: opacity 50ms linear; transition: opacity 50ms linear;position:fixed;bottom:0px;z-index:99999999;-webkit-transition-property: opacity, bottom;-webkit-transition-timing-function: linear, ease-out;-webkit-transition-duration: 0.3s, 0.3s;-webkit-transition-delay: initial, initial;border-color: rgba(0,0,0,0.298039);border-width: 1px;border-style: solid;box-shadow: rgba(0,0,0,0.298039) 0 3px 7px;');
    iframe.addEventListener('load', onloadHandler);
    
    div.appendChild(iframe);
    document.body.appendChild(div);
  };
  
  loadBoBo = function() {
    window.demoboPortal.addBobo(Communication);
  };
  
  responseToMessage = function(e) {
    //alert(e.data);
    var action = e.data.action;
    var data = e.data.data; 
    if (action === 'phonecall') {
      var bizTelephoneValue = data.trim().replace(/[^0-9]/g, '').replace(' ', '');
      demobo.openPage({url: 'tel:' + bizTelephoneValue, title: 'Phone Call', message: 'Make a phone call to ' + bizTelephoneValue});
    } else if (action === 'sms') {
      var smsValue = data.trim().replace(/[^0-9]/g, '').replace(' ', '');
      demobo.openPage({url: 'sms:' + smsValue, title: 'Send SMS', message: 'Send a sms to ' + smsValue});
    }
    
  };
      
  loadJS(window.demoboBase + '/v1/bobos/phonebobo/libs/htmlparser.js', function() {
    loadJS(window.demoboBase + '/v1/bobos/phonebobo/libs/soupselect.js', function() {
      loadJS(window.demoboBase + '/v1/bobos/phonebobo/libs/porthole.js', function() {
        loadCSS(window.demoboBase + '/v1/bobos/phonebobo/css/bobo.css');
        injectiframe(window.demoboBase + '/v1/bobos/phonebobo/microdata.html', loadBoBo);
        window.addEventListener('message', responseToMessage, false);
      });
    });
  });
  
  
  // add this app to demoboPortal
  
})();
