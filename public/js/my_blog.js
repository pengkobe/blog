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
	},
	insertWeibo: function(){
        var htmlStr = '<iframe width="220" height="350" class="share_self"  frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=200&height=350&fansRow=1&ptype=1&speed=0&skin=5&isTitle=1&noborder=1&isWeibo=1&isFans=0&uid=2656201077&verifier=1b82284c&dpc=1"></iframe>';
        if(!isMobile.any()  && ($(window).width() > 992) && !$(".share_self").size()){
                $(".weibo").css("background", "#777").append(htmlStr);
        }
        if(isMobile.any()) {
            $(".weibo").remove();
       }
    }
}

// 等图片资源加载完成后
$(window).on("load", function(){
    operation.init();
});