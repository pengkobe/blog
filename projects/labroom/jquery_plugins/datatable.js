;
define(function(require, exports, module) {
    // 加载依赖
    require("datatableUX");

    function functionn() {
        initTable();
        initDropDownTree();
        RegisterEvent();
        formValidate();

        function initTable() {
            var table = $('#functionn').dataTableUX({
                "toolbar": [
                    { iconCls: 'fa fa-plus', text: '新增', permissionControl: true, name: 'add' },
                    { iconCls: 'fa fa-edit', text: '编辑', permissionControl: true, name: 'edit', disabled: true, multiRowSelect: false },
                    { iconCls: 'fa fa-trash-o fa-lg', text: '删除', permissionControl: true, name: 'remove', disabled: true, multiRowSelect: true },
                    { iconCls: 'fa fa-filter', text: '导入', name: 'import' },
                    { iconCls: 'fa fa-file-excel-o', text: '导出', name: 'export' }
                ],
                paging: true,
                scrollY: 545,
                dom: 'T<"toolbar"><"clear">lfrtip',
                order: [
                    [0, 'desc']
                ],
                ajax: "http://www.eegrid.com:8081/Action.ashx?Name=HYD.E3.Business.FunctionBLL.GetFunction",
                parames: { pageSize: '1', pageIndex: '1', sortName: "ID", sortOrder: "asc" },
                qbar: [{ html: $('#divtoolbars').html() }],
                //columnDefs: [{ "bVisible": false, "aTargets": [1] }],
                columns: [
                    { "data": null, defaultContent: '', orderable: false, width: "2%" },
                    { "data": "ID", width: '6%' },
                    { "data": "FunctionName", width: '16%' },
                    { "data": "Url", width: '15%' },
                    { "data": "ParentID", width: '12%' },
                    { "data": "PName", width: '16%' },
                    { "data": "Level", width: '6%' },
                    { "data": "SortIndex", width: '6%' },
                    { "data": "Icon", width: '15%' },
                    { "data": "ManagementName", width: '6%' },

                ],
                // 服务端导出
                exportConfig: {
                    url: '/ToXls.aspx?Name=HYD.E3.Business.FunctionBLL.Export',
                    fileName: '功能点列表'
                },
                handler: function(name, data, iconCls, text) {
                    if (name == "add") {
                        $("#indexFunctionModalLabel").empty().append("添加功能点信息");
                        $("#ulFunctionPName").css("visibility", "hidden");
                        $("#ulFunctionPName").css("height", "0px");
                        resetForm();
                        $('#AddFormModal').modal('show');
                        return;
                    }
                    if (name == "edit") {
                        $("#indexFunctionModalLabel").empty().append("编辑功能点信息");
                        var dd = data[0];
                        $('#AddFormModal').modal('show');
                        loadUpdateForm(dd);
                        $("#ulFunctionPName").css("visibility", "hidden");
                        $("#ulFunctionPName").css("height", "0px");
                        return;
                    }
                    if (name == "remove") {
                        if (window.confirm("确认删除？")) {
                            var FunctionIDArray = new Array();
                            for (var i = 0; i < data.length; i++) {
                                FunctionIDArray.push(data[i].ID);
                            }
                            remove(JSON.stringify(FunctionIDArray));
                        }
                        return;
                    }
                    if (name == "import") {
                        $('#myImport').modal('show');
                        return;
                    }
                    var tt = $.data($('#functionn')[0], "dbx"); //从data缓存中区对象
                    tt.table().ajax.reload();
                }
            });
        }

        function initDropDownTree() {
            $("#ulFunctionPName").css("visibility", "hidden");
            $("#ulFunctionPName").css("height", "0px");
            $.ajax({
                type: "GET",
                url: "http://www.eegrid.com:8081/Action.ashx?Name=HYD.E3.Business.FunctionBLL.GetFunctionTree",
                success: function(data, textStatus) {
                    var d = eval("(" + data + ")");
                    var model = d.data;
                    $("#ulFunctionPName").empty();
                    $("#ulFunctionPName").append('<li id="li0"  style="list-style:none;height:19px;"  onclick="javascript:clickfunctionpnameli(event,0,\'\'); return false;"  value="0"></li>');
                    for (var i = 0; i < model.length; i++) {
                        if (i == 0 || model[i].ParentID == null || parseInt(model[i].ParentID) == 0)
                            $("#ulFunctionPName").append('<li id="li' + model[i].ID + '"  style="list-style:none;"  onclick="javascript:clickfunctionpnameli(event,' + model[i].ID + ',\'' + model[i].FunctionName + '\'); return false;"  value="' + model[i].ID + '">' + model[i].FunctionName + '</li>');
                        else {
                            var pli = $('#li' + model[i].ParentID + '');
                            pli.append('<ul   id="ul' + model[i].ParentID + '"></ul>');
                            var pul = $('#ul' + model[i].ParentID + '');
                            pul.append('<li  id="li' + model[i].ID + '"   onclick="javascript:clickfunctionpnameli(event,' + model[i].ID + ',\'' + model[i].FunctionName + '\'); return false;"  value="' + model[i].ID + '">' + model[i].FunctionName + '</li>');
                        }
                    }
                }
            });
        }

        //判断功能点编码是否已经存在
        $("#ID").change(function() {
            var id = $("#ID").val();
            $.ajax({
                type: "POST",
                url: "http://www.eegrid.com:8081/Action.ashx?Name=HYD.E3.Business.FunctionBLL.IsExistsModel",
                data: { id: id },
                success: function(data, textStatus) {
                    var flag = eval("(" + data + ")");
                    var diverror = $("#errorMessage");
                    if (flag == true) {
                        diverror.css("color", "red");
                        diverror.empty().append("已经存在功能点编码" + id + "！");
                        return;
                    } else diverror.empty();
                }
            });
        });

        //点击选择功能点按钮
        $("#FunctionPName").click(function() {
            if ($("#ulFunctionPName").css("visibility") == "visible") {
                $("#ulFunctionPName").css("visibility", "hidden");
                $("#ulFunctionPName").css("height", "0px");
                $("#ulFunctionPName li").css("background-color", "#ffffff");
                if ($("#FunctionPName").text() != "") {
                    $("#li" + $("#FunctionPName").val()).css("background-color", "#fff432");
                }
            } else if ($("#ulFunctionPName").css("visibility") == "hidden") {

                $("#ulFunctionPName").css("visibility", "visible");
                $("#ulFunctionPName").css("height", "100px");
                $("#ulFunctionPName li").css("background-color", "#ffffff");
                if ($("#FunctionName").text() != "") {
                    $("#li" + $("#FunctionPName").val()).css("background-color", "#fff432");
                }
            }
        });

        $("#Icon").change(function() {
            var str = $("#Icon").val();
            if (str == "")
                str = $("#imgIcon").attr("src");
            if ($("#Icon").val() == "")
                $("#txtIcon").prop("disabled", false);
            else if ($("#Icon").val() != "") {
                $("#txtIcon").prop("disabled", true);
                var len = str.length;
                var index = (str.lastIndexOf("\\") >= 0) ? str.lastIndexOf("\\") : str.lastIndexOf("\/");
                var phote = str.substr(index + 1, len - index);
                if (phote != null && phote != "") {
                    $("#imgIconInput").ajaxSubmit({
                        dataType: "json",
                        url: "http://www.eegrid.com:8081/Action.ashx?Name=HYD.E3.Business.FunctionBLL.SaveImageIcon"
                    });
                    $("#imgIcon").removeAttr("src");
                    $("#imgIcon").attr("src", "../../Images/Icon/" + phote);
                }
            }
        });

        $("#txtIcon").change(function() {
            if ($("#txtIcon").val() != "")
                $("#Icon").prop("disabled", true);
            else $("#Icon").prop("disabled", false);
        });

        function RegisterEvent() {

            $("#saveForm").on("click", function() {
                var diverror = $("#errorMessage");
                if (diverror.html() != undefined && diverror.html() != null && diverror.html() != "")
                    return;

                //验证表单
                $("#AddForm").validate();
                if ($("#AddForm").valid() == false) {
                    return;
                }
                var model = $("#AddForm").serializeObject();
                model.ID = $("#ID").val();
                model.FunctionName = $("#FunctionName").val();
                model.ParentID = $("#FunctionPName").val();
                if ($("#FunctionPName").val() == "")
                    model.ParentID = 0;
                model.Level = $("#Level").val();
                model.SortIndex = $("#SortIndex").val();
                var str = "";
                if ($("#Icon").val() != "")
                    str = $("#Icon").val();
                else if ($("#imgIcon").attr("src") != "undefined" && $("#imgIcon").attr("src") != null && $("#imgIcon").attr("src") != "")
                    str = $("#imgIcon").attr("src");
                if ($("#Icon").val() == "" && $("#txtIcon").val() != "") {
                    model.Icon = $("#txtIcon").val();
                } else {
                    var len = str.length;
                    if (len != 0) {
                        var index = (str.lastIndexOf("\\") >= 0) ? str.lastIndexOf("\\") : str.lastIndexOf("\/");
                        model.Icon = str.substr(index + 1, len - index);
                    }
                }

                model.PName = $("#FunctionPName").text();
                model.Url = $("#Url").val();

                //if ($("#AppName").prop("checked")==true)
                //    model.IsApp = "true";
                //else
                //    model.IsApp = "false";
                if ($("#SuperName").prop("checked") == true)
                    model.IsSuper = "true";
                else
                    model.IsSuper = "false";
                if ($("#ManagementName").prop("checked") == true)
                    model.IsManagement = "true";
                else
                    model.IsManagement = "false";

                var action = "AddOrSaveFunction"
                $.ajax({
                    type: "POST",
                    url: "http://www.eegrid.com:8081/Action.ashx?Name=HYD.E3.Business.FunctionBLL.AddOrSaveFunction",
                    data: { model: JSON.stringify(model) },
                    success: function(data, textStatus) {
                        if (data == "true") {
                            showMessage({ msg: "保存成功", type: "success", hide: true });
                            $('#AddFormModal').modal('hide');
                            initDropDownTree();
                            var tt = $.data($('#functionn')[0], "dbx"); //从data缓存中区对象
                            tt.table().ajax.reload();
                        }
                    }
                });

            });
        }

        //删除
        function remove(FunctionIDArray) {
            $.ajax({
                type: "POST",
                url: "http://www.eegrid.com:8081/Action.ashx?Name=HYD.E3.Business.FunctionBLL.RemoveFunction",
                data: { FunctionIDs: FunctionIDArray },
                success: function(data, textStatus) {
                    if (data == "true") {
                        showMessage({ msg: "删除成功", type: "success", hide: true });
                        var tt = $.data($('#functionn')[0], "dbx"); //从data缓存中区对象
                        initDropDownTree();
                        tt.table().ajax.reload();
                        $("input[name='selectAll']").prop("checked", false);
                    }
                }
            });
        }

        //表单加载
        function loadUpdateForm(model) {
            $("#FunctionName").val(model.FunctionName);
            $("#ParentID").val(model.ParentID);
            $("#Level").val(model.Level);
            $("#SortIndex").val(model.SortIndex);
            if (model.Icon.indexOf(".") >= 0) {
                $("#imgIcon").removeAttr("src");
                $("#imgIcon").attr("src", "../../Images/Icon/" + model.Icon);
                $("#txtIcon").prop("disabled", false);
                $("#Icon").prop("disabled", false);
            } else {
                $("#txtIcon").val(model.Icon);
                $("#txtIcon").prop("disabled", false);
                if (model.Icon != "")
                    $("#Icon").prop("disabled", true);
                else $("#Icon").prop("disabled", false);
                $("#imgIcon").removeAttr("src");
                $("#imgIcon").attr("src", "");
            }
            $("#Url").val(model.Url);
            $("#FunctionPName").text(model.PName);
            $("#FunctionPName").val(model.ParentID);
            //if (model.AppName == "是")
            //    $("#AppName").prop("checked", true);
            //else
            //    $("#AppName").prop("checked",false);
            if (model.SuperName == "是")
                $("#SuperName").prop("checked", true);
            else
                $("#SuperName").prop("checked", false);
            if (model.ManagementName == "是")
                $("#ManagementName").prop("checked", true);
            else
                $("#ManagementName").prop("checked", false);
            $("#ID").prop("disabled", true);
            $("#errorMessage").empty();
            //保存主键到隐藏控件中
            $("#ID").val(model.ID);
        }

        //表单加载
        function resetForm(model) {

            $("#FunctionName").val("");
            $("#ParentID").val("");
            $("#Level").val("");
            $("#SortIndex").val("");
            $("#Icon").val("");
            $("#imgIcon").removeAttr("src");
            $("#txtIcon").prop("disabled", false);
            $("#Icon").prop("disabled", false);
            $("#Url").val("");
            $("#PName").val("");
            $("#FunctionPName").text("");
            $("#FunctionPName").val("0");
            //$("#AppName").prop("checked",false);
            $("#ManagementName").prop("checked", false);
            $("#SuperName").prop("checked", false);
            $("#errorMessage").empty();
            //保存主键到隐藏控件中
            $("#ID").val("");
            $("#ID").prop("disabled", false);
        }
        //表单审核
        function formValidate() {
            $("#AddForm").validate({
                rules: {
                    ID: {
                        required: true,
                    },
                    FunctionName: {
                        required: true,
                    }
                },
                messages: {
                    ID: {
                        required: "请输入功能点编码",
                    },
                    FunctionName: {
                        required: "请输入功能点名称",
                    }

                }
            });
        }
        //保存导入信息
        function importSave() {
            $('span[name="isloading"]').show();
            $("#fileInputform").ajaxSubmit({
                dataType: "json",
                success: function(data, status) {
                    var data = data.data;
                    var message = data["Message"];
                    var importnum = data["ImportNum"];
                    var allnum = data["AllNum"];
                    $('#myImport').modal('hide');
                    $('span[name="isloading"]').hide();
                    initDropDownTree();
                    var tt = $.data($('#functionn')[0], "dbx"); //从data缓存中区对象
                    tt.table().ajax.reload();
                    if (parseInt(message) == 1) {
                        showMessage({ msg: '功能点共' + allnum + '条记录，导入成功！', type: "success", hide: true });
                        return;
                    } else if (parseInt(message) == 0) {
                        showMessage({ msg: '功能点共' + allnum + '条记录，仅导入' + importnum + '条！', type: "error", hide: false });
                        return;
                    } else if (parseInt(message) == -1) {
                        showMessage({ msg: '功能点共' + allnum + '条记录，导入失败！', type: "error", hide: false });
                        return;
                    }
                }
            });
        }
        $("#importSaveButton").on('click', function() {
            importSave();
        });
    }
    module.exports = functionn;
});
