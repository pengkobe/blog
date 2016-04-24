/**
 * MIT License
 * @author kobepeng <http://www.kobepeng.com>
 * @datetime 2016-1-16 10:24:42
 */
;
define(function(require, exports, module) {
    var loadData = require('treeList');
    var baseUrl = '/projects/labroom/jquery_plugins/';
    var moduleName = 'jquery_plugins';
    var id = "xxx1111";

    var data = [
        { level: 1, itemCode: 1, itemName: '自适应日历',  url: baseUrl + 'calendar' },
        { level: 1, itemCode: 2, itemName: '多功能表格',  url: baseUrl + 'datatable' }
    ];
    loadData(moduleName, id, data);
});
