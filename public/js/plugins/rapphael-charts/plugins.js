angular.module('starter.plugins', ['starter.helper'])
.factory('devDash',function(deepCopy){

  function initDash() {
              var option_default ={
                  domId:"holder",
                  defaultAngle:0,

                  // 当前值与最大值
                  label:'',
                  value:'',
                  unit:'',
                  total:'100',

                  // 画布大小
                  width:280,
                  height:280,

                  // 圆心图片
                img:'ionic.png',
                imgWidth:100,
                imgHeight:100,

                //范围数组
                dataArray:[ {startAngle:0,endAngle:90,color:'#555'},
                            {startAngle:90,endAngle:240,color:'#00ff00'},
                            {startAngle:240,endAngle:290,color:'#FFD700'},
                            {startAngle:290,endAngle:360,color:'#ff0000'},
                ],

                // top
                top:{
                  label:'',
                  value:'',
                  unit:''
                },

                // bottom
                bottom:{
                  label:'',
                  value:'',
                  unit:''
                },

                // left
                left:{
                  label:'',
                  value:'',
                  unit:''
                },

                // right
                right:{
                  label:'',
                  value:'',
                  unit:''
                },
                // other info
                other:{
                  label:'',
                  value:'',
                  unit:''
                },

                 // 数值范围
                 range:{start:0,end:0},

                 startAngle:30,
                 endAngle:330,

                // 蓄电池
                batSrc:'',
              };

              var option={};

              this.init = function(seft_options){

                  option={};
                  // 合并属性
                  option = deepCopy.deepCopy(option_default);

                  // 合并属性
                  for(var proName in seft_options){
                      option[proName]=seft_options[proName];
                  }

                  // 属性转换
                  option.range.start = 30+(option.range.start/option.total * 300);
                  option.range.end = 30+(option.range.end/option.total * 300);

                  // 初始化画布
                  var r = Raphael(option.domId, option.width, option.height+27);

                  addCustomerAttribute(r,option);

                  // 外圈
                  r.path().attr({stroke: "#000", "stroke-width": 1}).attr({arc: [10, 12, option.height/2-5]}).attr({transform:'R210'});

                  // 小实心圈
                  var circleColor='#1E90FF';
                  if(option.value !=''){
                    var position = 30+ option.value/option.total * 300;
                    var y_position =  option.height-23;
                    var dataArrLength = option.dataArray.length;
                    // 确定小圈颜色
                    for(var i =0; i<dataArrLength; i++){
                      var dataModel = option.dataArray[i];
                      if(dataModel.startAngle < position && dataModel.endAngle > position){
                        circleColor=dataModel.color;
                      }
                    }

                  // 此方法可增加矩形齿轮长度
                  //if(position>option.range.start && position < option.range.end){
                  //    y_position = option.height-25;
                  //}
                  r.circle(option.width/2, y_position, 4).attr({fill:circleColor, "fill-opacity":.5, "stroke-width": 0,
                      transform: "r"+position+ " "+option.width/2+" "+option.height/2});
                }

                  // 内圈图片
                  var img = r.image(option.img, option.width/2-option.imgWidth/2, option.height/2-option.imgHeight/2, option.imgWidth, option.imgHeight);

                  // 画图
                  render(r,option);

                  // 显示参数值
                  drawText(r,option);
              }

              // 作图
              function render(r,option){
                     var angle = option.defaultAngle;
                     var startAngle = option.startAngle;
                     var endAngle = option.endAngle;

                     var width = option.width;
                     var height = option.height;

                     var range = option.range;

                     var c,t;
                     while (angle < 360) {
                       if (angle <= startAngle || angle > endAngle) {
                           angle += 3;
                       } else {
                         var dataArray = option.dataArray;
                         var dataLength = dataArray.length;

                         for(var i=0; i<dataLength; i++){
                           if(dataArray[i].startAngle<=angle && dataArray[i].endAngle>angle){
                               c=dataArray[i].color;

                               t = "r" + angle + " "+width/2+" "+height/2;
                               if(range.start < angle && range.end > angle){
                                   r.rect(width/2, height-16, 0.4, 10).attr({ stroke: c, fill: c, transform: t, "fill-opacity": .4 ,"stroke-opacity": 0.8 });
                               }else{
                                   r.rect(width/2, height-16, 0.05, 10).attr({ stroke: c, fill: c, transform: t, "fill-opacity": .4,"stroke-opacity": 0.3 });
                               }
                           }
                         }
                         angle += 5;
                       }
                 }
              }

              // 显示参数值
              function drawText(r,option){
                  // === 本身 ===
                  r.text(option.width/2, option.height+4, option.label).attr({font: "12px Fontin-Sans, Arial",
                    fill: "#303030", "text-anchor": "middle"});
                  r.text(option.width/2, option.height-10, parseFloat(option.value).toFixed(1)+option.unit).attr({font: "18px Fontin-Sans, Arial",
                    fill: "#29973a", "text-anchor": "middle"});

                  // === 顶部 ===
                  r.text(option.width/2, 25, option.top.label).attr({font: "12px Fontin-Sans, Arial",
                    fill: "#888", "text-anchor": "middle",opacity:0.4});
                  r.text(option.width/2, 38, option.top.value).attr({font: "14px Fontin-Sans, Arial",
                    fill: "#29973a", "text-anchor": "middle"});
                  // unit
                   shift =  option.top.value.length/2 * 8;
                  r.text(option.width/2 +shift, 38, option.top.unit).attr({fill: "#888", "text-anchor": "start",opacity:0.4});

                  // === 底部 ===
                  // name -(6.5*wordSpace_name)
                  r.text(option.width/2, option.height-30, option.bottom.label).attr({font: "12px Fontin-Sans, Arial",
                    fill: "#888", "text-anchor": "middle",opacity:0.4});
                  // value -wordSpace_value*5
                  r.text(option.width/2-4, option.height-33, option.bottom.value).attr({font: "14px Fontin-Sans, Arial",
                    fill: "#29973a", "text-anchor": "middle"});
                  // unit
                   shift =  option.bottom.value.length/2  * 8;
                  r.text(option.width/2 +shift-4, option.height-33, option.bottom.unit).attr({fill: "#888", "text-anchor": "start",opacity:0.4});
                  if(option.batSrc !=''){
                    r.image(option.batSrc,option.width/2-25, option.height-53, 47,32);
                  }

                  // === 左边 ===
                  // name
                  r.text(option.width/2-option.imgWidth/2+4, option.height/2+10, option.left.label).attr({font: "10px Fontin-Sans, Arial",
                    fill: "#888", "text-anchor": "middle",opacity:0.4});
                  // value
                  r.text(option.width/2-option.imgWidth/2,option.height/2-6, option.left.value).attr({fill: "#29973a", "text-anchor": "middle"});
                  // unit
                  r.text(option.width/2-option.imgWidth/2+12,option.height/2-6, option.left.unit).attr({fill: "#888", "text-anchor": "start",opacity:0.4});

                  // === 右边 ===
                  // name
                  r.text(option.width/2 + option.imgWidth/2-8,  option.height/2+8, option.right.label).attr({font: "12px Fontin-Sans, Arial",
                  fill: "#888", "text-anchor": "start",opacity:0.4});
                  // value
                  r.text(option.width/2 + option.imgWidth/2-8,option.height/2-6, option.right.value).attr({ fill: "#29973a", "text-anchor": "start"});
                  // unit
                  shift =  option.right.value.length * 5;
                  r.text(option.width/2 +option.imgWidth/2+shift,option.height/2-6, option.right.unit).attr({fill: "#888", "text-anchor": "end",opacity:0.4});

                  // === 其他 ===
                  // value
                r.text(option.width/2 ,option.height+ 20, option.other.value).attr({font: "14px Fontin-Sans, Arial",
                  fill: "#888", "text-anchor": "middle",opacity:0.4});
              }

              function addCustomerAttribute (r,option) {
                    r.customAttributes.arc = function (value, total, R) {
                        var alpha = 360 / total * value,
                            a = (90 - alpha) * Math.PI / 180,
                            x = option.width/2 + R * Math.cos(a),
                            y = option.height/2 - R * Math.sin(a),
                            color = "#111",//"hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)"),
                            path;
                        if (total == value) {
                            path = [["M", option.width/2, option.height/2 - R], ["A", R, R, 0, 1, 1, option.width/2, option.height/2 - R]];
                        } else {
                            path = [["M", option.width/2, option.height/2 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
                        }
                        return {path: path, stroke: color};
                    };
              }
      }
      return new initDash();
})

.factory('barChart',function(addEvent,getRelativePosition){

      function barChart() {
        var option ={
             domId:"DevLine",
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
             labels:[],
             data:[],

             // 样式
             color:'#555',
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
                txt = {"font": '11px "Arial"', stroke: "none", fill: "#555",opacity:0.6,"text-anchor": "start"},
                title = {"font": '12px "Arial"', stroke: "none", fill: "#555",opacity:0.6},
                tooltip = {"font": '12px "Arial"', stroke: "none", fill: "#1E90FF",opacity:0.6};

            // label宽度
            var X = (width - paddingLeft - paddingRight) / labels.length,
            // 求最大值
            max = Math.max.apply(Math, data),
            // label高度
            Y = (height - paddingBottom - paddingTop) / data.length;
            // 是否显示标签
            is_label_visible = false,
            // 标题
            r.text(option.width/2, 10, option.title).attr(title),
            bar_label = r.text(option.width/2, 10, "").attr(tooltip).hide(),
            bar_value = r.text(option.width/2, 10, "").attr(tooltip).hide(),
            unit =  r.text(7, 10,option.unit).attr(title),
            // 底部 0
            // t0 = r.text(paddingLeft-14, height-5, 0).attr(txt).toBack(),
             blanket = r.set();
            var barRanges = [];
            var barBackup =[];
            var indexline = r.rect(0, 0, 1, (height - paddingTop-12)).attr({fill: "#1E90FF","stroke-width": 0,opacity:0.6}).hide();

            //X 坐标轴 20
            r.path("M0,"+(height-12)+","+(width-10)+","+(height-12)).attr({ stroke: "#505050", "stroke-width": 0.5 });

            // label && bar
            var labelLen = labels.length;
            for(var i = 0; i < labelLen; i++)
            {
                  var y = height - paddingBottom - data[i]/ max * (height - paddingBottom - paddingTop),
                      x = Math.round(paddingLeft + X * (i+1));

                  var label_y = Math.floor(labelLen/2);
                  var label_x = Math.floor(labelLen/8);
                  // y轴标签
                  if(i % label_y ==0){

                    //ty = r.text(0, paddingTop + i * Y, Math.round(max/data.length*(labelLen-i))).attr(txt).toBack();
                    //r.path('M0,'+(paddingTop + i * Y-6)+','+(width-10)+','+(paddingTop + i * Y-6)).attr({ stroke: "#303030", "stroke-width": 0.5 });
                    var index={i:0};
                    var ddd =  subToZero(max,index);
                    ddd = Math.floor(ddd*10);
                    var medium_value = 0;
                    var medium_position = 0;
                    if(index.i <= 1){
                      medium_value = Math.floor( max/2);;
                    }else{
                      switch(ddd){
                        case 1: medium_value= 0.5* Math.pow(10, index.i-1);  break;
                        case 2:  medium_value= 1* Math.pow(10, index.i-1);  break;
                        case 3:  medium_value= 1.5* Math.pow(10, index.i-1); break;
                        case 4: medium_value= 2* Math.pow(10, index.i-1);  break;
                        case 5: medium_value= 2.5* Math.pow(10, index.i-1);  break;
                        case 6: medium_value= 3* Math.pow(10, index.i-1); break;
                        case 7: medium_value= 3.5* Math.pow(10, index.i-1); break;
                        case 8:medium_value= 4* Math.pow(10, index.i-1);  break;
                        case 9: medium_value= 4.5* Math.pow(10, index.i-1);  break;
                      }
                    }
                    if(i==0){
                      medium_value = medium_value * 2;
                      var realHeight = height - paddingBottom - paddingTop;
                      medium_position=realHeight -(medium_value/max *  realHeight) + paddingTop;
                      ty = r.text(0,(medium_position+6), ''+medium_value).attr(txt).toBack();
                      r.path('M0,'+medium_position+','+(width-10)+','+medium_position).attr({ stroke: "#303030", "stroke-width": 0.5 });
                    }else{
                      var realHeight = height - paddingBottom - paddingTop;
                      medium_position=realHeight -(medium_value/max *  realHeight) + paddingTop;
                      ty = r.text(0,(medium_position+6), ''+medium_value).attr(txt).toBack();
                      r.path('M0,'+medium_position+','+(width-10)+','+medium_position).attr({ stroke: "#303030", "stroke-width": 0.5 });
                    }

                    function subToZero(num,index){
                      if(num <1){
                        return num;
                      }
                      index.i += 1;
                      return subToZero(num/10,index)
                    }
                  }

                  //  x轴标签
                  if(i % label_x ==0 || i==(labelLen - 1)){
                      tx = r.text(x-26, height - 6, labels[i]).attr(txt).toBack();
                  }

                  // 绘制矩形[x,y,width,height]  X-4
                  bar = r.rect(x-18, y-3, (X-4>2?2:X-4), data[i]/ max * (height - paddingBottom - paddingTop)).attr({fill: "#404040","stroke-width": 0});

                  // 缓存柱形图 x-30
                  blanket.push(r.rect(x-18, 20, ((X-4)>0 ? (x-4): 10), height - paddingBottom - paddingTop).attr({stroke: "#fff", fill: "#000", opacity: 0}));
                  barBackup.push(bar);
                  barRanges.push([x-18, y-3, (X-4>2?2:X-4), height - paddingBottom - paddingTop]);

                  // 矩形
                  var rect = blanket[i];
            }
            var tooltip = r.rect(10, 10, 80, 12,1).attr({fill: "#1E90FF", stroke: "#505050", "stroke-width": 0}).hide();

            bindEvents();
            function bindEvents(){
              var context = document.getElementById("DevLine").querySelector("svg");

              addEvent.addEvent(context,'touchstart',function(evt){
                touchEvent(evt);
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
                   // tooltip.show().animate({x: evtPosition.x-80, y:  Y+18});
                    bar_label.attr({text: labels[index],"text-anchor": "end"}).show().animate({x:evtPosition.x, y: Y+16},5).toFront();
                    bar_value.attr({text:data[index],"text-anchor": "end"}).show().animate({x:evtPosition.x, y: Y+26},5).toFront();
                    indexline.show().animate({x:barModel[0]+2, y: Y+22},5);
                  }else{
                    // tooltip.show().animate({x: evtPosition.x-2, y:  Y+18});
                    bar_label.attr({text: labels[index],"text-anchor": "start"}).show().animate({x:evtPosition.x, y: Y+16},5).toFront();
                    bar_value.attr({text:data[index],"text-anchor": "start"}).show().animate({x:evtPosition.x, y: Y+26},5).toFront();
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
    return new barChart();
})

.factory('scatterChart',function(addEvent,getRelativePosition){
    function scatterChart() {
      var option ={
        domId:"DevLine",
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
        color:'#555',
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
                //  bar_label.attr({text:'' ,"text-anchor": "start"}).show().animate({x:evtPosition.x -60, y: Y+24},5).toFront();
                  bar_value.attr({text:data[index],"text-anchor": "end"}).show().animate({x:evtPosition.x, y: Y+24},5).toFront();
                  indexline.show().animate({x:barModel[0]+2, y: Y+22},5);
                }else{
                 // bar_label.attr({text:'' ,"text-anchor": "start"}).show().animate({x:evtPosition.x, y: Y+24},5).toFront();
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
      var month = date.getMonth(); //getMonth()是从0开始
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
      return new scatterChart();
  });
