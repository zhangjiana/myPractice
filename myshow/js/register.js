$(function(){
	register();
})
function register(){
	$("#submit").bind("click",function(){
		//创建一个对象
		var data={
			status: "register",
			userID: $("#name").val(),
			password: $("#pass1").val()
		}
		var pass2=$("#pass2").val();
		//判断重复输入的密码是否正确
		if(test(data.password,pass2)){
			goAjax(data);
		}else{
			alert("密码不一致");
		}
	})
	error($("#name"));
	error($("#pass1"));
}
//上传到ajax
function goAjax(obj){
	$.get("http://datainfo.duapp.com/shopdata/userinfo.php",obj,function(data){
		var temp = true;
		switch (data){
			case "0":
				alert("重名");
				temp = false;
				break;
			case "1":
				alert("成功");
				temp = true;
				$.cookie("name",null);//先清除cookie
				
				//console.log($.cookie("name"));
				window.location.href="login.html";
				break;
			case "2":
				alert("报错");
				temp = false;
				break;
		}
		//console.log(error($("#name")))
		
//		if(error($("#name")) && error($("#password")) && temp){
//			window.location.href="register.html";			
//		}
	})
}
//判断输入框是否输入内容
function error($obj){
	$obj.bind("blur",function(){
		
		if($obj.val()==""){
			
			$obj.css("border","1px solid red");
			$obj.attr("placeholder","请输入");
		}else{
			$obj.css("border","1px solid #ccc");
			$obj.attr("placeholder","");
		}
	})
}
//判断重复输入的密码是否一致
function test(pas1,pas2){
	var temp=false;
	if(pas1===pas2){
		temp=true;
	}
	return temp;
}
