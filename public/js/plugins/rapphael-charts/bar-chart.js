 function barChart() {
        var option ={
             domId:"barChart",
             title:'11',
             unit:'11',

             // 画布大小
             width:800,
             height:150,

             //画布间距
             paddingLeft:30,
             paddingRight:10,
             paddingTop:25,
             paddingBottom:10,

             // 数据
             labels:['1','1','1','1','1','1','1','1','1','1','1','1'],
             data:[1,2,3,4,5,31,2,3,12,3,1,2],

             // 样式
             color:'#555',
         };

        this.init = function(seft_options){
          debugger;
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

            var r = Raphael(option.domId, width, height),
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
              var context = document.getElementById(option.domId).querySelector("svg");

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