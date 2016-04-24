/****
a calendar based on jquery
author:kobepeng
link：yipeng.info
*****/
;
define(function(require, exports, module) {;
    (function($) {
        $.fn.extend({
            //日历插件
            calendarPart: function(options) {
                $.fn.calendarPart.buildHtml($(this));
                $.fn.calendarPart.bindEvents($(this));
            }
        });

        //加载数据
        $.fn.calendarPart.buildHtml = function(me) {
            var butHtml = '';
            butHtml += ' <div style="width:275px;height:40px;padding-top:10px;text-align:center;padding-left:105px;">';
            butHtml += ' <span class="glyphicon glyphicon-menu-left calendarTitle" aria-hidden="true"></span>';
            butHtml += ' <a class="monthText" style="margin-left:10px;display:block;float:left;font-size:16px;cursor:pointer;color:#737373">2015/6</a>';
            butHtml += ' <span class=" glyphicon glyphicon-menu-right calendarTitle" aria-hidden="true"></span>';
            butHtml += '</div>';
            me.append(butHtml);

            var html = "<div class='calendar'>";
            for (var i = 0; i < 35; i++) {
                html = html + "<div class='calendar_day'>&nbsp;</div>";
            }
            html = html + "</div>";

            me.append(html);
        }

        //加载数据
        $.fn.calendarPart.bindEvents = function(me) {
            //鼠标移动事件
            me.find(".calendar_day").hover(function() {
                    var className = me.hasClass("calendar_currday") ? "calendar_currdayMouseOn" : "calendar_otherdayMouseOn";
                    me.addClass(className);
                },
                function() {
                    var className = me.hasClass("calendar_currday") ? "calendar_currdayMouseOn" : "calendar_otherdayMouseOn";
                    me.removeClass(className);
                });

            //显示图日历
            me.date = new Date();
            var currDate = me.date.getFullYear() + "-" + (me.date.getMonth() + 1) + "-01";

            //向前向后移动
            me.find(".glyphicon-menu-left").bind("click", function() {
                if (me.isLoading) {
                    return; }
                currDate = $.fn.calendarPart.addMoth(currDate, -1);
                me.date = new Date(currDate);
                $.fn.calendarPart.setMonth(currDate.split('-')[0], currDate.split('-')[1], me);
                $.fn.calendarPart.loadData(me);
            });
            me.find(".glyphicon-menu-right").bind("click", function() {
                if (me.isLoading) {
                    return; }
                currDate = $.fn.calendarPart.addMoth(currDate, 1);
                me.date = new Date(currDate);
                $.fn.calendarPart.setMonth(currDate.split('-')[0], currDate.split('-')[1], me);
                $.fn.calendarPart.loadData(me);
            });

            //设置月份
            $.fn.calendarPart.setMonth(me.date.getFullYear(), (me.date.getMonth() + 1), me);
            //加载数据
            $.fn.calendarPart.loadData(me);
            // 单击日期
            me.find(".calendar_day ").bind("click", function() {
                alert('单击日期');
            });
            // 单击月份
            me.find(".monthText ").bind("click", function() {
                alert('单击月份!');
            });
        }

        //加载数据
        $.fn.calendarPart.loadData = function(me) {
            me.isLoading = true;
            setTimeout(function() {
                me.isLoading = false;
            }, 1000);
            return;
        }

        //月份加减
        $.fn.calendarPart.addMoth = function(d, m) {
            var ds = d.split('-'),
                _d = ds[2] - 0;
            var nextM = new Date(ds[0], ds[1] - 1 + m + 1, 0);
            var max = nextM.getDate();
            d = new Date(ds[0], ds[1] - 1 + m, _d > max ? max : _d);
            //safari浏览器
            if (/webkit/.test(navigator.userAgent.toLowerCase())) {
                return d.getFullYear() + "-" + (d.getMonth() + 1) + "-01";
            }
            d = d.toLocaleDateString().match(/\d+/g).join('-');
            return d;
        }

        //转到指定月份
        $.fn.calendarPart.setMonth = function(year, month, me) {
            $(".calendar").find(".calendar_day:gt(34)").remove();
            var curMonth = new Date(year, month - 1, 1);
            var curDate = new Date(year, month - 1, 1);
            var weekDay = curDate.getDay();

            curDate.setDate(curDate.getDate() - weekDay);
            me.find(".monthText").html(year + "-" + (month < 10 ? ("0" + month) : month));

            var divs = me.find(".calendar_day");

            $.each(divs, function(index, obj) {
                var that = $(this);
                var date = curDate.getFullYear() + "-" + (curDate.getMonth() + 1) + "-" + curDate.getDate();
                that.html("<a>" + curDate.getDate() + "</a>");
                that.attr("day", curDate.getDate()).attr("price", "").attr("date", date);
                that.show().css({ "visibility": "visible" });
                // 今天
                if (curDate.getDate() == new Date().getDate() && curDate.getMonth() == new Date().getMonth() && curDate.getFullYear() == new Date().getFullYear()) {
                    that.addClass('calendar_currday').removeClass('calendar_otherday');
                } else {
                    that.addClass('calendar_otherday');
                }
                // 非本月
                if (curDate.getMonth() != (month - 1)) {
                    that.css({ "visibility": "hidden" });
                }
                curDate.setDate(curDate.getDate() + 1);
            });

            var LastDate = new Date($(".calendar").children(":last").attr("date").replace(/-/g, "/"));
            var MaxDate = new Date((year + '-' + month + '-' + new Date(year, month, 0).getDate()).replace(/-/g, "/"));

            if (LastDate < MaxDate) {
                for (var i = 0; i <= new Date(year, month, 0).getDate() - $(".calendar").children(":last").attr("day"); i++) {

                    var date = curDate.getFullYear() + "-" + (curDate.getMonth() + 1) + "-" + curDate.getDate();
                    var appendHTML = "<div class='calendar_day ";
                    var dateNow = new Date();
                    if (curDate.getDate() == dateNow.getDate() && curDate.getMonth() == dateNow.getMonth() && curDate.getFullYear() == dateNow.getFullYear()) {
                        appendHTML += "calendar_currday'";
                    } else {
                        appendHTML += "calendar_otherday'";
                    }
                    // 隐藏非本月日期框
                    if (curDate.getMonth() != (month - 1)) {
                        appendHTML += "style='visibility: hidden'";
                    }
                    appendHTML += " day=" + curDate.getDate() + " date=" + date + " price=''><a>" + curDate.getDate() + "</a></div>";

                    curDate.setDate(curDate.getDate() + 1);

                    $(".calendar").append(appendHTML).prev().css({ "height": "35px" });
                    $(".calendar_day").css({ "height": "30px" });
                }

            } else {
                $(me).find(".calendar_day").css({ "height": "34px" });
                $(".calendar").prev().css({ "height": "40px" });
            }
        }
    })(jQuery);

    module.exports = function(){
        $("#calendarDiv").calendarPart();
    }
});

