/**
 * MIT License
 * @author kobepeng <http://www.kobepeng.com>
 * @datetime 2016-1-16 10:24:42
 */
;
define(function(require, exports, module) {

    var loadData = require('treeList');
    var baseUrl = '/projects/labroom/snippets/';
    var moduleName = 'snippets';
    var id = "xxx";

    var data = [
        { level: 1, itemCode: 1, itemName: 'js', pCode: 0 },
        { level: 2, itemCode: 2, itemName: 'js_add_class', pCode: 1, url: baseUrl+'js_add_class' },
    ];
    loadData(moduleName, id, data);
});
