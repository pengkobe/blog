
define(function (require, exports, module) {
	
	// 初始化导航栏
	seajs.use("navbar", function (navFunc) {
		var data = [
			{ itemName: '图表', url: 'raphelchart'},
			{ itemName: '日历插件', url: 'raphelchartx' },
			{ itemName: '表格管理插件', url: 'alarmManage' },
			{ itemName: '树形插件', url: 'deviceManage' },
			{ itemName: '组织图', url: 'energyManage' },
			{ itemName: '代码片', url: 'staffManage' },
			{ itemName: 'semantic按钮', url: 'statistics' },
			{ itemName: '各种测试', url: 'staffManage' },
		];

		var obj = $('.labroom-nav');
		navFunc(obj, data, clickCallback);
		
		// tab页切换cb
		function clickCallback(moduleid) {
		     var that =  $('#' + moduleid);
			 that.siblings().hide();
			 that.show();
		}
	});
	
	
	 var loadData = require('treeList');
     var baseUrl = '/projects/labroom/';
     var moduleName = 'raphelchart';
	 var id="xxx";
     loadData(baseUrl, moduleName, id);

});

