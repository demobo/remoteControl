###
// demobo-portal.js 1.0.0

// (c) 2013 Jiahao Li, de Mobo LLC
###


###
//`window.demoboLoading` is a flag that keeps loading bookmarklet safe 
###
if not window.demoboLoading

  ### 
  //Set the flag so that another demobo script wont interrupt 
  ###
  window.demoboLoading = 1 

  if window.demoboOn
    ### 
    //If demobo is already on, do nothing 
    ###
    delete window.demoboLoading 

  else
    window.demoboOn = 1
  
    ###
    // Baseline Setup
    // ---------------
    // Current version
    ###
    version = '1.0.0'

    ### 
    //Set this to false if production. In local environment, the Google App Engine server serves as the http server, and Apache server(default on port 443) is the https server. In production environment, a server will serve both http and https requests.
    ###
    dev = window.demoboDev
    if dev
      base = window.demoboBase+'/apps/'
      connectScript = window.demoboBase+'/core/connect.js'
    else
      base = '//rc1-dot-de-mobo.appspot.com/apps/'
      connectScript = '//rc1-dot-de-mobo.appspot.com/core/connect.js'
    
    ###
    // This sets the routing of controllers for websites (currently hardcoded)
    ###
    remotes = 
      'www.pandora.com':     'pandora.com-new.js'
      'douban.fm':           'douban.fm-new.js'
      'www.youtube.com':     'youtube.com-new.js'
      'www.last.fm':         'last.fm-new.js'
      '8tracks.com':         '8tracks.com-new.js'
      'vimeo.com':           'vimeo.com-new.js'
      'youku.com':           'youku.com-new.js'
      'www.rdio.com':        'rdio.com-new.js'
      'grooveshark.com':     'grooveshark.com-new.js'
      'play.spotify.com':    'spotify.com-new.js'

    ###
    // definitions of utilities 
    // ------------------------
    // A function that caches a script using object tag
    ###
    cacheJS = (src) ->
      cache = document.createElement('object')
      cache.data = src
      cache.className = 'demoboCache'
      cache.width = 0
      cache.height = 0
      document.body.appendChild(cache)

    ###
    // Try to preload demobo API and other scripts as early as possible
    ###
    cacheJS('//d32q09dnclw46p.cloudfront.net/demobo.1.7.0.min.js')
    cacheJS(connectScript)

    ###
    // A function that loads a script and executes the call back after the script is executed
    ###
    loadJS = (src, f) ->
      script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', src)
      script.className = 'demoboJS'
      document.body.appendChild(script)
      script.onload = f

    
    ###
    // external libraries 
    // ------------------
    // Constants used by underscore.js codes 
    ###
    _ = {}
    nativeForEach = Array.prototype.forEach
    breaker = {}
    
    ### 
    // Functions defined by underscore.js 
    ###
    `
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
    }`
    _.has = (obj, key)->
      return Object.prototype.hasOwnProperty.call(obj, key)
    
    `
    _.extend = function(obj) {
      _.each(Array.prototype.slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    }`
    
    ### 
    // Codes copied and adapted from backbone.js. Used for inheritance 
    ###
    extend = (protoProps, staticProps) ->
      parent = this
     
      if protoProps and _.has(protoProps, 'constructor')
        child = protoProps.constructor
      else
        child = ->
          return parent.apply(this, arguments)
      
      _.extend(child, parent, staticProps)
    
      `function ctor() { this.constructor = child; } 
      ctor.prototype = parent.prototype; 
      child.prototype = new ctor(); 
      child.__super__ = parent.prototype`
    
      return child
    
    ###
    // Bobo base class
    // ----------------
    // Base class of all BOBOs. Every new bobo should extend this class and overwrite at least its `initialize` method  
    ###
    class Bobo
      ### 
      // Constructor of `Bobo`
      ###
      constructor: (@portal) ->
        @boboInfos = {}
        @_events = {}
    
        defaultConfig = 
          'developer': 'developer@demobo.com'
        
        @boboInfos['config'] = defaultConfig
        @boboInfos['boboID'] = null
        @boboInfos['connectedDevices'] = {}
        @boboInfos['inputEventHandlers'] = {}
        this.initialize()
    
      ### 
      // Register a event handler to the Object's properties. In the handler, `this` refers to this object. Example:
      ###
      on: (eventName, handler)->
        @_events[eventName] = handler
        true
    
      ### 
      //Trigger specific event handler 
      ###
      trigger: (eventName) ->
        if (handler = @_events[eventName])
          handler.apply(this, [].slice.apply(arguments, [1]))
          return true
        else
          return false

      ### 
      //Call the function on device. if `devicedID` is not specified, call the function on all devices connected to this bobo 
      ###
      callFunction: (functionName, data, deviceID)->
        return @portal.callFunction(functionName, data, deviceID, this.getInfo('boboID'))
    
      ###
      //Called immediately upon this bobo's instantiation (guaranteed). A bobo that inherits the base `Bobo` class should overwrite this method
      ###
      initialize:->
        this.setInfo('controller', {})
        this.setInfo('inputEventHandlers', {})
        return true
        
      ### 
      //Return the value of the key 
      ###
      getInfo: (key)->
        return @boboInfos[key]
    
      ###
      // set the value of the key. If the old value is different from the new value, 'change:`key`' event is triggered 
      ###
      setInfo: (key, val)->
        oldVal = @boboInfos[key]
        unless oldVal is val
          @boboInfos[key] = val
          this.trigger 'change:'+key, oldVal, val
        return oldVal
    
      ### 
      //set controller params. which will be passed to phone when new device is connected 
      ###
      setController: (params)->
        return this.setInfo('controller', params)
    

      ###
      // set event listeners. which will be in turn set to demobo when the bobo is instantiated
      ###
      setInputEventHandlers: (inputEventHandlers)->
        _thisBobo = this
        wrapper = (bobo, functionName)->
          return ()->
            bobo[functionName].apply(bobo, arguments)
        hs = {}
        for eventName, handlerName of inputEventHandlers
          hs[eventName] = wrapper(_thisBobo, handlerName)


        this.setInfo('inputEventHandlers', hs)
        return true
    
      ###
      // reservered for future use 
      ###
      run: ->
      
      ###
      // reservered for future use 
      ###
      resume: ->

      ###
      // reservered for future use 
      ###
      finish: ->
     
    ###
    // Set up `Bobo` for global use
    ###
    Bobo.extend = extend
    window.Bobo = Bobo

    ### 
    //a dispatcher object for event listeners 
    ###
    class Dispatcher
      ###
      //Constructor of `Dispatcher` 
      ###
      constructor: (@eventListened, @portal)->
        @handlers = {}

      ###
      //add a bobo's event handler 
      ###
      addHandler: (boboID, handler)->
        @handlers[boboID] = handler

      ###
      // call corresponding handler based on `deviceID` (and its corresponding `boboID`) 
      ###
      dispatch: (value, data)->
        deviceID = data.deviceID
        boboID = @portal.getDeviceBoboID(deviceID)
        if boboID in Object.keys(@handlers)
          return @handlers[boboID](value, data)
        return null
      
    ###
    // Handlers used by a `DemoboPortal` object, which listen to the change of the object's properties, e.g. change of bobos, addition of new bobo, etc.
    ###
    demoboHandlers = {
      handlerBobosChange: (oldVal, newVal)->
        console.log 'bobos changed from '+oldVal+' to '+newVal

      handlerCurBoboChange: (oldVal, newVal)->
        console.log 'current bobo changed from '+oldVal+' to '+newVal

      handleBoboAdd: (boboID, boboObj)->
        console.log('new bobo added, id: '+boboID)


      ###
      // Handler that runs when a new device is connected
      ###
      connectedHandler: (portal)->
        return (data)->
          console.log('connected')
          console.log(portal)
          portal.setDeviceController(portal.get('curBobo'), data.deviceID)
          portal.addDevice(data.deviceID)

      ###
      // Handler that runs when a new device is disconnected
      ###
      disconnectedHandler: (portal)->
        return (data)->
          console.log('disconnected')
          console.log(portal)
          portal.removeDevice(data.deviceID)
    }

    ###
    // Class definition of DemoboPortal 
    ###
    class DemoboPortal
      ###
      //constructor of `DemoboPortal`
      ###
      constructor: ()->
        @attributes = {}
        @DEMOBO = window.DEMOBO
        @demobo = window.demobo
        @DEMOBO_DEBUG = window.DEMOBO_DEBUG
        @_events = {}
        this.initialize()

      ###
      // Get current website's remote control url
      ###
      getRemote: ()->
        domain = document.domain
        for key, val of remotes
          if key is domain
            return val
        return null

      ###
      // Return an object that contains all available bobos for the current website.
      ###
      getBoboRoutes: ()->
        toReturn = {}
        remote = this.getRemote()
        if remote
          toReturn['remote'] = base + remote
        return toReturn


      ###
      //Called immediately upon the object's instantiation (guaranteed) 
      ###
      initialize: ()->
        boboRoutes = this.getBoboRoutes()
        this.set('version', version)

        this.set('bobos', {})
        this.set('eventHandlers', {})
        this.set('deviceBoboMap', {})
        this.set('boboDeviceMap', {})
        this.set('curBobo', null)
        this.set('boboRoutes', boboRoutes)

        @demobo.addEventListener('connected', demoboHandlers.connectedHandler(this))
        ### handlers when a device is connected ###
        @demobo.addEventListener('disconnected', demoboHandlers.disconnectedHandler(this))
        ### handlers when a device is disconnected ###

        this.on('change:bobos', demoboHandlers.handlerBobosChange)
        this.on('change:curBobo', demoboHandlers.handlerCurBoboChange)
        this.on('add:bobos', demoboHandlers.handleBoboAdd)

        window.DEMOBO.init = ()->
        window.demobo.start()

        for name, route of boboRoutes
          loadJS(route)
        
        true
      
      ###
      // Add a connected device and map it to the current bobo
      ###
      addExistentDevice: (data)->
        deviceID = data.deviceID
        this.setDeviceController(this.get('curBobo'), deviceID)
        this.addDevice(deviceID)

      ###
      // Make an rpc on the device. if `deviceID` is not specified, make the rpc on all devices connected to the specified bobo 
      ###
      callFunction: (functionName, data, deviceID, boboID)->
        if deviceID
          return @demobo.callFunction(functionName, data, deviceID)
        else
          deviceIDs = this.get('boboDeviceMap')[boboID]
          for dID in deviceIDs
            @demobo.callFunction(functionName, data, dID)
          return false #this return doesn't make much sense...

      ###
      //If the event is already registered, add a handler to its dispatcher; otherwise create a new dispatcher
      ###
      addEventListener: (eventName, handler, boboID)->
        handlers = this.get('eventHandlers')
        dispatcher = handlers[eventName]
        console.log(dispatcher?)
        if dispatcher?
          handlers[eventName].addHandler(boboID, handler)
        else
          dispatcher = new Dispatcher(eventName, this)
          handlers[eventName] = dispatcher
          dispatcher.addHandler(boboID, handler)
          _temp = {}
          _temp[eventName] = ()->
            dispatcher.dispatch.apply(dispatcher, arguments)
          @demobo.mapInputEvents(_temp)
        return true

      ###
      //Get the boboID of the device, based on the current mapping 
      ###
      getDeviceBoboID: (deviceID)->
        map = this.get('deviceBoboMap')
        return map[deviceID]

      ###
      //Set a device's controller 
      ###
      setDeviceController: (boboObj, deviceID)->
        return @demobo.setController(boboObj.getInfo('controller'), deviceID)
      
      ###
      //Return true if `deviceID` is already in the mapping; false otherwise.
      ###
      hasDevice: (deviceID)->
        return deviceID in this.get('deviceBoboMap')

      ###
      // Add a device
      ###
      addDevice: (deviceID, boboID)->
        if not this.hasDevice(deviceID)
          if not boboID
            ### if boboID is not specified, set it to the current boboID ###
            boboID = this.get('curBobo').getInfo('boboID') 
          this.get('deviceBoboMap')[deviceID] = boboID
          this.get('boboDeviceMap')[boboID].push(deviceID)
          this.trigger('add:device', deviceID)
          return true
        return false

      ###
      //Delete `deviceID` from the mapping
      ###
      removeDevice: (deviceID)->
        boboID = this.getDeviceBoboID(deviceID)
        devices = this.get('boboDeviceMap')[boboID]
        devices.splice(devices.indexOf(deviceID), 1)
        delete this.get('deviceBoboMap')[deviceID]
        this.trigger('delete:device', deviceID)
        true

      ### Set the mappings so that `deviceID` points to `boboID` ###
      setDevice: (deviceID, boboID)->
        if this.hasDevice(deviceID)
          oldBoboId = this.getDeviceBoboID(deviceID)
          if oldBoboId is boboID
            return false
          else
            this.get('deviceBoboMap')[deviceID] = boboID
            devices = this.get('boboDeviceMap')[oldBoboID]
            devices.splice(devices.indexOf(deviceID), 1)
            this.get('boboDeviceMap')[boboID].push(deviceID)
            this.trigger('change:device', deviceID, oldBoboID, boboID)
            return true
        else
          return this.addDevice(deviceID)


      ###
      //TODO: might be remvoed? 
      ###
      setController: (controller)->
        @demobo.setController(controller)

      ###
      // Switch to another bobo 
      ###
      switchBobo: (boboID)->
        oldBoboID = this.get('curBobo').getInfo('boboID')
        boboDeviceMap = this.get('boboDeviceMap')
        deviceBoboMap = this.get('deviceBoboMap')
        
        devices = boboDeviceMap[oldBoboID]
        for deviceID in devices
          deviceBoboMap[deviceID] = boboID
      
        boboDeviceMap[boboID] = devices.slice()
        boboDeviceMap[oldBoboID] = []

        newBobo = this.get('bobos')[boboID]
        this.setDeviceController(newBobo)
        this.set('curBobo', newBobo)

        newBobo.resume()
        return true
     
      ###
      // Take an argument of a extended `Bobo` class and create a new `Bobo` instance. 
      ###
      addBobo: (boboClass)->
        boboObj = new boboClass(this)

        ###
        // If `boboID` dosn't exist, set `boboID` to this bobo's controller url
        ###
        temp = boboObj.getInfo('boboID')
        if temp
          boboID = temp
        else
          boboID = boboObj.getInfo('controller').url
          boboObj.setInfo('boboID', boboID)

        bobos = this.get('bobos')
        unless boboID in bobos
          bobos[boboID] = boboObj
          this.get('boboDeviceMap')[boboID] = []
          handlers = boboObj.getInfo('inputEventHandlers')
          for eventName, handler of handlers
            this.addEventListener(eventName, handler, boboID)

          if not this.get('curBobo')
            this.set('curBobo', boboObj)
            ### shame to have to code this like this... ###
            setTimeout(()->
              window.demobo.getDeviceInfo.apply(window.demobo, ['', 'g=function f(data){window.demoboPortal.addExistentDevice.apply(window.demoboPortal, [data])}'])
            , 1000)
           
          #this.setController(boboObj.getInfo('controller'))
          this.trigger('add:bobos', boboID, boboObj)
          return true
        return false

      ###
      // Return the value of the key
      ###
      get: (key)->
        @attributes[key]
  
      ###
      // Register a event with its handler
      ###
      on: (eventName, handler) ->
        @_events[eventName] = handler
        true
  
      ###
      // Trigger event
      ###
      trigger: (eventName) ->
        if (handler=@_events[eventName])
          handler.apply(this, [].slice.apply(arguments, [1]))
          return true
        else
          return false
  
      ###
      // Set an attribute's value. If the old value is different from the new value, 'change:`key`' is triggered
      ###
      set: (key, val)->
        oldVal = @attributes[key]
        unless (oldVal is val)
          @attributes[key] = val
          this.trigger 'change:'+key, oldVal, val
        
        return oldVal

      ###
      // Create the view of a bobo, which would be showed up in portal 
      ###
      createBoboView: (boboID, boboInfo)->
        menuContainer = document.getElementById('demoboMenuContainer')
        if menuContainer
          d = document.createElement('div')
          d.className='demoboBoboItem'
          i = document.createElement('img')
          i.className='demoboBoboIcon'
          i.src=base+boboInfo.iconUrl
          boboObj = this
          i.onclick = ()->
            boboObj.switchBobo(boboID) 
            console.log('wanna switched to '+boboID)
          d.appendChild(i)
          menuContainer.appendChild(d)
          return d
        return null
    
    ###
    //Execution
    //----------------
    // instantiate a `DemoboPortal` object and expose to global use
    ###
    loadJS('//d32q09dnclw46p.cloudfront.net/demobo.1.7.0.min.js',()->
      demoboPortal = new DemoboPortal()
      window.demoboPortal = demoboPortal
    
      ### 
      // Set up css for the small cute de Mobo icon. 
      ###
      demoboCss = document.createElement('style')
      demoboCss.className = 'demoboCSS'
      cssContent = "
      #demoboMiniIcon {
        z-index:10000;
        width:30px;
        opacity:0.15;
        position:fixed;
        right:20px;
        bottom:60px;
        -webkit-transition: opacity 0.5s ease;
        transition: opacity 0.5x ease;
        cursor:pointer;
      }
  
      #demoboMiniIcon:hover {
        opacity:0.7;
      }

      #demoboMiniIcon.selected {
        opacity:0.7;
      }
      
      #demoboMiniIcon:active {
        opacity:1;
      }
      "
      demoboCss.innerText = cssContent
      document.body.appendChild(demoboCss)
  
      ###
      // Small demobo icon at the right bottom of the page
      ###
      container = document.createElement('div')

      icon = document.createElement('img')
      icon.className = 'demoboIMG'
      icon.id = 'demoboMiniIcon' 
      icon.title='demobo mini' 
      icon.src=base+'demobo.png'
  
      container.appendChild(icon)
      document.body.appendChild(container)

      ###
      // Load script of connection dialog and show the dialog if necessary
      ###
      loadJS(connectScript)

      ###
      // Setup click handler of our small cute de Mobo icon
      ###
      icon.onclick = () ->
        if icon.classList.length is 1
          window._showDemoboConnect()
        else
          window._hideDemoboConnect()
    )

  delete window.demoboLoading
  
