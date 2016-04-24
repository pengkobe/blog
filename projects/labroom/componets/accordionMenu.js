define('accordionMenu', [], function (require, exports, module) {
    $.fn.AccordionMenu = function (options) {
        var defaults = {
            selectable: true,
            //回调函数
            selectFunc: function () {  },
            tips: {
                collapseTip: '收起分支',
                expandTip: '展开分支',
                selectTip: '选择',
                unselectTip: '取消选择',
            }
        };
        // 选项
        options = $.extend(defaults, options);

        this.each(function () {

            var accordionMenu = $(this);
            $.each($(accordionMenu).find('ul > li'), function () {
                var that = $(this);
                var text;
                var url = '';
                if (that.is('li:has(ul)')) {
                    var children = that.find(' > ul');
                    $(children).remove();
                    text = that.text();

                    that.html('<span style="white-space:nowrap;" url="' + url + '"><a  style="display:inline-flex"></a> </span>');
                    that.find(' > span > a').text(text);
                  
                    $(this).append(children);
                }
                else {
                    text = that.text();

                    url = that.attr('url');
                    that.html('<span style="white-space:nowrap;padding:5px 0px 5px 0px;" url="' + url + '"><a style="display:inline-flex"></a> </span>');
                    
                    that.find(' > span > a').text(text);
                }
            });

            // 浮框提示
            $(accordionMenu).find('li:has(ul)').addClass('parent_li').find(' > span').attr('title', options.tips.collapseTip);

            // 收起/展开 .parent_li
            $(accordionMenu).delegate('li > span', 'click', function (e) {
                var that = $(this);
                url = that.attr('url');
              
                // 调用回调函数
                options.selectFunc(url);

                var children = that.parent('li.parent_li').find(' > ul > li');

                var li = that.parent();

                if (children.is(':visible')) {
                    children.hide('fast');
                    that.attr('title', options.tips.expandTip)

                    $(li).removeClass('li_selected');
                    $(li).parents('li.parent_li').removeClass('li_selected');
                    that.attr('title', options.tips.unselectTip);
                } else {
                    children.show('fast');
                    $(li).parent().siblings().find("ul>li").hide("fast");
                    that.attr('title', options.tips.collapseTip)
                    $(accordionMenu).find('li.li_selected').removeClass('li_selected');
                    $(li).addClass('li_selected');
                    $(li).parents('li.parent_li').addClass('li_selected');
                    $(li).parents('li.parent_li').children("span").css("background", "#222222");
                }

                e.stopPropagation();
            });

          

            // 获取选中项
            var getSelectedItems = function () {
                return $(accordionMenu).find('li.li_selected');
            };

            // 隐藏2级后的所有元素 (此处有优化空间) li.parent_li
            var children = $(accordionMenu).find('li.parent_li ').find(' > ul > li');

            // children.is(':visible')
             if (true) {
                 children.hide('fast');
                $(this).attr('title', options.tips.expandTip)
             }
        });
    };
});
