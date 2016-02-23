// 移动设备侦测
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    }
    ,BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    }
    ,iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }
    ,Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    }
    ,Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    }
    ,any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var operation={
	init:function(){
		this.insertWeibo();
        this.toTop();
        // 暂未启用$.cookie
        //this.welcome();
	},
	insertWeibo: function(){
        var htmlStr = '<iframe width="220" height="350" class="share_self"  frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=200&height=350&fansRow=1&ptype=1&speed=0&skin=5&isTitle=1&noborder=1&isWeibo=1&isFans=0&uid=2656201077&verifier=1b82284c&dpc=1"></iframe>';
        if(!isMobile.any()  && ($(window).width() > 992) && !$(".share_self").size()){
                $(".weibo").css("background", "#777").append(htmlStr);
        }
        if(isMobile.any()) {
            $(".weibo").remove();
       }
    },
    // 回到顶部
    toTop: function(){
        var $toTop = $(".gotop");
        $toTop.fadeOut();
        $(window).on("scroll", function(){
            // 加上滚动条的高度;
            var scrollHeight =  document.body.scrollHeight && document.body.clientWidth && window.screen.width;
            var height = $(window).height();
            height = height/scrollHeight * height;
            if(($(window).scrollTop()+height) >= $(window).height()){
                $toTop.css("display", "block").fadeIn();
            } else {
                $toTop.fadeOut();
            }
        });

        $toTop.on("click", function(evt){
            var $obj = $("body");
            $obj.animate({
                scrollTop: 0
            }, 240);
            evt.preventD
            efault();
        });
    },
    alertMsg: function(msg){
        if(!msg) return;
        var $msg = $(".alertInfo").size() ? $(".alertInfo") : $("<div class='alertInfo'></div>").appendTo($("body"));
        $msg = $($msg);
        $msg.html(msg).css("right", "-9999").animate({
            right: 20
        }, 800);
        // 3s后消失
        clearTimeout(window._alert_timer);
        window._alert_timer = setTimeout(function(){
            $msg.animate({right: -9999}, 800);
        }, 3000);
    },
    // 显示欢迎信息[多说]
    welcome: function(){
        var self = this, visitor;

        function getNamefailed(){
            var histories = {}, userinfo = {};
            try{ histories = JSON.parse($.cookie("visitor_history")); }catch(e){}
            for(var key in histories){
                userinfo = {
                    name: key,
                    avatar: histories[key]
                }
            }
            if(userinfo.name && userinfo.avatar){
                var htmlStr = makeHtml(userinfo.name, userinfo.avatar);
                self.alertMsg(htmlStr);
            }
        }

        function makeHtml(name, avatar){
            return "<img class='alert-avatar' src='" + avatar + "'>" + name + ", 欢迎回来~";
        }

        if(visitor = $.cookie("visitor")) {
            visitor = visitor.split("|");
            if(visitor && visitor[0] && visitor[1]){
                 var htmlStr = makeHtml(visitor[0], visitor[1]);
                 self.alertMsg(htmlStr);
                return;
            }
        }

        $.removeCookie("visitor");
        duoshuoName && $.ajax({
          url: "http://" + duoshuoName +".duoshuo.com/api/threads/listPosts.jsonp?thread_key=/&require=visitor",
          dataType: "jsonp",
          timeout: 5000,
          success: function(data){
            if(!(data && data.visitor && data.visitor.name && data.visitor.avatar_url)) {
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
            try{
                histories = JSON.parse(histories);
            }catch(e){
                histories = {};
            }
            histories[name] = avatar;
            try{
                $.cookie("visitor_history", JSON.stringify(histories), {
                    expires: 100,
                    path: "/"
                });
            }catch(e){}
          },
          error: function(){
            getNamefailed();
          }
        });
    },
    cookieHelper:{
         SetCookie:function(name, value) {
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
    }
}


$(function(){
    operation.init();
    $(".close-weibo").on('click',function(){
        $(this).parent().hide();
    });
    // 设置皮肤
    var skin = operation.cookieHelper.GetCookie('skin');
    if(skin=="white"){
        document.body.style.background="white";
    }
    $(".white").on('click',function(){
        document.body.style.background="white";
        operation.cookieHelper.SetCookie('skin','white');
    });
    $(".yellow").on('click',function(){
        document.body.style.background="#f5f5d5";
        operation.cookieHelper.SetCookie('skin','yellow');
    });
});

