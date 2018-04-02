$(function(){
	var index = 0;
	$("section ul li:nth-child(1)").bind("click",function(){
		$(this).siblings().toggle();
		index ++
		console.log(index)
		if(index % 2 == 0){
			$(this).css("background","url(img/myshow-pg3.jpg) no-repeat 89% 1rem");
			$(this).css("background-size","1rem");
		}else{
			$(this).css("background","url(img/btn3.jpg) no-repeat 89% 1rem");
			$(this).css("background-size","1.2rem");
		}
	})
	getAjax();
	
	
	
	$("section .search .goods button").bind("click",function(){
		var txt = $("section .search .goods input").val();
		window.location = "favorate.html?val="+escape(txt);
		//search(txt);
	})
})

//下拉分类进行搜索
function getAjax(){
	$.get("http://datainfo.duapp.com/shopdata/getclass.php",function(data){
	//alert(JSON.parse(data));//转换成json数组
		var ff = JSON.parse(data);
		
			$.each(ff,function(i){
				var $li = $('<li classID="'+ff[i].classID+'" className="'+ff[i].className+'"></li>');
				$li.html(ff[i].className);
				$("section ul").append($li);
				$li.bind("click",function(){
					window.location = "favorate.html?classID="+$(this).attr("classID")+"&className="+escape($(this).attr("className"));
				})
			})	
	})
}









