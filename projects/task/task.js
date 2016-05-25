/* author :kobepeng
   contact: http://yipeng.info
   description：这里主要是自己学习原生js的地方。
*/
;
(function (window, undefined) {

    // 标识
    var finishedload = false;
    var lockloading = false;
    var loadCount = 0;
    var hasFilter = false;
    var allContent = '';
    var newestDate;
    // 第一次加载前5天
    var lastdate = new Date();
    lastdate.setDate(lastdate.getDate() - 4);
    // ajax
    var xmlHttpReq = null;

    // 辅助方法
    var helper = {
        init: function () {
            // 初始化ajax
            if (xmlHttpReq == null) {
                this.getAjaxReq();
            }
            this.htmlAppend();
        },
        htmlAppend: function () {
            // 拓展dom实现appendhtml方法
            // 参考:http://www.zhangxinxu.com/wordpress/2013/05/js-dom-basic-useful-method/
            HTMLElement.prototype.appendHTML = function (html, type) {
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
                } else if (type === "insertafter") {
                    // 注意：第二个参数只能为子节点
                    this.parentNode.insertBefore(fragment, this.nextElementSibling);
                } else {
                    this.appendChild(fragment);
                }
                nodes = null;
                fragment = null;
            };
        },
        // 获取滚动条至顶部距离
        getScrollTop: function () {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        // 获取当前可视范围的高度
        getClientHeight: function () {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            } else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
        },
        // 获取文档完整的高度
        getScrollHeight: function () {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        },
        // ajax polyfill
        getAjaxReq: function () {
            if (window.ActiveXObject) {
                xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xmlHttpReq = new XMLHttpRequest();
            }
            return xmlHttpReq;
        },
        // add event polyfill
        addEvent: function (elem, type, handle) {
            if (elem.addEventListener)
                elem.addEventListener(type, handle, false);
            else if (elem.attachEvent)
                elem.attachEvent("on" + type, handle);
        },
        // fire event polyfill
        fireEvent: function (name) {
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
        // 模板引擎
        taskTpl: function (str, data) {
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

                var add = function (line, js) {
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
        },
        // 函数节流
        throttle: function (method, context) {
            clearTimeout(method.tId);
            method.tId = setTimeout(function () {
                method.call(context);
            }, 120);
        },
        // 函数节流方式2,闭包,impress方式
        // 调用方式如:window.onresize = throttle(myFunc, 100);
        // throttle: function(fn, delay) {
        //     var timer = null;
        //     return function() {
        //         var context = this,args = arguments;
        //         clearTimeout(timer);
        //         timer = setTimeout(function() {
        //             fn.apply(context, args);
        //         }, delay);
        //     };
        // }
    }

    // 任务页
    var taskobj = {
        init: function () {
            helper.init();
            this.dayCount();
            this.loadData(1);
            this.bindEvents();
            this.taskFilter();
        },
        loadData: function (tag) {
            if (hasFilter) {
                return;
            }
            var that = this;
            var fullyear;
            var month;
            var day;
            var datestr;
            // || helper.getScrollTop() == 0(使得滚动碰触上边界也能加载)
            if (tag || (helper.getScrollTop() + helper.getClientHeight() == helper.getScrollHeight())) {
                //加载完成后不再请求
                if (!finishedload) {
                    // 锁住后不再请求
                    if (!lockloading) {
                        lockloading = true;
                        document.getElementById('loading_div').style.display = "block";
                        // 2s后解锁
                        setTimeout(function () {
                            lockloading = false;
                            document.getElementById('loading_div').style.display = "none";
                            console.log('lock released!');
                        }, 2000);
                        //设置请求（没有真正打开，true：表示异步
                        xmlHttpReq.open("post", "/task/five", true);
                        xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xmlHttpReq.onreadystatechange = function () {
                            that.ajaxState(xmlHttpReq);
                        };
                        //提交请求
                        fullyear = lastdate.getFullYear();
                        month = lastdate.getMonth() + 1;
                        day = lastdate.getDate();
                        datestr = fullyear + "/" + (month < 10 ? '0' + month : month) + "/" + (day < 10 ? '0' + day : day);
                        console.log('send...');
                        xmlHttpReq.send(encodeURI("lastdate=" + datestr));
                    }
                }
            }
        },
        // 倒计时
        dayCount: function () {
            var begin_date = new Date();
            var end_date = new Date('2016/08/31 23:59');
            var millisecond = end_date.getTime() - begin_date.getTime();
            var days = Math.floor(millisecond / (24 * 3600 * 1000))
            var leftsecond = millisecond % (24 * 3600 * 1000)
            var hours = Math.floor(leftsecond / (3600 * 1000));
            document.getElementById('timer_day').innerHTML = days;
            document.getElementById('timer_Hour').innerHTML = hours;
        },
        bindEvents: function () {
            var title;
            var realTitle;
            var post_form;
            var url;
            var tips_div = document.getElementById('tips_div');
            // 滚动事件
            var that = this;
            var page = document.getElementsByClassName("page")[0];
            var task_ul = document.querySelector("#task_ul");

            window.onscroll = function () {
                // 使用函数节流
                helper.throttle(that.loadData, that);
                // that.loadData();
            }
            // 新增
            post_form = document.getElementById("post_new");
            helper.addEvent(post_form, 'submit', function (e) {
                url = '/task/new';
                var target = e.target;
                xmlHttpReq.open("post", url, true);
                xmlHttpReq.onreadystatechange = function () {
                    if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                        var data = eval("(" + xmlHttpReq.responseText + ")");
                        var task_ul = document.getElementById("task_ul");
                        var topEle = document.querySelectorAll(".title-day")[0];
                        var newest = topEle.innerHTML;
                        var now = new Date();
                        var years = now.getFullYear();
                        var months = now.getMonth() + 1;
                        months = months > 9 ? months : '0' + months;
                        var days = now.getDate();
                        days = days > 9 ? days : '0' + days;
                        var nowStr = years + "-" + months + "-" + days;
                        if (newest == nowStr) {
                            lastDate = nowStr;
                        }
                        var html = helper.taskTpl('task_tpl', data.tasks);
                        if (newest == nowStr) {
                            var topElep = topEle.parentNode;
                            topElep.appendHTML(html, 'insertafter');
                        } else {
                            task_ul.appendHTML(html, 'insert');
                        }

                        tips_div.style.display = "block";
                        if (data.success == true) {
                            tips_div.innerHTML = '新增成功.';
                            target.title.value ="";
                        } else {
                            tips_div.innerHTML = '新增失败.';
                        }
                        setTimeout(function () {
                            tips_div.style.display = "none";
                        }, 2000);
                        return;
                    }
                };
                
                xmlHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlHttpReq.send(encodeURI("title=" + target.title.value + "&isPrivate=" + target.isPrivate.checked));
                e.preventDefault();
            });
            // 添加链接按钮(正则)
            document.getElementById("addLink").onclick = function () {
                var editInput = document.getElementById("editInput");
                editInput.value = editInput.value + '[]()';
            }
            helper.addEvent(task_ul, 'mouseover', function (e) {
                var path = e.path;
                for (var pi = 0; pi < path.length; pi++) {
                    if (path[pi].nodeName && path[pi].nodeName.toLowerCase() == 'li') {
                        var objs = path[pi].childNodes;
                        for (var i = 0; i < objs.length; i++) {
                            if (path[pi] && objs[i].nodeName.toLowerCase() == "a") {
                                objs[i].style.display = "inline-block";
                            }
                        }
                        break;
                    }
                }
            });
            helper.addEvent(task_ul, 'mouseout', function (e) {
                var path = e.path;
                for (var pi = 0; pi < path.length; pi++) {
                    var nodename = path[pi].nodeName;
                    if (nodename && nodename.toLowerCase() == 'li') {
                        var objs = path[pi].childNodes;
                        for (var i = 0; i < objs.length; i++) {
                            if (objs[i].nodeName.toLowerCase() == "a") {
                                objs[i].style.display = "none";
                            }
                        }
                        break;
                    }
                }
            });
            // 事件绑定，实现局部刷新
            page.onclick = function (e) {
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
                    url = '/task/' + id + '/finish';

                    xmlHttpReq.open("get", url, true);
                    xmlHttpReq.onreadystatechange = function () {
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
                            setTimeout(function () {
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
                    url = '/task/' + id + '/recover';

                    xmlHttpReq.open("get", url, true);
                    xmlHttpReq.onreadystatechange = function () {
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
                            setTimeout(function () {
                                tips_div.style.display = "none";
                            }, 2000);
                            return;
                        }
                    };
                    xmlHttpReq.send();
                }
                if (ele.name == 'delete') {
                    var id = ele.getAttribute('titleid');
                    url = '/task/' + id + '/delete';
                    xmlHttpReq.open("get", url, true);
                    xmlHttpReq.onreadystatechange = function () {
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
                            setTimeout(function () {
                                tips_div.style.display = "none";
                            }, 2000);
                            return;
                        }
                    };
                    xmlHttpReq.send();
                }

            };
            // 更新
            document.getElementById("saveEdit").onclick = function (e) {
                title = document.getElementById("editInput").value;
                var edit_title_form = document.getElementById("edit_title_form");
                url = edit_title_form.action;
                var titleid = edit_title_form.name;
                //设置请求（没有真正打开，true：表示异步
                xmlHttpReq.open("post", url, true);
                xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttpReq.onreadystatechange = function () {
                    if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                        var data = eval("(" + xmlHttpReq.responseText + ")");
                        tips_div.style.display = "block";
                        if (data.success == true) {
                            tips_div.innerHTML = '更新成功.';
                            document.getElementById(titleid).setAttribute("realTitle", title);
                            document.getElementById(titleid).innerHTML = data._m_title;
                            document.getElementById(titleid).parentNode.parentNode.className = "";
                            // 设置一点点动画效果
                            setTimeout(function () {
                                document.getElementById(titleid).parentNode.parentNode.className = "htmltransition";
                            }, 20);
                        } else {
                            tips_div.innerHTML = '更新失败.';
                        }
                        document.getElementById("BgDiv").style.display = "none";
                        document.getElementsByClassName("popuplayer")[0].style.display = "none";
                        // 2s后解锁
                        setTimeout(function () {
                            tips_div.style.display = "none";
                        }, 2000);
                        return;
                    }
                };
                xmlHttpReq.send(encodeURI("title=" + title));
            }
            // 取消
            document.getElementById("cancelEdit").onclick = function (e) {
                document.getElementById("BgDiv").style.display = "none";
                document.getElementsByClassName("popuplayer")[0].style.display = "none";
            }
        },
        ajaxState: function (req) {
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
                    setTimeout(function () {
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
        loadlines: function (data) {
            lastDate = '0';
            // 使用模板引擎改装后只需要简单的几行代码
            var html = helper.taskTpl('task_tpl', data);
            document.getElementById("task_ul").appendHTML(html);
        },
        taskFilter: function () {
            var filter_unfinished = document.getElementById("filter_unfinished");
            var filter_all = document.getElementById("filter_all");
            // 任务筛选
            filter_unfinished.onclick = function (e) {
                this.className = "active";
                filter_all.className = "";
                if (!hasFilter) {
                    hasFilter = true;
                } else {
                    return false;
                }
                //设置请求（没有真正打开，true：表示异步
                xmlHttpReq.open("get", '/task/unfinished', true);
                xmlHttpReq.onreadystatechange = function () {
                    if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                        var data = eval(xmlHttpReq.responseText);
                        if (data.length == 0) {
                            document.getElementById('loading_div').style.display = "block";
                            document.getElementById('loading_div').innerHTML = '没有记录.';
                            // 2s后解锁
                            setTimeout(function () {
                                document.getElementById('loading_div').style.display = "none";
                            }, 2000);
                            console.log('finishedload');
                            return;
                        } else {
                            var html = helper.taskTpl('task_tpl', data);
                            allContent = document.getElementById("task_ul").innerHTML;
                            document.getElementById("task_ul").innerHTML = html;
                        }
                    }
                };
                xmlHttpReq.send();
            }

            filter_all.onclick = function (e) {
                this.className = "active";
                filter_unfinished.className = "";
                if (hasFilter) {
                    hasFilter = false;
                    document.getElementById("task_ul").innerHTML = allContent;
                }
            }
        }
    }
    taskobj.init();
})(window, void 0);
