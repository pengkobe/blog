;
$(function() {

    // ==========页面切换===========
    $(".areaLink").on('click', function() {
        $(this).parent().hide();
        $("#building_div").show();
    });
    $(".deviceLink").on('click', function() {
        $(this).parent().hide();
        $("#electric_div").show();
    });

    $(".waterLink").on('click', function() {
        $(this).parent().hide();
        $("#water_div").show();
    });

    $(".electricLink").on('click', function() {
        $(this).parent().hide();
        $("#electric_div").show();
    });

    $(".cbuildingLink").on('click', function() {
        $(this).parent().hide();
        $("#cbuilding_div").show();
    });

    $(".buildingLink").on('click', function() {
        $(this).parent().hide();
        $("#building_div").show();
    });

    $(".firstpage").on('click', function() {
        $(this).parent().hide();
        $("#main_div").show();
    });

    ajaxRq();
    setInterval(ajaxRq, 2000);

    function ajaxRq() {
        $.ajax({
            url: "http://120.24.54.92:8082/Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetAll",
            dataType: "json",
            data: {},
            success: function(data, textStatus) {
                var data = data.data[0];
                $("#Data1").html(data.Data1);
                $("#Data2").html(data.Data2);
                $("#Area1").html(data.Area1);
                $("#Area2").html(data.Area2);
                $("#Energy").html(data.Energy);
            },
            error: function() {}
        });

        // 电
        $.ajax({
            url: "http://120.24.54.92:8082/Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetDeviceInfo",
            dataType: "json",
            type: 'POST',
            data: { DeviceType: 1 },
            success: function(data, textStatus) {
                var data = data.data;
                for (var i = 0; i < data.length; i++) {
                    $("#e_" + (i+1) + "_SumCount").html(data[i].SumCount+'<span class="unit">个</span>');
                    $("#e_" + (i+1) + "_engergy").html(data[i].fqfh +'<span class="unit">kwh</span>'+"&nbsp;&nbsp;"+data[i].ndl+'<span class="unit">kwh/年</span>');
                    $("#e_" + (i+1) + "_hzl").html(data[i].hzl+'<span class="unit">&nbsp;负载率</span>');
                    $("#e_" + (i+1) + "_gzl").html((data[i].gzl*100).toFixed(0)+'%<span class="unit">&nbsp;故障率</span>');
                }
            },
            error: function() {}
        });

        // 水
        $.ajax({
            url: "http://120.24.54.92:8082/Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetDeviceInfo",
            dataType: "json",
            type: 'POST',
            data: { DeviceType: 2 },
            success: function(data, textStatus) {
                var data = data.data;
                for (var i = 0; i < data.length; i++) {
                    $("#w_" + (i+1) + "_SumCount").html(data[i].SumCount+'<span class="unit">个</span>');
                    $("#w_" + (i+1) + "_engergy").html(data[i].fqfh +'<span class="unit">kwh</span>'+"&nbsp;&nbsp;"+data[i].ndl+'<span class="unit">kwh/年</span>');
                    $("#w_" + (i+1) + "_hzl").html(data[i].hzl+'<span class="unit">&nbsp;负载率</span>');
                    $("#w_" + (i+1) + "_gzl").html((data[i].gzl*100).toFixed(0)+'%<span class="unit">&nbsp;故障率</span>');
                }
            },
            error: function() {}
        });

        // 住宅
        $.ajax({
            url: "http://120.24.54.92:8082/Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetIndustryInfo",
            dataType: "json",
            type: 'POST',
            data: { Industry: 1 },
            success: function(data, textStatus) {
                var data = data.data[0];
                $("#b_mj").html(data.mj+'<span class="unit">&nbsp;公顷</span>');
                $("#b_dss_dlj").html(data.dss+'<span class="unit">&nbsp;kwh</span>'+'&nbsp;'+data.dlj+'<span class="unit">&nbsp;kwh/年</span>');
                $("#b_sss_slj").html(data.sss+'<span class="unit">&nbsp;m</span>'+'&nbsp;'+data.slj+'<span class="unit">&nbsp;m/年</span>');
                $("#b_yss_ylj").html(data.yss+'<span class="unit">&nbsp;l</span>'+'&nbsp;'+data.ylj+'<span class="unit">&nbsp;l/年</span>');
                $("#b_sbsl").html(data.sbsl+'<span class="unit">&nbsp;个</span>');
                $("#b_sjsl").html(data.sjsl+'<span class="unit">&nbsp;T</span>');

            },
            error: function() {

            }
        });

        // 写字楼
        $.ajax({
            url: "http://120.24.54.92:8082/Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetIndustryInfo",
            dataType: "json",
            type: 'POST',
            data: { Industry: 2 },
            success: function(data, textStatus) {
                var data = data.data[0];
                $("#cb_mj").html(data.mj+'<span class="unit">&nbsp;公顷</span>');
                $("#cb_dss_dlj").html(data.dss+'<span class="unit">&nbsp;kwh</span>'+'&nbsp;'+data.dlj+'<span class="unit">&nbsp;kwh/年</span>');
                $("#cb_sss_slj").html(data.sss+'<span class="unit">&nbsp;m</span>'+'&nbsp;'+data.slj+'<span class="unit">&nbsp;m/年</span>');
                $("#cb_yss_ylj").html(data.yss+'<span class="unit">&nbsp;l</span>'+'&nbsp;'+data.ylj+'<span class="unit">&nbsp;l/年</span>');
                $("#cb_sbsl").html(data.sbsl+'<span class="unit">&nbsp;个</span>');
                $("#cb_sjsl").html(data.sjsl+'<span class="unit">&nbsp;T</span>');
            },
            error: function() {

            }
        });
    }
});
