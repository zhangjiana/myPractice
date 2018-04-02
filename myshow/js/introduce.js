//底部table切换
$(function(){
	$("footer a").click(function(){
		var $index=$(this).index();
		//alert($index)
		var i=$index*parseInt($(this).width());
		$("footer .line").animate({left:i},300);
		$("section").css("display","none");
		$("section").eq($index).css("display","block");
	})
})

//实拍图切换
function scroll(num){
var index = 0;
var predex = 0;
var timer = null;

		$(".banner .list li").eq(0).css("background","#E4366B").siblings().css("background","");

//	$(".banner .list li").hover(function(){
//		index = $(this).index();
//		show();
//		clearInterval(timer);
//		auto();
//		predex = index;
//	})
//	
//	auto();
//	function auto(){
//		timer = setInterval(function(){
//			index ++;
//		if(index > num){
//			index = 0;
//			predex = num;
//		}
//		show();
//		predex = index;
//		},3000)
//	}
	
	
	$(".section-picture").swipe({
		swipe:function(event,direction,distance,duration,fingerCount){//事件，方向，距离（像素为单位）,时间，手指数量
			if(direction == "left"){//当向左滑动手指时令当前页面计数器加一
				index--;
			}
			else if(direction =="right"){//当向右滑动手指时令当前计数器减一
				index++;
			}
			if(index > num){
				index = num;
				predex = num;
			}
			else if(index <0){
				index = 0;
				predex = 0;
			}
			show();
			predex = index;
			//console.log(999)
		}
	})
	
	
	
	function show(){
		$(".banner .list li").eq(index).css("background","#E4366B").siblings().css("background","");
		if((index == num && predex == 0)){
			$(".banner .main li").eq(predex).stop(true).animate({right:-2000});
			$(".banner .main li").eq(index).css("right","2000px").stop(true).animate({right:0});
		}else if((index == 0 && predex == num)){
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
}


/*获取URL参数方法*/
function GetQueryString(name){
	/*定义正则，用于获取相应参数*/
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	 /*字符串截取，获取匹配参数值*/
     var r = window.location.search.substr(1).match(reg);
	 /*返回参数值*/
     if(r!=null)return  unescape(r[2]); return null;
}


//调数据
$(function(){
//	$("header h1").text(GetQueryString("className"));
	//console.log(GetQueryString("goodsID"))
})


getList();

function getList(){
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		data:{goodsID:GetQueryString("goodsID")},
		dataType:"jsonp",
		success:function(data){
			//console.log(data)
			//console.log(data[0].buynumber);//虽然只有一个内容，也是数组类型，必须写成第几个元素形式data[0]
			if(data){
				introduce(data);
				detail(data);
				picture(data);
				
			}
		}
	});
}
function introduce(data){
	//介绍版面
	var $oIntroduce = $(".section-introduce");
	if(data[0].discount == 0){
		data[0].discount = 10;
	}
	var $dl_intro = $('<ul><li><img src="'+data[0].goodsListImg+'"></li><li><span class="top-angle"></span><span class="circle"></span>￥'+data[0].price+''+data[0].goodsName+'</li><li>市场价：<del>￥'+data[0].price+'</del><span class="discount">'+data[0].discount+'折</span><em>'+data[0].buynumber+'人购买</em></li></ul>')
	$oIntroduce.append($dl_intro);
}

function detail(data){
	//详情版面
	var $oDetail = $(".section-detail");
	var $oDetail_p = $('<p>'+ data[0].detail +'</p>');
				
	var $oban = eval(data[0].goodsBenUrl);//字符串转换成数组eval()
	for(var i in $oban){
		var $dl_detail = $('<img src="'+ $oban[i] +'" />');
		$oDetail.append($dl_detail);
	}
	$oDetail.append($oDetail_p);
}

function picture(data){
	var $oPicture = $(".section-picture");
	
	var $aimg = eval(data[0].imgsUrl);
	//console.log($aimg.length)
	var $main = $('<ul class="main"></ul>');
	var $list = $('<ul class="list"></ul>');
	for(var j in $aimg){
		var $main_li = $('<li></li>');
		$main_li.css("background","none");
		$main_li.css("background","url("+ $aimg[j] +") no-repeat center center");
		$main.append($main_li);
		
		var $list_li = $('<li></li>');
		$list.append($list_li);
	}
	$oPicture.append($main);
	$oPicture.append($list);
	
	scroll(($aimg.length-1));
}






