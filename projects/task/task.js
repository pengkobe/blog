/* author :kobepeng
   contact: www.kobepeng.com
   description：你看到的是最原始的拼接字符串方式，代码可读性极差，这里主要是自己学学原生js的场所。
*/
;
(function(window, undefined) {

    // 标识
    var finishedload = false;
    var lockloading = false;
    var loadCount = 0;
    // 一次加载10天
    var lastdate = new Date();
    lastdate.setDate(lastdate.getDate() - 0);
    // ajax
    var xmlHttpReq = null;

    // 辅助方法
    var helper = {
        init: function() {
            // 初始化ajax
            if (xmlHttpReq == null) {
                this.getAjaxReq();
            }
            this.htmlAppend();
        },
        htmlAppend: function() {
            // 拓展dom实现appendhtml方法
            // 参考:http://www.zhangxinxu.com/wordpress/2013/05/js-dom-basic-useful-method/
            HTMLElement.prototype.appendHTML = function(html, type) {
                var divTemp = document.createElement("div"),
                    nodes = null,
                    fragment = document.createDocumentFragment();
                divTemp.innerHTML = html;
                nodes = divTemp.childNodes;
                for (var i = 0, length = nodes.length; i < length; i += 1) {
                    fragment.appendChild(nodes[i].cloneNode(true));
                }
                if (type === "insert") {
                    this.insertBefore(fragment, this.childNodes[0]);
                } else {
                    this.appendChild(fragment);
                }

                nodes = null;
                fragment = null;
            };
        },
        // 获取滚动条至顶部距离
        getScrollTop: function() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        // 获取当前可视范围的高度
        getClientHeight: function() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            } else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
        },
        // 获取文档完整的高度
        getScrollHeight: function() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        },
        getAjaxReq: function() {
            if (window.ActiveXObject) {
                xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xmlHttpReq = new XMLHttpRequest();
            }
            return xmlHttpReq;
        },
        addEvent: function(elem, type, handle) {
            if (elem.addEventListener)
                elem.addEventListener(type, handle, false);
            else if (elem.attachEvent)
                elem.attachEvent("on" + type, handle);
        },
        fireEvent: function(name) {
            // 手动触发事件
            if (post_form.fireEvent) {
                post_form.fireEvent('on' + name);
                post_form.submit();
            } else if (document.createEvent) {
                //DOM2 fire event
                var ev = document.createEvent('HTMLEvents');
                ev.initEvent(name, false, true);
                post_form.dispatchEvent(ev);
            }
        },
        taskTpl: function(str, data) {
            // 获取存储模板的元素
            var element = document.getElementById(str);
            if (element) {
                // 支持元素：textarea|input
                var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
                return tplEngine(html, data);
            } else {
                // 直接是字符串
                return tplEngine(str, data);
            }

            function tplEngine(tpl, data) {
                var reg = /<%([^%>]+)?%>/g,
                    regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
                    code = 'var r=[];\n',
                    cursor = 0;

                var add = function(line, js) {
                    js ? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
                        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                    return add;
                }
                while (match = reg.exec(tpl)) {
                    add(tpl.slice(cursor, match.index))(match[1], true);
                    cursor = match.index + match[0].length;
                }
                add(tpl.substr(cursor, tpl.length - cursor));
                code += 'return r.join("");';
                var tasks = data;
                // 第一个参数指定参数名称,第二个参数为方法体，最后一个参数传数据
                return new Function('tasks', code.replace(/[\r\t\n]/g, ''))(tasks);
            };
        }
    }

    // 任务页
    var taskobj = {
        init: function() {
            helper.init();
            this.loadData();
            this.bindEvents();
        },
        loadData: function() {
            var that = this;
            if ((helper.getScrollTop() + helper.getClientHeight() == helper.getScrollHeight()) || helper.getScrollTop() == 0) {
                //加载完成后不再请求
                if (!finishedload) {
                    // 锁住后不再请求
                    if (!lockloading) {
                        lockloading = true;
                        document.getElementById('loading_div').style.display = "block";
                        // 2s后解锁
                        setTimeout(function() {
                            lockloading = false;
                            document.getElementById('loading_div').style.display = "none";
                            console.log('lock released!');
                        }, 2000);
                        //设置请求（没有真正打开，true：表示异步
                        xmlHttpReq.open("post", "/task/five", true);
                        xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xmlHttpReq.onreadystatechange = function() {
                            that.ajaxState(xmlHttpReq);
                        };
                        //提交请求
                        var fullyear = lastdate.getFullYear();
                        var month = lastdate.getMonth() + 1;
                        var day = lastdate.getDate();
                        var datestr = fullyear + "/" + (month < 10 ? '0' + month : month) + "/" + (day < 10 ? '0' + day : day);
                        console.log('send...');
                        xmlHttpReq.send(encodeURI("lastdate=" + datestr));
                    }
                }
            }
        },
        bindEvents: function() {
            var title;
            var realTitle;
            var post_form;
            var tips_div = document.getElementById('tips_div');
            // 滚动事件
            var that = this;
            window.onscroll = function() {
                that.loadData();
            }

            // 新增
            post_form = document.getElementById("post_new");
            helper.addEvent(post_form, 'submit', function(e) {
                var url = '/task/new';
                xmlHttpReq.open("post", url, true);
                xmlHttpReq.onreadystatechange = function() {
                    if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                        var data = eval("(" + xmlHttpReq.responseText + ")");
                        var task_ul = document.getElementById("task_ul");
                        var html = helper.taskTpl('task_tpl', data.tasks);
                        task_ul.appendHTML(html, 'insert');
                        tips_div.style.display = "block";
                        if (data.success == true) {
                            tips_div.innerHTML = '新增成功.';
                        } else {
                            tips_div.innerHTML = '新增失败.';
                        }
                        setTimeout(function() {
                            tips_div.style.display = "none";
                        }, 2000);
                        return;
                    }
                };
                var target = e.target;
                xmlHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlHttpReq.send(encodeURI("title=" + target.title.value + "&isPrivate=" + target.isPrivate.checked));
                e.preventDefault();
            });

            // 添加链接按钮(正则)
            document.getElementById("addLink").onclick = function() {
                var editInput = document.getElementById("editInput");
                editInput.value = editInput.value + '[]()';
            }

            // 事件绑定，实现局部刷新
            document.getElementsByClassName("page")[0].onclick = function(e) {
                var ele = e.srcElement;
                if (ele.name == 'edit') {
                    var id = ele.getAttribute('titleid');
                    // realTtitle保存在属性中
                    title = document.getElementById(id).getAttribute("realTitle");
                    var edit_title_form = document.getElementById("edit_title_form");
                    var BgDiv = document.getElementById("BgDiv");

                    edit_title_form.action = '/task/' + id + '/edit';
                    edit_title_form.name = id;
                    document.getElementById("editInput").value = title;
                    BgDiv.style.display = "block";
                    BgDiv.style.height = document.body.scrollHeight;
                    document.getElementsByClassName("popuplayer")[0].style.display = "block";
                }
                if (ele.name == 'finish') {
                    var id = ele.getAttribute('titleid');
                    title = document.getElementById(id).innerHTML;
                    realTitle = document.getElementById(id).getAttribute("realTitle");
                    var url = '/task/' + id + '/finish';

                    xmlHttpReq.open("get", url, true);
                    xmlHttpReq.onreadystatechange = function() {
                        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {

                            var data = eval("(" + xmlHttpReq.responseText + ")");
                            tips_div.style.display = "block";
                            if (data.success == true) {
                                tips_div.innerHTML = '已修改为完成.';
                                // 替换节点
                                var pNode = document.createElement('del');
                                pNode.id = id;
                                pNode.appendHTML(title);
                                pNode.setAttribute("realTitle", realTitle);
                                var reNode = document.getElementById(id);
                                reNode.parentNode.replaceChild(pNode, reNode);
                                // 链接切换
                                ele.name = 'recover';
                                ele.innerHTML = '恢复';
                            } else {
                                tips_div.innerHTML = '修改为完成失败.';
                            }
                            setTimeout(function() {
                                tips_div.style.display = "none";
                            }, 2000);
                            return;
                        }
                    };
                    xmlHttpReq.send();
                }
                if (ele.name == 'recover') {
                    var id = ele.getAttribute('titleid');

                    title = document.getElementById(id).innerHTML;
                    realTitle = document.getElementById(id).getAttribute("realTitle");
                    var url = '/task/' + id + '/recover';

                    xmlHttpReq.open("get", url, true);
                    xmlHttpReq.onreadystatechange = function() {
                        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                            var data = eval("(" + xmlHttpReq.responseText + ")");
                            tips_div.style.display = "block";
                            if (data.success == true) {
                                tips_div.innerHTML = '已恢复.';
                                // 替换节点
                                var pNode = document.createElement('span');
                                pNode.id = id;
                                pNode.className = "unfinish-title";
                                pNode.appendHTML(title);
                                pNode.setAttribute("realTitle", realTitle);
                                var reNode = document.getElementById(id);
                                reNode.parentNode.replaceChild(pNode, reNode);
                                // 链接切换
                                ele.name = 'finish';
                                ele.innerHTML = '完成';
                            } else {
                                tips_div.innerHTML = '恢复失败.';
                            }
                            // 2s后解锁
                            setTimeout(function() {
                                tips_div.style.display = "none";
                            }, 2000);
                            return;
                        }
                    };
                    xmlHttpReq.send();
                }
                if (ele.name == 'delete') {

                    var id = ele.getAttribute('titleid');
                    var url = '/task/' + id + '/delete';
                    xmlHttpReq.open("get", url, true);
                    xmlHttpReq.onreadystatechange = function() {

                        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                            var data = eval("(" + xmlHttpReq.responseText + ")");
                            tips_div.style.display = "block";
                            if (data.success == true) {
                                tips_div.innerHTML = '已删除.';
                                ele.parentNode.parentNode.removeChild(ele.parentNode);
                            } else {
                                tips_div.innerHTML = '删除失败.';
                            }
                            // 2s后解锁
                            setTimeout(function() {
                                tips_div.style.display = "none";
                            }, 2000);
                            return;
                        }
                    };
                    xmlHttpReq.send();
                }
            }

            // 更新
            document.getElementById("saveEdit").onclick = function(e) {
                    title = document.getElementById("editInput").value;
                    var edit_title_form = document.getElementById("edit_title_form");
                    var url = edit_title_form.action;
                    var titleid = edit_title_form.name;
                    //设置请求（没有真正打开，true：表示异步
                    xmlHttpReq.open("post", url, true);
                    xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xmlHttpReq.onreadystatechange = function() {
                        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                            var data = eval("(" + xmlHttpReq.responseText + ")");
                            tips_div.style.display = "block";
                            if (data.success == true) {
                                tips_div.innerHTML = '更新成功.';
                                document.getElementById(titleid).setAttribute("realTitle", title);
                                document.getElementById(titleid).innerHTML = data._m_title;
                            } else {
                                tips_div.innerHTML = '更新失败.';
                            }
                            document.getElementById("BgDiv").style.display = "none";
                            document.getElementsByClassName("popuplayer")[0].style.display = "none";
                            // 2s后解锁
                            setTimeout(function() {
                                tips_div.style.display = "none";
                            }, 2000);
                            return;
                        }
                    };
                    xmlHttpReq.send(encodeURI("title=" + title));
                }
                // 取消
            document.getElementById("cancelEdit").onclick = function(e) {
                document.getElementById("BgDiv").style.display = "none";
                document.getElementsByClassName("popuplayer")[0].style.display = "none";
            }
        },
        ajaxState: function(req) {
            var that = this;
            // 处理返回的结果
            console.log('readyState:' + req.readyState);
            if (req.readyState == 4 && req.status == 200) {
                var data = eval(xmlHttpReq.responseText);
                if (data.length == 0) {
                    // 若这5天没有记录，则往前再刷25天看看。
                    if (loadCount < 5) {
                        loadCount++;
                    } else {
                        finishedload = true;
                    }
                    document.getElementById('loading_div').style.display = "block";
                    document.getElementById('loading_div').innerHTML = '已全部加载完成.';
                    // 2s后解锁
                    setTimeout(function() {
                        document.getElementById('loading_div').style.display = "none";
                    }, 2000);
                    console.log('finishedload');
                    return;
                } else {
                    that.loadlines(data);
                    lastdate.setDate(lastdate.getDate() - 5);
                }
            }
        },
        // 这里使用传统的拼字符串形式构建［待改成模板引擎的方式］
        loadlines: function(data) {
            lastDate = '0';
            // 使用模板引擎改装后只需要简单的几行代码
            var html= helper.taskTpl('task_tpl',data);
            document.getElementById("task_ul").appendHTML(html);
            // var html = '';
            // for (var i = 0, len = data.length; i < len; i++) {
            //     var task = data[i];
            //     var status = task.finished ? 'class="finished"' : '';
            //     if (lastDate !== task.createTime.day) {
            //         html += '<li class="title-li"><span class="title-day"> ' + task.createTime.day + '</span></li>';
            //         lastDate = task.createTime.day;
            //     }

            //     html += '<li  ' + status + ' >';
            //     if (!task.finished) {
            //         html += '<h4>';
            //         if (task.isPrivate) {
            //             html += '<em tabindex="0" class="privatetag">私</em>';
            //         }
            //         html += '<span id="' + task._id + '" class="unfinish-title" realTitle="' + task.title + '">' + task._m_title + '</span>';
            //         html += '</h4>';
            //         html += '<span class="time">创建: ' + task.createTime.minute + '  </span>&nbsp;';
            //         html += '<a name="finish"  titleid="' + task._id + '"  href="javascript:void(0);">完成</a>&nbsp';
            //     } else {
            //         html += '<h4>';
            //         if (task.isPrivate) {
            //             html += '<em tabindex="0" class="privatetag">私</em>';
            //         }
            //         html += '<del  id="' + task._id + '" realTitle="' + task.title + '"> ' + task._m_title + ' </del> ';
            //         html += '</h4>';
            //         html += '<span class="time">创建: ' + task.createTime.minute + ' </span>&nbsp;';
            //         html += '<span class="time">完成:' + task.finishTime.minute + '  </span>&nbsp;';
            //         html += '<a  name="recover"  titleid="' + task._id + '"  href="javascript:void(0);">恢复</a>&nbsp';
            //     }
            //     html += '<a name="edit" titleid="' + task._id + '" href="javascript:void(0);">修改</a>&nbsp;';
            //     var deleteNotice = "删除以后不能恢复的，确定？";
            //     html += '<a name="delete" titleid="' + task._id + '" href="javascript:void(0);">删除</a>';
            //     html += '</li>';
            // }
            // document.getElementById("task_ul").appendHTML(html);
        }
    }
    taskobj.init();
})(window, void 0);
