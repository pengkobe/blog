;
define(function(require, exports, module) {
    // 加载插件
    require("accordionMenu");
    // 生成单个图
    function GenerateSingleChart(data, moduleName) {
        var datalen = data.length;

        // 字符串拼接构造导航树
        var htmlStr = '';
        for (var i = 0; i < datalen; i++) {
            var d = data[i];
            if (d.level == 1) {
                htmlStr += '<ul><li url="' + d.url + '">' + d.itemName;
                htmlStr += getItemRecursively(data, d.itemCode);
                htmlStr += '</li></ul>';
            }
        }

        $('#' + moduleName + ' > .menu').empty().append(htmlStr).AccordionMenu({
            addable: false,
            editable: false,
            deletable: false,
            selectFunc: function(url) {
                if (url == undefined || url == "" || url == "null") {
                    return;
                }
                var filename = url.split('\/');
                if (url == "") {
                    return; }
                // 页头
                $('#' + moduleName + '  .page-name').text(name);
                // 1
                url = url + ".html?d=" + new Date();

                var $content = $('#' + moduleName + '  .page-content');
                $content.html("正在加载...");

                // 异步加载
                $.ajax({
                    type: "get",
                    url: url,
                    beforeSend: function(XMLHttpRequest) {},
                    success: function(data, textStatus) {
                        $content.html(data);
                        seajs.use(filename[filename.length - 1], function(fun) {
                            if(fun && typeof fun =="function"){
                                 fun();
                            }
                        });
                    },
                    complete: function(XMLHttpRequest, textStatus) {},
                    error: function() { $content.html("请求出错!"); }
                });
            }
        });
    }

    function getItemRecursively(data, itemCode) {
        var retStr = '';
        var aa = "";
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (d.pCode == itemCode) {
                aa = '<ul>';
                retStr += '<li url="' + d.url + '">' + d.itemName;
                // hack，可以防止函数名被修改引起的误调
                retStr += arguments.callee.call(this, data, d.itemCode);;
                retStr += '</li>';
            }
        }
        if (aa != '') {
            retStr = aa + retStr;
            retStr = retStr + '</ul>'
        }
        return retStr;
    }

    /*
       @baseUrl : 基准地址
       @moduleName: 模块名称
       @id:模块编号
    */
    function loadData(moduleName, id, data) {
        GenerateSingleChart(data, moduleName);
    }
    module.exports = loadData;
});
