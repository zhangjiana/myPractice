$(function(){
	$("footer figure").click(function(){
		var $index=$(this).index();
		//alert($index)
		var i=$index*parseInt($(this).width());
		$("footer span").animate({left:i},300);
	})

	var num = $.cookie("num");
	$("figure em").html(num);
		
	


})
