function delegateService(e) {
    return ["$log", function(t) {
        function n(e) {
            this.handle = e
        }
        var a = this,
            o = this._instances = [];
        this._registerInstance = function(e, t) {
            return e.$$delegateHandle = t, o.push(e),
                function() {
                    var t = o.indexOf(e); - 1 !== t && o.splice(t, 1)
                }
        }, this.$getByHandle = function(e) {
            return e ? new n(e) : a
        }, e.forEach(function(e) {
            n.prototype[e] = function() {
                var n, a, r = this.handle,
                    l = arguments,
                    u = 0;
                return o.forEach(function(t) {
                    t.$$delegateHandle === r && (u++, a = t[e].apply(t, l), 1 === u && (n = a))
                }), u ? n : t.warn('Delegate for handle "' + this.handle + '" could not find a corresponding element with delegate-handle="' + this.handle + '"! ' + e + "() was not called!\nPossible cause: If you are calling " + e + '() immediately, and your element with delegate-handle="' + this.handle + '" is a child of your controller, then your element may not be compiled yet. Put a $timeout around your call to ' + e + "() and try again.")
            }, a[e] = function() {
                var t, n, a = arguments;
                return o.forEach(function(o, r) {
                    n = o[e].apply(o, a), 0 === r && (t = n)
                }), t
            }
        })
    }]
}
angular.module("pdf", []).service("pdfDelegate", delegateService(["prev", "next", "zoomIn", "zoomOut", "zoomTo", "rotate", "getPageCount", "getCurrentPage", "goToPage", "load", "refresh"])), 
angular.module("pdf").controller("PdfCtrl", ["$scope", "$element", "$attrs", "pdfDelegate", "$log", "$window", "$log", function(e, t, n, a, o, win, log) {
    var orientation = "p";

    var r = a._registerInstance(this, n.delegateHandle);
    var renderTask = null;
    e.$on("$destroy", r);
    var l, u = this,
        i = e.$eval(n.url),
        c = e.$eval(n.headers);
    e.pageCount = 0;
    var d = 1,
        g = 0,
        s = n.scale ? n.scale : 1,
        f = t.find("canvas")[0],
        p = f.getContext("2d"),
        view = t[0],
        cur = 0, // current page number

        backingScale = function(canvas) {
            var ctx = canvas.getContext('2d');
            var dpr = window.devicePixelRatio || 1;
            var bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

            return dpr / bsr;
        },

        getMobileOperatingSystem = function() {
            var userAgent = win.navigator.userAgent || win.navigator.vendor || win.window.opera;

            // Windows Phone must come first because its UA also contains "Android"
            if (/windows phone/i.test(userAgent)) {
                return "Windows Phone";
            }

            if (/android/i.test(userAgent)) {
                return "Android";
            }

            // iOS detection from: http://stackoverflow.com/a/9039885/177710
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                return "iOS";
            }

            return "unknown";
        },

        setCanvasDimensions = function(canvas, w, h) {
            var ratio = backingScale(canvas);
            canvas.width = Math.floor(w * ratio);
            canvas.height = Math.floor(h * ratio);
            canvas.style.width = Math.floor(w) + 'px';
            canvas.style.height = Math.floor(h) + 'px';
            canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
            m();
            return canvas;
        },

        h = function(num) {
            if (renderTask) {
                renderTask._internalRenderTask.cancel();
            }
            // e.is_page_loading = true;
            angular.isNumber(num) || (num = parseInt(num)), l.getPage(num).then(function(page) {
                cur = num;
                console.log("orientation :", win.checkOrientation());
                if(win.checkOrientation() == "portrait") {
                    orientation = "p";
                } else {
                    orientation = "l";
                }

                var t = page.getViewport(s); // pdf
                var scale = 1;

                if (orientation == "p") {
                    // var clientRect = view.getBoundingClientRect(); // view
                    var draw_area_width = win.screen.width;

                    scale = draw_area_width / t.width; // !important scale
                    console.log("P====", scale);

                } else {
                    var platform = getMobileOperatingSystem();
                    var draw_area_height = win.screen.height - 100; // Android and Window Phone

                    if (platform === "iOS") {
                        draw_area_height = win.screen.width - 70; // iOS
                    };
                    
                    scale = draw_area_height / t.height; // !important scale
                    console.log("L====", scale);

                };

                t = page.getViewport(scale);

                // f.height = t.height, f.width = t.width;
                setCanvasDimensions(f, t.width, t.height);

                var n = {
                    canvasContext: p,
                    viewport: t
                };
                
                f.style.display="none";
                f.style.marginLeft = "auto";
                f.style.marginRight = "auto";
                // view.style.border = "2px solid white";
                renderTask = page.render(n);
                
                renderTask.promise.then(function() {
                    // e.is_page_loading = false;
                    if (typeof e.onPageRender === 'function') {
                        f.style.display="block";
                        e.onPageRender();
                    }
                }).catch(function (reason) {
                    // e.is_page_loading = false;
                    console.log(reason);
                    f.style.display="block";
                });
            })
        },
        v = function(num) {
            if (renderTask) {
                renderTask._internalRenderTask.cancel();
            }
            // e.is_page_loading = true;
            angular.isNumber(num) || (num = parseInt(num)), l.getPage(num).then(function(page) {
                cur = num;
 
                var t = page.getViewport(s);
                var clientRect = view.getBoundingClientRect();
                var scale = clientRect.width / t.height;
                console.log("v :", scale);
                t = page.getViewport(scale);
 
                // f.height = t.height, f.width = t.width;
                setCanvasDimensions(f, t.width, t.height);
 
                var n = {
                    canvasContext: p,
                    viewport: t
                };
                
                f.style.display="none";
                renderTask = page.render(n);
                
                renderTask.promise.then(function() {
                    // e.is_page_loading = false;
                    if (typeof e.onPageRender === 'function') {
                        f.style.display="block";
                        e.onPageRender();
                    }
                }).catch(function (reason) {
                    // e.is_page_loading = false;
                    console.log(reason);
                    f.style.display="block";
                });
            })
        },
        m = function() {
            // f.style.webkitTransform = "rotate(" + g + "deg)", f.style.MozTransform = "rotate(" + g + "deg)", f.style.msTransform = "rotate(" + g + "deg)", f.style.OTransform = "rotate(" + g + "deg)", f.style.transform = "rotate(" + g + "deg)"
            var x_offset = 0, y_offset = 0;
            if (g === 90 || g === 270) {
                x_offset = 0 - (parseInt(f.style.width) - parseInt(f.style.height)) / 2;
                y_offset = (parseInt(f.style.width) - parseInt(f.style.height)) / 2;
            };    
            
            f.style.webkitTransform = "translateX(" + x_offset + "px) translateY(" + y_offset + "px) rotate(" + g + "deg)", 
            f.style.MozTransform = "translateX(" + x_offset + "px) translateY(" + y_offset + "px) rotate(" + g + "deg)", 
            f.style.msTransform = "translateX(" + x_offset + "px) translateY(" + y_offset + "px) rotate(" + g + "deg)", 
            f.style.OTransform = "translateX(" + x_offset + "px) translateY(" + y_offset + "px) rotate(" + g + "deg)", 
            f.style.transform = "translateX(" + x_offset + "px) translateY(" + y_offset + "px) rotate(" + g + "deg)"
        };

    angular.element(win).bind('orientationchange', function () {

        if(win.checkOrientation() == "portrait") {
            orientation = "p";

        } else {
            orientation = "l";
        }

        h(cur);
    });
        
    u.prev = function() {
        if (g === 0 || g === 180) {
            1 >= d || (d = parseInt(d, 10) - 1, h(d))
        } else {
            1 >= d || (d = parseInt(d, 10) - 1, v(d))
        }
    }, u.next = function() {
        if (g === 0 || g === 180) {
            d >= l.numPages || (d = parseInt(d, 10) + 1, h(d))
        } else {
            d >= l.numPages || (d = parseInt(d, 10) + 1, v(d))
        }
    }, u.zoomIn = function(e) {
        return e = e || .2, s = parseFloat(s) + e, h(d), s
    }, u.zoomOut = function(e) {
        return e = e || .2, s = parseFloat(s) - e, s = s > 0 ? s : .1, h(d), s
    }, u.zoomTo = function(e) {
        return e = e ? e : 1, s = parseFloat(e), h(d), s
    }, u.rotate = function() {

        // g = 0 === g ? 90 : 90 === g ? 180 : 180 === g ? 270 : 0, m()
        g = 0 === g ? 90 : 90 === g ? 0 : 0
        
        if (g === 0 || g === 180) {
            h(cur);
        };
 
        if (g === 90 || g === 270) {
            v(cur);
        };
 
        // m();
 
        return g;

    }, u.refresh = function() {
        console.log("refresh---");
        g = 0;
        h(cur);
        return g;

    }, u.getPageCount = function() {
        return e.pageCount
    }, u.getCurrentPage = function() {
        return d
    }, u.goToPage = function(e) {
        null !== l && (d = e, h(e))
    }, u.load = function(t) {
        t && (i = t);
        var n = {};
        return "string" == typeof i ? n.url = i : n.data = i, c && (n.httpHeaders = c), PDFJS.getDocument(n).then(function(t) {
            l = t, h(1), e.$apply(function() {
                e.pageCount = t.numPages
            })
        }, o.error)
    }, i && u.load()
}]), angular.module("pdf").directive("pdfViewerToolbar", ["pdfDelegate", function(e) {
    return {
        restrict: "E",
        template: '<div class="clearfix mb2 white bg-blue"><div class="left"><a href=""ng-click="prev()"class="button button-positive py2 m0 button-nav-dark">Back</a><a href=""ng-click="next()"class="button button-positive py2 m0 button-nav-dark">Next</a><a href=""ng-click="zoomIn()"class="button button-royal py2 m0 button-nav-dark">Zoom In</a><a href=""ng-click="zoomOut()"class="button button-royal py2 m0 button-nav-dark">Zoom Out</a><a href=""ng-click="rotate()"class="button button-assertive py2 m0 button-nav-dark">Rotate</a><div class="page_bar"><span class="px1">Page</span> <input type="text" class="field-dark page_num" min=1 ng-model="currentPage" ng-change="goToPage()" style="">  <span class="px2">/ {{pageCount}}</span></div></div></div>',
        scope: {
            pageCount: "="
        },
        link: function(t, n, a) {
            var o = a.delegateHandle;
            t.currentPage = 1, t.prev = function() {
                e.$getByHandle(o).prev(), r()
            }, t.next = function() {
                e.$getByHandle(o).next(), r()
            }, t.zoomIn = function() {
                e.$getByHandle(o).zoomIn()
            }, t.zoomOut = function() {
                e.$getByHandle(o).zoomOut()
            }, t.rotate = function() {
                e.$getByHandle(o).rotate()
            }, t.goToPage = function() {
                e.$getByHandle(o).goToPage(t.currentPage)
            };
            var r = function() {
                t.currentPage = e.$getByHandle(o).getCurrentPage()
            }
        }
    }
}]), angular.module("pdf").directive("pdfViewer", ["$window", "$log", "pdfDelegate", function() {
    return {
        restrict: "E",
        template: '<pdf-viewer-toolbar ng-if="showToolbar" delegate-handle="{{id}}" page-count="pageCount"></pdf-viewer-toolbar><canvas></canvas>',
        scope: !0,
        controller: "PdfCtrl",
        link: function(e, t, n) {
            e.id = n.delegateHandle, e.showToolbar = e.$eval(n.showToolbar) || !1
        }
    }
}]);