### set this to false if production ###
dev = window.demoboDev
if dev
  base = window.demoboBase+'/apps/'
else
  base = 'http://rc1.demobo.com/apps/'

if not window.demoboLoading
  window.demoboLoading = 1 
  ### set the flag so that another demobo script wont interrupt ###

  if window.demoboOn
    ###demobo is already on. Do nothing ###
    console.log('demobo is already on')
    delete window.demoboLoading 

  else
    window.demoboOn = 1

    ###
    *******************************************************
    definitions of utilities 
    *******************************************************
    ###

    cacheJS = (src) ->
      ### create an object tag to preload a script  ###
      cache = document.createElement('object')
      cache.data = src
      cache.className = 'demoboCache'
      cache.width = 0
      cache.height = 0
      document.body.appendChild(cache)

    cacheJS('http://api.demobo.com/demobo.1.7.0.min.js')
    ### try to preload the demobo api ###

    loadJS = (src, f) ->
      ### load and exec the script, code in f will be executed after this script is loaded ###
      script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', src)
      script.className = 'demoboJS'
      document.body.appendChild(script)
      script.onload = f

    ### some constants used by underscore.js codes ###
    _ = {}
    nativeForEach = Array.prototype.forEach
    breaker = {}
    
    ### functions defined by underscore.js ###
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
    
    ### Codes copied and adapted from backbone.js. Used for inheritance ###
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
    
    class Bobo
      ### Base class of all BOBOs. Every new bobo should extend this class and overwrite at least its initialize method  ###

      constructor: (@portal) ->
        ### constructor of Bobo ###
        @boboInfos = {}
        @_events = {}
    
        defaultConfig = {
          'developer': 'developer@demobo.com'
        }
        @boboInfos['config'] = defaultConfig
        @boboInfos['boboID'] = null
        @boboInfos['connectedDevices'] = {}
        @boboInfos['inputEventHandlers'] = {}
        this.initialize()
    
      on: (eventName, handler)->
        ### register a event handler to the Object's properties. In the handler, "this" refers to this object ###
        @_events[eventName] = handler
        true
    
      trigger: (eventName) ->
        ### trigger specific event handler ###
        if (handler = @_events[eventName])
          handler.apply(this, [].slice.apply(arguments, [1]))
          return true
        else
          return false

      callFunction: (functionName, data, deviceID)->
        ### call the function on device. if deviced id is not specified, call the function on all devices connected to this bobo ###
        return @portal.callFunction(functionName, data, deviceID, this.getInfo('boboID'))
    
      initialize:->
        ### called immediately upon this bobo's instantiation (guaranteed). bobo's that inherits the base Bobo class should overwrite this method###
        this.setInfo('controller', {})
        this.setInfo('inputEventHandlers', {})
        return true
    
      getInfo: (key)->
        ### return the value of the key ###
        return @boboInfos[key]
    
      setInfo: (key, val)->
        #### set the value of the key. If the old value is different from the new value, 'change:key' is triggered ###
        oldVal = @boboInfos[key]
        unless oldVal is val
          @boboInfos[key] = val
          this.trigger 'change:'+key, oldVal, val
        return oldVal
    
      setController: (params)->
        ### set controller params. which will be passed to phone when new device is connected ###
        return this.setInfo('controller', params)
    
      setInputEventHandlers: (inputEventHandlers)->
        ### set event listeners. which will be in turn set to demobo when the bobo is instantiated###
        _thisBobo = this
        wrapper = (bobo, functionName)->
          return ()->
            bobo[functionName].apply(bobo, arguments)
        hs = {}
        for eventName, handlerName of inputEventHandlers
          hs[eventName] = wrapper(_thisBobo, handlerName)


        this.setInfo('inputEventHandlers', hs)
        return true
    
      run: ->
        ### reservered for future use ###

      resume: ->

      finish: ->
        ### reservered for future use ###
     
    Bobo.extend = extend
    window.Bobo = Bobo

    class Dispatcher
      ### a dispatcher object for event listeners ###
      constructor: (@eventListened, @portal)->
        ### constructor of Dispatcher ###
        @handlers = {}

      addHandler: (boboID, handler)->
        ### add a bobo's event handler ###
        @handlers[boboID] = handler

      dispatch: (value, data)->
        ### call corresponding handler based on deviceID (and its corresponding boboID) ###
        deviceID = data.deviceID
        boboID = @portal.getDeviceBoboID(deviceID)
        if boboID in Object.keys(@handlers)
          return @handlers[boboID](value, data)
        return null
      
    ###
    ***************************************************************
    Handlers used by demoboPortal, which listen to the change of demoboPortal object's properties, e.g. change of bobos, addition of new bobo
    ***************************************************************
    ###
    demoboHandlers = {
      handlerBobosChange: (oldVal, newVal)->
        console.log 'bobos changed from '+oldVal+' to '+newVal

      handlerCurBoboChange: (oldVal, newVal)->
        console.log 'current bobo changed from '+oldVal+' to '+newVal

      handleBoboAdd: (boboID, boboObj)->
        this.createBoboView(boboID, boboObj.getInfo('config'))
        console.log('new bobo added, id: '+boboID)

      connectedHandler: (portal)->
        return (data)->
          ### handler that runs when a new device is connected###
          console.log('connected')
          console.log(portal)
          portal.setDeviceController(portal.get('curBobo'), data.deviceID)
          portal.addDevice(data.deviceID)

      disconnectedHandler: (portal)->
        return (data)->
          console.log('disconnected')
          console.log(portal)
          portal.removeDevice(data.deviceID)
    }

    class DemoboPortal
      ### class definition of DemoboPortal ###
      constructor: ()->
        ### constructor of DemoboPortal class ###
        @attributes = {}
        @DEMOBO = window.DEMOBO
        @demobo = window.demobo
        @DEMOBO_DEBUG = window.DEMOBO_DEBUG
        @_events = {}
        this.initialize()

      getBoboRoutes: ()->
        ###hard coded for now###
        return {
          'pandora': base + 'pandora.com-new.js'
          'inputtool': base + 'inputtool-new.js'
        }

      initialize: ()->
        ### called immediately upon the object's instantiation (guaranteed) ###
        boboRoutes = this.getBoboRoutes()

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
      
      addExistentDevice: (data)->
        deviceID = data.deviceID
        this.setDeviceController(this.get('curBobo'), deviceID)
        this.addDevice(deviceID)

      callFunction: (functionName, data, deviceID, boboID)->
        ### make an rpc on the device. if deviceID is not specified, make the rpc on all devices connected to the specified bobo ###
        if deviceID
          return @demobo.callFunction(functionName, data, deviceID)
        else
          deviceIDs = this.get('boboDeviceMap')[boboID]
          for dID in deviceIDs
            @demobo.callFunction(functionName, data, dID)
          return false #this return doesn't make much sense...

      addEventListener: (eventName, handler, boboID)->
        ### if the event is already registered, add a handler to its dispatcher; otherwise create a new dispatcher###
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

      getDeviceBoboID: (deviceID)->
        ### the the boboID of the device, based on the current mapping ###
        map = this.get('deviceBoboMap')
        return map[deviceID]

      setDeviceController: (boboObj, deviceID)->
        ### set a device's controller ###
        return @demobo.setController(boboObj.getInfo('controller'), deviceID)
      
      hasDevice: (deviceID)->
        return deviceID in this.get('deviceBoboMap')

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

      removeDevice: (deviceID)->
        ### delete the deviceID from keys of deviceBoboMap, and delete the deviceID from the corresponding bobo's devices list ###
        boboID = this.getDeviceBoboID(deviceID)
        devices = this.get('boboDeviceMap')[boboID]
        devices.splice(devices.indexOf(deviceID), 1)
        delete this.get('deviceBoboMap')[deviceID]
        this.trigger('delete:device', deviceID)
        true

      setDevice: (deviceID, boboID)->
        ### set the mappings so that deviceID points to boboID ###
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

      setController: (controller)->
        ### TODO: might be remvoed? ###
        @demobo.setController(controller)

      switchBobo: (boboID)->
        ### switch to another bobo ###
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
      
      addBobo: (boboClass)->
        ### add another bobo to portal###
        boboObj = new boboClass(this)

        ### if boboID dosn't exist, set it to its controller url###
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

      get: (key)->
        ###return the value of the key###
        @attributes[key]
  
      on: (eventName, handler) ->
        ###register a event with its handler###
        @_events[eventName] = handler
        true
  
      trigger: (eventName) ->
        ###trigger event###
        if (handler=@_events[eventName])
          handler.apply(this, [].slice.apply(arguments, [1]))
          return true
        else
          return false
  
      set: (key, val)->
        ###set the value of the key. If the old value is different from the new value, 'change:key' is triggered###
        oldVal = @attributes[key]
        unless (oldVal is val)
          @attributes[key] = val
          this.trigger 'change:'+key, oldVal, val
        
        return oldVal

      createBoboView: (boboID, boboInfo)->
        ### create the view of a bobo, which would be showed up in portal ###
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
    
    ### End of demobo session ###

    loadJS('http://api.demobo.com/demobo.1.7.0.min.js',()->
      demoboPortal = new DemoboPortal()
      window.demoboPortal = demoboPortal
    
      ### icon session ###
      demoboCss = document.createElement('style')
      demoboCss.className = 'demoboCSS'
      cssContent = '
      #demoboMiniIcon {
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
        opacity:1;
      }
      
      #demoboMenuContainer {
        width:30px;
        height:0px;
        position:fixed;
        background:rgba(20, 20, 20, 0.8);
        right:20px;
        z-index:1;
        -webkit-transition: height 0.5s ease;
        transition: height 0.5s ease;
        bottom:60px;
        overflow:hidden;
      }
  
      #demoboMenuContainer.expand {
        height:90px;
      }

      .demoboBoboItem {
        height:30px;
        width:30px;
      }

      .demoboBoboIcon {
        width:30px;
      }

      .demoboBoboIcon:hover {
        background:white;
      }
      '
      demoboCss.innerText = cssContent
      document.body.appendChild(demoboCss)
  
      ###
      small demobo icon at the right bottom of the page
      ###
      icon = document.createElement('img')
      icon.className = 'demoboIMG'
      icon.id = 'demoboMiniIcon' 
      icon.title='demobo mini' 
      icon.src=base+'demobo.png'
      document.body.appendChild(icon)
  
      menuContainer = document.createElement('div')
      menuContainer.className = 'demoboDIV'
      menuContainer.id = 'demoboMenuContainer'
      document.body.appendChild(menuContainer)

      #   menuContainer.onmouseout = () ->
      #     menuContainer.style.height = '0px'
      icon.onclick = () ->
        ### when the icon is clicked, show bobos ###
        menuContainer.style.height = Object.keys(demoboPortal.get('bobos')).length*30+'px'
      document.onclick = (e)->
        ### when others are clicked, unshow bobos ###
        ele = e.srcElement
        if ele.className.indexOf('demobo') isnt 0
          setTimeout(()->
            menuContainer.style.height = '0px'
          ,500)
  
    )
  
  ### end of critical section ###
  window.demoboLoading = undefined
  
