(function(){
  // ******************* custom event handler functions ***************************

  Yelp = window.Bobo.extend();

  var uniqueId = 0;
  
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

    this.initializeJS();
    
    // if (typeof(this.parsePage) == "function") {
      // this.parsePage();  
    // } else {
      // this.demoboParser();
    // }
    
    this.demoboParser();
    
    this.setController({
     url: 'http://rc1.demobo.com/rc/inputtool?0614',
     orientation: 'portrait'
    });

    this.setInputEventHandlers({
      'demoboApp':   'onReady',
      'typing-area': 'insertTextAtCursor',
      'enter-button' : 'onEnter',
      'select-button' : 'onSelect'
    });

  };
      
  Yelp.prototype.initializeJS = function() {
    loadJS("http://localhost:8000/libs/htmlparser.js");
    
    if ((typeof JSON) != "object") {
      loadJS("http://localhost:8000/libs/json2.js");
    }
  }
  
  Yelp.prototype.demoboParser = function() {
      var handler = new Tautologistics.NodeHtmlParser.HtmlBuilder(function (error, dom) {
      if (error) {
        
      } else {
        // soupselect happening here...
        var names = select(dom, '[itemprop=name]');
        if (names.length<1) {
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
      
  loadJS('http://localhost:8000/libs/htmlparser.js', function() {
    loadJS('http://localhost:8000/libs/soupselect.js', function() {
      window.demoboPortal.addBobo(Yelp);
    });
  });
  // add this app to demoboPortal
  
})();