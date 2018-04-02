$(function(){
	$("#start").bind("click",function(){
		$("#box1").css("display","none");
		$("#box2").css("display","block");
	})
	$("#list1").bind("click",function(){
		$("#box2").css({"display":"none"})
		$("#box3").css({"display":"box"})
		//初始化
		initial()
		box3()
	})
	$("#list2").bind("click",function(){
		$("#box2").css({"display":"none"})
		$("#box4").css({"display":"box"})
		//初始化
		initial()
		box4()
	})
	$("#list3").bind("click",function(){
		$("#box2").css({"display":"none"})
		$("#box5").css({"display":"box"})
		//初始化
		initial()
		box5()
	})

})
function box3(){
	//判断出现执行
	if($("#box3").css("display")!=="none"){
		var j=1,
			timer=null;
		var i=0,
			ten=0,
			one=0;
		clearInterval(timer);
		//321倒计时
		timer=setInterval(function(){
			j++
			$(".lastTime").attr("src","img/0"+j+".png")
			if(j>3){
				clearInterval(timer)
				exchange()
				boyRun()
			}
		},1000)
	}
}
function boyRun(){//到终点不换图片
	i=0;
	console.log(i)
	//人物点击一下前进一米
	$("#box3").bind("touchstart",function(){
		
	})
	$("#box3").bind("touchend",function(){
		i++
		//判断停止，当跑够100米时就停止
		if(i>=96){
			$("#box3 .run1").attr("src","img/24.png").css({"width":"30%","left":"35%","bottom":"30%"})
			$("#box3 .again").css("display","block").animate({"bottom":"3rem"})
			$("#box3 .again").bind("click",function(){
				$("#box3").css({"display":"none"})
				$("#box2").css({"display":"box"})
			})
			$("#box3").unbind("touchstart")
			$("#box3").unbind("touchend")
			return false;
		}
		//地图前进
		$(".main ul").css({"height":"200%","top":"-100%"})
		$(".main ul").stop().animate({"top":"-85%"})
		//人物在跑
			if($("#box3 .run1").attr("src")=="img/20.png"){
				$("#box3 .run1").attr("src","img/21.png")
			}else if($("#box3 .run1").attr("src")=="img/21.png"){
				$("#box3 .run1").attr("src","img/20.png")
			}
		
			ten=parseInt(i/10);
			one=parseInt(i%10);
		//距离的显示
		if(i<=parseInt((ten+1)+"0")&&i>ten){
				//终点出现
				if(i>="90"){
					$(".end").css("display","block")
					$(".end").stop(true,true).animate({"top":one+"0%"})
				}
			
			if(one=="0"){
				$("#distance").stop(true,true).animate({"top":"105%"},function(){
					$(this).css("top","-5%")
					
			$("#distance").text(parseInt((ten+1)+"0")+"m")
				})
			}else{
				$("#distance").stop(true,true).animate({"top":one+"0%"})
			}
		}
		
	})
	
}

function box4(){
	//判断出现执行
	if($("#box4").css("display")!=="none"){
		$("#box4").unbind("click")
		var i=1,
			timer=null,
			timer2=null,
			timer3=null;
			jump=0,
			clear=true;
		clearInterval(timer);
		//321倒计时
		timer=setInterval(function(){
			$("#top2").css("bottom","5%").animate({"bottom":"20%"},1000,function(){
				$(this).css("bottom","5%")
			})
			jump=0;
			i++
			$(".lastTime").attr("src","img/0"+i+".png")
			if(i>3){
				clearInterval(timer)
				exchange()
				autoRun()
				boyJump()
				hurdles()
				trackAutoMove()
			}
		},1000)
	}
}

//上划跳跃
function boyJump(){
	var startY=0,
		moveY=0,
		tmout=null;
	$("#box4").bind("touchstart",function(e){
		//鼠标开始位置
		startY=e.originalEvent.targetTouches[0].pageY
		
		$(this).bind("touchmove",function(e){
			//鼠标移动距离，动态改变
			e.preventDefault();
			moveY=e.originalEvent.targetTouches[0].pageY-startY
		})
	})
	$("#box4").bind("touchend",function(){
		if(moveY<-100){
			//关小人
			clearInterval(timer2)
				jump=1;
	            $("#box4 .run1").attr("src","img/22.png")
				$("#box4 .run1").css({"width":"30%","left":"35%"})
				//也就是跨栏移动到下边的时候，jump=0；
				clearInterval(tmout)
				tmout=setTimeout(function(){
					$("#box4 .run1").attr("src","img/20.png")
					$("#box4 .run1").css({"width":"20%","left":"40%"})
					autoRun()
					jump=0;
			},500)
		}
		moveY=0;
	})
}
	

//跨栏
function hurdles(){
	var ti=60;
	timer3=setInterval(function(){
		//ti是障碍物出来的时间，不断增大，到2s为止；
		ti--
		if(ti<=20){
			ti=20
		}
		
		$("#hurdles").css({"display":"block"}).animate({"top":"100%"},4000,function(){
			$(this).css({"top":"-10%","display":"none"})
			})
		
		stop("2500")
	},ti+"00")
}
//停止函数
function stop(times){
	setTimeout(function(){
		if(jump=="0"){
			//关小人和障碍物
			clearInterval(timer3)
			clearInterval(timer2)
			//解绑事件
			$("#box4").unbind("touchstart");
			$("#box4").unbind("touchmove");
			$("#box4").unbind("touchend");
			$("#box4 .run1").attr("src","img/24.png").css({"width":"30%","left":"35%","bottom":"30%"})
			$("#box4 .again").css("display","block").animate({"bottom":"3rem"})
			$("#box4 .again").bind("click",function(){
				$("#box4").css({"display":"none"})
				$("#box2").css({"display":"box"})
			})
			clear=false;
			trackAutoMove()
			return false;
		}
	},times)
}


function box5(){
	
	//判断出现执行
	if($("#box5").css("display")!=="none"){
		var j=1,
			timer=null,
			timer2=null,
			clear=true;
		clearInterval(timer);
		//321倒计时
		timer=setInterval(function(){
			j++
			$(".lastTime").attr("src","img/0"+j+".png")
			if(j>3){
				clearInterval(timer)
				exchange()
				autoRun()
				
				boyTurn()
				random()
				trackAutoMove()	
			}
		},1000)
	}
}

//左右变相
function boyTurn(){
	
	var startX=0,
		moveX=0,
		leftPer=40;
	$("#box5").bind("touchstart",function(e){
		//鼠标开始位置
		startX=e.originalEvent.targetTouches[0].pageX
		
		$(this).bind("touchmove",function(e){
			e.preventDefault();
			//鼠标移动距离，动态改变
			moveX=e.originalEvent.targetTouches[0].pageX-startX
		})
	})
	$("#box5").bind("touchend",function(){
		if(moveX<-100){//向左
			leftPer=leftPer-30;
			if(leftPer<=10){
				leftPer=10
			}
		}else if(moveX>100){//向右
			leftPer=leftPer+30;
			if(leftPer>=70){
				leftPer=70
			}
		}
		$("#box5 .run1").stop().animate({"left":leftPer+"%"});
		moveX=0;
	})

	
}

//随机改变障碍物
function random(){
	var pic=0,
	    per=32,
	    num1=0,
	    num2=0,
		ranTimer=null,
		ran2Timer=null;
		
	clear=true;
	//第二个障碍物
	clearInterval(ran2Timer)
	ran2Timer=setInterval(function(){
		num2=Math.floor(Math.random()*3)
		pic=Math.ceil(Math.random()*3)
		$("#water2").attr("src","img/3"+pic+".png").css({"left":35*num2+"%"})
		$("#water2").animate({"top":"100%"},3000,function(){
			$(this).css("top","-15%");
		})
		ifCrash(ranTimer,ran2Timer)
		//console.log("ran2Timer")
	},16000)
	//第一个障碍物
	clearInterval(ranTimer)
	ranTimer=setInterval(function(){
		num1=Math.floor(Math.random()*3)
		//如果num1==num2则num1重新取值，即两个障碍物不能在同一跑道
		switch(num1){
			case num2:
				num1=Math.floor(Math.random()*3);
			break;
		}
		console.log(num1+":"+num2)
		pic=Math.ceil(Math.random()*3)
		$("#water").attr("src","img/3"+pic+".png").css({"left":35*num1+"%"})
		$("#water").animate({"top":"100%"},3000,function(){
			$(this).css("top","-15%")
		})
		ifCrash(ranTimer,ran2Timer)
		//console.log("ranTimer")
	},4000)
}
function ifCrash(ranTimer,ran2Timer){
	var judgeTimer=null,
		runTop=0,
		runLeft=0,
		waterTop=0,
		waterLeft=0,
		water2Top=0,
		water2Left=0,
		runWidth=$("#box5 .run1").width(),
		runHeight=$("#box5 .run1").height();
	clearInterval(judgeTimer)
	judgeTimer=setInterval(function(){
		runBottom=$("#box5 .run1").offset().top+runHeight,
		runLeft=$("#box5 .run1").offset().left,
		waterTop=$("#water").offset().top,
		waterLeft=$("#water").offset().left,
		water2Top=$("#water2").offset().top,
		water2Left=$("#water2").offset().left;
		//console.log(waterTop-runBottom)
		if(Math.abs(runLeft-waterLeft)<50&&Math.abs(runBottom-waterTop)<runHeight/2 && waterTop-runBottom<0)
		{
			clearInterval(judgeTimer)
			clearInterval(ranTimer)
			clearInterval(ran2Timer)
			stop2()
		}else if(Math.abs(runLeft-water2Left)<50&&Math.abs(runBottom-water2Top)<runHeight/2 && waterTop-runBottom<0)
		{
			clearInterval(judgeTimer)
			clearInterval(ranTimer)
			clearInterval(ran2Timer)
			stop2()
		}
		
	},100)
}
//停止函数
function stop2(){

	clearInterval(timer2)
	//解绑事件
	$("#box5").unbind("touchstart");
	$("#box5").unbind("touchmove");
	$("#box5").unbind("touchend");
	$("#box5 .run1").attr("src","img/24.png").css({"width":"30%","left":"35%","bottom":"30%"})
	$("#box5 .again").css("display","block").animate({"bottom":"3rem"})
	$("#box5 .again").bind("click",function(){
		$("#box5").css({"display":"none"})
		$("#box2").css({"display":"box"})
	})
	clear=false;
	trackAutoMove()
	return false;
}
//倒计时结束后小人出来，游戏正式开始
function exchange(){
	$(".lastTime").css("display","none").attr("src","img/01.png");
	$(".ready").css("display","none");
	$(".loading1").css({"display":"none"})
	$(".run1").attr("src","img/20.png").css("display","block")
	$("#left1").css("display","none");
	$("#right1").css("display","none");
	$("#left2").css("display","none");
	$("#right2").css("display","none");
	$("#tab").css({"display":"none"});
	$("#top1").css({"display":"none"})
	$("#top2").css({"display":"none"})
}
//游戏初始化
function initial(){
	$(".lastTime").css("display","block");
	$(".ready").css("display","block");
	$(".loading1").css({"display":"block"})
	$(".run1").css({"display":"none","width":"20%","left":"40%","bottom":"15%"}).attr("src","img/9.png")
	$(".again").css("display","none")
	$(".end").css({"display":"none","top":"-10%"})
	$("#distance").css({"top":"-10%"})
	$("#left1").css("display","block");
	$("#right1").css("display","block");
	$("#left2").css("display","block");
	$("#right2").css("display","block");
	$("#tab").css({"display":"block"});
	$("#top1").css({"display":"block"})
	$("#top2").css({"display":"block"})
}
//跑道自动后移
function trackAutoMove(){
	if(clear){
		$(".main ul").css({"height":"200%","top":"-100%"})
		$(".main ul").stop().animate({"top":"-1%"},4000,"linear",function(){
			$(this).css("top","-100%")
			trackAutoMove()
		})
	}else{
		$(".main ul").css({"height":"200%","top":"0"}).stop(true,true)
		return false;
	}

}
//小人自动跑
function autoRun(){
	var i=0;
	timer2=setInterval(function(){
			if(i==0){
				$(".run1").attr("src","img/21.png")
				i=1
			}else if(i==1){
				$(".run1").attr("src","img/20.png")
				i=0
			}
			
		},100)
}


