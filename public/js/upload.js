/*
author:yipeng
create at:2016-02-22
ps:将js放在html后面
*/

(function () {
	// 拖拽事件监听，首先要禁用浏览器默认事件
	document.addEventListener("dragenter", function (e) {
		dropbox.style.borderColor = 'gray';
	}, false);
	document.addEventListener("dragleave", function (e) {
		dropbox.style.borderColor = 'silver';
	}, false);
	dropbox.addEventListener("dragenter", function (e) {
		dropbox.style.borderColor = 'gray';
		dropbox.style.backgroundColor = 'white';
	}, false);
	dropbox.addEventListener("dragleave", function (e) {
		dropbox.style.backgroundColor = 'transparent';
	}, false);
	dropbox.addEventListener("dragenter", function (e) {
		e.stopPropagation();
		e.preventDefault();
	}, false);
	dropbox.addEventListener("dragover", function (e) {
		e.stopPropagation();
		e.preventDefault();
	}, false);
	dropbox.addEventListener("drop", function (e) {
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
			img.classList.add("img-preview");
			preview.appendChild(img);
			var reader = new FileReader();
			reader.onload = (function (aImg) {
				return function (e) {
					aImg.src = e.target.result;
				};
			})(img);
			reader.readAsDataURL(file);
		}
	}


	// 构造表单直接上传
	function quickUpload(file) {
		var fd = new FormData();
		// name value
		fd.append("photos", file);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/upload");
		xhr.upload.addEventListener("progress", uploadProgress, false);
		xhr.addEventListener("load", uploadComplete, false);
		xhr.addEventListener("error", uploadFailed, false);
		xhr.addEventListener("abort", uploadCanceled, false);
		xhr.send(fd);
	}
	function uploadProgress(evt) {
		if (evt.lengthComputable) {
			var percentComplete = Math.round(evt.loaded * 100 / evt.total);
			document.getElementById("progressNumber").innerHTML = file.name + percentComplete.toString() + "%";
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

}
)()

