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
	$("section dl dd span").text(GetQueryString("userID"));
	//console.log($.cookie("pwd"));
})



