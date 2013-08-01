var DeMoboFavicon = function() {
	this.docHead = document.getElementsByTagName("head")[0]
	this.demoboIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAB3RJTUUH3QgBAzotiIi1oAAAAXBJREFUOMu1lEFLQkEUhb8Zh4LMFmIQlFKIRkJU1KqCoP8Q9PwN0baltGkRtGrfpjD3bcR+QFEtokWUIi6LSAhflvL0TQtfqaTwxDowi+HOPfecO3dGAOgkm8AuEAEE7qCBHJAQcVLCITmlPxhCJ3kEon0SZZVjpwHldRS7gYBa+XsTUYBADcOG2bMMDXyc+PCqdyEBkApsC7TdXN2UtZ6pW5zdKt7KoDqrFhQLFxSujtvqj4zNEF3bBt0sMuCB9F0Xoqr5QuZghfWtDEP+EAC2VSG9v0Bgahl/cPGXx45Edt1CeiSB8CoeNeiolPhGp9F1q6MJ2e1CGpW068ZL/gj/QSTaB8TVTDZzGs22Snxe75Ar+pACalUTjeb+fA8h1U9StfxK/vKIp4cMALWKiVUpNcI6iQ0IBNzkIfsMUvQ+5NL5CkDDUhhi4+6dtSAngURrb+YnYS7UM1FCijgpwACygEZDbAJmg67ebBYwjENSX7CqerTMYqamAAAAAElFTkSuQmCC";
	function parseURI(url) {
		var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
		return ( m ? {
			href : m[0] || '',
			protocol : m[1] || '',
			authority : m[2] || '',
			host : m[3] || '',
			hostname : m[4] || '',
			port : m[5] || '',
			pathname : m[6] || '',
			search : m[7] || '',
			hash : m[8] || ''
		} : null);
	}


	this.isOff = function() {
		return this.getFavicon() !== this.onFavicon;
	}

	this.turnOn = function() {
		this.change(this.onFavicon);
	}

	this.turnOff = function() {
		this.change(this.offFavicon);
	}

	this.reset = function() {
		this.change(this.originalFavicon);
	}

	this.toggle = function() {
		if (this.isOff())
			this.turnOn();
		else
			this.turnOff();
	}
	this.getFavicon = function() {
		var favicon = "/favicon.ico";
		var links = document.getElementsByTagName('link');
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			var rel = '"' + link.getAttribute("rel") + '"';
			var regexp = /(\"icon )|( icon\")|(\"icon\")|( icon )/i;
			if (rel.search(regexp) != -1) {
				favicon = link.getAttribute("href");
			}
		}
		return favicon;
	}
	this.grayscale = function(ctx) {
		var imageData = ctx.getImageData(13, 13, 18, 18);
		var data = imageData.data;
		for (var i = 0; i < data.length; i += 4) {
			var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
			// red
			data[i] = brightness;
			// green
			data[i + 1] = brightness;
			// blue
			data[i + 2] = brightness;
		}
		// overwrite original image
		ctx.putImageData(imageData, 13, 13);
	}
	this.colorize = function(ctx, canvas, rgb) {
		// get all canvas pixel data
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (var y = 0; y < canvas.height; y++) {
			var inpos = y * canvas.width * 4;
			var outpos = inpos;
			for (var x = 0; x < canvas.width; x++) {
				r = imageData.data[inpos++];
				g = imageData.data[inpos++];
				b = imageData.data[inpos++];
				a = imageData.data[inpos++];
				r = Math.min(rgb.r, r);
				g = Math.min(rgb.g, g);
				b = Math.min(rgb.b, b);
				imageData.data[outpos++] = r;
				imageData.data[outpos++] = g;
				imageData.data[outpos++] = b;
				imageData.data[outpos++] = a;
			}
		}
		// put pixel data on canvas
		ctx.putImageData(imageData, 0, 0);
	}
	this.renderIcon = function(URL) {
		var img = new Image();
		var demoboLogo = new Image();
		var self = this;
		demoboLogo.onload = function() {
			var uri = parseURI(URL);
			if (uri.host) {
				if (window.location.host == uri.host)
					img.src = URL;
				else
					img.src = '/favicon.ico';
			} else
				img.src = URL;
			missingIcon();
			self.turnOn();
		};
		// img.crossOrigin = 'anonymous';
		img.onload = demoboIcon;
		img.onerror = missingIcon;

		function demoboIcon() {
			var canvas = document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(demoboLogo, 13, 13, 18, 18);
			self.onFavicon = canvas.toDataURL("image/png");

			self.grayscale(ctx);
			self.offFavicon = canvas.toDataURL("image/png");
			self.turnOn();
		};
		function missingIcon() {
			var canvas = document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#ffffff';
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#000000';
			ctx.stroke();

			ctx.drawImage(demoboLogo, 13, 13, 18, 18);
			self.onFavicon = canvas.toDataURL("image/png");
			
			self.grayscale(ctx);
			self.offFavicon = canvas.toDataURL("image/png");
			self.turnOn();
		}


		demoboLogo.src = this.demoboIcon;
	}
	this.change = function(iconURL) {
		this.removeIcon()
		this.addLink(iconURL, "shortcut icon")
	}
	this.addLink = function(iconURL, relValue) {
		var link = document.createElement("link")
		link.type = "image/x-icon"
		link.rel = relValue
		link.href = iconURL
		this.docHead.appendChild(link)
	}
	this.removeIcon = function() {
		var links = this.docHead.getElementsByTagName("link");
		// remove from the end
		for (var i = links.length - 1; i >= 0; i--) {
			var link = links[i]
			if (/icon/.test(link.rel)) {
				this.docHead.removeChild(link)
			}
		}
	}
	this.originalFavicon = this.getFavicon()
	this.offFavicon = '//www.google.com/s2/favicons?domain=' + window.location.host
	this.onFavicon = this.demoboIcon
	this.renderIcon(this.originalFavicon)
}
fav = new DeMoboFavicon()
