define(function(require, exports, module) {

    // 导航栏
    seajs.use("navbar", function(navFunc) {
        var data = [
            { itemName: '图表', url: 'raphelchart' },
            { itemName: '日历插件', url: 'raphelchartx' },
            { itemName: '表格管理插件', url: 'alarmManage' },
            { itemName: '树形插件', url: 'deviceManage' },
            { itemName: '组织图', url: 'energyManage' },
            { itemName: '代码片', url: 'staffManage' },
            { itemName: 'semantic按钮', url: 'statistics' },
            { itemName: '各种测试', url: 'staffManage' },
        ];

        var obj = $('.labroom-nav');
        navFunc(obj, data);
    });

    // tab页切换cb
    function clickCallback(moduleid) {
        var that = $('#' + moduleid);
        that.siblings().hide();
        that.show();
    }
    // 路由初始化
    function notFound() {
        alert("404 Not Found");
    }

    Path.map("#/raphelchart").to(function() {
        seajs.use('raphelchart', function(o) {
            clickCallback('raphelchart');
        });

    });
    Path.map("#/raphelchartx").to(function() {
        debugger;
    });

    Path.root("#/raphelchart");
    Path.rescue(notFound);

    Path.listen();

});



/* api
Path.map("#/users/:user_id").to(function(){
           $("#output .content").html("You selected the user with ID: " + this.params["user_id"]);
       });

       Path.map("#/about(/author)").to(function(){
           $("#output .content").html("About & About/Author share a route!");
       });

       Path.map("#/contact").to(function(){
           $("#output .content").html("Contact");
       }).enter([
           function(){
               $("#output .content").html("This will work.");
           },
           function(){
               $("#output .content").append("Execution Halted!");
               return false;
           }
       ]);

      Path.root("#/users"); */
