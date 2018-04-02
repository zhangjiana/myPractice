
$(function(){
	//jsonp数据（跨域，获取大数据）
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		dataType:"jsonp",
		success:function(data){
			//get方法才需要转换，ajax可以直接获取直接用
			var ff = eval(data);
			
			var $oBox = $("#main");
			$oBox.html("");
			//console.log(ff.length)
			$.each(ff,function(i){
				if(ff[i].discount == 0){
					ff[i].discount = 10;
				}
				//console.log(ff[i].goodsID)
				var $dl = $('<dl goodsID="'+ff[i].goodsID+'"></dl>');
				//console.log(ff[i].goodsListImg);
				$dl.html('<dt><img src="'+ff[i].goodsListImg+'"></dt><dd>'+ff[i].goodsName+'</dd><dd><span>￥'+ff[i].price+'</span><del>￥'+(parseFloat(ff[i].price)/parseFloat(ff[i].discount*0.1)).toFixed(2)+'</del></dd><dd>'+ff[i].discount+'折</dd><input type="image" src="img/btn.jpg"/>');
				$oBox.append($dl);
				
				//console.log($dl.find("dd").first())
				
				
				$dl.find("dd").eq(1).bind("click",function(){
					//alert(999)
					window.location = "introduce.html?goodsID="+escape($(this).parent().attr("goodsID"));
				})

				$dl.find("input").bind("click",function(){
					if($.cookie("name")=="null"){
						window.location = "login.html";
					}else{
						updata($.cookie("name"),$(this).parent().attr("goodsID"));
					}
				})
			})
			
		}
	})
})



//保留两位小数.toFixed(2)
//banner滚动
$(function(){
var index = 0;
var predex = 0;
var timer = null;
	$(".banner .list li").eq(0).css("background","green").siblings().css("background","");
	$(".banner .list li").hover(function(){
		index = $(this).index();
		show();
		clearInterval(timer);
		auto();
		predex = index;
	})
	
	auto()
	function auto(){
		timer = setInterval(function(){
			index ++;
		if(index > 2){
			index = 0;
			predex = 2;
		}
		show();
		predex = index;
		},3000)
	}
	
	function show(){
		$(".banner .list li").eq(index).css("background","green").siblings().css("background","");
		if((index == 2 && predex == 0)){
			$(".banner .main li").eq(predex).stop(true).animate({right:-2000});
			$(".banner .main li").eq(index).css("right","2000px").stop(true).animate({right:0});
		}else if((index == 0 && predex == 2)){
			$(".banner .main li").eq(predex).stop(true).animate({right:2000});
			$(".banner .main li").eq(index).css("right","-2000px").stop(true).animate({right:0});
		}
		else if((index > predex)){
			$(".banner .main li").eq(predex).stop(true).animate({right:2000});
			$(".banner .main li").eq(index).css("right","-2000px").stop(true).animate({right:0});
		}else if((index < predex)){
			$(".banner .main li").eq(predex).stop(true).animate({right:-2000});
			$(".banner .main li").eq(index).css("right","2000px").stop(true).animate({right:0});
		}	
	}
})



//加入购物车
$(function(){
	var $i = $("<b></b>");
	$i.css({
		'z-index':99999,
        'position':'absolute',
        'color':'red',
        'display':'none'
	});
	$('body').append($i);
	console.log(999);
    $("#main dl input").bind('click',function(e){
        var x = e.pageX, y = e.pageY;
        $i.text('+1').css({
            'display':'block',
            'top':y,
            'left':x,
            'opacity':1
        }).stop(true,false).animate({
            'top':y,
            'opacity':0
        },800,function(){
            $i.hide();
        });
        e.stopPropagation();
    });
})


//购物车
function updata(userID,goodsID){
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/updatecar.php",
		data:{userID:userID,goodsID:goodsID,number:1},
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





