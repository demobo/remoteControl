DEBUG=false
class LightConsole
  constructor: ()->
    @data = this.generateChannels()
    @colorMap = this.getColorMap()

  getColorMap:()->
    map =
      'WHITE':6
      'RED':20
      'BLUE':34
      'GREEN':48
      'YELLOW':62
      'MAGENTA':76
      'ORANGE':90
      'UV':104
      'PINK':118
    return map

  generateChannels:()->
    temp = [0]
    temp = temp.concat(temp)#2
    temp = temp.concat(temp)#4
    temp = temp.concat(temp)#8
    temp = temp.concat(temp)#16
    temp = temp.concat(temp)#32
    temp = temp.concat(temp)#64
    temp = temp.concat(temp)#128
    temp = temp.concat(temp)#256
    temp = temp.concat(temp)#512
    temp[10] = 255
    temp[11] = 255
    temp[26] = 255
    temp[27] = 255
    temp[42] = 255
    temp[43] = 255
    temp[58] = 255
    temp[59] = 255

    return temp

  setDMX:()->
    d = JSON.stringify(@data)
    if (jQuery)
      try
        jQuery.ajax({
          type:'POST',
          url:'http://localhost:9090/set_dmx',
          data:{
            'u':1,
            'd':d
          },
        }).fail(()->
          console.log('setDMX failed')
        )
      catch e
        console.log('silence...')

  setData: (index, val)->
    @data[index]=val

  ###
    set color of lights
  ###
  setColor: (color, index)->
    if (index?)
      val=@colorMap[color]
      if val?
        this.setData(index*16+4, val)
    else
      this.setColor(color, 0)
      this.setColor(color, 1)
      this.setColor(color, 2)
      this.setColor(color, 3)

  ###
  set horizontal angle of lights
  ###
  setPan: (val, index)->
    if (index?)
      this.setData(index*16+0, val)
    else
      DEBUG && console.log('setpan called'+val)
      this.setPan(val, 0)
      this.setPan(val, 1)
      this.setPan(val, 2)
      this.setPan(val, 3)

  ###
    set vertical angle of lights
  ###
  setTilt: (val, index)->
    if (index?)
      this.setData(index*16+2, val)
    else
      DEBUG && console.log('settilt called'+val);
      this.setTilt(val, 0)
      this.setTilt(val, 1)
      this.setTilt(val, 2)
      this.setTilt(val, 3)

  ###
  predefied patterns
  ###
  setPattern: (patternIndex, index)->
    mapping=
      0:0
      1:1
      2:3
      3:7
      4:8
      5:14
    this.setGobo(mapping[patternIndex], index)

  ###
  there are totally 15 gobos. index 0 is default circle; index 1-7 are rotation gobos; 8-14 are fixed gobos
  ###
  setGobo: (goboIndex, index)->
    DEBUG && console.log('setgobo called')
    if (index?)
      if goboIndex is 0
        channel1 = index*16+5
        channel2 = index*16+7
        this.setData(channel1, 0)
        this.setData(channel2, 0)
      else if goboIndex<8 #rotation is at channel 6
        channel = index*16+5
        val = goboIndex*10+5
        this.setData(channel, val)
        this.setData(index*16+7, 0)
      else
        channel = index*16+7
        val = goboIndex*14+20
        this.setData(index*16+5, 0)
        this.setData(channel, val)
    else
      this.setGobo(goboIndex, 0)
      this.setGobo(goboIndex, 1)
      this.setGobo(goboIndex, 2)
      this.setGobo(goboIndex, 3)

  ###
    val can be 0-1, which 0 correspons to smallest diameter and 1 largest.
  ###
  setLightDiameter: (val, index)->
    if (index?)
      val = Math.floor(val * 191)
      this.setData(index*16+12, val)
    else
      this.setLightDiameter(val, 0)
      this.setLightDiameter(val, 1)
      this.setLightDiameter(val, 2)
      this.setLightDiameter(val, 3)

  ###
    val can be 0-1, which 0 corresponds to smallest intesity and 1 largets
  ###
  setLightIntensity: (val, index)->
    if (index?)
      val = Math.floor(val * 255)
      this.setData(index*16+11, val)
    else
      this.setLightIntensity(val, 0)
      this.setLightIntensity(val, 1)
      this.setLightIntensity(val, 2)
      this.setLightIntensity(val, 3)

  ###
    val can be 0-1, which 0 corresponds to smallest intesity and 1 largets
  ###
  setFrostFilter: (val, index)->
    if (index?)
      val = Math.floor(val * 191)
      this.setData(index*16+13, val)
    else
      this.setFrostFilter(val, 0)
      this.setFrostFilter(val, 1)
      this.setFrostFilter(val, 2)
      this.setFrostFilter(val, 3)

  ###
    There are 8 options for shutter control (I dont exactly know what every option does...default to 8th option)
  ###
  setShutter: (optionIndex, index)->
    if (optionIndex?)
      val = optionIndex*32+16
      this.setData(index*16+10, val)
    else
      this.setShutter(optionIndex, 0)
      this.setShutter(optionIndex, 1)
      this.setShutter(optionIndex, 2)
      this.setShutter(optionIndex, 3)

  getAngles: (x, y, z)->
    if (z>10)
      ver=127
    else
      ver = 127-Math.acos(z/10.0)/Math.PI*127

    hor = Math.atan(y*1.0/x)/Math.PI*72
    if x<0
      hor = hor+72
    if hor<0
      hor = hor+144
    DEBUG and console.log('val: '+hor);
    return [ver, hor]

  updateData: ()->
    #do something
    true

window.LightConsole = LightConsole
