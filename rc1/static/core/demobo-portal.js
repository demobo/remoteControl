// Generated by CoffeeScript 1.6.2
/* set this to false if production
*/


(function() {
  var Bobo, DemoboPortal, Dispatcher, base, breaker, cacheJS, demoboHandlers, dev, extend, loadJS, nativeForEach, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  dev = window.demoboDev;

  if (dev) {
    base = window.demoboBase + '/apps/';
  } else {
    base = 'http://rc1.demobo.com/apps/';
  }

  if (!window.demoboLoading) {
    window.demoboLoading = 1;
    /* set the flag so that another demobo script wont interrupt
    */

    if (window.demoboOn) {
      /*demobo is already on. Do nothing
      */

      console.log('demobo is already on');
      delete window.demoboLoading;
    } else {
      window.demoboOn = 1;
      /*
      *******************************************************
      definitions of utilities 
      *******************************************************
      */

      cacheJS = function(src) {
        /* create an object tag to preload a script
        */

        var cache;

        cache = document.createElement('object');
        cache.data = src;
        cache.className = 'demoboCache';
        cache.width = 0;
        cache.height = 0;
        return document.body.appendChild(cache);
      };
      cacheJS('http://api.demobo.com/demobo.1.7.0.min.js');
      /* try to preload the demobo api
      */

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
      /* some constants used by underscore.js codes
      */

      _ = {};
      nativeForEach = Array.prototype.forEach;
      breaker = {};
      /* functions defined by underscore.js
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
      /* Codes copied and adapted from backbone.js. Used for inheritance
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
      Bobo = (function() {
        /* Base class of all BOBOs. Every new bobo should extend this class and overwrite at least its initialize method
        */
        function Bobo(portal) {
          var defaultConfig;

          this.portal = portal;
          /* constructor of Bobo
          */

          this.boboInfos = {};
          this._events = {};
          defaultConfig = {
            'developer': 'developer@demobo.com'
          };
          this.boboInfos['config'] = defaultConfig;
          this.boboInfos['boboID'] = null;
          this.boboInfos['connectedDevices'] = {};
          this.boboInfos['inputEventHandlers'] = {};
          this.initialize();
        }

        Bobo.prototype.on = function(eventName, handler) {
          /* register a event handler to the Object's properties. In the handler, "this" refers to this object
          */
          this._events[eventName] = handler;
          return true;
        };

        Bobo.prototype.trigger = function(eventName) {
          /* trigger specific event handler
          */

          var handler;

          if ((handler = this._events[eventName])) {
            handler.apply(this, [].slice.apply(arguments, [1]));
            return true;
          } else {
            return false;
          }
        };

        Bobo.prototype.callFunction = function(functionName, data, deviceID) {
          /* call the function on device. if deviced id is not specified, call the function on all devices connected to this bobo
          */
          return this.portal.callFunction(functionName, data, deviceID, this.getInfo('boboID'));
        };

        Bobo.prototype.initialize = function() {
          /* called immediately upon this bobo's instantiation (guaranteed). bobo's that inherits the base Bobo class should overwrite this method
          */
          this.setInfo('controller', {});
          this.setInfo('inputEventHandlers', {});
          return true;
        };

        Bobo.prototype.getInfo = function(key) {
          /* return the value of the key
          */
          return this.boboInfos[key];
        };

        Bobo.prototype.setInfo = function(key, val) {
          var oldVal;

          oldVal = this.boboInfos[key];
          if (oldVal !== val) {
            this.boboInfos[key] = val;
            this.trigger('change:' + key, oldVal, val);
          }
          return oldVal;
        };

        Bobo.prototype.setController = function(params) {
          /* set controller params. which will be passed to phone when new device is connected
          */
          return this.setInfo('controller', params);
        };

        Bobo.prototype.setInputEventHandlers = function(inputEventHandlers) {
          /* set event listeners. which will be in turn set to demobo when the bobo is instantiated
          */

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

        Bobo.prototype.run = function() {
          /* reservered for future use
          */

        };

        Bobo.prototype.resume = function() {};

        Bobo.prototype.finish = function() {
          /* reservered for future use
          */

        };

        return Bobo;

      })();
      Bobo.extend = extend;
      window.Bobo = Bobo;
      Dispatcher = (function() {
        /* a dispatcher object for event listeners
        */
        function Dispatcher(eventListened, portal) {
          this.eventListened = eventListened;
          this.portal = portal;
          /* constructor of Dispatcher
          */

          this.handlers = {};
        }

        Dispatcher.prototype.addHandler = function(boboID, handler) {
          /* add a bobo's event handler
          */
          return this.handlers[boboID] = handler;
        };

        Dispatcher.prototype.dispatch = function(value, data) {
          /* call corresponding handler based on deviceID (and its corresponding boboID)
          */

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
      ***************************************************************
      Handlers used by demoboPortal, which listen to the change of demoboPortal object's properties, e.g. change of bobos, addition of new bobo
      ***************************************************************
      */

      demoboHandlers = {
        handlerBobosChange: function(oldVal, newVal) {
          return console.log('bobos changed from ' + oldVal + ' to ' + newVal);
        },
        handlerCurBoboChange: function(oldVal, newVal) {
          return console.log('current bobo changed from ' + oldVal + ' to ' + newVal);
        },
        handleBoboAdd: function(boboID, boboObj) {
          this.createBoboView(boboID, boboObj.getInfo('config'));
          return console.log('new bobo added, id: ' + boboID);
        },
        connectedHandler: function(portal) {
          return function(data) {
            /* handler that runs when a new device is connected
            */
            console.log('connected');
            console.log(portal);
            portal.setDeviceController(portal.get('curBobo'), data.deviceID);
            return portal.addDevice(data.deviceID);
          };
        },
        disconnectedHandler: function(portal) {
          return function(data) {
            console.log('disconnected');
            console.log(portal);
            return portal.removeDevice(data.deviceID);
          };
        }
      };
      DemoboPortal = (function() {
        /* class definition of DemoboPortal
        */
        function DemoboPortal() {
          /* constructor of DemoboPortal class
          */
          this.attributes = {};
          this.DEMOBO = window.DEMOBO;
          this.demobo = window.demobo;
          this.DEMOBO_DEBUG = window.DEMOBO_DEBUG;
          this._events = {};
          this.initialize();
        }

        DemoboPortal.prototype.initialize = function() {
          /* called immediately upon the object's instantiation (guaranteed)
          */

          var boboRoutes, name, route;

          boboRoutes = {
            'pandora': base + 'pandora.com-new.js',
            'inputtool': base + 'inputtool-new.js'
          };
          this.set('bobos', {});
          this.set('eventHandlers', {});
          this.set('deviceBoboMap', {});
          this.set('boboDeviceMap', {});
          this.set('curBobo', null);
          this.set('boboRoutes', boboRoutes);
          this.demobo.addEventListener('connected', demoboHandlers.connectedHandler(this));
          this.demobo.addEventListener('disconnected', demoboHandlers.disconnectedHandler(this));
          this.on('change:bobos', demoboHandlers.handlerBobosChange);
          this.on('change:curBobo', demoboHandlers.handlerCurBoboChange);
          this.on('add:bobos', demoboHandlers.handleBoboAdd);
          window.DEMOBO.init = function() {};
          window.demobo.start();
          for (name in boboRoutes) {
            route = boboRoutes[name];
            loadJS(route);
          }
          this.addExistingDevices();
          return true;
        };

        DemoboPortal.prototype.addExistingDevices = function() {
          var devices;

          return devices = this.demobo.getDevices();
        };

        DemoboPortal.prototype.callFunction = function(functionName, data, deviceID, boboID) {
          /* make an rpc on the device. if deviceID is not specified, make the rpc on all devices connected to the specified bobo
          */

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

        DemoboPortal.prototype.addEventListener = function(eventName, handler, boboID) {
          var dispatcher, handlers, _temp;

          handlers = this.get('eventHandlers');
          if (__indexOf.call(handlers, eventName) >= 0) {
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

        DemoboPortal.prototype.getDeviceBoboID = function(deviceID) {
          var map;

          map = this.get('deviceBoboMap');
          return map[deviceID];
        };

        DemoboPortal.prototype.setDeviceController = function(boboObj, deviceID) {
          return this.demobo.setController(boboObj.getInfo('controller'), deviceID);
        };

        DemoboPortal.prototype.hasDevice = function(deviceID) {
          return __indexOf.call(this.get('deviceBoboMap'), deviceID) >= 0;
        };

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

        DemoboPortal.prototype.removeDevice = function(deviceID) {
          /* delete the deviceID from keys of deviceBoboMap, and delete the deviceID from the corresponding bobo's devices list
          */

          var boboID, devices;

          boboID = this.getDeviceBoboID(deviceID);
          devices = this.get('boboDeviceMap')[boboID];
          devices.splice(devices.indexOf(deviceID), 1);
          delete this.get('deviceBoboMap')[deviceID];
          this.trigger('delete:device', deviceID);
          return true;
        };

        DemoboPortal.prototype.setDevice = function(deviceID, boboID) {
          /* set the mappings so that deviceID points to boboID
          */

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

        DemoboPortal.prototype.setController = function(controller) {
          return this.demobo.setController();
        };

        DemoboPortal.prototype.switchBobo = function(boboID) {
          var boboDeviceMap, deviceBoboMap, deviceID, devices, newBobo, oldBoboID, _i, _len;

          oldBoboID = this.get('curBobo').getInfo('boboID');
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
          this.setDeviceController(newBobo);
          this.set('curBobo', newBobo);
          newBobo.resume();
          return true;
        };

        DemoboPortal.prototype.addBobo = function(boboClass) {
          var boboID, boboObj, bobos, eventName, handler, handlers, temp;

          boboObj = new boboClass(this);
          if (!this.get('curBobo')) {
            this.set('curBobo', boboObj);
          }
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
            this.setController(boboObj.getInfo('controller'));
            this.trigger('add:bobos', boboID, boboObj);
            return true;
          }
          return false;
        };

        DemoboPortal.prototype.get = function(key) {
          return this.attributes[key];
        };

        DemoboPortal.prototype.on = function(eventName, handler) {
          this._events[eventName] = handler;
          return true;
        };

        DemoboPortal.prototype.trigger = function(eventName) {
          var handler;

          if ((handler = this._events[eventName])) {
            handler.apply(this, [].slice.apply(arguments, [1]));
            return true;
          } else {
            return false;
          }
        };

        DemoboPortal.prototype.set = function(key, val) {
          var oldVal;

          oldVal = this.attributes[key];
          if (!(oldVal === val)) {
            this.attributes[key] = val;
            this.trigger('change:' + key, oldVal, val);
          }
          return oldVal;
        };

        DemoboPortal.prototype.createBoboView = function(boboID, boboInfo) {
          var boboObj, d, i, menuContainer;

          menuContainer = document.getElementById('demoboMenuContainer');
          if (menuContainer) {
            d = document.createElement('div');
            d.className = 'demoboBoboItem';
            i = document.createElement('img');
            i.className = 'demoboBoboIcon';
            i.src = 'http://localhost:1240/' + boboInfo.iconUrl;
            boboObj = this;
            i.onclick = function() {
              boboObj.switchBobo(boboID);
              return console.log('wanna switched to ' + boboID);
            };
            d.appendChild(i);
            menuContainer.appendChild(d);
            return d;
          }
          return null;
        };

        return DemoboPortal;

      })();
      /* End of demobo session
      */

      loadJS('http://api.demobo.com/demobo.1.7.0.min.js', function() {
        var cssContent, demoboCss, demoboPortal, icon, menuContainer;

        demoboPortal = new DemoboPortal();
        window.demoboPortal = demoboPortal;
        /* icon session
        */

        demoboCss = document.createElement('style');
        demoboCss.className = 'demoboCSS';
        cssContent = '\
      #demoboMiniIcon {\
        width:30px;\
        opacity:0.15;\
        position:fixed;\
        right:20px;\
        bottom:60px;\
        -webkit-transition: opacity 0.5s ease;\
        transition: opacity 0.5x ease;\
        cursor:pointer;\
      }\
  \
      #demoboMiniIcon:hover {\
        opacity:1;\
      }\
      \
      #demoboMenuContainer {\
        width:30px;\
        height:0px;\
        position:fixed;\
        background:rgba(20, 20, 20, 0.8);\
        right:20px;\
        z-index:1;\
        -webkit-transition: height 0.5s ease;\
        transition: height 0.5s ease;\
        bottom:60px;\
        overflow:hidden;\
      }\
  \
      #demoboMenuContainer.expand {\
        height:90px;\
      }\
\
      .demoboBoboItem {\
        height:30px;\
        width:30px;\
      }\
\
      .demoboBoboIcon {\
        width:30px;\
      }\
\
      .demoboBoboIcon:hover {\
        background:white;\
      }\
      ';
        demoboCss.innerText = cssContent;
        document.body.appendChild(demoboCss);
        icon = document.createElement('img');
        icon.className = 'demoboIMG';
        icon.id = 'demoboMiniIcon';
        icon.title = 'demobo mini';
        icon.src = 'http://localhost:1240/demobo.png';
        document.body.appendChild(icon);
        menuContainer = document.createElement('div');
        menuContainer.className = 'demoboDIV';
        menuContainer.id = 'demoboMenuContainer';
        document.body.appendChild(menuContainer);
        icon.onclick = function() {
          return menuContainer.style.height = Object.keys(demoboPortal.get('bobos')).length * 30 + 'px';
        };
        return document.onclick = function(e) {
          var ele;

          ele = e.srcElement;
          if (ele.className.indexOf('demobo') !== 0) {
            return setTimeout(function() {
              return menuContainer.style.height = '0px';
            }, 500);
          }
        };
      });
    }
    /* end of critical section
    */

    window.demoboLoading = void 0;
  }

}).call(this);
