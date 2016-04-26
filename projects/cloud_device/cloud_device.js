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
                    $("#e_" + (i+1) + "_SumCount").html(data[i].SumCount);
                    $("#e_" + (i+1) + "_engergy").html(data[i].fqfh +"&nbsp;&nbsp;"+data[i].ndl);
                    $("#e_" + (i+1) + "_hzl").html(data[i].hzl);
                    $("#e_" + (i+1) + "_gzl").html(data[i].gzl);
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
                    $("#w_" + (i+1) + "_SumCount").html(data[i].SumCount);
                    $("#w_" + (i+1) + "_engergy").html(data[i].fqfh +"&nbsp;&nbsp;"+data[i].ndl);
                    $("#w_" + (i+1) + "_hzl").html(data[i].hzl);
                    $("#w" + (i+1) + "_gzl").html(data[i].gzl);
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
              debugger;
               var data = data.data[0];
                $("#Data1").html(data.Data1);
                $("#Data2").html(data.Data2);
                $("#Area1").html(data.Area1);
                $("#Area2").html(data.Area2);
                $("#Energy").html(data.Energy);

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
            success: function(data, textStatus) {},
            error: function() {

            }
        });
    }
});
