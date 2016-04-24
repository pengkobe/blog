/****
***jquery-datatables插件
***类似ExtJs写法
*****/

function aaa(require, exports, module) {
    var global_opt = {};
    var table;
    var ajaxParams;
    var me;

    //默认参数设置
    var default_options = {
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_条",
            "sZeroRecords": "没有找到符合条件的数据",
            "sProcessing": '<strong style="color: white">加载中...</strong>',
            "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
            "sInfoEmpty": "没有记录",
            "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
            "sSearch": "搜索：",
            "oPaginate": { "sFirst": "首页", "sPrevious": "前一页", "sNext": "后一页", "sLast": "尾页" }
        },
        //"bStateSave": true,
        "bFilter": false,
        "dom": 'T<"clear"><"toolbar">lfrtip',
        "oTableTools": { "sRowSelect": "multi", "aButtons": [] },
        "bLengthChange": false,
        "processing": true,
        "sServerMethod": "POST",
        "serverSide": true,

        //***自定义***
        checked: false,
        "toolbar": [],
        "qbar": []//example:{ text: '名字', value: 'py', paramsName: 'DataName', width: 80}
    };

    //重组请求参数
    function fixServerData(sSource, aoData, fnCallback, table) {
        global_opt.fnCallback = fnCallback;
        var params = {};
      
        for (var i = 0; i < aoData.length; i++) {
            params[aoData[i].name] = aoData[i].value;
        }

        ajaxParams = {};
        ajaxParams.pageSize = params["length"];
        ajaxParams.pageIndex = params["start"] / params["length"] + 1;
        ajaxParams.search = params["search"].value;
        ajaxParams.sortName = global_opt.columns[params.order[0].column].data;
        ajaxParams.sortOrder = params.order[0].dir;

        //遍历工具条
        var inputs = me.parent().find("div.toolbar").find('[paramsName]');
        for (var i = 0; i < inputs.length; i++) {
            ajaxParams[$(inputs[i]).attr("paramsName")] = $(inputs[i]).val();
        }
        ajaxParams.UserID = "manager";

        $.ajax({
            type: "POST",
            url: table.ajax,
            dataType: "json",
            data: ajaxParams,
            success: function (data) {
                data.recordsTotal = 20;
                data.recordsFiltered = 3;
                fnCallback(data);
            }
        });
    }

    //初始化从后台加载数据
    function loadData() {
        ajaxParams.UserID = "manager";
        $.ajax({
            type: "POST",
            url: table.ajax.url(),
            dataType: "json",
            data: ajaxParams,
            success: function (data) {
                data.recordsTotal = 20;
                data.recordsFiltered = 3;
                global_opt.fnCallback(data);
            }
        });
    }

    //生成导航菜单
    function generateNavBar() {
        var topDiv= me.parent().parent().parent();
        if (global_opt.toolbar) {
            for (var i = 0; i < global_opt.toolbar.length; i++) {
                var multiRowSelect = "";
                if (global_opt.toolbar[i].multiRowSelect != undefined) {
                    multiRowSelect = "multiRowSelect=" + global_opt.toolbar[i].multiRowSelect;
                }
                var disabled = "";
                if (global_opt.toolbar[i].disabled) { disabled = "disabled='disabled'"; }
                topDiv.find("div.toolbar").append('<Button ' + multiRowSelect + '  handlerName="' + global_opt.toolbar[i].name + '"  ' + disabled + ' class="DTTT_button DTTT_button_text" style="float:left;"><i class="halflings-icon ' + global_opt.toolbar[i].iconCls + '"></i>' + global_opt.toolbar[i].text + '</Button>');
            }
            if (global_opt.qbar && global_opt.qbar.length) {

                //根据qbar生成查询框
                for (var i = 0; i < global_opt.qbar.length; i++) {
                    var html = global_opt.qbar[i].html;
                    topDiv.find("div.toolbar").append('<div style="float:left;">' + html + '</div>');
                }

                topDiv.find("div.toolbar").append('&nbsp;<Button class="DTTT_button DTTT_button_text"><i class="halflings-icon query"></i>查询</Button>');
            }
            topDiv.find("div.toolbar").css("float", "left");
            topDiv.find("div.dataTables_filter").css("float", "left");
        }

    }

    //全选按钮处理
    function generateSelectAll() {
        var topDiv = me.parent().parent().parent();

        topDiv.find("input[name='selectAll']").bind("click", function () {
            var tempTable = TableTools.fnGetInstance(me[0].id);
            $(me).attr("checked") ? tempTable.fnSelectAll() : tempTable.fnSelectNone();
        });
    }

    //处理事件
    function handleEvent() {
        var topDiv = me.parent().parent().parent();

        topDiv.find("div.toolbar").find("Button").bind("click", function () {
            if ($(this).attr("disabled")) { return; }
            var name = $(this).attr("handlerName");
            var iconCls = $(this).attr("handlerName");
            var text = $(this).text();

            //获取选择的数据
            var selectedData = table.rows('.selected').data();
            var data = [];
            for (var i = 0; i < selectedData.length; i++) { data.push(selectedData[i]); }

            //执行事件
            if (global_opt.handler) {
                global_opt.handler(name, data, iconCls, text);
            }
        });
    }

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
                    selectLength > 0 ? $(this).removeAttr("disabled") : $(this).attr("disabled", "disabled");
                }
                if (multiRowSelect == "false") {
                    selectLength == 1 ? $(this).removeAttr("disabled") : $(this).attr("disabled", "disabled");
                }
            }
        });
    }

    $.fn.extend({
        dataTableUX: function (options) {
            global_opt = $.extend(default_options, options);
            me = this;
      
            global_opt.fnDrawCallback = function () {
                _setToolBarDisabled(table);
            }
            //===========发送到服务器事件处理======
            global_opt.fnServerData = fixServerData;

            table = me.DataTable(global_opt);
           
            //==================定义load===========
            table.ajax.load = loadData();

            //=================生成导航按钮========
            generateNavBar();

            //=================全选按钮处理========
            generateSelectAll();

            //==================按钮事件处理=======
            handleEvent();

            //=========点击后设置工具栏按钮是否可用======
            toggleToolbar();
           
            me.table = table;
            return me;
        }
    });
}

aaa();