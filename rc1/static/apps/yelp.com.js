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

    this.parsePage();
    
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
    
    var $biz = $('[demobo-biz-id*=' + id + ']');
    
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
    var $biz = $('[demobo-biz-id*=' + id + ']');
    var bizTelephoneValue = $biz.text().trim();
    
    console.log('call phone ' + bizTelephoneValue);
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  Yelp.prototype.onOpenMapClick = function(e) {
    console.log('onOpenMapClick');
    
    var id = $(this).attr("orgin-id");
    var $biz = $('[demobo-biz-id*=' + id + ']');
    var bizAddressValue = $biz.text().trim();
    
    console.log('open map ' + bizAddressValue);
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // add this app to demoboPortal
  window.demoboPortal.addBobo(Yelp);
  
})();
