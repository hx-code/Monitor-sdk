(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tracker = factory());
})(this, (function () { 'use strict';

    var createHistoryEvnent = function (type) {
        var origin = history[type];
        return function () {
            var res = origin.apply(this, arguments);
            var e = new Event(type);
            window.dispatchEvent(e);
            return res;
        };
    };

    //版本
    var TrackerConfig;
    (function (TrackerConfig) {
        TrackerConfig["version"] = "1.0.0";
    })(TrackerConfig || (TrackerConfig = {}));

    var Tracker = /** @class */ (function () {
        function Tracker(options) {
            this.data = Object.assign(this.initDef(), options);
            this.installTracker();
        }
        Tracker.prototype.initDef = function () {
            window.history['pushState'] = createHistoryEvnent('pushState');
            window.history['replaceState'] = createHistoryEvnent('replaceState');
            return {
                sdkVersion: TrackerConfig.version,
                historyTracker: false,
                hashTracker: false,
                domTracker: false,
                jsError: false
            };
        };
        Tracker.prototype.sendTracker = function (data) {
            this.reportTracker(data);
        };
        Tracker.prototype.setUserId = function (uuid) {
            this.data.uuid = uuid;
        };
        Tracker.prototype.setEtra = function (extra) {
            this.data.extra = extra;
        };
        Tracker.prototype.captrueEvents = function (mouseEventList, targetKey, data) {
            var _this = this;
            mouseEventList.forEach(function (event) {
                window.addEventListener(event, function () {
                    console.log('监听到了');
                    _this.reportTracker({
                        event: event,
                        targetKey: targetKey,
                        data: data
                    });
                });
            });
        };
        Tracker.prototype.installTracker = function () {
            if (this.data.historyTracker) {
                this.captrueEvents(['pushState', 'replaceState', 'popstate'], 'history-pv');
            }
            if (this.data.hashTracker) {
                this.captrueEvents(['hashchange'], 'history-pv');
            }
        };
        Tracker.prototype.reportTracker = function (data) {
            var params = Object.assign(this.data, { time: new Date().getTime() });
            var headers = {
                type: 'application/x-wwww-format-urlencoded'
            };
            var blob = new Blob([JSON.stringify(params)], headers);
            navigator.sendBeacon(this.data.requestUrl, blob);
        };
        return Tracker;
    }());

    return Tracker;

}));
