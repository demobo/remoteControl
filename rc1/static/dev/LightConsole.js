// Generated by CoffeeScript 1.6.2
(function() {
  var LightConsole;

  LightConsole = (function() {
    function LightConsole() {
      this.data = this.generateChannels();
      this.colorMap = this.getColorMap();
    }

    LightConsole.prototype.getColorMap = function() {
      var map;

      map = {
        'WHITE': 6,
        'RED': 20,
        'BLUE': 34,
        'GREEN': 48,
        'YELLOW': 62,
        'MAGENTA': 76,
        'ORANGE': 90,
        'UV': 104,
        'PINK': 118
      };
      return map;
    };

    LightConsole.prototype.generateChannels = function() {
      var temp;

      temp = [0];
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      temp = temp.concat(temp);
      return temp;
    };

    LightConsole.prototype.setDMX = function() {
      var d;

      d = JSON.stringify(this.data);
      if (jQuery) {
        return jQuery.ajax({
          type: 'POST',
          url: 'http://localhost:9090/set_dmx',
          data: {
            'u': 1,
            'd': d
          }
        });
      }
    };

    LightConsole.prototype.setData = function(index, val) {
      return this.data[index] = val;
    };

    LightConsole.prototype.setColor = function(color, index) {
      var val;

      DEBUG && console.log('setcolor called');
      if ((index != null)) {
        val = this.colorMap[color];
        if (val != null) {
          return this.setData(index * 16 + 4, val);
        }
      } else {
        this.setColor(color, 0);
        this.setColor(color, 1);
        this.setColor(color, 2);
        return this.setColor(color, 3);
      }
    };

    LightConsole.prototype.setPan = function(val, index) {
      DEBUG && console.log('setpan called');
      if ((index != null)) {
        return this.setData(index * 16 + 0, val);
      } else {
        this.setPan(val, 0);
        this.setPan(val, 1);
        this.setPan(val, 2);
        return this.setPan(val, 3);
      }
    };

    LightConsole.prototype.setTilt = function(val, index) {
      DEBUG && console.log('settilt called');
      if ((index != null)) {
        return this.setData(index * 16 + 2, val);
      } else {
        this.setTilt(val, 0);
        this.setTilt(val, 1);
        this.setTilt(val, 2);
        return this.setTilt(val, 3);
      }
    };

    LightConsole.prototype.setGobo = function(goboIndex, index) {
      var val;

      DEBUG && console.log('setgobo called');
      if ((index != null)) {
        val = goboIndex * 14 + 6;
        return this.setData(index, val);
      } else {
        this.setGobo(goboIndex, 0);
        this.setGobo(goboIndex, 1);
        this.setGobo(goboIndex, 2);
        return this.setGobo(goboIndex, 3);
      }
    };

    LightConsole.prototype.updateData = function() {
      return true;
    };

    return LightConsole;

  })();

  window.LightConsole = LightConsole;

}).call(this);
