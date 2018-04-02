$(function(){
	//var oName = $.cookie("name");
	//$("#login_name").val(oName);
	if($.cookie("pwd")=="null"){//如果没有选择记住密码，那么下次登录密码框为空
		$("#login_password").val();
	}else{
		$("#login_password").val($.cookie("pwd"));
	}
	if($.cookie("name")=="null"){//如果没有选择记住密码，那么下次登录密码框为空
		$("#login_name").val();
	}else{
		$("#login_name").val($.cookie("name"));
	}

	login();
})
function login(){

	$("#login_name").bind("blur",function(){
			error($("#login_name"));
		})
		$("#login_password").bind("blur",function(){
			error($("#login_password"));
		})
	$("#submit").bind("click",function(){
		$.cookie("pwd",null);
		var localdata = {
			status: "login",
			userID: $("#login_name").val(),
			password: $("#login_password").val()
		}
		goAjax(localdata);	
		
	})
}
function goAjax(obj){
	$.get("http://datainfo.duapp.com/shopdata/userinfo.php",obj,function(data){
		var temp = true;
		switch (data){
			case "0":
				alert("用户名不存在");
				temp = false;
				break;
			case "2":
				alert("用户名密码不符");
				temp = false;
				break;
		}
		if(temp){
			//console.log(JSON.parse(data));
		}
		//console.log(error($("#login_name")));
		if(error($("#login_name")) && error($("#login_password")) && temp){
			//console.log(obj.userID)
			//window.location.href="myshow.html";	
			if($("#check").is(":checked")){ //判断复选框是否选中
				//先清除cookie
				$.cookie("pwd",obj.password,{expires:7});//存入cookie,第一个参数为自定义这条cookie的名字,第二个参数为存入的内容,第三个参数为在浏览器存储的时间
				$.cookie("name",obj.userID,{expires:7});//存入cookie,第一个参数为自定义这条cookie的名字,第二个参数为存入的内容,第三个参数为在浏览器存储的时间......当不设置时间时，cookie存入的是运行内存，当设置时间时存入的是本机硬盘
				console.log($.cookie("pwd"));
				
			}
			window.location = "myshow.html?userID="+escape(obj.userID);
			
		}
	})
}
function error($obj){
	if($obj.val()==""){
		//console.log(44)
		$obj.css("border","1px solid #E43669");
		$obj.attr("placeholder","请输入");
		return false;
	}else{
		$obj.css("border","1px solid #ccc");
		$obj.attr("placeholder","");
		return true;
	}
}

