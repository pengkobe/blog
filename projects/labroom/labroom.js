define(function(require, exports, module) {

    // 初始化导航栏
    seajs.use("navbar", function(navFunc) {
        var data = [
            { itemName: '图表', url: 'raphelchart' },
            { itemName: 'jquery插件', url: 'jquery_plugins' },
            { itemName: '案例学习', url: 'case_study' },
            { itemName: '代码片', url: 'snippets' },
            //{ itemName: '树形插件', url: 'raphelchartx' },
            //{ itemName: '组织图', url: 'energyManage' },
            { itemName: '资料集', url: 'daydayup' },
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
        clickCallback('raphelchartx');
    });

     Path.map("#/jquery_plugins").to(function() {
        seajs.use('jquery_plugins', function(o) {
             clickCallback('jquery_plugins');
        });

    });
      Path.map("#/case_study").to(function() {
        seajs.use('case_study', function(o) {
            clickCallback('case_study');
        });
    });

    Path.map("#/snippets").to(function() {
        seajs.use('snippets', function(o) {
            clickCallback('snippets');
        });
    });

    Path.map("#/daydayup").to(function() {
        seajs.use('daydayup', function(o) {
            clickCallback('daydayup');
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
