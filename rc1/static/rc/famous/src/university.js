 /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/**
 * @license RequireJS text 2.0.7 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mike@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define("registry/RegisterEasing", ["require", "exports", "module", "famous/transitions/Easing", "famous/transitions/TweenTransition"], function(e) {
    function t() {
        for (var e = i(s).sort(), t = {}, o = 0; o < e.length; o++)
            t[e[o]] = s[e[o]];
        return t
    }
    function i(e) {
        var t = [];
        for (key in e)
            e.hasOwnProperty(key) && t.push(key);
        return t
    }
    function o() {
        var e = t();
        for (var i in e)
            n.registerCurve(i, e[i])
    }
    var s = e("famous/transitions/Easing"), n = e("famous/transitions/TweenTransition");
    o()
}), define("registry/RegisterPhysics", ["require", "exports", "module", "famous/transitions/Transitionable", "famous/transitions/SpringTransition", "famous/transitions/SnapTransition", "famous/transitions/WallTransition"], function(e) {
    var t = e("famous/transitions/Transitionable"), i = e("famous/transitions/SpringTransition"), o = e("famous/transitions/SnapTransition"), s = e("famous/transitions/WallTransition");
    t.registerMethod("spring", i), t.registerMethod("snap", o), t.registerMethod("wall", s)
}), define("styles/FamousStyles", ["require", "exports", "module"], function() {
    var e = document.body.style;
    e.position = "absolute", e.width = "100%", e.height = "100%", e.margin = "0px", e.padding = "0px", e.webkitTransformStyle = "preserve-3d", e.transformStyle = "preserve-3d", e.webkitTapHighlightColor = "transparent", e.webkitPerspective = "0", e.perspective = "none", e.overflow = "hidden";
    var t = document.body.parentNode, i = t.style;
    i.width = "100%", i.height = "100%", i.margin = "0px", i.padding = "0px", i.overflow = "hidden"
}), define("scene/Controller", ["require", "exports", "module", "famous/core/EventHandler", "famous/core/OptionsManager"], function(e, t, i) {
    function o(e) {
        this._eventInput = new s, this._eventOutput = new s, s.setInputHandler(this, this._eventInput), s.setOutputHandler(this, this._eventOutput), this.options = Object.create(this.constructor.DEFAULT_OPTIONS || o.DEFAULT_OPTIONS), this._optionsManager = new n(this.options), e && this.setOptions(e)
    }
    var s = e("famous/core/EventHandler"), n = e("famous/core/OptionsManager");
    o.DEFAULT_OPTIONS = {}, o.prototype.getOptions = function() {
        return this._optionsManager.value()
    }, o.prototype.setOptions = function(e) {
        this._optionsManager.patch(e)
    }, i.exports = o
}), define("scene/Route", ["require", "exports", "module"], function(e, t, i) {
    function o(e, t) {
        this.search = "", this.hash, this.data = {}, this.eventKey = t, this.route = e, this.split = this.split(this.route)
    }
    function s(e, t) {
        for (var i in t)
            e[i] = t[i];
        return e
    }
    o.split = function(e) {
        return e.match(/:*[\w\-\.\*]+/g)
    }, o.splitLength = function(e) {
        var t = o.split(e);
        return t ? t.length : 0
    }, o.prototype = {split: function(e) {
            var t = e.indexOf("?"), i = e.indexOf("#");
            return t >= 0 ? (this.search = this.parseSearchParams(e), e = e.substring(0, t)) : i >= 0 && (this.hash = e.substring(i, e.length), e = e.substring(0, i)), o.split(e)
        },parseSearchParams: function(e) {
            for (var t = /(?:\&[^=]+\=)([^&]+)/g, i = /\&(\w+)\=/g, o = {}; match = t.exec(e); ) {
                i.lastIndex = 0;
                var s = i.exec(match[0]);
                s && (o[s[1]] = match[1])
            }
            return o
        },length: function() {
            return this.split ? this.split.length : 0
        },isMatch: function(e) {
            var t = e.getSplit();
            if (this.data = {}, t == this.split)
                return !0;
            for (var i = 0; i < this.split.length; i++) {
                var o = this.split[i], s = t[i];
                if (!o)
                    return !1;
                if (o.match(/\*/g))
                    return !0;
                if (o.match(/\:/g)) {
                    var n = o.match(/[^:]+/g)[0];
                    this.data[n] = s
                } else if (o !== s)
                    return !1
            }
            return !0
        },getSplit: function() {
            return this.split ? this.split.slice(0) : null
        },getEventKey: function() {
            return this.eventKey
        },getHash: function() {
            return this.hash
        },getData: function() {
            return s({}, this.data)
        },getSearch: function() {
            return s({}, this.search)
        }}, i.exports = o
}), define("scene/Router", ["require", "exports", "module", "./Controller", "./Route"], function(e, t, i) {
    function o() {
        d.apply(this, arguments), this._routes = {}, this._redirects = {}, this._globRoutes = [], this._globRedirects = [], this.connected = [], this.cache = {}, this.handleStateChange = this._handleStateChange.bind(this), this.handleHashChange = this._handleHashChange.bind(this), this.bindListener()
    }
    function s(e, t) {
        var i = {search: e.getSearch(),hash: e.getHash(),route: e.getSplit()}, o = t.getData();
        for (var s in o)
            i[s] = o[s];
        this.updateConnected({key: t.getEventKey(),data: i})
    }
    function n(e) {
        this.pushState(e.eventKey)
    }
    function r(e, t, i) {
        var o = t[e.length()];
        return a(e, o, i)
    }
    function a(e, t, i) {
        if (!t)
            return !1;
        for (var o = 0; o < t.length; o++) {
            var s = t[o].isMatch(e);
            if (s)
                return i && i(t[o]), !0
        }
        return !1
    }
    function u(e, t, i) {
        for (var o in e) {
            var s = new f(o, e[o]);
            h(o) ? i.push(s) : c(s, t)
        }
    }
    function c(e, t) {
        var i = e.length();
        t[i] || (t[i] = []), t[i].push(e)
    }
    function p(e, t, i) {
        for (var o = 0; o < e.length; o++) {
            var s = e[o], n = f.splitLength(s), r = t[n];
            if (r) {
                var a = l.call(this, s, i);
                a || l.call(this, s, r)
            }
        }
    }
    function l(e, t) {
        for (var i = 0; i < t.length; i++) {
            var o = t[i];
            if (o.route == e)
                return t.splice(i, 1), !0
        }
        return !1
    }
    function h(e) {
        return e.match(/\*/g)
    }
    var d = e("./Controller"), f = e("./Route");
    o.protoype = Object.create(d.prototype), o.prototype.constructor = o, o.prototype.bindListener = function() {
        History.Adapter.bind(window, "statechange", this.handleStateChange), History.Adapter.bind(window, "hashchange", this.handleHashChange)
    }, o.prototype.pushState = function(e) {
        return History.pushState(null, null, e)
    }, o.prototype.replaceState = function(e) {
        return History.replaceState(null, null, e)
    }, o.prototype._handleStateChange = function() {
        return this.state = this.getState(), this._eventOutput.emit("statechange", this.state), this.updateRouteListeners()
    }, o.prototype._handleHashChange = function() {
        this.state = this.getState(), this._eventOutput.emit("hashchange", this.state), console.log("hashchange")
    }, o.prototype.updateRouteListeners = function() {
        var e = this.getCurrentRoute(), t = n.bind(this), i = s.bind(this, e), o = a.call(this, e, this._globRedirects, t);
        if (o)
            return o;
        if (a.call(this, e, this._globRoutes, i))
            return !0;
        var u = r.call(this, e, this._redirects, t);
        return u ? u : r.call(this, e, this._routes, i)
    }, o.prototype.defaultTo = function(e) {
        this.isValidRoute() ? this._handleStateChange() : this.pushState(e)
    }, o.prototype.isValidRoute = function(e) {
        var t = e ? e : this.getCurrentRoute(), i = a.call(this, t, this._globRedirects);
        if (i)
            return i;
        if (a.call(this, t, this._globRoutes))
            return !0;
        var o = r.call(this, t, this._redirects);
        return o ? o : r.call(this, t, this._routes)
    }, o.prototype.getHash = function() {
        return this.state = this.getState(), this.state.hash
    }, o.prototype.getCurrentRoute = function() {
        return new f(this.getHash())
    }, o.prototype.updateConnected = function(e) {
        for (var t = 0; t < this.connected.length; t++)
            this.connected[t].trigger("set", e)
    }, o.prototype.getState = function() {
        return History.getState()
    }, o.prototype.registerLink = function(e, t, i) {
        i || (i = 1), e.on("click", function(e, t) {
            for (var o = $(t.srcElement), s = o.attr("href"), n = o.attr("title"), r = o, a = 0; !s && i > a; )
                r = r.parent(), s = r.attr("href"), n = r.attr("title"), a++;
            if (s) {
                var u = new f(s);
                this.isValidRoute(u) && (t.preventDefault(), History.pushState(null, n, s), e && e(n, s))
            }
        }.bind(this, t))
    }, o.prototype.addRoutes = function(e) {
        u.call(this, e, this._routes, this._globRoutes)
    }, o.prototype.removeRoutes = function(e) {
        p.call(this, e, this._routes, this._globRoutes)
    }, o.prototype.addRedirects = function(e) {
        u.call(this, e, this._redirects, this._globRedirects)
    }, o.prototype.removeRedirects = function(e) {
        p.call(this, e, this._redirects, this._globRedirects)
    }, o.prototype.connect = function(e) {
        this.connected.push(e)
    }, i.exports = o
}), define("app/Router", ["require", "exports", "module", "scene/Router"], function(e, t, i) {
    var o = e("scene/Router"), s = new o;
    i.exports = s
}), define("analytics/Analytics", ["require", "exports", "module", "app/Router", "famous/core/Engine", "famous/core/EventHandler"], function(e, t, i) {
    var o = e("app/Router"), s = e("famous/core/Engine"), n = e("famous/core/EventHandler"), r = (new n, {});
    o.on("statechange", function(e) {
        r.track("pageChange", {page: e.hash})
    }), r.track = function(e, t) {
        try {
            mixpanel.track(e, t)
        } catch (i) {
            console.error(i)
        }
        try {
            __ga("send", "event", "track", "front-end-route-to", t.page), /university/.test(t.page) && __ga("send", "event", "university-request", "front-end-route-to", t.page)
        } catch (i) {
        }
    }, r.onClick = function(e, t, i) {
        e.on("click", function() {
            r.track(t, i)
        })
    }, r.onIDClick = function(e, t, i, o) {
        e.on("click", function(e) {
            e.target.id == t && r.track(i, o)
        })
    }, r.onDataClick = function(e, t, i) {
        e.on("click", function(e) {
            var o = e.target, s = o.dataset.analytics || o.parentElement.dataset.analytics;
            if (s) {
                var n = {};
                n[i] = s, r.track(t, n)
            }
        })
    }, r.onDataIDClick = function(e) {
        e.on("click", function(e) {
            var t = e.target, i = t.dataset.analytics || t.parentElement.dataset.analytics;
            i && s.nextTick(r.track.bind(r, i))
        })
    }, i.exports = r
}), define("scene/SceneController", ["require", "exports", "module", "famous/core/View", "famous/core/RenderNode", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine"], function(e, t, i) {
    function o() {
        u.apply(this, arguments), this.nodes = [], this.routes = {}, this.defaultOptions = {}, s.call(this)
    }
    function s() {
        this._eventInput.on("set", this.setScene.bind(this))
    }
    function n(e) {
        this.reset(), this._eventOutput.emit("deactivate"), r.call(this, e)
    }
    function r(e) {
        var t = this.defaultOptions[this.currentRoute];
        t instanceof Function ? t(a.bind(this, e)) : a.call(this, e, t)
    }
    function a(e, t) {
        this.activeScene = new this.ActiveConstructor(t, e), this.activeModifier = new p;
        var i = new c;
        i.add(this.activeModifier).add(this.activeScene), this.nodes.push(i), this._eventOutput.emit("activate", this.currentRoute), this.activeScene.activate && this.activeScene.activate()
    }
    {
        var u = e("famous/core/View"), c = e("famous/core/RenderNode"), p = (e("famous/core/Transform"), e("famous/core/Modifier"));
        e("famous/core/Engine")
    }
    o.prototype = Object.create(u.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype.addScene = function(e, t) {
        this.routes[e] = t
    }, o.prototype.addScenes = function(e) {
        for (var t in e)
            this.addScene(t, e[t])
    }, o.prototype.removeScenes = function(e) {
        for (var t = 0; t < e.length; t++)
            this.removeScene(e[t])
    }, o.prototype.removeScene = function(e) {
        delete this.routes[e]
    }, o.prototype.reset = function() {
        this.nodes = []
    }, o.prototype.setActiveModifier = function(e, t, i) {
        this.activeModifier && (this.activeModifier.halt(), this.activeModifier.setTransform(e, t, i))
    }, o.prototype.setDefaultOptions = function(e) {
        for (var t in e)
            this.defaultOptions[t] = e[t]
    }, o.prototype.removeDefaultOptions = function(e) {
        for (var t = 0; t < e.length; t++)
            delete this.defaultOptions[e[t]]
    }, o.prototype.setScene = function(e) {
        if ("string" != typeof e)
            var t = e.data, i = e.key;
        else
            var i = e;
        if (i == this.getCurrentRoute())
            return this.activeScene._eventInput.emit("set", t);
        var o = this.routes[i];
        return "undefined" == typeof o ? void console.warn("No view exists!", i) : (this.currentRoute = i, this.ActiveConstructor = o, this._eventOutput.emit("set", {key: i,data: t,view: o}), this.activeScene && this.activeScene.deactivate ? void this.activeScene.deactivate(n.bind(this, t)) : n.call(this, t))
    }, o.prototype.getCurrentRoute = function() {
        return this.currentRoute
    }, o.prototype.getRoutes = function() {
        return this.routes
    }, o.prototype.getActiveModifier = function() {
        return this.activeModifier
    }, o.prototype.render = function() {
        for (var e = [], t = 0; t < this.nodes.length; t++)
            e.push(this.nodes[t].render());
        return e
    }, i.exports = o
}), define("app/SceneController", ["require", "exports", "module", "scene/SceneController"], function(e, t, i) {
    var o = e("scene/SceneController"), s = new o;
    i.exports = s
}), define("helpers/RenderHelpers", ["require", "exports", "module"], function(e, t, i) {
    function o(e) {
        e._object = null, e._child = null, e._hasCached = !1, e._hasMultipleChildren = !1, e._resultCache = {}, e._prevResults = {}, e._childResult = null
    }
    i.exports = {resetNode: o}
}), define("famous/utilities/Timer", ["require", "exports", "module", "famous/core/Engine"], function(e, t, i) {
    function o(e) {
        return p.on(l, e), e
    }
    function s(e, t) {
        var i = h(), s = function() {
            var o = h();
            o - i >= t && (e.apply(this, arguments), p.removeListener(l, s))
        };
        return o(s)
    }
    function n(e, t) {
        var i = h(), s = function() {
            var o = h();
            o - i >= t && (e.apply(this, arguments), i = h())
        };
        return o(s)
    }
    function r(e, t) {
        if (void 0 === t)
            return void 0;
        var i = function() {
            t--, 0 >= t && (e.apply(this, arguments), u(i))
        };
        return o(i)
    }
    function a(e, t) {
        t = t || 1;
        var i = t, s = function() {
            t--, 0 >= t && (e.apply(this, arguments), t = i)
        };
        return o(s)
    }
    function u(e) {
        p.removeListener(l, e)
    }
    function c(e, t) {
        var i, o, n, r, a;
        return function() {
            o = this, a = arguments, n = h();
            var u = function() {
                var c = h - n;
                t > c ? i = s(u, t - c) : (i = null, r = e.apply(o, a))
            };
            return i || (i = s(u, t)), r
        }
    }
    var p = e("famous/core/Engine"), l = "prerender", h = window.performance ? function() {
        return window.performance.now()
    } : function() {
        return Date.now()
    };
    i.exports = {setTimeout: s,setInterval: n,debounce: c,after: r,every: a,clear: u}
}), define("widgets/Layouts", ["require", "exports", "module", "famous/core/Engine", "famous/utilities/Timer"], function(e, t, i) {
    function o() {
        a.on("resize", u.debounce(this._onResize.bind(this), 50)), this.layouts = [], this.currentLayouts = {}, this.screenSize, r.call(this)
    }
    function s(e, t) {
        for (var i in e)
            e[i].minWidth < this.screenSize[0] && e[i].maxWidth > this.screenSize[0] && t.push(i);
        0 == t.length && console.warn("No possible layout")
    }
    function n(e, t) {
        for (var i, o, s = 0; s < t.length; s++)
            if (i) {
                var e = e[t[s]];
                e.maxWidth > i && (o = t[s], i = e.maxWidth)
            } else
                i = e[t[s]].maxWidth, o = t[s];
        return o
    }
    function r() {
        this.screenSize = [window.innerWidth, window.innerHeight]
    }
    var a = e("famous/core/Engine"), u = e("famous/utilities/Timer");
    o.prototype._onResize = function() {
        r.call(this), this.layoutAll()
    }, o.prototype.add = function(e, t) {
        return this.layouts.push(e), this.currentLayouts[this.layouts.length - 1] = void 0, t || this.layout(e), this
    }, o.prototype.remove = function(e) {
        var t = this.layouts.indexOf(e);
        return -1 !== t && (this.layouts.splice(1, t), delete this.currentLayouts[t]), this
    }, o.prototype.layoutAll = function() {
        for (var e = 0; e < this.layouts.length; e++)
            this.layout(this.layouts[e])
    }, o.prototype.layout = function p(p) {
        var e = this.layouts.indexOf(p);
        if (-1 == e)
            throw "no layout";
        var t = this.getLayoutKey(p);
        if (!t)
            return void console.log("no possible layout from: ", p);
        var i = p[t];
        if (void 0 == this.currentLayouts[e])
            this.currentLayouts[e] = t, i.activate && i.activate();
        else if (this.currentLayouts[e] !== t) {
            var o = p[this.currentLayouts[e]];
            this.currentLayouts[e] = t, o.deactivate ? o.deactivate(i.activate) : i.activate && i.activate()
        }
    }, o.prototype.getLayoutKey = function(e) {
        var t = [];
        return s.call(this, e, t), n.call(this, e, t)
    }, o.prototype.getScreenSize = function() {
        return this.screenSize
    };
    var c = new o;
    i.exports = c
}), define("scene/EventAwareView", ["require", "exports", "module", "famous/core/View", "famous/core/Engine"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.__activeEvents = []
    }
    {
        var s = e("famous/core/View");
        e("famous/core/Engine")
    }
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.addEvent = function(e, t, i, o, s) {
        var n = s ? i : i.bind(this);
        return this.__activeEvents.push({unbindFn: o,key: t,boundFn: n}), e(t, n), this
    }, o.prototype.addEventFn = function() {
        return this.__activeEvents.push.apply(this.__activeEvents, arguments), this
    }, o.prototype.removeAllEvents = function() {
        for (var e = 0; e < this.__activeEvents.length; e++) {
            var t = this.__activeEvents[e];
            t instanceof Function ? t() : t && t.unbindFn(t.key, t.boundFn), this.__activeEvents[e] = null
        }
    }, i.exports = o
}), define("app/header/templates/NavigationData", ["require", "exports", "module"], function(e, t, i) {
    var o = "http://code.famo.us/famous-starter-kit/famous-starter-kit.zip", s = ["centered", "padt35"], n = ["centered", "pointer"];
    i.exports = {out: [{image: "famous_symbol_white.svg",url: "/",pushState: !0}, {text: "Famo.us University",url: "/university",classes: s,pushState: !0}, {text: "Demos",url: "/demos",classes: s,pushState: !0}, {text: "Docs",url: "/docs",classes: s,pushState: !0}, {text: "Guides",url: "/guides",classes: s,pushState: !0}, {text: "Help",url: "/help",classes: s,pushState: !0}],"in": [{image: "famous_symbol_white.svg",url: "/",pushState: !0}, {text: "Famo.us University",url: "/university",classes: s,pushState: !0}, {text: "Demos",url: "/demos",classes: s,pushState: !0}, {text: "Docs",url: "/docs",classes: s,pushState: !0}, {text: "Guides",url: "/guides",classes: s,pushState: !0}, {text: "Help",url: "/help",classes: s,pushState: !0}],"desktop-login": {},"right-nav-out": [{content: '<a data-analytics="zip-download-header" style="height: 60px; margin-top: 17px; padding: 18px;" class="col1 navigation centered red-bg dark-border white bor5" href="' + o + "\" onclick=\"__ga('send', 'event', 'track', 'zip-download-header')\">Download</a>",text: "Download",url: o,height: 60,isInstall: !0,pushState: !0}],"right-nav-in": [{content: '<a data-analytics="zip-download-header" style="height: 60px; margin-top: 17px; padding: 18px;" class="col1 navigation centered red-bg dark-border white bor5" href="' + o + "\" onclick=\"__ga('send', 'event', 'track', 'zip-download-header')\">Download</a>",text: "Download",url: o,height: 60,isInstall: !0,pushState: !0}],"mobile-logged-in": [{text: "Home",classes: n,url: "/",pushState: !0}, {text: "Demos",url: "/demos",classes: n,pushState: !0}, {text: "Docs",classes: n,url: "/docs"}, {text: "Guides",classes: n,url: "/guides"}, {text: "Help",url: "/help",classes: n,pushState: !0}],"mobile-logged-out": [{text: "Home",classes: n,url: "/",pushState: !0}, {text: "Demos",url: "/demos",classes: n,pushState: !0}, {text: "Docs",classes: n,url: "/docs",pushState: !0}, {text: "Guides",classes: n,url: "/guides",pushState: !0}, {text: "Help",url: "/help",classes: n,pushState: !0}]}
}), define("lib/text", ["module"], function(e) {
    var t, i, o, s, n = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], r = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, a = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, u = "undefined" != typeof location && location.href, c = u && location.protocol && location.protocol.replace(/\:/, ""), p = u && location.hostname, l = u && (location.port || void 0), h = {}, d = e.config && e.config() || {};
    return t = {version: "2.0.7",strip: function(e) {
            if (e) {
                e = e.replace(r, "");
                var t = e.match(a);
                t && (e = t[1])
            } else
                e = "";
            return e
        },jsEscape: function(e) {
            return e.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
        },createXhr: d.createXhr || function() {
            var e, t, i;
            if ("undefined" != typeof XMLHttpRequest)
                return new XMLHttpRequest;
            if ("undefined" != typeof ActiveXObject)
                for (t = 0; 3 > t; t += 1) {
                    i = n[t];
                    try {
                        e = new ActiveXObject(i)
                    } catch (o) {
                    }
                    if (e) {
                        n = [i];
                        break
                    }
                }
            return e
        },parseName: function(e) {
            var t, i, o, s = !1, n = e.indexOf("."), r = 0 === e.indexOf("./") || 0 === e.indexOf("../");
            return -1 !== n && (!r || n > 1) ? (t = e.substring(0, n), i = e.substring(n + 1, e.length)) : t = e, o = i || t, n = o.indexOf("!"), -1 !== n && (s = "strip" === o.substring(n + 1), o = o.substring(0, n), i ? i = o : t = o), {moduleName: t,ext: i,strip: s}
        },xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,useXhr: function(e, i, o, s) {
            var n, r, a, u = t.xdRegExp.exec(e);
            return u ? (n = u[2], r = u[3], r = r.split(":"), a = r[1], r = r[0], !(n && n !== i || r && r.toLowerCase() !== o.toLowerCase() || (a || r) && a !== s)) : !0
        },finishLoad: function(e, i, o, s) {
            o = i ? t.strip(o) : o, d.isBuild && (h[e] = o), s(o)
        },load: function(e, i, o, s) {
            if (s.isBuild && !s.inlineText)
                return void o();
            d.isBuild = s.isBuild;
            var n = t.parseName(e), r = n.moduleName + (n.ext ? "." + n.ext : ""), a = i.toUrl(r), h = d.useXhr || t.useXhr;
            !u || h(a, c, p, l) ? t.get(a, function(i) {
                t.finishLoad(e, n.strip, i, o)
            }, function(e) {
                o.error && o.error(e)
            }) : i([r], function(e) {
                t.finishLoad(n.moduleName + "." + n.ext, n.strip, e, o)
            })
        },write: function(e, i, o) {
            if (h.hasOwnProperty(i)) {
                var s = t.jsEscape(h[i]);
                o.asModule(e + "!" + i, "define(function () { return '" + s + "';});\n")
            }
        },writeFile: function(e, i, o, s, n) {
            var r = t.parseName(i), a = r.ext ? "." + r.ext : "", u = r.moduleName + a, c = o.toUrl(r.moduleName + a) + ".js";
            t.load(u, o, function() {
                var i = function(e) {
                    return s(c, e)
                };
                i.asModule = function(e, t) {
                    return s.asModule(e, c, t)
                }, t.write(e, u, i, n)
            }, n)
        }}, "node" === d.env || !d.env && "undefined" != typeof process && process.versions && process.versions.node ? (i = require.nodeRequire("fs"), t.get = function(e, t, o) {
        try {
            var s = i.readFileSync(e, "utf8");
            0 === s.indexOf("﻿") && (s = s.substring(1)), t(s)
        } catch (n) {
            o(n)
        }
    }) : "xhr" === d.env || !d.env && t.createXhr() ? t.get = function(e, i, o, s) {
        var n, r = t.createXhr();
        if (r.open("GET", e, !0), s)
            for (n in s)
                s.hasOwnProperty(n) && r.setRequestHeader(n.toLowerCase(), s[n]);
        d.onXhr && d.onXhr(r, e), r.onreadystatechange = function() {
            var t, s;
            4 === r.readyState && (t = r.status, t > 399 && 600 > t ? (s = new Error(e + " HTTP status: " + t), s.xhr = r, o(s)) : i(r.responseText), d.onXhrComplete && d.onXhrComplete(r, e))
        }, r.send(null)
    } : "rhino" === d.env || !d.env && "undefined" != typeof Packages && "undefined" != typeof java ? t.get = function(e, t) {
        var i, o, s = "utf-8", n = new java.io.File(e), r = java.lang.System.getProperty("line.separator"), a = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(n), s)), u = "";
        try {
            for (i = new java.lang.StringBuffer, o = a.readLine(), o && o.length() && 65279 === o.charAt(0) && (o = o.substring(1)), null !== o && i.append(o); null !== (o = a.readLine()); )
                i.append(r), i.append(o);
            u = String(i.toString())
        }finally {
            a.close()
        }
        t(u)
    } : ("xpconnect" === d.env || !d.env && "undefined" != typeof Components && Components.classes && Components.interfaces) && (o = Components.classes, s = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), t.get = function(e, t) {
        var i, n, r = {}, a = new FileUtils.File(e);
        try {
            i = o["@mozilla.org/network/file-input-stream;1"].createInstance(s.nsIFileInputStream), i.init(a, 1, 0, !1), n = o["@mozilla.org/intl/converter-input-stream;1"].createInstance(s.nsIConverterInputStream), n.init(i, "utf-8", i.available(), s.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), n.readString(i.available(), r), n.close(), i.close(), t(r.value)
        } catch (u) {
            throw new Error((a && a.path || "") + ": " + u)
        }
    }), t
}), define("lib/text!app/header/templates/NavigationTemplate", [], function() {
    return '<a class="navigation" href="{{ url }}" >{{ text }}</a>\n'
}), define("lib/text!app/header/templates/NavigationImageTemplate", [], function() {
    return '<a href="{{ url }}">\n    <img style="height: 50px;" src="/images/{{image}}"></img>\n</a>\n'
}), define("lib/text!app/header/templates/NavigationMobileTemplate", [], function() {
    return '<a class="base-menu-item" style="width: 100%; height: 100%;" href="{{ url }}" >{{ text }}</a>\n'
}), define("app/header/templates/NavigationTemplates", ["require", "exports", "module", "./NavigationData", "lib/text!./NavigationTemplate", "lib/text!./NavigationImageTemplate", "lib/text!./NavigationMobileTemplate"], function(e, t, i) {
    var o = (e("./NavigationData"), e("lib/text!./NavigationTemplate")), s = e("lib/text!./NavigationImageTemplate"), n = e("lib/text!./NavigationMobileTemplate"), r = {};
    r.image = Handlebars.compile(s), r.main = Handlebars.compile(o), r.mobile = Handlebars.compile(n), r.getTemplate = function(e) {
        return e.image ? r.image(e) : r.main(e)
    }, r.getMobileTemplate = function(e) {
        return e.image ? r.image(e) : r.mobile(e)
    }, i.exports = r
}), define("scene/Scene", ["require", "exports", "module", "famous/core/View", "famous/core/Entity", "famous/core/Engine", "famous/core/Transform"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.__activeEvents = [], this.__size = [], this.__id = n.register(this)
    }
    var s = e("famous/core/View"), n = e("famous/core/Entity"), r = e("famous/core/Engine"), a = e("famous/core/Transform");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.activate = function() {
    }, o.prototype.deactivate = function(e) {
        e && e()
    }, o.prototype.addEvent = function(e, t, i, o, s) {
        var n = s ? i : i.bind(this);
        return this.__activeEvents.push({unbindFn: o,key: t,boundFn: n}), e(t, n), this
    }, o.prototype.addEventFn = function() {
        return this.__activeEvents.push.apply(this.__activeEvents, arguments), this
    }, o.prototype.removeAllEvents = function() {
        for (var e = 0; e < this.__activeEvents.length; e++) {
            var t = this.__activeEvents[e];
            t instanceof Function ? t() : t.unbindFn(t.key, t.boundFn), this.__activeEvents[e] = null
        }
    }, o.prototype.destroy = function() {
        r.nextTick(n.unregister.bind({}, this.__id))
    }, o.prototype.commit = function(e) {
        var t = e.transform, i = e.opacity, o = e.origin;
        this.__size && this.__size[0] === e.size[0] && this.__size[1] === e.size[1] || (this.__size[0] = e.size[0], this.__size[1] = e.size[1], this._eventOutput.emit("resize")), this.__size && (t = a.moveThen([-this.__size[0] * o[0], -this.__size[1] * o[1], 0], t));
        var s = {transform: t,opacity: i,size: this.__size,target: this._node.render()};
        return s
    }, o.prototype.getSize = function() {
        return this.__size
    }, o.prototype.render = function() {
        return this.__id
    }, i.exports = o
}), define("scene/Transitions", ["require", "exports", "module", "famous/transitions/Easing", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/transitions/Easing"), s = e("famous/core/Transform");
    i.exports = {popIn: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.move(s.scale(1e-6, 1e-6), [.5 * window.innerWidth, .5 * window.innerHeight])), i.setTransform(s.identity, t, e)
        },popOut: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.move(s.scale(1e-6, 1e-6), [.5 * window.innerWidth, .5 * window.innerHeight]), t, e)
        },fadeLeft: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.translate(-window.innerWidth, 0, 0), t, e), i.setOpacity(0, t)
        },fadeInLeft: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.translate(window.innerWidth, 0, 0)), i.setTransform(s.identity, t, e), i.setOpacity(0), i.setOpacity(1, t)
        },fadeRight: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.translate(window.innerWidth, 0, 0), t, e), i.setOpacity(0, t)
        },fadeSmallRight: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.translate(200, 0, 0), t, e), i.setOpacity(0, t)
        },fadeInRight: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.translate(-window.innerWidth, 0, 0)), i.setTransform(s.identity, t, e), i.setOpacity(0), i.setOpacity(1, t)
        },fadeInSmallRight: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.translate(-200, 0, 0)), i.setTransform(s.identity, t, e), i.setOpacity(0), i.setOpacity(1, t)
        },fadeInForward: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inOutExpoNorm,duration: 1e3}, i.halt(), i.setTransform(s.translate(0, 0, -200)), i.setTransform(s.identity, t, e), i.setOpacity(0), i.setOpacity(1, t)
        },fallBack: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {method: "spring",period: 1e3,dampingRatio: .5}, i.halt(), i.setOrigin([0, 1]), i.setTransform(s.rotateX(.35 * Math.PI), t, e)
        },fadeOut: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.inExpoNorm,duration: 1e3}, i.halt(), i.setOpacity(1), i.setOpacity(0, t, e), i.setTransform(s.identity)
        },fadeIn: function(e, t) {
            var i = this.getActiveModifier();
            t = t ? t : {curve: o.outExpoNorm,duration: 750}, i.halt(), i.setOpacity(0), i.setOpacity(1, t, e)
        }}
}), define("scene/SceneTransitions", ["require", "exports", "module", "./Transitions"], function(e, t, i) {
    function o(e) {
        this.controller = e
    }
    var s = e("./Transitions");
    o.prototype.setController = function(e) {
        this.controller = e;
        for (var t in s)
            o.prototype[t] = s[t].bind(this.controller)
    }, i.exports = o
}), define("app/SceneTransitions", ["require", "exports", "module", "scene/SceneTransitions", "./SceneController"], function(e, t, i) {
    var o = e("scene/SceneTransitions"), s = e("./SceneController"), n = new o;
    n.setController(s), i.exports = n
}), define("helpers/WebUtilities", ["require", "exports", "module"], function(e, t, i) {
    var o = {};
    o.isFirefox = function() {
        return IS_FIREFOX
    }, o.isBrowser = function(e) {
        return navigator.userAgent.indexOf(e) > 0
    }, o.registerSurfaceLink = function(e) {
        e.target.pathname ? History.pushState(null, null, e.target.pathname) : e.target.parentElement.pathname && History.pushState(null, null, e.target.parentElement.pathname)
    }, o.firefoxRegister = function(e) {
        o.isFirefox() && e.on("click", o.registerSurfaceLink)
    }, IS_FIREFOX = o.isBrowser("Firefox"), i.exports = o
}), define("app/accounts/Accounts", ["require", "exports", "module", "famous/core/Engine", "famous/core/EventHandler"], function(e, t, i) {
    function o(e, t, i, o) {
        try {
            var s = JSON.parse(t.responseText)
        } catch (n) {
        }
        e && e(s, i, o, t)
    }
    function s() {
        a.STATE = a.LOGIN_STATE.IN, u.emit("login")
    }
    function n() {
        a.STATE = a.LOGIN_STATE.out, u.emit("logout")
    }
    var r = (e("famous/core/Engine"), e("famous/core/EventHandler")), a = {LOGIN_STATE: {OUT: 0,IN: 1},STATE: 0}, u = new r, c = "/v0/account";
    a.signup = function(e, t, i) {
        $.ajax({type: "POST",url: c + "/register",data: {email: e.email,password: e.password},dataType: "json",success: t,error: o.bind({}, i)})
    }, a.login = function(e, t, i) {
        $.ajax({type: "POST",url: c + "/login",data: {ttl: 86400},username: e.username,password: e.password,success: t,error: o.bind({}, i)})
    }, a.logout = function() {
        $.ajax({type: "GET",url: c + "/account/logout"})
    }, a.reset = function(e, t, i) {
        $.ajax({type: "POST",url: c + "/password/reset",data: {email: e.email},dataType: "json",success: t,error: o.bind({}, i)})
    }, a.resetPassword = function(e, t, i) {
        $.ajax({type: "POST",url: c + "/password",data: {token: e.token,newPassword: e.password},dataType: "json",success: t,error: o.bind({}, i)})
    }, a.getProfile = function(e, t) {
        $.ajax({type: "GET",url: c + "/profile",success: e,error: t})
    }, a.postProfile = function(e, t, i) {
        $.ajax({type: "POST",url: c + "/profile",data: e,success: successCb,error: i})
    }, a.getPlaceInLine = function(e) {
        $.ajax({type: "GET",url: c + "/waitlist/position",success: e,error: logger})
    }, a.download = function(e, t, i) {
        var o = c + "/download/" + e + "?json=1";
        $.ajax({url: o,type: "GET",success: t,error: i})
    }, a.getState = function() {
        return a.STATE
    }, a.getLoginStatus = function(e, t) {
        $.ajax({type: "GET",url: c + "/user",success: e || s,error: t || n})
    }, a.initialLoginCheck = new $.Deferred, a.initialLoginCheck.done(s), a.initialLoginCheck.fail(s), a.getLoginStatus(function() {
        a.initialLoginCheck.resolve()
    }, function() {
        a.initialLoginCheck.reject()
    }), a.on = u.on.bind(u), a.removeListener = u.removeListener.bind(u), a.pipe = u.pipe.bind(u), a.unpipe = u.unpipe.bind(u), i.exports = a
}), define("app/header/views/LoginSignoutSurface", ["require", "exports", "module", "scene/EventAwareView", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "app/accounts/Accounts", "app/Router", "helpers/WebUtilities"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.surface = new n({content: this.options.templates[a.getState()],classes: ["pointer", "padt35"],size: this.options.size}), c.isFirefox() ? this.surface.on("click", c.registerSurfaceLink) : this.surface.on("click", this._handleLoginLogout.bind(this)), u.registerLink(this.surface), this.mod = new r, this._node.add(this.mod).add(this.surface), this.bindEvents()
    }
    var s = e("scene/EventAwareView"), n = e("famous/core/Surface"), r = (e("famous/core/Transform"), e("famous/core/Modifier")), a = (e("famous/core/Engine"), e("app/accounts/Accounts")), u = e("app/Router"), c = e("helpers/WebUtilities");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {size: [100, 100],curve: {curve: "outExpo",duration: 350},templates: {}}, o.prototype.bindEvents = function() {
        this.addEvent(a.on, "login", this.setContent.bind(this, this.options.templates[1]), a.removeListener, !0).addEvent(a.on, "login-waitlist", this.setContent.bind(this, this.options.templates[1]), a.removeListener, !0).addEvent(a.on, "logout", this.setContent.bind(this, this.options.templates[0]), a.removeListener, !0)
    }, o.prototype.setContent = function(e) {
        this.mod.halt(), this.mod.setOpacity(0, this.options.curve, this._updateContent.bind(this, e))
    }, o.prototype._updateContent = function(e) {
        this.surface.setContent(e), this.mod.setOpacity(1, this.options.curve)
    }, o.prototype._handleLoginLogout = function() {
        var e = a.getState();
        0 !== e && a.logout()
    }, i.exports = o
}), define("app/header/MenuScene", ["require", "exports", "module", "scene/Scene", "famous/core/View", "famous/core/RenderNode", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "app/SceneTransitions", "app/SceneController", "app/header/templates/NavigationTemplates", "app/header/templates/NavigationData", "famous/views/Scrollview", "app/Router", "helpers/WebUtilities", "app/accounts/Accounts", "app/header/views/LoginSignoutSurface", "famous/surfaces/ContainerSurface"], function(e, t, i) {
    function o() {
        u.apply(this, arguments), this.menuSurfaces = [], this.menuMods = [], this.visible = !1, this._initContent(), this.scrollview, a.call(this), this.events()
    }
    function s() {
        var e = g["mobile-logged-in"].slice(0);
        r.call(this, e)
    }
    function n() {
        var e = g["mobile-logged-out"].slice(0);
        r.call(this, e)
    }
    function r(e) {
        for (var t = 0; t < e.length; t++) {
            var i = e[t], o = new p({content: v.getMobileTemplate(i),classes: i.classes,properties: {lineHeight: "100px"},size: [void 0, 100]}), s = new h, n = new c;
            n.add(s).add(o), n.getSize = o.getSize.bind(o), e.pushState && S.registerLink(o), w.isFirefox() && o.on("click", w.registerSurfaceLink), this.menuMods.push(s), this.menuSurfaces.push(n)
        }
    }
    function a() {
        this.scrollview = new y({}, {scrollbarProperties: {backgroundColor: "#868684",borderRadius: "20px"}}), this.scrollview.sequenceFrom(this.menuSurfaces), this._node.add(this.scrollview)
    }
    {
        var u = e("scene/Scene"), c = (e("famous/core/View"), e("famous/core/RenderNode")), p = e("famous/core/Surface"), l = e("famous/core/Transform"), h = e("famous/core/Modifier"), d = e("famous/core/Engine"), f = e("app/SceneTransitions"), m = e("app/SceneController"), v = e("app/header/templates/NavigationTemplates"), g = e("app/header/templates/NavigationData"), y = e("famous/views/Scrollview"), S = e("app/Router"), w = e("helpers/WebUtilities"), _ = e("app/accounts/Accounts");
        e("app/header/views/LoginSignoutSurface"), e("famous/surfaces/ContainerSurface")
    }
    o.prototype = Object.create(u.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {transitionOut: {curve: "outExpo",duration: 500},navigationHeight: 100}, o.prototype.events = function() {
        d.pipe(this.scrollview), this.addEventFn(d.unpipe.bind(d, this.scrollview))
    }, o.prototype._initContent = function() {
        1 === _.getState() ? s.call(this) : n.call(this)
    }, o.prototype.activate = function(e) {
        f.fadeInForward(e, this.options.transitionOut)
    }, o.prototype.deactivate = function(e) {
        this.removeAllEvents();
        var t = {method: "spring",period: 1e3,dampingRatio: .85}, i = m.getActiveModifier();
        i.setOrigin([0, 1]), i.setOpacity(0, {curve: "linear",duration: 400}, e), i.setTransform(l.rotateX(.25 * Math.PI), t);
        for (var o = 0; o < this.menuMods.length; o++)
            this.menuMods[o].setTransform(l.translate(0, 0, -300 * o), t)
    }, i.exports = o
}), define("widgets/MenuCloseButton", ["require", "exports", "module", "famous/core/View", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine"], function(e, t, i) {
    function o() {
        r.apply(this, arguments), this.openPositions = [], this.closePositions = [], this.mods = [], this._isMenu = !0, this.parentMod = new c({size: this.getSize()}), this.originMod = new c({origin: [.5, .5]}), s.call(this), n.call(this), this._eventOutput.on("click", this.toggle.bind(this))
    }
    function s() {
        for (var e = this.getSize(), t = 0; 3 > t; t++) {
            var i = new a({properties: this.options.properties,size: this.options.barSize});
            i.pipe(this._eventOutput);
            var o = u.translate(0, t * this.options.barSize[1] + this.options.padding * t - .5 * e[1]);
            this.openPositions.push(o);
            var s = new c({transform: o});
            this.mods.push(s), this._node.add(s).add(i)
        }
        this._blankSurface = new a({size: this.getSize()});
        var s = new c({opacity: 0});
        this._blankSurface.pipe(this._eventOutput), this._node.add(s).add(this._blankSurface)
    }
    function n() {
        this.closePositions.push(u.rotateZ(.25 * Math.PI)), this.closePositions.push(this.openPositions[1]), this.closePositions.push(u.rotateZ(.25 * -Math.PI))
    }
    {
        var r = e("famous/core/View"), a = e("famous/core/Surface"), u = e("famous/core/Transform"), c = e("famous/core/Modifier");
        e("famous/core/Engine")
    }
    o.prototype = Object.create(r.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {barSize: [60, 10],padding: 5,properties: {backgroundColor: "#404040",borderRadius: "10px"},menuTransition: {curve: "outExpo",duration: 400},closeTransition: {curve: "outExpo",duration: 400}}, o.prototype.toggle = function() {
        this._isMenu ? this.close() : this.menu()
    }, o.prototype.menu = function() {
        this.haltAll();
        for (var e = 0; e < this.mods.length; e++)
            this.mods[e].setTransform(this.openPositions[e], this.options.menuTransition);
        this.mods[1].setOpacity(1, this.options.menuTransition), this._isMenu = !0
    }, o.prototype.haltAll = function() {
        for (var e = 0; e < this.mods.length; e++)
            this.mods[e].halt();
        this.originMod.halt()
    }, o.prototype.close = function() {
        this.haltAll(), this.mods[0].setTransform(this.closePositions[0], this.options.closeTransition), this.mods[1].setOpacity(0, this.options.closeTransition), this.mods[2].setTransform(this.closePositions[2], this.options.closeTransition), this._isMenu = !1
    }, o.prototype.getSize = function() {
        return [this.options.barSize[0], 3 * this.options.barSize[1], 3 * this.options.padding]
    }, o.prototype.render = function() {
        return this.parentMod.modify(this.originMod.modify(this._node.render()))
    }, i.exports = o
}), define("app/header/views/NavigationMobileView", ["require", "exports", "module", "scene/EventAwareView", "famous/core/Surface", "famous/core/RenderNode", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/utilities/Timer", "app/header/templates/NavigationData", "famous/views/SequentialLayout", "app/Router", "app/header/MenuScene", "app/header/templates/NavigationTemplates", "app/SceneController", "scene/Route", "widgets/MenuCloseButton", "app/header/views/NavigationDesktopView"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.name = "NavigationMobileView", this._menuActive = !1, this.initBackground().initMenuButton().initLogo().events(), this.activate()
    }
    {
        var s = e("scene/EventAwareView"), n = e("famous/core/Surface"), r = (e("famous/core/RenderNode"), e("famous/core/Transform")), a = e("famous/core/Modifier"), u = (e("famous/core/Engine"), e("famous/utilities/Timer"), e("app/header/templates/NavigationData"), e("famous/views/SequentialLayout"), e("app/Router")), c = (e("app/header/MenuScene"), e("app/header/templates/NavigationTemplates"), e("app/SceneController")), p = e("scene/Route"), l = e("widgets/MenuCloseButton");
        e("app/header/views/NavigationDesktopView")
    }
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.BG_HEIGHT = 65, o.DEFAULT_OPTIONS = {background: !0,logoMargin: [30, 10],menuMargin: [-30, 20],activationCurve: {curve: "outExpo",duration: 500},navigationProperties: {backgroundColor: "#363636"},menuSize: [40, 40],menuProperties: {backgroundColor: "white",borderRadius: "5px"},barSize: [40, 5]}, o.prototype.getSize = function() {
        return [void 0, o.BG_HEIGHT]
    }, o.prototype.events = function() {
        this.menu.on("click", this._handleMenuClick.bind(this)), u.on("statechange", this._checkCloseMenu.bind(this))
    }, o.prototype._handleMenuClick = function() {
        var e = r.getTranslate(this._menuPosition);
        this.menuMod.setTransform(r.translate(e[0], e[1] - 10, e[2], 1)), this.menuMod.setTransform(this._menuPosition, {method: "spring",dampingRatio: .25,period: 250}), this._toggle()
    }, o.prototype._checkCloseMenu = function() {
        this._menuActive && (this.menu.menu(), this._menuActive = !1)
    }, o.prototype._toggle = function() {
        if (this._menuActive) {
            var e = this.parseDataFromHash();
            c.setScene({key: this._lastScene,data: e})
        } else {
            var t = c.getCurrentRoute();
            this._lastScene = t, c.setScene("menu")
        }
        this._menuActive = !this._menuActive
    }, o.prototype.parseDataFromHash = function() {
        var e = new p(History.getState().hash);
        return {route: e.split,search: e._search}
    }, o.prototype.initBackground = function() {
        return this.options.background ? (this.bg = new n({size: [void 0, o.BG_HEIGHT],properties: this.options.navigationProperties}), this.bgMod = new a({transform: r.translate(0, 0, -1)}), this._node.add(this.bgMod).add(this.bg), this) : void 0
    }, o.prototype.initMenuButton = function() {
        return this.menu = new l({barSize: this.options.barSize,properties: this.options.menuProperties}), this.menuMod = new a({origin: [1, 0],transform: r.translate(0, this.options.logoMargin[1])}), this._node.add(this.menuMod).add(this.menu), this
    }, o.prototype.initLogo = function() {
        return this.logo = new n({content: '<a href="/"><img style="width:100%;" src="/images/famous_symbol_white.svg"></img></a>',size: this.options.menuSize}), this.logoMod = new a({transform: r.translate(-100, .75 * this.options.logoMargin[1], 1)}), this._node.add(this.logoMod).add(this.logo), this
    }, o.prototype.activate = function() {
        this._menuPosition = r.translate(this.options.menuMargin[0], this.options.menuMargin[1], 1), this.menuMod.setTransform(this._menuPosition, this.options.activationCurve), this.logoMod.setTransform(r.translate(this.options.logoMargin[0], this.options.logoMargin[1], 1), this.options.activationCurve)
    }, o.prototype.deactivate = function(e) {
        this._menuActive && this._toggle(), this.bg.setSize([void 0, 100]), this.bgMod.setTransform(r.translate(0, o.BG_HEIGHT - 100, 0)), this.bgMod.setTransform(r.translate(0, 0, 0), this.options.activationCurve), this.logoMod.setOpacity(0, this.options.activationCurve), this.logoMod.setTransform(r.translate(-100, this.options.menuSize[1], 1), this.options.activationCurve), this.menuMod.setOpacity(0, this.options.activationCurve), this.menuMod.setTransform(r.translate(100, this.options.menuMargin[1], 1), this.options.activationCurve, e)
    }, i.exports = o
}), define("app/header/views/NavigationDesktopView", ["require", "exports", "module", "scene/EventAwareView", "famous/core/Surface", "famous/surfaces/ContainerSurface", "famous/core/RenderNode", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/utilities/Timer", "famous/views/SequentialLayout", "app/header/templates/NavigationTemplates", "app/header/templates/NavigationData", "app/header/views/NavigationMobileView", "app/Router", "analytics/Analytics", "app/accounts/Accounts", "./LoginSignoutSurface", "helpers/WebUtilities"], function(e, t, i) {
    function o(e, t) {
        s.apply(this, arguments), this.name = "NavigationDesktopView", this.navModifiers = [], this._leftItems = [], this._rightItems = [], this.data = t;
        var t = 1 == v.getState() ? this.data["in"] : this.data.out, i = 1 == v.getState() ? this.data["right-nav-in"] : this.data["right-nav-out"];
        this.initLeftNav(t).initBackground().initRightSequence().initRightNav(i).initLeftSequence().events(), "pending" !== v.initialLoginCheck.state() && this.activate()
    }
    var s = e("scene/EventAwareView"), n = e("famous/core/Surface"), r = e("famous/surfaces/ContainerSurface"), a = e("famous/core/RenderNode"), u = e("famous/core/Transform"), c = e("famous/core/Modifier"), p = (e("famous/core/Engine"), e("famous/utilities/Timer")), l = e("famous/views/SequentialLayout"), h = e("app/header/templates/NavigationTemplates"), d = (e("app/header/templates/NavigationData"), e("app/header/views/NavigationMobileView")), f = e("app/Router"), m = e("analytics/Analytics"), v = e("app/accounts/Accounts"), g = (e("./LoginSignoutSurface"), e("helpers/WebUtilities"));
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.BG_HEIGHT = 100, o.DEFAULT_OPTIONS = {background: !0,margin: [50, 0],activationCurve: {curve: "outExpo",duration: 500},wordSpacingMultiplier: 2.15,initialOffset: -100,logoOffset: 20,deactivateOffset: -125,loginOffset: 0,textOffset: 0,navigationClasses: ["centered"]}, o.prototype.getSize = function() {
        return [void 0, o.BG_HEIGHT]
    }, o.prototype.events = function() {
        this.addEvent(v.on, "login", this._loginNav, v.removeListener).addEvent(v.on, "logout", this._logoutNav, v.removeListener)
    }, o.prototype._loginNav = function() {
        var e = function() {
            this.initLeftNav(this.data["in"]), this.initRightNav(this.data["right-nav-in"], this.activate.bind(this))
        }.bind(this);
        this.deactivateNavItems(this.clearNavItems.bind(this, e))
    }, o.prototype._logoutNav = function() {
        var e = function() {
            this.initLeftNav(this.data.out), this.initRightNav(this.data["right-nav-out"], this.activate.bind(this))
        }.bind(this);
        this.deactivateNavItems(this.clearNavItems.bind(this, e))
    }, o.prototype.initBackground = function() {
        var e = {size: [void 0, o.BG_HEIGHT],properties: {backgroundColor: "#363636"}};
        return this.bgMod = new c, this.container = new r(e), this._node.add(this.bgMod).add(this.container), this
    }, o.prototype.initRightSequence = function() {
        return this.rightNavigationLayout = new l({direction: 0}), this.rightNavigationLayout.sequenceFrom(this._rightItems), this.rightNavigationMod = new c({origin: [.95, 0]}), this.container.add(this.rightNavigationMod).add(this.rightNavigationLayout), this
    }, o.prototype.initLeftSequence = function() {
        return this.leftNavigationLayout = new l({direction: 0}), this.leftNavigationLayout.sequenceFrom(this._leftItems), this.mainMod = new c({transform: u.translate(this.options.margin[0], this.options.margin[1])}), this.container.add(this.mainMod).add(this.leftNavigationLayout), this
    }, o.prototype.initRightNav = function(e, t) {
        for (var i = 0; i < e.length; i++)
            this.dataToItem(e[i], this._rightItems, i);
        return t && t(), this
    }, o.prototype.initLeftNav = function(e, t) {
        for (var i = 0; i < e.length; i++)
            this.dataToItem(e[i], this._leftItems, i);
        return t && t(), this
    }, o.prototype.dataToItem = function(e, t, i) {
        var o = e.content ? e.content : h.getTemplate(e), s = e.text ? .5 * e.text.length : 0;
        s = Math.round(Math.pow(s, this.options.wordSpacingMultiplier));
        var o = this.createSurfaces(o, s, e);
        t[i] ? t[i] = o.node : t.push(o.node), e.pushState && f.registerLink(o.surface), e.url && g.isFirefox() && o.surface.on("click", g.registerSurfaceLink)
    }, o.prototype.clearNavItems = function(e) {
        this.navModifiers = [], this._leftItems = [], this._rightItems = [], this.leftNavigationLayout.sequenceFrom(this._leftItems), this.rightNavigationLayout.sequenceFrom(this._rightItems), e && e()
    }, o.prototype.initLogin = function() {
    }, o.prototype.addLogin = function() {
        this._rightItems.push(this._loginNode)
    }, o.prototype.createSurfaces = function(e, t, i) {
        var s = i.image ? [100 + t, o.BG_HEIGHT] : [100 + t, o.BG_HEIGHT];
        i.height && (s[1] = i.height);
        var r = new n({content: e,properties: i.properties,classes: i.classes,size: s});
        m.onDataIDClick(r);
        var p = new c({transform: u.translate(0, this.options.initialOffset, 0)}), l = new a;
        return l.getSize = r.getSize.bind(r), this.navModifiers.push(p), l.add(p).add(r), {node: l,surface: r,modifier: p}
    }, o.prototype.activate = function() {
        for (var e = 0; e < this.navModifiers.length; e++) {
            var t = this.navModifiers[e], i = 0 == e ? this.options.logoOffset : this.options.textOffset;
            t.halt(), p.after(t.setTransform.bind(t, u.translate(0, i, 0), this.options.activationCurve, void 0), 5 * e)
        }
    }, o.prototype.deactivateNavItems = function(e) {
        for (var t = 0, i = this.navModifiers.length; i > t; t++) {
            var o = this.navModifiers[t], s = t == i - 1 ? e : null;
            p.setTimeout(o.setTransform.bind(o, u.translate(0, this.options.deactivateOffset, 0), this.options.activationCurve, s), 25 * t)
        }
    }, o.prototype.deactivate = function(e) {
        this.removeAllEvents(), this.deactivateNavItems(e), this.bgMod.setTransform(u.translate(0, d.BG_HEIGHT - o.BG_HEIGHT, -1, 0), this.options.activationCurve)
    }, i.exports = o
}), define("app/header/NavigationView", ["require", "exports", "module", "famous/core/View", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/core/RenderNode", "famous/transitions/Transitionable", "app/Router", "helpers/RenderHelpers", "widgets/Layouts", "app/header/views/NavigationDesktopView", "app/header/views/NavigationMobileView"], function(e, t, i) {
    function o(e, t) {
        n.apply(this, arguments), this.data = t, this._activeLayout, this.deactivateLayout = this._deactivateLayout.bind(this), this.height = new r(0), s.call(this)
    }
    function s() {
        return this.layouts = {tablet: {minWidth: 0,maxWidth: 1024,activate: this.activateLayout.bind(this, p, "mobile"),deactivate: this.deactivateLayout},desktop: {minWidth: 1024,maxWidth: 9999,activate: this.activateLayout.bind(this, c, "desktop"),deactivate: this.deactivateLayout}}, u.add(this.layouts), this
    }
    var n = e("famous/core/View"), r = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("famous/core/RenderNode"), e("famous/transitions/Transitionable")), a = (e("app/Router"), e("helpers/RenderHelpers")), u = e("widgets/Layouts"), c = e("app/header/views/NavigationDesktopView"), p = e("app/header/views/NavigationMobileView");
    o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {itemWidth: 100,leftMargin: 100,rightMargin: 100,margins: 50,navigationHeight: 100,activationCurve: {curve: "outExpo",duration: 500}}, o.CHILD_OPTIONS = {desktop: {activationCurve: o.DEFAULT_OPTIONS.activationCurve,transitionHeightTo: p.BG_HEIGHT},mobile: {activationCurve: o.DEFAULT_OPTIONS.activationCurve,transitionHeightTo: c.BG_HEIGHT}}, o.TRANSITION_OPTIONS = {NavigationDesktopView: o.CHILD_OPTIONS.desktop,NavigationMobileView: o.CHILD_OPTIONS.mobile}, o.prototype.getSize = function() {
        return [void 0, this.height.get()]
    }, o.prototype.transitionHeight = function(e, t, i) {
        this.height.set(e, t, i)
    }, o.prototype.deactivate = function() {
        u.remove(this.layouts)
    }, o.prototype.activateLayout = function(e, t) {
        this._activeLayout = new e(o.CHILD_OPTIONS[t], this.data), this.height.set(this._activeLayout.getSize()[1]), this._node.add(this._activeLayout)
    }, o.prototype._deactivateLayout = function(e) {
        if (this._activeLayout) {
            var t = o.TRANSITION_OPTIONS[this._activeLayout.name];
            this.transitionHeight(t.transitionHeightTo, t.activationCurve), this._activeLayout.deactivate(function(e) {
                a.resetNode(this._node), e()
            }.bind(this, e))
        } else
            a.resetNode(this._node), e()
    }, i.exports = o
}), define("appHarness", ["require", "exports", "module", "registry/RegisterEasing", "registry/RegisterPhysics", "styles/FamousStyles", "famous/core/Engine", "app/Router", "analytics/Analytics", "app/SceneController", "app/header/NavigationView", "app/header/templates/NavigationData", "famous/views/HeaderFooterLayout", "famous/surfaces/ContainerSurface", "app/header/MenuScene"], function(e, t, i) {
    e("registry/RegisterEasing"), e("registry/RegisterPhysics");
    var o = (e("styles/FamousStyles"), e("famous/core/Engine")), s = e("app/Router"), n = (e("analytics/Analytics"), e("app/SceneController")), r = e("app/header/NavigationView"), a = e("app/header/templates/NavigationData"), u = e("famous/views/HeaderFooterLayout"), c = e("famous/surfaces/ContainerSurface"), p = o.createContext();
    p.setPerspective(1e3);
    var l = new u, h = new r({}, a);
    l.header.add(h);
    var d = new c({properties: {overflow: "hidden"}});
    d.add(n), l.content.add(d), p.add(l), s.connect(n), n.addScenes({menu: e("app/header/MenuScene")}), i.exports = p
}), define("events/EventHelpers", ["require", "exports", "module", "famous/utilities/Timer"], function(e, t, i) {
    function o(e, t, i) {
        i || (i = 1), e instanceof Array || (e = [e]);
        var o = s.every(function() {
            for (var i = 0; i < e.length; i++)
                if (!e[i]())
                    return;
            t(), s.clear(o)
        }, i)
    }
    var s = e("famous/utilities/Timer");
    i.exports = {when: o}
}), define("events/Keybindings", ["require", "exports", "module", "famous/core/Engine", "famous/core/EventHandler", "scene/Controller"], function(e, t, i) {
    function o() {
        r.apply(this, arguments), this.keyup = this._onKeyup.bind(this), this.keydown = this._onKeydown.bind(this), this.keyStates = {CMD: !1,ENTER: !1,DELETE: !1,oBRACKET: !1,cBRACKET: !1,OPTION: !1,ONE: !1,TWO: !1,THREE: !1}, this.bindEvents()
    }
    function s(e) {
        for (var t = 0; t < this.options.preventDefaults.length; t++) {
            for (var i = this.options.preventDefaults[t], o = 0, s = i.length, n = 0; s > n; n++)
                o += this.isDown(i[n]) << 0;
            o == s && e.preventDefault()
        }
    }
    var n = e("famous/core/Engine"), r = (e("famous/core/EventHandler"), e("scene/Controller"));
    o.prototype = Object.create(r.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {preventDefaults: [["DELETE"], ["CMD", "oBRACKET"], ["CMD", "cBRACKET"]]}, o.prototype.bindEvents = function() {
        n.on("keyup", this.keyup), n.on("keydown", this.keydown)
    }, o.prototype.unbindEvents = function() {
        n.removeListener("keyup", this.keyup), n.removeListener("keydown", this.keydown)
    }, o.prototype.isDown = function(e) {
        return this.keyStates[e]
    }, o.prototype._onKeyup = function(e) {
        this.keyUp(e.keyCode), this._eventOutput.emit("keyup")
    }, o.prototype._onKeydown = function(e) {
        this.keyDown(e.keyCode), s.call(this, e), this._eventOutput.emit("keydown")
    }, o.prototype.keyDown = function(e) {
        var t = o.KEY_MAP[e];
        t && (this.keyStates[t] = !0)
    }, o.prototype.keyUp = function(e) {
        var t = o.KEY_MAP[e];
        t ? "CMD" === t ? (this.keyStates.CMD = !1, this.keyStates.ENTER = !1, this.keyStates.DELETE = !1, this.keyStates.oBRACKET = !1, this.keyStates.cBRACKET = !1, this.keyStates.OPTION = !1, this.keyStates.ONE = !1, this.keyStates.TWO = !1, this.keyStates.THREE = !1) : this.keyStates[t] = !1 : this.keyStates[t] = !1
    }, o.KEY_MAP = {91: "CMD",93: "CMD",224: "CMD",13: "ENTER",8: "DELETE",219: "oBRACKET",221: "cBRACKET",18: "OPTION",49: "ONE",50: "TWO",51: "THREE"}, i.exports = o
}), define("animation/Builder/AnimatedView", ["require", "exports", "module", "famous/core/View", "famous/core/Modifier"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.__modifier = new n
    }
    var s = e("famous/core/View"), n = e("famous/core/Modifier");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype.getModifier = function() {
        return this.__modifier
    }, o.prototype.render = function() {
        return this.__modifier.modify(this._node.render())
    }, i.exports = o
}), define("widgets/ButtonView", ["require", "exports", "module", "famous/core/View", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.visible, this.surface = new n({size: this.options.size,content: this.options.content,properties: this.options.properties,classes: this.options.classes}), this.modifier = new a({origin: this.options.origin,transform: this.options.transform,size: this.options.size}), this.centerMod = new a({origin: [.5, .5]}), this._node.add(this.modifier).add(this.centerMod).add(this.surface), this.surface.pipe(this._eventOutput), this.events()
    }
    {
        var s = e("famous/core/View"), n = e("famous/core/Surface"), r = e("famous/core/Transform"), a = e("famous/core/Modifier");
        e("famous/core/Engine")
    }
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {size: void 0,content: void 0,properties: void 0,origin: void 0,transform: void 0,classes: [],bounceBack: !1,bounceTransition: {method: "spring",period: 250,dampingRatio: .25},bounceDepth: -5}, o.prototype.events = function() {
        this.surface.on("click", this._bounceBack.bind(this))
    }, o.prototype.setContent = function(e) {
        return this.surface.setContent(e)
    }, o.prototype._bounceBack = function() {
        this.options.bounceBack && (this.centerMod.halt(), this.centerMod.setTransform(r.translate(0, this.options.bounceDepth)), this.centerMod.setTransform(r.identity, this.options.bounceTransition))
    }, o.prototype.hide = function(e) {
        (this.visible || void 0 === this.visible) && (this.visible = !1, this.centerMod.halt(), this.centerMod.setTransform(r.scale(.001, .001), {curve: "outExpo",duration: 500}, e))
    }, o.prototype.show = function(e) {
        this.visible || (this.visible = !0, this.centerMod.halt(), this.centerMod.setTransform(r.identity, {curve: "outExpo",duration: 500}, e))
    }, o.prototype.toggle = function() {
        this.visible ? this.hide() : this.show()
    }, i.exports = o
}), define("app/university/views/ToolbarView", ["require", "exports", "module", "animation/Builder/AnimatedView", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/views/GridLayout", "widgets/ButtonView"], function(e, t, i) {
    function o(e, t) {
        u.apply(this, arguments), this.buttons = {}, this.boundEvents = {}, this.models = t, s.call(this), n.call(this), r.call(this)
    }
    function s() {
        var e = new c({classes: ["toolbar-view"],size: [this.options.width, void 0],properties: {zIndex: 1,backgroundColor: "#878785"}});
        this.add(e)
    }
    function n() {
        for (var e = 0; e < this.options.buttons.length; e++) {
            var t = this.options.buttons[e], i = t.id;
            this.buttons[i] = new l(t), this.add(this.buttons[i]), t.onClick && this.buttons[i].on("click", this._eventOutput.emit.bind(this._eventOutput, t.onClick))
        }
    }
    function r() {
        for (var e = 0; e < this.options.buttons.length; e++) {
            var t = this.options.buttons[e];
            if (t.pair) {
                var i = t.id;
                t.defaultVisible ? this.buttons[i].show() : this.buttons[i].hide();
                var o = a(this.options.buttons, "id", t.pair);
                this.buttons[i].on("click", function(e) {
                    this.toggle(), e.toggle()
                }.bind(this.buttons[o.id], this.buttons[i]))
            }
        }
    }
    function a(e, t, i) {
        for (var o = 0; o < e.length; o++)
            if (e[o][t] == i)
                return e[o]
    }
    var u = e("animation/Builder/AnimatedView"), c = e("famous/core/Surface"), p = e("famous/core/Transform"), l = (e("famous/core/Modifier"), e("famous/core/Engine"), e("famous/views/GridLayout"), e("widgets/ButtonView"));
    o.prototype = Object.create(u.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {width: 50,backgroundProperties: {},buttons: [{id: "lesson",pair: "closeLessons",defaultVisible: !0,onClick: "toggleLesson",size: [50, 50],content: '<div class="col1"><span class="col1 centered" style="line-height: 48px; color:#404040; font-size: 12px;">CLOSE</span></div>',classes: ["lesson-close", "pointer"],properties: {zIndex: 2},origin: [0, 1],transform: p.translate(0, -126, 2)}, {id: "closeLessons",pair: "lesson",onClick: "toggleLesson",size: [50, 50],content: '<div class="col1"><span class="col1 centered" style="border-top: 1px solid white; border-bottom: 1px solid white; line-height: 48px; color:#FFFFFF; font-size: 12px;">TEXT</span></div>',origin: [0, 1],properties: {zIndex: 2},classes: ["lesson-open", "pointer"],transform: p.translate(0, -126, 2)}, {id: "fullscreen",onClick: "toggleFull",pair: "closeFullscreen",defaultVisible: !0,size: [50, 50],properties: {zIndex: 2},content: '<img class="pointer" title="Fullscreen Off" class="tool" src="/images/icons/fullscreen-off.png" />',origin: [0, 1],transform: p.translate(15, -12, 2)}, {id: "closeFullscreen",pair: "fullscreen",onClick: "toggleFull",properties: {zIndex: 2},size: [50, 50],content: '<img class="pointer" title="Fullscreen" class="tool" src="/images/icons/fullscreen.png" />',origin: [0, 1],transform: p.translate(15, -12, 2)}]}, o.prototype.stateListener = function(e) {
        "onePanel" == e && (this.buttons.closeLessons.show(), this.buttons.lesson.hide())
    }, i.exports = o
}), define("animation/builder/AnimatedView", ["require", "exports", "module", "famous/core/View", "famous/core/Modifier"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.__modifier = new n
    }
    var s = e("famous/core/View"), n = e("famous/core/Modifier");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype.getModifier = function() {
        return this.__modifier
    }, o.prototype.render = function() {
        return this.__modifier.modify(this._node.render())
    }, i.exports = o
}), define("widgets/Flip", ["require", "exports", "module", "famous/core/Transform", "famous/transitions/Transitionable", "famous/core/RenderNode", "famous/core/OptionsManager"], function(e, t, i) {
    function o(e) {
        this.options = Object.create(o.DEFAULT_OPTIONS), this._optionsManager = new a(this.options), e && this.setOptions(e), this._side = 0, this.state = new n(0), this.frontNode = new r, this.backNode = new r
    }
    var s = e("famous/core/Transform"), n = e("famous/transitions/Transitionable"), r = e("famous/core/RenderNode"), a = e("famous/core/OptionsManager");
    o.DEFAULT_OPTIONS = {transition: !0,cull: !0}, o.prototype.setDefaultTransition = function(e) {
        this.transition = e
    }, o.prototype.flip = function(e, t) {
        void 0 === e && (e = 1 === this._side ? 0 : 1), this._side = e, this.state.set(e, this.options.transition, t)
    }, o.prototype.setOptions = function(e) {
        return this._optionsManager.setOptions(e)
    }, o.prototype.setFront = function(e) {
        return this.frontNode.set(e)
    }, o.prototype.setBack = function(e) {
        return this.backNode.set(e)
    }, o.prototype.render = function(e) {
        var t = this.state.get();
        return void 0 !== e ? {transform: s.rotateY(Math.PI * t),target: e} : this.options.cull && !this.state.isActive() ? t ? this.backNode.render() : this.frontNode.render() : [{transform: s.rotateY(Math.PI * t),target: this.frontNode.render()}, {transform: s.rotateY(Math.PI * (t + 1)),target: this.backNode.render()}]
    }, i.exports = o
}), define("app/university/views/LessonTextView", ["require", "exports", "module", "famous/core/View", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine"], function(e, t, i) {
    function o() {
        n.apply(this, arguments), this.content, this.mod, s.call(this)
    }
    function s() {
        this.content = document.createElement("div"), this.content.style.maxWidth = "700px", this.content.style.textAlign = "left";
        var e = new r({content: this.content,size: [void 0, void 0],classes: this.options.classes,properties: this.options.properties});
        this.mod = new a({origin: [1, .5]}), this.add(this.mod).add(e)
    }
    var n = e("famous/core/View"), r = e("famous/core/Surface"), a = (e("famous/core/Transform"), e("famous/core/Modifier")), u = e("famous/core/Engine"), c = new Showdown.converter;
    o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {contentTransition: {curve: "outExpo",duration: 200},properties: {},classes: []}, o.prototype.setContent = function(e) {
        e = c.makeHtml(e), this.mod.halt(), this.hide(function(e) {
            this.content.innerHTML = e, u.nextTick(this.show.bind(this))
        }.bind(this, e))
    }, o.prototype.show = function(e) {
        this.mod.setOpacity(1, this.options.contentTransition, e)
    }, o.prototype.hide = function(e) {
        this.mod.setOpacity(0, this.options.contentTransition, e)
    }, i.exports = o
}), define("app/university/views/LessonView", ["require", "exports", "module", "animation/builder/AnimatedView", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/core/RenderNode", "widgets/Flip", "famous/transitions/Transitionable", "famous/core/Engine", "./LessonTextView"], function(e, t, i) {
    function o(e, t) {
        n.apply(this, arguments), this.model = t, this.updateFromLesson = this._updateFromLesson.bind(this), this.lessonFlipMod, this.lessonFlip, this.taskMod, this.lesson, s.call(this), this.bindEvents()
    }
    function s() {
        this.lesson = new r({classes: ["lesson-view"],properties: {padding: "29px 29px 29px 50px"}}), this.add(this.lesson)
    }
    var n = e("animation/builder/AnimatedView"), r = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("famous/core/RenderNode"), e("widgets/Flip"), e("famous/transitions/Transitionable"), e("famous/core/Engine"), e("./LessonTextView"));
    o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype.bindEvents = function() {
        return this.model.on("change:currentStep", this.updateFromLesson), this
    }, o.prototype.unbindEvents = function() {
        this.model.removeListener("change:currentStep", this.updateFromLesson)
    }, o.prototype._updateFromLesson = function() {
        var e = this.model.getInstructions();
        this.lesson.setContent(e)
    }, i.exports = o
}), define("widgets/AceSurface", ["require", "exports", "module", "famous/core/Surface", "famous/core/Engine"], function(e, t, i) {
    function o(e) {
        r.apply(this, arguments), e || (e = {}), this.options.theme = e.theme ? e.theme : "ace/theme/famous", this.options.tabSize = e.tabSize ? e.tabSize : 2, this.models = e.models, this._isSilent = !1, this._aceContentDirty = !1, this.setContent('<div style="width: 100%; height: 100%; pointer-events: all;" id="editor-view"></div>'), this.setProperties({pointerEvents: "all"}), this.on("deploy", s.bind(this)), this.emitChangeEvent = n.bind(this)
    }
    function s() {
        this._editor = ace.edit("editor-view"), this._editor.setTheme("ace/theme/famous");
        var e = this.getSession();
        e.setTabSize(this.options.tabSize), e.setMode("ace/mode/javascript"), this.bindChangeEvent(), this._aceContentDirty && this._setAceContent()
    }
    function n() {
        this.emit("codeChanged", {value: this.getValue()})
    }
    {
        var r = e("famous/core/Surface");
        e("famous/core/Engine")
    }
    o.prototype = Object.create(r.prototype), o.prototype.constructor = o, o.prototype.getValue = function() {
        return this._editor.getValue()
    }, o.prototype.getSession = function() {
        return this._editor.getSession()
    }, o.prototype.getEditor = function() {
        return this._editor
    }, o.prototype.setAceContent = function(e) {
        this._aceContent = e, this._aceContentDirty = !0, this._editor && this._setAceContent()
    }, o.prototype._setAceContent = function() {
        this._editor.setValue(this._aceContent), this._editor.getSelection().clearSelection(), this._editor.moveCursorTo(0, 0), this._aceContentDirty = !1
    }, o.prototype.modifyContent = function(e) {
        this._editor.setValue(e)
    }, o.prototype.bindChangeEvent = function() {
        this.getSession().on("change", this.emitChangeEvent)
    }, o.prototype.unbindChangeEvent = function() {
        this.getSession().off("change", this.emitChangeEvent)
    }, i.exports = o
}), define("app/university/views/EditorView", ["require", "exports", "module", "animation/builder/AnimatedView", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/transitions/Transitionable", "widgets/AceSurface"], function(e, t, i) {
    function o(e, t) {
        n.apply(this, arguments), this.models = t, this.aceEditor, s.call(this), this.handleCodeChange = this._handleCodeChange.bind(this), this.events()
    }
    function s() {
        this.aceEditor = new r({models: this.models,properties: {backgroundColor: "#404040",borderRight: "2px solid white"}}), this._node.add(this.aceEditor)
    }
    var n = e("animation/builder/AnimatedView"), r = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("famous/transitions/Transitionable"), e("widgets/AceSurface"));
    o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.prototype.events = function() {
        this.aceEditor.on("codeChanged", this.handleCodeChange)
    }, o.prototype.unbindEvents = function() {
        this.aceEditor.removeListener("codeChanged", this.handleCodeChange)
    }, o.DEFAULT_OPTIONS = {}, o.prototype._handleCodeChange = function() {
        var e = this.aceEditor.getValue();
        this.models.code.setCode(e), this.models.lesson && this.models.lesson.setCode(e)
    }, o.prototype.setCode = function(e) {
        this.aceEditor.setAceContent(e)
    }, i.exports = o
}), define("famous/events/EventFilter", ["require", "exports", "module", "famous/core/EventHandler"], function(e, t, i) {
    function o(e) {
        s.call(this), this._condition = e
    }
    var s = e("famous/core/EventHandler");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.emit = function(e, t) {
        return this._condition(e, t) ? s.prototype.emit.apply(this, arguments) : void 0
    }, o.prototype.trigger = o.prototype.emit, i.exports = o
}), define("famous/events/EventMapper", ["require", "exports", "module", "famous/core/EventHandler"], function(e, t, i) {
    function o(e) {
        s.call(this), this._mappingFunction = e
    }
    var s = e("famous/core/EventHandler");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.subscribe = null, o.prototype.unsubscribe = null, o.prototype.emit = function(e, t) {
        var i = this._mappingFunction.apply(this, arguments);
        i && i.emit instanceof Function && i.emit(e, t)
    }, o.prototype.trigger = o.prototype.emit, i.exports = o
}), define("famous/surfaces/InputSurface", ["require", "exports", "module", "famous/core/Surface"], function(e, t, i) {
    function o(e) {
        this._placeholder = e.placeholder || "", this._value = e.value || "", this._type = e.type || "text", this._name = e.name || "", s.apply(this, arguments), this.on("click", this.focus.bind(this))
    }
    var s = e("famous/core/Surface");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.elementType = "input", o.prototype.elementClass = "famous-surface", o.prototype.setPlaceholder = function(e) {
        return this._placeholder = e, this._contentDirty = !0, this
    }, o.prototype.focus = function() {
        return this._currTarget && this._currTarget.focus(), this
    }, o.prototype.blur = function() {
        return this._currTarget && this._currTarget.blur(), this
    }, o.prototype.setValue = function(e) {
        return this._value = e, this._contentDirty = !0, this
    }, o.prototype.setType = function(e) {
        return this._type = e, this._contentDirty = !0, this
    }, o.prototype.getValue = function() {
        return this._currTarget ? this._currTarget.value : this._value
    }, o.prototype.setName = function(e) {
        return this._name = e, this._contentDirty = !0, this
    }, o.prototype.getName = function() {
        return this._name
    }, o.prototype.deploy = function(e) {
        "" !== this._placeholder && (e.placeholder = this._placeholder), e.value = this._value, e.type = this._type, e.name = this._name
    }, i.exports = o
}), define("famous/surfaces/ImageSurface", ["require", "exports", "module", "famous/core/Surface"], function(e, t, i) {
    function o() {
        this._imageUrl = void 0, s.apply(this, arguments)
    }
    var s = e("famous/core/Surface");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.elementType = "img", o.prototype.elementClass = "famous-surface", o.prototype.setContent = function(e) {
        this._imageUrl = e, this._contentDirty = !0
    }, o.prototype.deploy = function(e) {
        e.src = this._imageUrl || ""
    }, o.prototype.recall = function(e) {
        e.src = ""
    }, i.exports = o
}), define("famous/views/ContextualView", ["require", "exports", "module", "famous/core/Entity", "famous/core/Transform", "famous/core/EventHandler", "famous/core/OptionsManager"], function(e, t, i) {
    function o(e) {
        this.options = Object.create(o.DEFAULT_OPTIONS), this._optionsManager = new r(this.options), e && this.setOptions(e), this._eventInput = new n, this._eventOutput = new n, n.setInputHandler(this, this._eventInput), n.setOutputHandler(this, this._eventOutput), this._id = s.register(this)
    }
    var s = e("famous/core/Entity"), n = (e("famous/core/Transform"), e("famous/core/EventHandler")), r = e("famous/core/OptionsManager");
    o.DEFAULT_OPTIONS = {}, o.prototype.setOptions = function(e) {
        return this._optionsManager.setOptions(e)
    }, o.prototype.getOptions = function() {
        return this._optionsManager.getOptions()
    }, o.prototype.render = function() {
        return this._id
    }, o.prototype.commit = function() {
    }, i.exports = o
}), define("famous/views/FlexibleLayout", ["require", "exports", "module", "famous/core/Entity", "famous/core/Transform", "famous/core/OptionsManager", "famous/core/EventHandler", "famous/transitions/Transitionable"], function(e, t, i) {
    function o(e) {
        this.options = Object.create(o.DEFAULT_OPTIONS), this.optionsManager = new r(this.options), e && this.setOptions(e), this.id = s.register(this), this._ratios = new u(this.options.ratios), this._nodes = [], this._cachedDirection = this.options.direction, this._cachedSpec = null, this._cachedLength = !1, this._eventOutput = new a, a.setOutputHandler(this, this._eventOutput)
    }
    var s = e("famous/core/Entity"), n = e("famous/core/Transform"), r = e("famous/core/OptionsManager"), a = e("famous/core/EventHandler"), u = e("famous/transitions/Transitionable");
    o.DIRECTION_X = 0, o.DIRECTION_Y = 1, o.DEFAULT_OPTIONS = {direction: o.DIRECTION_X,transition: !1,ratios: []}, o.prototype.render = function() {
        return this.id
    }, o.prototype.setOptions = function(e) {
        e.direction && e.direction !== this.options.direction && (this._cachedDirection = e.direction), this.optionsManager.setOptions(e)
    }, o.prototype.sequenceFrom = function(e) {
        if (this._nodes = e, 0 === this._ratios.get().length) {
            for (var t = [], i = 0; i < this._nodes.length; i++)
                t.push(1);
            this.setRatios(t)
        }
    }, o.prototype.setRatios = function(e, t, i) {
        void 0 === t && (t = this.options.transition);
        var o = this._ratios;
        0 === o.get().length && (t = void 0), o.isActive() && o.halt(), o.set(e, t, i)
    }, o.prototype.commit = function(e) {
        var t, i, s, r = e.size, a = e.transform, u = e.origin, c = this.options.direction, p = r[c];
        if (p === this._cachedLength && this._cachedSpec && !this._ratios.isActive() && c === this._cachedDirection)
            return this._cachedSpec;
        var l = this._ratios.get(), h = p, d = 0;
        for (i = 0; i < l.length; i++)
            t = l[i], s = this._nodes[i], "number" != typeof t ? h -= s.getSize()[c] || 0 : d += t;
        var f, m = 0, v = [];
        for (i = 0; i < l.length; i++) {
            var g = [r[0], r[1]];
            s = this._nodes[i], t = l[i], g[c] = "number" == typeof t ? h * t / d : s.getSize()[c], f = c === o.DIRECTION_X ? n.translate(m, 0, 0) : n.translate(0, m, 0), v.push({transform: f,size: g,target: s.render()}), m += g[c]
        }
        return r && 0 !== u[0] && 0 !== u[1] && (a = n.moveThen([-r[0] * u[0], -r[1] * u[1], 0], a)), this._cachedSpec = {transform: a,size: r,target: v}, this._cachedLength = p, this._cachedDirection = c, this._cachedSpec
    }, i.exports = o
}), define("famous/views/Flipper", ["require", "exports", "module", "famous/core/Transform", "famous/transitions/Transitionable", "famous/core/RenderNode", "famous/core/OptionsManager"], function(e, t, i) {
    function o(e) {
        this.options = Object.create(o.DEFAULT_OPTIONS), this._optionsManager = new r(this.options), e && this.setOptions(e), this.angle = new n(0), this.frontNode = void 0, this.backNode = void 0, this.flipped = !1
    }
    var s = e("famous/core/Transform"), n = e("famous/transitions/Transitionable"), r = (e("famous/core/RenderNode"), e("famous/core/OptionsManager"));
    o.DIRECTION_X = 0, o.DIRECTION_Y = 1;
    var a = 1;
    o.DEFAULT_OPTIONS = {transition: !0,direction: o.DIRECTION_X}, o.prototype.flip = function(e, t) {
        var i = this.flipped ? 0 : Math.PI;
        this.setAngle(i, e, t), this.flipped = !this.flipped
    }, o.prototype.setAngle = function(e, t, i) {
        void 0 === t && (t = this.options.transition), this.angle.isActive() && this.angle.halt(), this.angle.set(e, t, i)
    }, o.prototype.setOptions = function(e) {
        return this._optionsManager.setOptions(e)
    }, o.prototype.setFront = function(e) {
        this.frontNode = e
    }, o.prototype.setBack = function(e) {
        this.backNode = e
    }, o.prototype.render = function() {
        var e, t, i = this.angle.get();
        this.options.direction === o.DIRECTION_X ? (e = s.rotateY(i), t = s.rotateY(i + Math.PI)) : (e = s.rotateX(i), t = s.rotateX(i + Math.PI));
        var n = [];
        return this.frontNode && n.push({transform: e,target: this.frontNode.render()}), this.backNode && n.push({transform: s.moveThen([0, 0, a], t),target: this.backNode.render()}), n
    }, i.exports = o
}), define("widgets/DeviceView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/core/RenderNode", "famous/surfaces/ContainerSurface"], function(e, t, i) {
    function o() {
        l.apply(this, arguments), s.call(this), n.call(this), r.call(this), a.call(this)
    }
    function s() {
        this.options.width ? this.options.height = this.options[this.options.type].aspectRatio * this.options.width : this.options.height && (this.options.width = this.options.height / this.options[this.options.type].aspectRatio), this.options.screenWidth = this.options[this.options.type].screenWidth * this.options.width, this.options.screenHeight = this.options[this.options.type].screenHeight * this.options.height, this.options.originX = this.options[this.options.type].originX * this.options.width, this.options.originY = this.options[this.options.type].originY * this.options.height
    }
    function n() {
        this.device = new u({size: [this.options.width, this.options.height],content: '<img src="' + this.options[this.options.type].image + '" width="' + this.options.width + '">'}), this.device.pipe(this._eventOutput), this._add(this.device)
    }
    function r() {
        this.container = new h({size: [this.options.screenWidth, this.options.screenHeight],properties: {backgroundColor: "black",overflow: "hidden"}}), this.containerMod = new c({transform: p.translate(this.options.originX, this.options.originY, .1)}), this._add(this.containerMod).add(this.container)
    }
    function a() {
        this.container.getSize();
        this.contentMod = new c({origin: [.5, .5]}), this.reset = new c({origin: [0, 0]}), this.contentNode = this.container.add(this.contentMod).add(this.reset)
    }
    var u = e("famous/core/Surface"), c = e("famous/core/Modifier"), p = e("famous/core/Transform"), l = e("famous/core/View"), h = (e("famous/core/RenderNode"), e("famous/surfaces/ContainerSurface"));
    o.prototype = Object.create(l.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {type: "",width: 0,height: 0,iphone: {image: "/images/device-iphone.svg",aspectRatio: 659 / 317,screenWidth: .86,screenHeight: .705,originX: .07,originY: .148},ipad: {image: "/images/device-ipad.svg",aspectRatio: 434 / 290,screenWidth: .89,screenHeight: .8,originX: .058,originY: .096},nexus: {image: "/images/device-nexus.svg",aspectRatio: 667 / 332,screenWidth: .895,screenHeight: .789,originX: .05,originY: .0915}}, o.prototype.setLandscape = function() {
        this.contentMod.setTransform(p.rotateZ(-Math.PI / 2), this.options.rotateTransition), this.contentMod.setSize([this.container.getSize()[1], this.container.getSize()[0]])
    }, o.prototype.setPortrait = function() {
        this.contentMod.setTransform(p.rotateZ(0), this.options.rotateTransition), this.contentMod.setSize(this.container.getSize())
    }, o.prototype.getSize = function() {
        return [this.options.width, this.options.height]
    }, o.prototype.getScreenSize = function() {
        return [this.options.screenWidth, this.options.screenHeight]
    }, o.prototype.add = function(e) {
        return this.contentNode.add(e)
    }, i.exports = o
}), define("widgets/IframeSurface", ["require", "exports", "module", "famous/core/Surface"], function(e, t, i) {
    function o() {
        this._iframeUrl = "about:blank", s.apply(this, arguments)
    }
    var s = e("famous/core/Surface");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.elementType = "iframe", o.prototype.elementClass = "famous-surface", o.prototype.setContent = function(e) {
        this._iframeUrl = e, this._contentDirty = !0
    }, o.prototype.deploy = function(e) {
        e.src = this._iframeUrl || "about:blank"
    }, o.prototype.recall = function(e) {
        e.src = ""
    }, i.exports = o
}), define("app/university/views/LivePreview", ["require", "exports", "module", "famous/core/Context", "famous/core/ElementAllocator", "famous/core/Entity", "famous/events/EventArbiter", "famous/events/EventFilter", "famous/events/EventMapper", "famous/core/EventHandler", "famous/core/Group", "famous/core/Modifier", "famous/core/OptionsManager", "famous/core/RenderNode", "famous/core/Scene", "famous/core/SpecParser", "famous/core/Surface", "famous/core/Transform", "famous/core/View", "famous/core/ViewSequence", "famous/math/Quaternion", "famous/math/Matrix", "famous/math/Random", "famous/math/Vector", "famous/modifiers/StateModifier", "famous/modifiers/Draggable", "famous/modifiers/ModifierChain", "famous/physics/PhysicsEngine", "famous/physics/bodies/Body", "famous/physics/bodies/Circle", "famous/physics/bodies/Particle", "famous/physics/bodies/Rectangle", "famous/physics/constraints/Collision", "famous/physics/constraints/Constraint", "famous/physics/constraints/Curve", "famous/physics/constraints/Distance", "famous/physics/constraints/Wall", "famous/physics/constraints/Walls", "famous/physics/forces/Drag", "famous/physics/forces/Force", "famous/physics/forces/Repulsion", "famous/physics/forces/Spring", "famous/physics/forces/RotationalSpring", "famous/physics/forces/VectorField", "famous/physics/integrators/SymplecticEuler", "famous/surfaces/CanvasSurface", "famous/surfaces/InputSurface", "famous/surfaces/ContainerSurface", "famous/surfaces/ImageSurface", "famous/surfaces/VideoSurface", "famous/inputs/FastClick", "famous/inputs/GenericSync", "famous/inputs/MouseSync", "famous/inputs/PinchSync", "famous/inputs/RotateSync", "famous/inputs/ScaleSync", "famous/inputs/ScrollSync", "famous/inputs/TouchSync", "famous/inputs/TouchTracker", "famous/inputs/TwoFingerSync", "famous/transitions/Easing", "famous/transitions/MultipleTransition", "famous/transitions/SnapTransition", "famous/transitions/SpringTransition", "famous/transitions/SnapTransition", "famous/transitions/Transitionable", "famous/transitions/TweenTransition", "famous/transitions/WallTransition", "famous/utilities/KeyCodes", "famous/utilities/Utility", "famous/views/ContextualView", "famous/views/Deck", "famous/views/EdgeSwapper", "famous/views/FlexibleLayout", "famous/views/Flipper", "famous/views/GridLayout", "famous/views/HeaderFooterLayout", "famous/views/Lightbox", "famous/views/RenderController", "famous/views/ScrollContainer", "famous/views/Scrollview", "famous/views/SequentialLayout", "famous/widgets/NavigationBar", "famous/widgets/Slider", "famous/widgets/TabBar", "famous/widgets/ToggleButton", "widgets/DeviceView", "widgets/IframeSurface", "helpers/RenderHelpers", "famous/core/Engine", "famous/utilities/Timer"], function(require, exports, module) {
    function eventForwarder(e, t, i, o) {
        LISTENERS.push({key: i,fn: o,removeFn: t}), e(i, o)
    }
    function eventForwarderOnReturn(e, t, i, o) {
        var s = e(i, o);
        LISTENERS.push({key: i,fn: s,removeFn: t})
    }
    function eventRemover(e) {
        e.removeFn(e.key, e.fn)
    }
    function Preview() {
        View.apply(this, arguments)
    }
    function stripComments(e) {
        if (e) {
            var t = e.split("\n"), i = [];
            if (t.length > 0)
                for (var o = 0; o < t.length; o++) {
                    var s = t[o];
                    0 !== s.indexOf("//") && i.push(s)
                }
            return i.join("\n")
        }
    }
    function removeDependencies(e) {
        if (e) {
            for (var t = e.split("\n"), i = [], o = 0; o < t.length; o++) {
                var s = /^define/gi.test(t[o]) || /createContext/gi.test(t[o]) || /require/gi.test(t[o]);
                s || i.push(t[o])
            }
            return i = i.join("\n")
        }
    }
    var Context = require("famous/core/Context"), ElementAllocator = require("famous/core/ElementAllocator"), Entity = require("famous/core/Entity"), EventArbiter = require("famous/events/EventArbiter"), EventFilter = require("famous/events/EventFilter"), EventMapper = require("famous/events/EventMapper"), EventHandler = require("famous/core/EventHandler"), Group = require("famous/core/Group"), Modifier = require("famous/core/Modifier"), OptionsManager = require("famous/core/OptionsManager"), RenderNode = require("famous/core/RenderNode"), Scene = require("famous/core/Scene"), SpecParser = require("famous/core/SpecParser"), Surface = require("famous/core/Surface"), Transform = require("famous/core/Transform"), View = require("famous/core/View"), ViewSequence = require("famous/core/ViewSequence"), Quaternion = require("famous/math/Quaternion"), Matrix = require("famous/math/Matrix"), Random = require("famous/math/Random"), Vector = require("famous/math/Vector"), StateModifier = require("famous/modifiers/StateModifier"), Draggable = require("famous/modifiers/Draggable"), ModifierChain = require("famous/modifiers/ModifierChain"), PhysicsEngine = require("famous/physics/PhysicsEngine"), Body = require("famous/physics/bodies/Body"), Circle = require("famous/physics/bodies/Circle"), Particle = require("famous/physics/bodies/Particle"), Rectangle = require("famous/physics/bodies/Rectangle"), Collision = require("famous/physics/constraints/Collision"), Constraint = require("famous/physics/constraints/Constraint"), Curve = require("famous/physics/constraints/Curve"), Distance = require("famous/physics/constraints/Distance"), Wall = require("famous/physics/constraints/Wall"), Walls = require("famous/physics/constraints/Walls"), Drag = require("famous/physics/forces/Drag"), Force = require("famous/physics/forces/Force"), Repulsion = require("famous/physics/forces/Repulsion"), Spring = require("famous/physics/forces/Spring"), RotationalSpring = require("famous/physics/forces/RotationalSpring"), VectorField = require("famous/physics/forces/VectorField"), SymplecticEuler = require("famous/physics/integrators/SymplecticEuler"), CanvasSurface = require("famous/surfaces/CanvasSurface"), InputSurface = require("famous/surfaces/InputSurface"), ContainerSurface = require("famous/surfaces/ContainerSurface"), ImageSurface = require("famous/surfaces/ImageSurface"), VideoSurface = require("famous/surfaces/VideoSurface"), FastClick = require("famous/inputs/FastClick"), GenericSync = require("famous/inputs/GenericSync"), MouseSync = require("famous/inputs/MouseSync"), PinchSync = require("famous/inputs/PinchSync"), RotateSync = require("famous/inputs/RotateSync"), ScaleSync = require("famous/inputs/ScaleSync"), ScrollSync = require("famous/inputs/ScrollSync"), TouchSync = require("famous/inputs/TouchSync"), TouchTracker = require("famous/inputs/TouchTracker"), TwoFingerSync = require("famous/inputs/TwoFingerSync"), Easing = require("famous/transitions/Easing"), MultipleTransition = require("famous/transitions/MultipleTransition"), SnapTransition = require("famous/transitions/SnapTransition"), SpringTransition = require("famous/transitions/SpringTransition"), SnapTransition = require("famous/transitions/SnapTransition"), Transitionable = require("famous/transitions/Transitionable"), TweenTransition = require("famous/transitions/TweenTransition"), WallTransition = require("famous/transitions/WallTransition"), KeyCodes = require("famous/utilities/KeyCodes"), Utility = require("famous/utilities/Utility"), ContextualView = require("famous/views/ContextualView"), Deck = require("famous/views/Deck"), EdgeSwapper = require("famous/views/EdgeSwapper"), FlexibleLayout = require("famous/views/FlexibleLayout"), Flipper = require("famous/views/Flipper"), GridLayout = require("famous/views/GridLayout"), HeaderFooterLayout = require("famous/views/HeaderFooterLayout"), Lightbox = require("famous/views/Lightbox"), RenderController = require("famous/views/RenderController"), ScrollContainer = require("famous/views/ScrollContainer"), Scrollview = require("famous/views/Scrollview"), SequentialLayout = require("famous/views/SequentialLayout"), NavigationBar = require("famous/widgets/NavigationBar"), Slider = require("famous/widgets/Slider"), TabBar = require("famous/widgets/TabBar"), ToggleButton = require("famous/widgets/ToggleButton"), DeviceView = require("widgets/DeviceView"), IframeSurface = require("widgets/IframeSurface"), RenderHelpers = require("helpers/RenderHelpers"), RealEngine = require("famous/core/Engine"), RealTimer = require("famous/utilities/Timer"), LISTENERS = [], Engine = {};
    for (var key in RealEngine)
        Engine[key] = RealEngine[key];
    Engine.on = eventForwarder.bind({}, RealEngine.on, RealEngine.removeListener);
    var Timer = {};
    for (var key in RealTimer)
        Timer[key] = RealTimer[key];
    Timer.clear = function(e, t) {
        return RealTimer.clear(t)
    }, Timer.setInterval = eventForwarderOnReturn.bind({}, RealTimer.setInterval, Timer.clear), Preview.prototype = Object.create(View.prototype), Preview.prototype.constructor = Preview, Preview.DEFAULT_OPTIONS = {width: null}, Preview.prototype.run = function run(code) {
        this.reset();
        var context = mainContext = this.container.context;
        code = stripComments(code), code = removeDependencies(code);
        try {
            eval(code)
        } catch (e) {
            return e
        }
    }, Preview.prototype.reset = function() {
        for (RenderHelpers.resetNode(this._node); listener = LISTENERS.pop(); )
            eventRemover(listener);
        this.container = new ContainerSurface({properties: {overflow: "hidden"}}), this._add(this.container)
    }, module.exports = Preview
}), define("app/university/views/Preview", ["require", "exports", "module", "animation/builder/AnimatedView", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "./LivePreview"], function(e, t, i) {
    function o(e, t) {
        n.apply(this, arguments), this.models = t, this.preview, s.call(this), this.updatePreview = this._updatePreview.bind(this), this.events()
    }
    function s() {
        this.preview = new r, this._node.add(this.preview)
    }
    var n = e("animation/builder/AnimatedView"), r = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("./LivePreview"));
    o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype.events = function() {
        this.models.code.on("change:code", this.updatePreview)
    }, o.prototype.unbindEvents = function() {
        this.preview.reset(), this.models.code.removeListener("change:code", this.updatePreview)
    }, o.prototype.runCode = function(e) {
        var t = this.preview.run(e);
        t ? (console.log(t), this.models.code.set("runtimeStatus", "invalid"), this.models.code.set("errorMessage", t)) : this.models.code.set("runtimeStatus", "valid")
    }, o.prototype._updatePreview = function(e) {
        var t = this.preview.run(e.value);
        t ? (console.log(t), this.models.code.set("runtimeStatus", "invalid"), this.models.code.set("errorMessage", t)) : this.models.code.set("runtimeStatus", "valid")
    }, i.exports = o
}), define("widgets/ProgressBar", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View"], function(e, t, i) {
    function o() {
        a.apply(this, arguments), this.fill, this.fillMod, this.back, this.label, this.init()
    }
    var s = e("famous/core/Surface"), n = e("famous/core/Modifier"), r = e("famous/core/Transform"), a = e("famous/core/View");
    o.prototype = Object.create(a.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {size: [200, 10],defaultValue: 0,backClasses: [],frontClasses: [],transition: {curve: "outExpo",duration: 100}}, o.prototype.init = function() {
        this.fill = new s({size: this.options.size,classes: this.options.frontClasses}), this.back = new s({size: this.options.size,classes: this.options.backClasses}), this.fillMod = new n({transform: r.scale(this.options.defaultValue, 1, 1)}), this._node.add(this.fillMod).add(this.fill), this._node.add(this.back)
    }, o.prototype.setProgress = function(e) {
        this.fillMod.halt(), this.fillMod.setTransform(r.scale(e, 1, 1), this.options.transition)
    }, o.prototype.setSize = function(e) {
        this.setOptions({size: e}), this.fill.setSize(this.options.size), this.back.setSize(this.options.size)
    }, o.prototype.getSize = function() {
        return this.back.getSize()
    }, o.prototype.render = function() {
        return {size: this.options.size,target: {origin: [0, .5],target: this._node.render()}}
    }, i.exports = o
}), define("app/university/views/NextPreviousView", ["require", "exports", "module", "animation/builder/AnimatedView", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/surfaces/ContainerSurface", "famous/core/Engine", "widgets/ButtonView", "widgets/ProgressBar"], function(e, t, i) {
    function o(e, t) {
        s.apply(this, arguments), this.models = t, this.nextButton, this.prevButton, this.indicator, this.resizeProgress = this._resizeProgress.bind(this), this.updateProgress = this._updateProgress.bind(this), this.updateButtons = this._updateButtons.bind(this), this.setNextStep = this.models.lesson.nextStep.bind(this.models.lesson), this.setPrevStep = this.models.lesson.previousStep.bind(this.models.lesson), this.complete = this.complete.bind(this), this.initButtons().bindEvents()
    }
    var s = e("animation/builder/AnimatedView"), n = (e("famous/core/Surface"), e("famous/core/Transform")), r = e("famous/core/Modifier"), a = e("famous/surfaces/ContainerSurface"), u = (e("famous/core/Engine"), e("widgets/ButtonView")), c = e("widgets/ProgressBar");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {nextButton: {size: [120, 50],content: ["Next"],classes: ["next-button", "no-user-select"],bounceBack: !0},prevButton: {size: [120, 50],content: ["Previous"],classes: ["prev-button", "no-user-select"],bounceBack: !0},completeButton: {size: [120, 50],content: ["Complete"],classes: ["next-button", "no-user-select"],bounceBack: !0},padding: 18,progressHeight: 4,nextZ: 1,prevZ: 0}, o.prototype.bindEvents = function() {
        return this.models.lesson.on("change:currentStep", this.updateButtons), this.models.lesson.on("change:currentStep", this.updateProgress), this._eventInput.on("sequence-start", this.resizeProgress), this._eventInput.on("sequence-completed", this.resizeProgress), this.nextButton.on("click", function() {
            this._eventOutput.emit("updateUrl", this.models.lesson.getStep().index + 2)
        }.bind(this)), this.prevButton.on("click", function() {
            this._eventOutput.emit("updateUrl", this.models.lesson.getStep().index)
        }.bind(this)), this.completeButton.on("click", this.complete), this
    }, o.prototype.unbindEvents = function() {
        this.models.lesson.removeListener("change:currentStep", this.updateButtons)
    }, o.prototype._resizeProgress = function() {
        this.indicator.setSize([void 0, this.options.progressHeight])
    }, o.prototype.complete = function() {
        this._eventOutput.emit("complete"), this.completeButton.hide()
    }, o.prototype._updateButtons = function(e) {
        var t = e.value, i = this.models.lesson.get("steps"), o = i.length;
        0 === t ? (this.prevButton.hide(), this.nextButton.show(), this.completeButton.hide()) : t === o - 1 ? (this.prevButton.show(), this.nextButton.hide(), this.completeButton.show()) : (this.prevButton.show(), this.nextButton.show(), this.completeButton.hide())
    }, o.prototype._updateProgress = function(e) {
        var t = this.models.lesson.get("steps"), i = t.length, o = e.value / (i - 1);
        this.indicator.setProgress(o)
    }, o.prototype.initButtons = function() {
        var e = new a({properties: {backgroundColor: "#F0EEE9"}});
        return this._node.add(e), this.prevButton = new u(this.options.prevButton), this.nextButton = new u(this.options.nextButton), this.completeButton = new u(this.options.completeButton), this.prevMod = new r({origin: [0, .5]}), this.offsetPrev = new r({transform: n.translate(this.options.padding, 0, this.options.prevZ)}), this.nextMod = new r({origin: [1, .5]}), this.offsetNext = new r({transform: n.translate(-this.options.padding, 0, this.options.nextZ)}), this.completeMod = new r({origin: [1, .5]}), this.offsetComplete = new r({transform: n.translate(-this.options.padding, 0, this.options.prevZ)}), e.add(this.prevMod).add(this.offsetPrev).add(this.prevButton), e.add(this.nextMod).add(this.offsetNext).add(this.nextButton), e.add(this.completeMod).add(this.offsetComplete).add(this.completeButton), this.indicator = new c({backClasses: ["next-indicator-back"],frontClasses: ["red-bg"]}), e.add(this.indicator), this
    }, i.exports = o
}), define("app/university/states/OnePanel", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "toolbar",transform: {sequence: [{value: o.translate(0, 0, 1),transition: {curve: "outExpo",duration: 800}}]}}, {target: "preview",transform: {sequence: [{value: function() {
                                return o.translate(e.TOOLBAR_WIDTH, 0)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [t - e.TOOLBAR_WIDTH, i]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "editor",transform: {sequence: [{value: function(e) {
                                return o.translate(.3 * -e, 0, -1)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(e, t) {
                                return [.25 * e, t]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(.25 * -t, i - e.NEXT_PREV_HEIGHT)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t) {
                                return [.25 * t, e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "lesson",transform: {sequence: [{value: function(e) {
                                return o.translate(.25 * -e, 0)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [.25 * t, i - e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "refresh",size: [30, 30],transform: {sequence: [{value: function(e) {
                                return o.translate(e - 40, 10, 3)
                            }}]}}, {target: "app",size: {sequence: [{value: [1, 1]}]},transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}, {target: "app",size: {sequence: [{value: [1, 1]}]},transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}]
    }
}), define("app/university/states/TwoPanel", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "editor",size: {sequence: [{value: function(e, t) {
                                return [.5 * e, t]
                            },transition: {curve: "outExpo",duration: 800}}]},transform: {sequence: [{value: function() {
                                return o.translate(e.TOOLBAR_WIDTH, 0)
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "preview",transform: {sequence: [{value: function(t) {
                                return o.translate(.5 * t + e.TOOLBAR_WIDTH, 0)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [.5 * t - e.TOOLBAR_WIDTH, i]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "toolbar",transform: {sequence: [{value: function() {
                                return o.translate(0, 0, 1)
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "lesson",transform: {sequence: [{value: function(e) {
                                return o.translate(.25 * -e, 0)
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(.25 * -t, i - e.NEXT_PREV_HEIGHT)
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "refresh",size: [30, 30],transform: {sequence: [{value: function(e) {
                                return o.translate(e - 40, 10, 3)
                            }}]}}, {target: "app",size: {sequence: [{value: [1, 1]}]},transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}, {target: "app",size: {sequence: [{value: [1, 1]}]},transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}]
    }
}), define("app/university/states/ThreePanel", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "toolbar",transform: {sequence: [{value: function(e) {
                                return o.translate(.25 * e, 0, 1)
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "editor",size: {sequence: [{value: function(t, i) {
                                return [.5 * t - e.TOOLBAR_WIDTH, i]
                            },transition: {curve: "outExpo",duration: 400}}]},transform: {sequence: [{value: function(t) {
                                return o.translate(.25 * t + e.TOOLBAR_WIDTH, 0)
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "lesson",transform: {sequence: [{value: o.translate(0, 0),transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [.25 * t, i - e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(0, i - e.NEXT_PREV_HEIGHT, -1)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t) {
                                return [.25 * t, e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "preview",transform: {sequence: [{value: function(e) {
                                return o.translate(.75 * e, 0)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(e, t) {
                                return [.25 * e, t]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "refresh",size: [30, 30],transform: {sequence: [{value: function(e) {
                                return o.translate(e - 40, 10, 3)
                            }}]}}, {target: "app",size: {sequence: [{value: [1, 1]}]},transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}]
    }
}), define("app/university/states/HorizontalPanel", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "toolbar",transform: {sequence: [{value: function() {
                                return o.translate(-e.TOOLBAR_WIDTH, 0)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function() {
                                return [e.TOOLBAR_WIDTH, void 0]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "editor",size: {sequence: [{value: function(e, t) {
                                return [.75 * e, .35 * t]
                            },transition: {curve: "outExpo",duration: 400}}]},transform: {sequence: [{value: function(e, t) {
                                return o.translate(.25 * e, .65 * t)
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "lesson",transform: {sequence: [{value: function() {
                                return o.translate(0, 0)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [.25 * t, i - e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(0, i - e.NEXT_PREV_HEIGHT)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t) {
                                return [.25 * t, e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "preview",transform: {sequence: [{value: function(e) {
                                return o.translate(.25 * e, 0)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(e, t) {
                                return [.75 * e, .65 * t]
                            },transition: {curve: "outExpo",duration: 800}}]}}]
    }
}), define("app/university/states/TextPreview", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "toolbar",transform: {sequence: [{value: function(e) {
                                return o.translate(-e, 0, 1)
                            }}]},size: [0, 0]}, {target: "editor",transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]},size: [0, 0]}, {target: "lesson",transform: {sequence: [{value: o.translate(0, 0),transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [.5 * t, i - e.NEXT_PREV_HEIGHT]
                            }}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(0, i - e.NEXT_PREV_HEIGHT, -1)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t) {
                                return [.5 * t, e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "preview",transform: {sequence: [{value: function(e) {
                                return o.translate(.5 * e, 0)
                            }}]},size: {sequence: [{value: function(e) {
                                return [.5 * e, void 0]
                            }}]}}, {target: "app",transform: {sequence: [{value: function(e, t) {
                                return o.translate(e, t)
                            }}]}}, {target: "refresh",size: [0, 0],transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}]
    }
}), define("app/university/states/TextApp", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "toolbar",transform: {sequence: [{value: function(e) {
                                return o.translate(-e, 0, 1)
                            }}]},size: [0, 0]}, {target: "editor",transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]},size: [0, 0]}, {target: "lesson",transform: {sequence: [{value: o.translate(0, 0),transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [.5 * t, i - e.NEXT_PREV_HEIGHT]
                            }}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(0, i - e.NEXT_PREV_HEIGHT, -1)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t) {
                                return [.5 * t, e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "app",transform: {sequence: [{value: function(e) {
                                return o.translate(.5 * e, 0)
                            }}]},size: {sequence: [{value: function(e) {
                                return [.5 * e, void 0]
                            }}]}}, {target: "preview",transform: {sequence: [{value: function(e, t) {
                                return o.translate(e, t)
                            }}]}}, {target: "refresh",size: [0, 0],transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}]
    }
}), define("app/university/states/TextOnly", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "toolbar",transform: {sequence: [{value: function(e) {
                                return o.translate(-e, 0, 1)
                            }}]},size: [0, 0]}, {target: "editor",transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]},size: [0, 0]}, {target: "lesson",transform: {sequence: [{value: o.translate(0, 0),transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [t, i - e.NEXT_PREV_HEIGHT]
                            }}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(0, i - e.NEXT_PREV_HEIGHT, -1)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t) {
                                return [t, e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "app",transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]},size: [0, 0]}, {target: "preview",transform: {sequence: [{value: function(e, t) {
                                return o.translate(e, t)
                            }}]}}, {target: "refresh",size: [0, 0],transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}]
    }
}), define("app/university/states/TextCode", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function(e) {
        return [{target: "toolbar",transform: {sequence: [{value: function(e) {
                                return o.translate(-e, 0, 1)
                            }}]},size: [0, 0]}, {target: "app",transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]},size: [0, 0]}, {target: "lesson",transform: {sequence: [{value: o.translate(0, 0),transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t, i) {
                                return [.5 * t, i - e.NEXT_PREV_HEIGHT]
                            }}]}}, {target: "nextPrev",transform: {sequence: [{value: function(t, i) {
                                return o.translate(0, i - e.NEXT_PREV_HEIGHT, -1)
                            },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(t) {
                                return [.5 * t, e.NEXT_PREV_HEIGHT]
                            },transition: {curve: "outExpo",duration: 800}}]}}, {target: "editor",transform: {sequence: [{value: function(e) {
                                return o.translate(.5 * e, 0)
                            }}]},size: {sequence: [{value: function(e) {
                                return [.5 * e, void 0]
                            }}]}}, {target: "preview",transform: {sequence: [{value: function(e, t) {
                                return o.translate(e, t)
                            }}]}}, {target: "refresh",size: [0, 0],transform: {sequence: [{value: function(e) {
                                return o.translate(e, 0)
                            }}]}}]
    }
}), define("app/university/states/UniversityStates", ["require", "exports", "module", "famous/core/Transform", "app/university/states/OnePanel", "app/university/states/TwoPanel", "app/university/states/ThreePanel", "app/university/states/HorizontalPanel", "app/university/states/TextPreview", "app/university/states/TextApp", "app/university/states/TextOnly", "app/university/states/TextCode"], function(e, t, i) {
    function o(e) {
        for (var t in e)
            h[t] = e[t];
        return {onePanel: s(h),twoPanel: n(h),threePanel: r(h),horizontal: a(h),textApp: c(h),textOnly: p(h),textCode: l(h),textPreview: u(h)}
    }
    var s = (e("famous/core/Transform"), e("app/university/states/OnePanel")), n = e("app/university/states/TwoPanel"), r = e("app/university/states/ThreePanel"), a = e("app/university/states/HorizontalPanel"), u = e("app/university/states/TextPreview"), c = e("app/university/states/TextApp"), p = e("app/university/states/TextOnly"), l = e("app/university/states/TextCode"), h = {TOOLBAR_WIDTH: 50,NEXT_PREV_HEIGHT: 125,NAV_HEIGHT: 100,SHOW_NEXT_PREV: !0};
    i.exports = o
}), define("animation/builder/AnimationSequence", ["require", "exports", "module", "famous/utilities/Timer", "famous/core/EventHandler", "famous/transitions/Transitionable"], function(e, t, i) {
    function o(e, t, i) {
        this.modifier = t, this.animations = e, this._eventOutput = new n, n.setInputHandler(this, this._eventOutput), n.setOutputHandler(this, this._eventOutput), this.applySize = i, this.indices = {}, this.transitionables = {}, this.completedSequence = {opacity: !1,transform: !1,size: !1,origin: !1}, this.init()
    }
    {
        var s = e("famous/utilities/Timer"), n = e("famous/core/EventHandler");
        e("famous/transitions/Transitionable")
    }
    o.prototype.init = function() {
        this._setCompletedIfEmpty();
        for (var e in this.animations)
            this._step(e)
    }, o.prototype._step = function(e) {
        var t = this.animations[e];
        if (t.sequence) {
            var i = this._stepIndex(e), o = t.sequence[i];
            o ? this._animate(e, o) : this._setCompleted(e)
        } else
            this._setCompleted(e)
    }, o.prototype._setCompletedIfEmpty = function() {
        for (var e in this.completedSequence)
            this.animations[e] || this._setCompleted(e)
    }, o.prototype._setCompleted = function(e) {
        this.completedSequence[e] = !0, this._checkAllCompleted() && this._eventOutput.emit("sequence-completed")
    }, o.prototype._checkAllCompleted = function() {
        var e = !0;
        for (var t in this.completedSequence)
            if (0 == this.completedSequence[t]) {
                e = !1;
                break
            }
        return e
    }, o.prototype._stepIndex = function(e) {
        this.indices[e] || (this.indices[e] = 0);
        var t = this.indices[e];
        return this.indices[e]++, t
    }, o.prototype._animate = function(e, t) {
        if (t.event)
            return this._eventOutput.emit(t.event, t.value), this._step.call(this, e);
        var i = this.applySize(t.value);
        t.delay ? s.setTimeout(this._step.bind(this, e), t.delay) : "transform" == e ? this.modifier.setTransform(i, t.transition, this._step.bind(this, e)) : "opacity" == e ? this.modifier.setOpacity(i, t.transition, this._step.bind(this, e)) : "origin" == e ? this.modifier.setOrigin(i, t.transition, this._step.bind(this, e)) : "size" == e && this.modifier.setSize(i, t.transition, this._step.bind(this, e))
    }, o.prototype.halt = function() {
        this.modifier.halt()
    }, i.exports = o
}), define("animation/builder/AnimationTree", ["require", "exports", "module", "famous/core/Surface", "famous/core/RenderNode", "famous/core/EventHandler", "famous/surfaces/ImageSurface", "famous/core/Modifier"], function(e, t, i) {
    function o() {
        this._node = new c, this._surfaces, this._modifiers, this._transitionables, this._contentAdded = !1
    }
    function s(e) {
        e._object = null, e._child = null, e._hasMultipleChildren = !1, e._isRenderable = !1, e._isModifier = !1, e._resultCache = {}, e._prevResults = {}, e._childResult = null
    }
    function n(e) {
        for (var t = {}, i = 0; i < e.length; i++) {
            var o, s = e[i];
            s.type ? "ImageSurface" == s.type && (o = p) : o = u, t[s.key] = new o(s.options)
        }
        return t
    }
    function r(e) {
        for (var t = {}, i = 0; i < e.length; i++) {
            var s = o.getDefaultModifierOptions(e[i]);
            t[e[i].target] = new l(s)
        }
        return t
    }
    function a(e, t, i) {
        for (var o = {}, s = 0; s < e.length; s++) {
            var n = e[s], r = n.target, a = i[r];
            o[r] ? o[r].push(a) : o[r] = [a]
        }
        return o
    }
    var u = e("famous/core/Surface"), c = e("famous/core/RenderNode"), p = (e("famous/core/EventHandler"), e("famous/surfaces/ImageSurface")), l = e("famous/core/Modifier");
    o.prototype.parse = function(e) {
        this._contentAdded && this.clearContent(), this._surfaces = n(e.surfaces), this._modifiers = r(e.animations), this._attach(e.animations), this._contentAdded = !0
    }, o.prototype.getModifiers = function() {
        return this._modifiers
    }, o.prototype.clearContent = function() {
        s(this._node)
    }, o.getDefaultModifierOptions = function(e) {
        function t(t) {
            e[t] && void 0 !== e[t].initialValue && (i[t] = e[t].initialValue)
        }
        var i = {};
        return t("opacity"), t("transform"), t("size"), t("origin"), i
    }, o.prototype._attach = function(e) {
        var t = a(e, this._surfaces, this._modifiers);
        for (var i in t) {
            for (var o, s = 0; s < t[i].length; s++) {
                var n = t[i][s];
                o = this._node.add(n)
            }
            o.add(this._surfaces[i])
        }
    }, o.prototype.render = function() {
        return this._node.render.apply(this._node, arguments)
    }, i.exports = o
}), define("animation/builder/AnimationSequenceManager", ["require", "exports", "module", "famous/core/View", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/core/EventHandler", "./AnimationSequence", "./AnimationTree"], function(e, t, i) {
    function o(e) {
        this.parentSize = e || function() {
            return [window.innerWidth, window.innerHeight]
        }, this.sequences = [], this.sequencesCompleted = 0, this.totalSequences, this.trackCompleted = this._trackCompleted.bind(this), this._eventOutput = new s, s.setInputHandler(this, this._eventOutput), s.setOutputHandler(this, this._eventOutput)
    }
    var s = (e("famous/core/View"), e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("famous/core/EventHandler")), n = e("./AnimationSequence"), r = e("./AnimationTree");
    o.prototype.constructor = o, o.prototype.setNext = function(e, t) {
        if (this.halt(), e) {
            this._eventOutput.emit("sequence-start"), this.sequences = [], this.sequencesCompleted = 0, this.totalSequences = e.length;
            for (var i = 0; i < e.length; i++) {
                var o = e[i].target, s = new n(e[i], t[o], this.applySize.bind(this));
                this.sequences.push(s), s.pipe(this._eventOutput), s.on("sequence-completed", this.trackCompleted)
            }
        }
    }, o.prototype.applySize = function(e) {
        if (e instanceof Function) {
            var t = this.parentSize();
            return e(t[0], t[1])
        }
        return e
    }, o.prototype.initDefaults = function(e, t) {
        for (var i = 0; i < e.length; i++) {
            var o = (r.getDefaultModifierOptions(e[i]), t[e[i].target]);
            for (var s in e[i]) {
                var n = this.applySize(e[i][s].initialValue);
                "transform" == s ? o.setTransform(n) : "opacity" == s ? o.setOpacity(n) : "origin" == s ? o.setOrigin(n) : "size" == s && o.setSize(n)
            }
        }
    }, o.prototype._trackCompleted = function() {
        this.sequencesCompleted++, this.sequencesCompleted == this.totalSequences && this._eventOutput.emit("sequences-completed")
    }, o.prototype.halt = function() {
        for (var e = 0; e < this.sequences.length; e++)
            this.sequences[e].halt()
    }, i.exports = o
}), define("app/university/examples/ExamplesHelper", ["require", "exports", "module"], function(e, t, i) {
    var o = {};
    o.cleanId = function(e) {
        return e.replace(/\//g, "-").replace(".js", "")
    }, o.cleanTitle = function(e) {
        return e.substring(0, e.indexOf("-"))
    }, i.exports = o
}), define("mvc/Model", ["require", "exports", "module", "famous/core/OptionsManager", "famous/core/EventHandler"], function(e, t, i) {
    function o(e) {
        s.call(this, Object.create(this.constructor.DEFAULT_OPTIONS)), this.eventOutput = new n, this.eventOutput.bindThis(this), n.setOutputHandler(this, this.eventOutput), this.on("change", this._handleChange), this.id = o.ID++, e && this.setOptions(e)
    }
    var s = e("famous/core/OptionsManager"), n = e("famous/core/EventHandler");
    o.ID = 0, o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype._handleChange = function(e) {
        var t = "change:" + e.id;
        this.eventOutput.emit(t, e)
    }, o.prototype.toJSON = function() {
        return this.value()
    }, o.prototype.toString = function() {
        return JSON.stringify(this.value())
    }, o.DEFAULT_OPTIONS = {}, i.exports = o
}), define("app/university/models/CodeStatusModel", ["require", "exports", "module", "mvc/Model"], function(e, t, i) {
    function o() {
        s.apply(this, arguments)
    }
    var s = e("mvc/Model");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {runtimeStatus: "valid",errorMessage: "",code: ""}, o.prototype.setCode = function(e, t) {
        return e !== this.get("code") ? (this.set("code", e, t), this) : void 0
    }, o.prototype.getCode = function() {
        return this.get("code")
    }, i.exports = o
}), define("app/university/models/LessonModel", ["require", "exports", "module", "mvc/Model"], function(e, t, i) {
    function o() {
        s.apply(this, arguments)
    }
    var s = e("mvc/Model");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {defaultState: void 0,lessonInfo: {},steps: [],currentStep: void 0}, o.prototype.setStep = function(e) {
        var t = this.getLessonLength();
        e >= 0 && t > e && this.set("currentStep", e)
    }, o.prototype.nextStep = function() {
        var e = this.get("currentStep"), t = this.getLessonLength();
        e !== t - 1 && this.set("currentStep", e + 1)
    }, o.prototype.previousStep = function() {
        {
            var e = this.get("currentStep");
            this.getLessonLength()
        }
        0 !== e && this.set("currentStep", e - 1)
    }, o.prototype.getLessonLength = function() {
        return this.get("steps").length
    }, o.prototype.getStep = function() {
        var e = this.get("currentStep"), t = this.get("steps")[e];
        return t.index = e, t
    }, o.prototype.getCode = function() {
        return this.getStep().javascript
    }, o.prototype.getInstructions = function() {
        return this.getStep().instruction
    }, o.prototype.getLessonLength = function() {
        return this.get("steps").length
    }, o.prototype.getStep = function() {
        var e = this.get("currentStep"), t = this.get("steps")[e];
        return t.index = e, t
    }, o.prototype.getCode = function() {
        return this.getStep().javascript
    }, o.prototype.setCode = function(e) {
        var t = this.get("currentStep"), i = this.get("steps")[t];
        return i.javascript = e, this
    }, o.prototype.getInstructions = function() {
        return this.getStep().instruction
    }, o.prototype.getAppUrl = function() {
        return this.getStep().appUrl
    }, o.prototype.getState = function() {
        return this.getStep().state
    }, o.prototype.getDefaultState = function() {
        return this.get("defaultState")
    }, i.exports = o
}), define("app/university/views/SequenceManagedScene", ["require", "exports", "module", "scene/Scene", "famous/core/View", "famous/core/RenderNode", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "app/SceneTransitions", "app/SceneController", "events/EventHelpers", "events/Keybindings", "animation/builder/AnimationSequenceManager", "app/university/examples/ExamplesHelper", "app/university/views/ToolbarView", "app/university/views/LessonView", "app/university/views/EditorView", "app/university/views/Preview", "app/university/views/NextPreviousView", "app/university/states/UniversityStates", "app/university/models/CodeStatusModel", "app/university/models/LessonModel", "app/university/states/UniversityStates"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this._state, this._opacityMod = new r({opacity: 0}), this.mainNode = new n, this.add(this._opacityMod).add(this.mainNode), this.sequenceManager = new u(this.getSize.bind(this))
    }
    {
        var s = e("scene/Scene"), n = (e("famous/core/View"), e("famous/core/RenderNode")), r = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier")), a = (e("famous/core/Engine"), e("app/SceneTransitions")), u = (e("app/SceneController"), e("events/EventHelpers"), e("events/Keybindings"), e("animation/builder/AnimationSequenceManager"));
        e("app/university/examples/ExamplesHelper"), e("app/university/views/ToolbarView"), e("app/university/views/LessonView"), e("app/university/views/EditorView"), e("app/university/views/Preview"), e("app/university/views/NextPreviousView"), e("app/university/states/UniversityStates"), e("app/university/models/CodeStatusModel"), e("app/university/models/LessonModel"), e("app/university/states/UniversityStates")
    }
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype._isSizeInitialized = function() {
        return !!this.getSize()
    }, o.prototype._resizeAnimateState = function() {
        this._state && this.setState(this._state)
    }, o.prototype.fadeIn = function() {
        this._opacityMod.setOpacity(1, {curve: "linear",duration: 500})
    }, o.prototype.setState = function(e) {
        console.log("setting state", e), this._state = e, this._eventOutput.emit("state-change", this._state), this.sequenceManager.setNext(this.states[e], this.views)
    }, o.prototype.conditionalState = function(e) {
        console.log(e, this._state), this.setState(e[this._state])
    }, o.prototype.toggleState = function c(e, c) {
        this.setState(this._state == e ? c : e)
    }, o.prototype.activate = function(e) {
        a.fadeIn(e)
    }, o.prototype.deactivate = function(e) {
        this.removeAllEvents(), a.fadeOut(function(e) {
            this.destroy(), e()
        }.bind(this, e), this.options.transitionOut)
    }, i.exports = o
}), define("app/university/examples/ExamplesModel", ["require", "exports", "module", "mvc/Model"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.sync()
    }
    var s = e("mvc/Model");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {url: "/downloads/examples",baseFileName: "build-",version: "0.2.0",fileExtension: ".json",data: void 0,active: void 0}, o.prototype.setActive = function(e) {
        this.set("active", {course: e.course,version: e.version,submodule: e.submodule,name: e.name})
    }, o.prototype.getActive = function() {
        var e = this.get("data"), t = this.get("active");
        return e ? (console.log(e[t.submodule][t.course]), e[t.submodule][t.course][t.name]) : void 0
    }, o.prototype.sync = function() {
        $.ajax({url: [this.get("url"), this.get("baseFileName") + this.get("version") + this.get("fileExtension")].join("/"),success: function(e) {
                this.set("data", JSON.parse(e))
            }.bind(this),type: "GET"})
    }, i.exports = o
}), define("app/university/examples/ExampleStates", ["require", "exports", "module", "famous/core/Transform"], function(e, t, i) {
    var o = e("famous/core/Transform");
    i.exports = function() {
        var e = .38, t = 1 - e;
        return {twoPanel: [{target: "editor",size: {sequence: [{value: function(t, i) {
                                    return [t * e, i]
                                },transition: {curve: "outExpo",duration: 800}}]},transform: {sequence: [{value: o.translate(0, 0),transition: {curve: "outExpo",duration: 800}}]}}, {target: "preview",transform: {sequence: [{value: function(t) {
                                    return o.translate(t * e, 0)
                                },transition: {curve: "outExpo",duration: 800}}]},size: {sequence: [{value: function(e, i) {
                                    return console.log(e * t, i), [e * t, i]
                                },transition: {curve: "outExpo",duration: 800}}]}}]}
    }
}), define("widgets/ScrollviewCalcs", ["require", "exports", "module", "famous/utilities/Utility", "famous/views/Scrollview", "famous/core/Transform"], function(e, t, i) {
    function o(e) {
        this.scrollview = e, this.stats = {totalPercentage: 0,totalSize: [0, 0],startDistance: 0,endDistance: 0,currentIndex: 0,currentPosition: 0,totalPosition: 0,currentNodeSize: [0, 0]}, this._setScrollerCommit()
    }
    e("famous/utilities/Utility"), e("famous/views/Scrollview"), e("famous/core/Transform");
    o.prototype.fullCalc = function() {
        this._getCurrentIndex()._getCurrentLength()._getCurrentNodeSize()._getTotalAndStartSize()._getDistanceToEnd()._getPosition()._getTotalPosition()._getPercentage()
    }, o.prototype.lightCalc = function() {
        this._getPosition()._getTotalPosition()._getPercentage()
    }, o.prototype._getCurrentIndex = function() {
        return this.stats.currentIndex = this.scrollview._node.getIndex(), this
    }, o.prototype._getCurrentLength = function() {
        return this.stats.lastLength = this.scrollview._node._.array.length, this
    }, o.prototype._getCurrentNodeSize = function() {
        var e = this.scrollview._node.get();
        return e ? (this.stats.currentNodeSize = e.getSize(), this) : this
    }, o.prototype._getPosition = function() {
        return this.stats.currentPosition = this.scrollview.getPosition(), this
    }, o.prototype._getTotalPosition = function() {
        return this.stats.totalPosition = this.stats.startDistance + this.stats.currentPosition, this
    }, o.prototype._getTotalAndStartSize = function() {
        var e = this.scrollview._node;
        if (!e)
            return this;
        this.stats.totalSize[0] = 0, this.stats.totalSize[1] = 0;
        for (var t = 0; t < e._.array.length; t++) {
            var i = e._.array[t].getSize();
            i && (t == this.stats.currentIndex && (this.stats.startDistance = this.stats.totalSize[this.scrollview.options.direction]), i[0] && (this.stats.totalSize[0] += i[0]), i[1] && (this.stats.totalSize[1] += i[1]))
        }
        return this
    }, o.prototype._getDistanceToEnd = function() {
        var e = this.stats.currentNodeSize;
        return e ? (this.stats.endDistance = this.stats.totalSize[this.scrollview.options.direction] - this.stats.startDistance - this.stats.currentNodeSize[this.scrollview.options.direction], this) : this
    }, o.prototype._getPercentage = function() {
        return this.stats.totalPercentage = this.stats.totalPosition / this.stats.totalSize[this.scrollview.options.direction], this
    }, i.exports = o
}), define("widgets/ScrollbarView", ["require", "exports", "module", "famous/utilities/Utility", "famous/views/Scrollview", "famous/core/Surface", "famous/core/View", "famous/core/RenderNode", "famous/core/Modifier", "famous/core/Transform", "famous/core/Engine", "famous/core/ViewSequence", "famous/core/EventHandler", "famous/utilities/Timer", "famous/transitions/TransitionableTransform", "./ScrollviewCalcs", "famous/inputs/GenericSync", "famous/inputs/MouseSync", "famous/inputs/TouchSync", "events/EventHelpers"], function(e, t, i) {
    function o() {
        u.apply(this, arguments), this.scrollbar, this.scrollbarMod, this.scrollbarTransform, this.options.useScrollBackground && (this.scrollBgMod, this.scrollBg)
    }
    function s() {
        this.scrollBgMod = new c({transform: p.translate(0, 0, -.1)}), this.scrollBg = new a({properties: this.options.scrollBackgroundProperties,classes: this.options.scrollBackgroundClasses}), this.add(this.scrollBgMod).add(this.scrollBg)
    }
    function n() {
        this.scrollbar = new a({properties: this.options.scrollbarProperties,classes: this.options.scrollbarClasses}), this.scrollbarMod = new c({opacity: 1}), this.scrollbarTransform = new l, this.scrollbarMod.transformFrom(this.scrollbarTransform), this.options.moveWithMouse && r.call(this), this.add(this.scrollbarMod).add(this.scrollbar)
    }
    function r(e) {
        this.scrollbarSync = new h(e, {syncClasses: [d, f],direction: this.options.direction}), this.scrollbar.pipe(this.scrollbarSync), this.scrollbarSync.pipe(this._eventOutput)
    }
    {
        var a = (e("famous/utilities/Utility"), e("famous/views/Scrollview"), e("famous/core/Surface")), u = e("famous/core/View"), c = (e("famous/core/RenderNode"), e("famous/core/Modifier")), p = e("famous/core/Transform"), l = (e("famous/core/Engine"), e("famous/core/ViewSequence"), e("famous/core/EventHandler"), e("famous/utilities/Timer"), e("famous/transitions/TransitionableTransform")), h = (e("./ScrollviewCalcs"), e("famous/inputs/GenericSync")), d = e("famous/inputs/MouseSync"), f = e("famous/inputs/TouchSync");
        e("events/EventHelpers")
    }
    o.prototype = Object.create(u.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {scrollbarConstantSize: 15,scrollbarProperties: {backgroundColor: "#ffffff",borderRadius: "20px"},scrollbarClasses: ["scroll-bar"],padding: 5,useScrollBackground: !0,scrollBackgroundProperties: {borderLeft: "1px solid #777"},scrollBackgroundClasses: ["scroll-background"],moveWithMouse: !0}, o.prototype.getScrollbarViewSize = function() {
        return this.options.scrollbarConstantSize + 2 * this.options.padding
    }, o.prototype.init = function(e) {
        s.call(this), n.call(this), r.call(this, e)
    }, o.prototype._scaleScrollbarViewSync = function(e) {
        this.scrollbarSync.setOptions({scale: e})
    }, o.prototype.setBGSize = function(e) {
        this.scrollBg.setSize(e)
    }, o.prototype.setBGOrigin = function(e) {
        this.scrollBgMod.setOrigin(e)
    }, o.prototype.getSize = function() {
        return this.scrollBg.getSize()
    }, o.prototype.setScrollbarPosition = function(e) {
        return this.scrollbarTransform.setTranslate(e), this
    }, o.prototype.setScrollbarSize = function(e) {
        return this.scrollbar.setSize(e), this
    }, i.exports = o
}), define("widgets/Scrollbar", ["require", "exports", "module", "famous/utilities/Utility", "famous/views/Scrollview", "famous/core/Surface", "famous/core/RenderNode", "famous/core/Modifier", "famous/core/Transform", "famous/core/Engine", "famous/core/ViewSequence", "famous/core/EventHandler", "famous/utilities/Timer", "famous/transitions/TransitionableTransform", "famous/core/OptionsManager", "./ScrollviewCalcs", "./ScrollbarView", "famous/inputs/GenericSync", "famous/inputs/MouseSync", "famous/inputs/TouchSync", "events/EventHelpers"], function(e, t, i) {
    function o(e, t) {
        r.apply(this, arguments), this.scrollbarOptions = Object.create(this.constructor.DEFAULT_OPTIONS), this._scrollbarOptionsManager = new h(this.scrollbarOptions), t && this._scrollbarOptionsManager.setOptions(t), this._eventInput.bindThis(this), this.scrollbarNode = new a, this._isInit = !1, c.on("resize", l.debounce(this._handleResize.bind(this), 250))
    }
    function s() {
        return this.options.clipSize ? this.options.clipSize : _sizeForDir.call(this, this._contextSize)
    }
    var n = e("famous/utilities/Utility"), r = e("famous/views/Scrollview"), a = (e("famous/core/Surface"), e("famous/core/RenderNode")), u = (e("famous/core/Modifier"), e("famous/core/Transform")), c = e("famous/core/Engine"), p = e("famous/core/ViewSequence"), l = (e("famous/core/EventHandler"), e("famous/utilities/Timer")), h = (e("famous/transitions/TransitionableTransform"), e("famous/core/OptionsManager")), d = e("./ScrollviewCalcs"), f = e("./ScrollbarView"), m = (e("famous/inputs/GenericSync"), e("famous/inputs/MouseSync"), e("famous/inputs/TouchSync"), e("events/EventHelpers"));
    o.prototype = Object.create(r.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {scrollbarConstantSize: 15,scrollbarProperties: {backgroundColor: "#ffffff",borderRadius: "20px"},scrollbarClasses: ["scroll-bar"],padding: 5,useScrollBackground: !0,scrollBackgroundProperties: {borderLeft: "1px solid #777"},scrollBackgroundClasses: ["scroll-background"],isDraggable: !0}, o.prototype.sequenceFrom = function(e) {
        return e instanceof Array && (e = new p(e)), this._node = e, this._isInit || c.nextTick(this._initScrollbar.bind(this)), this._scroller.sequenceFrom(e)
    }, o.prototype.render = function() {
        var e = r.prototype.render.call(this);
        return this._isInit && (this._determineCalc(), this._updateScrollbar()), [this.scrollbarNode.render(), e]
    }, o.prototype._initScrollbar = function() {
        this.calcs = new d(this), this.calcs.fullCalc(), this.scrollbarView = new f(this.scrollbarOptions), this.scrollbarView.init(this.getPosition.bind(this)), this.scrollbarNode.add(this.scrollbarView), m.when(function() {
            var e = this.getContainerSize();
            return void 0 !== e[0] || void 0 !== e[1]
        }.bind(this), this._initialCalculations.bind(this))
    }, o.prototype._initialCalculations = function() {
        this._scrollbarEvents(), this._resetScrollbarBG(), this._resetScrollBGOrigin(), c.nextTick(this._updateScrollSyncScale.bind(this)), this._isInit = !0
    }, o.prototype._scrollbarEvents = function() {
        this.scrollbarView.on("update", this._handleUpdate.bind(this)), this.scrollbarView.on("end", this._handleEnd.bind(this))
    }, o.prototype._handleResize = function() {
        this._updateScrollbarSize(), this._updateScrollSyncScale(), this.scrollBg && this._resetScrollbarBG()
    }, o.prototype._handleUpdate = function(e) {
        this._physicsEngine.detachAll(), this._particle.setVelocity(0), this._eventInput.emit("update", {position: -e.position[this.options.direction],delta: -e.delta[this.options.direction],velocity: 0})
    }, o.prototype._handleEnd = function() {
        this.spring.setOptions(1 == this._scroller._onEdge || this.calcs.stats.totalPosition < 25 ? {anchor: [this._edgeSpringPosition, 0, 0],period: this.options.edgePeriod,dampingRatio: this.options.edgeDamp} : {anchor: [this._springPosition, 0, 0],period: this.options.edgePeriod,dampingRatio: this.options.edgeDamp}), this._physicsEngine.attach([this.spring], this._particle)
    }, o.prototype._determineCalc = function() {
        this.calcs.stats.currentIndex !== this._node.index || this._node._.array.length !== this.calcs.stats.lastLength ? this.calcs.fullCalc() : this.calcs.lightCalc()
    }, o.prototype.recalculate = function() {
        this.calcs.fullCalc(), this._updateScrollbar(), this._updateScrollbarSize(), this.scrollbarOptions.isDraggable && this._updateScrollSyncScale()
    }, o.prototype._getScrollbarSyncScale = function() {
        var e = this.getDirectionalSize(), t = this.calcs.stats.totalSize[this.options.direction], i = t / e;
        return i
    }, o.prototype.getScrollbarSize = function() {
        var e = this.getDirectionalSize(), t = this.calcs.stats.totalSize[this.options.direction], i = e * (e / t);
        return 0 == this.options.direction ? [i, this.scrollbarOptions.scrollbarConstantSize] : [this.scrollbarOptions.scrollbarConstantSize, i]
    }, o.prototype.getContainerSize = function() {
        var e = this.getSize();
        return void 0 == e[this.options.direction] && (e = this._scroller._contextSize), e
    }, o.prototype.getDirectionalSize = function() {
        var e = this.getContainerSize();
        return e[this.options.direction]
    }, o.prototype.getScrollbarPosition = function() {
        var e = this.getContainerSize(), t = e[this.options.direction], i = this.calcs.stats.totalPercentage * t;
        if (this.options.direction == n.Direction.X) {
            var o = this.getSize()[1];
            return o = o ? o : e[1] - this.scrollbarView.getScrollbarViewSize() + this.scrollbarOptions.padding, [i, o]
        }
        var s = this.getSize()[0];
        return s = s ? s : e[0] - this.scrollbarView.getScrollbarViewSize() + this.scrollbarOptions.padding, [s, i]
    }, o.prototype._resetScrollbarBG = function() {
        var e = this.scrollbarView.getScrollbarViewSize();
        e = this.options.direction == n.Direction.X ? [void 0, e] : [e, void 0], this.scrollbarView.setBGSize(e)
    }, o.prototype._resetScrollBGOrigin = function() {
        var e = this.options.direction == n.Direction.X ? [0, 1] : [1, 0];
        this.scrollbarView.setBGOrigin(e)
    }, o.prototype._updateScrollbarSize = function() {
        this.scrollbarView.setScrollbarSize(this.getScrollbarSize())
    }, o.prototype._updateScrollbar = function() {
        this.scrollbarView.setScrollbarPosition(this.getScrollbarPosition())
    }, o.prototype._updateScrollSyncScale = function() {
        this.scrollbarView._scaleScrollbarViewSync(this._getScrollbarSyncScale())
    }, d.prototype._setScrollerCommit = function() {
        this.scrollview._scroller.commit = function(e) {
            var t = e.transform, i = e.opacity, o = e.origin, r = e.size;
            this._contextSize = r, this.options.clipSize || r[0] === this._contextSize[0] && r[1] === this._contextSize[1] || (this._onEdge = 0, this.options.direction === n.Direction.X ? (this._size[0] = s.call(this), this._size[1] = void 0) : (this._size[0] = void 0, this._size[1] = s.call(this)));
            var a = this._masterOutputFunction(-this._position);
            return {transform: u.multiply(t, a),opacity: i,size: r,origin: o,target: this.group.render()}
        }.bind(this.scrollview._scroller)
    }, i.exports = o
}), define("lib/text!app/university/examples/ExamplesTemplate", [], function() {
    return '<a class="col1 pad20 centered" href="/examples/{{ version }}/{{ submodule }}/{{ class }}/{{ rawName }}">{{ name }}</a>\n'
}), define("expanding/ExpandingSurface", ["require", "exports", "module", "famous/core/Surface", "famous/core/Engine"], function(e, t, i) {
    function o() {
        this._resizeDirty = !0, this._checkHeight = s.bind(this), this._setSizeFunction = o.DEFAULT_SET_SIZE_FUNCTION, r.on("postrender", this._checkHeight), n.apply(this, arguments)
    }
    function s() {
        if (this._resizeDirty && this._currTarget) {
            var e = this._setSizeFunction.call(this, this._currTarget);
            this.setSize(e), this.emit("resize", e), this._resizeDirty = !1, r.removeListener("postrender", this._checkHeight)
        }
    }
    var n = e("famous/core/Surface"), r = e("famous/core/Engine");
    o.DEFAULT_SET_SIZE_FUNCTION = function(e) {
        return [this._size[0], e.firstChild.clientHeight]
    }, o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.prototype.setSetSizeFn = function(e) {
        this._setSizeFunction = e
    }, o.prototype.setDirty = function() {
        this._resizeDirty = !0, r.on("postrender", this._checkHeight)
    }, o.prototype.setWidth = function(e) {
        var t = this._size ? this._size[1] : void 0;
        this.setSize([e, t]), this.setDirty()
    }, o.prototype.setContent = function(e) {
        this.content != e && (this.content = e, this._contentDirty = !0, this.setDirty())
    }, i.exports = o
}), define("scene/SizeAwareView", ["require", "exports", "module", "famous/core/View", "famous/core/Entity", "famous/core/Transform"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.__id = n.register(this)
    }
    var s = e("famous/core/View"), n = e("famous/core/Entity"), r = e("famous/core/Transform");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.commit = function(e) {
        var t = e.transform, i = e.opacity, o = e.origin;
        this.__size && this.__size[0] === e.size[0] && this.__size[1] === e.size[1] || (this.__size = e.size, this._eventOutput.emit("resize", this.__size)), this.__size && (t = r.moveThen([-this.__size[0] * o[0], -this.__size[1] * o[1], 0], t));
        var s = {transform: t,opacity: i,size: this.__size,target: this._node.render()};
        return s
    }, o.prototype.getSize = function() {
        return this.__size
    }, o.prototype.render = function() {
        return this.__id
    }, i.exports = o
}), define("expanding/ExpandingScrollview", ["require", "exports", "module", "famous/views/Scrollview", "widgets/Scrollbar", "./ExpandingSurface", "famous/core/Engine", "scene/SizeAwareView"], function(e, t, i) {
    function o(e, t, i) {
        a.apply(this, arguments), this.scrollview = new s(t || o.DEFAULT_SCROLL_OPTS, i || o.DEFAULT_SCROLLBAR_OPTS), this._items = [], e instanceof Array ? this._itemsToData(e) : this._contentToSurface(e), this.scrollview.sequenceFrom(this._items), this.add(this.scrollview), this.on("resize", function() {
            this.scrollview.recalculate()
        }.bind(this))
    }
    var s = (e("famous/views/Scrollview"), e("widgets/Scrollbar")), n = e("./ExpandingSurface"), r = e("famous/core/Engine"), a = e("scene/SizeAwareView");
    o.prototype = Object.create(a.prototype), o.prototype.constructor = o, o.DEFAULT_SCROLL_OPTS = {margin: 1e4,edgeGrip: .1,edgeDamp: .9,edgePeriod: 500}, o.DEFAULT_SCROLLBAR_OPTS = {scrollbarConstantSize: 5,padding: 2,scrollbarProperties: {backgroundColor: "#404040",borderRadius: "3px"},scrollBackgroundProperties: {borderLeft: "1px solid #777",borderRight: "1px solid #777"}}, o.prototype._itemsToData = function(e) {
        for (var t = 0; t < e.length; t++)
            "string" == typeof e[t] || e[t] instanceof HTMLElement ? this._contentToSurface(e[t]) : (this._items.push(e[t]), e[t].pipe && e[t].pipe(this.scrollview))
    }, o.prototype._contentToSurface = function(e) {
        var t = new n({content: e});
        this._items.push(t), t.pipe(this.scrollview), t.on("resize", function() {
            r.nextTick(function() {
                this.scrollview.recalculate()
            }.bind(this))
        }.bind(this))
    }, o.prototype.getItem = function(e) {
        return this._items[e]
    }, o.prototype.setWidth = function(e) {
        for (var t = 0; t < this._items.length; t++) {
            if (this.scrollview.getScrollbarSize) {
                var i = this.scrollview.scrollbarOptions.scrollbarConstantSize + 2 * this.scrollview.scrollbarOptions.padding;
                e -= i
            }
            this._items[t].setWidth && this._items[t].setWidth(e)
        }
    }, i.exports = o
}), define("app/university/examples/ExamplesScene", ["require", "exports", "module", "scene/Scene", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "widgets/Scrollbar", "app/SceneTransitions", "app/SceneController", "app/Router", "app/university/examples/ExamplesHelper", "./ExamplesModel", "lib/text!./ExamplesTemplate", "expanding/ExpandingScrollview"], function(e, t, i) {
    function o() {
        r.apply(this, arguments), this.examples = [], this.scrollview, this.examplesModel = new p, s.call(this)
    }
    function s() {
        this.addEvent(this.examplesModel.on, "change:data", this._generateHTML.bind(this), this.examplesModel.removeListener).addEvent(this.on, "resize", this._resizeScroll, this._eventOutput.removeListener.bind(this._eventOutput))
    }
    function n(e) {
        var t = e.instruction.indexOf("\n"), i = e.instruction.indexOf("-"), o = i > t ? t : i;
        return e.instruction.substring(0, o)
    }
    var r = e("scene/Scene"), a = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier")), u = (e("famous/core/Engine"), e("widgets/Scrollbar"), e("app/SceneTransitions")), c = (e("app/SceneController"), e("app/Router")), p = (e("app/university/examples/ExamplesHelper"), e("./ExamplesModel")), l = e("lib/text!./ExamplesTemplate"), h = e("expanding/ExpandingScrollview");
    o.prototype = Object.create(r.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {transitionOut: {curve: "inOutExpo",duration: 250}}, o.prototype._resizeScroll = function() {
        this.expandableScroll && (this.expandableScroll.setWidth(this.getSize()[0]), this.expandableScroll.scrollview.setOptions({clipSize: this.getSize()[1]}))
    }, o.prototype._generateHTML = function(e) {
        if (!i) {
            var t = Handlebars.compile(l), i = '<div class="col1">', o = this.examplesModel.get("version");
            if (!e || !e.value)
                return;
            for (var s in e.value) {
                var r = e.value[s];
                i += '<h3 class="centered col1 pad20">' + s + "</h3>";
                for (var a in r) {
                    var u = r[a];
                    for (var c in u)
                        i += t({version: o,submodule: s,"class": a,rawName: u[c].name,name: n(u[c])})
                }
            }
            i += "</div>"
        }
        this.initScrollview(i)
    }, o.prototype.initScrollview = function(e) {
        this.expandableScroll = new h(e), this.surface = this.expandableScroll.getItem(0), this.surface.setSetSizeFn(function(e) {
            return [this._size[0], e.children[0].clientHeight]
        }), c.registerLink(this.surface), this.mod = new a, this.add(this.mod).add(this.expandableScroll)
    }, o.prototype.activate = function(e) {
        u.fadeIn(e)
    }, o.prototype.deactivate = function(e) {
        this.removeAllEvents(), u.fadeOut(e, this.options.transitionOut)
    }, i.exports = o
}), define("app/university/examples/ExampleScene", ["require", "exports", "module", "famous/core/RenderNode", "famous/core/Transform", "famous/core/Modifier", "app/SceneTransitions", "app/SceneController", "events/EventHelpers", "events/Keybindings", "app/university/views/ToolbarView", "app/university/views/LessonView", "app/university/views/EditorView", "app/university/views/Preview", "app/university/views/NextPreviousView", "app/university/states/UniversityStates", "app/university/views/SequenceManagedScene", "app/university/models/CodeStatusModel", "app/university/models/LessonModel", "app/university/states/UniversityStates", "./ExamplesModel", "./ExampleStates", "./ExamplesScene"], function(e, t, i) {
    function o(e, t) {
        c.apply(this, arguments), this.fadeIn(), this.keybindings = new r, window.s = this, this.toolbarView, this.editorView, this.preview, this.views, this._dataLoaded = !1, this.states = h(), this._initModels(), this._initViews(), s.call(this), n.when([this._isSizeInitialized.bind(this), this._dataInitialized.bind(this)], this.setState.bind(this, this.options.defaultState)), this._parseSetFromRouter(t)
    }
    function s() {
        this.addEvent(this._eventInput.on.bind(this._eventInput), "set", this._parseSetFromRouter, this._eventInput.removeListener.bind(this._eventInput)).addEvent(this.on, "resize", this._resizeAnimateState, this._eventOutput.removeListener.bind(this._eventOutput)).addEvent(this.models.example.on, "change:data", this._updateExampleData, this.models.example.removeListener).addEvent(this.models.example.on, "change:active", this._updateActiveExample, this.models.example.removeListener)
    }
    {
        var n = (e("famous/core/RenderNode"), e("famous/core/Transform"), e("famous/core/Modifier"), e("app/SceneTransitions"), e("app/SceneController"), e("events/EventHelpers")), r = e("events/Keybindings"), a = (e("app/university/views/ToolbarView"), e("app/university/views/LessonView"), e("app/university/views/EditorView")), u = e("app/university/views/Preview"), c = (e("app/university/views/NextPreviousView"), e("app/university/states/UniversityStates"), e("app/university/views/SequenceManagedScene")), p = e("app/university/models/CodeStatusModel"), l = (e("app/university/models/LessonModel"), e("app/university/states/UniversityStates"), e("./ExamplesModel")), h = e("./ExampleStates");
        e("./ExamplesScene")
    }
    o.prototype = Object.create(c.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {defaultState: "twoPanel",allStates: ["onePanel", "twoPanel", "threePanel"],transitionOut: {curve: "inOutExpo",duration: 250}}, o.prototype._initModels = function() {
        this.models = {code: new p,example: new l}
    }, o.prototype._initViews = function() {
        this.editorView = new a({}, this.models), this.preview = new u({}, this.models), this.mainNode.add(this.editorView), this.mainNode.add(this.preview), this.views = {editor: this.editorView.getModifier(),preview: this.preview.getModifier()}
    }, o.prototype._updateExampleData = function() {
        this._dataLoaded = !0, this._updateActiveExample()
    }, o.prototype._dataInitialized = function() {
        return this._dataLoaded
    }, o.prototype._updateActiveExample = function() {
        var e = this.models.example.getActive();
        e && (this.models.code.setCode(e.javascript), this.editorView.setCode(e.javascript))
    }, o.prototype._parseSetFromRouter = function(e) {
        this.models.example.setActive(e)
    }, i.exports = o
}), define("app/university/views/RefreshView", ["require", "exports", "module", "animation/builder/AnimatedView", "famous/core/Surface", "famous/surfaces/ImageSurface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "widgets/ButtonView", "widgets/ProgressBar"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), this.init()
    }
    {
        var s = e("animation/builder/AnimatedView"), n = (e("famous/core/Surface"), e("famous/surfaces/ImageSurface"));
        e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("widgets/ButtonView"), e("widgets/ProgressBar")
    }
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype.init = function() {
        var e = new n({content: "/images/refresh.svg",size: [30, 30],properties: {width: "100%",cursor: "pointer"}});
        this.add(e), e.on("click", function() {
            this._eventOutput.emit("refresh")
        }.bind(this))
    }, i.exports = o
}), define("app/university/home/CurriculumData", ["require", "exports", "module"], function(e, t, i) {
    i.exports = {intro: {title: "FAMO.US UNIVERSITY",desc: "If this is your first time to Famo.us, then Famo.us University is an excellent way to start.  Famo.us University includes live coding lessons, tutorials, and discrete examples tied to our reference documentation.  In Famo.us University, each lesson lets you live code in Famo.us and immediately see the rendered results without installing anything.  Learn, play, and code to see what it’s like to be Famo.us.",lessons: [{index: "Introduction",title: "Hello Famo.us",desc: "We will start with a quick overview of the features of Famo.us University and then rebuild an example app. You'll get to experience firsthand what it's like to build in Famo.us.",url: "/university/hello-famous",image: "../images/fuicons/hello.svg",time: "15 min"}]},courses: [{active: !0,title: "Famo.us 101",desc: "Learn the fundamental concepts and building blocks of Famo.us",lessons: [{index: "Lesson 1",title: "Displaying Content",desc: "In this lesson, you will learn how to display and style content in Famo.us using JavaScript, HTML, and CSS. We will go over some general best practices and what to avoid in Famo.us.",url: "/university/famous-101/displaying",image: "../images/fuicons/displaying.svg",time: "15 min",active: !0}, {index: "Lesson 2",title: "Positioning Elements",desc: "You will learn how to position elements in Famo.us. We will dive into how the Famo.us layout engine works by introducing the Famo.us render tree, state modifiers, and transform functions.",url: "/university/famous-101/positioning",image: "../images/fuicons/positioning.svg",time: "20 min",active: !0}, {index: "Lesson 3",title: "Creating Animations",desc: "Now that you know how to display and position elements in Famo.us, let's get to the fun stuff--animations! You will practice using various easing curves as well as physics transitions.",url: "/university/famous-101/animating",image: "../images/fuicons/animating.svg",time: "15 min",active: !0}, {index: "Lesson 4",title: "Handling Events",desc: "This lessons covers how to emit, transmit, and listen for events in Famo.us. You will learn how to connect components following best practices to write clean modularized code.",url: "/university/famous-101/eventing",image: "../images/fuicons/eventing.svg",time: "25 min",active: !0}, {index: "Project",title: "Timbre Menu Part 1",desc: "Put the pieces together and assemble your first Famo.us app! We'll walk through an end-to-end tutorial that utilizes what you've learned so far and introduces some new concepts.",image: "../images/fuicons/timbre.jpg",time: "1 hr",active: !1}]}, {title: "Famo.us Physics",desc: "Apply forces and constraints to create a living app",lessons: [{index: "Lesson 1",title: "Particles",desc: "In this lesson we introduce a physics modifier called a particle that provides a translation based on a velocity and other physical properties like mass.",image: "../images/fuicons/coming.svg",time: "10 min"}, {index: "Lesson 2",title: "Forces and Constraints",desc: "In this lesson we introduce physics agents that apply to particles. You'll learn how to give a particle a spring like motion, or have particles collide. You'll also be introduced to the Physics Engine, which mediates particles and agents.",image: "../images/fuicons/coming.svg",time: "20 min"}, {index: "Lesson 3",title: "Forces and Constraints - Advanced",desc: "In this lesson we introduce each force and constraint in depth and how they affect particles.",image: "../images/fuicons/coming.svg",time: "30 min"}, {index: "Lesson 4",title: "Bodies",desc: "In this lesson we introduce geometric concepts. Particles are zero-dimensional points that can only translate. Bodies, on the other hand, can also rotate. At the end of this tutorial you'll be able to create the TorqueButton demo.",image: "../images/fuicons/coming.svg",time: "20 min"}]}],examples: {}}
}), define("lib/text!app/university/templates/ModalTemplate", [], function() {
    return '<h2 style="line-height:40px;margin-top: 14px;background-color:#fa5c4f;color:white;font-size:21px;margin-bottom:19px">LESSON COMPLETE</h2>\n<p style="font-size:32px;margin-bottom:20px"> {{title}} </p>\n<img style="border-radius:8px;" src="{{image}}" width="200px" />\n</br>\n<div width=200px style="padding-left:7px">\n	<a href="https://twitter.com/share" class="twitter-share-button" data-text="I just finished the {{title}} lesson in Famo.us University. Start learning here:" data-lang="en" data-url="http://famo.us">Tweet</a>\n	<iframe src="http://ghbtns.com/github-btn.html?user=famous&repo=famous&type=watch&count=true" height="21px" width="100" frameborder="0" scrolling="0" style="width:100px; height: 21px;" allowTransparency="true"></iframe>\n</div>\n<input id="close" class="red-bg centered pointer" value="Close" style="margin-top:5px; margin-bottom: 47px; width:200px" readonly>\n'
}), define("social/Twitter", ["require", "exports", "module"], function(e, t, i) {
    i.exports = {create: function() {
            !function(e, t, i) {
                var o, s = e.getElementsByTagName(t)[0], n = /^http:/.test(e.location) ? "http" : "https";
                e.getElementById(i) || (o = e.createElement(t), o.id = i, o.src = n + "://platform.twitter.com/widgets.js", s.parentNode.insertBefore(o, s))
            }(document, "script", "twitter-wjs")
        },reload: function() {
            twttr.widgets.load()
        }}
}), define("app/university/views/ModalView", ["require", "exports", "module", "famous/core/View", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/core/RenderNode", "widgets/Flip", "famous/transitions/Transitionable", "famous/core/Engine", "famous/transitions/Easing", "widgets/ButtonView", "app/university/home/CurriculumData", "lib/text!../templates/ModalTemplate", "social/Twitter"], function(e, t, i) {
    function o(e, t) {
        s.apply(this, arguments), this.model = t
    }
    var s = e("famous/core/View"), n = e("famous/core/Surface"), r = (e("famous/core/Transform"), e("famous/core/Modifier")), a = (e("famous/core/Engine"), e("famous/core/RenderNode"), e("widgets/Flip"), e("famous/transitions/Transitionable"), e("famous/core/Engine"), e("famous/transitions/Easing"), e("widgets/ButtonView"), e("app/university/home/CurriculumData"), e("lib/text!../templates/ModalTemplate")), u = e("social/Twitter");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.create = function() {
        var e = this.model.get("lessonInfo"), t = e.image || "/images/fuicons/hello.svg", i = e.lessonTitle.toUpperCase(), o = Handlebars.compile(a), o = o({title: i,image: t});
        this.modalSurface = new n({size: [335, !0],content: o,properties: {textAlign: "center",backgroundColor: "rgb(246, 246, 246)",zIndex: 800,borderRadius: "4px"}}), this.modalMod = new r({origin: [.5, .5],size: [335, 445]});
        var s = this.add(this.modalMod);
        s.add(this.modalSurface), this.modalSurface.on("deploy", this.initTwitter.bind(this))
    }, o.prototype.initTwitter = function() {
        u.create()
    }, i.exports = o
}), define("app/university/views/LessonEndView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "famous/views/RenderController", "famous/core/RenderNode", "famous/transitions/Easing", "app/university/views/ModalView", "famous/utilities/Timer"], function(e, t, i) {
    function o(e, t) {
        c.apply(this), this.model = t, s.call(this), n.call(this), this.hide(this._node)
    }
    function s() {
        var e = new r({properties: {backgroundColor: "black",zIndex: 799}});
        this.opacityMod = new u({opacity: 0}), this.add(this.opacityMod).add(e)
    }
    function n() {
        this.modal = new l({}, this.model), this.modalMod = new u({origin: [.5, .5],transform: a.scale(0, 0)}), this.add(this.modalMod).add(this.modal)
    }
    {
        var r = e("famous/core/Surface"), a = e("famous/core/Transform"), u = e("famous/core/Modifier"), c = (e("famous/core/Engine"), e("famous/views/RenderController")), p = (e("famous/core/RenderNode"), e("famous/transitions/Easing")), l = e("app/university/views/ModalView");
        e("famous/utilities/Timer")
    }
    o.prototype = Object.create(c.prototype), o.prototype.constructor = o, o.prototype.activateModal = function() {
        this.show(this._node), this.bindEvents(), this.opacityMod.setOpacity(.5, {duration: 300}, this.dropModal.bind(this))
    }, o.prototype.deactivateModal = function() {
        this.hide({duration: "10"}), this.modal.modalSurface.removeListener("click", function(e) {
            "close" == e.target.id && this.deactivateModal()
        })
    }, o.prototype.initModal = function() {
        this.modal.create()
    }, o.prototype.dropModal = function() {
        this.modalMod.setTransform(a.scale(1, 1), {duration: 700,curve: p.outBounce})
    }, o.prototype.bindEvents = function() {
        this.modal.modalSurface.on("click", function(e) {
            "close" == e.target.id && this.deactivateModal()
        }.bind(this))
    }, i.exports = o
}), define("app/university/views/AppLoadView", ["require", "exports", "module", "animation/builder/AnimatedView", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "widgets/IframeSurface"], function(e, t, i) {
    function o(e, t) {
        n.apply(this, arguments), this.models = t, this.iframe, s.call(this), this.updateApp = this._updateApp.bind(this), this.events()
    }
    function s() {
        this.iframe = new r({properties: {backgroundColor: "#404040"}}), this.add(this.iframe)
    }
    var n = e("animation/builder/AnimatedView"), r = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("widgets/IframeSurface"));
    o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {}, o.prototype.events = function() {
        this.models.lesson.on("change:currentStep", this.updateApp)
    }, o.prototype.unbindEvents = function() {
        this.preview.reset(), this.models.lesson.removeListener("change:currentStep", this.updateApp)
    }, o.prototype._updateApp = function() {
        var e = this.models.lesson.getAppUrl();
        this.iframe.setContent("undefined" !== e && "" !== e ? e : "about:blank")
    }, i.exports = o
}), define("app/university/university/UniversityScene", ["require", "exports", "module", "scene/Scene", "famous/core/View", "famous/core/RenderNode", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "app/SceneTransitions", "app/SceneController", "events/EventHelpers", "app/accounts/Accounts", "analytics/Analytics", "events/Keybindings", "animation/builder/AnimationSequenceManager", "app/university/views/ToolbarView", "app/university/views/LessonView", "app/university/views/EditorView", "app/university/views/Preview", "app/university/views/NextPreviousView", "app/university/views/RefreshView", "app/university/views/LessonEndView", "app/university/views/AppLoadView", "app/university/views/SequenceManagedScene", "app/university/models/CodeStatusModel", "app/university/models/LessonModel", "app/university/states/UniversityStates", "app/Router"], function(e, t, i) {
    function o(e, t) {
        y.apply(this, arguments), document.body.style.backgroundColor = "#F2F2F0", this.keybindings = new c, s.call(this), this._parseRouteToModels(t), this.toolbarView, this.editorView, this.lessonView, this.preview, this.nextPrev, this.views, n.call(this), this.events()
    }
    function s() {
        this.models = {code: new S,lesson: new w}
    }
    function n() {
        this.toolbarView = new p({}, this.models), this.editorView = new h({}, this.models), this.lessonView = new l({}, this.models.lesson), this.preview = new d({}, this.models), this.nextPrev = new f({}, this.models), this.refresh = new m, this.lessonEndView = new v({}, this.models.lesson), this.app = new g({}, this.models), this.mainNode.add(this.editorView), this.mainNode.add(this.toolbarView), this.mainNode.add(this.lessonView), this.mainNode.add(this.preview), this.mainNode.add(this.nextPrev), this.mainNode.add(this.refresh), this.mainNode.add(this.lessonEndView), this.mainNode.add(this.app), this.views = {toolbar: this.toolbarView.getModifier(),editor: this.editorView.getModifier(),lesson: this.lessonView.getModifier(),preview: this.preview.getModifier(),nextPrev: this.nextPrev.getModifier(),refresh: this.refresh.getModifier(),app: this.app.getModifier()}, this.lessonView.getModifier().setSize([1, 1])
    }
    var r = (e("scene/Scene"), e("famous/core/View"), e("famous/core/RenderNode"), e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine")), a = (e("app/SceneTransitions"), e("app/SceneController"), e("events/EventHelpers")), u = (e("app/accounts/Accounts"), e("analytics/Analytics")), c = e("events/Keybindings"), p = (e("animation/builder/AnimationSequenceManager"), e("app/university/views/ToolbarView")), l = e("app/university/views/LessonView"), h = e("app/university/views/EditorView"), d = e("app/university/views/Preview"), f = e("app/university/views/NextPreviousView"), m = e("app/university/views/RefreshView"), v = e("app/university/views/LessonEndView"), g = e("app/university/views/AppLoadView"), y = e("app/university/views/SequenceManagedScene"), S = e("app/university/models/CodeStatusModel"), w = e("app/university/models/LessonModel"), _ = e("app/university/states/UniversityStates"), b = e("app/Router");
    o.prototype = Object.create(y.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {downloadPrefix: "/downloads/university-data3/",downloadPostfix: ".json",defaultState: "threePanel",allStates: ["onePanel", "twoPanel", "threePanel", "horizontal", "textPreview", "textApp"],transitionOut: {curve: "inOutExpo",duration: 250}}, o.prototype._parseRouteToModels = function(e) {
        this.courseAndLessonUrl = e.route.splice(1, 2).join("/"), e.step ? this.step = e.step - 1 : (r.nextTick(b.replaceState.bind(b, "/university/" + this.courseAndLessonUrl + "/1/")), this.step = 0);
        var t = this.courseAndLessonUrl, i = this.options.downloadPrefix + t + this.options.downloadPostfix;
        $.ajax({type: "GET",url: i,success: this._setLessonData.bind(this),error: function(e) {
                console.log("lesson data error:", e)
            }})
    }, o.prototype.initDefaultState = function() {
        this.states = _({SHOW_NEXT_PREV: this.models.lesson.getLessonLength() > 1}), this.fadeIn()
    }, o.prototype.events = function() {
        return this.addEvent(this.toolbarView.on, "toggleLesson", this.conditionalState.bind(this, {onePanel: "threePanel",twoPanel: "threePanel",threePanel: "twoPanel"}), this.toolbarView.removeListener, !0).addEvent(this.toolbarView.on, "toggleFull", this.toggleState.bind(this, "onePanel", "twoPanel"), this.toolbarView.removeListener, !0).addEvent(this.models.lesson.on, "change:currentStep", this._updateCodeFromLesson, this.models.lesson.removeListener.bind(this.models.lesson)).addEvent(this.refresh.on, "refresh", this.runCode, this.refresh.removeListener).addEvent(this.nextPrev.on, "complete", this.completeLesson, this.nextPrev.removeListener).addEvent(this.nextPrev.on, "updateUrl", this.updateUrl, this.nextPrev.removeListener).addEvent(this._eventInput.on.bind(this._eventInput), "set", this._updateStep, this._eventInput.removeListener.bind(this._eventInput)).addEvent(this.on, "resize", this._resizeAnimateState, this._eventOutput.removeListener.bind(this._eventOutput)).addEvent(this.on, "state-change", this.toolbarView.stateListener.bind(this.toolbarView), this._eventOutput.removeListener.bind(this._eventOutput), !0), this.addEventFn(this.keybindings.unbindEvents.bind(this.keybindings), this.preview.unbindEvents.bind(this.preview), this.lessonView.unbindEvents.bind(this.lessonView), this.editorView.unbindEvents.bind(this.editorView)), this.sequenceManager.pipe(this.nextPrev), this
    }, o.prototype.completeLesson = function() {
        this.lessonEndView.activateModal()
    }, o.prototype._setLessonData = function(e) {
        this.initDefaultState(), e = JSON.parse(e), this.models.lesson.setOptions(e), this.models.lesson.set("currentStep", this.step), this.lessonEndView.initModal(), this.initDefaultState(), a.when(this._isSizeInitialized.bind(this), this._setFirstState.bind(this, e))
    }, o.prototype._setFirstState = function(e) {
        this.setState(e.defaultState ? e.defaultState : this.options.defaultState)
    }, o.prototype.runCode = function() {
        var e = this.models.code.getCode();
        this.preview.runCode(e)
    }, o.prototype._updateCodeFromLesson = function() {
        this._logAnalytics(this.models.lesson.getStep());
        var e = this.models.lesson.getCode();
        this.editorView.setCode(e);
        var t = this.models.lesson.getState();
        t && this.setState(t)
    }, o.prototype._logAnalytics = function(e) {
        e && u.track(window.location.pathname, {lessonName: e.name,index: e.index})
    }, o.prototype.updateUrl = function(e) {
        b.pushState("/university/" + this.courseAndLessonUrl + "/" + e + "/")
    }, o.prototype._updateStep = function(e) {
        this.models.lesson.setStep(e.step - 1)
    }, i.exports = o
}), define("grids/FixedGrid", ["require", "exports", "module"], function(e, t, i) {
    function o(e) {
        s.call(this, e)
    }
    function s(e) {
        this.options = {}, this.options.margin = 50, this.options.colGutter = .025 * window.innerWidth, this.options.baseline = 16;
        for (var t in e)
            this.options[t] = e[t]
    }
    o.prototype.getGrid = function() {
        return this.options.margin = 50, this.options.colGutter = .025 * window.innerWidth, this.options.contentWidth = window.innerWidth - 2 * this.options.margin, this.options.colWidth = (this.options.contentWidth - (this.options.numCols - 1) * this.options.colGutter) / this.options.numCols, this.options.tabWidth = this.options.colWidth + this.options.colGutter, this.options
    }, i.exports = o
}), define("grids/FlexGrid", ["require", "exports", "module"], function(e, t, i) {
    function o(e) {
        this.options = {}, this.options.margin = .025 * window.innerWidth, this.options.minColGutter = 40, this.options.baseline = 16;
        for (var t in e)
            this.options[t] = e[t];
        this.options.elementSize = this.options.elementGridUnits * this.options.baseline
    }
    o.prototype.getGrid = function() {
        function e() {
            this.options.colGutter = (this.options.contentWidth - this.options.elementSize) / (this.options.numCols - 1) - this.options.elementSize
        }
        for (this.options.margin = .025 * window.innerWidth, this.options.contentWidth = window.innerWidth - 2 * this.options.margin, this.options.numCols = this.options.maxCols, e.call(this); this.options.colGutter < this.options.minColGutter && (this.options.numCols--, !(this.options.numCols < 2)); )
            e.call(this);
        return this.options.xSpacing = this.options.elementSize + this.options.colGutter, this.options.ySpacing = this.options.elementSize + 2 * this.options.baseline, this.options
    }, i.exports = o
}), define("app/university/home/views/LessonInfoView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/core/RenderNode", "grids/FixedGrid", "app/Router", "helpers/WebUtilities"], function(e, t, i) {
    function o() {
        h.apply(this, arguments), s.call(this), n.call(this), r.call(this), a.call(this), u.call(this), this.resize(!1)
    }
    function s() {
        this.gridOptions = this.options.grid.getGrid(), this.options.width = this.gridOptions.numCols / 2, this.options.descWidth = this.options.fixedWidth ? this.options.fixedWidth - (this.options.imgWidth + 3) * this.gridOptions.baseline : (this.options.width - 2) * this.gridOptions.tabWidth + this.gridOptions.colGutter, this.options.aTag = this.options.lessonData.url ? '<a href="' + this.options.lessonData.url + '">' : "", this.tabMod = new p({origin: [0, 0],transform: l.translate((this.options.imgWidth + 2) * this.gridOptions.baseline, 0, 0)}), this.tabNode = this._add(this.tabMod)
    }
    function n() {
        var e = this.options.imgWidth * this.gridOptions.baseline, t = this.options.lessonData.image ? this.options.lessonData.image : this.options.githubImagePath, i = new c({size: [e, e],content: this.options.aTag + '<img src="' + t + '" width="' + e + '"></a>',properties: {borderRadius: this.options.imgRadius,overflow: "hidden"}}), o = new p({origin: [0, 0]});
        this._add(o).add(i), d.registerLink(i), f.isFirefox() && i.on("click", f.registerSurfaceLink)
    }
    function r() {
        var e = this.options.lessonData.index ? '<span class="lesson-info-index">' + this.options.lessonData.index + "</span>" : "";
        this.title = new c({size: [this.options.descWidth, 2 * this.gridOptions.baseline],content: this.options.aTag + e + this.options.lessonData.title + "</a>",classes: ["h1"],properties: {color: "#FA5C4F"}});
        var t = new p({});
        this.tabNode.add(t).add(this.title), this.subscribe(this.title), d.registerLink(this.title), f.isFirefox() && this.title.on("click", f.registerSurfaceLink)
    }
    function a() {
        this.desc = new c({content: this.options.lessonData.desc,properties: {lineHeight: "150%"}});
        var e = new p({transform: l.translate(0, 2 * this.gridOptions.baseline, 0)});
        this.tabNode.add(e).add(this.desc), this.subscribe(this.desc)
    }
    function u() {
        var e = this.options.lessonData.time;
        if (e) {
            var t = new c({size: [5 * this.gridOptions.baseline, 1.5 * this.gridOptions.baseline],content: e + ' <img src="../images/fuicons/time/' + e.split(" ").join("") + '.svg" width="' + this.gridOptions.baseline + '">',properties: {textAlign: "right"}}), i = new p({origin: [1, 0]});
            this._add(i).add(t)
        }
    }
    var c = e("famous/core/Surface"), p = e("famous/core/Modifier"), l = e("famous/core/Transform"), h = e("famous/core/View"), d = (e("famous/core/RenderNode"), e("grids/FixedGrid"), e("app/Router")), f = e("helpers/WebUtilities");
    o.prototype = Object.create(h.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {height: 8,imgWidth: 8,fixedWidth: 0,imgRadius: "10px"}, o.prototype.resize = function(e) {
        e = e === !1 ? void 0 : this.options.transition, this.gridOptions = this.options.grid.getGrid(), this.desc.setSize([this.options.descWidth, 8 * this.gridOptions.baseline])
    }, o.prototype.getSize = function() {
        return [this.options.descWidth, this.options.height * this.gridOptions.baseline]
    }, i.exports = o
}), define("app/university/home/UniversityHomeScene", ["require", "exports", "module", "famous/core/Engine", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/core/RenderNode", "famous/transitions/Easing", "famous/utilities/Timer", "famous/views/Scrollview", "app/SceneTransitions", "app/accounts/Accounts", "grids/FixedGrid", "grids/FlexGrid", "./views/LessonInfoView"], function(e, t, i) {
    function o() {
        l.apply(this, arguments), document.body.style.backgroundColor = "#F2F2F0", s.call(this), n.call(this), this.bindEvents()
    }
    function s() {
        this.position = 0, this.node = new h, this.node.getSize = function() {
            return [void 0, this.position * this.gridOptions.baseline]
        }.bind(this), this.scrollview = new m({margin: 4 * window.innerHeight}), a.pipe(this.scrollview), this.scrollview.sequenceFrom([this.node]), this._add(this.scrollview), this.grid = new g({numCols: this.options.numCols}), this.gridOptions = this.grid.getGrid(), this.mods = [], this.descViews = [], this.lessonViews = []
    }
    function n() {
        $.ajax({type: "GET",url: this.options.dataUrl,success: r.bind(this),error: function(e) {
                console.log("lesson data error:", e)
            }})
    }
    function r(e) {
        this.position = this.options.topMargin, e = JSON.parse(e), this.createIntro(e.intro), this.createHeading("Courses");
        for (var t = 0; t < e.courses.length; t++)
            this.createCourse(e.courses[t], "Courses")
    }
    var a = e("famous/core/Engine"), u = e("famous/core/Surface"), c = e("famous/core/Modifier"), p = e("famous/core/Transform"), l = e("famous/core/View"), h = e("famous/core/RenderNode"), d = e("famous/transitions/Easing"), f = e("famous/utilities/Timer"), m = e("famous/views/Scrollview"), v = e("app/SceneTransitions"), g = (e("app/accounts/Accounts"), e("grids/FixedGrid")), y = (e("grids/FlexGrid"), e("./views/LessonInfoView"));
    o.prototype = Object.create(l.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {topMargin: 4,elementGridUnits: 10,numSimilar: 8,numCols: 8,debounce: 200,transition: {curve: d.outBack,duration: 500},fadeInTransition: {curve: "outExpo",duration: 500},fixedWidth: 700,bgColor: {Courses: "white",Examples: void 0},dataUrl: "/downloads/university-data3/fu-home-dev.json"}, o.prototype.bindEvents = function() {
        this.debounce = f.debounce(this.resize.bind(this), this.options.debounce), a.on("resize", this.debounce)
    }, o.prototype.unbindEvents = function() {
        a.removeListener("resize", this.debounce)
    }, o.prototype.createIntro = function(e) {
        var t = new u({size: [this.options.fixedWidth, 4 * this.gridOptions.baseline],content: e.title,properties: {fontSize: "44px",textAlign: "center"}});
        this.addViewCenter(t, 5);
        var i = new u({size: [this.options.fixedWidth, 9.5 * this.gridOptions.baseline],content: e.desc,properties: {textAlign: "justify"}});
        this.addViewCenter(i, 11);
        var o = new y({grid: this.grid,lessonData: e.lessons[0],transition: this.options.transition,fixedWidth: this.options.fixedWidth});
        this.addViewCenter(o, 11)
    }, o.prototype.createCourse = function(e, t) {
        var i = this.position, o = e.active ? 1 : .6;
        if (e.title) {
            var s = new u({size: [this.options.fixedWidth, 4 * this.gridOptions.baseline],content: e.title,classes: ["h1"],properties: {fontSize: "27px",lineHeight: "27px"}});
            this.addViewCenter(s, 2, o)
        }
        if (e.desc) {
            var n = new u({size: [this.options.fixedWidth, 6 * this.gridOptions.baseline],content: e.desc});
            this.addViewCenter(n, 4, o)
        }
        for (var r = 0; r < e.lessons.length; r++) {
            o = e.lessons[r].active ? 1 : .6;
            var a = (r % 2 ? this.options.numCols / 2 : 0, new y({grid: this.grid,lessonData: e.lessons[r],transition: this.options.transition,fixedWidth: this.options.fixedWidth}));
            this.addViewCenter(a, 12, o)
        }
        var l = this.position, h = new u({size: [void 0, (l - i) * this.gridOptions.baseline],properties: {backgroundColor: this.options.bgColor[t],zIndex: -1}}), d = new c({origin: [.5, 0],transform: p.translate(0, i * this.gridOptions.baseline, -.1)});
        this.node.add(d).add(h)
    }, o.prototype.createHeading = function(e) {
        var t = new u({size: [void 0, 7 * this.gridOptions.baseline],properties: {backgroundColor: this.options.bgColor[e]}}), i = new c({transform: p.translate(0, this.position * this.gridOptions.baseline, 0)});
        this.node.add(i).add(t), this.position += 3;
        var o = new u({size: [void 0, 4 * this.gridOptions.baseline],content: e,properties: {fontSize: "44px",lineHeight: "44px",textAlign: "center"}});
        this.addViewCenter(o, 4)
    }, o.prototype.addView = function(e, t) {
        var i = t[0] * (this.gridOptions.colWidth + this.gridOptions.colGutter) + this.gridOptions.margin, o = t[1] * this.gridOptions.baseline;
        -1 === t[0] && (i = 0);
        var s = new c({transform: p.translate(~~i, o)});
        s.gridPos = t, this.node.add(s).add(e), this.mods.push(s)
    }, o.prototype.addViewCenter = function(e, t, i) {
        var o = new c({opacity: i,origin: [.5, 0],size: [this.options.fixedWidth, void 0],transform: p.translate(0, this.position * this.gridOptions.baseline, 0)});
        this.node.add(o).add(e), this.position += t
    }, o.prototype.resize = function() {
        this.gridOptions = this.grid.getGrid();
        for (var e = 0; e < this.mods.length; e++) {
            var t = this.mods[e];
            t.halt();
            var i = t.gridPos[0] * (this.gridOptions.colWidth + this.gridOptions.colGutter) + this.gridOptions.margin, o = t.gridPos[1] * this.gridOptions.baseline;
            -1 === t.gridPos[0] && (i = 0), t.setTransform(p.translate(~~i, o, 0), this.options.transition)
        }
    }, o.prototype.activate = function(e) {
        v.fadeInLeft(e, this.options.fadeInTransition)
    }, o.prototype.deactivate = function(e) {
        this.unbindEvents(), v.fadeRight(e, this.options.fadeInTransition)
    }, i.exports = o
}), define("expanding/NativeScrollContainer", ["require", "exports", "module", "famous/core/Surface", "famous/surfaces/ContainerSurface", "./ExpandingSurface", "famous/utilities/Utility"], function(e, t, i) {
    function o(e) {
        var t = new a({properties: {overflow: "auto",webkitOverflowScrolling: "touch"}}), i = new r({content: e});
        return i.on("touchstart", function(e) {
            console.log(e)
        }), t.add(i), {container: t,surface: i}
    }
    function s(e) {
        var t = document.getElementById(e);
        return o(t)
    }
    function n(e, t) {
        u.loadURL(e, function(e) {
            var i = o(e);
            t(i)
        })
    }
    var r = e("famous/core/Surface"), a = e("famous/surfaces/ContainerSurface"), u = (e("./ExpandingSurface"), e("famous/utilities/Utility"));
    i.exports = {create: o,ajax: n,createFromId: s}
}), define("expanding/ExpandingScene", ["require", "exports", "module", "scene/Scene", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "app/SceneTransitions", "app/SceneController", "expanding/ExpandingScrollview", "events/EventHelpers"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), $.ajax({type: "GET",url: this.options.url,success: this._addScroll.bind(this)})
    }
    {
        var s = e("scene/Scene"), n = (e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("app/SceneTransitions")), r = (e("app/SceneController"), e("expanding/ExpandingScrollview"));
        e("events/EventHelpers")
    }
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {url: void 0,transitionOut: {curve: "outExpo",duration: 300}}, o.prototype._addScroll = function(e) {
        this.addEvent(this.on, "resize", this._resizeScroll, this._eventOutput.removeListener.bind(this._eventOutput)), this.expandableScroll = new r(e), this._node.add(this.expandableScroll), this.addAnalytics()
    }, o.prototype.addAnalytics = function() {
    }, o.prototype._resizeScroll = function() {
        this.expandableScroll.setWidth(this.getSize()[0]), this.expandableScroll.scrollview.setOptions({clipSize: this.getSize()[1]})
    }, o.prototype.activate = function(e) {
        n.fadeIn(e)
    }, o.prototype.deactivate = function(e) {
        this.removeAllEvents(), n.fadeOut(e, this.options.transitionOut)
    }, i.exports = o
}), define("app/install/InstallScene", ["require", "exports", "module", "scene/Scene", "famous/core/Surface", "famous/core/Transform", "famous/core/Modifier", "famous/core/Engine", "app/SceneTransitions", "app/SceneController", "expanding/NativeScrollContainer", "expanding/ExpandingScene", "analytics/Analytics"], function(e, t, i) {
    function o() {
        s.apply(this, arguments), document.body.style.backgroundColor = "#F2F2F0"
    }
    var s = (e("scene/Scene"), e("famous/core/Surface"), e("famous/core/Transform"), e("famous/core/Modifier"), e("famous/core/Engine"), e("app/SceneTransitions"), e("app/SceneController"), e("expanding/NativeScrollContainer"), e("expanding/ExpandingScene")), n = e("analytics/Analytics");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {url: "/html/install/installContent.html",transitionOut: {curve: "outExpo",duration: 300}}, o.prototype.addAnalytics = function() {
        var e = this.expandableScroll.getItem(0);
        n.onIDClick(e, "famous-support-button", "install-help"), n.onDataClick(e, "install/flow", "flow")
    }, i.exports = o
}), define("university", ["require", "exports", "module", "./appHarness", "app/Router", "app/SceneController", "app/university/examples/ExampleScene", "app/university/examples/ExamplesScene", "app/university/university/UniversityScene", "app/university/home/UniversityHomeScene", "app/install/InstallScene", "expanding/ExpandingScene"], function(e) {
    var t = (e("./appHarness"), e("app/Router")), i = e("app/SceneController");
    i.addScenes({example: e("app/university/examples/ExampleScene"),examples: e("app/university/examples/ExamplesScene"),university: e("app/university/university/UniversityScene"),universityHome: e("app/university/home/UniversityHomeScene"),install: e("app/install/InstallScene"),help: e("expanding/ExpandingScene").bind({}, {url: "/html/help/helpContent.html"})}), t.addRoutes({"/help": "help","/install": "install","/university": "universityHome","/university/:course": "university","/university/:course/:lesson": "university","/university/:course/:lesson/:step": "university","/examples": "examples","/examples/:version/:submodule/:course/:name": "example"}), t.defaultTo("/university")
});
