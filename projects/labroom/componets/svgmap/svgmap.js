; define(function (require, exports, module) {
	function init(){
		 var svg = $('#svgmap').SVGMap({
            mapName: 'china',
            mapWidth: 1000,
            mapHeight: 648,
            strokeWidth: 0.4,
            clickColorChange: 1,
            stateInitColor: "#2D2D30",
            strokeColor: "#1F1F1F ",
            stateHoverColor: "#008B00",
            stateSelectedColor: "#008B00",
            showTip: 0,
            external: 1,
            stateTipHtml: function (stateData, obj) {
                return '';
            },
            clickCallback: function (a, b) {
                if (b.id == "taiwan" || b.id == "aomen" || b.id == "xianggang") {
                    $('.back0').hide();
                    $(".area-nav-ul").empty();
                    return;
                }
                console.log('点击回调.');
            },
            // 可用外部描述文件
            // stateDataType: 'xml',
            // stateSettingsXmlPath: 'DashBoard/assets/svgmap/js/res/chinaMapSettings.xml'
		});
	}

    module.exports = init;
});
