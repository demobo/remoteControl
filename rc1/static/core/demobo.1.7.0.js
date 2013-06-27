var DEMOBO_DEBUG = !1;
(function() {
    if (!window.demobo) {
        var h = {open: function() {
            },close: function() {
            },message: function() {
            },options: {},events: {}};
        window.demobo = new function() {
            var e, j, n, k = Date.now(), g = {}, l = {}, m = [], i = {}, f = !1;
            this._getAppID = function() {
                return k
            };
            this._onSetActive = function(a) {
                a.appID == k ? demobo.enable() : demobo.disable();
                DEMOBO_DEBUG && console.log("onSetActive " + demobo.isActive())
            };
            this._setActive = function() {
                DEMOBO_DEBUG && console.log("setActive ");
                f = !0;
                demobo._setP2P("", !1);
                setTimeout(function() {
                    demobo._send("broadcast", {type: "setActive",
                        appID: k})
                }, 100);
                return f
            };
            this._getBrowser = function() {
                return navigator.userAgent.match(/iPad/i) ? "ipad" : -1 != navigator.userAgent.toLowerCase().indexOf("chrome") ? "chrome" : -1 != navigator.userAgent.toLowerCase().indexOf("safari") ? "safari" : "unknown"
            };
            this._createEvent = function(a) {
                var b = document.createEvent("Event");
                b.initEvent("phone_" + a.type, !0, !0);
                for (var c in a)
                    b[c] || (b[c] = a[c]);
                return b
            };
            this._extend = function(a, b) {
                var c = {}, d;
                for (d in a)
                    c[d] = a[d];
                for (d in b)
                    c[d] = b[d];
                return c
            };
            this._deepExtend = function(a, 
            b) {
                for (var c in b)
                    try {
                        a[c] = b[c].constructor == Object ? MergeRecursive(a[c], b[c]) : b[c]
                    } catch (d) {
                        a[c] = b[c]
                    }
                return a
            };
            this._getP2Ps = function() {
                return l
            };
            this._setP2P = function(a, b) {
                DEMOBO_DEBUG && console.log("demobo setP2P " + a);
                if (f)
                    return b ? demobo._sendPrivate("setP2P", {deviceID: a,enabled: b}) : demobo._send("setP2P", {deviceID: a,enabled: b})
            };
            this._connectP2P = function(a) {
                var b = a.deviceID, c = g[b];
                DEMOBO_DEBUG && console.log("demobo connectP2P ", a, c);
                c && (DEMOBO_DEBUG && console.log("connectP2P with " + b), c.address && 
                (l[c.address] ? demobo._setP2P(c.deviceID, !0) : demobo._createP2P(c)));
                f && setTimeout(function() {
                    demobo.setController(!1, b)
                }, 200)
            };
            this._createP2P = function(a) {
                DEMOBO_DEBUG && console.log("demobo _createP2P " + a.deviceID);
                var b = new WebSocket("ws://" + a.address + ":12345/");
                b.addEventListener("open", function() {
                    demobo._setP2P(a.deviceID, !0) && (l[a.address] = b, g[a.deviceID] = a)
                });
                b.addEventListener("close", function() {
                    if (l[a.address]) {
                        delete l[a.address];
                        delete g[a.deviceID];
                        delete b;
                        var c = demobo._createEvent({type: "disconnected",
                            deviceID: a.deviceID,address: a.address});
                        window.dispatchEvent(c);
                        DEMOBO_DEBUG && console.log("reconnecting " + a.address);
                        demobo._createP2P(a)
                    }
                });
                b.addEventListener("message", demobo._message)
            };
            this._close = function() {
                DEMOBO_DEBUG && console.log("reconnecting server");
                demobo.reconnect(5E3)
            };
            this._message = function(a) {
                if (!this.url || f) {
                    var b = a.data.match(/{[^|]*}/g);
                    if (b) {
                        for (var c = 0; c < b.length; c++) {
                            var d = JSON.parse(b[c]), e = h.events[d.type];
                            e ? e.call(this, d) : (d = demobo._createEvent(d), window.dispatchEvent(d))
                        }
                        DEMOBO_DEBUG && 
                        console.log("FROM: ", this.url, a.data)
                    }
                }
            };
            this._send = function(a, b) {
                DEMOBO_DEBUG && console.log("send:", a, b, f);
                if (!f || !e)
                    return !1;
                var c = {};
                c.type = a;
                c.data = JSON.stringify(b);
                c = JSON.stringify(c);
                return e.send(c)
            };
            this._sendPrivate = function(a, b) {
                DEMOBO_DEBUG && console.log("send private:", a, b, f);
                if (!f)
                    return !1;
                if (b.deviceID)
                    return demobo._sendByDeviceID(a, b, b.deviceID);
                var c = !0, d;
                for (d in g)
                    c = c && demobo._sendByDeviceID(a, b, d);
                return c
            };
            this._sendByDeviceID = function(a, b, c) {
                if (!f)
                    return !1;
                var d = {};
                d.type = a;
                b.deviceID = 
                c;
                d.data = JSON.stringify(b);
                b = JSON.stringify(d);
                d = e;
                g[c] && (c = l[g[c].address]) && (d = c);
                DEMOBO_DEBUG && console.log("TO: " + d.url, a);
                return d.send(b)
            };
            this._sendToSimulator = function(a, b) {
                if (j) {
                    var c = new CustomEvent("FromFrontground", {detail: {type: a,data: b}});
                    j.dispatchEvent(c)
                }
            };
            this._guid = function() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
                    var b = 16 * Math.random() | 0;
                    return ("x" == a ? b : b & 3 | 8).toString(16)
                })
            };
            this._getScript = function(a, b) {
                var c = document.createElement("script");
                c.async = "async";
                c.src = a;
                b && (c.onload = b);
                document.head.insertBefore(c, document.head.firstChild)
            };
            this._urlParam = function(a) {
                return (a = RegExp("[\\?&]" + a + "=([^&#]*)").exec(window.location.href)) ? a[1] : !1
            };
            this._isAllP2P = function() {
                var a = 0, b;
                for (b in g)
                    a++;
                b = 0;
                for (var c in l)
                    b++;
                return a == b
            };
            this.start = function(a) {
                DEMOBO_DEBUG && console.log("demobo start");
                DEMOBO.roomID || (DEMOBO = demobo._extend(DEMOBO, a), -1 != navigator.userAgent.toLowerCase().indexOf("iphone") || -1 == navigator.userAgent.toLowerCase().indexOf("safari") && 
                -1 == navigator.userAgent.toLowerCase().indexOf("chrome") ? this.renderBrowserWarning() : (demobo.inputEventDispatcher = new demobo.InputEventDispatcher, DEMOBO.init && (demobo.setupShakeConnect(), demobo._getScript("//net.demobo.com/guid.js", function() {
                    demobo_guid && (DEMOBO.roomID = demobo_guid);
                    demobo.setup({open: function() {
                            DEMOBO.autoConnect && DEMOBO.init();
                            demobo._setActive();
                            setTimeout(function() {
                                demobo.refreshDevices()
                            }, 200);
                            setInterval(function() {
                                1 != demobo.getState() ? demobo.reconnect() : demobo._send("", "")
                            }, 
                            6E4)
                        }});
                    DEMOBO.autoConnect ? demobo.connect() : DEMOBO.init()
                }))))
            };
            this.setup = function(a) {
                DEMOBO_DEBUG && console.log("demobo set up");
                if ("undefined" == typeof DEMOBO)
                    this.renderDemoboWarning();
                else {
                    a || (a = DEMOBO.setting ? DEMOBO.setting : {});
                    DEMOBO.maxPlayers || (DEMOBO.maxPlayers = 2);
                    if (!DEMOBO.roomID)
                        if (a && a.roomID)
                            DEMOBO.roomID = a.roomID;
                        else if (DEMOBO.developer)
                            DEMOBO.roomID = this._guid();
                        else {
                            this.renderDeveloperWarning();
                            return
                        }
                    h = demobo._extend(h, a);
                    demobo.enable();
                    window.onunload = function() {
                        e && demobo.disconnect()
                    };
                    demobo.addEventListener("back", function() {
                        parent.parent && parent.parent.closeGame ? parent.parent.closeGame() : parent && parent.closeGame && parent.closeGame()
                    }, !1);
                    demobo.addEventListener("load", function(a) {
                        demobo.setController(!1, a.deviceID)
                    }, !1);
                    demobo.addEventListener("connected", function(a) {
                        if (DEMOBO.minAppVersion && a.appVersion < DEMOBO.minAppVersion)
                            alert("Please update your de Mobo phone app. (min app version: " + DEMOBO.minAppVersion + ")");
                        else {
                            DEMOBO_DEBUG && console.log("connected", a);
                            localStorage.isDemobo = 
                            !0;
                            demobo.hidePopup();
                            var c = {address: a.address,appVersion: a.appVersion,deviceID: a.deviceID,deviceOS: a.deviceOS,latitude: a.latitude,longitude: a.longitude,userName: a.userName};
                            c.address ? (g[c.deviceID] = c, setTimeout(function() {
                                demobo._connectP2P(c)
                            }, 300)) : demobo.refreshDevices(a.deviceID)
                        }
                    }, !1);
                    demobo.addEventListener("broadcast", function(a) {
                        DEMOBO_DEBUG && console.log("broadcast: ", a.data);
                        a = JSON.parse(a.data);
                        "setActive" == a.type && demobo._onSetActive(a)
                    }, !1);
                    demobo.addEventListener("getData", function(a) {
                        a.appID && 
                        k != a.appID || (DEMOBO_DEBUG && console.log("getData result: " + a.callback, a), a.callback && (a.value && "unknown" != a.value) && eval(a.callback)(JSON.parse(a.value), a.deviceID))
                    }, !1);
                    demobo.addEventListener("getDeviceInfo", function(a) {
                        DEMOBO_DEBUG && console.log("getDeviceInfo result: " + a.callback, a);
                        if (k == a.appID) {
                            var c = a.value || {deviceID: a.deviceID,deviceOS: "android"};
                            g[c.deviceID] = c;
                            a.callback && c && eval(a.callback)(c)
                        }
                    }, !1);
                    demobo.addEventListener("input", function(a) {
                        demobo.inputEventDispatcher.execCommand(a.source, 
                        a.value, a)
                    });
                    window.addEventListener("message", function(a) {
                        a.data && a.data.type && demobo._message({data: JSON.stringify(a.data)})
                    });
                    window.addEventListener("focus", function() {
                        demobo._send("", "");
                        demobo.isActive() || (demobo._setActive(), setTimeout(function() {
                            demobo.refreshDevices()
                        }, 200))
                    });
                    j = document.getElementById("demoboBody")
                }
            };
            this.renderBrowserWarning = function() {
                alert("We only support Safari and Chrome browsers at this moment.")
            };
            this.renderDemoboWarning = function() {
                alert("de Mobo is undefined.")
            };
            this.renderDeveloperWarning = function() {
                alert("Developers, please put your registered Google account name in DEMOBO.developer.")
            };
            this.disable = function() {
                f = !1
            };
            this.enable = function() {
                f = !0
            };
            this.isActive = function() {
                return f
            };
            this.connect = function() {
                if (e)
                    return e;
                e = new WebSocket(DEMOBO.websocketServer + "?roomID=" + DEMOBO.roomID);
                e.addEventListener("open", h.open);
                e.addEventListener("close", h.close);
                e.addEventListener("message", h.message);
                e.addEventListener("message", this._message);
                return e
            };
            this.disconnect = 
            function() {
                if (!e)
                    return !1;
                e.removeEventListener("open", h.open);
                e.removeEventListener("close", h.close);
                e.removeEventListener("message", h.message);
                e.removeEventListener("message", this._message);
                e.close();
                e = null;
                return !0
            };
            this.reconnect = function(a) {
                a || (a = 1);
                setTimeout(function() {
                    demobo.disconnect();
                    demobo.connect()
                }, a)
            };
            this.simulateKeyEvent = function(a) {
                this.dispatchKeyboardEvent(document, "keydown", !0, !0, null, a, 0, "");
                this.dispatchKeyboardEvent(document, "keypress", !0, !0, null, a, 0, "");
                this.dispatchKeyboardEvent(document, 
                "keyup", !0, !0, null, a, 0, "")
            };
            this.dispatchKeyboardEvent = function(a, b) {
                var c = document.createEvent("KeyboardEvents");
                c.initKeyboardEvent.apply(c, Array.prototype.slice.call(arguments, 1));
                a.dispatchEvent(c)
            };
            this.getParameterByName = function(a) {
                return (a = RegExp("[?&]" + a + "=([^&]*)").exec(window.location.search)) && decodeURIComponent(a[1].replace(/\+/g, " "))
            };
            this.addPlayer = function(a) {
                return m.length < DEMOBO.maxPlayers && -1 == m.indexOf(a) ? (m.push(a), m.length - 1) : !1
            };
            this.getPlayerIndex = function(a) {
                return m.indexOf(a)
            };
            this.getPlayers = function() {
                return m
            };
            this.InputEventDispatcher = function() {
                DEMOBO_DEBUG && console.log("demobo InputEventDispatcher");
                this.acceptableCommands = {};
                this.addCommand = function(a, b) {
                    this.acceptableCommands[a] = b
                };
                this.addCommands = function(a) {
                    for (var b in a)
                        this.acceptableCommands[b] = a[b]
                };
                this.execCommand = function(a, b, c) {
                    if (a in this.acceptableCommands)
                        this.acceptableCommands[a](b, c)
                }
            };
            this.getCurrentDomain = function() {
                var a = document.domain || window.location.hostname, a = a.split(".").reverse();
                return a = 
                a[1] + "." + a[0]
            };
            this.addEventListener = function(a, b, c) {
                window.addEventListener("phone_" + a, b, c)
            };
            this.removeEventListener = function(a, b, c) {
                window.removeEventListener("phone_" + a, b, c)
            };
            this.mapInputEvents = function(a) {
                demobo.inputEventDispatcher.addCommands(a)
            };
            this.getQRUrl = function() {
                if (!n) {
                    var a = JSON.stringify({roomID: DEMOBO.roomID,server: DEMOBO.server,browser: demobo._getBrowser()});
                    n = "//chart.apis.google.com/chart?cht=qr&chl=" + escape(a) + "&chs=240x240"
                }
                return n
            };
            this.showPopup = function() {
                j || (j = document.createElement("div"), 
                j.setAttribute("id", "demoboBody"), document.body.appendChild(j));
                var a = document.getElementById("demoboCover");
                if (a)
                    a.style.display = "block";
                else {
                    a = document.createElement("div");
                    a.setAttribute("id", "demoboCover");
                    j.appendChild(a);
                    var b = document.createElement("div");
                    b.setAttribute("id", "demoboCoverDiv");
                    a.appendChild(b);
                    var c = document.createElement("div");
                    c.setAttribute("id", "demoboClose");
                    b.appendChild(c);
                    var d = document.createElement("a");
                    d.setAttribute("onclick", "demobo.hidePopup();");
                    newContent = document.createTextNode("\u2715");
                    d.appendChild(newContent);
                    c.appendChild(d);
                    1 != demobo.getState() ? (c = document.createElement("div"), c.appendChild(document.createTextNode("Failed to connect with de Mobo:")), b.appendChild(c), c = document.createElement("div"), c.appendChild(document.createTextNode("Unable to connect to the server. If you have a firewall, it may be blocking the connection.")), b.appendChild(c), a.style.opacity = 1) : demobo.renderQR("demoboCoverDiv", 1)
                }
            };
            this.hidePopup = function() {
                var a = document.getElementById("demoboCover");
                a && 
                (a.style.display = "none")
            };
            this.setupShakeConnect = function() {
                var a = 0;
                document.onkeydown = function(b) {
                    if (13 == (b.keyCode ? b.keyCode : b.which))
                        a++, 7 == a % 80 && demobo._getScript("//net.demobo.com/guid.js?" + Math.random()), 1 == a && demobo._send("", "")
                };
                document.onkeyup = function(b) {
                    if (13 == (b.keyCode ? b.keyCode : b.which))
                        a = 0
                }
            };
            this.renderQR = function(a, b) {
                a || (a = "qrcode");
                if (!document.getElementById(a)) {
                    var c = document.createElement("div");
                    c.id = a;
                    document.body.appendChild(c)
                }
                document.getElementById(a) && (document.getElementById("qrimage") || 
                (c = document.createElement("img"), c.id = "qrimage", c.src = demobo.getQRUrl(), document.getElementById(a).appendChild(c), document.onkeyup = function(b) {
                    b = b.keyCode ? b.keyCode : b.which;
                    13 != b && 27 == b && ("none" == document.getElementById(a).style.display ? document.getElementById(a).style.display = "block" : document.getElementById(a).style.display = "none")
                }), b ? document.getElementById(a).style.display = "block" : document.getElementById(a).style.display = "none")
            };
            this.getControllers = function() {
                return i
            };
            this.setController = function(a, 
            b) {
                DEMOBO_DEBUG && console.log("demobo setController " + b);
                a || (a = i[b] ? i[b] : i[void 0]);
                a = demobo._extend({}, a);
                demobo._sendToSimulator("register", a);
                demobo._sendToSimulator("setData", {key: "qrUrl",value: demobo.getQRUrl()});
                if (f) {
                    if ("undefined" == typeof a.page || !a.page)
                        if (a.page = "default", !a.url)
                            return !1;
                    if (b)
                        return a.deviceID = b, i[b] = a, demobo._sendPrivate("register", a);
                    delete a.deviceID;
                    i[b] = a;
                    return demobo._send("register", a)
                }
            };
            this.fireEvent = function(a) {
                if (f)
                    return demobo._sendPrivate("fireEvent", a)
            };
            this.setData = 
            function(a, b) {
                DEMOBO_DEBUG && console.log("demobo setData " + a);
                if (f)
                    return demobo._sendPrivate("setData", {deviceID: a,appURL: DEMOBO.appName || window.location.host,value: JSON.stringify(b)})
            };
            this.getData = function(a, b) {
                DEMOBO_DEBUG && console.log("demobo getData " + a + " " + b);
                if (f)
                    return demobo._sendPrivate("getData", {deviceID: a,appURL: DEMOBO.appName || window.location.host,appID: k,callback: b})
            };
            this.getDeviceInfo = function(a, b) {
                DEMOBO_DEBUG && console.log("demobo getDeviceInfo " + a);
                if (f)
                    return demobo._send("getDeviceInfo", 
                    {deviceID: a || "",appID: k,callback: b || ""})
            };
            this.setPage = function(a) {
                if (f)
                    return a || (a = {}), demobo._sendPrivate("setPage", a)
            };
            this.openPage = function(a) {
                if (f)
                    return a || (a = {}), demobo._sendPrivate("openPage", a)
            };
            this.setHTML = function(a, b) {
                if (f)
                    return a || (a = {}), i[b] && (i[b] = demobo._extend(i[b], a)), demobo._sendPrivate("setHTML", a)
            };
            this.callFunction = function(a, b, c) {
                demobo._sendToSimulator("callFunction", {functionName: a,data: b});
                f && (a = {functionName: a,data: b}, c && (a.deviceID = c), demobo._sendPrivate("callFunction", 
                a))
            };
            this.refreshDevices = function(a) {
                DEMOBO_DEBUG && console.log("refreshDevices");
                if (a)
                    delete g[a];
                else
                    for (var b in g)
                        delete g[b];
                demobo.getDeviceInfo(a, "demobo._connectP2P")
            };
            this.getDevices = function() {
                return g
            };
            this.getState = function() {
                return e ? e.readyState : -1
            }
        };
        window.addEventListener("load", function() {
            demobo.start()
        }, !1);
        window.DEMOBO = demobo._urlParam("demobo");
        DEMOBO ? DEMOBO = JSON.parse(decodeURIComponent(DEMOBO)) : ("undefined" == typeof useremail && (useremail = "unknown"), DEMOBO = {useremail: useremail,
            server: "net.demobo.com",websocketServer: "ws://net.demobo.com:8000",controller: !1,autoConnect: !0})
    }
})();