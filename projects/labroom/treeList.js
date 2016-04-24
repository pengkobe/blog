; define(function (require, exports, module) {
	// 加载插件
    require("accordionMenu");

    // 生成单个图
    function GenerateSingleChart(data, baseUrl, moduleName) {
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
            selectFunc: function (url) {
                if(url==undefined || url=="" || url=="null" ){
                    return;
                }
                var filename = url.split('\/');
                url = baseUrl + url;

                if (url == "") { return; }
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
                    beforeSend: function (XMLHttpRequest) { },
                    success: function (data, textStatus) {
                        $content.html(data);
                        seajs.use(filename[filename.length-1], function (fun) {
                            fun();
                        });
                    },
                    complete: function (XMLHttpRequest, textStatus) { },
                    error: function () { $content.html("请求出错!"); }
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
                retStr += '<li url="' + d.url+ '">' + d.itemName;
				// hack，防止函数名被修改引起的误调
                retStr += arguments.callee.call(this,data, d.itemCode);;
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
    function loadData(baseUrl, moduleName,id) {
                var data = [
                    { level: 1, itemCode: 1, itemName: 'raphael.js', pCode: 0 },
                    { level: 2, itemCode: 2, itemName: '中国地图', pCode: 1, url:'svgmap/svgmap'  },
                    { level: 2, itemCode: 3, itemName: '仪表盘', pCode: 1 ,url:'dashchart' },
				    { level: 2, itemCode: 4, itemName: '柱状图', pCode: 1 ,url:'barchart' },
				    { level: 2, itemCode: 4, itemName: '散点图', pCode: 1 ,url:'scatterchart' },
                ];

                GenerateSingleChart(data, baseUrl, moduleName);
    }
    module.exports = loadData;
});
