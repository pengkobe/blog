/*
 网站监控
*/
/// === 辅助库(BEGIN) ===
function GenerateUUID() {
    var s = '';
    for (var i = 0; i < 4; i++) {
        s += '0000000'.concat(Math.floor(Math.random() * 2821109907456).toString(36)).slice(-8);
    }
    return s;
};

// 处理事件绑定
function BindEvent(element, type, handler) {
    var wrapper = function (e) {
        e = e || event;
        var arg = { target: e.target || e.srcElement };
        handler.call(arg.target, arg);
    };
    if (element.addEventListener) {
        element.addEventListener(type, wrapper, true);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, wrapper);
    }
}
/// === 辅助库(END) ===


/// === 核心(BEGIN) ===
var uuid = GenerateUUID();

// 只有 PV_RECEIVER 才会种植第三方 Cookie
var NONPV_RECEIVER = 'https://yipeng.info/monitor/nopv';
var PV_RECEIVER = 'https://yipeng.info/monitor/pv';
/** DEV：
var NONPV_RECEIVER = 'http://localhost:3000/monitor/nopv';
var PV_RECEIVER = 'http://localhost:3000/monitor/pv';
*/

var NXT_Monitor = function (type, data) {
    this.type = type || 'UNKNOWN';
    this.params = data || {};
};

// 绑定数据并生成一个新的 NXT_Monitor 对象
NXT_Monitor.prototype.bindData = function () {
    // data 继承于 this.params
    var Midware = function () { };
    Midware.prototype = this.params;
    var data = new Midware();
    // 将参数中的对象列表复制到 data 上
    for (var i = 0; i < arguments.length; i++) {
        var object = arguments[i];
        for (var key in object) {
            data[key] = object[key];
        }
    }
    return new NXT_Monitor(this.type, data);
};

NXT_Monitor.prototype.bindType = function (type) {
    return new NXT_Monitor(type, this.params);
};

NXT_Monitor.prototype.bind = function () {
    var args = Array.prototype.slice.call(arguments);
    var type = typeof args[0] === 'string' ? args.shift() : this.type;
    // 与当前的 params 合并
    var data = this.bindData.apply(this, args).params;
    return new NXT_Monitor(type, data);
};

// send 方法定义 .send(type, args...)
NXT_Monitor.prototype.send = function () {
    // 与当前的 params 合并
    var sububt = this.bind.apply(this, arguments);
    var data = sububt.params;
    var type = data.type = sububt.type;
    var base;
    if (type === 'PV') {
        base = PV_RECEIVER;
        // 当 type 为 PV 时需要更新 pvhash
        Monitor.params.pvhash = GenerateUUID();
    } else {
        base = NONPV_RECEIVER;
    }
    // 将后续参数中的对象全部 extend 到 data 中
    for (var key in data) {
        var value = data[key];
        // 如果参数是一个函数则调用取结果，支持：.send({ name: func });
        if (typeof value === 'function') {
            data[key] = value();
        } else {
            // 消除原型引用
            data[key] = data[key];
        }
    }
    // debug
    if (document.cookie.match(/(?:; |^)Monitor=([^;]*)|$/)[1] === 'debug') {
        console.log(data);
    } else { // prod
        var queryString = encodeURIComponent(JSON.stringify(data));
        new Image().src = base + '?data=' + queryString;
    }
};

var Monitor = new NXT_Monitor('DEFAULT', new function () {
    var domain = /(?:[\w-]+\.)?[\w-]+$|$/i.exec(document.domain || '')[0];
    if (domain) {
        this.ssid = document.cookie.match(/(?:^|; )nxt_ssid=(.*?)(?:; |$)|$/)[1];
    } else {
        try {
            this.ssid = localStorage.getItem('nxt_ssid');
        } catch (error) {
            setTimeout(function () { throw error; });
        }
    }
    if (!this.ssid) {
        // 创建一个北京时间的日期字符串作为 ssid 的结尾（TODO: 客户端时间可能是不准确的）
        var t = new Date(new Date().getTime() + 480 * 60000);
        this.ssid = GenerateUUID() + '_' + [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()].join('-').replace(/\b\d\b/g, '0$&');
        if (domain) {
            document.cookie = 'nxt_ssid=' + this.ssid + '; Expires=Wed, 31 Dec 2098 16:00:00 GMT; Domain=' + domain + '; Path=/';
        } else {
            try {
                localStorage.setItem('nxt_ssid', this.ssid);
            } catch (error) {
                setTimeout(function () { throw error; });
            }
        }
    }
    this.timestamp = function () { return new Date().getTime().toString(36); };
});
/// === 核心(END) ===


/// === 监控加载时间(BEGIN) ===
var timing = function () {
    setTimeout(function () {
        var _timing = performance.timing;
        var keys = [
            'fetchStart',
            'connectEnd',
            'connectStart',
            'domComplete',
            'domContentLoadedEventEnd',
            'domContentLoadedEventStart',
            'domInteractive',
            'domLoading',
            'domainLookupEnd',
            'domainLookupStart',
            'loadEventEnd',
            'loadEventStart',
            'requestStart',
            'responseEnd',
            'responseStart'
        ];
        var data = {};
        for (var i = 0; i < keys.length; i++) {
            data[keys[i]] = _timing[keys[i]] - _timing.navigationStart;
        }
        Monitor.send('TIMING', data);
    });
};

if (window.performance && window.performance.timing) {
    BindEvent(window, 'load', timing);
}
/// === 监控加载时间(END) ===


/// === 监控错误(BEGIN) ===
var errorCache = {};
// 限制只发送 10 次
var limit = 10;
var sendMessage = function(message) {
  if(!message || errorCache[message] || limit <= 0) return;
  Monitor.send('JSERROR', { message: message });
  errorCache[message] = true;
  limit--;
};

if(window.addEventListener) {
  addEventListener('error', function(e) {
    sendMessage(e.error && e.error.stack);
  });
} else if(window.attachEvent) {
  attachEvent('onerror', function(msg, url, line) {
    sendMessage([msg, 'url: ' + url, 'line: ' + line].join('\r\n'));
  });
}
/// === 监控错误(END) ===


///  === 初始PV ===
var html = document.documentElement;
Monitor.send('PV', {
  resolution: Math.max(html.clientWidth, window.innerWidth || 0) + 'x' + Math.max(html.clientHeight, window.innerHeight || 0),
  location: location.href,
  referrer: document.referrer
});
///  === 初始PV(END) ===
