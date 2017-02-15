/**
 * MIT License
 * @author kobepeng <http://www.kobepeng.com>
 * @datetime 2016-1-16 10:24:42
 */
;
define(function (require, exports, module) {

    var loadData = require('treeList');
    var baseUrl = '/projects/labroom/snippets/';
    var moduleName = 'snippets';
    var id = "xxx";
    var data = [
        { level: 1, itemCode: 1, itemName: 'js', pCode: 0 },
        { level: 2, itemCode: 2, itemName: 'js_add_class', pCode: 1, url: baseUrl + 'js_add_class' },
        { level: 2, itemCode: 3, itemName: 'js_scroll_position', pCode: 1, url: baseUrl + 'js_scroll_position' },
        { level: 2, itemCode: 4, itemName: 'js_img_lazyload', pCode: 1, url: baseUrl + 'js_img_lazyload' },
        { level: 2, itemCode: 5, itemName: 'js_mini_jquery', pCode: 1, url: baseUrl + 'js_mini_jquery' },
        { level: 2, itemCode: 6, itemName: 'js_lib_ajax', pCode: 1, url: baseUrl + 'js_lib_ajax' },
        { level: 2, itemCode: 7, itemName: 'js_position_element', pCode: 1, url: baseUrl + 'js_position_element' },
        { level: 2, itemCode: 8, itemName: 'node_upload_file', pCode: 1, url: baseUrl + 'node_upload_file' },
    ];
    loadData(moduleName, id, data);
});
