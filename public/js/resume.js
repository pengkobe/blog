$(function(){
	$(".info-nav").on('click',function(evt){
		if(evt.target.nodeName.toUpperCase()=="LI"){
			var target=$(evt.target);
			target.siblings().removeClass("active");
			target.addClass("active");
			var linkTarget = target.attr("link-target");
			$("#"+linkTarget).siblings().hide();
			$("#"+linkTarget).show();
		}
	});
});