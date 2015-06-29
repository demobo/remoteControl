(function(h,d){if("function"===typeof define&&define.amd)define(["backbone"],function(e){e.UniqueModel=d(e)});else if("undefined"!==typeof exports){var g=require("backbone");g.UniqueModel=d(g)}else h.Backbone.UniqueModel=d(h.Backbone)})(this,function(h){function d(a,b,c){b=b||_.uniqueId("UniqueModel_");c=c||d.STORAGE_DEFAULT_ADAPTER;return d.addModel(a,b,c).modelConstructor}function g(a,b,c){var d=this;this.instances={};this.Model=a;this.modelName=b;this.storage=null;"localStorage"===c?this.storage=
new e(this.modelName,localStorage):"sessionStorage"===c&&(this.storage=new e(this.modelName,sessionStorage));this.storage&&(this.storage.on("sync",this.storageSync,this),this.storage.on("destroy",this.storageDestroy,this));a=function(a,b){return d.get(a,b)};_.extend(a,h.Events);a.prototype=this.Model.prototype;this.modelConstructor=a}function e(a,b){this.modelName=a;this.store=b;e.instances[a]=this;e.listener||(e.listener=window.addEventListener?window.addEventListener("storage",e.onStorage,!1):window.attachEvent("onstorage",
e.onStorage))}var f={};d.STORAGE_DEFAULT_ADAPTER="memory";d.STORAGE_KEY_DELIMETER=".";d.STORAGE_NAMESPACE="UniqueModel";d.getModelCache=function(a){var b=f[a];if(!b)throw"Unrecognized model: "+a;return b};d.addModel=function(a,b,c){if(f[b])return f[b];a=new g(a,b,c);return f[b]=a};d.clear=function(){for(var a in f)f.hasOwnProperty(a)&&delete f[a]};_.extend(g.prototype,{newModel:function(a,b){var c=new this.Model(a,b);this.storage&&(c.id&&this.storage.save(c.id,c.attributes),c.on("sync",this.instanceSync,
this),c.on("destroy",this.instanceDestroy,this));return c},instanceSync:function(a){this.storage&&this.storage.save(a.id,a.attributes)},instanceDestroy:function(a){this.storage&&this.storage.remove(a.id)},storageSync:function(a,b){this.get(b,{fromStorage:!0})},storageDestroy:function(a){var b=this.instances[a];b&&(b.trigger("destroy",b),delete this.instances[a])},add:function(a,b,c){b=this.newModel(b,c);return this.instances[a]=b},get:function(a,b){b=b||{};var c=this.Model,c=a&&a[c.prototype.idAttribute];
if(!c)return this.newModel(a,b);var d=this.instances[c];if(this.storage&&!b.fromStorage&&!d){var e=this.storage.getFromStorage(this.storage.getStorageKey(c));e&&(d=this.add(c,e,b))}d?(d.set(a),b.fromStorage||this.instanceSync(d)):(d=this.add(c,a,b),b.fromStorage&&this.modelConstructor.trigger("uniquemodel.add",d));return d}});e.instances={};e.listener=null;e.onStorage=function(a){a=a.key;var b=RegExp([d.STORAGE_NAMESPACE,"(\\w+)","(.+)"].join("\\"+d.STORAGE_KEY_DELIMETER)),c=a.match(b);c&&(b=c[2],
(c=e.instances[c[1]])&&c.handleStorageEvent(a,b))};_.extend(e.prototype,{handleStorageEvent:function(a,b){var c=this.getFromStorage(a);c?this.trigger("sync",b,c):this.trigger("destroy",b)},getFromStorage:function(a){try{return JSON.parse(this.store.getItem(a))}catch(b){}},getStorageKey:function(a){return[d.STORAGE_NAMESPACE,this.modelName,a].join(d.STORAGE_KEY_DELIMETER)},save:function(a,b){if(!a)throw"Cannot save without id";var c=JSON.stringify(b);this.store.setItem(this.getStorageKey(a),c)},remove:function(a){if(!a)throw"Cannot remove without id";
this.store.removeItem(this.getStorageKey(a))}},h.Events);_.extend(d,{ModelCache:g,StorageAdapter:e});return d});