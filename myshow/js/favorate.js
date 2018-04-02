/*获取URL参数方法*/
function GetQueryString(name){
	/*定义正则，用于获取相应参数*/
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	 /*字符串截取，获取匹配参数值*/
     var r = window.location.search.substr(1).match(reg);
	 /*返回参数值*/
     if(r!=null)return  unescape(r[2]); return null;
}



$(function(){
    var classID = GetQueryString("classID"),
    className = GetQueryString("className"),
    selectText = GetQueryString("val");
    if(classID){
    	//如果是从下拉分类进入的
    	$("header h1").text(GetQueryString("className"));
    	getList("http://datainfo.duapp.com/shopdata/getGoods.php",'classID', classID)
    }
	if(selectText){
		//如果是手动搜索进入的
    	$("header h1").text(GetQueryString("val"));
    	getList("http://datainfo.duapp.com/shopdata/selectGoodes.php",'selectText', selectText)
    }   
})
//放在外面表示先加载基本结构
getList();
function getList(url,obj1,obj2){
	$.ajax({
		url:url,
		data:obj1+'='+obj2,
		dataType:"jsonp",
		success:function(data){
			//console.log(data.length);
			if(data){
				var $oBox = $("#mylove");
				$oBox.html("");
				for(var i in data){
					//console.log(ff.length)
					if(data[i].discount == 0){
						data[i].discount = 10;
					}
					var $dl = $('<dl goodsID="'+data[i].goodsID+'"></dl>');
					//console.log(data[i].goodsID)
					//console.log(ff[i].goodsListImg);
					$dl.html('<dt><img src="'+data[i].goodsListImg+'"></dt><dd>'+data[i].goodsName+'</dd><dd><span>￥'+data[i].price+'</span><del>￥'+(parseFloat(data[i].price)/parseFloat(data[i].discount*0.1)).toFixed(2)+'</del></dd><dd>'+data[i].discount+'折</dd><input type="image" src="img/btn.jpg"/>');
					$oBox.append($dl);
					$dl.find("dt").bind("click",function(){
						//console.log(data[i].goodsID)
						window.location = "introduce.html?goodsID="+escape($(this).parent().attr("goodsID"));
					})
				}
			}
		}
	});
}
