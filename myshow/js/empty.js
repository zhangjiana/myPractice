$(function(){
	car();

})
//购物车
function car(){
	var ID = $.cookie("name");
	console.log(ID);
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/getCar.php",
		dataType:"jsonp",
		data:{userID:ID},
		success:function(data){
			var ff = eval(data);
			var $oBox = $("section .mylove");
			var index = 0;
			$.each(ff,function(i){
//				if($("section .mylove dl").length>=1){
//					$("section .mylove p").css("display","none");
//					$(".null").css("display","none");	
//				}else{
//					$("section .mylove p").css("display","block");
//					$(".null").css("display","block");
//				}
				index ++;
				if(ff[i].discount == 0){
					ff[i].discount = 10;
				}
				var $dl = $('<dl goodsID="'+ff[i].goodsID+'"></dl>');
				//console.log(ff[i].goodsListImg);
				$dl.html('<dt><img src="'+ff[i].goodsListImg+'"></dt><dd>'+ff[i].goodsName+'</dd><dd>单价：<span>￥'+ff[i].price+'</span></dd><dd>数量：<input type="image" src="img/btn-.jpg"><input type="text" value="'+ff[i].number+'"><input type="image" src="img/btn4.jpg"></dd><em><img src="img/delet.jpg"></em>');
				$oBox.append($dl);
				
				//进入商品详情页面
				//console.log($dl.find("dd").first())
				$dl.find("dd").eq(1).bind("click",function(){
					//alert(999)
					window.location = "introduce.html?goodsID="+escape($(this).parent().attr("goodsID"));
				})
				
				//删除商品
				$dl.find("em").bind("click",function(){
					$(this).parent().remove();
					updata($.cookie("name"),$(this).parent().attr("goodsID"),0);
				})
				
				//购物车商品种类存入cookie
				$.cookie("num",index,{expires:7});
				
				
				//商品增加减少
				$dl.find("input").eq(1).bind("click",function(){
					console.log(888)
					console.log($(this).next().val());
					var j = parseInt($(this).next().val());
					j--;
				})
				$dl.find("input").eq(3).bind("click",function(){
					var j = parseInt($(this).prev().val());
					j++;
				})
			})
			//console.log(index);
		}
	})	
}



//购物车
function updata(userID,goodsID,num){
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/updatecar.php",
		data:{userID:userID,goodsID:goodsID,number:num},
		success:function(data){
			switch (data){
			case "0":
				alert("失败");
				break;
			case "1":
				alert("成功");
				break;
			}
		}
	})
}




