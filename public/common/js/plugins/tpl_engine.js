// 略有改装
// 参考自:http://www.cnblogs.com/hustskyking/p/principle-of-javascript-template.html
; define(function (require, exports, module)
    var barretTpl = function(str, data) {
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
                js? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            }
            while(match = reg.exec(tpl)) {
                add(tpl.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(tpl.substr(cursor, tpl.length - cursor));
            code += 'return r.join("");';
            //debugger;
            return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
        };
    };

    module.exports = barretTpl;

    /* test case
     var tpl = '<% for(var i = 0; i < this.posts.length; i++) {' +¡¡
        'var post = posts[i]; %>' +
        '<% if(!post.expert){ %>' +
            '<span>post is null</span>' +
        '<% } else { %>' +
            '<a href="#"><% post.expert %> at <% post.time %></a>' +
        '<% } %>' +
    '<% } %>';
    barretTpl(tpl, data);
*/
});
