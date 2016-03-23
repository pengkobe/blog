; define(function (require, exports, module) {

    function NavBar(obj, dataArr, clickCallback) {
        var html = ' <div class="triangle-left"></div>';


        html += ' <div class="nav-cell selected"  url="' + dataArr[0].url + '" >' + dataArr[0].itemName + '</div>';

        var i = 1;
        var len = dataArr.length;

        for (i; i < len; i++) {
            if (i == (len - 1)) {
                html += ' <div class="nav-cell" style="border-right:solid #111 1px" ';
			    html +='" url="' + dataArr[i].url + '" >' + dataArr[i].itemName + '</div>';
            } else {
                html += ' <div class="nav-cell" url="' + dataArr[i].url + '" >' + dataArr[i].itemName + '</div>';
            }
        }

        html += '<div class="triangle-right"></div>';

        obj.append(html);

        obj.on('click', '.nav-cell', function () {
			var that = $(this);
			that.siblings().removeClass('selected');
			that.addClass('selected');

            var url =that.attr('url');
            var id = that.attr('id');
		
            seajs.use(url, function (o) {
               clickCallback(url);
            });
        });
    }

    module.exports = NavBar;
});