 function scatterChart() {
      var option ={
          domId:"scatterChart",
          title:'',
          unit:'',

          // 画布大小
          width:800,
          height:150,

          //画布间距
          paddingLeft:30,
          paddingRight:10,
          paddingTop:25,
          paddingBottom:10,

          // 数据
          labels:['1','2','3','4','5','6','7','8','9','10','11','12月'],
          data:[],

          // 样式
          color:'#555'
      };

      this.init = function(seft_options){
        // 合并属性
        for(var proName in seft_options){
          option[proName]=seft_options[proName];
        }

        var labels = option.labels;
        var data = option.data;
        var width = option.width,
            height = option.height,
            paddingRight = option.paddingRight,
            paddingLeft = option.paddingLeft,
            paddingBottom = option.paddingBottom,
            paddingTop = option.paddingTop,
            color=option.color;

        var r = Raphael("DevLine", width, height),
          txt = {"font": '11px "Arial"', stroke: "none", fill: "#555",opacity:0.6},
          title = {"font": '12px "Arial"', stroke: "none", fill: "#555",opacity:0.6},
          tooltip = {"font": '12px "Arial"', stroke: "none", fill: "#1E90FF",opacity:0.6};

        // label宽度
        var X = (width - paddingLeft - paddingRight) / labels.length,
        // label高度
          Y = (height - paddingBottom - paddingTop) / data.length;
          // 标题
          r.text(option.width/2, 10, option.title).attr(title),
          bar_label = r.text(option.width/2, 10, "").attr(tooltip).hide(),
          bar_value = r.text(option.width/2, 10, "").attr(tooltip).hide(),
          unit =  r.text(7, 10,option.unit).attr(title);

        //X 坐标轴 20
        r.path("M0,"+(height-12)+","+(width-10)+","+(height-12)).attr({ stroke: "#505050", "stroke-width": 0.5 });

        var barRanges = [];
        var barBackup =[];
        var indexline = r.rect(0, 0, 1, (height - paddingTop-12)).attr({fill: "#1E90FF","stroke-width": 0,opacity:0.6}).hide();

        // label && bar
        var labelLen = labels.length;
        for(var i = 0; i < labelLen; i++)
        {
          var calculateDay  = CalculateDay(new Date(data[i]));
          var  x = Math.round(paddingLeft + X * (i+1));
          var label_x = Math.floor(labelLen/8);
          //  x轴标签
          if(i % label_x ==0 || i==(labelLen - 1)){
            tx = r.text(x-30, height - 6, labels[i]).attr(txt).toBack();
          }
        }

        var dataLen = data.length;
        for( i = 0; i < dataLen; i++)
        {
          var yData = data[i].substring(11,13)/24 +  data[i].substring(14)/60/24;
          if(!yData){
            yData = data[i].substring(11,12)/24 +  data[i].substring(13)/60/24;
          }
          var calculateDay  = CalculateDay(new Date(data[i]));
          var xData = calculateDay/365 * (width-paddingLeft - paddingRight);

          var y = (height - paddingBottom - paddingTop) - yData * (height - paddingBottom - paddingTop);

          var label_y = Math.floor(dataLen/2);

          if(i % label_y ==1){
            if(i ==1){
              ty = r.text(8, paddingTop + i * Y, 'PM').attr(txt).toBack();
              r.path('M0,'+(paddingTop + i * Y-6)+','+(width-10)+','+(paddingTop + i * Y-6)).attr({ stroke: "#303030", "stroke-width": 0.5 });
            }else{
              ty = r.text(8, paddingTop + i * Y, 'AM').attr(txt).toBack();
              r.path('M0,'+(paddingTop + i * Y-6)+','+(width-10)+','+(paddingTop + i * Y-6)).attr({ stroke: "#303030", "stroke-width": 0.5 });
            }
          }
          // 绘制
          bar = r.rect(xData+X,y+22, 3, 3).attr({fill: "#404040","stroke-width": 0});

          barBackup.push(bar);
          barRanges.push([xData+X,y+22, 3, 3]);
        }

        bindEvents();

        function bindEvents(){
            var context = document.getElementById("DevLine").querySelector("svg");

            addEvent.addEvent(context,'touchstart',function(evt){
              touchEvent(evt);
              // 这句异常关键
              evt.preventDefault();
            });

            addEvent.addEvent(context,'touchmove',function(evt){
              touchEvent(evt);
        });

          function touchEvent(evt){
            var evtPosition = getRelativePosition.getRelativePosition(evt);
            var barLen = barBackup.length;

            for(var index=0; index<barLen; index++){
              var barModel = barRanges[index];
              if(barModel[0]<evtPosition.x && evtPosition.x< ( barModel[0]+barModel[2]) ){
                barBackup[index].attr({opacity: .5});
                if(evtPosition.x>200){
                  bar_value.attr({text:data[index],"text-anchor": "end"}).show().animate({x:evtPosition.x, y: Y+24},5).toFront();
                  indexline.show().animate({x:barModel[0]+2, y: Y+22},5);
                }else{
                  bar_value.attr({text:data[index],"text-anchor": "start"}).show().animate({x:evtPosition.x, y: Y+24},5).toFront();
                  indexline.show().animate({x:barModel[0]-1, y: Y+22},5);
                }
              }else{
                barBackup[index].attr({opacity: 1});
              }
            }
          }
        }
      }
    }

function CalculateDay(date){
      var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
      var day = date.getDate();
      // getMonth()是从0开始
      var month = date.getMonth(); 
      var year = date.getFullYear();
      var result = 0;
      for (var i = 0; i < month; i++) {
        result += dateArr[i];
      }
      result += day;
      //判断是否闰年
      if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        result += 1;
      }

      return result;
}