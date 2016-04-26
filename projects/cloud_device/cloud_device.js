;
$(function() {
    // 页面切换
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

    function ajaxRq() {
        $.ajax({
            url: "Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetAll",
            dataType: "json",
            data: {},
            success: function(data, textStatus) {
                var data = data.data[0];
                // data.Data1
            },
            error: function() {}
        });

        // 电
        $.ajax({
            url: "Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetDeviceInfo",
            dataType: "json",
            data: { DeviceType: 1 },
            success: function(data, textStatus) {
            },
            error: function() {
            }
        });

        // 水
        $.ajax({
            url: "Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetDeviceInfo",
            dataType: "json",
            data: { DeviceType: 2 },
            success: function(data, textStatus) {
            },
            error: function() {
            }
        });

        // 住宅
        $.ajax({
            url: "Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetIndustryInfo",
            dataType: "json",
            data: { Industry: 1 },
            success: function(data, textStatus) {
            },
            error: function() {

            }
        });

        // 写字楼
        $.ajax({
            url: "Action.ashx?Name=HYD.E3.Business.ECODataBLL.DC_GetIndustryInfo",
            dataType: "json",
            data: { Industry: 2 },
            success: function(data, textStatus) {
            },
            error: function() {

            }
        });
    }
});
