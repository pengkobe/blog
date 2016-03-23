var http = require("https");
var fs = require("fs");

// 搜索页面
var url = "https://movie.douban.com/subject_search?search_text=%E6%9E%81%E7%9B%97%E8%80%85";
var data = "";

var req = http.request(url, function(res){
    res.setEncoding("utf8");
    res.on('data', function(chunk){
        data += chunk;
    });
    res.on('end', function(){
        dealData(data);
    });
}); 

req.on('error', function(e){
    throw e;
});

req.end();
console.log("数据下载中...");


function dealData(data){
	
	var reg = /<a.*?href="(https:\/\/movie.douban.com\/subject.*?)"[^>]*?>\n*?(.*?\n*?.*?<span[^>]*?>.*?)<\/span>\n*?.*?\n*?<\/a>/g;
    var res = [];

	//===test begin===
    // attention plaese if you use with exec
    //console.log(reg.test(data)); 
    //===test end===

	var url='';
    while(match = reg.exec(data)) {
		url=match[1];
    }

	loadData(url);
 }
 
 
 function dealData_c(data){
   console.log("dealData_c");
   
  
    var reg = /<div.*?class="comment-item".*?>[\s\S]*?<div\sclass="comment">[\s\S]*?<h3>[\s\S]*?<span\sclass="votes.*?>(.*?)<\/span>[\s\S]*?<a\shref="(https.*?)".*?>(.*?)<\/a>[\s\S]*?<p\sclass.*?>([.\s\S]*?)<\/p>[\s\S]*?<\/div>/g;
	//===test begin===
    //console.log('comment:'+reg.test(data));
    //===test end===
    var res = [];
    while(match = reg.exec(data)) {
        res.push({
            "votes": match[1],
            "userhref": match[2],
            "username": match[3],
            "title": match[4]
        }); 
    }
    writeFile(res)
 }
 
function loadData(url){
	var req_c = http.request(url, function(res){
			res.setEncoding("utf8");
			res.on('data', function(chunk){
				data += chunk;
			});
			res.on('end', function(){
				dealData_c(data);
			});
		});

	req_c.on('error', function(e){
			throw e;
		});

	req_c.end();
}

function writeFile(data){
    var str = "";
    for(var i = 0, len = data.length; i < len; i++){
        str += data[i].votes +  "\n";
        str += data[i].userhref +  "\n";
        str += data[i].username +  "\n";
        str += data[i].title +  "\n";
        str += "\n";
    }
    fs.writeFile('index_my.md', str, function (err) {                                                                                                 
       if (err) throw err;
       console.log('数据已保存～');
    });
}
