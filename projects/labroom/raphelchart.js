/**
 * MIT License
 * @author kobepeng <http://www.kobepeng.com>
 * @datetime 2016-1-16 10:24:42
 */
;
define(function(require, exports, module) {

    var loadData = require('treeList');
    var baseUrl = '/projects/labroom/raphelchart/';
    var moduleName = 'raphelchart';
    var id = "xxx";

    var data = [
        { level: 1, itemCode: 1, itemName: 'raphael.js', pCode: 0 },
        { level: 2, itemCode: 2, itemName: '中国地图', pCode: 1, url: baseUrl+'svgmap' },
        { level: 2, itemCode: 3, itemName: '仪表盘', pCode: 1, url: baseUrl+'dashchart' },
        { level: 2, itemCode: 4, itemName: '柱状图', pCode: 1, url: baseUrl+'barchart' },
        { level: 2, itemCode: 4, itemName: '散点图', pCode: 1, url: baseUrl+'scatterchart' },
    ];
    loadData(moduleName, id, data);
});
