/* 
一个不错的纯js自动搜索提示，功能不多，但是够用
参考自: http://www.cnblogs.com/a546558309/p/4754767.html
*/

(function(win) {
    var autocomplete = function () {
        this.Init.apply(this, arguments);
    }
    autocomplete.prototype = {
        Init: function() {
            var args = Array.prototype.slice.call(arguments);
            if (args && args.length > 0) {
                var config = args[0];
                var getType = Object.prototype.toString;
                if (config && getType.call(config) == "[object Object]") {
                    // this.config = config;
                    this.config = config || {
                        id: '', //控件id
                        data: [], //数据
                        textFiled: '', //显示的文字的属性名
                        valueFiled: '', //获取value的属性名
                        style: {}, //显示的下拉div的样式设置
                        url: '', //ajax请求的url
                        paraName:'name',//ajax请求的参数
                        select: function() {}, //选择选项时触发的事件,
                        showdivId: '' //下拉选择区域的id
                    };
                }
            }
        },
        Render: function() {
            var self = this;
            if (self.config) {
                var autoElement = document.getElementById(self.config.id);
                this.autoElement = autoElement;
                if (autoElement) {
                    self.util.AddEvt(this.autoElement, 'input', function() {
                        try {
                            if (autoElement.value) {
                               //ajax请求获取数据的方式
                                if (self.config.url && !self.config.data) {
                                    var paraobj = {};
                                    paraobj[self.config.paraName] = autoElement.value;
                                    self.util.get(self.config.url, paraobj, function (data) {
                                        self.createShowDiv();
										// 是json咱才这么干
                                        self.appendChild(eval('(' + data + ')'));
                                    }, 10000);
                                }
                               ////直接设置对象数组的形式
                                else if
                                    (!self.config.url && self.config.data) {
                                    self.createShowDiv();
                                    self.appendChild(self.config.data);
                                }
 
                            } else {
                                self.closeDiv();
                            }
 
                        } catch (e) {
                            //TODO handle the exception
                            console.log(e);
                        }
                    });
                }
 
            }
        },
        ////创建下拉Div
        createShowDiv: function() {
            ///如果下拉div已存在，删除掉
            var parentNode = this.autoElement.parentNode || this.autoElement.parentElement;
            var childNodes = parentNode.childNodes;
            var showDiv = document.getElementById(this.config.showdivId);
            if (showDiv) {
                parentNode.removeChild(showDiv);
            }
            //创建下拉Div
            var div = document.createElement('div');
            div.id = this.config.showdivId;
            //设置下拉div样式
            var style = this.config.style || {
                width: '200px',
                height: 'auto',
                backgroundColor: '#1c5683',
                cursor: 'pointer',
                display: 'block'
            };
            for (var prop in style) {
                div.style[prop] = style[prop];
            }
            this.showdiv = div;
        },
        ///在下拉div里面追加显示项
        appendChild: function(data) {
            var self = this;
            var data = data;
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                var child = document.createElement('div');
                child.style.width = self.showdiv.style.width;
                child.style.border = '1px';
                child.style.borderStyle = 'solid';
                child.style.borderTopColor = 'white';
                child.setAttribute('key', obj[self.config.valueFiled]);
                child.innerHTML = obj[self.config.textFiled];
                fragment.appendChild(child);
            }
            self.showdiv.appendChild(fragment);
            self.util.insertAfter(self.showdiv, self.autoElement);
 
            //为下拉框添加点击事件
            self.util.AddEvt(self.showdiv, 'click', function(e) {
                var evt = e || window.event;
                var target = evt.srcElement || evt.target;
                var key = target.getAttribute("key");
                var val = target.innerHTML;
                self.autoElement.value = val;
                self.closeDiv();
                self.config.select.call(self, key, val);
            });
        },
        ////关闭下拉框
        closeDiv: function () {
            if (this.showdiv) {
                this.showdiv.style.display = 'none';
            }
 
        }
        ,
        util: {
            ///添加事件
            AddEvt: function(ele, evt, fn) {
                if (document.addEventListener) {
                    ele.addEventListener(evt, fn, false);
                } else if (document.attachEvent) {
                    ele.attachEvent('on' + (evt == "input" ? "propertychange" : evt), fn);
                } else {
                    ele['on' + (evt == "input" ? "propertychange" : evt)] = fn;
                }
            },
            ///在某元素后面追加元素
            insertAfter: function(ele, targetELe) {
                var parentnode = targetELe.parentNode || targetELe.parentElement;
                if (parentnode.lastChild == targetELe) {
                    parentnode.appendChild(ele);
                } else {
                    parentnode.insertBefore(ele, targetELe.nextSibling);
                }
            },
            ///Get请求
            get: function(url, paraobj, fn, timeout) {
                var xhr = null;
                try {
                    if (window.XMLHttpRequest) {
                        xhr = new XMLHttpRequest();
                    } else if (Window.ActiveXObject) {
 
                        xhr = new ActiveXObject("Msxml2.Xmlhttp");
                    }
                } catch (e) {
                    //TODO handle the exception
                    xhr = new ActiveXObject('Microsoft.Xmlhttp');
                }
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        fn.call(this, this.responseText);
 
                    } else {
                        setTimeout(function() {
 
                             xhr.abort();
                        }, timeout);
                    }
                };
                var parastr = '';
                parastr += "?";
                for (var prop in paraobj) {
                    parastr += prop + "=" + paraobj[prop] + "&";
                }
                 xhr.open('get', parastr != "?" ? (url + parastr) : url, true);
                 xhr.send();
 
            }
        }
    }
 
    win.AutoComplete = function (paraobj) {
        new autocomplete(paraobj).Render();
 
    }
 
})(window)