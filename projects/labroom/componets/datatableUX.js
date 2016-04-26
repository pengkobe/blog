/****
dataTableUX:based on jquery-datatables
&& dataTables.tableTools
author:kobepeng
*****/
(function (window, document, undefined) {
    (function (factory) {
        "use strict";
        // 支持AMD
        if (typeof define === 'function' && define.amd) {
            define('dataTableUX', ['jquery'], factory);
        }
        else if (typeof exports === 'object') {
            // Node/CommonJS方式加载
            module.exports = factory(require('jquery'));
        }
        else if (jQuery && !jQuery.fn.dataTableUX) {
            // 避免加载多次
            factory(jQuery);
        }
    }
(function ($) {
    // "use strict"; //是否启用严格模式
    var DataTableUX = function (element, options) {
        //默认设置
        var default_options = {
            bFilter: false,
            paging: false,
            pageLength: 13,
            dom: 'T<"clear"><"toolbar">lfrtip',
            oTableTools: { "sRowSelect": "multi", "aButtons": [] },
            bLengthChange: false, //是否可改变显示长度
            processing: true,
            checked: true,
            sServerMethod: "POST",
            serverSide: true,
            toolbar: [],
            qbar: [],
            oLanguage: {
                sLengthMenu: "每页显示 _MENU_条",
                sZeroRecords: "没有找到符合条件的数据",
                sProcessing: '<img src="/Images/loading.gif" style="width: 20px; height: 20px;vertical-align:top">',
                sInfo: "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
                sInfoEmpty: "没有记录",
                sInfoFiltered: "(从 _MAX_ 条记录中过滤)",
                sSearch: "搜索：",
                oPaginate: { "sFirst": "首页", "sPrevious": "前一页", "sNext": "后一页", "sLast": "尾页" }
            },
            tableTools: {
                sSwfPath: "../../../static/jquery-plugin/swf/copy_csv_xls_pdf.swf",
                sRowSelect: "multi",
                aButtons: [//{  //前端导出与打印
                    //    sExtends: "xls",
                    //    sButtonText: "导出为Excel",
                    //    sFileName: "数据_15_8_1.xlsx"
                    //},
                    //{
                    //    sExtends: "print",
                    //    sButtonText: "打印"
                    //}
                ]
            }
        };

        var global_opt = $.extend(default_options, options);
        var table;
        var ajaxParams;
        var me = $(element);

        //公布加载方法
        this.addDataOutSide = function (data) {
            //data.recordsTotal = 10;
            //data.recordsFiltered =12;
            global_opt.fnCallback(data);
        }

        this.init = function () {
            global_opt.fnDrawCallback = function () {
                if (global_opt.callback) { //调用回调函数
                    global_opt.callback();
                }
            }
            //服务器事件处理
            global_opt.fnServerData = fixServerData;

            table = me.DataTable(global_opt);

            //定义load
            //table.ajax.load = loadData();

            //生成导航按钮
            generateNavBar();

            //全选按钮处理
            generateSelectAll();

            //按钮事件处理
            handleEvent();

            //点击后设置工具栏按钮是否可用
            toggleToolbar();

            me.table = table;
            return table;
        }

        //重组请求参数(sUrl, aoData, fnCallback, oSettings)
        function fixServerData(sSource, aoData, fnCallback, t) {
            //if (table) {//    table.clear().draw();//} ???
            global_opt.fnCallback = fnCallback;
            global_opt.aoData = aoData;
            global_opt.sSource = sSource;

            var params = {};

            for (var i = 0; i < aoData.length; i++) {
                params[aoData[i].name] = aoData[i].value;
            }
            ajaxParams = global_opt.parames;
            if (global_opt.paging == true) {
                ajaxParams.pageSize = params["length"];
                ajaxParams.pageIndex = params["start"] / params["length"] + 1;
                ajaxParams.search =  params["search"]? params["search"].value :"";
            }
            //获取工具条参数
            var inputs = me.parent().parent().parent().find("div.toolbar").find('[paramsName]');
            for (var i = 0; i < inputs.length; i++) {
                ajaxParams[$(inputs[i]).attr("paramsName")] = $(inputs[i]).val();
            }
            $.ajax({
                type: "POST",
                url: global_opt.ajax,
                dataType: "json",
                data: ajaxParams,
                success: function (data) {
                    data.recordsTotal = data.total;
                    data.recordsFiltered = data.total; //data.data.length;
                    fnCallback(data);
                }
            });
        }

        //生成导航菜单
        function generateNavBar() {
            var topDiv = me.parent().parent().parent();
            if (global_opt.toolbar) {
                for (var i = 0; i < global_opt.toolbar.length; i++) {
                    var multiRowSelect = "";
                    if (global_opt.toolbar[i].multiRowSelect != undefined) {
                        multiRowSelect = "multiRowSelect=" + global_opt.toolbar[i].multiRowSelect;
                    }
                    var disabled = "";
                    if (global_opt.toolbar[i].disabled) { disabled = "disabled='disabled'"; }
                    topDiv.find("div.toolbar").append('<Button ' + multiRowSelect + '  handlerName="'
                        + global_opt.toolbar[i].name + '"  ' + disabled
                        + ' class="DTTT_button_mine DTTT_button_text_mine" style="float:left;"><i class="halflings-icon '
                        + global_opt.toolbar[i].iconCls + '"></i>' + global_opt.toolbar[i].text + '</Button>');
                }
                if (global_opt.qbar && global_opt.qbar.length) {
                    //生成查询框
                    for (var i = 0; i < global_opt.qbar.length; i++) {
                        var html = global_opt.qbar[i].html;
                        topDiv.find("div.toolbar").append('<div style="float:left;">' + html + '</div>');
                    }
                    topDiv.find("div.toolbar").append('&nbsp;<Button class="DTTT_button DTTT_button_text" style="height:25px;background: transparent;"><i class="halflings-icon fa fa-search"></i>查询</Button>');
                }
                topDiv.find("div.toolbar").css("float", "left");
                topDiv.find("div.dataTables_filter").css("float", "left");
            }
        }

        //处理自定义toolbar事件
        function handleEvent() {
            var topDiv = me.parent().parent().parent();
            topDiv.find("div.toolbar").find("Button").bind("click", function (e) {
                e.stopPropagation();
                if ($(this).attr("disabled")) { return; }
                var name = $(this).attr("handlerName");
                var iconCls = $(this).attr("handlerName");
                var text = $(this).text();
                //获取已选数据
                var selectedData = table.rows('.selected').data();
                var data = [];
                for (var i = 0; i < selectedData.length; i++) { data.push(selectedData[i]); }
                //导出数据
                if (name == "export") {
                    var headList = [];
                    var th = me.find("th");
                    for (var i = 0; i < options.columns.length; i++) {
                        if (options.columns[i].data) {
                            headList.push({ ColumnName: options.columns[i].data, ColumnText: $(th[i]).text() });
                        }
                    }
                    exportXls(options.exportConfig.url, options.params, options.exportConfig.fileName, headList);
                    return;
                }
                //执行事件
                if (global_opt.handler) {
                    global_opt.handler(name, data, iconCls, text);
                }
                return false;
            });
        }
        //toolbar 禁用/启用
        function toggleToolbar() {
            table.rows('td').on("click", function () {
                _setToolBarDisabled(table);
            });
        }
        function _setToolBarDisabled(table) {
            var selectLength = table.rows('.selected').data().length;
            var topDiv = me.parent().parent().parent();
            topDiv.find("div.toolbar").find("Button").each(function () {
                var multiRowSelect = $(this).attr("multiRowSelect");
                if (multiRowSelect == "true" || multiRowSelect == "false") {
                    if (multiRowSelect == "true") {
                        selectLength > 0 ? $(this).removeAttr("disabled") : $(this).attr("disabled", "true");
                    }
                    if (multiRowSelect == "false") {
                        selectLength == 1 ? $(this).removeAttr("disabled") : $(this).attr("disabled", "true");
                    }
                }
            });
        }

        //全选/反选切换
        function generateSelectAll() {
            var topDiv = me.parent().parent().parent();
            topDiv.find("input[name='selectAll']").bind("click", function () {
                var tempTable = TableTools.fnGetInstance(me[0].id);
                $(this).is(':checked') ? tempTable.fnSelectAll() : tempTable.fnSelectNone();
            });
        }

        //服务端导出Excel
        function exportXls(exportUrl, params, fileName, headList) {
            var exportForm = document.createElement("form");
            exportForm.style.display = "none";
            exportForm.method = "post";
            exportForm.target = "_blank";

            exportForm.action = encodeURI(exportUrl + "&FileName=" + fileName);
            document.body.appendChild(exportForm);

            for (var i in params) {
                if (!(params[i] instanceof Date) && (typeof (params[i]) == "function" || typeof (params[i]) == "object")) { continue; }
                var input = document.createElement("input");
                if ((params[i] instanceof Date)) {
                    input.value = params[i].dateFormat('Y-m-d H:i:s');
                } else {
                    input.value = params[i];
                }
                input.name = i;
                exportForm.appendChild(input);
                delete input;
            }
            if (headList) {
                var headListInput = document.createElement("input");
                headListInput.value = JSON.stringify(headList);
                headListInput.name = "headList";
                exportForm.appendChild(headListInput);
            }
            exportForm.submit(); //构建表单并提交
            delete exportForm;
            delete headListInput;
            delete headList;
            document.body.removeChild(exportForm);
        }
    }

    $.fn["dataTableUX"] = function (options) {
        var method, methodArgs;
        //方法提取
        if (!$.isPlainObject(options)) {
            if (typeof (options) === 'string' || options === false) {
                method = options === false ? 'destroy' : options;
                methodArgs = Array.prototype.slice.call(arguments, 1);
            }
            options = {};
        }
        return this.each(function (i, element) {
            // 防止多次初始化
            var plugin = $.data(element, "plugin");
            if (!plugin && !method) {
                var dtUX = new DataTableUX(element, options);
                $.data(element, "dbx", dtUX.init());
                $.data(element, "plugin", dtUX);
            } else if (plugin && method) {// 调用方法
                if (plugin[method]) {
                    plugin[method].apply(plugin, methodArgs);
                }
            }
        });
    };
}));
} (window, document));
