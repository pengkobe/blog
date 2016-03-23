
define(function (require, exports, module) {
	
    var raphael_charts = require('raphael_charts');
	// 仪表盘
	new raphael_charts("dash",{});

	// 柱状图
	new raphael_charts("bar",{});

	// 散点图
	//new raphael_charts("scatter",{});
	
	
	seajs.use("navbar", function (navFunc) {
		var data = [
			{ itemName: 'raphael图表', url: 'raphael_charts'},
			{ itemName: '日历插件', url: 'calendar_plugin' },
			{ itemName: '表格管理插件', url: 'alarmManage' },
			{ itemName: '树形插件', url: 'deviceManage' },
			{ itemName: '组织图', url: 'energyManage' },
			{ itemName: '代码片', url: 'staffManage' },
			{ itemName: 'semantic按钮', url: 'statistics' },
			{ itemName: '各种测试', url: 'staffManage' },
		];

		var obj = $('.labroom-nav');
		navFunc(obj, data, clickCallback);
		// tab页切换
		function clickCallback(moduleid) {
		     var that =  $('#' + moduleid);
			 that.siblings().hide();
			 that.show();
		}
	});
	
});

