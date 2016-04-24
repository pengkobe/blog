;
define(function(require, exports, module) {
 //先把DOM存起来，以后就不用再重新请求了,节省资源。
    var eleCircle = document.querySelector("#centerCircle");
    //获取圆心。注意，这里读的是CSS样式表中定义的样式
    var centerX = GetCircleStyle("left") + GetCircleStyle("width") / 2;
    var centerY = GetCircleStyle("top") + GetCircleStyle("height") / 2;
    //触摸事件，有些人会用鼠标事件，但鼠标事件比触摸事件慢，大概是300毫秒。300毫秒的延迟的原因，是因为浏览器需要判断你是否需要双击缩放网页。在后期的chrome版本中，如果在META信息中规定网页满屏展示（如viewport的宽度小于或等于物理设备的宽度），并不允许放大，可以消除鼠标300毫秒的延时，这点我没验证过。
    eleCircle.addEventListener('touchstart', Start, false);
    eleCircle.addEventListener('touchmove', Move, false);
    eleCircle.addEventListener('touchend', End, false);

    var touchStartX = touchStartY = 0,
        touchMoveX = touchMoveY = 0;
    // 这里定义两个向量，用于计算角度和顺逆时针
    var vectorStart = {
            x: 0,
            y: 0
        },
        vectorEnd = {
            x: 0,
            y: 0
        };

    function Start(e) {
        e.preventDefault();
        touchStartX = e.touches[0].pageX;
        touchStartY = e.touches[0].pageY;
        vectorStart.x = touchStartX - centerX;
        vectorStart.y = touchStartY - centerY;
    }
    var rotateDeg = 0;
    var startDeg = 0;

    function Move(e) {
        // 阻止浏览器默认行为。不然在滚动转盘时，会让整个页面滚动。
        e.preventDefault();
        touchMoveX = e.touches[0].pageX;
        touchMoveY = e.touches[0].pageY;
        vectorEnd.x = touchMoveX - centerX;
        vectorEnd.y = touchMoveY - centerY;
        //旋转角度=(开始向量和当前向量的夹角)*(是否是顺时针转)
        rotateDeg = (RadianToDeg(CalcDeg(vectorStart, vectorEnd))) * (((vectorStart.x * vectorEnd.y - vectorStart.y * vectorEnd.x) < 0) ? -1 : 1);
        //使用CSS3来进行旋转
        eleCircle.style.webkitTransform = "rotateZ(" + (startDeg + rotateDeg) + "deg)";
    }

    function End(e) {
        // 存入当前角度
        startDeg = startDeg + rotateDeg;
        rotateDeg = 0;
    }
    // 依据向量计算弧度
    function CalcDeg(vectorStart, vectorEnd) {
        var cosDeg = (vectorStart.x * vectorEnd.x + vectorStart.y * vectorEnd.y) / (Math.sqrt(Math.pow(vectorStart.x, 2) + Math.pow(vectorStart.y, 2)) * Math.sqrt(Math.pow(vectorEnd.x, 2) + Math.pow(vectorEnd.y, 2)));
        return Math.acos(cosDeg);
    }

    function GetCircleStyle(attr) {
        return GetNum(GetStyle(eleCircle, attr))
    }
    // 取得对象的最终CSS属性，这个最终是指浏览器自动计算的结果。
    function GetStyle(obj, prop) {
        if (obj.currentStyle) //IE
        {
            return obj.currentStyle[prop];
        } else if (window.getComputedStyle) //非IE
        {
            propprop = prop.replace(/([A-Z])/g, "-$1");
            propprop = prop.toLowerCase();
            return document.defaultView.getComputedStyle(obj, null)[propprop];
        }
        return null;
    }
    // 从CSS属性值(如10px)中取到数值(如10)，以便计算
    function GetNum(str) {
        return parseInt(str.replace("px", ""));
    }
    // 弧度转换为角度。因为Math.acos得到的是弧度，但CSS3 rotate需要角度
    function RadianToDeg(radian) {

        return 180 / Math.PI * radian;
    }
});
