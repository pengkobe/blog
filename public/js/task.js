/* author :kobepeng
   contact: www.kobepeng.com
*/
;(function(window,undefined){

	// 标识
    var finishedload = false;
    var lockloading=false;
    var loadCount=0;

    // 一次加载10天
    var lastdate = new Date();
    lastdate.setDate(lastdate.getDate()-10);

    // ajax
    var xmlHttpReq = null; 

    // 辅助方法
    var helper={
        init:function(){
            // 初始化ajax
            if(xmlHttpReq==null){
                this.getAjaxReq();
            }
            this.htmlAppend();
        },
        htmlAppend:function(){
			// 拓展dom实现appendhtml方法,参考:http://www.zhangxinxu.com/wordpress/2013/05/js-dom-basic-useful-method/
            HTMLElement.prototype.appendHTML = function(html) {
                var divTemp = document.createElement("div"), nodes = null
                    , fragment = document.createDocumentFragment();
                divTemp.innerHTML = html;
                nodes = divTemp.childNodes;
                for (var i=0, length=nodes.length; i<length; i+=1) {
                   fragment.appendChild(nodes[i].cloneNode(true));
                }
                this.appendChild(fragment);
                nodes = null;
                fragment = null;
            };
        },
       // 获取滚动条至顶部距离
       getScrollTop:function() { 
          var scrollTop = 0; 
          if (document.documentElement && document.documentElement.scrollTop) { 
            scrollTop = document.documentElement.scrollTop; 
          } 
          else if (document.body) { 
            scrollTop = document.body.scrollTop; 
          } 
          return scrollTop; 
       },

      // 获取当前可视范围的高度 
       getClientHeight:function() { 
          var clientHeight = 0; 
          if (document.body.clientHeight && document.documentElement.clientHeight) { 
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
          } 
          else { 
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
          } 
          return clientHeight; 
        },

      // 获取文档完整的高度 
       getScrollHeight:function() { 
          return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
       },

       getAjaxReq:function(){
            if (window.ActiveXObject) { 
              xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP"); 
            } 
            else if (window.XMLHttpRequest) { 
              xmlHttpReq = new XMLHttpRequest(); 
            } 
            return xmlHttpReq;
        }
    }

    // 任务页
	var taskobj={
		init:function(){
			helper.init();
			this.loadData();
			this.bindEvents();
		},
		loadData:function(){
			var that = this;
			if ((helper.getScrollTop() + helper.getClientHeight() == helper.getScrollHeight()) || helper.getScrollTop()==0){ 
	        //加载完成后不再请求
	        if(!finishedload){
	            // 锁住后不再请求
	            if(!lockloading){
	                 lockloading=true;
	                 document.getElementById('loading_div').style.display="block";
	                 // 2s后解锁
	                 setTimeout(function(){
	                    lockloading=false;
	                    document.getElementById('loading_div').style.display="none";
	                    console.log('lock released!');
	                 },2000);
	                  //设置请求（没有真正打开，true：表示异步 
	                 xmlHttpReq.open("post", "/task/five", true); 
	                 xmlHttpReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
	                 xmlHttpReq.onreadystatechange = function () { 
	                   that.ajaxState(xmlHttpReq); 
	                 }; 
	                 //提交请求 
	                 var fullyear = lastdate.getFullYear();
	                 var month =  lastdate.getMonth() +1;
	                 var day =  lastdate.getDate();
	                 var datestr= fullyear+ "/" + (month< 10 ? '0' + month: month) + "/" + (day< 10 ? '0' + day : day);
	                 console.log('send...');
	                 xmlHttpReq.send(encodeURI("lastdate="+datestr)); 
	                 }
	             }
	        } 
		},
		bindEvents:function(){
			var title;
			var realTitle;
			// 滚动事件
			var that = this;
		    window.onscroll = function () { 
		         that.loadData();
		    }

		    // 添加链接按钮
		    document.getElementById("addLink").onclick=function(){
		          var editInput= document.getElementById("editInput");
		          editInput.value= editInput.value + '<a href="" target="_blank"></a>'; 
		     }

		    // 事件绑定，实现局部刷新
		    document.getElementsByClassName("page")[0].onclick=function(e){
		        var ele=e.srcElement;
		        var tips_div = document.getElementById('tips_div');
		        if(ele.name == 'edit'){
		            var id = ele.getAttribute('titleid');
					// realTtitle
		            title = document.getElementById(id).getAttribute("realTitle");
		            var edit_title_form = document.getElementById("edit_title_form");
		            var BgDiv = document.getElementById("BgDiv");
		            edit_title_form.action='/task/'+id+'/edit';
		            edit_title_form.name= id;
		            document.getElementById("editInput").value=title;
		            BgDiv.style.display="block";
		            BgDiv.style.height=document.body.scrollHeight;
		            document.getElementsByClassName("popuplayer")[0].style.display="block";
		        }

		         if(ele.name == 'finish'){
		            var id = ele.getAttribute('titleid');
		            title = document.getElementById(id).innerHTML;
					realTitle = document.getElementById(id).getAttribute("realTitle");
		            var url =  '/task/'+id+'/finish';
		           
		            xmlHttpReq.open("get", url, true); 
		            xmlHttpReq.onreadystatechange = function () { 
		                if(xmlHttpReq.readyState==4 && xmlHttpReq.status==200){
		                   var data =eval("("+xmlHttpReq.responseText+")");
		                   tips_div.style.display="block";
		                   if(data.success == true){
		                          tips_div.innerHTML='已修改为完成.';
		                          // 替换节点
		                          var pNode = document.createElement('del');
		                          pNode.id=id;
		                         // var tNode = document.createTextNode(title);
		                          //pNode.appendChild(tNode);
								  pNode.appendHTML(title);
								  pNode.setAttribute("realTitle",realTitle);
		                          var reNode = document.getElementById(id);
		                          reNode.parentNode.replaceChild(pNode, reNode);
		                          // 链接切换
		                          ele.name='recover';
		                          ele.innerHTML='恢复';
		                   }
		                   else{
		                        tips_div.innerHTML='修改为完成失败.';
		                   }
		                    setTimeout(function(){
		                       tips_div.style.display="none";
		                    },2000);
		                   return;
		                }
		            }; 
		            xmlHttpReq.send(); 
		        }

		        if(ele.name == 'recover'){
		            var id = ele.getAttribute('titleid');

		            title = document.getElementById(id).innerHTML;
					realTitle = document.getElementById(id).getAttribute("realTitle");
		            var url =  '/task/'+id+'/recover';
		            
		            xmlHttpReq.open("get", url, true); 
		            xmlHttpReq.onreadystatechange = function () { 
		                if(xmlHttpReq.readyState==4 && xmlHttpReq.status==200){
		                   var data =eval("("+xmlHttpReq.responseText+")");
		                   tips_div.style.display="block";
		                   if(data.success == true){
		                          tips_div.innerHTML='已恢复.';
		                          // 替换节点
		                          var pNode = document.createElement('span');
		                          pNode.id=id;
		                          pNode.className="unfinish-title";
		                          //var tNode = document.createTextNode(title);
		                          //pNode.appendChild(tNode);
								  pNode.appendHTML(title);
								  pNode.setAttribute("realTitle",realTitle);
		                          var reNode = document.getElementById(id);
		                          reNode.parentNode.replaceChild(pNode, reNode);
		                          // 链接切换
		                          ele.name='finish';
		                          ele.innerHTML='完成';
		                   }
		                   else{
		                        tips_div.innerHTML='恢复失败.';
		                   }
		                    // 2s后解锁
		                    setTimeout(function(){
		                       tips_div.style.display="none";
		                    },2000);
		                   return;
		                }
		            }; 
		            xmlHttpReq.send(); 
		        }
		    }

		    // 更新
		    document.getElementById("saveEdit").onclick=function(e){
		            title = document.getElementById("editInput").value;
		            var edit_title_form =  document.getElementById("edit_title_form");
		            var url =  edit_title_form.action;
		            var titleid= edit_title_form.name;

		            var tips_div = document.getElementById('tips_div');
		            
		            //设置请求（没有真正打开，true：表示异步 
		            xmlHttpReq.open("post", url, true); 
		            xmlHttpReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
		            xmlHttpReq.onreadystatechange = function () { 
		                if(xmlHttpReq.readyState==4 && xmlHttpReq.status==200){
		                   var data =eval("("+xmlHttpReq.responseText+")");
		                   tips_div.style.display="block";
		                   if(data.success == true){
		                        tips_div.innerHTML='更新成功.';
		                        document.getElementById(titleid).setAttribute("realTitle",title);
								document.getElementById(titleid).innerHTML=data._m_title;
		                   }
		                   else{
		                        tips_div.innerHTML='更新失败.';
		                   }
		                   document.getElementById("BgDiv").style.display="none";
		                   document.getElementsByClassName("popuplayer")[0].style.display="none";
		                    // 2s后解锁
		                    setTimeout(function(){
		                       tips_div.style.display="none";
		                    },2000);
		                   return;
		                }
		            }; 
		            xmlHttpReq.send(encodeURI("title="+title)); 
		    }

		    // 取消
		    document.getElementById("cancelEdit").onclick=function(e){
		            document.getElementById("BgDiv").style.display="none";
		            document.getElementsByClassName("popuplayer")[0].style.display="none";
		    }
		},

		ajaxState:function(req){
			var that =this;
			// 处理返回的结果
	        console.log('readyState:'+req.readyState);
	        if(req.readyState==4 && req.status==200){
	           var data =eval(xmlHttpReq.responseText);
	           if(data.length == 0){
		           	if(loadCount<5){
		           		loadCount++;
		           	}else{
		           		finishedload=true;
		           	}
	                document.getElementById('loading_div').style.display="block";
	                document.getElementById('loading_div').innerHTML='已全部加载完成.';
	                // 2s后解锁
	                setTimeout(function(){
	                    document.getElementById('loading_div').style.display="none";
	                },2000);
	                console.log('finishedload');
	                return;
	           }
	           else{
	                that.loadlines(data);
	                lastdate.setDate(lastdate.getDate()-5);
	           }
	        }
		},
		// 这里使用传统的拼字符串形式构建［待改成模板引擎的方式］
		loadlines:function(data){
			var lastDate = '0'; 
		    var html='';
		       for (var i = 0, len = data.length; i < len; i++) {
		            var task = data[i];
		            var status = task.finished ? 'class="finished"' : '';
		           if (lastDate !== task.createTime.day) { 
		                html+='<li class="title-li"><span class="title-day"> '+task.createTime.day +'</span></li>';
		                lastDate=task.createTime.day; 
		            }

		            html+='<li  '+status+' >';
		               if (!task.finished) { 
		                    html+='<h4><span id="'+task._id+'" class="unfinish-title" realTitle="'+task.title+'">'+  task._m_title  +'</span>';
		                    if (task.isPrivate) { 
		                      html+='<em tabindex="0" class="privatetag">私</em>';
		                    }
		                    html+='</h4>';
		                    html+='<span class="time">创建: '+task.createTime.minute+'  </span>&nbsp;';
		                    html+='<a name="finish"  titleid="'+task._id+'"  href="javascript:void(0);">完成</a>&nbsp';
		               } else { 
		                    html+='<h4><del  id="'+task._id+'" realTitle="'+task.title+'"> '+task._m_title+' </del> ';
		                    if (task.isPrivate) { 
		                      html+='<em tabindex="0" class="privatetag">私</em>';
		                    }
		                    html+='</h4>';
		                    html+='<span class="time">创建: '+task.createTime.minute+ ' </span>&nbsp;';
		                    html+='<span class="time">完成:'+ task.finishTime.minute+'  </span>&nbsp;';
		                    html+='<a  name="recover"  titleid="'+task._id+'"  href="javascript:void(0);">恢复</a>&nbsp';
		               } 
		               html+='<a name="edit" titleid="'+task._id+'" href="javascript:void(0);">修改</a>&nbsp;';
		               var deleteNotice="删除以后不能恢复的，确定？";
		               html+='<a href="/task/'+task._id+'/delete" onclick="return confirm('+deleteNotice+')">删除</a>';
		               html+='</li>';
		      }
		      document.getElementById("task_ul").appendHTML(html);
		}
	}

	taskobj.init();
   

})(window,void 0);    