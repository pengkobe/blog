/**
 * MIT License
 * @author kobepeng <http://www.kobepeng.com>
 * @datetime 2016-1-16 10:24:42
 */
;
define(function(require, exports, module) {
    var loadData = require('treeList');
    var baseUrl = '/projects/labroom/case_study/';
    var moduleName = 'case_study';
    var id = "xxx11";

    var data = [
        { level: 1, itemCode: 1, itemName: '抽奖转盘',  url: baseUrl + 'zhuanpan' },
        { level: 1, itemCode: 2, itemName: 'web组件',  url: baseUrl + 'web_components' },

    ];
    loadData(moduleName, id, data);
});
