var DeMoboFavicon = function() {
	this.docHead = document.getElementsByTagName("head")[0]
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
	this.toggle = function() {
		if (this.getFavicon() == this.originalFavicon)
			this.change(this.newFavicon);
		else
			this.change(this.originalFavicon);
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
		if (!/data:image/.test(favicon)) {
			var uri = parseURI(favicon);
			if (!uri.host || window.location.host == uri.host)
				favicon = uri.pathname;
			else
				favicon = "/favicon.ico";
		}
		return favicon;
	}
	this.effect = function(ctx, canvas) {
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
				r = Math.min(255, r);
				g = Math.min(204, g);
				b = Math.min(155, b);
				imageData.data[outpos++] = r;
				imageData.data[outpos++] = g;
				imageData.data[outpos++] = b;
				imageData.data[outpos++] = a;
			}
		}
		// put pixel data on canvas
		ctx.putImageData(imageData, 0, 0);
	}
	this.getBase64FromImageUrl = function(URL) {
		var img = new Image();
		var demoboLogo = new Image();
		var self = this;
		img.onload = draw;
		img.onerror = function() {}
		img.src = URL;
		demoboLogo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAB3RJTUUH3QgBAzotiIi1oAAAAXBJREFUOMu1lEFLQkEUhb8Zh4LMFmIQlFKIRkJU1KqCoP8Q9PwN0baltGkRtGrfpjD3bcR+QFEtokWUIi6LSAhflvL0TQtfqaTwxDowi+HOPfecO3dGAOgkm8AuEAEE7qCBHJAQcVLCITmlPxhCJ3kEon0SZZVjpwHldRS7gYBa+XsTUYBADcOG2bMMDXyc+PCqdyEBkApsC7TdXN2UtZ6pW5zdKt7KoDqrFhQLFxSujtvqj4zNEF3bBt0sMuCB9F0Xoqr5QuZghfWtDEP+EAC2VSG9v0Bgahl/cPGXx45Edt1CeiSB8CoeNeiolPhGp9F1q6MJ2e1CGpW068ZL/gj/QSTaB8TVTDZzGs22Snxe75Ar+pACalUTjeb+fA8h1U9StfxK/vKIp4cMALWKiVUpNcI6iQ0IBNzkIfsMUvQ+5NL5CkDDUhhi4+6dtSAngURrb+YnYS7UM1FCijgpwACygEZDbAJmg67ebBYwjENSX7CqerTMYqamAAAAAElFTkSuQmCC";
		function draw() {
			var canvas = document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			self.effect(ctx, canvas);
			ctx.drawImage(demoboLogo, 13, 13, 18, 18);
			self.newFavicon = canvas.toDataURL("image/png");
		}

	}
	this.change = function(iconURL) {
		this.addLink(iconURL, "icon")
		this.addLink(iconURL, "shortcut icon")
	}
	this.addLink = function(iconURL, relValue) {
		var link = document.createElement("link")
		link.type = "image/x-icon"
		link.rel = relValue
		link.href = iconURL
		this.removeLinkIfExists(relValue)
		this.docHead.appendChild(link)
	}
	this.removeLinkIfExists = function(relValue) {
		var links = this.docHead.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			var link = links[i]
			if (link.rel == relValue) {
				this.docHead.removeChild(link)
				return
			}
		}
	}
	this.originalFavicon = this.getFavicon()
	this.newFavicon = ""
	this.getBase64FromImageUrl(this.originalFavicon)
}