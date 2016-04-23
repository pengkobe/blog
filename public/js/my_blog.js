// 全局变量
var duoshuoName = "";

// 移动设备侦测
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var operation = {
    init: function() {
        if (title == '主页') {
            this.insertWeibo();
        }
        this.toTop();
        // 搜索自动补全
        this.autoComplete();
        // 文章导航
        this.menuIndex($('article'));
    },
    //实现搜索框自动提示(注意data属性不要配置)
    autoComplete: function() {
        var pr = { 
            id: 'searchdiv',
            //ajax请求的参数
            paraName: 'keyword',
            // 显示的文字的属性名
            textFiled: 'title',
            // 获取value的属性名
            valueFiled: 'title',
            //ajax请求的url
            url: '/autocomplete',
            showdivId: 'autodiv',
            select: function() {},
            style: {},
        };
        AutoComplete(pr);
    },
    insertWeibo: function() {
        var htmlStr = '<iframe width="220" height="350" class="share_self"';
        htmlStr += 'frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php';
        htmlStr += '?language=&width=200&height=350&fansRow=1&ptype=1&speed=0&skin=5&isTitle=1';
        htmlStr += '&noborder=1&isWeibo=1&isFans=0&uid=2656201077&verifier=1b82284c&dpc=1"></iframe>';
        if (!isMobile.any() && ($(window).width() > 992) && !$(".share_self").size()) {
            $(".weibo").css("background", "#ccc").append(htmlStr);
        }
        if (isMobile.any()) {
            $(".weibo").remove();
        }
    },
    // 回到顶部
    toTop: function() {
        var $toTop = $(".gotop");
        $toTop.fadeOut();
        $(window).on("scroll", function() {
            // 加上滚动条的高度;
            var scrollHeight = document.body.scrollHeight && document.body.clientWidth && window.screen.width;
            var height = $(window).height();
            height = height / scrollHeight * height;
            if (($(window).scrollTop() + height) >= $(window).height()) {
                $toTop.css("display", "block").fadeIn();
            } else {
                $toTop.fadeOut();
            }
        });

        $toTop.on("click", function(evt) {
            var $obj = $("body");
            $obj.animate({
                scrollTop: 0
            }, 240);
            evt.preventDefault();
        });
    },
    alertMsg: function(msg) {
        if (!msg) return;
        var $msg = $(".alertInfo").size() ? $(".alertInfo") : $("<div class='alertInfo'></div>").appendTo($("body"));
        $msg = $($msg);
        $msg.html(msg).css("right", "-9999").animate({
            right: 20
        }, 800);
        // 3s后消失
        clearTimeout(window._alert_timer);
        window._alert_timer = setTimeout(function() {
            $msg.animate({ right: -9999 }, 800);
        }, 3000);
    },
    // 显示欢迎信息[多说]
    welcome: function() {
        var self = this,
            visitor;

        function getNamefailed() {
            var histories = {},
                userinfo = {};
            try { histories = JSON.parse($.cookie("visitor_history")); } catch (e) {}
            for (var key in histories) {
                userinfo = {
                    name: key,
                    avatar: histories[key]
                }
            }
            if (userinfo.name && userinfo.avatar) {
                var htmlStr = makeHtml(userinfo.name, userinfo.avatar);
                self.alertMsg(htmlStr);
            }
        }

        function makeHtml(name, avatar) {
            return "热烈欢迎:" + "<img class='alert-avatar' src='" + avatar + "'>" + name;
        }

        if (visitor = $.cookie("visitor")) {
            visitor = visitor.split("|");
            if (visitor && visitor[0] && visitor[1]) {
                // 避免每次刷新都显示欢迎信息
                var htmlStr = makeHtml(visitor[0], visitor[1]);
                self.alertMsg(htmlStr);
                return;
            }
        }

        $.removeCookie("visitor");
        duoshuoName && $.ajax({
            url: "http://" + duoshuoName + ".duoshuo.com/api/threads/listPosts.jsonp?thread_key=/&require=visitor",
            dataType: "jsonp",
            timeout: 5000,
            success: function(data) {
                if (!(data && data.visitor && data.visitor.name && data.visitor.avatar_url)) {
                    getNamefailed();
                    return;
                }
                var name = data.visitor.name;
                var avatar = data.visitor.avatar_url;

                var htmlStr = makeHtml(name, avatar);
                self.alertMsg(htmlStr);

                // 目前登录人缓存半天
                $.cookie("visitor", name + "|" + avatar, {
                    expires: 0.25,
                    path: "/"
                });

                // 缓存历史登录者
                var histories = $.cookie("visitor_history");
                try {
                    histories = JSON.parse(histories);
                } catch (e) {
                    histories = {};
                }
                histories[name] = avatar;
                try {
                    $.cookie("visitor_history", JSON.stringify(histories), {
                        expires: 100,
                        path: "/"
                    });
                } catch (e) {}
            },
            error: function() {
                getNamefailed();
            }
        });
    },
    cookieHelper: {
        SetCookie: function(name, value) {
            var argv = arguments;
            var argc = arguments.length;
            var expires = (2 < argc) ? argv[2] : null;
            var path = (3 < argc) ? argv[3] : null;
            var domain = (4 < argc) ? argv[4] : null;
            var secure = (5 < argc) ? argv[5] : false;
            document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
        },
        GetCookie: function(Name) {
            var search = Name + "=";
            var returnvalue = "";
            if (document.cookie.length > 0) {
                offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    end = document.cookie.indexOf(";", offset);
                    if (end == -1)
                        end = document.cookie.length;
                    returnvalue = unescape(document.cookie.substring(offset, end));
                }
            }
            return returnvalue;
        }
    },
    // 目录导航树
    menuIndex: function($obj) {
        if (!/\/p\//.test(window.location.href)) {
            return;
        }

        if ($('h3', $obj).length > 2 && !isMobile.any()) {
            var h3 = [],
                h4 = [],
                tmpl = '<ul>',
                h3index = 0;

            $.each($('h3,h4', $obj), function(index, item) {
                if (item.tagName.toLowerCase() == 'h3') {
                    var h3item = {};
                    h3item.name = $(item).text();
                    h3item.id = 'menuIndex' + index;
                    h3.push(h3item);
                    h3index++;
                } else {
                    var h4item = {};
                    h4item.name = $(item).text();
                    h4item.id = 'menuIndex' + index;
                    if (!h4[h3index - 1]) {
                        h4[h3index - 1] = [];
                    }
                    h4[h3index - 1].push(h4item);
                }
                item.id = 'menuIndex' + index
            });

            //添加h1
            tmpl += '<li class="h1"><a href="#" data-top="0">' + $('h1').text() + '</a></li>';

            for (var i = 0; i < h3.length; i++) {
                tmpl += '<li><a href="#" data-id="' + h3[i].id + '">' + h3[i].name + '</a></li>';
                if (h4[i]) {
                    for (var j = 0; j < h4[i].length; j++) {
                        tmpl += '<li class="h4"><a href="#" data-id="' + h4[i][j].id + '">' + h4[i][j].name + '</a></li>';
                    }
                }
            }
            tmpl += '</ul>';

            $('body').append('<div id="menuIndex"></div>');
            $('#menuIndex').append($(tmpl)).delegate('a', 'click', function(e) {
                e.preventDefault();
                var scrollNum = $(this).attr('data-top') || $('#' + $(this).attr('data-id')).offset().top;
                $('body, html').animate({ scrollTop: scrollNum - 30 }, 400, 'swing');
            });
            $(window).load(function() {
                var scrollTop = [];
                $.each($('#menuIndex li a'), function(index, item) {
                    if (!$(item).attr('data-top')) {
                        var top = $('#' + $(item).attr('data-id')).offset().top;
                        scrollTop.push(top);
                        $(item).attr('data-top', top);
                    }
                });

                var waitForFinalEvent = (function() {
                    var timers = {};
                    return function(callback, ms, uniqueId) {
                        if (!uniqueId) {
                            uniqueId = "Don't call this twice without a uniqueId";
                        }
                        if (timers[uniqueId]) {
                            clearTimeout(timers[uniqueId]);
                        }
                        timers[uniqueId] = setTimeout(callback, ms);
                    };
                })();
                $(window).scroll(function() {
                    waitForFinalEvent(function() {
                        var nowTop = $(window).scrollTop(),
                            index, length = scrollTop.length;
                        if (nowTop + 60 > scrollTop[length - 1]) {
                            index = length
                        } else {
                            for (var i = 0; i < length; i++) {
                                if (nowTop + 60 <= scrollTop[i]) {
                                    index = i
                                    break;
                                }
                            }
                        }
                        $('#menuIndex li').removeClass('on')
                        $('#menuIndex li').eq(index).addClass('on')
                    })
                });
            });

            //用js计算屏幕的高度
            $('#menuIndex').css('max-height', $(window).height() - 80);
        }
    },
}


$(function() {
    operation.init();
    // 显示欢迎消息
    duoshuoName = $(".ds-thread").attr("data-name");
    window.duoshuoQuery = { short_name: duoshuoName };
    if (window.duoshuoQuery.short_name) {
        $.getScript((document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js', function() {
            operation.welcome();
        });
    } else {
        operation.welcome();
    }

    $(".close-weibo").on('click', function() {
        $(this).parent().hide();
    });
    // 设置皮肤
    var skin = operation.cookieHelper.GetCookie('skin');
    if (skin == "white") {
        document.body.style.background = "white";
    }
    $(".white").on('click', function() {
        document.body.style.background = "white";
        operation.cookieHelper.SetCookie('skin', 'white');
    });
    $(".yellow").on('click', function() {
        document.body.style.background = "#f5f5d5";
        operation.cookieHelper.SetCookie('skin', 'yellow');
    });
});
