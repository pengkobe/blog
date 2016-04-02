/*
author:kobepeng
create at:2016-02-22
ps:将js放在html后面
*/

// 拖拽事件监听，首先要禁用浏览器默认事件
document.addEventListener("dragenter", function(e){  
    dropbox.style.borderColor = 'gray';  
}, false);  
document.addEventListener("dragleave", function(e){  
    dropbox.style.borderColor = 'silver';  
}, false);  
dropbox.addEventListener("dragenter", function(e){  
    dropbox.style.borderColor = 'gray';  
    dropbox.style.backgroundColor = 'white';  
}, false);  
dropbox.addEventListener("dragleave", function(e){  
    dropbox.style.backgroundColor = 'transparent';  
}, false);  
dropbox.addEventListener("dragenter", function(e){  
    e.stopPropagation();  
    e.preventDefault();  
}, false);  
dropbox.addEventListener("dragover", function(e){  
    e.stopPropagation();  
    e.preventDefault();  
}, false);  
dropbox.addEventListener("drop", function(e){  
    e.stopPropagation();  
    e.preventDefault();  
    handleFiles(e.dataTransfer.files);  
    //submit.disabled = false;  
}, false); 


// 处理文件组
function handleFiles(files) {  
    for (var i = 0; i < files.length; i++) {  
        var file = files[i];  
		quickUpload(file);

		if (!file.type.match(/image*/)) {  
		    continue;  
		}  

		// 图片预览   
		var preview = document.getElementById("preview");
		var img = document.createElement("img");  
		img.classList.add("obj");  
		preview.appendChild(img);  
		var reader = new FileReader();  
		reader.onload = (function(aImg) { 
			return function(e) { 
				aImg.src = e.target.result; 
			}; })(img);  
		reader.readAsDataURL(file); 
		return;

		// 以下这段还在测试，自动构建请求体有问题
		var xhr = new XMLHttpRequest();  
		xhr.open('post', '/upload', true);  

		var fileName = file.name;
		var fileSize = 0;
		var fileType = file.type;
		var fileData = file;
		if (file.size > 1024 * 1024){
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + "MB";
		}
		else{
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + "KB";
		}
		
		xhr.upload.addEventListener("progress", function(e) {  
		    if (e.lengthComputable) {  
		        var percentage = Math.round((e.loaded * 100) / e.total);  
		        //img.style.opacity = 1-percentage/100.0;  
				console.log(percentage);
		    }  
		}, false);  
		   
		xhr.upload.addEventListener("load", function(e){  
		       
		}, false); 
		// simulate a file MIME POST request. 
		xhr.setRequestHeader("Content-Type", "multipart/form-data, boundary="+boundary);  
		// 这个方法不安全？
		xhr.setRequestHeader("Content-Length", fileSize);  
		var body = '';  
		var boundary='WebKitFormBoundaryfZdRfbpbA4LcozrE';
		body += "--" + boundary + "\r\n";  
		body += "Content-Disposition: form-data; name=\""
		+dropbox.getAttribute('name')+"\"; filename=\"" + fileName + "\"\r\n";  
		body += "Content-Type: "+fileType+"\r\n\r\n";  
		body += fileData + "\r\n";  
		body += "--" + boundary + "--\r\n";  
	    // 这个方法现在不存在了？
		xhr.sendAsBinary(body); 
	}  
}  


// 构造表单直接上传
function quickUpload(file){
	var fd = new FormData();
	// name value
	fd.append("photos", file);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/upload");

	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	// 不填写时会自动构建请求头，反倒成功了！
	//xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(fd);
}
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		document.getElementById("progressNumber").innerHTML = percentComplete.toString() + "%";
	}
	else {
		document.getElementById("progressNumber").innerHTML = "unable to compute";
	}
}
function uploadComplete(evt) {
	/* This event is raised when the server send back a response */
	alert(evt.target.responseText);
}
function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}
function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}
