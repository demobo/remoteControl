"undefined"!==typeof document&&!("classList"in document.createElement("a"))&&function(d){d=(d.HTMLElement||d.Element).prototype;var e=Object,l=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},m=Array.prototype.indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1},g=function(a,b){this.name=a;this.code=DOMException[a];this.message=b},f=function(a,b){if(""===b)throw new g("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(b))throw new g("INVALID_CHARACTER_ERR",
"String contains an invalid character");return m.call(a,b)},h=function(a){for(var b=l.call(a.className),b=b?b.split(/\s+/):[],c=0,d=b.length;c<d;c++)this.push(b[c]);this._updateClassName=function(){a.className=this.toString()}},c=h.prototype=[],k=function(){return new h(this)};g.prototype=Error.prototype;c.item=function(a){return this[a]||null};c.contains=function(a){return-1!==f(this,a+"")};c.add=function(a){a+="";-1===f(this,a)&&(this.push(a),this._updateClassName())};c.remove=function(a){a=f(this,
a+"");-1!==a&&(this.splice(a,1),this._updateClassName())};c.toggle=function(a){a+="";-1===f(this,a)?this.add(a):this.remove(a)};c.toString=function(){return this.join(" ")};if(e.defineProperty){c={get:k,enumerable:!0,configurable:!0};try{e.defineProperty(d,"classList",c)}catch(n){-2146823252===n.number&&(c.enumerable=!1,e.defineProperty(d,"classList",c))}}else e.prototype.__defineGetter__&&d.__defineGetter__("classList",k)}(self);
