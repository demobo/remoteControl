// Generated by CoffeeScript 1.6.2
/*
// demobo-portal.js 0.9.2

// (c) 2013 Jiahao Li, de Mobo LLC
*/


/*
//`window.demoboLoading` is a flag that keeps loading bookmarklet safe
*/


(function() {
  var Bobo, DemoboPortal, Dispatcher, base, breaker, cacheJS, connectScript, demoboHandlers, extend, faviconScript, loadJS, nativeForEach, remotes, version, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (!window.demoboLoading) {
    /* 
    //Set the flag so that another demobo script wont interrupt
    */

    window.demoboLoading = 1;
    if (window.demoboOn) {
      /* 
      //If demobo is already on, do nothing
      */

      delete window.demoboLoading;
    } else {
      window.demoboOn = 1;
      /*
      // Baseline Setup
      // ---------------
      // Current version
      */

      version = '0.9.2';
      base = window.demoboBase + '/apps/';
      connectScript = window.demoboBase + '/core/connect.js';
      faviconScript = window.demoboBase + '/core/favicon.js';
      /*
      // This sets the routing of controllers for websites (currently hardcoded)
      */

      remotes = {
        '^http://www\\.pandora\\.com': 'pandora.com-new.js',
        '^http://douban\\.fm': 'douban.fm-new.js',
        'www\\.youtube\\.com': 'youtube.com-new.js',
        'www\\.last\\.fm\/listen': 'last.fm-new.js',
        '8tracks\\.com': '8tracks.com-new.js',
        'vimeo\\.com': 'vimeo.com-new.js',
        'youku\\.com': 'youku.com-new.js',
        'www\\.rdio\\.com': 'rdio.com-new.js',
        'www\\.slideshare\\.net': 'slideshare.net-new.js',
        'docs\\.google\\.com\/presentation': 'docs.google.com-new.js',
        'grooveshark\\.com': 'grooveshark.com-new.js',
        'play\\.spotify\\.com': 'spotify.com-new.js',
        'sfbay\\.craigslist\\.org': 'yelp.com.js',
        'www\\.yelp\\.com': 'yelp.com.js',
        'www\\.yellowpages\\.com': 'yelp.com.js',
        'www\\.foodspotting\\.com': 'yelp.com.js',
        'www\\.urbanspoon\\.com': 'yelp.com.js',
        'foursquare\\.com': 'yelp.com.js',
        'www\\.npr\\.org': 'npr.org.js'
      };
      /*
      // definitions of utilities 
      // ------------------------
      // A function that caches a script using object tag
      */

      cacheJS = function(src) {
        var cache;

        cache = document.createElement('object');
        cache.data = src;
        cache.className = 'demoboCache';
        cache.width = 0;
        cache.height = 0;
        return document.body.appendChild(cache);
      };
      /*
      // Try to preload demobo API and other scripts as early as possible
      */

      cacheJS('//d32q09dnclw46p.cloudfront.net/demobo.1.7.2.min.js');
      cacheJS(connectScript);
      /*
      // A function that loads a script and executes the call back after the script is executed
      */

      loadJS = function(src, f) {
        var script;

        script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', src);
        script.className = 'demoboJS';
        document.body.appendChild(script);
        return script.onload = f;
      };
      /*
      // external libraries 
      // ------------------
      // Constants used by underscore.js codes
      */

      _ = {};
      nativeForEach = Array.prototype.forEach;
      breaker = {};
      /* 
      // Functions defined by underscore.js
      */

      
    _.each = function(obj, iterator, context) {
      if (obj == null) return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        for (var key in obj) {
          if (_.has(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) return;
          }
        }
      }
    };
      _.has = function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      };
      
    _.extend = function(obj) {
      _.each(Array.prototype.slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    };
      /* 
      // Codes copied and adapted from backbone.js. Used for inheritance
      */

      extend = function(protoProps, staticProps) {
        var child, parent;

        parent = this;
        if (protoProps && _.has(protoProps, 'constructor')) {
          child = protoProps.constructor;
        } else {
          child = function() {
            return parent.apply(this, arguments);
          };
        }
        _.extend(child, parent, staticProps);
        function ctor() { this.constructor = child; } 
      ctor.prototype = parent.prototype; 
      child.prototype = new ctor(); 
      child.__super__ = parent.prototype;
        return child;
      };
      /*
      // Bobo base class
      // ----------------
      // Base class of all BOBOs. Every new bobo should extend this class and overwrite at least its `initialize` method
      */

      Bobo = (function() {
        /* 
        // Constructor of `Bobo`
        */
        function Bobo(portal) {
          var defaultConfig;

          this.portal = portal;
          this.boboInfos = {};
          this._events = {};
          defaultConfig = {
            'developer': 'developer@demobo.com'
          };
          this.boboInfos['priority'] = 0;
          this.boboInfos['config'] = defaultConfig;
          this.boboInfos['boboID'] = null;
          this.boboInfos['connectedDevices'] = {};
          this.boboInfos['inputEventHandlers'] = {};
          this.initialize();
        }

        /* 
        // Register a event handler to the Object's properties. In the handler, `this` refers to this object. Example:
        */


        Bobo.prototype.on = function(eventName, handler) {
          this._events[eventName] = handler;
          return true;
        };

        /* 
        //Trigger specific event handler
        */


        Bobo.prototype.trigger = function(eventName) {
          var handler;

          if ((handler = this._events[eventName])) {
            handler.apply(this, [].slice.apply(arguments, [1]));
            return true;
          } else {
            return false;
          }
        };

        /* 
        //Call the function on device. if `devicedID` is not specified, call the function on all devices connected to this bobo
        */


        Bobo.prototype.callFunction = function(functionName, data, deviceID) {
          return this.portal.callFunction(functionName, data, deviceID, this.getInfo('boboID'));
        };

        /*
        //Called immediately upon this bobo's instantiation (guaranteed). A bobo that inherits the base `Bobo` class should overwrite this method
        */


        Bobo.prototype.initialize = function() {
          this.setInfo('controller', {});
          this.setInfo('inputEventHandlers', {});
          return true;
        };

        /* 
        //Return the value of the key
        */


        Bobo.prototype.getInfo = function(key) {
          return this.boboInfos[key];
        };

        /*
        // set the value of the key. If the old value is different from the new value, 'change:`key`' event is triggered
        */


        Bobo.prototype.setInfo = function(key, val) {
          var oldVal;

          oldVal = this.boboInfos[key];
          if (oldVal !== val) {
            this.boboInfos[key] = val;
            this.trigger('change:' + key, oldVal, val);
          }
          return oldVal;
        };

        /* 
        //set controller params. which will be passed to phone when new device is connected
        */


        Bobo.prototype.setController = function(params) {
          return this.setInfo('controller', params);
        };

        /*
        // set event listeners. which will be in turn set to demobo when the bobo is instantiated
        */


        Bobo.prototype.setInputEventHandlers = function(inputEventHandlers) {
          var eventName, handlerName, hs, wrapper, _thisBobo;

          _thisBobo = this;
          wrapper = function(bobo, functionName) {
            return function() {
              return bobo[functionName].apply(bobo, arguments);
            };
          };
          hs = {};
          for (eventName in inputEventHandlers) {
            handlerName = inputEventHandlers[eventName];
            hs[eventName] = wrapper(_thisBobo, handlerName);
          }
          this.setInfo('inputEventHandlers', hs);
          return true;
        };

        /*
        // reservered for future use
        */


        Bobo.prototype.run = function() {};

        /*
        // reservered for future use
        */


        Bobo.prototype.resume = function() {};

        /*
        // reservered for future use
        */


        Bobo.prototype.pause = function() {};

        /*
        // reservered for future use
        */


        Bobo.prototype.finish = function() {};

        return Bobo;

      })();
      /*
      // Set up `Bobo` for global use
      */

      Bobo.extend = extend;
      window.Bobo = Bobo;
      /* 
      //a dispatcher object for event listeners
      */

      Dispatcher = (function() {
        /*
        //Constructor of `Dispatcher`
        */
        function Dispatcher(eventListened, portal) {
          this.eventListened = eventListened;
          this.portal = portal;
          this.handlers = {};
        }

        /*
        //add a bobo's event handler
        */


        Dispatcher.prototype.addHandler = function(boboID, handler) {
          return this.handlers[boboID] = handler;
        };

        /*
        // call corresponding handler based on `deviceID` (and its corresponding `boboID`)
        */


        Dispatcher.prototype.dispatch = function(value, data) {
          var boboID, deviceID;

          deviceID = data.deviceID;
          boboID = this.portal.getDeviceBoboID(deviceID);
          if (__indexOf.call(Object.keys(this.handlers), boboID) >= 0) {
            return this.handlers[boboID](value, data);
          }
          return null;
        };

        return Dispatcher;

      })();
      /*
      // Handlers used by a `DemoboPortal` object, which listen to the change of the object's properties, e.g. change of bobos, addition of new bobo, etc.
      */

      demoboHandlers = {
        handlerBobosChange: function(oldVal, newVal) {
          return console.log('bobos changed from ' + oldVal + ' to ' + newVal);
        },
        handlerCurBoboChange: function(oldVal, newVal) {
          return console.log('current bobo changed from ' + oldVal + ' to ' + newVal);
        },
        handleBoboAdd: function(boboID, boboObj) {
          return console.log('new bobo added, id: ' + boboID);
        },
        /*
        // Handler that runs when a new device is connected
        */

        connectedHandler: function(portal) {
          return function(data) {
            console.log('connected');
            portal.setDeviceController(portal.get('curBobo'), data.deviceID);
            return portal.addDevice(data.deviceID);
          };
        },
        /*
        // Handler that runs when demobo is enabled
        */

        enabledHandler: function(portal) {
          return function(data) {
            console.log('enabled');
            return portal.turnOnFavicon();
          };
        },
        /*
        // Handler that runs when demobo is disabled
        */

        disabledHandler: function(portal) {
          return function(data) {
            console.log('disabled');
            return portal.turnOffFavicon();
          };
        },
        /*
        // Handler that runs when a new device is disconnected
        */

        mbHandler: function(portal) {
          return function(data) {
            console.log('mbcommand');
            switch (data.value.command) {
              case 'switchBobo':
                return portal.switchBobo(data.value.boboID, true);
              default:
                return false;
            }
          };
        },
        /*
        // Handler that runs when a new device is disconnected
        */

        disconnectedHandler: function(portal) {
          return function(data) {
            console.log('disconnected');
            return portal.removeDevice(data.deviceID);
          };
        }
      };
      /*
      // Class definition of DemoboPortal
      */

      DemoboPortal = (function() {
        /*
        //constructor of `DemoboPortal`
        */
        function DemoboPortal() {
          this.attributes = {};
          this.DEMOBO = window.DEMOBO;
          this.demobo = window.demobo;
          this.DEMOBO_DEBUG = window.DEMOBO_DEBUG;
          this._events = {};
          this.initialize();
        }

        /*
        // Get current website's remote control url
        */


        DemoboPortal.prototype.getRemote = function() {
          var key, pat, url, val;

          url = document.URL;
          for (key in remotes) {
            val = remotes[key];
            pat = new RegExp(key);
            if (pat.test(url)) {
              return val;
            }
          }
          return null;
        };

        /*
        // Return an object that contains all available bobos for the current website.
        */


        DemoboPortal.prototype.getBoboRoutes = function() {
          var remote, toReturn;

          if (window.demoboDevBobos) {
            return window.demoboDevBobos;
          }
          toReturn = {
            'input': base + 'inputtool-new.js',
            'dummy': base + 'dummy.js',
            'browsertool': base + 'browsertool-new.js'
          };
          remote = this.getRemote();
          if (remote) {
            toReturn['remote'] = base + remote;
          }
          return toReturn;
        };

        /*
        // Return true if this is extension
        */


        DemoboPortal.prototype.isExtension = function() {
          return this.get('isExtension') === 1;
        };

        /*
        //Called immediately upon the object's instantiation (guaranteed)
        */


        DemoboPortal.prototype.initialize = function() {
          var boboRoutes, name, route;

          boboRoutes = this.getBoboRoutes();
          this.set('version', version);
          this.set('bobos', {});
          this.set('eventHandlers', {});
          this.set('deviceBoboMap', {});
          this.set('boboDeviceMap', {});
          this.set('curBobo', null);
          this.set('boboRoutes', boboRoutes);
          this.set('lastBoboID', this.loadLastBoboID());
          this.set('isExtension', window._extension);
          delete window._extension;
          /*
          // Register event handlers for connected, disconnected,
          */

          this.demobo.addEventListener('connected', demoboHandlers.connectedHandler(this));
          this.demobo.addEventListener('enabled', demoboHandlers.enabledHandler(this));
          this.demobo.addEventListener('disabled', demoboHandlers.disabledHandler(this));
          this.demobo.addEventListener('disconnected', demoboHandlers.disconnectedHandler(this));
          this.demobo.addEventListener('mb', demoboHandlers.mbHandler(this));
          this.on('change:bobos', demoboHandlers.handlerBobosChange);
          this.on('change:curBobo', demoboHandlers.handlerCurBoboChange);
          this.on('add:bobos', demoboHandlers.handleBoboAdd);
          window.DEMOBO.init = function() {};
          window.demobo.start();
          window.addEventListener('focus', function() {
            return setTimeout(function() {
              return window.demobo.getDeviceInfo.apply(window.demobo, ['', 'fuck=function f(data){window.demoboPortal.addExistentDevice.apply(window.demoboPortal, [data])}']);
            }, 1000);
          });
          for (name in boboRoutes) {
            route = boboRoutes[name];
            loadJS(route);
          }
          return true;
        };

        /*
        // Add a connected device and map it to the current bobo
        */


        DemoboPortal.prototype.addExistentDevice = function(data) {
          var deviceID;

          deviceID = data.deviceID;
          if (__indexOf.call(Object.keys(this.get('deviceBoboMap')), deviceID) < 0) {
            this.setDeviceController(this.get('curBobo'), deviceID);
            return this.addDevice(deviceID);
          }
        };

        /*
        // Make an rpc on the device. if `deviceID` is not specified, make the rpc on all devices connected to the specified bobo
        */


        DemoboPortal.prototype.callFunction = function(functionName, data, deviceID, boboID) {
          var dID, deviceIDs, _i, _len;

          if (deviceID) {
            return this.demobo.callFunction(functionName, data, deviceID);
          } else {
            deviceIDs = this.get('boboDeviceMap')[boboID];
            for (_i = 0, _len = deviceIDs.length; _i < _len; _i++) {
              dID = deviceIDs[_i];
              this.demobo.callFunction(functionName, data, dID);
            }
            return false;
          }
        };

        /*
        //If the event is already registered, add a handler to its dispatcher; otherwise create a new dispatcher
        */


        DemoboPortal.prototype.addEventListener = function(eventName, handler, boboID) {
          var dispatcher, handlers, _temp;

          handlers = this.get('eventHandlers');
          dispatcher = handlers[eventName];
          if (dispatcher != null) {
            handlers[eventName].addHandler(boboID, handler);
          } else {
            dispatcher = new Dispatcher(eventName, this);
            handlers[eventName] = dispatcher;
            dispatcher.addHandler(boboID, handler);
            _temp = {};
            _temp[eventName] = function() {
              return dispatcher.dispatch.apply(dispatcher, arguments);
            };
            this.demobo.mapInputEvents(_temp);
          }
          return true;
        };

        /*
        //Get the boboID of the device, based on the current mapping
        */


        DemoboPortal.prototype.getDeviceBoboID = function(deviceID) {
          var map;

          map = this.get('deviceBoboMap');
          return map[deviceID];
        };

        /*
        //Set a device's controller
        */


        DemoboPortal.prototype.setDeviceController = function(boboObj, deviceID) {
          var bobo, boboID, boboInfos, curBoboID, info, toSend, _ref;

          toSend = {};
          _.extend(toSend, boboObj.getInfo('controller'));
          boboInfos = [];
          curBoboID = this.get('curBobo').getInfo('boboID');
          _ref = this.get('bobos');
          for (boboID in _ref) {
            bobo = _ref[boboID];
            info = {};
            info['id'] = boboID;
            info['icon'] = bobo.getInfo('iconClass');
            if (boboID === curBoboID) {
              info['active'] = 1;
            }
            boboInfos.push(info);
          }
          toSend['bobos'] = this.getBobosInfo();
          return this.demobo.setController(toSend, deviceID);
        };

        /*
        // get information of bobos
        */


        DemoboPortal.prototype.getBobosInfo = function() {
          var bobo, boboID, boboInfos, curBoboID, info, _ref;

          boboInfos = [];
          curBoboID = this.get('curBobo').getInfo('boboID');
          _ref = this.get('bobos');
          for (boboID in _ref) {
            bobo = _ref[boboID];
            info = {};
            info['id'] = boboID;
            info['icon'] = bobo.getInfo('iconClass');
            info['description'] = bobo.getInfo('description');
            info['name'] = bobo.getInfo('name');
            info['type'] = bobo.getInfo('type');
            info['priority'] = bobo.getInfo('priority');
            info['iconName'] = bobo.getInfo('iconClass');
            if (boboID === curBoboID) {
              info['active'] = 1;
            }
            boboInfos.push(info);
          }
          return boboInfos.sort(function(a, b) {
            if (a.priority > b.priority) {
              return -1;
            } else if (a.priority < b.priority) {
              return 1;
            } else {
              if (a.id < b.id) {
                return -1;
              } else if (a.id === b.id) {
                return 0;
              } else {
                return 1;
              }
            }
          });
        };

        /*
        //Return true if `deviceID` is already in the mapping; false otherwise.
        */


        DemoboPortal.prototype.hasDevice = function(deviceID) {
          return __indexOf.call(this.get('deviceBoboMap'), deviceID) >= 0;
        };

        /*
        // Add a device
        */


        DemoboPortal.prototype.addDevice = function(deviceID, boboID) {
          if (!this.hasDevice(deviceID)) {
            if (!boboID) {
              /* if boboID is not specified, set it to the current boboID
              */

              boboID = this.get('curBobo').getInfo('boboID');
            }
            this.get('deviceBoboMap')[deviceID] = boboID;
            this.get('boboDeviceMap')[boboID].push(deviceID);
            this.trigger('add:device', deviceID);
            return true;
          }
          return false;
        };

        /*
        //Delete `deviceID` from the mapping
        */


        DemoboPortal.prototype.removeDevice = function(deviceID) {
          var boboID, devices;

          boboID = this.getDeviceBoboID(deviceID);
          devices = this.get('boboDeviceMap')[boboID];
          devices.splice(devices.indexOf(deviceID), 1);
          delete this.get('deviceBoboMap')[deviceID];
          this.trigger('delete:device', deviceID);
          return true;
        };

        /* Set the mappings so that `deviceID` points to `boboID`
        */


        DemoboPortal.prototype.setDevice = function(deviceID, boboID) {
          var devices, oldBoboId;

          if (this.hasDevice(deviceID)) {
            oldBoboId = this.getDeviceBoboID(deviceID);
            if (oldBoboId === boboID) {
              return false;
            } else {
              this.get('deviceBoboMap')[deviceID] = boboID;
              devices = this.get('boboDeviceMap')[oldBoboID];
              devices.splice(devices.indexOf(deviceID), 1);
              this.get('boboDeviceMap')[boboID].push(deviceID);
              this.trigger('change:device', deviceID, oldBoboID, boboID);
              return true;
            }
          } else {
            return this.addDevice(deviceID);
          }
        };

        /*
        //TODO: might be remvoed?
        */


        DemoboPortal.prototype.setController = function(controller) {
          return this.demobo.setController(controller);
        };

        /*
        // Set most recently used bobo in localstorage
        */


        DemoboPortal.prototype.saveLastBoboID = function() {
          return window.localStorage.setItem('demoboLastBobo', this.get('curBobo').getInfo('boboID'));
        };

        /*
        // get most recently used bobo in localstorage
        */


        DemoboPortal.prototype.loadLastBoboID = function() {
          return window.localStorage.getItem('demoboLastBobo');
        };

        /*
        // Switch to another bobo
        */


        DemoboPortal.prototype.switchBobo = function(boboID, callResume) {
          var boboDeviceMap, deviceBoboMap, deviceID, devices, newBobo, oldBobo, oldBoboID, _i, _j, _len, _len1;

          oldBobo = this.get('curBobo');
          oldBoboID = oldBobo.getInfo('boboID');
          oldBobo.pause();
          boboDeviceMap = this.get('boboDeviceMap');
          deviceBoboMap = this.get('deviceBoboMap');
          devices = boboDeviceMap[oldBoboID];
          for (_i = 0, _len = devices.length; _i < _len; _i++) {
            deviceID = devices[_i];
            deviceBoboMap[deviceID] = boboID;
          }
          boboDeviceMap[boboID] = devices.slice();
          boboDeviceMap[oldBoboID] = [];
          newBobo = this.get('bobos')[boboID];
          this.set('curBobo', newBobo);
          for (_j = 0, _len1 = devices.length; _j < _len1; _j++) {
            deviceID = devices[_j];
            this.setDeviceController(newBobo, deviceID);
          }
          if (callResume) {
            newBobo.resume();
          }
          if (this.shouldSaveBoboID(boboID)) {
            this.saveLastBoboID();
          }
          return true;
        };

        /*
        // return false if the bobo is a "platform" bobo such as catalog, phone ...
        */


        DemoboPortal.prototype.shouldSaveBoboID = function(boboID) {
          var platformBobos;

          platformBobos = ['http://rc1.demobo.com/v1/momos/browsertool/control.html?0614'];
          return !(__indexOf.call(platformBobos, boboID) >= 0);
        };

        /*
        // Take an argument of a extended `Bobo` class and create a new `Bobo` instance.
        */


        DemoboPortal.prototype.addBobo = function(boboClass) {
          var boboID, boboObj, bobos, eventName, handler, handlers, temp;

          boboObj = new boboClass(this);
          /*
          // If `boboID` dosn't exist, set `boboID` to this bobo's controller url
          */

          temp = boboObj.getInfo('boboID');
          if (temp) {
            boboID = temp;
          } else {
            boboID = boboObj.getInfo('controller').url;
            boboObj.setInfo('boboID', boboID);
          }
          bobos = this.get('bobos');
          if (__indexOf.call(bobos, boboID) < 0) {
            bobos[boboID] = boboObj;
            this.get('boboDeviceMap')[boboID] = [];
            handlers = boboObj.getInfo('inputEventHandlers');
            for (eventName in handlers) {
              handler = handlers[eventName];
              this.addEventListener(eventName, handler, boboID);
            }
            if (!this.get('curBobo')) {
              this.set('curBobo', boboObj);
              /* shame to have to code this like this...
              */

              setTimeout(function() {
                return window.demobo.getDeviceInfo.apply(window.demobo, ['', 'fuck=function f(data){window.demoboPortal.addExistentDevice.apply(window.demoboPortal, [data])}']);
              }, 1000);
            } else if (boboID === this.get('lastBoboID')) {
              boboObj.setInfo('priority', 10);
              this.switchBobo(boboObj.getInfo('boboID'));
            } else if ((!(this.get('curBobo').getInfo('boboID') === this.get('lastBoboID'))) && (boboObj.getInfo('priority') > this.get('curBobo').getInfo('priority'))) {
              this.switchBobo(boboObj.getInfo('boboID'));
            }
            this.trigger('add:bobos', boboID, boboObj);
            return true;
          }
          return false;
        };

        /*
        // Return the value of the key
        */


        DemoboPortal.prototype.get = function(key) {
          return this.attributes[key];
        };

        /*
        // Register a event with its handler
        */


        DemoboPortal.prototype.on = function(eventName, handler) {
          this._events[eventName] = handler;
          return true;
        };

        /*
        // Trigger event
        */


        DemoboPortal.prototype.trigger = function(eventName) {
          var handler;

          if ((handler = this._events[eventName])) {
            handler.apply(this, [].slice.apply(arguments, [1]));
            return true;
          } else {
            return false;
          }
        };

        /*
        // Set an attribute's value. If the old value is different from the new value, 'change:`key`' is triggered
        */


        DemoboPortal.prototype.set = function(key, val) {
          var oldVal;

          oldVal = this.attributes[key];
          if (!(oldVal === val)) {
            this.attributes[key] = val;
            this.trigger('change:' + key, oldVal, val);
          }
          return oldVal;
        };

        /*
        // turnoff favicon
        */


        DemoboPortal.prototype.turnOffFavicon = function() {
          var favicon;

          favicon = this.get('favicon');
          if (favicon) {
            return favicon.turnOff();
          }
        };

        /*
        // turn on favicon
        */


        DemoboPortal.prototype.turnOnFavicon = function() {
          var favicon;

          favicon = this.get('favicon');
          if (favicon) {
            return favicon.turnOn();
          }
        };

        /*
        // Create the view of a bobo, which would be showed up in portal
        */


        DemoboPortal.prototype.createBoboView = function(boboID, boboInfo) {
          return null;
        };

        return DemoboPortal;

      })();
      /*
      //Execution
      //----------------
      // instantiate a `DemoboPortal` object and expose to global use
      */

      loadJS('//d32q09dnclw46p.cloudfront.net/demobo.1.7.2.min.js', function() {
        var demoboPortal;

        demoboPortal = new DemoboPortal();
        window.demoboPortal = demoboPortal;
        /*
        // Load script of connection dialog and show the dialog if necessary
        */

        loadJS(connectScript, function() {
          return window.__dmtg = function() {
            var visible;

            visible = document.getElementById('demoboConnect').style.top !== '';
            if (visible) {
              return window._hideDemoboConnect();
            } else {
              return window._showDemoboConnect();
            }
          };
        });
        return loadJS(faviconScript, function() {
          var favicon;

          favicon = new DeMoboFavicon();
          return demoboPortal.set('favicon', favicon);
        });
      });
    }
    delete window.demoboLoading;
  }

}).call(this);
