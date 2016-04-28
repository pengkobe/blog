/**
 * MIT License
 * @author kobepeng <http://www.kobepeng.com>
 * @datetime 2016-1-16 10:24:42
 * based on Raphael.js
 */
;
define(function(require, exports, module) {

    // exports to global
    //umd("raphael_charts", charts);
    function init() {
        new dashChart({});
    }
    module.exports = init;

    // charts Component
    function dashChart(opts) {
        var self = this;
        this.defaultOpts = {
            domId: "dash_chart",
            defaultAngle: 0,
            label: '',
            value: '78',
            unit: '',
            total: '100',
            // svg size
            width: 280,
            height: 280,
            // background picture
            img: '/public/img/favicon.ico',
            imgWidth: 100,
            imgHeight: 100,
            //data group
            dataArray: [{ startAngle: 0, endAngle: 90, color: '#565656' },
                { startAngle: 90, endAngle: 240, color: '#00ff00' },
                { startAngle: 240, endAngle: 290, color: '#FFD700' },
                { startAngle: 290, endAngle: 360, color: '#ff0000' }
            ],
            // data range
            range: { start: 0, end: 100 },
            // cicle style
            startAngle: 30,
            endAngle: 330,
        };
        this.opts = extend({}, [this.defaultOpts, opts]);
        this.init();
    };

    // init, bind event
    dashChart.prototype.init = function() {
        var option = this.opts;
        var _self = this;
        // 属性转换
        option.range.start = 30 + (option.range.start / option.total * 300);
        option.range.end = 30 + (option.range.end / option.total * 300);

        // initial
        var r = Raphael(option.domId, option.width, option.height );

        r.circle(option.width / 2, option.height / 2 - 5, option.height/2-35).attr({
            "fill-opacity": 0,
            "stroke-width": 2,
             stroke: "#91DEEC"
        });

        r.circle(option.width / 2, option.height / 2 - 5, option.height/2-10).attr({
            "fill-opacity": 0,
            "stroke-width": 1,
            stroke: "#777"
        });

         _self.addCustomerAttribute(r,"#111");
         var radius = option.height / 2 - 50;
          // outer cicle
        r.path().attr({
            stroke: "#000",
            "stroke-width": 1
        }).attr({
            arc: [10, 12, radius]
        }).attr({ transform: 'R210' });


        // the pointer
        var circleColor = '#1E90FF';
        option.value == '' ? 0 : option.value;
        var position = 30 + option.value / option.total * 300;
        var y_position = option.height - 23;
        var dataArrLength = option.dataArray.length;
        // 小球指针颜色
        for (var i = 0; i < dataArrLength; i++) {
            var dataModel = option.dataArray[i];
            if (dataModel.startAngle < position && dataModel.endAngle > position) {
                circleColor = dataModel.color;
            }
        }

        var range = option.range;
        if (position > range.start && position < range.end) {
            y_position = radius - 20;
        }
        // 画小球指针圆边框
        r.circle(option.width / 2, y_position, 4).attr({
            fill: circleColor,
            "fill-opacity": .5,
            "stroke-width": 0,
            transform: "r" + position + " " + option.width / 2 + " " + option.height / 2
        });

        // 圆心图
        var img = r.image(option.img, option.width / 2 - option.imgWidth / 2,
            option.height / 2 - option.imgHeight / 2, option.imgWidth, option.imgHeight);

        _self.render(r,radius);

        _self.drawText(r, circleColor);
    }

    // add customer attribute to Raphael
    dashChart.prototype.addCustomerAttribute = function(r ,color) {
        var option = this.opts;
        r.customAttributes.arc = function(value, total, R) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = option.width / 2 + R * Math.cos(a),
                y = option.height / 2 - R * Math.sin(a),
                path;
            if (total == value) {
                // path = [
                //     ["M", option.width / 2, option.height / 2 - R],
                //     ["A", R, R, 0, 1, 1, option.width / 2, option.height / 2-R]
                // ];
            } else {
                path = [
                    ["M", option.width / 2, option.height / 2 - R],
                    ["A", R, R, 0, +(alpha > 180), 1, x, y]
                ];
            }
            return { path: path, stroke: color };
        };
    };

    dashChart.prototype.drawText = function(r, circleColor) {
        var option = this.opts;
        r.text(option.width / 2, option.height - 32, option.label).attr({
            font: "16px Fontin-Sans, Arial",
            fill: "#ccc",
            "text-anchor": "middle"
        });
        r.text(option.width / 2 + 42, option.height - 55, option.unit).attr({
            font: "16px Fontin-Sans, Arial",
            fill: "#ccc",
            "text-anchor": "middle"
        });
        r.text(option.width / 2, option.height - 55,
            parseFloat(option.value).toFixed(1)).attr({
            font: "27px Fontin-Sans, Arial",
            fill: circleColor,
            "text-anchor": "middle"
        });
    };

    dashChart.prototype.render = function(r,radius) {
        var option = this.opts;

        var angle = option.defaultAngle;
        var startAngle = option.startAngle;
        var endAngle = option.endAngle;

        var width = option.width;
        var height = option.height;

        var range = option.range;

        var c, t;
        while (angle < 360) {
            if (angle <= startAngle || angle > endAngle) {
                angle += 3;
            } else {
                var dataArray = option.dataArray;
                var dataLength = dataArray.length;

                for (var i = 0; i < dataLength; i++) {
                    if (dataArray[i].startAngle <= angle && dataArray[i].endAngle > angle) {
                        c = dataArray[i].color;
                        t = "r" + angle + " " + width / 2 + " " + height / 2;
                        if (range.start < angle && range.end > angle) {
                            // highlight area
                            r.rect(width / 2, height/2+radius - 12, 0.8, 10).attr({
                                stroke: c,
                                fill: c,
                                transform: t,
                                "fill-opacity": .4,
                                "stroke-opacity": 0.8
                            });
                        } else {
                            r.rect(width / 2, height/2+radius - 12, 0.05, 10).attr({
                                stroke: c,
                                fill: c,
                                transform: t,
                                "fill-opacity": .4,
                                "stroke-opacity": 0.1
                            });
                        }
                    }
                }
                angle += 5;
            }
        }
    };


    // js event register
    function addEventListener(evt, fn) {
        window.addEventListener ? this.addEventListener(evt, fn, false) : (window.attachEvent) ? this.attachEvent('on' + evt, fn) : this['on' + evt] = fn;
    }

    // combine properties
    function extend(des, src) {
        if (src instanceof Array) {
            for (var i = 0, len = src.length; i < len; i++)
                extend(des, src[i]);
        }
        for (var i in src) {
            des[i] = src[i];
        }
        return des;
    }

    // UMD(barrentlee)
    function umd(name, component) {
        switch (true) {
            case typeof module === 'object' && !!module.exports:
                module.exports = component;
                break;
            case typeof define === 'function' && !!define.amd:
                define(name, function() {
                    return component;
                });
                break;
                // 支持seajs(kobepeng)
            case typeof define === 'function' && !!define.cmd:
                define(name, function(require, exports, module) {
                    return module.exports = component;
                });
                break;
            default:
                try { /* Fuck IE8- */
                    if (typeof execScript === 'object') execScript('var ' + name);
                } catch (error) {}
                window[name] = component;
        }
    };

});
