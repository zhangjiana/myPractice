// JavaScript Document

//Ajax连接服务器
function Ajax(url,fnSucc,fnFail){
	var oAjax=null;
	//创建一个兼容的AJAX对象
	if(window.XMLHttpRequest){
		oAjax=new XMLHttpRequest();//非IE6
	}
	else{
		oAjax=new ActiveXObject('Microsoft.XMLHTTP');//IE6
	}

	//连接服务器
	oAjax.open('get',url,true);

	//发送请求
	oAjax.send();

	//接收服务器返回的信息
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			if(oAjax.status==200){
				//alert(oAjax.responseText)
				fnSucc(oAjax.responseText)
			}
			else{
				alert(oAjax.status)
				fnFail(oAjax.status)
			}
		}
	}
}




//事件对象
function addEvent(obj,type,fn){
	if(obj.addEventListener){
		obj.addEventListener(type,fn,false)
	}
	else if(obj.attachEvent){
		obj.attachEvent('on'+type,fn)
	}
}

function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false)
	}
	else if(obj.detachEvent){
		obj.detachEvent('on'+type,fn)
	}
}
function getTarget(ev){
	if(ev.target)
	{
		return ev.target
	}
	else if(window.event.srcElement)
	{
		return window.event.srcElement
	}

}



//兼容，获取非行内样式
	function getStyle(obj,attr){
		if(obj.currentStyle)	
		{
		 return obj.currentStyle[attr]
		}
		else{
			return getComputedStyle(obj,false)[attr]
		}
	}
	
//求和
	function sum(){
		var add=0;
	for(i=0;i<arguments.length;i++){
		
		add+=arguments[i]
		}
	return add;
	}



//改变行内样式
 function setStyle(){
	
	arguments[0].style[arguments[1]]=arguments[2]	
	
}



//通过class来获取对象
	function getByClass(obj,attr){
		var aAll=obj.getElementsByTagName('*');
		var arr=[];
		for(i=0;i<aAll.length;i++){
			if(aAll[i].className==attr){
				arr.push(aAll[i]);
			}
		}
		return arr;
		}

//验证码
function code(){

	var arr=['a','b','c','d','e','f','g',
		'h','i','j','k','l','m','n',
		'o','p','q','r','s','t','u','v',
		'w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
	var str='';
	str='';
	while(str.length<4){

		var iNum=parseInt(Math.random()*100);
		while(iNum>35){
			iNum=parseInt(Math.random()*100);
		}
		str+=arr[iNum];
	}

	return str.toUpperCase();

}

//tabShow  三级菜单内 的多次循环

	function tabShow(Trd,obj){
		for(j=0;j<Trd.length;j++){

			Trd[j].style.display='none';
		}

		Trd[obj.index].style.display='block';

	}


//获取当地时间
function localtime(){

	var oDate=new Date();
	hour=oDate.getHours();
	minu=oDate.getMinutes();
	sec=oDate.getSeconds();
	str=''+hour+minu+sec;

	return str;
}


//在页面中显示当前时间。页面中需设置div.
function time(obj){

	var oTime=new Date();

	year=oTime.getFullYear();
	month=oTime.getMonth()+1;
	week=oTime.getDay();
	day=oTime.getDate();
	hour=oTime.getHours();
	minute=oTime.getMinutes();
	second=oTime.getSeconds();

	milliseconde=oTime.getMilliseconds();

	// time=oTime.getTime();
	obj.innerHTML=(''+year+'-'+month+'-'+day+' '+toD(hour)+':'+toD(minute)+':'+toD(second))
}

//使时间以两位数输出，与上面的显示当前时间一起使用
function toD(obj){
	if(obj<10){
		return '0'+obj
	}

	else{
		return ''+obj
	}
}

//banner上下滚动
function show(){
	var oUl=document.getElementById('ul1');
	var aLi=oUl.getElementsByTagName('li');
	var iHeight=aLi[0].offsetHeight;

	oUl.innerHTML+=oUl.innerHTML;
	var iSpeed=0;
	setInterval(function(){

		iSpeed-=iHeight;
		startMove(oUl,{top:iSpeed},clear)

	},3000);

	function clear(){

		if(iSpeed==-iHeight*(aLi.length/2)){
			iSpeed=0;
			oUl.style.top=0;
		}



	}
}
/*
//透明度切换
function oPacity(){
	var oUl=document.getElementById('ul');
		var aLi=oUl.getElementsByTagName('li');
		var oBtn=document.getElementById('btn');
		var aImg=oBtn.getElementsByTagName('img');
		//获取对象

			oUl.innerHTML+=oUl.innerHTML;
			//复制UL
		var j=0;//图片轮流替换
		var iIndex=1;//设置层级
		for(i=0;i<aLi.length;i++){
			if(i==j){continue;} //第一张不透明
			aLi[i].style.opacity='0';
			aLi[i].style.filter='alpha(opacity:0)';
			}
		//初始化大图

		aImg[j].style.opacity='1';
		aImg[j].style.filter='alpha{opacity:100}';
		//初始化小图
		
		for(i=0;i<aImg.length;i++){
			aImg[i].index=i;
			aImg[i].onclick=function(){
				j=this.index-1;
				clearInterval(timer);
				show();
				timer=setInterval(show,2000);
				}
			}
			//小图的点击事件
			
		function show(){
			if(j==aLi.length/2){j=0;}
			j++;
			iIndex++;

			for(i=0;i<aImg.length;i++){
				startMove(aImg[i],{opacity:'30'})
				}
				//清透明度
				
			if(j==aLi.length/2){
				startMove(aImg[0],{opacity:'100'})
				}
			else{
				startMove(aImg[j],{opacity:'100'})
				}
				//判断100透明的显示
				
			aLi[j].style.zIndex=iIndex;//显示层级
			
			startMove(aLi[j],{opacity:'100'},hide)
			}
		function hide(){
			for(i=0;i<aLi.length;i++){
				if(i==j){continue;}
				aLi[i].style.opacity='0';
				aLi[i].style.filter='alpha(opacity:0)';
				}
			}//透明换图
			
		timer=setInterval(show,2000)
}

*/

//回到顶部
function backTop(oBtn){
	//var oBtn=document.getElementById('btn');
           var timer;
           var bClose=true;
            var iSpeed;
           window.onscroll=function(){
                   if(!bClose){
                       clearInterval(timer)
                   }
                   bClose=false;
           };
            oBtn.onclick=function(){


                timer=setInterval(function(){
               var a=document.documentElement.scrollTop||document.body.scrollTop;
                	iSpeed=Math.floor(-a/5);
                document.documentElement.scrollTop=iSpeed+a;
                document.body.scrollTop=iSpeed+a;
                    bClose=true;
                        },50);

            }
}


//左右滚动
//设置的Ul 的宽度要大于或等于DIV 的宽度
function Left(oDiv,oUl,aLi,Pre,Next){
		//var oDiv=document.getElementById('div1');
        //var oUl=document.getElementById('ul1');
        //var aLi=oUl.getElementsByTagName('li');
        oUl.innerHTML+=oUl.innerHTML;
        oUl.style.width=aLi[0].offsetWidth*aLi.length+'px';

           // var Pre=document.getElementById('pre');
           // var Next=document.getElementById('next');
            //var aImg=oUl.getElementsByTagName('img');

            Pre.onclick= function () {
                iSpeed=+5;
            }
            Next.onclick=function(){
                iSpeed=-5;
            }


            var iSpeed=-5;
        setInterval(function(){
            if(oDiv.scrollLeft>=oUl.offsetWidth/2)
            {
                oDiv.scrollLeft=0;
            }
            else if(oDiv.scrollLeft<=0){
                oDiv.scrollLeft=oUl.offsetWidth/2;
            }
            oDiv.scrollLeft+=iSpeed;
        },30)
}



//左右切换

//样式 banner设置position :relative;ul设为abslute;
function bannerTab(oUl,aLi,aBtn,Pre,Next){
	
	//var oUl=document.getElementById('ul');
	//var aLi=oUl.getElementsByTagName('li');
	//var oBtn=document.getElementById('btn');
	//var aBtn=oBtn.getElementsByTagName('a');
	
	oUl.innerHTML+=oUl.innerHTML;
	var iWidth=aLi[0].offsetWidth;
	oUl.style.width=(iWidth*aLi.length)+'px';

	var iSpeed=0;
	var j=0;
	//按钮
	for(i=0;i<aBtn.length;i++){
		aBtn[i].index=i;
		aBtn[i].onclick=function(){
			j = this.index-1;
			tab();
			clearInterval(timer);
			timer=setInterval(tab,3000)
			}
		}

	Pre.onclick=function(){
		j=j-2;
		if(j<-1){
			j=aBtn.length-2;
		}
		tab()
		clearInterval(timer);
		timer=setInterval(tab,2000);
	}

	Next.onclick=function(){

		if(j>aBtn.length-2){j=-1}
		clearInterval(timer);
		tab()
		timer=setInterval(tab,2000);

	}

	function tab(){
		
		j++;
	for(i=0;i<aBtn.length;i++){
		aBtn[i].className='page_button'
		}
	if(j==aLi.length/2){
		aBtn[0].className='page_button_checked'
		}
	else{
		aBtn[j].className='page_button_checked'
		}

	iSpeed=-iWidth*j;
	startMove(oUl,{left:iSpeed},clear)

		}
    function clear(){
		if(j == (aLi.length/2)){
			j = 0
			oUl.style.left = 0;
			}
	}
	
	timer=setInterval(tab,3000)
		
	}
	
	
	//





//设置cookie
function setCookie(name,value,iDay){
	var oDate=new Date();
	oDate.setDate(oDate.getDate()+iDay)
	document.cookie=name+'='+value+';expires='+oDate;
}

//获取cookie值
function getCookie(name) {
	var arr = document.cookie.split('; ');
	for (i = 0; i < arr.length; i++) {
		arr2 = arr[i].split('=');
		if (arr2[0] == name) {
			return arr2[1];
		}

	}
	return '';
}

//删除cookie
function removeCookie(name){
	setCookie(name,11,-10)
}




// nav Cover


function Cover(oCover,oNav,AA){
       // var oCover=document.getElementById('cover');
        //var oNav=document.getElementById('nav');
        //var AA=oNav.getElementsByTagName('a');

        for(i=0;i<AA.length;i++){
            AA[i].index=i;
            AA[i].onmouseover= function () {
                    var iSpd=0;
                oCover.style.width=AA[this.index].offsetWidth+'px';
                for(j=0;j<AA.length;j++){
                    if(j<this.index){
                        iSpd+=AA[j].offsetWidth+22;

                    }
                    //AA[j].style.color='#8B8A8A';
                }
                //AA[this.index].style.color='#FFF';
                startMove(oCover,{left:iSpd})
            }



        }


    }


//透明度切换
//样式，给li 定位，设置透明度
function oPacityBtn(oUl,aLi,aBtn){
		//var oUl=document.getElementById('ul');
		//var aLi=oUl.getElementsByTagName('li');
		//var oBtn=document.getElementById('btn');
		//var aImg=oBtn.getElementsByTagName('img');
		//获取对象

			oUl.innerHTML+=oUl.innerHTML;
			//复制UL
		var j=0;//图片轮流替换
		var iIndex=1;//设置层级

		//初始化所有banner，使之透明，除了第一张。
		for(i=0;i<aLi.length;i++){
			if(i==j){continue;} //第一张不透明
			aLi[i].style.opacity='0';
			aLi[i].style.filter='alpha(opacity:0)';
			}
		//初始化大图

		aBtn[j].style.opacity='1';
		aBtn[j].style.filter='alpha{opacity:100}';
		//初始化小图
		
		for(i=0;i<aBtn.length;i++){
			aBtn[i].index=i;
			aBtn[i].onclick=function(){
				j=this.index-1;
				clearInterval(timer);
				show();
				timer=setInterval(show,2000);
				}
			}
			//小图的点击事件
			
		function show(){
			if(j==aLi.length/2){j=0;}
			j++;
			iIndex++;

			for(i=0;i<aBtn.length;i++){
				startMove(aBtn[i],{opacity:'30'})
				}
				//清透明度
				
			if(j==aLi.length/2){
				startMove(aBtn[0],{opacity:'100'})
				}
			else{
				startMove(aBtn[j],{opacity:'100'})
				}
				//判断100透明的显示
				
			aLi[j].style.zIndex=iIndex;//显示层级
			
			startMove(aLi[j],{opacity:'100'},hide)
			}
		function hide(){
			for(i=0;i<aLi.length;i++){
				if(i==j){continue;}
				aLi[i].style.opacity='0';
				aLi[i].style.filter='alpha(opacity:0)';
				}
			}//透明换图
			
		timer=setInterval(show,2000)
}


//banner无按钮的透明度切换
function oPacity(oUl,aLi,ev){
	//var oUl=document.getElementById('ul');
	//var aLi=oUl.getElementsByTagName('li');
	var oEvent=ev||event;
	oUl.innerHTML+=oUl.innerHTML;
	var timer;
	var j=0;
	var Index=1;
	for(i=0;i<aLi.length;i++){
		if(i==j){continue;}
		aLi[i].style.filter='alpha(opacity:0)';
		aLi[i].style.opacity='0';
	}

	function show(){
		if(j==aLi.length/2){j=0;}
		j++;
		Index++;

		aLi[j].style.zIndex=Index;//显示层级

		startMove(aLi[j],{opacity:'100'},hide)
	}
	function hide(){
		for(k=0;k<aLi.length;k++){
			if(k==j){continue;}
			aLi[k].style.opacity='0';
			aLi[k].style.filter='alpha(opacity:0)';
		}
	}//透明换图
	show();
	timer=setInterval(show,2000);
	//鼠标经过Banner时，开始透明度切换
	oEvent.onmouseover=function(){
		clearInterval(timer)
		timer=setInterval(show,2000);
	}
	oEvent.onmouseout=function(){
		clearInterval(timer)

	}

}




//单选





//距离 年  月 日  倒计时
function ShowCountDown(year,month,day,divname)
{

	var now = new Date();
	var endDate = new Date(year, month-1, day);
	var leftTime=endDate.getTime()-now.getTime();
	var leftsecond = parseInt(leftTime/1000);
//var day1=parseInt(leftsecond/(24*60*60*6));
	var day1=Math.floor(leftsecond/(60*60*24));
	var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
	var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
	var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
	var cc = document.getElementById(divname);
	cc.innerHTML = day1+"天"+hour+"小时"+minute+"分"+second+"秒";
}


//剩余时间
function leftTime()
{
	var ts = (new Date(2018, 11, 11, 9, 0, 0)) - (new Date());//计算剩余的毫秒数
	var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
	var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
	var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
	var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
	dd = checkTime(dd);
	hh = checkTime(hh);
	mm = checkTime(mm);
	ss = checkTime(ss);
	document.getElementById("spanTime").innerHTML = dd + "天" + hh + "时" + mm + "分" + ss + "秒";
	setInterval("timer()",1000);
}
function checkTime(i)
{
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}


//隔行变色

function tR_changecolor(table){

	var oSize_table = document.getElementById(table);

	var aSize_table_tr = oSize_table.getElementsByTagName('tr');

	for(var i = 0;i < aSize_table_tr.length; i++){
		if(i % 2 ==0){
			aSize_table_tr[i].style.background = '#ccc';
		}
	}
}



//
