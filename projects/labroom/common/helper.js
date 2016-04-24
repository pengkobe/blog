function deepCopy(sObj) {
    if (typeof sObj !== "object") {
        return sObj;
    }
    var s = {};
    if (sObj.constructor == Array) {
        s = [];
    }
    for (var i in sObj) {
        s[i] = this.deepCopy(sObj[i]);
    }
    return s;
}

// 游览器事件注册
function contains(p, c) {
    return p.contains ?
        p != c && p.contains(c) :
        !!(p.compareDocumentPosition(c) & 16);
}

function fixedMouse(e, target) {
    var related, type = e.type.toLowerCase();

    if (type == 'mouseover') {
        related = e.relatedTarget || e.fromElement
    } else if (type = 'mouseout') {
        related = e.relatedTarget || e.toElement
    } else return true;

    return related && related.prefix != 'xul' && !contains(target, related) && related !== target;
}

var addEvent = (function() {
    if (document.addEventListener) {
        return function(el, type, fn) {
            if (el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            } else {
                el.addEventListener(type, fn, false);
            }
        };
    } else {
        return function(el, type, fn) {
            if (el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            } else {
                el.attachEvent('on' + type, function() {
                    return fn.call(el, window.event);
                });
            }
        };
    }
})();



function getRelativePosition(evt) {
    var mouseX, mouseY;
    var e = evt.originalEvent || evt,
        canvas = evt.currentTarget || evt.srcElement,
        boundingRect = canvas.getBoundingClientRect();

    if (e.touches) {
        mouseX = e.touches[0].clientX - boundingRect.left;
        mouseY = e.touches[0].clientY - boundingRect.top;

    } else {
        mouseX = e.clientX - boundingRect.left;
        mouseY = e.clientY - boundingRect.top;
    }
    return {
        x: mouseX,
        y: mouseY
    };
}



//表单序列化插件
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//提取url中的参数
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//提取url中的参数 GetQueryString("参数名1");
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//获取页面大小 2014-08-21
function tb_getPageSize() {
    var de = document.documentElement;
    var w = window.innerWidth || self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    var h = window.innerHeight || self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    arrayPageSize = [w, h];
    return arrayPageSize;
}


//消息提示框 2014-08-21
function showMessage(options) {

    var divMessageID = "#divshowhtml";

    var html = '<div class="alert alert-' + options.type + '">';
    html = html + ' <button type="button" class="close" data-dismiss="alert">×</button>';
    html = html + ' ' + options.msg + '';
    html = html + '</div>';

    //create wapper
    if ($(divMessageID)[0] == null) {
        $("<div id='divshowhtml'></div>").appendTo(document.body).hide();
    }

    $(divMessageID).html(html);

    //set position
    var ps = tb_getPageSize();
    var w = ps[0];
    var h = ps[1];

    $(divMessageID).width(600);
    $(divMessageID).height(30);
    //div居中
    var w1 = $(divMessageID).width();
    var h1 = $(divMessageID).height();

    w = (w - w1) / 2;
    h = h - 40;

    $(divMessageID).css({ 'left': w, 'top': 3, 'position': 'absolute', 'z-index': '99999' });
    $(divMessageID).show();

    if (options.hide != null && options.hide == true) {
        $(divMessageID).fadeToggle(3000);
    }
}

(function($) {
    $.fn.extend({
        //错误信息处理插件:支持类型:success,error,info,block
        info: function(options) {
            var html = '<div class="alert alert-' + options.type + '">';
            html = html + ' <button type="button" class="close" data-dismiss="alert">×</button>';
            html = html + ' ' + options.msg + '';
            html = html + '</div>';
            //var object=$(html);
            this.html(html);
        }
    });
})(jQuery);


//ajax错误统一处理
var systemErrorFunction = function(response, textStatus, errorThrown, a, d) {
    var status = response.status;
    var title = "";
    var message = "";
    var model = { message: "", type: "", level: 1, title: "" };
    switch (status) {
        case 404:
            model.message = "无效的URL路径:\"" + this.url + "\".";
            model.title = "URL不正确";
            break;
        case 200:
            model.message = "加载数据时发生错误:" + response.responseText;
            model.title = "数据解析出错";
            break;
        case 0:
            model.message = '未能加载:"' + this.url + '"';
            model.title = "URL无响应";
            break;
        case -1:
            model.message = '网络链接超时!';
            model.title = "网络";
            model.level = 2;
            break;
        case 500:
            model = $.parseJSON(response.responseText);
            model.title = "系统错误";
            break;
        case 405:
            model.message = response.responseText;
            model.title = "系统错误";
            break;
    }
    if (model.level == 1) { model.icon = "warning" } //警告
    if (model.level == 2) { model.icon = "error" } //严重错误
    if (model.level == 3) { model.icon = "warning" } //警告
    if (status == 0 || status == 405) {
        return; }
    if (model.type != 1) {
        //$("#systeminfo").info({ msg: model.message, type: "error" });
        showMessage({ msg: model.message, type: "error" });
    } else {
        document.location = "login.htm";
    }
};
//$.ajaxSetup({ type: "POST", error: systemErrorFunction, timeout: 10000 });
