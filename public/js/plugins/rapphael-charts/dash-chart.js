 function dashChart() {
              var option_default ={
                  domId:"dashChart",
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
                              {startAngle:290,endAngle:360,color:'#ff0000'}
                  ],

                  // top
                  top:{
                    label:'',value:'',unit:''
                  },
                  // bottom
                  bottom:{
                    label:'',value:'',unit:''
                  },
                  // left
                  left:{
                    label:'',value:'',unit:''
                  },
                  // right
                  right:{
                    label:'',value:'',unit:''
                  },
                  // other info
                  other:{
                    label:'',value:'',unit:''
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
                  // 属性拷贝
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